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
    { id: 'u-1', tenantId: 't-cw1', username: 'admin', nama: 'Administrator PPPSRS', peran: 'admin', role: 'admin', password: 'password123', isTempPassword: false, status: 'aktif' },
    { id: 'u-2', tenantId: 't-cw1', username: 'panitia', nama: 'Siti Rahma (Panitia)', peran: 'panitia', role: 'panitia', password: 'password123', isTempPassword: false, status: 'aktif' },
    { id: 'u-3', tenantId: 't-cw1', username: 'petugas', nama: 'Eko Prasetyo (Petugas)', peran: 'petugas', role: 'petugas', password: 'password123', isTempPassword: false, status: 'aktif' }
  ],

  members: [
    { id: 'm-01', tenantId: 't-cw1', no_unit: 'TA-02.01, TA-02.02', total_unit: 2, nama_pemilik: 'PT Ciputra Adigraha', penanggung_jawab: 'CALVIN LUKMANTARA', npp: 0.0005, email: 'calvin.l@ciputra.com', no_hp: '081234567801' },
    { id: 'm-02', tenantId: 't-cw1', no_unit: 'TA-03.01', total_unit: 1, nama_pemilik: 'Hendra Wijaya', penanggung_jawab: 'Hendra Wijaya', npp: 4.1250, email: 'hendra.w@example.com', no_hp: '081234567802' },
    { id: 'm-03', tenantId: 't-cw1', no_unit: 'TA-03.02, TA-03.03', total_unit: 2, nama_pemilik: 'PT Graha Cipta Mandiri', penanggung_jawab: 'Ir. H. Gunawan', npp: 5.8420, email: 'gunawan@graha.com', no_hp: '081234567803' },
    { id: 'm-04', tenantId: 't-cw1', no_unit: 'TA-05.01', total_unit: 1, nama_pemilik: 'Dewi Lestari', penanggung_jawab: 'Dewi Lestari', npp: 3.8500, email: 'dewi.l@example.com', no_hp: '081234567804' },
    { id: 'm-05', tenantId: 't-cw1', no_unit: 'TA-05.02', total_unit: 1, nama_pemilik: 'Bambang Soediro', penanggung_jawab: 'Bambang Soediro', npp: 3.7500, email: 'bambang.s@example.com', no_hp: '081234567805' },
    { id: 'm-06', tenantId: 't-cw1', no_unit: 'TB-06.01, TB-06.02, TB-06.03', total_unit: 3, nama_pemilik: 'PT Nusantara Mega Investama', penanggung_jawab: 'Linda Tanuwidjaja', npp: 7.9500, email: 'linda.t@nusantara.com', no_hp: '081234567806' },
    { id: 'm-07', tenantId: 't-cw1', no_unit: 'TB-07.01', total_unit: 1, nama_pemilik: 'Rudi Hartono', penanggung_jawab: 'Rudi Hartono', npp: 3.6500, email: 'rudi.h@example.com', no_hp: '081234567807' },
    { id: 'm-08', tenantId: 't-cw1', no_unit: 'TB-07.02', total_unit: 1, nama_pemilik: 'Agus Setiawan', penanggung_jawab: 'Agus Setiawan', npp: 3.5500, email: 'agus.s@example.com', no_hp: '081234567808' },
    { id: 'm-09', tenantId: 't-cw1', no_unit: 'TB-08.01', total_unit: 1, nama_pemilik: 'Farida Hasan', penanggung_jawab: 'Farida Hasan', npp: 3.4500, email: 'farida.h@example.com', no_hp: '081234567809' },
    { id: 'm-10', tenantId: 't-cw1', no_unit: 'TB-08.02', total_unit: 1, nama_pemilik: 'Maya Anggraini', penanggung_jawab: 'Maya Anggraini', npp: 3.4000, email: 'maya.a@example.com', no_hp: '081234567810' },
    { id: 'm-11', tenantId: 't-cw1', no_unit: 'TB-09.01, TB-09.02', total_unit: 2, nama_pemilik: 'PT Surya Sentosa Abadi', penanggung_jawab: 'Budi Hartawan', npp: 6.2000, email: 'budi.h@suryasentosa.com', no_hp: '081234567811' },
    { id: 'm-12', tenantId: 't-cw1', no_unit: 'TB-10.01', total_unit: 1, nama_pemilik: 'Johan Kusuma', penanggung_jawab: 'Johan Kusuma', npp: 3.2500, email: 'johan.k@example.com', no_hp: '081234567812' },
    { id: 'm-13', tenantId: 't-cw1', no_unit: 'TB-10.02', total_unit: 1, nama_pemilik: 'Silvia Salim', penanggung_jawab: 'Silvia Salim', npp: 3.2000, email: 'silvia.s@example.com', no_hp: '081234567813' },
    { id: 'm-14', tenantId: 't-cw1', no_unit: 'TA-11.01', total_unit: 1, nama_pemilik: 'Dr. Tommy Pranata', penanggung_jawab: 'Dr. Tommy Pranata', npp: 3.3500, email: 'tommy.p@example.com', no_hp: '081234567814' },
    { id: 'm-15', tenantId: 't-cw1', no_unit: 'TA-11.02', total_unit: 1, nama_pemilik: 'Ratna Juwita', penanggung_jawab: 'Ratna Juwita', npp: 3.3000, email: 'ratna.j@example.com', no_hp: '081234567815' },
    { id: 'm-16', tenantId: 't-cw1', no_unit: 'TA-12.01, TA-12.02', total_unit: 2, nama_pemilik: 'PT Tri Daya Perkasa', penanggung_jawab: 'Denny Santoso', npp: 6.1000, email: 'denny.s@tridaya.com', no_hp: '081234567816' },
    { id: 'm-17', tenantId: 't-cw1', no_unit: 'TA-14.01', total_unit: 1, nama_pemilik: 'Andreas Wibowo', penanggung_jawab: 'Andreas Wibowo', npp: 3.1500, email: 'andreas.w@example.com', no_hp: '081234567817' },
    { id: 'm-18', tenantId: 't-cw1', no_unit: 'TA-14.02', total_unit: 1, nama_pemilik: 'Yuliana Susanti', penanggung_jawab: 'Yuliana Susanti', npp: 3.1000, email: 'yuliana.s@example.com', no_hp: '081234567818' },
    { id: 'm-19', tenantId: 't-cw1', no_unit: 'TB-15.01', total_unit: 1, nama_pemilik: 'Michael Chandra', penanggung_jawab: 'Michael Chandra', npp: 3.0500, email: 'michael.c@example.com', no_hp: '081234567819' },
    { id: 'm-20', tenantId: 't-cw1', no_unit: 'TB-15.02', total_unit: 1, nama_pemilik: 'Fenny Christine', penanggung_jawab: 'Fenny Christine', npp: 3.0000, email: 'fenny.c@example.com', no_hp: '081234567820' },
    { id: 'm-21', tenantId: 't-cw1', no_unit: 'PH-01', total_unit: 1, nama_pemilik: 'Keluarga Widjaja', penanggung_jawab: 'Hadi Widjaja', npp: 5.5000, email: 'hadi.w@example.com', no_hp: '081234567821' },
    { id: 'm-22', tenantId: 't-cw1', no_unit: 'PH-02', total_unit: 1, nama_pemilik: 'Ir. Eddy Pramono', penanggung_jawab: 'Ir. Eddy Pramono', npp: 5.2500, email: 'eddy.p@example.com', no_hp: '081234567822' },
    { id: 'm-23', tenantId: 't-cw1', no_unit: 'PH-03', total_unit: 1, nama_pemilik: 'PT Ciputra Hospitalia', penanggung_jawab: 'dr. Rina Suryani', npp: 4.8000, email: 'rina.s@ciputra.com', no_hp: '081234567823' },
    { id: 'm-24', tenantId: 't-cw1', no_unit: 'TA-16.01, TA-16.02', total_unit: 2, nama_pemilik: 'PT Mega Sentosa Propertindo', penanggung_jawab: 'Herman Tedja', npp: 5.7500, email: 'herman.t@megasentosa.com', no_hp: '081234567824' },
    { id: 'm-25', tenantId: 't-cw1', no_unit: 'TB-16.01', total_unit: 1, nama_pemilik: 'Grace Meliana', penanggung_jawab: 'Grace Meliana', npp: 2.9825, email: 'grace.m@example.com', no_hp: '081234567825' },
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
    { id: 'inv-01', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-01', uid_qr: '1001', status_qr: 'Terpakai' },
    { id: 'inv-02', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-02', uid_qr: '1002', status_qr: 'Aktif' },
    { id: 'inv-03', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-03', uid_qr: '1003', status_qr: 'Aktif' },
    { id: 'inv-04', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-04', uid_qr: '1004', status_qr: 'Aktif' },
    { id: 'inv-05', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-05', uid_qr: '1005', status_qr: 'Aktif' },
    { id: 'inv-06', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-06', uid_qr: '1006', status_qr: 'Aktif' },
    { id: 'inv-07', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-07', uid_qr: '1007', status_qr: 'Aktif' },
    { id: 'inv-08', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-08', uid_qr: '1008', status_qr: 'Aktif' },
    { id: 'inv-09', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-09', uid_qr: '1009', status_qr: 'Aktif' },
    { id: 'inv-10', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-10', uid_qr: '1010', status_qr: 'Aktif' },
    { id: 'inv-11', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-11', uid_qr: '1011', status_qr: 'Aktif' },
    { id: 'inv-12', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-12', uid_qr: '1012', status_qr: 'Aktif' },
    { id: 'inv-13', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-13', uid_qr: '1013', status_qr: 'Aktif' },
    { id: 'inv-14', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-14', uid_qr: '1014', status_qr: 'Aktif' },
    { id: 'inv-15', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-15', uid_qr: '1015', status_qr: 'Aktif' },
    { id: 'inv-16', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-16', uid_qr: '1016', status_qr: 'Aktif' },
    { id: 'inv-17', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-17', uid_qr: '1017', status_qr: 'Aktif' },
    { id: 'inv-18', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-18', uid_qr: '1018', status_qr: 'Aktif' },
    { id: 'inv-19', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-19', uid_qr: '1019', status_qr: 'Aktif' },
    { id: 'inv-20', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-20', uid_qr: '1020', status_qr: 'Aktif' },
    { id: 'inv-21', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-21', uid_qr: '1021', status_qr: 'Aktif' },
    { id: 'inv-22', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-22', uid_qr: '1022', status_qr: 'Aktif' },
    { id: 'inv-23', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-23', uid_qr: '1023', status_qr: 'Aktif' },
    { id: 'inv-24', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-24', uid_qr: '1024', status_qr: 'Aktif' },
    { id: 'inv-25', sessionId: 's-2026-muta', tenantId: 't-cw1', memberId: 'm-25', uid_qr: '1025', status_qr: 'Aktif' },
  ],

  proxies: [],
  attendances: [
    {
      id: 'att-init-01',
      sessionId: 's-2026-muta',
      memberId: 'm-01',
      tipeKehadiran: 'QR',
      labelWaktu: 'On-Time',
      status: 'HADIR',
      waktuCheckin: new Date().toISOString(),
      petugasId: 'petugas'
    }
  ],
  votes: [],
  voted_records: [],
  kicked_records: [],
  logs: [
    { id: 'log-init', tenant_id: 't-cw1', user_id: 'system', aksi: 'INISIALISASI_SISTEM', detail: 'Sistem MUTA Connect diinisialisasi.', created_at: new Date().toISOString() }
  ]
};
