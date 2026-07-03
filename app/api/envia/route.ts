import { NextRequest, NextResponse } from 'next/server';

const ENVIA_BASE_URL = process.env.ENVIA_ENV === 'production'
  ? 'https://api.envia.com'
  : 'https://api-test.envia.com';

export const dynamic = 'force-dynamic';

async function callEnvia(endpoint: string, body: any) {
  const apiKey = process.env.ENVIA_API_KEY;
  if (!apiKey) {
    throw new Error('ENVIA_API_KEY no configurada. Añádela en las variables de entorno.');
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
    throw new Error(data.message || data.error || `Error de Envia (${res.status})`);
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json();

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el campo "action"' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'rate': {
        // Get rates from Envia
        result = await callEnvia('/ship/rate/', params);
        break;
      }
      case 'generate': {
        // Generate shipping label
        result = await callEnvia('/ship/generate/', params);
        break;
      }
      default:
        return NextResponse.json(
          { success: false, error: `Acción desconocida: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error en API Envia:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al comunicar con Envia' },
      { status: 500 }
    );
  }
}
