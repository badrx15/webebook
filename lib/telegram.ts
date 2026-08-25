interface OrderNotification {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  shippingAddress?: { street: string; city: string; province: string; postalCode: string };
  items: { productName: string; quantity: number; totalPrice: number }[];
  totalAmount: number;
  paymentMethod: string;
  notes?: string;
  createdAt?: string;
}

function escapeMarkdown(text: string): string {
  return String(text).replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

export async function sendTelegramNotification(order: OrderNotification): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.ADMIN_CHAT_ID;
  if (!botToken || !chatId) throw new Error('Telegram no está configurado');

  const itemsText = order.items.map(item => `• ${escapeMarkdown(item.productName)} × ${item.quantity} — ${escapeMarkdown(item.totalPrice.toFixed(2) + '€')}`).join('\n');
  const paymentText = order.paymentMethod === 'contrareembolso' ? 'Contra Reembolso' : 'Tarjeta';
  const address = order.shippingAddress ? `\n📍 *Dirección de envío:*\n${escapeMarkdown(order.shippingAddress.street)}\n${escapeMarkdown(order.shippingAddress.city)}, ${escapeMarkdown(order.shippingAddress.province)}\n${escapeMarkdown(order.shippingAddress.postalCode)}` : '';
  const message = [
    '🛍️ *NUEVO PEDIDO*', '',
    `👤 *Cliente:* ${escapeMarkdown(order.customerName)}`,
    `📞 *Teléfono:* ${escapeMarkdown(order.phone)}`,
    order.email ? `📧 *Email:* ${escapeMarkdown(order.email)}` : '', address, '',
    '*Producto:*', itemsText, '',
    `💰 *Total:* *${escapeMarkdown(order.totalAmount.toFixed(2) + '€')}*`,
    `💳 *Pago:* ${escapeMarkdown(paymentText)}`,
    order.notes ? `📝 *Notas:* ${escapeMarkdown(order.notes)}` : '',
    '', `🆔 Pedido \\#${escapeMarkdown(order.id.slice(0, 8))}`,
  ].filter(Boolean).join('\n');

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'MarkdownV2' }),
  });
  if (!response.ok) throw new Error(`Telegram API error ${response.status}`);
}
