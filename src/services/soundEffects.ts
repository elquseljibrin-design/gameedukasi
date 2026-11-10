/**
 * Procedural Web Audio API sound generator for retro 8-bit platformer
 * Guaranteed to work offline and without any external asset dependencies.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private sfxEnabled: boolean = true;
  private bgmEnabled: boolean = true;
  private volume: number = 0.5;
  private bgmIntervalId: number | null = null;
  private currentBgmWorld: number = 1;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser policies
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    if (!enabled) {
      this.stopBGM();
    } else {
      this.startBGM(this.currentBgmWorld);
    }
  }

  public isBgmEnabled(): boolean {
    return this.bgmEnabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  // JUMP SOUND
  public playJump() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'square';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);

      gain.gain.setValueAtTime(0.18 * this.volume, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore audio glitches
    }
  }

  // DOUBLE JUMP SOUND
  public playDoubleJump() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.15);

      gain.gain.setValueAtTime(0.22 * this.volume, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  // COIN PICKUP SOUND (Iconic two-tone chime)
  public playCoin() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.setValueAtTime(0.25 * this.volume, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }

  // MYSTERY BLOCK BUMP
  public playBump() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

      gain.gain.setValueAtTime(0.3 * this.volume, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {}
  }

  // STOMP ENEMY
  public playStomp() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);

      gain.gain.setValueAtTime(0.3 * this.volume, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // QUESTION PORTAL ENTER
  public playPortalEnter() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.22);
      });
    } catch {}
  }

  // CORRECT ANSWER (Triumphant cheerful chime)
  public playCorrect() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const melody = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      melody.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.25 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.28);
      });
    } catch {}
  }

  // WRONG ANSWER (Sad buzz / hit)
  public playWrong() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [280, 240, 200];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.1;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2 * this.volume, start);
        gain.gain.linearRampToValueAtTime(0.01, start + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.13);
      });
    } catch {}
  }

  // LEVEL COMPLETE FANFARE
  public playLevelComplete() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.5, d: 0.24 }, // C6
        { f: 880.0, d: 0.14 },  // A5
        { f: 1046.5, d: 0.4 },  // C6
      ];

      let elapsed = 0;
      notes.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + elapsed;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, start);

        gain.gain.setValueAtTime(0.3 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + note.d + 0.05);

        elapsed += note.d * 1.1;
      });
    } catch {}
  }

  // GAME OVER (Descending mournful tune)
  public playGameOver() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [392, 349.23, 329.63, 261.63];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.18;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.22 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {}
  }

  // BOSS HIT
  public playBossHit() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.2);

      gain.gain.setValueAtTime(0.35 * this.volume, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {}
  }

  // RETRO BACKGROUND MUSIC ARPEGGIATOR LOOP
  public startBGM(worldId: number = 1) {
    this.currentBgmWorld = worldId;
    if (!this.bgmEnabled) return;
    this.stopBGM();
    this.initCtx();
    if (!this.ctx) return;

    // Scale patterns per world
    const scales: Record<number, number[]> = {
      1: [261.63, 329.63, 392.0, 523.25, 440.0, 392.0, 329.63, 293.66], // Forest (C major cheerful)
      2: [220.0, 261.63, 293.66, 329.63, 392.0, 329.63, 293.66, 261.63], // Mountain (A minor adventurous)
      3: [293.66, 369.99, 440.0, 587.33, 440.0, 369.99, 329.63, 293.66], // Bridge (D major brisk)
      4: [196.0, 233.08, 293.66, 349.23, 392.0, 349.23, 293.66, 233.08], // Castle (G minor mysterious)
      5: [164.81, 196.0, 220.0, 246.94, 261.63, 246.94, 220.0, 196.0],   // Boss (E minor intense)
    };

    const notes = scales[worldId] || scales[1];
    let step = 0;

    const tick = () => {
      if (!this.bgmEnabled || !this.ctx) return;
      try {
        const freq = notes[step % notes.length];
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // 8-bit pulse wave
        osc.type = worldId === 5 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const noteVol = (worldId === 5 ? 0.08 : 0.06) * this.volume;
        gain.gain.setValueAtTime(noteVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);

        step++;
      } catch {}
    };

    const tempo = worldId === 5 ? 180 : 230; // ms per eighth note
    this.bgmIntervalId = window.setInterval(tick, tempo);
  }

  public stopBGM() {
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }
}

export const sounds = new SoundSystem();
