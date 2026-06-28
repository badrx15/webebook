import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';
import type { EventType } from '@/lib/telegram';

const validEvents: EventType[] = [
  'page_view',
  'cta_click',
  'checkout_start',
  'checkout_success',
  'checkout_error',
  'success_page',
];

export async function POST(request: NextRequest) {
  let body: { event?: string; label?: string; details?: string } = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400 }
    );
  }

  const { event, label, details } = body;

  if (!event || !validEvents.includes(event as EventType)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid or missing event type' },
      { status: 400 }
    );
  }

  // Fire and forget — don't block the response
  sendTelegramNotification({
    event: event as EventType,
    label,
    details,
  });

  return NextResponse.json({ ok: true });
}
