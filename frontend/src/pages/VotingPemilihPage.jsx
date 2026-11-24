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
  UserX
} from 'lucide-react';

/**
 * UF-10: Memberikan Suara (Bilik Suara Publik Pemilih HP)
 * Mengacu pada IA Section 5 (S-20 s/d S-24) & Prinsip UX Design System:
 * - S-20: Pilih Nama dari daftar yang sudah check-in HADIR
 * - S-21: Soal Aktif dengan tombol sentuh besar (min 48-56px) & Hitung Mundur
 * - S-22: Konfirmasi "Suara Tercatat"
 * - S-23: Menunggu Soal
 * - S-24: Dikeluarkan Panitia (Kick)
 * - BR-01: Bobot suara = total NPP
 * - BR-07: Satu suara per pemilik per soal
 * - R-08 & BR-09: Kerahasiaan suara (pilihan tidak ditautkan ke nama pemilih)
 */

export function VotingPemilihPage({ params }) {
  const kodeSidang = params?.kodeSidang || 'CW2026';

  const [voterData, setVoterData] = useState(null);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [searchName, setSearchName] = useState('');
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

  const handleSelectVoter = (voter) => {
    setSelectedVoter(voter);
    setErrorMsg('');
    setVoteSubmitted(false);
    setSelectedChoices([]);
    setTimeLeft(voterData?.activeQuestion?.durasiDetik || 60);
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
  const eligibleVoters = voterData?.eligibleVoters || [];

  const filteredVoters = eligibleVoters.filter(v =>
    (v.nama || '').toLowerCase().includes(searchName.toLowerCase()) ||
    (v.unit || '').toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-md mx-auto w-full">
      {/* Kartu Header Sidang */}
      <div className="bg-surface-card p-4 rounded-2xl border border-surface-border text-center shadow-sm">
        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-brand-primary uppercase">
          KODE SIDANG: {kodeSidang}
        </span>
        <h1 className="text-base font-bold text-content-main mt-1">
          {voterData?.sessionTitle || 'MUTA PPPSRS'}
        </h1>
        <div className="text-[11px] text-content-muted flex items-center justify-center gap-1 mt-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
          <span>Bilik Suara Elektronik Rahasia (Bobot NPP)</span>
        </div>
      </div>

      {/* S-20: IDENTIFIKASI PEMILIH (PILIH NAMA) */}
      {!selectedVoter ? (
        <div className="bg-surface-card p-5 rounded-2xl border border-surface-border shadow-sm space-y-3">
          <div className="text-center pb-1">
            <h2 className="text-sm font-bold text-content-main uppercase tracking-wide">
              Langkah 1: Pilih Identitas Pemilih (S-20)
            </h2>
            <p className="text-xs text-content-muted mt-0.5">
              Hanya peserta yang telah check-in berstatus HADIR yang dapat memilih.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-content-muted absolute left-3 top-3" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Cari nomor unit (misal: A-101) atau nama..."
              className="w-full pl-9 pr-3 py-2 bg-surface-bg border border-surface-border rounded-xl text-sm"
            />
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-surface-border border border-surface-border rounded-xl">
            {filteredVoters.length === 0 ? (
              <div className="p-6 text-center text-xs text-content-muted">
                {eligibleVoters.length === 0
                  ? 'Belum ada peserta yang berstatus HADIR di meja registrasi.'
                  : `Tidak ada peserta cocok dengan pencarian "${searchName}".`}
              </div>
            ) : (
              filteredVoters.map(voter => (
                <button
                  key={voter.id}
                  type="button"
                  onClick={() => handleSelectVoter(voter)}
                  className="w-full p-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-brand-primary">Unit {voter.unit}</div>
                    <div className="text-sm font-medium text-content-main">{voter.nama}</div>
                  </div>
                  <UserCheck className="w-4 h-4 text-brand-accent" />
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        /* SUDAH MEMILIH IDENTITAS */
        <div className="space-y-4">
          <div className="p-3 bg-surface-card rounded-xl border border-surface-border flex justify-between items-center text-xs">
            <div>
              <div className="text-content-muted">Pemilih Aktif:</div>
              <div className="font-bold text-content-main">{selectedVoter.nama} (Unit {selectedVoter.unit})</div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedVoter(null)}
              className="text-[11px] font-semibold text-brand-accent hover:underline"
            >
              Ganti Nama
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
                Terima kasih telah berpartisipasi. Hak suara berbobot NPP Anda telah tercatat secara rahasia dan aman.
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
                  Soal Voting Terbuka (S-21)
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

              {/* Tombol Pilihan Jawaban (Target Sentuh Min 56px) */}
              <div className="space-y-2.5 pt-1">
                {(activeQuestion.pilihan || ['Setuju', 'Tidak Setuju', 'Abstain']).map((choice, idx) => {
                  const isSelected = selectedChoices.includes(choice);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleChoice(choice)}
                      className={`
                        w-full min-h-[56px] p-4 rounded-xl border-2 font-bold text-sm text-left transition-all
                        flex items-center justify-between shadow-sm
                        ${isSelected
                          ? 'border-brand-primary bg-blue-50 text-brand-primary ring-2 ring-brand-primary/20'
                          : 'border-surface-border bg-surface-card text-content-main hover:bg-surface-bg'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center font-bold ${
                          isSelected ? 'bg-brand-primary text-white' : 'bg-surface-bg text-content-muted'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{choice}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" />}
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
            /* S-23: MENUNGGU SOAL DIBUKA */
            <div className="bg-surface-card rounded-2xl border border-surface-border p-8 text-center space-y-3 shadow-sm">
              <Clock className="w-12 h-12 text-brand-accent mx-auto animate-pulse" />
              <h2 className="text-base font-bold text-content-main">
                Menunggu Soal Dibuka (S-23)
              </h2>
              <p className="text-xs text-content-muted leading-relaxed">
                Panitia sidang belum membuka sesi pemungutan suara untuk agenda saat ini. Layar ini akan otomatis menampilkan pertanyaan saat soal dibuka.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
