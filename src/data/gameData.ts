import {
  HeroClass,
  PlayerStats,
  ConsumableItem,
  EquipmentItem
} from '../types';

export { ALL_SKILLS } from './skillsData';
export { INITIAL_CONSUMABLES, SHOP_CONSUMABLES, SHOP_EQUIPMENT, ALL_EQUIPMENT_DATABASE } from './itemsData';
export { ALL_GAME_QUESTS, getQuestRewardEquipment, getQuestRewardConsumable, isZoneUnlocked, areZoneMainQuestsCompleted, getZoneRequirementMessage } from './questsData';
export { ZONES } from './zonesData';
export { GAME_LORE_ENTRIES } from './loreData';
export { GAME_ACHIEVEMENTS, getAchievementProgress } from './achievementsData';

export const HERO_CLASSES: Record<HeroClass, {
  name: string;
  description: string;
  baseStats: Omit<PlayerStats, 'name' | 'heroClass' | 'exp' | 'maxExp' | 'level' | 'gold' | 'score'>;
  icon: string;
  color: string;
}> = {
  Guerrero: {
    name: 'Guerrero',
    description: 'Especialista en combate cuerpo a cuerpo con alta vida, defensa sólida, bloqueo con escudo y gran resistencia física.',
    baseStats: {
      hp: 140,
      maxHp: 140,
      mp: 40,
      maxMp: 40,
      attack: 22,
      magicAttack: 5,
      defense: 18,
      magicDefense: 8,
      speed: 10,
      accuracy: 95,
      evasion: 4,
      critRate: 10,
      critDamage: 160,
      blockRate: 25,
      armorPenetration: 5,
      lifesteal: 0,
      mpRegen: 0,
      hpRegen: 2,
      magicFind: 0,
      goldBonus: 0,
      expBonus: 0,
    },
    icon: '⚔️',
    color: '#ef4444',
  },
  Mago: {
    name: 'Mago',
    description: 'Maestro de las artes arcanas con máximo poder mágico, regeneración pasiva de maná y resistencia elemental.',
    baseStats: {
      hp: 75,
      maxHp: 75,
      mp: 120,
      maxMp: 120,
      attack: 8,
      magicAttack: 32,
      defense: 5,
      magicDefense: 22,
      speed: 12,
      accuracy: 98,
      evasion: 6,
      critRate: 15,
      critDamage: 180,
      blockRate: 0,
      armorPenetration: 15,
      lifesteal: 0,
      mpRegen: 8,
      hpRegen: 0,
      magicFind: 10,
      goldBonus: 0,
      expBonus: 5,
    },
    icon: '🪄',
    color: '#3b82f6',
  },
  Pícaro: {
    name: 'Pícaro',
    description: 'Luchador ágil y letal con dagas gemelas, máxima evasión, crítico colosal y bonificación de fortuna.',
    baseStats: {
      hp: 90,
      maxHp: 90,
      mp: 60,
      maxMp: 60,
      attack: 24,
      magicAttack: 8,
      defense: 7,
      magicDefense: 9,
      speed: 20,
      accuracy: 100,
      evasion: 25,
      critRate: 30,
      critDamage: 220,
      blockRate: 0,
      armorPenetration: 15,
      lifesteal: 5,
      mpRegen: 1,
      hpRegen: 0,
      magicFind: 15,
      goldBonus: 20,
      expBonus: 0,
    },
    icon: '🗡️',
    color: '#10b981',
  },
  Paladín: {
    name: 'Paladín',
    description: 'Caballero sagrado protegido por armadura bendita, máximo bloqueo, regeneración de luz y equilibrio físico/mágico.',
    baseStats: {
      hp: 150,
      maxHp: 150,
      mp: 75,
      maxMp: 75,
      attack: 18,
      magicAttack: 18,
      defense: 22,
      magicDefense: 18,
      speed: 8,
      accuracy: 95,
      evasion: 2,
      critRate: 8,
      critDamage: 150,
      blockRate: 30,
      armorPenetration: 0,
      lifesteal: 0,
      mpRegen: 2,
      hpRegen: 8,
      magicFind: 0,
      goldBonus: 0,
      expBonus: 5,
    },
    icon: '🛡️',
    color: '#f59e0b',
  },
  Nigromante: {
    name: 'Nigromante',
    description: 'Invocador de las sombras con túnica del vacío, 20% de robo de vida innato, penetración y magia oscura.',
    baseStats: {
      hp: 85,
      maxHp: 85,
      mp: 110,
      maxMp: 110,
      attack: 12,
      magicAttack: 28,
      defense: 6,
      magicDefense: 16,
      speed: 11,
      accuracy: 94,
      evasion: 8,
      critRate: 14,
      critDamage: 180,
      blockRate: 0,
      armorPenetration: 20,
      lifesteal: 20,
      mpRegen: 4,
      hpRegen: 0,
      magicFind: 10,
      goldBonus: 0,
      expBonus: 0,
    },
    icon: '💀',
    color: '#a855f7',
  },
  Arquero: {
    name: 'Arquero',
    description: 'Tirador certero con 100% de puntería infalible, perforación de armadura letal y velocidad extrema.',
    baseStats: {
      hp: 95,
      maxHp: 95,
      mp: 65,
      maxMp: 65,
      attack: 26,
      magicAttack: 10,
      defense: 8,
      magicDefense: 10,
      speed: 18,
      accuracy: 100,
      evasion: 16,
      critRate: 25,
      critDamage: 200,
      blockRate: 0,
      armorPenetration: 25,
      lifesteal: 0,
      mpRegen: 1,
      hpRegen: 0,
      magicFind: 5,
      goldBonus: 10,
      expBonus: 5,
    },
    icon: '🏹',
    color: '#84cc16',
  },
  Berserker: {
    name: 'Berserker',
    description: 'Bárbaro salvaje con poder de ataque físico colosal, 250% de daño crítico y robo de vida, sacrificando su defensa.',
    baseStats: {
      hp: 160,
      maxHp: 160,
      mp: 30,
      maxMp: 30,
      attack: 34,
      magicAttack: 4,
      defense: 4,
      magicDefense: 4,
      speed: 14,
      accuracy: 90,
      evasion: 0,
      critRate: 30,
      critDamage: 250,
      blockRate: 5,
      armorPenetration: 20,
      lifesteal: 10,
      mpRegen: 0,
      hpRegen: 0,
      magicFind: 0,
      goldBonus: 0,
      expBonus: 0,
    },
    icon: '🪓',
    color: '#ea580c',
  },
};

/**
 * Generates probabilistic loot for random encounters across the 8 zones
 */
export function getRandomEncounterDrop(zoneId: string): {
  consumable?: ConsumableItem;
  equipment?: EquipmentItem;
} | null {
  const roll = Math.random();
  // 35% chance to get loot in non-boss battles
  if (roll >= 0.35) {
    return null;
  }

  // 75% Consumables, 25% Equipment
  if (roll < 0.26) {
    if (zoneId === 'zone_forest') {
      const options: ConsumableItem[] = [
        { id: 'hp_potion_s', name: 'Poción de Salud Pequeña', effect: 'heal_hp', power: 40, price: 15, quantity: 1, description: 'Restaura 40 HP.', icon: '🧪' },
        { id: 'mp_potion_s', name: 'Poción de Maná Pequeña', effect: 'heal_mp', power: 25, price: 15, quantity: 1, description: 'Restaura 25 MP.', icon: '💙' },
      ];
      return { consumable: options[Math.floor(Math.random() * options.length)] };
    } else if (zoneId === 'zone_cave' || zoneId === 'zone_swamp') {
      const options: ConsumableItem[] = [
        { id: 'hp_potion_s', name: 'Poción de Salud Pequeña', effect: 'heal_hp', power: 40, price: 15, quantity: 1, description: 'Restaura 40 HP.', icon: '🧪' },
        { id: 'hp_potion_l', name: 'Poción de Salud Mayor', effect: 'heal_hp', power: 140, price: 65, quantity: 1, description: 'Restaura 140 HP.', icon: '🧪' },
        { id: 'mp_potion_s', name: 'Poción de Maná Pequeña', effect: 'heal_mp', power: 25, price: 15, quantity: 1, description: 'Restaura 25 MP.', icon: '💙' },
      ];
      return { consumable: options[Math.floor(Math.random() * options.length)] };
    } else if (zoneId === 'zone_volcano' || zoneId === 'zone_tundra') {
      const options: ConsumableItem[] = [
        { id: 'hp_potion_l', name: 'Poción de Salud Mayor', effect: 'heal_hp', power: 140, price: 65, quantity: 1, description: 'Restaura 140 HP.', icon: '🧪' },
        { id: 'mp_potion_l', name: 'Poción de Maná Mayor', effect: 'heal_mp', power: 80, price: 60, quantity: 1, description: 'Restaura 80 MP.', icon: '💙' },
        { id: 'tonic_atk', name: 'Tónico de Furia', effect: 'buff_atk', power: 1.5, price: 90, quantity: 1, description: 'Aumenta Ataque un 50%.', icon: '🏺' },
      ];
      return { consumable: options[Math.floor(Math.random() * options.length)] };
    } else {
      // Castle, Void, Sanctuary
      const options: ConsumableItem[] = [
        { id: 'hp_potion_mega', name: 'Mega-Poción de Vitalidad', effect: 'heal_hp', power: 350, price: 180, quantity: 1, description: 'Restaura 350 HP.', icon: '💖' },
        { id: 'mp_potion_mega', name: 'Mega-Éter Arcano', effect: 'heal_mp', power: 200, price: 160, quantity: 1, description: 'Restaura 200 MP.', icon: '🔮' },
        { id: 'elixir_restore', name: 'Elixir de Restauración', effect: 'heal_all', power: 1.0, price: 250, quantity: 1, description: 'Restaura todo el HP y MP.', icon: '✨' },
      ];
      return { consumable: options[Math.floor(Math.random() * options.length)] };
    }
  } else {
    // Rustic/Common Equipment Drops
    if (zoneId === 'zone_forest') {
      const options: EquipmentItem[] = [
        { id: `drop_${Date.now()}_1`, name: 'Garrote de Trasgo', slot: 'weapon', bonusAttack: 4, price: 30, description: 'Arma tosca de madera usada por trasgos novatos.', icon: '🪵' },
        { id: `drop_${Date.now()}_2`, name: 'Daga Oxidada', slot: 'weapon', bonusAttack: 5, bonusSpeed: 1, price: 35, description: 'Pequeña hoja de hierro con filo gastado.', icon: '🗡️' },
        { id: `drop_${Date.now()}_3`, name: 'Escudo de Corteza', slot: 'shield', bonusDefense: 3, bonusHp: 10, price: 25, description: 'Pedazo de tronco amarrado para desviar golpes leves.', icon: '🛡️' },
      ];
      return { equipment: options[Math.floor(Math.random() * options.length)] };
    } else if (zoneId === 'zone_cave' || zoneId === 'zone_swamp') {
      const options: EquipmentItem[] = [
        { id: `drop_${Date.now()}_4`, name: 'Pico de Minero Gastado', slot: 'weapon', bonusAttack: 10, price: 80, description: 'Herramienta de extracción recuperada de las galerías.', icon: '⛏️' },
        { id: `drop_${Date.now()}_5`, name: 'Broquel de Piedra Calcárea', slot: 'shield', bonusDefense: 7, bonusHp: 20, price: 75, description: 'Defensa tallada toscamente en piedra cavernaria.', icon: '🛡️' },
      ];
      return { equipment: options[Math.floor(Math.random() * options.length)] };
    } else if (zoneId === 'zone_volcano' || zoneId === 'zone_tundra') {
      const options: EquipmentItem[] = [
        { id: `drop_${Date.now()}_6`, name: 'Daga de Ceniza Volcánica', slot: 'weapon', bonusAttack: 22, bonusSpeed: 3, price: 220, description: 'Hoja ennegrecida templada en lava.', icon: '🗡️' },
        { id: `drop_${Date.now()}_7`, name: 'Escama de Drake Ígneo', slot: 'shield', bonusDefense: 15, bonusHp: 50, price: 240, description: 'Escama endurecida resistente al fuego.', icon: '🛡️' },
      ];
      return { equipment: options[Math.floor(Math.random() * options.length)] };
    } else {
      const options: EquipmentItem[] = [
        { id: `drop_${Date.now()}_8`, name: 'Espada de Hueso Maldita', slot: 'weapon', bonusAttack: 32, price: 450, description: 'Espada forjada con restos óseos.', icon: '⚔️' },
        { id: `drop_${Date.now()}_9`, name: 'Cota de Malla Quebrada', slot: 'armor', bonusDefense: 28, bonusHp: 100, price: 420, description: 'Armadura desgastada que conserva parte de su encanto.', icon: '🛡️' },
      ];
      return { equipment: options[Math.floor(Math.random() * options.length)] };
    }
  }
}

/**
 * Unique Mythic and Legendary Relics exclusive to the 8 Zone Bosses
 */
export const BOSS_LEGENDARY_DROPS: Record<string, EquipmentItem> = {
  zone_forest: {
    id: 'boss_drop_forest',
    name: '👑 Mandoble del Señor del Bosque',
    slot: 'weapon',
    bonusAttack: 38,
    bonusDefense: 15,
    bonusBlockRate: 20,
    bonusHpRegen: 5,
    bonusMagicFind: 10,
    price: 3500,
    description: 'Reliquia legendaria forjada con el núcleo del Treant Ancestro. Otorga gran bloqueo y regeneración.',
    icon: '🗡️',
  },
  zone_cave: {
    id: 'boss_drop_cave',
    name: '👑 Mazo Rompecielos del Gólem Colosal',
    slot: 'weapon',
    bonusAttack: 52,
    bonusDefense: 25,
    bonusArmorPenetration: 25,
    bonusHp: 150,
    price: 5200,
    description: 'Arma titánica de granito primigenio que desintegra la armadura enemiga con cada impacto.',
    icon: '🔨',
  },
  zone_swamp: {
    id: 'boss_drop_swamp',
    name: '👑 Colmillos Tóxicos de la Hidra Abisal',
    slot: 'weapon',
    bonusAttack: 48,
    bonusSpeed: 10,
    bonusCritRate: 25,
    bonusCritDamage: 50,
    bonusLifesteal: 12,
    price: 6800,
    description: 'Dagas gemelas imbuidas de veneno corrosivo con letalidad crítica y robo de vida.',
    icon: '🗡️',
  },
  zone_volcano: {
    id: 'boss_drop_volcano',
    name: '👑 Hoja Solar del Fénix de Ignis',
    slot: 'weapon',
    bonusAttack: 72,
    bonusMagicAttack: 40,
    bonusCritRate: 20,
    bonusArmorPenetration: 25,
    price: 8900,
    description: 'Espada ígnea ardiente que calcina la resistencia del objetivo con llamas purificadoras.',
    icon: '🔥',
  },
  zone_tundra: {
    id: 'boss_drop_tundra',
    name: '👑 Cetro de Hielo Eterno de Ymir',
    slot: 'weapon',
    bonusAttack: 25,
    bonusMagicAttack: 85,
    bonusMagicDefense: 35,
    bonusMp: 200,
    bonusMpRegen: 10,
    price: 11000,
    description: 'Báculo glacial supremo que congela el campo de batalla y otorga maná ilimitado.',
    icon: '❄️',
  },
  zone_castle: {
    id: 'boss_drop_castle',
    name: '👑 Égida Sagrada del Rey Inmortal',
    slot: 'shield',
    bonusDefense: 60,
    bonusMagicDefense: 45,
    bonusHp: 350,
    bonusBlockRate: 35,
    bonusHpRegen: 12,
    price: 14500,
    description: 'El escudo definitivo de la dinastía real. Bloquea ataques demoledores y cura continuamente.',
    icon: '🛡️',
  },
  zone_void: {
    id: 'boss_drop_void',
    name: '👑 Guadaña Segadora de Almas de Malakor',
    slot: 'weapon',
    bonusAttack: 95,
    bonusMagicAttack: 60,
    bonusLifesteal: 25,
    bonusArmorPenetration: 35,
    bonusCritRate: 22,
    price: 18500,
    description: 'Arma mítica del heraldo del vacío. Drena el 25% de la vitalidad enemiga por golpe.',
    icon: '💀',
  },
  zone_sanctuary: {
    id: 'boss_drop_sanctuary',
    name: '👑 Hoja del Génesis de Aethelgard',
    slot: 'weapon',
    bonusAttack: 120,
    bonusMagicAttack: 100,
    bonusDefense: 50,
    bonusMagicDefense: 50,
    bonusHp: 500,
    bonusCritRate: 30,
    bonusCritDamage: 75,
    bonusLifesteal: 20,
    price: 25000,
    description: 'La espada cósmica suprema que encierra la esencia de la creación y la victoria eterna.',
    icon: '🌟',
  },
};

/**
 * Calculates probabilistic Boss drop (10% base chance, boosted by player Magic Find)
 */
export function getBossLegendaryDrop(zoneId: string, playerMagicFind: number = 0): EquipmentItem | null {
  const relic = BOSS_LEGENDARY_DROPS[zoneId];
  if (!relic) return null;

  // Base 10% chance
  const baseChance = 0.10;
  const effectiveChance = baseChance * (1 + Math.max(0, playerMagicFind) / 100);
  const roll = Math.random();

  if (roll < effectiveChance) {
    return relic;
  }
  return null;
}
