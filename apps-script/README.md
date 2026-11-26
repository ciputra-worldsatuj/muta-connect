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
   - 25 Undangan ber-QR Code dengan format `CW1JXXXXX`

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

1. Di folder `frontend/`, buat file `.env` (atau salin dari `.env.example`).
2. Masukkan URL Web App ke dalam variabel:
   ```env
   VITE_GAS_API_URL=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
   ```
3. Jika menggunakan GitHub Pages, tambahkan variabel ini ke **GitHub Secrets**:
   `Settings > Secrets and variables > Actions > New repository secret` dengan nama `VITE_GAS_API_URL`.

---

## 4. Cara Publish / Push ke GitHub

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
