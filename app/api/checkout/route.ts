import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

const SQUARE_API_URL =
  process.env.SQUARE_ENVIRONMENT === 'sandbox'
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';

export async function POST(request: NextRequest) {
  // Validate credentials
  if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
    console.error('Square credentials are missing in env vars');
    return NextResponse.json(
      { error: 'Error de configuración del pago. Contacta con soporte.' },
      { status: 500 }
    );
  }

  // Derive the correct origin for the redirect URL
  const origin =
    request.headers.get('origin') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://ebook-negocios.vercel.app');

  // Fire-and-forget: notify admin that someone started checkout
  sendTelegramNotification({
    event: 'checkout_start',
    label: '🛒 Alguien ha iniciado el checkout',
    details: `Origen: ${origin}`,
  });

  const idempotencyKey = crypto.randomUUID();

  try {
    const response = await fetch(
      `${SQUARE_API_URL}/v2/online-checkout/payment-links`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Square-Version': '2024-06-20',
        },
        body: JSON.stringify({
          idempotency_key: idempotencyKey,
          order: {
            location_id: SQUARE_LOCATION_ID,
            line_items: [
              {
                name: 'Cómo vender por WhatsApp sin tienda online (Ebook PDF)',
                quantity: '1',
                base_price_money: {
                  amount: 300,
                  currency: 'EUR',
                },
              },
            ],
          },
          checkout_options: {
            redirect_url: `${origin}/exito`,
            ask_for_shipping_address: false,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Square API error:', JSON.stringify(data));

      sendTelegramNotification({
        event: 'checkout_error',
        label: '❌ Error al crear el pago en Square',
        details: String(JSON.stringify(data.errors || data)).slice(0, 300),
      });

      return NextResponse.json(
        { error: 'Error al crear el pago. Inténtalo de nuevo.' },
        { status: 502 }
      );
    }

    sendTelegramNotification({
      event: 'checkout_success',
      label: '✅ Payment Link creado correctamente',
      details: `Order ID: ${data.payment_link?.order_id || 'N/A'}`,
    });

    return NextResponse.json({
      url: data.payment_link?.url,
      orderId: data.payment_link?.order_id,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error desconocido';
    console.error('Square checkout error:', message);

    sendTelegramNotification({
      event: 'checkout_error',
      label: '❌ Error inesperado en checkout',
      details: String(message).slice(0, 300),
    });

    return NextResponse.json(
      { error: 'Error al procesar el pago. Inténtalo de nuevo.' },
      { status: 500 }
    );
  }
}
