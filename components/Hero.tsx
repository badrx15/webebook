'use client';

import { forwardRef, RefObject, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CTAButton from './CTAButton';
import { trackEvent } from '@/lib/track';

interface HeroProps {
  pricingRef: RefObject<HTMLElement>;
}

// ─── Animated counter ──────────────────────────────────────────
function AnimatedCounter({
  to,
  suffix = '',
  label,
}: {
  to: number;
  suffix?: string;
  label: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 30;
    const increment = to / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [to]);

  return (
    <div className="text-center" aria-live="polite" aria-label={`${to}${suffix} — ${label}`}>
      <span className="text-xl font-extrabold text-white sm:text-2xl md:text-3xl">
        {count}
        {suffix}
      </span>
      <p className="mt-0.5 text-[11px] text-gray-400 sm:mt-1 sm:text-xs md:text-sm">
        {label}
      </p>
    </div>
  );
}

// ─── Floating WhatsApp chat bubbles ────────────────────────────
const chatMessages = [
  { side: 'left', text: 'Hola, ¿el producto sigue disponible?' },
  { side: 'right', text: 'Sí, te explico cómo funciona 😊' },
  { side: 'left', text: 'Y ¿cómo sería el pago?' },
  { side: 'right', text: 'Contraembolso, pagas al recibir' },
  { side: 'left', text: 'Perfecto, lo quiero 🙌' },
  { side: 'right', text: '✅ Venta cerrada' },
];

function PhoneMockup() {
  return (
    <motion.div
      aria-hidden="true"
      className="relative mx-auto w-[220px] rounded-[2rem] border-4 border-gray-700 bg-[#0d0d0d] p-2.5 shadow-2xl sm:w-[240px] md:w-[260px] md:p-3 md:rounded-[2.5rem]"
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
    >
      {/* Notch */}
      <div className="mx-auto mb-2 h-4 w-20 rounded-full bg-black md:mb-4 md:h-5 md:w-28" />

      {/* Chat header */}
      <div className="mb-2 flex items-center gap-1.5 border-b border-gray-800 pb-1.5 md:mb-3 md:gap-2 md:pb-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-[9px] font-bold text-white md:h-8 md:w-8 md:text-xs">
          W
        </div>
        <div className="text-left">
          <p className="text-[10px] font-semibold text-white md:text-xs">Cliente potencial</p>
          <p className="text-[8px] text-gray-500 md:text-[10px]">En línea</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-1.5 md:gap-2">
        {chatMessages.map((msg, i) => (
          <motion.div
            key={i}
            className={`max-w-[88%] rounded-xl px-2 py-1.5 text-[10px] leading-relaxed md:rounded-2xl md:px-3 md:py-2 md:text-xs ${
              msg.side === 'right'
                ? 'self-end rounded-br-sm bg-[#25D366] text-white'
                : 'self-start rounded-bl-sm bg-[#1f2c33] text-gray-100'
            }`}
            initial={{ opacity: 0, x: msg.side === 'right' ? 20 : -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 + i * 0.2, ease: 'easeOut' }}
          >
            {msg.text}
          </motion.div>
        ))}

        {/* Animated typing indicator */}
        <motion.div
          className="self-start flex items-center gap-1 rounded-xl rounded-bl-sm bg-[#1f2c33] px-2 py-1.5 md:rounded-2xl md:px-3 md:py-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.8 + chatMessages.length * 0.2 }}
        >
          <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 md:h-1.5 md:w-1.5" />
          <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 md:h-1.5 md:w-1.5 [animation-delay:0.08s]" />
          <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 md:h-1.5 md:w-1.5 [animation-delay:0.16s]" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Particles (reduced on mobile for performance) ─────────────
function ParticleField() {
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  const count = isMobile ? 6 : 20;
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (isMobile ? 2 : 4) + (isMobile ? 1 : 2),
    delay: Math.random() * 5,
    duration: Math.random() * 6 + 4,
  }));

  // Don't render particles on mobile for performance
  if (isMobile) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#C0281A]/10"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Hero component ───────────────────────────────────────
const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  { pricingRef },
  ref,
) {
  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackEvent('cta_click', '🔴 CTA Hero: Quiero el ebook por 17€');
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── background glow movement (desktop only) ──────────────────
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handle = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handle, { passive: true });
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', delay: 0.05 + i * 0.1 },
    }),
  };

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#0d0d0d] px-4 pt-20 pb-12 sm:px-6 lg:pb-16 lg:pt-24"
    >
      {/* ── Background glow (desktop only) ── */}
      {isDesktop && (
        <div
          className="pointer-events-none absolute -inset-40 opacity-30 blur-[120px] transition-all duration-700"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, #C0281A 0%, transparent 70%)`,
          }}
        />
      )}

      {/* ── Gradient overlay edges ── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d]" />

      {/* ── Floating particles ── */}
      <ParticleField />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-6 md:gap-8 lg:grid-cols-2 lg:gap-16">
        {/* ── Left column: text + CTAs ── */}
        <motion.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#C0281A]/30 bg-[#C0281A]/10 px-3 py-1 text-[11px] font-semibold text-[#C0281A] md:mb-6 md:gap-2 md:px-4 md:py-1.5 md:text-xs"
            variants={staggerItem}
            custom={0}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#C0281A]" />
            Ebook PDF · Acceso inmediato
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
            variants={staggerItem}
            custom={1}
          >
            Gané mis primeros{' '}
            <span className="text-[#C0281A]">500€</span>{' '}
            vendiendo por WhatsApp sin tener tienda online
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-400 md:mt-5 md:max-w-lg md:text-base lg:mx-0 lg:text-lg"
            variants={staggerItem}
            custom={2}
          >
            Sin web. Sin seguidores. Sin stock. Solo WhatsApp y{' '}
            <span className="font-bold text-white">3€/día en publicidad</span>.
          </motion.p>

          {/* CTA + rating */}
          <motion.div
            className="mt-6 flex w-full max-w-sm flex-col items-center gap-3 md:mt-8 md:flex-row md:gap-4 lg:justify-start"
            variants={staggerItem}
            custom={3}
          >
            <CTAButton href="#precio" large onClick={scrollToPricing} className="w-full md:w-auto">
              Quiero el ebook por 17€ →
            </CTAButton>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 md:text-xs">
              <span className="flex">⭐⭐⭐⭐⭐</span>
              <span>4.9/5 — 200+ lectores</span>
            </div>
          </motion.div>

          {/* Badges row */}
          <motion.div
            className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] text-gray-500 md:mt-6 md:gap-5 md:text-xs lg:justify-start"
            variants={staggerItem}
            custom={4}
          >
            <span>📥 Descarga inmediata</span>
            <span>🔒 Pago 100% seguro</span>
            <span>🛡️ Garantía 30 días</span>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="mt-6 grid w-full max-w-sm grid-cols-3 gap-2 border-t border-gray-800 pt-5 md:mt-10 md:gap-4 md:pt-8"
            variants={staggerItem}
            custom={5}
          >
            <AnimatedCounter to={500} suffix="€" label="Ganados primer mes" />
            <AnimatedCounter to={200} suffix="+" label="Personas lo aplican" />
            <AnimatedCounter to={0} suffix="€" label="Inversión inicial" />
          </motion.div>
        </motion.div>

        {/* ── Right column: phone mockup (desktop) ── */}
        <div className="hidden lg:flex lg:justify-center">
          <PhoneMockup />
        </div>
      </div>

      {/* ── Mobile phone mockup (below content) ── */}
      <motion.div
        className="relative z-10 mt-6 lg:hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <PhoneMockup />
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 md:bottom-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center gap-1 text-[11px] text-gray-600 md:text-xs"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:w-5 md:h-5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span>Descubre más</span>
        </motion.div>
      </motion.div>
    </section>
  );
});

export default Hero;
