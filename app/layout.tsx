import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import FacebookPixel from '@/components/FacebookPixel';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cómo vender por WhatsApp sin tienda online | Curso por 4€',
  description:
    'Gané mis primeros 500€ vendiendo por WhatsApp sin tienda online. Sin web, sin seguidores, sin stock. Solo WhatsApp y 3€/día en publicidad. Descarga inmediata.',
  keywords: [
    'vender por WhatsApp',
    'ebook WhatsApp',
    'negocio sin tienda online',
    'vender sin stock',
    'WhatsApp Business',
    'Meta Ads',
    'contraembolso',
    'emprendimiento',
  ],
  authors: [{ name: 'Vende por WhatsApp' }],
  creator: 'Vende por WhatsApp',
  publisher: 'Vende por WhatsApp',
  metadataBase: new URL('https://ebook-negocios.vercel.app'),
  openGraph: {
    title: 'Cómo vender por WhatsApp sin tienda online | Ebook PDF',
    description:
      'Aprende a vender por WhatsApp sin web, sin seguidores, sin stock y con 3€/día en publicidad. Curso online por 4€.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Vende por WhatsApp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cómo vender por WhatsApp sin tienda online | Ebook PDF',
    description:
      'Aprende a vender por WhatsApp sin web, sin seguidores, sin stock y con 3€/día en publicidad.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="font-sans antialiased">
        <FacebookPixel />
        {children}
      </body>
    </html>
  );
}
