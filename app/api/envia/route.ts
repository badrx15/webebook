import { NextRequest, NextResponse } from 'next/server';

const ENVIA_BASE_URL = process.env.ENVIA_ENV === 'production'
  ? 'https://api.envia.com'
  : 'https://api-test.envia.com';

export const dynamic = 'force-dynamic';

// Spanish carriers ordered by popularity
const SPAIN_CARRIERS = ['seur', 'correos', 'gls', 'mrw', 'dhl', 'cbl', 'asm'];

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

  const data = await res.json();

  if (!res.ok) {
    // Extract meaningful error from Envia response
    const errorMsg = data?.message 
      || data?.error 
      || (typeof data === 'string' ? data : null)
      || `Error de Envia (${res.status})`;
    return { error: errorMsg, httpStatus: res.status };
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

        // Query all carriers in parallel
        const results = await Promise.allSettled(
          (carriersToTry as string[]).map((carrier: string) =>
            callEnvia('/ship/rate/', {
              ...params,
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
              allRates.push({ carrier, rates: data.data });
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
        // Generate label with the specific carrier/service selected
        const result = await callEnvia('/ship/generate/', params);

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
    return NextResponse.json(
      { success: false, error: error.message || 'Error al comunicar con Envia' },
      { status: 500 }
    );
  }
}
