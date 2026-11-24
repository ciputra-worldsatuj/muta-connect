import React from 'react';
import { useApp } from '../context/AppContext';
import { SkeletonPage } from '../components/common/SkeletonPage';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Vote,
  QrCode
} from 'lucide-react';

export function DashboardPage() {
  const { currentUser, currentTenant, currentSession } = useApp();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-primary to-blue-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-dark-accent font-semibold uppercase tracking-wider mb-1">
            <span>S-03 Beranda [{currentUser.role.toUpperCase()}]</span>
            <span>•</span>
            <span>{currentTenant?.name}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Selamat Datang, {currentUser.name}
          </h1>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Sidang Aktif: <strong className="text-white">{currentSession?.title}</strong> ({currentSession?.status})
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <a
            href="#/proyektor/kehadiran"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 transition-colors"
          >
            Layar Proyektor
          </a>
        </div>
      </div>

      {/* Metric Cards Skeleton (IA Section 6) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-card p-4 rounded-xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-content-muted mb-2">
            <span className="text-xs font-medium">Kuorum Terkini</span>
            <TrendingUp className="w-4 h-4 text-brand-accent" />
          </div>
          <div className="text-2xl font-bold text-brand-primary tabular-nums">0.00%</div>
          <div className="text-[11px] text-status-warning font-medium mt-1">Ambang batas: &gt; 50.00%</div>
        </div>

        <div className="bg-surface-card p-4 rounded-xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-content-muted mb-2">
            <span className="text-xs font-medium">Peserta Hadir</span>
            <Users className="w-4 h-4 text-status-success" />
          </div>
          <div className="text-2xl font-bold text-content-main tabular-nums">0 / 0</div>
          <div className="text-[11px] text-content-muted mt-1">0 unit terwakili</div>
        </div>

        <div className="bg-surface-card p-4 rounded-xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-content-muted mb-2">
            <span className="text-xs font-medium">Status Sidang</span>
            <Calendar className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="text-xl font-bold text-content-main">{currentSession?.status || 'Draft'}</div>
          <div className="text-[11px] text-content-muted mt-1">Mulai Sidang belum ditekan</div>
        </div>

        <div className="bg-surface-card p-4 rounded-xl border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-content-muted mb-2">
            <span className="text-xs font-medium">Peringatan QR</span>
            <AlertTriangle className="w-4 h-4 text-status-danger" />
          </div>
          <div className="text-2xl font-bold text-content-main tabular-nums">0</div>
          <div className="text-[11px] text-status-success font-medium mt-1">Tidak ada anomali</div>
        </div>
      </div>

      {/* Shortcut Sesuai Peran (IA Section 6) */}
      <div className="bg-surface-card p-6 rounded-xl border border-surface-border shadow-sm">
        <h2 className="text-sm font-bold text-content-main mb-4 uppercase tracking-wider">
          Pintasan Aksi Cepat ({currentUser.role.toUpperCase()})
        </h2>

        {currentUser.role === 'petugas' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="#/registrasi/scan"
              className="p-5 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-brand-primary text-base">Buka Kamera Scan QR</div>
                <div className="text-xs text-content-muted">Layar check-in peserta meja registrasi (S-13)</div>
              </div>
            </a>

            <a
              href="#/registrasi/manual"
              className="p-5 rounded-xl bg-slate-50 border border-surface-border hover:bg-slate-100 transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-accent text-white flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-content-main text-base">Check-in Manual</div>
                <div className="text-xs text-content-muted">Cari nomor unit / nama peserta (S-14)</div>
              </div>
            </a>
          </div>
        )}

        {currentUser.role !== 'petugas' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a href="#/anggota" className="p-3 bg-surface-bg rounded-lg border border-surface-border hover:border-brand-primary text-center transition-colors">
              <Users className="w-5 h-5 mx-auto text-brand-primary mb-1" />
              <div className="text-xs font-semibold">Anggota (S-04)</div>
            </a>
            <a href={`#/sidang/${currentSession?.id}/agenda`} className="p-3 bg-surface-bg rounded-lg border border-surface-border hover:border-brand-primary text-center transition-colors">
              <Vote className="w-5 h-5 mx-auto text-brand-accent mb-1" />
              <div className="text-xs font-semibold">Agenda Soal (S-09)</div>
            </a>
            <a href="#/panitia/sidang" className="p-3 bg-surface-bg rounded-lg border border-surface-border hover:border-brand-primary text-center transition-colors">
              <Clock className="w-5 h-5 mx-auto text-status-warning mb-1" />
              <div className="text-xs font-semibold">Kendali Sidang (S-15)</div>
            </a>
            <a href="#/laporan" className="p-3 bg-surface-bg rounded-lg border border-surface-border hover:border-brand-primary text-center transition-colors">
              <CheckCircle2 className="w-5 h-5 mx-auto text-status-success mb-1" />
              <div className="text-xs font-semibold">Laporan (S-25)</div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
