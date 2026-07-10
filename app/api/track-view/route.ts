import { NextRequest, NextResponse } from 'next/server';
import { getData, setData } from '@/lib/data-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug requerido' }, { status: 400 });
    }

    const data = await getData();
    const posts = data.blogPosts || [];
    const idx = posts.findIndex(p => p.slug === slug);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Artículo no encontrado' }, { status: 404 });
    }

    // Increment views
    const updatedPosts = [...posts];
    updatedPosts[idx] = {
      ...updatedPosts[idx],
      views: (updatedPosts[idx].views || 0) + 1,
    };

    await setData({ ...data, blogPosts: updatedPosts });

    return NextResponse.json({ success: true, views: updatedPosts[idx].views });
  } catch (error: any) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
