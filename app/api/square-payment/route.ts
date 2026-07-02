import { SquareClient, SquareEnvironment } from 'square';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceId, amount, currency } = body;

    if (!sourceId || !amount) {
      return NextResponse.json({ error: 'Faltan datos de pago' }, { status: 400 });
    }

    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const environment = process.env.SQUARE_ENVIRONMENT === 'production'
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Square no está configurado. Configúralo en el panel de administración.' },
        { status: 500 }
      );
    }

    const client = new SquareClient({
      token: accessToken,
      environment,
    });

    const response = await client.payments.create({
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(Math.round(amount * 100)),
        currency: currency || 'EUR',
      },
      acceptPartialAuthorization: false,
      autocomplete: true,
    });

    const payment = response.payment;

    return NextResponse.json({
      success: true,
      payment: {
        id: payment?.id,
        status: payment?.status,
        amount: Number(payment?.amountMoney?.amount) / 100,
        currency: payment?.amountMoney?.currency,
      },
    });
  } catch (error: any) {
    console.error('Square payment error:', error.errors || error.message || error);
    return NextResponse.json(
      { error: error.errors?.[0]?.detail || error.message || 'Error al procesar el pago' },
      { status: 500 }
    );
  }
}
