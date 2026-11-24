# Design System – MUTA Connect

**Versi 1.0 | Mengacu pada SRS, User Flow, dan IA MUTA Connect v1.0 | Bahasa Indonesia**

Konteks desain: aplikasi dipakai di **ruang sidang** pada tiga jenis layar sekaligus, yaitu **proyektor** (dibaca dari jauh), **laptop** (panitia dan admin), dan **HP** (pemilih dan petugas scan). Tekanan waktu tinggi, pengguna beragam usia, pencahayaan ruangan berubah-ubah.

## 1. Design Principles

| Prinsip | Arti dalam MUTA Connect |
| --- | --- |
| Jelas dari jauh | Angka kuorum dan hasil voting terbaca dari barisan paling belakang |
| Satu tugas per layar | Petugas dan pemilih tidak perlu berpikir, hanya melakukan satu aksi |
| Cepat dan tahan koneksi | Umpan balik instan, aman diulang, tidak ada suara ganda |
| Netral dan adil | Warna dan urutan pilihan tidak mengarahkan pilihan pemilih |
| Rahasia terjaga | Tidak ada elemen UI yang menampilkan pilihan per nama |
| Konsisten | Satu istilah, satu warna status, satu pola komponen di seluruh layar |
| Hemat | Ringan, tanpa aset besar, sesuai target biaya nol |

## 2. UX Principles

- **Status selalu terlihat:** kuorum, status sidang, dan sisa waktu soal selalu tampak.
- **Pencegahan kesalahan:** tombol berbahaya (Tutup Sidang, Kick, Batalkan check-in) meminta konfirmasi dan alasan bila wajib.
- **Umpan balik langsung:** scan berhasil atau gagal memberi respons visual dan getar/bunyi dalam 1 detik.
- **Pengenalan, bukan hafalan:** pemilih memilih nama dari daftar, bukan mengetik bebas.
- **Target sentuh besar:** minimal 48 px untuk HP, 56 px untuk tombol aksi utama petugas dan pemilih.
- **Ramah ketidaksengajaan:** suara dikirim dengan satu tombol Kirim yang jelas, pilihan dapat diubah sebelum dikirim.
- **Bahasa sehari-hari:** pesan singkat berbahasa Indonesia, menyebut penyebab dan langkah berikutnya.

## 3. Accessibility (WCAG)

Target: **WCAG 2.2 level AA**.

| Area | Aturan |
| --- | --- |
| Kontras teks | Teks normal minimal 4.5:1, teks besar dan komponen UI minimal 3:1. Proyektor memakai target 7:1 |
| Warna bukan satu-satunya penanda | Status HADIR, TIDAK HADIR, BELUM HADIR selalu disertai teks dan ikon |
| Fokus | Indikator fokus terlihat jelas (cincin 3 px) pada semua kontrol |
| Keyboard | Seluruh fungsi laptop dapat dioperasikan dengan keyboard |
| Label | Setiap input memiliki label tertulis, bukan hanya placeholder |
| Ukuran teks | Dapat diperbesar hingga 200% tanpa kehilangan fungsi |
| Gerak | Animasi kuorum dan titik live menghormati `prefers-reduced-motion` |
| Pembaca layar | Notifikasi memakai `aria-live`, tombol ikon memiliki `aria-label` |
| Waktu | Hitung mundur terlihat dan juga diumumkan teks ("sisa 10 detik") |
| Bahasa | Atribut `lang="id"` pada dokumen |

Kontras sebenarnya diverifikasi saat implementasi dengan alat pemeriksa kontras.

## 4. Color System

Tema: **navy tepercaya** dengan aksen teal, cocok untuk konteks formal PPPSRS. Dua mode: **Terang** (aplikasi internal dan HP) dan **Gelap** (layar proyektor).

### 4.1 Warna Merek dan Netral

| Token | Terang | Gelap (proyektor) | Pemakaian |
| --- | --- | --- | --- |
| primary | #1E3A8A | #93B4FF | Tombol utama, tautan, judul |
| primary-hover | #172E6E | #B6CCFF | Hover/tekan |
| accent | #0D9488 | #2DD4BF | Aksen, indikator, grafik |
| bg | #F8FAFC | #0B1220 | Latar halaman |
| surface | #FFFFFF | #131C2E | Kartu, panel |
| border | #CBD5E1 | #2A3650 | Garis |
| text | #0F172A | #F1F5F9 | Teks utama |
| text-muted | #475569 | #A8B3C7 | Teks sekunder |

### 4.2 Warna Semantik dan Status

| Makna | Token | Terang | Gelap | Pemakaian |
| --- | --- | --- | --- | --- |
| Sukses / HADIR | success | #15803D | #4ADE80 | Check-in berhasil, HADIR, kuorum tercapai, titik live |
| Peringatan / BELUM HADIR | warning | #B45309 | #FBBF24 | BELUM HADIR, kuorum belum tercapai, hitung mundur hampir habis |
| Bahaya / TIDAK HADIR | danger | #B91C1C | #F87171 | TIDAK HADIR, QR terpakai, kick, aksi menghapus |
| Info | info | #1D4ED8 | #60A5FA | Informasi, label On time |
| Late | late | #7C3AED | #C4B5FD | Label Late |

### 4.3 Warna Grafik Voting (netral, tidak mengarahkan)

Urutan pilihan memakai palet berurutan yang **tidak** memberi makna baik atau buruk, kecuali pada soal setuju/tidak/abstain yang memakai hijau, merah, dan abu-abu dengan label teks.

| Seri | Terang | Gelap |
| --- | --- | --- |
| Pilihan 1 | #1E3A8A | #93B4FF |
| Pilihan 2 | #0D9488 | #2DD4BF |
| Pilihan 3 | #B45309 | #FBBF24 |
| Pilihan 4 | #7C3AED | #C4B5FD |
| Pilihan 5 | #BE185D | #F9A8D4 |
| Abstain | #64748B | #94A3B8 |

## 5. Typography

| Peran | Keluarga | Fallback |
| --- | --- | --- |
| Teks dan UI | Inter | system-ui, -apple-system, Segoe UI, Roboto, sans-serif |
| Angka dashboard | Inter dengan `font-variant-numeric: tabular-nums` | monospace |

Skala (rem, basis 16 px):

| Token | Aplikasi (laptop/HP) | Proyektor | Bobot | Pemakaian |
| --- | --- | --- | --- | --- |
| display | 2.25 | 6.0 | 700 | Angka kuorum, hitung mundur |
| h1 | 1.75 | 3.0 | 700 | Judul halaman, judul sidang |
| h2 | 1.375 | 2.0 | 600 | Judul bagian, soal |
| h3 | 1.125 | 1.5 | 600 | Judul kartu |
| body | 1.0 | 1.25 | 400 | Teks utama |
| small | 0.875 | 1.0 | 400 | Keterangan, label |
| caption | 0.75 | 0.875 | 500 | Metadata (tidak dipakai untuk info penting) |

Tinggi baris: 1.5 untuk teks, 1.2 untuk judul dan angka. Teks pada proyektor tidak lebih kecil dari 1.0 rem (setara sekitar 24 px pada layar penuh).

## 6. Spacing

Basis **4 px**.

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| space-1 | 4 px | Jarak ikon dan teks |
| space-2 | 8 px | Jarak dalam komponen kecil |
| space-3 | 12 px | Padding input |
| space-4 | 16 px | Padding kartu HP, jarak antar elemen |
| space-6 | 24 px | Padding kartu desktop |
| space-8 | 32 px | Jarak antar bagian |
| space-12 | 48 px | Jarak antar blok besar, target sentuh |
| space-16 | 64 px | Margin halaman proyektor |

## 7. Grid System

| Breakpoint | Lebar | Kolom | Gutter | Margin |
| --- | --- | --- | --- | --- |
| HP | < 640 px | 4 | 16 px | 16 px |
| Tablet | 640 sampai 1023 px | 8 | 24 px | 24 px |
| Laptop | 1024 sampai 1535 px | 12 | 24 px | 32 px |
| Proyektor/layar besar | >= 1536 px | 12 | 32 px | 64 px |

Kartu pemilik di dashboard memakai grid otomatis: 1 kolom (HP), 2 (tablet), 3 sampai 4 (laptop), 4 sampai 6 (proyektor), lebar minimum kartu 260 px.

## 8. Layout System

| Layout | Struktur | Dipakai pada |
| --- | --- | --- |
| Layout Aplikasi | Bilah atas, menu samping (desktop) atau menu bawah (HP), area konten | Seluruh layar internal |
| Layout Fokus | Satu kolom di tengah, lebar maksimum 480 px, tanpa menu | Login, Scan QR, Voting pemilih |
| Layout Proyektor | Layar penuh tanpa menu: header (jam, live, judul), baris angka utama, area konten (kartu atau hasil) | Dashboard Kehadiran dan Voting |
| Layout Kendali | Dua panel: daftar di kiri, detail dan tombol aksi di kanan | Kendali Voting, Daftar Peserta |

**Dashboard Kehadiran (proyektor), urutan dari atas:**

1. Baris header: titik hijau berkedip dan teks LIVE, jam dan tanggal WIB, judul "Musyawarah Umum Tahunan Anggota" dan nama PPPSRS.
2. Baris angka: Total peserta hadir (mis. 6/20 orang), persen NPP hadir, persen NPP tidak hadir, persen kuorum dengan status, total unit hadir (mis. 203/810 unit).
3. Area kartu pemilik dengan gulir otomatis bila banyak.

## 9. Iconography

- Set ikon: **Lucide** (garis, 24 px, tebal 2 px), dimuat sebagai SVG inline atau sprite lokal.
- Ikon selalu menyertai label pada status penting dan tidak berdiri sendiri.
- Pemetaan: HADIR = centang lingkaran, TIDAK HADIR = silang lingkaran, BELUM HADIR = jam, Late = jam dengan tanda seru, QR = qr-code, kamera = camera, kuasa = file-signature, voting = vote, kick = user-x, kunci = lock, ekspor = download.
- Ukuran: 16 px (inline), 20 px (tombol), 24 px (menu), 32 sampai 48 px (proyektor dan status besar).

## 10. Data Visualization

| Elemen | Aturan |
| --- | --- |
| Angka kuorum | Angka besar (display) dengan batang progres dan garis penanda ambang kuorum |
| Persen NPP | Tampil 4 desimal pada laporan, 2 desimal pada dashboard, nilai asli disimpan penuh |
| Hasil voting | Batang horizontal dengan label pilihan, persen NPP, dan jumlah pemilih. Urutan sesuai urutan pilihan, bukan urutan perolehan |
| Hasil setuju/tidak/abstain | Tiga batang dengan warna semantik dan label teks |
| Kuorum tercapai | Batang progres melewati ambang, animasi singkat dan badge "Kuorum tercapai" |
| Progres memilih | Batang "sudah memilih dari hadir" tanpa menampilkan siapa yang sudah memilih |
| Aturan umum | Tanpa 3D, tanpa pie dengan banyak irisan, sumbu dan label selalu tampil, tidak mengandalkan warna saja |
| Hasil | Hanya tampil setelah soal ditutup, sebelumnya tampilkan batang progres memilih saja |

## 11. Design Tokens

Token dipakai sebagai CSS variable pada `:root`. Mode gelap diaktifkan dengan atribut `data-theme="proyektor"` (otomatis pada rute `#/proyektor/*`).

```css
:root {
  /* Warna */
  --color-primary: #1E3A8A;
  --color-primary-hover: #172E6E;
  --color-accent: #0D9488;
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-border: #CBD5E1;
  --color-text: #0F172A;
  --color-text-muted: #475569;
  --color-success: #15803D;
  --color-warning: #B45309;
  --color-danger: #B91C1C;
  --color-info: #1D4ED8;
  --color-late: #7C3AED;

  /* Tipografi */
  --font-sans: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --text-display: 2.25rem;
  --text-h1: 1.75rem;
  --text-h2: 1.375rem;
  --text-h3: 1.125rem;
  --text-body: 1rem;
  --text-small: 0.875rem;

  /* Spasi, bentuk, bayangan */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px;
  --shadow-card: 0 1px 3px rgba(15, 23, 42, 0.12);
  --tap-min: 48px;
  --tap-primary: 56px;

  /* Gerak */
  --dur-fast: 120ms;
  --dur-base: 200ms;
  --dur-celebrate: 1200ms;
}
[data-theme="proyektor"] {
  --color-primary: #93B4FF;
  --color-accent: #2DD4BF;
  --color-bg: #0B1220;
  --color-surface: #131C2E;
  --color-border: #2A3650;
  --color-text: #F1F5F9;
  --color-text-muted: #A8B3C7;
  --color-success: #4ADE80;
  --color-warning: #FBBF24;
  --color-danger: #F87171;
  --color-info: #60A5FA;
  --color-late: #C4B5FD;
  --text-display: 6rem;
  --text-h1: 3rem;
  --text-h2: 2rem;
  --text-h3: 1.5rem;
  --text-body: 1.25rem;
  --text-small: 1rem;
}
```

## 12. Component Library

| Komponen | Varian dan aturan | Dipakai pada |
| --- | --- | --- |
| Button | Primary, Secondary, Ghost, Danger. Ukuran standar 48 px, aksi utama 56 px. Keadaan: default, hover, fokus, nonaktif, loading | Seluruh layar |
| Input teks, pencarian | Label di atas, bantuan di bawah, pesan error merah dengan ikon | Form, pencarian peserta |
| Select dan Combobox | Pencarian dalam daftar | Pilih Nama pemilih, pilih tenant dan sidang |
| Radio dan Checkbox | Target sentuh 48 px, pilih banyak menampilkan sisa pilihan "2 dari 3 dipilih" | Soal voting |
| Kartu Pilihan Voting | Besar, satu per baris, label jelas, keadaan terpilih bergaris tebal dan centang | Layar voting HP |
| Kartu Pemilik (dashboard) | Unit, status, label On time/Late, nama tenant, nama pemilik/kuasa, NPP, jumlah unit. Pada kuasa: "Penerima (kuasa dari Pemberi)" | Dashboard Kehadiran |
| Status Badge | HADIR hijau + centang, TIDAK HADIR merah + silang, BELUM HADIR kuning + jam, Late ungu, On time biru | Kartu, tabel |
| Stat Card | Angka besar, label, perubahan | Baris angka dashboard |
| Progress Bar Kuorum | Batang dengan garis ambang dan label persen | Dashboard, kendali |
| Live Indicator | Titik hijau berkedip dan teks LIVE | Header proyektor |
| Countdown | Angka besar, lingkaran atau batang menyusut, merah pada 10 detik terakhir | Soal voting, dashboard voting |
| Tabel Data | Header tetap, pencarian, filter, penomoran halaman, kolom tersortir | Anggota, peserta, log |
| Modal Konfirmasi | Judul aksi, penjelasan dampak, kolom alasan bila wajib, tombol Batal dan Konfirmasi | Kick, Tutup Sidang, ubah rekap |
| Toast dan Alert | Sukses, info, peringatan, error. `aria-live` | Notifikasi |
| Scanner Panel | Pratinjau kamera, bingkai pemindai, kartu hasil di bawah | Scan QR |
| File Upload | Zona unggah, pembatasan PDF/JPG/JPEG/PNG, nama file dan status | Surat kuasa, materi |
| Stepper Impor CSV | Unggah, Pratinjau, Konfirmasi, Hasil | Impor anggota |
| Tabs | Tab lokal dalam modul | Anggota, Pengaturan |
| Breadcrumb | Sesuai strategi IA | Layar internal dalam |
| Empty State, Skeleton | Lihat bagian 16 dan 18 | Seluruh layar |
| Email Preview | Pratinjau draft, tombol Salin ke clipboard | Draft undangan |

## 13. Responsive Rules

| Aspek | HP (< 640 px) | Tablet | Laptop | Proyektor (>= 1536 px) |
| --- | --- | --- | --- | --- |
| Navigasi | Menu bawah | Menu samping ringkas | Menu samping | Tanpa menu |
| Tabel | Berubah menjadi daftar kartu | Tabel dengan gulir horizontal | Tabel penuh | Tidak dipakai |
| Dashboard | Satu kolom | 2 kolom | 3 sampai 4 kolom | Angka besar dan 4 sampai 6 kolom kartu |
| Tombol aksi | Lebar penuh | Lebar otomatis | Lebar otomatis | Besar |
| Voting | Satu pilihan per baris, tombol Kirim menempel di bawah | Sama | Tidak dipakai | Hasil layar penuh |

- Pendekatan **mobile-first**.
- Orientasi lanskap pada HP tetap didukung pada layar Scan.
- Halaman Scan dan Voting tidak boleh memerlukan gulir horizontal.
- Proyektor memakai rasio 16:9 dan 4:3 tanpa elemen terpotong, area aman 5% di tepi.

## 14. Interaction Rules

| Interaksi | Aturan |
| --- | --- |
| Scan berhasil | Kartu hijau, getar singkat, bunyi opsional, kembali siap scan setelah 2 detik |
| Scan gagal atau QR terpakai | Kartu merah dengan penyebab dan jam pemakaian, getar dua kali, tetap pada layar sampai ditutup Petugas |
| Kirim suara | Tombol berubah "Mengirim..." dan nonaktif, lalu layar konfirmasi "Suara Anda tercatat". Tidak ada tombol ubah setelah terkirim |
| Pilih banyak | Pilihan melebihi batas dinonaktifkan dengan keterangan "Maksimal N pilihan" |
| Hitung mundur | Merah pada 10 detik terakhir, bunyi opsional di proyektor, otomatis menutup soal |
| Aksi berisiko | Selalu melalui modal konfirmasi, kolom alasan wajib untuk check-in manual, batal check-in, batal kuasa, ubah rekap |
| Animasi kuorum | Durasi sekitar 1,2 detik, satu kali saat melewati ambang, diikuti badge tetap. Dimatikan pada mode kurangi gerak |
| Refresh dashboard | Setiap 5 detik tanpa muat ulang halaman penuh, perubahan nilai disorot singkat |
| Offline | Banner "Koneksi terputus, mencoba lagi", data terakhir tetap tampil, aksi tulis ditahan dan diberi tahu |
| Idempotensi | Kirim ulang suara aman, server menolak suara ganda |

## 15. Validation Rules

| Kasus | Aturan | Pesan |
| --- | --- | --- |
| Login | Username dan password wajib | "Username atau password salah." (tanpa menyebut mana yang salah) |
| Password baru | Minimal 8 karakter | "Password minimal 8 karakter." |
| NPP | Angka lebih dari 0 | "NPP harus berupa angka lebih dari 0." |
| Nomor unit | Unik per tenant | "Unit A-101 sudah terdaftar." |
| CSV | Kolom wajib lengkap, tampilkan baris yang gagal | "Baris 12: NPP bukan angka." |
| File surat kuasa | PDF, JPG, JPEG, PNG | "Format file tidak didukung. Gunakan PDF, JPG, atau PNG." |
| Alasan wajib | Tidak boleh kosong | "Alasan wajib diisi." |
| Durasi soal | Minimal 10 detik | "Durasi minimal 10 detik." |
| Maks pilihan | 1 sampai jumlah pilihan | "Maksimal pilihan tidak boleh melebihi jumlah pilihan." |
| Nama pemilih | Harus dari daftar peserta HADIR | "Nama Anda belum check-in. Hubungi petugas registrasi." |
| Suara ganda | Satu suara per soal | "Anda sudah memberikan suara pada soal ini." |
| Buka soal | Kuorum tercapai | "Kuorum belum tercapai, soal tidak dapat dibuka." |

Validasi inline saat kehilangan fokus, ringkasan kesalahan di atas form saat kirim, dan **validasi diulang di server**.

## 16. Empty States

| Layar | Judul | Teks bantu | Aksi |
| --- | --- | --- | --- |
| Daftar Anggota | Belum ada anggota | Tambahkan anggota atau impor CSV | Impor CSV, Tambah Anggota |
| Daftar Sidang | Belum ada sidang | Buat MUTA atau RUTA pertama | Buat Sidang |
| Agenda dan Soal | Belum ada agenda | Tambahkan agenda lalu soal voting | Tambah Agenda |
| Dashboard Kehadiran | Belum ada peserta hadir | Check-in akan tampil otomatis | - |
| Dashboard Voting | Menunggu soal dibuka | Soal akan muncul saat Panitia membuka voting | - |
| Voting Pemilih | Belum ada soal aktif | Tunggu panitia membuka soal | - |
| Riwayat | Belum ada riwayat sidang | Riwayat muncul setelah sidang pertama ditutup | - |
| Log | Belum ada aktivitas | - | - |
| Hasil pencarian | Tidak ditemukan | Coba kata kunci lain atau periksa ejaan | Hapus pencarian |

## 17. Error States

| Jenis | Tampilan | Contoh pesan | Tindakan |
| --- | --- | --- | --- |
| Validasi | Pesan merah dengan ikon di bawah input | "NPP harus berupa angka." | Perbaiki input |
| QR terpakai | Kartu merah penuh pada layar scan | "QR sudah dipakai pada 09:12." | Check-in manual bila sah |
| QR tidak valid | Kartu merah | "QR tidak dikenal atau sudah dicabut." | Hubungi Admin |
| Kamera tidak diizinkan | Panel bantuan | "Izinkan akses kamera pada pengaturan browser." | Buka panduan, pakai check-in manual |
| Tidak ada izin | Halaman penuh | "Anda tidak memiliki akses ke halaman ini." | Kembali ke Beranda |
| Koneksi/server | Banner kuning, data terakhir tetap tampil | "Tidak dapat terhubung. Mencoba lagi..." | Coba lagi otomatis dan tombol manual |
| Kuota/server sibuk | Banner | "Server sedang sibuk, ulangi sebentar lagi." | Ulangi, bila berulang aktifkan rencana cadangan manual |
| Dikeluarkan panitia | Halaman penuh pada HP | "Anda dikeluarkan panitia. Hubungi panitia bila ini keliru." | Hubungi panitia |
| Waktu habis | Layar voting | "Waktu habis. Soal ditutup." | Menunggu soal berikutnya |
| Tidak ditemukan (404) | Halaman penuh | "Halaman tidak ditemukan." | Kembali ke Beranda |

Pesan error menyebut penyebab dan langkah berikutnya, tanpa istilah teknis, dan tidak menyalahkan pengguna.

## 18. Loading States

| Situasi | Pola |
| --- | --- |
| Muat halaman pertama | Skeleton pada kartu dan tabel |
| Muat data dashboard | Pertahankan data lama, tampilkan indikator kecil "memperbarui" |
| Kirim form dan suara | Tombol berstatus "Mengirim..." dan nonaktif |
| Impor CSV dan ekspor laporan | Progres dengan keterangan langkah |
| Pembuatan QR | Placeholder kotak QR lalu gambar |
| Scan | Pratinjau kamera dengan teks "Mengaktifkan kamera..." |
| Lambat lebih dari 5 detik | Pesan "Masih memproses, mohon tunggu" |

Indikator memakai `aria-busy` dan teks, bukan hanya animasi.

## 19. Notification Patterns

| Pola | Pemakaian | Perilaku |
| --- | --- | --- |
| Toast | Aksi berhasil (simpan, ekspor) | Muncul 4 detik, dapat ditutup |
| Alert inline | Peringatan pada halaman (kuorum belum tercapai) | Tetap sampai kondisi berubah |
| Kartu hasil scan | Check-in berhasil atau gagal | Tampil sampai scan berikutnya atau 2 detik untuk sukses |
| Panel peringatan Admin dan Panitia | QR terpakai | Daftar tetap dengan waktu, nama, dan penanda sudah dibaca |
| Layar penuh HP pemilih | Voting dimulai, voting ditutup, dikeluarkan | Menggantikan layar saat ini dengan pesan jelas, getar singkat |
| Animasi proyektor | Kuorum tercapai | Sekali, 1,2 detik, lalu badge tetap |
| Banner sistem | Koneksi terputus | Di atas halaman, hilang saat pulih |

Ketentuan: urutan prioritas error > peringatan > sukses > info. Maksimal tiga toast berurutan. Bunyi bersifat opsional dan dapat dimatikan.

## 20. Dashboard Standards

| Standar | Aturan |
| --- | --- |
| Tab proyektor | Layar penuh tanpa menu, tema gelap otomatis, kursor disembunyikan setelah tidak aktif |
| Header | Titik hijau berkedip dan teks LIVE, jam dan tanggal WIB, judul "Musyawarah Umum Tahunan Anggota", nama PPPSRS |
| Angka utama | Total peserta hadir/terdaftar, persen NPP hadir, persen NPP tidak hadir, persen kuorum dengan status, total unit hadir/total unit |
| Kartu pemilik | Unit, status, label On time/Late, nama tenant, nama pemilik atau penerima kuasa (dan pemberi kuasa), NPP, jumlah unit |
| Urutan kartu | HADIR terbaru di atas, lalu BELUM HADIR, lalu TIDAK HADIR. Filter dan pencarian tersedia di tampilan Panitia, bukan di proyektor |
| Refresh | Setiap 5 detik, perubahan nilai disorot singkat, jam berjalan per detik |
| Dashboard Voting | Terpisah. Soal, hitung mundur, progres sudah memilih dari hadir. Hasil agregat hanya setelah soal ditutup |
| Privasi | Tidak menampilkan email, HP, atau pilihan per nama. Tidak ada daftar siapa yang sudah memilih |
| Keterbacaan | Teks dan angka minimal ukuran proyektor pada bagian 5, kontras tinggi, tanpa animasi berlebihan |
| Ketahanan | Bila server gagal, data terakhir tetap tampil dengan penanda "terakhir diperbarui HH:MM:SS" |
| Panel kendali | Tombol Mulai/Tutup Sidang, Buka/Tutup soal, Kick hanya di tampilan Panitia, bukan di proyektor |

## 21. Rekomendasi Framework CSS

### 21.1 Kebutuhan yang Menentukan

| Kebutuhan dari requirement | Dampak pada pilihan framework |
| --- | --- |
| Hosting statis di GitHub Pages, biaya nol | Perlu framework tanpa server dan tanpa biaya |
| Go-live minggu ini | Perlu cepat dibangun dan mudah dikuasai |
| Dua tema (terang dan proyektor) dengan skala tipografi besar | Perlu dukungan design token dan variabel CSS yang fleksibel |
| Dashboard dan kartu khusus, bukan form standar | Perlu kendali tampilan penuh, bukan komponen siap pakai yang kaku |
| 100 pemilih memuat halaman serentak di HP | Perlu CSS kecil dan cepat dimuat |
| Tim kecil, kode sederhana (HTML dan JavaScript biasa dengan Apps Script) | Perlu framework tanpa ketergantungan JavaScript berat |

### 21.2 Perbandingan

| Kriteria (bobot) | Tailwind CSS | Bootstrap | Material Design (MUI atau Material Web) |
| --- | --- | --- | --- |
| Cocok dengan dashboard khusus dan kartu (tinggi) | Sangat baik | Cukup | Cukup |
| Dukungan token dan dua tema (tinggi) | Sangat baik (variabel CSS dan konfigurasi) | Baik (variabel CSS) | Baik tetapi terikat gaya Material |
| Kecepatan memuat di HP (tinggi) | Sangat baik jika CSS dikompilasi, hanya kelas yang dipakai | Baik, CSS dan JS lebih berat | Lebih berat, sering membutuhkan React dan proses build |
| Kemudahan di GitHub Pages tanpa framework JS (tinggi) | Baik (CLI Tailwind menghasilkan satu file CSS) | Sangat baik (cukup tautkan berkas) | Kurang cocok, MUI membutuhkan React |
| Kecepatan membangun komponen jadi (sedang) | Cukup, komponen dibuat sendiri dari kelas | Sangat baik, komponen siap pakai | Baik |
| Fleksibilitas identitas visual (sedang) | Sangat baik | Cukup, tampil seperti Bootstrap | Terbatas, tampil seperti Material |
| Aksesibilitas bawaan (sedang) | Perlu disiapkan sendiri | Baik | Sangat baik |
| Kurva belajar (rendah) | Sedang | Rendah | Sedang sampai tinggi |

### 21.3 Rekomendasi

**Rekomendasi utama: Tailwind CSS**, dipadukan dengan design token pada bagian 11 dan ikon Lucide.

Alasan:

1. Layar kuncinya (dashboard proyektor, kartu pemilik, hasil voting, layar voting ala Kahoot) **bersifat khusus**, sehingga lebih mudah dibangun dari utilitas dibanding menyesuaikan komponen siap pakai.
2. Dua tema dan dua skala tipografi (aplikasi dan proyektor) cocok dengan variabel CSS dan konfigurasi Tailwind.
3. CSS hasil kompilasi **kecil**, penting saat 100 HP memuat halaman bersamaan di Wi-Fi ruang sidang.
4. Tidak membutuhkan JavaScript framework, sehingga cocok dengan frontend sederhana di GitHub Pages dan Apps Script sebagai API.
5. Gratis dan tidak membutuhkan server.

Catatan penerapan:

- Karena tidak boleh bergantung pada pustaka eksternal saat sidang, hasil build CSS **disimpan sebagai satu berkas statis di repositori**, bukan memakai CDN pengembangan.
- Aksesibilitas (fokus, `aria`, kontras) dibuat sendiri mengikuti bagian 3.
- Untuk jalur cepat go-live minggu ini, build dapat dijalankan sekali dengan CLI Tailwind lalu berkas CSS dikomit.

**Alternatif cadangan: Bootstrap 5**, bila pengembang ingin komponen jadi (modal, tab, tabel) agar lebih cepat dan tidak keberatan tampilan lebih generik. Dapat dipadukan dengan token pada bagian 11 untuk dua tema.

**Tidak direkomendasikan: Material Design (MUI)**, karena memerlukan React dan proses build, lebih berat untuk 100 HP, dan gayanya sulit diselaraskan dengan tampilan proyektor khusus.
