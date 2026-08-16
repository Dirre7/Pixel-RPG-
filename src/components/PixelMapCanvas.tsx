import React, { useEffect, useRef, useState } from 'react';
import { Zone, PlayerStats, EquipmentItem } from '../types';
import { getHeroSpriteCanvas, Direction, AnimationState } from '../utils/pixelSpriteGenerator';
import {
  getTileCanvas,
  getTreeCanvas,
  getStoneWallCanvas,
  getChestCanvas,
  getCottageCanvas,
  getStoneManorCanvas,
  getMarketStallCanvas,
  getWeaponRackCanvas,
  getChickenCanvas,
  getWindmillCanvas,
  getWaterWellCanvas,
  getForgeCanvas,
  getShrineCanvas,
  getStreetLampCanvas,
  getGraveyardCanvas,
  getRuinedPillarCanvas,
  getCampfireCanvas,
  getEnchantedTreeCanvas,
  getEnchantedMushroomCanvas,
  getLabyrinthHedgeCanvas,
  getManaCrystalCanvas,
  getShipwreckCanvas,
  getVineyardCanvas,
  getObservatoryCanvas,
  getLighthouseCanvas,
  getChurchCanvas,
  getApothecaryCanvas,
  getTempleOfSunCanvas,
  getMageTowerCanvas,
  getGreatHallCanvas,
  getGargoyleFountainCanvas,
  getSkybridgeCanvas,
  getLeatherworkersGuildCanvas,
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
      const cols = currentZone.tileData[0].length;

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
      // CAPA 1 & 2: ENTIDADES Y OBSTÁCULOS 2.5D (Y-SORTING PARA PROFUNDIDAD REAL)
      // ------------------------------------------------------------------------
      interface RenderableEntity {
        ySort: number;
        draw: (ctx: CanvasRenderingContext2D) => void;
      }

      const entities: RenderableEntity[] = [];

      // 1. Árboles, Estructuras y Props según tileData (dentro del viewport)
      const { trunk: treeTrunk, canopy: treeCanopy } = getTreeCanvas(currentZone.id);
      const stoneWall = getStoneWallCanvas();
      const marketStall = getMarketStallCanvas();
      const weaponRack = getWeaponRackCanvas();
      const chicken = getChickenCanvas(time);
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
            // Gran Fuente Monumental
            entities.push({
              ySort: posY + TILE_SIZE + 4,
              draw: (c) => {
                c.drawImage(waterWell, posX - 16, posY - 16, 64, 64);
                // Gallina curiosa cerca de la fuente
                c.drawImage(chicken, posX + 36, posY + 20, 16, 16);
              },
            });
          } else if (tileType === 5) {
            // Casas Medievales con Variedad de Estilos (Terracota, Pizarra Azul, Paja y Piedra)
            const vIndex = (x * 7 + y * 13) % 4;
            const houseVariant = vIndex === 0 ? 'blue' : vIndex === 1 ? 'straw' : vIndex === 2 ? 'stone' : 'red';
            const houseCanvas = getCottageCanvas(houseVariant);
            entities.push({
              ySort: posY + TILE_SIZE + 10,
              draw: (c) => {
                c.drawImage(houseCanvas, posX - 16, posY - 24, 64, 64);
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
            // Santuario Ancestral / Ayuntamiento
            entities.push({
              ySort: posY + TILE_SIZE + 8,
              draw: (c) => {
                c.drawImage(shrine, posX - 8, posY - 14, 48, 48);
              },
            });
          } else if (tileType === 9) {
            // Puesto de Mercado 2.5D con Toldo a Rayas y Cajones de Víveres
            const stallCanvas = getMarketStallCanvas((x + y) % 3);
            entities.push({
              ySort: posY + TILE_SIZE + 8,
              draw: (c) => {
                c.drawImage(stallCanvas, posX - 8, posY - 12, 48, 48);
              },
            });
          } else if (tileType === 10) {
            // Forja del Herrero con Expositor de Armas
            entities.push({
              ySort: posY + TILE_SIZE + 6,
              draw: (c) => {
                c.drawImage(forge, posX - 8, posY - 12, 48, 48);
                c.drawImage(weaponRack, posX + 28, posY + 2, 32, 32);
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
          } else if (tileType === 13) {
            // Bancales de Cultivo con Gallinas merodeando en algunas casillas
            if ((x + y) % 5 === 0) {
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(chicken, posX + 8, posY + 6, 16, 16);
                },
              });
            }
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
          } else if (tileType === 20) {
            // Árbol / Setas del Bosque Encantado
            const { trunk: encTrunk, canopy: encCanopy } = getEnchantedTreeCanvas();
            const mushroom = getEnchantedMushroomCanvas();
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(encTrunk, posX - 8, posY, 48, 36);
                c.drawImage(encCanopy, posX - 16, posY - 36, 64, 64);
                c.drawImage(mushroom, posX + 16, posY + 16, 24, 24);
              },
            });
          } else if (tileType === 21) {
            // Seto Verde del Laberinto Encantado
            const hedge = getLabyrinthHedgeCanvas();
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(hedge, posX, posY, 32, 32);
              },
            });
          } else if (tileType === 22) {
            // Barco Pirata Naufragado
            const shipwreck = getShipwreckCanvas();
            entities.push({
              ySort: posY + TILE_SIZE + 10,
              draw: (c) => {
                c.drawImage(shipwreck, posX - 16, posY - 14, 64, 54);
              },
            });
          } else if (tileType === 23) {
            // Faro Costero
            const lighthouse = getLighthouseCanvas(time);
            entities.push({
              ySort: posY + TILE_SIZE + 14,
              draw: (c) => {
                c.drawImage(lighthouse, posX - 2, posY - 32, 36, 64);
              },
            });
          } else if (tileType === 24) {
            // Capilla / Iglesia Gótica
            const church = getChurchCanvas();
            entities.push({
              ySort: posY + TILE_SIZE + 12,
              draw: (c) => {
                c.drawImage(church, posX - 16, posY - 24, 64, 64);
              },
            });
          } else if (tileType === 25) {
            // Viñedo de Uvas
            const vineyard = getVineyardCanvas();
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(vineyard, posX, posY, 32, 32);
              },
            });
          } else if (tileType === 26) {
            // Observatorio Astronómico
            const observatory = getObservatoryCanvas();
            entities.push({
              ySort: posY + TILE_SIZE + 8,
              draw: (c) => {
                c.drawImage(observatory, posX - 8, posY - 18, 48, 54);
              },
            });
          } else if (tileType === 27) {
            // Botica de Pociones
            const apothecary = getApothecaryCanvas();
            entities.push({
              ySort: posY + TILE_SIZE + 10,
              draw: (c) => {
                c.drawImage(apothecary, posX - 12, posY - 20, 56, 56);
              },
            });
          } else if (tileType === 28) {
            // Cristal de Maná
            const crystal = getManaCrystalCanvas(time);
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(crystal, posX + 4, posY - 4, 24, 36);
              },
            });
          } else if (tileType === 29) {
            // Gran Templo del Sol (Catedral)
            const temple = getTempleOfSunCanvas();
            entities.push({
              ySort: posY + TILE_SIZE + 16,
              draw: (c) => {
                c.drawImage(temple, posX - 16, posY - 40, 64, 80);
              },
            });
          } else if (tileType === 30) {
            // Torre del Mago
            const mageTower = getMageTowerCanvas(time);
            entities.push({
              ySort: posY + TILE_SIZE + 16,
              draw: (c) => {
                c.drawImage(mageTower, posX - 8, posY - 40, 48, 80);
              },
            });
          } else if (tileType === 31) {
            // Gran Ayuntamiento / Casa Gremial
            const greatHall = getGreatHallCanvas();
            entities.push({
              ySort: posY + TILE_SIZE + 14,
              draw: (c) => {
                c.drawImage(greatHall, posX - 24, posY - 24, 80, 64);
              },
            });
          } else if (tileType === 32) {
            // Gran Estanque con Fuente de Gárgola
            const gargoyleFountain = getGargoyleFountainCanvas(time);
            entities.push({
              ySort: posY + TILE_SIZE + 10,
              draw: (c) => {
                c.drawImage(gargoyleFountain, posX - 16, posY - 16, 64, 64);
              },
            });
          } else if (tileType === 33) {
            // Acueducto / Pasarela Elevada
            const skybridge = getSkybridgeCanvas();
            entities.push({
              ySort: posY + TILE_SIZE + 24,
              draw: (c) => {
                c.drawImage(skybridge, posX - 16, posY - 10, 64, 32);
              },
            });
          } else if (tileType === 34) {
            // Gremio de Curtidores
            const leatherGuild = getLeatherworkersGuildCanvas();
            entities.push({
              ySort: posY + TILE_SIZE + 12,
              draw: (c) => {
                c.drawImage(leatherGuild, posX - 16, posY - 24, 64, 64);
              },
            });
          }
        }
      }

      // 2. Ciudadanos y Comerciantes de la Gran Capital
      if (currentZone.id === 'zone_forest') {
        const capitalCitizens = [
          { name: 'Capitán Garrett (Guardia Real)', class: 'Paladín' as const, x: 240, y: 304, dir: 'down' as Direction },
          { name: 'Archimago Thorne', class: 'Mago' as const, x: 276, y: 314, dir: 'down' as Direction },
          { name: 'Sacerdotisa Solaria', class: 'Paladín' as const, x: 218, y: 314, dir: 'down' as Direction },
          { name: 'Maestro Doran (Herrero Real)', class: 'Berserker' as const, x: 270, y: 338, dir: 'right' as Direction },
          { name: 'Boticaria Elena', class: 'Mago' as const, x: 280, y: 342, dir: 'down' as Direction },
          { name: 'Mercader Cedric (Frutas)', class: 'Pícaro' as const, x: 248, y: 332, dir: 'down' as Direction },
          { name: 'Mercader Barnaby (Telas)', class: 'Pícaro' as const, x: 256, y: 332, dir: 'down' as Direction },
          { name: 'Tabernero Bruno', class: 'Guerrero' as const, x: 246, y: 314, dir: 'down' as Direction },
          { name: 'Curtidor Gareth', class: 'Arquero' as const, x: 206, y: 342, dir: 'down' as Direction },
          { name: 'Doncella Beatrix', class: 'Arquero' as const, x: 226, y: 346, dir: 'right' as Direction },
          { name: 'Granjero Tobías', class: 'Guerrero' as const, x: 202, y: 354, dir: 'down' as Direction },
          { name: 'Guardia del Portal Sur', class: 'Paladín' as const, x: 240, y: 362, dir: 'up' as Direction },
        ];

        capitalCitizens.forEach((citizen) => {
          const cCol = citizen.x;
          const cRow = citizen.y;

          // Only render if in viewport
          if (cCol >= startCol - 2 && cCol <= endCol + 2 && cRow >= startRow - 2 && cRow <= endRow + 2) {
            const drawX = cCol * TILE_SIZE;
            const drawY = cRow * TILE_SIZE;

            // Idle animation with subtle breathing
            const sprite = getHeroSpriteCanvas(citizen.class, 'male', citizen.dir, 'idle');

            entities.push({
              ySort: drawY + TILE_SIZE,
              draw: (c) => {
                // Sombra circular bien pegada a los pies
                c.fillStyle = 'rgba(0, 0, 0, 0.4)';
                c.beginPath();
                c.ellipse(drawX + 16, drawY + 30, 8, 3, 0, 0, Math.PI * 2);
                c.fill();

                // Sprite del personaje
                c.drawImage(sprite, drawX, drawY, 32, 32);

                // Cartel flotante de nombre y rol
                c.fillStyle = 'rgba(15, 23, 42, 0.85)';
                c.beginPath();
                c.roundRect(drawX - 24, drawY - 14, 80, 12, 4);
                c.fill();

                c.fillStyle = '#fde047';
                c.font = 'bold 8px monospace';
                c.textAlign = 'center';
                c.fillText(citizen.name.split(' ')[0], drawX + 16, drawY - 5);
              },
            });
          }
        });
      }

      // 3. Cofres del tesoro registrados en currentZone.chests (si no están ya en tileData)
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

      // 4. NPCs fijos con marcadores de misión flotantes
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
