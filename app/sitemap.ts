import { getData } from '@/lib/data-store';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ibericosgourmet.vercel.app';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Blog posts from the data store
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const data = await getData();
    if (data.blogPosts) {
      blogPages = data.blogPosts
        .filter(p => p.published)
        .map(post => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt || post.createdAt),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }));
    }
  } catch {
    // If data fetch fails, just return static pages
  }

  return [...staticPages, ...blogPages];
}
