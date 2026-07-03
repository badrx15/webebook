export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  costPrice: number;   // Precio de coste
  sellingPrice: number; // Precio de venta
  sku: string;
  stock: number;
  image?: string;       // URL o data URI (base64) de la imagen del producto
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
  totalCost: number;
  totalPrice: number;
  profit: number;
}

export interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  totalAmount: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
  customerName: string;
  customerContact: string;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: string;
}

export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'PayPal' | 'Bizum' | 'Contrareembolso' | 'Otro';

// --- Order types for the online store ---

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderPaymentMethod = 'tarjeta' | 'contrareembolso';
export type OrderStatus = 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado';

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: OrderPaymentMethod;
  status: OrderStatus;
  notes: string;
  squarePaymentId?: string;
  shipmentTracking?: ShipmentTracking | null;
  createdAt: string;
}

export type ExpenseCategory =
  // Marketing
  | 'Facebook Ads'
  | 'Google Ads'
  | 'TikTok Ads'
  | 'Instagram Ads'
  | 'Email Marketing'
  | 'Influencers'
  | 'Otro Marketing'
  // Operativos
  | 'Proveedores'
  | 'Envíos'
  | 'Material'
  | 'Transporte'
  | 'Comisiones'
  // Fijos
  | 'Suscripciones'
  | 'Hosting'
  | 'Impuestos'
  | 'Oficina'
  | 'Nóminas'
  // Otros
  | 'Otros';

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  isRecurring: boolean;
  recurringInterval?: 'mensual' | 'trimestral' | 'anual';
  notes: string;
  createdAt: string;
}

export interface OriginAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface ShipmentTracking {
  trackingNumber: string;
  carrier: string;
  carrierService: string;
  labelUrl: string;
  shipmentId: number;
  totalPrice: number;
  currency: string;
  shippedAt: string;
}

export interface BusinessSettings {
  businessName: string;
  currency: string;
  currencySymbol: string;
  defaultMargin: number;
  taxRate: number;
  lowStockThreshold: number;
  originAddress?: OriginAddress;
}

export interface AppData {
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  orders: Order[];
  settings: BusinessSettings;
}

export interface DashboardMetrics {
  totalSales: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  averageMargin: number;
  salesThisMonth: number;
  revenueThisMonth: number;
  profitThisMonth: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  salesByDay: { date: string; revenue: number; cost: number; profit: number }[];
  expensesByCategory: { category: string; amount: number }[];
  monthlyRevenue: { month: string; revenue: number; profit: number }[];
}
