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
  getWoodenFenceCanvas,
  getFarmCropCanvas,
  getWaterTroughCanvas,
  getWoodenBenchCanvas,
  getRecoloredCuteHouseCanvas,
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
      cooking: new Image(),
      sawmill: new Image(),
      workbench: new Image(),
      furniture: new Image(),
      tools: new Image(),
      resources: new Image(),
      esoteric: new Image(),
      customHouses: new Image(),
      knightIdle: new Image(),
      wizzardIdle: new Image(),
      rogueIdle: new Image(),
      peasantIdle: new Image(),
      tavernIdle: new Image(),
      furnitureSheet1: new Image(),
      furnitureSheet2: new Image(),
      shrinesSheet: new Image(),
      sawtableAnim: new Image(),
      gardenTiles: new Image(),
      fairyProps: new Image(),
      libraryTiles: new Image(),
      caveProps: new Image(),
      caveTiles: new Image(),
      batMove: new Image(),
      cemeteryGraves: new Image(),
      castleTiles: new Image(),
      hideoutTiles: new Image(),
      sewerProps: new Image(),
      ratWarriorIdle: new Image(),
    };
    gameAssets.house.src = '/Cute_Fantasy_Free/Outdoor decoration/House_1_Wood_Base_Blue.png';
    gameAssets.customHouses.src = '/houses.png';
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
    gameAssets.cooking.src = '/Pixel Crawler - Free Pack/Environment/Structures/Stations/Cooking Station/Cooking Station.png';
    gameAssets.sawmill.src = '/Pixel Crawler - Free Pack/Environment/Structures/Stations/Sawmill/Base.png';
    gameAssets.workbench.src = '/Pixel Crawler - Free Pack/Environment/Structures/Stations/Workbench/Workbench.png';
    gameAssets.furniture.src = '/Pixel Crawler - Free Pack/Environment/Props/Static/Furniture.png';
    gameAssets.tools.src = '/Pixel Crawler - Free Pack/Environment/Props/Static/Tools.png';
    gameAssets.resources.src = '/Pixel Crawler - Free Pack/Environment/Props/Static/Resources.png';
    gameAssets.esoteric.src = '/Pixel Crawler - Free Pack/Environment/Props/Static/Esoteric.png';
    gameAssets.knightIdle.src = '/Pixel Crawler - Free Pack/Entities/Npc\'s/Knight/Idle/Idle-Sheet.png';
    gameAssets.wizzardIdle.src = '/Pixel Crawler - Free Pack/Entities/Npc\'s/Wizzard/Idle/Idle-Sheet.png';
    gameAssets.rogueIdle.src = '/Pixel Crawler - Free Pack/Entities/Npc\'s/Rogue/Idle/Idle-Sheet.png';
    gameAssets.peasantIdle.src = '/Pixel Crawler - Free Pack/Entities/Npc\'s/Citizen_F/Peasant_A/Idle/Idle-Sheet.png';
    gameAssets.tavernIdle.src = '/Pixel Crawler - Free Pack/Entities/Npc\'s/Citizen_F/Tavern_A/Idle/Idle_Side-Sheet.png';
    gameAssets.furnitureSheet1.src = '/Furniture Pack/Sheets/furniture-24x24-5x4-sheet.png';
    gameAssets.furnitureSheet2.src = '/Furniture Pack/Sheets/furniture-2-24x24-5x5-sheet.png';
    gameAssets.shrinesSheet.src = '/Furniture Pack/Sheets/shrines-altars-24x24-5x4-sheet.png';
    gameAssets.sawtableAnim.src = '/Furniture Pack/Animated/sawtable-30x30-Sheet.png';
    gameAssets.gardenTiles.src = '/Pixel Crawler - Free Pack/Pixel Crawler - Garden Environment/Assets/Tiles.png';
    gameAssets.fairyProps.src = '/Pixel Crawler - Free Pack/Pixel Crawler - Fairy Forest 1.7/Assets/Props.png';
    gameAssets.libraryTiles.src = '/Pixel Crawler - Free Pack/Pixel Crawler - Library/Assets/Tiles.png';
    gameAssets.caveProps.src = '/Pixel Crawler - Free Pack/Pixel Crawler - Cave/Assets/Props.png';
    gameAssets.caveTiles.src = '/Pixel Crawler - Free Pack/Pixel Crawler - Cave/Assets/Tiles.png';
    gameAssets.batMove.src = '/Pixel Crawler - Free Pack/Small_Bat/Move/Move_Down-Sheet.png';
    gameAssets.cemeteryGraves.src = '/Pixel Crawler - Free Pack/Pixel Crawler - Cemetery/Environment/Props/Graves.png';
    gameAssets.castleTiles.src = '/Pixel Crawler - Free Pack/Pixel Crawler - Castle Environment 0.3/Assets/Tiles.png';
    gameAssets.hideoutTiles.src = '/Pixel Crawler - Free Pack/Pixel Crawler - Hideout/Assets/Tiles.png';
    gameAssets.sewerProps.src = '/Pixel Crawler - Free Pack/Pixel Crawler - Sewer/Assets/Props.png';
    gameAssets.ratWarriorIdle.src = '/Pixel Crawler - Free Pack/Pixel Crawler - Sewer/Enemy/Rat - Warrior/Idle/Idle-Sheet.png';

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
          } else if (tileType === 3) {
            // Si es un punto de agua aislado (abrevadero de granja)
            let waterNeighbors = 0;
            const offsets = [[0, -1], [0, 1], [-1, 0], [1, 0]];
            for (const [ox, oy] of offsets) {
              const nx = x + ox;
              const ny = y + oy;
              if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && currentZone.tileData[ny][nx] === 3) {
                waterNeighbors++;
              }
            }
            if (waterNeighbors < 2) {
              const trough = getWaterTroughCanvas(time);
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(trough, posX, posY, 32, 32);
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
            // Casas Medievales HD con 4 Variantes Arquitectónicas Sólidas y Completas (64x80 px)
            let vName: 'blue' | 'red' | 'stone' | 'purple' = 'blue';
            const vIndex = (x * 7 + y * 13) % 4;
            if (vIndex === 1) vName = 'red';
            else if (vIndex === 2) vName = 'stone';
            else if (vIndex === 3) vName = 'purple';

            // Asignación temática de edificios singulares
            if (x === 95 && y === 88) vName = 'red'; // Gran Posada (Roja Terracota)
            if (x === 105 && y === 88) vName = 'stone'; // Ayuntamiento (Pizarra Gris Señorial)
            if (x === 110 && y === 88) vName = 'purple'; // Botica del Alquimista (Púrpura Mágica)

            entities.push({
              ySort: posY + TILE_SIZE + 20,
              draw: (c) => {
                // Sombra de contacto directamente en la línea inferior de la madera (Y + 20)
                const hShadow = c.createRadialGradient(posX + 16, posY + 20, 4, posX + 16, posY + 20, 28);
                hShadow.addColorStop(0, 'rgba(15, 23, 42, 0.65)');
                hShadow.addColorStop(0.5, 'rgba(15, 23, 42, 0.3)');
                hShadow.addColorStop(1, 'rgba(15, 23, 42, 0)');
                c.fillStyle = hShadow;
                c.beginPath();
                c.ellipse(posX + 16, posY + 20, 28, 5, 0, 0, Math.PI * 2);
                c.fill();

                if (gameAssets.house.complete && gameAssets.house.naturalWidth > 0) {
                  // Variantes 100% 2.5D con Textura Original (Azul, Roja Terracota, Pizarra Gris, Púrpura)
                  const houseCanvas = getRecoloredCuteHouseCanvas(gameAssets.house, vName);
                  c.drawImage(houseCanvas, 0, 0, 96, 128, posX - 16, posY - 48, 64, 80);
                } else {
                  const houseCanvas = getRecoloredCuteHouseCanvas(gameAssets.house, vName);
                  c.drawImage(houseCanvas, 0, 0, 96, 128, posX - 16, posY - 48, 64, 80);
                }
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
            // Cofre del Tesoro Dorado
            const chestId = `${currentZone.id}_${x}_${y}`;
            const isOpen = openedChests.includes(chestId);
            const chest = getChestCanvas(isOpen);
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(chest, posX + 2, posY + 4, 28, 28);
              },
            });
          } else if (tileType === 8) {
            // Santuario Místico de Piedra
            const shrine = getShrineCanvas();
            entities.push({
              ySort: posY + TILE_SIZE + 8,
              draw: (c) => {
                c.drawImage(shrine, posX - 8, posY - 16, 48, 48);
              },
            });
          } else if (tileType === 9) {
            // Puesto de Bazar / Tienda
            const stallIndex = (x * 3 + y * 7) % 3;
            const stallCanvas = getMarketStallCanvas(stallIndex);
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(stallCanvas, posX, posY - 4, 32, 36);
              },
            });
          } else if (tileType === 10) {
            // Forja y Yunque de Herrero
            const blacksmith = getForgeCanvas();
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(blacksmith, posX, posY, 32, 32);
              },
            });
          } else if (tileType === 11) {
            // Portal de Jefe
            const bossPortal = getTileCanvas(11, currentZone.id, 0);
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
            // Elementos de Granja, Huerto y Animales Estructurados
            const isCowTile = (x === 112 && y === 111) || (x === 266 && y === 334) || (x === 239 && y === 340);
            const isChickenTile = (x === 111 && y === 108) || (x === 112 && y === 109) || (x === 228 && y === 340);

            if (isCowTile && gameAssets.cow.complete && gameAssets.cow.naturalWidth > 0) {
              // Vaca en su pasto vallado
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
            } else if (isChickenTile && gameAssets.chicken.complete && gameAssets.chicken.naturalWidth > 0) {
              // Gallina picoteando en el gallinero
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
            } else {
              // Bancales agrícolas de cultivo limpios (Zanahorias, Calabazas y Coles)
              const cropCanvas = getFarmCropCanvas((x * 3 + y * 7) % 3);
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(cropCanvas, posX, posY, 32, 32);
                },
              });
            }
          } else if (tileType === 15) {
            // Vallas de Madera Conectadas Rústicas 2.5D
            const hasLeft = x > 0 && currentZone.tileData[y]?.[x - 1] === 15;
            const hasRight = x < cols - 1 && currentZone.tileData[y]?.[x + 1] === 15;
            const hasTop = y > 0 && currentZone.tileData[y - 1]?.[x] === 15;
            const hasBottom = y < rows - 1 && currentZone.tileData[y + 1]?.[x] === 15;
            const fenceCanvas = getWoodenFenceCanvas(hasLeft, hasRight, hasTop, hasBottom);
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(fenceCanvas, posX, posY, 32, 32);
              },
            });
          } else if (tileType === 16) {
            // Lápidas Góticas y Cruces de Forja (Pixel Crawler - Cemetery)
            if (gameAssets.cemeteryGraves.complete && gameAssets.cemeteryGraves.naturalWidth > 0) {
              const gVariant = (x * 7 + y * 13) % 4;
              let sx = 135; let sy = 5; let sw = 30; let sh = 65; // Cruz gótica
              if (gVariant === 1) {
                sx = 95; sy = 5; sw = 30; sh = 65; // Cruz celta
              } else if (gVariant === 2) {
                sx = 205; sy = 115; sw = 35; sh = 70; // Mausoleo
              } else if (gVariant === 3) {
                sx = 120; sy = 115; sw = 35; sh = 70; // Sarcófago de piedra
              }

              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.fillStyle = 'rgba(15, 23, 42, 0.4)';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 28, 10, 4, 0, 0, Math.PI * 2);
                  c.fill();
                  c.drawImage(gameAssets.cemeteryGraves, sx, sy, sw, sh, posX + 2, posY - 10, 28, 42);
                },
              });
            } else {
              const tombstone = getGraveyardCanvas();
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(tombstone, posX + 4, posY + 4, 24, 28);
                },
              });
            }
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
            // Columna Monumental de Mármol Clásico con Hiedra (28x44 px)
            const pillar = getRuinedPillarCanvas();
            entities.push({
              ySort: posY + TILE_SIZE + 4,
              draw: (c) => {
                c.drawImage(pillar, posX + 2, posY - 10, 28, 44);
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
            // Árbol del Bosque Encantado (Follaje Púrpura 2.5D)
            const { trunk: encTrunk, canopy: encCanopy } = getEnchantedTreeCanvas();
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(encTrunk, posX - 8, posY, 48, 36);
                c.drawImage(encCanopy, posX - 16, posY - 36, 64, 64);
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
            // Geoda de Cristales de Maná Arcano
            const crystal = getManaCrystalCanvas(time);
            entities.push({
              ySort: posY + TILE_SIZE + 2,
              draw: (c) => {
                c.drawImage(crystal, posX + 2, posY - 8, 28, 40);
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

      // 2. Ciudadanos, Guardias y Decoraciones Estructuradas de la Ciudad de Roble
      if (currentZone.id === 'zone_forest') {
        // A. GUARDIAS REALES DE LAS 4 PUERTAS Y CIUDADANOS
        const townCitizens = [
          // Guardias de las 4 Puertas de la Ciudad de Roble
          { name: 'Guardia Real (Puerta Norte)', class: 'Paladín' as const, x: 100, y: 86, dir: 'down' as Direction, type: 'knight' },
          { name: 'Guardia Real (Puerta Sur)', class: 'Paladín' as const, x: 100, y: 114, dir: 'up' as Direction, type: 'knight' },
          { name: 'Guardia Real (Puerta Oeste)', class: 'Paladín' as const, x: 86, y: 100, dir: 'right' as Direction, type: 'knight' },
          { name: 'Guardia Real (Puerta Este)', class: 'Paladín' as const, x: 114, y: 100, dir: 'left' as Direction, type: 'knight' },

          // Ciudadanos de la Gran Capital (Sureste)
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
        ];

        townCitizens.forEach((citizen) => {
          const cCol = citizen.x;
          const cRow = citizen.y;

          if (cCol >= startCol - 2 && cCol <= endCol + 2 && cRow >= startRow - 2 && cRow <= endRow + 2) {
            const drawX = cCol * TILE_SIZE;
            const drawY = cRow * TILE_SIZE;

            entities.push({
              ySort: drawY + TILE_SIZE,
              draw: (c) => {
                c.fillStyle = 'rgba(0, 0, 0, 0.4)';
                c.beginPath();
                c.ellipse(drawX + 16, drawY + 30, 8, 3, 0, 0, Math.PI * 2);
                c.fill();

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

        // B. DECORACIONES ESTRUCTURADAS DE LA CIUDAD DE ROBLE (PIXEL CRAWLER)
        // 1. Plaza Mayor: 4 Bancos de Madera Tallada
        const plazaBenches = [{ x: 98, y: 98 }, { x: 102, y: 98 }, { x: 98, y: 102 }, { x: 102, y: 102 }];
        plazaBenches.forEach(({ x, y }) => {
          if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
            const bench = getWoodenBenchCanvas();
            entities.push({
              ySort: y * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(bench, x * TILE_SIZE, y * TILE_SIZE, 32, 32);
              },
            });
          }
        });

        // 2. Terraza de la Posada: Cocina animada con olla y barriles
        if (gameAssets.cooking.complete && gameAssets.cooking.naturalWidth > 0) {
          const cookX = 97 * TILE_SIZE;
          const cookY = 89 * TILE_SIZE;
          if (97 >= startCol - 2 && 97 <= endCol + 2 && 89 >= startRow - 2 && 89 <= endRow + 2) {
            entities.push({
              ySort: cookY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.cooking, 0, 0, 32, 32, cookX, cookY, 32, 32);
              },
            });
          }
        }

        // 3. Botica: Mesa de Alquimia Animada
        if (gameAssets.alchemy.complete && gameAssets.alchemy.naturalWidth > 0) {
          const alchX = 111 * TILE_SIZE;
          const alchY = 89 * TILE_SIZE;
          if (111 >= startCol - 2 && 111 <= endCol + 2 && 89 >= startRow - 2 && 89 <= endRow + 2) {
            const alchFrame = Math.floor(time * 3) % 3;
            entities.push({
              ySort: alchY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.alchemy, alchFrame * 32, 0, 32, 32, alchX, alchY, 32, 32);
              },
            });
          }
        }

        // 4. Taller de Carpintería: Banco de Trabajo y Aserradero
        if (gameAssets.workbench.complete && gameAssets.workbench.naturalWidth > 0) {
          const wbX = 106 * TILE_SIZE;
          const wbY = 89 * TILE_SIZE;
          if (106 >= startCol - 2 && 106 <= endCol + 2 && 89 >= startRow - 2 && 89 <= endRow + 2) {
            entities.push({
              ySort: wbY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.workbench, 0, 0, 32, 32, wbX, wbY, 32, 32);
              },
            });
          }
        }

        // 5. Forja: Lingotes y Carbón
        if (gameAssets.resources.complete && gameAssets.resources.naturalWidth > 0) {
          const resX = 89 * TILE_SIZE;
          const resY = 89 * TILE_SIZE;
          if (89 >= startCol - 2 && 89 <= endCol + 2 && 89 >= startRow - 2 && 89 <= endRow + 2) {
            entities.push({
              ySort: resY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.resources, 24, 44, 48, 40, resX, resY, 32, 28);
              },
            });
          }
        }

        // 6. Granja: Espantapájaros en el huerto
        if (gameAssets.farmProps.complete && gameAssets.farmProps.naturalWidth > 0) {
          const scX = 109 * TILE_SIZE;
          const scY = 109 * TILE_SIZE;
          if (109 >= startCol - 2 && 109 <= endCol + 2 && 109 >= startRow - 2 && 109 <= endRow + 2) {
            entities.push({
              ySort: scY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.farmProps, 0, 0, 32, 32, scX, scY, 32, 32);
              },
            });
          }
        }

        // 8. ELEMENTOS TEMÁTICOS DEL FURNITURE PACK
        // A. Patio de Entrenamiento de la Guardia (Puerta Norte)
        if (gameAssets.furnitureSheet2.complete && gameAssets.furnitureSheet2.naturalWidth > 0) {
          // Muñeco de entrenamiento con escudo
          if (98 >= startCol - 2 && 98 <= endCol + 2 && 86 >= startRow - 2 && 86 <= endRow + 2) {
            entities.push({
              ySort: 86 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.furnitureSheet2, 72, 48, 24, 24, 98 * TILE_SIZE + 4, 86 * TILE_SIZE + 4, 24, 24);
              },
            });
          }
          // Muñeco de entrenamiento estándar
          if (97 >= startCol - 2 && 97 <= endCol + 2 && 86 >= startRow - 2 && 86 <= endRow + 2) {
            entities.push({
              ySort: 86 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.furnitureSheet2, 72, 24, 24, 24, 97 * TILE_SIZE + 4, 86 * TILE_SIZE + 4, 24, 24);
              },
            });
          }
          // Poste de combate de madera
          if (98 >= startCol - 2 && 98 <= endCol + 2 && 87 >= startRow - 2 && 87 <= endRow + 2) {
            entities.push({
              ySort: 87 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.furnitureSheet2, 72, 0, 24, 24, 98 * TILE_SIZE + 4, 87 * TILE_SIZE + 4, 24, 24);
              },
            });
          }
          // Estandarte Real del León Dorado (Entrada Norte)
          if (102 >= startCol - 2 && 102 <= endCol + 2 && 86 >= startRow - 2 && 86 <= endRow + 2) {
            entities.push({
              ySort: 86 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.furnitureSheet2, 0, 48, 24, 24, 102 * TILE_SIZE + 4, 86 * TILE_SIZE + 4, 24, 24);
              },
            });
          }
          // Estandartes del Ayuntamiento
          if (104 >= startCol - 2 && 104 <= endCol + 2 && 88 >= startRow - 2 && 88 <= endRow + 2) {
            entities.push({
              ySort: 88 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.furnitureSheet2, 48, 0, 24, 24, 104 * TILE_SIZE + 4, 88 * TILE_SIZE + 4, 24, 24);
              },
            });
          }
        }

        // B. Gran Forja: Armero de Espadas de Acero
        if (gameAssets.furnitureSheet1.complete && gameAssets.furnitureSheet1.naturalWidth > 0) {
          if (92 >= startCol - 2 && 92 <= endCol + 2 && 89 >= startRow - 2 && 89 <= endRow + 2) {
            entities.push({
              ySort: 89 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.furnitureSheet1, 96, 48, 24, 24, 92 * TILE_SIZE + 4, 89 * TILE_SIZE + 4, 24, 24);
              },
            });
          }
          // Botica: Estantería de Pociones y Viales
          if (112 >= startCol - 2 && 112 <= endCol + 2 && 89 >= startRow - 2 && 89 <= endRow + 2) {
            entities.push({
              ySort: 89 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.furnitureSheet1, 24, 72, 24, 24, 112 * TILE_SIZE + 4, 89 * TILE_SIZE + 4, 24, 24);
              },
            });
          }
        }

        // C. Carpintería: Mesa de Sierra Mecánica Animada
        if (gameAssets.sawtableAnim.complete && gameAssets.sawtableAnim.naturalWidth > 0) {
          if (105 >= startCol - 2 && 105 <= endCol + 2 && 89 >= startRow - 2 && 89 <= endRow + 2) {
            const sawFrame = Math.floor(time * 6) % 2;
            entities.push({
              ySort: 89 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.sawtableAnim, sawFrame * 30, 0, 30, 30, 105 * TILE_SIZE + 1, 89 * TILE_SIZE + 1, 30, 30);
              },
            });
          }
        }

        // D. Santuario Ancestral: Altar de Luz Sagrada y Mesa Relicario
        if (gameAssets.shrinesSheet.complete && gameAssets.shrinesSheet.naturalWidth > 0) {
          if (90 >= startCol - 2 && 90 <= endCol + 2 && 109 >= startRow - 2 && 109 <= endRow + 2) {
            entities.push({
              ySort: 109 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.shrinesSheet, 96, 24, 24, 24, 90 * TILE_SIZE + 4, 109 * TILE_SIZE + 4, 24, 24);
              },
            });
          }
        }

        // E. FASE 1: JARDINES URBANOS, BIBLIOTECA Y BOSQUE FEÉRICO (PIXEL CRAWLER)
        // 1. Jardines Urbanos: Cipreses Esculpidos y Nenúfares
        if (gameAssets.gardenTiles.complete && gameAssets.gardenTiles.naturalWidth > 0) {
          // Cipreses en las esquinas de los bulevares
          const cypresses = [{ x: 97, y: 94 }, { x: 103, y: 94 }];
          cypresses.forEach(({ x, y }) => {
            if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
              entities.push({
                ySort: y * TILE_SIZE + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(gameAssets.gardenTiles, 155, 275, 35, 105, x * TILE_SIZE - 2, y * TILE_SIZE - 40, 24, 72);
                },
              });
            }
          });
        }

        // 2. Biblioteca Arcano: Gran Librería de Caoba y Mesa de Estudio
        if (gameAssets.libraryTiles.complete && gameAssets.libraryTiles.naturalWidth > 0) {
          if (110 >= startCol - 2 && 110 <= endCol + 2 && 88 >= startRow - 2 && 88 <= endRow + 2) {
            entities.push({
              ySort: 88 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.libraryTiles, 265, 340, 60, 65, 110 * TILE_SIZE - 4, 88 * TILE_SIZE + 2, 40, 44);
              },
            });
          }
        }

        // 3. Claros del Bosque Esmeralda: Flores de Luz Feérica y Rocas Rúnicas
        if (gameAssets.fairyProps.complete && gameAssets.fairyProps.naturalWidth > 0) {
          // Flores Feéricas Gigantes
          const fairyBlooms = [{ x: 84, y: 100 }, { x: 116, y: 100 }];
          fairyBlooms.forEach(({ x, y }) => {
            if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
              entities.push({
                ySort: y * TILE_SIZE + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(gameAssets.fairyProps, 325, 0, 45, 60, x * TILE_SIZE - 4, y * TILE_SIZE - 12, 40, 48);
                },
              });
            }
          });
          // Roca Rúnica con Ojo Arcano
          if (96 >= startCol - 2 && 96 <= endCol + 2 && 110 >= startRow - 2 && 110 <= endRow + 2) {
            entities.push({
              ySort: 110 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.fairyProps, 195, 360, 45, 50, 96 * TILE_SIZE, 110 * TILE_SIZE - 8, 32, 40);
              },
            });
          }
        }

        // 4. Estatua del Ángel Protector en el Santuario Ancestral (Cemetery)
        if (gameAssets.cemeteryGraves.complete && gameAssets.cemeteryGraves.naturalWidth > 0) {
          if (89 >= startCol - 2 && 89 <= endCol + 2 && 109 >= startRow - 2 && 109 <= endRow + 2) {
            entities.push({
              ySort: 109 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.cemeteryGraves, 40, 245, 40, 48, 89 * TILE_SIZE - 4, 109 * TILE_SIZE - 16, 40, 48);
              },
            });
          }
        }
      }

      // FASE 2: MINAS DE ERIDU Y CUEVA DE SOMBRAS (PIXEL CRAWLER CAVE & BATS)
      if (currentZone.id === 'zone_cave') {
        // 1. Hongos Gigantes Subterráneos Bioluminiscentes
        if (gameAssets.caveProps.complete && gameAssets.caveProps.naturalWidth > 0) {
          const caveShrooms = [
            { x: 194, y: 194 }, { x: 206, y: 194 }, { x: 194, y: 206 }, { x: 206, y: 206 }
          ];
          caveShrooms.forEach(({ x, y }) => {
            if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
              entities.push({
                ySort: y * TILE_SIZE + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(gameAssets.caveProps, 0, 0, 100, 90, x * TILE_SIZE - 20, y * TILE_SIZE - 40, 72, 64);
                },
              });
            }
          });
        }

        // 2. Murciélagos Animados Aleteando en las Galerías (Small_Bat)
        if (gameAssets.batMove.complete && gameAssets.batMove.naturalWidth > 0) {
          const batSpawns = [
            { x: 198, y: 196, offset: 0 },
            { x: 204, y: 198, offset: 1.5 },
            { x: 196, y: 204, offset: 3 },
            { x: 202, y: 205, offset: 4.5 }
          ];
          batSpawns.forEach(({ x, y, offset }) => {
            if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
              const bFrame = Math.floor((time * 8) + offset) % 4;
              const hoverY = Math.sin(time * 3 + offset) * 6;
              const hoverX = Math.cos(time * 2 + offset) * 8;
              const drawX = x * TILE_SIZE + hoverX;
              const drawY = y * TILE_SIZE + hoverY;

              entities.push({
                ySort: y * TILE_SIZE + TILE_SIZE + 10,
                draw: (c) => {
                  // Sombra del murciélago en el suelo
                  c.fillStyle = 'rgba(0, 0, 0, 0.35)';
                  c.beginPath();
                  c.ellipse(drawX + 16, y * TILE_SIZE + 24, 6, 2.5, 0, 0, Math.PI * 2);
                  c.fill();
                  // Sprite animado del murciélago volando
                  c.drawImage(gameAssets.batMove, bFrame * 32, 0, 32, 32, drawX, drawY, 32, 32);
                },
              });
            }
          });
        }
      }

      // FASE 3: CIUDADELA IMPERIAL Y SAGRARIO (PIXEL CRAWLER CASTLE)
      if (currentZone.id === 'zone_castle' || currentZone.id === 'zone_sanctuary') {
        if (gameAssets.castleTiles.complete && gameAssets.castleTiles.naturalWidth > 0) {
          // Trono Imperial en la cabecera
          if (200 >= startCol - 2 && 200 <= endCol + 2 && 194 >= startRow - 2 && 194 <= endRow + 2) {
            entities.push({
              ySort: 194 * TILE_SIZE + TILE_SIZE + 10,
              draw: (c) => {
                c.fillStyle = 'rgba(0, 0, 0, 0.45)';
                c.beginPath();
                c.ellipse(200 * TILE_SIZE + 16, 194 * TILE_SIZE + 30, 16, 6, 0, 0, Math.PI * 2);
                c.fill();
                c.drawImage(gameAssets.castleTiles, 335, 15, 25, 65, 200 * TILE_SIZE + 4, 194 * TILE_SIZE - 20, 24, 60);
              },
            });
          }
          // Estandartes Púrpuras Reales
          const banners = [{ x: 196, y: 194 }, { x: 204, y: 194 }];
          banners.forEach(({ x, y }) => {
            if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
              entities.push({
                ySort: y * TILE_SIZE + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(gameAssets.castleTiles, 335, 215, 30, 55, x * TILE_SIZE + 1, y * TILE_SIZE - 12, 30, 52);
                },
              });
            }
          });
          // Bustos de Héroes y Paladines en la galería
          const busts = [{ x: 196, y: 198 }, { x: 204, y: 198 }, { x: 196, y: 202 }, { x: 204, y: 202 }];
          busts.forEach(({ x, y }) => {
            if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
              entities.push({
                ySort: y * TILE_SIZE + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(gameAssets.castleTiles, 335, 95, 25, 40, x * TILE_SIZE + 4, y * TILE_SIZE - 6, 24, 38);
                },
              });
            }
          });
        }
      }

      // FASE 4: PANTANO ESPECTRAL DE VAEL, GUARIDAS Y ALCANTARILLADO (HIDEOUT & SEWER)
      // A. Barriles de Roble Gigantes en la Posada del Bosque (zone_forest)
      if (currentZone.id === 'zone_forest' && gameAssets.hideoutTiles.complete && gameAssets.hideoutTiles.naturalWidth > 0) {
        if (96 >= startCol - 2 && 96 <= endCol + 2 && 89 >= startRow - 2 && 89 <= endRow + 2) {
          entities.push({
            ySort: 89 * TILE_SIZE + TILE_SIZE,
            draw: (c) => {
              c.drawImage(gameAssets.hideoutTiles, 215, 390, 60, 90, 96 * TILE_SIZE - 4, 89 * TILE_SIZE - 24, 36, 54);
            },
          });
        }
      }

      // B. Pantano Espectral de Vael: Campamento Clandestino de Forajidos y Ratas Guerreras
      if (currentZone.id === 'zone_swamp') {
        // 1. Guarida de Bandidos (Estandartes de Calavera y Fuego de Campamento)
        if (gameAssets.hideoutTiles.complete && gameAssets.hideoutTiles.naturalWidth > 0) {
          // Estandartes de calavera
          const skullFlags = [{ x: 195, y: 195 }, { x: 205, y: 195 }];
          skullFlags.forEach(({ x, y }) => {
            if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
              entities.push({
                ySort: y * TILE_SIZE + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(gameAssets.hideoutTiles, 345, 415, 55, 70, x * TILE_SIZE - 2, y * TILE_SIZE - 15, 36, 46);
                },
              });
            }
          });
          // Fuego de campamento de ladrones
          if (200 >= startCol - 2 && 200 <= endCol + 2 && 198 >= startRow - 2 && 198 <= endRow + 2) {
            entities.push({
              ySort: 198 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.hideoutTiles, 330, 205, 45, 45, 200 * TILE_SIZE, 198 * TILE_SIZE, 32, 32);
              },
            });
          }
        }

        // 2. Props de Mazmorra / Alcantarillado (Tuberías y Frascos de Veneno)
        if (gameAssets.sewerProps.complete && gameAssets.sewerProps.naturalWidth > 0) {
          // Tuberías de drenaje
          const pipes = [{ x: 194, y: 204 }, { x: 206, y: 204 }];
          pipes.forEach(({ x, y }) => {
            if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
              entities.push({
                ySort: y * TILE_SIZE + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(gameAssets.sewerProps, 95, 75, 40, 30, x * TILE_SIZE, y * TILE_SIZE + 4, 32, 24);
                },
              });
            }
          });
          // Frascos de veneno brillante
          if (198 >= startCol - 2 && 198 <= endCol + 2 && 205 >= startRow - 2 && 205 <= endRow + 2) {
            entities.push({
              ySort: 205 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.sewerProps, 110, 165, 60, 55, 198 * TILE_SIZE, 205 * TILE_SIZE + 2, 28, 26);
              },
            });
          }
        }

        // 3. Ratas Guerreras Animadas Patrullando el Pantano (Rat - Warrior)
        if (gameAssets.ratWarriorIdle.complete && gameAssets.ratWarriorIdle.naturalWidth > 0) {
          const ratSpawns = [
            { x: 197, y: 196, offset: 0 },
            { x: 203, y: 196, offset: 2 },
            { x: 196, y: 202, offset: 1 },
            { x: 204, y: 202, offset: 3 }
          ];
          ratSpawns.forEach(({ x, y, offset }) => {
            if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
              const rFrame = Math.floor((time * 4) + offset) % 4;
              entities.push({
                ySort: y * TILE_SIZE + TILE_SIZE,
                draw: (c) => {
                  c.fillStyle = 'rgba(0, 0, 0, 0.4)';
                  c.beginPath();
                  c.ellipse(x * TILE_SIZE + 16, y * TILE_SIZE + 28, 10, 4, 0, 0, Math.PI * 2);
                  c.fill();
                  c.drawImage(gameAssets.ratWarriorIdle, rFrame * 64, 0, 64, 64, x * TILE_SIZE - 12, y * TILE_SIZE - 20, 48, 48);
                },
              });
            }
          });
        }
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
          const gender = npc.avatarStyle === 'elder' || npc.name.includes('Elena') || npc.name.includes('Griselda') || npc.name.includes('Aveline') ? 'female' : 'male';
          const npcClass =
            npc.avatarStyle === 'blacksmith' ? 'Berserker' :
            npc.avatarStyle === 'wizard' ? 'Mago' :
            npc.avatarStyle === 'knight' ? 'Paladín' :
            npc.avatarStyle === 'scout' ? 'Pícaro' :
            npc.avatarStyle === 'elder' ? 'Sacerdotisa' :
            npc.avatarStyle === 'elf' ? 'Arquero' : 'Guerrero';
          const npcSprite = getHeroSpriteCanvas(npcClass, gender, 'down', 'idle');

          entities.push({
            ySort: nY + TILE_SIZE,
            draw: (c) => {
              c.drawImage(npcSprite, nX, nY, TILE_SIZE, TILE_SIZE);

              // Signo de exclamación flotante (!) EXCLUSIVAMENTE si tiene misión activa
              if (npc.quest) {
                const bounce = Math.sin(time * 5) * 3;
                c.fillStyle = '#facc15';
                c.fillRect(nX + 14, nY - 14 + bounce, 4, 8);
                c.fillRect(nX + 14, nY - 4 + bounce, 4, 3);
              }
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
