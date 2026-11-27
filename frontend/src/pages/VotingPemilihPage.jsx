import React, { useState, useEffect } from 'react';
import { ApiService } from '../api/client';
import {
  Vote,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  UserCheck,
  Send,
  ShieldCheck,
  UserX,
  KeyRound,
  Building2,
  User,
  CheckSquare
} from 'lucide-react';

/**
 * UF-10: Memberikan Suara (Bilik Suara Publik Pemilih HP)
 * Alur Baru:
 * 1. Peserta memasukkan 4-Digit UID QR
 * 2. Sistem menampilkan Identitas Lengkap: Nama Anggota & Nama PJ / Penerima Kuasa & Bobot NPP
 * 3. Step Konfirmasi Kehadiran
 * 4. Masuk ke Bilik Suara saat soal dibuka oleh Panitia
 */

export function VotingPemilihPage({ params }) {
  const kodeSidang = params?.kodeSidang || 'CW2026';

  const [voterData, setVoterData] = useState(null);
  const [uidInput, setUidInput] = useState('');
  const [verifiedVoter, setVerifiedVoter] = useState(null);
  const [isAttendanceConfirmed, setIsAttendanceConfirmed] = useState(false);
  const [confirmingAttendance, setConfirmingAttendance] = useState(false);

  const [selectedVoter, setSelectedVoter] = useState(null);
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPublicData();
    const interval = setInterval(loadPublicData, 3000); // Polling soal 3 detik
    return () => clearInterval(interval);
  }, [kodeSidang]);

  const loadPublicData = async () => {
    try {
      const res = await ApiService.get('getPublicVoterData', { sessionId: kodeSidang });
      setVoterData(res);
    } catch (e) {
      console.error(e);
    }
  };

  // Timer hitung mundur lokal
  useEffect(() => {
    if (voterData?.activeQuestion && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [voterData?.activeQuestion]);

  // Step 1: Verifikasi 4-Digit UID
  const handleVerifyUid = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanUid = String(uidInput || '').trim();
    if (!cleanUid || cleanUid.length !== 4) {
      setErrorMsg('Masukkan 4 digit angka UID QR Anda dengan benar (contoh: 1001).');
      return;
    }

    const voters = voterData?.votersByUid || [];
    const matched = voters.find(v => String(v.uid).trim() === cleanUid);

    if (!matched) {
      setErrorMsg(`UID "${cleanUid}" tidak ditemukan dalam daftar undangan musyawarah ini. Periksa kembali nomor pada tiket/undangan Anda.`);
      return;
    }

    if (matched.isKicked) {
      setErrorMsg('Akses bilik suara dinonaktifkan: Peserta ini telah dikeluarkan dari sidang oleh Panitia.');
      return;
    }

    setVerifiedVoter(matched);
    // Jika di registrasi sudah tercatat hadir, tetap berikan konfirmasi kehadiran mandiri
    if (matched.isPresent) {
      setIsAttendanceConfirmed(false); // biarkan peserta melihat konfirmasi
    }
  };

  // Step 2: Konfirmasi Kehadiran
  const handleConfirmAttendance = async () => {
    if (!verifiedVoter) return;
    setConfirmingAttendance(true);
    setErrorMsg('');

    try {
      await ApiService.request('confirmAttendance', {
        sessionId: voterData?.sessionId || kodeSidang,
        uid: verifiedVoter.uid,
        memberId: verifiedVoter.memberId
      });

      setIsAttendanceConfirmed(true);
      setSelectedVoter({
        id: verifiedVoter.memberId,
        nama: verifiedVoter.nama_anggota,
        unit: verifiedVoter.no_unit,
        npp: verifiedVoter.npp
      });
      setTimeLeft(voterData?.activeQuestion?.durasiDetik || 60);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memproses konfirmasi kehadiran.');
    } finally {
      setConfirmingAttendance(false);
    }
  };

  const handleResetVoter = () => {
    setVerifiedVoter(null);
    setIsAttendanceConfirmed(false);
    setSelectedVoter(null);
    setUidInput('');
    setErrorMsg('');
    setVoteSubmitted(false);
    setSelectedChoices([]);
  };

  const handleToggleChoice = (pilihan) => {
    const maks = voterData?.activeQuestion?.maksPilihan || 1;
    if (maks === 1) {
      setSelectedChoices([pilihan]);
    } else {
      if (selectedChoices.includes(pilihan)) {
        setSelectedChoices(selectedChoices.filter(c => c !== pilihan));
      } else {
        if (selectedChoices.length < maks) {
          setSelectedChoices([...selectedChoices, pilihan]);
        }
      }
    }
  };

  const handleSubmitVote = async () => {
    if (selectedChoices.length === 0) {
      setErrorMsg('Silakan pilih salah satu opsi sebelum mengirim suara.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await ApiService.request('submitVote', {
        memberId: selectedVoter.id,
        questionId: voterData?.activeQuestion?.id,
        sessionId: voterData?.sessionId,
        pilihan: selectedChoices
      });

      setVoteSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengirim suara.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeQuestion = voterData?.activeQuestion;

  return (
    <div className="space-y-4 max-w-md mx-auto w-full px-2 sm:px-0 py-2">
      {/* Kartu Header Sidang */}
      <div className="bg-surface-card p-4 rounded-2xl border border-surface-border text-center shadow-sm space-y-1">
        <div className="inline-flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-brand-primary uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5 text-brand-accent" />
          <span>PPPSRSKC SUB BAGIAN OFFICE 1 CIPUTRA WORLD 1 JAKARTA</span>
        </div>
        <h1 className="text-sm sm:text-base font-bold text-content-main">
          {voterData?.sessionTitle || 'Musyawarah Umum Anggota (MUA) 2026'}
        </h1>
        <div className="text-[11px] text-content-muted flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
          <span>Bilik Suara Elektronik Rahasia (Bobot NPP)</span>
        </div>
      </div>

      {/* TAHAP 1: INPUT 4-DIGIT UID */}
      {!verifiedVoter ? (
        <div className="bg-surface-card p-6 rounded-2xl border border-surface-border shadow-sm space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-2xl flex items-center justify-center mx-auto border border-blue-200">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-content-main">
              Masukkan 4-Digit UID QR Anda
            </h2>
            <p className="text-xs text-content-muted">
              Ketik 4 digit angka yang tertera di bawah QR Code Undangan / Tiket Registrasi Anda.
            </p>
          </div>

          <form onSubmit={handleVerifyUid} className="space-y-4">
            <div>
              <input
                type="tel"
                maxLength={4}
                value={uidInput}
                onChange={(e) => setUidInput(e.target.value.replace(/\D/g, ''))}
                placeholder="1001"
                autoFocus
                className="w-full text-center py-3.5 bg-surface-bg border-2 border-brand-primary/40 rounded-xl text-3xl font-black font-mono tracking-widest text-brand-primary focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all placeholder:text-slate-300"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-status-danger text-status-danger rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uidInput.length !== 4}
              className="w-full min-h-[48px] bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-brand-primary-hover shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Verifikasi Identitas Saya</span>
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-content-muted border-t border-surface-border">
            Belum memiliki QR Code? Silakan kunjungi meja registrasi panitia musyawarah.
          </div>
        </div>
      ) : !isAttendanceConfirmed ? (
        /* TAHAP 2: KONFIRMASI KEHADIRAN & IDENTITAS PESERTA */
        <div className="bg-surface-card p-6 rounded-2xl border-2 border-brand-primary shadow-lg space-y-5 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-content-main">
              Konfirmasi Kehadiran Peserta
            </h2>
            <p className="text-xs text-content-muted">
              Pastikan rincian kepemilikan unit dan hak suara Anda di bawah ini sudah sesuai.
            </p>
          </div>

          {/* Rincian Identitas Peserta */}
          <div className="bg-surface-bg rounded-xl p-4 border border-surface-border space-y-3 text-xs">
            <div className="flex justify-between items-start pb-2 border-b border-surface-border">
              <span className="text-content-muted font-medium">UID QR:</span>
              <span className="font-mono font-bold text-brand-primary px-2 py-0.5 rounded bg-blue-100 text-[11px]">
                {verifiedVoter.uid}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-content-muted text-[11px]">Nama Anggota (Pemilik Unit):</span>
              <div className="font-bold text-sm text-content-main uppercase">
                {verifiedVoter.nama_anggota}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-content-muted text-[11px]">Nomor Unit:</span>
              <div className="font-bold text-brand-primary">
                {verifiedVoter.no_unit}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-content-muted text-[11px]">Penanggung Jawab / Kuasa:</span>
              <div className="font-semibold text-content-main">
                {verifiedVoter.nama_kuasa ? (
                  <span className="text-amber-800 font-bold">
                    {verifiedVoter.nama_kuasa} <span className="text-[10px] font-normal px-1 py-0.5 bg-amber-100 rounded text-amber-900">(Penerima Kuasa Sah)</span>
                  </span>
                ) : (
                  verifiedVoter.penanggung_jawab || verifiedVoter.nama_anggota
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-surface-border">
              <span className="text-content-muted font-medium">Bobot Hak Suara (NPP):</span>
              <span className="font-mono font-black text-status-success text-sm">
                {parseFloat(verifiedVoter.npp || 0).toFixed(4)}%
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-status-danger text-status-danger rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2 pt-1">
            <button
              type="button"
              disabled={confirmingAttendance}
              onClick={handleConfirmAttendance}
              className="w-full min-h-[50px] bg-status-success text-white font-bold text-sm rounded-xl hover:bg-emerald-600 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{confirmingAttendance ? 'Memproses Kehadiran...' : 'Konfirmasi Hadir & Masuk Bilik Suara'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetVoter}
              className="w-full py-2.5 text-xs text-content-muted hover:text-content-main font-semibold hover:underline text-center"
            >
              Bukan data Anda? Ganti UID
            </button>
          </div>
        </div>
      ) : (
        /* TAHAP 3: BILIK SUARA TERKONFIRMASI */
        <div className="space-y-4">
          {/* Bar Identitas Pemilih Terverifikasi */}
          <div className="p-3.5 bg-surface-card rounded-2xl border border-surface-border flex justify-between items-center shadow-sm text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-content-main">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span className="truncate max-w-[200px]">{selectedVoter.nama}</span>
              </div>
              <div className="text-[11px] text-content-muted">
                Unit {selectedVoter.unit} • <span className="text-emerald-700 font-bold font-mono">{parseFloat(selectedVoter.npp || 0).toFixed(4)}% NPP</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleResetVoter}
              className="px-2.5 py-1 text-[11px] font-semibold text-brand-accent hover:bg-blue-50 rounded-lg border border-surface-border transition-colors"
            >
              Keluar
            </button>
          </div>

          {/* S-22: FEEDBACK SUARA TERCATAT */}
          {voteSubmitted ? (
            <div className="p-6 bg-green-50 border-2 border-status-success rounded-2xl text-center space-y-3 shadow-sm animate-in zoom-in duration-200">
              <CheckCircle2 className="w-14 h-14 text-status-success mx-auto" />
              <h2 className="text-lg font-black text-status-success">
                SUARA ANDA TELAH TERCATAT
              </h2>
              <p className="text-xs text-content-main leading-relaxed">
                Terima kasih atas partisipasi Anda. Hak suara berbobot {parseFloat(selectedVoter.npp || 0).toFixed(4)}% NPP Anda telah tersimpan secara aman & rahasia.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setVoteSubmitted(false);
                    setSelectedChoices([]);
                  }}
                  className="px-4 py-2 bg-surface-card border border-surface-border rounded-lg text-xs font-bold text-content-main hover:bg-surface-bg shadow-sm"
                >
                  Tunggu Soal Berikutnya
                </button>
              </div>
            </div>
          ) : activeQuestion ? (
            /* S-21: SOAL AKTIF & HITUNG MUNDUR */
            <div className="bg-surface-card rounded-2xl border-2 border-brand-primary p-5 shadow-md space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-surface-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-status-success flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-status-success animate-ping" />
                  Soal Voting Terbuka
                </span>
                <span className="text-xs font-bold text-status-warning flex items-center gap-1 tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  {timeLeft}s
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-content-main leading-snug">
                  {activeQuestion.pertanyaan}
                </h2>
                <div className="text-[11px] text-content-muted mt-1">
                  Format: {activeQuestion.tipeSoal === 'pilih_banyak' ? `Pilih hingga ${activeQuestion.maksPilihan} opsi` : 'Pilih satu jawaban'}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-status-danger text-status-danger rounded-xl text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Tombol Pilihan Jawaban - Palet Warna A=Hijau, B=Merah, C=Kuning */}
              <div className="space-y-2.5 pt-1">
                {(activeQuestion.pilihan || ['Setuju', 'Tidak Setuju', 'Abstain']).map((choice, idx) => {
                  const isSelected = selectedChoices.includes(choice);

                  let colorStyle = {
                    base: 'border-surface-border bg-surface-card text-content-main hover:bg-surface-bg',
                    badge: 'bg-surface-bg text-content-muted',
                    selected: 'border-brand-primary bg-blue-50 text-brand-primary ring-2 ring-brand-primary/20',
                    selectedBadge: 'bg-brand-primary text-white',
                    icon: 'text-brand-primary'
                  };

                  if (idx === 0) { // A = HIJAU
                    colorStyle = {
                      base: 'border-green-200 bg-green-50/30 text-green-950 hover:bg-green-50',
                      badge: 'bg-green-100 text-[#15803D] font-black border border-green-300',
                      selected: 'border-[#15803D] bg-green-100 text-green-950 ring-2 ring-[#15803D]/30 shadow-md',
                      selectedBadge: 'bg-[#15803D] text-white font-black',
                      icon: 'text-[#15803D]'
                    };
                  } else if (idx === 1) { // B = MERAH
                    colorStyle = {
                      base: 'border-red-200 bg-red-50/30 text-red-950 hover:bg-red-50',
                      badge: 'bg-red-100 text-[#B91C1C] font-black border border-red-300',
                      selected: 'border-[#B91C1C] bg-red-100 text-red-950 ring-2 ring-[#B91C1C]/30 shadow-md',
                      selectedBadge: 'bg-[#B91C1C] text-white font-black',
                      icon: 'text-[#B91C1C]'
                    };
                  } else if (idx === 2) { // C = KUNING
                    colorStyle = {
                      base: 'border-yellow-200 bg-yellow-50/30 text-yellow-950 hover:bg-yellow-50',
                      badge: 'bg-yellow-100 text-[#854D0E] font-black border border-yellow-300',
                      selected: 'border-[#EAB308] bg-yellow-100 text-yellow-950 ring-2 ring-[#EAB308]/40 shadow-md',
                      selectedBadge: 'bg-[#EAB308] text-slate-950 font-black',
                      icon: 'text-[#854D0E]'
                    };
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleChoice(choice)}
                      className={`
                        w-full min-h-[56px] p-4 rounded-xl border-2 font-bold text-sm text-left transition-all
                        flex items-center justify-between shadow-sm
                        ${isSelected ? colorStyle.selected : colorStyle.base}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center font-bold ${
                          isSelected ? colorStyle.selectedBadge : colorStyle.badge
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm font-bold">{choice}</span>
                      </div>
                      {isSelected && <CheckCircle2 className={`w-6 h-6 ${colorStyle.icon} shrink-0`} />}
                    </button>
                  );
                })}
              </div>

              {/* Tombol Kirim Suara */}
              <button
                type="button"
                disabled={selectedChoices.length === 0 || isSubmitting}
                onClick={handleSubmitVote}
                className="w-full min-h-[52px] bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-brand-primary-hover shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirim Suara...' : 'Kirim Pilihan Suara Sekarang'}</span>
              </button>
            </div>
          ) : (
            /* FEEDBACK MENUNGGU SOAL DIBUKA */
            <div className="bg-surface-card rounded-2xl border border-surface-border p-8 text-center space-y-3 shadow-sm">
              <Clock className="w-12 h-12 text-brand-accent mx-auto animate-pulse" />
              <h2 className="text-base font-bold text-content-main">
                Kehadiran Terkonfirmasi
              </h2>
              <p className="text-xs text-content-muted leading-relaxed">
                Anda telah terkonfirmasi hadir dalam musyawarah. Saat panitia sidang membuka soal voting, pertanyaan akan otomatis muncul di layar ini.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
