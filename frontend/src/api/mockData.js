/**
 * Seed Data Simulasi Awal MUTA Connect
 * Mengacu pada SRS (total unit 133 per tenant, total NPP 100)
 */

export const INITIAL_SEED = {
  tenants: [
    { id: 't-cw1', name: 'PPPSRSKC Ciputra World 1', unitCount: 133, totalNpp: 100.0 },
    { id: 't-cw2', name: 'PPPSRS Puncak Bukit Golf', unitCount: 95, totalNpp: 100.0 }
  ],

  users: [
    { id: 'u-1', tenantId: 't-cw1', username: 'admin', nama: 'Budi Santoso (Admin)', peran: 'admin', isTempPassword: false, status: 'aktif' },
    { id: 'u-2', tenantId: 't-cw1', username: 'panitia', nama: 'Siti Rahma (Panitia)', peran: 'panitia', isTempPassword: false, status: 'aktif' },
    { id: 'u-3', tenantId: 't-cw1', username: 'petugas', nama: 'Eko Prasetyo (Petugas)', peran: 'petugas', isTempPassword: false, status: 'aktif' }
  ],

  members: [
    { id: 'm-01', tenantId: 't-cw1', no_unit: 'A-101', nama_pemilik: 'Hendra Wijaya', npp: 1.2543, email: 'hendra.w@example.com', no_hp: '081234567891' },
    { id: 'm-02', tenantId: 't-cw1', no_unit: 'A-102', nama_pemilik: 'Dewi Lestari', npp: 1.1205, email: 'dewi.l@example.com', no_hp: '081234567892' },
    { id: 'm-03', tenantId: 't-cw1', no_unit: 'A-103', nama_pemilik: 'Bambang Soediro', npp: 0.9854, email: 'bambang.s@example.com', no_hp: '081234567893' },
    { id: 'm-04', tenantId: 't-cw1', no_unit: 'B-201', nama_pemilik: 'Linda Tanuwidjaja', npp: 2.4500, email: 'linda.t@example.com', no_hp: '081234567894' },
    { id: 'm-05', tenantId: 't-cw1', no_unit: 'B-202', nama_pemilik: 'Rudi Hartono', npp: 1.5432, email: 'rudi.h@example.com', no_hp: '081234567895' },
    { id: 'm-06', tenantId: 't-cw1', no_unit: 'C-301', nama_pemilik: 'Agus Setiawan', npp: 0.8921, email: 'agus.s@example.com', no_hp: '081234567896' },
    { id: 'm-07', tenantId: 't-cw1', no_unit: 'C-302', nama_pemilik: 'Farida Hasan', npp: 1.3412, email: 'farida.h@example.com', no_hp: '081234567897' },
    { id: 'm-08', tenantId: 't-cw1', no_unit: 'PH-01', nama_pemilik: 'PT Graha Investama (Iwan)', npp: 5.6700, email: 'investama@example.com', no_hp: '081234567898' },
    { id: 'm-09', tenantId: 't-cw1', no_unit: 'PH-02', nama_pemilik: 'Ir. H. Gunawan', npp: 4.8900, email: 'gunawan@example.com', no_hp: '081234567899' },
    { id: 'm-10', tenantId: 't-cw1', no_unit: 'D-401', nama_pemilik: 'Maya Anggraini', npp: 1.0500, email: 'maya.a@example.com', no_hp: '081234567800' },
  ],

  sessions: [
    {
      id: 's-2026-muta',
      tenantId: 't-cw1',
      tipe: 'MUTA',
      judul: 'MUTA Tahun Buku 2026',
      tanggal: '2026-11-28',
      lokasi: 'Ballroom Lt. 5 Ciputra World Mall',
      status: 'Draft', // 'Draft' | 'Berjalan' | 'Ditutup'
      ambang_kuorum: 50.0,
      kode_publik: 'CW2026',
      waktu_mulai: '',
      waktu_tutup: ''
    }
  ],

  agendas: [
    {
      id: 'ag-1',
      sessionId: 's-2026-muta',
      urutan: 1,
      judul: 'Laporan Pertanggungjawaban Pengurus & Pengawas 2025',
      deskripsi: 'Pemaparan dan penerimaan LPJ pengurus tahun buku berjalan.'
    },
    {
      id: 'ag-2',
      sessionId: 's-2026-muta',
      urutan: 2,
      judul: 'Persetujuan Anggaran Biaya Pengelolaan (IPL) 2027',
      deskripsi: 'Penetapan penyesuaian tarif sinking fund dan service charge.'
    },
    {
      id: 'ag-3',
      sessionId: 's-2026-muta',
      urutan: 3,
      judul: 'Pemilihan Ketua Pengurus PPPSRS Periode 2026-2029',
      deskripsi: 'Pemungutan suara kandidat ketua pengurus baru.'
    }
  ],

  questions: [
    {
      id: 'q-1',
      agendaId: 'ag-1',
      sessionId: 's-2026-muta',
      tipeSoal: 'setuju_tidak_abstain',
      pertanyaan: 'Apakah LPJ Pengurus & Pengawas Tahun Buku 2025 dapat disahkan dan diterima?',
      pilihan: ['Setuju', 'Tidak Setuju', 'Abstain'],
      maksPilihan: 1,
      durasiDetik: 60,
      status: 'Draft' // 'Draft' | 'Dibuka' | 'Ditutup'
    },
    {
      id: 'q-2',
      agendaId: 'ag-2',
      sessionId: 's-2026-muta',
      tipeSoal: 'pilih_satu',
      pertanyaan: 'Persetujuan opsi penyesuaian Service Charge 2027:',
      pilihan: ['Opsi A: Kenaikan 5% (Fokus Efisiensi)', 'Opsi B: Kenaikan 8% (Peremajaan Lift Utama)', 'Abstain'],
      maksPilihan: 1,
      durasiDetik: 90,
      status: 'Draft'
    },
    {
      id: 'q-3',
      agendaId: 'ag-3',
      sessionId: 's-2026-muta',
      tipeSoal: 'pilih_satu',
      pertanyaan: 'Pilih Calon Ketua Pengurus PPPSRS Periode 2026-2029:',
      pilihan: ['Kandidat 1: Ir. H. Gunawan', 'Kandidat 2: Bambang Soediro', 'Kandidat 3: Linda Tanuwidjaja'],
      maksPilihan: 1,
      durasiDetik: 120,
      status: 'Draft'
    }
  ],

  invitations: [
    { id: 'inv-01', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-01', uid_qr: 'MUTA-QR-HENDRA', status_qr: 'Aktif' },
    { id: 'inv-02', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-02', uid_qr: 'MUTA-QR-DEWI', status_qr: 'Aktif' },
    { id: 'inv-03', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-03', uid_qr: 'MUTA-QR-BAMBANG', status_qr: 'Aktif' },
    { id: 'inv-04', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-04', uid_qr: 'MUTA-QR-LINDA', status_qr: 'Aktif' },
    { id: 'inv-05', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-05', uid_qr: 'MUTA-QR-RUDI', status_qr: 'Aktif' },
    { id: 'inv-06', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-06', uid_qr: 'MUTA-QR-AGUS', status_qr: 'Aktif' },
    { id: 'inv-07', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-07', uid_qr: 'MUTA-QR-FARIDA', status_qr: 'Aktif' },
    { id: 'inv-08', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-08', uid_qr: 'MUTA-QR-GRAHA', status_qr: 'Aktif' },
    { id: 'inv-09', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-09', uid_qr: 'MUTA-QR-GUNAWAN', status_qr: 'Aktif' },
    { id: 'inv-10', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-10', uid_qr: 'MUTA-QR-MAYA', status_qr: 'Aktif' },
  ],

  proxies: [],
  attendances: [],
  votes: [],
  voted_records: [],
  kicked_records: [],
  logs: [
    { id: 'log-init', tenant_id: 't-cw1', user_id: 'system', aksi: 'INISIALISASI_SISTEM', detail: 'Sistem MUTA Connect diinisialisasi.', created_at: new Date().toISOString() }
  ]
};
