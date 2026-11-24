import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApiService } from '../api/client';
import { Lock, User, ArrowRight, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * UF-01: Login dan Kelola Pengguna
 * Sesuai spesifikasi User Flow UF-01:
 * - Validasi username & password
 * - Penanganan password sementara: wajib ganti password (UF-01 Main Flow langkah 4-5)
 * - Pesan error netral: "Username atau password salah" (Validation Rules UF-01)
 */

export function LoginSkeleton() {
  const { login } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await ApiService.request('login', { username, password });
      if (res.user.isTempPassword) {
        window.location.hash = '#/ganti-password';
      } else {
        login(res.user.role || 'admin');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Username atau password salah');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRole = (role) => {
    setUsername(role);
    setPassword('password123');
    setErrorMsg('');
  };

  return (
    <div className="space-y-5">
      <div className="text-center pb-2">
        <h2 className="text-xl font-bold text-content-main">Masuk ke Akun Anda</h2>
        <p className="text-xs text-content-muted mt-0.5">Sistem Musyawarah PPPSRS (MUTA Connect)</p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-status-danger text-status-danger rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Pintasan Peran untuk Kemudahan Uji Coba */}
      <div className="bg-surface-bg p-3 rounded-lg border border-surface-border">
        <label className="block text-[11px] font-bold text-content-muted uppercase tracking-wider mb-1.5">
          Pintasan Akun Uji Coba:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { role: 'admin', label: 'Admin' },
            { role: 'panitia', label: 'Panitia' },
            { role: 'petugas', label: 'Petugas' }
          ].map(item => (
            <button
              key={item.role}
              type="button"
              onClick={() => handleQuickRole(item.role)}
              className={`py-1.5 px-2 rounded-md text-xs font-semibold uppercase border transition-colors ${
                username === item.role
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'bg-surface-card text-content-muted border-surface-border hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-content-main mb-1">
            Username
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-content-muted absolute left-3 top-3" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm text-content-main focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Masukkan username"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-content-main mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-content-muted absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm text-content-main focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Minimal 8 karakter"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-brand-primary text-white font-semibold text-xs rounded-lg hover:bg-brand-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{isLoading ? 'Memverifikasi...' : 'Masuk Aplikasi'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-3 border-t border-surface-border text-center">
        <a href="#/ganti-password" className="text-xs text-brand-accent hover:underline font-medium">
          Pengguna Pertama? Ganti Password Sementara &rarr;
        </a>
      </div>
    </div>
  );
}

export function ChangePasswordSkeleton() {
  const { login } = useApp();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ error: '', success: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setStatus({ error: 'Password baru minimal 8 karakter (sesuai aturan keamanan).', success: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ error: 'Konfirmasi password baru tidak cocok.', success: false });
      return;
    }

    setStatus({ error: '', success: true });
    setTimeout(() => {
      login('admin');
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="text-center pb-2">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-brand-primary mx-auto flex items-center justify-center mb-2">
          <KeyRound className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-content-main">Ganti Password Sementara</h2>
        <p className="text-xs text-content-muted mt-0.5">Wajib mengganti password saat login pertama kali (UF-01)</p>
      </div>

      {status.error && (
        <div className="p-3 bg-red-50 border border-status-danger text-status-danger rounded-lg text-xs">
          {status.error}
        </div>
      )}

      {status.success && (
        <div className="p-3 bg-green-50 border border-status-success text-status-success rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Password berhasil diperbarui! Mengarahkan ke beranda...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-content-main mb-1">Password Sementara Saat Ini</label>
          <input
            type="password"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
            placeholder="Ketik password sementara"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-content-main mb-1">Password Baru (min. 8 karakter)</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
            placeholder="Minimal 8 karakter"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-content-main mb-1">Ulangi Password Baru</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
            placeholder="Ketik ulang password baru"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary-hover shadow-sm transition-colors mt-2"
        >
          Simpan Password Baru & Masuk
        </button>
      </form>
    </div>
  );
}
