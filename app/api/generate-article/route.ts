import { NextRequest, NextResponse } from 'next/server';
import { generateArticle } from '@/lib/gemini';
import { getData, setData } from '@/lib/data-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keyword } = body;

    if (!keyword || typeof keyword !== 'string' || keyword.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Introduce una palabra clave válida (mínimo 3 caracteres)' },
        { status: 400 }
      );
    }

    // Get existing slugs to avoid duplicates
    const data = await getData();
    const existingSlugs = (data.blogPosts || []).map(p => p.slug);

    // Generate article with Gemini
    const article = await generateArticle(keyword.trim(), existingSlugs);

    // Save to data store
    const now = new Date().toISOString();
    const newPost = {
      id: `gen-${Date.now().toString(36)}`,
      ...article,
      image: undefined,
      published: true,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    await setData({
      ...data,
      blogPosts: [...(data.blogPosts || []), newPost],
    });

    return NextResponse.json({ success: true, article: newPost });
  } catch (error: any) {
    console.error('Error generating article:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al generar el artículo' },
      { status: 500 }
    );
  }
}
