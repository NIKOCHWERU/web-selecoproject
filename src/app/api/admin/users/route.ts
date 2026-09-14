import { NextResponse } from 'next/server';
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '@/lib/authService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = getAdminUsers();
    // Strip passwords before returning
    const safeUsers = users.map(({ password, ...u }) => u);
    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, username, name, email, password, role } = body;

    if (action === 'update' && id) {
      const res = updateAdminUser(id, { username, name, email, password, role });
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: 'User berhasil diperbarui!', user: res.user });
    }

    if (!username || !password || !name) {
      return NextResponse.json({ success: false, error: 'Username, nama, dan password wajib diisi!' }, { status: 400 });
    }

    const res = createAdminUser({ username, name, email: email || `${username}@selecoproject.com`, password, role: role || 'editor' });
    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'User admin baru berhasil ditambahkan!', user: res.user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID user diperlukan' }, { status: 400 });
    }

    const res = deleteAdminUser(id);
    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'User berhasil dihapus!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
