import { NextResponse } from 'next/server';
import { getArticles, getArticleById, saveArticle, deleteArticle } from '@/lib/articleService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const article = getArticleById(id);
      if (!article) {
        return NextResponse.json({ success: false, error: 'Artikel tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json({ success: true, article });
    }

    const articles = getArticles('all');
    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { article } = body;

    if (!article || !article.title) {
      return NextResponse.json({ success: false, error: 'Judul artikel wajib diisi!' }, { status: 400 });
    }

    const saved = saveArticle(article);
    return NextResponse.json({
      success: true,
      message: 'Artikel berhasil disimpan!',
      article: saved,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID artikel diperlukan' }, { status: 400 });
    }

    const ok = deleteArticle(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Gagal menghapus artikel' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Artikel berhasil dihapus!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
