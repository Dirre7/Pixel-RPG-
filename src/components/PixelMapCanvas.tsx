import React, { useEffect, useRef, useState } from 'react';
import { Zone, PlayerStats, EquipmentItem } from '../types';
import { getHeroSpriteCanvas, Direction, AnimationState } from '../utils/pixelSpriteGenerator';
import {
  getTileCanvas,
  getTreeCanvas,
  getStoneWallCanvas,
  getChestCanvas,
  getCottageCanvas,
  getWindmillCanvas,
  getWaterWellCanvas,
  getForgeCanvas,
  getShrineCanvas,
  getStreetLampCanvas,
  getGraveyardCanvas,
  getRuinedPillarCanvas,
  getCampfireCanvas,
} from '../utils/pixelTilesetGenerator';

interface PixelMapCanvasProps {
  currentZone: Zone;
  playerPos: { x: number; y: number };
  player: PlayerStats;
  equipment: {
    weapon?: EquipmentItem;
    armor?: EquipmentItem;
    shield?: EquipmentItem;
    ring?: EquipmentItem;
    necklace?: EquipmentItem;
  };
  openedChests: string[];
  activeShrines: string[];
  onPlayerMove: (newPos: { x: number; y: number }) => void;
  onInteract: () => void;
}

export const PixelMapCanvas: React.FC<PixelMapCanvasProps> = ({
  currentZone,
  playerPos,
  player,
  openedChests,
  onPlayerMove,
  onInteract,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [direction, setDirection] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState(false);

  // Posición suave del jugador para movimiento fluido entre casillas
  const currentPosRef = useRef({ x: playerPos.x, y: playerPos.y });
  const targetPosRef = useRef({ x: playerPos.x, y: playerPos.y });

  useEffect(() => {
    targetPosRef.current = { x: playerPos.x, y: playerPos.y };
  }, [playerPos]);

  // Bucle de Renderizado 2D a 60 FPS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    let animId: number;
    let time = 0;

    const TILE_SIZE = 32; // Baldosas de 32x32 píxeles

    const render = () => {
      time += 0.03;

      // Interpolación suave del jugador hacia la casilla destino
      const lerpSpeed = 0.22;
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * lerpSpeed;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * lerpSpeed;

      const dist = Math.hypot(
        targetPosRef.current.x - currentPosRef.current.x,
        targetPosRef.current.y - currentPosRef.current.y
      );
      const moving = dist > 0.05;
      setIsMoving(moving);

      // Limpiar lienzo
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cámara centrada en el jugador
      const camX = currentPosRef.current.x * TILE_SIZE - canvas.width / 2 + TILE_SIZE / 2;
      const camY = currentPosRef.current.y * TILE_SIZE - canvas.height / 2 + TILE_SIZE / 2;

      ctx.save();
      ctx.translate(-Math.round(camX), -Math.round(camY));

      const rows = currentZone.tileData.length;
      const cols = currentZone.tileData[0]?.length || 0;

      // Viewport culling boundaries (only compute & draw visible tiles + safety margin)
      const startCol = Math.max(0, Math.floor(camX / TILE_SIZE) - 2);
      const endCol = Math.min(cols - 1, Math.ceil((camX + canvas.width) / TILE_SIZE) + 2);
      const startRow = Math.max(0, Math.floor(camY / TILE_SIZE) - 2);
      const endRow = Math.min(rows - 1, Math.ceil((camY + canvas.height) / TILE_SIZE) + 2);

      // ------------------------------------------------------------------------
      // CAPA 0: BALDOSAS DE SUELO BASE Y CAMINOS
      // ------------------------------------------------------------------------
      for (let y = startRow; y <= endRow; y++) {
        for (let x = startCol; x <= endCol; x++) {
          const tileType = currentZone.tileData[y][x];
          const tileCanvas = getTileCanvas(tileType === 1 ? 0 : tileType, currentZone.id, time * 2);
          ctx.drawImage(tileCanvas, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }

      // ------------------------------------------------------------------------
      // CAPA 1 & 2: ENTIDADES Y OBSTÁCULOS (Y-SORTING PARA PROFUNDIDAD REAL)
      // ------------------------------------------------------------------------
      interface RenderableEntity {
        ySort: number;
        draw: (ctx: CanvasRenderingContext2D) => void;
      }

      const entities: RenderableEntity[] = [];

      // 1. Árboles, Estructuras y Props según tileData (dentro del viewport)
      const { trunk: treeTrunk, canopy: treeCanopy } = getTreeCanvas(currentZone.id);
      const stoneWall = getStoneWallCanvas();
      const cottageRed = getCottageCanvas('red');
      const cottageBlue = getCottageCanvas('blue');
      const waterWell = getWaterWellCanvas(time * 2);
      const windmill = getWindmillCanvas(time * 1.5);
      const forge = getForgeCanvas(time);
      const shrine = getShrineCanvas(false, time);
      const bossPortal = getShrineCanvas(true, time);

      for (let y = startRow; y <= endRow; y++) {
        for (let x = startCol; x <= endCol; x++) {
          const tileType = currentZone.tileData[y][x];
          const posX = x * TILE_SIZE;
          const posY = y * TILE_SIZE;

          if (tileType === 1) {
            // Muros de piedra en Castillo / Cueva, o Árboles frondosos en la naturaleza
            if (currentZone.id === 'zone_castle' || currentZone.id === 'zone_cave') {
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(stoneWall, posX, posY - 4, 32, 36);
                },
              });
            } else {
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(treeTrunk, posX - 8, posY, 48, 36);
                  c.drawImage(treeCanopy, posX - 16, posY - 36, 64, 64);
                },
              });
            }
          } else if (tileType === 4) {
            // Gran Fuente Monumental / Pozo de Piedra
            entities.push({
              ySort: posY + TILE_SIZE + 4,
              draw: (c) => {
                c.drawImage(waterWell, posX - 16, posY - 16, 64, 64);
              },
            });
          } else if (tileType === 5) {
            // Casita de Aldea / Taberna de Madera
            entities.push({
              ySort: posY + TILE_SIZE + 10,
              draw: (c) => {
                c.drawImage(cottageRed, posX - 16, posY - 24, 64, 64);
              },
            });
          } else if (tileType === 6) {
            // Molino de Viento con aspas
            entities.push({
              ySort: posY + TILE_SIZE + 12,
              draw: (c) => {
                c.drawImage(windmill, posX - 8, posY - 24, 48, 56);
              },
            });
          } else if (tileType === 7) {
            // Cofre del Tesoro
            const chestId = `${currentZone.id}_${x}_${y}`;
            const isOpen = openedChests.includes(chestId);
            const chestCanvas = getChestCanvas(isOpen);
            entities.push({
              ySort: posY + TILE_SIZE - 4,
              draw: (c) => {
                c.drawImage(chestCanvas, posX + 2, posY + 4, 28, 28);
              },
            });
          } else if (tileType === 8) {
            // Santuario Ancestral
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(shrine, posX - 8, posY - 14, 48, 48);
              },
            });
          } else if (tileType === 9) {
            // Puesto de Mercado / Tienda Azul
            entities.push({
              ySort: posY + TILE_SIZE + 10,
              draw: (c) => {
                c.drawImage(cottageBlue, posX - 16, posY - 24, 64, 64);
              },
            });
          } else if (tileType === 10) {
            // Forja del Herrero
            entities.push({
              ySort: posY + TILE_SIZE + 6,
              draw: (c) => {
                c.drawImage(forge, posX - 8, posY - 12, 48, 48);
              },
            });
          } else if (tileType === 11) {
            // Portal de Jefe
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(bossPortal, posX - 8, posY - 14, 48, 48);
              },
            });
          } else if (tileType === 16) {
            // Lápida de Cementerio
            const tombstone = getGraveyardCanvas();
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(tombstone, posX + 4, posY + 4, 24, 28);
              },
            });
          } else if (tileType === 17) {
            // Farola de Camino / Linterna
            const lamp = getStreetLampCanvas(time);
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(lamp, posX + 4, posY - 2, 24, 36);
              },
            });
          } else if (tileType === 18) {
            // Columna de Ruina Clásica
            const pillar = getRuinedPillarCanvas();
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(pillar, posX + 4, posY - 2, 24, 36);
              },
            });
          } else if (tileType === 19) {
            // Fogata de Campamento
            const campfire = getCampfireCanvas(time);
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(campfire, posX + 2, posY + 4, 28, 28);
              },
            });
          }
        }
      }

      // 2. Cofres del tesoro registrados en currentZone.chests (si no están ya en tileData)
      if (currentZone.chests) {
        currentZone.chests.forEach((chest) => {
          if (currentZone.tileData[chest.y]?.[chest.x] !== 7) {
            const isOpen = openedChests.includes(chest.id);
            const chestCanvas = getChestCanvas(isOpen);
            const cX = chest.x * TILE_SIZE;
            const cY = chest.y * TILE_SIZE;

            entities.push({
              ySort: cY + TILE_SIZE - 4,
              draw: (c) => {
                c.drawImage(chestCanvas, cX + 4, cY + 8, 24, 24);
              },
            });
          }
        });
      }

      // 3. NPCs con marcadores de misión flotantes
      if (currentZone.npcs) {
        currentZone.npcs.forEach((npc) => {
          const nX = npc.x * TILE_SIZE;
          const nY = npc.y * TILE_SIZE;
          const npcClass =
            npc.avatarStyle === 'blacksmith' ? 'Berserker' :
            npc.avatarStyle === 'wizard' ? 'Mago' :
            npc.avatarStyle === 'knight' ? 'Paladín' :
            npc.avatarStyle === 'scout' ? 'Pícaro' :
            npc.avatarStyle === 'elf' ? 'Arquero' : 'Guerrero';
          const npcSprite = getHeroSpriteCanvas(npcClass, 'male', 'down', 'idle');

          entities.push({
            ySort: nY + TILE_SIZE,
            draw: (c) => {
              c.drawImage(npcSprite, nX, nY, TILE_SIZE, TILE_SIZE);

              // Signo de exclamación flotante (!)
              const bounce = Math.sin(time * 5) * 3;
              c.fillStyle = '#facc15';
              c.fillRect(nX + 14, nY - 14 + bounce, 4, 8);
              c.fillRect(nX + 14, nY - 4 + bounce, 4, 3);
            },
          });
        });
      }

      // 4. Jugador
      const pX = Math.round(currentPosRef.current.x * TILE_SIZE);
      const pY = Math.round(currentPosRef.current.y * TILE_SIZE);

      let animState: AnimationState = 'idle';
      if (moving) {
        const stepFrame = Math.floor(time * 10) % 2;
        animState = stepFrame === 0 ? 'walk1' : 'walk2';
      }

      const playerSprite = getHeroSpriteCanvas(player.heroClass, player.gender, direction, animState);

      entities.push({
        ySort: pY + TILE_SIZE,
        draw: (c) => {
          c.drawImage(playerSprite, pX, pY, TILE_SIZE, TILE_SIZE);
        },
      });

      // Ordenar por Y para que lo que esté más abajo se dibuje encima
      entities.sort((a, b) => a.ySort - b.ySort);
      entities.forEach((e) => e.draw(ctx));

      // ------------------------------------------------------------------------
      // CAPA 3: CLIMA Y PARTÍCULAS PIXELADAS
      // ------------------------------------------------------------------------
      if (currentZone.id === 'zone_forest') {
        // Hojas flotantes de bosque
        for (let i = 0; i < 20; i++) {
          const lx = ((i * 73 + time * 35) % (cols * TILE_SIZE));
          const ly = ((i * 47 + time * 25 + Math.sin(time + i) * 15) % (rows * TILE_SIZE));
          ctx.fillStyle = i % 2 === 0 ? '#86efac' : '#fde047';
          ctx.fillRect(Math.round(lx), Math.round(ly), 2, 2);
        }
      } else if (currentZone.id === 'zone_volcano') {
        // Chispas de lava ascendentes
        for (let i = 0; i < 30; i++) {
          const ex = ((i * 61 + Math.sin(time * 2 + i) * 20) % (cols * TILE_SIZE));
          const ey = ((rows * TILE_SIZE - (i * 37 + time * 50)) % (rows * TILE_SIZE));
          ctx.fillStyle = i % 3 === 0 ? '#facc15' : '#ef4444';
          ctx.fillRect(Math.round(ex), Math.round(ey), 2, 2);
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [currentZone, player, direction, openedChests]);

  return (
    <div className="relative w-full h-full min-h-0 bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full object-cover"
        style={{ imageRendering: 'pixelated' }}
      />

      <div className="absolute top-2 left-2 bg-slate-900/90 px-2 py-1 rounded border border-slate-700/60 text-[10px] text-slate-300 font-pixel">
        🗺️ {currentZone.name}
      </div>
    </div>
  );
};
