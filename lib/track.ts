'use client';

import type { EventType } from '@/lib/telegram';

/**
 * Fire-and-forget tracking helper for client components.
 * Sends an event to `/api/notify` without blocking the UI.
 */
export function trackEvent(
  event: EventType,
  label?: string,
  details?: string
): void {
  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, label, details }),
  }).catch(() => {
    // Silently fail — tracking is auxiliary
  });
}
