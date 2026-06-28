'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const benefits = [
  'Cómo elegir un producto que se venda solo',
  'Cómo crear un anuncio en Meta Ads con 3€/día',
  'Los mensajes exactos para cerrar ventas por WhatsApp',
  'Cómo cobrar con contraembolso sin riesgos',
  'Cómo gestionar envíos sin tener stock',
  'Plantillas listas para copiar y usar hoy mismo',
];

const itemVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.1 },
  }),
};

const Solution = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} id="sistema" className="bg-[#f5f5f5] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="mb-14 text-center text-3xl font-extrabold text-[#0d0d0d] sm:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          Este ebook te da el sistema exacto que yo uso
        </motion.h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={itemVariants}
            >
              <span
                className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#C0281A] text-sm font-bold text-white"
                aria-hidden="true"
              >
                ✓
              </span>
              <p className="text-lg font-semibold text-gray-800">{benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

Solution.displayName = 'Solution';
export default Solution;
