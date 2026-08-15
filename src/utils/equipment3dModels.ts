// ==============================================================================
// 🛡️ REPOSITORIO Y MAPEO DE MODELOS 3D PARA ARMAS Y ESCUDOS
// ==============================================================================

export const WEAPON_3D_MODELS: Record<string, string> = {
  // Espadas y Mandobles
  'weapon_iron_sword': '/models/weapons/weapon_iron_sword.glb',
  'weapon_steel_sword': '/models/weapons/weapon_steel_sword.glb',
  'weapon_greatsword': '/models/weapons/weapon_greatsword.glb',
  'weapon_volcanic_blade': '/models/weapons/weapon_volcanic_blade.glb',
  'weapon_celestial_sword': '/models/weapons/weapon_celestial_sword.glb',
  'weapon_bone_sword': '/models/weapons/weapon_bone_sword.glb',

  // Dagas y Asesinos
  'weapon_hunter_dagger': '/models/weapons/weapon_hunter_dagger.glb',
  'weapon_shadow_daggers': '/models/weapons/weapon_shadow_daggers.glb',
  'weapon_poison_daggers': '/models/weapons/weapon_poison_daggers.glb',

  // Hachas y Martillos
  'weapon_double_waraxe': '/models/weapons/weapon_double_waraxe.glb',
  'weapon_mithril_hammer': '/models/weapons/pixellabs-warhammer-3626.glb',
  'weapon_titanic_hammer': '/models/weapons/pixellabs-warhammer-3626.glb',
  'pixellabs-warhammer-3626': '/models/weapons/pixellabs-warhammer-3626.glb',

  // Báculos y Cetros
  'weapon_oak_staff': '/models/weapons/weapon_oak_staff.glb',
  'weapon_crystal_staff': '/models/weapons/weapon_crystal_staff.glb',
  'weapon_crescent_staff': '/models/weapons/weapon_crescent_staff.glb',
  'weapon_celestial_staff': '/models/weapons/weapon_celestial_staff.glb',

  // Arcos
  'weapon_shortbow': '/models/weapons/weapon_shortbow.glb',
  'weapon_composite_bow': '/models/weapons/weapon_composite_bow.glb',

  // Escudos
  'shield_river_guardian': '/models/weapons/shield_river_guardian.glb',
  'shield_obsidian_rune': '/models/weapons/shield_obsidian_rune.glb',
  'shield_basalt_buckler': '/models/weapons/shield_basalt_buckler.glb',
  'shield_invincible_sun': '/models/weapons/shield_invincible_sun.glb',
};

/**
 * Obtiene la ruta del archivo .glb correspondiente al arma o escudo equipado
 */
export function getEquipment3DModel(itemIdOrName?: string): string | undefined {
  if (!itemIdOrName) return undefined;
  const lower = itemIdOrName.toLowerCase();

  // Mapeo Inteligente por Nombre o ID
  if (lower.includes('volcanica') || lower.includes('volcánica') || lower.includes('magma')) return '/models/weapons/weapon_volcanic_blade.glb';
  if ((lower.includes('celestial') || lower.includes('sagrad')) && (lower.includes('espada') || lower.includes('hoja'))) return '/models/weapons/weapon_celestial_sword.glb';
  if ((lower.includes('celestial') || lower.includes('sagrad')) && (lower.includes('baculo') || lower.includes('báculo') || lower.includes('cetro'))) return '/models/weapons/weapon_celestial_staff.glb';
  if (lower.includes('hueso') || lower.includes('maldit')) return '/models/weapons/weapon_bone_sword.glb';
  if (lower.includes('mandoble') || lower.includes('espadon')) return '/models/weapons/weapon_greatsword.glb';
  if (lower.includes('acero templado')) return '/models/weapons/weapon_steel_sword.glb';
  if (lower.includes('hierro') || lower.includes('espada')) return '/models/weapons/weapon_iron_sword.glb';

  if (lower.includes('sombr') || lower.includes('oscur')) return '/models/weapons/weapon_shadow_daggers.glb';
  if (lower.includes('veneno') || lower.includes('esmeralda')) return '/models/weapons/weapon_poison_daggers.glb';
  if (lower.includes('daga') || lower.includes('cuchillo') || lower.includes('estilete')) return '/models/weapons/weapon_hunter_dagger.glb';

  if (lower.includes('hacha')) return '/models/weapons/weapon_double_waraxe.glb';
  if (lower.includes('mithril')) return '/models/weapons/weapon_mithril_hammer.glb';
  if (lower.includes('titan') || lower.includes('titánico') || lower.includes('martillo') || lower.includes('maza')) return '/models/weapons/weapon_titanic_hammer.glb';

  if (lower.includes('media luna') || lower.includes('luna')) return '/models/weapons/weapon_crescent_staff.glb';
  if (lower.includes('cristal') || lower.includes('arcano')) return '/models/weapons/weapon_crystal_staff.glb';
  if (lower.includes('vara') || lower.includes('roble') || lower.includes('baculo') || lower.includes('báculo')) return '/models/weapons/weapon_oak_staff.glb';

  if (lower.includes('compuesto') || lower.includes('elite') || lower.includes('élfica')) return '/models/weapons/weapon_composite_bow.glb';
  if (lower.includes('arco')) return '/models/weapons/weapon_shortbow.glb';

  // Escudos
  if (lower.includes('sol') || lower.includes('invencible')) return '/models/weapons/shield_invincible_sun.glb';
  if (lower.includes('basalto') || lower.includes('fuego')) return '/models/weapons/shield_basalt_buckler.glb';
  if (lower.includes('obsidiana') || lower.includes('runico') || lower.includes('rúnico')) return '/models/weapons/shield_obsidian_rune.glb';
  if (lower.includes('fluvial') || lower.includes('madera') || lower.includes('escudo') || lower.includes('broquel')) return '/models/weapons/shield_river_guardian.glb';

  return WEAPON_3D_MODELS[itemIdOrName];
}
