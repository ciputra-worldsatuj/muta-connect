import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkeletonPage } from '../components/common/SkeletonPage';
import { Building2, Users, Sliders, CheckCircle2 } from 'lucide-react';

/**
 * S-29, S-30, S-31: Pengaturan Tenant, Pengguna, dan Parameter Sistem
 */

export function PengaturanTenantSkeleton() {
  const { tenants, currentTenant } = useApp();

  return (
    <SkeletonPage
      screenId="S-29"
      title="Pengaturan Multi-Tenant PPPSRS"
      subtitle="Entitas perhimpunan yang dikelola dalam satu basis data bersama (SRS Section 1.2)"
      roles={['admin']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenants.map(t => (
            <div key={t.id} className="p-4 bg-surface-bg rounded-xl border border-surface-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-brand-primary">
                <Building2 className="w-4 h-4 text-brand-accent" />
                <span>{t.name}</span>
              </div>
              <div className="text-xs text-content-muted">
                Kapasitas: {t.unitCount} Unit • Total Bobot: {t.totalNpp || 100}% NPP
              </div>
            </div>
          ))}
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
