'use client';

import { useState, useMemo, useRef } from 'react';
import { useStore } from '@/lib/store';
import { computeDashboardMetrics, formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

type Period = 'mes' | 'trimestre' | 'year';

export default function ReportsPage() {
  const { data } = useStore();
  const { sales, expenses, settings } = data;
  const metrics = useMemo(() => computeDashboardMetrics(data), [data]);
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const [period, setPeriod] = useState<Period>('mes');

  const periodStart = useMemo(() => {
    const d = new Date();
    switch (period) {
      case 'mes': d.setDate(1); break;
      case 'trimestre': d.setMonth(Math.floor(d.getMonth() / 3) * 3); d.setDate(1); break;
      case 'year': d.setMonth(0); d.setDate(1); break;
    }
    return d;
  }, [period]);

  const periodSales = useMemo(() => sales.filter(s => new Date(s.date) >= periodStart), [sales, periodStart]);
  const periodExpenses = useMemo(() => expenses.filter(e => new Date(e.date) >= periodStart), [expenses, periodStart]);

  const periodRevenue = periodSales.reduce((s, x) => s + x.totalAmount, 0);
  const periodCost = periodSales.reduce((s, x) => s + x.totalCost, 0);
  const periodProfit = periodRevenue - periodCost;
  const periodExpensesTotal = periodExpenses.reduce((s, x) => s + x.amount, 0);
  const periodNetProfit = periodProfit - periodExpensesTotal;

  const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', '#f472b6', '#14b8a6', '#f97316'];
  const formatCurrencyValue = (value: number) => `${value.toFixed(2)}${settings.currencySymbol}`;

  const CustomTooltip = ({ active, payload, label }: any) => {
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

  const productRanking = useMemo(() => {
    const ranking: Record<string, { name: string; qty: number; revenue: number; cost: number; profit: number; margin: number }> = {};
    periodSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!ranking[item.productId]) {
          ranking[item.productId] = { name: item.productName, qty: 0, revenue: 0, cost: 0, profit: 0, margin: 0 };
        }
        ranking[item.productId].qty += item.quantity;
        ranking[item.productId].revenue += item.totalPrice;
        ranking[item.productId].cost += item.totalCost;
        ranking[item.productId].profit += item.profit;
      });
    });
    return Object.values(ranking).map(r => ({ ...r, margin: r.revenue > 0 ? (r.profit / r.revenue) * 100 : 0 })).sort((a, b) => b.revenue - a.revenue);
  }, [periodSales]);

  const productChartData = useMemo(() =>
    productRanking.map(p => ({ name: p.name.length > 15 ? p.name.slice(0, 15) + '…' : p.name, Ingresos: Math.round(p.revenue * 100) / 100, Beneficio: Math.round(p.profit * 100) / 100 })),
    [productRanking]
  );

  const expensesChartData = useMemo(() => periodExpenses.reduce<Record<string, number>>((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {}), [periodExpenses]);

  const expensesPieData = useMemo(() => Object.entries(expensesChartData).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 })), [expensesChartData]);

  const dailySummary = useMemo(() => {
    const byDay: Record<string, { revenue: number; cost: number; profit: number; sales: number }> = {};
    periodSales.forEach(sale => {
      const day = sale.date.split('T')[0];
      if (!byDay[day]) byDay[day] = { revenue: 0, cost: 0, profit: 0, sales: 0 };
      byDay[day].revenue += sale.totalAmount;
      byDay[day].cost += sale.totalCost;
      byDay[day].profit += sale.grossProfit;
      byDay[day].sales += 1;
    });
    return Object.entries(byDay).map(([date, d]) => ({ date, ...d })).sort((a, b) => a.date.localeCompare(b.date));
  }, [periodSales]);

  const dailyChartData = useMemo(() =>
    dailySummary.map(d => ({ day: new Date(d.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }), Ingresos: Math.round(d.revenue * 100) / 100, Beneficio: Math.round(d.profit * 100) / 100 })),
    [dailySummary]
  );

  const periodLabel = period === 'mes' ? 'este mes' : period === 'trimestre' ? 'este trimestre' : 'este año';

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = reportRef.current;
      await html2pdf()
        .set({
          margin: [10, 10],
          filename: `reporte-${period}-${new Date().toISOString().split('T')[0]}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(element)
        .save();
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Error al exportar PDF. Intenta de nuevo.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reportes</h1>
          <p className="text-[var(--text-secondary)] mt-1">Análisis detallado del rendimiento</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['mes', 'trimestre', 'year'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p ? 'bg-[var(--accent)] text-white shadow-sm' : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--card-hover)]'}`}>
              {p === 'mes' ? 'Este mes' : p === 'trimestre' ? 'Trimestre' : 'Año'}
            </button>
          ))}
          <button onClick={handleExportPDF} disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {exporting ? 'Exportando...' : 'PDF'}
          </button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="kpi-card">
            <span className="label">Ingresos {periodLabel}</span>
            <span className="value text-green-600 dark:text-green-400">{formatCurrency(periodRevenue, settings.currencySymbol)}</span>
            <span className="change text-[var(--text-secondary)]">{periodSales.length} ventas</span>
          </div>
          <div className="kpi-card">
            <span className="label">Coste de ventas</span>
            <span className="value text-orange-600 dark:text-orange-400">{formatCurrency(periodCost, settings.currencySymbol)}</span>
            <span className="change text-[var(--text-secondary)]">{periodRevenue > 0 ? ((periodCost / periodRevenue) * 100).toFixed(1) : 0}% del ingreso</span>
          </div>
          <div className="kpi-card">
            <span className="label">Beneficio Bruto</span>
            <span className="value text-blue-600 dark:text-blue-400">{formatCurrency(periodProfit, settings.currencySymbol)}</span>
            <span className="change text-green-600 dark:text-green-400">{periodRevenue > 0 ? ((periodProfit / periodRevenue) * 100).toFixed(1) : 0}% margen</span>
          </div>
          <div className="kpi-card">
            <span className="label">Beneficio Neto</span>
            <span className={`value ${periodNetProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(periodNetProfit, settings.currencySymbol)}</span>
            <span className="change text-red-600 dark:text-red-400">Gastos: {formatCurrency(periodExpensesTotal, settings.currencySymbol)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Ranking de Productos {periodLabel}</h3>
            {productChartData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productChartData} layout="vertical" barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={{ stroke: 'var(--border)' }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: 'var(--text-primary)' }} axisLine={{ stroke: 'var(--border)' }} width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Ingresos" fill="var(--chart-1)" radius={[0, 4, 4, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-sm text-[var(--text-secondary)] text-center py-12">No hay ventas en este período.</p>}
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Gastos por Categoría {periodLabel}</h3>
            {expensesPieData.length > 0 ? (
              <div className="h-72 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expensesPieData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value"
                      label={(entry: any) => `${entry.name ?? ''} ${((entry.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                      {expensesPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-sm text-[var(--text-secondary)] text-center py-12">No hay gastos en este período.</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Resumen P&L {periodLabel}</h3>
            <div className="space-y-3">
              <PLRow label="Ingresos totales" value={periodRevenue} color="text-green-600 dark:text-green-400" currencySymbol={settings.currencySymbol} />
              <PLRow label="Coste de productos" value={-periodCost} color="text-orange-600 dark:text-orange-400" isNegative currencySymbol={settings.currencySymbol} />
              <PLRow label="Beneficio Bruto" value={periodProfit} color="text-blue-600 dark:text-blue-400" bold currencySymbol={settings.currencySymbol} />
              <div className="flex justify-between items-center py-2 border-t border-[var(--border)]">
                <div>
                  <span className="text-sm">Gastos operativos</span>
                  <p className="text-xs text-[var(--text-secondary)]">{periodExpenses.length} gastos registrados</p>
                </div>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">-{formatCurrency(periodExpensesTotal, settings.currencySymbol)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t-2 border-[var(--border)] mt-2">
                <span className="text-base font-bold">Beneficio Neto</span>
                <span className={`text-base font-bold ${periodNetProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(periodNetProfit, settings.currencySymbol)}</span>
              </div>
              {periodRevenue > 0 && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[var(--text-secondary)]">Margen neto</span>
                  <span className="text-sm font-medium">{((periodNetProfit / periodRevenue) * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Evolución Diaria {periodLabel}</h3>
            {dailyChartData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyChartData} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={{ stroke: 'var(--border)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={{ stroke: 'var(--border)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Ingresos" fill="var(--chart-1)" radius={[3, 3, 0, 0]} maxBarSize={30} />
                    <Bar dataKey="Beneficio" fill="var(--chart-2)" radius={[3, 3, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-sm text-[var(--text-secondary)] text-center py-12">No hay ventas en este período.</p>}
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Detalle Diario {periodLabel}</h3>
          {dailySummary.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="table-header">Fecha</th>
                    <th className="table-header text-right">Ventas</th>
                    <th className="table-header text-right">Ingresos</th>
                    <th className="table-header text-right">Coste</th>
                    <th className="table-header text-right">Beneficio</th>
                    <th className="table-header text-right">Margen</th>
                  </tr>
                </thead>
                <tbody>
                  {dailySummary.map(d => (
                    <tr key={d.date} className="hover:bg-[var(--card-hover)] transition-colors">
                      <td className="table-cell">{new Date(d.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</td>
                      <td className="table-cell text-right">{d.sales}</td>
                      <td className="table-cell text-right font-medium text-green-600 dark:text-green-400">{formatCurrency(d.revenue, settings.currencySymbol)}</td>
                      <td className="table-cell text-right text-orange-600 dark:text-orange-400">{formatCurrency(d.cost, settings.currencySymbol)}</td>
                      <td className="table-cell text-right font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(d.profit, settings.currencySymbol)}</td>
                      <td className="table-cell text-right">
                        <span className={d.revenue > 0 && (d.profit / d.revenue) * 100 >= 30 ? 'chip-green' : 'chip-yellow'}>{d.revenue > 0 ? ((d.profit / d.revenue) * 100).toFixed(1) : 0}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[var(--card-hover)] font-semibold">
                    <td className="table-header">Totales</td>
                    <td className="table-header text-right">{periodSales.length}</td>
                    <td className="table-header text-right text-green-600 dark:text-green-400">{formatCurrency(periodRevenue, settings.currencySymbol)}</td>
                    <td className="table-header text-right text-orange-600 dark:text-orange-400">{formatCurrency(periodCost, settings.currencySymbol)}</td>
                    <td className="table-header text-right text-blue-600 dark:text-blue-400">{formatCurrency(periodProfit, settings.currencySymbol)}</td>
                    <td className="table-header text-right">{periodRevenue > 0 ? ((periodProfit / periodRevenue) * 100).toFixed(1) : 0}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : <p className="text-sm text-[var(--text-secondary)] text-center py-8">No hay ventas en este período.</p>}
        </div>
      </div>
    </div>
  );
}

function PLRow({ label, value, color, isNegative, bold, currencySymbol }: {
  label: string; value: number; color: string; isNegative?: boolean; bold?: boolean; currencySymbol: string;
}) {
  return (
    <div className={`flex justify-between items-center py-2 ${bold ? '' : 'border-t border-[var(--border)]'}`}>
      <span className={`text-sm ${bold ? 'font-medium' : ''}`}>{label}</span>
      <span className={`text-sm ${bold ? 'font-bold' : 'font-semibold'} ${color}`}>{isNegative ? '-' : ''}{formatCurrency(Math.abs(value), currencySymbol)}</span>
    </div>
  );
}
