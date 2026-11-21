import fs from 'fs';
import path from 'path';
import { AdminUser } from '@/types/user';

const usersFilePath = path.join(process.cwd(), 'src', 'data', 'adminUsers.json');

const DEFAULT_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    username: 'admin',
    name: 'Administrator SELECO',
    email: 'admin@selecoproject.com',
    password: 'admin',
    role: 'superadmin',
    createdAt: new Date().toISOString(),
  },
];

export function getAdminUsers(): AdminUser[] {
  try {
    if (fs.existsSync(usersFilePath)) {
      const fileData = fs.readFileSync(usersFilePath, 'utf8');
      const users: AdminUser[] = JSON.parse(fileData);
      return users;
    } else {
      saveAdminUsers(DEFAULT_USERS);
      return DEFAULT_USERS;
    }
  } catch (error) {
    console.error('Error reading adminUsers.json:', error);
    return DEFAULT_USERS;
  }
}

export function saveAdminUsers(users: AdminUser[]): boolean {
  try {
    const dir = path.dirname(usersFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing adminUsers.json:', error);
    return false;
  }
}

export function authenticateUser(username: string, passwordAttempt: string): AdminUser | null {
  const users = getAdminUsers();
  const cleanUsername = username.trim().toLowerCase();

  // Find user by username or email
  const found = users.find(
    u => (u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername)
  );

  if (!found) {
    // Fallback: Check env ADMIN_PASSWORD or default 'admin'
    const fallbackPass = process.env.ADMIN_PASSWORD || 'admin';
    if ((cleanUsername === 'admin' || cleanUsername === 'administrator') && passwordAttempt === fallbackPass) {
      return {
        id: 'usr-1',
        username: 'admin',
        name: 'Administrator SELECO',
        email: 'admin@selecoproject.com',
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      };
    }
    return null;
  }

  if (found.password === passwordAttempt) {
    // Update lastLogin
    found.lastLogin = new Date().toISOString();
    saveAdminUsers(users);
    
    // Return without password field
    const { password, ...safeUser } = found;
    return safeUser as AdminUser;
  }

  return null;
}

export function createAdminUser(userData: Omit<AdminUser, 'id' | 'createdAt'>): { success: boolean; user?: AdminUser; error?: string } {
  const users = getAdminUsers();
  const cleanUsername = userData.username.trim().toLowerCase();
  
  if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
    return { success: false, error: 'Username sudah digunakan!' };
  }

  const newUser: AdminUser = {
    id: `usr-${Date.now()}`,
    username: userData.username.trim(),
    name: userData.name.trim(),
    email: userData.email.trim(),
    password: userData.password || 'seleco2026',
    role: userData.role || 'editor',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveAdminUsers(users);

  const { password, ...safeUser } = newUser;
  return { success: true, user: safeUser as AdminUser };
}

export function updateAdminUser(id: string, updates: Partial<AdminUser>): { success: boolean; user?: AdminUser; error?: string } {
  const users = getAdminUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) {
    return { success: false, error: 'User tidak ditemukan' };
  }

  // Check username uniqueness if username updated
  if (updates.username) {
    const cleanUsername = updates.username.trim().toLowerCase();
    const duplicate = users.find(u => u.id !== id && u.username.toLowerCase() === cleanUsername);
    if (duplicate) {
      return { success: false, error: 'Username sudah digunakan oleh pengguna lain!' };
    }
  }

  const updated: AdminUser = {
    ...users[idx],
    ...(updates.username ? { username: updates.username.trim() } : {}),
    ...(updates.name ? { name: updates.name.trim() } : {}),
    ...(updates.email ? { email: updates.email.trim() } : {}),
    ...(updates.password ? { password: updates.password } : {}),
    ...(updates.role ? { role: updates.role } : {}),
  };

  users[idx] = updated;
  saveAdminUsers(users);

  const { password, ...safeUser } = updated;
  return { success: true, user: safeUser as AdminUser };
}

export function deleteAdminUser(id: string): { success: boolean; error?: string } {
  const users = getAdminUsers();
  if (users.length <= 1) {
    return { success: false, error: 'Tidak dapat menghapus satu-satunya akun admin!' };
  }

  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) {
    return { success: false, error: 'User tidak ditemukan' };
  }

  saveAdminUsers(filtered);
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// SECURE SERVER-SIDE TOKEN & REQUEST AUTHENTICATION
// ─────────────────────────────────────────────────────────────
import crypto from 'crypto';

const AUTH_SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || 'seleco_secure_auth_token_key_2026';

export function createSessionToken(user: AdminUser): string {
  const payload = JSON.stringify({
    userId: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  const b64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(b64Payload).digest('base64url');
  return `${b64Payload}.${signature}`;
}

export function verifySessionToken(token: string): { valid: boolean; user?: any } {
  if (!token || typeof token !== 'string') return { valid: false };
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };
  const [b64Payload, signature] = parts;
  try {
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(b64Payload).digest('base64url');
    if (signature !== expectedSig) {
      return { valid: false };
    }
    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return { valid: false };
    }
    return { valid: true, user: payload };
  } catch {
    return { valid: false };
  }
}

export function verifyAdminRequest(request: Request): boolean {
  // 1. Check Cookie 'seleco_admin_token'
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/seleco_admin_token=([^;]+)/);
  if (match) {
    const result = verifySessionToken(decodeURIComponent(match[1]));
    if (result.valid) return true;
  }

  // 2. Check Authorization header: Bearer <token>
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const result = verifySessionToken(token);
    if (result.valid) return true;
  }

  // 3. Check X-Admin-Key against ADMIN_PASSWORD or AUTH_SECRET
  const customKey = request.headers.get('x-admin-key');
  const fallbackPass = process.env.ADMIN_PASSWORD || 'admin';
  if (customKey && (customKey === fallbackPass || customKey === AUTH_SECRET)) {
    return true;
  }

  return false;
}
