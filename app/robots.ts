import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibericosgourmet.vercel.app';
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/checkout/'] }], sitemap: `${baseUrl}/sitemap.xml` };
}
