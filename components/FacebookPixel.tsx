'use client';

const PIXEL_ID = '1616130006351651';

/**
 * Loads the Meta Pixel base script once.
 * Include this inside <body> in layout.tsx.
 */
export default function FacebookPixel() {
  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}

// Self-executing pixel init — runs once, survives StrictMode
if (typeof window !== 'undefined') {
  const win = window as unknown as Record<string, unknown>;

  if (!win.fbq) {
    const n: { callMethod?: (...args: unknown[]) => void; queue: unknown[] } = {
      queue: [],
    };

    win.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    };

    win._fbq = win.fbq;
    (win.fbq as Record<string, unknown>).push = win.fbq;
    (win.fbq as Record<string, unknown>).loaded = true;
    (win.fbq as Record<string, unknown>).version = '2.0';
    (win.fbq as Record<string, unknown>).queue = n.queue;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    (win.fbq as (...args: unknown[]) => void)('init', PIXEL_ID);
    (win.fbq as (...args: unknown[]) => void)('track', 'PageView');
  }
}
