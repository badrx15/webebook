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

export const metadata: Metadata = {
  title: 'Ibéricos Gourmet - Jamón de la Mejor Calidad',
  description: 'Venta de jamón ibérico de cebo de campo 75% raza ibérica. Cortado a cuchillo y envasado al vacío. La mejor selección de productos ibéricos gourmet.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <MetaPixel />
        <VisitorTracker />
        <WhatsAppFloat />
        {children}
      </body>
    </html>
  );
}
