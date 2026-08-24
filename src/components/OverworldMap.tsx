import React, { useEffect, useState, useCallback } from 'react';
import { PlayerStats, Zone, Inventory, NPC } from '../types';
import { ZONES, areZoneMainQuestsCompleted, ALL_GAME_QUESTS, isZoneUnlocked, getZoneRequirementMessage, GAME_ACHIEVEMENTS, getAchievementProgress, getQuestRewardEquipment } from '../data/gameData';
import { PixelCanvas } from './PixelCanvas';
import { PixelMapCanvas } from './PixelMapCanvas';
import { ThreeMapCanvas } from './ThreeMapCanvas';
import { NPCDialogModal } from './NPCDialogModal';
import { Minimap } from './Minimap';
import { QuestLogModal } from './QuestLogModal';
import { ChestLootModal, ChestLoot } from './ChestLootModal';
import { TopResourceBar } from './TopResourceBar';
import { BottomActionBar } from './BottomActionBar';
import { ForgeModal } from './ForgeModal';
import { soundEngine } from '../utils/soundEngine';
import { useGamepadControls, ControllerAction } from '../utils/gamepadManager';
import { EquipmentItem } from '../types';
import {
  ShoppingBag,
  HeartPulse,
  Award,
  Volume2,
  VolumeX,
  Compass,
  Package,
  Shield,
  Sparkles,
  Gamepad,
  Save,
  Trophy,
  Scroll,
  BookOpen
} from 'lucide-react';

interface OverworldMapProps {
  player: PlayerStats;
  inventory: Inventory;
  currentZone: Zone;
  playerPos: { x: number; y: number };
  defeatedBosses: string[];
  openedChests: string[];
  completedQuests: string[];
  acceptedQuests?: string[];
  defeatedEnemyCounts?: Record<string, number>;
  unlockedLoreIds?: string[];
  unlockedAchievements?: string[];
  claimedAchievements?: string[];
  onMove: (newPos: { x: number; y: number }) => void;
  onStartBattle: (isBoss: boolean) => void;
  onOpenShop: () => void;
  onOpenInventory: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  onOpenLoreCodex: () => void;
  onOpenAchievements: () => void;
  onHealAtInn: () => void;
  onOpenChest: (chestId: string) => ChestLoot | null;
  onAcceptQuest?: (questId: string) => void;
  onClaimQuestReward: (questId: string, gold: number, exp: number) => void;
  onChangeZone: (zoneId: string) => void;
  onAutoSave: () => void;
  onEquipItem?: (item: EquipmentItem) => void;
  onUseConsumable?: (consumableId: string) => void;
  exploredTilesByZone?: Record<string, string[]>;
  onUpdateExploredTiles?: (zoneId: string, tiles: string[]) => void;
  activeSlotIndex?: number;
  onReturnToTitle?: () => void;
}

export const OverworldMap: React.FC<OverworldMapProps> = ({
  player,
  inventory,
  currentZone,
  playerPos,
  defeatedBosses,
  openedChests,
  completedQuests,
  acceptedQuests = [],
  defeatedEnemyCounts = {},
  unlockedLoreIds = [],
  unlockedAchievements = [],
  claimedAchievements = [],
  onMove,
  onStartBattle,
  onOpenShop,
  onOpenInventory,
  onOpenLeaderboard,
  onOpenSettings,
  onOpenLoreCodex,
  onOpenAchievements,
  onHealAtInn,
  onOpenChest,
  onAcceptQuest,
  onClaimQuestReward,
  onChangeZone,
  onAutoSave,
  onEquipItem,
  onUseConsumable,
  exploredTilesByZone: initialExploredByZone = {},
  onUpdateExploredTiles,
  activeSlotIndex = 0,
  onReturnToTitle,
}) => {
  const [interactPrompt, setInteractPrompt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [facingDir, setFacingDir] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null);
  const [isQuestLogOpen, setIsQuestLogOpen] = useState(false);
  const [showMinimap, setShowMinimap] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [showForgeModal, setShowForgeModal] = useState(false);
  const [activeChestLoot, setActiveChestLoot] = useState<ChestLoot | null>(null);
  const [depletedNodes, setDepletedNodes] = useState<string[]>([]);

  // Initialize Sets from saved string arrays
  const [exploredTilesSets, setExploredTilesSets] = useState<Record<string, Set<string>>>(() => {
    const sets: Record<string, Set<string>> = {};
    if (initialExploredByZone) {
      Object.entries(initialExploredByZone).forEach(([zId, arr]) => {
        if (Array.isArray(arr)) {
          sets[zId] = new Set<string>(arr);
        }
      });
    }
    return sets;
  });

  // Sync if initialExploredByZone updates externally
  useEffect(() => {
    if (!initialExploredByZone) return;
    setExploredTilesSets((prev) => {
      let changed = false;
      const next = { ...prev };
      Object.entries(initialExploredByZone).forEach(([zId, arr]) => {
        if (Array.isArray(arr) && (!next[zId] || next[zId].size < arr.length)) {
          next[zId] = new Set<string>(arr);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [initialExploredByZone]);

  // Reveal Fog of War on movement (radius of 9 tiles)
  useEffect(() => {
    setExploredTilesSets((prev) => {
      const zoneSet = new Set(prev[currentZone.id] || []);
      const radius = 9;
      let changed = false;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (Math.hypot(dx, dy) <= radius) {
            const tx = playerPos.x + dx;
            const ty = playerPos.y + dy;
            if (tx >= 0 && tx < currentZone.mapWidth && ty >= 0 && ty < currentZone.mapHeight) {
              const key = `${tx},${ty}`;
              if (!zoneSet.has(key)) {
                zoneSet.add(key);
                changed = true;
              }
            }
          }
        }
      }

      if (!changed) return prev;

      if (onUpdateExploredTiles) {
        onUpdateExploredTiles(currentZone.id, Array.from(zoneSet));
      }

      return {
        ...prev,
        [currentZone.id]: zoneSet,
      };
    });
  }, [playerPos, currentZone.id, currentZone.mapWidth, currentZone.mapHeight, onUpdateExploredTiles]);

  // Play zone background music
  useEffect(() => {
    soundEngine.playMusic(currentZone.bgMusicTheme);
  }, [currentZone]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const unclaimedAchievementsCount = GAME_ACHIEVEMENTS.filter((ach) => {
    const isClaimed = claimedAchievements.includes(ach.id);
    if (isClaimed) return false;
    const isUnlocked = unlockedAchievements.includes(ach.id);
    if (isUnlocked) return true;
    const progress = getAchievementProgress(
      ach,
      player,
      inventory,
      defeatedBosses,
      openedChests,
      completedQuests,
      unlockedLoreIds,
      defeatedEnemyCounts
    );
    return progress.isCompleted;
  }).length;

  const isBossDefeatedInZone = defeatedBosses.includes(currentZone.boss.name);

  // Helper to find nearby chest (at current tile or 1 step adjacent)
  const findNearbyChest = useCallback(
    (px: number, py: number) => {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const cx = px + dx;
          const cy = py + dy;
          if (currentZone.tileData[cy]?.[cx] === 7) {
            const cid = `${currentZone.id}_${cx}_${cy}`;
            if (!openedChests.includes(cid)) {
              return { x: cx, y: cy, id: cid };
            }
          }
        }
      }
      return null;
    },
    [currentZone, openedChests]
  );

  // Helper to find nearby interactive tile (at current position or adjacent step)
  const findNearbyInteractiveTile = useCallback(
    (px: number, py: number) => {
      const isHarvestableTree = (tx: number, ty: number) => {
        if (currentZone.id === 'zone_castle' || currentZone.id === 'zone_cave') return false;
        return (tx * 37 + ty * 19) % 11 === 0;
      };

      const checkTile = (tile: number, tx: number, ty: number) => {
        if (tile === 1) {
          return isHarvestableTree(tx, ty);
        }
        return [4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 18, 20].includes(tile);
      };

      const cur = currentZone.tileData[py]?.[px];
      if (cur && checkTile(cur, px, py)) {
        return { tile: cur, x: px, y: py };
      }
      const neighbors = [
        { dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
        { dx: -1, dy: -1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: 1, dy: 1 }
      ];
      for (const { dx, dy } of neighbors) {
        const nx = px + dx;
        const ny = py + dy;
        const t = currentZone.tileData[ny]?.[nx];
        if (t && checkTile(t, nx, ny)) {
          return { tile: t, x: nx, y: ny };
        }
      }
      return null;
    },
    [currentZone]
  );

  // Check interactive tile nearby or on current position
  const checkTileInteraction = useCallback(
    (x: number, y: number) => {
      // 1. Check nearby NPC (within 1 tile)
      const nearbyNpc = currentZone.npcs?.find(
        (n) => Math.abs(n.x - x) <= 1 && Math.abs(n.y - y) <= 1
      );
      if (nearbyNpc) {
        setInteractPrompt(`💬 Hablar con ${nearbyNpc.name} (${nearbyNpc.title}) - Presiona A / Espacio`);
        return;
      }

      // 2. Check nearby chest (within 1 tile)
      const nearbyChest = findNearbyChest(x, y);
      if (nearbyChest) {
        setInteractPrompt('🎁 Cofre del Tesoro Cercano (Presiona A / Espacio para Abrir)');
        return;
      }

      const target = findNearbyInteractiveTile(x, y);
      if (!target) {
        setInteractPrompt(null);
        return;
      }

      const { tile, x: tx, y: ty } = target;
      const chestId = `${currentZone.id}_${tx}_${ty}`;
      const treeNodeId = `${currentZone.id}_tree_${tx}_${ty}`;
      const oreNodeId = `${currentZone.id}_ore_${tx}_${ty}`;
      const cropNodeId = `${currentZone.id}_crop_${tx}_${ty}`;

      if (tile === 1) {
        if (depletedNodes.includes(treeNodeId)) {
          setInteractPrompt('🪵 Roble Noble (Agotado - La madera necesita regenerarse)');
        } else {
          if (currentZone.id === 'zone_swamp') {
            setInteractPrompt('🪵 Sauce Resinoso del Pantano (Presiona A / Espacio para Talar Madera)');
          } else if (currentZone.id === 'zone_tundra') {
            setInteractPrompt('🪵 Pino Nevado Ancestral (Presiona A / Espacio para Talar Madera)');
          } else {
            setInteractPrompt('🪵 Roble Noble Resinoso (Presiona A / Espacio para Talar Madera)');
          }
        }
      } else if (tile === 4) {
        setInteractPrompt('⛲ Gran Fuente de la Plaza (Presiona A / Espacio para Beber Agua y Restaurar HP/MP)');
      } else if (tile === 5) {
        setInteractPrompt('🏡 Posada de la Aldea (Presiona A / Espacio para Descansar)');
      } else if (tile === 6) {
        if (openedChests.includes(chestId)) {
          setInteractPrompt('🌾 Molino de Viento (Agotado)');
        } else {
          setInteractPrompt('🌾 Molino de Viento (Presiona A / Espacio para Reclamar Harina & Suministros)');
        }
      } else if (tile === 7) {
        if (openedChests.includes(chestId)) {
          setInteractPrompt('📦 Cofre Vacío');
        } else {
          setInteractPrompt('🎁 Cofre del Tesoro (Presiona A / Espacio para Abrir)');
        }
      } else if (tile === 8) {
        if (openedChests.includes(chestId)) {
          setInteractPrompt('🏛️ Santuario Místico (Visitado)');
        } else {
          setInteractPrompt('🏛️ Santuario Místico (Presiona A / Espacio para Meditar, Sanar y Recibir Gemas)');
        }
      } else if (tile === 9) {
        setInteractPrompt('🎪 Puesto del Bazar (Presiona A / Espacio para Comerciar y Comprar Víveres)');
      } else if (tile === 10) {
        setInteractPrompt('🔨 Gran Forja & Herrería (Presiona A / Espacio para Comprar y Mejorar Equipo)');
      } else if (tile === 13) {
        if (depletedNodes.includes(cropNodeId)) {
          setInteractPrompt('🥕 Parcela de Cultivo (Agotada - Creciendo nueva cosecha)');
        } else {
          setInteractPrompt('🥕 Huerto de Cultivo y Hortalizas (Presiona A / Espacio para Cosechar Alimentos)');
        }
      } else if (tile === 14) {
        if (depletedNodes.includes(treeNodeId)) {
          setInteractPrompt('🪵 Pila de Leña (Agotada)');
        } else {
          setInteractPrompt('🪵 Depósito de Leña y Troncos (Presiona A / Espacio para Recoger Madera)');
        }
      } else if (tile === 18) {
        if (depletedNodes.includes(oreNodeId)) {
          setInteractPrompt('🪨 Veta de Mineral (Agotada - Veta extraída)');
        } else if (currentZone.id === 'zone_cave' || currentZone.id === 'zone_volcano') {
          setInteractPrompt('🪨 Veta de Mineral de Hierro y Roca (Presiona A / Espacio para Picar)');
        } else {
          setInteractPrompt('🪨 Cantera de Piedra Natural (Presiona A / Espacio para Extraer Piedra)');
        }
      } else if (tile === 20) {
        setInteractPrompt('💎 Geoda de Cristal Arcano (Presiona A / Espacio para Extraer Gemas)');
      } else if (tile === 11) {
        if (isBossDefeatedInZone) {
          setInteractPrompt('✨ Portal despejado. ¡Jefe derrotado! (A / Espacio para Cambiar de Zona)');
        } else {
          const { isUnlocked, pendingQuests } = areZoneMainQuestsCompleted(currentZone.id, completedQuests);
          if (!isUnlocked) {
            setInteractPrompt(`🔒 Portal Sellado: Completa las misiones principales de la zona (${pendingQuests.length} pendientes)`);
          } else {
            setInteractPrompt(`⚔️ ¡Portal Desbloqueado! Santuario del Jefe: ${currentZone.boss.name} (Presiona A / Espacio para Luchar)`);
          }
        }
      } else {
        setInteractPrompt(null);
      }
    },
    [currentZone, isBossDefeatedInZone, openedChests, completedQuests, depletedNodes, findNearbyChest, findNearbyInteractiveTile]
  );

  useEffect(() => {
    checkTileInteraction(playerPos.x, playerPos.y);
  }, [playerPos, checkTileInteraction]);

  // Execute interact action
  const handleInteract = () => {
    // Ensure resources object exists
    if (!player.resources) {
      player.resources = { wood: 0, stone: 0, crops: 0, gems: 0 };
    }

    // 1. Priority: Speak with nearby NPC
    const nearbyNpc = currentZone.npcs?.find(
      (n) => Math.abs(n.x - playerPos.x) <= 1 && Math.abs(n.y - playerPos.y) <= 1
    );
    if (nearbyNpc) {
      soundEngine.playSfx('select');
      setSelectedNpc(nearbyNpc);
      return;
    }

    // 2. Priority: Open nearby or current chest
    const nearbyChest = findNearbyChest(playerPos.x, playerPos.y);
    if (nearbyChest) {
      soundEngine.playSfx('chest');
      const loot = onOpenChest(nearbyChest.id);
      if (loot) {
        setActiveChestLoot(loot);
      }
      return;
    }

    // 3. Priority: Enter nearby Door / Portal
    const nearbyPortal = currentZone.portals?.find(
      (p) => Math.abs(p.x - playerPos.x) <= 1 && Math.abs(p.y - playerPos.y) <= 1
    );
    if (nearbyPortal) {
      if (nearbyPortal.minLevel && player.level < nearbyPortal.minLevel) {
        soundEngine.playSfx('error');
        showToast(`🔒 Requiere Nivel ${nearbyPortal.minLevel} para entrar a ${nearbyPortal.label}`);
        return;
      }
      soundEngine.playSfx('levelup');
      showToast(`🚪 ${nearbyPortal.label}...`);
      setTimeout(() => {
        onChangeZone(nearbyPortal.targetZoneId);
        onMove(nearbyPortal.targetPos);
      }, 120);
      return;
    }

    const target = findNearbyInteractiveTile(playerPos.x, playerPos.y);
    if (!target) return;

    const { tile, x: tx, y: ty } = target;
    const chestId = `${currentZone.id}_${tx}_${ty}`;
    const treeNodeId = `${currentZone.id}_tree_${tx}_${ty}`;
    const oreNodeId = `${currentZone.id}_ore_${tx}_${ty}`;
    const cropNodeId = `${currentZone.id}_crop_${tx}_${ty}`;

    if (tile === 1) {
      if (depletedNodes.includes(treeNodeId)) {
        soundEngine.playSfx('error');
        showToast('🪵 Este árbol ya ha sido talado. ¡Busca otros robles nobles en el bosque!');
        return;
      }
      soundEngine.playSfx('attack');
      const woodGain = Math.floor(Math.random() * 3) + 4; // 4 - 6 wood
      player.resources.wood = (player.resources.wood || 0) + woodGain;
      setDepletedNodes((prev) => [...prev, treeNodeId]);
      onAutoSave();
      showToast(`🪵 ¡Has talado el roble noble! (+${woodGain} Madera de Roble)`);
    } else if (tile === 4) {
      soundEngine.playSfx('heal');
      onHealAtInn();
      showToast('⛲ ¡Has bebido agua fresca de la fuente! HP y MP restaurados al 100%.');
    } else if (tile === 5) {
      soundEngine.playSfx('heal');
      onHealAtInn();
      showToast('✨ ¡Has descansado en la posada! HP y MP restaurados al 100%.');
    } else if (tile === 6) {
      if (!openedChests.includes(chestId)) {
        soundEngine.playSfx('gold');
        onOpenChest(chestId);
        player.resources.crops = (player.resources.crops || 0) + 15;
        onAutoSave();
        showToast('🌾 ¡Molino de Viento! Has recolectado +15 Cosechas y Harina.');
      } else {
        showToast('🌾 El molino está moliendo grano para la siguiente cosecha.');
      }
    } else if (tile === 7) {
      if (!openedChests.includes(chestId)) {
        soundEngine.playSfx('chest');
        const loot = onOpenChest(chestId);
        if (loot) {
          setActiveChestLoot(loot);
        }
        player.resources.stone = (player.resources.stone || 0) + 8;
        player.resources.gems = (player.resources.gems || 0) + 2;
        onAutoSave();
      }
    } else if (tile === 8) {
      if (!openedChests.includes(chestId)) {
        soundEngine.playSfx('level_up');
        onOpenChest(chestId);
        onHealAtInn();
        player.resources.gems = (player.resources.gems || 0) + 5;
        onAutoSave();
        showToast('🏛️ ¡Meditación en el santuario! +5 Gemas Arcanas y HP/MP Restaurados.');
      } else {
        onHealAtInn();
        showToast('🏛️ La paz del santuario restaura tu energía vital.');
      }
    } else if (tile === 9) {
      soundEngine.playSfx('select');
      onOpenShop();
    } else if (tile === 10) {
      soundEngine.playSfx('select');
      setShowForgeModal(true);
    } else if (tile === 13) {
      if (depletedNodes.includes(cropNodeId)) {
        soundEngine.playSfx('error');
        showToast('🥕 Este huerto ya fue cosechado. Creciendo nueva siembra.');
        return;
      }
      soundEngine.playSfx('select');
      const cropsGain = Math.floor(Math.random() * 4) + 4; // 4 - 7 crops
      player.resources.crops = (player.resources.crops || 0) + cropsGain;
      setDepletedNodes((prev) => [...prev, cropNodeId]);
      onAutoSave();
      showToast(`🥕 ¡Has cosechado hortalizas y provisiones! (+${cropsGain} Cosechas)`);
    } else if (tile === 14) {
      if (depletedNodes.includes(treeNodeId)) {
        soundEngine.playSfx('error');
        showToast('🪵 Esta pila de leña ya fue recogida.');
        return;
      }
      soundEngine.playSfx('select');
      const woodGain = Math.floor(Math.random() * 3) + 6; // 6 - 8 wood
      player.resources.wood = (player.resources.wood || 0) + woodGain;
      setDepletedNodes((prev) => [...prev, treeNodeId]);
      onAutoSave();
      showToast(`🪵 ¡Has recogido leña de los troncos apilados! (+${woodGain} Madera)`);
    } else if (tile === 18) {
      if (depletedNodes.includes(oreNodeId)) {
        soundEngine.playSfx('error');
        showToast('🪨 Esta veta de mineral ya ha sido extraída.');
        return;
      }
      soundEngine.playSfx('attack');
      const stoneGain = Math.floor(Math.random() * 4) + 5; // 5 - 8 stone
      player.resources.stone = (player.resources.stone || 0) + stoneGain;
      // 10% chance of small gem found in mineral vein
      const foundGem = Math.random() < 0.10;
      if (foundGem) {
        player.resources.gems = (player.resources.gems || 0) + 1;
      }
      setDepletedNodes((prev) => [...prev, oreNodeId]);
      onAutoSave();
      showToast(`🪨 ¡Has picado la veta de mineral! (+${stoneGain} Piedra/Hierro${foundGem ? ', +1 Gema 💎' : ''})`);
    } else if (tile === 20) {
      soundEngine.playSfx('level_up');
      const gemGain = Math.floor(Math.random() * 2) + 1; // 1 - 2 gems
      player.resources.gems = (player.resources.gems || 0) + gemGain;
      onAutoSave();
      showToast(`💎 ¡Has extraído cristales arcanos de la geoda! (+${gemGain} Gemas Arcanas)`);
    } else if (tile === 11) {
      if (isBossDefeatedInZone) {
        // Open zone selector
        const currentIndex = ZONES.findIndex((z) => z.id === currentZone.id);
        const nextZone = ZONES[currentIndex + 1];
        if (nextZone) {
          soundEngine.playSfx('select');
          onChangeZone(nextZone.id);
          showToast(`🚀 ¡Avanzando a ${nextZone.name}!`);
        } else {
          showToast('👑 ¡Has completado todas las zonas principales! Eres una leyenda.');
        }
      } else {
        const { isUnlocked, pendingQuests } = areZoneMainQuestsCompleted(currentZone.id, completedQuests);
        if (!isUnlocked) {
          soundEngine.playSfx('error');
          const questList = pendingQuests.map((q) => `"${q.title}"`).join(', ');
          showToast(`🔒 Portal Sellado: Debes completar las misiones principales de la zona (${questList}).`);
        } else {
          soundEngine.playSfx('boss_roar');
          onStartBattle(true);
        }
      }
    }
  };

  const [safeStepsRemaining, setSafeStepsRemaining] = useState(6);

  // Movement Logic
  const attemptMove = (dx: number, dy: number) => {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // Check bounds
    if (newX < 0 || newX >= currentZone.mapWidth || newY < 0 || newY >= currentZone.mapHeight) {
      return;
    }

    const targetTile = currentZone.tileData[newY]?.[newX];

    // Block collision on void abyss, out of bounds, and solid obstacle tiles (28 is walkable door/portal)
    const isDirectSolid = targetTile === -1 || targetTile === undefined || [-1, 1, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 29, 30, 31, 32, 34].includes(targetTile);

    if (isDirectSolid) {
      soundEngine.playSfx('error');
      return;
    }

    // Set direction
    if (dx > 0) setFacingDir('right');
    else if (dx < 0) setFacingDir('left');
    else if (dy > 0) setFacingDir('down');
    else if (dy < 0) setFacingDir('up');

    soundEngine.playSfx('select');
    onMove({ x: newX, y: newY });

    // 🚪 AUTOMATIC STEP-ON PORTAL TRIGGER (Doors, Stairs, Dungeons)
    const stepPortal = currentZone.portals?.find((p) => p.x === newX && p.y === newY);
    if (stepPortal) {
      if (stepPortal.minLevel && player.level < stepPortal.minLevel) {
        soundEngine.playSfx('error');
        showToast(`🔒 Requiere Nivel ${stepPortal.minLevel} para entrar a ${stepPortal.label}`);
        return;
      }
      soundEngine.playSfx('levelup');
      showToast(`🚪 ${stepPortal.label}...`);
      setTimeout(() => {
        onChangeZone(stepPortal.targetZoneId);
        onMove(stepPortal.targetPos);
      }, 120);
      return;
    }

    // Step counter management
    if (safeStepsRemaining > 0) {
      setSafeStepsRemaining((prev) => prev - 1);
    }

    // COMBAT ENCOUNTERS IN THE WILD:
    // 1. Roads, paved avenues, bridges (tile 2, 15) are 100% SAFE.
    // 2. All POIs, shops, forges, shrines, wells (tile 4..11, 16..19) are 100% SAFE.
    // 3. Inside the Great Citadel of Aethelgard (around center 36,60) or any interior is 100% peaceful.
    // 4. Outside in the wild grasslands (targetTile === 0), monster combat begins!
    const isPavedRoad = targetTile === 2 || targetTile === 15;
    const isSpecialPoi = [4, 5, 6, 7, 8, 9, 10, 11, 16, 17, 18, 19, 28].includes(targetTile);
    const isInsideTown = (currentZone.id === 'zone_forest' && (Math.abs(newX - 36) <= 18 && Math.abs(newY - 60) <= 16)) || (currentZone.isInterior && currentZone.interiorType !== 'crypt' && currentZone.interiorType !== 'smugglers_cave');

    const isSafeZone = isPavedRoad || isSpecialPoi || isInsideTown;

    if (!isSafeZone && safeStepsRemaining <= 0) {
      let encounterChance = 0;

      if (targetTile === 0) {
        // Natural wilderness (grass / deep caves / wild mud / dungeon corridors)
        if (currentZone.interiorType === 'crypt' || currentZone.interiorType === 'smugglers_cave') {
          encounterChance = 0.16; // Dungeon encounter rate
        } else {
          encounterChance = currentZone.id === 'zone_forest' ? 0.08 : 0.12;
        }
      } else if (targetTile === 14) {
        // Elite danger grounds / cursed earth
        encounterChance = 0.22;
      }

      if (encounterChance > 0 && Math.random() < encounterChance) {
        // 8 steps of grace after battle
        setSafeStepsRemaining(8);
        setTimeout(() => {
          onStartBattle(false);
        }, 180);
      }
    }
  };

  const attemptMoveRef = React.useRef(attemptMove);
  attemptMoveRef.current = attemptMove;

  // Virtual D-Pad Hold-to-Move Timer
  const holdTimerRef = React.useRef<{ timeoutId: any; intervalId: any }>({
    timeoutId: null,
    intervalId: null,
  });

  const stopHoldMove = useCallback(() => {
    if (holdTimerRef.current.timeoutId) {
      clearTimeout(holdTimerRef.current.timeoutId);
      holdTimerRef.current.timeoutId = null;
    }
    if (holdTimerRef.current.intervalId) {
      clearInterval(holdTimerRef.current.intervalId);
      holdTimerRef.current.intervalId = null;
    }
  }, []);

  const startHoldMove = useCallback(
    (dx: number, dy: number) => {
      stopHoldMove();
      // 1er paso inmediato (1 sola casilla para toques rápidos)
      attemptMoveRef.current(dx, dy);

      // Tras pausa inicial de 240ms, si sigue presionado, avanza cada 150ms
      holdTimerRef.current.timeoutId = setTimeout(() => {
        holdTimerRef.current.intervalId = setInterval(() => {
          attemptMoveRef.current(dx, dy);
        }, 150);
      }, 240);
    },
    [stopHoldMove]
  );

  useEffect(() => {
    return () => {
      stopHoldMove();
    };
  }, [stopHoldMove]);

  // Controller & Keyboard Handler
  const handleControllerAction = useCallback(
    (action: ControllerAction) => {
      switch (action) {
        case 'UP':
          attemptMove(0, -1);
          break;
        case 'DOWN':
          attemptMove(0, 1);
          break;
        case 'LEFT':
          attemptMove(-1, 0);
          break;
        case 'RIGHT':
          attemptMove(1, 0);
          break;
        case 'CONFIRM':
          if (interactPrompt) {
            handleInteract();
          }
          break;
        case 'CANCEL':
          onOpenInventory();
          break;
        case 'MENU':
          onOpenSettings();
          break;
        case 'TAB_NEXT':
          onOpenShop();
          break;
        case 'TAB_PREV':
          onOpenLeaderboard();
          break;
      }
    },
    [playerPos, interactPrompt, currentZone]
  );

  useGamepadControls(handleControllerAction, true);

  // Touch Swipe Gesture State
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const minSwipeDist = 25;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minSwipeDist) {
        attemptMove(dx > 0 ? 1 : -1, 0);
      }
    } else {
      if (Math.abs(dy) > minSwipeDist) {
        attemptMove(0, dy > 0 ? 1 : -1);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-h-[100dvh] max-w-7xl mx-auto p-1 sm:p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl overflow-hidden select-none touch-none">
      {/* Top Header: Zone Name, Quick Utilities & Zone Selector */}
      <div className="w-full flex flex-col gap-1 sm:gap-1.5 p-1.5 sm:p-2 bg-slate-900/90 rounded-2xl border border-slate-800 flex-shrink-0">
        {/* Row 1: Title and Utility Action Buttons */}
        <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Left: Current Zone Title with indicator dot */}
          <div className="flex items-center gap-2 overflow-hidden py-0.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <h1 className="font-bold text-xs sm:text-sm text-amber-300 font-mono truncate">
              {currentZone.name}
            </h1>
          </div>

          {/* Right: Quick Action Modals (Codex, Ranking, Logros, Ajustes) */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => {
                soundEngine.playSfx('select');
                onOpenLoreCodex();
              }}
              className="px-2 sm:px-2.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/40 active:scale-95 text-amber-300 rounded-xl border border-amber-500/50 transition flex items-center gap-1 text-xs font-mono font-bold shadow-sm"
              title="Abrir Códice y Guía del Reino"
            >
              <Scroll className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Códice</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playSfx('select');
                onOpenLeaderboard();
              }}
              className="px-2 sm:px-2.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/40 active:scale-95 text-amber-300 rounded-xl border border-amber-500/50 transition flex items-center gap-1 text-xs font-mono font-bold shadow-sm"
              title="Ver Clasificación"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Ranking</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playSfx('select');
                onOpenAchievements();
              }}
              className="relative px-2 sm:px-2.5 py-1.5 bg-gradient-to-r from-amber-600/25 to-yellow-600/20 hover:from-amber-600/45 active:scale-95 text-amber-300 rounded-xl border border-amber-500/50 shadow-md transition flex items-center gap-1 text-xs font-mono font-bold"
              title="Ver Logros y Recompensas"
            >
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="font-bold hidden sm:inline">Logros</span>
              {unclaimedAchievementsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-slate-950 shadow animate-bounce">
                  {unclaimedAchievementsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                soundEngine.playSfx('select');
                onOpenSettings();
              }}
              className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-xl border border-slate-700 text-slate-300 transition flex items-center shadow-sm"
              title="Ajustes"
            >
              <Gamepad className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Row 2: Zone Selector Tabs (8 Regions) */}
        <div className="w-full flex items-center gap-1.5 bg-slate-950/90 p-1.5 rounded-xl border border-slate-800 overflow-x-auto scrollbar-thin scrollbar-thumb-amber-500/50">
          {ZONES.map((z) => {
            const unlocked = isZoneUnlocked(z.id, defeatedBosses);
            const requirementMsg = getZoneRequirementMessage(z.id);
            const isCurrent = z.id === currentZone.id;
            const shortName = z.name.split(':')[1]?.trim() || z.name.split(':')[0];

            return (
              <button
                key={z.id}
                onClick={() => {
                  if (unlocked) {
                    soundEngine.playSfx('select');
                    onChangeZone(z.id);
                  } else {
                    soundEngine.playSfx('error');
                    showToast(requirementMsg);
                  }
                }}
                className={`py-1.5 px-2.5 text-xs rounded-lg font-mono flex items-center justify-center gap-1.5 transition-all whitespace-nowrap active:scale-95 flex-shrink-0 ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md border-amber-400'
                    : unlocked
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-slate-900/90 text-slate-500 border border-slate-800/80 opacity-75'
                }`}
                title={unlocked ? z.name : requirementMsg}
              >
                {!unlocked ? <span className="text-xs">🔒</span> : <span className="text-xs">📍</span>}
                <span className="font-bold">{shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Main Stats Bar (Single Row) */}
      <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2.5 my-1 p-1.5 sm:p-2 bg-slate-900/95 rounded-2xl border-2 border-slate-800 text-xs font-mono shadow-xl flex-shrink-0">
        {/* Player Name & Class */}
        <div className="flex items-center space-x-1.5 flex-shrink-0 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 shadow-inner">
          <span className="text-sm">{player.heroClass === 'Guerrero' ? '⚔️' : player.heroClass === 'Mago' ? '🪄' : '🗡️'}</span>
          <span className="font-black text-amber-300 truncate max-w-[80px] sm:max-w-none text-xs sm:text-sm">{player.name}</span>
          <span className="text-amber-400 font-bold text-[10px] sm:text-xs">Nv.{player.level}</span>
        </div>

        {/* HP Bar */}
        <div className="flex-1 min-w-[55px] sm:min-w-[85px] bg-slate-950 px-1.5 py-1 rounded-xl border border-slate-800 shadow-inner">
          <div className="flex justify-between text-emerald-400 font-black text-[9px] sm:text-[10px]">
            <span>HP</span>
            <span>{player.hp}/{player.maxHp}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 sm:h-2.5 rounded-full overflow-hidden mt-0.5">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, (player.hp / player.maxHp) * 100))}%` }}
            />
          </div>
        </div>

        {/* MP Bar */}
        <div className="flex-1 min-w-[55px] sm:min-w-[85px] bg-slate-950 px-1.5 py-1 rounded-xl border border-slate-800 shadow-inner">
          <div className="flex justify-between text-sky-400 font-black text-[9px] sm:text-[10px]">
            <span>MP</span>
            <span>{player.mp}/{player.maxMp}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 sm:h-2.5 rounded-full overflow-hidden mt-0.5">
            <div
              className="bg-sky-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, (player.mp / player.maxMp) * 100))}%` }}
            />
          </div>
        </div>

        {/* EXP Bar (Next Level Progress) */}
        <div
          className="flex-1 min-w-[55px] sm:min-w-[85px] bg-slate-950 px-1.5 py-1 rounded-xl border border-purple-900/50 hover:border-purple-500/60 transition-colors shadow-inner"
          title={`EXP: ${player.exp} / ${player.maxExp} (Faltan ${Math.max(0, player.maxExp - player.exp)} EXP para Nv.${player.level + 1})`}
        >
          <div className="flex justify-between text-purple-300 font-black text-[9px] sm:text-[10px]">
            <span className="flex items-center gap-0.5">
              <span>EXP</span>
            </span>
            <span>{player.exp}/{player.maxExp}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 sm:h-2.5 rounded-full overflow-hidden mt-0.5">
            <div
              className="bg-gradient-to-r from-purple-500 via-fuchsia-400 to-amber-300 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, (player.exp / player.maxExp) * 100))}%` }}
            />
          </div>
        </div>

        {/* Gold & Save & Menu */}
        <div className="flex items-center space-x-1 flex-shrink-0 bg-slate-950 px-2 py-1 rounded-xl border border-amber-500/60 shadow-inner">
          <span className="text-sm">🪙</span>
          <span className="font-black text-yellow-300 text-xs sm:text-sm">{player.gold.toLocaleString()}G</span>
          <button
            onClick={() => {
              soundEngine.playSfx('levelup');
              onAutoSave();
              showToast(`💾 ¡Guardado en Ranura ${activeSlotIndex + 1}! (${player.name} Nv. ${player.level})`);
            }}
            className="p-1 bg-emerald-700 hover:bg-emerald-600 active:scale-95 rounded text-emerald-100 font-bold flex items-center space-x-0.5 border border-emerald-500 shadow"
            title={`Guardar partida en Ranura ${activeSlotIndex + 1}`}
          >
            <Save className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Guardar</span>
          </button>
          {onReturnToTitle && (
            <button
              onClick={() => {
                onAutoSave();
                soundEngine.playSfx('select');
                onReturnToTitle();
              }}
              className="p-1 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded text-slate-300 text-[10px] font-bold border border-slate-700"
              title="Guardar y Volver al Menú Principal / Cambiar Personaje"
            >
              🚪 Menú
            </button>
          )}
        </div>
      </div>

      {/* Overworld Map Grid View - 3D WebGL MOBA Engine */}
      <div
        className="relative flex-1 min-h-0 w-full my-0.5 sm:my-1 bg-slate-900 border-2 border-slate-700 rounded-xl shadow-inner overflow-hidden touch-none select-none"
        style={{ touchAction: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => {
          if (e.cancelable) e.preventDefault();
        }}
        onTouchEnd={handleTouchEnd}
      >
        <ThreeMapCanvas
          currentZone={currentZone}
          playerPos={playerPos}
          player={player}
          equipment={inventory.equipment}
          facingDir={facingDir}
          openedChests={openedChests}
          defeatedBosses={defeatedBosses}
          completedQuests={completedQuests}
          onTileClick={
            player.level >= 75
              ? (targetX, targetY) => {
                  onMove({ x: targetX, y: targetY });
                  soundEngine.playSfx('select');
                  showToast(`⚡ Teletransporte Creador: [${targetX}, ${targetY}]`);
                }
              : undefined
          }
        />

        <TopResourceBar
          player={player}
          currentZone={currentZone}
          acceptedQuests={acceptedQuests}
          completedQuests={completedQuests}
          onOpenQuests={() => {
            soundEngine.playSfx('select');
            setIsQuestLogOpen(true);
          }}
        />

        {/* Floating Minimap Overlay in Top-Right Corner (Collapsible for Mobile) */}
        <div className="absolute top-10 right-2 z-20 pointer-events-auto flex flex-col items-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMinimap(!showMinimap);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMinimap((prev) => !prev);
            }}
            className="mb-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-slate-950/80 active:bg-amber-500 active:text-slate-950 hover:bg-slate-800 border border-amber-500/50 rounded text-[9px] sm:text-[10px] font-mono text-amber-300 shadow-md flex items-center gap-1 backdrop-blur-sm transition"
            title="Mostrar / Ocultar Minimapa"
          >
            <Compass className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
            <span className="font-bold">{showMinimap ? 'Ocultar' : 'Mapa'}</span>
          </button>
          {showMinimap && (
            <div className="origin-top-right">
              <Minimap
                currentZone={currentZone}
                playerPos={playerPos}
                openedChests={openedChests}
                defeatedBosses={defeatedBosses}
                exploredTiles={exploredTilesSets[currentZone.id]}
                isCreatorMode={player.level >= 75}
                onMinimapClick={(targetX, targetY) => {
                  if (player.level >= 75) {
                    onMove({ x: targetX, y: targetY });
                    soundEngine.playSfx('select');
                    showToast(`⚡ Teletransporte Creador: [${targetX}, ${targetY}]`);
                  } else {
                    showToast(`📍 Coordenadas exploradas: [${targetX}, ${targetY}]`);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Floating Touch D-Pad Control Overlay */}
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-20 pointer-events-auto select-none" style={{ touchAction: 'none' }}>
          <div className="grid grid-cols-3 gap-1 w-32 h-32 sm:w-36 sm:h-36 bg-slate-950/90 p-1.5 rounded-full border-2 border-amber-500/70 backdrop-blur-md shadow-2xl">
            <div />
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startHoldMove(0, -1);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                stopHoldMove();
              }}
              onPointerLeave={stopHoldMove}
              onPointerCancel={stopHoldMove}
              className="bg-slate-800/95 active:bg-amber-500 hover:bg-slate-700 text-amber-300 active:text-slate-950 rounded-t-full border border-slate-600 flex items-center justify-center text-lg sm:text-xl font-black shadow-md active:scale-90 transition-transform select-none"
              style={{ touchAction: 'none' }}
              aria-label="Mover Arriba"
            >
              ▲
            </button>
            <div />
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startHoldMove(-1, 0);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                stopHoldMove();
              }}
              onPointerLeave={stopHoldMove}
              onPointerCancel={stopHoldMove}
              className="bg-slate-800/95 active:bg-amber-500 hover:bg-slate-700 text-amber-300 active:text-slate-950 rounded-l-full border border-slate-600 flex items-center justify-center text-lg sm:text-xl font-black shadow-md active:scale-90 transition-transform select-none"
              style={{ touchAction: 'none' }}
              aria-label="Mover Izquierda"
            >
              ◄
            </button>
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleInteract();
              }}
              className="bg-amber-600 active:bg-amber-400 text-slate-950 rounded-full font-black text-sm sm:text-base shadow-lg border-2 border-amber-300 flex items-center justify-center active:scale-90 transition-transform select-none"
              style={{ touchAction: 'none' }}
              aria-label="Interactuar"
            >
              A
            </button>
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startHoldMove(1, 0);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                stopHoldMove();
              }}
              onPointerLeave={stopHoldMove}
              onPointerCancel={stopHoldMove}
              className="bg-slate-800/95 active:bg-amber-500 hover:bg-slate-700 text-amber-300 active:text-slate-950 rounded-r-full border border-slate-600 flex items-center justify-center text-lg sm:text-xl font-black shadow-md active:scale-90 transition-transform select-none"
              style={{ touchAction: 'none' }}
              aria-label="Mover Derecha"
            >
              ►
            </button>
            <div />
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startHoldMove(0, 1);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                stopHoldMove();
              }}
              onPointerLeave={stopHoldMove}
              onPointerCancel={stopHoldMove}
              className="bg-slate-800/95 active:bg-amber-500 hover:bg-slate-700 text-amber-300 active:text-slate-950 rounded-b-full border border-slate-600 flex items-center justify-center text-lg sm:text-xl font-black shadow-md active:scale-90 transition-transform select-none"
              style={{ touchAction: 'none' }}
              aria-label="Mover Abajo"
            >
              ▼
            </button>
            <div />
          </div>
        </div>

        {/* Action Button on Bottom-Right */}
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 flex items-center gap-2 pointer-events-auto select-none" style={{ touchAction: 'none' }}>
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleInteract();
            }}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-amber-600 active:from-amber-400 active:to-amber-500 text-slate-950 rounded-full font-black text-lg sm:text-xl border-2 border-amber-300 shadow-2xl flex items-center justify-center active:scale-90 transition-transform select-none"
            style={{ touchAction: 'none' }}
            aria-label="Acción A"
          >
            [A]
          </button>
        </div>

        {/* Interactive Banner Toast / Prompt - Placed at Top for Maximum Visibility */}
        {interactPrompt && (
          <div className="absolute top-12 sm:top-14 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm sm:max-w-md bg-slate-950/95 border-2 border-amber-400 rounded-xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-md text-center text-xs sm:text-sm font-mono text-amber-300 animate-pulse z-30 pointer-events-none">
            {interactPrompt}
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-full font-mono font-bold text-xs shadow-2xl animate-fade-in z-40 pointer-events-none border border-amber-300">
            {toastMessage}
          </div>
        )}
      </div>

      {/* Pixel Tribe Bottom Action Bar & Hotbar */}
      <BottomActionBar
        player={player}
        inventory={inventory}
        onOpenInventory={onOpenInventory}
        onOpenQuests={() => {
          soundEngine.playSfx('select');
          setIsQuestLogOpen(true);
        }}
        onOpenShop={onOpenShop}
        onOpenSettings={onOpenSettings}
        onTeleportToTown={() => {
          onMove({ x: 36, y: 62 });
        }}
        onUseConsumable={(cId) => (onUseConsumable ? onUseConsumable(cId) : onHealAtInn())}
        onShowToast={(msg) => showToast(msg)}
      />

      {/* Forge & Weapon Tree Modal */}
      {showForgeModal && (
        <ForgeModal
          player={player}
          inventory={inventory}
          onClose={() => setShowForgeModal(false)}
          onEquipItem={(item) => {
            if (onEquipItem) onEquipItem(item);
          }}
          onShowToast={(msg) => showToast(msg)}
        />
      )}

      {/* Chest Loot Reward Modal */}
      {activeChestLoot && (
        <ChestLootModal
          loot={activeChestLoot}
          onClose={() => setActiveChestLoot(null)}
        />
      )}

      {/* Quest Log Modal */}
      {isQuestLogOpen && (
        <QuestLogModal
          currentZone={currentZone}
          player={player}
          completedQuests={completedQuests}
          acceptedQuests={acceptedQuests}
          openedChests={openedChests}
          defeatedBosses={defeatedBosses}
          defeatedEnemyCounts={defeatedEnemyCounts}
          onClaimReward={(questId, gold, exp) => {
            onClaimQuestReward(questId, gold, exp);
            const q = ALL_GAME_QUESTS.find((item) => item.id === questId);
            const equip = q ? getQuestRewardEquipment(q) : null;
            const itemSuffix = q?.rewardItemName
              ? equip
                ? ` y ⚔️ ${q.rewardItemName} (en Mochila Equipamiento)`
                : ` y 🧪 ${q.rewardItemName} (en Consumibles)`
              : '';
            showToast(`🎉 ¡Misión Completada! +${gold} Oro, +${exp} EXP${itemSuffix}`);
          }}
          onClose={() => setIsQuestLogOpen(false)}
        />
      )}

      {/* NPC Dialogue Modal */}
      {selectedNpc && (
        <NPCDialogModal
          npc={selectedNpc}
          player={player}
          defeatedBosses={defeatedBosses}
          openedChests={openedChests}
          defeatedEnemyCounts={defeatedEnemyCounts}
          completedQuests={completedQuests}
          acceptedQuests={acceptedQuests}
          onAcceptQuest={(questId) => {
            if (onAcceptQuest) {
              onAcceptQuest(questId);
            }
            const q = ALL_GAME_QUESTS.find((item) => item.id === questId);
            showToast(`📜 ¡Misión Aceptada: "${q?.title || 'Nueva Misión'}"! Añadida al Diario.`);
          }}
          onClose={() => setSelectedNpc(null)}
          onClaimReward={(questId, gold, exp) => {
            onClaimQuestReward(questId, gold, exp);
            const q = ALL_GAME_QUESTS.find((item) => item.id === questId);
            const equip = q ? getQuestRewardEquipment(q) : null;
            const itemSuffix = q?.rewardItemName
              ? equip
                ? ` y ⚔️ ${q.rewardItemName} (en Mochila Equipamiento)`
                : ` y 🧪 ${q.rewardItemName} (en Consumibles)`
              : '';
            showToast(`🎉 ¡Misión Entregada! +${gold} Oro, +${exp} EXP${itemSuffix}`);
          }}
          onOpenForge={() => {
            setSelectedNpc(null);
            setShowForgeModal(true);
          }}
        />
      )}
    </div>
  );
};
