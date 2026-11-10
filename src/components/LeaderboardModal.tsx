import React, { useState } from 'react';
import { storage } from '../services/storage';
import { EvaluationRecord } from '../types/game';
import { X, Trophy, Medal, Search, Filter } from 'lucide-react';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [records] = useState<EvaluationRecord[]>(storage.getEvaluationRecords());
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRecords = records
    .filter((r) => {
      const matchClass = selectedClass === 'ALL' || r.student.kelas === selectedClass;
      const matchSearch =
        !searchQuery ||
        r.student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.student.absen.includes(searchQuery) ||
        (r.roomCode && r.roomCode.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchClass && matchSearch;
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-pixel text-base text-amber-400">PAPAN PERINGKAT PETUALANG</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa / ruang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
            >
              <option value="ALL">Semua Kelas</option>
              <option value="VIII-A">Kelas VIII-A</option>
              <option value="VIII-B">Kelas VIII-B</option>
              <option value="VIII-C">Kelas VIII-C</option>
              <option value="VIII-D">Kelas VIII-D</option>
              <option value="VIII-E">Kelas VIII-E</option>
              <option value="VIII-F">Kelas VIII-F</option>
            </select>
          </div>
        </div>

        {/* Table / List */}
        <div className="p-4 overflow-y-auto flex-1">
          {filteredRecords.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p>Belum ada rekaman skor permainan.</p>
              <p className="text-xs text-slate-600 mt-1">
                Selesaikan level untuk mencatatkan namamu di papan peringkat!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Peringkat</th>
                    <th className="py-2.5 px-3">Siswa</th>
                    <th className="py-2.5 px-3">Kelas / Absen</th>
                    <th className="py-2.5 px-3">Level</th>
                    <th className="py-2.5 px-3">Nilai Soal</th>
                    <th className="py-2.5 px-3">Skor Total</th>
                    <th className="py-2.5 px-3">Koin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {filteredRecords.map((r, idx) => (
                    <tr
                      key={r.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        idx === 0
                          ? 'bg-amber-500/10'
                          : idx === 1
                          ? 'bg-slate-300/5'
                          : idx === 2
                          ? 'bg-amber-700/10'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-bold">
                          {idx === 0 && <Medal className="w-4 h-4 text-amber-400" />}
                          {idx === 1 && <Medal className="w-4 h-4 text-slate-300" />}
                          {idx === 2 && <Medal className="w-4 h-4 text-amber-700" />}
                          <span className="font-mono">#{idx + 1}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">{r.student.nama}</td>
                      <td className="py-3 px-3">
                        <span className="text-slate-400">
                          {r.student.kelas} · No. {r.student.absen}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sky-400">{r.completedLevelTitle}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            r.grade >= 75
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                        >
                          {r.grade} / 100
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">{r.score}</td>
                      <td className="py-3 px-3 font-mono text-yellow-300">🪙 {r.coins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
