import React, { useRef, useEffect } from 'react';
import { Zone, PlayerStats } from '../types';
import { Compass, MapPin } from 'lucide-react';

interface MinimapProps {
  currentZone: Zone;
  playerPos: { x: number; y: number };
  openedChests: string[];
  defeatedBosses: string[];
  onMinimapClick?: (x: number, y: number) => void;
}

export const Minimap: React.FC<MinimapProps> = ({
  currentZone,
  playerPos,
  openedChests,
  defeatedBosses,
  onMinimapClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mapW = currentZone.mapWidth;
    const mapH = currentZone.mapHeight;

    const cellW = canvas.width / mapW;
    const cellH = canvas.height / mapH;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Base Terrain & Grid
    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        const tile = currentZone.tileData[y]?.[x] ?? 0;
        const px = x * cellW;
        const py = y * cellH;

        if (tile === 1) {
          // Forest / Wall Boundary
          ctx.fillStyle = currentZone.id === 'zone_forest' ? '#0f3d1e' : '#1e293b';
        } else if (tile === 2) {
          // Cobblestone / Dirt Road
          ctx.fillStyle = '#b45309';
        } else if (tile === 3) {
          // River / Water
          ctx.fillStyle = '#0284c7';
        } else if (tile === 4) {
          // Market Shop
          ctx.fillStyle = '#9333ea';
        } else if (tile === 5) {
          // Tavern
          ctx.fillStyle = '#f59e0b';
        } else if (tile === 6) {
          // Boss Portal
          ctx.fillStyle = '#dc2626';
        } else if (tile === 7) {
          // Chest
          const isOpened = openedChests.includes(`${currentZone.id}_${x}_${y}`);
          ctx.fillStyle = isOpened ? '#475569' : '#fde047';
        } else if (tile === 8) {
          // Cottage
          ctx.fillStyle = '#ef4444';
        } else if (tile === 9) {
          // Windmill
          ctx.fillStyle = '#ea580c';
        } else if (tile === 10) {
          // Water Well / Plaza
          ctx.fillStyle = '#38bdf8';
        } else if (tile === 11) {
          // Forge
          ctx.fillStyle = '#f97316';
        } else {
          // Natural Grass / Ground
          ctx.fillStyle = currentZone.id === 'zone_forest' ? '#166534' : '#0f172a';
        }

        ctx.fillRect(px, py, cellW, cellH);
      }
    }

    // 2. Draw NPC Blips
    if (currentZone.npcs) {
      currentZone.npcs.forEach((npc) => {
        const nx = npc.x * cellW + cellW / 2;
        const ny = npc.y * cellH + cellH / 2;

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(nx, ny, Math.max(3, cellW * 0.8), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // 3. Draw Player Blip (Bright Glowing Green Pulsing Indicator)
    const pX = playerPos.x * cellW + cellW / 2;
    const pY = playerPos.y * cellH + cellH / 2;

    ctx.fillStyle = 'rgba(74, 222, 128, 0.4)';
    ctx.beginPath();
    ctx.arc(pX, pY, Math.max(6, cellW * 1.8), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(pX, pY, Math.max(3.5, cellW * 0.9), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [currentZone, playerPos, openedChests, defeatedBosses]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onMinimapClick || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const cellW = rect.width / currentZone.mapWidth;
    const cellH = rect.height / currentZone.mapHeight;

    const gridX = Math.floor(clickX / cellW);
    const gridY = Math.floor(clickY / cellH);

    if (gridX >= 0 && gridX < currentZone.mapWidth && gridY >= 0 && gridY < currentZone.mapHeight) {
      onMinimapClick(gridX, gridY);
    }
  };

  return (
    <div className="relative bg-slate-950/90 border-2 border-amber-500/70 rounded-xl p-1.5 shadow-2xl backdrop-blur-sm flex flex-col items-center">
      <div className="w-full flex items-center justify-between px-1 mb-1 text-[10px] font-bold text-amber-400">
        <span className="flex items-center space-x-1">
          <Compass className="w-3.5 h-3.5" />
          <span>MINIMAPA (40x36)</span>
        </span>
        <span className="text-slate-400">
          [{playerPos.x}, {playerPos.y}]
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={160}
        height={144}
        onClick={handleCanvasClick}
        className="rounded-lg border border-slate-800 cursor-pointer shadow-inner"
        title="Haz clic para explorar coordenadas del mapa"
      />

      <div className="w-full grid grid-cols-3 gap-1 mt-1 text-[8px] text-slate-400 font-bold text-center">
        <div className="flex items-center justify-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Héroe</span>
        </div>
        <div className="flex items-center justify-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>NPC (!)</span>
        </div>
        <div className="flex items-center justify-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
          <span>Cofre</span>
        </div>
      </div>
    </div>
  );
};
