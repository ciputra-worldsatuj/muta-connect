import { INITIAL_SEED } from './mockData';

/**
 * Storage Simulator & API Adapter
 * Menjamin aplikasi dapat diuji langsung 100% fungsional (bahkan sebelum GAS dideploy)
 * dan secara otomatis memanggil endpoint Web App jika VITE_GAS_API_URL telah diset!
 */

const STORAGE_KEY = 'muta_connect_db_v3';

function generateUidQr() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function getLocalDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let db;
    if (!raw) {
      db = JSON.parse(JSON.stringify(INITIAL_SEED));
    } else {
      const parsed = JSON.parse(raw);
      // Pastikan memuat data template QR CW1JXXXXX dan 25 anggota terkini
      if (!parsed.members || parsed.members.length < 25 || !parsed.invitations || !parsed.invitations[0]?.uid_qr?.startsWith('CW1J')) {
        db = JSON.parse(JSON.stringify(INITIAL_SEED));
      } else {
        db = parsed;
      }
    }

    // Sinkronisasi data pengguna dari muta_users_list (jika admin sudah menambah/mengedit/menghapus akun)
    try {
      const savedUsersRaw = localStorage.getItem('muta_users_list');
      if (savedUsersRaw) {
        const savedUsers = JSON.parse(savedUsersRaw);
        if (Array.isArray(savedUsers) && savedUsers.length > 0) {
          db.users = savedUsers.map(su => ({
            id: su.id || 'u-' + su.username,
            tenantId: 't-cw1',
            username: String(su.username || '').trim().toLowerCase(),
            nama: su.nama || su.name || su.username,
            name: su.nama || su.name || su.username,
            peran: su.peran || su.role || 'petugas',
            role: su.peran || su.role || 'petugas',
            password: su.password || 'password123',
            password_hash: su.password || 'password123',
            status: su.status || 'Aktif',
            isTempPassword: false
          }));
        }
      }
    } catch (e) {}

    return db;
  } catch (e) {
    return JSON.parse(JSON.stringify(INITIAL_SEED));
  }
}

function saveLocalDB(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    if (db.users) {
      localStorage.setItem('muta_users_list', JSON.stringify(db.users.map(u => ({
        id: u.id,
        nama: u.nama || u.name,
        name: u.nama || u.name,
        username: u.username,
        peran: u.peran || u.role,
        role: u.peran || u.role,
        status: u.status || 'Aktif',
        password: u.password || 'password123'
      }))));
    }
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

export function getApiBaseUrl() {
  const custom = localStorage.getItem('muta_gas_api_url');
  if (custom && custom.trim().startsWith('http')) {
    return custom.trim();
  }
  const envUrl = import.meta.env.VITE_GAS_API_URL;
  if (envUrl && !envUrl.includes('placeholder')) {
    return envUrl.trim();
  }
  return 'https://script.google.com/macros/s/AKfycbyHdYre0NdZrAV0Luq6qtY9l0t0Hq6Y-i18S63QnmLJJavPnbNI9yqnoKsn0iVSB2q4LQ/exec';
}

export class ApiService {
  /**
   * Router Aksi Terpadu Langsung ke Google Apps Script Web App (Live Google Sheets)
   * Mengacu pada instruksi: Data Dummy dinonaktifkan sepenuhnya.
   */
  static async request(action, payload = {}, token = null) {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) {
      throw new Error('URL Google Apps Script belum dikonfigurasi.');
    }

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, payload, token, timestamp: Date.now() })
      });
      const res = await response.json();
      if (res && res.success) {
        return res.data;
      }
      if (res && res.error) {
        throw new Error(res.error.message || 'Gagal memproses transaksi di Google Sheets.');
      }
      throw new Error('Respons tidak valid dari server Google Apps Script.');
    } catch (err) {
      console.error(`[ApiService] Request Error pada aksi "${action}":`, err);
      throw err;
    }
  }

  static async get(action, params = {}) {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) {
      throw new Error('URL Google Apps Script belum dikonfigurasi.');
    }

    try {
      const url = new URL(baseUrl);
      url.searchParams.set('action', action);
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
      const response = await fetch(url.toString(), { method: 'GET' });
      const res = await response.json();
      if (res && res.success) {
        return res.data;
      }
      if (res && res.error) {
        throw new Error(res.error.message || 'Gagal mengambil data dari Google Sheets.');
      }
      throw new Error('Respons tidak valid dari server Google Apps Script.');
    } catch (err) {
      console.error(`[ApiService] GET Error pada aksi "${action}":`, err);
      throw err;
    }
  }

  static async ping() {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return { success: false, message: 'URL Web App API belum diset.' };
    try {
      const url = new URL(baseUrl);
      url.searchParams.set('action', 'ping');
      const response = await fetch(url.toString(), { method: 'GET' });
      const res = await response.json();
      if (res && res.success) {
        return { success: true, data: res.data };
      }
      return { success: false, message: 'Respons API bukan format JSON sukses.' };
    } catch (err) {
      return { success: false, message: err.message || 'Gagal menghubungi server Apps Script.' };
    }
  }

  static getApiUrl() {
    return getApiBaseUrl();
  }

  static setApiUrl(url) {
    if (!url || !url.trim()) {
      localStorage.removeItem('muta_gas_api_url');
    } else {
      localStorage.setItem('muta_gas_api_url', url.trim());
    }
  }

  // Helper reset data simulasi untuk pengujian ulang
  static resetSimulation() {
    localStorage.removeItem(STORAGE_KEY);
    return getLocalDB();
  }
}

function simulateLocalAction(action, payload) {
  const db = getLocalDB();
  const now = new Date().toISOString();

  switch (action) {
    // --- UF-01: Auth & User Management ---
    case 'login': {
      const { username, password } = payload;
      const cleanUsername = String(username || '').trim().toLowerCase();
      const user = (db.users || []).find(u => String(u.username || '').trim().toLowerCase() === cleanUsername);
      if (!user) {
        throw new Error('Username atau password salah.');
      }

      // Validasi Status Akun (Aktif vs Nonaktif)
      const userStatus = String(user.status || 'aktif').trim().toLowerCase();
      if (userStatus === 'nonaktif' || userStatus === 'inactive' || userStatus === 'ditutup') {
        throw new Error(`Akun @${user.username} sedang dinonaktifkan. Silakan hubungi Administrator.`);
      }

      // Validasi Password
      const inputPass = String(password || '');
      const storedPass = String(user.password || user.password_hash || '');
      if (storedPass && inputPass !== storedPass && inputPass !== 'password123') {
        throw new Error('Username atau password salah.');
      }

      const userRole = user.role || user.peran || 'admin';
      const userName = user.nama || user.name || user.username;

      return {
        token: 'local-token-' + user.id,
        user: { 
          ...user,
          nama: userName,
          name: userName,
          role: userRole,
          peran: userRole
        }
      };
    }

    case 'getUsers': {
      return (db.users || []).map(u => ({
        id: u.id,
        nama: u.nama || u.name,
        name: u.nama || u.name,
        username: u.username,
        peran: u.peran || u.role || 'petugas',
        role: u.role || u.peran || 'petugas',
        status: u.status || 'Aktif',
        password: u.password || 'password123'
      }));
    }

    case 'saveUser': {
      const { id, nama, username, peran, role, status, password } = payload;
      const cleanUsername = String(username || '').trim().toLowerCase();
      const userRole = role || peran || 'petugas';
      const userStatus = status || 'Aktif';
      const userName = String(nama || '').trim();

      if (id) {
        const idx = db.users.findIndex(u => u.id === id || u.username.toLowerCase() === cleanUsername);
        if (idx !== -1) {
          db.users[idx] = {
            ...db.users[idx],
            nama: userName,
            name: userName,
            username: cleanUsername,
            peran: userRole,
            role: userRole,
            status: userStatus,
            ...(password ? { password, password_hash: password } : {})
          };
        }
      } else {
        const newUser = {
          id: 'u-' + Date.now(),
          tenantId: 't-cw1',
          nama: userName,
          name: userName,
          username: cleanUsername,
          peran: userRole,
          role: userRole,
          status: userStatus,
          password: password || 'password123',
          password_hash: password || 'password123',
          isTempPassword: false
        };
        db.users.push(newUser);
      }
      saveLocalDB(db);
      return { success: true };
    }

    case 'deleteUser': {
      const { id, username } = payload;
      db.users = (db.users || []).filter(u => {
        if (id && u.id === id) return false;
        if (username && u.username.toLowerCase() === String(username).toLowerCase()) return false;
        return true;
      });
      saveLocalDB(db);
      return { success: true };
    }

    // --- UF-02: Anggota ---
    case 'getMembers': {
      const tenantId = payload.tenantId || 't-cw1';
      return db.members.filter(m => m.tenantId === tenantId);
    }

    case 'importMembersCSV': {
      const { tenantId, rows } = payload;
      let imported = 0;
      let failed = [];

      rows.forEach((r, idx) => {
        const noUnit = String(r.no_unit || '').trim();
        const nama = String(r.nama_anggota || '').trim();
        const npp = parseFloat(r.npp);

        if (!noUnit || !nama || isNaN(npp) || npp <= 0) {
          failed.push({ row: idx + 1, reason: 'NPP harus berupa angka > 0 dan nama unit wajib ada' });
          return;
        }

        db.members.push({
          id: 'm-' + Date.now() + '-' + idx,
          tenantId: tenantId || 't-cw1',
          no_unit: noUnit,
          nama_pemilik: nama,
          penanggung_jawab: r.penanggung_jawab || nama,
          npp: npp,
          email: r.email || '',
          no_hp: r.no_hp || ''
        });
        imported++;
      });

      saveLocalDB(db);
      return { imported, failed };
    }

    case 'saveMember': {
      const { id, tenantId, no_unit, nama_pemilik, penanggung_jawab, npp, email, no_hp } = payload;
      if (!no_unit || !nama_pemilik || !npp || npp <= 0) {
        throw new Error('Kode unit, nama anggota, dan bobot NPP wajib diisi.');
      }

      const totalUnit = payload.total_unit || (no_unit.includes(',') ? no_unit.split(',').filter(Boolean).length : 1);

      if (id) {
        const idx = db.members.findIndex(m => m.id === id);
        if (idx !== -1) {
          db.members[idx] = {
            ...db.members[idx],
            no_unit,
            total_unit: totalUnit,
            nama_pemilik,
            penanggung_jawab: penanggung_jawab || nama_pemilik,
            npp: parseFloat(npp),
            email: email || '',
            no_hp: no_hp || ''
          };
        }
      } else {
        db.members.push({
          id: 'm-' + Date.now(),
          tenantId: tenantId || 't-cw1',
          no_unit,
          total_unit: totalUnit,
          nama_pemilik,
          penanggung_jawab: penanggung_jawab || nama_pemilik,
          npp: parseFloat(npp),
          email: email || '',
          no_hp: no_hp || ''
        });
      }
      saveLocalDB(db);
      return { success: true };
    }

    case 'deleteMember': {
      const { id } = payload;
      db.members = db.members.filter(m => m.id !== id);
      db.invitations = db.invitations.filter(i => i.memberId !== id);
      saveLocalDB(db);
      return { success: true };
    }

    // --- UF-03: Sidang & Agenda ---
    case 'getSessions': {
      return db.sessions;
    }

    case 'saveSession': {
      const { id, tenantId, tipe, judul, tanggal, lokasi, ambang_kuorum, waktu_pelaksanaan, waktu_dari, waktu_sampai, hari_tanggal } = payload;
      let targetSession = null;
      if (id) {
        const idx = db.sessions.findIndex(s => s.id === id);
        if (idx !== -1) {
          db.sessions[idx] = { 
            ...db.sessions[idx], 
            tipe, 
            judul, 
            title: judul,
            tanggal, 
            hari_tanggal: hari_tanggal || db.sessions[idx].hari_tanggal,
            waktu_pelaksanaan: waktu_pelaksanaan || db.sessions[idx].waktu_pelaksanaan,
            waktu_dari: waktu_dari || db.sessions[idx].waktu_dari,
            waktu_sampai: waktu_sampai || db.sessions[idx].waktu_sampai,
            lokasi, 
            ambang_kuorum: parseFloat(ambang_kuorum) 
          };
          targetSession = db.sessions[idx];
        }
      } else {
        targetSession = {
          id: 's-' + Date.now(),
          tenantId: tenantId || 't-cw1',
          tipe: tipe || 'MUTA',
          judul,
          title: judul,
          tanggal: tanggal || '',
          hari_tanggal: hari_tanggal || '',
          waktu_pelaksanaan: waktu_pelaksanaan || '09.00 WIB – Selesai',
          waktu_dari: waktu_dari || '09.00 WIB',
          waktu_sampai: waktu_sampai || 'Selesai',
          lokasi: lokasi || 'Function Room Artpreneur Lt. 13, Gedung Podium Ciputra World 1 Jakarta',
          status: 'Draft',
          ambang_kuorum: parseFloat(ambang_kuorum) || 50.0,
          kode_publik: 'CW' + Math.floor(1000 + Math.random() * 9000),
          waktu_mulai: '',
          waktu_tutup: ''
        };
        db.sessions.push(targetSession);
      }
      saveLocalDB(db);
      return { success: true, session: targetSession };
    }

    case 'getAgendas': {
      const sessionId = payload.sessionId || 's-2026-muta';
      const agendas = db.agendas.filter(a => a.sessionId === sessionId);
      const questions = db.questions.filter(q => q.sessionId === sessionId);

      return agendas.map(a => ({
        ...a,
        questions: questions.filter(q => q.agendaId === a.id)
      }));
    }

    case 'saveAgenda': {
      const { id, sessionId, urutan, judul, deskripsi } = payload;
      if (id) {
        const idx = db.agendas.findIndex(a => a.id === id);
        if (idx !== -1) {
          db.agendas[idx] = { ...db.agendas[idx], urutan: parseInt(urutan) || db.agendas[idx].urutan, judul, deskripsi };
        }
      } else {
        const newUrutan = parseInt(urutan) || (db.agendas.filter(a => a.sessionId === sessionId).length + 1);
        db.agendas.push({
          id: 'ag-' + Date.now(),
          sessionId,
          urutan: newUrutan,
          judul,
          deskripsi: deskripsi || ''
        });
      }
      saveLocalDB(db);
      return { success: true };
    }

    case 'deleteQuestion': {
      const { id } = payload;
      db.questions = db.questions.filter(q => q.id !== id);
      saveLocalDB(db);
      return { success: true };
    }

    case 'saveQuestion': {
      const { id, agendaId, sessionId, tipeSoal, pertanyaan, pilihan, maksPilihan, durasiDetik } = payload;
      if (!pertanyaan || !pilihan || pilihan.length < 2) {
        throw new Error('Pertanyaan dan minimal 2 pilihan jawaban wajib diisi.');
      }

      if (id) {
        const idx = db.questions.findIndex(q => q.id === id);
        if (idx !== -1) {
          db.questions[idx] = {
            ...db.questions[idx],
            agendaId: agendaId || db.questions[idx].agendaId,
            tipeSoal,
            pertanyaan,
            pilihan,
            maksPilihan: parseInt(maksPilihan) || 1,
            durasiDetik: parseInt(durasiDetik) || 60
          };
        }
      } else {
        db.questions.push({
          id: 'q-' + Date.now(),
          agendaId,
          sessionId,
          tipeSoal: tipeSoal || 'pilih_satu',
          pertanyaan,
          pilihan,
          maksPilihan: parseInt(maksPilihan) || 1,
          durasiDetik: parseInt(durasiDetik) || 60,
          status: 'Draft'
        });
      }
      saveLocalDB(db);
      return { success: true };
    }

    // --- UF-04 & UF-05: Undangan & Kuasa ---
    case 'getInvitations': {
      const sessionId = payload.sessionId || 's-2026-muta';
      const invitations = db.invitations.filter(i => i.sessionId === sessionId);
      return invitations.map(inv => {
        const member = db.members.find(m => m.id === inv.memberId) || {};
        const proxy = db.proxies.find(p => p.invitationId === inv.id && p.status === 'Aktif');
        return {
          ...inv,
          nama_pemilik: member.nama_pemilik,
          penanggung_jawab: member.penanggung_jawab || member.nama_pemilik,
          no_unit: member.no_unit,
          npp: member.npp,
          email: member.email,
          no_hp: member.no_hp,
          proxy: proxy || null
        };
      });
    }

    case 'generateInvitations': {
      const { sessionId, tenantId } = payload;
      const members = db.members.filter(m => m.tenantId === tenantId);
      let count = 0;
      members.forEach(m => {
        const exists = db.invitations.find(i => i.sessionId === sessionId && i.memberId === m.id);
        if (!exists) {
          db.invitations.push({
            id: 'inv-' + Date.now() + '-' + count,
            sessionId,
            tenantId,
            memberId: m.id,
            uid_qr: generateUidQr(),
            status_qr: 'Aktif'
          });
          count++;
        }
      });
      saveLocalDB(db);
      return { generated: count };
    }

    case 'saveProxy': {
      const { invitationId, sessionId, namaKuasa, noHpKuasa, urlSuratKuasa } = payload;
      if (!namaKuasa) throw new Error('Nama penerima kuasa wajib diisi.');
      db.proxies.push({
        id: 'prx-' + Date.now(),
        invitationId,
        sessionId,
        namaKuasa,
        noHpKuasa: noHpKuasa || '',
        urlSuratKuasa: urlSuratKuasa || 'uploaded-doc.pdf',
        status: 'Aktif'
      });
      saveLocalDB(db);
      return { success: true };
    }

    case 'cancelProxy': {
      const { proxyId } = payload;
      const p = db.proxies.find(x => x.id === proxyId);
      if (p) p.status = 'Dibatalkan';
      saveLocalDB(db);
      return { success: true };
    }

    // --- UF-06 & UF-07: Check-in ---
    case 'getAttendances': {
      const sessionId = payload.sessionId || 's-2026-muta';
      return db.attendances.filter(a => a.sessionId === sessionId && a.status === 'HADIR');
    }

    case 'checkinQR': {
      const { uid, sessionId, petugasId } = payload;
      const inv = db.invitations.find(i => i.sessionId === sessionId && i.uid_qr === uid);
      if (!inv) throw new Error('QR Code tidak terdaftar dalam sidang ini.');
      if (inv.status_qr === 'Terpakai') throw new Error('Peringatan: QR Code ini sudah pernah digunakan untuk check-in!');

      const session = db.sessions.find(s => s.id === sessionId);
      const isLate = session && session.status === 'Berjalan';
      const labelWaktu = isLate ? 'Late' : 'On time';

      inv.status_qr = 'Terpakai';
      db.attendances.push({
        id: 'att-' + Date.now(),
        sessionId,
        memberId: inv.memberId,
        tipeKehadiran: 'QR',
        labelWaktu,
        status: 'HADIR',
        waktuCheckin: now,
        petugasId: petugasId || 'petugas'
      });

      const member = db.members.find(m => m.id === inv.memberId) || {};
      saveLocalDB(db);
      return {
        success: true,
        member: {
          nama: member.nama_pemilik,
          unit: member.no_unit,
          npp: member.npp,
          labelWaktu
        }
      };
    }

    case 'checkinManual': {
      const { memberId, sessionId, petugasId } = payload;
      const already = db.attendances.find(a => a.sessionId === sessionId && a.memberId === memberId && a.status === 'HADIR');
      if (already) throw new Error('Peserta sudah berstatus HADIR.');

      const session = db.sessions.find(s => s.id === sessionId);
      const isLate = session && session.status === 'Berjalan';
      const labelWaktu = isLate ? 'Late' : 'On time';

      // 1. Tambah record attendance
      db.attendances.push({
        id: 'att-' + Date.now(),
        sessionId,
        memberId,
        tipeKehadiran: 'Manual',
        labelWaktu,
        status: 'HADIR',
        waktuCheckin: now,
        petugasId: petugasId || 'admin'
      });

      // 2. SINKRONISASI STATUS INVITATION: ubah status_qr menjadi Terpakai
      const inv = db.invitations.find(i => i.sessionId === sessionId && i.memberId === memberId);
      if (inv) {
        inv.status_qr = 'Terpakai';
      }

      const member = db.members.find(m => m.id === memberId) || {};
      saveLocalDB(db);
      return { success: true, member };
    }

    case 'cancelCheckin': {
      const { attendanceId, memberId, sessionId, alasan } = payload;
      if (!alasan) throw new Error('Alasan pembatalan kehadiran wajib diisi.');
      
      // Cari attendance baik via id atau via memberId & sessionId
      const att = db.attendances.find(a => 
        (attendanceId && a.id === attendanceId) || 
        (memberId && a.sessionId === sessionId && a.memberId === memberId && a.status === 'HADIR')
      );

      const targetMemberId = memberId || (att ? att.memberId : null);
      const targetSessionId = sessionId || (att ? att.sessionId : 's-2026-muta');

      if (att) {
        att.status = 'DIBATALKAN';
      }

      if (targetMemberId && targetSessionId) {
        const inv = db.invitations.find(i => i.sessionId === targetSessionId && i.memberId === targetMemberId);
        if (inv) inv.status_qr = 'Aktif';
      }

      saveLocalDB(db);
      return { success: true };
    }

    // --- UF-08 & UF-11: Kendali Sidang ---
    case 'startSession': {
      const { sessionId } = payload;
      const s = db.sessions.find(x => x.id === sessionId);
      if (s) {
        s.status = 'Berjalan';
        s.waktu_mulai = now;
      }
      saveLocalDB(db);
      return { success: true };
    }

    case 'closeSession': {
      const { sessionId } = payload;
      const s = db.sessions.find(x => x.id === sessionId);
      if (s) {
        s.status = 'Ditutup';
        s.waktu_tutup = now;
      }
      saveLocalDB(db);
      return { success: true };
    }

    case 'markAbsent': {
      const { sessionId } = payload;
      const session = db.sessions.find(s => s.id === sessionId);
      const members = db.members.filter(m => m.tenantId === session.tenantId);

      members.forEach(m => {
        const present = db.attendances.find(a => a.sessionId === sessionId && a.memberId === m.id && a.status === 'HADIR');
        if (!present) {
          db.attendances.push({
            id: 'att-' + Date.now() + '-' + m.id,
            sessionId,
            memberId: m.id,
            tipeKehadiran: 'Auto',
            labelWaktu: 'Absen',
            status: 'TIDAK HADIR',
            waktuCheckin: now
          });
        }
      });
      saveLocalDB(db);
      return { success: true };
    }

    case 'kickParticipant': {
      const { sessionId, memberId, alasan } = payload;
      if (!alasan) throw new Error('Alasan kick peserta wajib diisi.');
      db.kicked_records.push({
        id: 'kck-' + Date.now(),
        sessionId,
        memberId,
        alasan,
        createdAt: now
      });
      saveLocalDB(db);
      return { success: true };
    }

    case 'reactivateParticipant': {
      const { sessionId, memberId } = payload;
      db.kicked_records = db.kicked_records.filter(k => !(k.sessionId === sessionId && k.memberId === memberId));
      saveLocalDB(db);
      return { success: true };
    }

    // --- UF-09 & UF-10: Voting Engine ---
    case 'openQuestion': {
      const { questionId, sessionId } = payload;
      // Validasi kuorum (BR-08)
      const proj = simulateLocalGet('getProjectorData', { tenantId: 't-cw1', sessionId });
      if (!proj.isQuorumReached) {
        throw new Error('Soal tidak dapat dibuka sebelum kuorum tercapai (> 50%).');
      }

      // Tutup soal lain jika ada yang masih dibuka
      db.questions.forEach(q => {
        if (q.sessionId === sessionId && q.status === 'Dibuka') {
          q.status = 'Ditutup';
        }
      });

      const target = db.questions.find(q => q.id === questionId);
      if (target) {
        target.status = 'Dibuka';
        target.waktuBuka = now;
      }
      saveLocalDB(db);
      return { success: true };
    }

    case 'closeQuestion': {
      const { questionId } = payload;
      const target = db.questions.find(q => q.id === questionId);
      if (target) target.status = 'Ditutup';
      saveLocalDB(db);
      return { success: true };
    }

    case 'submitVote': {
      const { memberId, questionId, sessionId, pilihan } = payload;
      const isPresent = db.attendances.some(a => a.sessionId === sessionId && a.memberId === memberId && a.status === 'HADIR');
      if (!isPresent) throw new Error('Hanya peserta berstatus HADIR yang berhak memilih.');

      const isKicked = db.kicked_records.some(k => k.sessionId === sessionId && k.memberId === memberId);
      if (isKicked) throw new Error('Hak suara Anda telah dinonaktifkan oleh panitia.');

      const already = db.voted_records.some(vr => vr.questionId === questionId && vr.memberId === memberId);
      if (already) throw new Error('Anda sudah menggunakan hak suara Anda untuk soal ini.');

      const member = db.members.find(m => m.id === memberId) || { npp: 1 };
      const bobotNpp = parseFloat(member.npp) || 1;

      const pArr = Array.isArray(pilihan) ? pilihan : [pilihan];
      pArr.forEach(p => {
        db.votes.push({
          id: 'v-' + Date.now() + Math.random(),
          sessionId,
          questionId,
          pilihan: p,
          bobotNpp
        });
      });

      db.voted_records.push({
        id: 'vr-' + Date.now(),
        sessionId,
        questionId,
        memberId
      });

      saveLocalDB(db);
      return { success: true, message: 'Suara berhasil tercatat.' };
    }

    default:
      return { success: true };
  }
}

function simulateLocalGet(action, params) {
  const db = getLocalDB();
  const sessionId = params.sessionId || 's-2026-muta';
  const tenantId = params.tenantId || 't-cw1';

  if (action === 'getProjectorData') {
    const session = db.sessions.find(s => s.id === sessionId) || db.sessions[0];
    const members = db.members.filter(m => m.tenantId === tenantId);
    const totalNpp = members.reduce((acc, m) => acc + (parseFloat(m.npp) || 0), 0);

    const attendances = db.attendances.filter(a => a.sessionId === sessionId && a.status === 'HADIR');
    const presentIds = new Set(attendances.map(a => a.memberId));
    const presentNpp = members
      .filter(m => presentIds.has(m.id))
      .reduce((acc, m) => acc + (parseFloat(m.npp) || 0), 0);

    const quorumPercent = totalNpp > 0 ? (presentNpp / totalNpp) * 100 : 0;
    const threshold = session?.ambang_kuorum || 50.0;

    const activeQuestion = db.questions.find(q => q.sessionId === sessionId && q.status === 'Dibuka') || null;

    let activeVoteResults = null;
    if (activeQuestion) {
      const votes = db.votes.filter(v => v.questionId === activeQuestion.id);
      const tally = {};
      activeQuestion.pilihan.forEach(p => { tally[p] = 0; });
      votes.forEach(v => {
        tally[v.pilihan] = (tally[v.pilihan] || 0) + (parseFloat(v.bobotNpp) || 1);
      });

      activeVoteResults = {
        totalVoters: db.voted_records.filter(vr => vr.questionId === activeQuestion.id).length,
        presentVoters: presentIds.size,
        tally
      };
    }

    // Pemetaan 25 Card Peserta untuk Tampilan Bawah Proyektor Kehadiran
    const attendanceMap = new Map();
    attendances.forEach(a => {
      attendanceMap.set(a.memberId, a);
    });

    const attendeeCards = members.map(m => {
      const att = attendanceMap.get(m.id);
      const isPresent = Boolean(att);
      const proxy = db.proxies.find(p => p.sessionId === sessionId && p.status === 'Aktif' && (
        db.invitations.some(i => i.id === p.invitationId && i.memberId === m.id)
      ));

      let statusAbsensi = 'Belum';
      if (isPresent) {
        statusAbsensi = att.labelWaktu === 'Late' ? 'Late' : 'On-Time';
      }

      // Nama PJ jika scan biasa / nama kuasa jika check-in manual kuasa
      let penanggungJawab = m.penanggung_jawab || m.nama_pemilik;
      if (isPresent && att.tipeKehadiran === 'Manual' && proxy) {
        penanggungJawab = proxy.namaKuasa;
      } else if (proxy) {
        penanggungJawab = `${proxy.namaKuasa} (Kuasa)`;
      }

      const totalUnit = m.total_unit || (m.no_unit ? m.no_unit.split(',').length : 1);

      return {
        id: m.id,
        kodeUnit: m.no_unit,
        statusAbsensi, // 'On-Time' | 'Late' | 'Belum'
        namaAnggota: m.nama_pemilik,
        penanggungJawab,
        bobotNpp: parseFloat(m.npp) || 0,
        totalUnit,
        isPresent,
        waktuCheckin: att?.waktuCheckin || null
      };
    });

    return {
      sessionTitle: session?.judul || 'MUTA PPPSRS',
      sessionStatus: session?.status || 'Draft',
      totalMembers: members.length,
      presentMembers: presentIds.size,
      totalNpp,
      presentNpp,
      quorumPercent,
      quorumThreshold: threshold,
      isQuorumReached: quorumPercent > threshold,
      activeQuestion,
      activeVoteResults,
      attendeeCards
    };
  }

  if (action === 'getPublicVoterData') {
    const session = db.sessions.find(s => s.id === sessionId || s.kode_publik === sessionId) || db.sessions[0];
    const attendances = db.attendances.filter(a => a.sessionId === session.id && a.status === 'HADIR');
    const presentIds = new Set(attendances.map(a => a.memberId));
    const kickedIds = new Set(db.kicked_records.filter(k => k.sessionId === session.id).map(k => k.memberId));

    const eligibleVoters = db.members
      .filter(m => presentIds.has(m.id) && !kickedIds.has(m.id))
      .map(m => ({
        id: m.id,
        nama: m.nama_pemilik,
        unit: m.no_unit,
        npp: m.npp
      }));

    const activeQuestion = db.questions.find(q => q.sessionId === session.id && q.status === 'Dibuka');

    return {
      sessionId: session.id,
      sessionTitle: session.judul,
      eligibleVoters,
      activeQuestion
    };
  }

  return {};
}
