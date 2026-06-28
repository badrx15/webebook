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
    <section ref={ref} id="contenido" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          {/* Ebook cover mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="flex h-[420px] w-[300px] flex-col rounded-2xl bg-[#0d0d0d] p-8 text-white shadow-2xl sm:h-[460px] sm:w-[340px]">
              <div className="mb-auto text-center">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C0281A]">
                  Ebook PDF
                </p>
                <h3 className="text-xl font-bold leading-snug sm:text-2xl">
                  Cómo vender por WhatsApp sin tienda online
                </h3>
                <div className="mx-auto mt-6 h-px w-16 bg-[#C0281A]" />
                <p className="mt-5 text-sm leading-relaxed text-gray-300">
                  El sistema para vender sin web, sin stock y con anuncios desde
                  3€/día.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 h-px w-12 bg-gray-600" />
                <p className="text-sm font-semibold tracking-wide text-gray-400">
                  Vende por WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* Chapter list */}
          <div>
            <h2 className="mb-8 text-2xl font-extrabold text-[#0d0d0d] sm:text-3xl">
              Lo que recibes cuando compras hoy
            </h2>
            <ol className="space-y-3">
              {chapters.map((ch, i) => (
                <motion.li
                  key={i}
                  className="flex gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#C0281A] text-xs font-bold text-white">
                    {ch.num}
                  </span>
                  <div>
                    <strong className="text-sm font-bold text-gray-900">
                      {ch.title}
                    </strong>
                    <span className="ml-1 text-sm text-gray-500">{ch.desc}</span>
                  </div>
                </motion.li>
              ))}
            </ol>
            <p className="mt-8 text-center text-sm font-medium text-gray-500 lg:text-left">
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
