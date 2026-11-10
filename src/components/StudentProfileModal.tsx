import React, { useState } from 'react';
import { StudentProfile } from '../types/game';
import { storage } from '../services/storage';
import { X, User, Save, Users } from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface StudentProfileModalProps {
  currentProfile: StudentProfile;
  onSave: (profile: StudentProfile) => void;
  onClose: () => void;
  requiredBeforePlay?: boolean;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  currentProfile,
  onSave,
  onClose,
  requiredBeforePlay = false
}) => {
  const [nama, setNama] = useState(currentProfile.nama || '');
  const [kelas, setKelas] = useState(currentProfile.kelas || 'VIII-A');
  const [absen, setAbsen] = useState(currentProfile.absen || '01');
  const [roomCode, setRoomCode] = useState(currentProfile.roomCode || 'INFO8');
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError('Nama lengkap wajib diisi!');
      return;
    }
    if (!absen.trim()) {
      setError('Nomor absen wajib diisi!');
      return;
    }

    const updated: StudentProfile = {
      nama: nama.trim(),
      kelas: kelas.trim(),
      absen: absen.trim(),
      roomCode: roomCode.trim().toUpperCase()
    };

    storage.saveStudentProfile(updated);
    sounds.playCoin();
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <h2 className="font-pixel text-base text-indigo-400">PROFIL SISWA</h2>
          </div>
          {!requiredBeforePlay && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/70 border border-red-500 text-red-200 text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Nama Lengkap Siswa:
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Pratama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Kelas:
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="VIII-A">Kelas VIII-A</option>
                <option value="VIII-B">Kelas VIII-B</option>
                <option value="VIII-C">Kelas VIII-C</option>
                <option value="VIII-D">Kelas VIII-D</option>
                <option value="VIII-E">Kelas VIII-E</option>
                <option value="VIII-F">Kelas VIII-F</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nomor Absen:
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 08"
                value={absen}
                onChange={(e) => setAbsen(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Kode Ruang Kelas (Opsional):</span>
              </label>
              <span className="text-[10px] text-slate-500">Untuk rekap sekelas</span>
            </div>
            <input
              type="text"
              placeholder="Contoh: INFO8 atau KLS8A"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 font-mono uppercase focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{requiredBeforePlay ? 'Simpan & Mulai Main' : 'Simpan Profil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
