'use client';

import { useState, useEffect, RefObject } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/track';

interface NavbarProps {
  heroRef: RefObject<HTMLElement>;
}

export default function Navbar({ heroRef }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-[#0d0d0d]/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link
          href="/"
          className="text-base font-bold text-white sm:text-xl"
          onClick={(e) => {
            e.preventDefault();
            heroRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Vende por WhatsApp
        </Link>
        <Link
          href="#precio"
          className="rounded-lg bg-[#C0281A] px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-sm lg:px-6 lg:py-3 lg:text-base"
          onClick={() => {
            trackEvent(
              'cta_click',
              '🔴 CTA Navbar: Comprar por 17€'
            );
          }}
        >
          Comprar por 17€
        </Link>
      </nav>
    </header>
  );
}
