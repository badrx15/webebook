'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { useOrderNotifications } from '@/lib/order-notification-context';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Productos', icon: '📦' },
  { href: '/admin/sales', label: 'Ventas', icon: '💰' },
  { href: '/admin/orders', label: 'Pedidos Web', icon: '🛒' },
  { href: '/admin/expenses', label: 'Gastos', icon: '💸' },
  { href: '/admin/reports', label: 'Reportes', icon: '📈' },
  { href: '/admin/settings', label: 'Configuración', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { canUndo, undo } = useStore();
  const { pendingCount } = useOrderNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-[var(--bg-sidebar)] text-white shadow-lg"
        aria-label="Menú"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-[var(--sidebar-width)]
          bg-[var(--bg-sidebar)] text-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold">SalesPro</h1>
              <p className="text-xs text-gray-400">Gestión de Ventas</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {item.href === '/admin/orders' && pendingCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center animate-pulse">
                    {pendingCount}
                  </span>
                )}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {/* Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                       text-gray-400 hover:text-white hover:bg-white/10
                       disabled:opacity-30 disabled:cursor-not-allowed"
            title="Deshacer última acción"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" />
            </svg>
            <span>Deshacer</span>
            {canUndo && <span className="ml-auto w-2 h-2 rounded-full bg-blue-400" />}
          </button>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                       text-gray-400 hover:text-white hover:bg-white/10"
            title="Cambiar tema"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>

          <p className="text-xs text-gray-500 text-center pt-1">
            SalesPro v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
