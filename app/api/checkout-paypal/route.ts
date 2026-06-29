import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_ENVIRONMENT = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

const PAYPAL_API_URL =
  PAYPAL_ENVIRONMENT === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

/**
 * Get PayPal access token using Client ID + Secret (Basic Auth)
 */
async function getPayPalAccessToken(): Promise<string> {
  const res = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal auth error: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

/**
 * Create a PayPal order and return the approval URL
 */
export async function POST(request: NextRequest) {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    console.error('PayPal credentials missing');
    return NextResponse.json(
      { error: 'Error de configuración del pago PayPal' },
      { status: 500 },
    );
  }

  const origin =
    request.headers.get('origin') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  // Notify admin
  sendTelegramNotification({
    event: 'checkout_start',
    label: '🛒 Alguien inició checkout PayPal',
    details: `Origen: ${origin}`,
  });

  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '0.01',
            },
            description: 'Curso: Cómo vender por WhatsApp sin tienda online',
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              shipping_preference: 'NO_SHIPPING',
              return_url: `${origin}/exito?paypal=success`,
              cancel_url: `${origin}/#precio`,
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPal order error:', JSON.stringify(data));
      sendTelegramNotification({
        event: 'checkout_error',
        label: '❌ Error PayPal al crear orden',
        details: JSON.stringify(data).slice(0, 300),
      });
      return NextResponse.json(
        { error: 'Error al crear el pago en PayPal. Inténtalo de nuevo.' },
        { status: 502 },
      );
    }

    // Extract the approval URL from the response links
    const approveLink = data.links?.find((l: { rel: string }) => l.rel === 'approve');

    if (!approveLink?.href) {
      throw new Error('No approval URL in PayPal response');
    }

    sendTelegramNotification({
      event: 'checkout_success',
      label: '✅ Orden PayPal creada correctamente',
      details: `Order ID: ${data.id}`,
    });

    return NextResponse.json({
      url: approveLink.href,
      orderId: data.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('PayPal checkout error:', message);
    sendTelegramNotification({
      event: 'checkout_error',
      label: '❌ Error inesperado en PayPal',
      details: String(message).slice(0, 300),
    });
    return NextResponse.json(
      { error: 'Error al procesar el pago con PayPal. Inténtalo de nuevo.' },
      { status: 500 },
    );
  }
}
