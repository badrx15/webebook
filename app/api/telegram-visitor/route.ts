import { NextRequest, NextResponse } from 'next/server';
import { escapeMarkdown } from '@/lib/telegram';

// Best-effort cooldown: at least 5 minutes between notifications
// Works within the same serverless instance warm period
let lastNotified = 0;
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutos

export async function POST(req: NextRequest) {
  try {
    const now = Date.now();

    // Cooldown check
    if (now - lastNotified < COOLDOWN_MS) {
      return NextResponse.json({ success: true, skipped: true });
    }
    lastNotified = now;

    const body = await req.json();
    const { page, referrer, userAgent } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.ADMIN_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { success: false, error: 'Telegram not configured' },
        { status: 500 }
      );
    }

    // Parse user agent for device info
    const isMobile = userAgent?.includes('Mobile');
    const device = isMobile ? '📱 Móvil' : '💻 Escritorio';
    const browser = userAgent?.includes('Chrome') ? 'Chrome'
      : userAgent?.includes('Firefox') ? 'Firefox'
      : userAgent?.includes('Safari') ? 'Safari'
      : 'Desconocido';

    const pageName = page?.includes('/checkout') ? '🛒 Página de pago'
      : page === '/' || !page ? '🏠 Página principal'
      : page?.includes('/admin') ? '🔐 Panel admin'
      : `📄 ${page}`;

    const time = new Date().toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const message = [
      `👀 *Nueva visita a la web*`,
      ``,
      `📅 ${escapeMarkdown(time)}`,
      `${escapeMarkdown(pageName)}`,
      ``,
      `📱 ${escapeMarkdown(device)} — ${escapeMarkdown(browser)}`,
      referrer ? `🔗 Desde: ${escapeMarkdown(referrer)}` : ``,
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'MarkdownV2',
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Telegram API error:', res.status, errorBody);
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in telegram-visitor API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
