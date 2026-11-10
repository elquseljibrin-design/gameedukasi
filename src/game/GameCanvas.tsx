import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LevelConfig } from '../types/game';
import { sounds } from '../services/soundEffects';

interface GameCanvasProps {
  level: LevelConfig;
  onCoinCollect: (coins: number, bonusPoints: number) => void;
  onEnterQuestionPortal: (questionIndex: number) => void;
  onReachFinish: () => void;
  onPlayerHurt: () => void;
  isPaused: boolean;
  lives: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  active: boolean;
  [key: string]: unknown;
}

interface Enemy extends Entity {
  vx: number;
  vy: number;
  startX: number;
  range: number;
  enemyType: 'slime' | 'bat' | 'spiky' | 'boss';
  hp?: number;
  maxHp?: number;
  isSquashed?: boolean;
  squashTimer?: number;
}

interface MysteryBlock extends Entity {
  hit: boolean;
  bumpOffset: number;
  content: 'coin' | 'portal';
}

interface Coin extends Entity {
  baseY: number;
  floatPhase: number;
}

interface Portal extends Entity {
  questionIndex: number;
  entered: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  onCoinCollect,
  onEnterQuestionPortal,
  onReachFinish,
  onPlayerHurt,
  isPaused,
  lives
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Input states
  const keysRef = useRef<{
    left: boolean;
    right: boolean;
    jump: boolean;
    jumpJustPressed: boolean;
    interact: boolean;
  }>({
    left: false,
    right: false,
    jump: false,
    jumpJustPressed: false,
    interact: false
  });

  // Touch virtual buttons
  const [touchActive, setTouchActive] = useState({
    left: false,
    right: false,
    jump: false,
    interact: false
  });

  // Game internal state held in refs so 60fps loop runs unhindered
  const gameStateRef = useRef({
    cameraX: 0,
    viewportW: 960,
    viewportH: 540,
    player: {
      x: 120,
      y: 350,
      width: 36,
      height: 52,
      vx: 0,
      vy: 0,
      isGrounded: false,
      canDoubleJump: true,
      facingRight: true,
      invincibleTimer: 0,
      animTimer: 0,
      isDead: false,
      squash: 1,
      stretch: 1,
      checkpointX: 120,
      checkpointY: 350
    },
    platforms: [] as { x: number; y: number; width: number; height: number; type: string; moving?: boolean; moveMin?: number; moveMax?: number; moveSpeed?: number }[],
    coins: [] as Coin[],
    mysteryBlocks: [] as MysteryBlock[],
    portals: [] as Portal[],
    enemies: [] as Enemy[],
    particles: [] as Particle[],
    finishFlag: { x: level.length - 200, y: 180, width: 30, height: 260, triggered: false },
    checkpointFlag: { x: Math.floor(level.length * 0.45), y: 320, width: 24, height: 120, activated: false },
    levelWidth: level.length,
    portalNear: null as Portal | null,
    bossDefeated: false
  });

  // Level Generator
  const initLevel = useCallback(() => {
    const s = gameStateRef.current;
    s.levelWidth = level.length;
    s.player.x = 120;
    s.player.y = 350;
    s.player.vx = 0;
    s.player.vy = 0;
    s.player.isDead = false;
    s.player.checkpointX = 120;
    s.player.checkpointY = 350;
    s.finishFlag = { x: level.length - 180, y: 160, width: 30, height: 280, triggered: false };
    s.checkpointFlag = { x: Math.floor(level.length * 0.45), y: 320, width: 24, height: 120, activated: false };
    s.particles = [];
    s.bossDefeated = false;

    // Ground segments & gaps
    const plats: typeof s.platforms = [];
    const coinsArr: Coin[] = [];
    const blocksArr: MysteryBlock[] = [];
    const portalsArr: Portal[] = [];
    const enemiesArr: Enemy[] = [];

    // Base ground with strategic pits
    let curX = 0;
    while (curX < level.length) {
      const segWidth = 500 + Math.random() * 400;
      plats.push({
        x: curX,
        y: 440,
        width: segWidth,
        height: 100,
        type: 'ground'
      });

      // Add decorations, floating islands and stairs
      const islandX = curX + 150 + Math.random() * 100;
      plats.push({
        x: islandX,
        y: 320 - (Math.random() > 0.5 ? 60 : 0),
        width: 140,
        height: 24,
        type: 'island'
      });

      // Coins over islands
      for (let c = 0; c < 3; c++) {
        coinsArr.push({
          x: islandX + 25 + c * 40,
          y: 260,
          baseY: 260,
          floatPhase: Math.random() * Math.PI * 2,
          width: 20,
          height: 20,
          type: 'coin',
          active: true
        });
      }

      // Mystery Blocks
      blocksArr.push({
        x: curX + 320,
        y: 280,
        width: 36,
        height: 36,
        type: 'block',
        active: true,
        hit: false,
        bumpOffset: 0,
        content: Math.random() > 0.4 ? 'coin' : 'portal'
      });

      // Moving platforms
      if (curX > 600 && curX < level.length - 600 && Math.random() > 0.5) {
        plats.push({
          x: curX + 400,
          y: 240,
          width: 110,
          height: 20,
          type: 'moving',
          moving: true,
          moveMin: curX + 360,
          moveMax: curX + 560,
          moveSpeed: 1.5
        });
      }

      // Enemies
      if (curX > 400 && curX < level.length - 400) {
        const eType = Math.random() > 0.6 ? 'bat' : (Math.random() > 0.4 ? 'slime' : 'spiky');
        enemiesArr.push({
          x: curX + 200,
          y: eType === 'bat' ? 220 : 405,
          width: 34,
          height: 34,
          type: 'enemy',
          active: true,
          vx: 1.2 * (Math.random() > 0.5 ? 1 : -1),
          vy: 0,
          startX: curX + 200,
          range: 160,
          enemyType: eType
        });
      }

      // Pit gap
      const gap = curX > level.length - 500 ? 0 : (100 + Math.random() * 80);
      curX += segWidth + gap;
    }

    // Question Portals (distributed evenly across level)
    const portalStep = Math.floor(level.length / (level.questionIds.length + 1));
    level.questionIds.forEach((_, idx) => {
      const pX = portalStep * (idx + 1) + (Math.random() * 100 - 50);
      portalsArr.push({
        x: pX,
        y: 350,
        width: 44,
        height: 70,
        type: 'portal',
        active: true,
        questionIndex: idx,
        entered: false
      });
      // Safety platform under portal
      plats.push({
        x: pX - 40,
        y: 440,
        width: 130,
        height: 100,
        type: 'ground'
      });
    });

    // Special Boss Setup for World 5 Level 3
    if (level.isBossLevel) {
      enemiesArr.push({
        x: level.length - 550,
        y: 340,
        width: 80,
        height: 90,
        type: 'enemy',
        active: true,
        vx: 1.8,
        vy: 0,
        startX: level.length - 550,
        range: 300,
        enemyType: 'boss',
        hp: 3,
        maxHp: 3
      });
    }

    s.platforms = plats;
    s.coins = coinsArr;
    s.mysteryBlocks = blocksArr;
    s.portals = portalsArr;
    s.enemies = enemiesArr;
  }, [level]);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = keysRef.current;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        k.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        k.right = true;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (!k.jump) {
          k.jumpJustPressed = true;
        }
        k.jump = true;
      }
      if (e.code === 'KeyE') {
        k.interact = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = keysRef.current;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        k.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        k.right = false;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        k.jump = false;
      }
      if (e.code === 'KeyE') {
        k.interact = false;
      }
    };

    const handleBlur = () => {
      const k = keysRef.current;
      k.left = false;
      k.right = false;
      k.jump = false;
      k.jumpJustPressed = false;
      k.interact = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Main 60fps Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const spawnParticles = (x: number, y: number, color: string, count: number = 8) => {
      const p = gameStateRef.current.particles;
      for (let i = 0; i < count; i++) {
        p.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.7) * 6,
          color,
          size: Math.random() * 4 + 2,
          alpha: 1,
          life: 1
        });
      }
    };

    const loop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const dt = Math.min(rawDt, 0.05); // clamped delta time

      const canvas = canvasRef.current;
      if (canvas && !isPaused) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const s = gameStateRef.current;
          const k = keysRef.current;
          const p = s.player;

          // Merge touch states with keyboard
          const moveLeft = k.left || touchActive.left;
          const moveRight = k.right || touchActive.right;
          const wantJump = k.jumpJustPressed || touchActive.jump;
          const wantInteract = k.interact || touchActive.interact;

          // Clear jumpJustPressed trigger
          k.jumpJustPressed = false;

          // ----------------------------------------------------
          // 1. UPDATE PHYSICS & PLAYER
          // ----------------------------------------------------
          const ACCEL = 1600;
          const FRICTION = 0.82;
          const GRAVITY = 1100;
          const JUMP_FORCE = -460;
          const MAX_SPEED = 280;

          // Horizontal movement
          if (moveLeft) {
            p.vx -= ACCEL * dt;
            p.facingRight = false;
          } else if (moveRight) {
            p.vx += ACCEL * dt;
            p.facingRight = true;
          } else {
            p.vx *= FRICTION;
            if (Math.abs(p.vx) < 5) p.vx = 0;
          }
          p.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, p.vx));

          // Jump logic (Coyote & Double jump)
          if (wantJump) {
            if (p.isGrounded) {
              p.vy = JUMP_FORCE;
              p.isGrounded = false;
              p.canDoubleJump = true;
              p.squash = 0.8;
              p.stretch = 1.3;
              sounds.playJump();
              spawnParticles(p.x + p.width / 2, p.y + p.height, '#cbd5e1', 5);
            } else if (p.canDoubleJump) {
              p.vy = JUMP_FORCE * 0.9;
              p.canDoubleJump = false;
              p.squash = 0.85;
              p.stretch = 1.25;
              sounds.playDoubleJump();
              spawnParticles(p.x + p.width / 2, p.y + p.height, '#38bdf8', 8);
            }
          }

          // Apply Gravity
          p.vy += GRAVITY * dt;
          p.vy = Math.min(p.vy, 700); // terminal velocity

          // Move player
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          // Squash & stretch recovery
          p.squash += (1 - p.squash) * 0.15;
          p.stretch += (1 - p.stretch) * 0.15;

          // Invincibility countdown
          if (p.invincibleTimer > 0) {
            p.invincibleTimer -= dt;
          }

          // Animation timer
          if (Math.abs(p.vx) > 10) {
            p.animTimer += dt * 12;
          }

          // Level Bounds
          p.x = Math.max(0, Math.min(s.levelWidth - p.width, p.x));

          // Pit Fall Check
          if (p.y > 600) {
            sounds.playWrong();
            onPlayerHurt();
            p.x = p.checkpointX;
            p.y = p.checkpointY;
            p.vx = 0;
            p.vy = 0;
            p.invincibleTimer = 2.0;
          }

          // ----------------------------------------------------
          // 2. PLATFORM COLLISIONS (AABB)
          // ----------------------------------------------------
          p.isGrounded = false;

          for (const plat of s.platforms) {
            // Update moving platforms
            if (plat.moving && plat.moveMin !== undefined && plat.moveMax !== undefined) {
              plat.x += (plat.moveSpeed || 1);
              if (plat.x > plat.moveMax || plat.x < plat.moveMin) {
                plat.moveSpeed = -(plat.moveSpeed || 1);
              }
            }

            // Check Collision
            const prevY = p.y - p.vy * dt;
            const isFalling = p.vy >= 0;

            if (
              p.x + p.width > plat.x &&
              p.x < plat.x + plat.width &&
              prevY + p.height <= plat.y + 6 &&
              p.y + p.height >= plat.y
            ) {
              if (isFalling) {
                p.y = plat.y - p.height;
                p.vy = 0;
                p.isGrounded = true;
                p.canDoubleJump = true;
                // Move with platform if moving
                if (plat.moving) {
                  p.x += (plat.moveSpeed || 1);
                }
              }
            }
          }

          // ----------------------------------------------------
          // 3. MYSTERY BLOCKS (KOTAK MISTERI)
          // ----------------------------------------------------
          for (const block of s.mysteryBlocks) {
            if (block.bumpOffset > 0) {
              block.bumpOffset = Math.max(0, block.bumpOffset - 60 * dt);
            }

            // Hit from below
            if (
              !block.hit &&
              p.vy < 0 &&
              p.x + p.width > block.x + 4 &&
              p.x < block.x + block.width - 4 &&
              p.y < block.y + block.height &&
              p.y > block.y
            ) {
              block.hit = true;
              block.bumpOffset = 12;
              p.vy = 80;
              sounds.playBump();

              if (block.content === 'coin') {
                sounds.playCoin();
                onCoinCollect(1, 10);
                spawnParticles(block.x + 18, block.y - 10, '#fbbf24', 12);
              } else {
                sounds.playPortalEnter();
                spawnParticles(block.x + 18, block.y - 10, '#38bdf8', 15);
                // Trigger available portal question
                const availableIdx = s.portals.findIndex((pt) => !pt.entered);
                if (availableIdx !== -1) {
                  s.portals[availableIdx].entered = true;
                  onEnterQuestionPortal(availableIdx);
                }
              }
            }
          }

          // ----------------------------------------------------
          // 4. COINS PICKUP
          // ----------------------------------------------------
          for (const coin of s.coins) {
            if (!coin.active) continue;
            coin.floatPhase += dt * 4;
            coin.y = coin.baseY + Math.sin(coin.floatPhase) * 6;

            if (
              p.x + p.width > coin.x &&
              p.x < coin.x + coin.width &&
              p.y + p.height > coin.y &&
              p.y < coin.y + coin.height
            ) {
              coin.active = false;
              sounds.playCoin();
              onCoinCollect(1, 0);
              spawnParticles(coin.x + 10, coin.y + 10, '#f59e0b', 8);
            }
          }

          // ----------------------------------------------------
          // 5. QUESTION PORTALS (INTERACTIVE)
          // ----------------------------------------------------
          let nearPortal: Portal | null = null;
          for (const portal of s.portals) {
            if (portal.entered) continue;
            const dist = Math.abs(p.x + p.width / 2 - (portal.x + portal.width / 2));
            if (dist < 50 && Math.abs(p.y - portal.y) < 60) {
              nearPortal = portal;
              if (wantInteract) {
                portal.entered = true;
                sounds.playPortalEnter();
                spawnParticles(portal.x + 22, portal.y + 35, '#38bdf8', 20);
                onEnterQuestionPortal(portal.questionIndex);
                break;
              }
            }
          }
          s.portalNear = nearPortal;

          // ----------------------------------------------------
          // 6. CHECKPOINT FLAG
          // ----------------------------------------------------
          const cp = s.checkpointFlag;
          if (
            !cp.activated &&
            p.x + p.width > cp.x &&
            p.x < cp.x + cp.width + 20 &&
            Math.abs(p.y - cp.y) < 100
          ) {
            cp.activated = true;
            p.checkpointX = cp.x;
            p.checkpointY = cp.y;
            sounds.playCoin();
            spawnParticles(cp.x + 12, cp.y + 20, '#10b981', 15);
          }

          // ----------------------------------------------------
          // 7. FINISH FLAGPOLE
          // ----------------------------------------------------
          const flag = s.finishFlag;
          if (
            !flag.triggered &&
            p.x + p.width > flag.x &&
            p.x < flag.x + flag.width + 10
          ) {
            flag.triggered = true;
            sounds.playLevelComplete();
            spawnParticles(flag.x + 15, flag.y + 50, '#eab308', 30);
            onReachFinish();
          }

          // ----------------------------------------------------
          // 8. ENEMIES UPDATE & STOMP / HURT
          // ----------------------------------------------------
          for (const enemy of s.enemies) {
            if (!enemy.active) continue;

            if (enemy.isSquashed) {
              enemy.squashTimer = (enemy.squashTimer || 0) + dt;
              if (enemy.squashTimer > 0.4) {
                enemy.active = false;
              }
              continue;
            }

            // Movement AI
            if (enemy.enemyType === 'slime' || enemy.enemyType === 'spiky') {
              enemy.x += enemy.vx;
              if (enemy.x > enemy.startX + enemy.range || enemy.x < enemy.startX - enemy.range) {
                enemy.vx = -enemy.vx;
              }
            } else if (enemy.enemyType === 'bat') {
              enemy.x += enemy.vx;
              enemy.y = 220 + Math.sin(currentTime * 0.004 + enemy.startX) * 45;
              if (enemy.x > enemy.startX + enemy.range || enemy.x < enemy.startX - enemy.range) {
                enemy.vx = -enemy.vx;
              }
            } else if (enemy.enemyType === 'boss') {
              enemy.x += enemy.vx;
              if (enemy.x > enemy.startX + enemy.range || enemy.x < enemy.startX - enemy.range) {
                enemy.vx = -enemy.vx;
              }
            }

            // Collision with Player
            if (
              p.x + p.width > enemy.x + 4 &&
              p.x < enemy.x + enemy.width - 4 &&
              p.y + p.height > enemy.y + 4 &&
              p.y < enemy.y + enemy.height
            ) {
              // Stomp check (coming from above and not spiky)
              const wasAbove = p.y + p.height - p.vy * dt <= enemy.y + 14;
              if (wasAbove && p.vy > 0 && enemy.enemyType !== 'spiky') {
                p.vy = JUMP_FORCE * 0.75;
                if (enemy.enemyType === 'boss') {
                  enemy.hp = (enemy.hp || 3) - 1;
                  sounds.playBossHit();
                  spawnParticles(enemy.x + enemy.width / 2, enemy.y + 20, '#ef4444', 16);
                  if (enemy.hp <= 0) {
                    enemy.isSquashed = true;
                    s.bossDefeated = true;
                    sounds.playLevelComplete();
                    onCoinCollect(10, 500);
                  }
                } else {
                  enemy.isSquashed = true;
                  sounds.playStomp();
                  spawnParticles(enemy.x + enemy.width / 2, enemy.y + 10, '#a855f7', 10);
                  onCoinCollect(1, 50);
                }
              } else if (p.invincibleTimer <= 0) {
                // Hurt player
                p.invincibleTimer = 1.8;
                p.vy = -260;
                p.vx = p.x < enemy.x ? -200 : 200;
                sounds.playWrong();
                spawnParticles(p.x + p.width / 2, p.y + p.height / 2, '#ef4444', 12);
                onPlayerHurt();
              }
            }
          }

          // ----------------------------------------------------
          // 9. UPDATE PARTICLES
          // ----------------------------------------------------
          for (let i = s.particles.length - 1; i >= 0; i--) {
            const pt = s.particles[i];
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.vy += 120 * dt;
            pt.life -= dt * 2.2;
            pt.alpha = Math.max(0, pt.life);
            if (pt.life <= 0) {
              s.particles.splice(i, 1);
            }
          }

          // ----------------------------------------------------
          // 10. SMOOTH CAMERA
          // ----------------------------------------------------
          const targetCamX = p.x - s.viewportW * 0.35;
          s.cameraX += (targetCamX - s.cameraX) * 0.1;
          s.cameraX = Math.max(0, Math.min(s.levelWidth - s.viewportW, s.cameraX));

          // ----------------------------------------------------
          // 11. RENDER CANVAS SCENE
          // ----------------------------------------------------
          ctx.clearRect(0, 0, s.viewportW, s.viewportH);

          // PARALLAX BACKGROUND
          drawBackground(ctx, s.cameraX, s.viewportW, s.viewportH, level.theme);

          ctx.save();
          ctx.translate(-Math.floor(s.cameraX), 0);

          // DRAW PLATFORMS
          drawPlatforms(ctx, s.platforms, level.theme);

          // DRAW MYSTERY BLOCKS
          drawMysteryBlocks(ctx, s.mysteryBlocks);

          // DRAW COINS
          drawCoins(ctx, s.coins);

          // DRAW PORTALS
          drawPortals(ctx, s.portals, currentTime);

          // DRAW CHECKPOINT & FINISH FLAG
          drawFlags(ctx, s.checkpointFlag, s.finishFlag, currentTime);

          // DRAW ENEMIES
          drawEnemies(ctx, s.enemies, currentTime);

          // DRAW PARTICLES
          for (const pt of s.particles) {
            ctx.save();
            ctx.globalAlpha = pt.alpha;
            ctx.fillStyle = pt.color;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // DRAW PLAYER CHARACTER
          drawPlayer(ctx, p);

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, level, onCoinCollect, onEnterQuestionPortal, onPlayerHurt, onReachFinish, touchActive]);

  // Render Helper Functions
  const drawBackground = (
    ctx: CanvasRenderingContext2D,
    camX: number,
    vw: number,
    vh: number,
    theme: string
  ) => {
    // Gradients based on theme
    const bgGrad = ctx.createLinearGradient(0, 0, 0, vh);
    if (theme === 'forest') {
      bgGrad.addColorStop(0, '#064e3b'); // deep emerald
      bgGrad.addColorStop(0.6, '#0f766e');
      bgGrad.addColorStop(1, '#111827');
    } else if (theme === 'mountain') {
      bgGrad.addColorStop(0, '#1e1b4b'); // deep indigo logic sky
      bgGrad.addColorStop(0.6, '#312e81');
      bgGrad.addColorStop(1, '#0f172a');
    } else if (theme === 'bridge') {
      bgGrad.addColorStop(0, '#0284c7'); // cyan algorithm sky
      bgGrad.addColorStop(0.6, '#0369a1');
      bgGrad.addColorStop(1, '#082f49');
    } else if (theme === 'castle') {
      bgGrad.addColorStop(0, '#4c1d95'); // royal purple
      bgGrad.addColorStop(0.6, '#3b0764');
      bgGrad.addColorStop(1, '#09090b');
    } else {
      // boss
      bgGrad.addColorStop(0, '#450a0a'); // dark red menacing
      bgGrad.addColorStop(0.6, '#7f1d1d');
      bgGrad.addColorStop(1, '#020617');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, vw, vh);

    // Parallax Clouds / Binary Stars (Far layer, speed 0.15)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 0; i < 8; i++) {
      const cx = ((i * 240 - camX * 0.15) % (vw + 200)) - 100;
      ctx.beginPath();
      ctx.ellipse(cx, 80 + (i % 3) * 40, 50, 20, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Parallax Mountains / Circuit Lines (Mid layer, speed 0.35)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.moveTo(0, vh);
    for (let x = 0; x <= vw; x += 120) {
      const peakY = 280 + Math.sin((x + camX * 0.35) * 0.015) * 60;
      ctx.lineTo(x, peakY);
    }
    ctx.lineTo(vw, vh);
    ctx.closePath();
    ctx.fill();
  };

  const drawPlatforms = (
    ctx: CanvasRenderingContext2D,
    plats: typeof gameStateRef.current.platforms,
    theme: string
  ) => {
    plats.forEach((plat) => {
      // Platform body
      ctx.fillStyle = theme === 'castle' ? '#334155' : (theme === 'boss' ? '#262626' : '#1e293b');
      ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

      // Platform top trim
      const topColor =
        theme === 'forest'
          ? '#10b981'
          : theme === 'mountain'
          ? '#6366f1'
          : theme === 'bridge'
          ? '#38bdf8'
          : theme === 'castle'
          ? '#ec4899'
          : '#ef4444';

      ctx.fillStyle = topColor;
      ctx.fillRect(plat.x, plat.y, plat.width, 6);

      // Tech grid rivets / circuit pattern on platforms
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let rx = plat.x + 10; rx < plat.x + plat.width - 10; rx += 25) {
        ctx.fillRect(rx, plat.y + 10, 4, 4);
      }
    });
  };

  const drawMysteryBlocks = (ctx: CanvasRenderingContext2D, blocks: MysteryBlock[]) => {
    blocks.forEach((block) => {
      const drawY = block.y - block.bumpOffset;
      // Block body
      ctx.fillStyle = block.hit ? '#64748b' : '#f59e0b';
      ctx.fillRect(block.x, drawY, block.width, block.height);

      // Border
      ctx.strokeStyle = block.hit ? '#475569' : '#d97706';
      ctx.lineWidth = 3;
      ctx.strokeRect(block.x, drawY, block.width, block.height);

      // Question Mark or empty dot
      ctx.fillStyle = block.hit ? '#334155' : '#ffffff';
      ctx.font = 'bold 20px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(block.hit ? '•' : '?', block.x + block.width / 2, drawY + block.height / 2);
    });
  };

  const drawCoins = (ctx: CanvasRenderingContext2D, coins: Coin[]) => {
    coins.forEach((coin) => {
      if (!coin.active) return;
      ctx.save();
      ctx.translate(coin.x + coin.width / 2, coin.y + coin.height / 2);

      // Golden outer ring
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(0, 0, coin.width / 2, coin.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shiny inner core
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(0, 0, coin.width / 3.5, coin.height / 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  };

  const drawPortals = (ctx: CanvasRenderingContext2D, portals: Portal[], time: number) => {
    portals.forEach((portal) => {
      const pulse = Math.sin(time * 0.006) * 4;

      // Glow aura
      ctx.save();
      ctx.shadowColor = portal.entered ? '#64748b' : '#38bdf8';
      ctx.shadowBlur = portal.entered ? 5 : 15;

      // Outer arch
      ctx.fillStyle = portal.entered ? '#475569' : '#0284c7';
      ctx.beginPath();
      ctx.ellipse(
        portal.x + portal.width / 2,
        portal.y + portal.height / 2,
        portal.width / 2,
        portal.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Inner swirl
      ctx.fillStyle = portal.entered ? '#1e293b' : '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(
        portal.x + portal.width / 2,
        portal.y + portal.height / 2,
        portal.width / 3 + pulse * 0.5,
        portal.height / 3 + pulse,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Question Mark indicator above portal
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        portal.entered ? 'DONE' : 'SOAL',
        portal.x + portal.width / 2,
        portal.y - 12 + Math.sin(time * 0.005) * 3
      );

      ctx.restore();
    });
  };

  const drawFlags = (
    ctx: CanvasRenderingContext2D,
    cp: typeof gameStateRef.current.checkpointFlag,
    flag: typeof gameStateRef.current.finishFlag,
    time: number
  ) => {
    // Checkpoint flagpole
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cp.x, cp.y, 6, cp.height);
    // Flag banner
    ctx.fillStyle = cp.activated ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.moveTo(cp.x + 6, cp.y + 10);
    ctx.lineTo(cp.x + 36, cp.y + 24);
    ctx.lineTo(cp.x + 6, cp.y + 38);
    ctx.closePath();
    ctx.fill();

    // Finish Goal Pole (Large)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(flag.x, flag.y, 8, flag.height);
    // Gold sphere on top
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(flag.x + 4, flag.y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Waving Finish Flag
    const wave = Math.sin(time * 0.008) * 6;
    ctx.fillStyle = flag.triggered ? '#10b981' : '#eab308';
    ctx.beginPath();
    ctx.moveTo(flag.x + 8, flag.y + 10);
    ctx.lineTo(flag.x + 55 + wave, flag.y + 26);
    ctx.lineTo(flag.x + 8, flag.y + 44);
    ctx.closePath();
    ctx.fill();

    // Label on Flag
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FINISH', flag.x + 28, flag.y + 28);
  };

  const drawEnemies = (ctx: CanvasRenderingContext2D, enemies: Enemy[], time: number) => {
    enemies.forEach((enemy) => {
      if (!enemy.active) return;
      ctx.save();
      ctx.translate(enemy.x, enemy.y);

      if (enemy.enemyType === 'slime') {
        const squash = enemy.isSquashed ? 0.3 : 1 + Math.sin(time * 0.01) * 0.1;
        ctx.scale(1, squash);
        // Purple glitch slime body
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(enemy.width / 2, enemy.height / 2, enemy.width / 2, Math.PI, 0, false);
        ctx.lineTo(enemy.width, enemy.height);
        ctx.lineTo(0, enemy.height);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(8, 12, 6, 6);
        ctx.fillRect(20, 12, 6, 6);
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(enemy.vx > 0 ? 11 : 8, 14, 3, 3);
        ctx.fillRect(enemy.vx > 0 ? 23 : 20, 14, 3, 3);
      } else if (enemy.enemyType === 'bat') {
        // Cyan Bit Bat
        ctx.fillStyle = '#06b6d4';
        const wingFlap = Math.sin(time * 0.02) * 8;
        // Wings
        ctx.beginPath();
        ctx.moveTo(0, 12 + wingFlap);
        ctx.lineTo(enemy.width / 2, 16);
        ctx.lineTo(enemy.width, 12 + wingFlap);
        ctx.lineTo(enemy.width / 2, 26);
        ctx.closePath();
        ctx.fill();

        // Body & Glowing Eyes
        ctx.fillStyle = '#083344';
        ctx.fillRect(12, 10, 10, 14);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(14, 13, 2, 2);
        ctx.fillRect(18, 13, 2, 2);
      } else if (enemy.enemyType === 'spiky') {
        // Orange Spiky Hazard Bug
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(4, 12, enemy.width - 8, enemy.height - 12);
        // Spikes on top
        ctx.fillStyle = '#fed7aa';
        for (let sp = 4; sp < enemy.width - 6; sp += 8) {
          ctx.beginPath();
          ctx.moveTo(sp, 12);
          ctx.lineTo(sp + 4, 2);
          ctx.lineTo(sp + 8, 12);
          ctx.closePath();
          ctx.fill();
        }
      } else if (enemy.enemyType === 'boss') {
        // WORLD 5 FINAL BOSS: RAJA BUG
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(0, 0, enemy.width, enemy.height);

        // Armor Plates
        ctx.fillStyle = '#450a0a';
        ctx.fillRect(6, 6, enemy.width - 12, enemy.height - 12);

        // Giant Horns
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-14, -20);
        ctx.lineTo(12, 0);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(enemy.width, 0);
        ctx.lineTo(enemy.width + 14, -20);
        ctx.lineTo(enemy.width - 12, 0);
        ctx.closePath();
        ctx.fill();

        // Glowing Core Eye
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(enemy.width / 2, 34, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(enemy.width / 2, 34, 8, 0, Math.PI * 2);
        ctx.fill();

        // Boss Health Bar above head
        const hpPct = ((enemy.hp || 3) / (enemy.maxHp || 3));
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-10, -35, enemy.width + 20, 8);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(-10, -35, (enemy.width + 20) * hpPct, 8);
        ctx.strokeStyle = '#f8fafc';
        ctx.strokeRect(-10, -35, enemy.width + 20, 8);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('RAJA BUG HP', enemy.width / 2, -40);
      }

      ctx.restore();
    });
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, p: typeof gameStateRef.current.player) => {
    // Invincibility flashing
    if (p.invincibleTimer > 0 && Math.floor(p.invincibleTimer * 10) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
    ctx.scale(p.facingRight ? p.squash : -p.squash, p.stretch);

    // Tech Explorer Character Sprite
    const legSwing = Math.sin(p.animTimer) * 8;

    // Backpack with antenna & blue crystal
    ctx.fillStyle = '#78350f'; // brown pack
    ctx.fillRect(-18, -12, 10, 24);
    ctx.fillStyle = '#38bdf8'; // glowing crystal
    ctx.fillRect(-16, -18, 6, 8);
    ctx.fillStyle = '#94a3b8'; // antenna
    ctx.fillRect(-14, -24, 2, 6);

    // Legs / Boots
    ctx.fillStyle = '#1e293b';
    // Back leg
    ctx.fillRect(-10 - (p.isGrounded ? legSwing : 0), 10, 8, 16);
    // Front leg
    ctx.fillRect(2 + (p.isGrounded ? legSwing : 0), 10, 8, 16);
    // Brown boots
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-12 - (p.isGrounded ? legSwing : 0), 22, 10, 6);
    ctx.fillRect(0 + (p.isGrounded ? legSwing : 0), 22, 10, 6);

    // Body (Adventurer Jacket)
    ctx.fillStyle = '#15803d'; // emerald adventure coat
    ctx.fillRect(-10, -6, 20, 20);
    // Orange inner shirt
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-4, -6, 8, 16);
    // Utility belt
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-10, 8, 20, 4);
    ctx.fillStyle = '#fbbf24'; // belt buckle
    ctx.fillRect(-3, 8, 6, 4);

    // Head
    ctx.fillStyle = '#fed7aa'; // skin
    ctx.fillRect(-8, -22, 16, 16);

    // Hair
    ctx.fillStyle = '#9a3412'; // auburn hair
    ctx.fillRect(-10, -26, 20, 7);
    ctx.fillRect(-11, -22, 5, 8);

    // Brass Goggles on forehead
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-7, -22, 14, 4);
    ctx.fillStyle = '#38bdf8'; // cyan lenses
    ctx.fillRect(-5, -22, 4, 4);
    ctx.fillRect(1, -22, 4, 4);

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(2, -15, 3, 4);
    // Smile
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(1, -9, 4, 2);

    ctx.restore();
  };

  const nearPortal = gameStateRef.current.portalNear;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden select-none">
      {/* 16:9 Canvas container */}
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain block"
        />

        {/* Portal Prompt Banner */}
        {nearPortal && !nearPortal.entered && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-sky-950/90 border border-sky-400 text-sky-200 px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
            <span className="font-pixel text-xs bg-sky-500 text-slate-950 px-2 py-0.5 rounded">
              TEKAN [E]
            </span>
            <span className="text-sm font-semibold">
              Masuk ke Portal Tantangan Informatika!
            </span>
          </div>
        )}

        {/* Lives depleted indicator */}
        {lives <= 0 && (
          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <h2 className="font-pixel text-2xl text-red-400 mb-2">GAME OVER</h2>
            <p className="text-sm text-slate-300">Nyawa habis! Jangan menyerah, coba lagi!</p>
          </div>
        )}
      </div>

      {/* MOBILE / TOUCH CONTROLS */}
      <div className="w-full max-w-5xl px-4 py-3 flex items-center justify-between text-slate-300 md:hidden">
        {/* Left / Right D-Pad */}
        <div className="flex items-center gap-3">
          <button
            onTouchStart={() => setTouchActive((prev) => ({ ...prev, left: true }))}
            onTouchEnd={() => setTouchActive((prev) => ({ ...prev, left: false }))}
            onMouseDown={() => setTouchActive((prev) => ({ ...prev, left: true }))}
            onMouseUp={() => setTouchActive((prev) => ({ ...prev, left: false }))}
            className="w-14 h-14 bg-slate-800 active:bg-slate-700 text-white font-bold rounded-2xl flex items-center justify-center text-2xl border border-slate-700 shadow-lg active:scale-95"
            aria-label="Kiri"
          >
            ◀
          </button>
          <button
            onTouchStart={() => setTouchActive((prev) => ({ ...prev, right: true }))}
            onTouchEnd={() => setTouchActive((prev) => ({ ...prev, right: false }))}
            onMouseDown={() => setTouchActive((prev) => ({ ...prev, right: true }))}
            onMouseUp={() => setTouchActive((prev) => ({ ...prev, right: false }))}
            className="w-14 h-14 bg-slate-800 active:bg-slate-700 text-white font-bold rounded-2xl flex items-center justify-center text-2xl border border-slate-700 shadow-lg active:scale-95"
            aria-label="Kanan"
          >
            ▶
          </button>
        </div>

        {/* Action / Jump Buttons */}
        <div className="flex items-center gap-3">
          <button
            onTouchStart={() => setTouchActive((prev) => ({ ...prev, interact: true }))}
            onTouchEnd={() => setTouchActive((prev) => ({ ...prev, interact: false }))}
            onMouseDown={() => setTouchActive((prev) => ({ ...prev, interact: true }))}
            onMouseUp={() => setTouchActive((prev) => ({ ...prev, interact: false }))}
            className="w-14 h-14 bg-amber-600 active:bg-amber-500 text-white font-pixel text-xs rounded-2xl flex items-center justify-center border border-amber-400 shadow-lg active:scale-95"
            aria-label="Aksi / Masuk Portal"
          >
            E
          </button>
          <button
            onTouchStart={() => setTouchActive((prev) => ({ ...prev, jump: true }))}
            onTouchEnd={() => setTouchActive((prev) => ({ ...prev, jump: false }))}
            onMouseDown={() => setTouchActive((prev) => ({ ...prev, jump: true }))}
            onMouseUp={() => setTouchActive((prev) => ({ ...prev, jump: false }))}
            className="w-16 h-16 bg-emerald-600 active:bg-emerald-500 text-white font-pixel text-xs rounded-2xl flex items-center justify-center border border-emerald-400 shadow-lg active:scale-95"
            aria-label="Lompat"
          >
            JUMP
          </button>
        </div>
      </div>
    </div>
  );
};
