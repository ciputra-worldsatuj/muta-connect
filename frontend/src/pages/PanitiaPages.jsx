import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ApiService } from '../api/client';
import { SkeletonPage } from '../components/common/SkeletonPage';
import {
  Play,
  Square,
  Users,
  Vote,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserX,
  UserCheck,
  RefreshCw
} from 'lucide-react';

/**
 * UF-08, UF-09, UF-11: Kendali Sidang, Kendali Soal Voting, dan Kick Peserta
 */

// --- S-15: KENDALI STATUS SIDANG ---
export function KendaliSidangSkeleton() {
  const { currentSession, currentUser, currentTenant } = useApp();
  const sessionId = currentSession?.id || 's-2026-muta';
  const [projectorData, setProjectorData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 5000); // Polling 5s (NFR-02)
    return () => clearInterval(interval);
  }, [sessionId]);

  const loadStatus = async () => {
    try {
      const data = await ApiService.get('getProjectorData', {
        sessionId,
        tenantId: currentTenant?.id || 't-cw1'
      });
      setProjectorData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartSession = async () => {
    if (!window.confirm('Yakin ingin memulai sidang? Check-in setelah ini akan berlabel Late (BR-10).')) return;
    try {
      await ApiService.request('startSession', { sessionId, userId: currentUser.name });
      loadStatus();
    } catch (err) {
      alert('Gagal mulai sidang: ' + err.message);
    }
  };

  const handleMarkAbsent = async () => {
    if (!window.confirm('Catat seluruh anggota yang belum hadir sebagai TIDAK HADIR?')) return;
    try {
      await ApiService.request('markAbsent', { sessionId, userId: currentUser.name });
      alert('Seluruh anggota belum check-in dicatat TIDAK HADIR.');
      loadStatus();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCloseSession = async () => {
    if (!window.confirm('PERINGATAN: Menutup sidang akan MENGUNCI REKAP secara permanen (BR-11). Lanjutkan?')) return;
    try {
      await ApiService.request('closeSession', { sessionId, userId: currentUser.name });
      loadStatus();
    } catch (err) {
      alert('Gagal tutup sidang: ' + err.message);
    }
  };

  const quorum = projectorData?.quorumPercent || 0;
  const threshold = projectorData?.quorumThreshold || 50;
  const isReached = quorum > threshold;

  return (
    <SkeletonPage
      screenId="S-15"
      title="Kendali Sidang & Kuorum"
      subtitle={`Operasi status sidang ${sessionId} dan pemantauan batas sah musyawarah`}
      roles={['admin', 'panitia']}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel Tombol Operasi Sidang */}
        <div className="bg-surface-card rounded-2xl border border-surface-border p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-surface-border">
            <span className="text-xs font-bold text-content-main uppercase">
              Operasi Pelaksanaan Sidang
            </span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
              projectorData?.sessionStatus === 'Berjalan' ? 'bg-green-100 text-status-success' :
              projectorData?.sessionStatus === 'Ditutup' ? 'bg-slate-200 text-content-muted' : 'bg-amber-100 text-status-warning'
            }`}>
              Status: {projectorData?.sessionStatus || 'Draft'}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={projectorData?.sessionStatus === 'Berjalan' || projectorData?.sessionStatus === 'Ditutup'}
              onClick={handleStartSession}
              className="py-3 px-4 rounded-xl bg-status-success text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-green-700 shadow-sm disabled:opacity-40 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>1. Mulai Sidang (Kunci On-Time, Check-in Selanjutnya Late)</span>
            </button>

            <button
              type="button"
              onClick={handleMarkAbsent}
              disabled={projectorData?.sessionStatus !== 'Berjalan'}
              className="py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-700 shadow-sm disabled:opacity-40 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>2. Catat Anggota Belum Hadir Sebagai TIDAK HADIR</span>
            </button>

            <button
              type="button"
              disabled={projectorData?.sessionStatus === 'Ditutup'}
              onClick={handleCloseSession}
              className="py-3 px-4 rounded-xl bg-status-danger text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-700 shadow-sm disabled:opacity-40 transition-colors"
            >
              <Square className="w-4 h-4" />
              <span>3. Tutup Sidang & Kunci Rekapitulasi Suara</span>
            </button>
          </div>

          <div className="p-3 bg-surface-bg rounded-lg border border-surface-border text-xs text-content-muted">
            Check-in sebelum Mulai Sidang berlabel <strong>On time</strong>, sesudahnya <strong>Late</strong>. Setelah Tutup Sidang, rekap terkunci permanen.
          </div>
        </div>

        {/* Panel Status Kuorum Real-time */}
        <div className="bg-surface-card rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-surface-border">
            <span className="text-xs font-bold text-content-main uppercase">
              Kalkulasi Otomatis Kuorum (OBJ-02)
            </span>
            <span className="text-[11px] text-content-muted">Refresh 5 Detik</span>
          </div>

          <div className="text-center py-4 space-y-2">
            <div className="text-4xl md:text-5xl font-black text-brand-primary tabular-nums">
              {quorum.toFixed(4)}%
            </div>
            <div className={`text-xs font-bold ${isReached ? 'text-status-success' : 'text-status-warning'}`}>
              {isReached ? 'KUORUM TERCAPAI (SIDANG SAH MENGAMBIL KEPUTUSAN)' : `KUORUM BELUM TERCAPAI (Target: > ${threshold.toFixed(1)}%)`}
            </div>
          </div>

          {/* Progress Kuorum */}
          <div className="space-y-1">
            <div className="w-full bg-surface-bg rounded-full h-4 border border-surface-border overflow-hidden relative">
              <div
                className={`h-full transition-all duration-500 ${isReached ? 'bg-status-success' : 'bg-status-warning'}`}
                style={{ width: `${Math.min(quorum, 100)}%` }}
              />
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-500 z-10" title="Batas Kuorum 50%" />
            </div>
            <div className="flex justify-between text-[11px] text-content-muted">
              <span>0%</span>
              <span className="font-bold text-red-600">Ambang 50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="pt-2 border-t border-surface-border grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-content-muted">Peserta Hadir:</div>
              <div className="font-bold text-content-main tabular-nums">
                {projectorData?.presentMembers || 0} / {projectorData?.totalMembers || 0} Orang
              </div>
            </div>
            <div>
              <div className="text-content-muted">NPP Hadir:</div>
              <div className="font-bold text-brand-primary tabular-nums">
                {projectorData?.presentNpp ? projectorData.presentNpp.toFixed(4) : '0.0000'} / {projectorData?.totalNpp || 100}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}

// --- S-16: KENDALI SOAL VOTING ---
export function KendaliVotingSkeleton() {
  const { currentSession, currentUser, currentTenant } = useApp();
  const sessionId = currentSession?.id || 's-2026-muta';

  const [agendas, setAgendas] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [projectorData, setProjectorData] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const loadData = async () => {
    try {
      const [agList, projData] = await Promise.all([
        ApiService.request('getAgendas', { sessionId }),
        ApiService.get('getProjectorData', { sessionId, tenantId: currentTenant?.id || 't-cw1' })
      ]);
      setAgendas(agList);
      setProjectorData(projData);

      // Cari soal yang sedang dibuka
      let active = null;
      agList.forEach(a => {
        (a.questions || []).forEach(q => {
          if (q.status === 'Dibuka') active = q;
        });
      });
      setActiveQuestion(active);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenQuestion = async (qId) => {
    // Validasi kuorum (BR-08)
    if (!projectorData?.isQuorumReached) {
      alert('Peringatan: Soal tidak dapat dibuka sebelum kuorum tercapai (> 50%) sesuai aturan BR-08!');
      return;
    }

    try {
      await ApiService.request('openQuestion', {
        questionId: qId,
        sessionId,
        userId: currentUser.name
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCloseQuestion = async (qId) => {
    try {
      await ApiService.request('closeQuestion', {
        questionId: qId,
        userId: currentUser.name
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <SkeletonPage
      screenId="S-16"
      title="Kendali Soal Pemungutan Suara"
      subtitle={`Buka sesi voting elektronik bergaya Kahoot dan pantau penghitungan suara`}
      roles={['admin', 'panitia']}
    >
      <div className="space-y-6">
        {/* Banner Soal Aktif */}
        {activeQuestion ? (
          <div className="p-6 bg-blue-900 text-white rounded-2xl shadow-md border border-blue-800 space-y-4">
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 rounded-full bg-status-success text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                SESI VOTING SEDANG DIBUKA
              </span>
              <button
                type="button"
                onClick={() => handleCloseQuestion(activeQuestion.id)}
                className="px-4 py-2 bg-status-danger hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Tutup Voting Sekarang
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold">{activeQuestion.pertanyaan}</h2>
              <div className="text-xs text-blue-200 mt-1">
                Durasi: {activeQuestion.durasiDetik} detik • Pilihan: {activeQuestion.pilihan?.join(', ')}
              </div>
            </div>

            {projectorData?.activeVoteResults && (
              <div className="p-3 bg-white/10 rounded-xl text-xs flex justify-around font-bold">
                <div>Suara Masuk: {projectorData.activeVoteResults.totalVoters} Pemilih</div>
                <div>Peserta Hadir: {projectorData.activeVoteResults.presentVoters} Orang</div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-surface-card rounded-xl border border-surface-border text-center text-xs text-content-muted">
            Tidak ada soal voting yang sedang dibuka. Pilih soal di bawah untuk membuka sesi voting.
          </div>
        )}

        {/* Daftar Soal per Agenda */}
        <div className="space-y-4">
          {agendas.map(agenda => (
            <div key={agenda.id} className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-content-main">
                Agenda {agenda.urutan}: {agenda.judul}
              </h3>

              <div className="space-y-2">
                {agenda.questions && agenda.questions.length > 0 ? (
                  agenda.questions.map(q => (
                    <div key={q.id} className="p-3 bg-surface-bg rounded-lg border border-surface-border flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-content-main">{q.pertanyaan}</div>
                        <div className="text-[11px] text-content-muted mt-0.5">
                          Tipe: {q.tipeSoal} • {q.pilihan?.length} Pilihan • Status: <strong>{q.status}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {q.status === 'Dibuka' ? (
                          <button
                            type="button"
                            onClick={() => handleCloseQuestion(q.id)}
                            className="px-3 py-1.5 bg-status-danger text-white font-bold rounded-lg hover:bg-red-700"
                          >
                            Tutup Soal
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenQuestion(q.id)}
                            className="px-3 py-1.5 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary-hover"
                          >
                            Buka Soal
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-content-muted italic">Belum ada soal pada agenda ini.</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}

// --- S-17: DAFTAR PESERTA & KICK ---
export function DaftarPesertaSkeleton() {
  const { currentSession, currentUser, currentTenant } = useApp();
  const sessionId = currentSession?.id || 's-2026-muta';

  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [search, setSearch] = useState('');
  const [kickDialog, setKickDialog] = useState(null); // { memberId, name }
  const [kickReason, setKickReason] = useState('');

  useEffect(() => {
    loadData();
  }, [sessionId, currentTenant?.id]);

  const loadData = async () => {
    try {
      const [mList, invList] = await Promise.all([
        ApiService.request('getMembers', { tenantId: currentTenant?.id || 't-cw1' }),
        ApiService.request('getInvitations', { sessionId })
      ]);
      setMembers(mList);
      setInvitations(invList);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmKick = async () => {
    if (!kickReason) {
      alert('Alasan kick peserta wajib diisi.');
      return;
    }

    try {
      await ApiService.request('kickParticipant', {
        sessionId,
        memberId: kickDialog.memberId,
        alasan: kickReason,
        userId: currentUser.name
      });
      setKickDialog(null);
      setKickReason('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = members.filter(m =>
    (m.no_unit || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.nama_pemilik || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SkeletonPage
      screenId="S-17"
      title="Daftar Peserta Sidang & Hak Suara"
      subtitle={`Kelola kehadiran, hak suara, dan tindakan kick peserta bermasalah`}
      roles={['admin', 'panitia']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-sm space-y-4">
        <div className="max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari peserta berdasarkan nama atau unit..."
            className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
          />
        </div>

        <div className="border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-bg border-b border-surface-border text-content-muted font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Nama Anggota</th>
                <th className="px-4 py-3 text-right">Bobot NPP</th>
                <th className="px-4 py-3">Kehadiran</th>
                <th className="px-4 py-3 text-right">Aksi Disiplin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map(m => {
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
                      <button
                        type="button"
                        onClick={() => setKickDialog({ memberId: m.id, name: m.nama_pemilik })}
                        className="px-2.5 py-1 rounded bg-red-50 text-status-danger border border-red-200 text-[11px] font-semibold hover:bg-red-100"
                      >
                        Kick Peserta
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Kick Peserta */}
        {kickDialog && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-surface-card rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-status-danger flex items-center gap-2">
                <UserX className="w-5 h-5" />
                Kick Peserta dari Bilik Suara
              </h3>
              <p className="text-xs text-content-muted">
                Peserta <strong>{kickDialog.name}</strong> tidak akan dapat memilih pada soal voting sidang ini.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-content-main mb-1">
                  Alasan Penonaktifan (Wajib Dicatat ke Log) *
                </label>
                <textarea
                  rows="2"
                  required
                  value={kickReason}
                  onChange={(e) => setKickReason(e.target.value)}
                  placeholder="Misal: Mengganggu ketertiban musyawarah..."
                  className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmKick}
                  className="flex-1 py-2 bg-status-danger text-white rounded-lg text-xs font-bold hover:bg-red-700"
                >
                  Konfirmasi Kick
                </button>
                <button
                  type="button"
                  onClick={() => setKickDialog(null)}
                  className="px-4 py-2 border border-surface-border rounded-lg text-xs font-semibold text-content-muted"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SkeletonPage>
  );
}
