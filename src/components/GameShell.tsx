import React, { useState, useEffect, useCallback } from 'react';
import { GameCanvas } from '../game/GameCanvas';
import { LevelConfig, Question, GameStats, StudentProfile, TeacherSettings, EvaluationRecord } from '../types/game';
import { storage } from '../services/storage';
import { sounds } from '../services/soundEffects';
import { QuestionModal } from './QuestionModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { GameOverModal } from './GameOverModal';
import { ChampionModal } from './ChampionModal';
import { Heart, Coins, Volume2, VolumeX, Pause, Play, RotateCcw, Home, Award } from 'lucide-react';
import { WORLDS_DATA } from '../data/worldsConfig';

interface GameShellProps {
  level: LevelConfig;
  student: StudentProfile;
  settings: TeacherSettings;
  gameStats: GameStats;
  onUpdateStats: (newStats: GameStats) => void;
  onExitToMenu: () => void;
  onNextLevel: (nextLvl: LevelConfig) => void;
}

export const GameShell: React.FC<GameShellProps> = ({
  level,
  student,
  settings,
  gameStats,
  onUpdateStats,
  onExitToMenu,
  onNextLevel
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isChampion, setIsChampion] = useState<boolean>(false);

  // Level-specific session counters
  const [levelScore, setLevelScore] = useState<number>(0);
  const [levelCoins, setLevelCoins] = useState<number>(0);
  const [levelCorrect, setLevelCorrect] = useState<number>(0);
  const [levelWrong, setLevelWrong] = useState<number>(0);
  const [levelSeconds, setLevelSeconds] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(sounds.isBgmEnabled());

  // Load level questions
  useEffect(() => {
    const allQuestions = storage.getQuestions();
    const filtered = allQuestions.filter((q) => level.questionIds.includes(q.id));
    setQuestions(filtered.length > 0 ? filtered : allQuestions.slice(0, 2));

    // Reset session trackers for this level
    setLevelScore(0);
    setLevelCoins(0);
    setLevelCorrect(0);
    setLevelWrong(0);
    setLevelSeconds(0);
    setIsLevelComplete(false);
    setIsGameOver(false);
    setIsChampion(false);
    setIsPaused(false);
    setActiveQuestion(null);

    // Start World background music
    sounds.startBGM(level.worldId);

    return () => {
      sounds.stopBGM();
    };
  }, [level]);

  // Level timer
  useEffect(() => {
    if (isPaused || isLevelComplete || isGameOver || isChampion || activeQuestion) return;
    const interval = setInterval(() => {
      setLevelSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuestion, isChampion, isGameOver, isLevelComplete, isPaused]);

  // Keyboard shortcut for ESC pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (!activeQuestion && !isLevelComplete && !isGameOver && !isChampion) {
          setIsPaused((p) => !p);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeQuestion, isChampion, isGameOver, isLevelComplete]);

  // Audio Toggle
  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    sounds.setBgmEnabled(next);
    sounds.setSfxEnabled(next);
  };

  // Collect Coin Handler
  const handleCoinCollect = useCallback((coinsGained: number, bonusPoints: number) => {
    setLevelCoins((prev) => {
      const nextCoins = prev + coinsGained;
      const coinBonus = Math.floor(nextCoins / 10) * settings.coinBonusPoints;
      setLevelScore((sc) => sc + bonusPoints + (nextCoins % 10 === 0 ? 50 : 0));
      return nextCoins;
    });
  }, [settings.coinBonusPoints]);

  // Player Hurt Handler
  const handlePlayerHurt = useCallback(() => {
    onUpdateStats({
      ...gameStats,
      lives: Math.max(0, gameStats.lives - 1)
    });
    if (gameStats.lives - 1 <= 0) {
      setIsGameOver(true);
    }
  }, [gameStats, onUpdateStats]);

  // Enter Question Portal
  const handleEnterQuestionPortal = useCallback((portalIdx: number) => {
    const q = questions[portalIdx % questions.length];
    if (q) {
      setActiveQuestion(q);
      setIsPaused(true);
    }
  }, [questions]);

  // Answer Question
  const handleQuestionAnswer = (correct: boolean) => {
    if (correct) {
      setLevelCorrect((c) => c + 1);
      setLevelScore((s) => s + settings.pointsPerCorrect);
    } else {
      setLevelWrong((w) => w + 1);
      const remainingLives = gameStats.lives - 1;
      onUpdateStats({
        ...gameStats,
        lives: Math.max(0, remainingLives)
      });
      if (remainingLives <= 0) {
        setTimeout(() => {
          setActiveQuestion(null);
          setIsGameOver(true);
        }, 1200);
      }
    }
  };

  // Close Question Modal and Resume
  const handleCloseQuestionModal = () => {
    setActiveQuestion(null);
    setIsPaused(false);
  };

  // Reach Finish Flag
  const handleReachFinish = useCallback(() => {
    const totalQ = levelCorrect + levelWrong;
    // Strict grade calculation based only on questions as requested
    const grade = totalQ > 0 ? Math.round((levelCorrect / totalQ) * 100) : 100;
    const mastery = grade;

    let statusKeterangan: EvaluationRecord['statusKeterangan'] = 'SANGAT BAIK (TUNTAS)';
    if (grade >= 85) {
      statusKeterangan = 'SANGAT BAIK (TUNTAS)';
    } else if (grade >= 75) {
      statusKeterangan = 'BAIK (TUNTAS)';
    } else if (grade >= 60) {
      statusKeterangan = 'CUKUP (REMIDIAL)';
    } else {
      statusKeterangan = 'PERLU BIMBINGAN';
    }

    const newCompleted = Array.from(new Set([...gameStats.completedLevels, level.id]));
    const isWorldCleared = level.levelNumber === 3;
    const newStars = isWorldCleared ? gameStats.stars + 1 : gameStats.stars;
    const totalScoreNow = gameStats.totalScore + levelScore + settings.levelCompletePoints;

    // Save Evaluation Record
    const record: EvaluationRecord = {
      id: `eval-${Date.now()}`,
      timestamp: Date.now(),
      student,
      score: totalScoreNow,
      coins: gameStats.coins + levelCoins,
      correctAnswers: levelCorrect,
      wrongAnswers: levelWrong,
      totalQuestions: totalQ,
      grade,
      masteryPercent: mastery,
      completedLevelId: level.id,
      completedLevelTitle: level.title,
      playTimeSeconds: levelSeconds,
      statusKeterangan,
      roomCode: student.roomCode
    };

    storage.saveEvaluationRecord(record);

    onUpdateStats({
      ...gameStats,
      totalScore: totalScoreNow,
      coins: gameStats.coins + levelCoins,
      correctAnswers: gameStats.correctAnswers + levelCorrect,
      wrongAnswers: gameStats.wrongAnswers + levelWrong,
      completedLevels: newCompleted,
      stars: newStars,
      playTimeSeconds: gameStats.playTimeSeconds + levelSeconds
    });

    if (level.isBossLevel) {
      setIsChampion(true);
    } else {
      setIsLevelComplete(true);
    }
  }, [gameStats, level, levelCoins, levelCorrect, levelScore, levelSeconds, levelWrong, onUpdateStats, settings.levelCompletePoints, student]);

  // Navigate to Next Level
  const handleProceedNextLevel = () => {
    // Find next level in hierarchy
    const currentWorld = WORLDS_DATA.find((w) => w.id === level.worldId);
    if (!currentWorld) return;

    if (level.levelNumber < 3) {
      const next = currentWorld.levels.find((l) => l.levelNumber === level.levelNumber + 1);
      if (next) onNextLevel(next);
    } else if (level.worldId < 5) {
      const nextWorld = WORLDS_DATA.find((w) => w.id === level.worldId + 1);
      if (nextWorld && nextWorld.levels[0]) {
        onNextLevel(nextWorld.levels[0]);
      }
    } else {
      onExitToMenu();
    }
  };

  // Restart Level
  const handleRestartLevel = () => {
    onUpdateStats({
      ...gameStats,
      lives: settings.defaultLives
    });
    setLevelScore(0);
    setLevelCoins(0);
    setLevelCorrect(0);
    setLevelWrong(0);
    setLevelSeconds(0);
    setIsGameOver(false);
    setIsLevelComplete(false);
    setIsChampion(false);
    setIsPaused(false);
    setActiveQuestion(null);
  };

  // Calculate live grade
  const totalQuestionsDone = levelCorrect + levelWrong;
  const currentGrade = totalQuestionsDone > 0 ? Math.round((levelCorrect / totalQuestionsDone) * 100) : 100;

  return (
    <div className="relative w-screen h-screen flex flex-col justify-between bg-slate-950 overflow-hidden select-none">
      {/* ==================================================== */}
      {/* TOP HUD (World-Matched, Low-Occlusion) */}
      {/* ==================================================== */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-2.5 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-4">
        {/* Left: Player & Lives */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
            {Array.from({ length: settings.defaultLives }).map((_, idx) => (
              <Heart
                key={idx}
                className={`w-5 h-5 transition-all ${
                  idx < gameStats.lives
                    ? 'text-red-500 fill-red-500 drop-shadow'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {student.nama}
            </span>
            <span className="text-xs text-sky-400 font-semibold">{level.title}</span>
          </div>
        </div>

        {/* Center: Live Metrics */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono tabular-nums text-xs sm:text-sm">
          {/* Score */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-sans text-xs">SKOR:</span>
            <span className="font-bold text-amber-400 font-pixel text-xs sm:text-sm">
              {gameStats.totalScore + levelScore}
            </span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1 text-yellow-300">
            <Coins className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold">{gameStats.coins + levelCoins}</span>
          </div>

          {/* Question Accuracy */}
          <div className="hidden md:flex items-center gap-1 text-emerald-400">
            <Award className="w-4 h-4" />
            <span>
              {levelCorrect} / {totalQuestionsDone} Soal
            </span>
          </div>
        </div>

        {/* Right: Controls & Pause */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title={audioEnabled ? 'Mute' : 'Unmute'}
            aria-label="Toggle Audio"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => setIsPaused((p) => !p)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            aria-label="Pause"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline">{isPaused ? 'Lanjut' : 'Jeda'}</span>
          </button>
        </div>
      </header>

      {/* ==================================================== */}
      {/* 2D CANVAS PLAYFIELD */}
      {/* ==================================================== */}
      <main className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        <GameCanvas
          level={level}
          onCoinCollect={handleCoinCollect}
          onEnterQuestionPortal={handleEnterQuestionPortal}
          onReachFinish={handleReachFinish}
          onPlayerHurt={handlePlayerHurt}
          isPaused={isPaused || Boolean(activeQuestion) || isLevelComplete || isGameOver || isChampion}
          lives={gameStats.lives}
        />
      </main>

      {/* ==================================================== */}
      {/* PAUSE MODAL */}
      {/* ==================================================== */}
      {isPaused && !activeQuestion && !isLevelComplete && !isGameOver && !isChampion && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-2xl">
            <h3 className="font-pixel text-base text-amber-400 mb-2">PERMAINAN DIJEDA</h3>
            <p className="text-xs text-slate-400 mb-6">
              Ambil nafas sejenak atau atur strategi petualanganmu!
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Lanjutkan Permainan</span>
              </button>
              <button
                onClick={handleRestartLevel}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Level Ini</span>
              </button>
              <button
                onClick={onExitToMenu}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-red-300 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Keluar ke Menu Utama</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ACTIVE MODALS */}
      {/* ==================================================== */}
      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          onAnswer={handleQuestionAnswer}
          onClose={handleCloseQuestionModal}
        />
      )}

      {isLevelComplete && (
        <LevelCompleteModal
          levelTitle={level.title}
          isWorldCleared={level.levelNumber === 3}
          score={gameStats.totalScore + levelScore + settings.levelCompletePoints}
          coins={gameStats.coins + levelCoins}
          correctAnswers={levelCorrect}
          wrongAnswers={levelWrong}
          grade={currentGrade}
          playTimeSeconds={levelSeconds}
          onNextLevel={handleProceedNextLevel}
          onRetryLevel={handleRestartLevel}
          onHome={onExitToMenu}
        />
      )}

      {isGameOver && (
        <GameOverModal
          levelTitle={level.title}
          score={gameStats.totalScore + levelScore}
          onRetry={handleRestartLevel}
          onHome={onExitToMenu}
        />
      )}

      {isChampion && (
        <ChampionModal
          studentName={student.nama}
          studentClass={student.kelas}
          totalScore={gameStats.totalScore + levelScore + 1000}
          totalCoins={gameStats.coins + levelCoins}
          stars={5}
          onHome={onExitToMenu}
        />
      )}
    </div>
  );
};
