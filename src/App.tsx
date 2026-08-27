import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PlayerStats,
  Inventory,
  HeroClass,
  GameSaveData,
  Enemy,
  Zone,
  Achievement,
  EquipmentItem,
} from './types';
import {
  HERO_CLASSES,
  INITIAL_CONSUMABLES,
  SHOP_CONSUMABLES,
  ZONES,
  ALL_SKILLS,
  SHOP_EQUIPMENT,
  ALL_EQUIPMENT_DATABASE,
  ALL_GAME_QUESTS,
  GAME_LORE_ENTRIES,
  GAME_ACHIEVEMENTS,
  getAchievementProgress,
  getQuestRewardEquipment,
  getQuestRewardConsumable,
  isZoneUnlocked,
  getRequiredExpForLevel,
} from './data/gameData';
import { ChestLoot } from './components/ChestLootModal';
import { TitleScreen } from './components/TitleScreen';
import { OverworldMap } from './components/OverworldMap';
import { BattleScreen } from './components/BattleScreen';
import { InventoryShopModal } from './components/InventoryShopModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { LoreCodexModal } from './components/LoreCodexModal';
import { AchievementsModal } from './components/AchievementsModal';
import { StoryPrologueModal } from './components/StoryPrologueModal';
import { BossVictoryModal, BossVictoryInfo } from './components/BossVictoryModal';
import { soundEngine } from './utils/soundEngine';

const LEGACY_SAVE_KEYS = ['cronicas_retro_rpg_save_v1', 'crónicas_pixel_rpg_save_v1'];
const SLOT_KEY_PREFIX = 'cronicas_pixel_rpg_slot_';
const TOTAL_SLOTS = 5;

const getSlotKey = (slotIndex: number): string => {
  return `${SLOT_KEY_PREFIX}${slotIndex}`;
};

const loadAllSlotsFromStorage = (): (GameSaveData | null)[] => {
  const slots: (GameSaveData | null)[] = [null, null, null, null, null];
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return slots;
  }

  for (let i = 0; i < TOTAL_SLOTS; i++) {
    try {
      const raw = localStorage.getItem(getSlotKey(i));
      if (raw) {
        const parsed: GameSaveData = JSON.parse(raw);
        if (parsed && parsed.player) {
          if (parsed.playerPos && (parsed.playerPos.x >= 150 || parsed.playerPos.y >= 150 || parsed.playerPos.x < 0 || parsed.playerPos.y < 0)) {
            parsed.playerPos = { x: 36, y: 62 };
          }
          slots[i] = { ...parsed, slotIndex: i };
        }
      }
    } catch (e) {
      console.error(`Error loading slot ${i}:`, e);
    }
  }

  // If slot 0 is empty, check legacy save keys
  if (!slots[0]) {
    for (const legacyKey of LEGACY_SAVE_KEYS) {
      try {
        const rawLegacy = localStorage.getItem(legacyKey);
        if (rawLegacy) {
          const parsed: GameSaveData = JSON.parse(rawLegacy);
          if (parsed && parsed.player) {
            if (parsed.playerPos && (parsed.playerPos.x >= 150 || parsed.playerPos.y >= 150 || parsed.playerPos.x < 0 || parsed.playerPos.y < 0)) {
              parsed.playerPos = { x: 36, y: 62 };
            }
            slots[0] = { ...parsed, slotIndex: 0 };
            localStorage.setItem(getSlotKey(0), JSON.stringify(slots[0]));
            break;
          }
        }
      } catch (err) {
        console.error('Legacy migration failed:', err);
      }
    }
  }

  return slots;
}

const INITIAL_LORE_IDS = [
  'lore_intro',
  'lore_hero_warrior',
  'lore_hero_mage',
  'lore_hero_rogue',
  'lore_forest_secret'
];

export default function App() {
  const [gameState, setGameState] = useState<'title' | 'overworld' | 'battle'>('title');

  // Modals state
  const [showShopModal, setShowShopModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLoreModal, setShowLoreModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showPrologueModal, setShowPrologueModal] = useState(false);
  const [activeBossVictory, setActiveBossVictory] = useState<BossVictoryInfo | null>(null);

  // Multi-Slot Character Save System (5 Slots)
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const [characterSlots, setCharacterSlots] = useState<(GameSaveData | null)[]>(loadAllSlotsFromStorage);

  const [achievementNotification, setAchievementNotification] = useState<{
    title: string;
    icon: string;
    rarity: string;
  } | null>(null);

  // Game state
  const [player, setPlayer] = useState<PlayerStats | null>(null);
  const [inventory, setInventory] = useState<Inventory>({
    consumables: JSON.parse(JSON.stringify(INITIAL_CONSUMABLES)),
    equipment: {
      weapon: null,
      shield: null,
      helmet: null,
      armor: null,
      boots: null,
      ring: null,
      amulet: null,
    },
    ownedEquipment: [],
  });
  const [currentZoneId, setCurrentZoneId] = useState<string>('zone_forest');
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 36, y: 62 });
  const [defeatedBosses, setDefeatedBosses] = useState<string[]>([]);
  const [openedChests, setOpenedChests] = useState<string[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [acceptedQuests, setAcceptedQuests] = useState<string[]>([]);
  const [unlockedSkillIds, setUnlockedSkillIds] = useState<string[]>([]);
  const [unlockedLoreIds, setUnlockedLoreIds] = useState<string[]>(INITIAL_LORE_IDS);
  const [defeatedEnemyCounts, setDefeatedEnemyCounts] = useState<Record<string, number>>({});
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [claimedAchievements, setClaimedAchievements] = useState<string[]>([]);
  const [exploredTilesByZone, setExploredTilesByZone] = useState<Record<string, string[]>>({});

  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);

  // Reload slots when title screen is active
  useEffect(() => {
    if (gameState === 'title') {
      const refreshed = loadAllSlotsFromStorage();
      setCharacterSlots(refreshed);
    }
  }, [gameState]);

  const currentZone = ZONES.find((z) => z.id === currentZoneId) || ZONES[0];

  // Helper: Perform Auto-Save
  const triggerAutoSave = useCallback(
    (
      p = player,
      inv = inventory,
      zId = currentZoneId,
      pos = playerPos,
      bosses = defeatedBosses,
      chests = openedChests,
      quests = completedQuests,
      skills = unlockedSkillIds,
      lores = unlockedLoreIds,
      accepted = acceptedQuests,
      achievements = unlockedAchievements,
      claimed = claimedAchievements,
      enemyCounts = defeatedEnemyCounts,
      explored = exploredTilesByZone,
      slotIdx = activeSlotIndex
    ) => {
      if (!p) return;
      try {
        const saveData: GameSaveData = {
          player: p,
          inventory: inv,
          currentZoneId: zId,
          playerPos: pos,
          defeatedBosses: bosses,
          openedChests: chests,
          completedQuests: quests,
          acceptedQuests: accepted,
          unlockedSkills: skills,
          unlockedLoreIds: lores,
          unlockedAchievements: achievements,
          claimedAchievements: claimed,
          defeatedEnemyCounts: enemyCounts,
          exploredTilesByZone: explored,
          playTimeSeconds: 0,
          lastSavedAt: new Date().toISOString(),
          slotIndex: slotIdx,
        };
        localStorage.setItem(getSlotKey(slotIdx), JSON.stringify(saveData));
        setCharacterSlots((prev) => {
          const next = [...prev];
          next[slotIdx] = saveData;
          return next;
        });
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    },
    [player, inventory, currentZoneId, playerPos, defeatedBosses, openedChests, completedQuests, acceptedQuests, unlockedSkillIds, unlockedLoreIds, unlockedAchievements, claimedAchievements, defeatedEnemyCounts, exploredTilesByZone, activeSlotIndex]
  );

  // 🚀 Debounced Auto-Save for Movement (Eliminates CPU Stutter & Synchronous Disk Blocks while moving)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scheduleDebouncedAutoSave = useCallback(
    (newPos?: { x: number; y: number }) => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      autoSaveTimerRef.current = setTimeout(() => {
        triggerAutoSave(player, inventory, currentZoneId, newPos || playerPos);
      }, 2000);
    },
    [triggerAutoSave, player, inventory, currentZoneId, playerPos]
  );

  // Helper: Check and trigger achievements
  const checkAndNotifyAchievements = useCallback(
    (
      p = player,
      inv = inventory,
      bosses = defeatedBosses,
      chests = openedChests,
      quests = completedQuests,
      lores = unlockedLoreIds,
      enemyCounts = defeatedEnemyCounts,
      unlockedAch = unlockedAchievements,
      zId = currentZoneId
    ) => {
      if (!p) return;

      const newlyUnlocked: string[] = [];
      let bannerAch: Achievement | null = null;

      for (const ach of GAME_ACHIEVEMENTS) {
        if (unlockedAch.includes(ach.id) || newlyUnlocked.includes(ach.id)) continue;
        const progress = getAchievementProgress(
          ach,
          p,
          inv,
          bosses,
          chests,
          quests,
          lores,
          enemyCounts,
          [zId]
        );
        if (progress.isCompleted) {
          newlyUnlocked.push(ach.id);
          if (!bannerAch) {
            bannerAch = ach;
          }
        }
      }

      if (newlyUnlocked.length > 0) {
        const updated = [...unlockedAch, ...newlyUnlocked];
        setUnlockedAchievements(updated);
        soundEngine.playSfx('achievement');

        if (bannerAch) {
          setAchievementNotification({
            title: bannerAch.title,
            icon: bannerAch.icon,
            rarity: bannerAch.rarity,
          });
          setTimeout(() => setAchievementNotification(null), 3800);
        }

        triggerAutoSave(
          p,
          inv,
          zId,
          playerPos,
          bosses,
          chests,
          quests,
          unlockedSkillIds,
          lores,
          acceptedQuests,
          updated
        );
      }
    },
    [player, inventory, defeatedBosses, openedChests, completedQuests, unlockedLoreIds, defeatedEnemyCounts, unlockedAchievements, currentZoneId, playerPos, unlockedSkillIds, acceptedQuests, triggerAutoSave]
  );

  // Reactive check for achievements when gameplay conditions change
  useEffect(() => {
    if (!player || gameState === 'title') return;
    checkAndNotifyAchievements();
  }, [
    player?.level,
    player?.gold,
    defeatedBosses.length,
    openedChests.length,
    completedQuests.length,
    unlockedLoreIds.length,
    currentZoneId,
    inventory.equipment.weapon,
    inventory.equipment.armor,
    inventory.equipment.helmet,
    inventory.equipment.boots,
    inventory.equipment.ring,
    defeatedEnemyCounts,
  ]);

  // Start New Game (in specific slot)
  const handleStartNewGame = (
    playerName: string,
    heroClass: HeroClass,
    gender: 'male' | 'female' = 'female',
    slotIndex: number = activeSlotIndex
  ) => {
    setActiveSlotIndex(slotIndex);
    const classConfig = HERO_CLASSES[heroClass];
    const initialPlayerStats: PlayerStats = {
      name: playerName,
      heroClass,
      gender,
      level: 1,
      exp: 0,
      maxExp: getRequiredExpForLevel(1),
      hp: classConfig.baseStats.hp,
      maxHp: classConfig.baseStats.hp,
      mp: classConfig.baseStats.mp,
      maxMp: classConfig.baseStats.mp,
      attack: classConfig.baseStats.attack,
      defense: classConfig.baseStats.defense,
      speed: classConfig.baseStats.speed,
      accuracy: classConfig.baseStats.accuracy ?? 95,
      evasion: classConfig.baseStats.evasion ?? 6,
      critRate: classConfig.baseStats.critRate ?? 10,
      critDamage: classConfig.baseStats.critDamage ?? 175,
      blockRate: classConfig.baseStats.blockRate ?? 0,
      lifesteal: classConfig.baseStats.lifesteal ?? 0,
      mpRegen: classConfig.baseStats.mpRegen ?? 0,
      gold: 10,
      score: 0,
      resources: {
        wood: 5,
        stone: 5,
        crops: 5,
        gems: 0,
      },
    };

    const initialInv: Inventory = {
      consumables: JSON.parse(JSON.stringify(INITIAL_CONSUMABLES)),
      equipment: {
        weapon: null,
        shield: null,
        helmet: null,
        armor: null,
        boots: null,
        ring: null,
        amulet: null,
      },
      ownedEquipment: [],
    };

    // Skills available at level 1
    const lvl1Skills = ALL_SKILLS.filter(
      (s) => (s.heroClass === heroClass || s.heroClass === 'all') && s.minLevel <= 1
    ).map((s) => s.id);

    setPlayer(initialPlayerStats);
    setInventory(initialInv);
    setCurrentZoneId('zone_forest');
    setPlayerPos({ x: 36, y: 62 });
    setDefeatedBosses([]);
    setOpenedChests([]);
    setCompletedQuests([]);
    setAcceptedQuests([]);
    setUnlockedSkillIds(lvl1Skills);
    setUnlockedLoreIds(INITIAL_LORE_IDS);
    setUnlockedAchievements([]);
    setClaimedAchievements([]);
    setDefeatedEnemyCounts({});
    setExploredTilesByZone({});

    setGameState('overworld');
    setShowPrologueModal(true);
    triggerAutoSave(
      initialPlayerStats,
      initialInv,
      'zone_forest',
      { x: 36, y: 62 },
      [],
      [],
      [],
      lvl1Skills,
      INITIAL_LORE_IDS,
      [],
      [],
      [],
      {},
      {},
      slotIndex
    );
  };

  // Start Showcase Game (Modo Creador / Todo Desbloqueado - Nivel 99 y Tier Máximo)
  const handleStartShowcaseGame = (
    playerName: string,
    heroClass: HeroClass,
    gender: 'male' | 'female' = 'female',
    slotIndex: number = activeSlotIndex
  ) => {
    setActiveSlotIndex(slotIndex);
    const classConfig = HERO_CLASSES[heroClass];
    const showcasePlayer: PlayerStats = {
      name: playerName.trim() || classConfig.name,
      heroClass,
      gender,
      level: 99,
      exp: 0,
      maxExp: getRequiredExpForLevel(99),
      hp: 9999,
      maxHp: 9999,
      mp: 2500,
      maxMp: 2500,
      attack: 950,
      defense: 750,
      speed: 160,
      accuracy: 100,
      evasion: 50,
      critRate: 60,
      critDamage: 300,
      blockRate: 60,
      lifesteal: 25,
      mpRegen: 50,
      hpRegen: 50,
      gold: 999999,
      score: 999999,
      resources: {
        wood: 9999,
        stone: 9999,
        crops: 9999,
        gems: 9999,
      },
    };

    const weapon8 = ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_w_excalibur') || ALL_EQUIPMENT_DATABASE[0];
    const shield8 = ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_s_god') || null;
    const helmet8 = ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_h_god') || null;
    const armor8 = ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_a_god') || null;
    const boots8 = ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_b_god') || null;
    const ring8 = ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_r_god') || null;

    const showcaseInv: Inventory = {
      consumables: SHOP_CONSUMABLES.map((c) => ({ ...c, quantity: 50 })),
      equipment: {
        weapon: weapon8,
        shield: shield8,
        helmet: helmet8,
        armor: armor8,
        boots: boots8,
        ring: ring8,
        amulet: null,
      },
      ownedEquipment: [...ALL_EQUIPMENT_DATABASE],
    };

    const allSkillIds = ALL_SKILLS.map((s) => s.id);
    const allLoreIds = GAME_LORE_ENTRIES.map((l) => l.id);
    const allBosses = [
      'Gran Rey Slime',
      'Golem de Obsidiana',
      'Gólem de Obsidiana',
      'Reina Serpiente Gorgona',
      'Dragón Infernal Ignis',
      'Dragon Infernal Ignis',
      'Titán de Escarcha Ymir',
      'Titan de Escarcha Ymir',
      'General de la Muerte Lord Kael',
      'Archilich Malakor del Abismo',
      'Dios Primigenio Cronos',
    ];
    const allQuestIds = ALL_GAME_QUESTS.map((q) => q.id);

    setPlayer(showcasePlayer);
    setInventory(showcaseInv);
    setCurrentZoneId('zone_forest');
    setPlayerPos({ x: 36, y: 62 });
    setDefeatedBosses(allBosses);
    setOpenedChests([]);
    setCompletedQuests(allQuestIds);
    setAcceptedQuests(allQuestIds);
    setUnlockedSkillIds(allSkillIds);
    setUnlockedLoreIds(allLoreIds);

    setGameState('overworld');
    triggerAutoSave(
      showcasePlayer,
      showcaseInv,
      'zone_forest',
      { x: 36, y: 62 },
      allBosses,
      [],
      allQuestIds,
      allSkillIds,
      allLoreIds,
      allQuestIds,
      [],
      [],
      {},
      {},
      slotIndex
    );
  };

  // Unlock all content in current session
  const handleUnlockAllInCurrentGame = () => {
    if (!player) return;
    const upgradedPlayer: PlayerStats = {
      ...player,
      level: 75,
      hp: 3500,
      maxHp: 3500,
      mp: 900,
      maxMp: 900,
      attack: Math.max(player.attack, 420),
      defense: Math.max(player.defense, 310),
      speed: Math.max(player.speed, 120),
      gold: player.gold + 99999,
      score: player.score + 50000,
    };

    const allSkillIds = ALL_SKILLS.map((s) => s.id);
    const allLoreIds = GAME_LORE_ENTRIES.map((l) => l.id);
    const allBosses = [
      'Gran Rey Slime',
      'Golem de Obsidiana',
      'Gólem de Obsidiana',
      'Reina Serpiente Gorgona',
      'Dragón Infernal Ignis',
      'Dragon Infernal Ignis',
      'Titán de Escarcha Ymir',
      'Titan de Escarcha Ymir',
      'General de la Muerte Lord Kael',
      'Archilich Malakor del Abismo',
      'Dios Primigenio Cronos',
    ];
    const allQuestIds = ALL_GAME_QUESTS.map((q) => q.id);

    const upgradedInv: Inventory = {
      ...inventory,
      consumables: SHOP_CONSUMABLES.map((c) => ({ ...c, quantity: Math.max(c.quantity, 50) })),
      ownedEquipment: [...SHOP_EQUIPMENT],
    };

    setPlayer(upgradedPlayer);
    setInventory(upgradedInv);
    setDefeatedBosses(allBosses);
    setCompletedQuests(allQuestIds);
    setAcceptedQuests(allQuestIds);
    setUnlockedSkillIds(allSkillIds);
    setUnlockedLoreIds(allLoreIds);
    setShowSettingsModal(false);

    triggerAutoSave(upgradedPlayer, upgradedInv, currentZoneId, playerPos, allBosses, openedChests, allQuestIds, allSkillIds, allLoreIds, allQuestIds);
  };

  // Resume Saved Game from a specific slot
  const handleResumeGame = (slotIndex: number = activeSlotIndex) => {
    const slots = loadAllSlotsFromStorage();
    const targetSave = slots[slotIndex];
    if (!targetSave || !targetSave.player) return;

    setActiveSlotIndex(slotIndex);

    const safeEquipment = {
      weapon: targetSave.inventory?.equipment?.weapon || null,
      shield: targetSave.inventory?.equipment?.shield || null,
      helmet: targetSave.inventory?.equipment?.helmet || null,
      armor: targetSave.inventory?.equipment?.armor || null,
      boots: targetSave.inventory?.equipment?.boots || null,
      ring: targetSave.inventory?.equipment?.ring || null,
      amulet: targetSave.inventory?.equipment?.amulet || null,
    };
    const safeInventory: Inventory = {
      consumables: targetSave.inventory?.consumables || JSON.parse(JSON.stringify(INITIAL_CONSUMABLES)),
      equipment: safeEquipment,
      ownedEquipment: targetSave.inventory?.ownedEquipment || [],
    };

    setPlayer(targetSave.player);
    setInventory(safeInventory);
    setCurrentZoneId(targetSave.currentZoneId || 'zone_forest');
    const rawPos = targetSave.playerPos || { x: 36, y: 62 };
    const safePos = (rawPos.x >= 150 || rawPos.y >= 150 || rawPos.x < 0 || rawPos.y < 0)
      ? { x: 36, y: 62 }
      : rawPos;
    setPlayerPos(safePos);
    setDefeatedBosses(targetSave.defeatedBosses || []);
    setOpenedChests(targetSave.openedChests || []);
    setCompletedQuests(targetSave.completedQuests || []);
    setAcceptedQuests(targetSave.acceptedQuests || []);
    setUnlockedSkillIds(targetSave.unlockedSkills || []);
    setUnlockedLoreIds(targetSave.unlockedLoreIds || INITIAL_LORE_IDS);
    setUnlockedAchievements(targetSave.unlockedAchievements || []);
    setClaimedAchievements(targetSave.claimedAchievements || []);
    setDefeatedEnemyCounts(targetSave.defeatedEnemyCounts || {});
    setExploredTilesByZone(targetSave.exploredTilesByZone || {});

    setGameState('overworld');
  };

  // Delete Character Slot
  const handleDeleteSlot = (slotIndex: number) => {
    try {
      localStorage.removeItem(getSlotKey(slotIndex));
      if (slotIndex === 0) {
        for (const legacyKey of LEGACY_SAVE_KEYS) {
          localStorage.removeItem(legacyKey);
        }
      }
      setCharacterSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = null;
        return next;
      });
    } catch (e) {
      console.error('Delete slot failed:', e);
    }
  };

  // Return to Title Screen & Save
  const handleReturnToTitle = () => {
    if (player) {
      triggerAutoSave();
    }
    const refreshed = loadAllSlotsFromStorage();
    setCharacterSlots(refreshed);
    setGameState('title');
  };

  // Claim Achievement Reward
  const handleClaimAchievementReward = (achievement: Achievement) => {
    if (!player || claimedAchievements.includes(achievement.id)) return;

    let updatedGold = player.gold + (achievement.rewardGold || 0);
    let updatedExp = player.exp + (achievement.rewardExp || 0);
    let updatedScore = player.score + (achievement.rewardGold || 0) * 2 + (achievement.rewardExp || 0) * 3;
    let updatedLevel = player.level;
    let updatedMaxExp = player.maxExp;
    let updatedHp = player.hp;
    let updatedMaxHp = player.maxHp;
    let updatedMp = player.mp;
    let updatedMaxMp = player.maxMp;
    let updatedAttack = player.attack;
    let updatedDefense = player.defense;
    let updatedSpeed = player.speed;

    // Check level up from EXP
    while (updatedExp >= updatedMaxExp && updatedLevel < 99) {
      updatedExp -= updatedMaxExp;
      updatedLevel += 1;
      updatedMaxExp = getRequiredExpForLevel(updatedLevel);
      updatedMaxHp += 18;
      updatedHp = updatedMaxHp;
      updatedMaxMp += 8;
      updatedMp = updatedMaxMp;
      updatedAttack += 3;
      updatedDefense += 2;
      updatedSpeed += 1;
    }

    const updatedPlayer: PlayerStats = {
      ...player,
      gold: updatedGold,
      exp: updatedExp,
      level: updatedLevel,
      maxExp: updatedMaxExp,
      hp: updatedHp,
      maxHp: updatedMaxHp,
      mp: updatedMp,
      maxMp: updatedMaxMp,
      attack: updatedAttack,
      defense: updatedDefense,
      speed: updatedSpeed,
      score: updatedScore,
    };

    let updatedConsumables = [...inventory.consumables];
    let updatedOwnedEquip = [...inventory.ownedEquipment];

    if (achievement.rewardConsumable) {
      const cIdx = updatedConsumables.findIndex((c) => c.id === achievement.rewardConsumable?.id);
      if (cIdx >= 0) {
        updatedConsumables[cIdx] = {
          ...updatedConsumables[cIdx],
          quantity: updatedConsumables[cIdx].quantity + 1,
        };
      } else {
        updatedConsumables.push({ ...achievement.rewardConsumable, quantity: 1 });
      }
    }

    if (achievement.rewardEquipment) {
      const alreadyOwned = updatedOwnedEquip.some((e) => e.id === achievement.rewardEquipment?.id);
      if (!alreadyOwned) {
        updatedOwnedEquip.push(achievement.rewardEquipment);
      }
    }

    const updatedInv: Inventory = {
      ...inventory,
      consumables: updatedConsumables,
      ownedEquipment: updatedOwnedEquip,
    };

    const nextClaimed = [...claimedAchievements, achievement.id];
    setClaimedAchievements(nextClaimed);
    setPlayer(updatedPlayer);
    setInventory(updatedInv);

    triggerAutoSave(
      updatedPlayer,
      updatedInv,
      currentZoneId,
      playerPos,
      defeatedBosses,
      openedChests,
      completedQuests,
      unlockedSkillIds,
      unlockedLoreIds,
      acceptedQuests,
      unlockedAchievements,
      nextClaimed,
      defeatedEnemyCounts
    );
  };

  // Accept Quest from NPC
  const handleAcceptQuest = (questId: string) => {
    if (acceptedQuests.includes(questId)) return;
    const newAccepted = [...acceptedQuests, questId];
    setAcceptedQuests(newAccepted);
    triggerAutoSave(player, inventory, currentZoneId, playerPos, defeatedBosses, openedChests, completedQuests, unlockedSkillIds, unlockedLoreIds, newAccepted);
  };

  // Claim Quest Reward
  const handleClaimQuestReward = (questId: string, rewardGold: number, rewardExp: number) => {
    if (!player || completedQuests.includes(questId)) return;

    const newCompleted = [...completedQuests, questId];
    setCompletedQuests(newCompleted);

    const questObj = ALL_GAME_QUESTS.find((q) => q.id === questId);
    let updatedConsumables = [...inventory.consumables];
    let updatedOwnedEquipment = [...inventory.ownedEquipment];

    if (questObj) {
      // 1. Reward Equipment
      const rewardEquip = getQuestRewardEquipment(questObj);
      if (rewardEquip) {
        const alreadyHas = updatedOwnedEquipment.some(
          (eq) => eq.id === rewardEquip.id || eq.name.toLowerCase() === rewardEquip.name.toLowerCase()
        );
        if (!alreadyHas) {
          updatedOwnedEquipment.push(rewardEquip);
        }
      }

      // 2. Reward Consumables / Potions
      const rewardConsumable = getQuestRewardConsumable(questObj);
      if (rewardConsumable) {
        const cIdx = updatedConsumables.findIndex(
          (c) => c.id === rewardConsumable.id || c.name.toLowerCase() === rewardConsumable.name.toLowerCase()
        );
        if (cIdx >= 0) {
          updatedConsumables[cIdx] = {
            ...updatedConsumables[cIdx],
            quantity: updatedConsumables[cIdx].quantity + (rewardConsumable.quantity || 1),
          };
        } else {
          updatedConsumables.push({
            ...rewardConsumable,
            quantity: rewardConsumable.quantity || 1,
          });
        }
      }
    }

    const updatedInventory: Inventory = {
      ...inventory,
      consumables: updatedConsumables,
      ownedEquipment: updatedOwnedEquipment,
    };
    setInventory(updatedInventory);

    let newExp = player.exp + rewardExp;
    let newLevel = player.level;
    let newMaxExp = player.maxExp;
    let newHp = player.hp;
    let newMaxHp = player.maxHp;
    let newMp = player.mp;
    let newMaxMp = player.maxMp;
    let newAtk = player.attack;
    let newDef = player.defense;

    // Level up loop if multiple levels earned
    while (newExp >= newMaxExp && newLevel < 99) {
      newLevel += 1;
      newExp -= newMaxExp;
      newMaxExp = getRequiredExpForLevel(newLevel);
      newMaxHp += 18;
      newHp = newMaxHp;
      newMaxMp += 8;
      newMp = newMaxMp;
      newAtk += 3;
      newDef += 2;
    }

    const updatedPlayer = {
      ...player,
      gold: player.gold + rewardGold,
      exp: newExp,
      level: newLevel,
      maxExp: newMaxExp,
      hp: newHp,
      maxHp: newMaxHp,
      mp: newMp,
      maxMp: newMaxMp,
      attack: newAtk,
      defense: newDef,
      score: player.score + 500,
    };

    setPlayer(updatedPlayer);
    triggerAutoSave(updatedPlayer, updatedInventory, currentZoneId, playerPos, defeatedBosses, openedChests, newCompleted, unlockedSkillIds, unlockedLoreIds, acceptedQuests);
  };

  // Start Battle Encounter
  const handleStartBattle = (isBoss: boolean) => {
    if (!player) return;

    let selectedEnemy: Enemy;
    if (isBoss) {
      const boss = currentZone.boss;
      const maxHp = boss.maxHp || boss.hp || 280;
      selectedEnemy = {
        ...boss,
        id: 'boss-' + Date.now(),
        hp: maxHp,
        maxHp: maxHp,
      };
    } else {
      const template = currentZone.enemies[Math.floor(Math.random() * currentZone.enemies.length)];
      const maxHp = template.maxHp || template.hp || 50;
      selectedEnemy = {
        ...template,
        id: 'e-' + Date.now(),
        hp: maxHp,
        maxHp: maxHp,
      };
    }

    setCurrentEnemy(selectedEnemy);
    setGameState('battle');
  };

  // Battle Resolution Handler
  const handleBattleEnd = (result: {
    won: boolean;
    expEarned: number;
    goldEarned: number;
    updatedPlayer: PlayerStats;
    updatedInventory: Inventory;
    newlyUnlockedSkills: typeof ALL_SKILLS;
  }) => {
    let finalPlayer = result.updatedPlayer;
    let finalLore = [...unlockedLoreIds];

    if (result.won) {
      const stoneGained = currentEnemy?.isBoss
        ? 35
        : Math.random() < 0.35
        ? Math.floor(Math.random() * 3) + 1
        : 0;
      const gemsGained = currentEnemy?.isBoss ? 15 : 0;
      finalPlayer = {
        ...finalPlayer,
        resources: {
          wood: finalPlayer.resources?.wood || 0,
          crops: finalPlayer.resources?.crops || 0,
          stone: (finalPlayer.resources?.stone || 0) + stoneGained,
          gems: (finalPlayer.resources?.gems || 0) + gemsGained,
        },
      };
    }

    if (result.won && currentEnemy && !currentEnemy.isBoss) {
      const enemySprite = currentEnemy.spriteType || '';
      const enemyName = currentEnemy.name.toLowerCase();
      setDefeatedEnemyCounts((prev) => ({
        ...prev,
        [enemySprite]: (prev[enemySprite] || 0) + 1,
        [enemyName]: (prev[enemyName] || 0) + 1,
      }));
    }

    if (result.won && currentEnemy?.isBoss) {
      // Mark boss defeated
      const newDefeated = [...defeatedBosses, currentEnemy.name];
      setDefeatedBosses(newDefeated);

      // Unlock Boss Lore
      let bossLoreId: string | null = null;
      if (currentEnemy.name.includes('Slime')) bossLoreId = 'lore_boss_slime';
      else if (currentEnemy.name.includes('Golem') || currentEnemy.name.includes('Gólem')) bossLoreId = 'lore_boss_golem';
      else if (currentEnemy.name.includes('Serpiente') || currentEnemy.name.includes('Gorgona')) bossLoreId = 'lore_boss_serpent';
      else if (currentEnemy.name.includes('Dragón') || currentEnemy.name.includes('Dragon') || currentEnemy.name.includes('Ignis')) bossLoreId = 'lore_boss_dragon';
      else if (currentEnemy.name.includes('Ymir') || currentEnemy.name.includes('Escarcha') || currentEnemy.name.includes('Frost')) bossLoreId = 'lore_boss_frost';
      else if (currentEnemy.name.includes('Kael') || currentEnemy.name.includes('General')) bossLoreId = 'lore_boss_death_knight';
      else if (currentEnemy.name.includes('Malakor') || currentEnemy.name.includes('Lich')) bossLoreId = 'lore_boss_void';
      else if (currentEnemy.name.includes('Cronos') || currentEnemy.name.includes('Primigenio')) bossLoreId = 'lore_boss_ancient';

      if (bossLoreId && !finalLore.includes(bossLoreId)) {
        finalLore.push(bossLoreId);
        finalPlayer = {
          ...finalPlayer,
          score: finalPlayer.score + 500,
        };
      }

      // Generate Boss Victory Modal Info & Lore Fragments (8 Bosses)
      let victoryInfo: BossVictoryInfo | null = null;
      const enemyName = currentEnemy.name.toLowerCase();

      if (enemyName.includes('slime')) {
        victoryInfo = {
          bossName: 'Gran Rey Slime',
          zoneId: 'zone_forest',
          zoneName: 'Bosque Verde',
          nextZoneId: 'zone_cave',
          nextZoneName: 'Cueva de Sombras (Minas de Eridu)',
          fragmentName: 'Fragmento Esmeralda de la Vitalidad',
          fragmentIcon: '💚',
          fragmentColor: '#22c55e',
          scoreBonus: 1000,
          loreStory: 'La savia corrupta del bosque ha sido purificada. Con el Fragmento Esmeralda en tu poder, las antiguas losas de piedra que sellaban las Minas de Eridu se han abierto de par en par.',
        };
      } else if (enemyName.includes('golem') || enemyName.includes('gólem')) {
        victoryInfo = {
          bossName: 'Gólem de Obsidiana',
          zoneId: 'zone_cave',
          zoneName: 'Cueva de Sombras',
          nextZoneId: 'zone_swamp',
          nextZoneName: 'Pantano Espectral de Vael',
          fragmentName: 'Fragmento de Obsidiana de la Tierra',
          fragmentIcon: '🖤',
          fragmentColor: '#6366f1',
          scoreBonus: 1500,
          loreStory: 'El coloso de piedra enano ha caído y sus runas se apagan. Al reclamar el Fragmento de Obsidiana, el sendero brumoso hacia el Pantano de Vael queda completamente transitable.',
        };
      } else if (enemyName.includes('serpiente') || enemyName.includes('gorgona')) {
        victoryInfo = {
          bossName: 'Reina Serpiente Gorgona',
          zoneId: 'zone_swamp',
          zoneName: 'Pantano Espectral de Vael',
          nextZoneId: 'zone_volcano',
          nextZoneName: 'Volcán Ancestral (Fragua de los Titanes)',
          fragmentName: 'Fragmento de la Naturaleza Tóxica',
          fragmentIcon: '🐍',
          fragmentColor: '#10b981',
          scoreBonus: 2000,
          loreStory: 'Las aguas venenosas de Vael se disipan. Con tres Fragmentos en tu poder, el sendero ígneo que asciende hacia la caldera del Volcán Ancestral se despeja.',
        };
      } else if (enemyName.includes('dragón') || enemyName.includes('dragon') || enemyName.includes('ignis')) {
        victoryInfo = {
          bossName: 'Dragón Infernal Ignis',
          zoneId: 'zone_volcano',
          zoneName: 'Volcán Ancestral',
          nextZoneId: 'zone_tundra',
          nextZoneName: 'Picos Helados de Frostfall',
          fragmentName: 'Fragmento de Magma del Fuego Sagrado',
          fragmentIcon: '🔥',
          fragmentColor: '#f97316',
          scoreBonus: 2500,
          loreStory: 'El dragón milenario exhala su último aliento. El calor liberado derrite la barrera de nieve que bloqueaba el paso a los Picos Helados de Frostfall.',
        };
      } else if (enemyName.includes('ymir') || enemyName.includes('escarcha') || enemyName.includes('frost')) {
        victoryInfo = {
          bossName: 'Titán de Escarcha Ymir',
          zoneId: 'zone_tundra',
          zoneName: 'Picos Helados de Frostfall',
          nextZoneId: 'zone_castle',
          nextZoneName: 'Ciudadela Imperial (Necrópolis Real)',
          fragmentName: 'Fragmento Glacial del Invierno Eterno',
          fragmentIcon: '❄️',
          fragmentColor: '#38bdf8',
          scoreBonus: 3000,
          loreStory: 'El titán del cero absoluto cae deshecho en nieve. La gran puerta de hierro que sella la Ciudadela Imperial Caída se abre ante tu poder.',
        };
      } else if (enemyName.includes('kael') || enemyName.includes('general')) {
        victoryInfo = {
          bossName: 'General de la Muerte Lord Kael',
          zoneId: 'zone_castle',
          zoneName: 'Ciudadela Imperial',
          nextZoneId: 'zone_void',
          nextZoneName: 'El Vórtice del Vacío',
          fragmentName: 'Fragmento del Alma de la Corona',
          fragmentIcon: '🛡️',
          fragmentColor: '#a855f7',
          scoreBonus: 4000,
          loreStory: 'El paladín caído encuentra su redención final. La fisura dimensional hacia el Vórtice del Vacío se abre en el trono real.',
        };
      } else if (enemyName.includes('lich') || enemyName.includes('malakor')) {
        victoryInfo = {
          bossName: 'Archilich Malakor del Abismo',
          zoneId: 'zone_void',
          zoneName: 'El Vórtice del Vacío',
          nextZoneId: 'zone_sanctuary',
          nextZoneName: 'Sagrario de los Antiguos (Torre del Infinito)',
          fragmentName: 'El Núcleo Sombrío Purificado & Cristal Primigenio Restaurado',
          fragmentIcon: '💎',
          fragmentColor: '#ec4899',
          scoreBonus: 6000,
          loreStory: '¡El archicanciller traidor ha sido desterrado para siempre! Al unir los Fragmentos en el pedestal, el Cristal Primigenio renace con una luz celestial. ¡Has salvado la historia principal de Aethelgard! Se ha abierto el Sagrario de los Antiguos para el 100% de la aventura.',
        };
      } else if (enemyName.includes('cronos') || enemyName.includes('primigenio')) {
        victoryInfo = {
          bossName: 'Dios Primigenio Cronos',
          zoneId: 'zone_sanctuary',
          zoneName: 'Sagrario de los Antiguos',
          isFinalBoss: true,
          fragmentName: 'La Corona Cósmica de la Divinidad Absoluta (100%)',
          fragmentIcon: '🌟',
          fragmentColor: '#fbbf24',
          scoreBonus: 15000,
          loreStory: '¡HAZAÑA SUPREMA DEL 100%! Has derrotado al Creador del Tiempo y alcanzado la cúspide heroica inmortal. ¡Tu nombre queda grabado por toda la eternidad como el Dios Protector de Aethelgard!',
        };
      }

      if (victoryInfo) {
        finalPlayer = {
          ...finalPlayer,
          score: finalPlayer.score + victoryInfo.scoreBonus,
        };
        setActiveBossVictory(victoryInfo);
      }

      setUnlockedLoreIds(finalLore);
      setPlayer(finalPlayer);
      setInventory(result.updatedInventory);
      triggerAutoSave(finalPlayer, result.updatedInventory, currentZoneId, playerPos, newDefeated, openedChests, completedQuests, unlockedSkillIds, finalLore);
    } else {
      // 15% gold penalty on combat defeat (Survival RPG mechanic)
      if (!result.won && finalPlayer.gold > 0) {
        const penalty = Math.floor(finalPlayer.gold * 0.15);
        if (penalty > 0) {
          finalPlayer = {
            ...finalPlayer,
            gold: Math.max(0, finalPlayer.gold - penalty),
          };
        }
      }
      setPlayer(finalPlayer);
      setInventory(result.updatedInventory);
      triggerAutoSave(finalPlayer, result.updatedInventory);
    }

    if (result.newlyUnlockedSkills.length > 0) {
      const newSkillIds = [...unlockedSkillIds, ...result.newlyUnlockedSkills.map((s) => s.id)];
      setUnlockedSkillIds(newSkillIds);
    }

    setGameState('overworld');
  };

  // Rest at Inn (Progressive Economic Cost)
  const handleHealAtInn = (freeRest = false) => {
    if (!player) return;
    const innCost = freeRest
      ? 0
      : currentZoneId === 'zone_forest'
      ? 15
      : currentZoneId === 'zone_cave'
      ? 30
      : currentZoneId === 'zone_swamp'
      ? 60
      : currentZoneId === 'zone_volcano'
      ? 100
      : currentZoneId === 'zone_tundra'
      ? 160
      : currentZoneId === 'zone_castle'
      ? 240
      : currentZoneId === 'zone_void'
      ? 380
      : 550;

    if (!freeRest && player.gold < innCost) return;

    const updatedPlayer: PlayerStats = {
      ...player,
      hp: player.maxHp,
      mp: player.maxMp,
      gold: freeRest ? player.gold : Math.max(0, player.gold - innCost),
    };

    setPlayer(updatedPlayer);
    triggerAutoSave(updatedPlayer);
  };

  // Open Treasure Chest / Shrine / Fountain (Balanced Gold Rewards)
  const handleOpenChest = (chestId: string): ChestLoot | null => {
    if (!player || openedChests.includes(chestId)) return null;

    let baseGold = 12;
    let variance = 8;
    let expReward = 25;

    const isMazeChest = chestId === 'zone_forest_255_145' || chestId.includes('255_145') || chestId.includes('maze');

    if (isMazeChest) {
      baseGold = 100; variance = 1; expReward = 50;
    } else if (currentZoneId === 'zone_cave') {
      baseGold = 22; variance = 12; expReward = 45;
    } else if (currentZoneId === 'zone_swamp') {
      baseGold = 35; variance = 15; expReward = 60;
    } else if (currentZoneId === 'zone_volcano') {
      baseGold = 55; variance = 20; expReward = 75;
    } else if (currentZoneId === 'zone_tundra') {
      baseGold = 80; variance = 25; expReward = 95;
    } else if (currentZoneId === 'zone_castle') {
      baseGold = 110; variance = 35; expReward = 120;
    } else if (currentZoneId === 'zone_void') {
      baseGold = 160; variance = 45; expReward = 160;
    } else if (currentZoneId === 'zone_sanctuary') {
      baseGold = 280; variance = 70; expReward = 260;
    }

    const goldBonus = isMazeChest ? 100 : (baseGold + Math.floor(Math.random() * variance));
    const expBonus = expReward;

    // Consumable drop
    const fallbackPotion = SHOP_CONSUMABLES.find((c) => c.id === 'hp_potion_s') || {
      id: 'hp_potion_s',
      name: 'Poción de Salud Menor',
      effect: 'heal_hp' as const,
      power: 40,
      price: 15,
      quantity: 1,
      description: 'Restaura 40 HP.',
      icon: '🧪',
    };
    const potion = inventory.consumables.find((c) => c.id.includes('hp')) || fallbackPotion;
    const potionName = potion?.name || 'Poción de Salud Menor';
    const potionIcon = potion?.icon || '🧪';

    // Rare equipment drop chance (12%) or Guaranteed for Maze Chest
    let foundEquipName: string | undefined;
    let foundEquipIcon: string | undefined;
    let foundEquipRarity: string | undefined;
    const newOwnedEquipment = [...inventory.ownedEquipment];

    if (isMazeChest) {
      const mazeAmulet: EquipmentItem = {
        id: 'eq_amulet_maze',
        name: 'Amuleto del Laberinto Arcano',
        slot: 'amulet',
        bonusAttack: 10,
        bonusDefense: 10,
        bonusHp: 15,
        price: 150,
        description: 'Reliquia mágica protegida en el corazón del laberinto encantado.',
        icon: '📿',
      };
      if (!newOwnedEquipment.some((e) => e.id === 'eq_amulet_maze')) {
        newOwnedEquipment.push(mazeAmulet);
      }
      foundEquipName = mazeAmulet.name;
      foundEquipIcon = mazeAmulet.icon;
      foundEquipRarity = 'RARO';
    } else if (Math.random() < 0.12) {
      const candidates = ALL_EQUIPMENT_DATABASE.filter((e) => !newOwnedEquipment.some((owned) => owned.id === e.id));
      if (candidates.length > 0) {
        const randomEquip = candidates[Math.floor(Math.random() * candidates.length)];
        newOwnedEquipment.push(randomEquip);
        foundEquipName = randomEquip.name;
        foundEquipIcon = randomEquip.icon;
        foundEquipRarity = randomEquip.price > 1000 ? 'LEGENDARIO' : randomEquip.price > 300 ? 'RARO' : 'MÁGICO';
      }
    }

    let updatedPlayer = {
      ...player,
      gold: player.gold + goldBonus,
      score: player.score + 250,
      exp: player.exp + expBonus,
    };

    // Check lore unlock
    let updatedLore = [...unlockedLoreIds];
    let loreTitle: string | undefined;
    if (!updatedLore.includes('lore_relic_shrines')) {
      updatedLore.push('lore_relic_shrines');
      updatedPlayer.score += 200;
      loreTitle = 'Secretos de los Santuarios Ancestrales';
    } else if (!updatedLore.includes('lore_relic_fountains')) {
      updatedLore.push('lore_relic_fountains');
      updatedPlayer.score += 200;
      loreTitle = 'Bendiciones de las Fuentes de Vida';
    }

    // Add 1 Potion to inventory
    let updatedConsumables = [...inventory.consumables];
    const pIdx = updatedConsumables.findIndex((c) => c.id === potion.id);
    if (pIdx >= 0) {
      updatedConsumables[pIdx] = {
        ...updatedConsumables[pIdx],
        quantity: updatedConsumables[pIdx].quantity + 1,
      };
    } else {
      updatedConsumables.push({ ...potion, quantity: 1 });
    }

    const updatedInventory: Inventory = {
      ...inventory,
      consumables: updatedConsumables,
      ownedEquipment: newOwnedEquipment,
    };

    const newChests = [...openedChests, chestId];
    setOpenedChests(newChests);
    setUnlockedLoreIds(updatedLore);
    setPlayer(updatedPlayer);
    setInventory(updatedInventory);

    triggerAutoSave(
      updatedPlayer,
      updatedInventory,
      currentZoneId,
      playerPos,
      defeatedBosses,
      newChests,
      completedQuests,
      unlockedSkillIds,
      updatedLore
    );

    return {
      chestId,
      gold: goldBonus,
      exp: expBonus,
      itemName: potionName,
      itemIcon: potionIcon,
      equipmentName: foundEquipName,
      equipmentIcon: foundEquipIcon,
      equipmentRarity: foundEquipRarity,
      loreTitle,
    };
  };

  // Change Zone (8 Regions Support)
  const handleChangeZone = (zoneId: string) => {
    setCurrentZoneId(zoneId);
    let defaultPos = zoneId === 'zone_forest' ? { x: 36, y: 62 } : { x: 30, y: 30 };
    setPlayerPos(defaultPos);

    let updatedLore = [...unlockedLoreIds];
    let scoreBonus = 0;
    if (zoneId === 'zone_cave' && !updatedLore.includes('lore_cave_ruins')) {
      updatedLore.push('lore_cave_ruins');
      scoreBonus += 500;
    } else if (zoneId === 'zone_swamp' && !updatedLore.includes('lore_swamp_ruins')) {
      updatedLore.push('lore_swamp_ruins');
      scoreBonus += 550;
    } else if (zoneId === 'zone_volcano' && !updatedLore.includes('lore_volcano_forge')) {
      updatedLore.push('lore_volcano_forge');
      scoreBonus += 600;
    } else if (zoneId === 'zone_tundra' && !updatedLore.includes('lore_tundra_ice')) {
      updatedLore.push('lore_tundra_ice');
      scoreBonus += 650;
    } else if (zoneId === 'zone_castle' && !updatedLore.includes('lore_castle_fall')) {
      updatedLore.push('lore_castle_fall');
      scoreBonus += 700;
    } else if (zoneId === 'zone_void' && !updatedLore.includes('lore_void_rift')) {
      updatedLore.push('lore_void_rift');
      scoreBonus += 850;
    } else if (zoneId === 'zone_sanctuary' && !updatedLore.includes('lore_sanctuary_god')) {
      updatedLore.push('lore_sanctuary_god');
      scoreBonus += 1200;
    }

    let updatedPlayer = player;
    if (player && scoreBonus > 0) {
      updatedPlayer = {
        ...player,
        score: player.score + scoreBonus,
      };
      setPlayer(updatedPlayer);
    }
    setUnlockedLoreIds(updatedLore);

    triggerAutoSave(updatedPlayer, inventory, zoneId, defaultPos, defeatedBosses, openedChests, completedQuests, unlockedSkillIds, updatedLore);
  };

  // Reset Game / Current Slot
  const handleResetGame = () => {
    handleDeleteSlot(activeSlotIndex);
    setPlayer(null);
    setUnlockedLoreIds(INITIAL_LORE_IDS);
    setShowSettingsModal(false);
    setGameState('title');
  };

  return (
    <div className={`h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col justify-between items-center ${gameState === 'overworld' ? 'p-0' : 'p-1 sm:p-3'} overflow-hidden select-none touch-none`}>
      {/* Title Screen */}
      {gameState === 'title' && (
        <TitleScreen
          slots={characterSlots}
          activeSlotIndex={activeSlotIndex}
          onSelectSlot={(slotIdx) => setActiveSlotIndex(slotIdx)}
          onStartNewGame={handleStartNewGame}
          onStartShowcaseGame={handleStartShowcaseGame}
          onResumeGame={(slotIdx) => handleResumeGame(slotIdx)}
          onDeleteSlot={handleDeleteSlot}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
          onOpenPrologue={() => setShowPrologueModal(true)}
        />
      )}

      {/* Overworld Exploration Screen */}
      {gameState === 'overworld' && player && (
        <OverworldMap
          player={player}
          inventory={inventory}
          currentZone={currentZone}
          playerPos={playerPos}
          defeatedBosses={defeatedBosses}
          openedChests={openedChests}
          completedQuests={completedQuests}
          acceptedQuests={acceptedQuests}
          defeatedEnemyCounts={defeatedEnemyCounts}
          unlockedLoreIds={unlockedLoreIds}
          unlockedAchievements={unlockedAchievements}
          claimedAchievements={claimedAchievements}
          exploredTilesByZone={exploredTilesByZone}
          activeSlotIndex={activeSlotIndex}
          onReturnToTitle={handleReturnToTitle}
          onUpdateExploredTiles={(zId, tiles) => {
            setExploredTilesByZone((prev) => {
              const updated = { ...prev, [zId]: tiles };
              triggerAutoSave(
                player,
                inventory,
                currentZoneId,
                playerPos,
                defeatedBosses,
                openedChests,
                completedQuests,
                unlockedSkillIds,
                unlockedLoreIds,
                acceptedQuests,
                unlockedAchievements,
                claimedAchievements,
                defeatedEnemyCounts,
                updated
              );
              return updated;
            });
          }}
          onMove={(newPos) => {
            setPlayerPos(newPos);
            scheduleDebouncedAutoSave(newPos);
          }}
          onStartBattle={handleStartBattle}
          onOpenShop={() => setShowShopModal(true)}
          onOpenInventory={() => setShowInventoryModal(true)}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenLoreCodex={() => setShowLoreModal(true)}
          onOpenAchievements={() => setShowAchievementsModal(true)}
          onHealAtInn={handleHealAtInn}
          onOpenChest={handleOpenChest}
          onAcceptQuest={handleAcceptQuest}
          onClaimQuestReward={handleClaimQuestReward}
          onChangeZone={handleChangeZone}
          onUseConsumable={(cId: string) => {
            if (!player) return;
            const target = inventory.consumables.find((c) => c.id === cId || c.id.includes(cId));
            if (!target || target.quantity <= 0) return;

            // Si es pocion de vida y ya tiene vida al 100%, no gastar
            if (target.effect === 'heal_hp' && player.hp >= player.maxHp) {
              return;
            }
            // Si es pocion de mana y ya tiene mana al 100%, no gastar
            if (target.effect === 'heal_mp' && player.mp >= player.maxMp) {
              return;
            }

            if (target.effect === 'teleport' || target.id.includes('teleport') || target.id.includes('scroll')) {
              setPlayerPos({ x: 36, y: 62 });
              soundEngine.playSfx('levelup');
            } else {
              soundEngine.playSfx('heal');
            }

            let healHp = 0;
            let healMp = 0;
            if (target.effect === 'heal_hp') healHp = target.power || 40;
            else if (target.effect === 'heal_mp') healMp = target.power || 25;
            else if (target.effect === 'heal_all') { healHp = player.maxHp; healMp = player.maxMp; }

            const updatedHp = Math.min(player.maxHp, player.hp + healHp);
            const updatedMp = Math.min(player.maxMp, player.mp + healMp);

            const updatedConsumables = inventory.consumables
              .map((c) => (c.id === target.id ? { ...c, quantity: c.quantity - 1 } : c))
              .filter((c) => c.quantity > 0);

            const updatedPlayer = { ...player, hp: updatedHp, mp: updatedMp };
            const updatedInventory = { ...inventory, consumables: updatedConsumables };

            setPlayer(updatedPlayer);
            setInventory(updatedInventory);
            triggerAutoSave(updatedPlayer, updatedInventory);
          }}
          onEquipItem={(item) => {
            setInventory((prev) => {
              const next = { ...prev };
              if (item.type === 'weapon') next.equipment = { ...next.equipment, weapon: item };
              else if (item.type === 'armor') next.equipment = { ...next.equipment, armor: item };
              else if (item.type === 'accessory') next.equipment = { ...next.equipment, accessory: item };
              return next;
            });
            if (player) {
              triggerAutoSave(player, inventory, currentZoneId, playerPos, defeatedBosses, openedChests, completedQuests, unlockedSkillIds, unlockedLoreIds, acceptedQuests, unlockedAchievements);
            }
          }}
        />
      )}

      {/* Battle Screen */}
      {gameState === 'battle' && player && currentEnemy && (
        <BattleScreen
          player={player}
          inventory={inventory}
          enemy={currentEnemy}
          unlockedSkillIds={unlockedSkillIds}
          onBattleEnd={handleBattleEnd}
        />
      )}

      {/* Achievements & Rewards Modal */}
      {showAchievementsModal && player && (
        <AchievementsModal
          player={player}
          inventory={inventory}
          defeatedBosses={defeatedBosses}
          openedChests={openedChests}
          completedQuests={completedQuests}
          unlockedLoreIds={unlockedLoreIds}
          defeatedEnemyCounts={defeatedEnemyCounts}
          unlockedAchievements={unlockedAchievements}
          claimedAchievements={claimedAchievements}
          onClaimReward={handleClaimAchievementReward}
          onClose={() => setShowAchievementsModal(false)}
        />
      )}

      {/* Achievement Unlocked In-Game Toast Banner */}
      {achievementNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-none animate-bounce">
          <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-400 rounded-2xl shadow-2xl shadow-amber-500/20 text-slate-100">
            <span className="text-3xl">{achievementNotification.icon}</span>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400 font-retro flex items-center gap-1.5">
                <span>🏆</span> ¡LOGRO DESBLOQUEADO!
              </div>
              <div className="text-sm font-black text-amber-200 font-retro">
                {achievementNotification.title}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lore Codex Modal */}
      {showLoreModal && player && (
        <LoreCodexModal
          player={player}
          unlockedLoreIds={unlockedLoreIds}
          defeatedBosses={defeatedBosses}
          currentZoneId={currentZoneId}
          onClose={() => setShowLoreModal(false)}
        />
      )}

      {/* Story Prologue & Cinematic Modal */}
      {showPrologueModal && (
        <StoryPrologueModal
          onClose={() => {
            setShowPrologueModal(false);
            if (currentZone) {
              soundEngine.playMusic(currentZone.bgMusicTheme);
            }
          }}
          onStartAdventure={() => {
            setShowPrologueModal(false);
            if (currentZone) {
              soundEngine.playMusic(currentZone.bgMusicTheme);
            }
          }}
        />
      )}

      {/* Inventory Modal */}
      {showInventoryModal && player && (
        <InventoryShopModal
          player={player}
          inventory={inventory}
          initialTab="equipment"
          onClose={() => setShowInventoryModal(false)}
          onUpdatePlayerAndInventory={(p, inv) => {
            setPlayer(p);
            setInventory(inv);
            triggerAutoSave(p, inv);
          }}
        />
      )}

      {/* Shop Modal */}
      {showShopModal && player && (
        <InventoryShopModal
          player={player}
          inventory={inventory}
          initialTab="shop"
          onClose={() => setShowShopModal(false)}
          onUpdatePlayerAndInventory={(p, inv) => {
            setPlayer(p);
            setInventory(inv);
            triggerAutoSave(p, inv);
          }}
        />
      )}

      {/* Leaderboard Modal */}
      {showLeaderboardModal && (
        <LeaderboardModal
          player={player || undefined}
          currentZoneName={currentZone.name}
          defeatedBossesCount={defeatedBosses.length}
          onClose={() => setShowLeaderboardModal(false)}
        />
      )}

      {/* Audio & Gamepad Settings Modal */}
      {showSettingsModal && (
        <AudioSettingsModal
          onClose={() => setShowSettingsModal(false)}
          onResetGame={handleResetGame}
          onUnlockAllContent={handleUnlockAllInCurrentGame}
          onReturnToTitle={handleReturnToTitle}
        />
      )}

      {/* Boss Victory & Zone Progression Unlock Modal */}
      {activeBossVictory && (
        <BossVictoryModal
          victoryInfo={activeBossVictory}
          onTravelToNextZone={(nextZoneId) => {
            setActiveBossVictory(null);
            handleChangeZone(nextZoneId);
          }}
          onStayInCurrentZone={() => {
            setActiveBossVictory(null);
          }}
        />
      )}
    </div>
  );
}
