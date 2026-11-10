import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Award, Home, Printer } from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface ChampionModalProps {
  studentName: string;
  studentClass: string;
  totalScore: number;
  totalCoins: number;
  stars: number;
  onHome: () => void;
}

export const ChampionModal: React.FC<ChampionModalProps> = ({
  studentName,
  studentClass,
  totalScore,
  totalCoins,
  stars,
  onHome
}) => {
  useEffect(() => {
    sounds.playLevelComplete();
    const end = Date.now() + 3000;
    const interval: number = window.setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border-4 border-amber-400 rounded-3xl shadow-2xl p-6 md:p-10 text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-4 text-slate-950 shadow-2xl flex items-center justify-center animate-bounce">
            <Trophy className="w-12 h-12" />
          </div>

          <span className="font-pixel text-xs text-amber-400 uppercase tracking-widest block mb-2">
            PENGHARGAAN TERTINGGI EVALUASI
          </span>
          <h2 className="font-pixel text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 mb-2">
            SUPER INFORMATIKA CHAMPION!
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
            Selamat kepada <strong className="text-white font-bold">{studentName}</strong> ({studentClass}) telah berhasil menaklukkan seluruh 5 dunia petualangan dan mengalahkan Raja Bug!
          </p>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Bintang Dunia:</span>
              <div className="flex items-center justify-center gap-1 text-amber-400 font-pixel text-sm font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{stars} / 5</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Skor Akhir:</span>
              <span className="text-amber-400 font-pixel text-sm font-bold">{totalScore}</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Total Koin:</span>
              <span className="text-yellow-300 font-pixel text-sm font-bold">🪙 {totalCoins}</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-sky-950/40 to-indigo-950/40 border border-sky-500/40 rounded-2xl mb-6 text-xs text-slate-200">
            <div className="flex items-center justify-center gap-1.5 text-sky-400 font-bold mb-1">
              <Award className="w-4 h-4" />
              <span>Kompetensi Tuntas Penuh (Fase D)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Dekomposisi, Pengenalan Pola, Abstraksi, Algoritma, dan Penulisan Pseudocode telah dikuasai dengan sangat baik.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto py-3 px-5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sertifikat Juara</span>
            </button>
            <button
              onClick={onHome}
              className="w-full sm:w-auto py-3 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Menu Utama</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
