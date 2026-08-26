export type HeroClass = 'Guerrero' | 'Mago' | 'Pícaro' | 'Paladín' | 'Nigromante' | 'Arquero' | 'Berserker';

export interface PlayerResources {
  wood: number;
  stone: number;
  crops: number;
  gems: number;
}

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
  attack: number;           // Poder de Ataque Físico
  magicAttack?: number;     // Poder de Ataque Mágico (MATK)
  defense: number;          // Defensa Física
  magicDefense?: number;    // Defensa Mágica / Resistencia Elemental (MDEF)
  speed: number;            // Velocidad de Turno
  accuracy?: number;        // % Probabilidad de acierto (ACC)
  evasion?: number;         // % Probabilidad de esquivar (EVA)
  critRate?: number;        // % Probabilidad de golpe crítico (CRIT)
  critDamage?: number;      // % Multiplicador de daño crítico (CRIT DMG)
  blockRate?: number;       // % Probabilidad de bloqueo con escudo (BLOCK)
  armorPenetration?: number;// % Penetración de armadura / perforación (ARMOR PEN)
  lifesteal?: number;       // % Robo de vida sobre daño infligido (LIFESTEAL)
  mpRegen?: number;         // +MP recuperado pasivamente al inicio de cada turno
  hpRegen?: number;         // +HP recuperado pasivamente al inicio de cada turno
  magicFind?: number;       // +% Probabilidad de botín raro/épico/legendario
  goldBonus?: number;       // +% Bono multiplicador de oro obtenido
  expBonus?: number;        // +% Bono de experiencia obtenida
  gold: number;
  score: number;
  resources?: PlayerResources;
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
  bonusMagicAttack?: number;
  bonusDefense?: number;
  bonusMagicDefense?: number;
  bonusHp?: number;
  bonusMp?: number;
  bonusSpeed?: number;
  bonusAccuracy?: number;        // +% Precisión
  bonusEvasion?: number;         // +% Evasión
  bonusCritRate?: number;        // +% Probabilidad de Crítico
  bonusCritDamage?: number;      // +% Daño Crítico
  bonusBlockRate?: number;       // +% Probabilidad de Bloqueo
  bonusArmorPenetration?: number;// +% Penetración de Armadura
  bonusLifesteal?: number;       // +% Robo de Vida
  bonusMpRegen?: number;         // + Regeneración de Maná/turno
  bonusHpRegen?: number;         // + Regeneración de Vida/turno
  bonusMagicFind?: number;       // +% Hallazgo Mágico
  bonusGoldBonus?: number;       // +% Bono de Oro
  bonusExpBonus?: number;        // +% Bono de Experiencia
  price: number;
  description: string;
  icon: string;
  model3d?: string;
}

export type ConsumableEffect = 'heal_hp' | 'heal_mp' | 'heal_all' | 'buff_atk' | 'buff_def' | 'teleport';

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
  level?: number;
  spawnPos?: { x: number; y: number };
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  accuracy?: number; // % Probabilidad de acierto enemigo (default 90)
  evasion?: number;  // % Probabilidad de esquivar enemiga (default 5)
  critRate?: number; // % Probabilidad de crítico enemigo (default 5)
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

export interface MapPortal {
  x: number;
  y: number;
  targetZoneId: string;
  targetPos: { x: number; y: number };
  label: string;
  minLevel?: number;
  isDoor?: boolean;
}

export interface Zone {
  id: string;
  name: string;
  themeColor: string;
  bgMusicTheme: 'forest' | 'cave' | 'swamp' | 'volcano' | 'tundra' | 'castle' | 'void' | 'sanctuary';
  requiredLevel: number;
  mapWidth: number;
  mapHeight: number;
  tileData: number[][]; // 0: grass/floor, 1: wall/tree/rock, 2: path, 3: water/lava/void, 4: shop, 5: inn, 6: boss portal, 7: chest, 8: shrine, 9: fountain, 10: npc, 28: portal/door
  enemies: Omit<Enemy, 'id'>[];
  boss: Omit<Enemy, 'id'>;
  npcs?: NPC[];
  description: string;
  isInterior?: boolean;
  parentZoneId?: string;
  exitPosition?: { x: number; y: number };
  interiorType?: 'tavern' | 'forge' | 'botica' | 'castle' | 'crypt' | 'smugglers_cave' | 'dungeon';
  portals?: MapPortal[];
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
  exploredTilesByZone?: Record<string, string[]>; // zoneId -> ["x,y", ...]
  playTimeSeconds: number;
  lastSavedAt: string;
  slotIndex?: number;
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

// ============================================================================
// ⚔️ REAL-TIME ARPG OVERWORLD COMBAT SYSTEM TYPES
// ============================================================================

export interface HeroCombatSkill {
  id: string;
  name: string;
  icon: string;
  description: string;
  cooldownSeconds: number;
  manaCost: number;
  damageMultiplier: number;
  type: 'melee_aoe' | 'projectile' | 'buff' | 'heal' | 'dash_attack' | 'channel' | 'summon';
  vfxType: 'slash_wave' | 'fireball' | 'frost_nova' | 'multi_arrow' | 'holy_beam' | 'shadow_strike' | 'ground_slam' | 'soul_drain';
  range: number;
  aoeRadius?: number;
  stunDuration?: number;
  healAmount?: number;
}

export type OverworldEnemyType =
  | 'slime'
  | 'wolf'
  | 'goblin'
  | 'skeleton'
  | 'bandit'
  | 'golem'
  | 'dragon'
  | 'elemental'
  | 'knight'
  | 'boss';

export interface OverworldEnemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  expReward: number;
  goldReward: number;
  x: number; // grid x
  y: number; // grid y
  worldX: number; // 3D world x
  worldZ: number; // 3D world z
  spawnX: number;
  spawnY: number;
  patrolRadius: number;
  aggroRadius: number; // tiles
  attackRange: number; // distance units
  attackCooldown: number;
  lastAttackTime: number;
  state: 'idle' | 'patrol' | 'chase' | 'attack' | 'hit' | 'dead';
  enemyType: OverworldEnemyType;
  color: string;
  scale?: number;
  isBoss?: boolean;
  bossTitle?: string;
  deathTime?: number;
  targetHero?: boolean;
}

export interface CombatProjectile {
  id: string;
  x: number;
  z: number;
  y: number;
  dirX: number;
  dirZ: number;
  speed: number;
  damage: number;
  isPlayer: boolean;
  maxDistance: number;
  traveledDistance: number;
  vfxType: 'arrow' | 'fireball' | 'arcane_orb' | 'slash_wave' | 'holy_bolt' | 'dark_skull';
  color: string;
  radius: number;
  isCrit?: boolean;
  pierceCount?: number;
}

export interface CombatDamageNumber {
  id: string;
  text: string;
  x: number;
  y: number;
  z: number;
  color: string;
  isCrit?: boolean;
  isHeal?: boolean;
  createdAt: number;
  opacity: number;
}

export interface GroundDrop {
  id: string;
  x: number;
  z: number;
  y: number;
  type: 'gold' | 'exp' | 'item' | 'health_orb';
  amount?: number;
  itemId?: string;
  itemName?: string;
  itemIcon?: string;
  color: string;
  createdAt: number;
}

