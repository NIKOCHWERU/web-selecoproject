import { NextResponse } from 'next/server';
import { getArticles, getArticleBySlug } from '@/lib/articleService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const article = getArticleBySlug(slug);
      if (!article || article.status !== 'published') {
        return NextResponse.json({ success: false, error: 'Artikel tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json({ success: true, article });
    }

    const articles = getArticles('published');
    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
