'use client';

import { forwardRef, RefObject } from 'react';
import Link from 'next/link';

interface FooterProps {
  heroRef: RefObject<HTMLElement>;
}

const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { heroRef },
  ref
) {
  return (
    <footer ref={ref} className="bg-[#0d0d0d] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <Link
          href="/"
          className="text-lg font-bold text-white"
          onClick={(e) => {
            e.preventDefault();
            heroRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Vende por WhatsApp
        </Link>
        <p className="text-sm text-gray-400">
          © 2026 Vende por WhatsApp · Todos los derechos reservados
        </p>
        <a
          href="mailto:contacto@vendeporwhatsapp.com"
          className="text-sm text-gray-400 transition-colors hover:text-white"
        >
          contacto@vendeporwhatsapp.com
        </a>
      </div>
    </footer>
  );
});

export default Footer;
