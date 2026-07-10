import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/'],
      },
    ],
    sitemap: 'https://ibericosgourmet.vercel.app/sitemap.xml',
    // Using both static and dynamic sitemaps — static takes precedence on Vercel
  };
}
