'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  Trash2, 
  Edit, 
  Mail, 
  User, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Shield,
  Clock
} from 'lucide-react';
import { AdminUser } from '@/types/user';

interface UserManagementProps {
  currentUsername?: string;
}

export default function UserManagement({ currentUsername = 'admin' }: UserManagementProps) {
  const [users, setUsers] = useState<Omit<AdminUser, 'password'>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<Omit<AdminUser, 'password'> | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'editor' as 'superadmin' | 'editor' | 'author',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.users) {
          setUsers(data.users);
        }
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const openAddModal = () => {
    setFormData({
      username: '',
      name: '',
      email: '',
      password: '',
      role: 'editor',
    });
    setFormError('');
    setShowAddModal(true);
  };

  const openEditModal = (user: Omit<AdminUser, 'password'>) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: '', // leave blank if unchanged
      role: user.role,
    });
    setFormError('');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    if (!formData.username || !formData.password || !formData.name) {
      setFormError('Username, Nama, dan Password wajib diisi!');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast(`Pengguna "${formData.name}" berhasil ditambahkan!`);
        setShowAddModal(false);
        fetchUsers();
      } else {
        setFormError(data.error || 'Gagal menambahkan user');
      }
    } catch (err) {
      setFormError('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmitting(true);
    setFormError('');

    try {
      const payload: any = {
        action: 'update',
        id: editingUser.id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast(`Data pengguna "${editingUser.username}" berhasil diperbarui!`);
        setEditingUser(null);
        fetchUsers();
      } else {
        setFormError(data.error || 'Gagal memperbarui user');
      }
    } catch (err) {
      setFormError('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: Omit<AdminUser, 'password'>) => {
    if (user.username === currentUsername) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif!');
      return;
    }

    if (users.length <= 1) {
      alert('Minimal harus ada 1 akun admin aktif pada sistem!');
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus akun admin "${user.username}" (${user.name})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast(`Akun "${user.username}" berhasil dihapus.`);
        fetchUsers();
      } else {
        triggerToast(data.error || 'Gagal menghapus user', 'error');
      }
    } catch (err) {
      triggerToast('Terjadi kesalahan jaringan', 'error');
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-900 text-slate-100 p-6 md:p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300' 
            : 'bg-red-950/90 border-red-500/50 text-red-300'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Manajemen Akses &amp; Keamanan
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
              Pengguna &amp; Akun Admin
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Kelola daftar staf, editor, dan superadmin yang memiliki akses ke dashboard SELECO.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:brightness-110 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-gold flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Admin Baru</span>
          </button>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Akun Admin</span>
              <div className="text-2xl font-bold text-white mt-1">{users.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Superadmin</span>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                {users.filter(u => u.role === 'superadmin').length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Editor &amp; Penulis</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {users.filter(u => u.role !== 'superadmin').length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* User Table Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-serif-title text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-300" />
              <span>Daftar Akun Pengguna Terdaftar</span>
            </h3>
            <span className="text-xs text-slate-500">{users.length} Akun</span>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-xs text-slate-400">Memuat daftar pengguna...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">Pengguna / Nama</th>
                    <th className="py-3.5 px-4 font-semibold">Username</th>
                    <th className="py-3.5 px-4 font-semibold">Role</th>
                    <th className="py-3.5 px-4 font-semibold">Email</th>
                    <th className="py-3.5 px-4 font-semibold">Terdaftar</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((user) => {
                    const isCurrent = user.username === currentUsername;
                    return (
                      <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center font-bold text-amber-300 text-xs shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {isCurrent && (
                                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded border border-amber-400/30 font-medium">
                                    Anda
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-amber-300 font-semibold">
                          @{user.username}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            user.role === 'superadmin'
                              ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                              : user.role === 'editor'
                              ? 'bg-blue-400/10 border-blue-400/30 text-blue-300'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {user.email}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                              title="Edit Profil / Password"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              disabled={isCurrent}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isCurrent
                                  ? 'text-slate-600 cursor-not-allowed'
                                  : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                              }`}
                              title={isCurrent ? 'Tidak bisa menghapus akun Anda sendiri' : 'Hapus User'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: TAMBAH USER BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif-title text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <span>Tambah Pengguna Admin Baru</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Misal: Budi Santoso, S.H."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Username (Untuk Login)
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                  placeholder="Misal: budi_legal"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="budi@selecoproject.com"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Peran / Role Akses
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="editor">Editor (Kelola Artikel &amp; Konten)</option>
                  <option value="superadmin">Superadmin (Akses Penuh)</option>
                  <option value="author">Author (Tulis Artikel)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl hover:brightness-110 shadow-md"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Tambah Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER & RESET PASSWORD */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif-title text-lg font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-400" />
                <span>Edit Pengguna: @{editingUser.username}</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password Baru (Kosongkan jika tidak ingin diubah)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Ketik password baru untuk mereset..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Peran / Role Akses
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="editor">Editor (Kelola Artikel &amp; Konten)</option>
                  <option value="superadmin">Superadmin (Akses Penuh)</option>
                  <option value="author">Author (Tulis Artikel)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl hover:brightness-110 shadow-md"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Perbarui Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
