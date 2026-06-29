'use client';

import { useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Pain from '@/components/Pain';
import Solution from '@/components/Solution';
import WhatYouGet from '@/components/WhatYouGet';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { trackEvent } from '@/lib/track';
import { pixelEvent } from '@/lib/pixel';

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const painRef = useRef<HTMLElement>(null);
  const solutionRef = useRef<HTMLElement>(null);
  const whatYouGetRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const tracked = useRef(false);

  // Send page view notification on first load
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android/i.test(ua);

    trackEvent(
      'page_view',
      `${isMobile ? '📱' : '💻'} Visita a la landing`,
      `Desde: ${document.referrer || 'Directo'}  |  Dispositivo: ${isMobile ? 'Móvil' : 'Escritorio'}`
    );

    // Meta Pixel: PageView already fired by FacebookPixel component
    // Meta Pixel: ViewContent for landing page visit
    pixelEvent('ViewContent', {
      content_name: 'Landing Ebook WhatsApp',
      content_category: 'ebook',
      value: 3,
      currency: 'EUR',
    });
  }, []);

  return (
    <>
      <Navbar heroRef={heroRef} />
      <main>
        <Hero ref={heroRef} pricingRef={pricingRef} />
        <Pain ref={painRef} />
        <Solution ref={solutionRef} />
        <WhatYouGet ref={whatYouGetRef} />
        <Testimonials ref={testimonialsRef} />
        <Pricing ref={pricingRef} />
        <FAQ ref={faqRef} />
      </main>
      <Footer heroRef={heroRef} />
    </>
  );
}
