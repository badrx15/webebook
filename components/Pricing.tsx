'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { pixelEvent } from '@/lib/pixel';
import PayPalButton from './PayPalButton';

const Pricing = forwardRef<HTMLElement>((_, ref) => {
  const [loading, setLoading] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [error, setError] = useState('');

  const isProcessing = loading || paypalLoading;

  const handleSquareCheckout = async () => {
    setLoading(true);
    setError('');

    // Meta Pixel: InitiateCheckout
    pixelEvent('InitiateCheckout', {
      content_name: 'Curso WhatsApp',
      content_category: 'curso',
      value: 1,
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
    <section ref={ref} id="precio" className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:py-24 lg:px-8 scroll-mt-16">
      <div className="mx-auto max-w-md sm:max-w-lg">
        <motion.div
          className="rounded-2xl border-2 border-[#C0281A] bg-white p-6 shadow-xl sm:rounded-3xl sm:p-10 lg:p-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="mb-1 text-5xl font-extrabold text-[#C0281A] sm:mb-2 sm:text-6xl md:text-7xl">
            0.01€
          </p>
          <p className="mb-6 text-base font-semibold text-gray-700 sm:mb-8 sm:text-lg">
            Precio de prueba
          </p>

          {/* Métodos de pago */}
          <div className="space-y-3">
            {/* Square - Tarjeta */}
            <button
              onClick={handleSquareCheckout}
              disabled={isProcessing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#C0281A] px-6 py-4 text-base font-bold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#C0281A] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:px-10 sm:py-5 sm:text-xl"
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
                <>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  Pagar con tarjeta (Visa/MC)
                </>
              )}
            </button>

            {/* PayPal */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs font-medium text-gray-400">
                  O paga con
                </span>
              </div>
            </div>

            <PayPalButton
              disabled={isProcessing}
              onLoadingChange={setPaypalLoading}
            />
          </div>

          {error && (
            <p className="mt-3 text-center text-sm font-medium text-red-600">{error}</p>
          )}

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-gray-100 pt-5 sm:mt-8 sm:gap-4 sm:pt-6">
            <div className="flex flex-col items-center gap-0.5 text-center sm:gap-1">
              <span className="text-base sm:text-xl" aria-hidden="true">🛡️</span>
              <span className="text-[11px] font-medium text-gray-600 sm:text-xs">
                Garantía 30 días
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-center sm:gap-1">
              <span className="text-base sm:text-xl" aria-hidden="true">🔒</span>
              <span className="text-[11px] font-medium text-gray-600 sm:text-xs">
                Pago seguro
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-center sm:gap-1">
              <span className="text-base sm:text-xl" aria-hidden="true">⬇️</span>
              <span className="text-[11px] font-medium text-gray-600 sm:text-xs">
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
