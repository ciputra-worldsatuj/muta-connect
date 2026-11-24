import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ApiService } from '../api/client';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  Radio, 
  Vote, 
  Award,
  CheckCircle2
} from 'lucide-react';

/**
 * S-18 & S-19: Layar Proyektor (Kehadiran & Hasil Voting)
 * Standar:
 * - Refresh otomatis setiap 5 detik (NFR-02)
 * - Tema Gelap Kontras Tinggi (#0B1220 latar, #93B4FF teks, #2DD4BF aksen)
 * - Angka besar terbaca dari barisan paling belakang (Design System Section 1 & 5)
 * - Hasil voting agregat netral bergaya Kahoot (Design System Section 4.3)
 */

export function ProyektorKehadiranSkeleton() {
  const { currentTenant, currentSession } = useApp();
  const sessionId = currentSession?.id || 's-2026-muta';
  const tenantId = currentTenant?.id || 't-cw1';

  const [data, setData] = useState(null);

  useEffect(() => {
    loadProjectorData();
    const interval = setInterval(loadProjectorData, 5000);
    return () => clearInterval(interval);
  }, [sessionId, tenantId]);

  const loadProjectorData = async () => {
    try {
      const res = await ApiService.get('getProjectorData', { sessionId, tenantId });
      setData(res);
    } catch (e) {
      console.error(e);
    }
  };

  const quorum = data?.quorumPercent || 0;
  const threshold = data?.quorumThreshold || 50;
  const isQuorumReached = quorum > threshold;

  return (
    <div className="flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full space-y-6">
      {/* Judul Sidang & PPPSRS */}
      <div className="text-center space-y-1">
        <h2 className="text-sm md:text-base uppercase font-extrabold text-brand-dark-accent tracking-widest">
          {currentTenant?.name || 'PPPSRS CIPUTRA WORLD 1'}
        </h2>
        <h1 className="text-3xl md:text-6xl font-black text-content-dark-main tracking-tight">
          {data?.sessionTitle || currentSession?.title}
        </h1>
        <div className="text-xs text-content-dark-muted font-medium pt-1">
          Layar Proyektor Kehadiran & Status Kuorum Musyawarah (S-18)
        </div>
      </div>

      {/* Grid Angka Utama Kuorum & Kehadiran (Display 6rem pada Proyektor) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu Kuorum NPP */}
        <div className="bg-surface-dark-card border-2 border-surface-dark-border rounded-3xl p-8 text-center shadow-2xl flex flex-col justify-between">
          <div className="text-xs font-bold text-content-dark-muted uppercase tracking-widest">
            Total Kuorum NPP Hadir
          </div>
          <div className="py-4">
            <div className="text-6xl md:text-8xl font-black text-brand-dark-primary tabular-nums tracking-tighter">
              {quorum.toFixed(2)}<span className="text-4xl text-content-dark-muted">%</span>
            </div>
            <div className="text-xs font-bold text-content-dark-muted tabular-nums mt-1">
              ({data?.presentNpp ? data.presentNpp.toFixed(4) : '0.0000'} dari {data?.totalNpp || 100} NPP)
            </div>
          </div>
          <div className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider ${
            isQuorumReached ? 'bg-status-success-dark/20 text-status-success-dark' : 'bg-status-warning-dark/20 text-status-warning-dark'
          }`}>
            {isQuorumReached ? '✓ KUORUM TERCAPAI (SAH)' : `BELUM KUORUM (AMBANG: > ${threshold.toFixed(0)}%)`}
          </div>
        </div>

        {/* Kartu Peserta Hadir */}
        <div className="bg-surface-dark-card border-2 border-surface-dark-border rounded-3xl p-8 text-center shadow-2xl flex flex-col justify-between">
          <div className="text-xs font-bold text-content-dark-muted uppercase tracking-widest">
            Peserta Hadir Terverifikasi
          </div>
          <div className="py-4">
            <div className="text-6xl md:text-8xl font-black text-content-dark-main tabular-nums tracking-tighter">
              {data?.presentMembers || 0}
              <span className="text-3xl text-content-dark-muted font-normal"> / {data?.totalMembers || 0}</span>
            </div>
            <div className="text-xs text-brand-dark-accent font-semibold mt-1">
              Anggota / Pemilik Unit Terdaftar
            </div>
          </div>
          <div className="py-2 px-4 rounded-xl bg-surface-dark-bg text-content-dark-muted text-xs font-semibold">
            Absensi Meja Registrasi Terhubung
          </div>
        </div>

        {/* Kartu Status Sidang */}
        <div className="bg-surface-dark-card border-2 border-surface-dark-border rounded-3xl p-8 text-center shadow-2xl flex flex-col justify-between">
          <div className="text-xs font-bold text-content-dark-muted uppercase tracking-widest">
            Status Musyawarah
          </div>
          <div className="py-4">
            <div className="text-4xl md:text-6xl font-black text-brand-dark-accent tracking-tight uppercase">
              {data?.sessionStatus || 'DRAFT'}
            </div>
            <div className="text-xs text-content-dark-muted mt-2">
              {data?.sessionStatus === 'Berjalan' ? 'Sidang Sedang Berlangsung' :
               data?.sessionStatus === 'Ditutup' ? 'Sidang Telah Ditutup & Dikunci' : 'Registrasi Peserta Dibuka'}
            </div>
          </div>
          <div className="py-2 px-4 rounded-xl bg-surface-dark-bg text-content-dark-muted text-xs font-mono">
            Kode Akses HP: {currentSession?.kode_publik || 'CW2026'}
          </div>
        </div>
      </div>

      {/* Bar Kuorum Visual Lebar */}
      <div className="bg-surface-dark-card p-6 rounded-2xl border border-surface-dark-border space-y-2">
        <div className="flex justify-between text-xs font-bold text-content-dark-muted">
          <span>0%</span>
          <span className="text-status-warning-dark">Garis Ambang Kuorum (50%)</span>
          <span>100% Total NPP</span>
        </div>
        <div className="w-full bg-surface-dark-bg rounded-full h-6 border border-surface-dark-border overflow-hidden relative p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isQuorumReached ? 'bg-status-success-dark' : 'bg-status-warning-dark'}`}
            style={{ width: `${Math.min(quorum, 100)}%` }}
          />
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-red-500 z-10 shadow-[0_0_8px_#ef4444]" />
        </div>
      </div>

      <div className="text-center text-xs text-content-dark-muted py-2 border-t border-surface-dark-border/50">
        Pembaruan Otomatis Setiap 5 Detik • Sistem MUTA Connect Zero-Cost
      </div>
    </div>
  );
}

export function ProyektorVotingSkeleton() {
  const { currentTenant, currentSession } = useApp();
  const sessionId = currentSession?.id || 's-2026-muta';

  const [projectorData, setProjectorData] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const loadData = async () => {
    try {
      const res = await ApiService.get('getProjectorData', {
        sessionId,
        tenantId: currentTenant?.id || 't-cw1'
      });
      setProjectorData(res);
    } catch (e) {
      console.error(e);
    }
  };

  const activeQuestion = projectorData?.activeQuestion;
  const voteResults = projectorData?.activeVoteResults;

  // Warna grafik netral sesuai Design System Section 4.3
  const choiceColors = [
    'bg-[#93B4FF] text-slate-900', // Pilihan 1
    'bg-[#2DD4BF] text-slate-900', // Pilihan 2
    'bg-[#FBBF24] text-slate-900', // Pilihan 3
    'bg-[#C4B5FD] text-slate-900', // Pilihan 4
    'bg-[#F9A8D4] text-slate-900', // Pilihan 5
  ];

  return (
    <div className="flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xs uppercase font-extrabold text-brand-dark-accent tracking-widest">
          S-19 LAYAR PROYEKTOR VOTING ELEKTRONIK
        </h2>
        <h1 className="text-2xl md:text-5xl font-black text-content-dark-main">
          {activeQuestion ? activeQuestion.pertanyaan : 'Belum Ada Soal Voting Aktif'}
        </h1>
        <p className="text-xs text-content-dark-muted">
          {activeQuestion ? 'Silakan berikan suara Anda melalui HP di tautan publik' : 'Panitia akan membuka soal setelah pembacaan agenda selesai'}
        </p>
      </div>

      {activeQuestion ? (
        <div className="space-y-6">
          {/* Progres Pemilih Masuk */}
          <div className="bg-surface-dark-card border-2 border-surface-dark-border rounded-3xl p-6 text-center max-w-lg mx-auto shadow-xl">
            <div className="text-xs uppercase font-bold text-content-dark-muted tracking-wider">
              Suara Masuk Saat Ini
            </div>
            <div className="text-5xl font-black text-brand-dark-primary tabular-nums py-2">
              {voteResults?.totalVoters || 0}
              <span className="text-2xl text-content-dark-muted font-normal"> / {voteResults?.presentVoters || 0} Pemilih</span>
            </div>
            <div className="text-xs text-status-success-dark font-semibold">
              Kerahasiaan Suara Terjamin (Tanpa Pencatatan Nama)
            </div>
          </div>

          {/* Grafik Bar Pilihan (Kahoot Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(activeQuestion.pilihan || ['Setuju', 'Tidak Setuju', 'Abstain']).map((pilihan, idx) => {
              const tallyNpp = voteResults?.tally ? (voteResults.tally[pilihan] || 0) : 0;
              const colorClass = choiceColors[idx % choiceColors.length];

              return (
                <div key={idx} className="bg-surface-dark-card border border-surface-dark-border rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`w-8 h-8 rounded-lg font-black flex items-center justify-center text-sm ${colorClass}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-bold text-base text-content-dark-main">{pilihan}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-3xl font-black text-brand-dark-accent tabular-nums">
                      {tallyNpp.toFixed(2)}%
                    </div>
                    <div className="text-xs text-content-dark-muted">Bobot NPP Terhitung</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-surface-dark-card border border-surface-dark-border rounded-3xl p-12 text-center max-w-xl mx-auto w-full space-y-4">
          <Vote className="w-16 h-16 text-brand-dark-accent mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-content-dark-main">
            Menunggu Instruksi Panitia Sidang
          </h3>
          <p className="text-xs text-content-dark-muted leading-relaxed">
            Hasil pemungutan suara berbobot NPP akan langsung dihitung otomatis dan ditampilkan secara agregat setelah sesi soal ditutup oleh panitia.
          </p>
        </div>
      )}

      <div className="text-center text-xs text-content-dark-muted py-2 border-t border-surface-dark-border/50">
        Hasil Agregat Ditampilkan Otomatis • Rahasia & Terlindungi (BR-09)
      </div>
    </div>
  );
}
