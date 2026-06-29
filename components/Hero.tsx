'use client';

import { forwardRef, RefObject } from 'react';
import CTAButton from './CTAButton';
import { trackEvent } from '@/lib/track';

interface HeroProps {
  pricingRef: RefObject<HTMLElement>;
}

const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  { pricingRef },
  ref,
) {
  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackEvent('cta_click', '🔴 CTA Hero: Probar curso por 0.01€');
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={ref}
      id="inicio"
      className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-4 pt-24 pb-16 sm:px-6 lg:px-8 scroll-mt-16"
    >
      <div className="mx-auto w-full max-w-3xl text-center">
        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C0281A]/30 bg-[#C0281A]/10 px-4 py-1.5 text-xs font-semibold text-[#C0281A]">
          <span className="h-2 w-2 rounded-full bg-[#C0281A]" />
          Ebook PDF · Acceso inmediato
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Gané mis primeros{' '}
          <span className="text-[#C0281A]">500€</span>{' '}
          vendiendo por WhatsApp sin tener tienda online
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
          Sin web. Sin seguidores. Sin stock. Solo WhatsApp y{' '}
          <span className="font-bold text-white">3€/día en publicidad</span>.
        </p>

        {/* CTA + rating */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
          <CTAButton href="#precio" large onClick={scrollToPricing}>
            Probar curso por 0.01€ →
          </CTAButton>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="flex">⭐⭐⭐⭐⭐</span>
            <span>4.9/5 — 200+ lectores</span>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-500">
          <span>📥 Descarga inmediata</span>
          <span>🔒 Pago 100% seguro</span>
          <span>🛡️ Garantía 30 días</span>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-10 grid w-full max-w-sm grid-cols-3 gap-4 border-t border-gray-800 pt-8">
          <div className="text-center">
            <span className="text-2xl font-extrabold text-white sm:text-3xl">500€</span>
            <p className="mt-1 text-xs text-gray-400 sm:text-sm">Ganados primer mes</p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-extrabold text-white sm:text-3xl">200+</span>
            <p className="mt-1 text-xs text-gray-400 sm:text-sm">Personas lo aplican</p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-extrabold text-white sm:text-3xl">0€</span>
            <p className="mt-1 text-xs text-gray-400 sm:text-sm">Inversión inicial</p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
