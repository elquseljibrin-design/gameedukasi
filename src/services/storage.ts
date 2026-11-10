import { INITIAL_QUESTIONS } from '../data/defaultQuestions';
import { EvaluationRecord, Question, StudentProfile, TeacherSettings, GameStats } from '../types/game';

const KEYS = {
  QUESTIONS: 'super_edu_questions_v1',
  SETTINGS: 'super_edu_teacher_settings_v1',
  STUDENT: 'super_edu_current_student_v1',
  PROGRESS: 'super_edu_game_progress_v1',
  RECORDS: 'super_edu_eval_records_v1',
  ROOM_RECORDS: 'super_edu_room_sessions_v1'
};

export const DEFAULT_TEACHER_SETTINGS: TeacherSettings = {
  schoolName: 'SMP NEGERI NUSANTARA',
  schoolLogoText: '🎓 SMPN NUSANTARA',
  teacherName: 'Bapak Ahmad Fauzi, S.Kom.',
  subject: 'Informatika',
  gradeClass: 'Kelas VIII (Fase D)',
  academicYear: '2026/2027',
  gameTitle: 'SUPER EDU ADVENTURE',
  passCode: 'guru123',
  defaultLives: 3,
  pointsPerCorrect: 100,
  coinBonusPoints: 50,
  levelCompletePoints: 200,
  difficulty: 'medium',
  timeLimitMinutes: 15
};

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  nama: 'Budi Pratama',
  kelas: 'VIII-A',
  absen: '08',
  roomCode: 'INFO8'
};

export const DEFAULT_GAME_STATS: GameStats = {
  totalScore: 0,
  coins: 0,
  lives: 3,
  maxLives: 3,
  correctAnswers: 0,
  wrongAnswers: 0,
  completedLevels: [],
  stars: 0,
  currentWorld: 1,
  currentLevel: 1,
  playTimeSeconds: 0,
  answeredQuestionIds: [],
  hasChampionTitle: false
};

export const storage = {
  // QUESTIONS
  getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(KEYS.QUESTIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    this.saveQuestions(INITIAL_QUESTIONS);
    return INITIAL_QUESTIONS;
  },

  saveQuestions(questions: Question[]) {
    try {
      localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
    } catch {}
  },

  resetQuestionsToDefault(): Question[] {
    this.saveQuestions(INITIAL_QUESTIONS);
    return INITIAL_QUESTIONS;
  },

  // TEACHER SETTINGS
  getTeacherSettings(): TeacherSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_TEACHER_SETTINGS, ...JSON.parse(data) };
      }
    } catch {}
    return DEFAULT_TEACHER_SETTINGS;
  },

  saveTeacherSettings(settings: TeacherSettings) {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
  },

  // STUDENT PROFILE
  getStudentProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(KEYS.STUDENT);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return DEFAULT_STUDENT_PROFILE;
  },

  saveStudentProfile(profile: StudentProfile) {
    try {
      localStorage.setItem(KEYS.STUDENT, JSON.stringify(profile));
    } catch {}
  },

  // GAME PROGRESS
  getGameStats(): GameStats {
    try {
      const data = localStorage.getItem(KEYS.PROGRESS);
      if (data) {
        return { ...DEFAULT_GAME_STATS, ...JSON.parse(data) };
      }
    } catch {}
    return DEFAULT_GAME_STATS;
  },

  saveGameStats(stats: GameStats) {
    try {
      localStorage.setItem(KEYS.PROGRESS, JSON.stringify(stats));
    } catch {}
  },

  resetGameStats(): GameStats {
    const fresh = { ...DEFAULT_GAME_STATS };
    const settings = this.getTeacherSettings();
    fresh.lives = settings.defaultLives;
    fresh.maxLives = settings.defaultLives;
    this.saveGameStats(fresh);
    return fresh;
  },

  // EVALUATION RECORDS
  getEvaluationRecords(): EvaluationRecord[] {
    try {
      const data = localStorage.getItem(KEYS.RECORDS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return [];
  },

  saveEvaluationRecord(record: EvaluationRecord) {
    const list = this.getEvaluationRecords();
    list.unshift(record); // newest first
    try {
      localStorage.setItem(KEYS.RECORDS, JSON.stringify(list));
    } catch {}
  },

  clearEvaluationRecords() {
    try {
      localStorage.removeItem(KEYS.RECORDS);
    } catch {}
  },

  // EXPORT TO CSV
  exportRecordsToCSV(records: EvaluationRecord[]): string {
    const headers = [
      'No',
      'Tanggal/Waktu',
      'Nama Siswa',
      'Kelas',
      'No Absen',
      'Kode Ruang',
      'Level Selesai',
      'Skor Total',
      'Koin',
      'Benar',
      'Salah',
      'Total Soal',
      'Nilai (0-100)',
      'Ketuntasan (%)',
      'Waktu (detik)',
      'Keterangan'
    ];

    const rows = records.map((r, idx) => [
      idx + 1,
      `"${new Date(r.timestamp).toLocaleString('id-ID')}"`,
      `"${r.student.nama}"`,
      `"${r.student.kelas}"`,
      `"${r.student.absen}"`,
      `"${r.roomCode || '-'}"`,
      `"${r.completedLevelTitle}"`,
      r.score,
      r.coins,
      r.correctAnswers,
      r.wrongAnswers,
      r.totalQuestions,
      r.grade,
      `${r.masteryPercent}%`,
      r.playTimeSeconds,
      `"${r.statusKeterangan}"`
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }
};
