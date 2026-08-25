'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { product } from '@/lib/product';
import { formatCurrency } from '@/lib/currency';
import { trackInitiateCheckout, trackPurchase } from '@/lib/metaPixel';

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'contrareembolso'>('contrareembolso');
  const [notes, setNotes] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [squareError, setSquareError] = useState('');

  const requestedProduct = searchParams.get('products');
  const isValidProduct = !requestedProduct || requestedProduct === product.id;

  useEffect(() => {
    if (!isValidProduct) return;
    trackInitiateCheckout({ content_ids: [product.id], content_name: product.name, content_type: 'product', value: product.price, currency: 'EUR', num_items: 1 });
  }, [isValidProduct]);

  useEffect(() => {
    if (paymentMethod !== 'tarjeta') return;
    const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
    if (!appId || !locationId) { setSquareError('Pago con tarjeta no configurado. Elige contra reembolso.'); return; }
    const squareEnv = process.env.NEXT_PUBLIC_SQUARE_ENV === 'production' ? '' : 'sandbox.';
    const script = document.createElement('script');
    script.src = `https://${squareEnv}web.squarecdn.com/v1/square.js`;
    script.async = true;
    script.onload = async () => {
      try {
        const payments = (window as any).Square.payments(appId, locationId);
        const cardInstance = await payments.card();
        await cardInstance.attach('#square-card-container');
        setCard(cardInstance);
      } catch (err: any) { setSquareError(`Error al cargar el pago: ${err.message}`); }
    };
    script.onerror = () => setSquareError('No se pudo cargar el pago con tarjeta.');
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [paymentMethod]);

  const validateForm = () => {
    if (!fullName.trim()) return 'Introduce tu nombre completo';
    if (!phone.trim() || phone.trim().length < 9) return 'Introduce un teléfono válido';
    if (!street.trim() || !city.trim() || !province.trim()) return 'Completa la dirección de envío';
    if (!postalCode.trim() || postalCode.trim().length < 5) return 'Introduce un código postal válido';
    return '';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateForm();
    if (!isValidProduct) { setError('Producto no válido.'); return; }
    if (validationError) { setError(validationError); return; }
    setError(''); setSquareError(''); setLoading(true);
    try {
      if (paymentMethod === 'tarjeta') {
        if (!card) throw new Error('El formulario de tarjeta todavía no está listo.');
        const tokenResult = await card.tokenize();
        if (tokenResult.errors) throw new Error(tokenResult.errors.map((item: any) => item.detail).join(', '));
        const paymentResponse = await fetch('/api/square-payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sourceId: tokenResult.token, amount: product.price, currency: 'EUR' }) });
        const payment = await paymentResponse.json();
        if (!paymentResponse.ok || !payment.success) throw new Error(payment.error || 'No se pudo procesar el pago');
      }

      const id = crypto.randomUUID();
      const order = { id, customerName: fullName, phone, email, shippingAddress: { street, city, province, postalCode }, items: [{ productName: product.name, quantity: 1, totalPrice: product.price }], totalAmount: product.price, paymentMethod, notes, createdAt: new Date().toISOString() };
      const telegramResponse = await fetch('/api/telegram-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
      const telegramResult = await telegramResponse.json();
      if (!telegramResponse.ok || !telegramResult.success) throw new Error(telegramResult.error || 'No se pudo enviar el pedido a Telegram');
      trackPurchase({ value: product.price, currency: 'EUR', content_ids: [product.id], content_type: 'product', num_items: 1 });
      setOrderId(id); setSuccess(true);
    } catch (err: any) { setError(err.message || 'Error inesperado'); } finally { setLoading(false); }
  };

  if (success) return <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4"><div className="max-w-md w-full text-center bg-white rounded-3xl shadow-xl p-8 sm:p-12"><div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"><span className="text-4xl">✓</span></div><h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h1><p className="text-gray-600 mb-2">Gracias por tu compra, <strong>{fullName}</strong>.</p><p className="text-sm text-gray-500 mb-6">Te contactaremos para confirmar el envío. Pedido #{orderId.slice(0, 8)}</p><div className="space-y-3"><a href={`https://wa.me/34614070656?text=${encodeURIComponent(`Hola, he realizado el pedido #${orderId.slice(0, 8)} de ${product.name}.`)}`} target="_blank" rel="noopener noreferrer" className="block w-full px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700">Enviar también por WhatsApp</a><Link href="/" className="block w-full px-6 py-3 rounded-full bg-red-700 text-white font-semibold hover:bg-red-800">Volver a la tienda</Link></div></div></main>;

  return <main className="min-h-screen bg-gray-50"><nav className="bg-white border-b border-gray-100"><div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between"><Link href="/" className="text-lg font-bold text-gray-900">🐷 Ibéricos <span className="font-light text-red-700">Gourmet</span></Link><Link href="/" className="text-sm text-gray-500 hover:text-red-700">← Volver</Link></div></nav><div className="max-w-4xl mx-auto px-4 py-10"><div className="grid md:grid-cols-2 gap-8"><div className="bg-white rounded-3xl p-6 shadow-sm h-fit"><img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded-2xl" /><h1 className="text-2xl font-bold text-gray-900 mt-6">{product.name}</h1><p className="text-gray-500 mt-2">Pack de 5 sobres de 100g, loncheado a cuchillo.</p><p className="text-3xl font-bold text-red-700 mt-4">{formatCurrency(product.price)}</p></div><form onSubmit={handleSubmit} autoComplete="on" className="bg-white rounded-3xl p-6 shadow-sm space-y-5"><h2 className="text-2xl font-bold text-gray-900">Finalizar pedido</h2><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setPaymentMethod('contrareembolso')} className={`p-3 rounded-xl border-2 text-sm font-semibold ${paymentMethod === 'contrareembolso' ? 'border-red-700 bg-red-50 text-red-700' : 'border-gray-200'}`}>💵 Contra reembolso</button><button type="button" onClick={() => setPaymentMethod('tarjeta')} className={`p-3 rounded-xl border-2 text-sm font-semibold ${paymentMethod === 'tarjeta' ? 'border-red-700 bg-red-50 text-red-700' : 'border-gray-200'}`}>💳 Tarjeta</button></div><div className="space-y-3"><input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nombre completo" name="name" id="name" autoComplete="name" className="checkout-input" required /><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Teléfono" name="tel" id="tel" type="tel" autoComplete="tel" className="checkout-input" required /><input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (opcional)" name="email" id="email" type="email" autoComplete="email" className="checkout-input" /><input value={street} onChange={e => setStreet(e.target.value)} placeholder="Calle y número" name="street-address" id="street-address" autoComplete="street-address" className="checkout-input" required /><div className="grid grid-cols-2 gap-3"><input value={city} onChange={e => setCity(e.target.value)} placeholder="Ciudad" name="address-level2" id="city" autoComplete="address-level2" className="checkout-input" required /><input value={province} onChange={e => setProvince(e.target.value)} placeholder="Provincia" name="address-level1" id="province" autoComplete="address-level1" className="checkout-input" required /></div><input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="Código postal" name="postal-code" id="postal-code" autoComplete="postal-code" inputMode="numeric" className="checkout-input" required /><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas (opcional)" className="checkout-input min-h-20" /></div>{paymentMethod === 'tarjeta' && <><div id="square-card-container" className="min-h-20" />{squareError && <p className="text-sm text-red-600">{squareError}</p>}</>} {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}<div className="flex justify-between items-center border-t pt-5"><span className="font-semibold text-gray-600">Total</span><span className="text-2xl font-bold text-red-700">{formatCurrency(product.price)}</span></div><button disabled={loading} type="submit" className="w-full py-4 rounded-full bg-red-700 text-white font-semibold hover:bg-red-800 disabled:opacity-60">{loading ? 'Procesando...' : paymentMethod === 'tarjeta' ? 'Pagar y confirmar pedido' : 'Pedir contra reembolso'}</button><p className="text-xs text-gray-400 text-center">Tus datos se enviarán de forma segura para gestionar tu pedido.</p></form></div></div></main>;
}
