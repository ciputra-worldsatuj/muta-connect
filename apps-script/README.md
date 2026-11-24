# Panduan Setup Backend Google Apps Script – MUTA Connect

Backend MUTA Connect dirancang berjalan 100% tanpa biaya (*Zero-Cost*) menggunakan **Google Apps Script Web App** dan **Google Spreadsheet** sebagai basis data multi-tenant (mengacu pada SRS Section 8, Section 13-18).

---

## 1. Persiapan Google Spreadsheet (Database)

1. Buka [Google Sheets](https://sheets.new) di akun Google Anda.
2. Beri nama Spreadsheet, misalnya: `MUTA Connect Database`.
3. Buat tab-tab utama sesuai schema data (SRS Section 17):
   - `tenants`
   - `users`
   - `members`
   - `units`
   - `sessions`
   - `agendas`
   - `questions`
   - `invitations`
   - `proxies`
   - `attendances`
   - `votes`
   - `voted_records`
   - `logs`

---

## 2. Pemasangan Kode Apps Script

1. Di Spreadsheet tersebut, klik menu **Extensions > Apps Script** (Ekstensi > Apps Script).
2. Salin isi file `apps-script/Code.js` ke dalam editor Apps Script.
3. Pastikan `appsscript.json` memiliki zona waktu `Asia/Jakarta` dan runtime `V8`.
4. Simpan proyek dengan nama `MUTA Connect API`.

---

## 3. Penerapan Web App (Deployment)

1. Di editor Apps Script, klik tombol biru **Deploy > New deployment** (Terapkan > Penerapan baru).
2. Pilih tipe: **Web app**.
3. Konfigurasi:
   - **Description**: `MUTA Connect Production API`
   - **Execute as**: `Me (akun Google Anda)`
   - **Who has access**: `Anyone` (Siapa saja)
4. Klik **Deploy** dan berikan izin otorisasi akses Spreadsheet & Drive bila diminta.
5. Salin **Web App URL** yang dihasilkan (format: `https://script.google.com/macros/s/<ID>/exec`).

---

## 4. Hubungkan ke Frontend

1. Di folder `frontend/`, buat file `.env` berdasarkan `.env.example`.
2. Masukkan URL Web App ke dalam variabel `VITE_GAS_API_URL`:
   ```env
   VITE_GAS_API_URL=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
   ```
3. Jika menggunakan GitHub Pages, tambahkan variabel ini ke **GitHub Repository Secrets**:
   `Settings > Secrets and variables > Actions > New repository secret` dengan nama `VITE_GAS_API_URL`.
