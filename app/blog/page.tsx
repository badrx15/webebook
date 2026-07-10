import Link from 'next/link';
import { getData } from '@/lib/data-store';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Ibéricos Gourmet | Jamón Ibérico, Recetas y Consejos',
  description: 'Descubre artículos sobre jamón ibérico, recetas, consejos de conservación y todo sobre nuestros productos ibéricos gourmet.',
};

export default async function BlogPage() {
  const data = await getData();
  const posts = data.blogPosts?.filter(p => p.published) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🐷</span>
            <span className="text-lg font-bold text-gray-900">Ibéricos <span className="font-light text-red-700">Gourmet</span></span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-red-700">← Volver</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-red-700 uppercase tracking-widest">Blog</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
            Artículos sobre Jamón Ibérico
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Recetas, consejos de conservación, guías de compra y todo lo que necesitas saber
            sobre el mundo del jamón ibérico.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Próximamente</h2>
            <p className="text-gray-500">Estamos preparando contenido para ti. ¡Vuelve pronto!</p>
            <Link href="/" className="inline-block mt-6 px-6 py-3 rounded-full bg-red-700 text-white font-semibold hover:bg-red-800 transition-all">
              Volver a la tienda
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-8">
            {posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-red-100 transition-all duration-300"
              >
                {post.image ? (
                  <div className="aspect-video bg-gradient-to-br from-red-50 to-amber-50 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-red-50 to-amber-50 flex items-center justify-center">
                    <span className="text-5xl">📖</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-700 transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-red-700 group-hover:gap-2 transition-all">
                    Leer más
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">🐷</span>
            <div>
              <span className="text-lg font-bold text-white">Ibéricos</span>
              <span className="text-lg font-light text-red-400">Gourmet</span>
            </div>
          </Link>
          <p className="text-sm mb-6">Los mejores productos ibéricos gourmet, cortados a cuchillo y envasados al vacío.</p>
          <Link href="/" className="text-sm text-red-400 hover:text-red-300 transition-colors">← Volver a la tienda</Link>
        </div>
      </footer>
    </div>
  );
}
