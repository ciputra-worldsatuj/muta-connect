import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ApiService } from '../api/client';
import { SkeletonPage } from '../components/common/SkeletonPage';
import QRCode from 'qrcode';
import {
  Calendar,
  Clock,
  Plus,
  Vote,
  QrCode,
  Mail,
  MessageSquare,
  FileText,
  Copy,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Ban,
  Upload,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

/**
 * UF-03, UF-04, UF-05: Sidang, Agenda, Soal Voting, Undangan, & Kuasa
 */

// --- S-07: DAFTAR SIDANG ---
export function DaftarSidangSkeleton() {
  const { currentTenant } = useApp();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [currentTenant?.id]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await ApiService.request('getSessions', { tenantId: currentTenant?.id || 't-cw1' });
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SkeletonPage
      screenId="S-07"
      title="Daftar Sidang (MUTA / RUTA)"
      subtitle={`Kelola musyawarah tahunan dan rapat umum luar biasa pada ${currentTenant?.name || 'PPPSRS'}`}
      roles={['admin', 'panitia']}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-content-muted uppercase">Daftar Sidang Terdaftar</span>
          <a
            href="#/sidang/baru"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Sidang Baru</span>
          </a>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-content-muted">Memuat data sidang...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((s) => (
              <div key={s.id} className="bg-surface-card p-5 rounded-xl border border-surface-border shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-brand-primary">
                      {s.tipe}
                    </span>
                    <span className="text-xs font-mono text-content-muted">Kode: {s.kode_publik}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    s.status === 'Berjalan' ? 'bg-green-100 text-status-success' :
                    s.status === 'Ditutup' ? 'bg-slate-100 text-content-muted' : 'bg-amber-100 text-status-warning'
                  }`}>
                    {s.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-content-main">{s.judul}</h3>
                  <div className="text-xs text-content-muted flex items-center gap-2 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-accent" />
                    <span>{s.tanggal} • {s.lokasi}</span>
                  </div>
                  <div className="text-[11px] text-content-muted mt-0.5">
                    Ambang Batas Kuorum: <strong className="text-brand-primary">{s.ambang_kuorum || 50}%</strong>
                  </div>
                </div>

                {/* Sesuai Revisi 1: Hanya menu Agenda & Soal dan Undangan & QR */}
                <div className="pt-3 border-t border-surface-border flex flex-wrap gap-3 text-xs">
                  <a href={`#/sidang/${s.id}/agenda`} className="font-semibold text-brand-primary hover:underline flex items-center gap-1">
                    <span>Agenda & Soal</span> &rarr;
                  </a>
                  <span className="text-surface-border">•</span>
                  <a href={`#/sidang/${s.id}/undangan`} className="font-semibold text-brand-accent hover:underline flex items-center gap-1">
                    <span>Undangan & QR</span> &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SkeletonPage>
  );
}

// --- S-08: FORM SIDANG BARU ---
export function FormSidangSkeleton() {
  const { currentTenant, refreshSessions, setCurrentSessionId } = useApp();
  const [tipe, setTipe] = useState('MUTA');
  const [judul, setJudul] = useState('Musyawarah Umum Anggota (MUA) PPPSRS CW1J');
  const [hariTanggal, setHariTanggal] = useState('Sabtu, 25 Juli 2026');
  const [tanggal, setTanggal] = useState('2026-07-25');
  const [waktuDari, setWaktuDari] = useState('09.00');
  const [waktuSampai, setWaktuSampai] = useState('12.00');
  const [isSampaiSelesai, setIsSampaiSelesai] = useState(true);
  const [lokasi, setLokasi] = useState('Function Room Artpreneur Lt. 13, Gedung Podium Ciputra World 1 Jakarta');
  const [ambangKuorum, setAmbangKuorum] = useState('50.0');
  const [status, setStatus] = useState({ error: '', success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !lokasi) {
      setStatus({ error: 'Judul dan lokasi sidang wajib diisi.', success: false });
      return;
    }

    try {
      const waktuStr = isSampaiSelesai 
        ? `${waktuDari} WIB – selesai` 
        : `${waktuDari} WIB – ${waktuSampai} WIB`;

      const res = await ApiService.request('saveSession', {
        tenantId: currentTenant?.id || 't-cw1',
        tipe,
        judul,
        tanggal,
        hari_tanggal: hariTanggal,
        waktu_pelaksanaan: waktuStr,
        waktu_dari: `${waktuDari} WIB`,
        waktu_sampai: isSampaiSelesai ? 'selesai' : `${waktuSampai} WIB`,
        lokasi,
        ambang_kuorum: parseFloat(ambangKuorum) || 50.0
      });

      if (refreshSessions) refreshSessions();
      if (res && res.session) {
        setCurrentSessionId(res.session.id);
      }

      setStatus({ error: '', success: true });
      setTimeout(() => {
        window.location.hash = '#/sidang';
      }, 1000);
    } catch (err) {
      setStatus({ error: err.message, success: false });
    }
  };

  return (
    <SkeletonPage
      screenId="S-08"
      title="Buat Sidang Baru"
      subtitle="Konfigurasi parameter sidang dan penentuan batas sah kuorum (Admin)"
      roles={['admin']}
    >
      <div className="max-w-2xl bg-surface-card rounded-xl border border-surface-border p-6 shadow-sm space-y-4">
        {status.error && (
          <div className="p-3 bg-red-50 border border-status-danger text-status-danger rounded-lg text-xs">
            {status.error}
          </div>
        )}
        {status.success && (
          <div className="p-3 bg-green-50 border border-status-success text-status-success rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Sidang berhasil dibuat dan langsung dipilih! Mengalihkan ke daftar sidang...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-content-main mb-1">Jenis Sidang</label>
              <select
                value={tipe}
                onChange={(e) => setTipe(e.target.value)}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
              >
                <option value="MUTA">MUTA (Musyawarah Umum Tahunan Anggota)</option>
                <option value="RUTA">RUTA (Rapat Umum Tahunan Anggota Luar Biasa)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-main mb-1">Ambang Batas Kuorum (%)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="100"
                value={ambangKuorum}
                onChange={(e) => setAmbangKuorum(e.target.value)}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm font-mono tabular-nums"
              />
              <div className="text-[10px] text-content-muted mt-1">Default: &gt; 50% dari total NPP tenant</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-main mb-1">Judul / Tema Sidang *</label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Misal: MUTA Tahun Buku 2026 PPPSRS Ciputra World 1"
              className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-content-main mb-1">Hari & Tanggal Pelaksanaan *</label>
              <input
                type="text"
                required
                value={hariTanggal}
                onChange={(e) => setHariTanggal(e.target.value)}
                placeholder="Misal: Sabtu, 25 Juli 2026"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-main mb-1">Pilih Tanggal Kalender</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Waktu Pelaksanaan: Dari & Sampai (dengan opsi Sampai Selesai) */}
          <div className="bg-surface-bg p-3.5 rounded-xl border border-surface-border space-y-2">
            <label className="block text-xs font-semibold text-content-main">Waktu Pelaksanaan *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <span className="text-[11px] text-content-muted block mb-1">Waktu Mulai:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    required
                    value={waktuDari}
                    onChange={(e) => setWaktuDari(e.target.value)}
                    placeholder="09.00"
                    className="w-full px-3 py-1.5 bg-surface-card border border-surface-border rounded-lg text-sm font-mono"
                  />
                  <span className="text-xs font-medium text-content-muted">WIB</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-content-muted">Waktu Selesai:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-brand-primary">
                    <input
                      type="checkbox"
                      checked={isSampaiSelesai}
                      onChange={(e) => setIsSampaiSelesai(e.target.checked)}
                      className="rounded border-surface-border text-brand-primary focus:ring-brand-accent"
                    />
                    <span>Sampai Selesai</span>
                  </label>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    disabled={isSampaiSelesai}
                    value={isSampaiSelesai ? 'Selesai' : waktuSampai}
                    onChange={(e) => setWaktuSampai(e.target.value)}
                    placeholder="12.00"
                    className={`w-full px-3 py-1.5 border border-surface-border rounded-lg text-sm font-mono ${
                      isSampaiSelesai ? 'bg-slate-100 text-content-muted italic' : 'bg-surface-card text-content-main'
                    }`}
                  />
                  {!isSampaiSelesai && <span className="text-xs font-medium text-content-muted">WIB</span>}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-content-muted">
              Format di undangan: <strong className="text-brand-primary">{waktuDari} WIB – {isSampaiSelesai ? 'selesai' : waktuSampai + ' WIB'}</strong>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-main mb-1">Lokasi Ruang Sidang *</label>
            <input
              type="text"
              required
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Misal: Function Room Artpreneur Lt. 13, Gedung Podium Ciputra World 1 Jakarta"
              className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
            />
          </div>

          <div className="pt-4 flex gap-3 border-t border-surface-border">
            <a href="#/sidang" className="px-4 py-2 border border-surface-border rounded-lg text-xs font-semibold text-content-muted">
              Batal
            </a>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-primary text-white rounded-lg text-xs font-semibold hover:bg-brand-primary-hover shadow-sm"
            >
              Simpan & Siapkan Sidang
            </button>
          </div>
        </form>
      </div>
    </SkeletonPage>
  );
}

// --- S-09: AGENDA & SOAL VOTING (DENGAN TAMBAH MATA ACARA & EDIT DRAFT SOAL) ---
export function AgendaSoalSkeleton({ params }) {
  const sessionId = params?.id || 's-2026-muta';
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Tambah Agenda (Mata Acara)
  const [showAddAgenda, setShowAddAgenda] = useState(false);
  const [agendaJudul, setAgendaJudul] = useState('');
  const [agendaDeskripsi, setAgendaDeskripsi] = useState('');
  const [agendaUrutan, setAgendaUrutan] = useState('');

  // Modal Tambah / Edit Soal
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [selectedAgendaId, setSelectedAgendaId] = useState('');
  const [tipeSoal, setTipeSoal] = useState('setuju_tidak_abstain');
  const [pertanyaan, setPertanyaan] = useState('');
  const [pilihanText, setPilihanText] = useState('Setuju\nTidak Setuju\nAbstain');
  const [durasiDetik, setDurasiDetik] = useState('60');

  useEffect(() => {
    loadAgendas();
  }, [sessionId]);

  const loadAgendas = async () => {
    setLoading(true);
    try {
      const data = await ApiService.request('getAgendas', { sessionId });
      setAgendas(data);
      if (data.length > 0 && !selectedAgendaId) setSelectedAgendaId(data[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Simpan Agenda Baru
  const handleSaveAgenda = async (e) => {
    e.preventDefault();
    if (!agendaJudul.trim()) {
      alert('Judul mata acara agenda wajib diisi.');
      return;
    }

    try {
      await ApiService.request('saveAgenda', {
        sessionId,
        judul: agendaJudul.trim(),
        deskripsi: agendaDeskripsi.trim(),
        urutan: agendaUrutan ? parseInt(agendaUrutan) : agendas.length + 1
      });
      setShowAddAgenda(false);
      setAgendaJudul('');
      setAgendaDeskripsi('');
      setAgendaUrutan('');
      loadAgendas();
    } catch (err) {
      alert('Gagal simpan agenda: ' + err.message);
    }
  };

  // Buka Form Buat Soal Baru
  const handleOpenAddQuestion = (agendaId = '') => {
    setEditingQuestionId(null);
    setSelectedAgendaId(agendaId || (agendas.length > 0 ? agendas[0].id : ''));
    setTipeSoal('setuju_tidak_abstain');
    setPertanyaan('');
    setPilihanText('Setuju\nTidak Setuju\nAbstain');
    setDurasiDetik('60');
    setShowQuestionModal(true);
  };

  // Buka Form Edit Soal Draft
  const handleOpenEditQuestion = (q, agendaId) => {
    setEditingQuestionId(q.id);
    setSelectedAgendaId(agendaId);
    setTipeSoal(q.tipeSoal || 'setuju_tidak_abstain');
    setPertanyaan(q.pertanyaan || '');
    setPilihanText((q.pilihan || []).join('\n'));
    setDurasiDetik(String(q.durasiDetik || 60));
    setShowQuestionModal(true);
  };

  const handleTipeChange = (tipe) => {
    setTipeSoal(tipe);
    if (tipe === 'setuju_tidak_abstain') {
      setPilihanText('Setuju\nTidak Setuju\nAbstain');
    } else {
      setPilihanText('Opsi A\nOpsi B\nAbstain');
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!selectedAgendaId) {
      alert('Pilih salah satu mata acara agenda terlebih dahulu.');
      return;
    }

    const pilihanArray = pilihanText.split('\n').map(p => p.trim()).filter(Boolean);
    if (pilihanArray.length < 2) {
      alert('Minimal harus ada 2 pilihan jawaban.');
      return;
    }

    try {
      await ApiService.request('saveQuestion', {
        id: editingQuestionId,
        agendaId: selectedAgendaId,
        sessionId,
        tipeSoal,
        pertanyaan: pertanyaan.trim(),
        pilihan: pilihanArray,
        maksPilihan: 1,
        durasiDetik: parseInt(durasiDetik) || 60
      });
      setShowQuestionModal(false);
      setEditingQuestionId(null);
      setPertanyaan('');
      loadAgendas();
    } catch (err) {
      alert('Gagal simpan soal: ' + err.message);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Yakin ingin menghapus soal ini?')) return;
    try {
      await ApiService.request('deleteQuestion', { id: qId });
      loadAgendas();
    } catch (err) {
      alert('Gagal hapus soal: ' + err.message);
    }
  };

  return (
    <SkeletonPage
      screenId="S-09"
      title="Agenda Sidang & Soal Pemungutan Suara"
      subtitle={`Daftar mata acara dan pertanyaan voting berbobot NPP untuk sidang ${sessionId}`}
      roles={['admin', 'panitia']}
    >
      <div className="space-y-6">
        {/* Tombol Aksi Tambah Agenda & Tambah Soal */}
        <div className="flex flex-wrap gap-2 justify-between items-center pb-2 border-b border-surface-border">
          <span className="text-xs font-bold text-content-muted uppercase">Daftar Agenda & Pertanyaan</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAddAgenda(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-primary text-brand-primary text-xs font-semibold hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Mata Acara Agenda</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenAddQuestion()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Soal Voting</span>
            </button>
          </div>
        </div>

        {/* Modal Form Tambah Agenda */}
        {showAddAgenda && (
          <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-4 animate-in fade-in duration-150">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-brand-primary">Tambah Mata Acara Agenda Baru</h3>
              <button type="button" onClick={() => setShowAddAgenda(false)} className="text-content-muted hover:text-content-main">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAgenda} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-content-main mb-1">Nomor Urutan</label>
                  <input
                    type="number"
                    min="1"
                    value={agendaUrutan}
                    onChange={(e) => setAgendaUrutan(e.target.value)}
                    placeholder={`Otomatis (${agendas.length + 1})`}
                    className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-content-main mb-1">Judul Mata Acara Agenda *</label>
                  <input
                    type="text"
                    required
                    value={agendaJudul}
                    onChange={(e) => setAgendaJudul(e.target.value)}
                    placeholder="Contoh: Pembahasan dan Pengesahan Rencana Kerja Tahun 2027"
                    className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-content-main mb-1">Deskripsi / Keterangan</label>
                <textarea
                  rows="2"
                  value={agendaDeskripsi}
                  onChange={(e) => setAgendaDeskripsi(e.target.value)}
                  placeholder="Keterangan singkat materi mata acara sidang..."
                  className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary-hover shadow-sm">
                  Simpan Agenda
                </button>
                <button type="button" onClick={() => setShowAddAgenda(false)} className="px-4 py-2 border border-surface-border rounded-lg text-xs font-semibold text-content-muted hover:bg-surface-bg">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Form Tambah / Edit Soal */}
        {showQuestionModal && (
          <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-4 animate-in fade-in duration-150">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-brand-primary">
                {editingQuestionId ? 'Edit Soal Voting (Status Draft)' : 'Buat Pertanyaan Voting Baru'}
              </h3>
              <button type="button" onClick={() => setShowQuestionModal(false)} className="text-content-muted hover:text-content-main">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveQuestion} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-content-main mb-1">Mata Acara Agenda</label>
                  <select
                    value={selectedAgendaId}
                    onChange={(e) => setSelectedAgendaId(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs"
                  >
                    {agendas.map(a => (
                      <option key={a.id} value={a.id}>Agenda {a.urutan}: {a.judul}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-content-main mb-1">Format Soal</label>
                  <select
                    value={tipeSoal}
                    onChange={(e) => handleTipeChange(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs"
                  >
                    <option value="setuju_tidak_abstain">Setuju / Tidak Setuju / Abstain</option>
                    <option value="pilih_satu">Pilih Satu (Single Choice)</option>
                    <option value="pilih_banyak">Pilih Banyak (Multiple Choice)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-content-main mb-1">Durasi Hitung Mundur (Detik)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={durasiDetik}
                    onChange={(e) => setDurasiDetik(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-content-main mb-1">Pertanyaan Voting *</label>
                <input
                  type="text"
                  required
                  value={pertanyaan}
                  onChange={(e) => setPertanyaan(e.target.value)}
                  placeholder="Ketik pertanyaan voting..."
                  className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-content-main mb-1">Pilihan Jawaban (Satu baris per pilihan)</label>
                <textarea
                  rows="3"
                  required
                  value={pilihanText}
                  onChange={(e) => setPilihanText(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary-hover shadow-sm">
                  {editingQuestionId ? 'Simpan Perubahan Soal' : 'Simpan Soal Voting'}
                </button>
                <button type="button" onClick={() => setShowQuestionModal(false)} className="px-4 py-2 border border-surface-border rounded-lg text-xs font-semibold text-content-muted hover:bg-surface-bg">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Agenda & Soal */}
        <div className="space-y-4">
          {agendas.length === 0 ? (
            <div className="p-8 bg-surface-card rounded-xl border border-surface-border text-center text-xs text-content-muted">
              Belum ada mata acara agenda. Klik tombol <strong>Tambah Mata Acara Agenda</strong> di atas untuk memulai.
            </div>
          ) : (
            agendas.map((agenda) => (
              <div key={agenda.id} className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                      {agenda.urutan}
                    </span>
                    <h3 className="font-bold text-sm text-content-main">{agenda.judul}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenAddQuestion(agenda.id)}
                    className="text-[11px] font-semibold text-brand-accent hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Soal</span>
                  </button>
                </div>
                {agenda.deskripsi && (
                  <p className="text-xs text-content-muted pl-8">{agenda.deskripsi}</p>
                )}

                {/* Soal Di Bawah Agenda */}
                <div className="pl-8 space-y-2 pt-2">
                  {agenda.questions && agenda.questions.length > 0 ? (
                    agenda.questions.map((q) => (
                      <div key={q.id} className="p-3 bg-surface-bg rounded-lg border border-surface-border flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-content-main">{q.pertanyaan}</div>
                          <div className="text-[11px] text-content-muted">
                            Tipe: <span className="font-mono">{q.tipeSoal}</span> • Durasi: {q.durasiDetik}s • Pilihan: {(q.pilihan || []).join(', ')}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            q.status === 'Dibuka' ? 'bg-green-100 text-status-success' :
                            q.status === 'Ditutup' ? 'bg-slate-200 text-content-muted' : 'bg-amber-100 text-status-warning'
                          }`}>
                            {q.status}
                          </span>

                          {/* Fitur Edit & Hapus Soal yang Masih Draft (Revisi 2) */}
                          {q.status === 'Draft' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEditQuestion(q, agenda.id)}
                                className="p-1.5 rounded text-brand-primary hover:bg-blue-50 border border-surface-border transition-colors"
                                title="Edit Soal Draft"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="p-1.5 rounded text-status-danger hover:bg-red-50 border border-surface-border transition-colors"
                                title="Hapus Soal Draft"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-content-muted italic">Belum ada soal voting untuk agenda ini.</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SkeletonPage>
  );
}

// --- S-10: UNDANGAN & QR CODE DENGAN AKSI LIHAT QR - DRAFT WA - DRAFT EMAIL (REVISI 1) ---
export function UndanganQRSkeleton({ params }) {
  const sessionId = params?.id || 's-2026-muta';
  const { currentTenant, currentSession } = useApp();
  const [invitations, setInvitations] = useState([]);
  const [selectedQR, setSelectedQR] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null); // { id, type: 'wa'|'email' }

  useEffect(() => {
    loadInvitations();
  }, [sessionId]);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const data = await ApiService.request('getInvitations', { sessionId });
      setInvitations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      await ApiService.request('generateInvitations', {
        sessionId,
        tenantId: currentTenant?.id || 't-cw1'
      });
      loadInvitations();
    } catch (err) {
      alert('Gagal generate: ' + err.message);
    }
  };

  const handleShowQR = async (inv) => {
    setSelectedQR(inv);
    try {
      const url = await QRCode.toDataURL(inv.uid_qr, { width: 250, margin: 2 });
      setQrImageUrl(url);
    } catch (e) {
      console.error(e);
    }
  };

  // Salin Text Draft WhatsApp per Undangan Anggota
  const handleCopyDraftWA = (inv) => {
    const text = `*UNDANGAN RESMI MUSYAWARAH UMUM TAHUNAN ANGGOTA (MUTA)*\n\n` +
      `Kepada Yth. Bapak/Ibu *${inv.nama_pemilik}*\n` +
      `Unit: *${inv.no_unit}* | Bobot NPP: *${parseFloat(inv.npp).toFixed(4)}%*\n\n` +
      `Pengurus ${currentTenant?.name || 'PPPSRS'} mengundang kehadiran Anda pada sidang ${currentSession?.title || 'MUTA'} yang diselenggarakan pada:\n` +
      `🗓 Tanggal: ${currentSession?.tanggal || '28 November 2026'}\n` +
      `📍 Lokasi: ${currentSession?.lokasi || 'Ballroom Lt. 5'}\n` +
      `🔑 Kode Undangan QR: *${inv.uid_qr}*\n\n` +
      `Tautan Bilik Suara: https://muta-connect.github.io/#/vote/${currentSession?.kode_publik || 'CW2026'}\n\n` +
      `Tunjukkan pesan ini di meja registrasi.\n*Panitia MUTA Connect*`;

    navigator.clipboard.writeText(text);
    setCopiedId({ id: inv.id, type: 'wa' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Salin Text Draft Email per Undangan Anggota (Template Resmi MUA)
  const handleCopyDraftEmail = (inv) => {
    const hariTanggal = currentSession?.hari_tanggal || currentSession?.tanggal || 'Sabtu, 25 Juli 2026';
    const waktu = currentSession?.waktu_pelaksanaan || '09.00 WIB – selesai';
    const tempat = currentSession?.lokasi || 'Function Room Artpreneur Lt. 13, Gedung Podium Ciputra World 1 Jakarta';

    const text = `Yth. Bapak/Ibu Pemilik Unit\n` +
      `${inv.nama_pemilik}\n\n` +
      `Dengan hormat,\n` +
      `Bersama email ini kami sampaikan Surat Undangan Musyawarah Umum Anggota (MUA) Perhimpunan Pemilik dan Penghuni Satuan Rumah Susun (PPPSRS) Komersial Campuran Ciputra World 1 Jakarta.\n` +
      `Adapun pelaksanaan Musyawarah Umum Anggota (MUA) sebagai berikut:\n\n` +
      `Hari/Tanggal : ${hariTanggal}\n` +
      `Waktu : ${waktu}\n` +
      `Tempat : ${tempat}\n\n` +
      `Agenda MUA\n` +
      `I. Agenda Umum\n` +
      `Pengesahan Tata Tertib Musyawarah; dan\n` +
      `Pengesahan Pendirian dan Rencana Anggaran Dasar (AD) PPPSRS CW1J.\n\n` +
      `II. Agenda Sub Bagian\n` +
      `Pengesahan Rencana Anggaran Rumah Tangga (ART) dan Tata Tertib Hunian (House Rules), Sanksi serta Denda atas Keterlambatan;\n` +
      `Penyampaian Laporan Keuangan Tahunan Masa Transisi yang Telah Diaudit oleh Kantor Akuntan Publik;\n` +
      `Pemilihan Ketua Pengurus dan Ketua Pengawas PPPSRS CW1J; dan\n` +
      `Penetapan Rencana Kegiatan Pengelolaan, Rencana Anggaran Biaya Pengelolaan Tahunan, Rencana Pemanfaatan Sinking Fund, serta Besaran Iuran Pengelolaan Lingkungan.\n\n` +
      `Berikut adalah QR Code registrasi Anda. Harap tunjukkan kepada petugas registrasi pada saat memasuki ruangan.\n` +
      `Kode Registrasi: ${inv.uid_qr}\n\n` +
      `Persyaratan Peserta\n\n` +
      `1. Pemilik yang namanya telah terdaftar dalam Daftar Buku Anggota dan telah melengkapi bukti kepemilikan (PPJB/SHMSRS/AJB) berhak mengikuti MUA.\n` +
      `2. Apabila diwakilkan, penerima kuasa wajib mengunggah dokumen kepemilikan, surat kuasa bermeterai Rp10.000, fotokopi KTP pemberi dan penerima kuasa, serta foto terbaru penerima kuasa.\n` +
      `3. Untuk pemilik perorangan, kuasa hanya dapat diberikan kepada anggota keluarga yang tercantum dalam satu Kartu Keluarga dengan mengunggah fotokopi KK.\n` +
      `4. Untuk pemilik badan hukum, kuasa diberikan kepada karyawan tetap dengan mengunggah Akta Pendirian Perusahaan, Akta Susunan Direksi Terbaru, dan Surat Keputusan Pengangkatan sebagai karyawan tetap (berkop surat resmi).\n` +
      `5. Bagi pemilik baru yang belum terdaftar sebagai anggota PPPSRS, diwajibkan mengunggah dokumen kepemilikan beserta dokumen pendukung sesuai ketentuan pada tautan registrasi.\n` +
      `6. Penghuni yang bukan merupakan pemilik agar menyampaikan informasi ini kepada pemilik unit.\n` +
      `7. Apabila memerlukan informasi lebih lanjut, Bapak/Ibu dapat menghubungi Bpk. Antonius Taroreh melalui 0811 185 3366.\n\n` +
      `Demikian kami sampaikan. Atas perhatian dan partisipasi Bapak/Ibu, kami ucapkan terima kasih.`;

    navigator.clipboard.writeText(text);
    setCopiedId({ id: inv.id, type: 'email' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <SkeletonPage
      screenId="S-10"
      title="Undangan & QR Code Peserta"
      subtitle={`Daftar QR Code unik 1x pakai dan salin draft undangan instan untuk sidang ${sessionId}`}
      roles={['admin']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-content-muted uppercase">
            Total {invitations.length} Undangan Terdaftar
          </span>
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Undangan Baru</span>
          </button>
        </div>

        <div className="border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-bg border-b border-surface-border text-content-muted font-bold uppercase">
              <tr>
                <th className="px-4 py-3">No. Unit</th>
                <th className="px-4 py-3">Nama Anggota</th>
                <th className="px-4 py-3">UID QR Code</th>
                <th className="px-4 py-3">Status QR</th>
                <th className="px-4 py-3 text-right">Aksi Undangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {invitations.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-brand-primary">{inv.no_unit}</td>
                  <td className="px-4 py-3 font-medium text-content-main">{inv.nama_pemilik}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-content-muted">{inv.uid_qr}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status_qr === 'Terpakai' ? 'bg-amber-100 text-status-warning' : 'bg-green-100 text-status-success'
                    }`}>
                      {inv.status_qr}
                    </span>
                  </td>

                  {/* Sesuai Revisi 1: Tombol Aksi "Lihat QR - Draft WA - Draft Email" */}
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleShowQR(inv)}
                        className="px-2.5 py-1 rounded bg-surface-bg border border-surface-border hover:bg-blue-50 text-[11px] font-semibold text-brand-primary transition-colors"
                        title="Lihat Pratinjau QR Code"
                      >
                        Lihat QR
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyDraftWA(inv)}
                        className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                          copiedId?.id === inv.id && copiedId?.type === 'wa'
                            ? 'bg-green-100 text-status-success border-status-success'
                            : 'bg-surface-bg border-surface-border text-status-success hover:bg-green-50'
                        }`}
                        title="Salin Draft Undangan WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{copiedId?.id === inv.id && copiedId?.type === 'wa' ? 'Tersalin!' : 'Draft WA'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyDraftEmail(inv)}
                        className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                          copiedId?.id === inv.id && copiedId?.type === 'email'
                            ? 'bg-blue-100 text-brand-primary border-brand-primary'
                            : 'bg-surface-bg border-surface-border text-brand-primary hover:bg-blue-50'
                        }`}
                        title="Salin Draft Undangan Email"
                      >
                        <Mail className="w-3 h-3" />
                        <span>{copiedId?.id === inv.id && copiedId?.type === 'email' ? 'Tersalin!' : 'Draft Email'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Pratinjau QR Code & Undangan Resmi */}
        {selectedQR && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-surface-card rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-surface-border">
              <div className="px-5 py-3 border-b border-surface-border flex items-center justify-between bg-surface-bg">
                <div>
                  <h3 className="font-bold text-sm text-content-main">Surat Undangan & QR Code MUA</h3>
                  <p className="text-[11px] text-content-muted">{selectedQR.nama_pemilik} — Unit {selectedQR.no_unit}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedQR(null)}
                  className="p-1 rounded-md text-content-muted hover:text-content-main hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-xs text-content-main">
                <div className="text-center bg-white p-4 rounded-xl border border-surface-border shadow-xs space-y-2">
                  <div className="text-[11px] font-bold text-brand-primary uppercase">QR Code Registrasi Masuk Sidang</div>
                  {qrImageUrl && (
                    <img src={qrImageUrl} alt="QR Code" className="w-40 h-40 mx-auto border border-surface-border rounded-lg p-1.5 bg-white" />
                  )}
                  <div className="font-mono text-xs font-bold text-content-main bg-surface-bg py-1 px-3 rounded-full inline-block">
                    Kode Undangan: {selectedQR.uid_qr}
                  </div>
                  <div className="text-[11px] text-content-muted">Tunjukkan QR code ini kepada petugas registrasi di meja lobi.</div>
                </div>

                <div className="bg-surface-bg p-4 rounded-xl border border-surface-border space-y-2 text-[11px] leading-relaxed">
                  <div className="font-semibold text-content-main">
                    Yth. Bapak/Ibu Pemilik Unit<br />
                    <span className="text-brand-primary font-bold">{selectedQR.nama_pemilik}</span>
                  </div>
                  <p>
                    Bersama email ini kami sampaikan Surat Undangan Musyawarah Umum Anggota (MUA) Perhimpunan Pemilik dan Penghuni Satuan Rumah Susun (PPPSRS) Komersial Campuran Ciputra World 1 Jakarta.
                  </p>
                  <div className="p-2.5 bg-white rounded-lg border border-surface-border space-y-1 font-mono text-[10px]">
                    <div><strong>Hari/Tanggal :</strong> {currentSession?.hari_tanggal || currentSession?.tanggal || 'Sabtu, 25 Juli 2026'}</div>
                    <div><strong>Waktu :</strong> {currentSession?.waktu_pelaksanaan || '09.00 WIB – selesai'}</div>
                    <div><strong>Tempat :</strong> {currentSession?.lokasi || 'Function Room Artpreneur Lt. 13, Gedung Podium Ciputra World 1 Jakarta'}</div>
                  </div>
                  <p className="text-[10px] text-content-muted italic">
                    Teks lengkap beserta rincian agenda dan persyaratan dapat disalin melalui tombol di bawah.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-surface-bg border-t border-surface-border flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyDraftEmail(selectedQR)}
                  className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary-hover shadow-sm flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{copiedId?.id === selectedQR.id && copiedId?.type === 'email' ? 'Tersalin!' : 'Salin Seluruh Isi Email'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQR(null)}
                  className="px-4 py-2 bg-surface-card hover:bg-slate-100 text-xs font-semibold text-content-main border border-surface-border rounded-lg"
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

// --- S-11: DRAFT MESSAGE REDIRECT / PREVIEW ---
export function DraftMessageSkeleton({ params }) {
  const sessionId = params?.id || 's-2026-muta';
  return (
    <SkeletonPage
      screenId="S-11"
      title="Draft Pesan Undangan (WhatsApp & Email)"
      subtitle={`Sesuai revisi, tombol salin draft kini terintegrasi langsung pada tabel Undangan & QR`}
      roles={['admin']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-6 text-center space-y-3">
        <p className="text-xs text-content-muted">
          Penyalinan draft WhatsApp dan Email untuk setiap anggota dapat dilakukan langsung pada halaman <strong>Undangan & QR Code</strong>.
        </p>
        <a
          href={`#/sidang/${sessionId}/undangan`}
          className="inline-block px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary-hover shadow-sm"
        >
          Buka Tabel Undangan & QR &rarr;
        </a>
      </div>
    </SkeletonPage>
  );
}

// --- S-12: KELOLA SURAT KUASA ---
export function KelolaKuasaSkeleton({ params }) {
  const sessionId = params?.id || 's-2026-muta';
  const [invitations, setInvitations] = useState([]);
  const [selectedInvId, setSelectedInvId] = useState('');
  const [namaKuasa, setNamaKuasa] = useState('');
  const [noHpKuasa, setNoHpKuasa] = useState('');
  const [showAddProxy, setShowAddProxy] = useState(false);

  useEffect(() => {
    loadData();
  }, [sessionId]);

  const loadData = async () => {
    try {
      const data = await ApiService.request('getInvitations', { sessionId });
      setInvitations(data);
      if (data.length > 0) setSelectedInvId(data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProxy = async (e) => {
    e.preventDefault();
    if (!namaKuasa) {
      alert('Nama penerima kuasa wajib diisi.');
      return;
    }

    try {
      await ApiService.request('saveProxy', {
        invitationId: selectedInvId,
        sessionId,
        namaKuasa,
        noHpKuasa,
        urlSuratKuasa: 'surat_kuasa_' + Date.now() + '.pdf'
      });
      setShowAddProxy(false);
      setNamaKuasa('');
      setNoHpKuasa('');
      loadData();
    } catch (err) {
      alert('Gagal simpan kuasa: ' + err.message);
    }
  };

  const proxyList = invitations.filter(inv => inv.proxy && inv.proxy.status === 'Aktif');

  return (
    <SkeletonPage
      screenId="S-12"
      title="Kelola Surat Kuasa Sidang"
      subtitle="Pemberian wewenang hadir dan memilih atas nama pemilik unit"
      roles={['admin']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-content-muted uppercase">
            Total {proxyList.length} Kuasa Terdaftar
          </span>
          <button
            type="button"
            onClick={() => setShowAddProxy(!showAddProxy)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary-hover shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daftarkan Kuasa Baru</span>
          </button>
        </div>

        {/* Form Kuasa Baru */}
        {showAddProxy && (
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-brand-primary">Form Pendaftaran Penerima Kuasa</h3>
            <form onSubmit={handleSaveProxy} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-content-main mb-1">Pilih Pemilik Unit</label>
                  <select
                    value={selectedInvId}
                    onChange={(e) => setSelectedInvId(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs"
                  >
                    {invitations.map(inv => (
                      <option key={inv.id} value={inv.id}>{inv.no_unit} - {inv.nama_pemilik}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-content-main mb-1">Nama Penerima Kuasa *</label>
                  <input
                    type="text"
                    required
                    value={namaKuasa}
                    onChange={(e) => setNamaKuasa(e.target.value)}
                    placeholder="Nama sesuai KTP"
                    className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-content-main mb-1">No. WhatsApp Kuasa</label>
                  <input
                    type="tel"
                    value={noHpKuasa}
                    onChange={(e) => setNoHpKuasa(e.target.value)}
                    placeholder="081234..."
                    className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-content-main mb-1">Upload Berkas Surat Kuasa (PDF/JPG) *</label>
                <div className="border border-surface-border rounded-lg p-3 bg-surface-card text-center text-xs text-content-muted">
                  <Upload className="w-4 h-4 mx-auto mb-1 text-brand-accent" />
                  <span>Surat kuasa tervalidasi otomatis dilampirkan</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary-hover">
                  Simpan Kuasa
                </button>
                <button type="button" onClick={() => setShowAddProxy(false)} className="px-4 py-2 border border-surface-border rounded-lg text-xs font-semibold text-content-muted">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabel Kuasa */}
        <div className="border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-bg border-b border-surface-border text-content-muted font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Pemberi Kuasa (Pemilik)</th>
                <th className="px-4 py-3">Penerima Kuasa</th>
                <th className="px-4 py-3">No. HP</th>
                <th className="px-4 py-3">Surat Kuasa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {proxyList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-content-muted">
                    Belum ada surat kuasa yang didaftarkan pada sidang ini.
                  </td>
                </tr>
              ) : (
                proxyList.map((inv) => (
                  <tr key={inv.id}>
                    <td className="px-4 py-3 font-bold text-brand-primary">{inv.no_unit}</td>
                    <td className="px-4 py-3 font-medium text-content-main">{inv.nama_pemilik}</td>
                    <td className="px-4 py-3 font-bold text-status-success">{inv.proxy?.namaKuasa}</td>
                    <td className="px-4 py-3 text-content-muted">{inv.proxy?.noHpKuasa || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="text-brand-accent font-semibold flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" />
                        Terverifikasi
                      </span>
                    </td>
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
