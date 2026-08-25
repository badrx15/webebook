import React from 'react';
import Link from 'next/link';
import { products } from '../../lib/products';

export const metadata = {
  title: 'Nuestros Productos | Ibéricos Gourmet',
  description: 'Catálogo de packs de jamón de cebo de campo 75% ibérico cortado a cuchillo.',
};

export default function ProductosPage() {
  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans">
      {/* Header Minimalista */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl md:text-3xl font-black text-jamon tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
            <i className="fas fa-piggy-bank"></i> IBÉRICOS GOURMET
          </Link>
          <div className="hidden md:flex gap-8 font-semibold text-stone-600">
            <Link href="/" className="hover:text-jamon transition-colors">Inicio</Link>
            <Link href="/productos" className="hover:text-jamon transition-colors font-bold text-jamon">Productos</Link>
          </div>
        </div>
      </nav>

      {/* Hero Productos */}
      <header className="py-16 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-black mb-4 text-stone-900">
            Nuestros <span className="text-jamon">Productos</span>
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl mx-auto font-medium">
            Jamón de cebo de campo 75% ibérico, loncheado a cuchillo por maestros jamoneros.
          </p>
        </div>
      </header>

      {/* Grid de Productos */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 max-w-xl mx-auto">
          {products.map((product) => (
            <div key={product.id} className={`bg-white rounded-[2rem] border-4 p-8 relative group hover:border-jamon/20 transition-all shadow-sm hover:shadow-2xl ${product.popular ? 'border-yellow-500 shadow-2xl scale-105 z-10' : 'border-stone-100'}`}>
              {product.popular ? (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 gold-gradient text-jamon px-8 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-md whitespace-nowrap">
                  {product.title} {product.subtitle}
                </div>
              ) : (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase whitespace-nowrap">
                  {product.title} {product.subtitle}
                </div>
              )}
              
              <img src={product.image} alt={product.name} className="w-56 h-56 mx-auto mb-6 object-cover group-hover:scale-105 transition-transform" />
              
              <div className="text-center">
                <span className="text-2xl font-bold text-jamon">x{product.quantity}</span>
                <div className="text-5xl font-black text-jamon mb-4 mt-2 tracking-tighter">
                  {product.price.toFixed(2).replace('.', ',')}€
                </div>
                <div className={`font-bold uppercase text-[10px] tracking-widest mb-8 ${product.popular ? 'text-stone-500' : 'text-stone-400'}`}>
                  {product.popular ? 'Mejor Valor - ' : ''}Envío Gratis + Pago Contrarreembolso
                </div>
                
                <Link href={`/producto/${product.id}`} className={`block w-full py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-all ${product.popular ? 'bg-stone-900 text-white hover:bg-jamon' : 'bg-jamon text-white shadow-jamon/20'}`}>
                  VER DETALLES Y COMPRAR
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="font-serif text-2xl font-black text-jamon italic mb-4">IBÉRICOS GOURMET</div>
          <p className="text-sm max-w-md mx-auto mb-6 text-stone-500">Selección premium de jamón de cebo de campo cortado a cuchillo por maestros jamoneros. Directo de la dehesa a tu mesa.</p>
          <div className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-600">© {new Date().getFullYear()} Ibéricos Gourmet S.L.</div>
        </div>
      </footer>
    </div>
  );
}