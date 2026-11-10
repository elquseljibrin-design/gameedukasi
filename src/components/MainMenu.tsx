import React from 'react';
import { Play, Map, BookOpen, FileText, Trophy, User, Settings, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenWorldSelect: () => void;
  onOpenGuide: () => void;
  onOpenMaterials: () => void;
  onOpenLeaderboard: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  studentName: string;
  studentClass: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenWorldSelect,
  onOpenGuide,
  onOpenMaterials,
  onOpenLeaderboard,
  onOpenProfile,
  onOpenSettings,
  onOpenAdmin,
  studentName,
  studentClass
}) => {
  const [audioOn, setAudioOn] = React.useState(sounds.isBgmEnabled());

  const toggleSound = () => {
    const next = !audioOn;
    setAudioOn(next);
    sounds.setBgmEnabled(next);
    sounds.setSfxEnabled(next);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Background Cover Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/super_edu_cover_1794321813886.jpg"
          alt="Super Edu Adventure Cover"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400/40 shadow-sm shrink-0">
            <img
              src="/src/assets/images/hero_character_avatar_1794321812618.jpg"
              alt="Hero Avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
              Informatika Fase D · Kelas VIII
            </span>
            <span className="text-sm font-semibold text-slate-200">
              {studentName} ({studentClass})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title={audioOn ? 'Matikan Suara' : 'Nyalakan Suara'}
            aria-label="Toggle Audio"
          >
            {audioOn ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
          <button
            onClick={onOpenAdmin}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guru / Admin</span>
          </button>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
        {/* Animated Hero Avatar Centerpiece */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-3 bg-gradient-to-r from-amber-500/30 to-sky-500/30 rounded-full blur-xl animate-pulse" />
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl bg-slate-900 mx-auto">
            <img
              src="/src/assets/images/hero_character_avatar_1794321812618.jpg"
              alt="Adventurer Mascot"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Title Lockup */}
        <div className="mb-2">
          <span className="font-pixel text-xs tracking-widest text-sky-400 uppercase drop-shadow mb-2 block">
            Media Evaluasi Pembelajaran Interaktif
          </span>
          <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 text-shadow-retro mb-3">
            SUPER EDU ADVENTURE
          </h1>
          <p className="font-mono text-xs sm:text-sm text-slate-300 max-w-xl mx-auto italic px-2">
            &ldquo;JELAJAHI DUNIA, PECAHKAN MASALAH, TAKLUKKAN TANTANGAN, JADILAH JUARA INFORMATIKA!&rdquo;
          </p>
        </div>

        {/* Primary Start CTA Button */}
        <div className="mt-6 mb-8 w-full max-w-xs">
          <button
            onClick={() => {
              sounds.playCoin();
              onStartGame();
            }}
            className="w-full py-4 px-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-pixel text-sm sm:text-base rounded-2xl shadow-xl border-2 border-emerald-300 active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            <Play className="w-5 h-5 fill-current text-slate-950 group-hover:scale-110 transition-transform" />
            <span>MULAI PETUALANGAN</span>
          </button>
        </div>

        {/* 6 Sub-Menu Grid Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl px-2">
          <button
            onClick={onOpenWorldSelect}
            className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all hover:border-sky-500/50 flex flex-col items-start gap-1.5"
          >
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Map className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs text-slate-200">Pilih Dunia</span>
            <span className="text-[11px] text-slate-400">5 Dunia & 15 Level</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all hover:border-amber-500/50 flex flex-col items-start gap-1.5"
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs text-slate-200">Panduan Permainan</span>
            <span className="text-[11px] text-slate-400">Kontrol & aturan skor</span>
          </button>

          <button
            onClick={onOpenMaterials}
            className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all hover:border-teal-500/50 flex flex-col items-start gap-1.5"
          >
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs text-slate-200">Materi Pembelajaran</span>
            <span className="text-[11px] text-slate-400">CT & Pseudocode</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all hover:border-yellow-500/50 flex flex-col items-start gap-1.5"
          >
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs text-slate-200">Papan Peringkat</span>
            <span className="text-[11px] text-slate-400">Skor tertinggi siswa</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all hover:border-indigo-500/50 flex flex-col items-start gap-1.5"
          >
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs text-slate-200">Profil Pemain</span>
            <span className="text-[11px] text-slate-400">Nama, kelas & absen</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left transition-all hover:border-slate-500/50 flex flex-col items-start gap-1.5"
          >
            <div className="p-2 rounded-lg bg-slate-500/10 text-slate-400">
              <Settings className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs text-slate-200">Pengaturan</span>
            <span className="text-[11px] text-slate-400">Audio & kesulitan</span>
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full px-6 py-3 border-t border-slate-800/60 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <span>Evaluasi Berpikir Komputasional & Penulisan Pseudocode · Kurikulum Merdeka</span>
        <span className="font-mono">Kontrol: [WASD / Panah] Bergerak · [Spasi] Lompat · [E] Interaksi</span>
      </footer>
    </div>
  );
};
