import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ApiService } from '../api/client';
import { SkeletonPage } from '../components/common/SkeletonPage';
import {
  FileText,
  Download,
  Printer,
  History,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Building2,
  Users,
  Search
} from 'lucide-react';

/**
 * UF-12, UF-13, UF-14: Laporan Sidang, Berita Acara Otomatis, Riwayat Antar Sidang, & Log Aktivitas
 */

// --- S-25: LAPORAN REKAPITULASI SIDANG ---
export function LaporanSidangSkeleton() {
  const { currentSession, currentTenant } = useApp();
  const sessionId = currentSession?.id || 's-2026-muta';

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [sessionId]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await ApiService.request('getReportData', { sessionId });
      setReportData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = (type) => {
    let content = "data:text/csv;charset=utf-8,";
    if (type === 'kehadiran') {
      content += "No,Sidang,Kehadiran,Status\n1," + (currentSession?.judul || 'MUTA') + ",Terverifikasi,HADIR\n";
    } else {
      content += "Soal,Pilihan,Total_Bobot_NPP\nPengesahan LPJ,Setuju,100.00\n";
    }
    const uri = encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", uri);
    link.setAttribute("download", `laporan_${type}_${sessionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SkeletonPage
      screenId="S-25"
      title="Laporan & Rekapitulasi Sidang"
      subtitle={`Laporan resmi hasil musyawarah dan voting berbobot NPP untuk ${sessionId}`}
      roles={['admin', 'panitia']}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-card p-5 rounded-xl border border-surface-border shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-brand-primary uppercase">RPT-01</div>
              <h3 className="font-bold text-sm text-content-main mt-0.5">Daftar Hadir & Waktu Check-in</h3>
              <p className="text-xs text-content-muted mt-1">Rekap nama anggota, unit, waktu check-in, dan label On time/Late.</p>
            </div>
            <button
              type="button"
              onClick={() => exportCSV('kehadiran')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface-bg border border-surface-border text-xs font-semibold text-content-main hover:bg-slate-100"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV Kehadiran</span>
            </button>
          </div>

          <div className="bg-surface-card p-5 rounded-xl border border-surface-border shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-brand-accent uppercase">RPT-02</div>
              <h3 className="font-bold text-sm text-content-main mt-0.5">Rekapitulasi Kuorum Sah</h3>
              <p className="text-xs text-content-muted mt-1">Perhitungan total bobot NPP hadir dan ambang batas keabsahan sidang.</p>
            </div>
            <button
              type="button"
              onClick={() => exportCSV('kuorum')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface-bg border border-surface-border text-xs font-semibold text-content-main hover:bg-slate-100"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV Kuorum</span>
            </button>
          </div>

          <div className="bg-surface-card p-5 rounded-xl border border-surface-border shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-status-success uppercase">RPT-03</div>
              <h3 className="font-bold text-sm text-content-main mt-0.5">Hasil Pemungutan Suara</h3>
              <p className="text-xs text-content-muted mt-1">Rekap suara agregat per soal dan persentase bobot NPP per pilihan.</p>
            </div>
            <button
              type="button"
              onClick={() => exportCSV('voting')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface-bg border border-surface-border text-xs font-semibold text-content-main hover:bg-slate-100"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV Hasil Suara</span>
            </button>
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}

// --- S-26: BERITA ACARA SIDANG ---
export function BeritaAcaraSkeleton() {
  const { currentTenant, currentSession } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <SkeletonPage
      screenId="S-26"
      title="Berita Acara Resmi Sidang"
      subtitle="Dokumen berita acara terisi otomatis untuk pengesahan pimpinan sidang dan notaris"
      roles={['admin', 'panitia']}
    >
      <div className="space-y-4">
        <div className="flex justify-end print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF Berita Acara</span>
          </button>
        </div>

        {/* Lembar Dokumen Berita Acara */}
        <div className="bg-surface-card rounded-2xl border border-surface-border p-8 md:p-12 shadow-sm space-y-6 max-w-3xl mx-auto font-serif text-content-main leading-relaxed">
          <div className="text-center border-b-2 border-content-main pb-4">
            <h1 className="text-lg md:text-xl font-bold uppercase tracking-wide">
              BERITA ACARA KEPUTUSAN MUSYAWARAH UMUM TAHUNAN ANGGOTA (MUTA)
            </h1>
            <p className="text-xs font-sans text-content-muted mt-1">
              PERHIMPUNAN PEMILIK DAN PENGHUNI SATUAN RUMAH SUSUN (PPPSRS)
            </p>
            <p className="text-xs font-sans font-bold text-content-main">
              {currentTenant?.name || 'PPPSRS CIPUTRA WORLD 1'}
            </p>
          </div>

          <p className="text-xs text-justify">
            Pada hari ini, <strong>Sabtu</strong> tanggal <strong>Dua Puluh Delapan</strong> bulan <strong>November</strong> tahun <strong>Dua Ribu Dua Puluh Enam</strong> (28-11-2026), bertempat di {currentSession?.lokasi || 'Ballroom Mall'}, telah diselenggarakan Musyawarah Umum Tahunan Anggota (MUTA) Tahun Buku 2026.
          </p>

          <div className="text-xs space-y-2">
            <h2 className="font-bold font-sans uppercase text-[11px] text-content-muted">I. KEABSAHAN KUORUM SIDANG</h2>
            <p className="text-justify">
              Berdasarkan pencatatan kehadiran elektronik menggunakan sistem MUTA Connect, telah hadir dan terverifikasi sah peserta musyawarah sebanyak <strong>10 pemilik unit</strong> dengan total bobot Nilai Perbandingan Proporsional (NPP) sebesar <strong>100.00%</strong>. Dengan demikian, batas ambang kuorum lebih dari 50% sebagaimana dipersyaratkan dalam AD/ART PPPSRS telah terpenuhi secara sah.
            </p>
          </div>

          <div className="text-xs space-y-2">
            <h2 className="font-bold font-sans uppercase text-[11px] text-content-muted">II. KEPUTUSAN PEMUNGUTAN SUARA</h2>
            <p className="text-justify">
              Musyawarah telah menyetujui dan mengesahkan seluruh mata acara sidang melalui pemungutan suara elektronik berbobot NPP dengan perolehan hasil agregat sebagai berikut:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pengesahan Laporan Pertanggungjawaban (LPJ) Pengurus & Pengawas: <strong>DISETUJUI SECARA AKLAMASI</strong>.</li>
              <li>Penetapan Anggaran Pengelolaan (IPL) 2027: <strong>DISETUJUI OPSI B (8%)</strong>.</li>
            </ul>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-8 border-t border-surface-border grid grid-cols-2 text-center text-xs gap-8 font-sans">
            <div>
              <div className="text-content-muted mb-12">Ketua Pimpinan Sidang,</div>
              <div className="font-bold underline text-content-main">Ir. H. Gunawan</div>
              <div className="text-[11px] text-content-muted">Pengurus PPPSRS</div>
            </div>
            <div>
              <div className="text-content-muted mb-12">Sekretaris Sidang / Notaris,</div>
              <div className="font-bold underline text-content-main">Siti Rahma, S.H., M.Kn.</div>
              <div className="text-[11px] text-content-muted">Panitia Pelaksana</div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}

// --- S-27: RIWAYAT ANTAR SIDANG ---
export function RiwayatSidangSkeleton() {
  return (
    <SkeletonPage
      screenId="S-27"
      title="Riwayat & Komparasi Antar Sidang"
      subtitle="Analisis tren kehadiran kuorum dan efektivitas keputusan musyawarah"
      roles={['admin', 'panitia']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-surface-bg rounded-xl border border-surface-border space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>MUTA Tahun Buku 2026</span>
              <span className="text-status-success">100.00% NPP</span>
            </div>
            <div className="text-xs text-content-muted">Pelaksanaan: 28 Nov 2026 • Status: Ditutup</div>
          </div>
          <div className="p-4 bg-surface-bg rounded-xl border border-surface-border space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>MUTA Tahun Buku 2025</span>
              <span className="text-status-success">84.25% NPP</span>
            </div>
            <div className="text-xs text-content-muted">Pelaksanaan: 15 Des 2025 • Status: Arsip Terkunci</div>
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}

// --- S-28: LOG AKTIVITAS & AUDIT TRAIL ---
export function LogAktivitasSkeleton() {
  const { currentTenant } = useApp();
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLogs();
  }, [currentTenant?.id]);

  const loadLogs = async () => {
    try {
      const data = await ApiService.request('getAuditLogs', { tenantId: currentTenant?.id || 't-cw1' });
      setLogs(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLogs = logs.filter(l =>
    (l.aksi || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.user_id || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SkeletonPage
      screenId="S-28"
      title="Log Aktivitas & Jejak Audit (FR-LOG)"
      subtitle="Perekaman kronologis setiap aksi check-in, pembukaan soal, voting, dan perubahan rekap"
      roles={['admin', 'panitia']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-sm space-y-4">
        <div className="max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter berdasarkan jenis aksi atau nama pengguna..."
            className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
          />
        </div>

        <div className="border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-bg border-b border-surface-border text-content-muted font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Waktu (WIB)</th>
                <th className="px-4 py-3">Pengguna</th>
                <th className="px-4 py-3">Aksi</th>
                <th className="px-4 py-3">Detail Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-content-muted font-sans text-xs">
                    Belum ada log aktivitas tercatat.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-content-muted">
                      {new Date(log.created_at).toLocaleTimeString('id-ID')}
                    </td>
                    <td className="px-4 py-2.5 font-bold text-brand-primary">{log.user_id}</td>
                    <td className="px-4 py-2.5 font-semibold text-content-main">{log.aksi}</td>
                    <td className="px-4 py-2.5 text-content-muted truncate max-w-xs">{log.detail}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SkeletonPage>
  );
}
