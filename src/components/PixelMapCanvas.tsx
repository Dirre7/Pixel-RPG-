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
    const maxX = (currentZone.mapWidth || 60) - 1;
    const maxY = (currentZone.mapHeight || 60) - 1;
    const safeX = Math.min(Math.max(0, playerPos.x), maxX);
    const safeY = Math.min(Math.max(0, playerPos.y), maxY);

    if (safeX !== playerPos.x || safeY !== playerPos.y) {
      currentPosRef.current = { x: safeX, y: safeY };
      targetPosRef.current = { x: safeX, y: safeY };
      onPlayerMove({ x: safeX, y: safeY });
    } else {
      targetPosRef.current = { x: safeX, y: safeY };
    }
  }, [playerPos, currentZone.mapWidth, currentZone.mapHeight]);

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
      treeSmall: new Image(),
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
      floorTiles: new Image(),
    };
    gameAssets.house.src = '/Cute_Fantasy_Free/Outdoor decoration/House_1_Wood_Base_Blue.png';
    gameAssets.customHouses.src = '/houses.png';
    gameAssets.treeOak.src = '/Cute_Fantasy_Free/Outdoor decoration/Oak_Tree.png';
    gameAssets.treeSmall.src = '/Cute_Fantasy_Free/Outdoor decoration/Oak_Tree_Small.png';
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
    gameAssets.floorTiles.src = '/Pixel Crawler - Free Pack/Environment/Tilesets/Floors_Tiles.png';

    let animId: number;
    let time = 0;
    const TILE_SIZE = 32;

    const render = () => {
      time += 0.03;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = false;

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
        if (raw === 0 || raw === 2 || raw === 3 || raw === 4 || raw === 8 || raw === 13) return raw;

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
      // CAPA 0: BALDOSAS DE SUELO Y CALZADAS (TEXTURAS AUTÉNTICAS PIXEL CRAWLER)
      // ------------------------------------------------------------------------
      const hasFloorTiles = gameAssets.floorTiles.complete && gameAssets.floorTiles.naturalWidth > 0;

      for (let y = startRow; y <= endRow; y++) {
        for (let x = startCol; x <= endCol; x++) {
          const groundType = getGroundType(x, y);
          const drawPosX = x * TILE_SIZE;
          const drawPosY = y * TILE_SIZE;

          if (currentZone.id === 'zone_forest' && groundType === 3) {
            // Río Cristalino Animado con Orillas y Espuma de Costa
            const wave = Math.sin(time * 2.5 + x * 0.6 + y * 0.4) * 0.15;
            ctx.fillStyle = '#0f2b5c';
            ctx.fillRect(drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = `rgba(56, 189, 248, ${0.45 + wave})`;
            ctx.fillRect(drawPosX, drawPosY + 4, TILE_SIZE, TILE_SIZE - 8);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.fillRect(drawPosX + 6 + (Math.sin(time * 3 + y) * 4), drawPosY + 8, 12, 2);

            // Detección de Orilla (Shoreline) con el césped
            const leftIsShore = x > 0 && currentZone.tileData[y]?.[x - 1] !== 3 && currentZone.tileData[y]?.[x - 1] !== 15;
            const rightIsShore = x < currentZone.mapWidth - 1 && currentZone.tileData[y]?.[x + 1] !== 3 && currentZone.tileData[y]?.[x + 1] !== 15;

            // Orilla Oeste (Ribera de tierra húmeda + espuma de agua)
            if (leftIsShore) {
              ctx.fillStyle = '#2d6318';
              ctx.fillRect(drawPosX, drawPosY, 3, TILE_SIZE);
              ctx.fillStyle = '#1e3a8a';
              ctx.fillRect(drawPosX + 3, drawPosY, 2, TILE_SIZE);
              // Espuma blanca de oleaje
              const foamWave = Math.sin(time * 3 + y * 0.8) * 1.5;
              ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
              ctx.fillRect(drawPosX + 4 + foamWave, drawPosY + 2, 2, TILE_SIZE - 4);
            }

            // Orilla Este
            if (rightIsShore) {
              ctx.fillStyle = '#2d6318';
              ctx.fillRect(drawPosX + TILE_SIZE - 3, drawPosY, 3, TILE_SIZE);
              ctx.fillStyle = '#1e3a8a';
              ctx.fillRect(drawPosX + TILE_SIZE - 5, drawPosY, 2, TILE_SIZE);
              // Espuma blanca de oleaje
              const foamWave = Math.cos(time * 3 + y * 0.8) * 1.5;
              ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
              ctx.fillRect(drawPosX + TILE_SIZE - 6 - foamWave, drawPosY + 2, 2, TILE_SIZE - 4);
            }

            // Nenúfares con flores flotantes
            if ((x * 7 + y * 13) % 6 === 0) {
              ctx.fillStyle = '#15803d';
              ctx.beginPath();
              ctx.ellipse(drawPosX + 16, drawPosY + 16, 6, 4, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#fb7185';
              ctx.fillRect(drawPosX + 15, drawPosY + 14, 3, 3);
            }
          } else if (currentZone.id === 'zone_forest' && groundType === 15) {
            // Puente de Madera Rústico sobre el río
            ctx.fillStyle = '#0f2b5c';
            ctx.fillRect(drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#5c2c16';
            ctx.fillRect(drawPosX + 2, drawPosY, TILE_SIZE - 4, TILE_SIZE);
            ctx.fillStyle = '#854d0e';
            ctx.fillRect(drawPosX + 4, drawPosY + 2, TILE_SIZE - 8, 5);
            ctx.fillRect(drawPosX + 4, drawPosY + 10, TILE_SIZE - 8, 5);
            ctx.fillRect(drawPosX + 4, drawPosY + 18, TILE_SIZE - 8, 5);
            ctx.fillRect(drawPosX + 4, drawPosY + 26, TILE_SIZE - 8, 5);
            // Barandillas de madera
            ctx.fillStyle = '#b45309';
            ctx.fillRect(drawPosX + 2, drawPosY, 2, TILE_SIZE);
            ctx.fillRect(drawPosX + TILE_SIZE - 4, drawPosY, 2, TILE_SIZE);
          } else if (currentZone.id === 'zone_forest' && groundType === 13) {
            // Tierra fértil de arado marrón oscuro (sin caja naranja)
            const farmCanvas = getTileCanvas(13, currentZone.id, (x * 3 + y * 7) % 4);
            ctx.drawImage(farmCanvas, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
          } else if (hasFloorTiles) {
            if (currentZone.id === 'zone_forest') {
              if (groundType === 2) {
                // Adoquines auténticos continuos de Pixel Crawler Floors_Tiles (96, 160)
                ctx.drawImage(gameAssets.floorTiles, 96, 160, 16, 16, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);

                // Suavizado orgánico de bordes con césped (Autotiling natural)
                const topTile = y > 0 ? currentZone.tileData[y - 1]?.[x] : 0;
                const bottomTile = y < currentZone.mapHeight - 1 ? currentZone.tileData[y + 1]?.[x] : 0;
                const leftTile = x > 0 ? currentZone.tileData[y]?.[x - 1] : 0;
                const rightTile = x < currentZone.mapWidth - 1 ? currentZone.tileData[y]?.[x + 1] : 0;

                const isGrassOrWild = (t: number | undefined) => t === 0 || t === 1 || t === 12;

                // Borde Superior: briznas de hierba verde y sombra sutil
                if (isGrassOrWild(topTile)) {
                  ctx.fillStyle = 'rgba(45, 99, 24, 0.35)';
                  ctx.fillRect(drawPosX, drawPosY, TILE_SIZE, 2);
                  ctx.fillStyle = '#4a9b2b';
                  for (let bx = 0; bx < TILE_SIZE; bx += 4) {
                    const grassH = ((x * 13 + bx) % 3) + 2;
                    ctx.fillRect(drawPosX + bx, drawPosY, 2, grassH);
                  }
                }

                // Borde Inferior: briznas de hierba verde
                if (isGrassOrWild(bottomTile)) {
                  ctx.fillStyle = '#4a9b2b';
                  for (let bx = 0; bx < TILE_SIZE; bx += 4) {
                    const grassH = ((x * 17 + bx) % 3) + 2;
                    ctx.fillRect(drawPosX + bx, drawPosY + TILE_SIZE - grassH, 2, grassH);
                  }
                }

                // Borde Izquierdo
                if (isGrassOrWild(leftTile)) {
                  ctx.fillStyle = 'rgba(45, 99, 24, 0.3)';
                  ctx.fillRect(drawPosX, drawPosY, 2, TILE_SIZE);
                  ctx.fillStyle = '#4a9b2b';
                  for (let by = 0; by < TILE_SIZE; by += 4) {
                    const grassW = ((y * 11 + by) % 3) + 2;
                    ctx.fillRect(drawPosX, drawPosY + by, grassW, 2);
                  }
                }

                // Borde Derecho
                if (isGrassOrWild(rightTile)) {
                  ctx.fillStyle = '#4a9b2b';
                  for (let by = 0; by < TILE_SIZE; by += 4) {
                    const grassW = ((y * 19 + by) % 3) + 2;
                    ctx.fillRect(drawPosX + TILE_SIZE - grassW, drawPosY + by, grassW, 2);
                  }
                }
              } else if (groundType === 0) {
                // Césped con textura auténtica
                ctx.drawImage(gameAssets.floorTiles, 16, 160, 16, 16, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);

                // Flores silvestres esparcidas orgánicamente
                const flowerHash = (x * 17 + y * 31) % 8;
                if (flowerHash === 1) {
                  ctx.fillStyle = '#ef4444'; // Flor roja
                  ctx.fillRect(drawPosX + 6, drawPosY + 8, 3, 3);
                  ctx.fillStyle = '#fef08a';
                  ctx.fillRect(drawPosX + 7, drawPosY + 9, 1, 1);
                } else if (flowerHash === 2) {
                  ctx.fillStyle = '#38bdf8'; // Flor azul
                  ctx.fillRect(drawPosX + 18, drawPosY + 16, 3, 3);
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(drawPosX + 19, drawPosY + 17, 1, 1);
                } else if (flowerHash === 3) {
                  ctx.fillStyle = '#facc15'; // Flor amarilla
                  ctx.fillRect(drawPosX + 12, drawPosY + 20, 3, 3);
                }
              } else {
                const tileCanvas = getTileCanvas(groundType, currentZone.id, (x * 3 + y * 7) % 8);
                ctx.drawImage(tileCanvas, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
              }
            } else if (currentZone.id === 'zone_castle' || currentZone.id === 'zone_sanctuary') {
              ctx.drawImage(gameAssets.floorTiles, 256, 16, 16, 16, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
            } else if (currentZone.id === 'zone_tundra') {
              ctx.drawImage(gameAssets.floorTiles, 16, 352, 16, 16, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
            } else {
              const tileCanvas = getTileCanvas(groundType, currentZone.id, (x * 3 + y * 7) % 8);
              ctx.drawImage(tileCanvas, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
            }
          } else {
            const tileCanvas = getTileCanvas(groundType, currentZone.id, (x * 3 + y * 7) % 8);
            ctx.drawImage(tileCanvas, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
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
              // Roble Noble de Fantasía (64x80 px con sombra perfecta en raíces)
              const isHarvestableTree = (x * 37 + y * 19) % 11 === 0;
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

                  // Si es un Árbol Noble Talable, mostrar brillo de resina ámbar en el tronco
                  if (isHarvestableTree) {
                    const sparkle = Math.sin(time * 3 + x + y) * 0.3 + 0.7;
                    c.fillStyle = `rgba(245, 158, 11, ${sparkle})`;
                    c.beginPath();
                    c.arc(posX + 16, posY - 4, 3, 0, Math.PI * 2);
                    c.fill();
                    c.fillStyle = '#ffffff';
                    c.fillRect(posX + 15, posY - 5, 1.5, 1.5);
                  }
                },
              });
            } else {
              const isHarvestableTree = (x * 37 + y * 19) % 11 === 0;
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(treeTrunk, posX - 8, posY, 48, 36);
                  c.drawImage(treeCanopy, posX - 16, posY - 36, 64, 64);
                  if (isHarvestableTree) {
                    const sparkle = Math.sin(time * 3 + x + y) * 0.3 + 0.7;
                    c.fillStyle = `rgba(245, 158, 11, ${sparkle})`;
                    c.beginPath();
                    c.arc(posX + 16, posY - 4, 3, 0, Math.PI * 2);
                    c.fill();
                  }
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
            // Gran Fuente Monumental de la Plaza Central o Pozos de Agua en Granja
            if (x === 30 && y === 30) {
              const centralFountain = getSquarePlazaFountainCanvas(time);
              entities.push({
                ySort: posY + TILE_SIZE + 10,
                draw: (c) => {
                  c.drawImage(centralFountain, posX - 16, posY - 16, 64, 64);
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

            // Asignación temática de edificios singulares de la Aldea de Roble
            if (x === 38 && y === 26) vName = 'red';    // Mansión con tejado rojo noble
            if (x === 42 && y === 26) vName = 'stone';  // Casa señorial de cantería gris
            if (x === 38 && y === 16) vName = 'stone';  // Casa Consistorial
            if (x === 42 && y === 16) vName = 'blue';   // Casa Residencial Noreste
            if (x === 38 && y === 22) vName = 'purple'; // Botica de Pociones
            if (x === 42 && y === 22) vName = 'red';    // Casa de la Boticaria
            if (x === 17 && y === 34) vName = 'stone';  // Cabaña del Molinero
            if (x === 36 && y === 34) vName = 'red';    // Cabaña del Guardián
            if (x === 18 && y === 16) vName = 'blue';   // Gran Posada del Roble
            if (x === 22 && y === 16) vName = 'red';    // Casa Residencial Noroeste
            if (x === 22 && y === 22) vName = 'stone';  // Casa del Artesano
            if (x === 18 && y === 38) vName = 'purple'; // Ermita del Clérigo
            if (x === 40 && y === 48) vName = 'red';    // Casa Adosada 1 (Tejado Rojo)
            if (x === 44 && y === 48) vName = 'stone';  // Casa Adosada 2 (Cantería Noble)
            if (x === 48 && y === 48) vName = 'blue';   // Casa Adosada 3 (Tejado Azul)
            if (x === 49 && y === 40) vName = 'blue';   // Cabaña del Pescador
            if (x === 35 && y === 9) vName = 'red';     // Cabaña del Maestro Leñador
            if (x === 42 && y === 9) vName = 'stone';   // Cabaña del Maestro Cantero

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
                  const houseCanvas = getRecoloredCuteHouseCanvas(gameAssets.house, vName);
                  c.drawImage(houseCanvas, 0, 0, 96, 128, posX - 16, posY - 48, 64, 80);
                } else {
                  const houseCanvas = getRecoloredCuteHouseCanvas(gameAssets.house, vName);
                  c.drawImage(houseCanvas, 0, 0, 96, 128, posX - 16, posY - 48, 64, 80);
                }
              },
            });
          } else if (tileType === 10) {
            // Gran Forja Imperial de Piedra con Chimenea y Humo Animado
            entities.push({
              ySort: posY + TILE_SIZE + 20,
              draw: (c) => {
                const blacksmith = getForgeCanvas();
                c.drawImage(blacksmith, posX - 16, posY - 40, 64, 72);
                // Humo animado
                const smokeFrame = Math.floor(time * 4) % 3;
                c.fillStyle = 'rgba(203, 213, 225, 0.45)';
                c.beginPath();
                c.arc(posX + 36, posY - 45 - smokeFrame * 5, 4 + smokeFrame * 2, 0, Math.PI * 2);
                c.fill();
              },
            });
          } else if (tileType === 14) {
            // Valla de Madera Rústica
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                const fence = getWoodenFenceCanvas(true, true, false, false);
                c.drawImage(fence, posX, posY, 32, 32);
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
            // Gran Portal de Mazmorra / Portal del Jefe 2.5D Monumental Animado (64x72 px)
            entities.push({
              ySort: posY + TILE_SIZE + 10,
              draw: (c) => {
                const pX = posX - 16;
                const pY = posY - 40;

                // Sombra de contacto
                const shadow = c.createRadialGradient(posX + 16, posY + 20, 4, posX + 16, posY + 20, 32);
                shadow.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
                shadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                c.fillStyle = shadow;
                c.beginPath();
                c.ellipse(posX + 16, posY + 20, 32, 8, 0, 0, Math.PI * 2);
                c.fill();

                // Pilares de piedra rúnica
                c.fillStyle = '#1e293b';
                c.fillRect(pX + 4, pY + 12, 14, 52); // Pilar izquierdo
                c.fillRect(pX + 46, pY + 12, 14, 52); // Pilar derecho
                c.fillStyle = '#334155';
                c.fillRect(pX + 2, pY + 8, 60, 14); // Dintel superior

                // Bloques de piedra decorativa
                c.fillStyle = '#475569';
                c.fillRect(pX + 6, pY + 16, 10, 8);
                c.fillRect(pX + 48, pY + 16, 10, 8);
                c.fillRect(pX + 6, pY + 36, 10, 8);
                c.fillRect(pX + 48, pY + 36, 10, 8);

                // Vórtice de Energía Mágica Giratoria
                const pulse = Math.sin(time * 4) * 0.2 + 0.8;
                let vColor1 = 'rgba(34, 197, 94, 0.9)'; // Forest
                let vColor2 = 'rgba(21, 128, 61, 0.4)';
                if (currentZone.id === 'zone_cave') { vColor1 = 'rgba(168, 85, 247, 0.9)'; vColor2 = 'rgba(107, 33, 168, 0.4)'; }
                else if (currentZone.id === 'zone_swamp') { vColor1 = 'rgba(16, 185, 129, 0.9)'; vColor2 = 'rgba(4, 120, 87, 0.4)'; }
                else if (currentZone.id === 'zone_volcano') { vColor1 = 'rgba(239, 68, 68, 0.9)'; vColor2 = 'rgba(185, 28, 28, 0.4)'; }
                else if (currentZone.id === 'zone_tundra') { vColor1 = 'rgba(56, 189, 248, 0.9)'; vColor2 = 'rgba(3, 105, 161, 0.4)'; }
                else if (currentZone.id === 'zone_castle') { vColor1 = 'rgba(245, 158, 11, 0.9)'; vColor2 = 'rgba(180, 83, 9, 0.4)'; }
                else if (currentZone.id === 'zone_void') { vColor1 = 'rgba(236, 72, 153, 0.9)'; vColor2 = 'rgba(131, 24, 67, 0.4)'; }
                else if (currentZone.id === 'zone_sanctuary') { vColor1 = 'rgba(250, 204, 21, 0.9)'; vColor2 = 'rgba(202, 138, 4, 0.4)'; }

                const vortex = c.createRadialGradient(posX + 16, pY + 40, 2, posX + 16, pY + 40, 20);
                vortex.addColorStop(0, '#ffffff');
                vortex.addColorStop(0.5, vColor1);
                vortex.addColorStop(1, vColor2);
                c.fillStyle = vortex;
                c.beginPath();
                c.ellipse(posX + 16, pY + 40, 14 * pulse, 22 * pulse, 0, 0, Math.PI * 2);
                c.fill();

                // Destellos de partículas orbitando
                for (let i = 0; i < 4; i++) {
                  const angle = time * 3 + (i * Math.PI / 2);
                  const orbX = posX + 16 + Math.cos(angle) * 12;
                  const orbY = pY + 40 + Math.sin(angle) * 18;
                  c.fillStyle = '#ffffff';
                  c.fillRect(orbX, orbY, 3, 3);
                }

                // Antorchas de llama mágica a los lados
                const fPulse = Math.sin(time * 6) * 2;
                c.fillStyle = vColor1;
                c.beginPath();
                c.arc(pX + 11, pY + 6 + fPulse, 5, 0, Math.PI * 2);
                c.arc(pX + 53, pY + 6 + fPulse, 5, 0, Math.PI * 2);
                c.fill();
                c.fillStyle = '#ffffff';
                c.fillRect(pX + 10, pY + 4 + fPulse, 2, 2);
                c.fillRect(pX + 52, pY + 4 + fPulse, 2, 2);

                // Calavera / Runa en el dintel
                c.fillStyle = '#fef08a';
                c.font = '10px monospace';
                c.textAlign = 'center';
                c.fillText('⚔️', posX + 16, pY + 18);
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

      // 2. Decoraciones Estructuradas y Ambientación de la Ciudad de Roble (Sin Solapamientos)
      if (currentZone.id === 'zone_forest') {
        // A. Bancos de Madera Tallada en las 4 esquinas de la Plaza Mayor
        const plazaBenches = [{ x: 26, y: 28 }, { x: 34, y: 28 }, { x: 26, y: 32 }, { x: 34, y: 32 }];
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

        // B. Terraza de la Taberna: Cocina y Barriles (X: 44, Y: 44)
        if (gameAssets.cooking.complete && gameAssets.cooking.naturalWidth > 0) {
          const cookX = 44 * TILE_SIZE;
          const cookY = 44 * TILE_SIZE;
          if (44 >= startCol - 2 && 44 <= endCol + 2 && 44 >= startRow - 2 && 44 <= endRow + 2) {
            entities.push({
              ySort: cookY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.cooking, 0, 0, 32, 32, cookX, cookY, 32, 32);
              },
            });
          }
        }

        // C. Gran Forja: Almacén de Carbón y Lingotes (X: 48, Y: 14)
        if (gameAssets.resources.complete && gameAssets.resources.naturalWidth > 0) {
          const resX = 48 * TILE_SIZE;
          const resY = 14 * TILE_SIZE;
          if (48 >= startCol - 2 && 48 <= endCol + 2 && 14 >= startRow - 2 && 14 <= endRow + 2) {
            entities.push({
              ySort: resY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.resources, 24, 44, 48, 40, resX, resY, 32, 28);
              },
            });
          }
        }

        // D. Granja: Espantapájaros en el centro del huerto (X: 16, Y: 18)
        if (gameAssets.farmProps.complete && gameAssets.farmProps.naturalWidth > 0) {
          const scX = 16 * TILE_SIZE;
          const scY = 18 * TILE_SIZE;
          if (16 >= startCol - 2 && 16 <= endCol + 2 && 18 >= startRow - 2 && 18 <= endRow + 2) {
            entities.push({
              ySort: scY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.farmProps, 0, 0, 32, 32, scX, scY, 32, 32);
              },
            });
          }
        }

        // E. Corrales de Animales: Gallinas y Vacas pastando (X: 19..23, Y: 41..45)
        if (gameAssets.chicken.complete && gameAssets.chicken.naturalWidth > 0) {
          const chickens = [{ x: 19, y: 41 }, { x: 22, y: 42 }, { x: 20, y: 45 }];
          chickens.forEach(({ x, y }, idx) => {
            if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
              const chkFrame = Math.floor(time * 3 + idx) % 2;
              entities.push({
                ySort: y * TILE_SIZE + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(gameAssets.chicken, chkFrame * 32, 0, 32, 32, x * TILE_SIZE, y * TILE_SIZE, 24, 24);
                },
              });
            }
          });
        }
        if (gameAssets.cow.complete && gameAssets.cow.naturalWidth > 0) {
          const cowX = 21 * TILE_SIZE;
          const cowY = 43 * TILE_SIZE;
          if (21 >= startCol - 2 && 21 <= endCol + 2 && 43 >= startRow - 2 && 43 <= endRow + 2) {
            const cowFrame = Math.floor(time * 2) % 3;
            entities.push({
              ySort: cowY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.cow, cowFrame * 32, 0, 32, 32, cowX - 4, cowY - 4, 32, 32);
              },
            });
          }
        }

        // F. Aserradero: Mesa de Sierra Mecánica (X: 15, Y: 46)
        if (gameAssets.sawtableAnim.complete && gameAssets.sawtableAnim.naturalWidth > 0) {
          if (15 >= startCol - 2 && 15 <= endCol + 2 && 46 >= startRow - 2 && 46 <= endRow + 2) {
            const sawFrame = Math.floor(time * 6) % 2;
            entities.push({
              ySort: 46 * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.drawImage(gameAssets.sawtableAnim, sawFrame * 30, 0, 30, 30, 15 * TILE_SIZE + 1, 46 * TILE_SIZE + 1, 30, 30);
              },
            });
          }
        }

        // G. Patio de Armas: 4 Caballeros de la Milicia entrenando en formación 2x2 (X: 38..40, Y: 41..43)
        if (gameAssets.knightIdle.complete && gameAssets.knightIdle.naturalWidth > 0) {
          const squad = [
            { x: 38, y: 41 }, { x: 40, y: 41 },
            { x: 38, y: 43 }, { x: 40, y: 43 }
          ];
          squad.forEach(({ x, y }, idx) => {
            if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
              const kFrame = Math.floor(time * 4 + idx * 0.7) % 4;
              entities.push({
                ySort: y * TILE_SIZE + TILE_SIZE,
                draw: (c) => {
                  c.fillStyle = 'rgba(15, 23, 42, 0.35)';
                  c.beginPath();
                  c.ellipse(x * TILE_SIZE + 16, y * TILE_SIZE + 27, 7, 3, 0, 0, Math.PI * 2);
                  c.fill();
                  c.drawImage(gameAssets.knightIdle, kFrame * 32, 0, 32, 32, x * TILE_SIZE, y * TILE_SIZE - 2, 32, 32);
                },
              });
            }
          });
        }

        // H. Dianas de Entrenamiento en el Patio de Armas (X: 37, Y: 38) y (X: 41, Y: 38)
        if (gameAssets.furnitureSheet2.complete && gameAssets.furnitureSheet2.naturalWidth > 0) {
          const targets = [{ x: 37, y: 38 }, { x: 41, y: 38 }];
          targets.forEach(({ x, y }) => {
            if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
              entities.push({
                ySort: y * TILE_SIZE + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(gameAssets.furnitureSheet2, 72, 48, 24, 24, x * TILE_SIZE + 4, y * TILE_SIZE + 4, 24, 24);
                },
              });
            }
          });
        }

        // 7. PIXEL TRIBE: BURBUJA DE DIÁLOGO DINÁMICA (Solo sobre la cabeza del NPC cuando el héroe está cerca)
        currentZone.npcs?.forEach((npc) => {
          const distToPlayer = Math.hypot(npc.x - playerPos.x, npc.y - playerPos.y);
          if (distToPlayer <= 2.2 && npc.x >= startCol - 2 && npc.x <= endCol + 2 && npc.y >= startRow - 2 && npc.y <= endRow + 2) {
            const floatY = Math.sin(time * 3) * 2;
            entities.push({
              ySort: npc.y * TILE_SIZE + TILE_SIZE + 30,
              draw: (c) => {
                const bubbleX = npc.x * TILE_SIZE + 4;
                const bubbleY = npc.y * TILE_SIZE - 28 + floatY;

                c.fillStyle = '#0f172a';
                c.strokeStyle = '#f59e0b';
                c.lineWidth = 1.5;
                c.beginPath();
                c.roundRect(bubbleX, bubbleY, 24, 14, 4);
                c.fill();
                c.stroke();

                c.fillStyle = '#0f172a';
                c.beginPath();
                c.moveTo(bubbleX + 8, bubbleY + 14);
                c.lineTo(bubbleX + 12, bubbleY + 18);
                c.lineTo(bubbleX + 14, bubbleY + 14);
                c.fill();

                c.fillStyle = '#fef08a';
                c.font = 'bold 9px monospace';
                c.textAlign = 'center';
                c.fillText('💬', bubbleX + 12, bubbleY + 11);
              },
            });
          }
        });

        // 8. PIXEL TRIBE: HALOS DE LUZ CÁLIDA NOCTURNA EN FAROLAS Y FORJA
        const lightSources = [
          { x: 44, y: 14, radius: 55, color: 'rgba(251, 191, 36, 0.25)' },  // Forja
          { x: 26, y: 26, radius: 45, color: 'rgba(254, 240, 138, 0.22)' }, // Farola NO
          { x: 34, y: 26, radius: 45, color: 'rgba(254, 240, 138, 0.22)' }, // Farola NE
          { x: 26, y: 34, radius: 45, color: 'rgba(254, 240, 138, 0.22)' }, // Farola SO
          { x: 34, y: 34, radius: 45, color: 'rgba(254, 240, 138, 0.22)' }, // Farola SE
          { x: 45, y: 45, radius: 50, color: 'rgba(251, 191, 36, 0.2)' },   // Taberna
        ];
        lightSources.forEach(({ x, y, radius, color }) => {
          if (x >= startCol - 3 && x <= endCol + 3 && y >= startRow - 3 && y <= endRow + 3) {
            const flicker = Math.sin(time * 6 + x) * 2;
            entities.push({
              ySort: y * TILE_SIZE - 50,
              draw: (c) => {
                const grad = c.createRadialGradient(
                  x * TILE_SIZE + 16,
                  y * TILE_SIZE + 16,
                  4,
                  x * TILE_SIZE + 16,
                  y * TILE_SIZE + 16,
                  radius + flicker
                );
                grad.addColorStop(0, color);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                c.fillStyle = grad;
                c.beginPath();
                c.arc(x * TILE_SIZE + 16, y * TILE_SIZE + 16, radius + flicker, 0, Math.PI * 2);
                c.fill();
              },
            });
          }
        });
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
