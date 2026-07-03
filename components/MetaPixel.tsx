'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PIXEL_ID = '1616130006351651';

export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // Inject the Meta Pixel base script only once
    if (typeof window === 'undefined') return;
    if ((window as any).__metaPixelInjected) return;
    (window as any).__metaPixelInjected = true;

    // Standard Meta Pixel code
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Noscript fallback image
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);
  }, []);

  // Fire PageView on route changes (SPA navigation)
  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).fbq) return;
    (window as any).fbq('track', 'PageView');
  }, [pathname]);

  return null;
}
