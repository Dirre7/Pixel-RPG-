import React, { useEffect, useRef } from 'react';

interface PixelCanvasProps {
  type: 'hero' | 'enemy' | 'effect' | 'tile';
  spriteName: string;
  color?: string;
  size?: number;
  className?: string;
  isHit?: boolean;
  isAttacking?: boolean;
  effectType?: 'physical' | 'fire' | 'ice' | 'thunder' | 'holy' | 'shadow' | 'heal';
}

export const PixelCanvas: React.FC<PixelCanvasProps> = ({
  type,
  spriteName,
  color = '#22c55e',
  size = 64,
  className = '',
  isHit = false,
  isAttacking = false,
  effectType,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, size, size);

    // Save context state
    ctx.save();

    // Hit recoil effect (flash with red-orange energy)
    if (isHit) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(size * 0.2, size * 0.2, size * 0.6, size * 0.6);
      ctx.restore();
      return;
    }

    // Attack nudge offset
    if (isAttacking) {
      ctx.translate(size * 0.15, 0);
    }

    const scale = size / 20; // 20x20 detailed high-density pixel grid

    // Helper: draw pixel block
    const p = (x: number, y: number, c: string, w = 1, h = 1) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.floor(x * scale), Math.floor(y * scale), Math.ceil(w * scale), Math.ceil(h * scale));
    };

    // Draw Sprites based on type & name
    if (type === 'hero') {
      drawHeroSprite(p, spriteName, color);
    } else if (type === 'enemy') {
      drawEnemySprite(p, spriteName, color);
    } else if (type === 'effect' && effectType) {
      drawEffectSprite(p, effectType, size, scale);
    }

    ctx.restore();
  }, [type, spriteName, color, size, isHit, isAttacking, effectType]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`inline-block pixelated ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

// --- HERO SPRITE DRAWING (High Detail 20x20) ---
function drawHeroSprite(
  p: (x: number, y: number, c: string, w?: number, h?: number) => void,
  heroClass: string,
  _accentColor: string
) {
  // Soft Shadow at feet
  p(4, 18, 'rgba(15, 23, 42, 0.7)', 12, 2);

  if (heroClass === 'Guerrero') {
    // Warrior: Silver knight armor with gold trim, red cape, gleaming steel broadsword
    // Red Cape Behind
    p(5, 7, '#991b1b', 10, 10);
    p(6, 17, '#7f1d1d', 8, 2);

    // Plate Legs & Greaves
    p(7, 13, '#334155', 2, 5);
    p(11, 13, '#334155', 2, 5);
    p(6, 17, '#1e293b', 3, 2);
    p(11, 17, '#1e293b', 3, 2);

    // Breastplate Body (Silver gradient + Gold crest)
    p(6, 8, '#64748b', 8, 6);
    p(7, 9, '#94a3b8', 6, 4);
    p(9, 9, '#f59e0b', 2, 3); // Golden emblem
    p(6, 13, '#475569', 8, 1); // Belt

    // Helmet & Visor
    p(6, 2, '#475569', 8, 6);
    p(7, 3, '#94a3b8', 6, 4);
    p(5, 4, '#ef4444', 10, 2); // Glowing red visor slit
    p(8, 0, '#dc2626', 4, 3); // Red dragon crest plume
    p(9, 1, '#f87171', 2, 2); // Plume highlight

    // Broadsword (Right Hand)
    p(15, 2, '#e2e8f0', 2, 13); // Silver Blade
    p(16, 2, '#ffffff', 1, 12); // Specular highlight
    p(14, 13, '#d97706', 4, 2); // Golden Crossguard
    p(15, 15, '#78350f', 2, 3); // Leather Grip
    p(15, 18, '#f59e0b', 2, 1); // Pommel gem

    // Shield (Left Hand)
    p(2, 7, '#b91c1c', 4, 9);
    p(3, 8, '#ef4444', 2, 7);
    p(3, 11, '#fde047', 2, 2); // Golden lion crest
  } else if (heroClass === 'Mago') {
    // Mage: Arcane Blue Robes, mystical pointed hat with stars, floating glowing runic staff
    // Flowing Robes
    p(6, 7, '#1e3a8a', 8, 11);
    p(7, 8, '#2563eb', 6, 9);
    p(8, 9, '#3b82f6', 4, 7);
    p(5, 17, '#172554', 10, 2);

    // Glowing belt & arcane rune sash
    p(6, 12, '#06b6d4', 8, 2);
    p(9, 14, '#67e8f9', 2, 3);

    // Head & Wizard Hat
    p(7, 4, '#fed7aa', 6, 4); // Skin
    p(8, 5, '#0f172a', 1, 2); // Eyes
    p(11, 5, '#0f172a', 1, 2);
    p(4, 3, '#1d4ed8', 12, 2); // Hat brim
    p(6, 1, '#2563eb', 8, 2); // Hat crown
    p(8, -1, '#3b82f6', 4, 2); // Point
    p(9, -2, '#fef08a', 2, 2); // Star jewel

    // Arcane Magic Staff
    p(15, 4, '#78350f', 2, 14); // Staff wood
    p(14, 2, '#38bdf8', 4, 4); // Crystal Orb
    p(15, 1, '#ffffff', 2, 2); // High glow
    p(13, 0, '#06b6d4', 6, 1); // Energy ring
    p(13, 5, '#06b6d4', 6, 1);
  } else if (heroClass === 'Paladín') {
    // Paladin: Gilded Gold Armor, Holy Sun Cape, Blessed Broadsword and Crusader Cross Shield
    p(5, 7, '#d97706', 10, 10);
    p(6, 17, '#b45309', 8, 2);
    p(7, 13, '#b45309', 2, 5);
    p(11, 13, '#b45309', 2, 5);
    p(6, 8, '#f59e0b', 8, 6);
    p(7, 9, '#fde047', 6, 4);
    p(9, 9, '#38bdf8', 2, 3); // Holy Cyan Jewel
    p(6, 2, '#d97706', 8, 6); // Helmet
    p(7, 3, '#fde047', 6, 4);
    p(5, 4, '#38bdf8', 10, 2); // Holy Visor
    p(8, 0, '#facc15', 4, 3); // Gold Crown Plume
    // Holy Broadsword
    p(15, 2, '#ffffff', 2, 13);
    p(16, 2, '#38bdf8', 1, 12);
    p(14, 13, '#f59e0b', 4, 2);
    p(15, 15, '#78350f', 2, 3);
    // Crusader Shield
    p(2, 7, '#0284c7', 4, 9);
    p(3, 8, '#38bdf8', 2, 7);
    p(3, 10, '#ffffff', 2, 3); // White Cross
    p(2, 11, '#ffffff', 4, 1);
  } else if (heroClass === 'Nigromante') {
    // Necromancer: Dark Obsidian Robe, Void Eyes, Bone Scythe / Staff
    p(6, 7, '#09090b', 8, 11);
    p(7, 8, '#18181b', 6, 9);
    p(8, 9, '#3b0764', 4, 7);
    p(6, 12, '#a855f7', 8, 2);
    p(7, 4, '#e2e8f0', 6, 4); // Ash Skin
    p(8, 5, '#c084fc', 1, 2); // Glowing Purple Eyes
    p(11, 5, '#c084fc', 1, 2);
    p(5, 2, '#18181b', 10, 4); // Dark Cowl
    p(15, 2, '#27272a', 2, 16); // Staff
    p(13, 0, '#a855f7', 5, 4); // Nether Void Core
    p(14, 1, '#ffffff', 3, 2);
  } else if (heroClass === 'Arquero') {
    // Archer: Forest Green Ranger Cowl, Leather Quiver, Recurve Bow
    p(6, 8, '#14532d', 8, 9);
    p(7, 9, '#16a34a', 6, 7);
    p(6, 3, '#15803d', 8, 6);
    p(7, 4, '#fed7aa', 6, 3);
    p(8, 5, '#0f172a', 1, 1);
    p(11, 5, '#0f172a', 1, 1);
    // Recurve Bow
    p(16, 2, '#78350f', 2, 15);
    p(15, 2, '#f8fafc', 1, 1); // Bow String tips
    p(15, 16, '#f8fafc', 1, 1);
    p(14, 3, '#f8fafc', 1, 13); // String
    p(3, 7, '#78350f', 3, 8); // Back Quiver with arrows
    p(3, 5, '#fde047', 1, 3);
    p(4, 5, '#ef4444', 1, 3);
  } else if (heroClass === 'Berserker') {
    // Berserker: Rawhide Harness, Horned Barbarian Helm, Dual Battleaxes
    p(6, 8, '#78350f', 8, 9);
    p(7, 9, '#b45309', 6, 7);
    p(7, 4, '#fed7aa', 6, 4);
    p(8, 5, '#ef4444', 1, 1); // Angry Red Eyes
    p(11, 5, '#ef4444', 1, 1);
    p(5, 2, '#475569', 10, 4); // Iron Helm
    p(3, 0, '#f8fafc', 3, 3); // Left Horn
    p(14, 0, '#f8fafc', 3, 3); // Right Horn
    // Dual Battleaxes
    p(15, 5, '#78350f', 2, 12); // Right Axe
    p(13, 6, '#cbd5e1', 5, 4);
    p(2, 7, '#78350f', 2, 10); // Left Axe
    p(1, 8, '#cbd5e1', 4, 3);
  } else {
    // Rogue: Emerald Hood, leather shadow armor, dual poison blades
    p(6, 8, '#064e3b', 8, 9);
    p(7, 9, '#047857', 6, 7);
    p(6, 16, '#022c22', 8, 3);
    p(6, 3, '#047857', 8, 6);
    p(7, 4, '#059669', 6, 4);
    p(7, 5, '#022c22', 6, 3);
    p(8, 5, '#fde047', 1, 1);
    p(11, 5, '#fde047', 1, 1);
    p(15, 7, '#10b981', 2, 8);
    p(16, 7, '#6ee7b7', 1, 6);
    p(14, 13, '#d97706', 3, 2);
    p(3, 9, '#10b981', 2, 7);
    p(4, 9, '#6ee7b7', 1, 5);
  }
}

// --- ENEMY SPRITE DRAWING (High Detail 20x20) ---
function drawEnemySprite(
  p: (x: number, y: number, c: string, w?: number, h?: number) => void,
  spriteType: string,
  color: string
) {
  // Ambient floor shadow
  p(3, 17, 'rgba(15, 23, 42, 0.7)', 14, 3);

  switch (spriteType) {
    case 'slime':
      // Gelatinous Slime with translucent highlights
      p(4, 9, color, 12, 9);
      p(3, 11, color, 14, 7);
      p(5, 7, color, 10, 4);
      p(6, 8, 'rgba(255,255,255,0.4)', 6, 2); // Highlight gloss
      p(6, 12, '#ffffff', 3, 3); // Eye L
      p(7, 13, '#0f172a', 1, 1);
      p(11, 12, '#ffffff', 3, 3); // Eye R
      p(12, 13, '#0f172a', 1, 1);
      break;

    case 'boss_slime':
      // King Slime with Radiant Crown & Ruby Core
      p(2, 6, color, 16, 12);
      p(1, 9, color, 18, 9);
      p(4, 4, color, 12, 4);
      // Golden Gem Crown
      p(5, 0, '#d97706', 10, 4);
      p(4, 0, '#fde047', 3, 2);
      p(8, 0, '#fde047', 4, 2);
      p(13, 0, '#fde047', 3, 2);
      p(9, 2, '#ef4444', 2, 2); // Ruby
      // Expressive eyes & mouth
      p(5, 9, '#ffffff', 4, 4);
      p(6, 10, '#020617', 2, 2);
      p(11, 9, '#ffffff', 4, 4);
      p(12, 10, '#020617', 2, 2);
      p(8, 14, '#0f172a', 4, 2);
      break;

    case 'wolf':
      // Shadow / Dire Wolf with Glowing Red Eyes
      p(4, 8, color, 12, 7);
      p(2, 6, color, 4, 4); // Tail
      p(12, 5, color, 6, 6); // Head
      p(14, 3, color, 2, 3); // Ear
      p(16, 8, '#0f172a', 3, 2); // Muzzle
      p(14, 6, '#ef4444', 2, 1); // Eye
      p(5, 15, color, 3, 4); // Paws
      p(11, 15, color, 3, 4);
      p(7, 10, '#ffffff', 2, 3); // Chest fur
      break;

    case 'goblin':
      // Goblin Warrior with helmet & spiked club
      p(7, 7, color, 6, 8);
      p(6, 3, color, 8, 6);
      p(3, 4, color, 4, 3); // Left ear
      p(13, 4, color, 4, 3); // Right ear
      p(7, 4, '#fde047', 2, 2); // Eyes
      p(11, 4, '#fde047', 2, 2);
      p(8, 7, '#dc2626', 4, 1); // Mouth
      p(14, 6, '#78350f', 4, 9); // Heavy Club
      p(15, 5, '#94a3b8', 2, 2); // Spikes
      break;

    case 'bat':
      // Crimson / Shadow Bat
      p(8, 7, '#312e81', 4, 6);
      p(1, 4, color, 7, 6); // Wing L
      p(12, 4, color, 7, 6); // Wing R
      p(8, 5, '#ef4444', 1, 2); // Eyes
      p(11, 5, '#ef4444', 1, 2);
      p(9, 10, '#ffffff', 2, 1); // Fangs
      break;

    case 'spider':
      // Toxic Arachnid with Multiple Glowing Red Eyes
      p(6, 7, color, 8, 8);
      p(2, 6, '#1e1b4b', 4, 3); // Legs Left
      p(1, 10, '#1e1b4b', 5, 3);
      p(14, 6, '#1e1b4b', 4, 3); // Legs Right
      p(14, 10, '#1e1b4b', 5, 3);
      p(7, 8, '#ef4444', 1, 1); // Red Eyes cluster
      p(9, 8, '#ef4444', 1, 1);
      p(11, 8, '#ef4444', 1, 1);
      p(12, 8, '#ef4444', 1, 1);
      p(8, 12, '#22c55e', 4, 2); // Poison mandibles
      break;

    case 'golem':
    case 'boss_golem':
      // Ancient Runed Titan Golem
      p(4, 3, color, 12, 14);
      p(3, 5, '#334155', 14, 10);
      p(6, 6, '#38bdf8', 2, 2); // Runic Eye Left
      p(12, 6, '#38bdf8', 2, 2); // Runic Eye Right
      p(7, 10, '#06b6d4', 6, 4); // Core crystal
      p(8, 11, '#ffffff', 4, 2); // Core glow
      p(2, 7, '#475569', 3, 8); // Stone fist L
      p(15, 7, '#475569', 3, 8); // Stone fist R
      break;

    case 'elemental':
      // Living Flame / Vortex Elemental
      p(6, 3, color, 8, 13);
      p(4, 6, '#f97316', 12, 8);
      p(7, 7, '#fef08a', 6, 5);
      p(8, 8, '#ffffff', 4, 3);
      p(7, 1, '#ea580c', 6, 3);
      p(9, 0, '#facc15', 2, 2);
      break;

    case 'drake':
    case 'boss_dragon':
      // Ancient Inferno Dragon
      p(5, 6, color, 10, 9);
      p(0, 2, color, 7, 7); // Giant Wing L
      p(13, 2, color, 7, 7); // Giant Wing R
      p(12, 2, '#f59e0b', 6, 5); // Head
      p(15, 3, '#020617', 2, 2); // Eye
      p(16, 5, '#ef4444', 4, 3); // Fire blast
      p(17, 6, '#fef08a', 3, 2);
      p(6, 15, color, 3, 4); // Claws
      p(11, 15, color, 3, 4);
      break;

    case 'skeleton':
      // Undead Skeletal Warrior
      p(7, 7, '#cbd5e1', 6, 8); // Ribs
      p(6, 2, '#f8fafc', 8, 6); // Skull
      p(8, 4, '#ef4444', 2, 2); // Eye socket glow
      p(11, 4, '#ef4444', 2, 2);
      p(14, 4, '#94a3b8', 2, 11); // Rusty sword
      p(13, 13, '#78350f', 4, 2); // Hilt
      p(7, 15, '#e2e8f0', 2, 4);
      p(11, 15, '#e2e8f0', 2, 4);
      break;

    case 'lich':
    case 'boss_lich':
      // Arch-Lich with Nether Staff & Void Cloak
      p(5, 2, color, 10, 15); // Cloak
      p(7, 4, '#09090b', 6, 6); // Skull Face Void
      p(8, 5, '#c084fc', 2, 2); // Nether eye L
      p(11, 5, '#c084fc', 2, 2); // Nether eye R
      p(14, 0, '#a855f7', 4, 4); // Void orb
      p(15, 1, '#ffffff', 2, 2); // Void shine
      p(15, 3, '#581c87', 2, 15); // Staff
      break;

    default:
      p(5, 5, color, 10, 10);
      break;
  }
}

// --- EFFECT ANIMATION DRAWING (20x20 VFX) ---
function drawEffectSprite(
  p: (x: number, y: number, c: string, w?: number, h?: number) => void,
  effectType: string,
  _size: number,
  _scale: number
) {
  switch (effectType) {
    case 'fire':
      p(7, 1, '#ef4444', 6, 6);
      p(5, 5, '#f97316', 10, 8);
      p(6, 8, '#fef08a', 8, 7);
      p(8, 11, '#ffffff', 4, 4);
      p(3, 4, '#ea580c', 3, 3);
      p(14, 4, '#ea580c', 3, 3);
      break;

    case 'ice':
      p(9, 0, '#38bdf8', 2, 20); // Vertical ice spike
      p(0, 9, '#38bdf8', 20, 2); // Horizontal spike
      p(4, 4, '#7dd3fc', 12, 12);
      p(7, 7, '#e0f2fe', 6, 6);
      p(9, 9, '#ffffff', 2, 2); // Diamond center
      break;

    case 'thunder':
      p(10, 0, '#fde047', 4, 6);
      p(6, 5, '#facc15', 6, 5);
      p(9, 9, '#eab308', 4, 6);
      p(5, 14, '#ffffff', 8, 5);
      p(13, 3, '#fef08a', 2, 2);
      p(3, 11, '#fef08a', 2, 2);
      break;

    case 'holy':
    case 'heal':
      p(9, 1, '#fde047', 2, 18);
      p(1, 9, '#fde047', 18, 2);
      p(6, 6, '#ffffff', 8, 8);
      p(4, 4, '#fef08a', 3, 3);
      p(13, 4, '#fef08a', 3, 3);
      p(4, 13, '#fef08a', 3, 3);
      p(13, 13, '#fef08a', 3, 3);
      break;

    case 'shadow':
      p(4, 4, '#581c87', 12, 12);
      p(6, 6, '#3b0764', 8, 8);
      p(8, 8, '#c084fc', 4, 4);
      p(9, 9, '#ffffff', 2, 2);
      break;

    case 'physical':
    default:
      // High-speed slash arcs
      p(1, 2, '#ffffff', 3, 2);
      p(3, 4, '#f8fafc', 4, 3);
      p(7, 7, '#e2e8f0', 6, 4);
      p(13, 11, '#94a3b8', 4, 4);
      p(17, 15, '#64748b', 3, 3);
      break;
  }
}
