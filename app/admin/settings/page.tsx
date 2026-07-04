'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function SettingsPage() {
  const { data, updateSettings, resetAllData } = useStore();
  const { settings } = data;

  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...form,
      // If originAddress fields are empty, keep existing or clear
      originAddress: form.originAddress || settings.originAddress,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-[var(--text-secondary)] mt-1">Personaliza tu negocio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Información del Negocio</h2>
          <div>
            <label className="label">Nombre del negocio</label>
            <input type="text" value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
              className="input-field" placeholder="Mi Tienda Online" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Moneda</label>
              <select value={form.currency} onChange={e => {
                const symbols: Record<string, string> = { EUR: '€', USD: '$', MXN: 'MX$', COP: 'COL$', ARS: 'ARS$', GBP: '£', BRL: 'R$' };
                setForm(f => ({ ...f, currency: e.target.value, currencySymbol: symbols[e.target.value] || '€' }));
              }} className="select-field">
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - Dólar</option>
                <option value="MXN">MXN - Peso Mexicano</option>
                <option value="COP">COP - Peso Colombiano</option>
                <option value="ARS">ARS - Peso Argentino</option>
                <option value="GBP">GBP - Libra Esterlina</option>
                <option value="BRL">BRL - Real Brasileño</option>
              </select>
            </div>
            <div>
              <label className="label">Símbolo moneda</label>
              <input type="text" value={form.currencySymbol} onChange={e => setForm(f => ({ ...f, currencySymbol: e.target.value }))}
                className="input-field" placeholder="€" maxLength={5} />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Márgenes e Impuestos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Margen por defecto (%)</label>
              <input type="number" step="1" min="0" max="100" value={form.defaultMargin}
                onChange={e => setForm(f => ({ ...f, defaultMargin: parseInt(e.target.value) || 0 }))} className="input-field" />
            </div>
            <div>
              <label className="label">IVA / Impuesto (%)</label>
              <input type="number" step="0.1" min="0" max="100" value={form.taxRate}
                onChange={e => setForm(f => ({ ...f, taxRate: parseFloat(e.target.value) || 0 }))} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Alertas</h2>
          <div>
            <label className="label">Stock mínimo para alerta</label>
            <input type="number" min="0" value={form.lowStockThreshold}
              onChange={e => setForm(f => ({ ...f, lowStockThreshold: parseInt(e.target.value) || 0 }))} className="input-field sm:w-32" />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Envíos (Dirección de Origen)</h2>
          <p className="text-xs text-[var(--text-secondary)]">Dirección desde la que envías los pedidos. Se usará para generar las etiquetas de envío con Envia.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Nombre / Empresa</label>
              <input type="text" value={form.originAddress?.fullName || ''}
                onChange={e => setForm(f => ({ ...f, originAddress: { ...f.originAddress || { phone: '', street: '', city: '', province: '', postalCode: '', country: 'ES' }, fullName: e.target.value } }))}
                className="input-field" placeholder="Tu nombre o empresa" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Calle</label>
              <input type="text" value={form.originAddress?.street || ''}
                onChange={e => setForm(f => ({ ...f, originAddress: { ...f.originAddress || { fullName: '', phone: '', number: '', city: '', province: '', postalCode: '', country: 'ES' }, street: e.target.value } }))}
                className="input-field" placeholder="Ej: Calle Mayor" />
            </div>
            <div>
              <label className="label">Número</label>
              <input type="text" value={form.originAddress?.number || ''}
                onChange={e => setForm(f => ({ ...f, originAddress: { ...f.originAddress || { fullName: '', phone: '', street: '', city: '', province: '', postalCode: '', country: 'ES' }, number: e.target.value } }))}
                className="input-field" placeholder="Ej: 15" />
            </div>
            <div>
              <label className="label">Ciudad</label>
              <input type="text" value={form.originAddress?.city || ''}
                onChange={e => setForm(f => ({ ...f, originAddress: { ...f.originAddress || { fullName: '', phone: '', street: '', province: '', postalCode: '', country: 'ES' }, city: e.target.value } }))}
                className="input-field" placeholder="Ej: Cáceres" />
            </div>
            <div>
              <label className="label">Provincia</label>
              <input type="text" value={form.originAddress?.province || ''}
                onChange={e => setForm(f => ({ ...f, originAddress: { ...f.originAddress || { fullName: '', phone: '', street: '', city: '', postalCode: '', country: 'ES' }, province: e.target.value } }))}
                className="input-field" placeholder="Ej: Cáceres" />
            </div>
            <div>
              <label className="label">Código Postal</label>
              <input type="text" value={form.originAddress?.postalCode || ''}
                onChange={e => setForm(f => ({ ...f, originAddress: { ...f.originAddress || { fullName: '', phone: '', street: '', city: '', province: '', country: 'ES' }, postalCode: e.target.value } }))}
                className="input-field" placeholder="Ej: 10001" />
            </div>
            <div>
              <label className="label">Teléfono</label>
              <input type="tel" value={form.originAddress?.phone || ''}
                onChange={e => setForm(f => ({ ...f, originAddress: { ...f.originAddress || { fullName: '', phone: '', street: '', city: '', province: '', postalCode: '', country: 'ES' }, phone: e.target.value } }))}
                className="input-field" placeholder="Ej: +34 614 070 656" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>{saved && <span className="text-sm text-green-600 font-medium">✓ Configuración guardada</span>}</div>
          <button type="submit" className="btn-primary">Guardar Configuración</button>
        </div>
      </form>

      <div className="card border-red-200 space-y-4">
        <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wider">Zona de Peligro</h2>
        <p className="text-sm text-[var(--text-secondary)]">Esto eliminará todos tus datos (productos, ventas, gastos y configuración). Esta acción no se puede deshacer.</p>
        {showResetConfirm ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-red-600">¿Estás seguro?</span>
            <button onClick={() => { resetAllData(); setForm({ ...data.settings }); setShowResetConfirm(false); }} className="btn-danger">Sí, eliminar todo</button>
            <button onClick={() => setShowResetConfirm(false)} className="btn-secondary">Cancelar</button>
          </div>
        ) : <button onClick={() => setShowResetConfirm(true)} className="btn-danger">Restablecer todos los datos</button>}
      </div>
    </div>
  );
}
