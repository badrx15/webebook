import { NextRequest, NextResponse } from 'next/server';
import { prepareEnviaAddress } from '@/lib/envia';

const ENVIA_BASE_URL = process.env.ENVIA_ENV === 'production'
  ? 'https://api.envia.com'
  : 'https://api-test.envia.com';

const ENVIA_QUERIES_URL = process.env.ENVIA_ENV === 'production'
  ? 'https://queries.envia.com'
  : 'https://queries-test.envia.com';

export const dynamic = 'force-dynamic';

// Spanish carriers ordered by popularity
const SPAIN_CARRIERS = ['seur', 'correos', 'gls', 'mrw', 'dhl', 'cbl', 'asm'];

// Services that require a branch code (drop-off / branch-to-home)
const BRANCH_SERVICES: Record<string, string[]> = {
  seur: ['b2c'],
};

function shipmentNeedsBranch(shipment: any): boolean {
  if (!shipment?.carrier || !shipment?.service) return false;
  const services = BRANCH_SERVICES[shipment.carrier];
  return !!services && services.includes(shipment.service);
}

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

// Fetch nearest carrier branch/origin for drop-off services (e.g. SEUR b2c)
// Uses Envia Queries API: GET /branches/{carrier}/{country_code}?zipcode=...
// Returns branch_code of the first (closest) branch, or null if none found
async function fetchNearestBranch(carrier: string, country: string, postalCode: string): Promise<string | null> {
  const apiKey = process.env.ENVIA_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `${ENVIA_QUERIES_URL}/branches/${carrier}/${country}?zipcode=${encodeURIComponent(postalCode)}&type=1`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      // Return the branch_code of the first branch (closest match)
      return data.data[0].branch_code || data.data[0].branch_id || null;
    }
    return null;
  } catch {
    return null;
  }
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
              // Filter out error objects (invalid rate items) from Envia
              // Error objects have numeric code (like 400) while valid rates may have a code field too
              const validRates = data.data.filter((r: any) =>
                r && typeof r === 'object' && !(typeof r.code === 'number' && r.code >= 400) && !r.error && r.service
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

        // For drop-off services (e.g. SEUR 'b2c'), find the nearest origin branch
        if (shipmentNeedsBranch(params.shipment) && origin?.postalCode) {
          const branchCode = await fetchNearestBranch(params.shipment.carrier, origin.country, origin.postalCode);
          if (!branchCode) {
            return NextResponse.json({
              success: false,
              error: `No se encontró una sucursal de ${params.shipment.carrier} cercana al CP ${origin.postalCode}. Prueba con otro servicio de envío.`,
            }, { status: 400 });
          }
          origin.branchCode = branchCode;
        }

        // Generate label with the specific carrier/service selected
        // Envia requires 'settings' with label format and size
        const result = await callEnvia('/ship/generate/', {
          ...params,
          origin,
          destination,
          shipment: params.shipment,
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
