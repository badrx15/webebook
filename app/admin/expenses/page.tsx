'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { Expense, ExpenseCategory } from '@/lib/types';
import { formatCurrency, formatDate, EXPENSE_CATEGORIES, getMonthKey, getMonthName } from '@/lib/utils';
import Modal from '@/components/Modal';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

type SortField = 'date' | 'amount' | 'category' | 'description';
type SortDir = 'asc' | 'desc';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#06b6d4', '#d946ef', '#eab308', '#64748b'];

export default function ExpensesPage() {
  const { data, addExpense, updateExpense, deleteExpense } = useStore();
  const { expenses, sales, settings } = data;

  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: 'Otros' as ExpenseCategory,
    isRecurring: false,
    recurringInterval: undefined as 'mensual' | 'trimestral' | 'anual' | undefined,
    notes: '',
  });

  const openNew = () => {
    setEditingExpense(null);
    setForm({ date: new Date().toISOString().split('T')[0], description: '', amount: 0, category: 'Otros', isRecurring: false, recurringInterval: undefined, notes: '' });
    setShowModal(true);
  };

  const openEdit = (e: Expense) => {
    setEditingExpense(e);
    setForm({ date: e.date.split('T')[0], description: e.description, amount: e.amount, category: e.category, isRecurring: e.isRecurring, recurringInterval: e.recurringInterval, notes: e.notes });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim() || form.amount <= 0) return;
    if (editingExpense) {
      updateExpense(editingExpense.id, { ...form, date: new Date(form.date).toISOString() });
    } else {
      addExpense({ ...form, date: new Date(form.date).toISOString() });
    }
    setShowModal(false);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) { setSortDir(d => (d === 'asc' ? 'desc' : 'asc')); }
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-300 dark:text-gray-600 ml-1">↕</span>;
    return <span className="text-[var(--accent)] ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const filtered = useMemo(() => {
    let list = [...expenses];
    if (categoryFilter) list = list.filter(e => e.category === categoryFilter);
    if (dateFrom) list = list.filter(e => new Date(e.date) >= new Date(dateFrom));
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setDate(endDate.getDate() + 1);
      list = list.filter(e => new Date(e.date) <= endDate);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.description.toLowerCase().includes(q) || e.notes.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'date': return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
        case 'amount': return (a.amount - b.amount) * dir;
        case 'category': return a.category.localeCompare(b.category) * dir;
        case 'description': return a.description.localeCompare(b.description) * dir;
        default: return 0;
      }
    });
    return list;
  }, [expenses, categoryFilter, dateFrom, dateTo, search, sortField, sortDir]);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0);

  const stats = useMemo(() => {
    if (expenses.length === 0) return null;
    const dates = expenses.map(e => new Date(e.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const monthsDiff = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth()) + 1;
    const monthlyAvg = monthsDiff > 0 ? totalExpenses / monthsDiff : totalExpenses;
    const biggest = expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0]);
    const catTotals: Record<string, number> = {};
    expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
    const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
    const totalRevenue = sales.reduce((s, x) => s + x.totalAmount, 0);
    const expenseRatio = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;
    return { monthlyAvg, biggest, topCategory, expenseRatio, totalRevenue };
  }, [expenses, totalExpenses, sales]);

  const pieData = useMemo(() => {
    const catTotals: Record<string, number> = {};
    expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
    return Object.entries(catTotals).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 })).sort((a, b) => b.value - a.value);
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const byMonth: Record<string, number> = {};
    expenses.forEach(e => {
      const mk = getMonthKey(e.date);
      byMonth[mk] = (byMonth[mk] || 0) + e.amount;
    });
    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push(getMonthKey(d.toISOString()));
    }
    return months.map(mk => {
      const [year, month] = mk.split('-');
      return { month: `${getMonthName(parseInt(month) - 1).slice(0, 3)} ${year.slice(2)}`, Gastos: Math.round((byMonth[mk] || 0) * 100) / 100 };
    });
  }, [expenses]);

  const formatCurrencyValue = (value: number) => `${value.toFixed(2)}${settings.currencySymbol}`;

  const ChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold mb-1 text-[var(--text-primary)]">{label}</p>
          {payload.map((entry: any, i: number) => (
            <p key={i} style={{ color: entry.color }} className="font-medium">{entry.name}: {formatCurrencyValue(entry.value)}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const isFiltered = categoryFilter || dateFrom || dateTo || search;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Gastos</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            <span className="font-semibold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses, settings.currencySymbol)}</span>
            {' · '}{expenses.length} gastos
            {stats && <span className="text-[var(--text-secondary)]"> · {stats.expenseRatio.toFixed(1)}% de ingresos</span>}
          </p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo Gasto
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card !p-3 text-center">
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Total</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">{formatCurrency(totalExpenses, settings.currencySymbol)}</p>
          </div>
          <div className="card !p-3 text-center">
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Promedio/mes</p>
            <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{formatCurrency(stats.monthlyAvg, settings.currencySymbol)}</p>
          </div>
          <div className="card !p-3 text-center">
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Mayor gasto</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">{formatCurrency(stats.biggest.amount, settings.currencySymbol)}</p>
            <p className="text-[10px] text-[var(--text-secondary)] truncate">{stats.biggest.description}</p>
          </div>
          <div className="card !p-3 text-center">
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Top categoría</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.topCategory[0]}</p>
            <p className="text-[10px] text-[var(--text-secondary)]">{formatCurrency(stats.topCategory[1], settings.currencySymbol)}</p>
          </div>
        </div>
      )}

      {expenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Gastos por Categoría</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value"
                    label={(entry: any) => `${entry.name ?? ''} ${((entry.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Evolución Mensual (últimos 12 meses)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={{ stroke: 'var(--border)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={{ stroke: 'var(--border)' }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="Gastos" fill="var(--chart-4)" radius={[4, 4, 0, 0]} maxBarSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input type="text" placeholder="Buscar gastos..." value={search} onChange={e => setSearch(e.target.value)} className="input-field" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="select-field sm:w-44">
          <option value="">Todas las categorías</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input-field sm:w-36" title="Desde" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input-field sm:w-36" title="Hasta" />
        {isFiltered && <button onClick={() => { setCategoryFilter(''); setDateFrom(''); setDateTo(''); setSearch(''); }} className="btn-secondary text-sm">Limpiar filtros</button>}
      </div>

      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--text-secondary)] text-sm">
              {expenses.length === 0 ? 'No hay gastos registrados. ¡Registra tu primer gasto!' : 'No se encontraron gastos con esos filtros.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header cursor-pointer" onClick={() => toggleSort('date')}>Fecha <SortIcon field="date" /></th>
                  <th className="table-header cursor-pointer" onClick={() => toggleSort('description')}>Descripción <SortIcon field="description" /></th>
                  <th className="table-header cursor-pointer" onClick={() => toggleSort('category')}>Categoría <SortIcon field="category" /></th>
                  <th className="table-header cursor-pointer text-right" onClick={() => toggleSort('amount')}>Importe <SortIcon field="amount" /></th>
                  <th className="table-header text-center">Recurrencia</th>
                  <th className="table-header text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(expense => (
                  <tr key={expense.id} className="hover:bg-[var(--card-hover)] transition-colors cursor-pointer" onClick={() => openEdit(expense)}>
                    <td className="table-cell whitespace-nowrap"><span className="text-sm">{formatDate(expense.date)}</span></td>
                    <td className="table-cell">
                      <p className="font-medium text-sm">{expense.description}</p>
                      {expense.notes && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{expense.notes}</p>}
                    </td>
                    <td className="table-cell">
                      <span className="chip text-xs" style={{
                        backgroundColor: `${COLORS[EXPENSE_CATEGORIES.indexOf(expense.category as any) % COLORS.length]}20`,
                        color: COLORS[EXPENSE_CATEGORIES.indexOf(expense.category as any) % COLORS.length],
                      }}>{expense.category}</span>
                    </td>
                    <td className="table-cell text-right">
                      <span className="font-semibold text-red-600 dark:text-red-400">-{formatCurrency(expense.amount, settings.currencySymbol)}</span>
                    </td>
                    <td className="table-cell text-center">
                      {expense.isRecurring ? (
                        <span className="chip-yellow text-xs">🔄 {expense.recurringInterval === 'mensual' ? 'Mensual' : expense.recurringInterval === 'trimestral' ? 'Trimestral' : 'Anual'}</span>
                      ) : <span className="text-[var(--text-secondary)] text-xs">—</span>}
                    </td>
                    <td className="table-cell text-right">
                      <button onClick={(e) => { e.stopPropagation(); if (confirm('¿Eliminar este gasto?')) deleteExpense(expense.id); }}
                        className="btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[var(--card-hover)] font-semibold">
                  <td className="table-header" colSpan={3}>Totales {isFiltered ? `(${filtered.length} gastos)` : ''}</td>
                  <td className="table-header text-right text-red-600 dark:text-red-400">{formatCurrency(filteredTotal, settings.currencySymbol)}</td>
                  <td className="table-header" colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingExpense ? 'Editar Gasto' : 'Nuevo Gasto'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Fecha</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" required />
            </div>
            <div>
              <label className="label">Categoría</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ExpenseCategory }))} className="select-field">
                <optgroup label="Marketing">
                  {EXPENSE_CATEGORIES.filter(c => ['Facebook Ads', 'Google Ads', 'TikTok Ads', 'Instagram Ads', 'Email Marketing', 'Influencers', 'Otro Marketing'].includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                </optgroup>
                <optgroup label="Operativos">
                  {EXPENSE_CATEGORIES.filter(c => ['Proveedores', 'Envíos', 'Material', 'Transporte', 'Comisiones'].includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                </optgroup>
                <optgroup label="Fijos">
                  {EXPENSE_CATEGORIES.filter(c => ['Suscripciones', 'Hosting', 'Impuestos', 'Oficina', 'Nóminas'].includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                </optgroup>
                <optgroup label="Otros"><option value="Otros">Otros</option></optgroup>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Descripción *</label>
              <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field" placeholder="Ej: Campaña Facebook Ads Enero" required />
            </div>
            <div>
              <label className="label">Importe ({settings.currencySymbol}) *</label>
              <input type="number" step="0.01" min="0.01" value={form.amount || ''} onChange={e => setForm(f => ({ ...f, amount: parseFloat(e.target.value) || 0 }))} className="input-field" placeholder="0.00" required />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isRecurring} onChange={e => setForm(f => ({ ...f, isRecurring: e.target.checked, recurringInterval: e.target.checked ? 'mensual' : undefined }))}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]" />
                <span className="text-sm">Gasto recurrente</span>
              </label>
            </div>
            {form.isRecurring && (
              <div>
                <label className="label">Periodicidad</label>
                <select value={form.recurringInterval || 'mensual'} onChange={e => setForm(f => ({ ...f, recurringInterval: e.target.value as 'mensual' | 'trimestral' | 'anual' }))} className="select-field">
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="label">Notas (opcional)</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="input-field" rows={2} placeholder="Notas adicionales" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">{editingExpense ? 'Guardar Cambios' : 'Registrar Gasto'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
