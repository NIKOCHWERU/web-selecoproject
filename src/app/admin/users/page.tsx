import { Metadata } from 'next';
import TailAdminLayout from '@/components/admin/TailAdminLayout';
import UserManagement from '@/components/admin/UserManagement';

export const metadata: Metadata = {
  title: 'Kelola Pengguna Admin | Seleco Admin',
  description: 'Kelola akun pengguna, peran, dan hak akses dashboard admin Seleco.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function UsersAdminPage() {
  return (
    <TailAdminLayout
      activeNav="users"
      title="Kelola Pengguna"
      subtitle="Manajemen akun administrator dan hak akses staf"
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <UserManagement />
      </div>
    </TailAdminLayout>
  );
}
