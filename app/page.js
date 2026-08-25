'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { products } from '../lib/products';
import './globals.css';

export default function Home() {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      name: 'María G.',
      initials: 'MG',
      text: '¡El mejor jamón que he probado en años! La calidad es excepcional y el corte a cuchillo marca la diferencia. Repetiré sin duda.',
      time: 'Hace 2 horas',
    },
    {
      name: 'Juan P.',
      initials: 'JP',
      text: 'Envío rapidísimo y el jamón llegó en perfectas condiciones. Mis invitados quedaron encantados. ¡Un 10!',
      time: 'Ayer',
    },
    {
      name: 'Ana R.',
      initials: 'AR',
      text: 'Siempre busco productos de calidad y este jamón ibérico ha superado mis expectativas. El sabor es increíble.',
      time: 'Hace 3 días',
    },
    {
      name: 'Carlos S.',
      initials: 'CS',
      text: 'Una experiencia gourmet en cada sobre. Perfecto para cualquier ocasión. Muy recomendable.',
      time: 'Hace 1 semana',
    },
    {
      name: 'Laura M.',
      initials: 'LM',
      text: 'La presentación es impecable y el sabor, inigualable. Se nota el cuidado en cada detalle. ¡Felicidades!',
      time: 'Hace 1 semana',
    },
    {
      name: 'Pedro D.',
      initials: 'PD',
      text: 'Compré para una cena especial y fue el centro de atención. Todos preguntaron dónde lo había conseguido.',
      time: 'Hace 2 semanas',
    },
    {
      name: 'Sofía V.',
      initials: 'SV',
      text: 'Me encanta la comodidad de los sobres y la frescura del jamón. Ideal para tener siempre a mano.',
      time: 'Hace 3 semanas',
    },
    {
      name: 'Miguel A.',
      initials: 'MA',
      text: 'El servicio al cliente es tan bueno como el producto. Tuvieron un detalle con mi pedido. ¡Gracias!',
      time: 'Hace 1 mes',
    },
  ];

  const nextReview = () => {
    setCurrentReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 5000); // Cambia cada 5 segundos
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <div className="bg-stone-50 text-stone-900 font-sans">
      {/* Header / Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="font-serif text-3xl font-black text-jamon tracking-tight flex items-center gap-2">
            <i className="fas fa-piggy-bank"></i> IBÉRICOS GOURMET
          </div>
          <div className="hidden md:flex gap-8 font-semibold text-stone-600">
            <Link href="/productos" className="hover:text-jamon transition-colors">Productos</Link>
            <a href="#mayorista" className="hover:text-jamon transition-colors font-bold text-indigo-600">Al Por Mayor</a>
            <a href="#calidad" className="hover:text-jamon transition-colors">Calidad</a>
          </div>
          <Link href="/productos" className="bg-jamon text-white px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-all">COMPRAR AHORA</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative py-16 bg-white overflow-hidden border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-jamon/10 text-jamon text-xs font-bold uppercase tracking-[0.2em] mb-6">
            Cortado a Cuchillo por Maestros
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-black mb-4 leading-tight text-stone-900">
            JAMÓN DE CEBO DE CAMPO <br />
            <span className="text-jamon">75% IBÉRICOS GOURMET</span>
          </h1>
          <p className="text-xl text-stone-500 mb-12 max-w-2xl mx-auto font-medium">
            Jamón de cebo de campo 75% ibérico, loncheado a cuchillo en 5 sobres de 100g. Envío Gratis y Regalo Sorpresa incluido.
          </p>
          
          <Link href="/productos" className="inline-block bg-jamon text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-jamon/20 hover:scale-105 transition-all mb-16">
            COMPRAR JAMÓN 75% IBÉRICO
          </Link>

          {/* Producto Único */}
          <section className="relative w-full max-w-3xl mx-auto bg-white rounded-[2.5rem] border-4 border-yellow-500 shadow-2xl shadow-yellow-500/10 p-8 md:p-12 mb-16">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 gold-gradient text-jamon px-8 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-md whitespace-nowrap">
              Mejor Valor
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <img src="/product-image.png" alt="Jamón de Cebo de Campo 75% Ibérico" className="w-64 h-64 object-cover rounded-3xl" />
              <div className="text-center md:text-left flex-1">
                <h3 className="font-serif text-3xl md:text-4xl font-black text-stone-900 mb-2">
                  JAMÓN CEBO DE CAMPO <span className="text-2xl text-stone-500">75% IBÉRICO</span>
                </h3>
                <p className="text-lg text-stone-500 font-medium mb-4">
                  Loncheado a cuchillo por maestros jamoneros. 5 sobres de 100g.
                </p>
                <div className="text-6xl font-black text-jamon mb-6 tracking-tighter">
                  39,99€
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest mb-8">
                  <div className="flex items-center gap-1.5"><i className="fas fa-truck text-jamon"></i> Envío Gratis</div>
                  <div className="flex items-center gap-1.5"><i className="fas fa-hand-holding-usd text-jamon"></i> Contrarreembolso</div>
                </div>
                <Link href="/productos" className="inline-block bg-jamon text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-jamon/20 hover:scale-[1.02] transition-all">
                  VER DETALLES Y COMPRAR
                </Link>
              </div>
            </div>
          </section>

          {/* WhatsApp Purchase Section */}
          <section className="py-12 bg-green-50 text-green-800 rounded-3xl shadow-lg max-w-4xl mx-auto mb-16">
            <div className="text-center px-4">
              <h3 className="font-serif text-3xl font-black mb-4">
                ¿Prefieres comprar por <span className="text-green-600">WhatsApp</span>?
              </h3>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Si lo deseas, puedes realizar tu pedido o consultar cualquier duda directamente con nosotros a través de WhatsApp. ¡Te atenderemos encantados!
              </p>
              <a
                href="https://wa.me/34614070656?text=Hola,%20me%20gustaría%20hacer%20un%20pedido%20o%20consultar%20sobre%20los%20productos."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 text-white text-xl font-bold px-8 py-4 rounded-full shadow-xl hover:bg-green-600 transition-all transform hover:scale-105"
              >
                <i className="fab fa-whatsapp text-2xl mr-3"></i>
                Comprar por WhatsApp
              </a>
            </div>
          </section>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-8 text-stone-400 font-bold text-sm uppercase tracking-widest">
            <div className="flex items-center gap-2"><i className="fas fa-truck text-jamon"></i> Envío Gratis</div>
            <div className="flex items-center gap-2"><i className="fas fa-hand-holding-usd text-jamon"></i> Pago Contrarreembolso</div>
            <div className="flex items-center gap-2"><i className="fab fa-whatsapp text-jamon"></i> Pedidos por Whatsapp</div>
          </div>
        </div>
      </header>



      {/* SECCIÓN CALIDAD - Carrusel de Reseñas */}
      <section id="calidad" className="py-20 bg-gradient-to-br from-green-50 to-green-100 text-stone-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-black mb-12 leading-tight text-green-700">
            Nuestros Clientes <span className="text-green-500">Hablan</span>
          </h2>

          <div className="relative w-full max-w-2xl mx-auto">
            {/* Carousel Container */}
            <div className="relative min-h-[250px] overflow-hidden rounded-3xl shadow-xl bg-white border border-green-200">
              {/* Reviews */}
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentReview * 100}%)` }}>
                {reviews.map((review, index) => (
                  <div key={index} className="w-full flex-shrink-0 p-6 flex items-start space-x-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {review.initials}
                    </div>
                    <div className="flex-grow text-left">
                      <p className="font-bold text-green-800">{review.name}</p>
                      <div className="bg-green-50 p-4 rounded-xl rounded-br-none shadow-sm text-sm relative max-w-xs">
                        <p className="text-stone-700">{review.text}</p>
                        <span className="absolute bottom-1 right-2 text-xs text-stone-400">
                          <i className="fab fa-whatsapp text-green-500 mr-1"></i>
                          {review.time}
                        </span>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-50 transform rotate-45 translate-x-1/2 translate-y-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevReview}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-green-100 transition-colors text-green-600 focus:outline-none"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              onClick={nextReview}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white p-4 rounded-full shadow-md hover:bg-green-100 hover:scale-110 transition-all text-green-600 focus:outline-none"
            >
              <i className="fas fa-chevron-right text-lg"></i>
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN AL POR MAYOR */}
      <section id="mayorista" className="py-24 bg-stone-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-jamon/5 -skew-x-12 transform translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block py-1 px-4 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-yellow-500/30">
                Canal Horeca & Distribuidores
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-black mb-8 leading-tight">
                Venta al Por Mayor <br />para <span className="text-yellow-500">Negocios</span>
              </h2>
              <p className="text-xl text-stone-400 mb-10 leading-relaxed">
                ¿Tienes un restaurante, tienda gourmet o buscas regalos corporativos? Ofrecemos precios especiales para pedidos de gran volumen (más de 50 sobres) y suministros recurrentes.
              </p>
              <ul className="space-y-6 mb-12">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0"><i className="fas fa-percentage"></i></div>
                  <div>
                    <h4 className="font-bold text-lg">Descuentos por Volumen</h4>
                    <p className="text-stone-500">Precios escalonados según la cantidad de sobres mensuales.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0"><i className="fas fa-shipping-fast"></i></div>
                  <div>
                    <h4 className="font-bold text-lg">Logística Prioritaria</h4>
                    <p className="text-stone-500">Envíos urgentes refrigerados garantizados en 24h.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-[2.5rem] p-10 text-stone-900 shadow-2xl border border-stone-800">
              <h3 className="font-serif text-2xl font-black mb-6 text-jamon">Solicitar Tarifas Mayoristas</h3>
              <form action="/api/contacto-mayorista" method="POST" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nombre de Empresa / Autónomo</label>
                    <input type="text" name="empresa" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-jamon transition-all" placeholder="Ej: Restaurante La Dehesa" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Email Corporativo</label>
                    <input type="email" name="email" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-jamon transition-all" placeholder="info@empresa.com" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Teléfono</label>
                    <input type="tel" name="telefono" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-jamon transition-all" placeholder="+34 ..." />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Volumen estimado (Sobres/mes)</label>
                    <select name="volumen" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-jamon transition-all appearance-none">
                      <option value="50 - 100 sobres">50 - 100 sobres</option>
                      <option value="100 - 500 sobres">100 - 500 sobres</option>
                      <option value="+500 sobres">+500 sobres</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-xl font-black text-lg hover:bg-jamon transition-all mt-4 uppercase tracking-widest">
                  RECIBIR TARIFAS
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN AL POR MAYOR */}
      <footer className="bg-white text-stone-400 py-16 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="font-serif text-3xl font-black text-jamon italic mb-6">IBÉRICOS GOURMET</div>
          <p className="text-sm max-w-md mx-auto mb-8">Selección premium de jamón de cebo de campo cortado a cuchillo por maestros jamoneros. Directo de la dehesa.</p>
          <div className="flex justify-center gap-8 text-xs uppercase tracking-widest font-bold mb-12">
            <a href="#" className="hover:text-jamon transition-colors">Aviso Legal</a>
            <a href="#" className="hover:text-jamon transition-colors">Privacidad</a>
            <a href="#" className="hover:text-jamon transition-colors">Envíos</a>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] font-black">© 2024 Ibéricos Gourmet S.L.</div>
        </div>
      </footer>
    </div>
  );
}
