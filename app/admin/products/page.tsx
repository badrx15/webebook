'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { formatCurrency, formatDate, calculateMargin, PRODUCT_CATEGORIES } from '@/lib/utils';
import Modal from '@/components/Modal';

type SortField = 'name' | 'sellingPrice' | 'costPrice' | 'stock' | 'margin' | 'orders';
type SortDir = 'asc' | 'desc';

export default function ProductsPage() {
  const { data, addProduct, updateProduct, deleteProduct } = useStore();
  const { products, sales, settings } = data;

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [compressing, setCompressing] = useState(false);

  // Compress a base64 image to max 800px JPEG 0.7 (reduces ~2MB to ~100-200KB)
  const compressImageDataUrl = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 800;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(dataUrl); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => resolve(dataUrl); // Keep original on error
      img.src = dataUrl;
    });
  };

  // Auto-recompress oversized images on page load
  const recompressedRef = useRef(false);
  useEffect(() => {
    if (recompressedRef.current || products.length === 0) return;

    const run = async () => {
      const LARGE_THRESHOLD = 200 * 1024; // 200KB in base64 = ~150KB raw
      let anyCompressed = false;

      for (const product of products) {
        if (!product.image) continue;
        // Rough size: base64 length * 3/4 = bytes
        const approxBytes = (product.image.length * 3) / 4;
        if (approxBytes > LARGE_THRESHOLD) {
          try {
            setCompressing(true);
            const compressed = await compressImageDataUrl(product.image);
            // Only update if it actually shrank
            if (compressed.length < product.image.length * 0.8) {
              updateProduct(product.id, { image: compressed });
              anyCompressed = true;
            }
          } catch (e) {
            console.error('Error compressing image for', product.name, e);
          }
        }
      }
      setCompressing(false);
      recompressedRef.current = true;
    };

    run();
  }, [products]);

  // Count orders per product (distinct sales containing each product)
  const productOrders = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => { counts[p.id] = 0; });
    sales.forEach(sale => {
      const seen = new Set<string>();
      sale.items.forEach(item => {
        if (!seen.has(item.productId)) {
          seen.add(item.productId);
          if (counts[item.productId] !== undefined) {
            counts[item.productId]++;
          }
        }
      });
    });
    return counts;
  }, [products, sales]);

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Otra',
    costPrice: 0,
    sellingPrice: 0,
    sku: '',
    stock: 0,
    image: '',
  });

  const openNew = () => {
    setEditingProduct(null);
    setForm({ name: '', description: '', category: 'Otra', costPrice: 0, sellingPrice: 0, sku: '', stock: 0, image: '' });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      sku: p.sku,
      stock: p.stock,
      image: p.image || '',
    });
    setShowModal(true);
  };

  // Image upload handler — compresses before converting to base64
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes (JPG, PNG, WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      if (!dataUrl) return;
      setCompressing(true);
      const compressed = await compressImageDataUrl(dataUrl);
      setForm(f => ({ ...f, image: compressed }));
      setCompressing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, form);
    } else {
      addProduct(form);
    }
    setShowModal(false);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const margin = form.costPrice > 0 && form.sellingPrice > 0
    ? calculateMargin(form.costPrice, form.sellingPrice)
    : 0;

  const suggestedPrice = form.costPrice > 0
    ? form.costPrice / (1 - (settings.defaultMargin / 100))
    : 0;

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      list = list.filter(p => p.category === categoryFilter);
    }
    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'name': return a.name.localeCompare(b.name) * dir;
        case 'sellingPrice': return (a.sellingPrice - b.sellingPrice) * dir;
        case 'costPrice': return (a.costPrice - b.costPrice) * dir;
        case 'stock': return (a.stock - b.stock) * dir;
        case 'margin': return (calculateMargin(a.costPrice, a.sellingPrice) - calculateMargin(b.costPrice, b.sellingPrice)) * dir;
        case 'orders': return ((productOrders[a.id] || 0) - (productOrders[b.id] || 0)) * dir;
        default: return 0;
      }
    });
    return list;
  }, [products, search, categoryFilter, sortField, sortDir]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-300 dark:text-gray-600 ml-1">↕</span>;
    return <span className="text-[var(--accent)] ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Productos
            {compressing && (
              <span className="inline-flex items-center gap-2 text-sm font-normal text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Comprimiendo imágenes...
              </span>
            )}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">{products.length} productos registrados</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="select-field sm:w-48"
        >
          <option value="">Todas las categorías</option>
          {PRODUCT_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header cursor-pointer" onClick={() => toggleSort('name')}>
                  Nombre <SortIcon field="name" />
                </th>
                <th className="table-header">Categoría</th>
                <th className="table-header cursor-pointer" onClick={() => toggleSort('costPrice')}>
                  Coste <SortIcon field="costPrice" />
                </th>
                <th className="table-header cursor-pointer" onClick={() => toggleSort('sellingPrice')}>
                  Precio Venta <SortIcon field="sellingPrice" />
                </th>
                <th className="table-header cursor-pointer" onClick={() => toggleSort('margin')}>
                  Margen <SortIcon field="margin" />
                </th>
                <th className="table-header cursor-pointer" onClick={() => toggleSort('stock')}>
                  Stock <SortIcon field="stock" />
                </th>
                <th className="table-header text-center">Pedidos</th>
                <th className="table-header">SKU</th>
                <th className="table-header text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-cell text-center text-[var(--text-secondary)] py-12">
                    {products.length === 0
                      ? 'No hay productos todavía. ¡Crea tu primer producto!'
                      : 'No se encontraron productos con esos filtros.'}
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const marginPct = calculateMargin(p.costPrice, p.sellingPrice);
                  const isLowStock = p.stock <= settings.lowStockThreshold && p.stock > 0;
                  const isOutOfStock = p.stock <= 0;
                  return (
                    <tr key={p.id} className="hover:bg-[var(--card-hover)] transition-colors">
                      <td className="table-cell font-medium">{p.name}</td>
                      <td className="table-cell">
                        <span className="chip-blue">{p.category}</span>
                      </td>
                      <td className="table-cell">{formatCurrency(p.costPrice, settings.currencySymbol)}</td>
                      <td className="table-cell font-semibold">{formatCurrency(p.sellingPrice, settings.currencySymbol)}</td>
                      <td className="table-cell">
                        <span className={marginPct >= 30 ? 'chip-green' : marginPct >= 15 ? 'chip-yellow' : 'chip-red'}>
                          {marginPct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={isOutOfStock ? 'chip-red' : isLowStock ? 'chip-yellow' : ''}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="table-cell text-center font-semibold">{productOrders[p.id] || 0}</td>
                      <td className="table-cell text-[var(--text-secondary)]">{p.sku || '—'}</td>
                      <td className="table-cell text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="btn-ghost">Editar</button>
                          <button
                            onClick={() => { if (confirm('¿Eliminar este producto?')) deleteProduct(p.id); }}
                            className="btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Nombre del producto *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input-field"
                placeholder="Ej: Jamón Ibérico Cebo de Campo 75%"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Descripción</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="input-field"
                rows={2}
                placeholder="Breve descripción del producto"
              />
            </div>
            <div>
              <label className="label">Categoría</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="select-field"
              >
                {PRODUCT_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">SKU / Código</label>
              <input
                type="text"
                value={form.sku}
                onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                className="input-field"
                placeholder="IB-001"
              />
            </div>
            <div>
              <label className="label">Precio de coste ({settings.currencySymbol})</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.costPrice || ''}
                onChange={e => setForm(f => ({ ...f, costPrice: parseFloat(e.target.value) || 0 }))}
                className="input-field"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="label">Precio de venta ({settings.currencySymbol})</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.sellingPrice || ''}
                onChange={e => setForm(f => ({ ...f, sellingPrice: parseFloat(e.target.value) || 0 }))}
                className="input-field"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="label">Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock || ''}
                onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))}
                className="input-field"
                placeholder="0"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Foto del producto</label>
              <div className="flex items-start gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 hover:border-red-300 hover:bg-red-50 transition-all text-sm text-gray-600 hover:text-red-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{form.image ? 'Cambiar foto' : 'Subir foto'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                {form.image && (
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, image: '' }))}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              {form.image && (
                <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={form.image} alt="Vista previa" className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">Máximo 2MB. Formatos: JPG, PNG, WEBP</p>
            </div>
          </div>

          {(form.costPrice > 0 || form.sellingPrice > 0) && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Margen actual:</span>
                <span className={`font-semibold ${margin >= 30 ? 'text-green-600' : margin >= 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {margin.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Beneficio por unidad:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(form.sellingPrice - form.costPrice, settings.currencySymbol)}
                </span>
              </div>
              {form.costPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Precio sugerido ({settings.defaultMargin}% margen):</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(suggestedPrice, settings.currencySymbol)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">
              {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
