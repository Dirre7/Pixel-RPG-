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
  getSquarePlazaFountainCanvas,
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

    // Carga Conjunta Armonizada: Cute Fantasy + Pixel Crawler
    const gameAssets = {
      // Cute Fantasy Free
      house: new Image(),
      treeOak: new Image(),
      chest: new Image(),
      fences: new Image(),
      farmLand: new Image(),
      chicken: new Image(),
      cow: new Image(),
      // Pixel Crawler Free Pack
      bonfire: new Image(),
      furnace: new Image(),
      anvil: new Image(),
      alchemy: new Image(),
      farmProps: new Image(),
      knightIdle: new Image(),
      wizzardIdle: new Image(),
      rogueIdle: new Image(),
      peasantIdle: new Image(),
      tavernIdle: new Image(),
    };
    gameAssets.house.src = '/Cute_Fantasy_Free/Outdoor decoration/House_1_Wood_Base_Blue.png';
    gameAssets.treeOak.src = '/Cute_Fantasy_Free/Outdoor decoration/Oak_Tree.png';
    gameAssets.chest.src = '/Cute_Fantasy_Free/Outdoor decoration/Chest.png';
    gameAssets.fences.src = '/Cute_Fantasy_Free/Outdoor decoration/Fences.png';
    gameAssets.farmLand.src = '/Cute_Fantasy_Free/Tiles/FarmLand_Tile.png';
    gameAssets.chicken.src = '/Cute_Fantasy_Free/Animals/Chicken/Chicken.png';
    gameAssets.cow.src = '/Cute_Fantasy_Free/Animals/Cow/Cow.png';
    gameAssets.bonfire.src = '/Pixel Crawler - Free Pack/Environment/Structures/Stations/Bonfire/Bonfire_01-Sheet.png';
    gameAssets.furnace.src = '/Pixel Crawler - Free Pack/Environment/Structures/Stations/Furnace/Stone_01-Sheet.png';
    gameAssets.anvil.src = '/Pixel Crawler - Free Pack/Environment/Structures/Stations/Anvil/Anvil_01-Sheet.png';
    gameAssets.alchemy.src = '/Pixel Crawler - Free Pack/Environment/Structures/Stations/Alchemy/Alchemy_Table_01-Sheet.png';
    gameAssets.farmProps.src = '/Pixel Crawler - Free Pack/Environment/Props/Static/Farm.png';
    gameAssets.knightIdle.src = '/Pixel Crawler - Free Pack/Entities/Npc\'s/Knight/Idle/Idle-Sheet.png';
    gameAssets.wizzardIdle.src = '/Pixel Crawler - Free Pack/Entities/Npc\'s/Wizzard/Idle/Idle-Sheet.png';
    gameAssets.rogueIdle.src = '/Pixel Crawler - Free Pack/Entities/Npc\'s/Rogue/Idle/Idle-Sheet.png';
    gameAssets.peasantIdle.src = '/Pixel Crawler - Free Pack/Entities/Npc\'s/Citizen_F/Peasant_A/Idle/Idle-Sheet.png';
    gameAssets.tavernIdle.src = '/Pixel Crawler - Free Pack/Entities/Npc\'s/Citizen_F/Tavern_A/Idle/Idle_Side-Sheet.png';

    let animId: number;
    let time = 0;
    const TILE_SIZE = 32;

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

      // Helper para resolver el suelo base de cualquier casilla (incluso con farolas, animales o plantitas encima)
      const getGroundType = (gx: number, gy: number): number => {
        if (gy < 0 || gy >= rows || gx < 0 || gx >= cols) return 0;
        const raw = currentZone.tileData[gy][gx];
        if (raw === 0 || raw === 2 || raw === 3) return raw;

        // Para casillas de huerto (13): solo si están en un gran campo de cultivo (>2 vecinos 13) es tierra arada (13); si son animales o plantas sueltas, es CÉSPED (0)!
        if (raw === 13) {
          let farmNeighbors = 0;
          const offsets = [[0, -1], [0, 1], [-1, 0], [1, 0]];
          for (const [ox, oy] of offsets) {
            const nx = gx + ox;
            const ny = gy + oy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && currentZone.tileData[ny][nx] === 13) {
              farmNeighbors++;
            }
          }
          return farmNeighbors >= 3 ? 13 : 0;
        }

        // Para objetos colocados en la calle (farolas 17, pilares 18, cofres 7, puestos 9, etc.)
        let pathNeighbors = 0;
        const offsets = [[0, -1], [0, 1], [-1, 0], [1, 0]];
        for (const [ox, oy] of offsets) {
          const nx = gx + ox;
          const ny = gy + oy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            const nType = currentZone.tileData[ny][nx];
            if (nType === 2 || nType === 9 || nType === 33) pathNeighbors++;
          }
        }
        return pathNeighbors >= 2 ? 2 : 0;
      };

      // ------------------------------------------------------------------------
      // CAPA 0: BALDOSAS DE SUELO Y CALZADAS CON AUTOTILING ORGÁNICO (SEAMLESS 2.5D)
      // ------------------------------------------------------------------------
      for (let y = startRow; y <= endRow; y++) {
        for (let x = startCol; x <= endCol; x++) {
          const groundType = getGroundType(x, y);
          const drawPosX = x * TILE_SIZE;
          const drawPosY = y * TILE_SIZE;

          if (currentZone.id === 'zone_forest' && groundType === 13 && gameAssets.farmLand.complete && gameAssets.farmLand.naturalWidth > 0) {
            // Tierra de cultivo fértil
            ctx.drawImage(gameAssets.farmLand, 16, 16, 16, 16, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
          } else {
            const tileCanvas = getTileCanvas(groundType, currentZone.id, (x * 3 + y * 7) % 8);
            ctx.drawImage(tileCanvas, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
          }

          // TRANSICIÓN ORGÁNICA DE BORDES (BITING GRASS EDGES SOBRE CAMINOS)
          if (currentZone.id === 'zone_forest' && groundType === 2) {
            const topGrass = y > 0 && getGroundType(x, y - 1) === 0;
            const bottomGrass = y < rows - 1 && getGroundType(x, y + 1) === 0;
            const leftGrass = x > 0 && getGroundType(x - 1, y) === 0;
            const rightGrass = x < cols - 1 && getGroundType(x + 1, y) === 0;

            if (topGrass) {
              ctx.fillStyle = '#2d6318'; ctx.fillRect(drawPosX, drawPosY + 3, 32, 2);
              ctx.fillStyle = '#4a9b2b'; ctx.fillRect(drawPosX, drawPosY, 32, 3);
              ctx.fillStyle = '#56ad32';
              ctx.fillRect(drawPosX + 2, drawPosY + 2, 4, 3);
              ctx.fillRect(drawPosX + 10, drawPosY + 1, 5, 4);
              ctx.fillRect(drawPosX + 18, drawPosY + 2, 5, 3);
              ctx.fillRect(drawPosX + 26, drawPosY + 1, 4, 4);
            }
            if (bottomGrass) {
              ctx.fillStyle = '#2d6318'; ctx.fillRect(drawPosX, drawPosY + 27, 32, 2);
              ctx.fillStyle = '#4a9b2b'; ctx.fillRect(drawPosX, drawPosY + 29, 32, 3);
              ctx.fillStyle = '#56ad32';
              ctx.fillRect(drawPosX + 4, drawPosY + 26, 5, 3);
              ctx.fillRect(drawPosX + 14, drawPosY + 27, 4, 3);
              ctx.fillRect(drawPosX + 22, drawPosY + 26, 5, 4);
            }
            if (leftGrass) {
              ctx.fillStyle = '#2d6318'; ctx.fillRect(drawPosX + 3, drawPosY, 2, 32);
              ctx.fillStyle = '#4a9b2b'; ctx.fillRect(drawPosX, drawPosY, 3, 32);
              ctx.fillStyle = '#56ad32';
              ctx.fillRect(drawPosX + 2, drawPosY + 3, 3, 4);
              ctx.fillRect(drawPosX + 1, drawPosY + 12, 4, 5);
              ctx.fillRect(drawPosX + 2, drawPosY + 21, 3, 5);
            }
            if (rightGrass) {
              ctx.fillStyle = '#2d6318'; ctx.fillRect(drawPosX + 27, drawPosY, 2, 32);
              ctx.fillStyle = '#4a9b2b'; ctx.fillRect(drawPosX + 29, drawPosY, 3, 32);
              ctx.fillStyle = '#56ad32';
              ctx.fillRect(drawPosX + 26, drawPosY + 5, 3, 4);
              ctx.fillRect(drawPosX + 27, drawPosY + 15, 3, 4);
              ctx.fillRect(drawPosX + 26, drawPosY + 24, 4, 4);
            }
          }
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
      const weaponRack = getWeaponRackCanvas();
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
            // Muros de piedra en Castillo / Cueva, o Robles de fantasía con volumen
            if (currentZone.id === 'zone_castle' || currentZone.id === 'zone_cave') {
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(stoneWall, posX, posY - 4, 32, 36);
                },
              });
            } else if (gameAssets.treeOak.complete && gameAssets.treeOak.naturalWidth > 0) {
              // Roble de fantasía (64x80 px con sombra pegada a las raíces en Y + 14)
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  // Sombra elíptica pegada directamente a la base de las raíces
                  c.fillStyle = 'rgba(15, 23, 42, 0.4)';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 14, 13, 3.5, 0, 0, Math.PI * 2);
                  c.fill();
                  c.fillStyle = 'rgba(15, 23, 42, 0.6)';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 14, 7, 2, 0, 0, Math.PI * 2);
                  c.fill();
                  c.drawImage(gameAssets.treeOak, posX - 16, posY - 48, 64, 80);
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
            // Fuente de la Plaza Central o Pozos de Agua en las esquinas
            if (x === 252 && y === 340) {
              const centralFountain = getSquarePlazaFountainCanvas(time);
              entities.push({
                ySort: posY + TILE_SIZE + 10,
                draw: (c) => {
                  c.drawImage(centralFountain, posX - 12, posY - 14, 56, 56);
                },
              });
            } else {
              entities.push({
                ySort: posY + TILE_SIZE + 4,
                draw: (c) => {
                  c.drawImage(waterWell, posX - 16, posY - 16, 64, 64);
                },
              });
            }
          } else if (tileType === 5) {
            // Casas Medievales (Altura Completa 96x128 px con sombra de contacto pegada a la madera)
            if (gameAssets.house.complete && gameAssets.house.naturalWidth > 0) {
              entities.push({
                ySort: posY + TILE_SIZE + 20,
                draw: (c) => {
                  // Sombra de contacto directamente en la línea inferior de la madera (Y + 20)
                  const hShadow = c.createRadialGradient(posX + 16, posY + 20, 6, posX + 16, posY + 20, 42);
                  hShadow.addColorStop(0, 'rgba(15, 23, 42, 0.65)');
                  hShadow.addColorStop(0.5, 'rgba(15, 23, 42, 0.3)');
                  hShadow.addColorStop(1, 'rgba(15, 23, 42, 0)');
                  c.fillStyle = hShadow;
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 20, 42, 6, 0, 0, Math.PI * 2);
                  c.fill();
                  c.drawImage(gameAssets.house, 0, 0, 96, 128, posX - 32, posY - 96, 96, 128);
                },
              });
            } else {
              const vIndex = (x * 7 + y * 13) % 4;
              const houseVariant = vIndex === 0 ? 'blue' : vIndex === 1 ? 'straw' : vIndex === 2 ? 'stone' : 'red';
              const houseCanvas = getCottageCanvas(houseVariant);
              entities.push({
                ySort: posY + TILE_SIZE + 10,
                draw: (c) => {
                  c.drawImage(houseCanvas, posX - 16, posY - 24, 64, 64);
                },
              });
            }
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
            if (gameAssets.chest.complete && gameAssets.chest.naturalWidth > 0) {
              entities.push({
                ySort: posY + TILE_SIZE - 4,
                draw: (c) => {
                  c.drawImage(gameAssets.chest, 0, isOpen ? 16 : 0, 16, 16, posX + 4, posY + 6, 24, 24);
                },
              });
            } else {
              const chestCanvas = getChestCanvas(isOpen);
              entities.push({
                ySort: posY + TILE_SIZE - 4,
                draw: (c) => {
                  c.drawImage(chestCanvas, posX + 2, posY + 4, 28, 28);
                },
              });
            }
          } else if (tileType === 8) {
            // Santuario Ancestral / Altar
            entities.push({
              ySort: posY + TILE_SIZE + 8,
              draw: (c) => {
                c.drawImage(shrine, posX - 8, posY - 14, 48, 48);
              },
            });
          } else if (tileType === 9) {
            // Puesto de Mercado 2.5D con Colores Exactos de la Referencia
            let stallVariant = (x + y) % 3;
            if (x === 248) {
              if (y === 330 || y === 333 || y === 336) stallVariant = 1; // Rojo
              else if (y === 344 || y === 347) stallVariant = 2; // Azul
            } else if (x === 249) {
              if (y === 330 || y === 333 || y === 336) stallVariant = 0; // Verde
              else if (y === 344) stallVariant = 1; // Rojo
              else if (y === 347) stallVariant = 0; // Verde
              else if (y === 350) stallVariant = 1; // Rojo
            } else if (x === 255) {
              if (y === 330) stallVariant = 1; // Rojo
              else if (y === 333 || y === 336) stallVariant = 2; // Azul
              else if (y === 344) stallVariant = 1; // Rojo
              else if (y === 347) stallVariant = 0; // Verde
              else if (y === 350) stallVariant = 2; // Azul
            }
            const stallCanvas = getMarketStallCanvas(stallVariant);
            entities.push({
              ySort: posY + TILE_SIZE + 8,
              draw: (c) => {
                c.drawImage(stallCanvas, posX - 8, posY - 12, 48, 48);
              },
            });
          } else if (tileType === 10) {
            // Gran Forja y Yunque Pixel Crawler
            entities.push({
              ySort: posY + TILE_SIZE + 6,
              draw: (c) => {
                if (gameAssets.furnace.complete && gameAssets.furnace.naturalWidth > 0) {
                  const furnaceFrame = Math.floor(time * 4) % 3;
                  c.drawImage(gameAssets.furnace, furnaceFrame * 32, 0, 32, 32, posX - 8, posY - 8, 40, 40);
                } else {
                  c.drawImage(forge, posX - 8, posY - 12, 48, 48);
                }
                if (gameAssets.anvil.complete && gameAssets.anvil.naturalWidth > 0) {
                  c.drawImage(gameAssets.anvil, 0, 0, 32, 32, posX + 24, posY + 4, 28, 28);
                } else {
                  c.drawImage(weaponRack, posX + 28, posY + 2, 32, 32);
                }
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
          } else if (tileType === 12) {
            // Seto de Jardín y Rosales Esculpidos (Estilo Follaje Oak Tree 2.5D)
            const bushCanvas = getTileCanvas(12, currentZone.id, (x * 3 + y * 7) % 3);
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(bushCanvas, posX, posY, 32, 32);
              },
            });
          } else if (tileType === 13) {
            // Animales y Plantitas integrados sobre el césped con sombra física
            if ((x + y) % 6 === 0 && gameAssets.chicken.complete && gameAssets.chicken.naturalWidth > 0) {
              const chkFrame = Math.floor(time * 4) % 2;
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.fillStyle = 'rgba(15, 23, 42, 0.35)';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 26, 6, 2.5, 0, 0, Math.PI * 2);
                  c.fill();
                  c.drawImage(gameAssets.chicken, chkFrame * 32, 0, 32, 32, posX, posY, 32, 32);
                },
              });
            } else if ((x + y) % 9 === 0 && gameAssets.cow.complete && gameAssets.cow.naturalWidth > 0) {
              const cowFrame = Math.floor(time * 3) % 2;
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.fillStyle = 'rgba(15, 23, 42, 0.35)';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 28, 14, 5, 0, 0, Math.PI * 2);
                  c.fill();
                  c.drawImage(gameAssets.cow, cowFrame * 32, 0, 32, 32, posX - 4, posY - 4, 40, 40);
                },
              });
            } else if (gameAssets.farmProps.complete && gameAssets.farmProps.naturalWidth > 0) {
              const farmPropX = ((x * 3 + y * 5) % 4) * 32;
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.fillStyle = 'rgba(15, 23, 42, 0.35)';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 28, 10, 4, 0, 0, Math.PI * 2);
                  c.fill();
                  c.drawImage(gameAssets.farmProps, farmPropX, 0, 32, 32, posX, posY, 32, 32);
                },
              });
            }
          } else if (tileType === 15) {
            // Vallas de Madera Cute Fantasy
            if (gameAssets.fences.complete && gameAssets.fences.naturalWidth > 0) {
              entities.push({
                ySort: posY + TILE_SIZE - 2,
                draw: (c) => {
                  c.drawImage(gameAssets.fences, 0, 0, 16, 16, posX, posY + 8, 32, 24);
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
            // Farola de Camino con Farol Forjado y Halo Cálido
            const lamp = getStreetLampCanvas(time);
            entities.push({
              ySort: posY + TILE_SIZE + 4,
              draw: (c) => {
                c.drawImage(lamp, posX - 8, posY - 20, 48, 56);
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
            // Hoguera Animada Pixel Crawler
            if (gameAssets.bonfire.complete && gameAssets.bonfire.naturalWidth > 0) {
              const fireFrame = Math.floor(time * 6) % 4;
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(gameAssets.bonfire, fireFrame * 32, 0, 32, 32, posX, posY, 32, 32);
                },
              });
            } else {
              const campfire = getCampfireCanvas(time);
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(campfire, posX + 2, posY + 4, 28, 28);
                },
              });
            }
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
            // Mesa de Alquimia y Botica Pixel Crawler
            if (gameAssets.alchemy.complete && gameAssets.alchemy.naturalWidth > 0) {
              const alchFrame = Math.floor(time * 3) % 4;
              entities.push({
                ySort: posY + TILE_SIZE + 6,
                draw: (c) => {
                  c.drawImage(gameAssets.alchemy, alchFrame * 48, 0, 48, 48, posX - 8, posY - 12, 48, 48);
                },
              });
            } else {
              const apothecary = getApothecaryCanvas();
              entities.push({
                ySort: posY + TILE_SIZE + 10,
                draw: (c) => {
                  c.drawImage(apothecary, posX - 12, posY - 20, 56, 56);
                },
              });
            }
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
            // Pasarela Elevada / Acueducto de Madera
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

      // 2. Ciudadanos y Comerciantes de la Gran Capital (Pixel Crawler Roster)
      if (currentZone.id === 'zone_forest') {
        const capitalCitizens = [
          { name: 'Capitán Garrett (Guardia Real)', class: 'Paladín' as const, x: 240, y: 304, dir: 'down' as Direction, type: 'knight' },
          { name: 'Archimago Thorne', class: 'Mago' as const, x: 276, y: 314, dir: 'down' as Direction, type: 'wizzard' },
          { name: 'Sacerdotisa Solaria', class: 'Paladín' as const, x: 218, y: 314, dir: 'down' as Direction, type: 'peasant' },
          { name: 'Maestro Doran (Herrero Real)', class: 'Berserker' as const, x: 270, y: 338, dir: 'right' as Direction, type: 'peasant' },
          { name: 'Boticaria Elena', class: 'Mago' as const, x: 280, y: 342, dir: 'down' as Direction, type: 'wizzard' },
          { name: 'Mercader Cedric (Frutas)', class: 'Pícaro' as const, x: 248, y: 332, dir: 'down' as Direction, type: 'rogue' },
          { name: 'Mercader Barnaby (Telas)', class: 'Pícaro' as const, x: 256, y: 332, dir: 'down' as Direction, type: 'rogue' },
          { name: 'Tabernero Bruno', class: 'Guerrero' as const, x: 246, y: 314, dir: 'down' as Direction, type: 'tavern' },
          { name: 'Curtidor Gareth', class: 'Arquero' as const, x: 206, y: 342, dir: 'down' as Direction, type: 'peasant' },
          { name: 'Doncella Beatrix', class: 'Arquero' as const, x: 226, y: 346, dir: 'right' as Direction, type: 'tavern' },
          { name: 'Granjero Tobías', class: 'Guerrero' as const, x: 202, y: 354, dir: 'down' as Direction, type: 'peasant' },
          { name: 'Guardia del Portal Sur', class: 'Paladín' as const, x: 240, y: 362, dir: 'up' as Direction, type: 'knight' },
        ];

        capitalCitizens.forEach((citizen) => {
          const cCol = citizen.x;
          const cRow = citizen.y;

          // Only render if in viewport
          if (cCol >= startCol - 2 && cCol <= endCol + 2 && cRow >= startRow - 2 && cRow <= endRow + 2) {
            const drawX = cCol * TILE_SIZE;
            const drawY = cRow * TILE_SIZE;

            entities.push({
              ySort: drawY + TILE_SIZE,
              draw: (c) => {
                // Sombra circular en los pies
                c.fillStyle = 'rgba(0, 0, 0, 0.4)';
                c.beginPath();
                c.ellipse(drawX + 16, drawY + 30, 8, 3, 0, 0, Math.PI * 2);
                c.fill();

                // Sprite animado del personaje según su rol oficial
                if (citizen.type === 'knight' && gameAssets.knightIdle.complete && gameAssets.knightIdle.naturalWidth > 0) {
                  const kFrame = Math.floor(time * 4) % 4;
                  c.drawImage(gameAssets.knightIdle, kFrame * 32, 0, 32, 32, drawX, drawY, 32, 32);
                } else if (citizen.type === 'wizzard' && gameAssets.wizzardIdle.complete && gameAssets.wizzardIdle.naturalWidth > 0) {
                  const wFrame = Math.floor(time * 3) % 4;
                  c.drawImage(gameAssets.wizzardIdle, wFrame * 32, 0, 32, 32, drawX, drawY, 32, 32);
                } else if (citizen.type === 'rogue' && gameAssets.rogueIdle.complete && gameAssets.rogueIdle.naturalWidth > 0) {
                  const rFrame = Math.floor(time * 4) % 4;
                  c.drawImage(gameAssets.rogueIdle, rFrame * 32, 0, 32, 32, drawX, drawY, 32, 32);
                } else if (citizen.type === 'peasant' && gameAssets.peasantIdle.complete && gameAssets.peasantIdle.naturalWidth > 0) {
                  const pFrame = Math.floor(time * 3) % 4;
                  c.drawImage(gameAssets.peasantIdle, pFrame * 32, 0, 32, 32, drawX, drawY, 32, 32);
                } else if (citizen.type === 'tavern' && gameAssets.tavernIdle.complete && gameAssets.tavernIdle.naturalWidth > 0) {
                  const tFrame = Math.floor(time * 3) % 4;
                  c.drawImage(gameAssets.tavernIdle, tFrame * 32, 0, 32, 32, drawX, drawY, 32, 32);
                } else {
                  const sprite = getHeroSpriteCanvas(citizen.class, 'male', citizen.dir, 'idle');
                  c.drawImage(sprite, drawX, drawY, 32, 32);
                }

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
