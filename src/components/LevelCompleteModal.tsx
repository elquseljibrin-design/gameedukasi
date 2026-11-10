import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Star, ArrowRight, RotateCcw, Home, CheckCircle2, XCircle } from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface LevelCompleteModalProps {
  levelTitle: string;
  isWorldCleared: boolean;
  score: number;
  coins: number;
  correctAnswers: number;
  wrongAnswers: number;
  grade: number;
  playTimeSeconds: number;
  onNextLevel: () => void;
  onRetryLevel: () => void;
  onHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelTitle,
  isWorldCleared,
  score,
  coins,
  correctAnswers,
  wrongAnswers,
  grade,
  playTimeSeconds,
  onNextLevel,
  onRetryLevel,
  onHome
}) => {
  useEffect(() => {
    sounds.playLevelComplete();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  }, []);

  const totalQuestions = correctAnswers + wrongAnswers;
  const isMastered = grade >= 75;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500/80 rounded-2xl shadow-2xl p-6 md:p-8 text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-3 text-slate-950 shadow-lg flex items-center justify-center">
            <Award className="w-10 h-10" />
          </div>

          <span className="font-pixel text-xs text-emerald-400 uppercase tracking-widest block mb-1">
            LEVEL BERHASIL DISELESAIKAN!
          </span>
          <h2 className="text-xl font-bold text-white mb-1">{levelTitle}</h2>
          <p className="text-xs text-slate-400 mb-6">
            Hasil evaluasi belajar petualangan Informatika telah tercatat.
          </p>

          {/* World Star Reward */}
          {isWorldCleared && (
            <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center gap-2 text-amber-300 text-xs font-bold animate-bounce">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>SELAMAT! KAMU MEMPEROLEH 1 BINTANG DUNIA!</span>
            </div>
          )}

          {/* Evaluation Score Matrix */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-left">
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Nilai Soal Informatika:</span>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl font-pixel font-bold ${
                    isMastered ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {grade}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <span
                className={`text-[10px] font-bold block mt-1 ${
                  isMastered ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isMastered ? '✓ TUNTAS KKM (≥75)' : '⚠ PERLU REMIDIAL (<75)'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Ketepatan Soal:</span>
              <div className="flex items-center gap-3 mt-1 text-sm font-semibold">
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {correctAnswers}
                </span>
                <span className="text-red-400 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {wrongAnswers}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1.5">
                Total {totalQuestions} Soal Terjawab
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Total Skor Petualangan:</span>
              <span className="text-xl font-pixel text-amber-400 block font-bold">{score}</span>
              <span className="text-[10px] text-slate-500">🪙 {coins} Koin Dikumpulkan</span>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Waktu Pengerjaan:</span>
              <span className="text-xl font-mono text-sky-400 block font-bold">
                {Math.floor(playTimeSeconds / 60)}m {playTimeSeconds % 60}s
              </span>
              <span className="text-[10px] text-slate-500">Kecepatan & Ketangkasan</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onNextLevel}
              className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <span>Lanjut Level Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onRetryLevel}
                className="flex-1 sm:flex-initial py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="Main Ulang Level"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi</span>
              </button>
              <button
                onClick={onHome}
                className="flex-1 sm:flex-initial py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="Kembali ke Menu Utama"
              >
                <Home className="w-4 h-4" />
                <span>Menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
