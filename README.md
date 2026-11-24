# MUTA Connect

Sistem Informasi Musyawarah Umum Tahunan Anggota (MUTA) dan Rapat Umum Tahunan Anggota Luar Biasa (RUTA) untuk Perhimpunan Pemilik dan Penghuni Satuan Rumah Susun (PPPSRS).

Proyek ini dibangun menggunakan metode **Vibe Coding** dengan kepatuhan penuh terhadap 4 dokumen **Source of Truth (SOT)**:
1. `sofware-requirement-spesification.md` (SRS IEEE 29148)
2. `user-flow.md` (14 Alur Diagram Mermaid)
3. `design-system.md` (Design Tokens, WCAG 2.2 AA, Mobile & Projector Theme)
4. `information-architecture.md` (Sitemap, 31 Layar S-01 s/d S-31, Hash Routing)

---

## 🌟 Arsitektur Zero-Cost (Biaya Nol)

Aplikasi dirancang berjalan 100% tanpa biaya langganan server (OBJ-06, NFR-07):
* **Web Frontend**: Single Page Application (Vite + React + Tailwind CSS) di-hosting secara gratis di **GitHub Pages** menggunakan **Hash Routing** (`#/...`).
* **Backend API**: Serverless Web App di **Google Apps Script (GAS)** dengan penguncian `LockService` (NFR-03).
* **Basis Data**: Multi-tenant database di **Google Spreadsheet**.
* **Penyimpanan Dokumen**: Surat kuasa dan bukti fisik di **Google Drive**.

---

## 🚀 Panduan Memulai Cepat (Local Development)

Aplikasi memiliki built-in **Simulation Engine (LocalStorage)** sehingga Anda dapat langsung menjalankan dan menguji seluruh 14 alur secara lokal maupun demo tanpa konfigurasi awal server:

```powershell
# 1. Masuk ke direktori frontend
cd frontend

# 2. Instal dependensi (jika belum)
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Buka peramban di `http://localhost:3000`:
* **Akun Uji Coba**:
  * **Admin**: username `admin` | password `password123`
  * **Panitia**: username `panitia` | password `password123`
  * **Petugas Registrasi**: username `petugas` | password `password123`
* **Layar Proyektor**: Buka `#/proyektor/kehadiran` atau klik tombol **Proyektor** di bilah atas.
* **Bilik Suara HP Pemilih**: Buka `#/vote/CW2026` di browser smartphone atau tab terpisah.

---

## 📊 14 Alur Fungsional yang Tersedia (UF-01 s/d UF-14)

1. **UF-01 (Autentikasi & Akun)**: Login validasi hash, role check, dan proteksi wajib ganti password sementara.
2. **UF-02 (Kelola Anggota & Impor CSV)**: Tabel anggota berbobot NPP, privasi kontak pribadi khusus Admin (BR-13), form anggota baru, dan parser CSV dengan pratinjau validasi baris.
3. **UF-03 (Sidang, Agenda & Soal Voting)**: Pembuatan sidang MUTA/RUTA, ambang batas kuorum (default 50%), agenda berurutan, dan pembuatan soal (Setuju/Tidak/Abstain, Single Choice, Multiple Choice).
4. **UF-04 (Undangan & QR Code)**: Pembuatan UID QR Code acak satu kali pakai tanpa data pribadi (BR-05) dan template teks siap salin untuk WhatsApp / Email.
5. **UF-05 (Kelola Kuasa)**: Pendaftaran penerima kuasa peserta musyawarah dan lampiran surat kuasa (1 undangan = 1 kuasa).
6. **UF-06 (Scan QR Meja Registrasi)**: Pemindaian kamera langsung (`html5-qrcode`) & input manual UID, pencegahan scan ganda, label otomatis *On time* / *Late*, serta umpan balik visual dan audio instan.
7. **UF-07 (Check-in Manual & Batal)**: Pencarian peserta berdasarkan nama/unit dan pembatalan status check-in dengan alasan wajib yang dicatat ke log audit.
8. **UF-08 (Kendali Sidang & Kuorum)**: Tombol *Mulai Sidang* (kunci on-time), tombol *Catat TIDAK HADIR*, tombol *Tutup Sidang* (kunci rekap permanen), dan kalkulasi kuorum real-time.
9. **UF-09 (Kendali Soal Panitia)**: Buka/tutup sesi pemungutan suara. Pembukaan soal divalidasi harus mencapai kuorum $> 50\%$ (BR-08).
10. **UF-10 (Bilik Suara Pemilih HP)**: Alur pemilih di smartphone (`#/vote/:kodeSidang`), memilih nama hadir, melihat hitung mundur soal, memilih dengan target sentuh $\ge 56\text{ px}$, konfirmasi *Suara Tercatat*, serta kerahasiaan suara terjamin (R-08, BR-09).
11. **UF-11 (Manajemen Peserta & Kick)**: Penonaktifan hak suara peserta bermasalah (*Kick*) dengan alasan wajib, dan tombol reaktivasi.
12. **UF-12 (Laporan & Berita Acara)**: Ekspor CSV kehadiran, kuorum, dan hasil suara (RPT-01 s/d RPT-03) serta dokumen formal Berita Acara terisi otomatis siap cetak/PDF.
13. **UF-13 (Ubah Rekap Terkunci)**: Mekanisme otorisasi perubahan data rekap yang terkunci khusus Admin dengan alasan wajib.
14. **UF-14 (Riwayat Antar Sidang & Audit)**: Analisis komparasi statistik antar sidang dan pencatatan jejak audit (FR-LOG).

---

## 🌐 Panduan Deployment ke GitHub Pages

Proyek ini telah dilengkapi dengan pipeline GitHub Actions otomatis di [.github/workflows/deploy.yml](.github/workflows/deploy.yml):

1. Buat repositori baru di GitHub (misal: `muta`).
2. Push repositori lokal ke GitHub:
   ```powershell
   git init
   git add .
   git commit -m "feat: complete MUTA Connect functional build (Phase 0 - 3)"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/<REPO>.git
   git push -u origin main
   ```
3. Di repositori GitHub Anda, buka **Settings > Pages**:
   * Pada bagian **Build and deployment > Source**, pilih **GitHub Actions**.
4. GitHub Actions akan otomatis mem-build dan merilis aplikasi ke `https://<USERNAME>.github.io/<REPO>/`.

---

## 🔗 Menghubungkan Backend Google Apps Script (Opsional)

Jika ingin menghubungkan langsung ke Google Sheets:
1. Ikuti petunjuk lengkap di [apps-script/README.md](apps-script/README.md).
2. Salin isi [apps-script/Code.js](apps-script/Code.js) ke proyek Apps Script di Google Spreadsheet Anda.
3. Terapkan sebagai Web App (*Execute as: Me*, *Who has access: Anyone*).
4. Masukkan URL Web App ke file `.env` di folder `frontend/` atau GitHub Repository Secret `VITE_GAS_API_URL`.
