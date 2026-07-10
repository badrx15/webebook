'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useOrderNotifications } from '@/lib/order-notification-context';
import { formatCurrency } from '@/lib/utils';

export default function OrderToast() {
  const { newOrders, dismiss } = useOrderNotifications();
  const timersRef = useRef<Set<string>>(new Set());

  // Auto-dismiss each order once after 10 seconds
  useEffect(() => {
    if (newOrders.length === 0) return;
    const timers = newOrders
      .filter(order => !timersRef.current.has(order.id)) // Only set timer for new ones
      .map(order => {
        timersRef.current.add(order.id);
        return setTimeout(() => {
          timersRef.current.delete(order.id);
          dismiss(order.id);
        }, 10000);
      });
    return () => timers.forEach(t => clearTimeout(t));
  }, [newOrders, dismiss]);

  if (newOrders.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {newOrders.map(order => (
        <div
          key={order.id}
          className="relative bg-white rounded-xl shadow-2xl border border-emerald-200 overflow-hidden animate-slide-up"
        >
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-400" />

          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🛒</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ¡Nuevo pedido web!
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => dismiss(order.id)}
                className="text-gray-300 hover:text-gray-500 transition-colors p-0.5"
                aria-label="Cerrar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Order info */}
            <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-1.5 text-sm">
              {order.shippingAddress && (
                <p className="text-xs text-gray-600">
                  📍 {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.province}
                </p>
              )}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {order.paymentMethod === 'contrareembolso' ? '💵 Contra reembolso' : '💳 Tarjeta'}
                </span>
                <span className="font-bold text-emerald-700">
                  {formatCurrency(order.totalAmount, '€')}
                </span>
              </div>
            </div>

            {/* Action button */}
            <Link
              href="/admin/orders"
              onClick={() => dismiss(order.id)}
              className="mt-3 block w-full text-center py-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold
                         hover:bg-emerald-100 active:bg-emerald-200 transition-all"
            >
              Ver pedido →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
