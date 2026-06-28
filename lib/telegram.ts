const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

export type EventType =
  | 'page_view'
  | 'cta_click'
  | 'checkout_start'
  | 'checkout_success'
  | 'checkout_error'
  | 'success_page';

interface EventPayload {
  event: EventType;
  label?: string;
  details?: string;
}

export async function sendTelegramNotification(
  payload: EventPayload
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !ADMIN_CHAT_ID) {
    return;
  }

  const emoji: Record<EventType, string> = {
    page_view: '👁️',
    cta_click: '🔴',
    checkout_start: '🛒',
    checkout_success: '✅',
    checkout_error: '❌',
    success_page: '🎉',
  };

  const now = new Date().toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const lines = [
    `${emoji[payload.event]} <b>${payload.label || payload.event}</b>`,
    `<i>${now}</i>`,
  ];

  if (payload.details) {
    lines.push(payload.details);
  }

  const text = lines.join('\n');

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Telegram API error:', res.status, errorBody.slice(0, 300));
    }
  } catch (err) {
    console.error('Failed to send Telegram notification:', err);
  }
}
