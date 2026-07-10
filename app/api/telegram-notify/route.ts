import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, customerName, phone, shippingAddress, items, totalAmount, paymentMethod, notes, createdAt } = body;

    // Validate required fields
    if (!id || !customerName || !phone || !items || totalAmount === undefined) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    await sendTelegramNotification({
      id,
      customerName,
      phone,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod,
      notes: notes || '',
      createdAt,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in telegram-notify API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno' },
      { status: 500 }
    );
  }
}
