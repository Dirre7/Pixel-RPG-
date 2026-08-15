import React, { useState, useEffect, useCallback } from 'react';
import {
  PlayerStats,
  Inventory,
  HeroClass,
  GameSaveData,
  Enemy,
  Zone
} from './types';
import {
  HERO_CLASSES,
  INITIAL_CONSUMABLES,
  SHOP_CONSUMABLES,
  ZONES,
  ALL_SKILLS,
  SHOP_EQUIPMENT,
  ALL_GAME_QUESTS,
  GAME_LORE_ENTRIES,
  getQuestRewardEquipment,
  isZoneUnlocked,
} from './data/gameData';
import { ChestLoot } from './components/ChestLootModal';
import { TitleScreen } from './components/TitleScreen';
import { OverworldMap } from './components/OverworldMap';
import { BattleScreen } from './components/BattleScreen';
import { InventoryShopModal } from './components/InventoryShopModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { LoreCodexModal } from './components/LoreCodexModal';
import { StoryPrologueModal } from './components/StoryPrologueModal';
import { BossVictoryModal, BossVictoryInfo } from './components/BossVictoryModal';
import { soundEngine } from './utils/soundEngine';

const SAVE_KEY = 'cronicas_retro_rpg_save_v1';

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
  const [showPrologueModal, setShowPrologueModal] = useState(false);
  const [activeBossVictory, setActiveBossVictory] = useState<BossVictoryInfo | null>(null);

  // Player & Game State
  const [player, setPlayer] = useState<PlayerStats | null>(null);
  const [inventory, setInventory] = useState<Inventory>({
    consumables: [...INITIAL_CONSUMABLES],
    equipment: { weapon: null, armor: null, accessory: null },
    ownedEquipment: [],
  });

  const [currentZoneId, setCurrentZoneId] = useState<string>('zone_forest');
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 2, y: 3 });
  const [defeatedBosses, setDefeatedBosses] = useState<string[]>([]);
  const [openedChests, setOpenedChests] = useState<string[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [defeatedEnemyCounts, setDefeatedEnemyCounts] = useState<Record<string, number>>({});
  const [unlockedSkillIds, setUnlockedSkillIds] = useState<string[]>([]);
  const [unlockedLoreIds, setUnlockedLoreIds] = useState<string[]>(INITIAL_LORE_IDS);

  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [savedGameData, setSavedGameData] = useState<GameSaveData | null>(null);

  // Load Saved Game from localStorage on init
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed: GameSaveData = JSON.parse(raw);
        setSavedGameData(parsed);
      }
    } catch (err) {
      console.error('Failed to parse save data:', err);
    }
  }, []);

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
      lores = unlockedLoreIds
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
          unlockedSkills: skills,
          unlockedLoreIds: lores,
          playTimeSeconds: 0,
          lastSavedAt: new Date().toISOString(),
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        setSavedGameData(saveData);
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    },
    [player, inventory, currentZoneId, playerPos, defeatedBosses, openedChests, completedQuests, unlockedSkillIds, unlockedLoreIds]
  );

  // Start New Game
  const handleStartNewGame = (playerName: string, heroClass: HeroClass, gender: 'male' | 'female' = 'female') => {
    const classConfig = HERO_CLASSES[heroClass];
    const initialPlayerStats: PlayerStats = {
      name: playerName,
      heroClass,
      gender,
      level: 1,
      exp: 0,
      maxExp: 100,
      hp: classConfig.baseStats.hp,
      maxHp: classConfig.baseStats.hp,
      mp: classConfig.baseStats.mp,
      maxMp: classConfig.baseStats.mp,
      attack: classConfig.baseStats.attack,
      defense: classConfig.baseStats.defense,
      speed: classConfig.baseStats.speed,
      gold: 100,
      score: 0,
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
    setPlayerPos({ x: 2, y: 3 });
    setDefeatedBosses([]);
    setOpenedChests([]);
    setCompletedQuests([]);
    setUnlockedSkillIds(lvl1Skills);
    setUnlockedLoreIds(INITIAL_LORE_IDS);

    setGameState('overworld');
    setShowPrologueModal(true);
    triggerAutoSave(initialPlayerStats, initialInv, 'zone_forest', { x: 2, y: 3 }, [], [], [], lvl1Skills, INITIAL_LORE_IDS);
  };

  // Start Showcase Game (Modo Creador / Todo Desbloqueado - Nivel 75 y Tier 8)
  const handleStartShowcaseGame = (playerName: string, heroClass: HeroClass, gender: 'male' | 'female' = 'female') => {
    const classConfig = HERO_CLASSES[heroClass];
    const showcasePlayer: PlayerStats = {
      name: playerName.trim() || classConfig.name,
      heroClass,
      gender,
      level: 75,
      exp: 0,
      maxExp: 25000,
      hp: 3500,
      maxHp: 3500,
      mp: 900,
      maxMp: 900,
      attack: 420,
      defense: 310,
      speed: 120,
      gold: 99999,
      score: 85000,
    };

    const weapon8 = SHOP_EQUIPMENT.find((e) => e.id === 'eq_w_excalibur') || SHOP_EQUIPMENT[0];
    const shield8 = SHOP_EQUIPMENT.find((e) => e.id === 'eq_s_god') || null;
    const helmet8 = SHOP_EQUIPMENT.find((e) => e.id === 'eq_h_god') || null;
    const armor8 = SHOP_EQUIPMENT.find((e) => e.id === 'eq_a_god') || null;
    const boots8 = SHOP_EQUIPMENT.find((e) => e.id === 'eq_b_god') || null;
    const ring8 = SHOP_EQUIPMENT.find((e) => e.id === 'eq_r_god') || null;

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
      ownedEquipment: [...SHOP_EQUIPMENT],
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
    setPlayerPos({ x: 5, y: 5 });
    setDefeatedBosses(allBosses);
    setOpenedChests([]);
    setCompletedQuests(allQuestIds);
    setUnlockedSkillIds(allSkillIds);
    setUnlockedLoreIds(allLoreIds);

    setGameState('overworld');
    triggerAutoSave(showcasePlayer, showcaseInv, 'zone_forest', { x: 5, y: 5 }, allBosses, [], allQuestIds, allSkillIds, allLoreIds);
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
    setUnlockedSkillIds(allSkillIds);
    setUnlockedLoreIds(allLoreIds);
    setShowSettingsModal(false);

    triggerAutoSave(upgradedPlayer, upgradedInv, currentZoneId, playerPos, allBosses, openedChests, allQuestIds, allSkillIds, allLoreIds);
  };

  // Resume Saved Game
  const handleResumeGame = () => {
    if (!savedGameData) return;
    const safeEquipment = {
      weapon: savedGameData.inventory?.equipment?.weapon || null,
      shield: savedGameData.inventory?.equipment?.shield || null,
      helmet: savedGameData.inventory?.equipment?.helmet || null,
      armor: savedGameData.inventory?.equipment?.armor || null,
      boots: savedGameData.inventory?.equipment?.boots || null,
      ring: savedGameData.inventory?.equipment?.ring || null,
      amulet: savedGameData.inventory?.equipment?.amulet || null,
    };
    const safeInventory: Inventory = {
      consumables: savedGameData.inventory?.consumables || JSON.parse(JSON.stringify(INITIAL_CONSUMABLES)),
      equipment: safeEquipment,
      ownedEquipment: savedGameData.inventory?.ownedEquipment || [],
    };

    setPlayer(savedGameData.player);
    setInventory(safeInventory);
    setCurrentZoneId(savedGameData.currentZoneId || 'zone_forest');
    setPlayerPos(savedGameData.playerPos || { x: 2, y: 3 });
    setDefeatedBosses(savedGameData.defeatedBosses || []);
    setOpenedChests(savedGameData.openedChests || []);
    setCompletedQuests(savedGameData.completedQuests || []);
    setUnlockedSkillIds(savedGameData.unlockedSkills || []);
    setUnlockedLoreIds(savedGameData.unlockedLoreIds || INITIAL_LORE_IDS);

    setGameState('overworld');
  };

  // Claim Quest Reward
  const handleClaimQuestReward = (questId: string, rewardGold: number, rewardExp: number) => {
    if (!player || completedQuests.includes(questId)) return;

    const newCompleted = [...completedQuests, questId];
    setCompletedQuests(newCompleted);

    const questObj = ALL_GAME_QUESTS.find((q) => q.id === questId);
    let updatedInventory = { ...inventory };

    if (questObj) {
      const rewardEquip = getQuestRewardEquipment(questObj);
      if (rewardEquip) {
        // Add to ownedEquipment if not already present
        const alreadyHas = updatedInventory.ownedEquipment.some(
          (eq) => eq.name.toLowerCase() === rewardEquip.name.toLowerCase()
        );
        if (!alreadyHas) {
          updatedInventory = {
            ...updatedInventory,
            ownedEquipment: [...updatedInventory.ownedEquipment, rewardEquip],
          };
          setInventory(updatedInventory);
        }
      }
    }

    let newExp = player.exp + rewardExp;
    let newLevel = player.level;
    let newMaxExp = player.maxExp;
    let newHp = player.hp;
    let newMaxHp = player.maxHp;
    let newMp = player.mp;
    let newMaxMp = player.maxMp;
    let newAtk = player.attack;
    let newDef = player.defense;

    if (newExp >= newMaxExp) {
      newLevel += 1;
      newExp -= newMaxExp;
      newMaxExp = Math.floor(newMaxExp * 1.5);
      newMaxHp += 20;
      newHp = newMaxHp;
      newMaxMp += 10;
      newMp = newMaxMp;
      newAtk += 4;
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
    triggerAutoSave(updatedPlayer, updatedInventory, currentZoneId, playerPos, defeatedBosses, openedChests, newCompleted);
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

  // Rest at Inn
  const handleHealAtInn = (freeRest = false) => {
    if (!player) return;
    const innCost = freeRest
      ? 0
      : currentZoneId === 'zone_forest'
      ? 20
      : currentZoneId === 'zone_cave'
      ? 35
      : currentZoneId === 'zone_swamp'
      ? 50
      : currentZoneId === 'zone_volcano'
      ? 65
      : currentZoneId === 'zone_tundra'
      ? 80
      : currentZoneId === 'zone_castle'
      ? 100
      : currentZoneId === 'zone_void'
      ? 150
      : 250;

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

  // Open Treasure Chest / Shrine / Fountain
  const handleOpenChest = (chestId: string): ChestLoot | null => {
    if (!player || openedChests.includes(chestId)) return null;

    let baseGold = 25;
    let variance = 15;
    let expReward = 30;

    if (currentZoneId === 'zone_cave') {
      baseGold = 50; variance = 25; expReward = 50;
    } else if (currentZoneId === 'zone_swamp') {
      baseGold = 75; variance = 30; expReward = 65;
    } else if (currentZoneId === 'zone_volcano') {
      baseGold = 95; variance = 40; expReward = 80;
    } else if (currentZoneId === 'zone_tundra') {
      baseGold = 135; variance = 50; expReward = 105;
    } else if (currentZoneId === 'zone_castle') {
      baseGold = 180; variance = 65; expReward = 130;
    } else if (currentZoneId === 'zone_void') {
      baseGold = 260; variance = 90; expReward = 180;
    } else if (currentZoneId === 'zone_sanctuary') {
      baseGold = 450; variance = 150; expReward = 300;
    }

    const goldBonus = baseGold + Math.floor(Math.random() * variance);
    const expBonus = expReward;

    // Consumable drop
    const potion = inventory.consumables.find((c) => c.id.includes('hp')) || inventory.consumables[0];
    const potionName = potion?.name || 'Poción de Salud';
    const potionIcon = potion?.icon || '🧪';

    // Rare equipment drop chance (12%)
    let foundEquipName: string | undefined;
    let foundEquipIcon: string | undefined;
    let foundEquipRarity: string | undefined;
    const newOwnedEquipment = [...inventory.ownedEquipment];

    if (Math.random() < 0.12) {
      const candidates = SHOP_EQUIPMENT.filter((e) => !newOwnedEquipment.some((owned) => owned.id === e.id));
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
    const updatedConsumables = inventory.consumables.map((c) => {
      if (c.id === (potion?.id || 'potion_hp_1')) {
        return { ...c, quantity: c.quantity + 1 };
      }
      return c;
    });

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
    let defaultPos = { x: 2, y: 3 };
    if (zoneId === 'zone_volcano') {
      defaultPos = { x: 18, y: 4 };
    } else if (zoneId === 'zone_swamp') {
      defaultPos = { x: 4, y: 4 };
    } else if (zoneId === 'zone_tundra') {
      defaultPos = { x: 4, y: 4 };
    } else if (zoneId === 'zone_castle') {
      defaultPos = { x: 2, y: 3 };
    } else if (zoneId === 'zone_void') {
      defaultPos = { x: 4, y: 4 };
    } else if (zoneId === 'zone_sanctuary') {
      defaultPos = { x: 4, y: 4 };
    } else if (zoneId === 'zone_cave') {
      defaultPos = { x: 2, y: 3 };
    }
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

  // Reset Game
  const handleResetGame = () => {
    localStorage.removeItem(SAVE_KEY);
    setSavedGameData(null);
    setPlayer(null);
    setUnlockedLoreIds(INITIAL_LORE_IDS);
    setShowSettingsModal(false);
    setGameState('title');
  };

  return (
    <div className="h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-1 sm:p-3 overflow-hidden select-none touch-none">
      {/* Title Screen */}
      {gameState === 'title' && (
        <TitleScreen
          hasSavedGame={!!savedGameData}
          savedGameData={savedGameData}
          onStartNewGame={handleStartNewGame}
          onStartShowcaseGame={handleStartShowcaseGame}
          onResumeGame={handleResumeGame}
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
          defeatedEnemyCounts={defeatedEnemyCounts}
          unlockedLoreIds={unlockedLoreIds}
          onMove={(newPos) => {
            setPlayerPos(newPos);
            triggerAutoSave(player, inventory, currentZoneId, newPos);
          }}
          onStartBattle={handleStartBattle}
          onOpenShop={() => setShowShopModal(true)}
          onOpenInventory={() => setShowInventoryModal(true)}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenLoreCodex={() => setShowLoreModal(true)}
          onHealAtInn={handleHealAtInn}
          onOpenChest={handleOpenChest}
          onClaimQuestReward={handleClaimQuestReward}
          onChangeZone={handleChangeZone}
          onAutoSave={() => triggerAutoSave()}
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
