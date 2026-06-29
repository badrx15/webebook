'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const chapters = [
  { num: '0', title: 'Introducción', desc: 'La ruta simple para empezar sin complicarte.' },
  { num: '1', title: 'Elige tu producto', desc: 'Qué vender, cómo validarlo y qué evitar.' },
  {
    num: '2',
    title: 'Configura WhatsApp Business',
    desc: 'Perfil, catálogo y respuestas rápidas que generan confianza.',
  },
  {
    num: '3',
    title: 'Crea tu anuncio en Meta Ads',
    desc: 'Campañas desde 3€/día para conseguir conversaciones.',
  },
  {
    num: '4',
    title: 'Cierra la venta por WhatsApp',
    desc: 'Guiones y mensajes para convertir dudas en pedidos.',
  },
  {
    num: '5',
    title: 'El contraembolso como ventaja',
    desc: 'Cómo reducir fricción y cobrar con menos riesgo.',
  },
  {
    num: '6',
    title: 'Gestiona los envíos',
    desc: 'Proceso claro para entregar sin tener stock propio.',
  },
  {
    num: '7',
    title: 'Escala el negocio',
    desc: 'Cuándo subir presupuesto y cómo repetir lo que funciona.',
  },
  {
    num: 'BONUS',
    title: 'Plantillas listas para copiar',
    desc: 'Mensajes, anuncios y seguimiento preparados para usar.',
  },
];

const WhatYouGet = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} id="contenido" className="bg-white px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          {/* Ebook cover mockup */}
          <div className="order-1 flex justify-center lg:order-none lg:justify-end">
            <div className="flex h-[340px] w-[240px] flex-col rounded-2xl bg-[#0d0d0d] p-5 text-white shadow-2xl sm:h-[400px] sm:w-[290px] sm:p-7 md:h-[440px] md:w-[320px] md:p-8">
              <div className="mb-auto text-center">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#C0281A] sm:mb-2 sm:text-xs">
                  Ebook PDF
                </p>
                <h3 className="text-base font-bold leading-snug sm:text-xl md:text-2xl">
                  Cómo vender por WhatsApp sin tienda online
                </h3>
                <div className="mx-auto mt-4 h-px w-12 bg-[#C0281A] sm:mt-6 sm:w-16" />
                <p className="mt-3 text-xs leading-relaxed text-gray-300 sm:mt-5 sm:text-sm">
                  El sistema para vender sin web, sin stock y con anuncios desde 3€/día.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 h-px w-10 bg-gray-600 sm:mb-3 sm:w-12" />
                <p className="text-[10px] font-semibold tracking-wide text-gray-400 sm:text-sm">
                  Vende por WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* Chapter list */}
          <div className="order-2 lg:order-none">
            <h2 className="mb-6 text-xl font-extrabold text-[#0d0d0d] sm:text-2xl lg:mb-8 lg:text-3xl">
              Lo que recibes cuando compras hoy
            </h2>
            <ol className="space-y-2 sm:space-y-3">
              {chapters.map((ch, i) => (
                <motion.li
                  key={i}
                  className="flex gap-2 rounded-lg border border-gray-100 p-2 transition-colors hover:bg-gray-50 sm:gap-3 sm:p-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#C0281A] text-[10px] font-bold text-white sm:h-7 sm:w-7 sm:text-xs">
                    {ch.num}
                  </span>
                  <div>
                    <strong className="text-xs font-bold text-gray-900 sm:text-sm">
                      {ch.title}
                    </strong>
                    <span className="ml-0.5 text-xs text-gray-500 sm:ml-1 sm:text-sm">{ch.desc}</span>
                  </div>
                </motion.li>
              ))}
            </ol>
            <p className="mt-6 text-center text-xs font-medium text-gray-500 sm:mt-8 sm:text-sm lg:text-left">
              35-45 páginas · PDF · Acceso de por vida
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

WhatYouGet.displayName = 'WhatYouGet';
export default WhatYouGet;
