import { NextRequest, NextResponse } from 'next/server';
import { prepareEnviaAddress } from '@/lib/envia';

const ENVIA_BASE_URL = process.env.ENVIA_ENV === 'production'
  ? 'https://api.envia.com'
  : 'https://api-test.envia.com';

export const dynamic = 'force-dynamic';

// Spanish carriers ordered by popularity
const SPAIN_CARRIERS = ['seur', 'correos', 'gls', 'mrw', 'dhl', 'cbl', 'asm'];

// SEUR branch codes for 'b2c' (branch-to-home) service by origin postal code prefix
// Format: first 2 digits of postal code → SEUR branch code
const SEUR_BRANCH_CODES: Record<string, string> = {
  '01': '01001', // Vitoria
  '02': '02001', // Albacete
  '03': '03001', // Alicante
  '04': '04001', // Almería
  '06': '06001', // Badajoz
  '07': '07001', // Palma
  '08': '08001', // Barcelona
  '09': '09001', // Burgos
  '10': '10001', // Cáceres
  '11': '11001', // Cádiz
  '12': '12001', // Castellón
  '13': '13001', // Ciudad Real
  '14': '14001', // Córdoba
  '15': '15001', // La Coruña
  '16': '16001', // Cuenca
  '17': '17001', // Girona
  '18': '18001', // Granada
  '19': '19001', // Guadalajara
  '20': '20001', // San Sebastián
  '21': '21001', // Huelva
  '22': '22001', // Huesca
  '23': '23001', // Jaén
  '24': '24001', // León
  '25': '25001', // Lleida
  '26': '26001', // Logroño
  '27': '27001', // Lugo
  '28': '28001', // Madrid
  '29': '29001', // Málaga
  '30': '30001', // Murcia
  '31': '31001', // Pamplona
  '32': '32001', // Ourense
  '33': '33001', // Oviedo
  '34': '34001', // Palencia
  '35': '35001', // Las Palmas
  '36': '36001', // Pontevedra
  '37': '37001', // Salamanca
  '38': '38001', // Santa Cruz
  '39': '39001', // Santander
  '40': '40001', // Segovia
  '41': '41001', // Sevilla
  '42': '42001', // Soria
  '43': '43001', // Tarragona
  '44': '44001', // Teruel
  '45': '45001', // Toledo
  '46': '46001', // Valencia
  '47': '47001', // Valladolid
  '48': '48001', // Bilbao
  '49': '49001', // Zamora
  '50': '50001', // Zaragoza
  '51': '51001', // Ceuta
  '52': '52001', // Melilla
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

        // For SEUR 'b2c' (branch-to-home), add the origin branch code
        const shipment = { ...params.shipment };
        if (shipment.carrier === 'seur' && shipment.service === 'b2c' && origin?.postalCode) {
          const prefix = origin.postalCode.slice(0, 2);
          shipment.branchCode = SEUR_BRANCH_CODES[prefix] || origin.postalCode;
        }

        // Generate label with the specific carrier/service selected
        // Envia requires 'settings' with label format and size
        const result = await callEnvia('/ship/generate/', {
          ...params,
          origin,
          destination,
          shipment,
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
