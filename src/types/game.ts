export type WorldId = 1 | 2 | 3 | 4 | 5;

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'sequence_ordering'
  | 'drag_drop'
  | 'fill_pseudocode'
  | 'find_bug'
  | 'problem_solving';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Competency =
  | 'Dekomposisi Masalah'
  | 'Pengenalan Pola'
  | 'Abstraksi'
  | 'Algoritma & Runtutan'
  | 'Pengolahan Data Sederhana'
  | 'Membaca Pseudocode'
  | 'Menemukan & Memperbaiki Bug';

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Question {
  id: string;
  worldId: WorldId;
  difficulty: Difficulty;
  type: QuestionType;
  competency: Competency;
  question: string;
  codeSnippet?: string;
  options?: string[]; // For multiple choice / true-false
  correctAnswer: string | number | string[]; // string for MC/TF/bug, number for index, array of ids for sequence
  explanation: string;
  sequenceItems?: { id: string; text: string }[]; // For sequence ordering
  matchingPairs?: MatchingPair[]; // For drag & drop matching
  fillBlanks?: { template: string; blanks: { id: string; correct: string; options: string[] }[] };
  bugLineIndex?: number; // 1-indexed line number of the bug
}

export interface LevelConfig {
  id: string; // e.g., "1-1", "1-2"
  worldId: WorldId;
  levelNumber: number; // 1, 2, or 3
  title: string;
  subtitle: string;
  objective: string;
  theme: 'forest' | 'mountain' | 'bridge' | 'castle' | 'boss';
  isBossLevel?: boolean;
  length: number; // total level tile width
  questionIds: string[];
}

export interface WorldConfig {
  id: WorldId;
  title: string;
  themeName: string;
  description: string;
  competencies: string[];
  bannerImage: string;
  levels: LevelConfig[];
}

export interface StudentProfile {
  nama: string;
  kelas: string;
  absen: string;
  roomCode?: string;
}

export interface GameStats {
  totalScore: number;
  coins: number;
  lives: number;
  maxLives: number;
  correctAnswers: number;
  wrongAnswers: number;
  completedLevels: string[]; // ["1-1", "1-2"]
  stars: number;
  currentWorld: WorldId;
  currentLevel: number;
  playTimeSeconds: number;
  answeredQuestionIds: string[];
  hasChampionTitle?: boolean;
}

export interface EvaluationRecord {
  id: string;
  timestamp: number;
  student: StudentProfile;
  score: number;
  coins: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  grade: number; // 0 - 100 based on questions
  masteryPercent: number; // 0 - 100
  completedLevelId: string;
  completedLevelTitle: string;
  playTimeSeconds: number;
  statusKeterangan: 'SANGAT BAIK (TUNTAS)' | 'BAIK (TUNTAS)' | 'CUKUP (REMIDIAL)' | 'PERLU BIMBINGAN';
  roomCode?: string;
}

export interface TeacherSettings {
  schoolName: string;
  schoolLogoText: string;
  teacherName: string;
  subject: string;
  gradeClass: string;
  academicYear: string;
  gameTitle: string;
  passCode: string;
  defaultLives: number;
  pointsPerCorrect: number;
  coinBonusPoints: number;
  levelCompletePoints: number;
  difficulty: Difficulty;
  timeLimitMinutes: number;
}
