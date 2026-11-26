import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ApiService } from '../api/client';
import { SkeletonPage } from '../components/common/SkeletonPage';
import { 
  Search, 
  Upload, 
  Plus, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft,
  Download,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

/**
 * UF-02: Kelola Anggota dan Impor CSV (Revisi 3)
 * Field Wajib:
 * - Kode Unit *
 * - Bobot NPP (%) *
 * - Nama Anggota *
 * - Penanggung Jawab *
 * - WhatsApp *
 * - Email *
 * Aksi: Edit & Hapus
 */

export function DaftarAnggotaSkeleton() {
  const { currentUser, currentTenant } = useApp();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal Tambah / Edit Anggota
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    no_unit: '',
    npp: '',
    nama_pemilik: '',
    penanggung_jawab: '',
    no_hp: '',
    email: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [currentTenant?.id]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await ApiService.request('getMembers', { tenantId: currentTenant?.id || 't-cw1' });
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      no_unit: '',
      npp: '',
      nama_pemilik: '',
      penanggung_jawab: '',
      no_hp: '',
      email: ''
    });
    setFormError('');
    setFormSuccess(false);
    setShowModal(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      no_unit: member.no_unit || '',
      npp: String(member.npp || ''),
      nama_pemilik: member.nama_pemilik || '',
      penanggung_jawab: member.penanggung_jawab || member.nama_pemilik || '',
      no_hp: member.no_hp || '',
      email: member.email || ''
    });
    setFormError('');
    setFormSuccess(false);
    setShowModal(true);
  };

  const handleDeleteMember = async (member) => {
    if (!window.confirm(`Yakin ingin menghapus anggota ${member.nama_pemilik} (Unit ${member.no_unit})?`)) {
      return;
    }

    try {
      await ApiService.request('deleteMember', { id: member.id });
      loadMembers();
    } catch (err) {
      alert('Gagal hapus anggota: ' + err.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { no_unit, npp, nama_pemilik, penanggung_jawab, no_hp, email } = formData;

    if (!no_unit || !npp || !nama_pemilik || !penanggung_jawab || !no_hp || !email) {
      setFormError('Seluruh field bertanda bintang (*) wajib diisi.');
      return;
    }

    if (parseFloat(npp) <= 0 || isNaN(parseFloat(npp))) {
      setFormError('Bobot NPP harus berupa angka lebih besar dari 0.');
      return;
    }

    try {
      await ApiService.request('saveMember', {
        id: editingMember ? editingMember.id : null,
        tenantId: currentTenant?.id || 't-cw1',
        no_unit: no_unit.trim(),
        npp: parseFloat(npp),
        nama_pemilik: nama_pemilik.trim(),
        penanggung_jawab: penanggung_jawab.trim(),
        no_hp: no_hp.trim(),
        email: email.trim()
      });

      setFormSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        loadMembers();
      }, 700);
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data anggota.');
    }
  };

  const filtered = members.filter(m => 
    (m.no_unit || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.nama_pemilik || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.penanggung_jawab || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalNpp = filtered.reduce((acc, m) => acc + (parseFloat(m.npp) || 0), 0);
  const isAdmin = currentUser.role === 'admin';

  return (
    <SkeletonPage
      screenId="S-04"
      title="Daftar Anggota & Hak Suara NPP"
      subtitle={`Total ${members.length} unit terdaftar pada ${currentTenant?.name || 'PPPSRS'}`}
      roles={['admin', 'panitia', 'petugas']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-4 sm:p-6 shadow-sm space-y-4">
        {/* Baris Pencarian & Tindakan */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-content-muted absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode unit, nama, penanggung jawab..."
              className="w-full pl-9 pr-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm text-content-main focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isAdmin && (
              <>
                <a
                  href="#/anggota/impor"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-surface-border text-xs font-semibold text-content-main hover:bg-surface-bg transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Impor CSV</span>
                </a>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Anggota</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabel Anggota Lengkap Sesuai Revisi 3 */}
        <div className="border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-bg border-b border-surface-border text-content-muted font-bold uppercase tracking-wider">
                <th className="px-4 py-3">Kode Unit</th>
                <th className="px-4 py-3">Nama Anggota</th>
                <th className="px-4 py-3">Penanggung Jawab</th>
                <th className="px-4 py-3 text-right">Bobot NPP</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Email</th>
                {isAdmin && <th className="px-4 py-3 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-4 py-8 text-center text-content-muted">
                    Memuat data anggota...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-4 py-8 text-center text-content-muted">
                    Tidak ada anggota yang cocok dengan pencarian "{search}".
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-brand-primary">
                      <div>{m.no_unit}</div>
                      {(m.total_unit > 1 || (m.no_unit && m.no_unit.includes(','))) && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-brand-primary mt-0.5">
                          {m.total_unit || m.no_unit.split(',').length} Unit
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-content-main">
                      {m.nama_pemilik}
                    </td>
                    <td className="px-4 py-3 text-content-main font-semibold">
                      {m.penanggung_jawab || m.nama_pemilik}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-content-main tabular-nums">
                      {parseFloat(m.npp).toFixed(4)}%
                    </td>
                    <td className="px-4 py-3 font-mono text-content-muted">
                      {m.no_hp || '-'}
                    </td>
                    <td className="px-4 py-3 text-content-muted">
                      {m.email || '-'}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(m)}
                            className="p-1.5 rounded text-brand-primary hover:bg-blue-50 border border-surface-border transition-colors"
                            title="Edit Anggota"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(m)}
                            className="p-1.5 rounded text-status-danger hover:bg-red-50 border border-surface-border transition-colors"
                            title="Hapus Anggota"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="bg-surface-bg border-t border-surface-border font-bold text-content-main">
                  <td colSpan={3} className="px-4 py-3 text-right">
                    Total NPP Ditampilkan:
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-brand-primary tabular-nums">
                    {totalNpp.toFixed(4)}%
                  </td>
                  <td colSpan={isAdmin ? 3 : 2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Modal Form Tambah / Edit Anggota */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-surface-card rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-surface-border">
                <h3 className="font-bold text-base text-content-main">
                  {editingMember ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
                </h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-content-muted hover:text-content-main">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-status-danger text-status-danger rounded-xl text-xs">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-green-50 border border-status-success text-status-success rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Data anggota berhasil disimpan!</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-content-main mb-1">
                      Kode Unit * <span className="text-[10px] text-content-muted font-normal">(bisa &gt;1 unit pisah koma)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.no_unit}
                      onChange={(e) => setFormData({ ...formData, no_unit: e.target.value })}
                      placeholder="Contoh: TA-02.01, TA-02.02"
                      className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-content-main mb-1">Bobot NPP (%) *</label>
                    <input
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      required
                      value={formData.npp}
                      onChange={(e) => setFormData({ ...formData, npp: e.target.value })}
                      placeholder="Contoh: 1.2500"
                      className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs font-mono tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-content-main mb-1">Nama Anggota *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama_pemilik}
                    onChange={(e) => setFormData({ ...formData, nama_pemilik: e.target.value })}
                    placeholder="Nama Pemilik Unit / PT Pemilik"
                    className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-content-main mb-1">Penanggung Jawab *</label>
                  <input
                    type="text"
                    required
                    value={formData.penanggung_jawab}
                    onChange={(e) => setFormData({ ...formData, penanggung_jawab: e.target.value })}
                    placeholder="Nama PIC / Penanggung Jawab Unit"
                    className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-content-main mb-1">WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.no_hp}
                      onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-content-main mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@email.com"
                      className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-2 border-t border-surface-border">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary-hover shadow-sm"
                  >
                    {editingMember ? 'Simpan Perubahan Anggota' : 'Tambahkan Anggota'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 border border-surface-border rounded-lg text-xs font-semibold text-content-muted hover:bg-surface-bg"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SkeletonPage>
  );
}

// --- S-05: FORM ANGGOTA DAN UNIT (STANDALONE PAGE REDIRECT KE DAFTAR DENGAN MODAL) ---
export function FormAnggotaSkeleton() {
  const { currentTenant } = useApp();
  const [formData, setFormData] = useState({
    no_unit: '',
    npp: '',
    nama_pemilik: '',
    penanggung_jawab: '',
    no_hp: '',
    email: ''
  });
  const [status, setStatus] = useState({ error: '', success: false, loading: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { no_unit, npp, nama_pemilik, penanggung_jawab, no_hp, email } = formData;

    if (!no_unit || !npp || !nama_pemilik || !penanggung_jawab || !no_hp || !email) {
      setStatus({ error: 'Seluruh field bertanda bintang (*) wajib diisi.', success: false, loading: false });
      return;
    }

    if (parseFloat(npp) <= 0 || isNaN(parseFloat(npp))) {
      setStatus({ error: 'Bobot NPP harus berupa angka lebih besar dari 0.', success: false, loading: false });
      return;
    }

    setStatus({ error: '', success: false, loading: true });
    try {
      await ApiService.request('saveMember', {
        tenantId: currentTenant?.id || 't-cw1',
        no_unit: no_unit.trim(),
        npp: parseFloat(npp),
        nama_pemilik: nama_pemilik.trim(),
        penanggung_jawab: penanggung_jawab.trim(),
        no_hp: no_hp.trim(),
        email: email.trim()
      });
      setStatus({ error: '', success: true, loading: false });
      setTimeout(() => {
        window.location.hash = '#/anggota';
      }, 1000);
    } catch (err) {
      setStatus({ error: err.message, success: false, loading: false });
    }
  };

  return (
    <SkeletonPage
      screenId="S-05"
      title="Tambah Anggota & Unit Baru"
      subtitle="Input data pemilik, penanggung jawab, dan proporsi bobot hak suara NPP (Admin)"
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
            <span>Anggota berhasil disimpan! Mengalihkan ke daftar anggota...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-content-main mb-1">Kode Unit *</label>
              <input
                type="text"
                required
                value={formData.no_unit}
                onChange={(e) => setFormData({ ...formData, no_unit: e.target.value })}
                placeholder="Misal: A-101 atau PH-01"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-main mb-1">Bobot NPP (%) *</label>
              <input
                type="number"
                step="0.0001"
                min="0.0001"
                required
                value={formData.npp}
                onChange={(e) => setFormData({ ...formData, npp: e.target.value })}
                placeholder="Misal: 1.2543"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm font-mono tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-main mb-1">Nama Anggota *</label>
            <input
              type="text"
              required
              value={formData.nama_pemilik}
              onChange={(e) => setFormData({ ...formData, nama_pemilik: e.target.value })}
              placeholder="Nama Pemilik Unit Sesuai Sertifikat"
              className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-main mb-1">Penanggung Jawab *</label>
            <input
              type="text"
              required
              value={formData.penanggung_jawab}
              onChange={(e) => setFormData({ ...formData, penanggung_jawab: e.target.value })}
              placeholder="Nama PIC / Penanggung Jawab Unit"
              className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-content-main mb-1">WhatsApp *</label>
              <input
                type="tel"
                required
                value={formData.no_hp}
                onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                placeholder="Misal: 081234567890"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-main mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="nama@email.com"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3 border-t border-surface-border">
            <a href="#/anggota" className="px-4 py-2 border border-surface-border rounded-lg text-xs font-semibold text-content-muted hover:bg-surface-bg">
              Batal
            </a>
            <button
              type="submit"
              disabled={status.loading}
              className="px-5 py-2 bg-brand-primary text-white rounded-lg text-xs font-semibold hover:bg-brand-primary-hover shadow-sm transition-colors"
            >
              {status.loading ? 'Menyimpan...' : 'Simpan Data Anggota'}
            </button>
          </div>
        </form>
      </div>
    </SkeletonPage>
  );
}

// --- S-06: IMPOR CSV ---
export function ImporCSVSkeleton() {
  const { currentTenant } = useApp();
  const [parsedRows, setParsedRows] = useState([]);
  const [failedRows, setFailedRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importDone, setImportDone] = useState(false);

  // Template unduhan CSV resmi (Revisi 3)
  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "no_unit,nama_anggota,penanggung_jawab,nama_tenant,npp,email,no_hp\n" +
      "A-201,Budi Santoso,Budi Santoso,PPPSRSKC Ciputra World 1,1.2500,budi@example.com,081234567890\n" +
      "A-202,PT Megah Abadi,Dewi Lestari (Direktur),PPPSRSKC Ciputra World 1,1.1000,dewi@example.com,081234567891\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template_anggota_muta.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      parseCSVText(text);
    };
    reader.readAsText(file);
  };

  const parseCSVText = (text) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length <= 1) return;

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const valid = [];
    const invalid = [];

    lines.slice(1).forEach((line, index) => {
      const cols = line.split(',').map(c => c.trim());
      const row = {};
      headers.forEach((h, i) => {
        row[h] = cols[i] || '';
      });

      const npp = parseFloat(row.npp);
      if (!row.no_unit || !row.nama_anggota || isNaN(npp) || npp <= 0) {
        invalid.push({
          rowNum: index + 2,
          data: row,
          reason: !row.no_unit ? 'Kode unit kosong' : !row.nama_anggota ? 'Nama anggota kosong' : 'NPP harus angka > 0'
        });
      } else {
        valid.push(row);
      }
    });

    setParsedRows(valid);
    setFailedRows(invalid);
    setImportDone(false);
  };

  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);
    try {
      await ApiService.request('importMembersCSV', {
        tenantId: currentTenant?.id || 't-cw1',
        rows: parsedRows
      });
      setImportDone(true);
      setTimeout(() => {
        window.location.hash = '#/anggota';
      }, 1500);
    } catch (err) {
      alert('Gagal impor: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SkeletonPage
      screenId="S-06"
      title="Impor Data Anggota via CSV"
      subtitle="Validasi massal kode unit, nama, penanggung jawab, dan bobot NPP (Admin)"
      roles={['admin']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-6 shadow-sm space-y-6">
        {/* Panduan & Tombol Template */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-blue-50/60 border border-blue-200 rounded-xl">
          <div>
            <div className="text-xs font-bold text-brand-primary">Format Kolom Wajib CSV (Revisi 3):</div>
            <div className="text-[11px] text-content-muted mt-0.5 font-mono">
              no_unit, nama_anggota, penanggung_jawab, nama_tenant, npp, email, no_hp
            </div>
          </div>
          <button
            type="button"
            onClick={downloadTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-xs font-semibold text-brand-primary hover:bg-surface-bg shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Template CSV</span>
          </button>
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-surface-border rounded-xl p-8 text-center bg-surface-bg hover:bg-slate-100 transition-colors cursor-pointer relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <FileSpreadsheet className="w-10 h-10 text-brand-accent mx-auto mb-2" />
          <div className="text-sm font-bold text-content-main">
            Pilih Berkas CSV atau Seret ke Kotak Ini
          </div>
          <div className="text-xs text-content-muted mt-1">
            Maksimum 500 baris per file CSV
          </div>
        </div>

        {/* Pratinjau Baris Valid & Gagal */}
        {(parsedRows.length > 0 || failedRows.length > 0) && (
          <div className="space-y-4 pt-2">
            <div className="flex gap-4 text-xs font-bold">
              <span className="text-status-success flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {parsedRows.length} Baris Valid (Siap Diimpor)
              </span>
              {failedRows.length > 0 && (
                <span className="text-status-danger flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {failedRows.length} Baris Gagal (Ditolak)
                </span>
              )}
            </div>

            {/* Tabel Pratinjau Baris Valid */}
            {parsedRows.length > 0 && (
              <div className="border border-surface-border rounded-lg max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-bg sticky top-0 border-b border-surface-border">
                    <tr className="text-content-muted font-bold">
                      <th className="px-3 py-2">Kode Unit</th>
                      <th className="px-3 py-2">Nama Anggota</th>
                      <th className="px-3 py-2">Penanggung Jawab</th>
                      <th className="px-3 py-2 text-right">NPP (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {parsedRows.slice(0, 10).map((r, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 font-semibold text-brand-primary">{r.no_unit}</td>
                        <td className="px-3 py-2">{r.nama_anggota}</td>
                        <td className="px-3 py-2 font-medium">{r.penanggung_jawab || r.nama_anggota}</td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums">{r.npp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tombol Konfirmasi Impor */}
            {parsedRows.length > 0 && !importDone && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-lg bg-status-success text-white font-bold text-xs hover:bg-green-700 shadow-sm transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessing ? 'Mengimpor Data...' : `Konfirmasi Impor ${parsedRows.length} Data`}</span>
                </button>
              </div>
            )}

            {importDone && (
              <div className="p-4 bg-green-50 border border-green-200 text-status-success rounded-xl text-center text-xs font-bold">
                Berhasil mengimpor {parsedRows.length} data anggota! Mengalihkan ke daftar anggota...
              </div>
            )}
          </div>
        )}
      </div>
    </SkeletonPage>
  );
}
