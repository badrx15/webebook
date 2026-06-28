'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { trackEvent } from '@/lib/track';
import { pixelEvent } from '@/lib/pixel';

export default function ExitoPage() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    trackEvent(
      'success_page',
      '🎉 Compra completada — usuario en /exito',
      'El cliente ha llegado a la página de éxito tras el pago'
    );

    // Meta Pixel: Purchase conversion
    pixelEvent('Purchase', {
      content_name: 'Ebook WhatsApp',
      content_category: 'ebook',
      value: 17,
      currency: 'EUR',
    });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
      <motion.div
        className="max-w-md text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <span className="text-5xl" aria-hidden="true">
          🎉
        </span>
        <motion.h1
          className="mt-6 text-3xl font-extrabold text-[#0d0d0d] sm:text-4xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          ¡Gracias por tu compra!
        </motion.h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Tu pago se ha procesado correctamente. En breve recibirás el enlace de
          descarga de tu ebook{' '}
          <strong>&ldquo;Cómo vender por WhatsApp sin tienda online&rdquo;</strong>.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Si tienes cualquier duda, escríbenos a{' '}
          <a
            href="mailto:contacto@vendeporwhatsapp.com"
            className="text-[#C0281A] underline"
          >
            contacto@vendeporwhatsapp.com
          </a>
          .
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#0d0d0d] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          ← Volver al inicio
        </Link>
      </motion.div>
    </main>
  );
}
