import Link from 'next/link';
import { formatCurrency } from '@/lib/currency';
import { product } from '@/lib/product';
import LandingMobileMenu from '@/components/LandingMobileMenu';
import ProductViewTracker from '@/components/ProductViewTracker';

export default function LandingPage() {
  const products = [product];
  const productsJsonLd = products.map(p => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://ibericosgourmet.vercel.app'}${p.image}`],
    sku: p.id,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ibericosgourmet.vercel.app'}/checkout`,
    },
  }));

  return (
    <>
      {productsJsonLd.map((jsonLd, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ))}
      <ProductViewTracker products={products.map(p => ({ id: p.id, name: p.name, category: 'Jamón ibérico', sellingPrice: p.price }))} />
      <div className="min-h-screen bg-white">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🐷</span>
                <div><span className="text-xl font-bold text-gray-900 tracking-tight">Ibéricos</span><span className="text-xl font-light text-red-700"> Gourmet</span></div>
              </Link>
              <div className="hidden lg:flex items-center gap-8">
                <a href="#productos" className="text-sm font-medium text-gray-600 hover:text-red-700">Producto</a>
                <a href="#calidad" className="text-sm font-medium text-gray-600 hover:text-red-700">Calidad</a>
                <a href="#testimonios" className="text-sm font-medium text-gray-600 hover:text-red-700">Opiniones</a>
                <a href="#contacto" className="text-sm font-medium text-gray-600 hover:text-red-700">Contacto</a>
              </div>
              <LandingMobileMenu />
            </div>
          </div>
        </nav>

        <section className="relative pt-24 lg:pt-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-50 via-white to-white pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider mb-6"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />Producto exclusivo</div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">Jamón Ibérico<br /><span className="text-red-700">Cebo de Campo</span><br /><span className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-500">75% Raza Ibérica</span></h1>
                <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">Cortado a cuchillo por nuestro maestro jamonero. Pack de 5 sobres de 100g, envasado al vacío para conservar todo su sabor y aroma.</p>
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"><Link href={`/checkout?products=${product.id}`} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-red-700 text-white font-semibold text-base hover:bg-red-800 shadow-xl shadow-red-700/25">Comprar por {formatCurrency(product.price)}</Link><a href="#calidad" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-gray-200 text-gray-700 font-semibold text-base hover:border-red-200 hover:text-red-700">Nuestra Calidad</a></div>
                <div className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start"><div className="flex items-center gap-2"><span className="text-yellow-500">⭐⭐⭐⭐⭐</span><span className="text-sm text-gray-500">4.9/5</span></div><div className="flex items-center gap-2 text-sm text-gray-500">✅ Envasado al vacío</div><div className="flex items-center gap-2 text-sm text-gray-500">🚚 Envío gratis</div></div>
              </div>
              <div className="relative flex justify-center"><div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96"><div className="absolute inset-4 rounded-full border-2 border-red-50" /><div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-50 to-amber-50 flex items-center justify-center overflow-hidden"><img src={product.image} alt={product.name} className="w-full h-full object-cover" /></div><div className="absolute -top-2 -right-2 bg-amber-100 rounded-full px-4 py-2 shadow-lg"><p className="text-sm font-bold text-amber-800">Premium</p></div><div className="absolute -bottom-2 -left-2 bg-red-100 rounded-full px-4 py-2 shadow-lg"><p className="text-sm font-bold text-red-800">75% Ibérico</p></div></div></div>
            </div>
          </div>
        </section>

        <section id="productos" className="py-20 lg:py-28"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center mb-16"><span className="text-sm font-semibold text-red-700 uppercase tracking-widest">Producto único</span><h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Jamón Ibérico Premium</h2><p className="text-gray-600 mt-4 max-w-2xl mx-auto">Nuestra selección exclusiva, preparada para disfrutar en casa.</p></div><div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl hover:border-red-100 transition-all"><div className="relative aspect-square bg-gradient-to-br from-red-50 to-amber-50 overflow-hidden"><img src={product.image} alt={product.name} className="w-full h-full object-cover" /><div className="absolute top-3 right-3 bg-red-700 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg">Más vendido</div></div><div className="p-6"><h3 className="text-xl font-bold text-gray-900">{product.name}</h3><p className="text-sm text-gray-500 mt-2 leading-relaxed">{product.description}</p><div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between"><div><p className="text-xs text-gray-400">Pack de 5 sobres de 100g</p><p className="text-2xl font-bold text-red-700">{formatCurrency(product.price)}</p></div><Link href={`/checkout?products=${product.id}`} className="inline-flex items-center px-5 py-2.5 rounded-full bg-red-700 text-white text-sm font-semibold hover:bg-red-800 shadow-lg">Comprar y pagar</Link></div></div></div></div></section>

        <section id="calidad" className="py-20 lg:py-28 bg-gray-50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center mb-16"><span className="text-sm font-semibold text-red-700 uppercase tracking-widest">Nuestra Filosofía</span><h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Calidad Artesanal</h2><p className="text-gray-600 mt-4 max-w-2xl mx-auto">Cada sobre se prepara de forma artesanal, manteniendo la tradición del corte a cuchillo.</p></div><div className="grid sm:grid-cols-3 gap-8">{[{icon:'🌳',title:'Cebo de Campo',desc:'75% raza ibérica criada en las mejores dehesas.'},{icon:'👨‍🍳',title:'Corte a Cuchillo',desc:'Cada pieza es cortada por nuestro maestro jamonero.'},{icon:'✅',title:'Máxima Frescura',desc:'Envasado al vacío para conservar sabor y aroma.'}].map((item,i)=><div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"><div className="text-5xl mb-4">{item.icon}</div><h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3><p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p></div>)}</div></div></section>

        <section id="testimonios" className="py-20 lg:py-28"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center mb-16"><span className="text-sm font-semibold text-red-700 uppercase tracking-widest">Opiniones</span><h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Lo que dicen nuestros clientes</h2></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">{[{name:'María G.',text:'El mejor jamón que he probado. El corte a cuchillo marca la diferencia.',stars:5},{name:'Carlos M.',text:'Compra habitual en casa. La relación calidad-precio es inmejorable.',stars:5},{name:'Ana L.',text:'Lo pedí para una cena especial y fue un éxito.',stars:5}].map((t,i)=><div key={i} className="bg-gray-50 rounded-2xl p-8"><div className="flex text-yellow-500 mb-4">{'⭐'.repeat(t.stars)}</div><p className="text-gray-700 leading-relaxed mb-6">&quot;{t.text}&quot;</p><p className="font-semibold text-gray-900">— {t.name}</p></div>)}</div></div></section>

        <section id="contacto" className="py-20 lg:py-28 bg-gradient-to-br from-red-700 to-red-900 text-white"><div className="max-w-4xl mx-auto px-4 text-center"><h2 className="text-3xl sm:text-4xl font-bold">¿Listo para probar nuestro jamón?</h2><p className="mt-4 text-red-100 text-lg">Haz tu pedido ahora por solo {formatCurrency(product.price)}. Paga con tarjeta o contra reembolso.</p><div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"><Link href={`/checkout?products=${product.id}`} className="inline-flex px-8 py-3.5 rounded-full bg-white text-red-700 font-semibold hover:bg-red-50">Ir a pagar ahora</Link><a href="https://wa.me/34614070656?text=¡Hola!%20Quiero%20hacer%20un%20pedido%20de%20jamón%20ibérico." target="_blank" rel="noopener noreferrer" className="inline-flex px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10">WhatsApp</a></div></div></section>

        <footer className="bg-gray-900 text-gray-400 py-12"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="grid sm:grid-cols-3 gap-8"><div><div className="flex items-center gap-2 mb-4"><span className="text-2xl">🐷</span><div><span className="text-lg font-bold text-white">Ibéricos</span><span className="text-lg font-light text-red-400"> Gourmet</span></div></div><p className="text-sm leading-relaxed">Jamón ibérico gourmet, cortado a cuchillo y envasado al vacío.</p></div><div><h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Enlaces</h3><a href="#productos" className="text-sm hover:text-white">Producto único</a></div><div><h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contacto</h3><ul className="space-y-2 text-sm"><li><a href="https://wa.me/34614070656" target="_blank" rel="noopener noreferrer" className="hover:text-white">💬 +34 614 070 656</a></li><li>📧 nakhilbadreddin@gmail.com</li><li>📍 Extremadura, España</li></ul></div></div><div className="mt-10 pt-8 border-t border-gray-800 text-center text-sm"><p>© {new Date().getFullYear()} Ibéricos Gourmet. Todos los derechos reservados.</p></div></div></footer>
      </div>
    </>
  );
}
