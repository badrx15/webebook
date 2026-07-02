'use client';

import { useStore } from '@/lib/store';
import { computeDashboardMetrics, formatCurrency, getMonthName } from '@/lib/utils';
import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';

export default function DashboardPage() {
  const { data } = useStore();
  const metrics = useMemo(() => computeDashboardMetrics(data), [data]);

  const currencySymbol = data.settings.currencySymbol;

  const monthlyData = useMemo(() =>
    metrics.monthlyRevenue.map(m => {
      const [year, month] = m.month.split('-');
      return {
        month: `${getMonthName(parseInt(month) - 1).slice(0, 3)} ${year.slice(2)}`,
        Ingresos: Math.round(m.revenue * 100) / 100,
        Beneficio: Math.round(m.profit * 100) / 100,
      };
    }),
    [metrics.monthlyRevenue]
  );

  const topProductsData = useMemo(() =>
    metrics.topProducts.map(p => ({
      name: p.name.length > 15 ? p.name.slice(0, 15) + '…' : p.name,
      Ventas: p.quantity,
      Ingresos: Math.round(p.revenue * 100) / 100,
    })),
    [metrics.topProducts]
  );

  const salesByDayData = useMemo(() =>
    metrics.salesByDay.filter(d => d.revenue > 0).slice(-14).map(d => {
      const [, m, day] = d.date.split('-');
      return {
        day: `${parseInt(day)}/${parseInt(m)}`,
        Ingresos: Math.round(d.revenue * 100) / 100,
      };
    }),
    [metrics.salesByDay]
  );

  const expensesData = useMemo(() =>
    metrics.expensesByCategory.map(e => ({
      name: e.category,
      value: Math.round(e.amount * 100) / 100,
    })),
    [metrics.expensesByCategory]
  );

  const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', '#f472b6', '#14b8a6', '#f97316'];

  const formatCurrencyValue = (value: number) => `${value.toFixed(2)}${currencySymbol}`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold mb-1 text-[var(--text-primary)]">{label}</p>
          {payload.map((entry: any, i: number) => (
            <p key={i} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {formatCurrencyValue(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const noData = !metrics.monthlyRevenue.some(m => m.revenue > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{data.settings.businessName}</h1>
        <p className="text-[var(--text-secondary)] mt-1">Resumen general de tu negocio</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card">
          <span className="label">Ingresos Totales</span>
          <span className="value text-green-600 dark:text-green-400">{formatCurrency(metrics.totalRevenue, currencySymbol)}</span>
          <span className="change text-[var(--text-secondary)]">{metrics.totalSales} ventas realizadas</span>
        </div>
        <div className="kpi-card">
          <span className="label">Beneficio Total</span>
          <span className="value text-blue-600 dark:text-blue-400">{formatCurrency(metrics.totalProfit, currencySymbol)}</span>
          <span className="change text-green-600 dark:text-green-400">Margen: {metrics.averageMargin.toFixed(1)}%</span>
        </div>
        <div className="kpi-card">
          <span className="label">Este Mes</span>
          <span className="value text-indigo-600 dark:text-indigo-400">{formatCurrency(metrics.revenueThisMonth, currencySymbol)}</span>
          <span className="change text-[var(--text-secondary)]">{metrics.salesThisMonth} ventas</span>
        </div>
        <div className="kpi-card">
          <span className="label">Beneficio del Mes</span>
          <span className="value text-purple-600 dark:text-purple-400">{formatCurrency(metrics.profitThisMonth, currencySymbol)}</span>
          <span className={metrics.profitThisMonth > 0 ? 'change text-green-600 dark:text-green-400' : 'change text-red-600 dark:text-red-400'}>
            {metrics.salesThisMonth > 0
              ? `${((metrics.profitThisMonth / metrics.revenueThisMonth) * 100).toFixed(1)}% margen`
              : 'Sin ventas'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart - Bar Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Ingresos vs Beneficio
            </h3>
            <span className="text-xs text-[var(--text-secondary)]">Últimos 6 meses</span>
          </div>
          {!noData ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={{ stroke: 'var(--border)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={{ stroke: 'var(--border)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-primary)' }} />
                  <Bar dataKey="Ingresos" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Beneficio" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] text-center py-12">
              Aún no hay datos. Comienza registrando tus primeras ventas.
            </p>
          )}
        </div>

        {/* Top Products - Horizontal Bar */}
        <div className="card">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
            Productos Más Vendidos
          </h3>
          {topProductsData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} layout="vertical" barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={{ stroke: 'var(--border)' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: 'var(--text-primary)' }} axisLine={{ stroke: 'var(--border)' }} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Ingresos" fill="var(--chart-3)" radius={[0, 4, 4, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] text-center py-12">
              Aún no hay productos vendidos.
            </p>
          )}
        </div>

        {/* Sales by Day - Line Chart */}
        <div className="card">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
            Ventas Últimos 14 Días
          </h3>
          {salesByDayData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesByDayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={{ stroke: 'var(--border)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={{ stroke: 'var(--border)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="Ingresos" stroke="var(--chart-4)" strokeWidth={2} dot={{ fill: 'var(--chart-4)', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] text-center py-12">
              No hay ventas en los últimos 30 días.
            </p>
          )}
        </div>

        {/* Expenses by Category - Pie Chart */}
        <div className="card">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
            Gastos por Categoría
          </h3>
          {expensesData.length > 0 ? (
            <div className="h-72 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    dataKey="value"
                    label={(entry: any) => `${entry.name ?? ''} ${((entry.percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {expensesData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] text-center py-12">
              No hay gastos registrados.
            </p>
          )}
        </div>
      </div>

      {/* Summary cards at bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="stat-label">Productos</p>
          <p className="stat-value text-blue-600 dark:text-blue-400">{data.products.length}</p>
        </div>
        <div className="card text-center">
          <p className="stat-label">Ventas Totales</p>
          <p className="stat-value text-green-600 dark:text-green-400">{metrics.totalSales}</p>
        </div>
        <div className="card text-center">
          <p className="stat-label">Gastos Totales</p>
          <p className="stat-value text-red-600 dark:text-red-400">{data.expenses.length}</p>
        </div>
      </div>
    </div>
  );
}
