import { NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent } from '@/lib/contentService';
import { defaultSiteContent } from '@/data/defaultSiteContent';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = getSiteContent();
    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, content: defaultSiteContent },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Data konten tidak ditemukan' },
        { status: 400 }
      );
    }

    const saved = saveSiteContent(content);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Gagal menyimpan konten ke server' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Konten website berhasil disimpan secara permanen!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan internal' },
      { status: 500 }
    );
  }
}
