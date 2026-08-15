import React, { useEffect, useRef } from 'react';
import { Zone, PlayerStats } from '../types';

interface TileMapCanvasProps {
  currentZone: Zone;
  playerPos: { x: number; y: number };
  player: PlayerStats;
  facingDir: 'up' | 'down' | 'left' | 'right';
  openedChests: string[];
  defeatedBosses: string[];
  onTileClick?: (x: number, y: number) => void;
}

export const TileMapCanvas: React.FC<TileMapCanvasProps> = ({
  currentZone,
  playerPos,
  player,
  facingDir,
  openedChests,
  defeatedBosses,
  onTileClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Smooth interpolated player position for fluid movement
  const interpolatedPosRef = useRef<{ x: number; y: number }>({
    x: playerPos.x,
    y: playerPos.y,
  });

  // Spell / Embers VFX particles
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      life: number;
      maxLife: number;
    }>
  >([]);

  const isBossDefeated = defeatedBosses.includes(currentZone.boss.name);

  // Initialize atmospheric particles
  useEffect(() => {
    const particles = [];
    const count = currentZone.id === 'zone_forest' ? 45 : currentZone.id === 'zone_volcano' ? 55 : 35;
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(currentZone.id, 760, 520));
    }
    particlesRef.current = particles;
  }, [currentZone.id]);

  function createParticle(zoneId: string, w: number, h: number) {
    if (zoneId === 'zone_forest') {
      // Autumn red/amber leaf and golden spell embers (like in Grim Dawn)
      const isRedLeaf = Math.random() > 0.4;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.3) * 0.8,
        vy: 0.4 + Math.random() * 0.7,
        size: isRedLeaf ? 2.5 + Math.random() * 3 : 1 + Math.random() * 2,
        alpha: 0.5 + Math.random() * 0.5,
        color: isRedLeaf ? (Math.random() > 0.5 ? '#ef4444' : '#f97316') : '#fde047',
        life: 0,
        maxLife: 180 + Math.random() * 250,
      };
    } else if (zoneId === 'zone_cave') {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.3 + Math.random() * 0.6,
        color: Math.random() > 0.5 ? '#38bdf8' : '#c084fc',
        life: 0,
        maxLife: 150 + Math.random() * 200,
      };
    } else if (zoneId === 'zone_volcano') {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.0,
        vy: -(0.8 + Math.random() * 1.4),
        size: 1.5 + Math.random() * 3,
        alpha: 0.6 + Math.random() * 0.4,
        color: Math.random() > 0.3 ? '#ea580c' : '#fef08a',
        life: 0,
        maxLife: 100 + Math.random() * 160,
      };
    } else {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: 0.6 + Math.random() * 0.8,
        size: 2 + Math.random() * 3,
        alpha: 0.3 + Math.random() * 0.5,
        color: '#a855f7',
        life: 0,
        maxLife: 160 + Math.random() * 200,
      };
    }
  }

  // ISOMETRIC PROJECTION CONSTANTS
  const tileWidth = 64;  // Horizontal diamond span
  const tileHeight = 32; // Vertical diamond span
  const tileThickness = 12; // 3D tile height extrusion

  // Helper: Grid (x,y) -> Screen Canvas (isoX, isoY)
  const toIso = (gridX: number, gridY: number, originX: number, originY: number) => {
    const isoX = originX + (gridX - gridY) * (tileWidth / 2);
    const isoY = originY + (gridX + gridY) * (tileHeight / 2);
    return { x: isoX, y: isoY };
  };

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.03;

      const mapW = currentZone.mapWidth;
      const mapH = currentZone.mapHeight;

      // Canvas dimensions
      const renderW = 760;
      const renderH = 500;

      if (canvas.width !== renderW || canvas.height !== renderH) {
        canvas.width = renderW;
        canvas.height = renderH;
      }

      const originX = renderW / 2;
      const originY = 85;

      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, renderW, renderH);

      // Smooth interpolation for player movement
      const targetX = playerPos.x;
      const targetY = playerPos.y;
      const currentPos = interpolatedPosRef.current;
      currentPos.x += (targetX - currentPos.x) * 0.22;
      currentPos.y += (targetY - currentPos.y) * 0.22;

      // 1. DRAW ISOMETRIC GROUND TILES (Row by Row for Depth)
      for (let y = 0; y < mapH; y++) {
        for (let x = 0; x < mapW; x++) {
          const tile = currentZone.tileData[y]?.[x] ?? 0;
          const { x: isoX, y: isoY } = toIso(x, y, originX, originY);

          drawIsoGroundTile(ctx, currentZone.id, tile, isoX, isoY, tileWidth, tileHeight, tileThickness, x, y);
        }
      }

      // 2. DRAW ISOMETRIC OBJECTS & CHARACTERS IN DEPTH ORDER (Sorted by x + y)
      for (let sum = 0; sum < mapW + mapH; sum++) {
        for (let y = 0; y < mapH; y++) {
          const x = sum - y;
          if (x < 0 || x >= mapW) continue;

          const tile = currentZone.tileData[y]?.[x] ?? 0;
          const { x: isoX, y: isoY } = toIso(x, y, originX, originY);
          const chestId = `${currentZone.id}_${x}_${y}`;
          const isOpened = openedChests.includes(chestId);

          // Draw ground path overlay first
          if (tile === 2) {
            drawIsoPath(ctx, currentZone.id, isoX, isoY, tileWidth, tileHeight);
          }

          // Draw environmental obstacles & buildings
          if (tile === 1) {
            drawIsoObstacle(ctx, currentZone.id, isoX, isoY, tileWidth, tileHeight, x, y, time);
          } else if (tile === 3) {
            drawIsoWaterOrLava(ctx, currentZone.id, isoX, isoY, tileWidth, tileHeight, time);
          } else if (tile === 4) {
            drawIsoMerchant(ctx, isoX, isoY, tileWidth, tileHeight, time);
          } else if (tile === 5) {
            drawIsoTavern(ctx, isoX, isoY, tileWidth, tileHeight, time);
          } else if (tile === 6) {
            drawIsoBossPortal(ctx, isoX, isoY, tileWidth, tileHeight, isBossDefeated, time, currentZone.boss.name);
          } else if (tile === 7) {
            drawIsoTreasureChest(ctx, isoX, isoY, tileWidth, tileHeight, isOpened, time);
          } else if (tile === 8) {
            drawIsoCottage(ctx, currentZone.id, isoX, isoY, tileWidth, tileHeight, time);
          } else if (tile === 9) {
            drawIsoWindmill(ctx, isoX, isoY, tileWidth, tileHeight, time);
          } else if (tile === 10) {
            drawIsoWaterWell(ctx, isoX, isoY, tileWidth, tileHeight, time);
          } else if (tile === 11) {
            drawIsoForge(ctx, isoX, isoY, tileWidth, tileHeight, time);
          }

          // Render player when depth matches current interpolated position
          const playerGridSum = Math.round(currentPos.x) + Math.round(currentPos.y);
          if (sum === playerGridSum && Math.abs(x - currentPos.x) < 0.6 && Math.abs(y - currentPos.y) < 0.6) {
            const playerIso = toIso(currentPos.x, currentPos.y, originX, originY);
            drawIsoPlayer(ctx, playerIso.x, playerIso.y, tileWidth, tileHeight, player, facingDir, time);
          }
        }
      }

      // 3. MOBA LIGHTING & ATMOSPHERIC VIGNETTE
      drawMobaLighting(ctx, currentZone.id, renderW, renderH, originX, originY, currentPos, time);

      // 4. PARTICLES & SPELL EFFECTS
      updateAndDrawParticles(ctx, renderW, renderH, particlesRef.current);

      // 5. MOBA TOP BOSS HEALTHBAR HUD (If near boss or boss zone)
      drawMobaTopHud(ctx, currentZone, renderW, isBossDefeated);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [currentZone, playerPos, player, facingDir, openedChests, defeatedBosses, isBossDefeated]);

  // Handle click on isometric diamond
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onTileClick || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const renderW = 760;
    const originX = renderW / 2;
    const originY = 85;

    const relX = clickX - originX;
    const relY = clickY - originY;

    // Reverse Isometric formula
    const gridX = Math.floor((relY / (tileHeight / 2) + relX / (tileWidth / 2)) / 2);
    const gridY = Math.floor((relY / (tileHeight / 2) - relX / (tileWidth / 2)) / 2);

    if (gridX >= 0 && gridX < currentZone.mapWidth && gridY >= 0 && gridY < currentZone.mapHeight) {
      onTileClick(gridX, gridY);
    }
  };

  return (
    <div className="relative flex justify-center items-center w-full my-1 select-none">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="rounded-xl border-2 border-amber-900/60 shadow-[0_0_25px_rgba(0,0,0,0.8)] cursor-pointer bg-slate-950 max-w-full h-auto"
      />
    </div>
  );
};

// --- ISOMETRIC GROUND TILE RENDERING WITH 3D DEPTH ---
function drawIsoGroundTile(
  ctx: CanvasRenderingContext2D,
  zoneId: string,
  _tile: number,
  isoX: number,
  isoY: number,
  tw: number,
  th: number,
  thick: number,
  x: number,
  y: number
) {
  const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  const rand = hash - Math.floor(hash);

  const hw = tw / 2;
  const hh = th / 2;

  // Colors per biome
  let topColor = '#15803d';
  let sideLeftColor = '#0f5127';
  let sideRightColor = '#0b3c1d';

  if (zoneId === 'zone_forest') {
    // Grim Dawn style dark forest soil with lush moss & grass patches
    topColor = rand > 0.6 ? '#166534' : rand > 0.3 ? '#15803d' : '#14532d';
    sideLeftColor = '#0a3a1b';
    sideRightColor = '#052310';
  } else if (zoneId === 'zone_cave') {
    topColor = rand > 0.5 ? '#1e1b4b' : '#1e293b';
    sideLeftColor = '#0f172a';
    sideRightColor = '#020617';
  } else if (zoneId === 'zone_volcano') {
    topColor = rand > 0.5 ? '#18181b' : '#27272a';
    sideLeftColor = '#09090b';
    sideRightColor = '#000000';
  } else {
    topColor = rand > 0.5 ? '#334155' : '#1e293b';
    sideLeftColor = '#0f172a';
    sideRightColor = '#020617';
  }

  // 1. LEFT 3D EXTRUSION SIDE
  ctx.fillStyle = sideLeftColor;
  ctx.beginPath();
  ctx.moveTo(isoX - hw, isoY);
  ctx.lineTo(isoX, isoY + hh);
  ctx.lineTo(isoX, isoY + hh + thick);
  ctx.lineTo(isoX - hw, isoY + thick);
  ctx.closePath();
  ctx.fill();

  // 2. RIGHT 3D EXTRUSION SIDE
  ctx.fillStyle = sideRightColor;
  ctx.beginPath();
  ctx.moveTo(isoX, isoY + hh);
  ctx.lineTo(isoX + hw, isoY);
  ctx.lineTo(isoX + hw, isoY + thick);
  ctx.lineTo(isoX, isoY + hh + thick);
  ctx.closePath();
  ctx.fill();

  // 3. TOP ISOMETRIC DIAMOND SURFACE
  ctx.fillStyle = topColor;
  ctx.beginPath();
  ctx.moveTo(isoX, isoY - hh);
  ctx.lineTo(isoX + hw, isoY);
  ctx.lineTo(isoX, isoY + hh);
  ctx.lineTo(isoX - hw, isoY);
  ctx.closePath();
  ctx.fill();

  // Subtle diamond grid border
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Forest details: fallen leaves & grass tufts
  if (zoneId === 'zone_forest' && rand > 0.5) {
    ctx.fillStyle = rand > 0.8 ? '#ef4444' : rand > 0.6 ? '#f97316' : '#22c55e';
    ctx.fillRect(isoX - 6 + rand * 12, isoY - 2 + rand * 4, 3, 2);
  }
}

// --- ISOMETRIC PATHS ---
function drawIsoPath(
  ctx: CanvasRenderingContext2D,
  zoneId: string,
  isoX: number,
  isoY: number,
  tw: number,
  th: number
) {
  const hw = tw / 2 - 4;
  const hh = th / 2 - 2;

  ctx.fillStyle = zoneId === 'zone_forest' ? '#78350f' : '#475569';
  ctx.beginPath();
  ctx.moveTo(isoX, isoY - hh);
  ctx.lineTo(isoX + hw, isoY);
  ctx.lineTo(isoX, isoY + hh);
  ctx.lineTo(isoX - hw, isoY);
  ctx.closePath();
  ctx.fill();

  // Inner path texture
  ctx.fillStyle = zoneId === 'zone_forest' ? '#92400e' : '#64748b';
  ctx.beginPath();
  ctx.moveTo(isoX, isoY - hh + 3);
  ctx.lineTo(isoX + hw - 6, isoY);
  ctx.lineTo(isoX, isoY + hh - 3);
  ctx.lineTo(isoX - hw + 6, isoY);
  ctx.closePath();
  ctx.fill();
}

// --- ISOMETRIC OBSTACLES (AUTUMN TREES, CRAGGY ROCKS, CASTLE WALLS) ---
function drawIsoObstacle(
  ctx: CanvasRenderingContext2D,
  zoneId: string,
  isoX: number,
  isoY: number,
  _tw: number,
  _th: number,
  x: number,
  y: number,
  time: number
) {
  const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  const rand = hash - Math.floor(hash);

  if (zoneId === 'zone_forest') {
    // Autumn Red & Golden Oak / Evergreen Trees (like Grim Dawn screenshot!)
    const wind = Math.sin(time * 2 + x + y) * 2;
    const isAutumnRed = rand > 0.3;

    // Tree Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(isoX + 4, isoY + 4, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.fillStyle = '#451a03';
    ctx.fillRect(isoX - 3, isoY - 24, 6, 24);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(isoX - 1, isoY - 24, 2, 24);

    if (isAutumnRed) {
      // Layered Autumn Red & Crimson Foliage
      drawFoliageLayer(ctx, isoX + wind, isoY - 32, 22, '#7f1d1d', '#dc2626');
      drawFoliageLayer(ctx, isoX - 4 + wind * 1.2, isoY - 42, 18, '#991b1b', '#ef4444');
      drawFoliageLayer(ctx, isoX + 2 + wind * 1.4, isoY - 52, 13, '#b91c1c', '#f87171');
    } else {
      // Golden / Orange Canopy
      drawFoliageLayer(ctx, isoX + wind, isoY - 32, 22, '#7c2d12', '#d97706');
      drawFoliageLayer(ctx, isoX - 3 + wind * 1.2, isoY - 42, 17, '#9a3412', '#f59e0b');
      drawFoliageLayer(ctx, isoX + 2 + wind * 1.4, isoY - 52, 12, '#c2410c', '#fbbf24');
    }
  } else if (zoneId === 'zone_cave') {
    // Craggy Cavern Rock Boulders with Specular Highlights (matching ref image!)
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(isoX, isoY + 4, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rock Faces
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(isoX - 14, isoY + 2);
    ctx.lineTo(isoX - 4, isoY - 22);
    ctx.lineTo(isoX + 12, isoY - 14);
    ctx.lineTo(isoX + 14, isoY + 2);
    ctx.lineTo(isoX, isoY + 8);
    ctx.closePath();
    ctx.fill();

    // Highlight Face
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(isoX - 4, isoY - 22);
    ctx.lineTo(isoX + 12, isoY - 14);
    ctx.lineTo(isoX + 4, isoY + 2);
    ctx.closePath();
    ctx.fill();
  } else if (zoneId === 'zone_volcano') {
    // Volcanic Lava Spire
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(isoX - 12, isoY + 4);
    ctx.lineTo(isoX, isoY - 32);
    ctx.lineTo(isoX + 12, isoY + 4);
    ctx.closePath();
    ctx.fill();

    // Glowing Lava Veins
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(isoX, isoY - 28);
    ctx.lineTo(isoX - 3, isoY - 10);
    ctx.lineTo(isoX + 4, isoY + 2);
    ctx.stroke();
  } else {
    // Castle Gothic Wall Pillar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(isoX - 10, isoY - 30, 20, 30);
    ctx.fillStyle = '#334155';
    ctx.fillRect(isoX - 8, isoY - 28, 16, 28);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(isoX - 2, isoY - 20, 4, 6);
  }
}

function drawFoliageLayer(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  darkColor: string,
  lightColor: string
) {
  ctx.fillStyle = darkColor;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = lightColor;
  ctx.beginPath();
  ctx.arc(cx - radius * 0.3, cy - radius * 0.3, radius * 0.65, 0, Math.PI * 2);
  ctx.fill();
}

// --- WATER / LAVA ---
function drawIsoWaterOrLava(
  ctx: CanvasRenderingContext2D,
  zoneId: string,
  isoX: number,
  isoY: number,
  tw: number,
  th: number,
  time: number
) {
  const hw = tw / 2 - 2;
  const hh = th / 2 - 1;
  const wave = Math.sin(time * 3 + isoX * 0.05) * 2;

  ctx.fillStyle = zoneId === 'zone_volcano' ? '#c2410c' : '#1d4ed8';
  ctx.beginPath();
  ctx.moveTo(isoX, isoY - hh + wave);
  ctx.lineTo(isoX + hw, isoY + wave);
  ctx.lineTo(isoX, isoY + hh + wave);
  ctx.lineTo(isoX - hw, isoY + wave);
  ctx.closePath();
  ctx.fill();

  // Foam / Ember highlight
  ctx.fillStyle = zoneId === 'zone_volcano' ? '#fef08a' : '#93c5fd';
  ctx.fillRect(isoX - 6, isoY + wave - 2, 12, 3);
}

// --- LANDMARKS ---
function drawIsoMerchant(
  ctx: CanvasRenderingContext2D,
  isoX: number,
  isoY: number,
  _tw: number,
  _th: number,
  _time: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(isoX, isoY + 2, 16, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stand Counter
  ctx.fillStyle = '#78350f';
  ctx.fillRect(isoX - 12, isoY - 14, 24, 14);

  // Awning
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(isoX - 14, isoY - 26, 28, 8);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(isoX - 10, isoY - 26, 6, 8);
  ctx.fillRect(isoX + 4, isoY - 26, 6, 8);

  // Potions
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(isoX - 6, isoY - 18, 4, 4);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(isoX + 2, isoY - 18, 4, 4);
}

function drawIsoTavern(
  ctx: CanvasRenderingContext2D,
  isoX: number,
  isoY: number,
  _tw: number,
  _th: number,
  time: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(isoX, isoY + 4, 20, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // House Base
  ctx.fillStyle = '#475569';
  ctx.fillRect(isoX - 14, isoY - 22, 28, 22);

  // Roof
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.moveTo(isoX - 18, isoY - 22);
  ctx.lineTo(isoX, isoY - 42);
  ctx.lineTo(isoX + 18, isoY - 22);
  ctx.closePath();
  ctx.fill();

  // Door
  ctx.fillStyle = '#78350f';
  ctx.fillRect(isoX - 4, isoY - 12, 8, 12);

  // Window Glow
  const glow = Math.sin(time * 3) * 0.2 + 0.8;
  ctx.fillStyle = `rgba(254, 240, 138, ${glow})`;
  ctx.fillRect(isoX - 10, isoY - 18, 4, 4);
}

function drawIsoBossPortal(
  ctx: CanvasRenderingContext2D,
  isoX: number,
  isoY: number,
  _tw: number,
  _th: number,
  isDefeated: boolean,
  time: number,
  bossName: string
) {
  // Portal Arch
  ctx.fillStyle = isDefeated ? '#475569' : '#0f172a';
  ctx.beginPath();
  ctx.arc(isoX, isoY - 18, 16, Math.PI, 0);
  ctx.lineTo(isoX + 16, isoY);
  ctx.lineTo(isoX - 16, isoY);
  ctx.closePath();
  ctx.fill();

  // Inner Swirling Void
  const aura = Math.sin(time * 4) * 0.2 + 0.8;
  ctx.fillStyle = isDefeated ? `rgba(168, 85, 247, ${aura})` : `rgba(239, 68, 68, ${aura})`;
  ctx.beginPath();
  ctx.ellipse(isoX, isoY - 16, 11, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Boss Tag
  ctx.fillStyle = isDefeated ? '#c084fc' : '#f87171';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(isDefeated ? '✨ DESPEJADO' : '💀 ' + bossName.split(' ')[0], isoX, isoY - 38);
}

function drawIsoTreasureChest(
  ctx: CanvasRenderingContext2D,
  isoX: number,
  isoY: number,
  _tw: number,
  _th: number,
  isOpened: boolean,
  time: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(isoX, isoY + 2, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (!isOpened) {
    const pulse = Math.sin(time * 4) * 0.25 + 0.5;
    ctx.fillStyle = `rgba(245, 158, 11, ${pulse})`;
    ctx.beginPath();
    ctx.arc(isoX, isoY - 8, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#78350f';
    ctx.fillRect(isoX - 8, isoY - 14, 16, 12);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(isoX - 8, isoY - 14, 16, 3);
    ctx.fillRect(isoX - 2, isoY - 9, 4, 4);
  } else {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(isoX - 8, isoY - 10, 16, 8);
  }
}

// --- MOBA ISOMETRIC PLAYER CHARACTER & OVERHEAD HEALTHBAR HUD ---
function drawIsoCottage(
  ctx: CanvasRenderingContext2D,
  zoneId: string,
  isoX: number,
  isoY: number,
  _tw: number,
  _th: number,
  time: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(isoX, isoY + 4, 22, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stone Walls
  ctx.fillStyle = '#64748b';
  ctx.fillRect(isoX - 16, isoY - 24, 32, 24);

  // Timber Beams
  ctx.fillStyle = '#78350f';
  ctx.fillRect(isoX - 16, isoY - 24, 4, 24);
  ctx.fillRect(isoX + 12, isoY - 24, 4, 24);

  // Red / Blue Shingle Roof
  ctx.fillStyle = zoneId === 'zone_forest' ? '#dc2626' : '#0284c7';
  ctx.beginPath();
  ctx.moveTo(isoX - 20, isoY - 24);
  ctx.lineTo(isoX, isoY - 44);
  ctx.lineTo(isoX + 20, isoY - 24);
  ctx.closePath();
  ctx.fill();

  // Chimney & Smoke
  ctx.fillStyle = '#334155';
  ctx.fillRect(isoX + 6, isoY - 48, 6, 14);

  const smokeY = isoY - 52 - ((time * 15) % 15);
  ctx.fillStyle = 'rgba(241, 245, 249, 0.6)';
  ctx.beginPath();
  ctx.arc(isoX + 9, smokeY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Door
  ctx.fillStyle = '#451a03';
  ctx.fillRect(isoX - 4, isoY - 14, 8, 14);

  // Glowing Window
  const glow = Math.sin(time * 3) * 0.2 + 0.8;
  ctx.fillStyle = `rgba(253, 224, 71, ${glow})`;
  ctx.fillRect(isoX - 12, isoY - 18, 5, 5);
}

function drawIsoWindmill(
  ctx: CanvasRenderingContext2D,
  isoX: number,
  isoY: number,
  _tw: number,
  _th: number,
  time: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(isoX, isoY + 4, 20, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tower Base
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.moveTo(isoX - 14, isoY);
  ctx.lineTo(isoX - 8, isoY - 38);
  ctx.lineTo(isoX + 8, isoY - 38);
  ctx.lineTo(isoX + 14, isoY);
  ctx.closePath();
  ctx.fill();

  // Cone Roof
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.moveTo(isoX - 12, isoY - 38);
  ctx.lineTo(isoX, isoY - 54);
  ctx.lineTo(isoX + 12, isoY - 38);
  ctx.closePath();
  ctx.fill();

  // Rotating Sails
  const angle = time * 1.5;
  const hubX = isoX;
  const hubY = isoY - 32;

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    const a = angle + (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(hubX, hubY);
    ctx.lineTo(hubX + Math.cos(a) * 20, hubY + Math.sin(a) * 20);
    ctx.stroke();
  }
}

function drawIsoWaterWell(
  ctx: CanvasRenderingContext2D,
  isoX: number,
  isoY: number,
  _tw: number,
  _th: number,
  _time: number
) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(isoX, isoY + 4, 16, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stone Rim
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.ellipse(isoX, isoY - 4, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Blue Water
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.ellipse(isoX, isoY - 5, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Roof Canopy
  ctx.fillStyle = '#78350f';
  ctx.fillRect(isoX - 12, isoY - 20, 3, 16);
  ctx.fillRect(isoX + 9, isoY - 20, 3, 16);

  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.moveTo(isoX - 16, isoY - 20);
  ctx.lineTo(isoX, isoY - 30);
  ctx.lineTo(isoX + 16, isoY - 20);
  ctx.closePath();
  ctx.fill();
}

function drawIsoForge(
  ctx: CanvasRenderingContext2D,
  isoX: number,
  isoY: number,
  _tw: number,
  _th: number,
  time: number
) {
  // Stone Furnace
  ctx.fillStyle = '#334155';
  ctx.fillRect(isoX - 14, isoY - 20, 16, 20);

  // Glowing Embers
  const emberGlow = Math.sin(time * 6) * 0.3 + 0.7;
  ctx.fillStyle = `rgba(249, 115, 22, ${emberGlow})`;
  ctx.fillRect(isoX - 10, isoY - 12, 8, 8);

  // Anvil
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(isoX + 4, isoY - 10, 10, 6);
  ctx.fillRect(isoX + 6, isoY - 4, 6, 4);
}

function drawIsoPlayer(
  ctx: CanvasRenderingContext2D,
  isoX: number,
  isoY: number,
  _tw: number,
  _th: number,
  player: PlayerStats,
  facingDir: string,
  time: number
) {
  const bounce = Math.sin(time * 10) * 1.5;

  // Ground Selection Ring (MOBA Cursor Ring)
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(isoX, isoY + 2, 16, 8, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Spell Aura Pulse around feet
  const spellGlow = Math.sin(time * 3) * 0.15 + 0.25;
  ctx.fillStyle = `rgba(59, 130, 246, ${spellGlow})`;
  ctx.beginPath();
  ctx.ellipse(isoX, isoY + 2, 22, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Character Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(isoX, isoY, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Class Body
  let bodyColor = '#ef4444'; // Guerrero
  if (player.heroClass === 'Mago') bodyColor = '#3b82f6';
  if (player.heroClass === 'Pícaro') bodyColor = '#10b981';

  // Body Trunk
  ctx.fillStyle = bodyColor;
  ctx.fillRect(isoX - 6, isoY - 22 + bounce, 12, 16);

  // Head
  ctx.fillStyle = '#fde047';
  ctx.fillRect(isoX - 5, isoY - 30 + bounce, 10, 8);

  // Visor / Eyes
  ctx.fillStyle = '#0f172a';
  if (facingDir === 'right' || facingDir === 'down') {
    ctx.fillRect(isoX, isoY - 27 + bounce, 3, 2);
  } else {
    ctx.fillRect(isoX - 3, isoY - 27 + bounce, 3, 2);
  }

  // Weapon / Weapon Glow
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(isoX + 7, isoY - 26 + bounce, 3, 14);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(isoX + 6, isoY - 28 + bounce, 5, 3);

  // --- OVERHEAD MOBA HEALTHBAR (Just like in MOBA / ARPG photo!) ---
  const barY = isoY - 42 + bounce;

  // Nameplate & Level
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(isoX - 36, barY - 14, 72, 12);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.strokeRect(isoX - 36, barY - 14, 72, 12);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${player.name} (Lvl ${player.level})`, isoX, barY - 5);

  // HP Green Bar
  const hpPercent = Math.max(0, Math.min(1, player.hp / player.maxHp));
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(isoX - 30, barY, 60, 5);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(isoX - 30, barY, 60 * hpPercent, 5);

  // MP Blue Bar
  const mpPercent = Math.max(0, Math.min(1, player.mp / player.maxMp));
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(isoX - 30, barY + 6, 60, 3);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(isoX - 30, barY + 6, 60 * mpPercent, 3);
}

// --- LIGHTING & MOBA VIGNETTE WITH DYNAMIC RADIAL GLOWS ---
function drawMobaLighting(
  ctx: CanvasRenderingContext2D,
  zoneId: string,
  w: number,
  h: number,
  originX: number,
  originY: number,
  pos: { x: number; y: number },
  time: number
) {
  // Player torch radial light in center of player position with warm organic flicker
  const isoX = originX + (pos.x - pos.y) * (64 / 2);
  const isoY = originY + (pos.x + pos.y) * (32 / 2);
  const flicker = Math.sin(time * 6) * 6 + Math.cos(time * 11) * 3;

  // 1. Dark atmospheric vignette
  const grad = ctx.createRadialGradient(isoX, isoY, Math.max(30, 45 + flicker), isoX, isoY, 340);

  if (zoneId === 'zone_forest') {
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.05)');
    grad.addColorStop(0.3, 'rgba(16, 185, 129, 0.02)');
    grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.5)');
    grad.addColorStop(1, 'rgba(3, 7, 18, 0.88)');
  } else if (zoneId === 'zone_volcano') {
    grad.addColorStop(0, 'rgba(249, 115, 22, 0.15)');
    grad.addColorStop(0.4, 'rgba(234, 88, 12, 0.25)');
    grad.addColorStop(0.75, 'rgba(67, 20, 7, 0.65)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0.92)');
  } else if (zoneId === 'zone_cave') {
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.06)');
    grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.65)');
    grad.addColorStop(1, 'rgba(2, 6, 23, 0.94)');
  } else {
    // Castle / Abyss
    grad.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
    grad.addColorStop(0.5, 'rgba(30, 27, 75, 0.65)');
    grad.addColorStop(1, 'rgba(9, 9, 11, 0.95)');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 2. Extra warm torch light pool right under the character
  const torchGlow = ctx.createRadialGradient(isoX, isoY - 10, 0, isoX, isoY - 10, 95 + flicker);
  torchGlow.addColorStop(0, 'rgba(253, 224, 71, 0.18)');
  torchGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.08)');
  torchGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = torchGlow;
  ctx.fillRect(0, 0, w, h);
}

// --- ATMOSPHERIC PARTICLES WITH GLOW & TWINKLE ---
function updateAndDrawParticles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
    life: number;
    maxLife: number;
  }>
) {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;

    // Glowing core particle
    ctx.save();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// --- TOP MOBA BOSS STATUS HUD (High Polish Frame & Glow) ---
function drawMobaTopHud(
  ctx: CanvasRenderingContext2D,
  zone: Zone,
  w: number,
  isBossDefeated: boolean
) {
  const boss = zone.boss;
  const hudW = 320;
  const hudX = (w - hudW) / 2;
  const hudY = 12;

  // Background banner with gradient
  const bannerGrad = ctx.createLinearGradient(hudX, hudY, hudX + hudW, hudY + 34);
  bannerGrad.addColorStop(0, '#090d16');
  bannerGrad.addColorStop(0.5, '#1e293b');
  bannerGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = bannerGrad;
  ctx.fillRect(hudX, hudY, hudW, 34);

  // Border with gold or purple highlight
  ctx.strokeStyle = isBossDefeated ? '#c084fc' : '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(hudX, hudY, hudW, 34);

  // Boss Name Plate with icon
  ctx.fillStyle = isBossDefeated ? '#c084fc' : '#fde047';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    `${isBossDefeated ? '✨' : '💀'} ${boss.name.toUpperCase()} ${isBossDefeated ? '— DERROTADO' : '— JEFE SUPREMO'}`,
    w / 2,
    hudY + 14
  );

  // Boss HP Bar Container
  ctx.fillStyle = '#020617';
  ctx.fillRect(hudX + 12, hudY + 20, hudW - 24, 8);

  // HP Bar with glowing gradient
  const hpGrad = ctx.createLinearGradient(hudX + 12, 0, hudX + hudW - 12, 0);
  if (isBossDefeated) {
    hpGrad.addColorStop(0, '#7e22ce');
    hpGrad.addColorStop(1, '#c084fc');
  } else {
    hpGrad.addColorStop(0, '#dc2626');
    hpGrad.addColorStop(0.5, '#ef4444');
    hpGrad.addColorStop(1, '#f87171');
  }
  ctx.fillStyle = hpGrad;
  ctx.fillRect(hudX + 12, hudY + 20, isBossDefeated ? hudW - 24 : hudW - 24, 8);

  // Specular top highlight line on the boss HP bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(hudX + 12, hudY + 20, hudW - 24, 2);
}
