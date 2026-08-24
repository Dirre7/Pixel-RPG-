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
  isCreatorMode?: boolean;
}

export const Minimap: React.FC<MinimapProps> = ({
  currentZone,
  playerPos,
  openedChests,
  defeatedBosses,
  exploredTiles,
  onMinimapClick,
  isCreatorMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoomMode, setZoomMode] = useState<'full' | 'radar'>('radar');

  const mapW = currentZone.mapWidth || 400;
  const mapH = currentZone.mapHeight || 400;

  // Calculate exploration percentage
  const explorationPercent = useMemo(() => {
    if (isCreatorMode) return 100;
    if (!exploredTiles || exploredTiles.size === 0) return 1;
    const total = mapW * mapH;
    const pct = ((exploredTiles.size / total) * 100);
    return pct < 1 ? Number(pct.toFixed(1)) : Math.min(100, Math.round(pct));
  }, [exploredTiles, mapW, mapH, isCreatorMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Radar Mode vs Full Mode
    const isRadar = zoomMode === 'radar';
    const radarRadius = 32; // 32 tiles in every direction around player in radar mode

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
        const isExplored = isCreatorMode || !exploredTiles || exploredTiles.has(tileKey);

        if (!isExplored) {
          // Fog of War (Dark unexplored mist)
          ctx.fillStyle = '#060913';
          ctx.fillRect(px, py, cellW + 0.5, cellH + 0.5);
          continue;
        }

        const tile = currentZone.tileData[y]?.[x] ?? 0;

        if (tile === -1) {
          // Off-map void / non-rendered abyss
          ctx.fillStyle = '#060913';
          ctx.fillRect(px, py, cellW + 0.5, cellH + 0.5);
          continue;
        }

        if (tile === 21) {
          // Cliff / Rocky Mountain Walls
          ctx.fillStyle = '#475569';
          ctx.fillRect(px, py, cellW + 0.5, cellH + 0.5);
          continue;
        }

        if (tile === 28) {
          // Doorway / Instance Portal
          ctx.fillStyle = '#f59e0b';
        } else if (tile === 3) {
          // River / Water / Lava
          ctx.fillStyle = currentZone.id === 'zone_volcano' ? '#ea580c' : '#0284c7';
        } else if (tile === 2 || tile === 15) {
          // Roads / Cobblestone / Bridges / Docks
          if (currentZone.id === 'zone_cave' || currentZone.id === 'zone_castle') {
            ctx.fillStyle = '#475569';
          } else if (currentZone.id === 'zone_volcano') {
            ctx.fillStyle = '#3f3f46';
          } else if (currentZone.id === 'zone_tundra') {
            ctx.fillStyle = '#94a3b8';
          } else if (currentZone.id === 'zone_sanctuary') {
            ctx.fillStyle = '#fef08a';
          } else {
            ctx.fillStyle = '#b45309';
          }
        } else if (tile === 1) {
          // Dense forest trees / cave rock walls
          if (currentZone.id === 'zone_forest') ctx.fillStyle = '#0f5128';
          else if (currentZone.id === 'zone_cave') ctx.fillStyle = '#0f172a';
          else if (currentZone.id === 'zone_swamp') ctx.fillStyle = '#143820';
          else if (currentZone.id === 'zone_volcano') ctx.fillStyle = '#09090b';
          else if (currentZone.id === 'zone_tundra') ctx.fillStyle = '#94a3b8';
          else if (currentZone.id === 'zone_castle') ctx.fillStyle = '#1e293b';
          else if (currentZone.id === 'zone_void') ctx.fillStyle = '#05050a';
          else ctx.fillStyle = '#eab308';
        } else {
          // Suelo base limpio y homogéneo del bioma (sin ruido de flores/props)
          if (currentZone.id === 'zone_forest') ctx.fillStyle = '#15803d';
          else if (currentZone.id === 'zone_cave') ctx.fillStyle = '#1e293b';
          else if (currentZone.id === 'zone_swamp') ctx.fillStyle = '#1c1917';
          else if (currentZone.id === 'zone_volcano') ctx.fillStyle = '#18181b';
          else if (currentZone.id === 'zone_tundra') ctx.fillStyle = '#f1f5f9';
          else if (currentZone.id === 'zone_castle') ctx.fillStyle = '#334155';
          else if (currentZone.id === 'zone_void') ctx.fillStyle = '#0f0e17';
          else ctx.fillStyle = '#ffffff';
        }

        ctx.fillRect(px, py, cellW + 0.5, cellH + 0.5);
      }
    }

    // 2. Draw Discovered Chests (Tile 7 o currentZone.chests)
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (currentZone.tileData[y]?.[x] === 7) {
          const isRevealed = !exploredTiles || exploredTiles.has(`${x},${y}`);
          if (isRevealed) {
            const isOpened = openedChests.includes(`${currentZone.id}_${x}_${y}`);
            const cx = (x - startX) * cellW + cellW / 2;
            const cy = (y - startY) * cellH + cellH / 2;
            ctx.fillStyle = isOpened ? '#64748b' : '#eab308';
            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(2.5, cellW * 0.7), 0, Math.PI * 2);
            ctx.fill();
            if (!isOpened) {
              ctx.strokeStyle = '#fef08a';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }
    }

    // 3. Draw Discovered NPCs
    if (currentZone.npcs) {
      currentZone.npcs.forEach((npc) => {
        if (npc.x >= startX && npc.x < endX && npc.y >= startY && npc.y < endY) {
          const isRevealed = !exploredTiles || exploredTiles.has(`${npc.x},${npc.y}`);
          if (isRevealed) {
            const nx = (npc.x - startX) * cellW + cellW / 2;
            const ny = (npc.y - startY) * cellH + cellH / 2;

            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(nx, ny, Math.max(3.5, cellW * 0.9), 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      });
    }

    // 4. Draw Discovered Boss Portal (Tile 11 o 6)
    if (currentZone.tileData) {
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          if (currentZone.tileData[y]?.[x] === 11 || currentZone.tileData[y]?.[x] === 6) {
            const isRevealed = !exploredTiles || exploredTiles.has(`${x},${y}`);
            if (isRevealed) {
              const bx = (x - startX) * cellW + cellW / 2;
              const by = (y - startY) * cellH + cellH / 2;
              ctx.fillStyle = '#ef4444';
              ctx.beginPath();
              ctx.arc(bx, by, Math.max(4.5, cellW * 1.3), 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#fca5a5';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
          }
        }
      }
    }

    // 5. Draw Discovered Zone Portals / Building Doors (🚪)
    if (currentZone.portals) {
      currentZone.portals.forEach((portal) => {
        if (portal.x >= startX && portal.x < endX && portal.y >= startY && portal.y < endY) {
          const isRevealed = isCreatorMode || !exploredTiles || exploredTiles.has(`${portal.x},${portal.y}`);
          if (isRevealed) {
            const px = (portal.x - startX) * cellW + cellW / 2;
            const py = (portal.y - startY) * cellH + cellH / 2;

            // Outer cyan glow
            ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.beginPath();
            ctx.arc(px, py, Math.max(5, cellW * 1.4), 0, Math.PI * 2);
            ctx.fill();

            // Inner bright door badge
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(px, py, Math.max(3.5, cellW * 0.9), 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      });
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
    <div className="relative bg-slate-950/70 border border-amber-500/50 rounded-lg sm:rounded-xl p-1 sm:p-1.5 shadow-xl backdrop-blur-md flex flex-col items-center select-none font-mono transition-all duration-200">
      {/* Header with Coordinates, Exploration % & Zoom Toggle */}
      <div className="w-full flex items-center justify-between px-0.5 sm:px-1 mb-0.5 sm:mb-1 text-[8px] sm:text-[10px] font-bold text-amber-400">
        <div className="flex items-center space-x-1">
          <Compass className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400" />
          <span className="hidden sm:inline">
            {zoomMode === 'radar' ? 'Radar' : 'Mundo'}
          </span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          <span className="text-emerald-400 text-[8px] sm:text-[9px]">
            {explorationPercent}%
          </span>
          <span className="text-slate-300 text-[8px] sm:text-[9px]">
            [{playerPos.x},{playerPos.y}]
          </span>
          <button
            onClick={() => setZoomMode(zoomMode === 'radar' ? 'full' : 'radar')}
            className="p-0.5 bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-amber-300 rounded border border-slate-700/80 transition"
            title={zoomMode === 'radar' ? 'Ver Mapa Completo' : 'Hacer Zoom Radar'}
          >
            {zoomMode === 'radar' ? <ZoomOut className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <ZoomIn className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={180}
        height={160}
        onClick={handleCanvasClick}
        className="w-[105px] h-[90px] sm:w-[180px] sm:h-[160px] rounded-md sm:rounded-lg border border-slate-800/80 cursor-pointer shadow-inner bg-slate-950/80"
        title="Haz clic para inspeccionar coordenadas"
      />

      {/* Legend (Visible on Tablets and PC, hidden on mobile for clean HUD) */}
      <div className="hidden sm:grid w-full grid-cols-5 gap-0.5 mt-1 text-[8px] text-slate-400 font-bold text-center">
        <div className="flex items-center justify-center space-x-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Héroe</span>
        </div>
        <div className="flex items-center justify-center space-x-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>NPC</span>
        </div>
        <div className="flex items-center justify-center space-x-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span>Puerta</span>
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
