'use client';

import { useEffect, useRef } from 'react';

export default function VisitorTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per session (first page load)
    if (tracked.current) return;
    tracked.current = true;

    // Fire-and-forget: notify Telegram about the visit
    fetch('/api/telegram-visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: window.location.pathname,
        referrer: document.referrer || '',
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});
  }, []);

  return null;
}
