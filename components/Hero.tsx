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
    const duration = 2000; // 2s
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
      <span className="text-2xl font-extrabold text-white sm:text-3xl">
        {count}
        {suffix}
      </span>
      <p className="mt-1 text-xs text-gray-400 sm:text-sm">{label}</p>
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
    <motion.div aria-hidden="true"
      className="relative mx-auto h-[500px] w-[260px] rounded-[2.5rem] border-4 border-gray-700 bg-[#0d0d0d] p-3 shadow-2xl sm:h-[540px] sm:w-[280px]"
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.6 }}
    >
      {/* Notch */}
      <div className="mx-auto mb-4 h-5 w-28 rounded-full bg-black" />

      {/* Chat header */}
      <div className="mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-xs font-bold text-white">
          W
        </div>
        <div className="text-left">
          <p className="text-xs font-semibold text-white">Cliente potencial</p>
          <p className="text-[10px] text-gray-500">En línea</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 overflow-hidden">
        {chatMessages.map((msg, i) => (
          <motion.div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
              msg.side === 'right'
                ? 'self-end rounded-br-sm bg-[#25D366] text-white'
                : 'self-start rounded-bl-sm bg-[#1f2c33] text-gray-100'
            }`}
            initial={{ opacity: 0, x: msg.side === 'right' ? 30 : -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 + i * 0.25, ease: 'easeOut' }}
          >
            {msg.text}
          </motion.div>
        ))}

        {/* Animated typing indicator */}
        <motion.div
          className="self-start flex items-center gap-1 rounded-2xl rounded-bl-sm bg-[#1f2c33] px-3 py-2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.2 + chatMessages.length * 0.25 }}
        >
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.1s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Floating glowing particles (background) ───────────────────
function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 6 + 4,
  }));

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

  // ── background glow movement ────────────────────────────────
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handle, { passive: true });
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 + i * 0.12 },
    }),
  };

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#0d0d0d] px-4 pt-24 pb-16 sm:px-6 lg:px-8"
    >
      {/* ── Background glow that follows mouse ── */}
      <div
        className="pointer-events-none absolute -inset-40 opacity-30 blur-[120px] transition-all duration-700"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, #C0281A 0%, transparent 70%)`,
        }}
      />

      {/* ── Gradient overlay edges ── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d]" />

      {/* ── Floating particles ── */}
      <ParticleField />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* ── Left column: text + CTAs ── */}
        <motion.div
          className="text-center lg:text-left"
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C0281A]/30 bg-[#C0281A]/10 px-4 py-1.5 text-xs font-semibold text-[#C0281A]"
            variants={staggerItem}
            custom={0}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#C0281A]" />
            Ebook PDF · Acceso inmediato
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
            variants={staggerItem}
            custom={1}
          >
            <span className="inline-block">Gané mis primeros</span>{' '}
            <span className="inline-block text-[#C0281A]">500€</span>{' '}
            <span className="inline-block">vendiendo por</span>{' '}
            <span className="inline-block">WhatsApp sin tener</span>{' '}
            <span className="inline-block">tienda online</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-gray-400 sm:text-lg lg:mx-0"
            variants={staggerItem}
            custom={2}
          >
            Sin web. Sin seguidores. Sin stock. Solo WhatsApp y{' '}
            <span className="font-bold text-white">3€/día en publicidad</span>.
            El método paso a paso que usé para empezar desde cero.
          </motion.p>

          {/* CTA + trust */}
          <motion.div
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-4 lg:justify-start"
            variants={staggerItem}
            custom={3}
          >
            <CTAButton href="#precio" large onClick={scrollToPricing}>
              Quiero el ebook por 17€ →
            </CTAButton>

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="flex">⭐⭐⭐⭐⭐</span>
              <span>4.9/5 — 200+ lectores</span>
            </div>
          </motion.div>

          {/* Badges row */}
          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-500 lg:justify-start"
            variants={staggerItem}
            custom={4}
          >
            <span className="flex items-center gap-1">📥 Descarga inmediata</span>
            <span className="flex items-center gap-1">🔒 Pago 100% seguro</span>
            <span className="flex items-center gap-1">🛡️ Garantía 30 días</span>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-800 pt-8"
            variants={staggerItem}
            custom={5}
          >
            <AnimatedCounter to={500} suffix="€" label="Ganados mi primer mes" />
            <AnimatedCounter to={200} suffix="+" label="Personas lo aplican" />
            <AnimatedCounter to={0} suffix="€" label="Inversión inicial" />
          </motion.div>
        </motion.div>

        {/* ── Right column: phone mockup ── */}
        <div className="hidden lg:flex lg:justify-center">
          <PhoneMockup />
        </div>
      </div>

      {/* ── Mobile phone mockup ── */}
      <div className="relative z-10 mt-8 lg:hidden">
        <PhoneMockup />
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center gap-1 text-xs text-gray-600"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span>Descubre más</span>
        </motion.div>
      </motion.div>
    </section>
  );
});

export default Hero;
