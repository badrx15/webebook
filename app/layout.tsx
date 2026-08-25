import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MetaPixel from '@/components/MetaPixel';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ibericosgourmet.vercel.app';

export const metadata: Metadata = {
  title: 'Ibéricos Gourmet - Jamón Ibérico Cebo de Campo 75%',
  description: 'Jamón de cebo de campo 75% raza ibérica, cortado a cuchillo y envasado al vacío. Pack de 5 sobres de 100g por 39,99€.',
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'es_ES', siteName: 'Ibéricos Gourmet', title: 'Jamón Ibérico Cebo de Campo 75%', description: 'Pack de 5 sobres de 100g, cortado a cuchillo. 39,99€.', url: siteUrl },
  robots: { index: true, follow: true },
  verification: { google: 'AZ5GByvwY9Fg9EFUEkdFdOlUQ1G-OyEaWSbZ5vR1xZo' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${inter.className} antialiased`}><MetaPixel /><WhatsAppFloat />{children}</body></html>;
}
