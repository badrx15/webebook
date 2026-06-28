'use client';

import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: '¿Necesito experiencia previa?',
    a: 'No, está pensado para empezar desde cero. Cada capítulo explica los pasos con ejemplos claros y plantillas para copiar.',
  },
  {
    q: '¿Funciona en mi país?',
    a: 'Sí, aplica en cualquier país de habla hispana. El método funciona donde tengas acceso a WhatsApp, Meta Ads y servicios de envío locales.',
  },
  {
    q: '¿Cómo recibo el ebook?',
    a: 'Inmediatamente después del pago recibes el enlace de descarga en tu correo electrónico. Descarga el PDF y consúltalo cuando quieras.',
  },
  {
    q: '¿Y si no me sirve?',
    a: 'Garantía de 30 días: si el contenido no te ayuda, te devolvemos el dinero sin preguntas. Sin riesgo para ti.',
  },
  {
    q: '¿Necesito invertir mucho?',
    a: 'Con 3€/día en publicidad es suficiente para empezar. El ebook te enseña a validar tu idea con el menor presupuesto posible.',
  },
];

const FAQ = forwardRef<HTMLElement>((_, ref) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section ref={ref} id="faq" className="bg-[#f5f5f5] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <motion.h2
          className="mb-12 text-center text-3xl font-extrabold text-[#0d0d0d] sm:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          Preguntas frecuentes
        </motion.h2>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 sm:text-lg"
                aria-expanded={openIndex === i}
              >
                {faq.q}
                <motion.span
                  className="ml-4 flex-shrink-0 text-xl text-[#C0281A]"
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <p className="border-t border-gray-100 px-6 py-4 text-base leading-relaxed text-gray-600">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

FAQ.displayName = 'FAQ';
export default FAQ;
