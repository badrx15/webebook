'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
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

// Context for the data value
const AdminDataContext = createContext<AppData | null>(null);
// Context for updating the data after mutations
const AdminUpdateContext = createContext<((data: AppData) => void) | null>(null);

export function AdminDataProvider({
  initialData,
  children,
}: {
  initialData: AppData | null;
  children: ReactNode;
}) {
  const [data, setData] = useState<AppData | null>(
    initialData
      ? { ...DEFAULT_DATA, ...initialData, settings: { ...DEFAULT_SETTINGS, ...initialData.settings } }
      : null
  );

  const updateData = (newData: AppData) => {
    setData(newData);
  };

  return (
    <AdminUpdateContext.Provider value={updateData}>
      <AdminDataContext.Provider value={data}>
        {children}
      </AdminDataContext.Provider>
    </AdminUpdateContext.Provider>
  );
}

export function useAdminInitialData(): AppData | null {
  return useContext(AdminDataContext);
}

export function useAdminDataUpdater(): ((data: AppData) => void) | null {
  return useContext(AdminUpdateContext);
}
