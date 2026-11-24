import { INITIAL_SEED } from './mockData';

/**
 * Storage Simulator & API Adapter
 * Menjamin aplikasi dapat diuji langsung 100% fungsional (bahkan sebelum GAS dideploy)
 * dan secara otomatis memanggil endpoint Web App jika VITE_GAS_API_URL telah diset!
 */

const STORAGE_KEY = 'muta_connect_db_v1';

function getLocalDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED));
      return JSON.parse(JSON.stringify(INITIAL_SEED));
    }
    return JSON.parse(raw);
  } catch (e) {
    return JSON.parse(JSON.stringify(INITIAL_SEED));
  }
}

function saveLocalDB(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

const API_BASE_URL = import.meta.env.VITE_GAS_API_URL || '';
const USE_REMOTE_API = Boolean(API_BASE_URL && !API_BASE_URL.includes('placeholder'));

export class ApiService {
  /**
   * Router Aksi Terpadu (Lokal Simulator atau Google Apps Script)
   */
  static async request(action, payload = {}, token = null) {
    if (USE_REMOTE_API) {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, payload, token, timestamp: Date.now() })
      });
      const res = await response.json();
      if (!res.success) throw new Error(res.error?.message || 'Gagal memproses request.');
      return res.data;
    }

    // Eksekusi Lokal Simulator
    return simulateLocalAction(action, payload);
  }

  static async get(action, params = {}) {
    if (USE_REMOTE_API) {
      const url = new URL(API_BASE_URL);
      url.searchParams.set('action', action);
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
      const response = await fetch(url.toString(), { method: 'GET' });
      const res = await response.json();
      if (!res.success) throw new Error(res.error?.message || 'Gagal memproses request.');
      return res.data;
    }

    return simulateLocalGet(action, params);
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
    // --- UF-01: Auth ---
    case 'login': {
      const { username, password } = payload;
      const user = db.users.find(u => u.username === username);
      if (!user) throw new Error('Username atau password salah.');
      return {
        token: 'local-token-' + user.id,
        user: { ...user }
      };
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
      const { id, tenantId, no_unit, nama_pemilik, npp, email, no_hp } = payload;
      if (!no_unit || !nama_pemilik || !npp || npp <= 0) {
        throw new Error('Nomor unit, nama anggota, dan bobot NPP wajib diisi.');
      }

      if (id) {
        const idx = db.members.findIndex(m => m.id === id);
        if (idx !== -1) {
          db.members[idx] = { ...db.members[idx], no_unit, nama_pemilik, npp: parseFloat(npp), email, no_hp };
        }
      } else {
        db.members.push({
          id: 'm-' + Date.now(),
          tenantId: tenantId || 't-cw1',
          no_unit,
          nama_pemilik,
          npp: parseFloat(npp),
          email: email || '',
          no_hp: no_hp || ''
        });
      }
      saveLocalDB(db);
      return { success: true };
    }

    // --- UF-03: Sidang & Agenda ---
    case 'getSessions': {
      return db.sessions;
    }

    case 'saveSession': {
      const { id, tenantId, tipe, judul, tanggal, lokasi, ambang_kuorum } = payload;
      if (id) {
        const idx = db.sessions.findIndex(s => s.id === id);
        if (idx !== -1) {
          db.sessions[idx] = { ...db.sessions[idx], tipe, judul, tanggal, lokasi, ambang_kuorum: parseFloat(ambang_kuorum) };
        }
      } else {
        db.sessions.push({
          id: 's-' + Date.now(),
          tenantId: tenantId || 't-cw1',
          tipe: tipe || 'MUTA',
          judul,
          tanggal,
          lokasi,
          status: 'Draft',
          ambang_kuorum: parseFloat(ambang_kuorum) || 50.0,
          kode_publik: 'CW' + Math.floor(1000 + Math.random() * 9000),
          waktu_mulai: '',
          waktu_tutup: ''
        });
      }
      saveLocalDB(db);
      return { success: true };
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
          db.agendas[idx] = { ...db.agendas[idx], urutan: parseInt(urutan), judul, deskripsi };
        }
      } else {
        db.agendas.push({
          id: 'ag-' + Date.now(),
          sessionId,
          urutan: parseInt(urutan) || db.agendas.length + 1,
          judul,
          deskripsi
        });
      }
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
            uid_qr: 'MUTA-QR-' + m.no_unit.replace('-', '') + '-' + Math.floor(100 + Math.random() * 900),
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

      const member = db.members.find(m => m.id === memberId) || {};
      saveLocalDB(db);
      return { success: true, member };
    }

    case 'cancelCheckin': {
      const { attendanceId, alasan } = payload;
      if (!alasan) throw new Error('Alasan pembatalan kehadiran wajib diisi.');
      const att = db.attendances.find(a => a.id === attendanceId);
      if (att) {
        att.status = 'DIBATALKAN';
        const inv = db.invitations.find(i => i.sessionId === att.sessionId && i.memberId === att.memberId);
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
      activeVoteResults
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
