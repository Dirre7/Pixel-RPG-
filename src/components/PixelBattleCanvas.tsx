import React, { useEffect, useRef } from 'react';
import { PlayerStats, EquipmentItem, Enemy } from '../types';

interface PixelBattleCanvasProps {
  player: PlayerStats;
  equipment?: {
    weapon: EquipmentItem | null;
    armor: EquipmentItem | null;
    accessory: EquipmentItem | null;
  };
  enemy: Enemy;
  playerIsAttacking: boolean;
  playerIsHit: boolean;
  isDefending: boolean;
  enemyIsAttacking: boolean;
  enemyIsHit: boolean;
  activeEffect?: 'physical' | 'fire' | 'ice' | 'thunder' | 'holy' | 'shadow' | 'heal' | null;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'spark' | 'flame';
}

export const PixelBattleCanvas: React.FC<PixelBattleCanvasProps> = ({
  player,
  enemy,
  playerIsAttacking,
  playerIsHit,
  isDefending,
  enemyIsAttacking,
  enemyIsHit,
  activeEffect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number>(0);
  const startTimeRef = useRef<number>(performance.now());

  // Spawn particles on hit / effects
  useEffect(() => {
    if (!activeEffect && !playerIsHit && !enemyIsHit) return;

    const newParticles: Particle[] = [];
    const count = 25;
    const targetX = enemyIsHit ? 0.62 : 0.36;
    const targetY = enemyIsHit ? 0.45 : 0.72;

    for (let i = 0; i < count; i++) {
      let color = '#fbbf24';
      let shape: Particle['shape'] = 'spark';

      if (activeEffect === 'fire') {
        color = ['#ef4444', '#f97316', '#fbbf24', '#ffffff'][i % 4];
        shape = 'flame';
      } else if (activeEffect === 'ice') {
        color = ['#38bdf8', '#7dd3fc', '#bae6fd', '#ffffff'][i % 4];
        shape = 'spark';
      } else if (activeEffect === 'thunder') {
        color = ['#fde047', '#eab308', '#ffffff', '#a855f7'][i % 4];
        shape = 'spark';
      } else if (activeEffect === 'holy' || activeEffect === 'heal') {
        color = ['#4ade80', '#22c55e', '#86efac', '#ffffff'][i % 4];
        shape = 'circle';
      } else if (activeEffect === 'shadow') {
        color = ['#a855f7', '#6b21a8', '#3b0764', '#1e1b4b'][i % 4];
        shape = 'flame';
      }

      newParticles.push({
        x: targetX + (Math.random() - 0.5) * 0.1,
        y: targetY + (Math.random() - 0.5) * 0.1,
        vx: (Math.random() - 0.5) * 0.006,
        vy: (Math.random() - 0.5) * 0.006 - 0.002,
        color,
        size: 3 + Math.random() * 5,
        life: 0,
        maxLife: 30 + Math.floor(Math.random() * 20),
        shape,
      });
    }

    particlesRef.current.push(...newParticles);
  }, [activeEffect, playerIsHit, enemyIsHit]);

  // Main 2.5D Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = (now: number) => {
      if (!isRunning) return;

      const elapsed = (now - startTimeRef.current) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      // Clear Screen
      ctx.clearRect(0, 0, w, h);

      // 🌅 1. Sky & Atmosphere Background (2.5D Horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.55);
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.5, '#1e293b');
      skyGrad.addColorStop(1, '#334155');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.55);

      // Distant Forest / Mountains Horizon
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.55);
      for (let x = 0; x <= w; x += 20) {
        const hillH = Math.sin(x * 0.015 + 1) * 15 + Math.cos(x * 0.03) * 8;
        ctx.lineTo(x, h * 0.52 - hillH);
      }
      ctx.lineTo(w, h * 0.55);
      ctx.closePath();
      ctx.fill();

      // 🌿 2. Arena Ground (Perspective Grass Floor)
      const groundGrad = ctx.createLinearGradient(0, h * 0.55, 0, h);
      groundGrad.addColorStop(0, '#15803d');
      groundGrad.addColorStop(0.5, '#16a34a');
      groundGrad.addColorStop(1, '#22c55e');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, h * 0.55, w, h * 0.45);

      // Perspective Grid / Grass Tuft details
      ctx.fillStyle = '#14532d';
      for (let i = 0; i < 15; i++) {
        const tx = ((i * 73 + elapsed * 5) % (w - 20)) + 10;
        const ty = h * 0.58 + (i * 19) % (h * 0.38);
        ctx.fillRect(tx, ty, 3, 4);
        ctx.fillRect(tx + 3, ty - 2, 2, 6);
      }

      // 🎯 3. Battle Pedestals (2.5D Battle Stages)
      // Enemy Pedestal (Distance / Top-Right center)
      const enemyPedX = w * 0.64;
      const enemyPedY = h * 0.48;
      const enemyPedR = w * 0.22;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.beginPath();
      ctx.ellipse(enemyPedX, enemyPedY + 6, enemyPedR, enemyPedR * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(enemyPedX, enemyPedY, enemyPedR, enemyPedR * 0.36, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(enemyPedX, enemyPedY - 2, enemyPedR * 0.94, enemyPedR * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();

      // Player Pedestal (Foreground / Bottom-Left center)
      const playerPedX = w * 0.34;
      const playerPedY = h * 0.82;
      const playerPedR = w * 0.26;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.beginPath();
      ctx.ellipse(playerPedX, playerPedY + 8, playerPedR, playerPedR * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(playerPedX, playerPedY, playerPedR, playerPedR * 0.36, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(playerPedX, playerPedY - 3, playerPedR * 0.93, playerPedR * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();

      // 👾 4. Draw Enemy (2.5D Frontal Sprite & Breathing Animation)
      const enemyBob = Math.sin(elapsed * 4) * 4;
      const enemyLunge = enemyIsAttacking ? -Math.sin(elapsed * 18) * 28 : 0;
      const eX = enemyPedX + enemyLunge;
      const eY = enemyPedY - 32 + enemyBob;

      // Enemy Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(eX, enemyPedY, 32, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      if (enemyIsHit) {
        ctx.filter = 'brightness(2.5) hue-rotate(90deg)';
      }

      // Procedural HD Pixel Art Enemy
      drawPixelEnemy(ctx, eX, eY, enemy);
      ctx.restore();

      // ⚔️ 5. Draw Hero (2.5D Third-Person Back View & Equipment)
      const playerBob = Math.sin(elapsed * 3.5) * 3;
      const playerLunge = playerIsAttacking ? Math.sin(elapsed * 18) * 35 : 0;
      const pX = playerPedX + playerLunge * 0.7;
      const pY = playerPedY - 56 + playerBob - playerLunge * 0.3;

      // Player Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(pX, playerPedY, 36, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      if (playerIsHit) {
        ctx.filter = 'brightness(2) drop-shadow(0 0 10px #ef4444)';
      }
      if (isDefending) {
        // Shield Barrier Aura
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pX, pY + 20, 48, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Hero Back View (Guerrero, Pícaro, Mago)
      drawPixelHeroBack(ctx, pX, pY, player);
      ctx.restore();

      // ✨ 6. Draw Particle System
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const px = p.x * w;
        const py = p.y * h;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        if (p.shape === 'flame') {
          ctx.ellipse(px, py, p.size, p.size * 1.5, 0, 0, Math.PI * 2);
        } else {
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.globalAlpha = 1;

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [player, enemy, playerIsAttacking, playerIsHit, isDefending, enemyIsAttacking, enemyIsHit, activeEffect]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <canvas
        ref={canvasRef}
        width={400}
        height={320}
        className="w-full h-full object-cover select-none"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

// Helper: Draw 2.5D Pixel Enemy Front View
function drawPixelEnemy(ctx: CanvasRenderingContext2D, x: number, y: number, enemy: Enemy) {
  const isSlime = enemy.name.toLowerCase().includes('slime') || enemy.name.toLowerCase().includes('limo');
  const isBandit = enemy.name.toLowerCase().includes('bandido') || enemy.name.toLowerCase().includes('ladron') || enemy.name.toLowerCase().includes('pícaro');
  const isSkeleton = enemy.name.toLowerCase().includes('esqueleto') || enemy.name.toLowerCase().includes('muerto');

  if (isSlime) {
    // 🟢 Slime / Limo gelatinoso con ojos y brillo
    const slimeColor = enemy.name.toLowerCase().includes('fuego') ? '#ef4444' : enemy.name.toLowerCase().includes('rey') ? '#eab308' : '#22c55e';
    ctx.fillStyle = slimeColor;
    ctx.beginPath();
    ctx.arc(x, y + 10, 26, 0, Math.PI * 2);
    ctx.fill();
    // Brillo superior
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(x - 8, y + 2, 7, 0, Math.PI * 2);
    ctx.fill();
    // Ojos
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x - 7, y + 12, 4, 0, Math.PI * 2);
    ctx.arc(x + 7, y + 12, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 8, y + 10, 2, 2);
    ctx.fillRect(x + 6, y + 10, 2, 2);
  } else if (isSkeleton) {
    // 💀 Esqueleto con escudo y espada rota
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(x, y - 8, 14, 0, Math.PI * 2); // Calavera
    ctx.fill();
    ctx.fillStyle = '#0f172a'; // Cuencas ojos
    ctx.fillRect(x - 6, y - 10, 4, 5);
    ctx.fillRect(x + 2, y - 10, 4, 5);
    // Costillas
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x, y + 26);
    ctx.moveTo(x - 10, y + 12);
    ctx.lineTo(x + 10, y + 12);
    ctx.moveTo(x - 8, y + 18);
    ctx.lineTo(x + 8, y + 18);
    ctx.stroke();
  } else if (isBandit) {
    // 🗡️ Bandido con capa roja y máscara
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(x - 16, y, 32, 34); // Túnica / Capa
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 10, y - 18, 20, 18); // Rostro
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(x - 12, y - 14, 24, 8); // Máscara de ojos
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 6, y - 12, 3, 3);
    ctx.fillRect(x + 3, y - 12, 3, 3);
    // Dagas afiladas
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 22, y + 6, 6, 18);
    ctx.fillRect(x + 16, y + 6, 6, 18);
  } else {
    // 🐺 Monstruo / Bestia Genérica
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.arc(x, y + 6, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x - 10, y - 2, 6, 6);
    ctx.fillRect(x + 4, y - 2, 6, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 6, y + 14, 12, 4);
  }
}

// Helper: Draw 2.5D Pixel Hero Back View
function drawPixelHeroBack(ctx: CanvasRenderingContext2D, x: number, y: number, player: PlayerStats) {
  const isWarrior = player.heroClass === 'Guerrero';
  const isMage = player.heroClass === 'Mago';

  // 1. Capa de Combate Ondulante (Back Cape)
  const capeColor = isWarrior ? '#dc2626' : isMage ? '#7c3aed' : '#059669';
  ctx.fillStyle = capeColor;
  ctx.beginPath();
  ctx.moveTo(x - 14, y + 8);
  ctx.lineTo(x + 14, y + 8);
  ctx.lineTo(x + 18, y + 42);
  ctx.lineTo(x - 18, y + 42);
  ctx.closePath();
  ctx.fill();

  // 2. Torso / Armadura
  const armorColor = isWarrior ? '#475569' : isMage ? '#4338ca' : '#065f46';
  ctx.fillStyle = armorColor;
  ctx.fillRect(x - 12, y + 8, 24, 26);

  // 3. Cabeza & Cabello (Vista Posterior)
  const hairColor = player.gender === 'female' ? '#b45309' : '#1e293b';
  ctx.fillStyle = hairColor;
  ctx.beginPath();
  ctx.arc(x, y - 2, 14, 0, Math.PI * 2);
  ctx.fill();

  // 4. Piernas & Botas de Cuero
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 10, y + 34, 8, 14);
  ctx.fillRect(x + 2, y + 34, 8, 14);

  // 5. Arma de Clase Portada en Mano / Espalda
  if (isWarrior) {
    // ⚔️ Gran Espada de Acero en Mano Derecha y Escudo en Izquierda
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x + 14, y - 10, 5, 36); // Hoja de acero
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 10, y + 16, 13, 4); // Guarda dorada

    // Escudo en brazo izquierdo
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.ellipse(x - 16, y + 18, 8, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (isMage) {
    // 🪄 Báculo Arcano con Orbe Mágico Pulsante
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 14, y - 18, 4, 46); // Madera del báculo
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x + 16, y - 22, 7, 0, Math.PI * 2); // Orbe arcano
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 14, y - 24, 3, 3);
  } else {
    // 🗡️ Pícaro: Dagas Duales Cruzadas
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - 18, y + 10, 4, 20);
    ctx.fillRect(x + 14, y + 10, 4, 20);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 20, y + 14, 8, 3);
    ctx.fillRect(x + 12, y + 14, 8, 3);
  }
}
