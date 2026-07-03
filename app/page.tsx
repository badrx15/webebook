'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data } = useStore();
  const { products, settings } = data;
  const currencySymbol = settings.currencySymbol;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="min-h-screen bg-white">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🐷</span>
              <div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">Ibéricos</span>
                <span className="text-xl font-light text-red-700">Gourmet</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#productos" className="text-sm font-medium text-gray-600 hover:text-red-700 transition-colors">Productos</a>
              <a href="#calidad" className="text-sm font-medium text-gray-600 hover:text-red-700 transition-colors">Calidad</a>
              <a href="#testimonios" className="text-sm font-medium text-gray-600 hover:text-red-700 transition-colors">Opiniones</a>
              <a href="#contacto" className="text-sm font-medium text-gray-600 hover:text-red-700 transition-colors">Contacto</a>

            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#productos" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-red-700 py-2">Productos</a>
              <a href="#calidad" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-red-700 py-2">Calidad</a>
              <a href="#testimonios" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-red-700 py-2">Opiniones</a>
              <a href="#contacto" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-red-700 py-2">Contacto</a>

            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-24 lg:pt-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-50 via-white to-white pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {settings.businessName || 'Productos Premium'}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                Jamón Ibérico
                <br />
                <span className="text-red-700">Cebo de Campo</span>
                <br />
                <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-500">75% Raza Ibérica</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Cortado a cuchillo por nuestro maestro jamonero. Envasado al vacío para conservar
                todo su sabor y aroma. La mejor selección de productos ibéricos gourmet.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <a href="#productos"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-red-700 text-white font-semibold text-base
                             hover:bg-red-800 transition-all shadow-xl shadow-red-700/25 hover:shadow-red-700/40 active:scale-95">
                  Ver Productos
                </a>
                <a href="#calidad"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-gray-200 text-gray-700 font-semibold text-base
                             hover:border-red-200 hover:text-red-700 transition-all active:scale-95">
                  Nuestra Calidad
                </a>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  <span className="text-sm text-gray-500">4.9/5</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Envío en 24/48h
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Envasado al vacío
                </div>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 rounded-full border-2 border-red-100 animate-ping opacity-20" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-4 rounded-full border-2 border-red-50" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-50 to-amber-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl sm:text-9xl mb-4">🐷</div>
                    <p className="text-lg font-semibold text-red-700">Cortado a Cuchillo</p>
                    <p className="text-sm text-gray-500 mt-1">75% Raza Ibérica</p>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-amber-100 rounded-full px-4 py-2 shadow-lg">
                  <p className="text-sm font-bold text-amber-800">Premium</p>
                </div>
                <div className="absolute -bottom-2 -left-2 bg-red-100 rounded-full px-4 py-2 shadow-lg">
                  <p className="text-sm font-bold text-red-800">Vacío</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS FROM CRM ===== */}
      <section id="productos" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-red-700 uppercase tracking-widest">Nuestros Productos</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
              {products.length > 0 ? 'Selección Ibérica Premium' : 'Próximamente'}
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              {products.length > 0
                ? 'Seleccionamos las mejores piezas de jamón ibérico para ofrecerte una experiencia gastronómica inigualable.'
                : 'Añade productos desde el panel de administración y aparecerán aquí.'}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 mb-4">No hay productos disponibles todavía</p>
              <p className="text-sm text-gray-400">Próximamente disponibles</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map(product => (
                <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-red-100 transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-red-50 to-amber-50 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-7xl sm:text-8xl">🥩</span>
                      </div>
                    )}
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-red-700 shadow-sm">
                      Envío gratis
                    </div>
                    {products.indexOf(product) === 0 && (
                      <div className="absolute top-3 right-3 bg-red-700 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                        Más vendido
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description || 'Jamón ibérico de la mejor calidad, cortado a cuchillo y envasado al vacío.'}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Precio</p>
                        <p className="text-xl font-bold text-red-700">{formatCurrency(product.sellingPrice, currencySymbol)}</p>
                      </div>
                      <Link href={`/checkout?products=${product.id}`}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-red-700 text-white text-sm font-semibold
                                   hover:bg-red-800 transition-all shadow-lg shadow-red-700/25 group-hover:shadow-red-700/40 active:scale-95">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        Comprar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== QUALITY ===== */}
      <section id="calidad" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-red-700 uppercase tracking-widest">Nuestra Filosofía</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Calidad Artesanal</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Cada sobre de jamón es preparado de forma artesanal, manteniendo la tradición del corte a cuchillo.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: '🌳', title: 'Dehesa Extremeña', desc: 'Nuestros cerdos se crían en las mejores dehesas de Extremadura, en libertad.' },
              { icon: '👨‍🍳', title: 'Maestro Jamonero', desc: 'Cada pieza es cortada a cuchillo por nuestro maestro jamonero.' },
              { icon: '✅', title: 'Control de Calidad', desc: 'Cada lote pasa por estrictos controles para asegurar el mejor sabor.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonios" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-red-700 uppercase tracking-widest">Opiniones</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Lo que dicen nuestros clientes</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'María G.', text: 'El mejor jamón que he probado. El corte a cuchillo marca la diferencia, se nota la calidad.', stars: 5 },
              { name: 'Carlos M.', text: 'Compra habitual en casa. La relación calidad-precio es inmejorable.', stars: 5 },
              { name: 'Ana L.', text: 'Lo pedí para una cena especial y fue un éxito. Todos preguntaron dónde lo había comprado.', stars: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex text-yellow-500 mb-4">{'⭐'.repeat(t.stars)}</div>
                <p className="text-gray-700 leading-relaxed mb-6">"{t.text}"</p>
                <p className="font-semibold text-gray-900">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section id="contacto" className="py-20 lg:py-28 bg-gradient-to-br from-red-700 to-red-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">¿Listo para probar el mejor jamón?</h2>
          <p className="mt-4 text-red-100 text-lg max-w-2xl mx-auto">
            Haz tu pedido ahora y recíbelo en casa en 24/48h. Paga con tarjeta o contra reembolso.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#productos"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-red-700 font-semibold text-base hover:bg-red-50 transition-all shadow-xl active:scale-95">
              Ver productos
            </a>
            <a href="mailto:nakhilbadreddin@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all active:scale-95">
              Contactar
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🐷</span>
                <div>
                  <span className="text-lg font-bold text-white">Ibéricos</span>
                  <span className="text-lg font-light text-red-400">Gourmet</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed">
                Los mejores productos ibéricos gourmet, cortados a cuchillo y envasados al vacío.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li><a href="#productos" className="text-sm hover:text-white transition-colors">Productos</a></li>

              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm">
                <li>📧 nakhilbadreddin@gmail.com</li>
                <li>📞 +34 614 070 656</li>
                <li>📍 Extremadura, España</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800 text-center text-sm">
            <p>© {new Date().getFullYear()} Ibéricos Gourmet. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
