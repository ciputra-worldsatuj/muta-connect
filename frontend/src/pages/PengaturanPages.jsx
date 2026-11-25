import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkeletonPage } from '../components/common/SkeletonPage';
import { Building2, Users, Sliders, CheckCircle2 } from 'lucide-react';

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

export function PengaturanPenggunaSkeleton() {
  const { currentUser } = useApp();

  return (
    <SkeletonPage
      screenId="S-30"
      title="Pengaturan Akun & Akses Pengguna"
      subtitle="Manajemen akun pengelola internal sidang (Admin, Panitia, Petugas Registrasi)"
      roles={['admin']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-sm space-y-4">
        <div className="border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-bg border-b border-surface-border text-content-muted font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Nama Pengguna</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Peran Akses</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-content-main">Administrator PPPSRS</td>
                <td className="px-4 py-3 font-mono">admin</td>
                <td className="px-4 py-3 font-semibold text-brand-primary">ADMIN</td>
                <td className="px-4 py-3 text-status-success font-bold">AKTIF</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-content-main">Panitia Pelaksana Sidang</td>
                <td className="px-4 py-3 font-mono">panitia</td>
                <td className="px-4 py-3 font-semibold text-brand-accent">PANITIA</td>
                <td className="px-4 py-3 text-status-success font-bold">AKTIF</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-content-main">Petugas Meja Registrasi</td>
                <td className="px-4 py-3 font-mono">petugas</td>
                <td className="px-4 py-3 font-semibold text-amber-600">PETUGAS</td>
                <td className="px-4 py-3 text-status-success font-bold">AKTIF</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
