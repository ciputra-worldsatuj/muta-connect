# Panduan Setup Backend Google Apps Script & Deployment – MUTA Connect

Backend MUTA Connect dirancang berjalan 100% tanpa biaya (*Zero-Cost*) menggunakan **Google Apps Script Web App** dan **Google Spreadsheet** sebagai basis data (mengacu pada SRS Section 8, Section 13-18).

---

## 1. Persiapan Google Spreadsheet Otomatis (1-Click Generator)

Anda **TIDAK PERLU** membuat tabel dan kolom satu per satu secara manual. Sudah disediakan fungsi otomatis `setupDatabaseSheets()`:

1. Buka [Google Sheets baru](https://sheets.new) di browser Anda.
2. Beri judul Spreadsheet, misalnya: `MUTA Connect Database CW1J`.
3. Klik menu **Ekstensi > Apps Script** (*Extensions > Apps Script*).
4. Salin seluruh isi berkas `apps-script/Code.js` ke dalam editor Apps Script.
5. Klik ikon **Simpan** (Ctrl+S / Cmd+S).
6. Di dropdown pilihan fungsi di sebelah tombol "Debug", pilih fungsi **`setupDatabaseSheets`**, lalu klik **Run** (Jalankan).
7. Berikan otorisasi izin akses akun Google Anda jika diminta pertama kali.
8. **Selesai!** Seluruh **13 Sheet / Tab** akan otomatis dibuatkan header kolom tebal berwarna biru navy (#1E3A8A) dan langsung terisi:
   - 1 Tenant resmi: `PPPSRSKC CIPUTRA WORLD 1 JAKARTA`
   - 3 Akun uji coba: `admin`, `panitia`, `petugas` (password: `password123`)
   - 25 Data Anggota MUA lengkap dengan unit, penanggung jawab, bobot NPP (total 100%), email & WhatsApp
   - 1 Sidang MUA 2026 resmi (Sabtu, 25 Juli 2026, 09.00 WIB – selesai)
   - Agenda musyawarah & soal voting
   - 25 Undangan ber-QR Code dengan format 4 Digit Angka (1001 s/d 1025)

*(Catatan: Anda juga bisa me-refresh spreadsheet setelah kode disimpan, lalu klik menu **⚡ MUTA Connect > 🚀 Setup Database & Generate Data Dummy**).*

---

## 2. Penerapan Web App (Deployment Google Apps Script)

1. Di editor Apps Script, klik tombol biru **Deploy > New deployment** (*Terapkan > Penerapan baru*).
2. Klik ikon gerigi (Select type) > pilih **Web app**.
3. Atur konfigurasi:
   - **Description**: `MUTA Connect Production API`
   - **Execute as**: `Me (akun email Anda)`
   - **Who has access**: `Anyone` *(Wajib "Anyone" agar frontend dapat mengakses API tanpa login Google)*.
4. Klik tombol **Deploy**.
5. Salin **Web App URL** yang muncul (format: `https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec`).

---

## 3. Menghubungkan ke Frontend

MUTA Connect menyediakan 3 cara mudah menghubungkan Web App URL ke frontend:
1. **Lewat Aplikasi Langsung (Paling Mudah)**:
   - Login ke aplikasi sebagai **admin**
   - Buka menu **Pengaturan > Parameter Sistem**
   - Masukkan Web App URL di kolom **URL Web App Google Apps Script**
   - Klik **Simpan** lalu klik **Tes Ping** untuk memastikan status berwarna hijau terhubung!
2. **Lewat Berkas `.env` (Untuk Localhost)**:
   - Di folder `frontend/.env`, masukkan:
     ```env
     VITE_GAS_API_URL=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
     ```
3. **Lewat GitHub Repository Secret (Untuk GitHub Pages)**:
   - Buka repository Anda di GitHub: `Settings > Secrets and variables > Actions`
   - Klik **New repository secret**
   - Name: `VITE_GAS_API_URL`
   - Secret: Paste Web App URL Anda, lalu klik **Add secret**.
   - Setiap Anda push ke branch `main`, GitHub Actions otomatis membuild dan menyambungkannya ke Google Sheets!

---

## 4. Cara Update Deployment Apps Script (Wajib jika Mengubah Kode)

> [!IMPORTANT]
> Di Google Apps Script, jika Anda mengedit kode di editor tanpa membuat **Versi Baru**, URL Web App akan tetap menjalankan kode lama (sering menyebabkan pesan `Fungsi skrip tidak ditemukan: doGet` atau data tidak tersinkron).

Langkah update:
1. Di editor Apps Script, simpan kode (`Ctrl + S`).
2. Klik menu **Deploy > Manage deployments** (*Kelola penerapan*).
3. Klik ikon **Pensil (Edit)** pada deployment Web App yang aktif.
4. Di bagian **Version**, pilih **New version** (*Versi baru*).
5. Pastikan **Who has access: Anyone** (*Siapa saja*).
6. Klik tombol **Deploy**.

---

## 5. Mengganti Data Dummy dengan Data Asli

Setelah Web App terhubung ke Google Sheets:
- **Data Anggota**:
  - **Opsi A (Google Sheets)**: Buka tab sheet `members` di Google Spreadsheet Anda, hapus baris ke-2 s/d ke-26, lalu masukkan baris data pemilik unit asli Anda (pastikan header baris 1 tidak dihapus).
  - **Opsi B (Aplikasi)**: Buka menu **Anggota & Unit > Impor Data CSV**, unduh template CSV, isi data anggota asli Anda, lalu klik Impor.
- **Data Sidang**:
  - Buka menu **Daftar Sidang > Buat Sidang Baru** di aplikasi untuk membuat agenda musyawarah resmi baru.
- **Data Akun Pengguna**:
  - Buka menu **Pengaturan > Pengguna & Peran** untuk menambah akun Admin, Panitia, dan Petugas asli Anda.

---

## 6. Cara Publish / Push ke GitHub

Pastikan Anda berada di direktori root proyek:
```bash
# 1. Cek status berkas
git status

# 2. Tambahkan semua perubahan dan commit
git add .
git commit -m "feat: complete MUTA connect application & GAS database generator"

# 3. Push ke branch main di GitHub
git push origin main
```
