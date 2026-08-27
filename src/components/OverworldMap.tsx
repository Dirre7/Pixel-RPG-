import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { PlayerStats, Zone, Inventory, NPC, HeroCombatSkill, OverworldEnemy, EquipmentItem } from '../types';
import { ZONES, areZoneMainQuestsCompleted, ALL_GAME_QUESTS, isZoneUnlocked, getZoneRequirementMessage, GAME_ACHIEVEMENTS, getAchievementProgress, getQuestRewardEquipment, getRequiredExpForLevel } from '../data/gameData';
import { PixelCanvas } from './PixelCanvas';
import { PixelMapCanvas } from './PixelMapCanvas';
import { ThreeMapCanvas } from './ThreeMapCanvas';
import { ActionCombatControls } from './ActionCombatControls';
import { NPCDialogModal } from './NPCDialogModal';
import { Minimap } from './Minimap';
import { QuestLogModal } from './QuestLogModal';
import { ChestLootModal, ChestLoot } from './ChestLootModal';
import { TopResourceBar } from './TopResourceBar';
import { BottomActionBar } from './BottomActionBar';
import { ForgeModal } from './ForgeModal';
import { soundEngine } from '../utils/soundEngine';
import { useGamepadControls, ControllerAction } from '../utils/gamepadManager';
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
  BookOpen,
  Menu,
  MapPin,
  X,
  Calendar,
  Settings,
  Heart,
  Droplet
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
  const [isQuestExpanded, setIsQuestExpanded] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showForgeModal, setShowForgeModal] = useState(false);
  const [showGameMenuModal, setShowGameMenuModal] = useState(false);
  const [showZoneTravelModal, setShowZoneTravelModal] = useState(false);
  const [activeChestLoot, setActiveChestLoot] = useState<ChestLoot | null>(null);
  const portalCooldownRef = useRef(0);
  const [depletedNodes, setDepletedNodes] = useState<string[]>([]);
  const [activeBoss, setActiveBoss] = useState<OverworldEnemy | null>(null);
  const handleBossStateChange = useCallback((boss: OverworldEnemy | null) => {
    setActiveBoss((prev) => {
      if (prev === null && boss === null) return prev;
      if (prev?.id === boss?.id && prev?.hp === boss?.hp) return prev;
      return boss;
    });
  }, []);
  const combatActionRef = useRef<{
    triggerBasicAttack: () => void;
    triggerSkill: (skill: HeroCombatSkill) => boolean;
    triggerDash: () => boolean;
  } | null>(null);

  const handleEnemyKilled = useCallback(
    (enemy: OverworldEnemy) => {
      // Registrar baja para misiones y logros
      if (defeatedEnemyCounts) {
        defeatedEnemyCounts[enemy.name] = (defeatedEnemyCounts[enemy.name] || 0) + 1;
      }

      if (enemy.isBoss && !defeatedBosses.includes(enemy.name)) {
        defeatedBosses.push(enemy.name);
        setToastMessage(`👑 ¡HAS DERROTADO AL JEFE ${enemy.name.toUpperCase()}!`);
        setTimeout(() => setToastMessage(null), 4000);
      }

      onAutoSave();
    },
    [defeatedEnemyCounts, defeatedBosses, onAutoSave]
  );

  const handlePlayerDamaged = useCallback(
    (amount: number) => {
      player.hp = Math.max(0, player.hp - amount);
      if (player.hp <= 0) {
        // Player defeated: respawn safely at central village plaza
        player.hp = player.maxHp;
        player.mp = player.maxMp;
        if (currentZone.id !== 'zone_forest') {
          onChangeZone('zone_forest');
        }
        onMove({ x: 36, y: 60 });
        setToastMessage('💀 Has caído en combate... Has despertado en la Plaza de la Aldea.');
        setTimeout(() => setToastMessage(null), 4000);
        soundEngine.playSfx('gameover');
      }
    },
    [player, currentZone.id, onChangeZone, onMove]
  );

  const handleLootCollected = useCallback(
    (type: 'gold' | 'exp' | 'item' | 'health_orb', amount?: number) => {
      if (type === 'gold' && amount) {
        player.gold += amount;
      } else if (type === 'exp' && amount) {
        player.exp += amount;
        while (player.exp >= player.maxExp && player.level < 99) {
          player.level += 1;
          player.exp -= player.maxExp;
          player.maxExp = getRequiredExpForLevel(player.level);
          player.maxHp += 18;
          player.hp = player.maxHp;
          player.maxMp += 8;
          player.mp = player.maxMp;
          player.attack += 3;
          player.defense += 2;
          soundEngine.playSfx('levelup');
          setToastMessage(`🎉 ¡SUBISTE DE NIVEL! Nivel ${player.level}`);
          setTimeout(() => setToastMessage(null), 3500);
        }
      } else if (type === 'health_orb' && amount) {
        player.hp = Math.min(player.maxHp, player.hp + amount);
      }
    },
    [player]
  );

  const [isMobileLandscape, setIsMobileLandscape] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerHeight <= 520 && window.innerWidth > window.innerHeight;
  });

  useEffect(() => {
    const handleOrientationCheck = () => {
      const isLandscape = window.innerHeight <= 520 && window.innerWidth > window.innerHeight;
      setIsMobileLandscape(isLandscape);
    };
    handleOrientationCheck();
    window.addEventListener('resize', handleOrientationCheck);
    window.addEventListener('orientationchange', handleOrientationCheck);
    return () => {
      window.removeEventListener('resize', handleOrientationCheck);
      window.removeEventListener('orientationchange', handleOrientationCheck);
    };
  }, []);

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

  const lastSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reveal Fog of War on movement (radius of 9 tiles)
  useEffect(() => {
    setExploredTilesSets((prev) => {
      const zoneSet = new Set(prev[currentZone.id] || []);
      const radius = 9;
      let changed = false;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy <= radius * radius) {
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
        if (lastSyncTimerRef.current) clearTimeout(lastSyncTimerRef.current);
        lastSyncTimerRef.current = setTimeout(() => {
          onUpdateExploredTiles(currentZone.id, Array.from(zoneSet));
        }, 800);
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

  const unclaimedAchievementsCount = useMemo(() => {
    return GAME_ACHIEVEMENTS.filter((ach) => {
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
  }, [claimedAchievements, unlockedAchievements, player, inventory, defeatedBosses, openedChests, completedQuests, unlockedLoreIds, defeatedEnemyCounts]);

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

    // Multi-tile building footprint collision (Houses, Cottages, Inns, Forges, Botica, City Hall, Windmills)
    // A building anchored at (bx, by) occupies [bx-1..bx+1] in X and [by-2..by] in Y.
    let isBuildingBody = false;
    if (targetTile !== 28 && targetTile !== 2) {
      for (let dy = 0; dy <= 2; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const by = newY + dy;
          const bx = newX - dx;
          if (by >= 0 && by < currentZone.mapHeight && bx >= 0 && bx < currentZone.mapWidth) {
            const bType = currentZone.tileData[by]?.[bx];
            if ([5, 6, 8, 10, 27, 31].includes(bType)) {
              isBuildingBody = true;
              break;
            }
          }
        }
        if (isBuildingBody) break;
      }
    }

    if (isDirectSolid || isBuildingBody) {
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

    // 🚪 AUTOMATIC STEP-ON PORTAL TRIGGER (Doors, Stairs, Dungeons, Road Border Arches)
    if (Date.now() >= portalCooldownRef.current) {
      const stepPortal = currentZone.portals?.find((p) => {
        if (p.x === newX && p.y === newY) return true;
        if (!p.isDoor && Math.abs(p.x - newX) <= 1 && Math.abs(p.y - newY) <= 1) return true;
        return false;
      });
      if (stepPortal) {
        if (stepPortal.minLevel && player.level < stepPortal.minLevel) {
          soundEngine.playSfx('error');
          showToast(`🔒 Requiere Nivel ${stepPortal.minLevel} para cruzar a ${stepPortal.label}`);
          return;
        }
        portalCooldownRef.current = Date.now() + 1500; // 🛡️ 1.5s de protección para evitar bucles
        soundEngine.playSfx('levelup');
        showToast(`🚪 ${stepPortal.label}...`);
        setTimeout(() => {
          onChangeZone(stepPortal.targetZoneId);
          onMove(stepPortal.targetPos);
        }, 120);
        return;
      }
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

    // ⚔️ Note: Turn-based random encounters are disabled in favor of real-time overworld ARPG combat
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

  useEffect(() => {
    const container = document.getElementById('overworld-root');
    if (!container) return;
    const handler = (e: TouchEvent) => { if (e.cancelable) e.preventDefault(); };
    container.addEventListener('touchmove', handler, { passive: false });
    return () => container.removeEventListener('touchmove', handler);
  }, []);

  return (
    <div
      id="overworld-root"
      className="relative w-full h-full bg-slate-950 overflow-hidden select-none touch-none"
      style={{ touchAction: 'none' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 🌟 1. 2.5D RETRO PIXEL ART REAL-TIME ARPG MOTOR - 100% Fullscreen Viewport */}
      <div className="absolute inset-0 w-full h-full">
        <PixelMapCanvas
          currentZone={currentZone}
          playerPos={playerPos}
          player={player}
          equipment={inventory.equipment}
          facingDir={facingDir}
          openedChests={openedChests}
          defeatedBosses={defeatedBosses}
          onPlayerMove={onMove}
          onEnemyKilled={handleEnemyKilled}
          onPlayerDamaged={handlePlayerDamaged}
          onLootCollected={handleLootCollected}
          onBossStateChange={handleBossStateChange}
          combatActionRef={combatActionRef}
        />
      </div>

      {/* ⚔️ 2. REAL-TIME ARPG COMBAT ACTION CONTROLS HUD */}
      <ActionCombatControls
        heroClass={player.heroClass}
        currentMp={player.mp}
        maxMp={player.maxMp}
        onBasicAttack={() => {
          combatActionRef.current?.triggerBasicAttack();
          handleInteract();
        }}
        onUseSkill={(skill) => {
          if (player.mp < skill.manaCost) return false;
          player.mp = Math.max(0, player.mp - skill.manaCost);
          return combatActionRef.current?.triggerSkill(skill) || false;
        }}
        activeBoss={activeBoss}
      />

      {/* 2. Top-Left: Player Hero & Vitals Dark Fantasy Beveled Box (Protegido con Safe Area) */}
      <div
        className={`absolute z-20 pointer-events-auto flex items-center gap-2 bg-[#0e0d18]/95 border-2 border-amber-600/70 rounded-xl sm:rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.85)] backdrop-blur-md font-mono transition-all origin-top-left ${
          isMobileLandscape
            ? 'scale-70 p-1.5 min-w-[210px] max-w-[260px]'
            : 'p-2 sm:p-2.5 min-w-[210px] sm:min-w-[270px] max-w-[310px]'
        }`}
        style={{
          top: isMobileLandscape ? 'max(0.25rem, env(safe-area-inset-top, 0.25rem))' : 'max(0.5rem, env(safe-area-inset-top, 0.5rem))',
          left: 'max(0.5rem, env(safe-area-inset-left, 0.5rem))',
        }}
      >
        {/* Hero Class Emblem */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-600/30 via-slate-900 to-slate-950 border border-amber-400/60 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 shadow-inner">
          {player.heroClass === 'Guerrero' ? '⚔️' : player.heroClass === 'Mago' ? '🪄' : player.heroClass === 'Pícaro' ? '🗡️' : player.heroClass === 'Paladín' ? '🛡️' : '🏹'}
        </div>

        {/* Hero Info & Vitals */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          {/* Header Row: Name, Level, Gold */}
          <div className="flex items-center justify-between text-xs font-bold gap-1 leading-none">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-amber-300 font-black truncate max-w-[80px] sm:max-w-[110px] text-xs sm:text-sm">
                {player.name}
              </span>
              <span className="text-amber-400 text-[10px] sm:text-[11px] font-black bg-[#1f1a38] px-1.5 py-0.5 rounded border border-amber-500/40">
                Nv.{player.level}
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-yellow-300 font-black text-[11px] sm:text-xs">
              <span>🪙</span>
              <span>{player.gold.toLocaleString()}G</span>
            </div>
          </div>

          {/* Health Bar */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-black leading-none mb-0.5">
              <span className="text-red-300 flex items-center gap-0.5">
                <Heart className="w-2.5 h-2.5 text-red-400 fill-red-400" />
                <span>Salud:</span>
              </span>
              <span className="text-red-200">
                {player.hp}/{player.maxHp} ({Math.round(Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100)))}%)
              </span>
            </div>
            <div className="w-full bg-[#06060c] rounded-full h-1.5 sm:h-2 overflow-hidden border border-red-950 p-[1px] shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-700 via-rose-500 to-red-400 transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                style={{ width: `${Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100))}%` }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-black leading-none mb-0.5">
              <span className="text-cyan-300 flex items-center gap-0.5">
                <Droplet className="w-2.5 h-2.5 text-cyan-400 fill-cyan-400" />
                <span>Maná:</span>
              </span>
              <span className="text-cyan-200">
                {player.mp}/{player.maxMp} ({Math.round(Math.max(0, Math.min(100, (player.mp / player.maxMp) * 100)))}%)
              </span>
            </div>
            <div className="w-full bg-[#06060c] rounded-full h-1.5 sm:h-2 overflow-hidden border border-cyan-950 p-[1px] shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-700 via-indigo-500 to-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.7)]"
                style={{ width: `${Math.max(0, Math.min(100, (player.mp / player.maxMp) * 100))}%` }}
              />
            </div>
          </div>

          {/* Experience (EXP) Bar */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-black leading-none mb-0.5">
              <span className="text-purple-300 flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                <span>EXP:</span>
              </span>
              <span className="text-purple-200">
                {player.exp}/{player.maxExp} ({Math.round(Math.max(0, Math.min(100, (player.exp / player.maxExp) * 100)))}%)
              </span>
            </div>
            <div className="w-full bg-[#06060c] rounded-full h-1 sm:h-1.5 overflow-hidden border border-purple-950 p-[1px] shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-400 to-amber-300 transition-all duration-300 shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                style={{ width: `${Math.max(0, Math.min(100, (player.exp / player.maxExp) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top-Center: Resources & Date Capsule (Glassmorphism) */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto hidden md:flex items-center gap-2.5 bg-slate-950/75 border border-amber-500/50 rounded-full px-3.5 py-1 shadow-2xl backdrop-blur-md font-mono text-xs text-amber-200"
        style={{
          top: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))',
        }}
      >
        <div className="flex items-center gap-1" title="Madera">
          <span>🪵</span>
          <span className="font-bold">{(player.resources?.wood || 0).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1" title="Piedra">
          <span>🪨</span>
          <span className="font-bold">{(player.resources?.stone || 0).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1" title="Cosechas">
          <span>🥕</span>
          <span className="font-bold">{(player.resources?.crops || 0).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1" title="Gemas">
          <span>💎</span>
          <span className="font-bold">{(player.resources?.gems || 0).toLocaleString()}</span>
        </div>
        <div className="h-3 w-px bg-amber-500/40 mx-0.5" />
        <div className="flex items-center gap-1 text-amber-300">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-bold">D15, Primavera</span>
        </div>
      </div>

      <div
        className={`absolute z-20 pointer-events-auto flex flex-col items-end gap-1 font-mono transition-all origin-top-right ${
          isMobileLandscape ? 'scale-70' : ''
        }`}
        style={{
          top: isMobileLandscape ? 'max(0.25rem, env(safe-area-inset-top, 0.25rem))' : 'max(0.5rem, env(safe-area-inset-top, 0.5rem))',
          right: 'max(0.5rem, env(safe-area-inset-right, 0.5rem))',
        }}
      >
        {/* System Bar Quick Controls (Optimizado Táctil Móvil Ergonómico y Compacto) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Fast-Travel Zone Button (Visible en PC y tablets, en móvil disponible en Menú) */}
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              soundEngine.playSfx('select');
              setShowZoneTravelModal(true);
            }}
            className="hidden md:flex h-8 sm:h-9 px-2.5 sm:px-3 bg-[#0e0d18]/95 hover:bg-[#1f1a38] active:scale-90 text-amber-300 rounded-xl border-2 border-amber-600/70 shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-xs font-black backdrop-blur-md items-center gap-1.5 transition select-none"
            style={{ touchAction: 'manipulation' }}
            title="Viaje Rápido entre Zonas"
            aria-label="Viaje Zonas"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="text-[11px] sm:text-xs">Zonas</span>
          </button>

          {/* Quick Save Button */}
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              soundEngine.playSfx('levelup');
              onAutoSave();
              showToast(`💾 ¡Partida Guardada en Ranura ${activeSlotIndex + 1}!`);
            }}
            className="h-8 sm:h-9 px-2 sm:px-2.5 bg-emerald-950/95 hover:bg-emerald-900 active:scale-90 text-emerald-200 rounded-xl border-2 border-emerald-500/70 shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-xs font-black backdrop-blur-md flex items-center gap-1 transition select-none"
            style={{ touchAction: 'manipulation' }}
            title={`Guardar partida (Ranura ${activeSlotIndex + 1})`}
            aria-label="Guardar Partida"
          >
            <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="hidden sm:inline text-[11px] sm:text-xs">Guardar</span>
          </button>

          {/* Unified Game Menu Button */}
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              soundEngine.playSfx('select');
              setShowGameMenuModal(true);
            }}
            className="relative h-8 sm:h-9 px-2 sm:px-2.5 bg-[#0e0d18]/95 hover:bg-[#1f1a38] active:scale-90 text-amber-300 rounded-xl border-2 border-amber-600/70 shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-xs font-black backdrop-blur-md flex items-center gap-1 transition select-none"
            style={{ touchAction: 'manipulation' }}
            title="Abrir Menú Principal del Juego"
            aria-label="Abrir Menú"
          >
            <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="text-[11px] sm:text-xs">Menú</span>
            {unclaimedAchievementsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950 shadow animate-bounce border border-slate-950">
                {unclaimedAchievementsCount}
              </span>
            )}
          </button>

          {/* Minimap Toggle */}
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              soundEngine.playSfx('select');
              setShowMinimap(!showMinimap);
            }}
            className={`h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl border-2 shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-xs font-black backdrop-blur-md flex items-center justify-center transition active:scale-90 select-none ${
              showMinimap
                ? 'bg-[#0e0d18]/95 border-amber-600/70 text-amber-300 hover:bg-[#1f1a38]'
                : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            style={{ touchAction: 'manipulation' }}
            title="Mostrar / Ocultar Minimapa"
            aria-label="Alternar Minimapa"
          >
            <Compass className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Minimap Display (Visible por defecto, optimizado en móvil) */}
        {showMinimap && (
          <div className="origin-top-right scale-90 sm:scale-100 transition-transform">
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

      {/* 5. Left: Collapsible Active Quest Tracker Pill (Píldora Plegable No Invasiva) */}
      {(() => {
        const activeQuestId = (acceptedQuests && acceptedQuests.find((id) => !completedQuests.includes(id))) || 'q_main_forest_1';
        const currentQuest = ALL_GAME_QUESTS.find((q) => q.id === activeQuestId) || ALL_GAME_QUESTS[0];
        if (!currentQuest) return null;

        return (
          <div
            className={`absolute z-20 pointer-events-auto transition-all origin-top-left ${
              isMobileLandscape ? 'scale-70 max-w-[210px]' : 'max-w-[190px] sm:max-w-[260px]'
            }`}
            style={{
              top: isMobileLandscape
                ? 'calc(max(0.25rem, env(safe-area-inset-top, 0.25rem)) + 74px)'
                : 'calc(max(0.5rem, env(safe-area-inset-top, 0.5rem)) + 120px)',
              left: 'max(0.5rem, env(safe-area-inset-left, 0.5rem))',
            }}
          >
            {isQuestExpanded ? (
              <div className="bg-[#0e0d18]/95 border-2 border-amber-600/70 rounded-xl p-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.85)] backdrop-blur-md font-mono animate-fade-in">
                <div className="flex items-center justify-between gap-1 text-[10px] text-amber-400 font-bold uppercase pb-1 border-b border-amber-600/40">
                  <div className="flex items-center gap-1">
                    <Scroll className="w-3.5 h-3.5 text-amber-400" />
                    <span>Misión Activa</span>
                  </div>
                  <button
                    onClick={() => setIsQuestExpanded(false)}
                    className="text-slate-400 hover:text-slate-200 px-1 text-xs"
                    title="Plegar Misión"
                  >
                    ▲
                  </button>
                </div>
                <div className="text-[11px] font-black text-amber-200 truncate mt-1">
                  {currentQuest.title}
                </div>
                <div className="text-[9px] text-slate-300 line-clamp-3 mt-0.5 leading-relaxed">
                  {currentQuest.description}
                </div>
                <button
                  onClick={() => {
                    soundEngine.playSfx('select');
                    setIsQuestLogOpen(true);
                  }}
                  className="mt-2 w-full py-1 text-[9px] bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 text-amber-300 rounded-lg font-bold border border-amber-500/50 text-center transition"
                >
                  Ver Diario
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsQuestExpanded(true)}
                className="flex items-center gap-1.5 bg-[#0e0d18]/95 hover:bg-[#19162e] active:scale-95 border-2 border-amber-600/70 rounded-xl px-2.5 py-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.8)] backdrop-blur-md font-mono text-[10px] text-amber-300 font-bold transition"
                title="Desplegar Misión Activa"
              >
                <Scroll className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate max-w-[100px] sm:max-w-[150px]">{currentQuest.title}</span>
                <span className="text-[9px] text-amber-400/80">▾</span>
              </button>
            )}
          </div>
        );
      })()}

      {/* 6. Mobile D-Pad Overlay (Enlarged & Semi-Transparent Glassmorphic HUD) */}
      <div
        className={`absolute z-20 pointer-events-auto select-none transition-all origin-bottom-left ${
          isMobileLandscape ? 'scale-75' : ''
        }`}
        style={{
          bottom: isMobileLandscape
            ? 'max(0.25rem, env(safe-area-inset-bottom, 0.25rem))'
            : 'calc(max(0.5rem, env(safe-area-inset-bottom, 0.5rem)) + 60px)',
          left: 'max(0.5rem, env(safe-area-inset-left, 0.5rem))',
          touchAction: 'none',
        }}
      >
        <div className="grid grid-cols-3 gap-1.5 w-36 h-36 sm:w-44 sm:h-44 bg-black/35 p-1.5 sm:p-2 rounded-full border-2 border-amber-500/30 backdrop-blur-[2px] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
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
            className="bg-white/10 active:bg-amber-500/60 hover:bg-white/20 text-amber-300 active:text-slate-950 rounded-t-full border border-amber-400/30 flex items-center justify-center text-lg sm:text-2xl font-black shadow-md active:scale-95 transition-all select-none"
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
            className="bg-white/10 active:bg-amber-500/60 hover:bg-white/20 text-amber-300 active:text-slate-950 rounded-l-full border border-amber-400/30 flex items-center justify-center text-lg sm:text-2xl font-black shadow-md active:scale-95 transition-all select-none"
            style={{ touchAction: 'none' }}
            aria-label="Mover Izquierda"
          >
            ◄
          </button>
          {/* Neutral Center Pivot Guide */}
          <div className="flex items-center justify-center text-amber-400/40 text-sm sm:text-base font-black select-none pointer-events-none">
            ◉
          </div>
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
            className="bg-white/10 active:bg-amber-500/60 hover:bg-white/20 text-amber-300 active:text-slate-950 rounded-r-full border border-amber-400/30 flex items-center justify-center text-lg sm:text-2xl font-black shadow-md active:scale-95 transition-all select-none"
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
            className="bg-white/10 active:bg-amber-500/60 hover:bg-white/20 text-amber-300 active:text-slate-950 rounded-b-full border border-amber-400/30 flex items-center justify-center text-lg sm:text-2xl font-black shadow-md active:scale-95 transition-all select-none"
            style={{ touchAction: 'none' }}
            aria-label="Mover Abajo"
          >
            ▼
          </button>
          <div />
        </div>
      </div>

      {/* 8. Bottom Center: Floating Glassmorphic Hotbar (Ubicada en la base inferior) */}
      <div
        className={`absolute z-20 pointer-events-auto left-1/2 -translate-x-1/2 transition-all origin-bottom bottom-[max(0.25rem,env(safe-area-inset-bottom,0.25rem))] sm:bottom-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))] ${
          isMobileLandscape ? 'scale-75' : 'scale-90 sm:scale-100'
        }`}
      >
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
      </div>

      {/* Interactive Banner Toast / Prompt (Ubicado sobre el D-Pad y los botones de acción) */}
      {interactPrompt && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm bg-slate-950/95 border-2 border-amber-400 rounded-xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-md text-center text-xs sm:text-sm font-mono text-amber-300 animate-pulse z-30 pointer-events-none"
          style={{
            bottom: isMobileLandscape
              ? 'calc(max(0.25rem, env(safe-area-inset-bottom, 0.25rem)) + 70px)'
              : 'calc(max(0.5rem, env(safe-area-inset-bottom, 0.5rem)) + 215px)',
          }}
        >
          {interactPrompt}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-full font-mono font-bold text-xs shadow-2xl animate-fade-in z-40 pointer-events-none border border-amber-300"
          style={{
            top: 'calc(max(0.5rem, env(safe-area-inset-top, 0.5rem)) + 52px)',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Unified RPG Game Menu Modal */}
      {showGameMenuModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#0e0d18] border-2 border-amber-600/70 rounded-2xl p-3.5 sm:p-5 w-full max-w-xl shadow-2xl font-mono text-slate-100 flex flex-col max-h-[90dvh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-600/40 pb-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm sm:text-base font-black text-amber-300">Menú Principal del Reino</h2>
              </div>
              <button
                onClick={() => setShowGameMenuModal(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Options Grid (2 Columnas en Landscape / Desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 overflow-y-auto flex-1 pr-1">
              {/* Mochila e Inventario */}
              <button
                onClick={() => {
                  soundEngine.playSfx('select');
                  setShowGameMenuModal(false);
                  onOpenInventory();
                }}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-[#141224] hover:bg-[#1f1a38] active:scale-98 border border-amber-500/50 rounded-xl text-amber-200 font-bold transition shadow text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <span>Mochila e Inventario</span>
                </div>
                <span className="text-[10px] text-slate-400">Equipo</span>
              </button>

              {/* Bazar y Comercio */}
              <button
                onClick={() => {
                  soundEngine.playSfx('select');
                  setShowGameMenuModal(false);
                  onOpenShop();
                }}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-[#141224] hover:bg-[#1f1a38] active:scale-98 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold transition shadow text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  <span>Bazar y Tienda</span>
                </div>
                <span className="text-[10px] text-emerald-400">Comercio</span>
              </button>

              {/* Viaje Rápido entre Zonas */}
              <button
                onClick={() => {
                  soundEngine.playSfx('select');
                  setShowGameMenuModal(false);
                  setShowZoneTravelModal(true);
                }}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-[#141224] hover:bg-[#1f1a38] active:scale-98 border border-amber-500/50 rounded-xl text-amber-200 font-bold transition shadow text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <span>Viaje entre Zonas</span>
                </div>
                <span className="text-[10px] text-amber-300">Mapa</span>
              </button>

              {/* Guardar Partida */}
              <button
                onClick={() => {
                  soundEngine.playSfx('levelup');
                  onAutoSave();
                  showToast(`💾 ¡Partida Guardada en Ranura ${activeSlotIndex + 1}!`);
                  setShowGameMenuModal(false);
                }}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-emerald-950/80 hover:bg-emerald-900 active:scale-98 border border-emerald-500/60 rounded-xl text-emerald-200 font-bold transition shadow text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  <span>Guardar Partida</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/50">R.{activeSlotIndex + 1}</span>
              </button>

              {/* Logros y Recompensas */}
              <button
                onClick={() => {
                  soundEngine.playSfx('select');
                  setShowGameMenuModal(false);
                  onOpenAchievements();
                }}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-[#141224] hover:bg-[#1f1a38] active:scale-98 border border-amber-500/50 rounded-xl text-amber-200 font-bold transition shadow text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <span>Logros</span>
                </div>
                {unclaimedAchievementsCount > 0 ? (
                  <span className="text-[10px] text-slate-950 font-black bg-amber-400 px-1.5 py-0.5 rounded-full animate-bounce">
                    {unclaimedAchievementsCount} listos
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Premios</span>
                )}
              </button>

              {/* Códice de Lore */}
              <button
                onClick={() => {
                  soundEngine.playSfx('select');
                  setShowGameMenuModal(false);
                  onOpenLoreCodex();
                }}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-[#141224] hover:bg-[#1f1a38] active:scale-98 border border-purple-500/40 rounded-xl text-purple-200 font-bold transition shadow text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                  <span>Códice y Lore</span>
                </div>
                <span className="text-[10px] text-purple-400">Historia</span>
              </button>

              {/* Ranking */}
              <button
                onClick={() => {
                  soundEngine.playSfx('select');
                  setShowGameMenuModal(false);
                  onOpenLeaderboard();
                }}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-[#141224] hover:bg-[#1f1a38] active:scale-98 border border-yellow-500/40 rounded-xl text-yellow-200 font-bold transition shadow text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <span>Clasificación</span>
                </div>
                <span className="text-[10px] text-yellow-400">Top 100</span>
              </button>

              {/* Ajustes */}
              <button
                onClick={() => {
                  soundEngine.playSfx('select');
                  setShowGameMenuModal(false);
                  onOpenSettings();
                }}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-[#141224] hover:bg-[#1f1a38] active:scale-98 border border-slate-600 rounded-xl text-slate-300 font-bold transition shadow text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  <span>Ajustes y Sonido</span>
                </div>
                <span className="text-[10px] text-slate-400">Config</span>
              </button>

              {/* Salir al Título */}
              {onReturnToTitle && (
                <button
                  onClick={() => {
                    onAutoSave();
                    soundEngine.playSfx('select');
                    setShowGameMenuModal(false);
                    onReturnToTitle();
                  }}
                  className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 p-2.5 bg-red-950/70 hover:bg-red-900 active:scale-98 border border-red-600/60 rounded-xl text-red-200 font-bold transition shadow text-xs sm:text-sm mt-1"
                >
                  <span>🚪 Guardar y Salir al Título</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Zone Fast Travel Modal */}
      {showZoneTravelModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/95 border-2 border-amber-500/80 rounded-2xl p-4 sm:p-6 w-full max-w-2xl shadow-2xl font-mono text-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-amber-500/40 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h2 className="text-base sm:text-lg font-black text-amber-300">Mapa del Reino: Viaje Rápido</h2>
              </div>
              <button
                onClick={() => setShowZoneTravelModal(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-amber-500/50">
              {ZONES.filter((z) => !z.isInterior && !z.id.startsWith('subzone_')).map((z) => {
                const unlocked = isZoneUnlocked(z.id, defeatedBosses);
                const requirementMsg = getZoneRequirementMessage(z.id);
                const isCurrent = z.id === currentZone.id;

                return (
                  <button
                    key={z.id}
                    onClick={() => {
                      if (unlocked) {
                        soundEngine.playSfx('select');
                        onChangeZone(z.id);
                        setShowZoneTravelModal(false);
                      } else {
                        soundEngine.playSfx('error');
                        showToast(requirementMsg);
                      }
                    }}
                    className={`p-3 rounded-xl border flex flex-col text-left transition active:scale-98 ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-lg'
                        : unlocked
                        ? 'bg-slate-800/90 hover:bg-slate-750 text-slate-100 border-slate-700 hover:border-amber-500/50'
                        : 'bg-slate-950/80 text-slate-500 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm">
                        {unlocked ? (isCurrent ? '📍 ' : '🗺️ ') : '🔒 '}
                        {z.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                          Zona Actual
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] mt-1 ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                      {unlocked ? z.description : requirementMsg}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
