import React, { useState, useRef } from 'react';
import { storage } from '../services/storage';
import { Question, TeacherSettings, EvaluationRecord, Difficulty, QuestionType, Competency } from '../types/game';
import {
  X,
  ShieldCheck,
  BookOpen,
  Settings,
  Users,
  Download,
  Printer,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle,
  FileSpreadsheet,
  Search,
  Filter
} from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface TeacherDashboardProps {
  onClose: () => void;
  onRefreshData: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onClose, onRefreshData }) => {
  const [settings, setSettings] = useState<TeacherSettings>(storage.getTeacherSettings());
  const [questions, setQuestions] = useState<Question[]>(storage.getQuestions());
  const [records, setRecords] = useState<EvaluationRecord[]>(storage.getEvaluationRecords());

  // Password Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'recap' | 'questions' | 'settings'>('recap');

  // Filter & Search states for recap
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Print view state
  const [printRecord, setPrintRecord] = useState<EvaluationRecord | null>(null);

  // Question editing / adding state
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === settings.passCode || passwordInput === 'guru123') {
      setIsAuthenticated(true);
      setPasswordError('');
      sounds.playCoin();
    } else {
      setPasswordError('Password salah! Default password adalah: guru123');
      sounds.playWrong();
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveTeacherSettings(settings);
    alert('Pengaturan sekolah & game berhasil disimpan!');
    onRefreshData();
  };

  // Delete Question
  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Hapus soal ini dari bank soal game?')) {
      const updated = questions.filter((q) => q.id !== id);
      setQuestions(updated);
      storage.saveQuestions(updated);
      onRefreshData();
    }
  };

  // Save Question (Add or Edit)
  const handleSaveQuestion = (q: Question) => {
    let updated: Question[];
    if (isNewQuestion) {
      updated = [q, ...questions];
    } else {
      updated = questions.map((item) => (item.id === q.id ? q : item));
    }
    setQuestions(updated);
    storage.saveQuestions(updated);
    setEditingQuestion(null);
    setIsNewQuestion(false);
    onRefreshData();
  };

  // Export Questions to JSON
  const handleExportQuestions = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `soal_super_edu_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  };

  // Import Questions from JSON
  const handleImportQuestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setQuestions(parsed);
          storage.saveQuestions(parsed);
          alert(`Berhasil mengimpor ${parsed.length} soal!`);
          onRefreshData();
        } else {
          alert('Format file JSON tidak valid!');
        }
      } catch {
        alert('Gagal membaca file JSON!');
      }
    };
    reader.readAsText(file);
  };

  // Export Results to CSV
  const handleExportCSV = () => {
    const csvContent = storage.exportRecordsToCSV(records);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap_nilai_informatika_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Single Report
  const triggerPrint = (record: EvaluationRecord) => {
    setPrintRecord(record);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Password Modal
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="font-pixel text-sm text-emerald-400">LOGIN GURU / ADMIN</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded bg-slate-800 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="mt-4 space-y-4">
            <p className="text-xs text-slate-300">
              Masukkan password pengajar untuk mengelola bank soal, pengaturan evaluasi, dan melihat rekap hasil belajar siswa.
            </p>

            {passwordError && (
              <div className="p-2.5 bg-red-950/80 border border-red-500 text-red-200 text-xs rounded-lg">
                {passwordError}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Password Guru:
              </label>
              <input
                type="password"
                placeholder="Default: guru123"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all"
            >
              Masuk Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchClass = selectedClass === 'ALL' || r.student.kelas === selectedClass;
    const matchSearch =
      !searchQuery ||
      r.student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.student.absen.includes(searchQuery);
    return matchClass && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="font-pixel text-sm text-emerald-400">
                PANEL ADMINISTRATOR GURU INFORMATIKA
              </h2>
              <span className="text-xs text-slate-400">
                {settings.schoolName} · {settings.teacherName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-800 bg-slate-900/80 shrink-0">
          <button
            onClick={() => setActiveTab('recap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'recap'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Rekap Hasil Belajar Siswa ({records.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'questions'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Bank Soal & Jawaban ({questions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan Sekolah & Game</span>
          </button>
        </div>

        {/* Tab 1: REKAP HASIL BELAJAR SISWA */}
        {activeTab === 'recap' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari siswa atau absen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none"
                  />
                </div>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                >
                  <option value="ALL">Semua Kelas</option>
                  <option value="VIII-A">VIII-A</option>
                  <option value="VIII-B">VIII-B</option>
                  <option value="VIII-C">VIII-C</option>
                  <option value="VIII-D">VIII-D</option>
                  <option value="VIII-E">VIII-E</option>
                  <option value="VIII-F">VIII-F</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Unduh CSV</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Hapus seluruh riwayat rekap evaluasi siswa?')) {
                      storage.clearEvaluationRecords();
                      setRecords([]);
                    }
                  }}
                  className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900 border border-red-800 text-red-300 rounded-lg text-xs transition-colors"
                >
                  Bersihkan Rekap
                </button>
              </div>
            </div>

            {/* Table */}
            {filteredRecords.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm">
                <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p>Belum ada data hasil belajar siswa.</p>
                <p className="text-xs text-slate-600 mt-1">
                  Data akan otomatis masuk setelah siswa menyelesaikan level atau kuis permainan.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/50">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                      <th className="py-3 px-3">Tanggal</th>
                      <th className="py-3 px-3">Siswa</th>
                      <th className="py-3 px-3">Kelas/Absen</th>
                      <th className="py-3 px-3">Level Selesai</th>
                      <th className="py-3 px-3">Benar / Salah</th>
                      <th className="py-3 px-3">Nilai Akhir (0-100)</th>
                      <th className="py-3 px-3">Skor & Koin</th>
                      <th className="py-3 px-3">Keterangan</th>
                      <th className="py-3 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 text-slate-400">
                          {new Date(r.timestamp).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-white">{r.student.nama}</td>
                        <td className="py-2.5 px-3">
                          {r.student.kelas} · No. {r.student.absen}
                        </td>
                        <td className="py-2.5 px-3 text-sky-400">{r.completedLevelTitle}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-emerald-400 font-bold">{r.correctAnswers}</span> /{' '}
                          <span className="text-red-400">{r.wrongAnswers}</span>
                        </td>
                        <td className="py-2.5 px-3 font-bold font-mono">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              r.grade >= 75
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-red-950 text-red-400 border border-red-800'
                            }`}
                          >
                            {r.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-amber-400">
                          {r.score} pts · 🪙 {r.coins}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[10px] font-semibold ${
                              r.grade >= 75 ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {r.statusKeterangan}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => triggerPrint(r)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300"
                            title="Cetak Rapor Evaluasi Siswa"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: BANK SOAL & JAWABAN */}
        {activeTab === 'questions' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsNewQuestion(true);
                    setEditingQuestion({
                      id: `custom-q-${Date.now()}`,
                      worldId: 1,
                      difficulty: 'medium',
                      type: 'multiple_choice',
                      competency: 'Berpikir Komputasional' as Competency,
                      question: '',
                      options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
                      correctAnswer: 'Pilihan A',
                      explanation: ''
                    });
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Soal Baru</span>
                </button>

                <button
                  onClick={handleExportQuestions}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Ekspor JSON</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5"
                >
                  <span>Impor JSON</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportQuestions}
                  accept=".json"
                  className="hidden"
                />
              </div>

              <button
                onClick={() => {
                  if (window.confirm('Kembalikan seluruh bank soal ke setelan bawaan fase D?')) {
                    const defs = storage.resetQuestionsToDefault();
                    setQuestions(defs);
                    onRefreshData();
                  }
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Reset Soal Bawaan
              </button>
            </div>

            {/* Question List */}
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-400 font-bold">
                        #{idx + 1}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                        World {q.worldId}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {q.type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {q.competency}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setIsNewQuestion(false);
                          setEditingQuestion({ ...q });
                        }}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-200 font-medium">{q.question}</p>

                  {q.codeSnippet && (
                    <pre className="p-2 bg-slate-900 rounded font-mono text-[11px] text-emerald-400 overflow-x-auto">
                      {q.codeSnippet}
                    </pre>
                  )}

                  <div className="text-[11px] text-slate-400 flex flex-wrap gap-2 pt-1 border-t border-slate-800/80">
                    <span className="text-emerald-400">
                      <strong>Kunci: </strong>
                      {typeof q.correctAnswer === 'object'
                        ? JSON.stringify(q.correctAnswer)
                        : String(q.correctAnswer)}
                    </span>
                    <span>·</span>
                    <span className="italic truncate max-w-md">
                      <strong>Pembahasan: </strong>
                      {q.explanation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: PENGATURAN SEKOLAH & GAME */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="flex-1 p-6 overflow-y-auto space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nama Sekolah / Madrasah:
                </label>
                <input
                  type="text"
                  value={settings.schoolName}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nama Guru Pengampu:
                </label>
                <input
                  type="text"
                  value={settings.teacherName}
                  onChange={(e) => setSettings({ ...settings, teacherName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Mata Pelajaran:
                </label>
                <input
                  type="text"
                  value={settings.subject}
                  onChange={(e) => setSettings({ ...settings, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Kelas / Fase:
                </label>
                <input
                  type="text"
                  value={settings.gradeClass}
                  onChange={(e) => setSettings({ ...settings, gradeClass: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Tahun Ajaran:
                </label>
                <input
                  type="text"
                  value={settings.academicYear}
                  onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Password Guru Dashboard:
                </label>
                <input
                  type="text"
                  value={settings.passCode}
                  onChange={(e) => setSettings({ ...settings, passCode: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 mb-3">
                Aturan Permainan & Parameter Evaluasi
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Nyawa Awal:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.defaultLives}
                    onChange={(e) =>
                      setSettings({ ...settings, defaultLives: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Poin Soal Benar:</label>
                  <input
                    type="number"
                    value={settings.pointsPerCorrect}
                    onChange={(e) =>
                      setSettings({ ...settings, pointsPerCorrect: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Bonus Tiap 10 Koin:</label>
                  <input
                    type="number"
                    value={settings.coinBonusPoints}
                    onChange={(e) =>
                      setSettings({ ...settings, coinBonusPoints: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Tingkat Kesulitan:</label>
                  <select
                    value={settings.difficulty}
                    onChange={(e) =>
                      setSettings({ ...settings, difficulty: e.target.value as Difficulty })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="easy">Easy (Dasar & Konsep)</option>
                    <option value="medium">Medium (Penerapan)</option>
                    <option value="hard">Hard (Analisis & HOTS)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Pengaturan</span>
              </button>
            </div>
          </form>
        )}

        {/* MODAL EDIT / ADD QUESTION */}
        {editingQuestion && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-sm text-amber-400">
                  {isNewQuestion ? 'Tambah Soal Baru' : 'Edit Soal'}
                </h3>
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="p-1 rounded bg-slate-800 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Dunia (World 1 - 5):</label>
                    <select
                      value={editingQuestion.worldId}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          worldId: Number(e.target.value) as 1 | 2 | 3 | 4 | 5
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                    >
                      <option value={1}>World 1: The Forest of Data</option>
                      <option value={2}>World 2: The Logic Mountain</option>
                      <option value={3}>World 3: The Algorithm Bridge</option>
                      <option value={4}>World 4: The Pseudocode Castle</option>
                      <option value={5}>World 5: The Final Boss Challenge</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Tingkat Kesulitan:</label>
                    <select
                      value={editingQuestion.difficulty}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          difficulty: e.target.value as Difficulty
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Teks Pertanyaan / Soal:</label>
                  <textarea
                    rows={3}
                    value={editingQuestion.question}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, question: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">
                    Potongan Kode / Pseudocode (Opsional):
                  </label>
                  <textarea
                    rows={3}
                    value={editingQuestion.codeSnippet || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, codeSnippet: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-[11px] text-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Kunci Jawaban Tepat:</label>
                  <input
                    type="text"
                    value={String(editingQuestion.correctAnswer)}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Penjelasan / Pembahasan:</label>
                  <textarea
                    rows={2}
                    value={editingQuestion.explanation}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setEditingQuestion(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleSaveQuestion(editingQuestion)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                  >
                    Simpan Soal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRINT REPORT CARD TEMPLATE (Shown when printing) */}
        {printRecord && (
          <div className="hidden print:block print-page p-8 text-black bg-white">
            <div className="text-center border-b-2 border-black pb-4 mb-6">
              <h2 className="text-xl font-bold uppercase">{settings.schoolName}</h2>
              <h3 className="text-base font-semibold">
                LAPORAN HASIL EVALUASI PEMBELAJARAN INFORMATIKA FASE D
              </h3>
              <p className="text-xs text-gray-700">
                Media Evaluasi: SUPER EDU ADVENTURE · Tahun Ajaran {settings.academicYear}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-6 border p-4">
              <div>
                <p><strong>Nama Siswa:</strong> {printRecord.student.nama}</p>
                <p><strong>Kelas:</strong> {printRecord.student.kelas}</p>
                <p><strong>Nomor Absen:</strong> {printRecord.student.absen}</p>
              </div>
              <div>
                <p><strong>Guru Pengampu:</strong> {settings.teacherName}</p>
                <p><strong>Mata Pelajaran:</strong> {settings.subject}</p>
                <p><strong>Tanggal Pengerjaan:</strong> {new Date(printRecord.timestamp).toLocaleString('id-ID')}</p>
              </div>
            </div>

            <table className="w-full border-collapse border border-black text-xs mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-2">Komponen Evaluasi</th>
                  <th className="border border-black p-2">Hasil Capaian</th>
                  <th className="border border-black p-2">Standar KKM</th>
                  <th className="border border-black p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2">Nilai Akhir Soal Informatika</td>
                  <td className="border border-black p-2 font-bold text-center">{printRecord.grade} / 100</td>
                  <td className="border border-black p-2 text-center">75</td>
                  <td className="border border-black p-2 font-bold text-center">
                    {printRecord.grade >= 75 ? 'TUNTAS' : 'REMIDIAL'}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">Jawaban Benar / Salah</td>
                  <td className="border border-black p-2 text-center">
                    {printRecord.correctAnswers} Benar / {printRecord.wrongAnswers} Salah
                  </td>
                  <td className="border border-black p-2 text-center">-</td>
                  <td className="border border-black p-2 text-center">-</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">Skor Petualangan Game</td>
                  <td className="border border-black p-2 text-center">{printRecord.score} Poin</td>
                  <td className="border border-black p-2 text-center">-</td>
                  <td className="border border-black p-2 text-center">🪙 {printRecord.coins} Koin</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">Level Pembelajaran</td>
                  <td className="border border-black p-2 text-center" colSpan={3}>
                    {printRecord.completedLevelTitle}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="border p-3 text-xs mb-8">
              <p><strong>Keterangan Hasil Belajar:</strong> {printRecord.statusKeterangan}</p>
            </div>

            <div className="flex justify-between text-xs pt-8">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p>Orang Tua / Wali Siswa</p>
                <div className="h-16"></div>
                <p>( ........................................ )</p>
              </div>

              <div className="text-center">
                <p>Guru Mata Pelajaran Informatika,</p>
                <div className="h-16"></div>
                <p className="font-bold underline">{settings.teacherName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
