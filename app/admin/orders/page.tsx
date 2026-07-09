'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { OrderStatus } from '@/lib/types';

export default function OrdersPage() {
  const { data, updateOrderStatus, deleteOrder } = useStore();
  const { orders, settings } = data;
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

  const filtered = statusFilter ? orders.filter(o => o.status === statusFilter) : orders;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pendiente': return 'chip-yellow';
      case 'pagado': return 'chip-blue';
      case 'cancelado': return 'chip-red';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'pagado': return 'Pagado';
      case 'cancelado': return 'Cancelado';
    }
  };

  const nextStatus = (status: OrderStatus): OrderStatus | null => {
    switch (status) {
      case 'pendiente': return 'pagado';
      case 'pagado': return null;
      case 'cancelado': return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pedidos Web</h1>
          <p className="text-[var(--text-secondary)] mt-1">{orders.length} pedidos recibidos</p>
        </div>
        <div className="flex gap-2">
          {(['', 'pendiente', 'pagado', 'cancelado'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--card-hover)]'
              }`}>
              {s ? getStatusLabel(s) : 'Todos'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-[var(--text-secondary)]">
            {orders.length === 0 ? 'No hay pedidos web todavía.' : 'No hay pedidos con ese estado.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
            <div key={order.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="chip-blue">#{order.id.slice(0, 8)}</span>
                    <span className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</span>
                    <span className="chip">{order.paymentMethod === 'tarjeta' ? '💳 Tarjeta' : '💵 Contrareembolso'}</span>
                    <span className="text-xs text-[var(--text-secondary)]">{formatDateTime(order.createdAt)}</span>
                  </div>

                  {/* Products */}
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span>{item.productName} <span className="text-[var(--text-secondary)]">×{item.quantity}</span></span>
                        <span className="font-medium">{formatCurrency(item.totalPrice, settings.currencySymbol)}</span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <p className="text-xs text-[var(--text-secondary)] italic">📝 {order.notes}</p>
                  )}

                  {order.squarePaymentId && (
                    <p className="text-xs text-[var(--text-secondary)]">ID pago: {order.squarePaymentId}</p>
                  )}
                </div>

                <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Total</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(order.totalAmount, settings.currencySymbol)}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    {nextStatus(order.status) && (
                      <button
                        onClick={() => { if (confirm(`¿Marcar como "${getStatusLabel(nextStatus(order.status)!)}"?`)) updateOrderStatus(order.id, nextStatus(order.status)!); }}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        → {getStatusLabel(nextStatus(order.status)!)}
                      </button>
                    )}
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelado')}
                      className="btn-ghost text-red-500 hover:text-red-700 text-xs"
                    >
                      Cancelar pedido
                    </button>
                    <button
                      onClick={() => { if (confirm('¿Eliminar este pedido permanentemente?')) deleteOrder(order.id); }}
                      className="btn-ghost text-red-500 hover:text-red-700 text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
