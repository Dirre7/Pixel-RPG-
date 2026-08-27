import React, { useEffect, useRef, useState } from 'react';
import { Zone, PlayerStats, EquipmentItem, HeroCombatSkill, OverworldEnemy, CombatProjectile, GroundDrop } from '../types';
import { generateZoneOverworldEnemies } from '../data/gameData';
import { getPixelEnemyCanvas } from '../utils/pixelEnemySpriteGenerator';
import { soundEngine } from '../utils/soundEngine';
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
  getBlastFurnaceCanvas,
  getAnvilWorkstationCanvas,
  getOrePileCanvas,
  getShrineCanvas,
  getStreetLampCanvas,
  getGraveyardCanvas,
  getRuinedPillarCanvas,
  getCampfireCanvas,
  getEnchantedTreeCanvas,
  getEnchantedMushroomCanvas,
  getNoticeBoardCanvas,
  getMossyBoulderCanvas,
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
  getBlacksmithCuteHouseCanvas,
  getTavernCuteHouseCanvas,
  getTavernBarCounterCanvas,
  getTavernTableCanvas,
  getTavernFireplaceCanvas,
  getTavernBarrelStackCanvas,
  getWallTorchCanvas,
  getTavernChandelierCanvas,
  getApothecaryCuteHouseCanvas,
  getAlchemyCauldronCanvas,
  getApothecaryCounterCanvas,
  getHerbDryingRackCanvas,
  getCryptMausoleumCanvas,
  getStoneSarcophagusCanvas,
  getSpectralBrazierCanvas,
  getBoneUrnStackCanvas,
  getCaveEntranceCanvas,
  getPirateCrateStackCanvas,
  getDockRowboatCanvas,
  getGrandCastleBuildingCanvas,
  getRoyalThroneCanvas,
  getRoyalStainedGlassCanvas,
  getRoyalCouncilTableCanvas,
} from '../utils/pixelTilesetGenerator';

interface PixelMapCanvasProps {
  currentZone: Zone;
  playerPos: { x: number; y: number };
  player: PlayerStats;
  equipment?: {
    weapon?: EquipmentItem | null;
    armor?: EquipmentItem | null;
    shield?: EquipmentItem | null;
    ring?: EquipmentItem | null;
    necklace?: EquipmentItem | null;
  };
  facingDir?: Direction;
  openedChests: string[];
  activeShrines?: string[];
  defeatedBosses?: string[];
  onPlayerMove: (newPos: { x: number; y: number }) => void;
  onInteract?: () => void;
  onEnemyKilled?: (enemy: OverworldEnemy) => void;
  onPlayerDamaged?: (amount: number) => void;
  onLootCollected?: (type: 'gold' | 'exp' | 'item' | 'health_orb', amount?: number, itemId?: string) => void;
  onBossStateChange?: (boss: OverworldEnemy | null) => void;
  combatActionRef?: React.MutableRefObject<{
    triggerBasicAttack: () => void;
    triggerSkill: (skill: HeroCombatSkill) => boolean;
    triggerDash: () => boolean;
  } | null>;
}

export const PixelMapCanvas: React.FC<PixelMapCanvasProps> = ({
  currentZone,
  playerPos,
  player,
  equipment,
  facingDir = 'down',
  openedChests,
  defeatedBosses = [],
  onPlayerMove,
  onInteract,
  onEnemyKilled,
  onPlayerDamaged,
  onLootCollected,
  onBossStateChange,
  combatActionRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [direction, setDirection] = useState<Direction>(facingDir);
  const [isMoving, setIsMoving] = useState(false);
  const isMovingRef = useRef(false);

  // Sync refs for render loop
  const playerRef = useRef(player);
  const directionRef = useRef(direction);
  const openedChestsRef = useRef(openedChests);
  const equipmentRef = useRef(equipment);
  const lastBossIdRef = useRef<string | null>(null);

  useEffect(() => { playerRef.current = player; }, [player]);
  useEffect(() => {
    if (facingDir) {
      setDirection(facingDir);
      directionRef.current = facingDir;
    }
  }, [facingDir]);
  useEffect(() => { openedChestsRef.current = openedChests; }, [openedChests]);
  useEffect(() => { equipmentRef.current = equipment; }, [equipment]);

  // Posición suave del jugador para movimiento fluido entre casillas
  const currentPosRef = useRef({ x: playerPos.x, y: playerPos.y });
  const targetPosRef = useRef({ x: playerPos.x, y: playerPos.y });

  // Reubicar instantáneamente al cambiar de zona/mapa
  useEffect(() => {
    const maxX = Math.max(1, (currentZone.mapWidth || 60) - 2);
    const maxY = Math.max(1, (currentZone.mapHeight || 60) - 2);
    const safeX = Math.min(Math.max(1, playerPos.x), maxX);
    const safeY = Math.min(Math.max(1, playerPos.y), maxY);

    currentPosRef.current = { x: safeX, y: safeY };
    targetPosRef.current = { x: safeX, y: safeY };
  }, [currentZone.id]);

  // Actualizar casilla de destino de forma suave durante el movimiento normal (60 FPS lerp)
  useEffect(() => {
    const maxX = Math.max(1, (currentZone.mapWidth || 60) - 2);
    const maxY = Math.max(1, (currentZone.mapHeight || 60) - 2);
    const safeX = Math.min(Math.max(1, playerPos.x), maxX);
    const safeY = Math.min(Math.max(1, playerPos.y), maxY);

    targetPosRef.current = { x: safeX, y: safeY };
    const dist = Math.hypot(currentPosRef.current.x - safeX, currentPosRef.current.y - safeY);
    if (dist > 4 || isNaN(currentPosRef.current.x) || isNaN(currentPosRef.current.y)) {
      currentPosRef.current = { x: safeX, y: safeY };
    }
  }, [playerPos.x, playerPos.y, currentZone.mapWidth, currentZone.mapHeight]);

  // Bucle de Renderizado 2D a 60 FPS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = Math.round(rect.width);
        canvas.height = Math.round(rect.height);
      }
    };
    resizeCanvas();
    const handleOrientationOrResize = () => {
      resizeCanvas();
      setTimeout(resizeCanvas, 60);
      setTimeout(resizeCanvas, 200);
    };
    window.addEventListener('resize', handleOrientationOrResize);
    window.addEventListener('orientationchange', handleOrientationOrResize);
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
      grassMiddle: new Image(),
      pathTile: new Image(),
      pathMiddle: new Image(),
      beachTile: new Image(),
      cliffTile: new Image(),
      outdoorDecor: new Image(),
      bridgeWood: new Image(),
      waterMiddle: new Image(),
      waterTile: new Image(),
    };
    gameAssets.grassMiddle.src = '/Cute_Fantasy_Free/Tiles/Grass_Middle.png';
    gameAssets.pathTile.src = '/Cute_Fantasy_Free/Tiles/Path_Tile.png';
    gameAssets.pathMiddle.src = '/Cute_Fantasy_Free/Tiles/Path_Middle.png';
    gameAssets.beachTile.src = '/Cute_Fantasy_Free/Tiles/Beach_Tile.png';
    gameAssets.cliffTile.src = '/Cute_Fantasy_Free/Tiles/Cliff_Tile.png';
    gameAssets.outdoorDecor.src = '/Cute_Fantasy_Free/Outdoor decoration/Outdoor_Decor_Free.png';
    gameAssets.bridgeWood.src = '/Cute_Fantasy_Free/Outdoor decoration/Bridge_Wood.png';
    gameAssets.waterMiddle.src = '/Cute_Fantasy_Free/Tiles/Water_Middle.png';
    gameAssets.waterTile.src = '/Cute_Fantasy_Free/Tiles/Water_Tile.png';
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

    // ========================================================================
    // ⚔️ 2.5D REAL-TIME ARPG OVERWORLD COMBAT SYSTEM
    // ========================================================================
    const zoneEnemies = generateZoneOverworldEnemies(
      currentZone.id,
      currentZone.mapWidth || 60,
      currentZone.mapHeight || 60,
      currentZone.tileData
    );

    const isPeacefulInterior = currentZone.isInterior && currentZone.interiorType !== 'crypt' && currentZone.interiorType !== 'smugglers_cave';
    const isBossDefeated = defeatedBosses.includes(currentZone.boss.name);
    if (!isBossDefeated && !isPeacefulInterior && currentZone.boss) {
      const bossTemplate = currentZone.boss;
      const bx = bossTemplate.spawnPos?.x ?? (currentZone.id === 'zone_forest' ? 36 : Math.min((currentZone.mapWidth || 60) - 8, Math.max(8, Math.round((currentZone.mapWidth || 60) / 2))));
      const by = bossTemplate.spawnPos?.y ?? (currentZone.id === 'zone_forest' ? 6 : Math.min((currentZone.mapHeight || 60) - 8, Math.max(8, 8)));
      zoneEnemies.push({
        id: `boss_${currentZone.id}`,
        name: bossTemplate.name,
        level: bossTemplate.level || 8,
        hp: bossTemplate.hp,
        maxHp: bossTemplate.maxHp,
        attack: bossTemplate.attack,
        defense: bossTemplate.defense,
        expReward: bossTemplate.expReward,
        goldReward: bossTemplate.goldReward,
        x: bx,
        y: by,
        worldX: bx,
        worldZ: by,
        spawnX: bx,
        spawnY: by,
        patrolRadius: 3.5,
        aggroRadius: 7.5,
        attackRange: 1.8,
        attackCooldown: 2.0,
        lastAttackTime: 0,
        state: 'patrol',
        enemyType: 'boss',
        color: bossTemplate.color || '#16a34a',
        scale: 1.8,
        isBoss: true,
      });
    }

    const enemyEntities = zoneEnemies.map((enemy) => ({
      enemy,
      sprite: getPixelEnemyCanvas(enemy.enemyType, enemy.color, enemy.isBoss),
      hitFlashTime: 0,
      deathTime: 0,
    }));

    const projectileEntities: CombatProjectile[] = [];
    const groundDropEntities: GroundDrop[] = [];
    const damageNumberEntities: { text: string; x: number; y: number; color: string; isCrit?: boolean; createdAt: number }[] = [];
    const slashEntities: { x: number; y: number; dir: string; createdAt: number }[] = [];
    const hitSparkEntities: { x: number; y: number; vx: number; vy: number; color: string; size: number; createdAt: number }[] = [];

    const spawnHitSparks = (x: number, y: number, color: string = '#fef08a', count: number = 7) => {
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 60 + Math.random() * 120;
        hitSparkEntities.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          color,
          size: 2 + Math.random() * 2.5,
          createdAt: performance.now(),
        });
      }
    };

    const spawnDamageNumber = (text: string, x: number, y: number, color: string = '#fde047', isCrit: boolean = false) => {
      damageNumberEntities.push({
        text,
        x: x + (Math.random() - 0.5) * 8,
        y: y - 8,
        color,
        isCrit,
        createdAt: performance.now(),
      });
    };

    const spawnGroundDrop = (type: 'gold' | 'exp' | 'item' | 'health_orb', x: number, y: number, amount?: number, itemId?: string) => {
      groundDropEntities.push({
        id: `drop_${Date.now()}_${Math.random()}`,
        x: x + (Math.random() - 0.5) * 16,
        z: y + (Math.random() - 0.5) * 16,
        y: 0,
        type,
        amount,
        itemId,
        color: type === 'gold' ? '#facc15' : type === 'exp' ? '#38bdf8' : '#22c55e',
        createdAt: performance.now(),
      });
    };

    const handleEnemyDefeat = (ent: typeof enemyEntities[0]) => {
      ent.enemy.state = 'dead';
      ent.enemy.hp = 0;
      ent.deathTime = performance.now();
      soundEngine.playSfx('victory');

      const gold = Math.max(1, ent.enemy.goldReward || 10);
      const pLevel = playerRef.current.level || 1;
      const maxExpFromSingleKill = Math.max(15, Math.round(getRequiredExpForLevel(pLevel) * 0.32));
      const exp = Math.min(maxExpFromSingleKill, Math.max(1, ent.enemy.expReward || 15));

      spawnGroundDrop('gold', ent.enemy.worldX * 32 + 16, ent.enemy.worldZ * 32 + 16, gold);
      spawnGroundDrop('exp', ent.enemy.worldX * 32 + 16, ent.enemy.worldZ * 32 + 16, exp);
      if (Math.random() < 0.35) {
        spawnGroundDrop('health_orb', ent.enemy.worldX * 32 + 16, ent.enemy.worldZ * 32 + 16, 30);
      }

      if (ent.enemy.isBoss) {
        setTimeout(() => onBossStateChange?.(null), 0);
      }

      setTimeout(() => {
        onEnemyKilled?.(ent.enemy);
      }, 0);
    };

    const triggerPlayerAttack = () => {
      const p = currentPosRef.current;
      const dir = directionRef.current;
      let dx = 0;
      let dy = 1;
      if (dir === 'up') { dx = 0; dy = -1; }
      else if (dir === 'down') { dx = 0; dy = 1; }
      else if (dir === 'left') { dx = -1; dy = 0; }
      else if (dir === 'right') { dx = 1; dy = 0; }

      // 🗡️ Detección de Tipo de Arma o Clase del Héroe
      const wName = (equipmentRef.current?.weapon?.name || '').toLowerCase();
      const heroCls = playerRef.current.heroClass;

      let attackMode: 'bow' | 'magic' | 'dagger' | 'sword' = 'sword';
      if (wName.includes('arco') || wName.includes('ballesta') || heroCls === 'Arquero') {
        attackMode = 'bow';
      } else if (
        wName.includes('baston') ||
        wName.includes('bastón') ||
        wName.includes('varita') ||
        wName.includes('libro') ||
        wName.includes('orbe') ||
        wName.includes('cetro') ||
        heroCls === 'Mago'
      ) {
        attackMode = 'magic';
      } else if (wName.includes('daga') || wName.includes('cuchillo') || heroCls === 'Pícaro') {
        attackMode = 'dagger';
      } else {
        attackMode = 'sword';
      }

      // 🏹 1. ARCO / BALLESTA: Disparo de Flecha Rápida a Larga Distancia (7 casillas)
      if (attackMode === 'bow') {
        const isCrit = Math.random() < ((playerRef.current.critRate || 10) / 100);
        const baseAtk = Math.max(1, (playerRef.current.attack || 15));
        const dmg = Math.round(isCrit ? baseAtk * 1.85 : baseAtk * (0.95 + Math.random() * 0.25));

        projectileEntities.push({
          id: `arrow_${Date.now()}_${Math.random()}`,
          x: (p.x + dx * 0.7) * 32 + 16,
          z: (p.y + dy * 0.7) * 32 + 16,
          y: 0,
          dirX: dx,
          dirZ: dy,
          speed: 420,
          damage: dmg,
          isPlayer: true,
          maxDistance: 7 * 32,
          traveledDistance: 0,
          vfxType: 'arrow',
          color: '#d97706',
          radius: 8,
        });

        soundEngine.playSfx('attack');
        return;
      }

      // 🪄 2. VARITA / BASTÓN MÁGICO: Disparo de Bola de Fuego / Orbe Arcano a Distancia (6 casillas)
      if (attackMode === 'magic') {
        const isCrit = Math.random() < ((playerRef.current.critRate || 8) / 100);
        const baseAtk = Math.max(1, (playerRef.current.attack || 16));
        const dmg = Math.round(isCrit ? baseAtk * 1.9 : baseAtk * (0.95 + Math.random() * 0.25));

        projectileEntities.push({
          id: `fireball_${Date.now()}_${Math.random()}`,
          x: (p.x + dx * 0.7) * 32 + 16,
          z: (p.y + dy * 0.7) * 32 + 16,
          y: 0,
          dirX: dx,
          dirZ: dy,
          speed: 320,
          damage: dmg,
          isPlayer: true,
          maxDistance: 6 * 32,
          traveledDistance: 0,
          vfxType: 'fireball',
          color: '#ea580c',
          radius: 12,
        });

        soundEngine.playSfx('magic');
        return;
      }

      // 🗡️ 3. DAGAS (PÍCARO): Doble Cuchillada Cruzada en 'X' con Alto Crítico
      if (attackMode === 'dagger') {
        const now = performance.now();
        slashEntities.push({
          x: (p.x + dx * 0.8) * 32 + 16,
          y: (p.y + dy * 0.8) * 32 + 16,
          dir: 'dagger1',
          createdAt: now,
        });
        slashEntities.push({
          x: (p.x + dx * 0.8) * 32 + 16,
          y: (p.y + dy * 0.8) * 32 + 16,
          dir: 'dagger2',
          createdAt: now + 35,
        });

        soundEngine.playSfx('attack');

        enemyEntities.forEach((ent) => {
          if (ent.enemy.hp <= 0) return;
          const dist = Math.hypot(ent.enemy.worldX - p.x, ent.enemy.worldZ - p.y);
          const forwardDot = ((ent.enemy.worldX - p.x) * dx + (ent.enemy.worldZ - p.y) * dy) / Math.max(0.1, dist);

          if (dist <= 1.9 && forwardDot > 0.05) {
            const pLevel = playerRef.current.level || 1;
            const levelDiff = ent.enemy.level - pLevel;
            let levelMult = 1.0;
            if (levelDiff >= 6) levelMult = 0.08;
            else if (levelDiff === 5) levelMult = 0.20;
            else if (levelDiff === 4) levelMult = 0.40;
            else if (levelDiff === 3) levelMult = 0.65;
            else if (levelDiff === 2) levelMult = 0.85;

            const isCrit = Math.random() < (((playerRef.current.critRate || 5) + 15) / 100);
            const playerAtk = playerRef.current.attack || 14;
            const defDeduction = Math.floor(ent.enemy.defense * 0.45);
            const baseAtk = Math.max(1, Math.round((playerAtk - defDeduction) * levelMult));
            const dmg = Math.max(1, Math.round(isCrit ? baseAtk * 2.1 : baseAtk * (0.9 + Math.random() * 0.2)));

            ent.enemy.hp -= dmg;
            ent.hitFlashTime = performance.now();
            ent.enemy.state = 'chase';
            ent.enemy.worldX += dx * 0.3;
            ent.enemy.worldZ += dy * 0.3;

            spawnHitSparks(ent.enemy.worldX * 32 + 16, ent.enemy.worldZ * 32 + 16, isCrit ? '#e879f9' : '#c084fc', 8);
            spawnDamageNumber(levelDiff >= 5 && dmg <= 3 ? `¡ROZADO! -${dmg}` : `-${dmg}`, ent.enemy.worldX * 32 + 16, ent.enemy.worldZ * 32, isCrit ? '#c084fc' : '#e879f9', isCrit);
            soundEngine.playSfx('hit');

            if (ent.enemy.hp <= 0) {
              handleEnemyDefeat(ent);
            }
          }
        });
        return;
      }

      // ⚔️ 4. ESPADA / HACHA / CUERPO A CUERPO: Tajo en Media Luna de Acero Brillante
      slashEntities.push({
        x: p.x * 32 + 16,
        y: p.y * 32 + 16,
        dir,
        createdAt: performance.now(),
      });

      soundEngine.playSfx('attack');

      enemyEntities.forEach((ent) => {
        if (ent.enemy.hp <= 0) return;
        const dist = Math.hypot(ent.enemy.worldX - p.x, ent.enemy.worldZ - p.y);
        const forwardDot = ((ent.enemy.worldX - p.x) * dx + (ent.enemy.worldZ - p.y) * dy) / Math.max(0.1, dist);
        const maxRange = ent.enemy.isBoss ? 3.5 : 2.5;

        if (dist <= maxRange && (forwardDot > -0.3 || dist <= 1.3)) {
          const pLevel = playerRef.current.level || 1;
          const levelDiff = ent.enemy.level - pLevel;
          let levelMult = 1.0;
          if (levelDiff >= 6) levelMult = 0.08;
          else if (levelDiff === 5) levelMult = 0.20;
          else if (levelDiff === 4) levelMult = 0.40;
          else if (levelDiff === 3) levelMult = 0.65;
          else if (levelDiff === 2) levelMult = 0.85;

          const isCrit = Math.random() < ((playerRef.current.critRate || 8) / 100);
          const rawAtk = playerRef.current.attack || 16;
          const defDeduction = Math.floor(ent.enemy.defense * 0.45);
          const baseAtk = Math.max(1, Math.round((rawAtk - defDeduction) * levelMult));
          const dmg = Math.max(1, Math.round(isCrit ? baseAtk * 1.95 : baseAtk * (0.95 + Math.random() * 0.25)));

          ent.enemy.hp -= dmg;
          ent.hitFlashTime = performance.now();
          ent.enemy.state = 'chase';

          // Knockback (reducido en bosses)
          const kb = ent.enemy.isBoss ? 0.2 : 0.6;
          ent.enemy.worldX += dx * kb;
          ent.enemy.worldZ += dy * kb;

          const eOffset = ent.enemy.isBoss ? 32 : 16;
          spawnHitSparks(ent.enemy.worldX * 32 + eOffset, ent.enemy.worldZ * 32 + eOffset, isCrit ? '#f59e0b' : '#fef08a', 9);
          spawnDamageNumber(levelDiff >= 5 && dmg <= 3 ? `¡ROZADO! -${dmg}` : `-${dmg}`, ent.enemy.worldX * 32 + eOffset, ent.enemy.worldZ * 32, isCrit ? '#ef4444' : '#fde047', isCrit);
          soundEngine.playSfx('hit');

          if (ent.enemy.hp <= 0) {
            handleEnemyDefeat(ent);
          }
        }
      });
    };

    const triggerPlayerSkill = (skill: HeroCombatSkill): boolean => {
      const p = currentPosRef.current;
      const dir = directionRef.current;
      let dx = 0;
      let dy = 1;
      if (dir === 'up') { dx = 0; dy = -1; }
      else if (dir === 'down') { dx = 0; dy = 1; }
      else if (dir === 'left') { dx = -1; dy = 0; }
      else if (dir === 'right') { dx = 1; dy = 0; }

      if (skill.type === 'heal' || skill.healAmount) {
        const healAmt = Math.round(playerRef.current.maxHp * (skill.healAmount || 0.3));
        spawnDamageNumber(`+${healAmt} HP`, p.x * 32 + 16, p.y * 32, '#22c55e', true);
        soundEngine.playSfx('heal');
        onLootCollected?.('health_orb', healAmt);
        if (skill.type === 'heal' || skill.type === 'buff') {
          return true;
        }
      }

      if (skill.type === 'dash_attack') {
        const nextX = Math.min(Math.max(1, p.x + dx * 2), (currentZone.mapWidth || 60) - 2);
        const nextY = Math.min(Math.max(1, p.y + dy * 2), (currentZone.mapHeight || 60) - 2);
        if (currentZone.tileData[Math.round(nextY)]?.[Math.round(nextX)] === 0) {
          targetPosRef.current = { x: nextX, y: nextY };
          currentPosRef.current = { x: nextX, y: nextY };
          onPlayerMove({ x: nextX, y: nextY });
        }
      }

      if (skill.type === 'projectile') {
        projectileEntities.push({
          id: `proj_${Date.now()}_${Math.random()}`,
          x: (p.x + dx * 0.6) * 32 + 16,
          z: (p.y + dy * 0.6) * 32 + 16,
          y: 0,
          dirX: dx,
          dirZ: dy,
          speed: 280, // pixels per second
          damage: Math.round(playerRef.current.attack * skill.damageMultiplier),
          isPlayer: true,
          maxDistance: skill.range * 32,
          traveledDistance: 0,
          vfxType: skill.vfxType as any,
          color: '#f97316',
          radius: 12,
        });

        soundEngine.playSfx('magic');
        return true;
      }

      // AOE / Slam / Melee Skill
      soundEngine.playSfx('magic');
      const hitRadius = (skill.aoeRadius || 3.0);

      slashEntities.push({
        x: (p.x + dx * 0.5) * 32 + 16,
        y: (p.y + dy * 0.5) * 32 + 16,
        dir: 'spin',
        createdAt: performance.now(),
      });

      enemyEntities.forEach((ent) => {
        if (ent.enemy.hp <= 0) return;
        const dist = Math.hypot(ent.enemy.worldX - p.x, ent.enemy.worldZ - p.y);
        if (dist <= hitRadius) {
          const pLevel = playerRef.current.level || 1;
          const levelDiff = ent.enemy.level - pLevel;
          let levelMult = 1.0;
          if (levelDiff >= 6) levelMult = 0.08;
          else if (levelDiff === 5) levelMult = 0.20;
          else if (levelDiff === 4) levelMult = 0.40;
          else if (levelDiff === 3) levelMult = 0.65;
          else if (levelDiff === 2) levelMult = 0.85;

          const defDeduction = Math.floor(ent.enemy.defense * 0.45);
          const baseSkillDmg = Math.max(1, Math.round(((playerRef.current.attack * skill.damageMultiplier) - defDeduction) * levelMult));
          const dmg = Math.max(1, Math.round(baseSkillDmg * (0.9 + Math.random() * 0.25)));

          ent.enemy.hp -= dmg;
          ent.hitFlashTime = performance.now();
          ent.enemy.state = 'chase';

          spawnHitSparks(ent.enemy.worldX * 32 + 16, ent.enemy.worldZ * 32 + 16, '#38bdf8', 10);
          spawnDamageNumber(levelDiff >= 5 && dmg <= 4 ? `¡ROZADO! -${dmg}` : `-${dmg}`, ent.enemy.worldX * 32 + 16, ent.enemy.worldZ * 32, '#38bdf8', true);
          soundEngine.playSfx('hit');

          if (ent.enemy.hp <= 0) {
            handleEnemyDefeat(ent);
          }
        }
      });

      return true;
    };

    const triggerPlayerDash = (): boolean => {
      const p = currentPosRef.current;
      const dir = directionRef.current;
      let dx = 0;
      let dy = 1;
      if (dir === 'up') { dx = 0; dy = -1; }
      else if (dir === 'down') { dx = 0; dy = 1; }
      else if (dir === 'left') { dx = -1; dy = 0; }
      else if (dir === 'right') { dx = 1; dy = 0; }

      const targetX = Math.min(Math.max(1, p.x + dx * 3), (currentZone.mapWidth || 60) - 2);
      const targetY = Math.min(Math.max(1, p.y + dy * 3), (currentZone.mapHeight || 60) - 2);

      targetPosRef.current = { x: targetX, y: targetY };
      currentPosRef.current = { x: targetX, y: targetY };
      onPlayerMove({ x: targetX, y: targetY });

      soundEngine.playSfx('dash');
      return true;
    };

    if (combatActionRef) {
      combatActionRef.current = {
        triggerBasicAttack: triggerPlayerAttack,
        triggerSkill: triggerPlayerSkill,
        triggerDash: triggerPlayerDash,
      };
    }

    let animId: number;
    let time = 0;
    let lastTimeMs = performance.now();
    const TILE_SIZE = 32;

    const render = () => {
      try {
        const nowMs = performance.now();
        const delta = Math.min(0.08, (nowMs - lastTimeMs) / 1000);
        lastTimeMs = nowMs;
        time += 0.03;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (canvas.parentElement) {
          const rect = canvas.parentElement.getBoundingClientRect();
          const pW = Math.round(rect.width);
          const pH = Math.round(rect.height);
          if (pW > 0 && pH > 0 && (canvas.width !== pW || canvas.height !== pH)) {
            canvas.width = pW;
            canvas.height = pH;
          }
        }

        ctx.imageSmoothingEnabled = false;

        // Protección absoluta anti-NaN para la posición del jugador
        if (isNaN(currentPosRef.current.x) || isNaN(currentPosRef.current.y) || typeof currentPosRef.current.x !== 'number') {
          currentPosRef.current = { x: playerPos?.x ?? 36, y: playerPos?.y ?? 56 };
        }
        if (isNaN(targetPosRef.current.x) || isNaN(targetPosRef.current.y) || typeof targetPosRef.current.x !== 'number') {
          targetPosRef.current = { x: playerPos?.x ?? 36, y: playerPos?.y ?? 56 };
        }

        // Interpolación suave del jugador hacia la casilla destino
        const lerpSpeed = 0.22;
        currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * lerpSpeed;
        currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * lerpSpeed;

        const dist = Math.hypot(
          targetPosRef.current.x - currentPosRef.current.x,
          targetPosRef.current.y - currentPosRef.current.y
        );
        const moving = dist > 0.05;
        isMovingRef.current = moving;

      // Limpiar lienzo
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cámara centrada en el jugador con Zoom RPG Íntimo y Detallado (Estilo Cute Fantasy)
      const zoom = 1.45;
      const targetPxX = currentPosRef.current.x * TILE_SIZE + TILE_SIZE / 2;
      const targetPxY = currentPosRef.current.y * TILE_SIZE + TILE_SIZE / 2;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-Math.round(targetPxX), -Math.round(targetPxY));

      const rows = currentZone.tileData.length;
      const cols = currentZone.tileData[0].length;

      // Viewport culling boundaries ajustados al zoom
      const halfViewW = (canvas.width / 2) / zoom;
      const halfViewH = (canvas.height / 2) / zoom;
      const startCol = Math.max(0, Math.floor((targetPxX - halfViewW) / TILE_SIZE) - 2);
      const endCol = Math.min(cols - 1, Math.ceil((targetPxX + halfViewW) / TILE_SIZE) + 2);
      const startRow = Math.max(0, Math.floor((targetPxY - halfViewH) / TILE_SIZE) - 2);
      const endRow = Math.min(rows - 1, Math.ceil((targetPxY + halfViewH) / TILE_SIZE) + 2);

      // Helper para resolver el suelo base de cualquier casilla (incluso con farolas, animales o plantitas encima)
      const getGroundType = (gx: number, gy: number): number => {
        if (gy < 0 || gy >= rows || gx < 0 || gx >= cols) return 0;
        if (!currentZone.tileData[gy]) return 0;
        const raw = currentZone.tileData[gy][gx];
        if (raw === undefined) return 0;
        if (raw === 0 || raw === 2 || raw === 3 || raw === 4 || raw === 8 || raw === 13) return raw;

        // Para objetos colocados en la calle (farolas 17, pilares 18, cofres 7, puestos 9, etc.)
        let pathNeighbors = 0;
        if (gy > 0 && currentZone.tileData[gy - 1] && (currentZone.tileData[gy - 1][gx] === 2 || currentZone.tileData[gy - 1][gx] === 9 || currentZone.tileData[gy - 1][gx] === 33)) pathNeighbors++;
        if (gy < rows - 1 && currentZone.tileData[gy + 1] && (currentZone.tileData[gy + 1][gx] === 2 || currentZone.tileData[gy + 1][gx] === 9 || currentZone.tileData[gy + 1][gx] === 33)) pathNeighbors++;
        if (gx > 0 && (currentZone.tileData[gy][gx - 1] === 2 || currentZone.tileData[gy][gx - 1] === 9 || currentZone.tileData[gy][gx - 1] === 33)) pathNeighbors++;
        if (gx < cols - 1 && (currentZone.tileData[gy][gx + 1] === 2 || currentZone.tileData[gy][gx + 1] === 9 || currentZone.tileData[gy][gx + 1] === 33)) pathNeighbors++;
        return pathNeighbors >= 2 ? 2 : 0;
      };

      // ------------------------------------------------------------------------
      // CAPA 0: BALDOSAS DE SUELO Y CALZADAS (TEXTURAS AUTÉNTICAS PIXEL CRAWLER & CUTE FANTASY)
      // ------------------------------------------------------------------------
      const hasFloorTiles = gameAssets.floorTiles.complete && gameAssets.floorTiles.naturalWidth > 0;

      // Fondo base de hierba continua para eliminar cualquier costura de 1px
      if (currentZone.id === 'zone_forest') {
        ctx.fillStyle = '#5ca632';
        ctx.fillRect(
          startCol * TILE_SIZE,
          startRow * TILE_SIZE,
          (endCol - startCol + 1) * TILE_SIZE,
          (endRow - startRow + 1) * TILE_SIZE
        );
      }

      for (let y = startRow; y <= endRow; y++) {
        for (let x = startCol; x <= endCol; x++) {
          const groundType = getGroundType(x, y);
          const drawPosX = x * TILE_SIZE;
          const drawPosY = y * TILE_SIZE;

          if (currentZone.id === 'zone_forest' && groundType === 3) {
            // Río Fluvial Dual-Tone (Estilo Cute Fantasy): Orillas de Arena, Aguas Turquesas y Profundidad Azul
            const wave = Math.sin(time * 2.5 + x * 0.6 + y * 0.4) * 0.15;
            
            // Base profunda azul índigo
            ctx.fillStyle = '#0369a1';
            ctx.fillRect(drawPosX, drawPosY, TILE_SIZE + 0.5, TILE_SIZE + 0.5);
            
            // Capa de agua turquesa cristalina
            ctx.fillStyle = `rgba(56, 189, 248, ${0.7 + wave})`;
            ctx.fillRect(drawPosX, drawPosY + 2, TILE_SIZE + 0.5, TILE_SIZE - 4);
            
            // Reflejos cristalinos en la superficie
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            const rippleX = drawPosX + 6 + (Math.sin(time * 3 + y * 0.7) * 5);
            ctx.fillRect(rippleX, drawPosY + 8, 14, 2);
            ctx.fillRect(rippleX + 8, drawPosY + 20, 10, 2);

            // Detección de Orilla (Shoreline) con el césped
            const leftIsShore = x > 0 && currentZone.tileData[y]?.[x - 1] !== 3 && currentZone.tileData[y]?.[x - 1] !== 15;
            const rightIsShore = x < currentZone.mapWidth - 1 && currentZone.tileData[y]?.[x + 1] !== 3 && currentZone.tileData[y]?.[x + 1] !== 15;

            // Orilla Oeste (Ribera de arena dorada suave + agua somera + espuma)
            if (leftIsShore) {
              ctx.fillStyle = '#e2b170';
              ctx.fillRect(drawPosX, drawPosY, 4, TILE_SIZE + 0.5);
              ctx.fillStyle = '#c89658';
              ctx.fillRect(drawPosX + 3, drawPosY, 2, TILE_SIZE + 0.5);
              ctx.fillStyle = 'rgba(103, 232, 249, 0.85)';
              ctx.fillRect(drawPosX + 5, drawPosY, 4, TILE_SIZE + 0.5);
              const foamWave = Math.sin(time * 3 + y * 0.8) * 1.5;
              ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
              ctx.fillRect(drawPosX + 6 + foamWave, drawPosY + 2, 2, TILE_SIZE - 4);
            }

            // Orilla Este (Ribera de arena dorada + agua somera + espuma)
            if (rightIsShore) {
              ctx.fillStyle = '#e2b170';
              ctx.fillRect(drawPosX + TILE_SIZE - 4, drawPosY, 4, TILE_SIZE + 0.5);
              ctx.fillStyle = '#c89658';
              ctx.fillRect(drawPosX + TILE_SIZE - 5, drawPosY, 2, TILE_SIZE + 0.5);
              ctx.fillStyle = 'rgba(103, 232, 249, 0.85)';
              ctx.fillRect(drawPosX + TILE_SIZE - 9, drawPosY, 4, TILE_SIZE + 0.5);
              const foamWave = Math.cos(time * 3 + y * 0.8) * 1.5;
              ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
              ctx.fillRect(drawPosX + TILE_SIZE - 8 - foamWave, drawPosY + 2, 2, TILE_SIZE - 4);
            }

            // Nenúfares con sombra suave bajo el agua y flor de loto
            if ((x * 7 + y * 13) % 6 === 0) {
              ctx.fillStyle = 'rgba(3, 105, 161, 0.6)';
              ctx.beginPath();
              ctx.ellipse(drawPosX + 17, drawPosY + 18, 7, 5, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#15803d';
              ctx.beginPath();
              ctx.ellipse(drawPosX + 16, drawPosY + 16, 6, 4, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#4ade80';
              ctx.fillRect(drawPosX + 14, drawPosY + 15, 3, 2);
              ctx.fillStyle = '#f43f5e';
              ctx.fillRect(drawPosX + 17, drawPosY + 14, 3, 3);
              ctx.fillStyle = '#fef08a';
              ctx.fillRect(drawPosX + 18, drawPosY + 15, 1, 1);
            }
          } else if (currentZone.id === 'zone_forest') {
            if (groundType === 2) {
              // 🛣️ Caminos y Plazas de Adoquines Medievales Cálidos (2.5D HD)
              const pathTile = getTileCanvas(2, currentZone.id, (x * 3 + y * 7) % 8);
              ctx.drawImage(pathTile, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
            } else {
              // 🌿 Césped con Flores Silvestres y Textura Pixel Art Rica
              const grassTile = getTileCanvas(0, currentZone.id, (x * 3 + y * 7) % 8);
              ctx.drawImage(grassTile, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
            }

            if (groundType === 2) {

              // 🛣️ Bordillos de Piedra y Adoquines Pulidos en los Márgenes (Estilo RPG Retro HD)
              const isPath = (tx: number, ty: number) => {
                if (tx < 0 || ty < 0 || tx >= currentZone.mapWidth || ty >= currentZone.mapHeight) return true;
                const gt = getGroundType(tx, ty);
                return gt === 2 || gt === 9 || gt === 15;
              };
              const hasT = isPath(x, y - 1);
              const hasB = isPath(x, y + 1);
              const hasL = isPath(x - 1, y);
              const hasR = isPath(x + 1, y);

              // Bordillo Superior (Top Stone Curb)
              if (!hasT) {
                ctx.fillStyle = '#78716c';
                ctx.fillRect(drawPosX, drawPosY, TILE_SIZE + 0.5, 4);
                ctx.fillStyle = '#e7e5e4';
                ctx.fillRect(drawPosX, drawPosY, TILE_SIZE + 0.5, 1.5);
                ctx.fillStyle = '#a8a29e';
                ctx.fillRect(drawPosX, drawPosY + 1.5, TILE_SIZE + 0.5, 2);
                ctx.fillStyle = '#57534e';
                ctx.fillRect(drawPosX + 8, drawPosY, 1, 4);
                ctx.fillRect(drawPosX + 16, drawPosY, 1, 4);
                ctx.fillRect(drawPosX + 24, drawPosY, 1, 4);
              }
              // Bordillo Inferior (Bottom Stone Curb)
              if (!hasB) {
                ctx.fillStyle = '#57534e';
                ctx.fillRect(drawPosX, drawPosY + TILE_SIZE - 4, TILE_SIZE + 0.5, 4);
                ctx.fillStyle = '#e7e5e4';
                ctx.fillRect(drawPosX, drawPosY + TILE_SIZE - 4, TILE_SIZE + 0.5, 1.5);
                ctx.fillStyle = '#a8a29e';
                ctx.fillRect(drawPosX, drawPosY + TILE_SIZE - 2.5, TILE_SIZE + 0.5, 2);
                ctx.fillStyle = '#44403c';
                ctx.fillRect(drawPosX + 8, drawPosY + TILE_SIZE - 4, 1, 4);
                ctx.fillRect(drawPosX + 16, drawPosY + TILE_SIZE - 4, 1, 4);
                ctx.fillRect(drawPosX + 24, drawPosY + TILE_SIZE - 4, 1, 4);
              }
              // Bordillo Izquierdo (Left Stone Curb)
              if (!hasL) {
                ctx.fillStyle = '#78716c';
                ctx.fillRect(drawPosX, drawPosY, 4, TILE_SIZE + 0.5);
                ctx.fillStyle = '#f5f5f4';
                ctx.fillRect(drawPosX, drawPosY, 1.5, TILE_SIZE + 0.5);
                ctx.fillStyle = '#a8a29e';
                ctx.fillRect(drawPosX + 1.5, drawPosY, 2, TILE_SIZE + 0.5);
                ctx.fillStyle = '#57534e';
                ctx.fillRect(drawPosX, drawPosY + 8, 4, 1);
                ctx.fillRect(drawPosX, drawPosY + 16, 4, 1);
                ctx.fillRect(drawPosX, drawPosY + 24, 4, 1);
              }
              // Bordillo Derecho (Right Stone Curb)
              if (!hasR) {
                ctx.fillStyle = '#57534e';
                ctx.fillRect(drawPosX + TILE_SIZE - 4, drawPosY, 4, TILE_SIZE + 0.5);
                ctx.fillStyle = '#e7e5e4';
                ctx.fillRect(drawPosX + TILE_SIZE - 4, drawPosY, 1.5, TILE_SIZE + 0.5);
                ctx.fillStyle = '#a8a29e';
                ctx.fillRect(drawPosX + TILE_SIZE - 2.5, drawPosY, 2, TILE_SIZE + 0.5);
                ctx.fillStyle = '#44403c';
                ctx.fillRect(drawPosX + TILE_SIZE - 4, drawPosY + 8, 4, 1);
                ctx.fillRect(drawPosX + TILE_SIZE - 4, drawPosY + 16, 4, 1);
                ctx.fillRect(drawPosX + TILE_SIZE - 4, drawPosY + 24, 4, 1);
              }
            } else if (groundType === 13) {
              // 🌾 Tierra Fértil de Arado (Cute Fantasy FarmLand_Tile.png)
              if (gameAssets.farmLand.complete && gameAssets.farmLand.naturalWidth > 0) {
                const fx = (x % 3) * 16;
                const fy = (y % 3) * 16;
                ctx.drawImage(gameAssets.farmLand, fx, fy, 16, 16, drawPosX, drawPosY, TILE_SIZE + 0.5, TILE_SIZE + 0.5);
              } else {
                ctx.fillStyle = '#78350f';
                ctx.fillRect(drawPosX, drawPosY, TILE_SIZE + 0.5, TILE_SIZE + 0.5);
                ctx.fillStyle = '#451a03';
                ctx.fillRect(drawPosX, drawPosY + 3, TILE_SIZE + 0.5, 3);
                ctx.fillRect(drawPosX, drawPosY + 11, TILE_SIZE + 0.5, 3);
                ctx.fillRect(drawPosX, drawPosY + 19, TILE_SIZE + 0.5, 3);
                ctx.fillRect(drawPosX, drawPosY + 27, TILE_SIZE + 0.5, 3);
              }
            } else if (groundType === 15) {
              // 🌉 Puente de Madera Rústico sobre el río
              ctx.fillStyle = '#5c2c16';
              ctx.fillRect(drawPosX + 2, drawPosY, TILE_SIZE - 4, TILE_SIZE + 0.5);
              ctx.fillStyle = '#854d0e';
              ctx.fillRect(drawPosX + 4, drawPosY + 2, TILE_SIZE - 8, 5);
              ctx.fillRect(drawPosX + 4, drawPosY + 10, TILE_SIZE - 8, 5);
              ctx.fillRect(drawPosX + 4, drawPosY + 18, TILE_SIZE - 8, 5);
              ctx.fillRect(drawPosX + 4, drawPosY + 26, TILE_SIZE - 8, 5);
              ctx.fillStyle = '#b45309';
              ctx.fillRect(drawPosX + 2, drawPosY, 2, TILE_SIZE + 0.5);
              ctx.fillRect(drawPosX + TILE_SIZE - 4, drawPosY, 2, TILE_SIZE + 0.5);
            } else {
              // Flores silvestres esparcidas orgánicamente
              const flowerHash = (x * 17 + y * 31) % 12;
              if (flowerHash === 1) {
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(drawPosX + 8, drawPosY + 10, 3, 3);
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(drawPosX + 9, drawPosY + 11, 1, 1);
              } else if (flowerHash === 2) {
                ctx.fillStyle = '#38bdf8';
                ctx.fillRect(drawPosX + 20, drawPosY + 18, 3, 3);
              } else if (flowerHash === 3) {
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(drawPosX + 14, drawPosY + 22, 2, 2);
              }
            }
          } else if (currentZone.id === 'subzone_castle' || currentZone.interiorType === 'castle') {
            if (groundType === 2) {
              // 👑 Gran Alfombra Carmesí Imperial con Ribetes Dorados
              ctx.fillStyle = '#7f1d1d';
              ctx.fillRect(drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
              ctx.fillStyle = '#991b1b';
              ctx.fillRect(drawPosX + 2, drawPosY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
              ctx.fillStyle = '#b91c1c';
              ctx.fillRect(drawPosX + 4, drawPosY + 4, TILE_SIZE - 8, TILE_SIZE - 8);
              // Ribete dorado
              ctx.fillStyle = '#fbbf24';
              if (x === 11) {
                ctx.fillRect(drawPosX + 1, drawPosY, 2, TILE_SIZE);
              }
              if (x === 12) {
                ctx.fillRect(drawPosX + TILE_SIZE - 3, drawPosY, 2, TILE_SIZE);
              }
              // Rombo central bordado
              if (y % 2 === 0) {
                ctx.fillStyle = '#f59e0b';
                ctx.fillRect(drawPosX + 14, drawPosY + 14, 4, 4);
              }
            } else {
              // 🏛️ Suelo de Mármol Noble Ajedrezado Palaciego
              const isDark = (x + y) % 2 === 0;
              ctx.fillStyle = isDark ? '#1e293b' : '#334155';
              ctx.fillRect(drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
              ctx.fillStyle = isDark ? '#334155' : '#475569';
              ctx.fillRect(drawPosX + 1, drawPosY + 1, TILE_SIZE - 2, TILE_SIZE - 2);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
              ctx.fillRect(drawPosX + 2, drawPosY + 2, TILE_SIZE - 4, 3);
            }
          } else if (currentZone.id === 'zone_castle' || currentZone.id === 'zone_sanctuary') {
            ctx.drawImage(gameAssets.floorTiles, 256, 16, 16, 16, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
          } else if (currentZone.id === 'zone_tundra') {
            ctx.drawImage(gameAssets.floorTiles, 16, 352, 16, 16, drawPosX, drawPosY, TILE_SIZE, TILE_SIZE);
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

      // 1. Árboles, Estructuras y Props según tileData (dentro del viewport) - CACHED PER FRAME
      const { trunk: treeTrunk, canopy: treeCanopy } = getTreeCanvas(currentZone.id);
      const stoneWall = getStoneWallCanvas();
      const weaponRack = getWeaponRackCanvas();
      const waterWell = getWaterWellCanvas(time * 2);
      const windmill = getWindmillCanvas(time * 1.5);
      const forge = getForgeCanvas(time);
      const shrine = getShrineCanvas(false, time);
      const bossPortal = getShrineCanvas(true, time);
      const cryptMausoleum = getCryptMausoleumCanvas(gameAssets.house, time);
      const boneUrns = getBoneUrnStackCanvas();
      const pirateCrates = getPirateCrateStackCanvas();
      const barrelStack = getTavernBarrelStackCanvas();
      const spectralBrazier = getSpectralBrazierCanvas(time);
      const stoneSarcophagus = getStoneSarcophagusCanvas();
      const graveyardTombstone = getGraveyardCanvas();
      const campfire = getCampfireCanvas(time);
      const ruinedPillar = getRuinedPillarCanvas();
      const mossyBoulder = getMossyBoulderCanvas();
      const orePile = getOrePileCanvas();
      const streetLamp = getStreetLampCanvas(time);
      const wallTorchFront = getWallTorchCanvas(time, 'front');
      const wallTorchLeft = getWallTorchCanvas(time, 'left');
      const wallTorchRight = getWallTorchCanvas(time, 'right');
      const woodenBench = getWoodenBenchCanvas();
      const dockRowboat = getDockRowboatCanvas();
      const alchemyCauldron = getAlchemyCauldronCanvas(time);
      const blastFurnace = getBlastFurnaceCanvas(time);

      for (let y = startRow; y <= endRow; y++) {
        if (!currentZone.tileData[y]) continue;
        for (let x = startCol; x <= endCol; x++) {
          const tileType = currentZone.tileData[y][x];
          if (tileType === undefined) continue;
          const posX = x * TILE_SIZE;
          const posY = y * TILE_SIZE;

          if (tileType === 1) {
            // Muros de piedra en Interiores / Subzonas / Castillo / Cueva, o Robles de fantasía en exteriores
            const isInteriorZone = currentZone.isInterior || currentZone.id.includes('subzone') || currentZone.id === 'zone_castle' || currentZone.id === 'zone_cave';
            if (isInteriorZone) {
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
            if (x === 14 && y === 9) vName = 'red';     // Cabaña del Gremio de Exploradores
            if (x === 23 && y === 9) vName = 'blue';    // Cabaña del Guardabosques Noroeste
            if (x === 11 && y === 19) vName = 'stone';  // Almacén de Minerales y Fundición
            if (x === 11 && y === 23) vName = 'red';    // Cabaña del Mercader Mayor
            if (x === 44 && y === 19) vName = 'blue';   // Villa del Mirador del Río
            if (x === 44 && y === 27) vName = 'purple'; // Villa Jardín de Rosas

            entities.push({
              ySort: posY + TILE_SIZE + 20,
              draw: (c) => {
                // Sombra de contacto
                c.fillStyle = 'rgba(15, 23, 42, 0.45)';
                c.beginPath();
                c.ellipse(posX + 16, posY + 24, 48, 8, 0, 0, Math.PI * 2);
                c.fill();

                if (x === 31 && y === 51) {
                  // 🍺 Gran Taberna y Posada "El Jabalí Dorado" (Cute Fantasy 2.5D HD - 96x128 px)
                  const tavernHouse = getTavernCuteHouseCanvas(gameAssets.house, time);
                  c.drawImage(tavernHouse, 0, 0, 96, 128, posX - 32, posY - 76, 96, 128);
                } else {
                  const houseCanvas = getRecoloredCuteHouseCanvas(gameAssets.house, vName);
                  c.drawImage(houseCanvas, 0, 0, 96, 128, posX - 32, posY - 76, 96, 128);
                }
              },
            });
          } else if (tileType === 10) {
            // ⚒️ Gran Forja y Maestranza Real (Cute Fantasy 2.5D HD - 96x128 px)
            entities.push({
              ySort: posY + TILE_SIZE + 20,
              draw: (c) => {
                // Sombra de contacto
                c.fillStyle = 'rgba(15, 23, 42, 0.45)';
                c.beginPath();
                c.ellipse(posX + 16, posY + 24, 48, 8, 0, 0, Math.PI * 2);
                c.fill();

                const blacksmithHouse = getBlacksmithCuteHouseCanvas(gameAssets.house, time);
                c.drawImage(blacksmithHouse, 0, 0, 96, 128, posX - 32, posY - 76, 96, 128);
              },
            });
          } else if (tileType === 21) {
            // 🪨 Acantilado de Tierra y Roca Cálida Marrón 2.5D (Cute Fantasy Cliff_Tile)
            const hasL = x > 0 && currentZone.tileData[y]?.[x - 1] === 21;
            const hasR = x < cols - 1 && currentZone.tileData[y]?.[x + 1] === 21;
            const hasT = y > 0 && currentZone.tileData[y - 1]?.[x] === 21;
            const hasB = y < rows - 1 && currentZone.tileData[y + 1]?.[x] === 21;

            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                // Sombra proyectada en la base inferior
                c.fillStyle = 'rgba(15, 23, 42, 0.45)';
                c.fillRect(posX, posY + TILE_SIZE - 4, TILE_SIZE, 6);

                if (gameAssets.cliffTile.complete && gameAssets.cliffTile.naturalWidth > 0) {
                  const cx = (x % 3) * 16;
                  const cy = !hasT ? 0 : !hasB ? 32 : 16;
                  c.drawImage(gameAssets.cliffTile, cx, cy, 16, 16, posX, posY, TILE_SIZE, TILE_SIZE);
                } else {
                  // Cara de roca de tierra cálida marrón (Warm Earthen Rock Face)
                  c.fillStyle = '#78350f'; // Tierra cálida base
                  c.fillRect(posX, posY + 4, TILE_SIZE, TILE_SIZE - 4);
                  c.fillStyle = '#92400e'; // Estrato iluminado
                  c.fillRect(posX, posY + 6, TILE_SIZE, TILE_SIZE - 10);
                  c.fillStyle = '#b45309'; // Veta de arcilla dorada
                  c.fillRect(posX + 2, posY + 8, TILE_SIZE - 4, 3);
                  c.fillStyle = '#451a03'; // Grietas oscuras
                  c.fillRect(posX + 4, posY + 13, 10, 2);
                  c.fillRect(posX + 18, posY + 20, 10, 2);
                  c.fillRect(posX + 8, posY + 24, 8, 2);

                  // Borde superior de hierba con volumen (Top Grass Overhang)
                  if (!hasT) {
                    c.fillStyle = '#15803d'; // Sombra verde
                    c.fillRect(posX, posY + 3, TILE_SIZE, 4);
                    c.fillStyle = '#5ca632'; // Césped brillante
                    c.fillRect(posX, posY, TILE_SIZE, 4);
                    // Mechones de hierba colgantes
                    c.fillStyle = '#65a30d';
                    c.fillRect(posX + 3, posY + 4, 4, 3);
                    c.fillRect(posX + 13, posY + 4, 4, 2);
                    c.fillRect(posX + 23, posY + 4, 5, 3);
                  }

                  // Ribete izquierdo
                  if (!hasL) {
                    c.fillStyle = '#451a03';
                    c.fillRect(posX, posY + 4, 3, TILE_SIZE - 4);
                  }
                  // Ribete derecho
                  if (!hasR) {
                    c.fillStyle = '#3e1a00';
                    c.fillRect(posX + TILE_SIZE - 3, posY + 4, 3, TILE_SIZE - 4);
                  }

                  // Musgo decorativo verde en la base
                  c.fillStyle = 'rgba(74, 222, 128, 0.45)';
                  c.fillRect(posX + 4, posY + TILE_SIZE - 7, 8, 4);
                  c.fillRect(posX + 18, posY + TILE_SIZE - 6, 9, 3);
                }
              },
            });
          } else if (tileType === 13) {
            // 🎃 Huerto con Calabazas Gigantes, Coles y Zanahorias
            entities.push({
              ySort: posY + TILE_SIZE - 2,
              draw: (c) => {
                const cropVariant = (x * 3 + y * 7) % 3;
                if (cropVariant === 0) {
                  // 🎃 Calabaza gigante naranja brillante con tallo verde
                  c.fillStyle = 'rgba(0, 0, 0, 0.25)';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 24, 9, 4, 0, 0, Math.PI * 2);
                  c.fill();
                  c.fillStyle = '#ea580c';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 20, 9, 8, 0, 0, Math.PI * 2);
                  c.fill();
                  c.fillStyle = '#f97316';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 19, 6, 7, 0, 0, Math.PI * 2);
                  c.fill();
                  c.fillStyle = '#15803d';
                  c.fillRect(posX + 15, posY + 10, 2, 4);
                } else if (cropVariant === 1) {
                  // 🥬 Repollo frondoso verde
                  c.fillStyle = 'rgba(0, 0, 0, 0.25)';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 24, 8, 4, 0, 0, Math.PI * 2);
                  c.fill();
                  c.fillStyle = '#16a34a';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 20, 8, 7, 0, 0, Math.PI * 2);
                  c.fill();
                  c.fillStyle = '#86efac';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 19, 5, 5, 0, 0, Math.PI * 2);
                  c.fill();
                } else {
                  // 🥕 Zanahorias en tierra
                  c.fillStyle = '#22c55e';
                  c.fillRect(posX + 10, posY + 16, 4, 6);
                  c.fillRect(posX + 18, posY + 14, 4, 8);
                  c.fillStyle = '#f97316';
                  c.fillRect(posX + 11, posY + 22, 2, 3);
                  c.fillRect(posX + 19, posY + 22, 2, 3);
                }
              },
            });
          } else if (tileType === 15) {
            // 🌉 Puente de Madera Rústico sobre el río (Cute Fantasy Bridge_Wood.png)
            entities.push({
              ySort: posY + TILE_SIZE - 6,
              draw: (c) => {
                if (gameAssets.bridgeWood.complete && gameAssets.bridgeWood.naturalWidth > 0) {
                  c.drawImage(gameAssets.bridgeWood, 0, 0, 48, 48, posX - 8, posY - 8, 48, 48);
                } else {
                  c.fillStyle = '#5c2c16';
                  c.fillRect(posX + 2, posY, TILE_SIZE - 4, TILE_SIZE);
                  c.fillStyle = '#854d0e';
                  c.fillRect(posX + 4, posY + 2, TILE_SIZE - 8, 6);
                  c.fillRect(posX + 4, posY + 12, TILE_SIZE - 8, 6);
                  c.fillRect(posX + 4, posY + 22, TILE_SIZE - 8, 6);
                  c.fillStyle = '#b45309';
                  c.fillRect(posX + 2, posY, 3, TILE_SIZE);
                  c.fillRect(posX + TILE_SIZE - 5, posY, 3, TILE_SIZE);
                }
              },
            });
          } else if (tileType === 14) {
            // 🍷 Bodega en Taberna, 💀 Urnas y Huesos en Cripta, o Barriles/Cajas en Aldea
            if (currentZone.interiorType === 'tavern' || currentZone.id === 'subzone_tavern') {
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(barrelStack, posX, posY, 32, 32);
                },
              });
            } else if (currentZone.interiorType === 'crypt' || currentZone.id === 'subzone_crypt') {
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(boneUrns, posX, posY, 32, 32);
                },
              });
            } else if (currentZone.interiorType === 'smugglers_cave' || currentZone.id === 'subzone_smugglers_cave') {
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(pirateCrates, posX, posY, 32, 32);
                },
              });
            } else {
              const isCrate = (x * 7 + y * 13) % 2 === 0;
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.fillStyle = 'rgba(0, 0, 0, 0.35)';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 26, 10, 4, 0, 0, Math.PI * 2);
                  c.fill();
                  if (isCrate) {
                    // Cajas de madera apiladas
                    c.fillStyle = '#78350f';
                    c.fillRect(posX + 4, posY + 8, 24, 20);
                    c.fillStyle = '#92400e';
                    c.fillRect(posX + 6, posY + 10, 20, 16);
                    c.fillStyle = '#d97706';
                    c.fillRect(posX + 5, posY + 9, 2, 18);
                    c.fillRect(posX + 25, posY + 9, 2, 18);
                    c.fillRect(posX + 5, posY + 9, 22, 2);
                    c.fillRect(posX + 5, posY + 25, 22, 2);
                  } else {
                    // Barril de roble con aros de hierro
                    c.fillStyle = '#451a03';
                    c.beginPath();
                    c.ellipse(posX + 16, posY + 16, 10, 12, 0, 0, Math.PI * 2);
                    c.fill();
                    c.fillStyle = '#78350f';
                    c.beginPath();
                    c.ellipse(posX + 16, posY + 16, 8, 11, 0, 0, Math.PI * 2);
                    c.fill();
                    // Aros de hierro
                    c.fillStyle = '#64748b';
                    c.fillRect(posX + 8, posY + 10, 16, 2);
                    c.fillRect(posX + 8, posY + 22, 16, 2);
                  }
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
            // Cofre del Tesoro Dorado
            const chestId = `${currentZone.id}_${x}_${y}`;
            const isOpen = openedChestsRef.current.includes(chestId);
            const chest = getChestCanvas(isOpen);
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(chest, posX + 2, posY + 4, 28, 28);
              },
            });
          } else if (tileType === 8) {
            // 🪦 Gran Mausoleo en Cementerio Noreste o Santuario Místico de Mármol
            const isCryptMausoleum = (currentZone.id === 'zone_forest' && x >= 50 && y <= 35) || currentZone.id === 'subzone_crypt';
            if (isCryptMausoleum) {
              entities.push({
                ySort: posY + TILE_SIZE + 24,
                draw: (c) => {
                  c.drawImage(cryptMausoleum, 0, 0, 96, 128, posX - 32, posY - 76, 96, 128);
                },
              });
            } else {
              const shrine = getShrineCanvas();
              entities.push({
                ySort: posY + TILE_SIZE + 8,
                draw: (c) => {
                  c.drawImage(shrine, posX - 8, posY - 16, 48, 48);
                },
              });
            }
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
            // 👑 Trono Real en el Castillo, o Forja y Yunque en Herrería
            if (currentZone.interiorType === 'castle' || currentZone.id === 'subzone_castle') {
              if (x === 11) {
                const throne = getRoyalThroneCanvas(time);
                entities.push({
                  ySort: posY + TILE_SIZE + 16,
                  draw: (c) => {
                    c.drawImage(throne, posX - 16, posY - 28, 64, 64);
                  },
                });
              }
            } else {
              const blacksmith = getForgeCanvas();
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(blacksmith, posX, posY, 32, 32);
                },
              });
            }
          } else if (tileType === 11) {
            // Gran Portal de Mazmorra / Portal del Jefe 2.5D Monumental Animado (64x72 px)
            entities.push({
              ySort: posY + TILE_SIZE + 10,
              draw: (c) => {
                const pX = posX - 16;
                const pY = posY - 40;

                // Sombra de contacto
                c.fillStyle = 'rgba(0, 0, 0, 0.45)';
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

                // Fondo de Muralla de Piedra Tallada y Altar (Sin vórtice de teletransporte)
                c.fillStyle = '#0f172a';
                c.fillRect(pX + 18, pY + 22, 28, 42);
                c.fillStyle = '#1e293b';
                c.fillRect(pX + 20, pY + 24, 24, 38);

                // Runas ancestrales talladas en la losa de piedra
                const runeGlow = Math.sin(time * 3) * 0.2 + 0.8;
                c.fillStyle = `rgba(34, 197, 94, ${0.45 * runeGlow})`;
                c.fillRect(pX + 26, pY + 32, 12, 3);
                c.fillRect(pX + 30, pY + 30, 4, 14);
                c.fillRect(pX + 24, pY + 46, 16, 2);
                c.fillRect(pX + 28, pY + 44, 8, 8);

                // Braseros de fuego sagrado en los pilares superiores
                const fPulse = Math.sin(time * 6) * 1.5;
                c.fillStyle = '#ea580c';
                c.beginPath();
                c.arc(pX + 11, pY + 6 + fPulse, 5, 0, Math.PI * 2);
                c.arc(pX + 53, pY + 6 + fPulse, 5, 0, Math.PI * 2);
                c.fill();
                c.fillStyle = '#fde047';
                c.fillRect(pX + 10, pY + 4 + fPulse, 2, 2);
                c.fillRect(pX + 52, pY + 4 + fPulse, 2, 2);

                // Emblema del Rey en el dintel
                c.fillStyle = '#fef08a';
                c.font = 'bold 9px monospace';
                c.textAlign = 'center';
                c.fillText('👑', posX + 16, pY + 18);
              },
            });
          } else if (tileType === 12) {
            // 🌿 Setos de Jardín Frondosos con Hojas y Rosas / Bancos de Madera en Plaza
            const isPlazaBench = (y === 57 || y === 63) && (x >= 32 && x <= 40);
            if (isPlazaBench) {
              const bench = getWoodenBenchCanvas();
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.fillStyle = 'rgba(0, 0, 0, 0.3)';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 26, 12, 4, 0, 0, Math.PI * 2);
                  c.fill();
                  c.drawImage(bench, posX, posY + 2, 32, 28);
                },
              });
            } else {
              // Seto de Jardín Verde Frondoso 2.5D
              const hedgeCanvas = getLabyrinthHedgeCanvas();
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.fillStyle = 'rgba(0, 0, 0, 0.25)';
                  c.beginPath();
                  c.ellipse(posX + 16, posY + 26, 12, 4, 0, 0, Math.PI * 2);
                  c.fill();
                  c.drawImage(hedgeCanvas, posX, posY - 2, 32, 34);
                  // Pequeñas flores decorativas en el seto
                  if ((x + y) % 2 === 0) {
                    c.fillStyle = '#f43f5e';
                    c.fillRect(posX + 8, posY + 10, 3, 3);
                    c.fillRect(posX + 20, posY + 14, 3, 3);
                    c.fillStyle = '#fef08a';
                    c.fillRect(posX + 9, posY + 11, 1, 1);
                    c.fillRect(posX + 21, posY + 15, 1, 1);
                  }
                },
              });
            }
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
            // Armero de Armas en la Forja, o Lápidas en Cementerio
            if (currentZone.interiorType === 'forge' || currentZone.id === 'subzone_forge') {
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(weaponRack, posX, posY - 6, 32, 38);
                },
              });
            } else if (gameAssets.cemeteryGraves.complete && gameAssets.cemeteryGraves.naturalWidth > 0) {
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
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(graveyardTombstone, posX + 4, posY + 4, 24, 28);
                },
              });
            }
          } else if (tileType === 17) {
            // 🔥 Antorchas de Pared en Interiores / 🏮 Farolas de Calle en Exteriores
            if (currentZone.isInterior || currentZone.id.includes('subzone')) {
              const torch = x <= 2 ? wallTorchLeft : x >= (currentZone.mapWidth || 18) - 2 ? wallTorchRight : wallTorchFront;
              entities.push({
                ySort: posY + TILE_SIZE + 4,
                draw: (c) => {
                  c.drawImage(torch, posX, posY - 6, 32, 32);
                },
              });
            } else {
              entities.push({
                ySort: posY + TILE_SIZE + 4,
                draw: (c) => {
                  c.drawImage(streetLamp, posX - 8, posY - 20, 48, 56);
                },
              });
            }
          } else if (tileType === 18) {
            // Rocas Redondeadas con Musgo (Estilo Cute Fantasy) o Columnas de Mármol con Hiedra
            const isBoulder = currentZone.id === 'zone_forest' && ((x * 13 + y * 7) % 2 === 0);
            if (isBoulder) {
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(mossyBoulder, posX - 2, posY, 36, 32);
                },
              });
            } else {
              entities.push({
                ySort: posY + TILE_SIZE + 4,
                draw: (c) => {
                  c.drawImage(ruinedPillar, posX + 2, posY - 10, 28, 44);
                },
              });
            }
          } else if (tileType === 22) {
            // Pila de Mineral y Carbón en Forja, o Tablón de Misiones en Aldea
            if (currentZone.interiorType === 'forge' || currentZone.id === 'subzone_forge') {
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(orePile, posX, posY, 32, 32);
                },
              });
            } else {
              entities.push({
                ySort: posY + TILE_SIZE + 4,
                draw: (c) => {
                  c.drawImage(noticeBoard, posX - 4, posY - 16, 40, 48);
                },
              });
            }
          } else if (tileType === 29) {
            // 🔨 Yunque de Herrero con Martillo y Chispas
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(anvil, posX, posY, 32, 32);
              },
            });
          } else if (tileType === 19) {
            // Gran Horno de Fundición en la Forja, Chimenea en Taberna, Caldero en Botica, o Hoguera en exteriores
            if (currentZone.interiorType === 'forge' || currentZone.id === 'subzone_forge') {
              entities.push({
                ySort: posY + TILE_SIZE + 10,
                draw: (c) => {
                  c.drawImage(blastFurnace, posX - 16, posY - 28, 64, 64);
                },
              });
            } else if (currentZone.interiorType === 'tavern' || currentZone.id === 'subzone_tavern') {
              entities.push({
                ySort: posY + TILE_SIZE + 8,
                draw: (c) => {
                  c.drawImage(tavernFireplace, posX - 8, posY - 14, 48, 48);
                },
              });
            } else if (currentZone.interiorType === 'botica' || currentZone.id === 'subzone_botica') {
              entities.push({
                ySort: posY + TILE_SIZE + 8,
                draw: (c) => {
                  c.drawImage(alchemyCauldron, posX - 8, posY - 14, 48, 48);
                },
              });
            } else if (currentZone.interiorType === 'crypt' || currentZone.id === 'subzone_crypt') {
              entities.push({
                ySort: posY + TILE_SIZE + 4,
                draw: (c) => {
                  c.drawImage(spectralBrazier, posX, posY, 32, 32);
                },
              });
            } else if (gameAssets.bonfire.complete && gameAssets.bonfire.naturalWidth > 0) {
              const fireFrame = Math.floor(time * 6) % 4;
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(gameAssets.bonfire, fireFrame * 32, 0, 32, 32, posX, posY, 32, 32);
                },
              });
            } else {
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(campfire, posX + 2, posY + 4, 28, 28);
                },
              });
            }
          } else if (tileType === 30) {
            // 🪑 Mesas de Taberna, Estantes en Botica, ⚰️ Sarcófagos en Cripta, o 🚣 Botes en Cueva
            if (currentZone.interiorType === 'crypt' || currentZone.id === 'subzone_crypt') {
              entities.push({
                ySort: posY + TILE_SIZE + 8,
                draw: (c) => {
                  c.drawImage(stoneSarcophagus, posX, posY - 16, 32, 48);
                },
              });
            } else if (currentZone.interiorType === 'smugglers_cave' || currentZone.id === 'subzone_smugglers_cave') {
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(dockRowboat, posX, posY, 32, 32);
                },
              });
            } else {
              const isBotica = currentZone.interiorType === 'botica' || currentZone.id === 'subzone_botica';
              const tableOrRack = isBotica ? getHerbDryingRackCanvas() : getTavernTableCanvas();
              entities.push({
                ySort: posY + TILE_SIZE,
                draw: (c) => {
                  c.drawImage(tableOrRack, posX, posY, 32, 32);
                },
              });
            }
          } else if (tileType === 26) {
            // ⚓ Gran Entrada a la Cueva de los Contrabandistas (2.5D HD)
            entities.push({
              ySort: posY + TILE_SIZE + 24,
              draw: (c) => {
                const cave = getCaveEntranceCanvas(time);
                c.drawImage(cave, 0, 0, 96, 128, posX - 32, posY - 76, 96, 128);
              },
            });
          } else if (tileType === 31) {
            // 🍷 Mostrador de Tabernero o Mostrador de Boticaria
            const isBotica = currentZone.interiorType === 'botica' || currentZone.id === 'subzone_botica';
            const counter = isBotica ? getApothecaryCounterCanvas(time) : getTavernBarCounterCanvas(time);
            entities.push({
              ySort: posY + TILE_SIZE,
              draw: (c) => {
                c.drawImage(counter, posX, posY, 32, 32);
              },
            });
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
            // 🌿 Gran Botica Alquímica de Lynda (Cute Fantasy 2.5D HD - 96x128 px)
            entities.push({
              ySort: posY + TILE_SIZE + 20,
              draw: (c) => {
                // Sombra de contacto
                c.fillStyle = 'rgba(15, 23, 42, 0.45)';
                c.beginPath();
                c.ellipse(posX + 16, posY + 24, 48, 8, 0, 0, Math.PI * 2);
                c.fill();

                const apothecaryHouse = getApothecaryCuteHouseCanvas(gameAssets.house, time);
                c.drawImage(apothecaryHouse, 0, 0, 96, 128, posX - 32, posY - 76, 96, 128);
              },
            });
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
            // 🏰 Gran Castillo Real de Aethelgard (X: 43, Y: 43 en zone_forest) o Gran Ayuntamiento
            if (currentZone.id === 'zone_forest' && x === 43 && y === 43) {
              const castleBuilding = getGrandCastleBuildingCanvas(time);
              entities.push({
                ySort: posY + TILE_SIZE + 24,
                draw: (c) => {
                  c.drawImage(castleBuilding, 0, 0, 160, 160, posX - 64, posY - 110, 160, 160);
                },
              });
            } else {
              const greatHall = getGreatHallCanvas();
              entities.push({
                ySort: posY + TILE_SIZE + 14,
                draw: (c) => {
                  c.drawImage(greatHall, posX - 24, posY - 24, 80, 64);
                },
              });
            }
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
                const cx = x * TILE_SIZE + 16;
                const cy = y * TILE_SIZE + 16;
                const r = radius + flicker;
                c.fillStyle = color;
                c.beginPath();
                c.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
                c.fill();
                c.beginPath();
                c.arc(cx, cy, r, 0, Math.PI * 2);
                c.fill();
              },
            });
          }
        });

        // 9. EDIFICIOS INTERACTIVOS Y PORTALES DE INSTANCIA (Puertas Nobles, Farolas Gemelas y Rótulos Dorados)
        currentZone.portals?.forEach((portal) => {
          if (portal.x >= startCol - 2 && portal.x <= endCol + 2 && portal.y >= startRow - 2 && portal.y <= endRow + 2) {
            const pX = portal.x * TILE_SIZE;
            const pY = portal.y * TILE_SIZE;
            const distToPlayer = Math.hypot(portal.x - playerPos.x, portal.y - playerPos.y);
            const isNear = distToPlayer <= 3.5;

            // 🏰 Entrada Monumental del Gran Castillo Real de Aethelgard (Fachada 160x160 px 2.5D)
            if (portal.targetZoneId.includes('castle') || portal.targetZoneId === 'subzone_castle') {
              const castleBuilding = getGrandCastleBuildingCanvas(time);
              entities.push({
                ySort: pY + TILE_SIZE + 6,
                draw: (c) => {
                  c.drawImage(castleBuilding, 0, 0, 160, 160, pX - 64, pY - 112, 160, 160);

                  if (isNear) {
                    const badgeY = pY - 118 + Math.sin(time * 2.5) * 1.5;
                    const badgeIcon = '👑 CASTILLO DE AETHELGARD';
                    c.font = 'bold 9px monospace';
                    const textW = c.measureText(badgeIcon).width;
                    c.fillStyle = 'rgba(15, 23, 42, 0.95)';
                    c.strokeStyle = '#3b82f6';
                    c.lineWidth = 1.5;
                    c.beginPath();
                    c.roundRect(pX + 16 - textW / 2 - 6, badgeY - 7, textW + 12, 14, 3);
                    c.fill();
                    c.stroke();

                    c.fillStyle = '#93c5fd';
                    c.textAlign = 'center';
                    c.textBaseline = 'middle';
                    c.fillText(badgeIcon, pX + 16, badgeY);
                  }
                },
              });
              return;
            }

            if (!portal.isDoor) {
              // ⛰️ PASO DE FRONTERA MONUMENTAL / CALZADA NATURAL ABIERTA (Sin puertas de casa)
              entities.push({
                ySort: pY + TILE_SIZE + 10,
                draw: (c) => {
                  // Calzada adoquinada ancha de frontera
                  c.fillStyle = '#1e293b';
                  c.fillRect(pX - 8, pY + 10, 48, 20);
                  c.fillStyle = '#334155';
                  c.fillRect(pX - 6, pY + 12, 44, 16);
                  c.fillStyle = '#475569';
                  c.fillRect(pX - 4, pY + 14, 40, 12);

                  // Pilares de piedra ciclópea a ambos lados del camino
                  c.fillStyle = '#0f172a';
                  c.fillRect(pX - 10, pY - 16, 8, 32);
                  c.fillRect(pX + 34, pY - 16, 8, 32);
                  c.fillStyle = '#475569';
                  c.fillRect(pX - 8, pY - 14, 4, 28);
                  c.fillRect(pX + 36, pY - 14, 4, 28);

                  // Dintel arqueado superior
                  c.fillStyle = '#0f172a';
                  c.fillRect(pX - 10, pY - 18, 52, 6);
                  c.fillStyle = '#38bdf8';
                  c.fillRect(pX - 6, pY - 16, 44, 2);

                  // Braseros mágicos ardientes sobre los pilares
                  const flameOffset = Math.sin(time * 6) * 1.5;
                  c.fillStyle = '#ea580c';
                  c.fillRect(pX - 10, pY - 22 + flameOffset, 8, 6);
                  c.fillRect(pX + 34, pY - 22 + flameOffset, 8, 6);
                  c.fillStyle = '#fde047';
                  c.fillRect(pX - 8, pY - 20 + flameOffset, 4, 3);
                  c.fillRect(pX + 36, pY - 20 + flameOffset, 4, 3);

                  // Rótulo rúnico flotante sobre el arco
                  const badgeY = pY - 28 + Math.sin(time * 2) * 2;
                  let badgeText = portal.label;
                  let strokeCol = '#38bdf8';
                  let textCol = '#e0f2fe';

                  if (portal.targetZoneId === 'zone_cave') {
                    badgeText = '⛰️ MINAS Y CAÑÓN DE ERIDU (Nv. 15)';
                    strokeCol = '#38bdf8'; textCol = '#e0f2fe';
                  } else if (portal.targetZoneId.includes('crypt')) {
                    badgeText = '🪦 CRIPTA Y MONASTERIO (Nv. 30)';
                    strokeCol = '#a855f7'; textCol = '#f3e8ff';
                  } else if (portal.targetZoneId.includes('swamp')) {
                    badgeText = '🌫️ PANTANO SOMBRÍO DE VAEL (Nv. 45)';
                    strokeCol = '#10b981'; textCol = '#d1fae5';
                  } else if (portal.targetZoneId.includes('smuggler')) {
                    badgeText = '🌊 COSTA Y CALETA DE CONTRABANDISTAS (Nv. 65)';
                    strokeCol = '#0284c7'; textCol = '#e0f2fe';
                  } else if (portal.targetZoneId.includes('volcano')) {
                    badgeText = '🌋 VOLCÁN IGNIS [ENDGAME] (Nv. 80)';
                    strokeCol = '#ef4444'; textCol = '#fee2e2';
                  } else if (portal.targetZoneId.includes('forest')) {
                    badgeText = '🔙 RETORNO A AETHELGARD (Nv. 1-15)';
                    strokeCol = '#f59e0b'; textCol = '#fef08a';
                  }

                  c.font = 'bold 9px monospace';
                  const textW = c.measureText(badgeText).width;
                  c.fillStyle = 'rgba(15, 23, 42, 0.94)';
                  c.strokeStyle = strokeCol;
                  c.lineWidth = 1.5;
                  c.beginPath();
                  c.roundRect(pX + 16 - textW / 2 - 6, badgeY - 7, textW + 12, 14, 3);
                  c.fill();
                  c.stroke();

                  c.fillStyle = textCol;
                  c.textAlign = 'center';
                  c.textBaseline = 'middle';
                  c.fillText(badgeText, pX + 16, badgeY);

                  if (isNear) {
                    // Partículas de portal
                    const sparkX = pX + 16 + Math.sin(time * 4) * 14;
                    c.fillStyle = strokeCol;
                    c.fillRect(sparkX, pY + 16, 3, 3);
                  }
                },
              });
              return;
            }

            // 🚪 PUERTA DE EDIFICIO INTERIOR (Taberna, Forja, Botica)
            entities.push({
              ySort: pY + TILE_SIZE + 8,
              draw: (c) => {
                // Felpudo / Umbral de entrada con latón brillante
                c.fillStyle = '#451a03';
                c.fillRect(pX + 2, pY + 16, 28, 14);
                c.fillStyle = '#b45309';
                c.fillRect(pX + 4, pY + 18, 24, 10);
                c.fillStyle = '#fbbf24';
                c.fillRect(pX + 6, pY + 20, 20, 6);

                // Marco de portal arqueado de madera noble y forja
                c.fillStyle = '#1c1917';
                c.fillRect(pX + 4, pY - 8, 24, 26);
                const interiorGlow = Math.sin(time * 3) * 0.15 + 0.85;
                c.fillStyle = `rgba(251, 191, 36, ${interiorGlow})`;
                c.fillRect(pX + 7, pY - 5, 18, 22);

                // Puerta de roble entreabierta
                c.fillStyle = '#78350f';
                c.fillRect(pX + 8, pY - 4, 7, 20);
                c.fillStyle = '#d97706';
                c.fillRect(pX + 13, pY + 5, 2, 2); // Pomo dorado

                // Farolas gemelas de forja en los laterales
                c.fillStyle = '#451a03';
                c.fillRect(pX + 1, pY - 4, 3, 8);
                c.fillRect(pX + 28, pY - 4, 3, 8);
                c.fillStyle = '#fef08a';
                c.fillRect(pX + 1, pY - 7, 4, 4);
                c.fillRect(pX + 27, pY - 7, 4, 4);

                // Halo de luz dorada en el suelo
                c.fillStyle = 'rgba(251, 191, 36, 0.22)';
                c.beginPath();
                c.arc(pX + 16, pY + 10, 32, 0, Math.PI * 2);
                c.fill();

                // Rótulo colgante flotante sobre la puerta
                const badgeY = pY - 24 + Math.sin(time * 2.5) * 1.5;
                let badgeIcon = '🚪 ENTRADA';
                if (portal.targetZoneId.includes('tavern')) badgeIcon = '🍺 TABERNA';
                else if (portal.targetZoneId.includes('forge')) badgeIcon = '🔨 GRAN FORJA';
                else if (portal.targetZoneId.includes('botica')) badgeIcon = '🌿 BOTICA';
                else if (portal.targetZoneId.includes('eridu')) badgeIcon = '⛏️ PROFUNDIDADES DE ERIDU (Nv.6-10)';
                else if (portal.targetZoneId.includes('swamp_crypt')) badgeIcon = '🌫️ CRIPTA SUMERGIDA (Nv.15-20)';
                else if (portal.targetZoneId.includes('smugglers_grotto') || portal.targetZoneId.includes('grotto')) badgeIcon = '🌊 GRUTA PIRATA (Nv.20-25)';
                else if (portal.targetZoneId.includes('volcano_caldera') || portal.targetZoneId.includes('caldera')) badgeIcon = '🌋 CORAZÓN DE LA CALDERA (Nv.25-30)';
                else if (portal.targetZoneId.includes('crypt_dungeon') || portal.targetZoneId.includes('catacomb')) badgeIcon = '🪦 CATACUMBAS (Nv.10-15)';

                c.font = 'bold 9px monospace';
                const textW = c.measureText(badgeIcon).width;
                c.fillStyle = 'rgba(15, 23, 42, 0.92)';
                c.strokeStyle = '#f59e0b';
                c.lineWidth = 1.5;
                c.beginPath();
                c.roundRect(pX + 16 - textW / 2 - 6, badgeY - 7, textW + 12, 14, 3);
                c.fill();
                c.stroke();

                c.fillStyle = '#fef08a';
                c.textAlign = 'center';
                c.textBaseline = 'middle';
                c.fillText(badgeIcon, pX + 16, badgeY);

                if (isNear) {
                  const sparkX = pX + 16 + Math.sin(time * 5) * 8;
                  c.fillStyle = '#ffffff';
                  c.fillRect(sparkX, pY + 18, 2, 2);
                }
              },
            });
          }
        });
      }

      // 👑 DECORACIONES PALACIEGAS DEL GRAN SALÓN DEL TRONO (subzone_castle)
      if (currentZone.id === 'subzone_castle' || currentZone.interiorType === 'castle') {
        // A. Vitrales Góticos en la Pared Norte (Y: 1, X: 4, 8, 15, 19)
        const stainedGlassCols = [4, 8, 15, 19];
        stainedGlassCols.forEach((gx) => {
          if (gx >= startCol - 2 && gx <= endCol + 2) {
            const sgCanvas = getRoyalStainedGlassCanvas(time);
            entities.push({
              ySort: 1 * TILE_SIZE + TILE_SIZE - 4,
              draw: (c) => {
                c.drawImage(sgCanvas, gx * TILE_SIZE, 1 * TILE_SIZE - 16, 32, 48);
              },
            });
          }
        });

        // B. Mesa de Consejo Real y Mapa de Guerra (X: 6, Y: 12)
        if (6 >= startCol - 2 && 6 <= endCol + 2 && 12 >= startRow - 2 && 12 <= endRow + 2) {
          const councilTable = getRoyalCouncilTableCanvas();
          entities.push({
            ySort: 12 * TILE_SIZE + TILE_SIZE + 4,
            draw: (c) => {
              c.drawImage(councilTable, 6 * TILE_SIZE - 16, 12 * TILE_SIZE - 8, 64, 32);
            },
          });
        }

        // C. Estandartes Reales Azules y Dorados en las Paredes Laterales
        const wallBanners = [
          { x: 1, y: 5 }, { x: 1, y: 11 }, { x: 1, y: 17 },
          { x: 22, y: 5 }, { x: 22, y: 11 }, { x: 22, y: 17 }
        ];
        wallBanners.forEach(({ x, y }) => {
          if (x >= startCol - 2 && x <= endCol + 2 && y >= startRow - 2 && y <= endRow + 2) {
            entities.push({
              ySort: y * TILE_SIZE + TILE_SIZE,
              draw: (c) => {
                c.fillStyle = '#fbbf24';
                c.fillRect(x * TILE_SIZE + 10, y * TILE_SIZE, 12, 2);
                c.fillStyle = '#1d4ed8';
                c.fillRect(x * TILE_SIZE + 11, y * TILE_SIZE + 2, 10, 20);
                c.fillStyle = '#f59e0b';
                c.fillRect(x * TILE_SIZE + 15, y * TILE_SIZE + 6, 2, 12);
                c.fillRect(x * TILE_SIZE + 13, y * TILE_SIZE + 9, 6, 2);
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

      // 🌿 POSTES DE SEÑALIZACIÓN Y RUTAS DE NIVELES EN LAS SALIDAS DE LA ALDEA (zone_forest)
      if (currentZone.id === 'zone_forest') {
        const signposts = [
          { x: 49, y: 60, title: '➡️ PRADOS DEL ESTE', sub: 'Slimes y Farmeo (Nv. 1-3)', col: '#4ade80' },
          { x: 36, y: 73, title: '⬇️ SENDA DEL SUR', sub: 'Lobos y Caza (Nv. 4-7)', col: '#facc15' },
          { x: 23, y: 60, title: '⬅️ PASO DEL OESTE', sub: 'Bandidos y Peligro (Nv. 8-12)', col: '#fb923c' },
          { x: 36, y: 44, title: '⬆️ CAÑÓN DEL NORTE', sub: 'Altar del Rey Slime (Nv. 12-15)', col: '#f87171' },
        ];

        signposts.forEach((sign) => {
          if (sign.x >= startCol - 2 && sign.x <= endCol + 2 && sign.y >= startRow - 2 && sign.y <= endRow + 2) {
            const sX = sign.x * TILE_SIZE;
            const sY = sign.y * TILE_SIZE;
            const dist = Math.hypot(currentPosRef.current.x - sign.x, currentPosRef.current.y - sign.y);

            entities.push({
              ySort: sY + TILE_SIZE,
              draw: (c) => {
                // Sombra del poste
                c.fillStyle = 'rgba(0, 0, 0, 0.35)';
                c.beginPath();
                c.ellipse(sX + 16, sY + 28, 8, 4, 0, 0, Math.PI * 2);
                c.fill();

                // Poste de madera de roble
                c.fillStyle = '#451a03';
                c.fillRect(sX + 13, sY + 10, 6, 20);
                c.fillStyle = '#78350f';
                c.fillRect(sX + 14, sY + 11, 4, 18);

                // Tablón indicador de madera
                c.fillStyle = '#78350f';
                c.fillRect(sX + 4, sY - 2, 24, 13);
                c.fillStyle = '#b45309';
                c.fillRect(sX + 6, sY, 20, 9);
                c.fillStyle = '#451a03';
                c.fillRect(sX + 8, sY + 2, 16, 2);
                c.fillRect(sX + 8, sY + 6, 16, 2);

                // Rótulo legible flotante cuando el héroe está cerca
                const isNear = dist < 7.0;
                c.font = 'bold 8.5px monospace';
                const textW = c.measureText(sign.title).width;
                const badgeY = sY - 14 + (isNear ? Math.sin(time * 2) * 1.5 : 0);

                c.fillStyle = 'rgba(15, 23, 42, 0.88)';
                c.strokeStyle = sign.col;
                c.lineWidth = 1.2;
                c.beginPath();
                c.roundRect(sX + 16 - textW / 2 - 5, badgeY - 7, textW + 10, 14, 3);
                c.fill();
                c.stroke();

                c.fillStyle = sign.col;
                c.textAlign = 'center';
                c.textBaseline = 'middle';
                c.fillText(sign.title, sX + 16, badgeY);

                if (isNear) {
                  c.font = 'bold 7.5px monospace';
                  const subW = c.measureText(sign.sub).width;
                  c.fillStyle = 'rgba(15, 23, 42, 0.95)';
                  c.strokeStyle = '#64748b';
                  c.lineWidth = 1;
                  c.beginPath();
                  c.roundRect(sX + 16 - subW / 2 - 4, badgeY + 12 - 5, subW + 8, 12, 2);
                  c.fill();
                  c.stroke();

                  c.fillStyle = '#f8fafc';
                  c.fillText(sign.sub, sX + 16, badgeY + 12);
                }
              },
            });
          }
        });
      }

      // 3. Cofres del tesoro registrados en currentZone.chests (si no están ya en tileData)
      if (currentZone.chests) {
        currentZone.chests.forEach((chest) => {
          if (chest.x >= startCol - 2 && chest.x <= endCol + 2 && chest.y >= startRow - 2 && chest.y <= endRow + 2) {
            if (currentZone.tileData[chest.y]?.[chest.x] !== 7) {
              const isOpen = openedChestsRef.current.includes(chest.id);
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
          }
        });
      }

      // 4. NPCs fijos con marcadores de misión flotantes
      if (currentZone.npcs) {
        currentZone.npcs.forEach((npc) => {
          if (npc.x >= startCol - 2 && npc.x <= endCol + 2 && npc.y >= startRow - 2 && npc.y <= endRow + 2) {
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
          }
        });
      }

      // Posición pixel del jugador para cálculos de proximidad y render
      const pX = Math.round(currentPosRef.current.x * TILE_SIZE);
      const pY = Math.round(currentPosRef.current.y * TILE_SIZE);

      // 4. MONSTRUOS 2.5D EN EL MAPA (IA de patrulla, persecución y combate)
      let nearestBoss: OverworldEnemy | null = null;
      let minBossDist = Infinity;

      enemyEntities.forEach((ent) => {
        if (ent.enemy.hp <= 0) {
          // ⏱️ Respawn dinámico y rápido de 25 segundos para farmeo fluido de enemigos comunes
          if (!ent.enemy.isBoss && ent.deathTime && (nowMs - ent.deathTime >= 25000)) {
            ent.enemy.hp = ent.enemy.maxHp;
            ent.enemy.state = 'patrol';
            ent.enemy.worldX = ent.enemy.spawnX;
            ent.enemy.worldZ = ent.enemy.spawnY;
            ent.deathTime = 0;
            ent.hitFlashTime = 0;
            spawnDamageNumber('✨ Reaparición', ent.enemy.worldX * TILE_SIZE + 16, ent.enemy.worldZ * TILE_SIZE, '#c084fc', false);
          }
          return;
        }

        const distToHero = Math.hypot(
          ent.enemy.worldX - currentPosRef.current.x,
          ent.enemy.worldZ - currentPosRef.current.y
        );

        if (ent.enemy.isBoss && distToHero < 14) {
          if (distToHero < minBossDist) {
            minBossDist = distToHero;
            nearestBoss = ent.enemy;
          }
        }

        // IA: Persecución vs Patrulla con verificación de colisión de paredes
        if (distToHero <= ent.enemy.aggroRadius) {
          ent.enemy.state = 'chase';
          const dx = currentPosRef.current.x - ent.enemy.worldX;
          const dy = currentPosRef.current.y - ent.enemy.worldZ;

          if (distToHero > ent.enemy.attackRange) {
            // Caminar hacia el jugador comprobando que la casilla sea transitable
            const moveSpeed = (1.2 + ent.enemy.level * 0.02) * delta;
            const nextX = ent.enemy.worldX + (dx / distToHero) * moveSpeed;
            const nextY = ent.enemy.worldZ + (dy / distToHero) * moveSpeed;

            const tX = Math.round(nextX);
            const tY = Math.round(nextY);
            if (currentZone.tileData[tY]?.[tX] === 0) {
              ent.enemy.worldX = nextX;
              ent.enemy.worldZ = nextY;
            }
          } else {
            // Atacar al jugador
            if (nowMs - ent.enemy.lastAttackTime > ent.enemy.attackCooldown * 1000) {
              ent.enemy.lastAttackTime = nowMs;
              const pLevel = playerRef.current.level || 1;
              const levelAdvantage = Math.max(0, ent.enemy.level - pLevel);
              const enemyBonus = 1 + levelAdvantage * 0.18;
              const pDef = Math.max(0, (playerRef.current.defense || 5) * (1 - Math.min(0.6, levelAdvantage * 0.10)));
              const enemyDmg = Math.max(2, Math.round((ent.enemy.attack * 1.35 - pDef * 0.45) * enemyBonus));

              onPlayerDamaged?.(enemyDmg);
              spawnHitSparks(pX + 16, pY + 16, '#ef4444', 7);
              spawnDamageNumber(levelAdvantage >= 4 ? `¡CRÍTICO! -${enemyDmg}` : `-${enemyDmg}`, pX + 16, pY, '#ef4444', levelAdvantage >= 3);
              soundEngine.playSfx('hit');
            }
          }
        } else {
          // Patrulla lenta dentro de su habitación
          ent.enemy.state = 'patrol';
          const wanderAng = time * 0.5 + ent.enemy.x;
          const nextPatrolX = ent.enemy.spawnX + Math.cos(wanderAng) * (ent.enemy.patrolRadius * 0.6);
          const nextPatrolY = ent.enemy.spawnY + Math.sin(wanderAng) * (ent.enemy.patrolRadius * 0.6);

          const tX = Math.round(nextPatrolX);
          const tY = Math.round(nextPatrolY);
          if (currentZone.tileData[tY]?.[tX] === 0) {
            ent.enemy.worldX = nextPatrolX;
            ent.enemy.worldZ = nextPatrolY;
          }
        }

        // Renderizado 2.5D del Monstruo
        const ePxX = Math.round(ent.enemy.worldX * TILE_SIZE);
        const ePxY = Math.round(ent.enemy.worldZ * TILE_SIZE);
        const isHit = nowMs - ent.hitFlashTime < 140;
        const bounce = Math.abs(Math.sin(time * 8 + ent.enemy.x)) * 2;
        const spriteSize = ent.enemy.isBoss ? TILE_SIZE * 2 : TILE_SIZE;

        entities.push({
          ySort: ePxY + spriteSize,
          draw: (c) => {
            // Sombra ovalada en el suelo
            c.fillStyle = 'rgba(0,0,0,0.35)';
            c.beginPath();
            c.ellipse(ePxX + spriteSize / 2, ePxY + spriteSize - 2, spriteSize / 2.8, spriteSize / 5, 0, 0, Math.PI * 2);
            c.fill();

            // Sprite del monstruo con parpadeo blanco/rojo si recibe golpe
            if (isHit) {
              c.filter = 'brightness(2.0) saturate(0.5)';
            }
            c.drawImage(ent.sprite, ePxX, ePxY - bounce, spriteSize, spriteSize);
            c.filter = 'none';

            // Barra de vida superior
            const barW = spriteSize;
            const hpPct = Math.max(0, ent.enemy.hp / ent.enemy.maxHp);
            c.fillStyle = '#0f172a';
            c.fillRect(ePxX, ePxY - 8 - bounce, barW, 4);

            const pLevel = playerRef.current.level || 1;
            const lvlDiff = ent.enemy.level - pLevel;
            c.fillStyle = lvlDiff >= 3 ? '#ef4444' : (hpPct > 0.4 ? '#22c55e' : '#ef4444');
            c.fillRect(ePxX, ePxY - 8 - bounce, barW * hpPct, 4);

            // Indicador de Nivel y Amenaza
            c.font = 'bold 9px monospace';
            if (lvlDiff >= 3) {
              c.fillStyle = '#ef4444';
              c.fillText(`💀 Nv.${ent.enemy.level} [PELIGRO]`, ePxX - 12, ePxY - 10 - bounce);
            } else if (lvlDiff >= 1) {
              c.fillStyle = '#facc15';
              c.fillText(`Nv.${ent.enemy.level}`, ePxX, ePxY - 10 - bounce);
            } else {
              c.fillStyle = '#4ade80';
              c.fillText(`Nv.${ent.enemy.level}`, ePxX, ePxY - 10 - bounce);
            }
          },
        });
      });

      const currentBossId = nearestBoss ? (nearestBoss.id || nearestBoss.name) : null;
      if (currentBossId !== lastBossIdRef.current) {
        lastBossIdRef.current = currentBossId;
        onBossStateChange?.(nearestBoss);
      }

      // 5. BOTÍN MAGNÉTICO EN EL SUELO (Monedas, EXP, Pociones)
      for (let dIdx = groundDropEntities.length - 1; dIdx >= 0; dIdx--) {
        const drop = groundDropEntities[dIdx];
        const dDist = Math.hypot(drop.x - (pX + 16), drop.z - (pY + 16));

        if (dDist < 90) {
          // Atracción magnética hacia el héroe
          const pullSpeed = 180 * delta;
          drop.x += ((pX + 16 - drop.x) / dDist) * pullSpeed;
          drop.z += ((pY + 16 - drop.z) / dDist) * pullSpeed;

          if (dDist < 16) {
            // Recoger botín
            soundEngine.playSfx(drop.type === 'gold' ? 'gold' : 'pickup');
            const dType = drop.type;
            const dAmt = drop.amount;
            const dItem = drop.itemId;
            setTimeout(() => {
              onLootCollected?.(dType, dAmt, dItem);
            }, 0);
            spawnDamageNumber(
              drop.type === 'gold' ? `+${drop.amount} Oro` : drop.type === 'exp' ? `+${drop.amount} EXP` : '+30 HP',
              pX + 16,
              pY - 10,
              drop.color,
              true
            );
            groundDropEntities.splice(dIdx, 1);
            continue;
          }
        }

        const dropBounce = Math.sin(time * 6 + dIdx) * 3;
        entities.push({
          ySort: drop.z + 8,
          draw: (c) => {
            c.fillStyle = drop.color;
            c.beginPath();
            c.arc(drop.x, drop.z + dropBounce, drop.type === 'gold' ? 5 : 6, 0, Math.PI * 2);
            c.fill();
            c.strokeStyle = '#ffffff';
            c.lineWidth = 1;
            c.stroke();
          },
        });
      }

      // 6. Jugador
      let animState: AnimationState = 'idle';
      if (moving) {
        const stepFrame = Math.floor(time * 10) % 2;
        animState = stepFrame === 0 ? 'walk1' : 'walk2';
      }

      const playerSprite = getHeroSpriteCanvas(playerRef.current.heroClass, playerRef.current.gender, directionRef.current, animState);

      entities.push({
        ySort: pY + TILE_SIZE,
        draw: (c) => {
          c.drawImage(playerSprite, pX, pY, TILE_SIZE, TILE_SIZE);
        },
      });

      // Ordenar por Y para que lo que esté más abajo se dibuje encima
      entities.sort((a, b) => (Number.isFinite(a.ySort) ? a.ySort : 0) - (Number.isFinite(b.ySort) ? b.ySort : 0));
      entities.forEach((e) => {
        try {
          e.draw(ctx);
        } catch (err) {
          // Keep other entities rendering even if one fails
        }
      });

      // 7. PROYECTILES 2.5D (Flechas de Arquero, Bolas de Fuego de Mago, Magias)
      for (let pIdx = projectileEntities.length - 1; pIdx >= 0; pIdx--) {
        const proj = projectileEntities[pIdx];
        const pMove = proj.speed * delta;
        proj.x += proj.dirX * pMove;
        proj.z += proj.dirZ * pMove;
        proj.traveledDistance += pMove;

        // A. 🏹 Flecha Realista de Arquero con Punta de Acero y Plumas
        if (proj.vfxType === 'arrow') {
          ctx.save();
          ctx.translate(proj.x, proj.z);
          const angle = Math.atan2(proj.dirZ, proj.dirX);
          ctx.rotate(angle);

          // Sombra proyectada de la flecha
          ctx.fillStyle = 'rgba(0,0,0,0.25)';
          ctx.fillRect(-10, 4, 16, 1.5);

          // Astil de madera de fresno
          ctx.fillStyle = '#92400e';
          ctx.fillRect(-10, -1, 16, 2);

          // Punta de flecha triangular de hierro afilado
          ctx.fillStyle = '#f1f5f9';
          ctx.beginPath();
          ctx.moveTo(8, 0);
          ctx.lineTo(2, -3);
          ctx.lineTo(2, 3);
          ctx.closePath();
          ctx.fill();

          // Revestimiento de punta de acero
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(2, -1.5, 2, 3);

          // Plumas de cola blancas
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-10, -3.5, 4, 2);
          ctx.fillRect(-10, 1.5, 4, 2);
          ctx.restore();
        }
        // B. 🪄 Bola de Fuego del Mago con Núcleo Brillante y Chispas
        else if (proj.vfxType === 'fireball') {
          ctx.save();
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(proj.x, proj.z, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(proj.x, proj.z, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(proj.x, proj.z, 5, 0, Math.PI * 2);
          ctx.fill();

          // Núcleo blanco incandescente
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(proj.x, proj.z, 3, 0, Math.PI * 2);
          ctx.fill();

          // Partículas de combustión tras la bola
          const trailX = proj.x - proj.dirX * 8 + (Math.random() - 0.5) * 4;
          const trailY = proj.z - proj.dirZ * 8 + (Math.random() - 0.5) * 4;
          ctx.fillStyle = '#fde047';
          ctx.fillRect(trailX, trailY, 3, 3);
          ctx.restore();
        }
        // C. 🌀 Magias y Orbes Arcanos
        else {
          ctx.save();
          ctx.fillStyle = proj.color;
          ctx.beginPath();
          ctx.arc(proj.x, proj.z, 9, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(proj.x, proj.z, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        let hit = false;
        // Colisión con enemigos y Jefes
        for (let eIdx = 0; eIdx < enemyEntities.length; eIdx++) {
          const ent = enemyEntities[eIdx];
          if (ent.enemy.hp <= 0) continue;
          const eCenterOffset = ent.enemy.isBoss ? 32 : 16;
          const eCenterPxX = ent.enemy.worldX * TILE_SIZE + eCenterOffset;
          const eCenterPxY = ent.enemy.worldZ * TILE_SIZE + eCenterOffset;
          const pDist = Math.hypot(eCenterPxX - proj.x, eCenterPxY - proj.z);
          const hitRadius = ent.enemy.isBoss ? 38 : 22;

          if (pDist < hitRadius) {
            hit = true;
            const pLevel = playerRef.current.level || 1;
            const levelDiff = ent.enemy.level - pLevel;
            let levelMult = 1.0;
            if (levelDiff >= 6) levelMult = 0.08;
            else if (levelDiff === 5) levelMult = 0.20;
            else if (levelDiff === 4) levelMult = 0.40;
            else if (levelDiff === 3) levelMult = 0.65;
            else if (levelDiff === 2) levelMult = 0.85;

            const defFactor = Math.floor(ent.enemy.defense * 0.45);
            const actualDmg = Math.max(1, Math.round((proj.damage - defFactor) * levelMult));

            ent.enemy.hp -= actualDmg;
            ent.hitFlashTime = nowMs;
            ent.enemy.state = 'chase';
            spawnHitSparks(eCenterPxX, eCenterPxY, proj.vfxType === 'arrow' ? '#f59e0b' : '#ef4444', 9);
            spawnDamageNumber(levelDiff >= 5 && actualDmg <= 3 ? `¡ROZADO! -${actualDmg}` : `-${actualDmg}`, eCenterPxX, eCenterPxY - 14, proj.vfxType === 'arrow' ? '#f59e0b' : '#f97316', true);
            soundEngine.playSfx('hit');

            if (ent.enemy.hp <= 0) {
              handleEnemyDefeat(ent);
            }
            break;
          }
        }

        if (hit || proj.traveledDistance >= proj.maxDistance) {
          projectileEntities.splice(pIdx, 1);
        }
      }

      // 8. EFECTOS DE ESPADAZOS Y CORTES VISTOSOS (280ms duration)
      for (let sIdx = slashEntities.length - 1; sIdx >= 0; sIdx--) {
        const sl = slashEntities[sIdx];
        const age = nowMs - sl.createdAt;
        if (age > 280) {
          slashEntities.splice(sIdx, 1);
          continue;
        }
        const progress = age / 280;
        ctx.save();
        ctx.translate(sl.x, sl.y);

        if (sl.dir === 'dagger1') {
          // 🗡️ Corte Diagonal 1 de Daga (Pícaro)
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 6 * (1 - progress);
          ctx.beginPath();
          ctx.moveTo(-22, -22);
          ctx.lineTo(22, 22);
          ctx.stroke();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5 * (1 - progress);
          ctx.stroke();
        } else if (sl.dir === 'dagger2') {
          // 🗡️ Corte Diagonal 2 de Daga (Pícaro)
          ctx.strokeStyle = '#e879f9';
          ctx.lineWidth = 6 * (1 - progress);
          ctx.beginPath();
          ctx.moveTo(22, -22);
          ctx.lineTo(-22, 22);
          ctx.stroke();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5 * (1 - progress);
          ctx.stroke();
        } else if (sl.dir === 'spin') {
          // 🌀 Torbellino 360° (Habilidad de área)
          const spinRadius = 26 + progress * 20;
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.95 * (1 - progress)})`;
          ctx.lineWidth = 7 * (1 - progress);
          ctx.beginPath();
          ctx.arc(0, 0, spinRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3 * (1 - progress);
          ctx.stroke();
        } else {
          // ⚔️ Tajo de Espada de Acero Animado con Hoja Visible y Estela de Corte Luminosa
          let baseAngle = 0;
          if (sl.dir === 'up') baseAngle = -Math.PI / 2;
          else if (sl.dir === 'down') baseAngle = Math.PI / 2;
          else if (sl.dir === 'left') baseAngle = Math.PI;
          else if (sl.dir === 'right') baseAngle = 0;

          ctx.rotate(baseAngle);

          // 1. Estela de corte en media luna expansiva
          const arcRadius = 26 + progress * 14;
          const arcSpread = Math.PI * 0.85;
          ctx.strokeStyle = `rgba(254, 240, 138, ${0.95 * (1 - progress)})`;
          ctx.lineWidth = 8 * (1 - progress);
          ctx.beginPath();
          ctx.arc(0, 0, arcRadius, -arcSpread / 2, arcSpread / 2);
          ctx.stroke();

          // Filo de luz cortante blanco
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - progress})`;
          ctx.lineWidth = 4 * (1 - progress);
          ctx.beginPath();
          ctx.arc(0, 0, arcRadius + 1, -arcSpread / 2.2, arcSpread / 2.2);
          ctx.stroke();

          // 2. Hoja de la Espada de Acero girando físicamente en el arco de corte
          const currentSwing = (-arcSpread / 2) + (progress * arcSpread);
          ctx.save();
          ctx.rotate(currentSwing);

          // Empuñadura dorada
          ctx.fillStyle = '#78350f';
          ctx.fillRect(4, -2, 6, 4);
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(9, -5, 3, 10);

          // Hoja de acero brillante
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(12, -2.5, 22, 5);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(13, -1, 20, 2);
          // Punta de la espada
          ctx.beginPath();
          ctx.moveTo(34, -2.5);
          ctx.lineTo(39, 0);
          ctx.lineTo(34, 2.5);
          ctx.closePath();
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.restore();

          // 3. Chispas y ráfagas de corte
          const sparkA1 = currentSwing - 0.25;
          const sparkA2 = currentSwing + 0.25;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(arcRadius * Math.cos(sparkA1), arcRadius * Math.sin(sparkA1), 3.5, 3.5);
          ctx.fillRect(arcRadius * Math.cos(sparkA2), arcRadius * Math.sin(sparkA2), 3.5, 3.5);
          ctx.fillStyle = '#facc15';
          ctx.fillRect((arcRadius + 4) * Math.cos(currentSwing), (arcRadius + 4) * Math.sin(currentSwing), 4.5, 4.5);
        }
        ctx.restore();
      }

      // 8.5 CHISPAS DE IMPACTO EXPANSIVAS (Hit Sparks)
      for (let hsIdx = hitSparkEntities.length - 1; hsIdx >= 0; hsIdx--) {
        const hs = hitSparkEntities[hsIdx];
        const age = nowMs - hs.createdAt;
        if (age > 240) {
          hitSparkEntities.splice(hsIdx, 1);
          continue;
        }
        const progress = age / 240;
        const currentX = hs.x + hs.vx * (age / 1000);
        const currentY = hs.y + hs.vy * (age / 1000);
        const alpha = 1.0 - progress;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = hs.color;
        ctx.beginPath();
        ctx.arc(currentX, currentY, hs.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(currentX - 1, currentY - 1, 2, 2);
        ctx.restore();
      }

      // 9. NÚMEROS DE DAÑO FLOTANTES
      for (let nIdx = damageNumberEntities.length - 1; nIdx >= 0; nIdx--) {
        const num = damageNumberEntities[nIdx];
        const age = nowMs - num.createdAt;
        if (age > 850) {
          damageNumberEntities.splice(nIdx, 1);
        } else {
          const floatY = num.y - (age / 850) * 22;
          const alpha = 1.0 - age / 850;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.font = num.isCrit ? 'bold 15px monospace' : 'bold 12px monospace';
          ctx.fillStyle = '#000000';
          ctx.fillText(num.text, num.x + 1, floatY + 1);
          ctx.fillStyle = num.color;
          ctx.fillText(num.text, num.x, floatY);
          ctx.restore();
        }
      }

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
      } catch (err) {
        console.error('Frame error in render loop:', err);
      } finally {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleOrientationOrResize);
      window.removeEventListener('orientationchange', handleOrientationOrResize);
    };
  }, [currentZone.id]);

  return (
    <div className="relative w-full h-full min-h-0 bg-slate-950 overflow-hidden flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};
