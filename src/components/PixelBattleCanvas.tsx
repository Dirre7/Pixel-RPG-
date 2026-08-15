import React, { useEffect, useRef } from 'react';
import { PlayerStats, EquipmentItem, Enemy } from '../types';
import { getHeroSpriteCanvas } from '../utils/pixelSpriteGenerator';
import { getMonsterSpriteCanvas } from '../utils/pixelSpriteGenerator';

interface PixelBattleCanvasProps {
  player: PlayerStats;
  equipment: {
    weapon?: EquipmentItem;
    armor?: EquipmentItem;
    shield?: EquipmentItem;
    ring?: EquipmentItem;
    necklace?: EquipmentItem;
  };
  enemy: Enemy;
  playerIsAttacking?: boolean;
  playerIsHit?: boolean;
  isDefending?: boolean;
  enemyIsAttacking?: boolean;
  enemyIsHit?: boolean;
  activeEffect?: string | null;
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.04;

      const w = canvas.width;
      const h = canvas.height;

      // 1. FONDO DE COMBATE RETRO EN CAPAS (PARALLAX SKY & MOUNTAINS)
      const zoneId = (enemy.zoneId || '').toLowerCase();
      const isVolcano = zoneId.includes('volcano') || zoneId.includes('volcán');
      const isCave = zoneId.includes('cave') || zoneId.includes('cueva');

      // Cielo / Bóveda
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (isVolcano) {
        skyGrad.addColorStop(0, '#450a0a');
        skyGrad.addColorStop(0.6, '#7f1d1d');
        skyGrad.addColorStop(1, '#1c1917');
      } else if (isCave) {
        skyGrad.addColorStop(0, '#020617');
        skyGrad.addColorStop(0.6, '#0f172a');
        skyGrad.addColorStop(1, '#1e293b');
      } else {
        // Bosque diurno
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(0.6, '#38bdf8');
        skyGrad.addColorStop(1, '#166534');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Cordillera lejana
      ctx.fillStyle = isVolcano ? '#290606' : isCave ? '#0f172a' : '#14532d';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      ctx.lineTo(w * 0.25, h * 0.45);
      ctx.lineTo(w * 0.55, h * 0.60);
      ctx.lineTo(w * 0.85, h * 0.40);
      ctx.lineTo(w, h * 0.65);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Suelo de combate / Arena
      ctx.fillStyle = isVolcano ? '#1c1917' : isCave ? '#334155' : '#15803d';
      ctx.fillRect(0, h * 0.65, w, h * 0.35);
      ctx.fillStyle = isVolcano ? '#44403c' : isCave ? '#475569' : '#16a34a';
      ctx.fillRect(0, h * 0.65, w, 4);

      // Plataformas circulares retro
      // Plataforma del Héroe
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(w * 0.28, h * 0.78, 60, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      // Plataforma del Enemigo
      ctx.beginPath();
      ctx.ellipse(w * 0.72, h * 0.78, 70, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. DIBUJAR AL HÉROE (Lado Izquierdo)
      let heroX = w * 0.28 - 24;
      let heroY = h * 0.78 - 56;
      let heroAnim = 'idle';

      if (playerIsAttacking) {
        heroX += 50; // Embestida hacia el enemigo
        heroY -= 8;
        heroAnim = 'attack';
      } else if (playerIsHit) {
        heroX -= 20; // Retroceso de daño
        heroY += (Math.floor(time * 20) % 2 === 0 ? -4 : 4);
        heroAnim = 'hit';
      } else if (isDefending) {
        heroY += 4;
      } else {
        // Respiración suave
        heroY += Math.sin(time * 4) * 2;
      }

      const heroCanvas = getHeroSpriteCanvas(player.heroClass, player.gender, 'right', heroAnim as any);
      ctx.drawImage(heroCanvas, heroX, heroY, 56, 56);

      // 3. DIBUJAR AL MONSTRUO / ENEMIGO (Lado Derecho)
      let enemyX = w * 0.72 - 32;
      let enemyY = h * 0.78 - 68;

      if (enemyIsAttacking) {
        enemyX -= 50; // Embestida hacia el héroe
        enemyY -= 8;
      } else if (enemyIsHit) {
        enemyX += 20; // Retroceso
        enemyX += (Math.floor(time * 20) % 2 === 0 ? -6 : 6);
      } else {
        enemyY += Math.sin(time * 4 + 1) * 2;
      }

      const monsterCanvas = getMonsterSpriteCanvas(enemy.name, time * 2);
      ctx.drawImage(monsterCanvas, enemyX, enemyY, 68, 68);

      // 4. EFECTOS DE COMBATE Y MAGIA (TAJO / EXPLOSIÓN / DESTELLO)
      if (playerIsAttacking) {
        // Tajo de espada creciente amarillo/blanco
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(enemyX + 34, enemyY + 34, 30, -Math.PI * 0.2, Math.PI * 0.6);
        ctx.stroke();
      }

      if (activeEffect) {
        // Partículas mágicas según hechizo
        const effColor = activeEffect.includes('fire') ? '#ef4444' : activeEffect.includes('heal') ? '#22c55e' : '#38bdf8';
        for (let i = 0; i < 12; i++) {
          const px = enemyX + 34 + Math.sin(time * 8 + i) * 28;
          const py = enemyY + 34 + Math.cos(time * 8 + i) * 28;
          ctx.fillStyle = effColor;
          ctx.fillRect(px, py, 4, 4);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [player, enemy, playerIsAttacking, playerIsHit, isDefending, enemyIsAttacking, enemyIsHit, activeEffect]);

  return (
    <div className="relative w-full h-[380px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={720}
        height={380}
        className="w-full h-full object-cover"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};
