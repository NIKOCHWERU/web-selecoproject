export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  password?: string;
  role: 'superadmin' | 'editor';
  createdAt: string;
  lastLogin?: string;
}
