'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { SaleItem, PaymentMethod } from '@/lib/types';
import { formatCurrency, formatDateTime, calculateMargin, PAYMENT_METHODS } from '@/lib/utils';
import Modal from '@/components/Modal';

export default function SalesPage() {
  const { data, addSale, deleteSale } = useStore();
  const { products, sales, settings } = data;

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  // Form state
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    customerContact: '',
    paymentMethod: 'Efectivo' as PaymentMethod,
    notes: '',
  });

  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);

  const openNew = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      customerContact: '',
      paymentMethod: 'Efectivo',
      notes: '',
    });
    setCart([]);
    setShowModal(true);
  };

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.productId === productId);
      if (existing) {
        return prev.map(c =>
          c.productId === productId ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(c => c.productId !== productId));
    } else {
      setCart(prev => prev.map(c =>
        c.productId === productId ? { ...c, quantity } : c
      ));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(c => c.productId !== productId));
  };

  const cartItems: SaleItem[] = useMemo(() => {
    return cart.map(c => {
      const product = products.find(p => p.id === c.productId);
      if (!product) return null;
      return {
        productId: product.id,
        productName: product.name,
        quantity: c.quantity,
        unitCost: product.costPrice,
        unitPrice: product.sellingPrice,
        totalCost: product.costPrice * c.quantity,
        totalPrice: product.sellingPrice * c.quantity,
        profit: (product.sellingPrice - product.costPrice) * c.quantity,
      };
    }).filter((item): item is SaleItem => item !== null);
  }, [cart, products]);

  const totals = useMemo(() => {
    const totalAmount = cartItems.reduce((s, i) => s + i.totalPrice, 0);
    const totalCost = cartItems.reduce((s, i) => s + i.totalCost, 0);
    const grossProfit = totalAmount - totalCost;
    const profitMargin = totalAmount > 0 ? (grossProfit / totalAmount) * 100 : 0;
    return { totalAmount, totalCost, grossProfit, profitMargin };
  }, [cartItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Añade al menos un producto a la venta.');
      return;
    }

    addSale({
      date: form.date,
      items: cartItems,
      totalAmount: totals.totalAmount,
      totalCost: totals.totalCost,
      grossProfit: totals.grossProfit,
      profitMargin: totals.profitMargin,
      customerName: form.customerName,
      customerContact: form.customerContact,
      paymentMethod: form.paymentMethod,
      notes: form.notes,
    });

    setShowModal(false);
  };

  const filteredSales = useMemo(() => {
    if (!search) return [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const q = search.toLowerCase();
    return sales.filter(s =>
      s.customerName.toLowerCase().includes(q) ||
      s.items.some(i => i.productName.toLowerCase().includes(q)) ||
      s.paymentMethod.toLowerCase().includes(q)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sales, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ventas</h1>
          <p className="text-[var(--text-secondary)] mt-1">{sales.length} ventas registradas</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Venta
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar ventas por cliente o producto..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input-field"
      />

      {/* Sales List */}
      <div className="space-y-3">
        {filteredSales.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-[var(--text-secondary)]">
              {sales.length === 0 ? 'No hay ventas registradas. ¡Registra tu primera venta!' : 'No se encontraron ventas.'}
            </p>
          </div>
        ) : (
          filteredSales.map(sale => (
            <div key={sale.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="chip-blue">{formatDateTime(sale.date)}</span>
                    <span className="chip">{sale.paymentMethod}</span>
                    {sale.customerName && (
                      <span className="text-sm text-[var(--text-secondary)]">
                        👤 {sale.customerName}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {sale.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span>
                          {item.productName} <span className="text-[var(--text-secondary)]">×{item.quantity}</span>
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.totalPrice, settings.currencySymbol)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {sale.notes && (
                    <p className="text-xs text-[var(--text-secondary)] italic">{sale.notes}</p>
                  )}
                </div>
                <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Total</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(sale.totalAmount, settings.currencySymbol)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-secondary)]">Beneficio</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {formatCurrency(sale.grossProfit, settings.currencySymbol)}
                      <span className="text-xs ml-1">({sale.profitMargin.toFixed(1)}%)</span>
                    </p>
                  </div>
                  <button
                    onClick={() => { if (confirm('¿Eliminar esta venta?')) deleteSale(sale.id); }}
                    className="btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Sale Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nueva Venta"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Fecha</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Método de pago</label>
              <select
                value={form.paymentMethod}
                onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value as PaymentMethod }))}
                className="select-field"
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Cliente (opcional)</label>
              <input
                type="text"
                value={form.customerName}
                onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                className="input-field"
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <label className="label">Contacto (opcional)</label>
              <input
                type="text"
                value={form.customerContact}
                onChange={e => setForm(f => ({ ...f, customerContact: e.target.value }))}
                className="input-field"
                placeholder="Teléfono o email"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Notas (opcional)</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="input-field"
                rows={2}
                placeholder="Notas adicionales"
              />
            </div>
          </div>

          {/* Product selector */}
          <div>
            <label className="label">Productos</label>
            {products.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)] p-3 bg-gray-50 rounded-lg">
                No hay productos disponibles. <a href="/products" className="text-blue-500 underline">Crea productos primero</a>.
              </p>
            ) : (
              <>
                {/* Quick add products */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {products.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => addToCart(p.id)}
                      className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      + {p.name}
                    </button>
                  ))}
                </div>

                {/* Cart */}
                {cartItems.length > 0 && (
                  <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="table-header">Producto</th>
                          <th className="table-header text-center">Cantidad</th>
                          <th className="table-header text-right">Precio Ud.</th>
                          <th className="table-header text-right">Total</th>
                          <th className="table-header text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map(item => (
                          <tr key={item.productId}>
                            <td className="table-cell font-medium">{item.productName}</td>
                            <td className="table-cell text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                                  className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-gray-100"
                                >
                                  −
                                </button>
                                <span className="font-semibold w-6 text-center">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                                  className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="table-cell text-right">{formatCurrency(item.unitPrice, settings.currencySymbol)}</td>
                            <td className="table-cell text-right font-semibold">{formatCurrency(item.totalPrice, settings.currencySymbol)}</td>
                            <td className="table-cell text-right">
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.productId)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 font-semibold">
                          <td colSpan={3} className="table-cell text-right">Totales:</td>
                          <td className="table-cell text-right text-green-600">
                            {formatCurrency(totals.totalAmount, settings.currencySymbol)}
                          </td>
                          <td className="table-cell" />
                        </tr>
                        <tr className="bg-gray-50 text-sm">
                          <td colSpan={3} className="table-cell text-right text-[var(--text-secondary)]">
                            Beneficio estimado:
                          </td>
                          <td className="table-cell text-right font-medium text-blue-600">
                            {formatCurrency(totals.grossProfit, settings.currencySymbol)}
                            <span className="text-xs ml-1">({totals.profitMargin.toFixed(1)}%)</span>
                          </td>
                          <td className="table-cell" />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={cartItems.length === 0}>
              Registrar Venta
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
