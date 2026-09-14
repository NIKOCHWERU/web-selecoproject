import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/authService';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Support both username+password and legacy single password
    const userToAuth = username ? username : 'admin';
    const user = authenticateUser(userToAuth, password);

    if (user) {
      return NextResponse.json({
        success: true,
        message: 'Login berhasil!',
        user,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Username atau password admin salah!' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Format permintaan tidak valid' },
      { status: 400 }
    );
  }
}
