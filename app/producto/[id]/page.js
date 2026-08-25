'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { products } from '../../../lib/products';

export default function ProductPage({ params }) {
  // En Next.js 14/15, params es una Promise en Server Components, pero aquí en Client Component necesitamos desencapsular o usar hook.
  // Usaremos React.use() para asegurar compatibilidad, pero de momento destructuring estándar suele funcionar, 
  // aunque la recomendación actual es unwrapear `params` con `React.use()` si se usa el App Router reciente.
  // Para compatibilidad general, si params no es promesa:
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Evento ViewContent de Meta Pixel
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'EUR',
      });
    }
  }, [product]);

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans">
      {/* Header Minimalista */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl md:text-3xl font-black text-jamon tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
            <i className="fas fa-piggy-bank"></i> IBÉRICOS GOURMET
          </Link>
          <Link href="/" className="text-sm font-bold text-stone-500 hover:text-jamon transition-colors">
            <i className="fas fa-arrow-left mr-2"></i> VOLVER AL CATÁLOGO
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Detalles del Producto */}
          <div className="space-y-8">
            <div className={`bg-white rounded-[2.5rem] border-4 p-8 relative overflow-hidden ${product.popular ? 'border-yellow-500 shadow-2xl shadow-yellow-500/10' : 'border-stone-100 shadow-xl shadow-stone-200/50'}`}>
              {product.popular && (
                <div className="absolute top-6 left-6 gold-gradient text-jamon px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-md z-10">
                  <i className="fas fa-star mr-1"></i> Mejor Valor
                </div>
              )}
              
              <img src={product.image} alt={product.name} className="w-full max-w-md mx-auto object-cover hover:scale-105 transition-transform duration-500" />
              
              <div className="text-center mt-8">
                <h1 className="font-serif text-4xl md:text-5xl font-black text-stone-900 mb-2">
                  {product.title} <span className="text-2xl text-stone-500">{product.subtitle}</span>
                </h1>
                <div className="text-6xl font-black text-jamon mb-4 tracking-tighter">
                  {product.price.toFixed(2).replace('.', ',')}€
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest mb-6">
                  <div className="flex items-center gap-1.5"><i className="fas fa-truck text-jamon"></i> Envío Gratis</div>
                  <div className="flex items-center gap-1.5"><i className="fas fa-hand-holding-usd text-jamon"></i> Contrarreembolso</div>
                </div>
                <p className="text-stone-500 font-medium text-lg leading-relaxed max-w-md mx-auto">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Garantías o Info extra */}
            <div className="bg-green-50 rounded-[2rem] p-8 text-green-900 shadow-sm border border-green-100">
              <h3 className="font-serif text-2xl font-black mb-4">La Garantía Ibéricos Gourmet</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-600 mt-1"></i>
                  <span>Cortado a cuchillo por maestros jamoneros en el momento.</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-600 mt-1"></i>
                  <span>Cebo de Campo 75% Ibérico de la mejor calidad.</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-600 mt-1"></i>
                  <span>Envasado al vacío para preservar aroma y sabor hasta 6 meses.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Formulario de Compra (Checkout) */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 p-8 lg:p-10 sticky top-28 h-fit">
            <div className="mb-8">
              <h2 className="font-serif text-3xl font-black text-stone-900 mb-2">Finalizar Pedido</h2>
              <p className="text-stone-500">Estás a un paso de disfrutar del mejor ibérico.</p>
            </div>

            <form action="/api/checkout-jamon" method="POST" className="space-y-6">
              <input type="hidden" name="productName" value={product.name} />
              <input type="hidden" name="price" value={product.price} />
              <input type="hidden" name="quantity" value={product.quantity} />
              <input type="hidden" name="paymentMethod" value={paymentMethod} />
              
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Método de Pago</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`relative flex flex-col p-4 bg-white border-2 rounded-2xl cursor-pointer hover:border-jamon/30 transition-all items-center text-center ${paymentMethod === 'cod' ? 'border-jamon bg-jamon/5 shadow-md' : 'border-stone-200'}`}>
                    <input type="radio" name="paymentMethodDisplay" value="cod" checked={paymentMethod === 'cod'} onChange={handlePaymentChange} className="absolute opacity-0" />
                    <i className="fas fa-hand-holding-usd text-jamon text-2xl mb-2"></i>
                    <span className="font-bold text-sm">Contrareembolso</span>
                    <span className="text-[10px] text-stone-400 mt-1">Recomendado</span>
                  </label>
                  <label className={`relative flex flex-col p-4 bg-white border-2 rounded-2xl cursor-pointer hover:border-jamon/30 transition-all items-center text-center ${paymentMethod === 'card' ? 'border-jamon bg-jamon/5 shadow-md' : 'border-stone-200'}`}>
                    <input type="radio" name="paymentMethodDisplay" value="card" checked={paymentMethod === 'card'} onChange={handlePaymentChange} className="absolute opacity-0" />
                    <i className="fas fa-credit-card text-jamon text-2xl mb-2"></i>
                    <span className="font-bold text-sm">Tarjeta</span>
                    <span className="text-[10px] text-stone-400 mt-1">Pago Seguro</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Nombre Completo</label>
                  <input type="text" name="name" required className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-jamon outline-none transition-all font-medium" placeholder="Ej: Juan Pérez" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Teléfono de contacto</label>
                  <input type="tel" name="phone" required className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-jamon outline-none transition-all font-medium" placeholder="+34 6XX XXX XXX" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Email de contacto (opcional)</label>
                  <input type="email" name="email" className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-jamon outline-none transition-all font-medium" placeholder="tucorreo@ejemplo.com" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Dirección de Envío</label>
                  <input type="text" name="address" required placeholder="Calle, número, piso..." className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-jamon outline-none transition-all font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Ciudad</label>
                    <input type="text" name="city" required className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-jamon outline-none transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Código Postal</label>
                    <input type="text" name="postalCode" required className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-jamon outline-none transition-all font-medium" />
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-stone-500 font-bold">Total a pagar:</span>
                  <span className="text-3xl font-black text-jamon">{product.price.toFixed(2).replace('.', ',')}€</span>
                </div>
                <button type="submit" className="w-full bg-jamon text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-jamon/20 hover:opacity-90 hover:scale-[1.02] transition-all flex justify-center items-center gap-3">
                  {paymentMethod === 'cod' ? (
                    <>
                      <i className="fas fa-truck-fast"></i>
                      PEDIR CONTRAREEMBOLSO
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock"></i>
                      PAGAR Y RECIBIR EN CASA
                    </>
                  )}
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-stone-300 mt-4">
                <i className="fab fa-cc-visa text-3xl"></i>
                <i className="fab fa-cc-mastercard text-3xl"></i>
                <i className="fab fa-apple-pay text-3xl"></i>
                <i className="fab fa-google-pay text-3xl"></i>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="font-serif text-2xl font-black text-jamon italic mb-4">IBÉRICOS GOURMET</div>
          <p className="text-sm max-w-md mx-auto mb-6 text-stone-500">Selección premium de jamón de cebo de campo cortado a cuchillo por maestros jamoneros. Directo de la dehesa a tu mesa.</p>
          <div className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-600">© {new Date().getFullYear()} Ibéricos Gourmet S.L.</div>
        </div>
      </footer>
    </div>
  );
}