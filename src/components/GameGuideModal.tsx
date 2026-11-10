import React from 'react';
import { X, Keyboard, Smartphone, Heart, Coins, HelpCircle, Trophy } from 'lucide-react';

interface GameGuideModalProps {
  onClose: () => void;
}

export const GameGuideModal: React.FC<GameGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="font-pixel text-base text-amber-400">PANDUAN PERMAINAN</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6 text-sm text-slate-300">
          {/* Controls Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Desktop */}
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-sky-400 font-bold mb-3">
                <Keyboard className="w-5 h-5" />
                <span>Kontrol Komputer / Laptop</span>
              </div>
              <ul className="space-y-2 text-xs">
                <li className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Bergerak Kiri / Kanan:</span>
                  <span className="font-mono text-white font-bold">[A / D] atau [Panah ◄ ►]</span>
                </li>
                <li className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Lompat / Double Jump:</span>
                  <span className="font-mono text-white font-bold">[Spasi] atau [W / ▲]</span>
                </li>
                <li className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Masuk Portal Soal:</span>
                  <span className="font-mono text-white font-bold">[E]</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Jeda Permainan:</span>
                  <span className="font-mono text-white font-bold">[ESC]</span>
                </li>
              </ul>
            </div>

            {/* Mobile */}
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-3">
                <Smartphone className="w-5 h-5" />
                <span>Kontrol Smartphone / Tablet</span>
              </div>
              <ul className="space-y-2 text-xs">
                <li className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Tombol Virtual:</span>
                  <span className="font-mono text-white font-bold">D-Pad di layar</span>
                </li>
                <li className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Tombol Lompat:</span>
                  <span className="font-mono text-white font-bold">Tombol [JUMP] hijau</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Tombol Interaksi:</span>
                  <span className="font-mono text-white font-bold">Tombol [E] kuning</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Scoring Rules */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-amber-400 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>Sistem Skor & Aturan Nyawa</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-2 bg-slate-900 rounded-lg">
                <Heart className="w-4 h-4 text-red-400 shrink-0" />
                <span><strong>Nyawa Awal:</strong> 3 kesempatan hati.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 bg-slate-900 rounded-lg">
                <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span><strong>Jawaban Benar:</strong> +100 poin evaluasi.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 bg-slate-900 rounded-lg">
                <Heart className="w-4 h-4 text-slate-500 shrink-0" />
                <span><strong>Jawaban Salah:</strong> -1 nyawa berkurang.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 bg-slate-900 rounded-lg">
                <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Setiap 10 Koin:</strong> Bonus +50 poin.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 bg-slate-900 rounded-lg">
                <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Menyelesaikan Level:</strong> +200 poin.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 bg-slate-900 rounded-lg">
                <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
                <span><strong>Menyelesaikan Dunia:</strong> Mendapatkan 1 Bintang.</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic pt-1">
              Catatan: Nilai akhir siswa (skala 0–100) dihitung secara murni berdasarkan persentase jawaban benar pada soal Informatika untuk memastikan keabsahan evaluasi pembelajaran.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md transition-all"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
