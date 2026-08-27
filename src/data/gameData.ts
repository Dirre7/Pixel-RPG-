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

// 📈 Fórmula Progresiva de Nivel RPG Clásica
export const getRequiredExpForLevel = (level: number): number => {
  return Math.round(80 * Math.pow(level, 1.8) + level * 60);
};

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

// ============================================================================
// ⚔️ REAL-TIME ARPG HERO COMBAT SKILLS (3 Active Skills Per Class)
// ============================================================================

export const HERO_COMBAT_SKILLS: Record<HeroClass, HeroCombatSkill[]> = {
  warrior: [
    {
      id: 'warrior_skill_1',
      name: '🌪️ Torbellino de Acero',
      icon: '🌪️',
      description: 'Gira con la espada golpeando a todos los enemigos a tu alrededor.',
      cooldownSeconds: 4.5,
      manaCost: 20,
      damageMultiplier: 2.2,
      type: 'melee_aoe',
      vfxType: 'slash_wave',
      range: 3.5,
      aoeRadius: 3.5,
    },
    {
      id: 'warrior_skill_2',
      name: '🛡️ Embestida de Escudo',
      icon: '🛡️',
      description: 'Carga hacia adelante aturdiendo e impactando violentamente al enemigo.',
      cooldownSeconds: 6.0,
      manaCost: 25,
      damageMultiplier: 2.8,
      type: 'dash_attack',
      vfxType: 'ground_slam',
      range: 5.5,
      stunDuration: 1.5,
    },
    {
      id: 'warrior_skill_3',
      name: '⚔️ Grito de Guerra',
      icon: '📯',
      description: 'Ruge con furia, aumentando tu Ataque y curando el 25% de tu Salud máxima.',
      cooldownSeconds: 12.0,
      manaCost: 35,
      damageMultiplier: 1.0,
      type: 'heal',
      vfxType: 'holy_beam',
      range: 0,
      healAmount: 0.25,
    },
  ],
  mage: [
    {
      id: 'mage_skill_1',
      name: '🔥 Bola de Fuego Infernal',
      icon: '🔥',
      description: 'Lanza una gran esfera ardiente que explota al impactar en área.',
      cooldownSeconds: 3.5,
      manaCost: 25,
      damageMultiplier: 2.6,
      type: 'projectile',
      vfxType: 'fireball',
      range: 8.0,
      aoeRadius: 2.8,
    },
    {
      id: 'mage_skill_2',
      name: '❄️ Nova de Escarcha',
      icon: '❄️',
      description: 'Desata una explosión gélida a tu alrededor que congela a los enemigos.',
      cooldownSeconds: 6.5,
      manaCost: 30,
      damageMultiplier: 2.0,
      type: 'melee_aoe',
      vfxType: 'frost_nova',
      range: 4.0,
      aoeRadius: 4.0,
      stunDuration: 2.0,
    },
    {
      id: 'mage_skill_3',
      name: '⚡ Tormenta Arcana',
      icon: '⚡',
      description: 'Invoca un bombardeo de energía arcana que devasta el campo de batalla.',
      cooldownSeconds: 10.0,
      manaCost: 50,
      damageMultiplier: 3.5,
      type: 'melee_aoe',
      vfxType: 'holy_beam',
      range: 7.0,
      aoeRadius: 5.0,
    },
  ],
  archer: [
    {
      id: 'archer_skill_1',
      name: '🏹 Disparo Múltiple',
      icon: '🏹',
      description: 'Dispara una ráfaga de 3 flechas letales en abanico.',
      cooldownSeconds: 3.0,
      manaCost: 18,
      damageMultiplier: 1.8,
      type: 'projectile',
      vfxType: 'multi_arrow',
      range: 9.0,
    },
    {
      id: 'archer_skill_2',
      name: '💣 Trampa Explosiva',
      icon: '💣',
      description: 'Coloca una mina ígnea que detona al paso de los monstruos.',
      cooldownSeconds: 5.5,
      manaCost: 22,
      damageMultiplier: 2.8,
      type: 'melee_aoe',
      vfxType: 'ground_slam',
      range: 4.0,
      aoeRadius: 3.2,
    },
    {
      id: 'archer_skill_3',
      name: '🌧️ Lluvia de Flechas',
      icon: '🌧️',
      description: 'Haz llover cientos de proyectiles afilados sobre el área objetivo.',
      cooldownSeconds: 9.0,
      manaCost: 40,
      damageMultiplier: 3.2,
      type: 'melee_aoe',
      vfxType: 'multi_arrow',
      range: 8.0,
      aoeRadius: 4.5,
    },
  ],
  rogue: [
    {
      id: 'rogue_skill_1',
      name: '🗡️ Golpe Sombrío',
      icon: '🗡️',
      description: 'Apuñala a la velocidad de la luz infligiendo daño crítico masivo.',
      cooldownSeconds: 3.0,
      manaCost: 15,
      damageMultiplier: 2.5,
      type: 'dash_attack',
      vfxType: 'shadow_strike',
      range: 4.5,
    },
    {
      id: 'rogue_skill_2',
      name: '🔪 Abanico de Dagas',
      icon: '🔪',
      description: 'Lanza una lluvia circular de dagas venenosas en 360 grados.',
      cooldownSeconds: 5.0,
      manaCost: 22,
      damageMultiplier: 2.2,
      type: 'melee_aoe',
      vfxType: 'slash_wave',
      range: 4.0,
      aoeRadius: 4.0,
    },
    {
      id: 'rogue_skill_3',
      name: '💨 Danza de las Sombras',
      icon: '💨',
      description: 'Aumenta tu velocidad al máximo y cura el 20% de Salud al matar.',
      cooldownSeconds: 8.5,
      manaCost: 30,
      damageMultiplier: 2.8,
      type: 'buff',
      vfxType: 'shadow_strike',
      range: 0,
      healAmount: 0.20,
    },
  ],
  paladin: [
    {
      id: 'paladin_skill_1',
      name: '✨ Castigo Sagrado',
      icon: '✨',
      description: 'Invoca un pilar de luz celestial que pulveriza la oscuridad.',
      cooldownSeconds: 4.0,
      manaCost: 20,
      damageMultiplier: 2.4,
      type: 'melee_aoe',
      vfxType: 'holy_beam',
      range: 5.0,
      aoeRadius: 3.5,
    },
    {
      id: 'paladin_skill_2',
      name: '🛡️ Escudo Divino',
      icon: '🛡️',
      description: 'Crea una barrera sagrada que absorbe daño y empuja a los enemigos.',
      cooldownSeconds: 8.0,
      manaCost: 30,
      damageMultiplier: 1.8,
      type: 'melee_aoe',
      vfxType: 'holy_beam',
      range: 3.0,
      aoeRadius: 3.0,
      stunDuration: 1.5,
    },
    {
      id: 'paladin_skill_3',
      name: '💖 Plegaria de Sanación',
      icon: '💖',
      description: 'Canaliza el poder de la Luz curando el 40% de tu Salud total.',
      cooldownSeconds: 11.0,
      manaCost: 35,
      damageMultiplier: 1.0,
      type: 'heal',
      vfxType: 'holy_beam',
      range: 0,
      healAmount: 0.40,
    },
  ],
  necromancer: [
    {
      id: 'necromancer_skill_1',
      name: '💀 Calavera Espectral',
      icon: '💀',
      description: 'Dispara un cráneo de fuego fatuo que busca y desintegra al enemigo.',
      cooldownSeconds: 3.2,
      manaCost: 20,
      damageMultiplier: 2.3,
      type: 'projectile',
      vfxType: 'dark_skull',
      range: 8.5,
    },
    {
      id: 'necromancer_skill_2',
      name: '🩸 Drenaje de Almas',
      icon: '🩸',
      description: 'Absorbe la fuerza vital enemiga robando salud y maná de golpe.',
      cooldownSeconds: 6.0,
      manaCost: 25,
      damageMultiplier: 2.5,
      type: 'melee_aoe',
      vfxType: 'soul_drain',
      range: 4.5,
      aoeRadius: 3.5,
      healAmount: 0.20,
    },
    {
      id: 'necromancer_skill_3',
      name: '☠️ Nube de Peste',
      icon: '☠️',
      description: 'Planta un miasma venenoso que asfixia a todos los enemigos en el área.',
      cooldownSeconds: 9.0,
      manaCost: 45,
      damageMultiplier: 3.4,
      type: 'melee_aoe',
      vfxType: 'soul_drain',
      range: 6.0,
      aoeRadius: 4.5,
    },
  ],
  berserker: [
    {
      id: 'berserker_skill_1',
      name: '🪓 Tajo Desgarrador',
      icon: '🪓',
      description: 'Lanza un tajo brutal con hacha que hiende la armadura enemiga.',
      cooldownSeconds: 3.5,
      manaCost: 15,
      damageMultiplier: 2.5,
      type: 'melee_aoe',
      vfxType: 'slash_wave',
      range: 3.5,
      aoeRadius: 3.0,
    },
    {
      id: 'berserker_skill_2',
      name: '🌋 Impacto Sísmico',
      icon: '🌋',
      description: 'Golpea el suelo con tremenda fuerza desatando una onda de choque.',
      cooldownSeconds: 5.5,
      manaCost: 25,
      damageMultiplier: 3.0,
      type: 'melee_aoe',
      vfxType: 'ground_slam',
      range: 4.5,
      aoeRadius: 4.0,
      stunDuration: 1.5,
    },
    {
      id: 'berserker_skill_3',
      name: '🔥 Furia Imparable',
      icon: '🔥',
      description: 'Entra en frenesí berserker aumentando el Daño Crítico en un 50%.',
      cooldownSeconds: 10.0,
      manaCost: 30,
      damageMultiplier: 3.8,
      type: 'buff',
      vfxType: 'slash_wave',
      range: 0,
      healAmount: 0.15,
    },
  ],
};

/**
 * Generates initial live overworld enemies for a zone with coordinates, stats and patrol points
 */
export function generateZoneOverworldEnemies(
  zoneId: string,
  mapW: number,
  mapH: number,
  tileData: number[][]
): OverworldEnemy[] {
  // 🛑 Peaceful Interiors (Forge, Tavern, Apothecary, City Hall, Houses) have ZERO enemies
  if (
    zoneId.startsWith('subzone_') ||
    zoneId.startsWith('interior_') ||
    zoneId.includes('forge') ||
    zoneId.includes('tavern') ||
    zoneId.includes('botica') ||
    zoneId.includes('apothecary') ||
    zoneId.includes('house')
  ) {
    return [];
  }

  const enemies: OverworldEnemy[] = [];

  // Keep spawn distance far away from central village plaza, houses and market
  const isInsideSafeTown = (gx: number, gy: number) => {
    if (zoneId === 'zone_forest') {
      // Village plaza, houses, market and farms area
      return gx >= 18 && gx <= 54 && gy >= 36 && gy <= 72;
    }
    return false;
  };

  if (zoneId === 'zone_forest') {
    let attempts = 0;
    while (enemies.length < 22 && attempts < 500) {
      attempts++;
      const gx = 3 + Math.floor(Math.random() * (mapW - 6));
      const gy = 3 + Math.floor(Math.random() * (mapH - 6));

      const tile = tileData[gy]?.[gx];
      if (tile === 0 && !isInsideSafeTown(gx, gy)) {
        // Calculate distance from town center (36, 56)
        const distFromTown = Math.hypot(gx - 36, gy - 56);

        let template: { type: OverworldEnemyType; name: string; color: string; level: number; hp: number; atk: number; def: number; exp: number; gold: number; scale?: number };

        if (distFromTown < 22) {
          // 🟢 Region 1: Perímetro Exterior (Slimes Nv. 1-2)
          template = { type: 'slime', name: 'Slime de Bosque', color: '#22c55e', level: 2, hp: 85, atk: 22, def: 6, exp: 12, gold: 3, scale: 0.9 };
        } else if (distFromTown < 32) {
          // 🐺 Region 2: Bosque Medio (Lobos Salvajes Nv. 3-4)
          template = { type: 'wolf', name: 'Lobo Salvaje', color: '#64748b', level: 4, hp: 150, atk: 34, def: 12, exp: 26, gold: 6, scale: 1.0 };
        } else {
          // 🧝 Region 3: Bosque Profundo y Ruinas Lejanas (Bandidos Nv. 5-7)
          template = Math.random() < 0.5
            ? { type: 'goblin', name: 'Duende Saqueador', color: '#15803d', level: 5, hp: 210, atk: 46, def: 16, exp: 42, gold: 12, scale: 0.95 }
            : { type: 'bandit', name: 'Bandido de los Caminos', color: '#b45309', level: 7, hp: 280, atk: 58, def: 22, exp: 60, gold: 16, scale: 1.05 };
        }

        enemies.push({
          id: `overworld_${zoneId}_${gx}_${gy}_${enemies.length}`,
          name: template.name,
          level: template.level,
          hp: template.hp,
          maxHp: template.hp,
          attack: template.atk,
          defense: template.def,
          expReward: template.exp,
          goldReward: template.gold,
          x: gx,
          y: gy,
          worldX: gx,
          worldZ: gy,
          spawnX: gx,
          spawnY: gy,
          patrolRadius: 2.2,
          aggroRadius: 5.5,
          attackRange: 1.4,
          attackCooldown: 1.5,
          lastAttackTime: 0,
          state: 'patrol',
          enemyType: template.type,
          color: template.color,
          scale: template.scale || 1.0,
        });
      }
    }
    return enemies;
  }

  // Dungeon and dangerous wilderness zone configurations
  const zoneConfig: Record<
    string,
    {
      types: { type: OverworldEnemyType; name: string; color: string; level: number; hp: number; atk: number; def: number; exp: number; gold: number; scale?: number }[];
      count: number;
    }
  > = {
    zone_cave: {
      count: 18,
      types: [
        { type: 'bat', name: 'Murciélago de Cañón', color: '#64748b', level: 6, hp: 190, atk: 36, def: 14, exp: 45, gold: 12, scale: 0.95 },
        { type: 'skeleton', name: 'Esqueleto Minero con Pico', color: '#e2e8f0', level: 8, hp: 280, atk: 46, def: 20, exp: 65, gold: 18, scale: 1.0 },
        { type: 'bandit', name: 'Ladrón de Gemas', color: '#7c3aed', level: 10, hp: 340, atk: 54, def: 24, exp: 90, gold: 24, scale: 1.0 },
      ],
    },
    subzone_crypt: {
      count: 18,
      types: [
        { type: 'elemental', name: 'Espectro Afligido', color: '#93c5fd', level: 11, hp: 420, atk: 68, def: 28, exp: 120, gold: 30, scale: 1.0 },
        { type: 'skeleton', name: 'Guerrero No-Muerto Acorazado', color: '#94a3b8', level: 13, hp: 560, atk: 82, def: 40, exp: 160, gold: 40, scale: 1.1 },
        { type: 'goblin', name: 'Chamán Nigromante', color: '#6366f1', level: 15, hp: 640, atk: 96, def: 32, exp: 210, gold: 50, scale: 1.05 },
      ],
    },
    zone_swamp: {
      count: 18,
      types: [
        { type: 'slime', name: 'Cieno Ponzoñoso Ácido', color: '#166534', level: 16, hp: 720, atk: 105, def: 48, exp: 260, gold: 60, scale: 1.1 },
        { type: 'wolf', name: 'Serpiente del Fango Gigante', color: '#047857', level: 18, hp: 880, atk: 122, def: 54, exp: 320, gold: 75, scale: 1.15 },
        { type: 'wolf', name: 'Bestia Cazadora del Pantano', color: '#334155', level: 20, hp: 1050, atk: 140, def: 60, exp: 400, gold: 90, scale: 1.2 },
      ],
    },
    subzone_smugglers_cave: {
      count: 18,
      types: [
        { type: 'bandit', name: 'Corsario Renegado', color: '#b45309', level: 21, hp: 1200, atk: 155, def: 70, exp: 480, gold: 110, scale: 1.1 },
        { type: 'golem', name: 'Gólem de Coral y Mareas', color: '#0284c7', level: 23, hp: 1450, atk: 175, def: 90, exp: 580, gold: 130, scale: 1.25 },
        { type: 'elemental', name: 'Hechicera de las Olas', color: '#38bdf8', level: 25, hp: 1600, atk: 195, def: 78, exp: 700, gold: 160, scale: 1.1 },
      ],
    },
    zone_volcano: {
      count: 20,
      types: [
        { type: 'skeleton', name: 'Guerrero Calcinado de Lava', color: '#7c2d12', level: 26, hp: 1800, atk: 215, def: 100, exp: 820, gold: 180, scale: 1.1 },
        { type: 'elemental', name: 'Elemental de Magma Supremo', color: '#ea580c', level: 28, hp: 2200, atk: 245, def: 110, exp: 960, gold: 220, scale: 1.2 },
        { type: 'dragon', name: 'Gárgola de Obsidiana Volcánica', color: '#991b1b', level: 30, hp: 2600, atk: 275, def: 130, exp: 1150, gold: 260, scale: 1.35 },
      ],
    },
    zone_castle: {
      count: 22,
      types: [
        { type: 'knight', name: 'Caballero Corrupto', color: '#334155', level: 35, hp: 1500, atk: 230, def: 100, exp: 850, gold: 650, scale: 1.15 },
        { type: 'elemental', name: 'Espectro de las Sombras', color: '#a855f7', level: 37, hp: 1750, atk: 270, def: 85, exp: 1050, gold: 800, scale: 1.1 },
        { type: 'golem', name: 'Gárgola Imperial', color: '#6366f1', level: 40, hp: 2300, atk: 310, def: 130, exp: 1400, gold: 1100, scale: 1.2 },
      ],
    },
    zone_tundra: {
      count: 18,
      types: [
        { type: 'wolf', name: 'Lobo Ártico', color: '#f8fafc', level: 28, hp: 950, atk: 160, def: 65, exp: 500, gold: 360, scale: 1.1 },
        { type: 'golem', name: 'Gigante de Hielo', color: '#93c5fd', level: 30, hp: 1300, atk: 190, def: 85, exp: 680, gold: 500, scale: 1.3 },
      ],
    },
    zone_sanctuary: {
      count: 24,
      types: [
        { type: 'knight', name: 'Custodio Celestial', color: '#fbbf24', level: 50, hp: 2800, atk: 380, def: 160, exp: 2000, gold: 1500, scale: 1.25 },
        { type: 'dragon', name: 'Dragón Astral', color: '#38bdf8', level: 55, hp: 4200, atk: 480, def: 210, exp: 3500, gold: 2500, scale: 1.5 },
      ],
    },
  };

  const config = zoneConfig[zoneId] || zoneConfig.zone_cave;
  let attempts = 0;
  let enemyIndex = 0;

  while (enemies.length < config.count && attempts < 400) {
    attempts++;
    const gx = 3 + Math.floor(Math.random() * (mapW - 6));
    const gy = 3 + Math.floor(Math.random() * (mapH - 6));

    const tile = tileData[gy]?.[gx];
    if (tile === 0) {
      const template = config.types[enemyIndex % config.types.length];
      enemyIndex++;

      enemies.push({
        id: `overworld_${zoneId}_${gx}_${gy}_${enemies.length}`,
        name: template.name,
        level: template.level,
        hp: template.hp,
        maxHp: template.hp,
        attack: template.atk,
        defense: template.def,
        expReward: template.exp,
        goldReward: template.gold,
        x: gx,
        y: gy,
        worldX: gx,
        worldZ: gy,
        spawnX: gx,
        spawnY: gy,
        patrolRadius: 2.2,
        aggroRadius: 5.5,
        attackRange: template.type === 'dragon' ? 2.5 : 1.4,
        attackCooldown: 1.6,
        lastAttackTime: 0,
        state: 'patrol',
        enemyType: template.type,
        color: template.color,
        scale: template.scale || 1.0,
      });
    }
  }

  return enemies;
}

