/**
 * Daftar Rute MUTA Connect berdasarkan Information Architecture (IA v1.0 Section 5 & 12)
 * Setiap rute memetakan ID Layar (S-01 s/d S-31), judul, layout, dan izin peran.
 */

export const ROUTE_LAYOUTS = {
  APP: 'app',           // Internal authenticated dengan Topbar, Sidebar & Mobile Nav
  AUTH: 'auth',         // Halaman login & ganti password
  PROJECTOR: 'projector', // Layar proyektor (dark mode, fullscreen, no nav)
  PUBLIC: 'public'      // Halaman publik pemilih HP (no menu, minimalis)
};

export const ROUTES_CONFIG = [
  // Auth
  { path: '/login', screenId: 'S-01', title: 'Login Pengguna', layout: ROUTE_LAYOUTS.AUTH, roles: ['*'] },
  { path: '/ganti-password', screenId: 'S-02', title: 'Ganti Password', layout: ROUTE_LAYOUTS.AUTH, roles: ['admin', 'panitia', 'petugas'] },
  
  // Beranda
  { path: '/beranda', screenId: 'S-03', title: 'Beranda', layout: ROUTE_LAYOUTS.APP, roles: ['admin', 'panitia', 'petugas'] },
  
  // Anggota
  { path: '/anggota', screenId: 'S-04', title: 'Daftar Anggota', layout: ROUTE_LAYOUTS.APP, roles: ['admin', 'panitia', 'petugas'] },
  { path: '/anggota/baru', screenId: 'S-05', title: 'Tambah Anggota & Unit', layout: ROUTE_LAYOUTS.APP, roles: ['admin'] },
  { path: '/anggota/impor', screenId: 'S-06', title: 'Impor Anggota CSV', layout: ROUTE_LAYOUTS.APP, roles: ['admin'] },
  
  // Sidang
  { path: '/sidang', screenId: 'S-07', title: 'Daftar Sidang', layout: ROUTE_LAYOUTS.APP, roles: ['admin', 'panitia'] },
  { path: '/sidang/baru', screenId: 'S-08', title: 'Buat Sidang Baru', layout: ROUTE_LAYOUTS.APP, roles: ['admin'] },
  { path: '/sidang/:id/agenda', screenId: 'S-09', title: 'Agenda & Soal Voting', layout: ROUTE_LAYOUTS.APP, roles: ['admin', 'panitia'] },
  
  // Undangan & Kuasa
  { path: '/sidang/:id/undangan', screenId: 'S-10', title: 'Undangan & QR Code', layout: ROUTE_LAYOUTS.APP, roles: ['admin'] },
  { path: '/sidang/:id/draft', screenId: 'S-11', title: 'Draft Pesan Email & WhatsApp', layout: ROUTE_LAYOUTS.APP, roles: ['admin'] },
  { path: '/sidang/:id/kuasa', screenId: 'S-12', title: 'Kelola Surat Kuasa', layout: ROUTE_LAYOUTS.APP, roles: ['admin'] },
  
  // Registrasi
  { path: '/registrasi/scan', screenId: 'S-13', title: 'Scan QR Check-in', layout: ROUTE_LAYOUTS.APP, roles: ['petugas'] },
  { path: '/registrasi/manual', screenId: 'S-14', title: 'Check-in Manual', layout: ROUTE_LAYOUTS.APP, roles: ['admin', 'petugas'] },
  
  // Ruang Panitia
  { path: '/panitia/sidang', screenId: 'S-15', title: 'Kendali Sidang (Mulai/Tutup)', layout: ROUTE_LAYOUTS.APP, roles: ['admin', 'panitia'] },
  { path: '/panitia/voting', screenId: 'S-16', title: 'Kendali Soal Voting', layout: ROUTE_LAYOUTS.APP, roles: ['admin', 'panitia'] },
  { path: '/panitia/peserta', screenId: 'S-17', title: 'Daftar Peserta & Kick', layout: ROUTE_LAYOUTS.APP, roles: ['admin', 'panitia'] },
  
  // Proyektor (Tab terpisah)
  { path: '/proyektor/kehadiran', screenId: 'S-18', title: 'Dashboard Proyektor Kehadiran', layout: ROUTE_LAYOUTS.PROJECTOR, roles: ['admin', 'panitia'] },
  { path: '/proyektor/voting', screenId: 'S-19', title: 'Dashboard Proyektor Voting', layout: ROUTE_LAYOUTS.PROJECTOR, roles: ['admin', 'panitia'] },
  
  // Voting Publik (HP Pemilih)
  { path: '/vote/:kodeSidang', screenId: 'S-20', title: 'Bilik Suara Pemilih', layout: ROUTE_LAYOUTS.PUBLIC, roles: ['*'] },
  
  // Laporan & Dokumen
  { path: '/laporan', screenId: 'S-25', title: 'Laporan Rekapitulasi Sidang', layout: ROUTE_LAYOUTS.APP, roles: ['admin', 'panitia'] },
  { path: '/laporan/berita-acara', screenId: 'S-26', title: 'Berita Acara Sidang', layout: ROUTE_LAYOUTS.APP, roles: ['admin', 'panitia'] },
  
  // Riwayat & Audit
  { path: '/riwayat', screenId: 'S-27', title: 'Riwayat Antar Sidang', layout: ROUTE_LAYOUTS.APP, roles: ['admin', 'panitia'] },
  { path: '/log', screenId: 'S-28', title: 'Log Aktivitas Audit', layout: ROUTE_LAYOUTS.APP, roles: ['admin', 'panitia'] },
  
  // Pengaturan
  { path: '/pengaturan/tenant', screenId: 'S-29', title: 'Pengaturan Tenant PPPSRS', layout: ROUTE_LAYOUTS.APP, roles: ['admin'] },
  { path: '/pengaturan/pengguna', screenId: 'S-30', title: 'Pengaturan Akun Pengguna', layout: ROUTE_LAYOUTS.APP, roles: ['admin'] },
  { path: '/pengaturan/parameter', screenId: 'S-31', title: 'Parameter Sidang & Kuorum', layout: ROUTE_LAYOUTS.APP, roles: ['admin'] },
];
