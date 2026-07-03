'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { AppData } from './types';

const DEFAULT_SETTINGS = {
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

const AdminDataContext = createContext<AppData | null>(null);

export function AdminDataProvider({
  initialData,
  children,
}: {
  initialData: AppData | null;
  children: ReactNode;
}) {
  const merged = initialData
    ? { ...DEFAULT_DATA, ...initialData, settings: { ...DEFAULT_SETTINGS, ...initialData.settings } }
    : null;

  return (
    <AdminDataContext.Provider value={merged}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminInitialData(): AppData | null {
  return useContext(AdminDataContext);
}
