'use client';

import { useState } from 'react';
import { pixelEvent } from '@/lib/pixel';

interface PayPalButtonProps {
  disabled?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

export default function PayPalButton({ disabled, onLoadingChange }: PayPalButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    onLoadingChange?.(true);
    setError('');

    // Meta Pixel: InitiateCheckout
    pixelEvent('InitiateCheckout', {
      content_name: 'Curso WhatsApp',
      content_category: 'curso',
      value: 3,
      currency: 'EUR',
    });

    try {
      const res = await fetch('/api/checkout-paypal', { method: 'POST' });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al procesar el pago con PayPal');
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió la URL de pago de PayPal');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Algo salió mal. Inténtalo de nuevo.';
      setError(message);
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={disabled || loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0070BA] px-6 py-4 text-base font-bold text-white transition-all hover:bg-[#003087] focus:outline-none focus:ring-2 focus:ring-[#0070BA] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:px-10 sm:py-5 sm:text-xl"
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
            Redirigiendo a PayPal…
          </span>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
            </svg>
            Pagar con PayPal →
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-center text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
