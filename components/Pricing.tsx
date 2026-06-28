'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/track';
import { pixelEvent } from '@/lib/pixel';

const Pricing = forwardRef<HTMLElement>((_, ref) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    // Meta Pixel: InitiateCheckout
    pixelEvent('InitiateCheckout', {
      content_name: 'Ebook WhatsApp',
      content_category: 'ebook',
      value: 17,
      currency: 'EUR',
    });

    try {
      const res = await fetch('/api/checkout', { method: 'POST' });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al procesar el pago');
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió la URL de pago');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Algo salió mal. Inténtalo de nuevo.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <section ref={ref} id="precio" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <motion.div
          className="rounded-3xl border-2 border-[#C0281A] bg-white p-10 shadow-xl sm:p-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="mb-1 text-lg text-gray-400 line-through">37€</p>
          <p className="mb-2 text-6xl font-extrabold text-[#C0281A] sm:text-7xl">
            17€
          </p>
          <p className="mb-8 text-lg font-semibold text-gray-700">
            Precio de lanzamiento
          </p>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-[#C0281A] px-10 py-5 text-xl font-bold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#C0281A] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Redirigiendo al pago…
              </span>
            ) : (
              'Quiero el ebook ahora →'
            )}
          </button>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
          )}

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-xl" aria-hidden="true">
                🛡️
              </span>
              <span className="text-xs font-medium text-gray-600">
                Garantía 30 días
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-xl" aria-hidden="true">
                🔒
              </span>
              <span className="text-xs font-medium text-gray-600">
                Pago seguro
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-xl" aria-hidden="true">
                ⬇️
              </span>
              <span className="text-xs font-medium text-gray-600">
                Descarga inmediata
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

Pricing.displayName = 'Pricing';
export default Pricing;
