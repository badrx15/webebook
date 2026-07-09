import { Product, Sale, Expense, DashboardMetrics, AppData } from './types';

export function formatCurrency(amount: number, symbol: string = '€'): string {
  return `${amount.toFixed(2)}${symbol}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
}

export function getMonthKey(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getDayKey(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function calculateMargin(costPrice: number, sellingPrice: number): number {
  if (costPrice <= 0 || sellingPrice <= 0) return 0;
  return ((sellingPrice - costPrice) / sellingPrice) * 100;
}

export function calculateSellingPrice(costPrice: number, marginPercent: number): number {
  return costPrice / (1 - marginPercent / 100);
}

export function calculateProfit(costPrice: number, sellingPrice: number): number {
  return sellingPrice - costPrice;
}

export function getMonthName(monthIndex: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  return months[monthIndex] || '';
}

export function computeDashboardMetrics(data: AppData): DashboardMetrics {
  const { products, sales, expenses } = data;

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalCost = sales.reduce((sum, s) => sum + s.totalCost, 0);
  const totalProfit = totalRevenue - totalCost;
  const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Current month
  const currentMonth = getCurrentMonth();
  const thisMonthSales = sales.filter(s => getMonthKey(s.date) === currentMonth);
  const salesThisMonth = thisMonthSales.length;
  const revenueThisMonth = thisMonthSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const costThisMonth = thisMonthSales.reduce((sum, s) => sum + s.totalCost, 0);
  const profitThisMonth = revenueThisMonth - costThisMonth;

  // Top products
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
      }
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId].revenue += item.totalPrice;
    });
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Sales by day (last 30 days)
  const last30Days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last30Days.push(getDayKey(d.toISOString()));
  }
  const salesByDay = last30Days.map(day => {
    const daySales = sales.filter(s => getDayKey(s.date) === day);
    const revenue = daySales.reduce((sum, s) => sum + s.totalAmount, 0);
    const cost = daySales.reduce((sum, s) => sum + s.totalCost, 0);
    return { date: day, revenue, cost, profit: revenue - cost };
  });

  // Expenses by category
  const catTotals: Record<string, number> = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const expensesByCategory = Object.entries(catTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Monthly revenue (last 6 months)
  const monthKeys: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    monthKeys.push(getMonthKey(d.toISOString()));
  }
  const monthlyRevenue = monthKeys.map(mk => {
    const monthSales = sales.filter(s => getMonthKey(s.date) === mk);
    const revenue = monthSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const cost = monthSales.reduce((sum, s) => sum + s.totalCost, 0);
    return { month: mk, revenue, profit: revenue - cost };
  });

  return {
    totalSales,
    totalRevenue,
    totalCost,
    totalProfit,
    averageMargin,
    salesThisMonth,
    revenueThisMonth,
    profitThisMonth,
    topProducts,
    salesByDay,
    expensesByCategory,
    monthlyRevenue,
  };
}

// Available product categories
export const PRODUCT_CATEGORIES = [
  'Electrónica',
  'Ropa y Accesorios',
  'Hogar',
  'Belleza',
  'Deportes',
  'Alimentación',
  'Juguetes',
  'Libros',
  'Digital',
  'Servicios',
  'Otra',
];

// Available expense categories
export const EXPENSE_CATEGORIES = [
  // Marketing
  'Facebook Ads',
  'Google Ads',
  'TikTok Ads',
  'Instagram Ads',
  'Email Marketing',
  'Influencers',
  'Otro Marketing',
  // Operativos
  'Proveedores',
  'Material',
  'Transporte',
  'Comisiones',
  // Fijos
  'Suscripciones',
  'Hosting',
  'Impuestos',
  'Oficina',
  'Nóminas',
  // Otros
  'Otros',
] as const;

// Payment methods
export const PAYMENT_METHODS = [
  'Efectivo',
  'Transferencia',
  'Tarjeta',
  'PayPal',
  'Bizum',
  'Otro',
] as const;
