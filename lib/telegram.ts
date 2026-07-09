// Telegram Bot notification helper
// Server-only: never import this from client code directly

interface OrderNotification {
  id: string;
  customerName: string;
  phone: string;
  items: { productName: string; quantity: number; totalPrice: number }[];
  totalAmount: number;
  paymentMethod: string;
  notes: string;
  createdAt: string;
}

function escapeMarkdown(text: string): string {
  // Escape MarkdownV2 special characters
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

export async function sendTelegramNotification(order: OrderNotification): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.ADMIN_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('TELEGRAM_BOT_TOKEN or ADMIN_CHAT_ID not configured. Skipping Telegram notification.');
    return false;
  }

  const itemsText = order.items
    .map(item => `• ${escapeMarkdown(item.productName)} × ${item.quantity} — ${escapeMarkdown(item.totalPrice.toFixed(2) + '€')}`)
    .join('\n');

  const paymentEmoji = order.paymentMethod === 'contrareembolso' ? '💵' : '💳';
  const paymentText = order.paymentMethod === 'contrareembolso' ? 'Contra Reembolso' : 'Tarjeta';

  const message = [
    `🛍️ *NUEVO PEDIDO*`,
    ``,
    `👤 *Cliente:* ${escapeMarkdown(order.customerName)}`,
    `📞 *Teléfono:* ${escapeMarkdown(order.phone)}`,
    ``,
    `*Productos:*`,
    itemsText,
    ``,
    `💰 *Total:* *${escapeMarkdown(order.totalAmount.toFixed(2) + '€')}*`,
    `${paymentEmoji} *Pago:* ${escapeMarkdown(paymentText)}`,
    order.notes ? `📝 *Notas:* ${escapeMarkdown(order.notes)}` : '',
    ``,
    `🆔 Pedido #${escapeMarkdown(order.id.slice(0, 8))}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
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
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
}
