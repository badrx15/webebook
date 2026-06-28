'use client';

import { forwardRef, RefObject } from 'react';
import { motion } from 'framer-motion';
import CTAButton from './CTAButton';
import { trackEvent } from '@/lib/track';

interface HeroProps {
  pricingRef: RefObject<HTMLElement>;
}

const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  { pricingRef },
  ref
) {
  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    trackEvent(
      'cta_click',
      '🔴 CTA Hero: Quiero el ebook por 17€'
    );

    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <section
      ref={ref}
      id="inicio"
      className="flex min-h-screen items-center bg-[#0d0d0d] px-4 pt-20 pb-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-400"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          Ebook PDF · Método práctico para vender online
        </motion.p>

        <motion.h1
          className="mb-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: 'easeOut', delay: 0.15 },
            },
          }}
        >
          Gané mis primeros 500€ vendiendo por WhatsApp sin tener tienda online
        </motion.h1>

        <motion.p
          className="mb-10 text-lg text-gray-400 sm:text-xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: 'easeOut', delay: 0.3 },
            },
          }}
        >
          Sin web. Sin seguidores. Sin stock. Solo WhatsApp y 3€/día en
          publicidad.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: 'easeOut', delay: 0.45 },
            },
          }}
        >
          <CTAButton href="#precio" large onClick={scrollToPricing}>
            Quiero el ebook por 17€ →
          </CTAButton>
        </motion.div>

        <motion.p
          className="mt-8 text-sm text-gray-500"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 0.7, delay: 0.6 },
            },
          }}
        >
          Descarga inmediata · Pago seguro · Garantía 30 días
        </motion.p>
      </div>
    </section>
  );
});

export default Hero;
