import React, { useEffect } from 'react';
import { RotateCcw, Home, HeartCrack } from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface GameOverModalProps {
  levelTitle: string;
  score: number;
  onRetry: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  levelTitle,
  score,
  onRetry,
  onHome
}) => {
  useEffect(() => {
    sounds.playGameOver();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-red-500/80 rounded-2xl shadow-2xl p-6 md:p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-red-950/80 border border-red-500/50 p-3 text-red-400 flex items-center justify-center">
          <HeartCrack className="w-10 h-10 animate-pulse" />
        </div>

        <h2 className="font-pixel text-xl sm:text-2xl text-red-500 mb-2">GAME OVER</h2>
        <p className="text-xs text-slate-300 mb-4">
          Nyawamu telah habis di <span className="text-white font-semibold">{levelTitle}</span>.
        </p>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 mb-6">
          <span className="text-[11px] text-slate-400 block mb-1">Skor yang Dikumpulkan:</span>
          <span className="font-pixel text-lg text-amber-400 font-bold">{score} Poin</span>
        </div>

        <p className="text-xs text-sky-300 italic mb-6">
          &ldquo;Kesalahan adalah langkah pertama dalam proses perbaikan algoritma (debugging). Coba lagi dan jangan menyerah!&rdquo;
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onRetry}
            className="w-full sm:flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Level</span>
          </button>
          <button
            onClick={onHome}
            className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
