'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { trackInitiateCheckout, trackPurchase } from '@/lib/metaPixel';

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const { data, addOrder, addSale } = useStore();
  const { products, settings } = data;

  const currencySymbol = settings.currencySymbol;

  const productIds = searchParams.get('products')?.split(',') || [];

  const cartItems = useMemo(() => {
    const items: { productId: string; quantity: number; productName: string; unitPrice: number; totalPrice: number; productImage?: string }[] = [];
    productIds.forEach(pid => {
      const product = products.find(p => p.id === pid);
      if (product) {
        items.push({ productId: product.id, quantity: 1, productName: product.name, unitPrice: product.sellingPrice, totalPrice: product.sellingPrice, productImage: product.image });
      }
    });
    return items;
  }, [productIds, products]);

  const totalAmount = cartItems.reduce((s, i) => s + i.totalPrice, 0);

  // Track InitiateCheckout when checkout loads
  useEffect(() => {
    if (cartItems.length === 0) return;
    trackInitiateCheckout({
      content_ids: cartItems.map(i => i.productId),
      content_name: cartItems.map(i => i.productName).join(', '),
      content_type: 'product',
      value: totalAmount,
      currency: 'EUR',
      num_items: cartItems.length,
    });
  }, [cartItems, totalAmount]);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'contrareembolso'>('contrareembolso');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [squareLoaded, setSquareLoaded] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [squareError, setSquareError] = useState('');

  // Load Square Web Payments SDK
  useEffect(() => {
    if (paymentMethod !== 'tarjeta') return;

    const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
    if (!appId || !locationId) {
      setSquareError('Square no está configurado. El administrador debe configurarlo.');
      return;
    }

    const squareEnv = process.env.NEXT_PUBLIC_SQUARE_ENV === 'production' ? '' : 'sandbox.';
    const script = document.createElement('script');
    script.src = `https://${squareEnv}web.squarecdn.com/v1/square.js`;
    script.async = true;
    let cancelled = false;

    script.onload = async () => {
      if (cancelled) return;
      try {
        const payments = (window as any).Square.payments(appId, locationId);
        const cardInstance = await payments.card();
        await cardInstance.attach('#square-card-container');
        setCard(cardInstance);
        setSquareLoaded(true);
      } catch (err: any) {
        if (!cancelled) setSquareError('Error al cargar el formulario de pago: ' + err.message);
      }
    };
    script.onerror = () => {
      if (!cancelled) setSquareError('No se pudo cargar Square. Elige Contra reembolso.');
    };
    document.head.appendChild(script);

    return () => { cancelled = true; const el = document.querySelector(`script[src="${script.src}"]`); if (el) el.remove(); };
  }, [paymentMethod]);

  const validateForm = () => {
    if (!fullName.trim()) { setError('Introduce tu nombre completo'); return false; }
    if (!phone.trim() || phone.trim().length < 9) { setError('Introduce un teléfono válido'); return false; }
    if (!street.trim()) { setError('Introduce la calle y número'); return false; }
    if (!city.trim()) { setError('Introduce la ciudad'); return false; }
    if (!province.trim()) { setError('Introduce la provincia'); return false; }
    if (!postalCode.trim() || postalCode.trim().length < 5) { setError('Introduce un código postal válido'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSquareError('');
    if (cartItems.length === 0) { setError('No hay productos en tu pedido.'); return; }
    if (!validateForm()) return;
    setLoading(true);

    try {
      let squarePaymentId: string | undefined;
      const orderPaymentMethod = paymentMethod;

      if (paymentMethod === 'tarjeta') {
        if (!card) { setError('Formulario de pago no listo.'); setLoading(false); return; }
        const tokenResult = await card.tokenize();
        if (tokenResult.errors) {
          setError('Error de tarjeta: ' + tokenResult.errors.map((e: any) => e.detail).join(', '));
          setLoading(false);
          return;
        }
        const res = await fetch('/api/square-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sourceId: tokenResult.token, amount: totalAmount, currency: settings.currency || 'EUR' }),
        });
        const result = await res.json();
        if (!result.success) { setError(result.error || 'Error al procesar el pago'); setLoading(false); return; }
        squarePaymentId = result.payment.id;
      }

      const newOrder = addOrder({
        items: cartItems.map(item => ({ productId: item.productId, productName: item.productName, quantity: item.quantity, unitPrice: item.unitPrice, totalPrice: item.totalPrice })),
        totalAmount,
        paymentMethod: orderPaymentMethod,
        notes,
        shippingAddress: { street, city, province, postalCode },
        squarePaymentId,
      });

      const saleItems = cartItems.map(item => {
        const product = products.find(p => p.id === item.productId);
        return { productId: item.productId, productName: item.productName, quantity: item.quantity, unitCost: product?.costPrice || 0, unitPrice: item.unitPrice, totalCost: (product?.costPrice || 0) * item.quantity, totalPrice: item.totalPrice, profit: (item.unitPrice - (product?.costPrice || 0)) * item.quantity };
      });
      const totalCost = saleItems.reduce((s, i) => s + i.totalCost, 0);
      const grossProfit = totalAmount - totalCost;
      const profitMargin = totalAmount > 0 ? (grossProfit / totalAmount) * 100 : 0;

      addSale({
        date: new Date().toISOString(),
        items: saleItems,
        totalAmount, totalCost, grossProfit, profitMargin,
        customerName: fullName,
        customerContact: phone,
        paymentMethod: paymentMethod === 'tarjeta' ? 'Tarjeta' : 'Contrareembolso',
        notes: `Pedido web #${newOrder.id.slice(0, 8)}${notes ? '. ' + notes : ''}`,
      });

      // Track Purchase event for Meta Pixel
      trackPurchase({
        value: totalAmount,
        currency: 'EUR',
        content_ids: cartItems.map(i => i.productId),
        content_type: 'product',
        num_items: cartItems.length,
      });

      // Send Telegram notification (fire-and-forget — no bloquea el flujo)
      fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newOrder.id,
          customerName: fullName,
          phone: phone,
          items: cartItems.map(item => ({
            productName: item.productName,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
          totalAmount,
          paymentMethod: orderPaymentMethod,
          notes: notes,
          createdAt: newOrder.createdAt,
        }),
      }).then(async res => {
        const data = await res.json();
        if (!data.success) console.error('Telegram notify error:', data);
      }).catch(err => console.error('Telegram notify fetch failed:', err));

      setSuccess(true);
    } catch (err: any) {
      setError('Error inesperado: ' + err.message);
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-xl p-8 sm:p-12">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {paymentMethod === 'contrareembolso' ? '¡Pedido Confirmado!' : '¡Pago Recibido!'}
          </h1>
          <p className="text-gray-600 mb-2">Gracias por tu compra, <span className="font-semibold">{fullName}</span>.</p>
          <p className="text-sm text-gray-500 mb-6">
            {paymentMethod === 'contrareembolso' ? 'Pagas cuando recibas el pedido.' : 'Pago recibido correctamente.'}
          </p>
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-red-700 text-white font-semibold hover:bg-red-800 transition-all">Volver a la Tienda</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🐷</span>
            <span className="text-lg font-bold text-gray-900">Ibéricos <span className="font-light text-red-700">Gourmet</span></span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-red-700">← Volver</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4 mb-10 text-sm">
          <span className="flex items-center gap-2 text-green-600 font-semibold">
            <span className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">✓</span> Productos
          </span>
          <span className="w-12 h-px bg-green-600" />
          <span className="flex items-center gap-2 text-red-700 font-semibold">
            <span className="w-7 h-7 rounded-full bg-red-700 text-white flex items-center justify-center text-xs">2</span> Datos y Pago
          </span>
          <span className="w-12 h-px bg-gray-300" />
          <span className="flex items-center gap-2 text-gray-400">
            <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">3</span> Confirmación
          </span>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h1 className="text-xl font-bold text-gray-900 mb-6">Tus datos</h1>
              {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all text-base"
                    placeholder="Ej: María García López" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none text-base"
                    placeholder="Ej: 612 345 678" required />
                  <p className="text-xs text-gray-400 mt-1">Te llamaremos si hay alguna duda</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Dirección de envío</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Calle y número *</label>
                      <input type="text" value={street} onChange={e => setStreet(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all text-base"
                        placeholder="Ej: Calle Mayor, 15" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                        <input type="text" value={city} onChange={e => setCity(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all text-base"
                          placeholder="Ej: Salamanca" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                        <input type="text" value={province} onChange={e => setProvince(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all text-base"
                          placeholder="Ej: Salamanca" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
                      <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all text-base"
                        placeholder="Ej: 37001" required />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none text-base"
                    rows={2} placeholder="¿Alguna indicación especial?" />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Método de pago</h2>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'contrareembolso' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value="contrareembolso" checked={paymentMethod === 'contrareembolso'}
                        onChange={() => setPaymentMethod('contrareembolso')} className="w-5 h-5 accent-red-700" />
                      <div>
                        <p className="font-semibold text-gray-900">Contra Reembolso</p>
                        <p className="text-sm text-gray-500">Pagas en efectivo cuando recibas el pedido en casa</p>
                      </div>
                    </label>
                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'tarjeta' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value="tarjeta" checked={paymentMethod === 'tarjeta'}
                        onChange={() => setPaymentMethod('tarjeta')} className="w-5 h-5 accent-red-700" />
                      <div>
                        <p className="font-semibold text-gray-900">Tarjeta de crédito/débito</p>
                        <p className="text-sm text-gray-500">Pago seguro con Square. Visa, Mastercard</p>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'tarjeta' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      {squareError ? (
                        <p className="text-sm text-red-600">{squareError}</p>
                      ) : (
                        <>
                          <div id="square-card-container" className="min-h-[100px]" />
                          {!squareLoaded && <p className="text-sm text-gray-400 mt-2">Cargando formulario de pago seguro...</p>}
                          <p className="text-xs text-gray-400 mt-2">🔒 Tus datos están protegidos con cifrado SSL</p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" disabled={loading || cartItems.length === 0}
                  className="w-full py-4 rounded-xl bg-red-700 text-white text-lg font-bold hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-700/25 mt-4">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Procesando...
                    </span>
                  ) : `Confirmar pedido — ${formatCurrency(totalAmount, currencySymbol)}`}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Tu pedido</h2>
              <div className="space-y-3 mb-6">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                      ) : (
                        <span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-sm">🐷</span>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">{formatCurrency(item.totalPrice, currencySymbol)}</p>
                  </div>
                ))}
              </div>
              {cartItems.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No hay productos en el pedido</p>
                  <Link href="/" className="text-sm text-red-700 hover:underline">Volver a la tienda</Link>
                </div>
              )}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>{formatCurrency(totalAmount, currencySymbol)}</span></div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-red-700">{formatCurrency(totalAmount, currencySymbol)}</span>
                </div>
              </div>
              <div className="mt-6 space-y-2 text-sm text-gray-500">
                <p>🔒 Pago seguro con cifrado SSL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
