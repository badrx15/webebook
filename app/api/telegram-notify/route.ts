import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const order = await request.json();
    if (!order?.id || !order?.customerName || !order?.phone || !order?.items || order.totalAmount === undefined) {
      return NextResponse.json({ success: false, error: 'Faltan campos requeridos' }, { status: 400 });
    }
    await sendTelegramNotification(order);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error enviando pedido a Telegram:', error);
    return NextResponse.json({ success: false, error: error.message || 'Error interno' }, { status: 500 });
  }
}
