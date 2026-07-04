import { NextRequest, NextResponse } from 'next/server';
import { prepareEnviaAddress } from '@/lib/envia';

const ENVIA_BASE_URL = process.env.ENVIA_ENV === 'production'
  ? 'https://api.envia.com'
  : 'https://api-test.envia.com';

export const dynamic = 'force-dynamic';

// Spanish carriers ordered by popularity
const SPAIN_CARRIERS = ['seur', 'correos', 'gls', 'mrw', 'dhl', 'cbl', 'asm'];

// Services that require carrier-specific configuration (branch codes, etc.)
// and cannot be used without additional setup
const UNSUPPORTED_SERVICES: Record<string, string[]> = {
  seur: ['b2c'],
};

// Try to extract a readable string from any error field (could be string, object, or nested)
function extractError(data: any): string {
  if (!data) return 'Error desconocido';
  if (typeof data === 'string') return data;
  if (typeof data.error === 'string') return data.error;
  if (data.error?.message) return data.error.message;
  if (data.error?.description) return data.error.description;
  if (data.message) return data.message;
  if (data.meta?.description) return data.meta.description;
  if (Array.isArray(data.errors)) {
    return data.errors
      .map((e: any) => (typeof e === 'string' ? e : e.message || e.description || ''))
      .filter(Boolean)
      .join('; ');
  }
  // Last resort: try to JSON.stringify a single error object (not the whole response)
  try {
    if (typeof data.error === 'object') {
      return JSON.stringify(data.error);
    }
  } catch {}
  return `Error de Envia (código ${data.httpStatus || 'desconocido'})`;
}

async function callEnvia(endpoint: string, body: any): Promise<any> {
  const apiKey = process.env.ENVIA_API_KEY;
  if (!apiKey) {
    throw new Error('ENVIA_API_KEY no configurada. Añádela en las variables de entorno de Vercel.');
  }

  const res = await fetch(`${ENVIA_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  let data: any;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    data = { error: text || `HTTP ${res.status}: Respuesta no JSON` };
  }

  if (!res.ok) {
    return { error: extractError(data), httpStatus: res.status };
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const { action, carriers, ...params } = await request.json();

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el campo "action"' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'rate': {
        // Determine which carriers to query
        const carriersToTry = carriers && carriers.length > 0 ? carriers : SPAIN_CARRIERS;

        // Normalize provinces to Envia codes
        const origin = params.origin ? prepareEnviaAddress(params.origin) : params.origin;
        const destination = params.destination ? prepareEnviaAddress(params.destination) : params.destination;

        // Query all carriers in parallel
        const results = await Promise.allSettled(
          (carriersToTry as string[]).map((carrier: string) =>
            callEnvia('/ship/rate/', {
              ...params,
              origin,
              destination,
              shipment: { ...params.shipment, carrier },
            }).then((data: any) => ({ carrier, data }))
          )
        );

        // Collect all successful rates with their carrier info
        const allRates: { carrier: string; rates: any[]; error?: string }[] = [];
        const errors: { carrier: string; error: string }[] = [];

        for (const result of results) {
          if (result.status === 'fulfilled') {
            const { carrier, data } = result.value;
            if (data.error) {
              errors.push({ carrier, error: data.error });
            } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
              // Filter out error objects and services that require carrier-specific config
              // (e.g., SEUR b2c requires origin branch code)
              const blocked = UNSUPPORTED_SERVICES[carrier] || [];
              const validRates = data.data.filter((r: any) =>
                r && typeof r === 'object' && !r.code && !r.error && r.service
                && !blocked.includes(r.service)
              );
              if (validRates.length > 0) {
                allRates.push({ carrier, rates: validRates });
              } else {
                errors.push({ carrier, error: 'Sin tarifas disponibles para este transportista' });
              }
            } else {
              errors.push({ carrier, error: 'Sin tarifas disponibles' });
            }
          } else {
            errors.push({ carrier: 'unknown', error: result.reason?.message || 'Error de conexión' });
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            rates: allRates,
            errors,
          },
        });
      }

      case 'generate': {
        // Normalize provinces to Envia codes
        const origin = params.origin ? prepareEnviaAddress(params.origin) : params.origin;
        const destination = params.destination ? prepareEnviaAddress(params.destination) : params.destination;

        // Generate label with the specific carrier/service selected
        // Envia requires 'settings' with label format and size
        const result = await callEnvia('/ship/generate/', {
          ...params,
          origin,
          destination,
          settings: {
            printFormat: 'PDF',
            printSize: 'STOCK_4X6',
          },
        });

        if (result.error) {
          return NextResponse.json(
            { success: false, error: result.error },
            { status: result.httpStatus || 500 }
          );
        }

        return NextResponse.json({ success: true, data: result });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Acción desconocida: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error en API Envia:', error);
    const errorMsg = error.message || 'Error al comunicar con Envia';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
