'use client';

import { useEffect } from 'react';

export default function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const tracked = sessionStorage.getItem(`viewed_${slug}`);
    if (tracked) return; // Only count once per session

    sessionStorage.setItem(`viewed_${slug}`, '1');

    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug]);

  return null;
}
