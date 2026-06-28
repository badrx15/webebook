'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'María G.',
    flag: '🇲🇽',
    text: 'Empecé a vender la primera semana. Nunca pensé que WhatsApp podía ser un negocio real.',
  },
  {
    name: 'Carlos R.',
    flag: '🇨🇴',
    text: 'Lo apliqué con productos de mi región y en 30 días ya tenía mis primeras ventas sin invertir nada en stock.',
  },
  {
    name: 'Sofía M.',
    flag: '🇦🇷',
    text: 'El capítulo de los mensajes para cerrar ventas solo ya vale los 17€. Clarísimo y directo.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.15 },
  }),
};

const Testimonials = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section
      ref={ref}
      id="testimonios"
      className="bg-[#0d0d0d] px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="mb-14 text-center text-3xl font-extrabold text-white sm:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          Lo que dicen quienes ya lo aplican
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.article
              key={i}
              className="flex flex-col rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={cardVariants}
            >
              <div
                className="mb-3 text-lg text-[#C0281A]"
                aria-label="5 estrellas"
              >
                ★★★★★
              </div>
              <p className="mb-5 flex-1 text-base italic leading-relaxed text-gray-300">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-2 border-t border-gray-700 pt-4">
                <span className="text-xl" aria-hidden="true">
                  {t.flag}
                </span>
                <strong className="text-white">{t.name}</strong>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
});

Testimonials.displayName = 'Testimonials';
export default Testimonials;
