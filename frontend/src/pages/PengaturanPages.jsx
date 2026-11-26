import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ApiService } from '../api/client';
import { SkeletonPage } from '../components/common/SkeletonPage';
import { Building2, Users, Sliders, CheckCircle2, Plus, Edit2, Trash2, X, ShieldCheck, Key } from 'lucide-react';

/**
 * S-29, S-30, S-31: Pengaturan Tenant, Pengguna, dan Parameter Sistem
 */

export function PengaturanTenantSkeleton() {
  const { currentTenant } = useApp();

  return (
    <SkeletonPage
      screenId="S-29"
      title="Informasi Perhimpunan (Single Tenant)"
      subtitle="Data identitas resmi perhimpunan PPPSRS pemilik sistem MUTA Connect"
      roles={['admin']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-6 shadow-sm space-y-4">
        <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-3">
          <div className="flex items-center gap-2.5 font-bold text-base text-brand-primary">
            <Building2 className="w-5 h-5 text-brand-accent" />
            <span>PPPSRSKC CIPUTRA WORLD 1 JAKARTA</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-white rounded-lg border border-surface-border">
              <span className="text-content-muted block text-[11px]">ID Tenant</span>
              <span className="font-bold text-content-main font-mono">t-cw1</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-surface-border">
              <span className="text-content-muted block text-[11px]">Kapasitas Unit</span>
              <span className="font-bold text-content-main">{currentTenant?.unitCount || 342} Unit</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-surface-border">
              <span className="text-content-muted block text-[11px]">Total Bobot NPP</span>
              <span className="font-bold text-status-success">{currentTenant?.totalNpp || 100}% NPP</span>
            </div>
          </div>
          <p className="text-[11px] text-content-muted pt-1">
            Mode Single-Tenant aktif. Seluruh data sidang, anggota, kuorum, dan hasil voting terisolasi khusus untuk PPPSRSKC CIPUTRA WORLD 1 JAKARTA.
          </p>
        </div>
      </div>
    </SkeletonPage>
  );
}

const DEFAULT_USERS = [
  { id: 'u-1', nama: 'Administrator PPPSRS', username: 'admin', peran: 'admin', status: 'Aktif' },
  { id: 'u-2', nama: 'Panitia Pelaksana Sidang', username: 'panitia', peran: 'panitia', status: 'Aktif' },
  { id: 'u-3', nama: 'Petugas Meja Registrasi', username: 'petugas', peran: 'petugas', status: 'Aktif' }
];

export function PengaturanPenggunaSkeleton() {
  const { currentUser, login } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    password: '',
    peran: 'petugas',
    status: 'Aktif'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await ApiService.request('getUsers');
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
      } else {
        setUsers(DEFAULT_USERS);
      }
    } catch (err) {
      console.warn('Gagal memuat pengguna via API:', err);
      try {
        const saved = localStorage.getItem('muta_users_list');
        setUsers(saved ? JSON.parse(saved) : DEFAULT_USERS);
      } catch {
        setUsers(DEFAULT_USERS);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      nama: '',
      username: '',
      password: '',
      peran: 'petugas',
      status: 'Aktif'
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nama: user.nama || user.name || '',
      username: user.username || '',
      password: '',
      peran: user.peran || user.role || 'petugas',
      status: user.status || 'Aktif'
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    if (target.username.toLowerCase() === 'admin') {
      alert('Akun admin utama tidak boleh dihapus.');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus akun ${target.nama} (@${target.username})?`)) {
      try {
        await ApiService.request('deleteUser', { id: userId, username: target.username });
        showToast(`Akun @${target.username} berhasil dihapus.`);
        loadUsers();
      } catch (err) {
        alert('Gagal menghapus akun: ' + err.message);
      }
    }
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.username.trim()) {
      setErrorMsg('Nama pengguna dan username wajib diisi.');
      return;
    }

    const cleanUsername = formData.username.trim().toLowerCase();
    
    // Validasi duplikasi username
    const duplicate = users.find(u => u.username.toLowerCase() === cleanUsername && (!editingUser || u.id !== editingUser.id));
    if (duplicate) {
      setErrorMsg(`Username "${cleanUsername}" sudah digunakan oleh akun lain.`);
      return;
    }

    try {
      await ApiService.request('saveUser', {
        id: editingUser ? editingUser.id : null,
        nama: formData.nama.trim(),
        username: cleanUsername,
        peran: formData.peran,
        role: formData.peran,
        status: formData.status,
        password: formData.password || (editingUser ? undefined : 'password123')
      });

      // Jika user yang sedang login mengedit akunnya sendiri, perbarui data login di AppContext
      if (currentUser && currentUser.username.toLowerCase() === cleanUsername) {
        login(formData.peran, formData.nama.trim(), cleanUsername);
      }

      showToast(editingUser ? `Akun @${cleanUsername} berhasil diperbarui.` : `Akun baru @${cleanUsername} berhasil ditambahkan.`);
      setShowModal(false);
      loadUsers();
    } catch (err) {
      setErrorMsg('Gagal menyimpan akun: ' + err.message);
    }
  };

  return (
    <SkeletonPage
      screenId="S-30"
      title="Pengaturan Akun & Akses Pengguna"
      subtitle="Manajemen akun pengelola internal sidang (Admin, Panitia, Petugas Registrasi)"
      roles={['admin']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-sm space-y-4">
        {/* Notifikasi Toast */}
        {successToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Header Tabel & Tombol Tambah */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-content-main">Daftar Pengguna Sistem</h2>
            <p className="text-xs text-content-muted">Total {users.length} akun terdaftar di sistem MUTA Connect</p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary-hover shadow-sm transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Akun</span>
          </button>
        </div>

        {/* Tabel Akun */}
        <div className="border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-bg border-b border-surface-border text-content-muted font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Nama Pengguna</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Peran Akses</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-content-main">{u.nama}</td>
                  <td className="px-4 py-3 font-mono text-content-muted">@{u.username}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.peran === 'admin' 
                        ? 'bg-blue-100 text-brand-primary' 
                        : u.peran === 'panitia' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {u.peran}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${u.status === 'Aktif' ? 'text-status-success' : 'text-content-muted'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(u)}
                        className="p-1 text-brand-primary hover:bg-blue-50 rounded transition-colors"
                        title="Edit Akun"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {u.username !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleDelete(u.id)}
                          className="p-1 text-status-danger hover:bg-red-50 rounded transition-colors"
                          title="Hapus Akun"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Akun */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-card rounded-2xl border border-surface-border max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-base font-bold text-content-main">
                {editingUser ? 'Edit Akun Pengguna' : 'Tambah Akun Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-content-muted hover:text-content-main p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-content-main mb-1">Nama Lengkap / Jabatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Petugas Meja 2"
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-content-main mb-1">Username Login *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: petugas2"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-content-main mb-1">
                  Password {editingUser ? '(Kosongkan jika tidak diubah)' : '*'}
                </label>
                <input
                  type="password"
                  placeholder={editingUser ? '••••••••' : 'Masukkan password akun'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-content-main mb-1">Peran Akses</label>
                  <select
                    value={formData.peran}
                    onChange={e => setFormData({ ...formData, peran: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                  >
                    <option value="admin">Administrator (Admin)</option>
                    <option value="panitia">Panitia Sidang</option>
                    <option value="petugas">Petugas Registrasi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-content-main mb-1">Status Akun</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-surface-border rounded-lg text-xs font-bold text-content-muted hover:bg-surface-bg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary-hover shadow-sm"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Tambah Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SkeletonPage>
  );
}

export function PengaturanParameterSkeleton() {
  const [quorumThreshold, setQuorumThreshold] = useState('50.0');
  const [refreshInterval, setRefreshInterval] = useState('5');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SkeletonPage
      screenId="S-31"
      title="Parameter Sistem & Aturan Musyawarah"
      subtitle="Ambang batas kuorum, interval refresh proyektor, dan aturan bisnis"
      roles={['admin']}
    >
      <div className="max-w-xl bg-surface-card rounded-xl border border-surface-border p-6 shadow-sm space-y-4">
        {saved && (
          <div className="p-3 bg-green-50 border border-green-200 text-status-success rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Parameter berhasil diperbarui!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-content-main mb-1">
              Ambang Batas Kuorum Standar (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={quorumThreshold}
              onChange={(e) => setQuorumThreshold(e.target.value)}
              className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm font-mono tabular-nums"
            />
            <div className="text-[10px] text-content-muted mt-1">Default 50% sesuai AD/ART PPPSRS</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-main mb-1">
              Interval Refresh Layar Proyektor (Detik)
            </label>
            <input
              type="number"
              min="3"
              max="60"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm font-mono tabular-nums"
            />
            <div className="text-[10px] text-content-muted mt-1">Sesuai NFR-02: 5 detik untuk efisiensi kuota Apps Script</div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-brand-primary text-white rounded-lg text-xs font-semibold hover:bg-brand-primary-hover shadow-sm"
          >
            Simpan Parameter Sistem
          </button>
        </form>
      </div>
    </SkeletonPage>
  );
}
