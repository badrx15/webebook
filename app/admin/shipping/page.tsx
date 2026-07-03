'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Order, OrderStatus } from '@/lib/types';

interface RateOption {
  carrier: string;
  service: string;
  serviceDescription: string;
  deliveryEstimate: string;
  totalPrice: string;
  currency: string;
}

interface LabelResult {
  carrier: string;
  service: string;
  shipmentId: number;
  trackingNumber: string;
  trackUrl: string;
  label: string;
  totalPrice: number;
  currency: string;
}

export default function ShippingPage() {
  const { data, updateOrderTracking } = useStore();
  const { orders, settings } = data;

  const readyOrders = useMemo(() =>
    orders
      .filter(o => o.status === 'pagado' || o.status === 'pendiente')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders]
  );

  const shippedOrders = useMemo(() =>
    orders
      .filter(o => o.status === 'enviado' || o.status === 'entregado')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders]
  );

  const [ratesLoading, setRatesLoading] = useState<string | null>(null);
  const [rates, setRates] = useState<Record<string, RateOption[]>>({});
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  const carrierLabel: Record<string, string> = {
    correos: 'Correos',
    seur: 'SEUR',
    dhl: 'DHL',
    ups: 'UPS',
    fedex: 'FedEx',
    gls: 'GLS',
    asm: 'ASM',
    cbl: 'CBL Logistics',
    mrw: 'MRW',
  };

  const carrierId = useMemo(() => {
    // Default carrier for Spain - user can change this
    return process.env.NEXT_PUBLIC_DEFAULT_CARRIER || 'seur';
  }, []);

  const getRates = async (order: Order) => {
    setRatesLoading(order.id);
    setRatesError(null);

    const origin = settings.originAddress;
    if (!origin || !origin.street) {
      setRatesError('Configura primero la dirección de origen en Ajustes → Envíos');
      setRatesLoading(null);
      return;
    }

    // Calculate total weight (estimate: 1kg per item)
    const totalWeight = order.items.reduce((sum, item) => sum + item.quantity, 1);
    const totalValue = order.totalAmount;

    try {
      const res = await fetch('/api/envia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rate',
          origin: {
            name: origin.fullName,
            phone: origin.phone,
            street: origin.street,
            city: origin.city,
            state: origin.province,
            country: 'ES',
            postalCode: origin.postalCode,
          },
          destination: {
            name: order.shippingAddress.fullName,
            phone: order.shippingAddress.phone,
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.province,
            country: 'ES',
            postalCode: order.shippingAddress.postalCode,
          },
          packages: [
            {
              type: 'box',
              content: order.items.map(i => i.productName).join(', '),
              amount: 1,
              declaredValue: totalValue,
              lengthUnit: 'CM',
              weightUnit: 'KG',
              weight: totalWeight,
              dimensions: { length: 30, width: 20, height: 10 },
            },
          ],
          shipment: {
            type: 1,
            carrier: carrierId,
          },
        }),
      });

      const result = await res.json();

      if (!result.success) {
        setRatesError(result.error || 'Error al obtener tarifas');
        setRatesLoading(null);
        return;
      }

      setRates(prev => ({ ...prev, [order.id]: result.data.data || [] }));
      setRatesLoading(null);
    } catch (err: any) {
      setRatesError(err.message || 'Error de conexión');
      setRatesLoading(null);
    }
  };

  const generateLabel = async (order: Order, rate: RateOption) => {
    setGenerating(order.id);
    setGenerateError(null);

    const origin = settings.originAddress;
    if (!origin || !origin.street) {
      setGenerateError('Configura primero la dirección de origen en Ajustes');
      setGenerating(null);
      return;
    }

    const totalWeight = order.items.reduce((sum, item) => sum + item.quantity, 1);
    const totalValue = order.totalAmount;

    try {
      const res = await fetch('/api/envia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          origin: {
            name: origin.fullName,
            phone: origin.phone,
            street: origin.street,
            city: origin.city,
            state: origin.province,
            country: 'ES',
            postalCode: origin.postalCode,
          },
          destination: {
            name: order.shippingAddress.fullName,
            phone: order.shippingAddress.phone,
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.province,
            country: 'ES',
            postalCode: order.shippingAddress.postalCode,
          },
          packages: [
            {
              type: 'box',
              content: order.items.map(i => i.productName).join(', '),
              amount: 1,
              declaredValue: totalValue,
              lengthUnit: 'CM',
              weightUnit: 'KG',
              weight: totalWeight,
              dimensions: { length: 30, width: 20, height: 10 },
            },
          ],
          shipment: {
            type: 1,
            carrier: rate.carrier,
            service: rate.service,
          },
        }),
      });

      const result = await res.json();

      if (!result.success) {
        setGenerateError(result.error || 'Error al generar etiqueta');
        setGenerating(null);
        return;
      }

      const labelData: LabelResult = result.data.data[0];

      // Update order with tracking data and status
      updateOrderTracking(order.id, {
        trackingNumber: labelData.trackingNumber,
        carrier: labelData.carrier,
        carrierService: labelData.service,
        labelUrl: labelData.label,
        shipmentId: labelData.shipmentId,
        totalPrice: labelData.totalPrice,
        currency: labelData.currency,
        shippedAt: new Date().toISOString(),
      });

      // Clear rates for this order
      setRates(prev => {
        const next = { ...prev };
        delete next[order.id];
        return next;
      });

      setSuccessMsg(`✅ Etiqueta generada para ${order.shippingAddress.fullName}. Tracking: ${labelData.trackingNumber}`);
      setTimeout(() => setSuccessMsg(null), 5000);
      setGenerating(null);
    } catch (err: any) {
      setGenerateError(err.message || 'Error de conexión');
      setGenerating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Envíos</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Genera etiquetas de envío con Envia para tus pedidos web
          </p>
        </div>
        <button
          onClick={() => setShowLabels(!showLabels)}
          className="btn-secondary"
        >
          {showLabels ? 'Ocultar enviados' : `Ver enviados (${shippedOrders.length})`}
        </button>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 font-medium">
          {successMsg}
        </div>
      )}

      {/* Error messages */}
      {ratesError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {ratesError}
          <button onClick={() => setRatesError(null)} className="ml-2 underline">Cerrar</button>
        </div>
      )}
      {generateError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {generateError}
          <button onClick={() => setGenerateError(null)} className="ml-2 underline">Cerrar</button>
        </div>
      )}

      {/* Origin address warning */}
      {(!settings.originAddress || !settings.originAddress.street) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          ⚠️ Configura tu dirección de origen en{' '}
          <a href="/admin/settings" className="font-semibold underline">Ajustes → Envíos</a> antes de generar etiquetas.
        </div>
      )}

      {/* Orders ready to ship */}
      <div className="space-y-4">
        {readyOrders.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-[var(--text-secondary)]">No hay pedidos pendientes de envío.</p>
          </div>
        ) : (
          readyOrders.map(order => (
            <div key={order.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="chip-blue">#{order.id.slice(0, 8)}</span>
                    <span className={order.status === 'pagado' ? 'chip-green' : 'chip-yellow'}>
                      {order.status === 'pagado' ? 'Pagado' : 'Pendiente'}
                    </span>
                    <span className="chip">
                      {order.paymentMethod === 'tarjeta' ? '💳 Tarjeta' : '💵 Contrareembolso'}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {formatDateTime(order.createdAt)}
                    </span>
                  </div>

                  {/* Customer info */}
                  <div className="bg-[var(--card-hover)] rounded-lg p-3 space-y-1 text-sm">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p className="text-[var(--text-secondary)]">📞 {order.shippingAddress.phone}</p>
                    <p className="text-[var(--text-secondary)]">
                      📍 {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.province} — {order.shippingAddress.postalCode}
                    </p>
                  </div>

                  {/* Products */}
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span>
                          {item.productName}{' '}
                          <span className="text-[var(--text-secondary)]">×{item.quantity}</span>
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.totalPrice, settings.currencySymbol)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:min-w-[200px]">
                  <div className="text-right">
                    <p className="text-sm text-[var(--text-secondary)]">Total</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(order.totalAmount, settings.currencySymbol)}
                    </p>
                  </div>

                  {/* Get rates button */}
                  {!rates[order.id] && (
                    <button
                      onClick={() => getRates(order)}
                      disabled={ratesLoading === order.id || !settings.originAddress?.street}
                      className="btn-primary text-sm"
                    >
                      {ratesLoading === order.id ? 'Consultando tarifas...' : '📦 Obtener tarifas'}
                    </button>
                  )}
                </div>
              </div>

              {/* Rates options */}
              {rates[order.id] && rates[order.id].length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wider">
                    Selecciona una tarifa:
                  </p>
                  <div className="grid gap-2">
                    {rates[order.id].map((rate, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--card-hover)]"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {carrierLabel[rate.carrier] || rate.carrier}
                            </span>
                            <span className="chip-blue text-xs">
                              {rate.serviceDescription || rate.service}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">
                            Entrega estimada: {rate.deliveryEstimate}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <span className="font-bold text-lg">
                            {formatCurrency(parseFloat(rate.totalPrice), rate.currency === 'EUR' ? '€' : rate.currency)}
                          </span>
                          <button
                            onClick={() => generateLabel(order, rate)}
                            disabled={generating === order.id}
                            className="btn-primary text-sm whitespace-nowrap"
                          >
                            {generating === order.id ? 'Generando...' : 'Generar etiqueta'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No rates */}
              {rates[order.id] && rates[order.id].length === 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-sm text-amber-600">
                    No hay tarifas disponibles para este pedido con el transportista seleccionado.
                    {' '}
                    <button
                      onClick={() => {
                        setRates(prev => {
                          const next = { ...prev };
                          delete next[order.id];
                          return next;
                        });
                      }}
                      className="underline font-medium"
                    >
                      Intentar de nuevo
                    </button>
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Shipped orders */}
      {showLabels && shippedOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Pedidos enviados ({shippedOrders.length})</h2>
          <div className="space-y-3">
            {shippedOrders.map(order => (
              <div key={order.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="chip-blue">#{order.id.slice(0, 8)}</span>
                      <span className="chip-green">Enviado</span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </div>
                    <p className="font-medium mt-2">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      📍 {order.shippingAddress.street}, {order.shippingAddress.city}
                    </p>
                  </div>
                  {order.shipmentTracking && (
                    <div className="text-right text-sm space-y-1">
                      <a
                        href={order.shipmentTracking.labelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs px-3 py-1.5 inline-flex"
                      >
                        📄 Ver etiqueta
                      </a>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Tracking: {order.shipmentTracking.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
