import React, { useEffect, useState, useCallback } from 'react';
import { PlayerStats, Zone, Inventory, NPC } from '../types';
import { ZONES, areZoneMainQuestsCompleted, ALL_GAME_QUESTS, isZoneUnlocked, getZoneRequirementMessage, GAME_ACHIEVEMENTS, getAchievementProgress } from '../data/gameData';
import { PixelCanvas } from './PixelCanvas';
import { PixelMapCanvas } from './PixelMapCanvas';
import { NPCDialogModal } from './NPCDialogModal';
import { Minimap } from './Minimap';
import { QuestLogModal } from './QuestLogModal';
import { ChestLootModal, ChestLoot } from './ChestLootModal';
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
}) => {
  const [interactPrompt, setInteractPrompt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [facingDir, setFacingDir] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null);
  const [isQuestLogOpen, setIsQuestLogOpen] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [activeChestLoot, setActiveChestLoot] = useState<ChestLoot | null>(null);
  const [exploredTilesByZone, setExploredTilesByZone] = useState<Record<string, Set<string>>>({});

  // Reveal Fog of War on movement (radius of 8-9 tiles)
  useEffect(() => {
    setExploredTilesByZone((prev) => {
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

      if (!changed && prev[currentZone.id]) return prev;
      return {
        ...prev,
        [currentZone.id]: zoneSet,
      };
    });
  }, [playerPos, currentZone.id, currentZone.mapWidth, currentZone.mapHeight]);

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

  // Check interactive tile nearby or on current position
  const checkTileInteraction = useCallback(
    (x: number, y: number) => {
      const tile = currentZone.tileData[y]?.[x];
      const chestId = `${currentZone.id}_${x}_${y}`;

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

      if (tile === 4) {
        setInteractPrompt('🛒 Puesto de Mercader (Presiona A / Espacio para Comprar)');
      } else if (tile === 5) {
        setInteractPrompt('🏨 Taberna del Viajero (Presiona A / Espacio para Descansar por 10 Oro)');
      } else if (tile === 6) {
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
      } else if (tile === 7) {
        if (openedChests.includes(chestId)) {
          setInteractPrompt('📦 Cofre Vacío');
        } else {
          setInteractPrompt('🎁 Cofre del Tesoro (Presiona A / Espacio para Abrir)');
        }
      } else if (tile === 8) {
        if (openedChests.includes(chestId)) {
          setInteractPrompt('🏡 Cabaña de Aldeano (Visitada)');
        } else {
          setInteractPrompt('🏡 Cabaña de Aldeano (Presiona A / Espacio para Descansar)');
        }
      } else if (tile === 9) {
        if (openedChests.includes(chestId)) {
          setInteractPrompt('🌾 Molino de Viento (Agotado)');
        } else {
          setInteractPrompt('🌾 Molino de Viento (Presiona A / Espacio para Reclamar Harina & Fortuna)');
        }
      } else if (tile === 10) {
        setInteractPrompt('🪣 Pozo de Agua Fresca (Presiona A / Espacio para Beber y Restaurar HP/MP)');
      } else if (tile === 11) {
        setInteractPrompt('🔨 Herrería & Forja de la Aldea (Presiona A / Espacio para Comprar Equipo)');
      } else {
        setInteractPrompt(null);
      }
    },
    [currentZone, isBossDefeatedInZone, openedChests, completedQuests, findNearbyChest]
  );

  useEffect(() => {
    checkTileInteraction(playerPos.x, playerPos.y);
  }, [playerPos, checkTileInteraction]);

  // Execute interact action
  const handleInteract = () => {
    const tile = currentZone.tileData[playerPos.y]?.[playerPos.x];
    const chestId = `${currentZone.id}_${playerPos.x}_${playerPos.y}`;

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

    if (tile === 4) {
      soundEngine.playSfx('select');
      onOpenShop();
    } else if (tile === 5) {
      soundEngine.playSfx('heal');
      onHealAtInn();
      showToast('✨ ¡Has descansado en la taberna! HP y MP restaurados al 100%.');
    } else if (tile === 6) {
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
    } else if (tile === 7) {
      if (!openedChests.includes(chestId)) {
        soundEngine.playSfx('chest');
        const loot = onOpenChest(chestId);
        if (loot) {
          setActiveChestLoot(loot);
        }
      }
    } else if (tile === 8) {
      if (!openedChests.includes(chestId)) {
        soundEngine.playSfx('level_up');
        onOpenChest(chestId);
        onHealAtInn();
        showToast('🏡 ¡Descanso en la cabaña! HP y MP Restaurados al 100%.');
      }
    } else if (tile === 9) {
      if (!openedChests.includes(chestId)) {
        soundEngine.playSfx('gold');
        onOpenChest(chestId);
        showToast('🌾 ¡Molino de Viento! Has recolectado provisiones y oro.');
      }
    } else if (tile === 10) {
      soundEngine.playSfx('heal');
      onHealAtInn();
      showToast('🪣 ¡Bebiste del pozo de agua fresca! HP y MP restaurados.');
    } else if (tile === 11) {
      soundEngine.playSfx('select');
      onOpenShop();
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

    // Block collision (1: Wall/Tree/Rock, 3: Water/Lava)
    if (targetTile === 1 || targetTile === 3) {
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

    // Step counter management
    if (safeStepsRemaining > 0) {
      setSafeStepsRemaining((prev) => prev - 1);
    }

    // NATURAL ORGANIC COMBAT ENCOUNTERS:
    // Safe POI tiles (Shops, Inns, Wells, Forges, Portals, Chests) are ALWAYS 100% safe.
    const isSpecialPoiTile = [4, 5, 6, 7, 8, 9, 10, 11].includes(targetTile);

    if (!isSpecialPoiTile && safeStepsRemaining <= 0) {
      let encounterChance = 0;

      if (currentZone.id === 'zone_forest') {
        // Village center is safe (y <= 12 on road)
        if (targetTile === 0) {
          encounterChance = newY >= 18 ? 0.09 : 0.06;
        } else if (targetTile === 2 && newY > 14) {
          encounterChance = 0.04;
        }
      } else if (currentZone.id === 'zone_cave') {
        // Garrison entrance (y <= 7) is safe
        if (newY > 7) {
          encounterChance = targetTile === 0 ? 0.16 : 0.11;
        }
      } else if (currentZone.id === 'zone_volcano') {
        // North Siege Camp (y <= 6) is safe
        if (newY > 6) {
          encounterChance = targetTile === 0 ? 0.18 : 0.14;
        }
      } else if (currentZone.id === 'zone_castle') {
        // NW Balcony camp (y <= 4 && x <= 12) is safe
        const isCamp = newY <= 4 && newX <= 12;
        if (!isCamp) {
          encounterChance = targetTile === 0 ? 0.20 : 0.15;
        }
      }

      if (encounterChance > 0 && Math.random() < encounterChance) {
        // 6 steps of grace after battle so you have room to move
        setSafeStepsRemaining(6);
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
          } else {
            soundEngine.playSfx('select');
            onStartBattle(false); // Practice encounter option
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
      <div className="w-full flex flex-col gap-1 sm:gap-1.5 p-1.5 sm:p-2 bg-slate-900/90 rounded-lg border border-slate-800 flex-shrink-0">
        {/* Row 1: Title and Utility Action Buttons */}
        <div className="w-full flex items-center justify-between gap-1.5">
          <div className="flex items-center space-x-1.5 min-w-0">
            <div
              className="w-3 h-3 rounded-full animate-pulse flex-shrink-0"
              style={{ backgroundColor: currentZone.themeColor }}
            />
            <div className="min-w-0">
              <h2 className="text-xs sm:text-base font-bold tracking-wide text-amber-400 font-mono truncate">
                {currentZone.name}
              </h2>
            </div>
          </div>

          {/* Quick Utility Action Buttons */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button
              onClick={() => {
                soundEngine.playSfx('select');
                onOpenLoreCodex();
              }}
              className="p-1 sm:p-1.5 bg-gradient-to-r from-amber-950/80 to-amber-900/60 hover:from-amber-900 active:scale-95 text-amber-300 rounded border border-amber-500/50 shadow-md transition flex items-center gap-1 text-[11px] font-mono"
              title="Abrir Códice de Lore"
            >
              <Scroll className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold hidden md:inline">Códice</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playSfx('select');
                onOpenLeaderboard();
              }}
              className="p-1 sm:p-1.5 bg-amber-600/20 hover:bg-amber-600/40 active:scale-95 text-amber-300 rounded border border-amber-500/40 transition flex items-center gap-1 text-[11px] font-mono"
              title="Ver Clasificación"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Ranking</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playSfx('select');
                onOpenAchievements();
              }}
              className="relative p-1 sm:p-1.5 bg-gradient-to-r from-amber-600/25 to-yellow-600/20 hover:from-amber-600/45 active:scale-95 text-amber-300 rounded border border-amber-500/50 shadow-md transition flex items-center gap-1 text-[11px] font-mono"
              title="Ver Logros y Recompensas"
            >
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-bold hidden md:inline">Logros</span>
              {unclaimedAchievementsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950 shadow animate-bounce">
                  {unclaimedAchievementsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                soundEngine.playSfx('select');
                onOpenSettings();
              }}
              className="p-1 sm:p-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded border border-slate-700 text-slate-300 transition flex items-center"
              title="Ajustes"
            >
              <Gamepad className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Zone Selector Tabs (8 Regions) */}
        <div className="w-full flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 overflow-x-auto scrollbar-thin scrollbar-thumb-amber-500/50">
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
                className={`py-1 px-2 text-[10px] sm:text-xs rounded font-mono flex items-center justify-center gap-1 transition-all whitespace-nowrap active:scale-95 flex-shrink-0 ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : unlocked
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-slate-900/90 text-slate-500 border border-slate-800/80 opacity-75'
                }`}
                title={unlocked ? z.name : requirementMsg}
              >
                {!unlocked ? <span className="text-[10px]">🔒</span> : <span className="text-[10px]">📍</span>}
                <span>{shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Main Stats Bar (Single Row) */}
      <div className="w-full flex items-center justify-between gap-1 sm:gap-2 my-0.5 p-1 sm:p-1.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[10px] sm:text-xs font-mono flex-shrink-0">
        {/* Player Name & Class */}
        <div className="flex items-center space-x-1 flex-shrink-0 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
          <span className="text-xs">{player.heroClass === 'Guerrero' ? '⚔️' : player.heroClass === 'Mago' ? '🪄' : '🗡️'}</span>
          <span className="font-bold text-amber-300 truncate max-w-[65px] sm:max-w-none">{player.name}</span>
          <span className="text-slate-400 text-[9px] sm:text-[10px]">Nv.{player.level}</span>
        </div>

        {/* HP Bar */}
        <div className="flex-1 min-w-[45px] sm:min-w-[70px] bg-slate-950/80 px-1 py-0.5 rounded border border-slate-800">
          <div className="flex justify-between text-emerald-400 font-bold text-[8px] sm:text-[9px]">
            <span>HP</span>
            <span>{player.hp}/{player.maxHp}</span>
          </div>
          <div className="w-full bg-slate-800 h-1 sm:h-1.5 rounded-full overflow-hidden mt-0.5">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, (player.hp / player.maxHp) * 100))}%` }}
            />
          </div>
        </div>

        {/* MP Bar */}
        <div className="flex-1 min-w-[45px] sm:min-w-[70px] bg-slate-950/80 px-1 py-0.5 rounded border border-slate-800">
          <div className="flex justify-between text-sky-400 font-bold text-[8px] sm:text-[9px]">
            <span>MP</span>
            <span>{player.mp}/{player.maxMp}</span>
          </div>
          <div className="w-full bg-slate-800 h-1 sm:h-1.5 rounded-full overflow-hidden mt-0.5">
            <div
              className="bg-sky-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, (player.mp / player.maxMp) * 100))}%` }}
            />
          </div>
        </div>

        {/* EXP Bar (Next Level Progress) */}
        <div
          className="flex-1 min-w-[45px] sm:min-w-[75px] bg-slate-950/80 px-1 py-0.5 rounded border border-purple-900/50 hover:border-purple-500/60 transition-colors"
          title={`EXP: ${player.exp} / ${player.maxExp} (Faltan ${Math.max(0, player.maxExp - player.exp)} EXP para Nv.${player.level + 1})`}
        >
          <div className="flex justify-between text-purple-300 font-bold text-[8px] sm:text-[9px]">
            <span className="flex items-center gap-0.5">
              <span>EXP</span>
              <span className="text-[7px] text-purple-400 hidden lg:inline">(-{Math.max(0, player.maxExp - player.exp)})</span>
            </span>
            <span>{player.exp}/{player.maxExp}</span>
          </div>
          <div className="w-full bg-slate-800 h-1 sm:h-1.5 rounded-full overflow-hidden mt-0.5">
            <div
              className="bg-gradient-to-r from-purple-500 via-fuchsia-400 to-amber-300 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, (player.exp / player.maxExp) * 100))}%` }}
            />
          </div>
        </div>

        {/* Gold & Save */}
        <div className="flex items-center space-x-1 flex-shrink-0 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
          <span className="text-amber-400 font-bold text-[10px] sm:text-xs">💰 {player.gold}G</span>
          <button
            onClick={() => {
              onAutoSave();
              showToast('💾 ¡Guardado!');
            }}
            className="p-1 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded text-slate-300"
            title="Guardar partida"
          >
            <Save className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Overworld Map Grid View - 3D WebGL MOBA Engine */}
      <div
        className="relative flex-1 min-h-0 w-full my-0.5 sm:my-1 bg-slate-900 border-2 border-slate-700 rounded-xl shadow-inner overflow-hidden flex flex-col justify-center touch-none select-none"
        style={{ touchAction: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => {
          if (e.cancelable) e.preventDefault();
        }}
        onTouchEnd={handleTouchEnd}
      >
        <PixelMapCanvas
          currentZone={currentZone}
          playerPos={playerPos}
          player={player}
          equipment={inventory.equipment}
          openedChests={openedChests}
          activeShrines={[]}
          onPlayerMove={(newPos) => {
            onMove(newPos);
          }}
          onInteract={handleInteract}
        />

        {/* Floating Minimap Overlay in Top-Right Corner (Collapsible for Mobile) */}
        <div className="absolute top-2 right-2 z-20 pointer-events-auto flex flex-col items-end">
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
            className="mb-1 px-2 py-1 bg-slate-950/90 active:bg-amber-500 active:text-slate-950 hover:bg-slate-800 border border-amber-500/60 rounded text-[10px] font-mono text-amber-300 shadow-lg flex items-center gap-1 backdrop-blur-sm transition"
            title="Mostrar / Ocultar Minimapa"
          >
            <Compass className="w-3 h-3 text-amber-400" />
            <span className="font-bold">{showMinimap ? 'Ocultar Mapa' : 'Ver Mapa'}</span>
          </button>
          {showMinimap && (
            <div className="scale-90 sm:scale-100 origin-top-right">
              <Minimap
                currentZone={currentZone}
                playerPos={playerPos}
                openedChests={openedChests}
                defeatedBosses={defeatedBosses}
                exploredTiles={exploredTilesByZone[currentZone.id]}
                onMinimapClick={(targetX, targetY) => {
                  showToast(`📍 Coordenadas exploradas: [${targetX}, ${targetY}]`);
                }}
              />
            </div>
          )}
        </div>

        {/* Floating Touch D-Pad Control Overlay */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-20 pointer-events-auto select-none" style={{ touchAction: 'none' }}>
          <div className="grid grid-cols-3 gap-1 w-28 h-28 sm:w-32 sm:h-32 bg-slate-950/85 p-1 rounded-full border border-amber-500/50 backdrop-blur-md shadow-2xl">
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
              className="bg-slate-800/90 active:bg-amber-500 hover:bg-slate-700 text-amber-300 active:text-slate-950 rounded-t-full border border-slate-600 flex items-center justify-center text-sm sm:text-base font-bold shadow active:scale-90 transition-transform select-none"
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
              className="bg-slate-800/90 active:bg-amber-500 hover:bg-slate-700 text-amber-300 active:text-slate-950 rounded-l-full border border-slate-600 flex items-center justify-center text-sm sm:text-base font-bold shadow active:scale-90 transition-transform select-none"
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
              className="bg-amber-600/90 active:bg-amber-400 text-slate-950 rounded-full font-black text-xs shadow-md border border-amber-400 flex items-center justify-center active:scale-90 transition-transform select-none"
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
              className="bg-slate-800/90 active:bg-amber-500 hover:bg-slate-700 text-amber-300 active:text-slate-950 rounded-r-full border border-slate-600 flex items-center justify-center text-sm sm:text-base font-bold shadow active:scale-90 transition-transform select-none"
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
              className="bg-slate-800/90 active:bg-amber-500 hover:bg-slate-700 text-amber-300 active:text-slate-950 rounded-b-full border border-slate-600 flex items-center justify-center text-sm sm:text-base font-bold shadow active:scale-90 transition-transform select-none"
              style={{ touchAction: 'none' }}
              aria-label="Mover Abajo"
            >
              ▼
            </button>
            <div />
          </div>
        </div>

        {/* Floating Quick Action Buttons on Bottom-Right */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 flex items-center gap-2 pointer-events-auto select-none" style={{ touchAction: 'none' }}>
          <button
            onClick={() => {
              soundEngine.playSfx('select');
              setIsQuestLogOpen(true);
            }}
            className="px-2.5 py-2 bg-slate-900/90 active:bg-amber-600 hover:bg-slate-800 active:scale-95 text-amber-300 rounded-xl border border-amber-500/60 shadow-xl flex items-center space-x-1 font-bold text-xs font-mono backdrop-blur-sm transition select-none"
            style={{ touchAction: 'none' }}
            title="Abrir Diario de Misiones"
          >
            <Scroll className="w-3.5 h-3.5 text-amber-400" />
            <span>Misiones</span>
          </button>

          <button
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleInteract();
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-amber-600 active:from-amber-400 active:to-amber-500 text-slate-950 rounded-full font-black text-base sm:text-lg border-2 border-amber-300 shadow-2xl flex items-center justify-center active:scale-90 transition-transform select-none"
            style={{ touchAction: 'none' }}
            aria-label="Acción A"
          >
            [A]
          </button>
        </div>

        {/* Interactive Banner Toast / Prompt - Placed at Top for Maximum Visibility */}
        {interactPrompt && (
          <div className="absolute top-2 sm:top-3 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm sm:max-w-md bg-slate-950/95 border-2 border-amber-400 rounded-xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-md text-center text-xs sm:text-sm font-mono text-amber-300 animate-pulse z-30 pointer-events-none">
            {interactPrompt}
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-12 sm:top-14 left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-full font-mono font-bold text-xs shadow-2xl animate-fade-in z-40 pointer-events-none border border-amber-300">
            {toastMessage}
          </div>
        )}
      </div>

      {/* Navigation & Action Controls Bar */}
      <div className="w-full grid grid-cols-3 gap-1.5 my-0.5 sm:my-1 flex-shrink-0">
        <button
          onClick={() => {
            soundEngine.playSfx('select');
            onOpenInventory();
          }}
          className="flex items-center justify-center space-x-1.5 py-1.5 sm:py-2 px-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg border border-slate-700 text-amber-300 font-mono text-xs font-bold transition touch-manipulation"
        >
          <Package className="w-3.5 h-3.5 text-amber-400" />
          <span>Inventario</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playSfx('select');
            setIsQuestLogOpen(true);
          }}
          className="flex items-center justify-center space-x-1.5 py-1.5 sm:py-2 px-2 bg-amber-950/80 hover:bg-amber-900/90 active:scale-95 rounded-lg border border-amber-600 text-amber-200 font-mono text-xs font-bold transition touch-manipulation"
        >
          <Scroll className="w-3.5 h-3.5 text-amber-400" />
          <span>Misiones</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playSfx('select');
            onOpenShop();
          }}
          className="flex items-center justify-center space-x-1.5 py-1.5 sm:py-2 px-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg border border-slate-700 text-emerald-300 font-mono text-xs font-bold transition touch-manipulation"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tienda</span>
        </button>
      </div>

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
            const itemSuffix = q?.rewardItemName ? ` y 🎁 ${q.rewardItemName}` : '';
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
            const itemSuffix = q?.rewardItemName ? ` y 🎁 ${q.rewardItemName}` : '';
            showToast(`🎉 ¡Misión Entregada! +${gold} Oro, +${exp} EXP${itemSuffix}`);
          }}
        />
      )}
    </div>
  );
};
