// Telegram Bot notification helper
// Server-only: never import this from client code directly

interface OrderNotification {
  id: string;
  customerName: string;
  phone: string;
  shippingAddress?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: { productName: string; quantity: number; totalPrice: number }[];
  totalAmount: number;
  paymentMethod: string;
  notes: string;
  createdAt: string;
}

export function escapeMarkdown(text: string): string {
  // Escape MarkdownV2 special characters
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

export async function sendTelegramNotification(order: OrderNotification): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.ADMIN_CHAT_ID;

  if (!botToken || !chatId) {
    const missing = [];
    if (!botToken) missing.push('TELEGRAM_BOT_TOKEN');
    if (!chatId) missing.push('ADMIN_CHAT_ID');
    throw new Error(`Variables de entorno no configuradas en Vercel: ${missing.join(', ')}`);
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
    order.shippingAddress ? [
      ``,
      `📍 *Dirección de envío:*`,
      `${escapeMarkdown(order.shippingAddress.street)}`,
      `${escapeMarkdown(order.shippingAddress.city)}, ${escapeMarkdown(order.shippingAddress.province)}`,
      `${escapeMarkdown(order.shippingAddress.postalCode)}`,
    ].join('\n') : '',
    ``,
    `*Productos:*`,
    itemsText,
    ``,
    `💰 *Total:* *${escapeMarkdown(order.totalAmount.toFixed(2) + '€')}*`,
    `${paymentEmoji} *Pago:* ${escapeMarkdown(paymentText)}`,
    order.notes ? `📝 *Notas:* ${escapeMarkdown(order.notes)}` : '',
    ``,
    `🆔 Pedido \\#${escapeMarkdown(order.id.slice(0, 8))}`,
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
      throw new Error(`Telegram API respondió con error ${res.status}: ${errorBody.slice(0, 200)}`);
    }
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(`Error de red al conectar con Telegram: ${error}`);
  }
}
