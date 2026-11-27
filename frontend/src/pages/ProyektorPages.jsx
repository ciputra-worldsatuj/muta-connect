import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ApiService } from '../api/client';
import {
  Clock,
  TrendingUp,
  Users,
  Radio,
  Vote,
  Award,
  CheckCircle2,
  Building2,
  ChevronLeft,
  ChevronRight
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

  // Pagination & Sorting Berdasarkan Abjad (A-Z)
  // Alur urutan abjad: dari kiri ke kanan, turun ke baris bawah sebelah kiri, lanjut ke kanan
  const [currentPage, setCurrentPage] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true); // Fitur auto switch aktif secara default

  const sortedCards = useMemo(() => {
    const cards = data?.attendeeCards ? [...data.attendeeCards] : [];
    return cards.sort((a, b) => {
      const nameA = (a.namaAnggota || '').trim();
      const nameB = (b.namaAnggota || '').trim();
      const comp = nameA.localeCompare(nameB, 'id', { sensitivity: 'base' });
      if (comp !== 0) return comp;
      return (a.kodeUnit || '').localeCompare(b.kodeUnit || '', 'id', { numeric: true, sensitivity: 'base' });
    });
  }, [data?.attendeeCards]);

  const ITEMS_PER_PAGE = 10; // Sesuai permintaan: 1 halaman = 2 baris x 5 kolom = 10 kartu
  const totalPages = Math.ceil(sortedCards.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Efek rotasi otomatis halaman display proyektor (jika diaktifkan)
  useEffect(() => {
    if (!autoRotate || totalPages <= 1) return;
    const timer = setInterval(() => {
      setCurrentPage(prev => (prev >= totalPages ? 1 : prev + 1));
    }, 10000);
    return () => clearInterval(timer);
  }, [autoRotate, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCards = sortedCards.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full space-y-3">
      {/* Judul Sidang & PPPSRS */}
      <div className="text-center space-y-0.5">
        <div className="inline-flex items-center justify-center gap-2 text-xs md:text-sm uppercase font-extrabold text-brand-dark-accent tracking-widest">
          <Building2 className="w-4 h-4 text-brand-dark-accent" />
          <span>PPPSRSKC SUB BAGIAN  OFFICE 1 CIPUTRA WORLD 1 JAKARTA</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-content-dark-main tracking-tight">
          {data?.sessionTitle || currentSession?.title}
        </h1>
        <div className="text-[11px] text-content-dark-muted font-medium">
          Status Kehadiran & Kuorum Musyawarah
        </div>
      </div>

      {/* Grid Angka Utama Kuorum & Kehadiran (Display Kompak Kontras Tinggi) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Kartu Kuorum NPP */}
        <div className="bg-surface-dark-card border border-surface-dark-border rounded-2xl p-4 text-center shadow-lg flex flex-col justify-between">
          <div className="text-[11px] font-bold text-content-dark-muted uppercase tracking-wider">
            Total Kuorum NPP Hadir
          </div>
          <div className="py-1">
            <div className="text-4xl md:text-6xl font-black text-brand-dark-primary tabular-nums tracking-tighter">
              {quorum.toFixed(2)}<span className="text-2xl text-content-dark-muted">%</span>
            </div>
            <div className="text-[11px] font-bold text-content-dark-muted tabular-nums">
              ({data?.presentNpp ? data.presentNpp.toFixed(4) : '0.0000'} dari {data?.totalNpp || 100} NPP)
            </div>
          </div>
          <div className={`py-1 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider ${isQuorumReached ? 'bg-status-success-dark/20 text-status-success-dark' : 'bg-status-warning-dark/20 text-status-warning-dark'
            }`}>
            {isQuorumReached ? '✓ KUORUM TERCAPAI (SAH)' : `BELUM KUORUM (> ${threshold.toFixed(0)}%)`}
          </div>
        </div>

        {/* Kartu Peserta Hadir */}
        <div className="bg-surface-dark-card border border-surface-dark-border rounded-2xl p-4 text-center shadow-lg flex flex-col justify-between">
          <div className="text-[11px] font-bold text-content-dark-muted uppercase tracking-wider">
            Peserta Hadir Terverifikasi
          </div>
          <div className="py-1">
            <div className="text-4xl md:text-6xl font-black text-content-dark-main tabular-nums tracking-tighter">
              {data?.presentMembers || 0}
              <span className="text-2xl text-content-dark-muted font-normal"> / {data?.totalMembers || 25}</span>
            </div>
            <div className="text-[11px] text-brand-dark-accent font-semibold">
              Anggota / Pemilik Unit Terdaftar
            </div>
          </div>
          <div className="py-1 px-3 rounded-lg bg-surface-dark-bg text-content-dark-muted text-[11px] font-semibold">
            Live updates of registration desk
          </div>
        </div>

        {/* Kartu Status Sidang */}
        <div className="bg-surface-dark-card border border-surface-dark-border rounded-2xl p-4 text-center shadow-lg flex flex-col justify-between">
          <div className="text-[11px] font-bold text-content-dark-muted uppercase tracking-wider">
            Status Musyawarah
          </div>
          <div className="py-1">
            <div className="text-3xl md:text-5xl font-black text-brand-dark-accent tracking-tight uppercase">
              {data?.sessionStatus || 'DRAFT'}
            </div>
            <div className="text-[11px] text-content-dark-muted mt-1">
              {data?.sessionStatus === 'Berjalan' ? 'Sidang Sedang Berlangsung' :
                data?.sessionStatus === 'Ditutup' ? 'Sidang Telah Ditutup & Dikunci' : 'Registrasi Peserta Dibuka'}
            </div>
          </div>
          <div className="py-1 px-3 rounded-lg bg-surface-dark-bg text-content-dark-muted text-[11px] font-mono">
            Access Code: {currentSession?.kode_publik || 'CW2026'}
          </div>
        </div>
      </div>

      {/* Bar Kuorum Visual Lebar (Tinggi Diperpendek) */}
      <div className="bg-surface-dark-card px-5 py-2.5 rounded-xl border border-surface-dark-border space-y-1">
        <div className="flex justify-between text-[11px] font-bold text-content-dark-muted">
          <span>0%</span>
          <span className="text-status-warning-dark">Garis Ambang Kuorum (50%)</span>
          <span>100% Total NPP</span>
        </div>
        <div className="w-full bg-surface-dark-bg rounded-full h-3.5 border border-surface-dark-border overflow-hidden relative p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isQuorumReached ? 'bg-status-success-dark' : 'bg-status-warning-dark'}`}
            style={{ width: `${Math.min(quorum, 100)}%` }}
          />
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-red-500 z-10 shadow-[0_0_8px_#ef4444]" />
        </div>
      </div>

      {/* Kartu Status Kehadiran Anggota dengan Pagination (2 Baris x 5 Kolom, Urut Abjad) */}
      <div className="bg-surface-dark-card p-4 rounded-xl border border-surface-dark-border space-y-3">
        {/* Header Bagian Kartu: Judul, Status & Kontrol Pagination (Page 1, 2, 3...) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-2 border-b border-surface-dark-border/40">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-dark-accent" />
            <span className="text-xs font-bold text-content-dark-main uppercase tracking-wider">
              Status Kehadiran Anggota
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Pagination: Page 1, Page 2, Page 3 */}
            <div className="flex items-center gap-1 bg-surface-dark-bg/90 p-1 rounded-xl border border-surface-dark-border shadow-xs">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1 rounded-lg text-content-dark-muted hover:text-content-dark-main disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Halaman Sebelumnya"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${currentPage === page
                      ? 'bg-brand-dark-primary text-slate-950 shadow-md font-black scale-105'
                      : 'text-content-dark-muted hover:text-white hover:bg-slate-800'
                    }`}
                >
                  Page {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1 rounded-lg text-content-dark-muted hover:text-content-dark-main disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Halaman Berikutnya"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Rotasi Otomatis Halaman */}
            {totalPages > 1 && (
              <button
                type="button"
                onClick={() => setAutoRotate(r => !r)}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${autoRotate
                    ? 'bg-brand-dark-accent/20 border-brand-dark-accent text-brand-dark-accent font-bold'
                    : 'bg-surface-dark-bg text-content-dark-muted border-surface-dark-border hover:text-white'
                  }`}
                title="Putar halaman otomatis setiap 10 detik"
              >
                {autoRotate ? 'Auto: ON (10s)' : 'Auto: OFF'}
              </button>
            )}

            {/* Legend Status Kehadiran */}
            <div className="hidden xl:flex items-center gap-2 text-[10px] text-content-dark-muted pl-2 border-l border-surface-dark-border/40">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> On-Time
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Late
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-500" /> Belum
              </span>
            </div>
          </div>
        </div>

        {/* Grid 4 Baris x 5 Kolom (Alur Urut Abjad Kiri ke Kanan, Turun ke Kiri Bawah) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {currentCards.map((card) => (
            <div
              key={card.id}
              className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between space-y-1.5 ${card.statusAbsensi === 'On-Time'
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-sm'
                  : card.statusAbsensi === 'Late'
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-sm'
                    : 'bg-surface-dark-bg/60 border-surface-dark-border/60 opacity-80'
                }`}
            >
              {/* Baris 1: Kode Unit & Status Absensi */}
              <div className="flex items-start justify-between gap-1">
                <span className="font-mono font-bold text-[11px] text-brand-dark-accent truncate" title={card.kodeUnit}>
                  {card.kodeUnit}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${card.statusAbsensi === 'On-Time'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : card.statusAbsensi === 'Late'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-700/40 text-slate-400 border border-slate-600/40'
                    }`}
                >
                  {card.statusAbsensi}
                </span>
              </div>

              {/* Baris 2: Nama Anggota (Utama) & Penanggung Jawab */}
              <div>
                <div className="font-bold text-[11px] text-content-dark-main truncate" title={card.namaAnggota}>
                  {card.namaAnggota}
                </div>
                <div className="text-[10px] font-medium text-blue-300 truncate" title={card.penanggungJawab}>
                  {card.penanggungJawab}
                </div>
              </div>

              {/* Baris 3: Bobot NPP & Total Unit */}
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-surface-dark-border/40">
                <span className="font-mono font-bold text-brand-dark-primary tabular-nums">
                  NPP: {card.bobotNpp ? card.bobotNpp.toFixed(4) : '0.0000'}%
                </span>
                <span className="font-semibold text-content-dark-muted">
                  {card.totalUnit} Unit
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info Halaman */}
        <div className="flex items-center justify-between text-[10px] text-content-dark-muted pt-1">
          <span>
            Menampilkan data <strong>{startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, sortedCards.length)}</strong> dari <strong>{sortedCards.length}</strong> anggota terdaftar
          </span>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
        </div>
      </div>

      {/* Footer Proyektor Kehadiran */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-content-dark-muted py-3 border-t border-surface-dark-border/50 gap-2">
        <div>Copyright © 2026 — MUTA Connect! All Rights Reserved.</div>
        <div className="font-semibold text-brand-dark-accent">PPPSRSKC CIPUTRA WORLD 1 JAKARTA</div>
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

  // Warna voting sesuai Revisi 3: A = HIJAU, B = MERAH, C = KUNING
  const getChoicePalette = (idx) => {
    switch (idx) {
      case 0: // A = HIJAU
        return {
          cardBg: 'bg-green-950/40 border-green-500/60',
          badge: 'bg-[#15803D] text-white',
          textAccent: 'text-[#4ADE80]',
          border: 'border-green-500'
        };
      case 1: // B = MERAH
        return {
          cardBg: 'bg-red-950/40 border-red-500/60',
          badge: 'bg-[#B91C1C] text-white',
          textAccent: 'text-[#F87171]',
          border: 'border-red-500'
        };
      case 2: // C = KUNING
        return {
          cardBg: 'bg-yellow-950/40 border-yellow-500/60',
          badge: 'bg-[#EAB308] text-slate-950 font-black',
          textAccent: 'text-[#FBBF24]',
          border: 'border-yellow-500'
        };
      default:
        return {
          cardBg: 'bg-blue-950/40 border-blue-500/60',
          badge: 'bg-blue-600 text-white',
          textAccent: 'text-blue-300',
          border: 'border-blue-500'
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center gap-2 text-sm md:text-base uppercase font-extrabold text-brand-dark-accent tracking-widest">
          <Building2 className="w-5 h-5 text-brand-dark-accent" />
          <span>PPPSRSKC CIPUTRA WORLD 1 JAKARTA</span>
        </div>
        <h1 className="text-2xl md:text-5xl font-black text-content-dark-main">
          {activeQuestion ? activeQuestion.pertanyaan : 'Belum Ada Soal Voting Aktif'}
        </h1>
        <p className="text-xs text-content-dark-muted">
          {activeQuestion ? 'Silakan berikan suara Anda melalui HP di tautan publik' : 'Panitia akan membuka soal setelah pembacaan agenda selesai'}
        </p>
      </div>

      {activeQuestion ? (
        <div className="space-y-6">
          {/* Progres Pemilih Masuk - Perbesar 0 / 9 Pemilih & Hapus Kerahasiaan Suara */}
          <div className="bg-surface-dark-card border-2 border-surface-dark-border rounded-3xl p-6 text-center max-w-lg mx-auto shadow-xl">
            <div className="text-xs uppercase font-bold text-content-dark-muted tracking-wider">
              Suara Masuk Saat Ini
            </div>
            <div className="text-6xl md:text-8xl font-black text-brand-dark-primary tabular-nums py-3 tracking-tight">
              {voteResults?.totalVoters || 0}
              <span className="text-3xl md:text-5xl text-content-dark-muted font-bold"> / {voteResults?.presentVoters || 0} Pemilih</span>
            </div>
          </div>

          {/* Grafik Bar Pilihan (A = Hijau, B = Merah, C = Kuning) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {(activeQuestion.pilihan || ['Setuju', 'Tidak Setuju', 'Abstain']).map((pilihan, idx) => {
              const tallyNpp = voteResults?.tally ? (voteResults.tally[pilihan] || 0) : 0;
              const palette = getChoicePalette(idx);

              return (
                <div key={idx} className={`rounded-2xl p-6 flex flex-col justify-between shadow-xl border-2 ${palette.cardBg} backdrop-blur-sm transition-all`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`w-10 h-10 rounded-xl font-black flex items-center justify-center text-lg shadow-md ${palette.badge}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-bold text-lg text-content-dark-main">{pilihan}</span>
                  </div>

                  <div className="space-y-1">
                    <div className={`text-4xl font-black tabular-nums tracking-tight ${palette.textAccent}`}>
                      {tallyNpp.toFixed(2)}%
                    </div>
                    <div className="text-xs text-content-dark-muted font-medium">Bobot NPP Terhitung</div>
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

      {/* Footer Proyektor Voting */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-content-dark-muted py-3 border-t border-surface-dark-border/50 gap-2">
        <div>Copyright © 2026 — MUTA Connect! All Rights Reserved.</div>
        <div className="font-semibold text-brand-dark-accent">Real-time Voting Aggregate • Secret & Protected</div>
        <div className="font-semibold text-brand-dark-accent">PPPSRSKC CIPUTRA WORLD 1 JAKARTA</div>
      </div>
    </div>
  );
}
