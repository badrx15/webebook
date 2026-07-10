import { getData } from '@/lib/data-store';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const data = await getData();
  return (data.blogPosts || [])
    .filter(p => p.published)
    .map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getData();
  const post = (data.blogPosts || []).find(p => p.slug === params.slug);
  if (!post) return { title: 'Artículo no encontrado' };

  return {
    title: `${post.title} - Ibéricos Gourmet Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const data = await getData();
  const post = (data.blogPosts || []).find(p => p.slug === params.slug);

  if (!post || !post.published) notFound();

  // Format content: simple line breaks to paragraphs
  const paragraphs = post.content.split('\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🐷</span>
            <span className="text-lg font-bold text-gray-900">Ibéricos <span className="font-light text-red-700">Gourmet</span></span>
          </Link>
          <Link href="/blog" className="text-sm text-gray-500 hover:text-red-700">← Blog</Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-semibold text-red-700 bg-red-50 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-gray-400">
              {new Date(post.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-gray-600 mt-4 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Featured image */}
        {post.image && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-gray-100">
            <img
              src={post.image}
              alt={post.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {paragraphs.map((p, i) => {
            // Detect headers (lines starting with ##)
            if (p.startsWith('## ')) {
              return (
                <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                  {p.replace('## ', '')}
                </h2>
              );
            }
            if (p.startsWith('### ')) {
              return (
                <h3 key={i} className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                  {p.replace('### ', '')}
                </h3>
              );
            }
            // Detect lists (lines starting with -)
            if (p.startsWith('- ')) {
              return (
                <li key={i} className="text-gray-700 leading-relaxed ml-4 list-disc">
                  {p.replace('- ', '')}
                </li>
              );
            }
            return (
              <p key={i} className="text-gray-700 leading-relaxed mb-4 text-lg">
                {p}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-br from-red-50 to-amber-50 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">¿Te ha gustado este artículo?</h3>
          <p className="text-gray-600 mb-6">Prueba nuestro jamón ibérico cortado a cuchillo. ¡Te encantará!</p>
          <Link
            href="/#productos"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-red-700 text-white font-semibold hover:bg-red-800 transition-all shadow-lg"
          >
            Ver productos
          </Link>
        </div>
      </article>

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
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/" className="hover:text-white transition-colors">Tienda</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
