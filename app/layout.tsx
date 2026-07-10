import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MetaPixel from '@/components/MetaPixel';
import VisitorTracker from '@/components/VisitorTracker';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = 'https://ibericosgourmet.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'Ibéricos Gourmet - Jamón Ibérico Cebo de Campo | Envío a Domicilio',
    template: '%s | Ibéricos Gourmet',
  },
  description: 'Venta de jamón ibérico de cebo de campo 75% raza ibérica. Cortado a cuchillo y envasado al vacío desde Extremadura. Compra online con envío a domicilio.',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Ibéricos Gourmet',
    title: 'Ibéricos Gourmet - Jamón Ibérico de la Mejor Calidad',
    description: 'Venta de jamón ibérico de cebo de campo 75% raza ibérica. Cortado a cuchillo y envasado al vacío. Envío a domicilio.',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ibéricos Gourmet',
    description: 'Jamón ibérico cortado a cuchillo, envasado al vacío.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'AZ5GByvwY9Fg9EFUEkdFdOlUQ1G-OyEaWSbZ5vR1xZo',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ibéricos Gourmet',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: 'Venta de jamón ibérico de cebo de campo 75% raza ibérica. Cortado a cuchillo y envasado al vacío.',
  telephone: '+34614070656',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Extremadura',
    addressCountry: 'ES',
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <MetaPixel />
        <VisitorTracker />
        <WhatsAppFloat />
        {children}
      </body>
    </html>
  );
}
