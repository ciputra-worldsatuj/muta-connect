import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ApiService } from '../api/client';
import { SkeletonPage } from '../components/common/SkeletonPage';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  RotateCcw,
  Volume2,
  XCircle,
  QrCode
} from 'lucide-react';

/**
 * UF-06 & UF-07: Check-in Scan QR dan Manual Check-in Meja Registrasi
 * Aturan Bisnis & Validasi:
 * - BR-05: QR berlaku satu kali pakai, UID acak tanpa data pribadi
 * - BR-10: Check-in sebelum Mulai Sidang berlabel On time, sesudahnya Late
 * - UF-06: Umpan balik visual/audio instan < 1 detik
 * - UF-07: Pembatalan check-in mensyaratkan alasan wajib dan mengembalikan status QR
 */

// --- S-13: SCAN QR CHECK-IN ---
export function ScanQRSkeleton() {
  const { currentSession, currentUser } = useApp();
  const sessionId = currentSession?.id || 's-2026-muta';

  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [manualUid, setManualUid] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const html5QrCodeRef = useRef(null);

  // Daftar UID simulasi untuk kemudahan pengujian meja registrasi
  const quickTestUIDs = [
    { label: 'Hendra (A-101)', uid: 'MUTA-QR-HENDRA' },
    { label: 'Dewi (A-102)', uid: 'MUTA-QR-DEWI' },
    { label: 'Bambang (A-103)', uid: 'MUTA-QR-BAMBANG' },
    { label: 'Linda (B-201)', uid: 'MUTA-QR-LINDA' }
  ];

  const handleProcessCheckin = async (uid) => {
    if (!uid) return;
    setErrorMessage('');
    setScanResult(null);

    try {
      const res = await ApiService.request('checkinQR', {
        uid: uid.trim(),
        sessionId,
        petugasId: currentUser.name
      });

      // Umpan balik audio sederhana (beeps)
      playSuccessTone();

      setScanResult(res.member);
      setRecentCheckins(prev => [
        { ...res.member, time: new Date().toLocaleTimeString('id-ID') },
        ...prev.slice(0, 4)
      ]);
      setManualUid('');
    } catch (err) {
      playErrorTone();
      setErrorMessage(err.message || 'Gagal memproses check-in.');
    }
  };

  const playSuccessTone = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Nada tinggi sukses
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const playErrorTone = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // Nada rendah error
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  const startCameraScanner = async () => {
    setIsScanning(true);
    try {
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          handleProcessCheckin(decodedText);
          stopCameraScanner();
        },
        () => {}
      );
    } catch (err) {
      console.warn("Kamera tidak dapat diakses langsung:", err);
      setIsScanning(false);
    }
  };

  const stopCameraScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        setIsScanning(false);
      }).catch(() => setIsScanning(false));
    } else {
      setIsScanning(false);
    }
  };

  return (
    <SkeletonPage
      screenId="S-13"
      title="Scan QR Check-in Meja Registrasi"
      subtitle={`Pemindaian cepat kedatangan peserta sidang ${sessionId} (UF-06)`}
      roles={['petugas']}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Kolom Pemindai Kamera & Input Manual */}
        <div className="bg-surface-card rounded-2xl border border-surface-border p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-surface-border">
            <span className="text-xs font-bold text-content-main uppercase flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-brand-primary" />
              Viewport Pemindai QR
            </span>
            <span className="text-[11px] text-content-muted">Target respon &lt; 1 detik</span>
          </div>

          {/* Area Kamera HTML5 / Kotak Simulasi */}
          <div className="relative aspect-video sm:aspect-square bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
            <div id="reader" className="w-full h-full" />
            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-slate-900/90 text-white space-y-3">
                <QrCode className="w-12 h-12 text-brand-dark-accent animate-pulse" />
                <div className="text-xs font-bold text-content-dark-main">
                  Kamera Siap Digunakan
                </div>
                <button
                  type="button"
                  onClick={startCameraScanner}
                  className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary-hover shadow-md transition-colors"
                >
                  Aktifkan Kamera Sekarang
                </button>
              </div>
            )}
            {isScanning && (
              <button
                type="button"
                onClick={stopCameraScanner}
                className="absolute top-2 right-2 px-2.5 py-1 bg-red-600 text-white rounded text-[10px] font-bold z-20"
              >
                Hentikan Kamera
              </button>
            )}
          </div>

          {/* Input Manual UID (Sangat berguna untuk fallback / testing) */}
          <div className="pt-2 border-t border-surface-border space-y-2">
            <label className="block text-[11px] font-bold text-content-muted uppercase">
              Atau Input UID QR Manual (Fallback):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualUid}
                onChange={(e) => setManualUid(e.target.value)}
                placeholder="Contoh: MUTA-QR-HENDRA"
                className="flex-1 px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => handleProcessCheckin(manualUid)}
                className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary-hover"
              >
                Check-in
              </button>
            </div>

            {/* Tombol Cepat Pengujian */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              <span className="text-[10px] text-content-muted w-full">Tes Cepat UID:</span>
              {quickTestUIDs.map(t => (
                <button
                  key={t.uid}
                  type="button"
                  onClick={() => handleProcessCheckin(t.uid)}
                  className="px-2 py-1 rounded bg-surface-bg border border-surface-border text-[10px] font-medium text-content-main hover:bg-blue-50"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Hasil Check-in & Riwayat Terakhir */}
        <div className="space-y-4">
          {/* Kartu Umpan Balik Sukses */}
          {scanResult && (
            <div className="p-5 bg-green-50 border-2 border-status-success rounded-2xl shadow-sm text-center space-y-2 animate-in fade-in zoom-in duration-200">
              <CheckCircle2 className="w-12 h-12 text-status-success mx-auto" />
              <div className="text-xs font-bold uppercase tracking-wider text-status-success">
                CHECK-IN BERHASIL DITERIMA
              </div>
              <h3 className="text-xl font-black text-content-main">
                {scanResult.nama}
              </h3>
              <div className="flex items-center justify-center gap-3 text-xs">
                <span className="font-bold text-brand-primary">Unit {scanResult.unit}</span>
                <span>•</span>
                <span className="font-mono font-bold text-content-muted">NPP: {parseFloat(scanResult.npp).toFixed(4)}%</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  scanResult.labelWaktu === 'Late' ? 'bg-purple-100 text-status-late' : 'bg-blue-100 text-brand-primary'
                }`}>
                  {scanResult.labelWaktu}
                </span>
              </div>
            </div>
          )}

          {/* Kartu Peringatan / Penolakan QR */}
          {errorMessage && (
            <div className="p-5 bg-red-50 border-2 border-status-danger rounded-2xl shadow-sm text-center space-y-2 animate-in fade-in duration-200">
              <XCircle className="w-12 h-12 text-status-danger mx-auto" />
              <div className="text-xs font-bold uppercase tracking-wider text-status-danger">
                CHECK-IN DITOLAK
              </div>
              <div className="text-sm font-semibold text-content-main">
                {errorMessage}
              </div>
              <p className="text-[11px] text-content-muted">
                Peringatan ini telah dicatat ke dalam log audit untuk keamanan sidang.
              </p>
            </div>
          )}

          {/* 5 Check-in Terakhir */}
          <div className="bg-surface-card rounded-2xl border border-surface-border p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-content-muted uppercase tracking-wider">
              Check-in Terakhir Sesi Ini
            </h4>
            {recentCheckins.length === 0 ? (
              <div className="text-xs text-content-muted text-center py-4">
                Belum ada peserta yang melakukan check-in.
              </div>
            ) : (
              <div className="space-y-2">
                {recentCheckins.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-surface-bg rounded-lg border border-surface-border flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-content-main">{item.nama}</div>
                      <div className="text-[11px] text-content-muted">Unit {item.unit} • {item.time} WIB</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.labelWaktu === 'Late' ? 'bg-purple-100 text-status-late' : 'bg-blue-100 text-brand-primary'
                    }`}>
                      {item.labelWaktu}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}

// --- S-14: CHECK-IN MANUAL & BATAL CHECK-IN ---
export function CheckInManualSkeleton() {
  const { currentSession, currentUser, currentTenant } = useApp();
  const sessionId = currentSession?.id || 's-2026-muta';

  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState(null); // { attendanceId, memberName }
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    loadData();
  }, [sessionId, currentTenant?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mList, invList] = await Promise.all([
        ApiService.request('getMembers', { tenantId: currentTenant?.id || 't-cw1' }),
        ApiService.request('getInvitations', { sessionId })
      ]);
      setMembers(mList);
      setInvitations(invList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckin = async (memberId) => {
    try {
      await ApiService.request('checkinManual', {
        memberId,
        sessionId,
        petugasId: currentUser.name
      });
      loadData();
    } catch (err) {
      alert('Gagal check-in: ' + err.message);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason) {
      alert('Alasan pembatalan kehadiran wajib diisi (UF-07).');
      return;
    }

    try {
      await ApiService.request('cancelCheckin', {
        attendanceId: cancelDialog.attendanceId,
        alasan: cancelReason,
        userId: currentUser.name
      });
      setCancelDialog(null);
      setCancelReason('');
      loadData();
    } catch (err) {
      alert('Gagal batalkan: ' + err.message);
    }
  };

  const filteredMembers = members.filter(m =>
    (m.no_unit || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.nama_pemilik || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SkeletonPage
      screenId="S-14"
      title="Check-in Manual & Pembatalan Kehadiran"
      subtitle={`Pencarian langsung dan pembatalan status kehadiran sidang ${sessionId} (UF-07)`}
      roles={['admin', 'petugas']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-content-muted absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor unit (misal: A-101) atau nama..."
            className="w-full pl-9 pr-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
          />
        </div>

        {/* Tabel Anggota & Status Check-in */}
        <div className="border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-bg border-b border-surface-border text-content-muted font-bold uppercase">
              <tr>
                <th className="px-4 py-3">No. Unit</th>
                <th className="px-4 py-3">Nama Pemilik</th>
                <th className="px-4 py-3 text-right">NPP (%)</th>
                <th className="px-4 py-3">Status QR / Kehadiran</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredMembers.map(m => {
                const inv = invitations.find(i => i.memberId === m.id || i.member_id === m.id);
                const isCheckedIn = inv && inv.status_qr === 'Terpakai';

                return (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-brand-primary">{m.no_unit}</td>
                    <td className="px-4 py-3 font-medium text-content-main">{m.nama_pemilik}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{parseFloat(m.npp).toFixed(4)}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCheckedIn ? 'bg-green-100 text-status-success' : 'bg-slate-100 text-content-muted'
                      }`}>
                        {isCheckedIn ? 'HADIR' : 'BELUM HADIR'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!isCheckedIn ? (
                        <button
                          type="button"
                          onClick={() => handleManualCheckin(m.id)}
                          className="px-3 py-1 bg-brand-primary text-white rounded font-semibold text-[11px] hover:bg-brand-primary-hover shadow-sm"
                        >
                          Check-in Manual
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCancelDialog({ attendanceId: 'att-' + m.id, memberName: m.nama_pemilik })}
                          className="px-2.5 py-1 border border-status-danger text-status-danger rounded font-semibold text-[11px] hover:bg-red-50"
                        >
                          Batalkan
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dialog Konfirmasi Pembatalan Check-in (UF-07) */}
        {cancelDialog && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-surface-card rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-status-danger flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Batalkan Kehadiran Peserta
              </h3>
              <p className="text-xs text-content-muted">
                Anda akan membatalkan status HADIR untuk <strong>{cancelDialog.memberName}</strong>. QR Code peserta akan diaktifkan kembali.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-content-main mb-1">
                  Alasan Pembatalan (Wajib Dicatat ke Log Audit) *
                </label>
                <textarea
                  rows="2"
                  required
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Misal: Salah nomor unit atau konfirmasi identitas keliru..."
                  className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2 bg-status-danger text-white rounded-lg text-xs font-bold hover:bg-red-700"
                >
                  Konfirmasi Batal
                </button>
                <button
                  type="button"
                  onClick={() => setCancelDialog(null)}
                  className="px-4 py-2 border border-surface-border rounded-lg text-xs font-semibold text-content-muted"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SkeletonPage>
  );
}
