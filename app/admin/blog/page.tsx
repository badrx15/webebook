'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import type { BlogPost } from '@/lib/types';
import Modal from '@/components/Modal';

export default function BlogAdminPage() {
  const { data, addBlogPost, updateBlogPost, deleteBlogPost } = useStore();
  const { blogPosts } = data;
  const posts = blogPosts || [];

  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Recetas',
    tags: '',
    published: false,
    image: '',
  });

  // --- Stats ---
  const totalViews = useMemo(() => posts.reduce((s, p) => s + (p.views || 0), 0), [posts]);
  const publishedCount = useMemo(() => posts.filter(p => p.published).length, [posts]);

  const openNew = () => {
    setEditingPost(null);
    setForm({ title: '', slug: '', excerpt: '', content: '', category: 'Recetas', tags: '', published: false, image: '' });
    setShowModal(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditingPost(p);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      tags: p.tags?.join(', ') || '',
      published: p.published,
      image: p.image || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;

    const post = {
      title: form.title.trim(),
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      published: form.published,
      image: form.image || undefined,
      views: 0,
    };

    if (editingPost) {
      updateBlogPost(editingPost.id, post);
    } else {
      addBlogPost(post);
    }
    setShowModal(false);
  };

  const togglePublished = (post: BlogPost) => {
    updateBlogPost(post.id, { published: !post.published });
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {posts.length} artículos · {publishedCount} publicados · {totalViews} visitas totales
          </p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Artículo
        </button>
      </div>

      {/* Blog posts list */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-[var(--text-secondary)]">No hay artículos todavía. ¡Crea el primero!</p>
          </div>
        ) : (
          [...posts]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map(post => (
              <div key={post.id} className="card flex items-start gap-4 p-4">
                {post.image ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-red-50 flex items-center justify-center text-2xl flex-shrink-0">📖</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">{post.category}</span>
                    <button
                      onClick={() => togglePublished(post)}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                        post.published
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {post.published ? 'Publicado' : 'Borrador'}
                    </button>
                    {/* Views badge */}
                    <span className="text-xs text-gray-400 flex items-center gap-1 ml-1" title="Visitas">
                      👁️ {post.views || 0}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                  <p className="text-sm text-gray-500 truncate mt-0.5">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString('es-ES')}
                    </span>
                    <span className="text-xs text-gray-400">/{post.slug}</span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(post)} className="btn-ghost">Editar</button>
                  <button
                    onClick={() => { if (confirm('¿Eliminar este artículo?')) deleteBlogPost(post.id); }}
                    className="btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Stats summary */}
      {posts.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-3">📊 Resumen del Blog</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-700">{posts.length}</p>
              <p className="text-xs text-blue-600">Total artículos</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-700">{publishedCount}</p>
              <p className="text-xs text-green-600">Publicados</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <p className="text-2xl font-bold text-purple-700">{totalViews}</p>
              <p className="text-xs text-purple-600">Visitas totales</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <p className="text-2xl font-bold text-amber-700">{posts.length - publishedCount}</p>
              <p className="text-xs text-amber-600">Borradores</p>
            </div>
          </div>
        </div>
      )}

      {/* Blog Post Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPost ? 'Editar Artículo' : 'Nuevo Artículo'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => {
                const title = e.target.value;
                setForm(f => ({
                  ...f,
                  title,
                  slug: editingPost ? f.slug : title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                }));
              }}
              className="input-field"
              placeholder="Ej: Cómo conservar el jamón ibérico envasado al vacío"
              required
            />
          </div>
          <div>
            <label className="label">Slug / URL</label>
            <input
              type="text"
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              className="input-field"
              placeholder="como-conservar-jamon-iberico"
            />
            <p className="text-xs text-gray-400 mt-1">URL del artículo: /blog/{form.slug || 'slug'}</p>
          </div>
          <div>
            <label className="label">Extracto (descripción corta para SEO)</label>
            <textarea
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              className="input-field"
              rows={2}
              placeholder="Resumen breve que aparecerá en Google y en la lista del blog"
            />
          </div>
          <div>
            <label className="label">Categoría</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="select-field"
            >
              <option value="Recetas">Recetas</option>
              <option value="Consejos">Consejos</option>
              <option value="Guía de compra">Guía de compra</option>
              <option value="Producto">Producto</option>
            </select>
          </div>
          <div>
            <label className="label">Tags (separados por comas)</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              className="input-field"
              placeholder="jamón ibérico, conservación, recetas"
            />
          </div>
          <div>
            <label className="label">Contenido del artículo</label>
            <p className="text-xs text-gray-400 mb-2">
              Usa ## para títulos, ### para subtítulos, - para listas. Saltos de línea para párrafos.
            </p>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="input-field font-mono text-sm"
              rows={12}
              placeholder="Escribe aquí el contenido del artículo..."
              required
            />
          </div>
          <div>
            <label className="label">URL de la imagen</label>
            <input
              type="text"
              value={form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
              className="input-field"
              placeholder="https://ejemplo.com/imagen.jpg (o usa una URL externa)"
            />
            {form.image && (
              <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img src={form.image} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
              className="w-5 h-5 accent-red-700"
            />
            <div>
              <p className="font-medium text-gray-900">Publicado</p>
              <p className="text-xs text-gray-400">Los artículos no publicados no se ven en la web</p>
            </div>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">
              {editingPost ? 'Guardar Cambios' : 'Crear Artículo'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
