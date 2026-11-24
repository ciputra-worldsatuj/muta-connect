import React from 'react';
import { LoginSkeleton, ChangePasswordSkeleton } from './AuthPages';
import { DashboardPage } from './DashboardPage';
import { DaftarAnggotaSkeleton, FormAnggotaSkeleton, ImporCSVSkeleton } from './AnggotaPages';
import { 
  DaftarSidangSkeleton, 
  FormSidangSkeleton, 
  AgendaSoalSkeleton, 
  UndanganQRSkeleton, 
  DraftMessageSkeleton, 
  KelolaKuasaSkeleton 
} from './SidangPages';
import { ScanQRSkeleton, CheckInManualSkeleton } from './RegistrasiPages';
import { KendaliSidangSkeleton, KendaliVotingSkeleton, DaftarPesertaSkeleton } from './PanitiaPages';
import { ProyektorKehadiranSkeleton, ProyektorVotingSkeleton } from './ProyektorPages';
import { VotingPemilihPage } from './VotingPemilihPage';
import { LaporanSidangSkeleton, BeritaAcaraSkeleton, RiwayatSidangSkeleton, LogAktivitasSkeleton } from './LaporanPages';
import { PengaturanTenantSkeleton, PengaturanPenggunaSkeleton, PengaturanParameterSkeleton } from './PengaturanPages';

/**
 * PageDispatcher - Pemetaan Rute ke Komponen Skeleton
 * Mengacu pada Information Architecture (IA v1.0 Section 5 & 12)
 */

export function PageDispatcher({ route, params }) {
  const screenId = route.screenId;

  switch (screenId) {
    // Auth
    case 'S-01': return <LoginSkeleton />;
    case 'S-02': return <ChangePasswordSkeleton />;

    // Dashboard
    case 'S-03': return <DashboardPage />;

    // Anggota
    case 'S-04': return <DaftarAnggotaSkeleton />;
    case 'S-05': return <FormAnggotaSkeleton />;
    case 'S-06': return <ImporCSVSkeleton />;

    // Sidang
    case 'S-07': return <DaftarSidangSkeleton />;
    case 'S-08': return <FormSidangSkeleton />;
    case 'S-09': return <AgendaSoalSkeleton params={params} />;
    case 'S-10': return <UndanganQRSkeleton params={params} />;
    case 'S-11': return <DraftMessageSkeleton params={params} />;
    case 'S-12': return <KelolaKuasaSkeleton params={params} />;

    // Registrasi
    case 'S-13': return <ScanQRSkeleton />;
    case 'S-14': return <CheckInManualSkeleton />;

    // Panitia
    case 'S-15': return <KendaliSidangSkeleton />;
    case 'S-16': return <KendaliVotingSkeleton />;
    case 'S-17': return <DaftarPesertaSkeleton />;

    // Proyektor
    case 'S-18': return <ProyektorKehadiranSkeleton />;
    case 'S-19': return <ProyektorVotingSkeleton />;

    // Pemilih HP
    case 'S-20': return <VotingPemilihPage params={params} />;

    // Laporan & Log
    case 'S-25': return <LaporanSidangSkeleton />;
    case 'S-26': return <BeritaAcaraSkeleton />;
    case 'S-27': return <RiwayatSidangSkeleton />;
    case 'S-28': return <LogAktivitasSkeleton />;

    // Pengaturan
    case 'S-29': return <PengaturanTenantSkeleton />;
    case 'S-30': return <PengaturanPenggunaSkeleton />;
    case 'S-31': return <PengaturanParameterSkeleton />;

    default:
      return (
        <div className="p-8 text-center bg-surface-card rounded-xl border border-surface-border">
          <h2 className="text-lg font-bold text-content-main">404 - Halaman Tidak Ditemukan</h2>
          <p className="text-xs text-content-muted mt-1">Rute "{route.path}" tidak terdaftar di sitemap IA.</p>
          <a href="#/beranda" className="inline-block mt-4 px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg">
            Kembali ke Beranda
          </a>
        </div>
      );
  }
}
