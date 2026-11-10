import React, { useState } from 'react';
import { storage } from '../services/storage';
import { sounds } from '../services/soundEffects';
import { X, Settings, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  onResetGame: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onResetGame }) => {
  const [bgm, setBgm] = useState(sounds.isBgmEnabled());
  const [sfx, setSfx] = useState(sounds.isSfxEnabled());
  const [volume, setVolume] = useState(Math.round(sounds.getVolume() * 100));

  const handleBgmToggle = () => {
    const next = !bgm;
    setBgm(next);
    sounds.setBgmEnabled(next);
  };

  const handleSfxToggle = () => {
    const next = !sfx;
    setSfx(next);
    sounds.setSfxEnabled(next);
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    sounds.setVolume(newVal / 100);
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang progres permainan? Data level yang selesai akan dimulai kembali.')) {
      storage.resetGameStats();
      onResetGame();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            <h2 className="font-pixel text-base text-slate-200">PENGATURAN</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-sm">
          {/* Volume Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Volume Audio</span>
              </span>
              <span className="font-mono text-amber-400">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* BGM Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="font-semibold text-xs text-slate-200 block">Musik Latar (BGM)</span>
              <span className="text-[11px] text-slate-400">Musik petualangan 8-bit per dunia</span>
            </div>
            <button
              onClick={handleBgmToggle}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                bgm ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {bgm ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* SFX Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="font-semibold text-xs text-slate-200 block">Efek Suara (SFX)</span>
              <span className="text-[11px] text-slate-400">Lompat, koin, jawaban benar/salah</span>
            </div>
            <button
              onClick={handleSfxToggle}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                sfx ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {sfx ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Reset Progress */}
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 bg-red-950/40 hover:bg-red-950/70 border border-red-800/60 text-red-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Progres Petualangan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
