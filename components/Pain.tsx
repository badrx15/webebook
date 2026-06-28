'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const painPoints = [
  {
    emoji: '😤',
    text: 'Quieres montar un negocio pero no sabes por dónde empezar',
  },
  {
    emoji: '💸',
    text: 'No tienes dinero para invertir en stock ni en una tienda',
  },
  {
    emoji: '📱',
    text: 'Ya tienes WhatsApp pero no sabes cómo usarlo para vender',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.15 },
  }),
};

const Pain = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} id="problema" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="mb-14 text-center text-3xl font-extrabold text-[#0d0d0d] sm:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          ¿Te suena esto?
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((point, i) => (
            <motion.article
              key={i}
              className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={cardVariants}
            >
              <span className="mb-4 text-5xl" role="img" aria-hidden="true">
                {point.emoji}
              </span>
              <p className="text-lg font-medium text-gray-800">{point.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
});

Pain.displayName = 'Pain';
export default Pain;
