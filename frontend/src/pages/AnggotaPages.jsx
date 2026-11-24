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
  Download
} from 'lucide-react';

/**
 * UF-02: Kelola Anggota dan Impor CSV
 * Aturan Validasi:
 * - Kolom wajib CSV: no_unit, nama_anggota, nama_tenant, npp
 * - NPP angka > 0
 * - Multi-unit digabung berdasarkan pemilik
 * - Kerahasiaan data pribadi (email/HP) hanya untuk Admin (BR-13)
 */

export function DaftarAnggotaSkeleton() {
  const { currentUser, currentTenant } = useApp();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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

  const filtered = members.filter(m => 
    (m.no_unit || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.nama_pemilik || '').toLowerCase().includes(search.toLowerCase())
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
              placeholder="Cari nomor unit atau nama..."
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
                  <span>Impor CSV (S-06)</span>
                </a>
                <a
                  href="#/anggota/baru"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Anggota (S-05)</span>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Tabel Anggota */}
        <div className="border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-bg border-b border-surface-border text-content-muted font-bold uppercase tracking-wider">
                <th className="px-4 py-3">No. Unit</th>
                <th className="px-4 py-3">Nama Anggota</th>
                <th className="px-4 py-3 text-right">Bobot NPP</th>
                {isAdmin && <th className="px-4 py-3">Kontak Pribadi (Admin)</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3} className="px-4 py-8 text-center text-content-muted">
                    Memuat data anggota...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3} className="px-4 py-8 text-center text-content-muted">
                    Tidak ada anggota yang cocok dengan pencarian "{search}".
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-brand-primary">
                      {m.no_unit}
                    </td>
                    <td className="px-4 py-3 font-medium text-content-main">
                      {m.nama_pemilik}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-content-main tabular-nums">
                      {parseFloat(m.npp).toFixed(4)}%
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-content-muted">
                        <div>{m.no_hp || '-'}</div>
                        <div className="text-[11px] text-content-muted/80">{m.email || '-'}</div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="bg-surface-bg border-t border-surface-border font-bold text-content-main">
                  <td colSpan={2} className="px-4 py-3 text-right">
                    Total NPP Ditampilkan:
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-brand-primary tabular-nums">
                    {totalNpp.toFixed(4)}%
                  </td>
                  {isAdmin && <td />}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </SkeletonPage>
  );
}

export function FormAnggotaSkeleton() {
  const { currentTenant } = useApp();
  const [noUnit, setNoUnit] = useState('');
  const [namaPemilik, setNamaPemilik] = useState('');
  const [npp, setNpp] = useState('');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [status, setStatus] = useState({ error: '', success: false, loading: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noUnit || !namaPemilik || !npp || parseFloat(npp) <= 0) {
      setStatus({ error: 'Nomor unit, nama anggota, dan bobot NPP (>0) wajib diisi.', success: false, loading: false });
      return;
    }

    setStatus({ error: '', success: false, loading: true });
    try {
      await ApiService.request('saveMember', {
        tenantId: currentTenant?.id || 't-cw1',
        no_unit: noUnit,
        nama_pemilik: namaPemilik,
        npp: parseFloat(npp),
        email,
        no_hp: noHp
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
      subtitle="Input data pemilik dan proporsi bobot hak suara NPP (Admin)"
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
              <label className="block text-xs font-semibold text-content-main mb-1">Nomor Unit *</label>
              <input
                type="text"
                required
                value={noUnit}
                onChange={(e) => setNoUnit(e.target.value)}
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
                value={npp}
                onChange={(e) => setNpp(e.target.value)}
                placeholder="Misal: 1.2543"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm font-mono tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-main mb-1">Nama Lengkap Pemilik Sesuai Sertifikat *</label>
            <input
              type="text"
              required
              value={namaPemilik}
              onChange={(e) => setNamaPemilik(e.target.value)}
              placeholder="Misal: Hendra Wijaya"
              className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-content-main mb-1">Nomor WhatsApp</label>
              <input
                type="tel"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder="Misal: 081234567890"
                className="w-full px-3 py-2 bg-surface-bg border border-surface-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-main mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

export function ImporCSVSkeleton() {
  const { currentTenant } = useApp();
  const [parsedRows, setParsedRows] = useState([]);
  const [failedRows, setFailedRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importDone, setImportDone] = useState(false);

  // Template unduhan CSV resmi (Validation rules UF-02)
  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "no_unit,nama_anggota,nama_tenant,npp,email,no_hp\n" +
      "A-201,Budi Santoso,PPPSRSKC Ciputra World 1,1.2500,budi@example.com,081234567890\n" +
      "A-202,Dewi Lestari,PPPSRSKC Ciputra World 1,1.1000,dewi@example.com,081234567891\n";
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
          reason: !row.no_unit ? 'Nomor unit kosong' : !row.nama_anggota ? 'Nama anggota kosong' : 'NPP harus angka > 0'
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
      subtitle="Validasi massal nomor unit, nama, dan bobot NPP (Admin)"
      roles={['admin']}
    >
      <div className="bg-surface-card rounded-xl border border-surface-border p-6 shadow-sm space-y-6">
        {/* Panduan & Tombol Template */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-blue-50/60 border border-blue-200 rounded-xl">
          <div>
            <div className="text-xs font-bold text-brand-primary">Format Kolom Wajib CSV (UF-02):</div>
            <div className="text-[11px] text-content-muted mt-0.5 font-mono">
              no_unit, nama_anggota, nama_tenant, npp, email, no_hp
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

        {/* Pratinjau Baris Valid & Gagal (UF-02 Main Flow langkah 5) */}
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
                      <th className="px-3 py-2">No. Unit</th>
                      <th className="px-3 py-2">Nama Anggota</th>
                      <th className="px-3 py-2 text-right">NPP (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {parsedRows.slice(0, 10).map((r, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 font-semibold text-brand-primary">{r.no_unit}</td>
                        <td className="px-3 py-2">{r.nama_anggota}</td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums">{r.npp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Daftar Baris Gagal */}
            {failedRows.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-1">
                <div className="font-bold text-status-danger">Alasan Penolakan Baris:</div>
                {failedRows.slice(0, 5).map((f, i) => (
                  <div key={i} className="text-content-muted">
                    Baris {f.rowNum}: {f.reason} ({f.data.no_unit || 'Tanpa Unit'})
                  </div>
                ))}
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
