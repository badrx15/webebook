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
      className="bg-[#0d0d0d] px-4 py-16 sm:px-6 lg:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="mb-10 text-center text-2xl font-extrabold text-white sm:mb-14 sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          Lo que dicen quienes ya lo aplican
        </motion.h2>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.article
              key={i}
              className="flex flex-col rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5 sm:p-6"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={cardVariants}
            >
              <div
                className="mb-2 text-sm text-[#C0281A] sm:mb-3 sm:text-lg"
                aria-label="5 estrellas"
              >
                ★★★★★
              </div>
              <p className="mb-4 flex-1 text-sm italic leading-relaxed text-gray-300 sm:mb-5 sm:text-base">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-2 border-t border-gray-700 pt-3 sm:pt-4">
                <span className="text-base sm:text-xl" aria-hidden="true">
                  {t.flag}
                </span>
                <strong className="text-sm text-white sm:text-base">{t.name}</strong>
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
