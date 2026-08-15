import {
  HeroClass,
  PlayerStats,
  ConsumableItem,
  EquipmentItem
} from '../types';

export { ALL_SKILLS } from './skillsData';
export { INITIAL_CONSUMABLES, SHOP_CONSUMABLES, SHOP_EQUIPMENT } from './itemsData';
export { ALL_GAME_QUESTS, getQuestRewardEquipment, isZoneUnlocked, areZoneMainQuestsCompleted, getZoneRequirementMessage } from './questsData';
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
    description: 'Especialista en combate cuerpo a cuerpo con alta vida, defensa sólida y espada broadsword.',
    baseStats: {
      hp: 120,
      maxHp: 120,
      mp: 40,
      maxMp: 40,
      attack: 18,
      defense: 12,
      speed: 10,
    },
    icon: '⚔️',
    color: '#ef4444',
  },
  Mago: {
    name: 'Mago',
    description: 'Maestro de las artes arcanas con báculo de cristal y hechizos elementales de área.',
    baseStats: {
      hp: 80,
      maxHp: 80,
      mp: 100,
      maxMp: 100,
      attack: 24,
      defense: 6,
      speed: 12,
    },
    icon: '🪄',
    color: '#3b82f6',
  },
  Pícaro: {
    name: 'Pícaro',
    description: 'Luchador ágil y veloz con dagas gemelas, alto índice de críticos y veneno.',
    baseStats: {
      hp: 95,
      maxHp: 95,
      mp: 60,
      maxMp: 60,
      attack: 21,
      defense: 8,
      speed: 18,
    },
    icon: '🗡️',
    color: '#10b981',
  },
  Paladín: {
    name: 'Paladín',
    description: 'Caballero sagrado protegido por armadura dorada, escudo de la cruz y luz sanadora.',
    baseStats: {
      hp: 135,
      maxHp: 135,
      mp: 70,
      maxMp: 70,
      attack: 17,
      defense: 15,
      speed: 9,
    },
    icon: '🛡️',
    color: '#f59e0b',
  },
  Nigromante: {
    name: 'Nigromante',
    description: 'Invocador de las sombras con túnica del vacío, báculo de cráneo y drenaje de almas.',
    baseStats: {
      hp: 85,
      maxHp: 85,
      mp: 110,
      maxMp: 110,
      attack: 25,
      defense: 7,
      speed: 11,
    },
    icon: '💀',
    color: '#a855f7',
  },
  Arquero: {
    name: 'Arquero',
    description: 'Tirador certero con arco compuesto, flechas perforantes y evasión sobresaliente.',
    baseStats: {
      hp: 90,
      maxHp: 90,
      mp: 65,
      maxMp: 65,
      attack: 22,
      defense: 9,
      speed: 19,
    },
    icon: '🏹',
    color: '#84cc16',
  },
  Berserker: {
    name: 'Berserker',
    description: 'Bárbaro salvaje con hachas dobles de guerra, furia destructiva y daño físico masivo.',
    baseStats: {
      hp: 140,
      maxHp: 140,
      mp: 30,
      maxMp: 30,
      attack: 26,
      defense: 6,
      speed: 13,
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
