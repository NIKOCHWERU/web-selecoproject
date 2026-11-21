import { NextResponse } from 'next/server';
import { authenticateUser, createSessionToken } from '@/lib/authService';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Support both username+password and legacy single password
    const userToAuth = username ? username : 'admin';
    const user = authenticateUser(userToAuth, password);

    if (user) {
      const token = createSessionToken(user);
      const response = NextResponse.json({
        success: true,
        message: 'Login berhasil!',
        user,
        token,
      });

      // Set secure HttpOnly cookie for server-side auth
      response.cookies.set({
        name: 'seleco_admin_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
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

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Logout berhasil',
  });
  response.cookies.set({
    name: 'seleco_admin_token',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return response;
}
