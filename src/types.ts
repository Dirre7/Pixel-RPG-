export type HeroClass = 'Guerrero' | 'Mago' | 'Pícaro' | 'Paladín' | 'Nigromante' | 'Arquero' | 'Berserker';

export interface PlayerStats {
  name: string;
  heroClass: HeroClass;
  gender?: 'male' | 'female';
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  gold: number;
  score: number;
}

export type ElementType = 'physical' | 'fire' | 'ice' | 'thunder' | 'holy' | 'shadow' | 'magic';

export interface Skill {
  id: string;
  name: string;
  heroClass: HeroClass | 'all';
  minLevel: number;
  mpCost: number;
  type: 'damage' | 'heal' | 'buff_atk' | 'buff_def';
  power: number; //Multiplier or base value
  element: ElementType;
  description: string;
  iconName: string;
}

export type EquipmentSlot = 'weapon' | 'shield' | 'helmet' | 'armor' | 'boots' | 'ring' | 'amulet';

export interface EquipmentItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  heroClassReq?: HeroClass[];
  bonusAttack?: number;
  bonusDefense?: number;
  bonusHp?: number;
  bonusMp?: number;
  bonusSpeed?: number;
  price: number;
  description: string;
  icon: string;
  model3d?: string;
}

export type ConsumableEffect = 'heal_hp' | 'heal_mp' | 'heal_all' | 'buff_atk' | 'buff_def';

export interface ConsumableItem {
  id: string;
  name: string;
  effect: ConsumableEffect;
  power: number;
  price: number;
  quantity: number;
  description: string;
  icon: string;
}

export interface Inventory {
  consumables: ConsumableItem[];
  equipment: {
    weapon: EquipmentItem | null;
    shield: EquipmentItem | null;
    helmet: EquipmentItem | null;
    armor: EquipmentItem | null;
    boots: EquipmentItem | null;
    ring: EquipmentItem | null;
    amulet: EquipmentItem | null;
  };
  ownedEquipment: EquipmentItem[];
}

export type StatusEffectType = 'poison' | 'burn' | 'freeze' | 'paralyze' | 'curse';

export interface StatusEffect {
  type: StatusEffectType;
  duration: number; // turns
  power: number;
}

export interface Enemy {
  id: string;
  name: string;
  isBoss: boolean;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  expReward: number;
  goldReward: number;
  spriteType:
    | 'slime'
    | 'goblin'
    | 'wolf'
    | 'bat'
    | 'spider'
    | 'golem'
    | 'elemental'
    | 'drake'
    | 'skeleton'
    | 'lich'
    | 'serpent'
    | 'swamp_witch'
    | 'ice_golem'
    | 'frost_titan'
    | 'death_knight'
    | 'void_beast'
    | 'ancient_god'
    | 'ghost'
    | 'elemental_fire'
    | 'demon'
    | 'wolf_ice'
    | 'giant_ice'
    | 'gargoyle'
    | 'void_horror'
    | 'void_reaper'
    | 'seraph_guard'
    | 'cherub_arbiter'
    | 'boss_slime'
    | 'boss_golem'
    | 'boss_dragon'
    | 'boss_lich'
    | 'boss_serpent'
    | 'boss_frost'
    | 'boss_death_knight'
    | 'boss_void'
    | 'boss_ancient';
  color: string;
  specialSkills?: { name: string; power: number; mpCost?: number; element: ElementType; statusEffect?: StatusEffectType }[];
  zoneId: string;
  description: string;
}

export interface NPCQuest {
  id: string;
  title: string;
  description: string;
  zoneId?: string;
  category?: 'main' | 'side';
  giverName?: string;
  rewardGold: number;
  rewardExp: number;
  rewardItemName?: string;
  rewardEquipment?: EquipmentItem;
  targetType: 'defeat_boss' | 'reach_level' | 'open_chests' | 'defeat_enemies' | 'collect_items' | 'talk_npc';
  targetValue: string | number;
  targetEnemyType?: string;
  progress?: number;
  maxProgress?: number;
}

export interface NPC {
  id: string;
  zoneId: string;
  x: number;
  y: number;
  name: string;
  title: string;
  avatarStyle:
    | 'elder'
    | 'scout'
    | 'knight'
    | 'wizard'
    | 'elf'
    | 'dwarf'
    | 'blacksmith'
    | 'alchemist'
    | 'fisherman'
    | 'witch'
    | 'shaman'
    | 'paladin'
    | 'god';
  dialogue: string[];
  tip?: string;
  quest?: NPCQuest;
  quests?: NPCQuest[];
}

export interface Zone {
  id: string;
  name: string;
  themeColor: string;
  bgMusicTheme: 'forest' | 'cave' | 'swamp' | 'volcano' | 'tundra' | 'castle' | 'void' | 'sanctuary';
  requiredLevel: number;
  mapWidth: number;
  mapHeight: number;
  tileData: number[][]; // 0: grass/floor, 1: wall/tree/rock, 2: path, 3: water/lava/void, 4: shop, 5: inn, 6: boss portal, 7: chest, 8: shrine, 9: fountain, 10: npc
  enemies: Omit<Enemy, 'id'>[];
  boss: Omit<Enemy, 'id'>;
  npcs?: NPC[];
  description: string;
}

export interface LoreEntry {
  id: string;
  title: string;
  category: 'chronicle' | 'location' | 'boss' | 'relic' | 'character';
  zoneId?: string;
  unlockedByDefault?: boolean;
  unlockConditionText: string;
  icon: string;
  dateOrEra: string;
  shortSummary: string;
  fullText: string[];
  revelationBonusScore?: number;
}

export interface GameSaveData {
  player: PlayerStats;
  inventory: Inventory;
  currentZoneId: string;
  playerPos: { x: number; y: number };
  defeatedBosses: string[];
  openedChests: string[]; // "zoneId_x_y"
  completedQuests?: string[]; // questIds
  acceptedQuests?: string[]; // questIds currently in progress
  unlockedSkills: string[];
  unlockedLoreIds?: string[];
  unlockedAchievements?: string[]; // achievementIds
  claimedAchievements?: string[]; // achievementIds
  defeatedEnemyCounts?: Record<string, number>;
  playTimeSeconds: number;
  lastSavedAt: string;
}

export type AchievementCategory = 'combat' | 'exploration' | 'progression' | 'collection' | 'special';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  targetType:
    | 'reach_level'
    | 'defeat_enemies_total'
    | 'defeat_boss'
    | 'defeat_bosses_total'
    | 'open_chests_total'
    | 'quests_completed_total'
    | 'lore_unlocked_total'
    | 'gold_accumulated'
    | 'full_equipment'
    | 'reach_zone';
  targetValue: number | string;
  rewardGold: number;
  rewardExp: number;
  rewardConsumable?: ConsumableItem;
  rewardEquipment?: EquipmentItem;
  rewardTitle?: string;
  secret?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  heroClass: string;
  level: number;
  score: number;
  zone: string;
  bossesDefeated: number;
  playTimeMinutes: number;
  date: string;
}

