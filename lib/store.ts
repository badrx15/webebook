'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AppData, Product, Sale, Expense, BlogPost, BusinessSettings, Order, OrderItem, OrderStatus, ShippingAddress } from './types';
import { useAdminInitialData, useAdminDataUpdater } from './admin-store-context';

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
  blogPosts: [],
  settings: DEFAULT_SETTINGS,
};

// Generate a simple unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// In-memory history for undo (per session)
const MAX_HISTORY = 50;
const HISTORY_KEY = 'sales-manager-history';

function loadHistory(): AppData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: AppData[]): boolean {
  if (typeof window === 'undefined') return true;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}

function pushHistory(history: AppData[], currentData: AppData): AppData[] {
  const next = [...history, currentData];
  if (next.length > MAX_HISTORY) {
    return next.slice(next.length - MAX_HISTORY);
  }
  return next;
}

async function fetchData(): Promise<AppData> {
  try {
    const res = await fetch('/api/data');
    const result = await res.json();
    if (result.success && result.data) {
      return {
        ...DEFAULT_DATA,
        ...result.data,
        settings: { ...DEFAULT_SETTINGS, ...result.data.settings },
      };
    }
  } catch (e) {
    console.error('Error fetching data from server:', e);
  }
  return DEFAULT_DATA;
}

async function saveDataToServer(data: AppData): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return result.success === true;
  } catch (e) {
    console.error('Error saving data to server:', e);
    return false;
  }
}

export function useStore() {
  const adminInitialData = useAdminInitialData();
  const updateAdminData = useAdminDataUpdater();
  const hasInitialData = adminInitialData !== null;

  // Use initial data as starting point (fast instant display)
  const [data, setData] = useState<AppData>(hasInitialData ? adminInitialData : DEFAULT_DATA);
  const [loaded, setLoaded] = useState(hasInitialData);
  const [loading, setLoading] = useState(!hasInitialData);
  const dataRef = useRef<AppData>(hasInitialData ? adminInitialData : DEFAULT_DATA);
  const historyRef = useRef<AppData[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  // Tracks if user has made any mutation since mount (to prevent background fetch from overwriting)
  const hasMutatedRef = useRef(false);
  // Sequential save queue to prevent race conditions (earlier saves overwriting later ones)
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  // Always fetch from server on mount to keep data in sync
  // (initial data from context provides instant display while fetch completes)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const serverData = await fetchData();
      if (cancelled) return;
      const merged = {
        ...DEFAULT_DATA,
        ...serverData,
        settings: { ...DEFAULT_SETTINGS, ...serverData.settings },
      };
      // Only overwrite if the user hasn't made any mutations yet
      if (!hasMutatedRef.current) {
        setData(merged);
        dataRef.current = merged;
      }
      setLoaded(true);
      setLoading(false);
    })();

    // Load history from localStorage
    const history = loadHistory();
    historyRef.current = history;
    setCanUndo(history.length > 0);

    return () => {
      cancelled = true;
    };
  }, []);

  const pushToHistory = useCallback((currentData: AppData) => {
    const next = pushHistory(historyRef.current, currentData);
    historyRef.current = next;
    const saved = saveHistory(next);
    // If localStorage is full, trim history to last 10 and retry
    if (!saved) {
      const trimmed = next.slice(-10);
      historyRef.current = trimmed;
      saveHistory(trimmed); // if still fails, it'll silently fail - that's ok
    }
    setCanUndo(historyRef.current.length > 0);
  }, []);

  const enqueueSave = useCallback((newData: AppData) => {
    // Chain saves sequentially: each save waits for the previous one to complete
    // This ensures the latest data always wins (no race conditions)
    saveQueueRef.current = saveQueueRef.current.then(async () => {
      // Before saving, read the CURRENT dataRef (might have been updated by a subsequent mutation)
      const currentData = dataRef.current;
      await saveDataToServer(currentData);
    });
    // Catch to prevent unhandled promise rejections
    saveQueueRef.current = saveQueueRef.current.catch(() => {});
  }, []);

  const mutate = useCallback((updater: (prev: AppData) => AppData) => {
    if (!loaded) return;

    const prev = dataRef.current;
    pushToHistory(prev);

    const newData = updater(prev);
    dataRef.current = newData;
    setData(newData);
    hasMutatedRef.current = true;
    // Update the AdminDataProvider context so page re-mounts get fresh data immediately
    if (updateAdminData) {
      updateAdminData(newData);
    }
    // Queue save to server (sequential, no race conditions)
    enqueueSave(newData);
  }, [loaded, pushToHistory, enqueueSave, updateAdminData]);

  // --- Undo ---
  const undo = useCallback(() => {
    const hist = historyRef.current;
    if (hist.length === 0) return;

    const newHistory = [...hist];
    const previousState = newHistory.pop()!;
    historyRef.current = newHistory;
    saveHistory(newHistory);
    setCanUndo(newHistory.length > 0);
    dataRef.current = previousState;
    setData(previousState);
    if (updateAdminData) {
      updateAdminData(previousState);
    }
    enqueueSave(previousState);
  }, [enqueueSave, updateAdminData]);

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
    mutate(prev => {
      const saleToDelete = prev.sales.find(s => s.id === id);
      // Check if the sale is linked to a web order (notes contain "Pedido web #")
      const orderRef = saleToDelete?.notes?.match(/Pedido web #([a-z0-9]+)/)?.[1];
      return {
        ...prev,
        sales: prev.sales.filter(s => s.id !== id),
        // If linked to an order, delete that order too
        orders: orderRef
          ? prev.orders.filter(o => !o.id.startsWith(orderRef))
          : prev.orders,
      };
    });
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
  const addOrder = useCallback((order: { items: OrderItem[]; totalAmount: number; paymentMethod: 'tarjeta' | 'contrareembolso'; notes: string; shippingAddress: ShippingAddress; squarePaymentId?: string }) => {
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
    const shortId = id.slice(0, 8);
    mutate(prev => ({
      ...prev,
      orders: prev.orders.filter(o => o.id !== id),
      // Also delete the linked sale (notes contain "Pedido web #XXXXYYYY")
      sales: prev.sales.filter(s => !s.notes?.includes(`Pedido web #${shortId}`)),
    }));
  }, [mutate]);

  // --- Blog Posts ---
  const addBlogPost = useCallback((post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...post,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    mutate(prev => ({ ...prev, blogPosts: [...prev.blogPosts, newPost] }));
    return newPost;
  }, [mutate]);

  const updateBlogPost = useCallback((id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt'>>) => {
    mutate(prev => ({
      ...prev,
      blogPosts: prev.blogPosts.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  }, [mutate]);

  const deleteBlogPost = useCallback((id: string) => {
    mutate(prev => ({ ...prev, blogPosts: prev.blogPosts.filter(p => p.id !== id) }));
  }, [mutate]);

  // --- Reset ---
  const resetAllData = useCallback(() => {
    mutate(() => DEFAULT_DATA);
  }, [mutate]);

  return {
    data,
    loaded,
    loading,
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
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    updateSettings,
    resetAllData,
    undo,
  };
}
