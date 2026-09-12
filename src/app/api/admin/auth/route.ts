import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'seleco2026';

    if (password === expectedPassword) {
      return NextResponse.json({ success: true, message: 'Autentikasi berhasil' });
    }

    return NextResponse.json(
      { success: false, error: 'Password admin salah!' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Format permintaan tidak valid' },
      { status: 400 }
    );
  }
}
