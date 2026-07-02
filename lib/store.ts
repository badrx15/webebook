'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AppData, Product, Sale, Expense, BusinessSettings, SaleItem, Order, OrderItem, ShippingAddress, OrderStatus } from './types';

const STORAGE_KEY = 'sales-manager-data';

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'Mi Negocio',
  currency: 'EUR',
  currencySymbol: '€',
  defaultMargin: 30,
  taxRate: 21,
  lowStockThreshold: 5,
};

const DEFAULT_DATA: AppData = {
  products: [],
  sales: [],
  expenses: [],
  orders: [],
  settings: DEFAULT_SETTINGS,
};

function loadData(): AppData {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const data = JSON.parse(raw) as AppData;
    // Merge with defaults for any missing fields
    return {
      ...DEFAULT_DATA,
      ...data,
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
    };
  } catch {
    return DEFAULT_DATA;
  }
}

function saveData(data: AppData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data:', e);
  }
}

// Generate a simple unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

const HISTORY_KEY = 'sales-manager-history';
const MAX_HISTORY = 50;

function loadHistory(): AppData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: AppData[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Silently fail if history storage is full
  }
}

function pushHistory(history: AppData[], currentData: AppData): AppData[] {
  const next = [...history, currentData];
  if (next.length > MAX_HISTORY) {
    return next.slice(next.length - MAX_HISTORY);
  }
  return next;
}

export function useStore() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [loaded, setLoaded] = useState(false);
  const historyRef = useRef<AppData[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    const loadedData = loadData();
    const loadedHistory = loadHistory();
    setData(loadedData);
    historyRef.current = loadedHistory;
    setCanUndo(loadedHistory.length > 0);
    setLoaded(true);
  }, []);

  const persist = useCallback((newData: AppData) => {
    setData(newData);
    saveData(newData);
  }, []);

  const pushToHistory = useCallback((currentData: AppData) => {
    const next = pushHistory(historyRef.current, currentData);
    historyRef.current = next;
    saveHistory(next);
    setCanUndo(next.length > 0);
  }, []);

  const mutate = useCallback((updater: (prev: AppData) => AppData) => {
    setData(prev => {
      // Save current state to history before mutating (using ref for latest history)
      pushToHistory(prev);
      
      const newData = updater(prev);
      saveData(newData);
      return newData;
    });
  }, [pushToHistory]);

  // --- Undo ---
  const undo = useCallback(() => {
    const hist = historyRef.current;
    if (hist.length === 0) return;
    
    const newHistory = [...hist];
    const previousState = newHistory.pop()!;
    historyRef.current = newHistory;
    saveHistory(newHistory);
    setCanUndo(newHistory.length > 0);
    setData(previousState);
    saveData(previousState);
  }, []);

  // --- Products ---
  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    mutate(prev => ({ ...prev, products: [...prev.products, newProduct] }));
    return newProduct;
  }, [mutate]);

  const updateProduct = useCallback((id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    mutate(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  }, [mutate]);

  const deleteProduct = useCallback((id: string) => {
    mutate(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
  }, [mutate]);

  // --- Sales ---
  const addSale = useCallback((sale: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...sale,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    mutate(prev => ({ ...prev, sales: [...prev.sales, newSale] }));
    return newSale;
  }, [mutate]);

  const deleteSale = useCallback((id: string) => {
    mutate(prev => ({ ...prev, sales: prev.sales.filter(s => s.id !== id) }));
  }, [mutate]);

  // --- Expenses ---
  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    mutate(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
    return newExpense;
  }, [mutate]);

  const updateExpense = useCallback((id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    mutate(prev => ({
      ...prev,
      expenses: prev.expenses.map(e =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }));
  }, [mutate]);

  const deleteExpense = useCallback((id: string) => {
    mutate(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  }, [mutate]);

  // --- Settings ---
  const updateSettings = useCallback((updates: Partial<BusinessSettings>) => {
    mutate(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, [mutate]);

  // --- Orders (from online store) ---
  const addOrder = useCallback((order: { items: OrderItem[]; totalAmount: number; shippingAddress: ShippingAddress; paymentMethod: 'tarjeta' | 'contrareembolso'; notes: string; squarePaymentId?: string }) => {
    const newOrder: Order = {
      ...order,
      id: generateId(),
      status: order.paymentMethod === 'contrareembolso' ? 'pendiente' : 'pagado',
      createdAt: new Date().toISOString(),
    };
    mutate(prev => ({ ...prev, orders: [...prev.orders, newOrder] }));
    return newOrder;
  }, [mutate]);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    mutate(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === id ? { ...o, status } : o),
    }));
  }, [mutate]);

  const deleteOrder = useCallback((id: string) => {
    mutate(prev => ({ ...prev, orders: prev.orders.filter(o => o.id !== id) }));
  }, [mutate]);

  // --- Reset ---
  const resetAllData = useCallback(() => {
    mutate(() => DEFAULT_DATA);
  }, [mutate]);

  return {
    data,
    loaded,
    canUndo,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    addSale,
    deleteSale,
    addExpense,
    updateExpense,
    deleteExpense,
    updateSettings,
    resetAllData,
    undo,
  };
}
