import { Achievement, PlayerStats, Inventory } from '../types';
import { SHOP_CONSUMABLES, ALL_EQUIPMENT_DATABASE } from './itemsData';

export const GAME_ACHIEVEMENTS: Achievement[] = [
  // ==========================================
  // PROGRESIÓN (NIVELES Y ESTADÍSTICAS)
  // ==========================================
  {
    id: 'ach_level_2',
    title: 'Primeros Pasos',
    description: 'Alcanza el Nivel 2 forjando tu primer destino.',
    category: 'progression',
    rarity: 'common',
    icon: '🌱',
    targetType: 'reach_level',
    targetValue: 2,
    rewardGold: 25,
    rewardExp: 40,
  },
  {
    id: 'ach_level_5',
    title: 'Aspirante a Aventurero',
    description: 'Alcanza el Nivel 5 y domina tus habilidades básicas.',
    category: 'progression',
    rarity: 'common',
    icon: '⚔️',
    targetType: 'reach_level',
    targetValue: 5,
    rewardGold: 60,
    rewardExp: 120,
    rewardConsumable: SHOP_CONSUMABLES.find((c) => c.id === 'hp_potion_l'),
  },
  {
    id: 'ach_level_10',
    title: 'Veterano del Reino',
    description: 'Alcanza el Nivel 10 tras superar múltiples desafíos.',
    category: 'progression',
    rarity: 'rare',
    icon: '🛡️',
    targetType: 'reach_level',
    targetValue: 10,
    rewardGold: 150,
    rewardExp: 300,
    rewardConsumable: SHOP_CONSUMABLES.find((c) => c.id === 'elixir_restore'),
  },
  {
    id: 'ach_level_20',
    title: 'Campeón Consagrado',
    description: 'Alcanza el Nivel 20 y conviértete en una figura respetada en todo Aethelgard.',
    category: 'progression',
    rarity: 'epic',
    icon: '👑',
    targetType: 'reach_level',
    targetValue: 20,
    rewardGold: 400,
    rewardExp: 800,
    rewardEquipment: ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_h4'),
    rewardTitle: 'Campeón de Aethelgard',
  },
  {
    id: 'ach_level_30',
    title: 'Semidiós de las Eras',
    description: 'Alcanza el Nivel 30 desatando el máximo potencial de tu clase.',
    category: 'progression',
    rarity: 'legendary',
    icon: '🌟',
    targetType: 'reach_level',
    targetValue: 30,
    rewardGold: 1000,
    rewardExp: 2500,
    rewardEquipment: ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_r_god'),
    rewardTitle: 'El Inmortal',
  },

  // ==========================================
  // COMBATE (ENEMIGOS Y JEFES)
  // ==========================================
  {
    id: 'ach_kill_1',
    title: 'Bautismo de Sangre',
    description: 'Derrota a tu primer enemigo en combate por turnos.',
    category: 'combat',
    rarity: 'common',
    icon: '🗡️',
    targetType: 'defeat_enemies_total',
    targetValue: 1,
    rewardGold: 20,
    rewardExp: 30,
  },
  {
    id: 'ach_kill_15',
    title: 'Cazador de Bestias',
    description: 'Elimina a 15 criaturas salvajes en tus andanzas.',
    category: 'combat',
    rarity: 'common',
    icon: '🐺',
    targetType: 'defeat_enemies_total',
    targetValue: 15,
    rewardGold: 60,
    rewardExp: 120,
    rewardConsumable: SHOP_CONSUMABLES.find((c) => c.id === 'hp_potion_mega'),
  },
  {
    id: 'ach_kill_50',
    title: 'Terror de los Monstruos',
    description: 'Vence a 50 enemigos y purga los caminos del reino.',
    category: 'combat',
    rarity: 'rare',
    icon: '💀',
    targetType: 'defeat_enemies_total',
    targetValue: 50,
    rewardGold: 180,
    rewardExp: 400,
    rewardConsumable: SHOP_CONSUMABLES.find((c) => c.id === 'hp_potion_divine'),
  },
  {
    id: 'ach_kill_100',
    title: 'Erradicador de Sombras',
    description: 'Erradica a 100 monstruos en el continente.',
    category: 'combat',
    rarity: 'epic',
    icon: '🔥',
    targetType: 'defeat_enemies_total',
    targetValue: 100,
    rewardGold: 450,
    rewardExp: 900,
    rewardEquipment: ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_r1'),
  },
  {
    id: 'ach_boss_slime',
    title: 'Disolución Real',
    description: 'Derrota al Rey Slime del Bosque de los Comienzos.',
    category: 'combat',
    rarity: 'common',
    icon: '🧪',
    targetType: 'defeat_boss',
    targetValue: 'Rey Slime Ancestral',
    rewardGold: 75,
    rewardExp: 150,
  },
  {
    id: 'ach_boss_golem',
    title: 'Rompe-Rocas',
    description: 'Derrota al Golem de las Profundidades en las Minas de Mithril.',
    category: 'combat',
    rarity: 'rare',
    icon: '🗿',
    targetType: 'defeat_boss',
    targetValue: 'Golem de Piedra Rúnica',
    rewardGold: 160,
    rewardExp: 350,
  },
  {
    id: 'ach_boss_dragon',
    title: 'Matadragones',
    description: 'Somete al Dragón de Magma en el Volcán de Fuego.',
    category: 'combat',
    rarity: 'epic',
    icon: '🐉',
    targetType: 'defeat_boss',
    targetValue: 'Dragón de Magma Primordial',
    rewardGold: 400,
    rewardExp: 800,
    rewardEquipment: ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_w3'),
  },
  {
    id: 'ach_boss_ancient',
    title: 'Salvador de las Eras',
    description: 'Vence al Dios Primigenio Cronos y restaura el tejido del tiempo.',
    category: 'combat',
    rarity: 'legendary',
    icon: '👁️',
    targetType: 'defeat_boss',
    targetValue: 'Cronos, Dios del Tiempo',
    rewardGold: 1800,
    rewardExp: 3000,
    rewardEquipment: ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_a_god'),
    rewardTitle: 'Salvador Universal',
    secret: true,
  },
  {
    id: 'ach_bosses_total_5',
    title: 'Conquistador de Titanes',
    description: 'Derrota a 5 jefes de zona distintos.',
    category: 'combat',
    rarity: 'epic',
    icon: '🏆',
    targetType: 'defeat_bosses_total',
    targetValue: 5,
    rewardGold: 600,
    rewardExp: 1000,
  },

  // ==========================================
  // EXPLORACIÓN (ZONAS Y COFRES)
  // ==========================================
  {
    id: 'ach_chests_3',
    title: 'Ojo para el Botín',
    description: 'Abre 3 cofres del tesoro escondidos en el mundo.',
    category: 'exploration',
    rarity: 'common',
    icon: '📦',
    targetType: 'open_chests_total',
    targetValue: 3,
    rewardGold: 40,
    rewardExp: 60,
  },
  {
    id: 'ach_chests_10',
    title: 'Saqueador de Reliquias',
    description: 'Encuentra y abre 10 cofres del tesoro.',
    category: 'exploration',
    rarity: 'rare',
    icon: '🗝️',
    targetType: 'open_chests_total',
    targetValue: 10,
    rewardGold: 150,
    rewardExp: 250,
    rewardConsumable: SHOP_CONSUMABLES.find((c) => c.id === 'hp_potion_mega'),
  },
  {
    id: 'ach_chests_20',
    title: 'Amo de los Tesoros',
    description: 'Abre 20 cofres repartidos por todos los reinos.',
    category: 'exploration',
    rarity: 'epic',
    icon: '✨',
    targetType: 'open_chests_total',
    targetValue: 20,
    rewardGold: 450,
    rewardExp: 600,
    rewardEquipment: ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_b_god'),
  },
  {
    id: 'ach_reach_swamp',
    title: 'Aguas Brumosas',
    description: 'Adéntrate en las tierras del Pantano Espectral.',
    category: 'exploration',
    rarity: 'common',
    icon: '🌿',
    targetType: 'reach_zone',
    targetValue: 'zone_swamp',
    rewardGold: 60,
    rewardExp: 100,
  },
  {
    id: 'ach_reach_volcano',
    title: 'Senda de Fuego',
    description: 'Alcanza el cráter ardiente del Volcán Ancestral.',
    category: 'exploration',
    rarity: 'rare',
    icon: '🌋',
    targetType: 'reach_zone',
    targetValue: 'zone_volcano',
    rewardGold: 140,
    rewardExp: 250,
  },
  {
    id: 'ach_reach_void',
    title: 'Al Borde del Abismo',
    description: 'Llega a la dimensión prohibida de la Grieta del Vacío.',
    category: 'exploration',
    rarity: 'epic',
    icon: '🌌',
    targetType: 'reach_zone',
    targetValue: 'zone_void',
    rewardGold: 300,
    rewardExp: 500,
  },
  {
    id: 'ach_reach_sanctuary',
    title: 'Cumbres Celestiales',
    description: 'Alcanza el Santuario Sagrado de los Dioses en el firmamento.',
    category: 'exploration',
    rarity: 'legendary',
    icon: '🏛️',
    targetType: 'reach_zone',
    targetValue: 'zone_sanctuary',
    rewardGold: 700,
    rewardExp: 1200,
    rewardTitle: 'Caminante Astral',
  },

  // ==========================================
  // COLECCIÓN, MISIONES Y RIQUEZA
  // ==========================================
  {
    id: 'ach_lore_3',
    title: 'Curioso del Pasado',
    description: 'Desbloquea 3 crónicas de la historia en el Códice.',
    category: 'collection',
    rarity: 'common',
    icon: '📜',
    targetType: 'lore_unlocked_total',
    targetValue: 3,
    rewardGold: 35,
    rewardExp: 80,
  },
  {
    id: 'ach_lore_8',
    title: 'Cronista de Aethelgard',
    description: 'Descubre 8 entradas históricas y reliquias en el Códice.',
    category: 'collection',
    rarity: 'rare',
    icon: '📖',
    targetType: 'lore_unlocked_total',
    targetValue: 8,
    rewardGold: 140,
    rewardExp: 350,
  },
  {
    id: 'ach_lore_15',
    title: 'Erudito Universal',
    description: 'Completa 15 entradas de crónicas y secretos milenarios.',
    category: 'collection',
    rarity: 'epic',
    icon: '🔮',
    targetType: 'lore_unlocked_total',
    targetValue: 15,
    rewardGold: 400,
    rewardExp: 800,
    rewardEquipment: ALL_EQUIPMENT_DATABASE.find((e) => e.id === 'eq_h_god'),
  },
  {
    id: 'ach_quest_1',
    title: 'Servicio a la Comunidad',
    description: 'Completa con éxito tu primera misión de un habitante o NPC.',
    category: 'collection',
    rarity: 'common',
    icon: '🤝',
    targetType: 'quests_completed_total',
    targetValue: 1,
    rewardGold: 35,
    rewardExp: 60,
  },
  {
    id: 'ach_quest_5',
    title: 'Héroe del Pueblo',
    description: 'Cumple los encargos de 5 misiones de NPCs.',
    category: 'collection',
    rarity: 'rare',
    icon: '⭐',
    targetType: 'quests_completed_total',
    targetValue: 5,
    rewardGold: 180,
    rewardExp: 400,
    rewardConsumable: SHOP_CONSUMABLES.find((c) => c.id === 'elixir_restore'),
  },
  {
    id: 'ach_quest_10',
    title: 'Leyenda de los Reinos',
    description: 'Completa 10 misiones a lo largo de tu travesía.',
    category: 'collection',
    rarity: 'epic',
    icon: '⚜️',
    targetType: 'quests_completed_total',
    targetValue: 10,
    rewardGold: 450,
    rewardExp: 900,
  },
  {
    id: 'ach_gold_1000',
    title: 'Bolsa Acaudalada',
    description: 'Acumula al menos 1,000 monedas de oro en tu tesoro.',
    category: 'special',
    rarity: 'rare',
    icon: '💰',
    targetType: 'gold_accumulated',
    targetValue: 1000,
    rewardGold: 100,
    rewardExp: 200,
  },
  {
    id: 'ach_gold_5000',
    title: 'Magnate de Aethelgard',
    description: 'Alcanza una fortuna de 5,000 monedas de oro.',
    category: 'special',
    rarity: 'epic',
    icon: '💎',
    targetType: 'gold_accumulated',
    targetValue: 5000,
    rewardGold: 350,
    rewardExp: 600,
    rewardTitle: 'El Acaudalado',
  },
  {
    id: 'ach_full_equipment',
    title: 'Armado hasta los Dientes',
    description: 'Equipa simultáneamente Arma, Armadura, Casco, Botas y Anillo en tu personaje.',
    category: 'collection',
    rarity: 'rare',
    icon: '🥋',
    targetType: 'full_equipment',
    targetValue: 5,
    rewardGold: 120,
    rewardExp: 200,
  },
];

/**
 * Calcula el progreso actual de un logro en base al estado del juego
 */
export function getAchievementProgress(
  ach: Achievement,
  player: PlayerStats,
  inventory: Inventory,
  defeatedBosses: string[],
  openedChests: string[],
  completedQuests: string[],
  unlockedLoreIds: string[],
  defeatedEnemyCounts: Record<string, number>,
  visitedZoneIds: string[] = []
): { current: number; max: number; isCompleted: boolean } {
  const totalEnemies = Object.values(defeatedEnemyCounts).reduce((a, b) => a + b, 0);

  switch (ach.targetType) {
    case 'reach_level': {
      const target = Number(ach.targetValue);
      return {
        current: Math.min(player.level, target),
        max: target,
        isCompleted: player.level >= target,
      };
    }

    case 'defeat_enemies_total': {
      const target = Number(ach.targetValue);
      return {
        current: Math.min(totalEnemies, target),
        max: target,
        isCompleted: totalEnemies >= target,
      };
    }

    case 'defeat_boss': {
      const bossName = String(ach.targetValue);
      const isCompleted = defeatedBosses.some((b) => b.toLowerCase().includes(bossName.toLowerCase()) || bossName.toLowerCase().includes(b.toLowerCase()));
      return {
        current: isCompleted ? 1 : 0,
        max: 1,
        isCompleted,
      };
    }

    case 'defeat_bosses_total': {
      const target = Number(ach.targetValue);
      return {
        current: Math.min(defeatedBosses.length, target),
        max: target,
        isCompleted: defeatedBosses.length >= target,
      };
    }

    case 'open_chests_total': {
      const target = Number(ach.targetValue);
      return {
        current: Math.min(openedChests.length, target),
        max: target,
        isCompleted: openedChests.length >= target,
      };
    }

    case 'quests_completed_total': {
      const target = Number(ach.targetValue);
      return {
        current: Math.min(completedQuests.length, target),
        max: target,
        isCompleted: completedQuests.length >= target,
      };
    }

    case 'lore_unlocked_total': {
      const target = Number(ach.targetValue);
      return {
        current: Math.min(unlockedLoreIds.length, target),
        max: target,
        isCompleted: unlockedLoreIds.length >= target,
      };
    }

    case 'gold_accumulated': {
      const target = Number(ach.targetValue);
      return {
        current: Math.min(player.gold, target),
        max: target,
        isCompleted: player.gold >= target,
      };
    }

    case 'reach_zone': {
      const targetZoneId = String(ach.targetValue);
      const isCompleted = visitedZoneIds.includes(targetZoneId);
      return {
        current: isCompleted ? 1 : 0,
        max: 1,
        isCompleted,
      };
    }

    case 'full_equipment': {
      const eq = inventory.equipment;
      let count = 0;
      if (eq.weapon) count++;
      if (eq.armor) count++;
      if (eq.helmet) count++;
      if (eq.boots) count++;
      if (eq.ring) count++;
      const target = 5;
      return {
        current: count,
        max: target,
        isCompleted: count >= target,
      };
    }

    default:
      return { current: 0, max: 1, isCompleted: false };
  }
}
