'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode, useCallback } from 'react';
import type { Order } from './types';

interface OrderNotificationState {
  pendingCount: number;
  newOrders: Order[];
  dismiss: (orderId: string) => void;
  clearAll: () => void;
}

const OrderNotificationContext = createContext<OrderNotificationState>({
  pendingCount: 0,
  newOrders: [],
  dismiss: () => {},
  clearAll: () => {},
});

export function OrderNotificationProvider({ children }: { children: ReactNode }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const knownPendingIdsRef = useRef<Set<string>>(new Set());
  const firstFetchRef = useRef(true);

  const poll = useCallback(async () => {
    try {
      const res = await fetch('/api/data');
      const result = await res.json();
      if (!result.success || !result.data?.orders) return;

      const pending = result.data.orders.filter((o: Order) => o.status === 'pendiente');
      setPendingCount(pending.length);

      if (firstFetchRef.current) {
        // Just populate the known set on first fetch, don't show notifications
        knownPendingIdsRef.current = new Set(pending.map((o: Order) => o.id));
        firstFetchRef.current = false;
        return;
      }

      // Detect new pending orders (only if we already have a baseline)
      if (knownPendingIdsRef.current.size > 0) {
        const newOnes = pending.filter((o: Order) => !knownPendingIdsRef.current.has(o.id));
        if (newOnes.length > 0) {
          setNewOrders(prev => [...newOnes, ...prev].slice(0, 10)); // Max 10 toasts
        }
      }

      knownPendingIdsRef.current = new Set(pending.map((o: Order) => o.id));
    } catch {
      // Silently fail on network errors
    }
  }, []);

  useEffect(() => {
    // Initial fetch (baseline)
    poll();

    // Poll every 30 seconds for new orders
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [poll]);

  const dismiss = useCallback((orderId: string) => {
    setNewOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  const clearAll = useCallback(() => {
    setNewOrders([]);
  }, []);

  return (
    <OrderNotificationContext.Provider value={{ pendingCount, newOrders, dismiss, clearAll }}>
      {children}
    </OrderNotificationContext.Provider>
  );
}

export function useOrderNotifications() {
  return useContext(OrderNotificationContext);
}
