import React, { useState } from 'react';
import { WORLDS_DATA } from '../data/worldsConfig';
import { WorldId, LevelConfig } from '../types/game';
import { X, Star, Lock, Play, ChevronRight, Award } from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface WorldSelectModalProps {
  completedLevels: string[];
  stars: number;
  onSelectLevel: (level: LevelConfig) => void;
  onClose: () => void;
}

export const WorldSelectModal: React.FC<WorldSelectModalProps> = ({
  completedLevels,
  stars,
  onSelectLevel,
  onClose
}) => {
  const [selectedWorldId, setSelectedWorldId] = useState<WorldId>(1);
  const activeWorld = WORLDS_DATA.find((w) => w.id === selectedWorldId) || WORLDS_DATA[0];

  const isLevelUnlocked = (worldId: WorldId, levelNum: number) => {
    if (worldId === 1 && levelNum === 1) return true;
    if (levelNum === 1) {
      // Unlocked if previous world's level 3 is completed
      const prevWorldId = (worldId - 1) as WorldId;
      return completedLevels.includes(`${prevWorldId}-3`);
    }
    // Unlocked if previous level in same world is completed
    return completedLevels.includes(`${worldId}-${levelNum - 1}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <h2 className="font-pixel text-base text-amber-400">PILIH DUNIA & LEVEL</h2>
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-950/60 border border-amber-600/40 rounded-full text-xs text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold">{stars} Bintang</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* World Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 overflow-x-auto bg-slate-900/60 shrink-0">
          {WORLDS_DATA.map((w) => {
            const isCurrent = w.id === selectedWorldId;
            const isUnlocked = w.id === 1 || completedLevels.includes(`${w.id - 1}-3`);
            return (
              <button
                key={w.id}
                onClick={() => {
                  sounds.playCoin();
                  setSelectedWorldId(w.id);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : isUnlocked
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}
              >
                {!isUnlocked && <Lock className="w-3 h-3 text-slate-500" />}
                <span>World {w.id}</span>
              </button>
            );
          })}
        </div>

        {/* Active World Details */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* World Banner Card */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
            <div className="relative z-10 max-w-xl">
              <span className="text-xs font-pixel text-amber-400 uppercase tracking-widest block mb-1">
                {activeWorld.themeName}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{activeWorld.title}</h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-3">
                {activeWorld.description}
              </p>
              <div className="flex flex-wrap gap-1.5 text-xs text-sky-300">
                {activeWorld.competencies.map((comp, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800/60 text-[11px]"
                  >
                    • {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Levels in this World */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeWorld.levels.map((lvl) => {
              const unlocked = isLevelUnlocked(lvl.worldId, lvl.levelNumber);
              const isCompleted = completedLevels.includes(lvl.id);

              return (
                <div
                  key={lvl.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isCompleted
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : unlocked
                      ? 'bg-slate-800/80 border-slate-700 hover:border-amber-400'
                      : 'bg-slate-950/50 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-pixel text-xs text-amber-400">{lvl.id}</span>
                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                          <Award className="w-4 h-4" />
                          <span>TUNTAS</span>
                        </div>
                      ) : !unlocked ? (
                        <Lock className="w-4 h-4 text-slate-500" />
                      ) : (
                        <span className="text-[11px] text-sky-400 font-semibold">TERBUKA</span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-100 mb-1">{lvl.title}</h4>
                    <p className="text-xs text-slate-400 mb-2">{lvl.subtitle}</p>
                    <p className="text-[11px] text-slate-500 italic mb-4">{lvl.objective}</p>
                  </div>

                  <button
                    disabled={!unlocked}
                    onClick={() => {
                      sounds.playCoin();
                      onSelectLevel(lvl);
                    }}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      unlocked
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? 'Main Ulang' : 'Mainkan Level'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
