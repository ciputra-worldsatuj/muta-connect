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
  QrCode,
  FileCheck,
  FileText,
  Upload,
  X,
  UserPlus
} from 'lucide-react';

/**
 * UF-06 & UF-07: Registrasi Meja
 * Revisi Terbaru:
 * 1. Kamera scanner QR otomatis standby aktif saat halaman dimuat (tanpa perlu klik aktifkan kamera)
 * 4. Menu kelola kuasa terintegrasi langsung di Check-in Manual:
 *    - Tombol aksi "Kuasa" pada setiap baris
 *    - Modal terbuka dengan Kode Unit dan Nama Pemilik sudah otomatis terpilih
 */

// --- S-13: SCAN QR CHECK-IN (AUTO STANDBY AKTIF) ---
export function ScanQRSkeleton() {
  const { currentSession, currentUser } = useApp();
  const sessionId = currentSession?.id || 's-2026-muta';

  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [manualUid, setManualUid] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const html5QrCodeRef = useRef(null);

  const quickTestUIDs = [
    { label: 'Hendra (TA-03.01)', uid: '1002' },
    { label: 'Dewi (TA-05.01)', uid: '1004' },
    { label: 'Bambang (TA-05.02)', uid: '1005' },
    { label: 'Linda (TB-06.01)', uid: '1006' }
  ];

  // Auto-standby kamera saat halaman dibuka (Revisi 1)
  useEffect(() => {
    let isMounted = true;

    const autoStartCamera = async () => {
      try {
        const html5QrCode = new Html5Qrcode("auto-reader");
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            if (isMounted) {
              handleProcessCheckin(decodedText);
            }
          },
          () => {} // abaikan frame kosong
        );

        if (isMounted) {
          setCameraActive(true);
          setCameraError('');
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Kamera auto-start standby notice:", err);
          setCameraActive(false);
          setCameraError('Kamera tidak terdeteksi atau izin peramban belum diberikan. Anda tetap dapat menggunakan input UID di bawah.');
        }
      }
    };

    // Jalankan auto-start dengan sedikit jeda DOM render
    const timer = setTimeout(() => {
      autoStartCamera();
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {}).finally(() => {
          try { html5QrCodeRef.current.clear(); } catch (e) {}
        });
      }
    };
  }, [sessionId]);

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
      osc.frequency.setValueAtTime(880, ctx.currentTime);
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
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  return (
    <SkeletonPage
      screenId="S-13"
      title="Scan QR Check-in Meja Registrasi"
      subtitle={`Kamera standby otomatis untuk pemindaian instan peserta sidang ${sessionId}`}
      roles={['petugas']}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Kolom Kamera Standby */}
        <div className="bg-surface-card rounded-2xl border border-surface-border p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-surface-border">
            <span className="text-xs font-bold text-content-main uppercase flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-brand-primary" />
              Kamera Standby Aktif
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-status-success flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-ping" />
              LIVE STANDBY
            </span>
          </div>

          {/* Area Kamera HTML5 Standby */}
          <div className="relative aspect-video sm:aspect-square bg-slate-950 rounded-xl overflow-hidden flex flex-col items-center justify-center p-2 border-2 border-surface-border">
            <div id="auto-reader" className="w-full h-full" />
            
            {cameraError && (
              <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center text-white space-y-2">
                <AlertTriangle className="w-8 h-8 text-status-warning" />
                <div className="text-xs font-semibold text-content-dark-main">{cameraError}</div>
              </div>
            )}
          </div>

          {/* Fallback Input UID Manual */}
          <div className="pt-2 border-t border-surface-border space-y-2">
            <label className="block text-[11px] font-bold text-content-muted uppercase">
              Input UID QR Manual:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualUid}
                onChange={(e) => setManualUid(e.target.value)}
                placeholder="Contoh: 1001"
                className="flex-1 px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => handleProcessCheckin(manualUid)}
                className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary-hover shadow-sm"
              >
                Check-in
              </button>
            </div>

            {/* Tombol Cepat Pengujian UID */}
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

          <div className="bg-surface-card rounded-2xl border border-surface-border p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-content-muted uppercase tracking-wider">
              Check-in Terakhir Sesi Ini
            </h4>
            {recentCheckins.length === 0 ? (
              <div className="text-xs text-content-muted text-center py-4">
                Belum ada peserta yang melakukan check-in. Kamera siap memindai.
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

// --- S-14: CHECK-IN MANUAL & MODAL KELOLA KUASA TERINTEGRASI (REVISI 4) ---
export function CheckInManualSkeleton() {
  const { currentSession, currentUser, currentTenant } = useApp();
  const sessionId = currentSession?.id || 's-2026-muta';

  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Dialog Pembatalan Check-in
  const [cancelDialog, setCancelDialog] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Modal Kelola Kuasa (Revisi 4)
  const [proxyModalMember, setProxyModalMember] = useState(null);
  const [proxyNamaKuasa, setProxyNamaKuasa] = useState('');
  const [proxyNoHp, setProxyNoHp] = useState('');
  const [proxyLoading, setProxyLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [sessionId, currentTenant?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mList, invList, attList] = await Promise.all([
        ApiService.request('getMembers', { tenantId: currentTenant?.id || 't-cw1' }),
        ApiService.request('getInvitations', { sessionId }),
        ApiService.request('getAttendances', { sessionId })
      ]);
      setMembers(mList);
      setInvitations(invList);
      setAttendances(attList || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckin = async (memberId) => {
    setAttendances(prev => [...prev, { memberId, sessionId, status: 'HADIR' }]);
    setInvitations(prev => prev.map(inv => inv.memberId === memberId ? { ...inv, status_qr: 'Terpakai' } : inv));

    try {
      await ApiService.request('checkinManual', {
        memberId,
        sessionId,
        petugasId: currentUser.name
      });
      loadData();
    } catch (err) {
      alert('Gagal check-in: ' + err.message);
      loadData();
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason) {
      alert('Alasan pembatalan kehadiran wajib diisi.');
      return;
    }

    const targetMemberId = cancelDialog.memberId;
    setAttendances(prev => prev.filter(a => a.memberId !== targetMemberId));
    setInvitations(prev => prev.map(inv => inv.memberId === targetMemberId ? { ...inv, status_qr: 'Aktif' } : inv));
    setCancelDialog(null);

    try {
      await ApiService.request('cancelCheckin', {
        memberId: targetMemberId,
        sessionId,
        alasan: cancelReason,
        userId: currentUser.name
      });
      setCancelReason('');
      loadData();
    } catch (err) {
      alert('Gagal batalkan: ' + err.message);
      loadData();
    }
  };

  // Buka Modal Kuasa dengan Unit & Pemilik Sudah Terpilih
  const handleOpenProxyModal = (member) => {
    const inv = invitations.find(i => i.memberId === member.id || i.member_id === member.id);
    const existingProxy = inv?.proxy;

    setProxyModalMember({
      member,
      invitationId: inv?.id,
      existingProxy
    });
    setProxyNamaKuasa(existingProxy?.namaKuasa || '');
    setProxyNoHp(existingProxy?.noHpKuasa || '');
  };

  const handleSaveProxy = async (e) => {
    e.preventDefault();
    if (!proxyNamaKuasa.trim()) {
      alert('Nama penerima kuasa wajib diisi.');
      return;
    }

    setProxyLoading(true);
    try {
      await ApiService.request('saveProxy', {
        invitationId: proxyModalMember.invitationId,
        sessionId,
        namaKuasa: proxyNamaKuasa.trim(),
        noHpKuasa: proxyNoHp.trim(),
        urlSuratKuasa: 'surat_kuasa_' + proxyModalMember.member.no_unit + '.pdf'
      });
      setProxyModalMember(null);
      loadData();
    } catch (err) {
      alert('Gagal menyimpan kuasa: ' + err.message);
    } finally {
      setProxyLoading(false);
    }
  };

  const handleCancelProxy = async (proxyId) => {
    if (!window.confirm('Yakin ingin membatalkan surat kuasa ini?')) return;
    try {
      await ApiService.request('cancelProxy', { proxyId });
      setProxyModalMember(null);
      loadData();
    } catch (err) {
      alert('Gagal batalkan kuasa: ' + err.message);
    }
  };

  const filteredMembers = members.filter(m =>
    (m.no_unit || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.nama_pemilik || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.penanggung_jawab || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SkeletonPage
      screenId="S-14"
      title="Check-in Manual & Kelola Kuasa"
      subtitle={`Pencarian langsung, status kehadiran seketika, dan penetapan penerima kuasa sidang ${sessionId}`}
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
            placeholder="Cari kode unit (misal: A-101) atau nama..."
            className="w-full pl-9 pr-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
          />
        </div>

        {/* Tabel Anggota, Kehadiran, & Tombol Kuasa */}
        <div className="border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-bg border-b border-surface-border text-content-muted font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Kode Unit</th>
                <th className="px-4 py-3">Nama Anggota</th>
                <th className="px-4 py-3">Status Kuasa</th>
                <th className="px-4 py-3 text-right">Bobot NPP</th>
                <th className="px-4 py-3">Status Kehadiran</th>
                <th className="px-4 py-3 text-right">Aksi Meja Registrasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredMembers.map(m => {
                const inv = invitations.find(i => i.memberId === m.id || i.member_id === m.id);
                const isCheckedIn = attendances.some(a => a.memberId === m.id && a.status === 'HADIR') || (inv && inv.status_qr === 'Terpakai');
                const hasProxy = inv?.proxy && inv.proxy.status === 'Aktif';

                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-brand-primary">{m.no_unit}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-content-main">{m.nama_pemilik}</div>
                      {m.penanggung_jawab && m.penanggung_jawab !== m.nama_pemilik && (
                        <div className="text-[11px] text-content-muted">PIC: {m.penanggung_jawab}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {hasProxy ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-brand-primary inline-flex items-center gap-1">
                          <FileCheck className="w-3 h-3" />
                          <span>Kuasa: {inv.proxy.namaKuasa}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-content-muted">Hadir Sendiri</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{parseFloat(m.npp).toFixed(4)}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                        isCheckedIn 
                          ? 'bg-green-100 text-status-success border border-green-200' 
                          : 'bg-slate-100 text-content-muted border border-surface-border'
                      }`}>
                        {isCheckedIn && <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />}
                        {isCheckedIn ? 'HADIR' : 'BELUM HADIR'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Tombol Aksi Kuasa (Revisi 4) */}
                        <button
                          type="button"
                          onClick={() => handleOpenProxyModal(m)}
                          className="px-2.5 py-1.5 rounded-lg border border-brand-accent text-brand-accent hover:bg-teal-50 font-semibold text-xs transition-colors flex items-center gap-1"
                          title="Kelola Surat Kuasa Unit Ini"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Kuasa</span>
                        </button>

                        {/* Tombol Check-in Manual / Batalkan */}
                        {!isCheckedIn ? (
                          <button
                            type="button"
                            onClick={() => handleManualCheckin(m.id)}
                            className="px-3 py-1.5 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-brand-primary-hover shadow-sm transition-all flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Check-in</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCancelDialog({ memberId: m.id, memberName: m.nama_pemilik })}
                            className="px-3 py-1.5 border border-status-danger text-status-danger rounded-lg font-semibold text-xs hover:bg-red-50 transition-colors flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Batalkan</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Kelola Kuasa (Revisi 4: Unit dan Pemilik Sudah Terpilih Otomatis) */}
        {proxyModalMember && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-surface-card rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-surface-border">
                <h3 className="font-bold text-base text-content-main flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-brand-primary" />
                  Pemberian Mandat Surat Kuasa
                </h3>
                <button type="button" onClick={() => setProxyModalMember(null)} className="text-content-muted hover:text-content-main">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Box Info Unit & Pemilik yang Otomatis Terpilih */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-content-muted">Kode Unit Terpilih:</span>
                  <strong className="text-brand-primary font-bold">{proxyModalMember.member.no_unit}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">Nama Anggota (Pemberi Kuasa):</span>
                  <strong className="text-content-main font-semibold">{proxyModalMember.member.nama_pemilik}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">Bobot Hak Suara:</span>
                  <strong className="font-mono text-brand-primary">{parseFloat(proxyModalMember.member.npp).toFixed(4)}% NPP</strong>
                </div>
              </div>

              {proxyModalMember.existingProxy && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-status-success">Kuasa Aktif:</span>
                    <div className="font-bold text-content-main">{proxyModalMember.existingProxy.namaKuasa}</div>
                    <div className="text-[11px] text-content-muted">{proxyModalMember.existingProxy.noHpKuasa || 'Tanpa no. HP'}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCancelProxy(proxyModalMember.existingProxy.id)}
                    className="px-2.5 py-1 bg-red-50 text-status-danger border border-red-200 rounded text-xs font-bold hover:bg-red-100"
                  >
                    Cabut Kuasa
                  </button>
                </div>
              )}

              <form onSubmit={handleSaveProxy} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-content-main mb-1">
                    Nama Penerima Kuasa (Sesuai KTP) *
                  </label>
                  <input
                    type="text"
                    required
                    value={proxyNamaKuasa}
                    onChange={(e) => setProxyNamaKuasa(e.target.value)}
                    placeholder="Masukkan nama penerima kuasa..."
                    className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-content-main mb-1">
                    Nomor WhatsApp / HP Penerima Kuasa
                  </label>
                  <input
                    type="tel"
                    value={proxyNoHp}
                    onChange={(e) => setProxyNoHp(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-content-main mb-1">
                    Lampiran Berkas Surat Kuasa Fisik
                  </label>
                  <div className="border border-surface-border rounded-lg p-3 bg-surface-bg text-center text-xs text-content-muted">
                    <Upload className="w-4 h-4 mx-auto mb-1 text-brand-accent" />
                    <span>Dokumen fisik surat kuasa diverifikasi panitia</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={proxyLoading}
                    className="flex-1 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary-hover shadow-sm"
                  >
                    {proxyLoading ? 'Menyimpan...' : 'Simpan Mandat Kuasa'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProxyModalMember(null)}
                    className="px-4 py-2 border border-surface-border rounded-lg text-xs font-semibold text-content-muted hover:bg-surface-bg"
                  >
                    Tutup
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dialog Konfirmasi Pembatalan Check-in */}
        {cancelDialog && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-surface-card rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-status-danger flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Batalkan Kehadiran Peserta
              </h3>
              <p className="text-xs text-content-muted">
                Anda akan membatalkan status HADIR untuk <strong>{cancelDialog.memberName}</strong>. Status peserta akan kembali menjadi BELUM HADIR.
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
