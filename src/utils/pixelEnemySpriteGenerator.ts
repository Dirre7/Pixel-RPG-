import { OverworldEnemyType } from '../types';

const enemyCanvasCache: Record<string, HTMLCanvasElement> = {};

/**
 * Generates an authentic 32x32 retro pixel art sprite for each overworld monster
 */
export function getPixelEnemyCanvas(
  enemyType: OverworldEnemyType,
  colorHex: string = '#22c55e',
  isBoss: boolean = false
): HTMLCanvasElement {
  const cacheKey = `${enemyType}_${colorHex}_${isBoss ? 'boss' : 'mob'}`;
  if (enemyCanvasCache[cacheKey]) return enemyCanvasCache[cacheKey];

  const size = isBoss ? 64 : 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const s = isBoss ? 2 : 1; // scale multiplier

  if (enemyType === 'slime') {
    // 🟢 CUTE BOUNCY SLIME
    // Body
    ctx.fillStyle = colorHex;
    ctx.fillRect(6 * s, 14 * s, 20 * s, 12 * s);
    ctx.fillRect(8 * s, 10 * s, 16 * s, 4 * s);
    ctx.fillRect(10 * s, 8 * s, 12 * s, 2 * s);
    ctx.fillRect(4 * s, 18 * s, 24 * s, 8 * s);

    // Highlight
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(9 * s, 11 * s, 4 * s, 3 * s);

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(10 * s, 16 * s, 3 * s, 5 * s);
    ctx.fillRect(19 * s, 16 * s, 3 * s, 5 * s);

    // Eye Glint
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10 * s, 16 * s, 1 * s, 2 * s);
    ctx.fillRect(19 * s, 16 * s, 1 * s, 2 * s);

    // Cute blush
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(7 * s, 20 * s, 2 * s, 1 * s);
    ctx.fillRect(23 * s, 20 * s, 2 * s, 1 * s);
  } else if (enemyType === 'wolf') {
    // 🐺 SAVAGE WOLF
    // Body & Back
    ctx.fillStyle = colorHex;
    ctx.fillRect(4 * s, 12 * s, 22 * s, 10 * s);
    // Head & Snout
    ctx.fillRect(18 * s, 8 * s, 10 * s, 10 * s);
    ctx.fillRect(26 * s, 12 * s, 5 * s, 5 * s);
    // Ears
    ctx.fillRect(20 * s, 4 * s, 3 * s, 5 * s);
    ctx.fillRect(25 * s, 5 * s, 3 * s, 4 * s);
    // Legs
    ctx.fillStyle = '#334155';
    ctx.fillRect(6 * s, 22 * s, 4 * s, 8 * s);
    ctx.fillRect(13 * s, 22 * s, 4 * s, 8 * s);
    ctx.fillRect(20 * s, 22 * s, 4 * s, 8 * s);
    // Tail
    ctx.fillStyle = colorHex;
    ctx.fillRect(1 * s, 10 * s, 4 * s, 4 * s);
    ctx.fillRect(0 * s, 13 * s, 3 * s, 4 * s);
    // Eye & Fangs
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(23 * s, 10 * s, 2 * s, 2 * s);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(26 * s, 16 * s, 2 * s, 3 * s);
  } else if (enemyType === 'skeleton') {
    // 💀 SKELETON WARRIOR
    // Skull
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(10 * s, 4 * s, 12 * s, 10 * s);
    // Eye sockets
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(12 * s, 7 * s, 3 * s, 3 * s);
    ctx.fillRect(17 * s, 7 * s, 3 * s, 3 * s);
    // Ribs & Spine
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(14 * s, 14 * s, 4 * s, 9 * s);
    ctx.fillRect(9 * s, 16 * s, 14 * s, 2 * s);
    ctx.fillRect(10 * s, 19 * s, 12 * s, 2 * s);
    // Bone Legs
    ctx.fillRect(11 * s, 23 * s, 3 * s, 8 * s);
    ctx.fillRect(18 * s, 23 * s, 3 * s, 8 * s);
    // Sword
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(24 * s, 8 * s, 3 * s, 16 * s);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(22 * s, 20 * s, 7 * s, 2 * s);
  } else if (enemyType === 'elemental') {
    // 🔥 FIRE / ARCANE ELEMENTAL
    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(16 * s, 16 * s, 10 * s, 0, Math.PI * 2);
    ctx.fill();
    // Inner Core
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(16 * s, 16 * s, 6 * s, 0, Math.PI * 2);
    ctx.fill();
    // Outer flame flares
    ctx.fillStyle = colorHex;
    ctx.fillRect(14 * s, 2 * s, 4 * s, 5 * s);
    ctx.fillRect(14 * s, 25 * s, 4 * s, 5 * s);
    ctx.fillRect(2 * s, 14 * s, 5 * s, 4 * s);
    ctx.fillRect(25 * s, 14 * s, 5 * s, 4 * s);
    // Fierce Eyes
    ctx.fillStyle = '#451a03';
    ctx.fillRect(13 * s, 14 * s, 2 * s, 3 * s);
    ctx.fillRect(17 * s, 14 * s, 2 * s, 3 * s);
  } else if (enemyType === 'golem') {
    // 🗿 ANCIENT GOLEM
    ctx.fillStyle = colorHex;
    // Torso
    ctx.fillRect(6 * s, 8 * s, 20 * s, 14 * s);
    // Shoulder plates
    ctx.fillRect(3 * s, 6 * s, 6 * s, 8 * s);
    ctx.fillRect(23 * s, 6 * s, 6 * s, 8 * s);
    // Heavy Fists
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(2 * s, 14 * s, 6 * s, 12 * s);
    ctx.fillRect(24 * s, 14 * s, 6 * s, 12 * s);
    // Glowing Crystal Heart
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(14 * s, 12 * s, 4 * s, 4 * s);
    // Legs
    ctx.fillStyle = colorHex;
    ctx.fillRect(9 * s, 22 * s, 5 * s, 8 * s);
    ctx.fillRect(18 * s, 22 * s, 5 * s, 8 * s);
  } else if (enemyType === 'dragon' || isBoss) {
    // 🐉 EPIC BOSS DRAGON
    ctx.fillStyle = colorHex;
    // Massive Body
    ctx.fillRect(12 * s, 16 * s, 40 * s, 22 * s);
    // Dragon Head & Horns
    ctx.fillRect(38 * s, 8 * s, 20 * s, 16 * s);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(44 * s, 2 * s, 5 * s, 8 * s);
    ctx.fillRect(52 * s, 3 * s, 4 * s, 7 * s);
    // Dragon Wings
    ctx.fillStyle = colorHex;
    ctx.fillRect(8 * s, 4 * s, 28 * s, 14 * s);
    ctx.fillRect(4 * s, 8 * s, 12 * s, 18 * s);
    // Golden Belly
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(18 * s, 24 * s, 26 * s, 12 * s);
    // Glowing Red Eye
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(48 * s, 12 * s, 4 * s, 3 * s);
    // Fire Breath particles
    ctx.fillStyle = '#f97316';
    ctx.fillRect(58 * s, 18 * s, 6 * s, 4 * s);
  } else {
    // 🧝 GOBLIN / BANDIT / KNIGHT
    ctx.fillStyle = colorHex;
    // Head
    ctx.fillRect(10 * s, 6 * s, 12 * s, 10 * s);
    // Ears
    ctx.fillRect(7 * s, 8 * s, 3 * s, 4 * s);
    ctx.fillRect(22 * s, 8 * s, 3 * s, 4 * s);
    // Armor / Clothes
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8 * s, 16 * s, 16 * s, 9 * s);
    // Legs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(10 * s, 25 * s, 4 * s, 6 * s);
    ctx.fillRect(18 * s, 25 * s, 4 * s, 6 * s);
    // Dagger / Weapon
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(23 * s, 14 * s, 3 * s, 10 * s);
    // Eyes
    ctx.fillStyle = '#fde047';
    ctx.fillRect(12 * s, 9 * s, 2 * s, 2 * s);
    ctx.fillRect(18 * s, 9 * s, 2 * s, 2 * s);
  }

  enemyCanvasCache[cacheKey] = canvas;
  return canvas;
}
