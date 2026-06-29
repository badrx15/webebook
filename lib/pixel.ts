'use client';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Safely fire a Meta Pixel event via `fbq('track', event, params)`.
 *
 * @example
 * pixelEvent('Purchase', { value: 4, currency: 'EUR', content_name: 'Ebook WhatsApp' });
 */
export function pixelEvent(
  event: string,
  params?: Record<string, string | number | undefined>,
): void {
  window.fbq?.('track', event, params);
}
