import type { Metadata } from 'next';
import { getData } from '@/lib/data-store';
import { AdminDataProvider } from '@/lib/admin-store-context';
import { OrderNotificationProvider } from '@/lib/order-notification-context';
import Sidebar from '@/components/Sidebar';
import OrderToast from '@/components/OrderToast';
import { ThemeProvider } from '@/lib/theme';

export const metadata: Metadata = {
  title: 'SalesPro - Panel de Administración',
  description: 'Gestiona tus ventas, productos, márgenes y gastos.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialData = await getData();

  return (
    <ThemeProvider>
      <AdminDataProvider initialData={initialData}>
        <OrderNotificationProvider>
          <Sidebar />
          <main className="lg:pl-[var(--sidebar-width)] min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto page-enter">
              {children}
            </div>
          </main>
          <OrderToast />
        </OrderNotificationProvider>
      </AdminDataProvider>
    </ThemeProvider>
  );
}
