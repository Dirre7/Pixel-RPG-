import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Zone } from '../types';
import { Compass, ZoomIn, ZoomOut, Eye, ShieldAlert } from 'lucide-react';

interface MinimapProps {
  currentZone: Zone;
  playerPos: { x: number; y: number };
  openedChests: string[];
  defeatedBosses: string[];
  exploredTiles?: Set<string>;
  onMinimapClick?: (x: number, y: number) => void;
}

export const Minimap: React.FC<MinimapProps> = ({
  currentZone,
  playerPos,
  openedChests,
  defeatedBosses,
  exploredTiles,
  onMinimapClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoomMode, setZoomMode] = useState<'full' | 'radar'>('radar');

  const mapW = currentZone.mapWidth || 150;
  const mapH = currentZone.mapHeight || 150;

  // Calculate exploration percentage
  const explorationPercent = useMemo(() => {
    if (!exploredTiles || exploredTiles.size === 0) return 1;
    const total = mapW * mapH;
    return Math.min(100, Math.max(1, Math.round((exploredTiles.size / total) * 100)));
  }, [exploredTiles, mapW, mapH]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Radar Mode vs Full Mode
    const isRadar = zoomMode === 'radar';
    const radarRadius = 24; // 24 tiles in every direction around player in radar mode

    const startX = isRadar ? Math.max(0, playerPos.x - radarRadius) : 0;
    const endX = isRadar ? Math.min(mapW, playerPos.x + radarRadius) : mapW;
    const startY = isRadar ? Math.max(0, playerPos.y - radarRadius) : 0;
    const endY = isRadar ? Math.min(mapH, playerPos.y + radarRadius) : mapH;

    const visibleWidth = endX - startX;
    const visibleHeight = endY - startY;

    const cellW = canvas.width / visibleWidth;
    const cellH = canvas.height / visibleHeight;

    // 1. Draw Base Terrain with Fog of War
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const px = (x - startX) * cellW;
        const py = (y - startY) * cellH;
        const tileKey = `${x},${y}`;
        const isExplored = !exploredTiles || exploredTiles.has(tileKey);

        if (!isExplored) {
          // Fog of War (Dark unexplored mist)
          ctx.fillStyle = '#060913';
          ctx.fillRect(px, py, cellW + 0.5, cellH + 0.5);
          continue;
        }

        const tile = currentZone.tileData[y]?.[x] ?? 0;

        if (tile === 1) {
          // Forest / Wall Boundary
          ctx.fillStyle = currentZone.id === 'zone_forest' ? '#0d4a22' : '#1e293b';
        } else if (tile === 2) {
          // Cobblestone / Dirt Road / Bridge
          ctx.fillStyle = '#b45309';
        } else if (tile === 3) {
          // River / Water / Lava
          ctx.fillStyle = currentZone.id === 'zone_volcano' ? '#ea580c' : '#0284c7';
        } else if (tile === 4 || tile === 9) {
          // Market Shop / Cottage
          ctx.fillStyle = '#9333ea';
        } else if (tile === 5) {
          // Tavern / Inn
          ctx.fillStyle = '#f59e0b';
        } else if (tile === 6) {
          // Boss Portal
          ctx.fillStyle = '#dc2626';
        } else if (tile === 7) {
          // Chest
          const isOpened = openedChests.includes(`${currentZone.id}_${x}_${y}`);
          ctx.fillStyle = isOpened ? '#475569' : '#fde047';
        } else if (tile === 8) {
          // Shrine / Sanctuary
          ctx.fillStyle = '#10b981';
        } else if (tile === 10) {
          // Water Well / Fountain
          ctx.fillStyle = '#38bdf8';
        } else if (tile === 11) {
          // Blacksmith Forge
          ctx.fillStyle = '#f97316';
        } else {
          // Natural Grass / Ground
          ctx.fillStyle = currentZone.id === 'zone_forest' ? '#14532d' : '#0f172a';
        }

        ctx.fillRect(px, py, cellW + 0.5, cellH + 0.5);
      }
    }

    // 2. Draw Discovered NPCs
    if (currentZone.npcs) {
      currentZone.npcs.forEach((npc) => {
        if (npc.x >= startX && npc.x < endX && npc.y >= startY && npc.y < endY) {
          const isRevealed = !exploredTiles || exploredTiles.has(`${npc.x},${npc.y}`);
          if (isRevealed) {
            const nx = (npc.x - startX) * cellW + cellW / 2;
            const ny = (npc.y - startY) * cellH + cellH / 2;

            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(nx, ny, Math.max(3, cellW * 0.9), 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
    }

    // 3. Draw Discovered Boss Portal
    if (currentZone.tileData) {
      // Find boss portal
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          if (currentZone.tileData[y]?.[x] === 6) {
            const isRevealed = !exploredTiles || exploredTiles.has(`${x},${y}`);
            if (isRevealed) {
              const bx = (x - startX) * cellW + cellW / 2;
              const by = (y - startY) * cellH + cellH / 2;
              ctx.fillStyle = '#ef4444';
              ctx.beginPath();
              ctx.arc(bx, by, Math.max(4, cellW * 1.2), 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#fca5a5';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          }
        }
      }
    }

    // 4. Draw Player Blip (Pulsing Green Marker with Direction Flare)
    if (playerPos.x >= startX && playerPos.x < endX && playerPos.y >= startY && playerPos.y < endY) {
      const pX = (playerPos.x - startX) * cellW + cellW / 2;
      const pY = (playerPos.y - startY) * cellH + cellH / 2;

      // Aura
      ctx.fillStyle = 'rgba(74, 222, 128, 0.35)';
      ctx.beginPath();
      ctx.arc(pX, pY, Math.max(8, cellW * 2.2), 0, Math.PI * 2);
      ctx.fill();

      // Dot
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(pX, pY, Math.max(4, cellW * 1.1), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [currentZone, playerPos, openedChests, defeatedBosses, exploredTiles, zoomMode, mapW, mapH]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onMinimapClick || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const isRadar = zoomMode === 'radar';
    const radarRadius = 24;
    const startX = isRadar ? Math.max(0, playerPos.x - radarRadius) : 0;
    const endX = isRadar ? Math.min(mapW, playerPos.x + radarRadius) : mapW;
    const startY = isRadar ? Math.max(0, playerPos.y - radarRadius) : 0;
    const endY = isRadar ? Math.min(mapH, playerPos.y + radarRadius) : mapH;

    const visibleWidth = endX - startX;
    const visibleHeight = endY - startY;

    const cellW = rect.width / visibleWidth;
    const cellH = rect.height / visibleHeight;

    const gridX = Math.floor(startX + clickX / cellW);
    const gridY = Math.floor(startY + clickY / cellH);

    if (gridX >= 0 && gridX < mapW && gridY >= 0 && gridY < mapH) {
      onMinimapClick(gridX, gridY);
    }
  };

  return (
    <div className="relative bg-slate-950/95 border-2 border-amber-500/70 rounded-xl p-1.5 shadow-2xl backdrop-blur-md flex flex-col items-center select-none font-mono">
      {/* Header with Coordinates, Exploration % & Zoom Toggle */}
      <div className="w-full flex items-center justify-between px-1 mb-1 text-[10px] font-bold text-amber-400">
        <div className="flex items-center space-x-1">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate max-w-[85px] sm:max-w-none">
            {zoomMode === 'radar' ? 'Radar (150x150)' : 'Mundo (150x150)'}
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-emerald-400 text-[9px]">
            {explorationPercent}% 🗺️
          </span>
          <span className="text-slate-400">
            [{playerPos.x}, {playerPos.y}]
          </span>
          <button
            onClick={() => setZoomMode(zoomMode === 'radar' ? 'full' : 'radar')}
            className="p-0.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 rounded border border-slate-700 transition"
            title={zoomMode === 'radar' ? 'Ver Mapa Completo de 150x150' : 'Hacer Zoom Radar al Héroe'}
          >
            {zoomMode === 'radar' ? <ZoomOut className="w-3 h-3" /> : <ZoomIn className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={180}
        height={160}
        onClick={handleCanvasClick}
        className="rounded-lg border border-slate-800 cursor-pointer shadow-inner bg-slate-950"
        title="Haz clic para inspeccionar coordenadas"
      />

      {/* Legend */}
      <div className="w-full grid grid-cols-4 gap-0.5 mt-1 text-[8px] text-slate-400 font-bold text-center">
        <div className="flex items-center justify-center space-x-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Héroe</span>
        </div>
        <div className="flex items-center justify-center space-x-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>NPC</span>
        </div>
        <div className="flex items-center justify-center space-x-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
          <span>Cofre</span>
        </div>
        <div className="flex items-center justify-center space-x-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>Jefe</span>
        </div>
      </div>
    </div>
  );
};
