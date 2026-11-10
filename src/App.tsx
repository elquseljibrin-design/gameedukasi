/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { GameShell } from './components/GameShell';
import { WorldSelectModal } from './components/WorldSelectModal';
import { GameGuideModal } from './components/GameGuideModal';
import { LearningMaterialModal } from './components/LearningMaterialModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { LevelConfig, StudentProfile, TeacherSettings, GameStats } from './types/game';
import { storage } from './services/storage';
import { WORLDS_DATA } from './data/worldsConfig';

export default function App() {
  const [view, setView] = useState<'MENU' | 'PLAYING'>('MENU');
  const [student, setStudent] = useState<StudentProfile>(storage.getStudentProfile());
  const [settings, setSettings] = useState<TeacherSettings>(storage.getTeacherSettings());
  const [gameStats, setGameStats] = useState<GameStats>(storage.getGameStats());

  // Active level to play
  const [activeLevel, setActiveLevel] = useState<LevelConfig>(WORLDS_DATA[0].levels[0]);

  // Modal visibility states
  const [worldSelectOpen, setWorldSelectOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [requireProfileBeforePlay, setRequireProfileBeforePlay] = useState(false);

  // Sync settings & stats
  const refreshData = () => {
    setSettings(storage.getTeacherSettings());
    setStudent(storage.getStudentProfile());
    setGameStats(storage.getGameStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handler for Start Adventure
  const handleStartGame = () => {
    // If student name is empty, open profile modal first
    if (!student.nama || student.nama === 'Budi Pratama') {
      setRequireProfileBeforePlay(true);
      setProfileOpen(true);
      return;
    }
    // Resume from first uncompleted level or World 1 Level 1
    const firstUncompleted =
      WORLDS_DATA.flatMap((w) => w.levels).find(
        (lvl) => !gameStats.completedLevels.includes(lvl.id)
      ) || WORLDS_DATA[0].levels[0];

    setActiveLevel(firstUncompleted);
    setView('PLAYING');
  };

  // Handler for direct level selection
  const handleSelectLevel = (level: LevelConfig) => {
    setActiveLevel(level);
    setWorldSelectOpen(false);
    setView('PLAYING');
  };

  // Handler for proceed to next level in game
  const handleNextLevel = (nextLevel: LevelConfig) => {
    setActiveLevel(nextLevel);
  };

  // Handler for saving game stats
  const handleUpdateStats = (newStats: GameStats) => {
    setGameStats(newStats);
    storage.saveGameStats(newStats);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans">
      {view === 'MENU' ? (
        <MainMenu
          onStartGame={handleStartGame}
          onOpenWorldSelect={() => setWorldSelectOpen(true)}
          onOpenGuide={() => setGuideOpen(true)}
          onOpenMaterials={() => setMaterialsOpen(true)}
          onOpenLeaderboard={() => setLeaderboardOpen(true)}
          onOpenProfile={() => {
            setRequireProfileBeforePlay(false);
            setProfileOpen(true);
          }}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenAdmin={() => setAdminOpen(true)}
          studentName={student.nama}
          studentClass={student.kelas}
        />
      ) : (
        <GameShell
          level={activeLevel}
          student={student}
          settings={settings}
          gameStats={gameStats}
          onUpdateStats={handleUpdateStats}
          onExitToMenu={() => setView('MENU')}
          onNextLevel={handleNextLevel}
        />
      )}

      {/* OVERLAY MODALS */}
      {worldSelectOpen && (
        <WorldSelectModal
          completedLevels={gameStats.completedLevels}
          stars={gameStats.stars}
          onSelectLevel={handleSelectLevel}
          onClose={() => setWorldSelectOpen(false)}
        />
      )}

      {guideOpen && <GameGuideModal onClose={() => setGuideOpen(false)} />}

      {materialsOpen && <LearningMaterialModal onClose={() => setMaterialsOpen(false)} />}

      {leaderboardOpen && <LeaderboardModal onClose={() => setLeaderboardOpen(false)} />}

      {profileOpen && (
        <StudentProfileModal
          currentProfile={student}
          requiredBeforePlay={requireProfileBeforePlay}
          onSave={(updated) => {
            setStudent(updated);
            if (requireProfileBeforePlay) {
              setRequireProfileBeforePlay(false);
              setView('PLAYING');
            }
          }}
          onClose={() => {
            setProfileOpen(false);
            setRequireProfileBeforePlay(false);
          }}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          onResetGame={() => {
            setGameStats(storage.getGameStats());
          }}
        />
      )}

      {adminOpen && (
        <TeacherDashboard
          onClose={() => setAdminOpen(false)}
          onRefreshData={refreshData}
        />
      )}
    </div>
  );
}
