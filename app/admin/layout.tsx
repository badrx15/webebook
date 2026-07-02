import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/lib/theme';

export const metadata: Metadata = {
  title: 'SalesPro - Panel de Administración',
  description: 'Gestiona tus ventas, productos, márgenes y gastos.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Sidebar />
      <main className="lg:pl-[var(--sidebar-width)] min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto page-enter">
          {children}
        </div>
      </main>
    </ThemeProvider>
  );
}
