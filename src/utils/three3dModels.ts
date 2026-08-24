import * as THREE from 'three';
import { PlayerStats, EquipmentItem, Enemy } from '../types';

// ==========================================
// 1. PROCEDURAL CARTOON / ANIME TEXTURE GENERATORS
// ==========================================

/**
 * Creates high-detail stylized anime face textures matching the Chibi RPG art in the reference image
 */
/**
 * Creates high-detail stylized miniature figurine face decal texture matching the elf adventurer reference
 */
export function createChibiAnimeFaceTexture(
  eyeColorHex: string = '#10b981',
  hairColorHex: string = '#b91c1c',
  expression: 'confident' | 'fierce' | 'cute' | 'smirk' = 'confident',
  isFemale: boolean = true
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 512);

  // 1. Cute peach cheek blush
  const blushLeft = ctx.createRadialGradient(130, 310, 10, 130, 310, 65);
  blushLeft.addColorStop(0, 'rgba(244, 63, 94, 0.45)');
  blushLeft.addColorStop(1, 'rgba(244, 63, 94, 0)');
  ctx.fillStyle = blushLeft;
  ctx.beginPath();
  ctx.arc(130, 310, 65, 0, Math.PI * 2);
  ctx.fill();

  const blushRight = ctx.createRadialGradient(382, 310, 10, 382, 310, 65);
  blushRight.addColorStop(0, 'rgba(244, 63, 94, 0.45)');
  blushRight.addColorStop(1, 'rgba(244, 63, 94, 0)');
  ctx.fillStyle = blushRight;
  ctx.beginPath();
  ctx.arc(382, 310, 65, 0, Math.PI * 2);
  ctx.fill();

  // Helper to draw large expressive anime / Disney eyes matching the reference photo
  const drawAnimeEye = (centerX: number, centerY: number, isRight: boolean) => {
    ctx.save();
    ctx.translate(centerX, centerY);

    // Eye White (Sclera) with dark outline
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, 58, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Colored Iris with Rich Radial Gradient (Lush Emerald Green / Class Color)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(isRight ? -4 : 4, 3, 44, 44, 0, 0, Math.PI * 2);
    ctx.clip();

    const irisGrad = ctx.createRadialGradient(
      isRight ? -10 : 10, -10, 5,
      isRight ? -4 : 4, 3, 45
    );
    irisGrad.addColorStop(0, '#ffffff');
    irisGrad.addColorStop(0.3, eyeColorHex);
    irisGrad.addColorStop(0.7, '#064e3b');
    irisGrad.addColorStop(1, '#022c22');
    ctx.fillStyle = irisGrad;
    ctx.fillRect(-60, -60, 120, 120);

    // Dark Center Pupil
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(isRight ? -4 : 4, 3, 20, 0, Math.PI * 2);
    ctx.fill();

    // Primary Bright Catchlight (Specular Sparkle)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(isRight ? -16 : -4, -14, 14, 0, Math.PI * 2);
    ctx.fill();

    // Secondary Minor Catchlight
    ctx.beginPath();
    ctx.arc(isRight ? 12 : 18, 16, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bold Upper Eyelash (Thicker and curved for female, bold for male)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = isFemale ? 18 : 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, -8, 56, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    if (isFemale) {
      // Eyelash Wing
      ctx.lineWidth = 12;
      ctx.beginPath();
      if (isRight) {
        ctx.moveTo(38, -32);
        ctx.lineTo(68, -45);
      } else {
        ctx.moveTo(-38, -32);
        ctx.lineTo(-68, -45);
      }
      ctx.stroke();
    }

    ctx.restore();
  };

  // Draw Left & Right Eyes
  drawAnimeEye(160, 225, false);
  drawAnimeEye(352, 225, true);

  // Eyebrows matching hair color
  ctx.strokeStyle = hairColorHex;
  ctx.lineWidth = isFemale ? 14 : 18;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (isFemale) {
    // Elegant arched feminine brows
    ctx.arc(160, 175, 55, Math.PI * 1.25, Math.PI * 1.75);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(352, 175, 55, Math.PI * 1.25, Math.PI * 1.75);
    ctx.stroke();
  } else {
    // Determined heroic brows
    ctx.moveTo(105, 150);
    ctx.lineTo(220, 165);
    ctx.moveTo(407, 150);
    ctx.lineTo(292, 165);
    ctx.stroke();
  }

  // Cute Smiling Mouth with Lip Curve and Tooth Glint (Matching Elf Figurine!)
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(256, 350, 36, 0.15 * Math.PI, 0.85 * Math.PI, false);
  ctx.stroke();

  // Lip glow fill
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(256, 350, 32, 0.2 * Math.PI, 0.8 * Math.PI, false);
  ctx.fill();

  // Tooth White Specular Glint
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(250, 354, 8, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

export function createGoblinBeastFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Toxic Goblin Green base
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#84cc16');
  grad.addColorStop(0.5, '#65a30d');
  grad.addColorStop(1, '#3f6212');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Menacing Yellow-White Glowing Eyes with thick black outlines (Row 2 #2 monster style)
  const drawGoblinEye = (x: number, y: number, isRight: boolean) => {
    ctx.save();
    ctx.translate(x, y);

    // Outer menacing contour
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.ellipse(0, 0, 55, 35, isRight ? -0.2 : 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Red slit pupil
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(isRight ? -8 : 8, 0, 14, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Angry heavy furrowed brow
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (isRight) {
      ctx.moveTo(60, -30);
      ctx.lineTo(-45, 10);
    } else {
      ctx.moveTo(-60, -30);
      ctx.lineTo(45, 10);
    }
    ctx.stroke();
    ctx.restore();
  };

  drawGoblinEye(140, 210, false);
  drawGoblinEye(372, 210, true);

  // Big Wide Grinning Toothy Maw with White Fangs (Row 2 #2 monster style)
  ctx.fillStyle = '#1e1b4b';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(256, 320, 100, 0.1 * Math.PI, 0.9 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Sharp White Fangs
  ctx.fillStyle = '#ffffff';
  const fangPositions = [185, 220, 256, 292, 327];
  fangPositions.forEach((fx, i) => {
    ctx.beginPath();
    ctx.moveTo(fx - 12, 335);
    ctx.lineTo(fx, 375 + (i % 2 === 0 ? 10 : 0));
    ctx.lineTo(fx + 12, 335);
    ctx.fill();
  });

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// Stylized Wolf Fur Texture
export function createWolfFurTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#334155';
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const len = 10 + Math.random() * 15;
    ctx.fillRect(x, y, 2, len);
  }

  ctx.fillStyle = '#94a3b8';
  for (let i = 0; i < 250; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillRect(x, y, 1.5, 8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// Stylized Stone Texture
export function createStoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    let x = Math.random() * 256;
    let y = Math.random() * 256;
    ctx.moveTo(x, y);
    for (let j = 0; j < 4; j++) {
      x += (Math.random() - 0.5) * 40;
      y += (Math.random() - 0.5) * 40;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.fillStyle = '#15803d';
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 12, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// Dragon Scales Texture
export function createDragonScaleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#b91c1c';

  for (let y = 0; y < 256; y += 16) {
    const offsetX = (y / 16) % 2 === 0 ? 0 : 8;
    for (let x = -8; x < 256; x += 16) {
      ctx.beginPath();
      ctx.arc(x + offsetX, y, 10, 0, Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }

  for (let y = 0; y < 256; y += 16) {
    const offsetX = (y / 16) % 2 === 0 ? 0 : 8;
    for (let x = -8; x < 256; x += 16) {
      ctx.beginPath();
      ctx.arc(x + offsetX, y, 10, 0, Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ==========================================
// 1.1 PROCEDURAL HIGH-RESOLUTION PBR TEXTURES FOR CHARACTER EQUIPMENT
// ==========================================

export function createProceduralSteelBladeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Polished Damascus Steel Sheen Gradient
  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, '#64748b');
  grad.addColorStop(0.2, '#cbd5e1');
  grad.addColorStop(0.45, '#f8fafc');
  grad.addColorStop(0.5, '#475569'); // Central fuller groove
  grad.addColorStop(0.55, '#f8fafc');
  grad.addColorStop(0.8, '#cbd5e1');
  grad.addColorStop(1, '#64748b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Brushed metal longitudinal grain
  for (let y = 0; y < 512; y += 3) {
    const alpha = Math.random() * 0.12;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(0, y, 256, 1);
  }

  // Edge bevel highlights
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(4, 0, 10, 512);
  ctx.fillRect(242, 0, 10, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

export function createProceduralEngravedGoldTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // 24k Radiant Gold base
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#fde047');
  grad.addColorStop(0.5, '#eab308');
  grad.addColorStop(1, '#a16207');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Royal filigree scrollwork engraving
  ctx.strokeStyle = 'rgba(113, 63, 18, 0.5)';
  ctx.lineWidth = 4;
  for (let i = 20; i < 256; i += 40) {
    ctx.beginPath();
    ctx.arc(i, 128, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(128, i, 16, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Polished specular highlight rim
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.8)';
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 248, 248);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

export function createProceduralStitchedLeatherTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Saddle Tan/Chestnut leather base
  ctx.fillStyle = '#5c2b09';
  ctx.fillRect(0, 0, 256, 256);

  // Organic leather pores & grain
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(39, 18, 5, 0.3)' : 'rgba(146, 64, 14, 0.25)';
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Golden-yellow waxed thread stitches along seams
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  for (let y = 10; y < 256; y += 14) {
    ctx.beginPath();
    ctx.moveTo(12, y);
    ctx.lineTo(12, y + 8);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(244, y);
    ctx.lineTo(244, y + 8);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function createProceduralFabricTexture(baseColorHex: string, trimColorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 256, 256);

  // Micro-weave crosshatch pattern
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  for (let x = 0; x < 256; x += 4) {
    ctx.fillRect(x, 0, 2, 256);
  }
  for (let y = 0; y < 256; y += 4) {
    ctx.fillRect(0, y, 256, 2);
  }

  // Embroidered Gold / Silver Hem Trim
  ctx.fillStyle = trimColorHex;
  ctx.fillRect(0, 236, 256, 20);

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.lineWidth = 2;
  for (let x = 8; x < 256; x += 16) {
    ctx.beginPath();
    ctx.arc(x, 246, 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ==========================================
// 1.2 PROCEDURAL HIGH-RESOLUTION PBR TEXTURES FOR BUILDINGS & WORLD PROPS
// ==========================================

const globalBuildingTextureCache: Record<string, THREE.CanvasTexture> = {};

function getCachedBuildingTexture(key: string, generator: () => THREE.CanvasTexture): THREE.CanvasTexture {
  if (!globalBuildingTextureCache[key]) {
    const tex = generator();
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 4;
    globalBuildingTextureCache[key] = tex;
  }
  return globalBuildingTextureCache[key];
}

// 🧱 1. Medieval Stone Masonry / Brickwork Texture
export function createProceduralStoneBrickTexture(stoneTone: 'grey' | 'sandstone' | 'dark' = 'grey'): THREE.CanvasTexture {
  return getCachedBuildingTexture(`stone_${stoneTone}`, () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Mortar deep dark base
    ctx.fillStyle = stoneTone === 'dark' ? '#0f172a' : stoneTone === 'sandstone' ? '#29180c' : '#1e293b';
    ctx.fillRect(0, 0, 512, 512);

    const rows = 12;
    const rowH = 512 / rows;

    for (let r = 0; r < rows; r++) {
      const y = r * rowH;
      const cols = 6;
      const colW = 512 / cols;
      const offset = (r % 2 === 0) ? 0 : colW / 2;

      for (let c = -1; c <= cols; c++) {
        const x = c * colW + offset;
        const pad = 4;
        const bw = colW - pad * 2;
        const bh = rowH - pad * 2;

        // Base Stone Gradient
        const sGrad = ctx.createLinearGradient(x, y, x + bw, y + bh);
        if (stoneTone === 'sandstone') {
          sGrad.addColorStop(0, '#d97706');
          sGrad.addColorStop(0.5, '#b45309');
          sGrad.addColorStop(1, '#78350f');
        } else if (stoneTone === 'dark') {
          sGrad.addColorStop(0, '#475569');
          sGrad.addColorStop(0.5, '#334155');
          sGrad.addColorStop(1, '#1e293b');
        } else {
          sGrad.addColorStop(0, '#94a3b8');
          sGrad.addColorStop(0.5, '#64748b');
          sGrad.addColorStop(1, '#475569');
        }

        ctx.fillStyle = sGrad;
        ctx.fillRect(x + pad, y + pad, bw, bh);

        // Top-Left Sunlight Chamfer Highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x + pad, y + pad + bh);
        ctx.lineTo(x + pad, y + pad);
        ctx.lineTo(x + pad + bw, y + pad);
        ctx.stroke();

        // Bottom-Right Deep Shadow Crevice
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.moveTo(x + pad + bw, y + pad);
        ctx.lineTo(x + pad + bw, y + pad + bh);
        ctx.lineTo(x + pad, y + pad + bh);
        ctx.stroke();

        // Surface pitting & weathered fissures
        for (let p = 0; p < 12; p++) {
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.25)';
          ctx.fillRect(x + pad + 4 + Math.random() * (bw - 8), y + pad + 4 + Math.random() * (bh - 8), 2, 2);
        }

        // Green Moss in bottom corners
        if ((r + c) % 3 === 0) {
          ctx.fillStyle = 'rgba(22, 101, 52, 0.65)';
          ctx.fillRect(x + pad + Math.random() * (bw - 6), y + pad + bh - 6, 6, 4);
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  });
}

// 🏠 2. Terracotta & Slate Roof Shingles Texture
export function createProceduralRoofShinglesTexture(theme: 'terracotta' | 'slate' | 'wood' = 'terracotta'): THREE.CanvasTexture {
  return getCachedBuildingTexture(`roof_${theme}`, () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Shingle rows
    const rows = 16;
    const rowH = 512 / rows;

    for (let r = 0; r < rows; r++) {
      const y = r * rowH;
      const cols = 12;
      const colW = 512 / cols;
      const offset = (r % 2 === 0) ? 0 : colW / 2;

      for (let c = -1; c <= cols; c++) {
        const x = c * colW + offset;
        const tw = colW - 2;
        const th = rowH * 1.35; // overlapping tile

        const tGrad = ctx.createLinearGradient(x, y, x, y + th);
        if (theme === 'terracotta') {
          tGrad.addColorStop(0, '#ea580c');
          tGrad.addColorStop(0.6, '#c2410c');
          tGrad.addColorStop(1, '#7c2d12');
        } else if (theme === 'slate') {
          tGrad.addColorStop(0, '#475569');
          tGrad.addColorStop(0.6, '#334155');
          tGrad.addColorStop(1, '#0f172a');
        } else {
          tGrad.addColorStop(0, '#854d0e');
          tGrad.addColorStop(0.6, '#713f12');
          tGrad.addColorStop(1, '#422006');
        }

        ctx.fillStyle = tGrad;
        ctx.beginPath();
        ctx.roundRect(x + 1, y, tw, th, [0, 0, 8, 8]);
        ctx.fill();

        // Top Sunlit Rim
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Bottom Drop Shadow under tile lip
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(x + 1, y + th - 4, tw, 4);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  });
}

// 🪵 3. Oak / Pine Vertical Wood Plank Texture
export function createProceduralWoodPlankTexture(tone: 'oak' | 'pine' | 'dark' = 'oak'): THREE.CanvasTexture {
  return getCachedBuildingTexture(`wood_${tone}`, () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base Plank Background
    const baseColor = tone === 'pine' ? '#a16207' : tone === 'dark' ? '#3b1c08' : '#78350f';
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    const plankWidth = 512 / 8; // 8 vertical planks

    for (let p = 0; p < 8; p++) {
      const px = p * plankWidth;

      // Dark crevice gap between planks
      ctx.fillStyle = '#1c0d02';
      ctx.fillRect(px, 0, 3, 512);

      // Wood grain lines
      for (let g = 0; g < 15; g++) {
        const gx = px + 4 + Math.random() * (plankWidth - 8);
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(gx, 0, 1 + Math.random() * 2, 512);
      }

      // Wood knot whorls
      if (p % 2 === 0) {
        const ky = 60 + (p * 85) % 400;
        ctx.fillStyle = '#271202';
        ctx.beginPath();
        ctx.ellipse(px + plankWidth / 2, ky, 8, 16, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Iron forged nail heads
      for (let ny of [30, 256, 480]) {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(px + plankWidth / 2, ny, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(px + plankWidth / 2 - 1, ny - 1, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  });
}

// 🛢️ 4. Oak Barrel Staves & Iron Hoops Texture
export function createProceduralOakBarrelTexture(): THREE.CanvasTexture {
  return getCachedBuildingTexture('barrel_oak', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Rich aged oak staves
    ctx.fillStyle = '#5c2b09';
    ctx.fillRect(0, 0, 512, 512);

    for (let x = 0; x < 512; x += 32) {
      ctx.fillStyle = '#2d1404';
      ctx.fillRect(x, 0, 3, 512);
      for (let g = 0; g < 6; g++) {
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(x + 4 + Math.random() * 24, 0, 1.5, 512);
      }
    }

    // 4 Heavy Riveted Black Iron Hoops
    for (let hy of [50, 180, 332, 462]) {
      const hoopGrad = ctx.createLinearGradient(0, hy, 0, hy + 30);
      hoopGrad.addColorStop(0, '#64748b');
      hoopGrad.addColorStop(0.3, '#334155');
      hoopGrad.addColorStop(0.7, '#1e293b');
      hoopGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = hoopGrad;
      ctx.fillRect(0, hy, 512, 30);

      // Silver Rivets on Hoops
      for (let rx = 16; rx < 512; rx += 48) {
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(rx, hy + 15, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(rx - 1, hy + 13, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });
}

// 📦 5. Cross-Braced Wooden Crate Texture
export function createProceduralWoodenCrateTexture(): THREE.CanvasTexture {
  return getCachedBuildingTexture('crate_wood', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Inner Plank Fill
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, 256, 256);

    for (let y = 0; y < 256; y += 42) {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, y, 256, 3);
    }

    // Outer Wooden Frame
    const frameBorder = 26;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, 256, frameBorder);
    ctx.fillRect(0, 256 - frameBorder, 256, frameBorder);
    ctx.fillRect(0, 0, frameBorder, 256);
    ctx.fillRect(256 - frameBorder, 0, frameBorder, 256);

    // Diagonal Cross Brace
    ctx.lineWidth = 26;
    ctx.strokeStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(256, 256);
    ctx.stroke();

    // Steel Corner Reinforcement Brackets & Screws
    ctx.fillStyle = '#334155';
    const bSize = 34;
    [[0, 0], [256 - bSize, 0], [0, 256 - bSize], [256 - bSize, 256 - bSize]].forEach(([bx, by]) => {
      ctx.fillRect(bx, by, bSize, bSize);
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(bx + bSize / 2, by + bSize / 2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#334155';
    });

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  });
}

// 🪟 6. Leaded Stained Diamond Glass Window Texture
export function createProceduralWindowGlassTexture(): THREE.CanvasTexture {
  return getCachedBuildingTexture('window_diamond', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Warm Amber Candlelit Interior Glow
    const glow = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    glow.addColorStop(0, '#fef08a');
    glow.addColorStop(0.5, '#f59e0b');
    glow.addColorStop(1, '#b45309');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 256, 256);

    // Leaded Diamond Lattice Grid
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 5;
    for (let i = -256; i <= 512; i += 36) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 256, 256);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i + 256, 0);
      ctx.lineTo(i, 256);
      ctx.stroke();
    }

    // Heavy Wooden Window Frame
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, 240, 240);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  });
}

// ==========================================
// 2. CHIBI CARTOON HERO MESH GENERATOR (Matching the Reference Image)
// ==========================================

export interface HumanHeroMeshResult {
  group: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  torsoGroup: THREE.Group;
  headGroup: THREE.Group;
  weaponGroup: THREE.Group;
  headbandTail?: THREE.Group;
}

/**
 * Creates a stylized Chibi / Mini RPG 3D Hero character matching the exact anime art in the user's reference image
 */
export function createHumanHeroMesh(
  player: PlayerStats,
  equipment?: { weapon: EquipmentItem | null; armor: EquipmentItem | null; accessory: EquipmentItem | null }
): HumanHeroMeshResult {
  const heroGroup = new THREE.Group();
  heroGroup.scale.set(1.15, 1.15, 1.15);
  const armorItem = equipment?.armor;
  const weaponItem = equipment?.weapon;
  const accessoryItem = equipment?.accessory;

  const isFemale = player.gender === 'female';
  const heroClass = player.heroClass || 'Guerrero';

  // Determine Class Palette based on reference image
  let hairColorHex = isFemale ? '#facc15' : '#b91c1c'; // Female: Golden Blonde, Male: Heroic Red-Orange
  let eyeColorHex = '#10b981';
  let tunicColor = isFemale ? 0x15803d : 0x1e293b;
  let accentColor = isFemale ? 0x16a34a : 0xb91c1c;
  let capeColor = 0xb91c1c;

  if (heroClass === 'Guerrero') {
    hairColorHex = isFemale ? '#facc15' : '#b91c1c';
    tunicColor = 0x1e293b;      // Dark knight steel/navy
    eyeColorHex = '#10b981';
    accentColor = 0x991b1b;
    capeColor = 0xb91c1c;       // Royal crimson cape
  } else if (heroClass === 'Mago') {
    hairColorHex = isFemale ? '#f472b6' : '#f59e0b';   // Arcane Pink / Golden
    eyeColorHex = '#38bdf8';    // Celestial Blue
    tunicColor = 0x1e1b4b;      // Arcane Indigo Robes
    accentColor = 0x6366f1;
    capeColor = 0x4338ca;       // Deep mystical blue cape
  } else if (heroClass === 'Pícaro') {
    hairColorHex = isFemale ? '#c084fc' : '#a855f7';   // Violet / Purple
    eyeColorHex = '#facc15';    // Golden Amber
    tunicColor = 0x064e3b;      // Emerald Rogue Leather
    accentColor = 0x10b981;
    capeColor = 0x0f172a;       // Stealth shadow cloak
  } else if (heroClass === 'Paladín') {
    hairColorHex = '#fde047';   // Radiant Gold
    eyeColorHex = '#38bdf8';    // Holy Cyan
    tunicColor = 0x78350f;      // Gilded Bronze
    accentColor = 0xf59e0b;
    capeColor = 0xfef08a;       // Holy white/gold cape
  } else if (heroClass === 'Nigromante') {
    hairColorHex = isFemale ? '#e2e8f0' : '#94a3b8';   // Silver Ash
    eyeColorHex = '#c084fc';    // Void Purple
    tunicColor = 0x09090b;      // Abyss Black Robes
    accentColor = 0x7e22ce;
    capeColor = 0x3b0764;       // Tattered Void Cloak
  } else if (heroClass === 'Arquero') {
    hairColorHex = isFemale ? '#f59e0b' : '#78350f';   // Chestnut / Honey
    eyeColorHex = '#10b981';    // Hunter Green
    tunicColor = 0x15803d;      // Forest Ranger Green
    accentColor = 0x84cc16;
    capeColor = 0x14532d;       // Leaf green ranger cloak
  } else if (heroClass === 'Berserker') {
    hairColorHex = isFemale ? '#ea580c' : '#dc2626';   // Flame Red
    eyeColorHex = '#ef4444';    // Blood Red
    tunicColor = 0x451a03;      // Rawhide Leather
    accentColor = 0x991b1b;
    capeColor = 0x5c3a21;       // Nordic Bear Fur Mantle
  }

  // Dynamic armor overrides
  if (armorItem) {
    const aName = armorItem.name.toLowerCase();
    if (aName.includes('placa') || aName.includes('acero') || aName.includes('hierro')) {
      tunicColor = 0x334155;
      accentColor = 0x94a3b8;
    } else if (aName.includes('oro') || aName.includes('campeón') || aName.includes('sagrad')) {
      tunicColor = 0x78350f;
      accentColor = 0xf59e0b;
    } else if (aName.includes('magma') || aName.includes('fuego') || aName.includes('dragón')) {
      tunicColor = 0x7f1d1d;
      accentColor = 0xef4444;
      capeColor = 0xb91c1c;
    }
  }

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfed7aa,
    roughness: 0.38,
    metalness: 0.02,
  });

  const leatherPBRTex = createProceduralStitchedLeatherTexture();
  const goldPBRTex = createProceduralEngravedGoldTexture();
  const steelPBRTex = createProceduralSteelBladeTexture();

  // 1. ATHLETIC PROPORTIONED LEGS & BOOTS (Elongated athletic legs for 1:7 heroic ratio)
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.09, 0.52, 0);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.09, 0.52, 0);

  const bootMat = new THREE.MeshStandardMaterial({ map: leatherPBRTex, color: 0xffffff, roughness: 0.55 });

  [leftLeg, rightLeg].forEach((leg) => {
    // Proportional athletic thigh & calf
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.50, 10), skinMat);
    thigh.position.y = -0.25;
    thigh.castShadow = true;
    leg.add(thigh);

    if (isFemale && heroClass !== 'Paladín' && heroClass !== 'Guerrero') {
      // Elegant Strapped Adventurer Sandals
      const strap1 = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.008, 6, 12), bootMat);
      strap1.position.y = -0.32;
      strap1.rotation.x = Math.PI / 2;
      leg.add(strap1);

      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.025, 0.15), bootMat);
      sole.position.set(0, -0.50, 0.02);
      sole.castShadow = true;
      leg.add(sole);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.05, 0.12), skinMat);
      foot.position.set(0, -0.47, 0.015);
      leg.add(foot);
    } else {
      // Heroic Leather/Plated Adventure Boots
      const bootCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.052, 0.22, 10), bootMat);
      bootCuff.position.y = -0.36;
      bootCuff.castShadow = true;
      leg.add(bootCuff);

      const bootFoot = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.09, 0.16), bootMat);
      bootFoot.position.set(0, -0.48, 0.025);
      bootFoot.castShadow = true;
      leg.add(bootFoot);
    }

    heroGroup.add(leg);
  });

  // 2. SLENDER & DETAILED TORSO
  const torsoGroup = new THREE.Group();
  torsoGroup.position.y = 0.72;

  const dressMat = new THREE.MeshStandardMaterial({
    color: tunicColor,
    roughness: 0.55,
    flatShading: true,
  });

  // Sculpted Heroic Torso
  const chest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.095, 0.36, 10),
    dressMat
  );
  chest.scale.set(1.15, 1.0, 0.95);
  chest.position.y = 0.06;
  chest.castShadow = true;
  torsoGroup.add(chest);

  // V-Neck / Bare shoulders skin patch for female elf
  if (isFemale && (heroClass === 'Guerrero' || heroClass === 'Arquero')) {
    const vNeck = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 4), skinMat);
    vNeck.position.set(0, 0.15, 0.07);
    vNeck.rotation.x = 0.4;
    torsoGroup.add(vNeck);
  }

  // Stitched Leather Waist Belt
  const beltMat = new THREE.MeshStandardMaterial({ map: leatherPBRTex, color: 0xffffff, roughness: 0.55 });
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.045, 14), beltMat);
  belt.position.y = -0.06;
  torsoGroup.add(belt);

  // Circular Gold Belt Medallion / Buckle
  const buckleMat = new THREE.MeshStandardMaterial({ map: goldPBRTex, color: 0xffffff, metalness: 0.96, roughness: 0.16 });
  const buckle = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.025, 14), buckleMat);
  buckle.position.set(0, -0.06, 0.11);
  buckle.rotation.x = Math.PI / 2;
  torsoGroup.add(buckle);

  // Class-specific lower garment (Robe for Mage/Necro, Skirt for Elf, Armor Tassets for Knight)
  if (heroClass === 'Mago' || heroClass === 'Nigromante') {
    // Flowing Long Mystic Robe down to ankles
    const robeMat = new THREE.MeshStandardMaterial({ color: tunicColor, roughness: 0.55, side: THREE.DoubleSide });
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.18, 0.48, 14, 1, true), robeMat);
    robe.position.y = -0.28;
    robe.castShadow = true;
    torsoGroup.add(robe);

    // Gold hem at bottom of robe
    const robeHem = new THREE.Mesh(new THREE.TorusGeometry(0.178, 0.012, 8, 20), buckleMat);
    robeHem.position.y = -0.51;
    robeHem.rotation.x = Math.PI / 2;
    torsoGroup.add(robeHem);
  } else {
    // Adventurer Peplum Skirt / Leather Flaps
    const skirtMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.55, side: THREE.DoubleSide });
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.17, 0.16, 12, 1, true), skirtMat);
    skirt.position.y = -0.14;
    skirt.castShadow = true;
    torsoGroup.add(skirt);
  }

  // 🌟 3D FLOWING CAPE / MANTLE (Class-specific cape design)
  const capeMat = new THREE.MeshStandardMaterial({
    color: capeColor,
    roughness: 0.55,
    side: THREE.DoubleSide,
  });

  if (heroClass === 'Berserker') {
    // Nordic Bear Fur Mantle over shoulders
    const furMantle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 8, 16), new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 }));
    furMantle.position.set(0, 0.20, 0.01);
    furMantle.rotation.x = Math.PI / 2;
    torsoGroup.add(furMantle);
  } else {
    // Flowing Cape on Back
    const capeGeo = new THREE.PlaneGeometry(0.24, 0.55, 3, 4);
    const cape = new THREE.Mesh(capeGeo, capeMat);
    cape.position.set(0, -0.05, -0.11);
    cape.rotation.x = 0.15;
    cape.castShadow = true;
    torsoGroup.add(cape);

    // Golden Cape Brooch on front collar
    const brooch = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), buckleMat);
    brooch.position.set(0, 0.19, 0.10);
    torsoGroup.add(brooch);
  }

  // Knight / Paladin / Warrior Plated Pauldrons (Hombreras metálicas con remaches dorados)
  if (heroClass === 'Guerrero' || heroClass === 'Paladín' || armorItem) {
    const pauldronMat = new THREE.MeshStandardMaterial({
      map: heroClass === 'Paladín' ? goldPBRTex : steelPBRTex,
      color: 0xffffff,
      metalness: 0.94,
      roughness: 0.16,
    });
    [-0.15, 0.15].forEach((px) => {
      const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), pauldronMat);
      pauldron.position.set(px, 0.21, 0);
      pauldron.scale.set(1.1, 0.8, 1.2);
      torsoGroup.add(pauldron);

      // Gold rivet on pauldron
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), buckleMat);
      rivet.position.set(px, 0.24, 0.02);
      torsoGroup.add(rivet);
    });
  }

  // Ranger Quiver on Back for Archer
  if (heroClass === 'Arquero') {
    const quiver = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.32, 8), beltMat);
    quiver.position.set(0.06, 0.05, -0.13);
    quiver.rotation.z = -0.35;
    quiver.rotation.x = -0.15;
    torsoGroup.add(quiver);

    // Arrow shafts with feathers
    [-0.015, 0.015].forEach((ax) => {
      const arrow = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.10, 4), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
      arrow.position.set(0.06 + ax, 0.22, -0.14);
      arrow.rotation.z = -0.35;
      torsoGroup.add(arrow);
    });
  }

  heroGroup.add(torsoGroup);

  // 3. PROPORTIONED HEAD & CLASS HEADGEAR (Radius 0.135 - Sleek Heroic Head)
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.10;

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.052, 0.12, 8), skinMat);
  neck.position.y = -0.11;
  headGroup.add(neck);

  // Sculpted Peach Head Base (Radius 0.135 - Well proportioned 1:7 heroic ratio)
  const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.135, 20, 20), skinMat);
  headBase.scale.set(0.95, 1.05, 0.95);
  headBase.castShadow = true;
  headGroup.add(headBase);

  // Pointed Elf Ears (for Female / Archer / Rogue)
  if (isFemale || heroClass === 'Arquero') {
    [-0.13, 0.13].forEach((ex) => {
      const earGroup = new THREE.Group();
      earGroup.position.set(ex, 0.01, -0.02);
      earGroup.rotation.y = ex > 0 ? 0.35 : -0.35;
      earGroup.rotation.z = ex > 0 ? -0.85 : 0.85;
      earGroup.rotation.x = -0.2;

      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.13, 6), skinMat);
      ear.scale.set(0.9, 1.2, 0.35);
      earGroup.add(ear);
      headGroup.add(earGroup);
    });
  }

  // Cute Button Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), skinMat);
  nose.position.set(0, -0.015, 0.136);
  nose.scale.set(1.0, 0.75, 1.1);
  headGroup.add(nose);

  // Front Facial Decal Plane
  const faceTex = createChibiAnimeFaceTexture(eyeColorHex, hairColorHex, 'confident', isFemale);
  const faceDecalGeo = new THREE.PlaneGeometry(0.20, 0.20);
  const faceDecalMat = new THREE.MeshBasicMaterial({
    map: faceTex,
    transparent: true,
    depthWrite: false,
  });
  const faceDecal = new THREE.Mesh(faceDecalGeo, faceDecalMat);
  faceDecal.position.set(0, 0.005, 0.132);
  headGroup.add(faceDecal);

  // 4. SCULPTED HAIR & CLASS HATS / HOODS
  const hairGroup = new THREE.Group();
  const hairMat = new THREE.MeshStandardMaterial({
    color: hairColorHex,
    roughness: 0.55,
    metalness: 0.1,
  });

  // Hair Crown Dome
  const hairDome = new THREE.Mesh(new THREE.SphereGeometry(0.142, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.65), hairMat);
  hairDome.position.set(0, 0.02, -0.015);
  hairGroup.add(hairDome);

  let headbandTail: THREE.Group | undefined;

  // 🧙‍♂️ WIZARD POINTED HAT FOR MAGE
  if (heroClass === 'Mago') {
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6, flatShading: true });
    const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 16), hatMat);
    hatBrim.position.set(0, 0.08, 0);
    hatBrim.rotation.x = -0.12;
    headGroup.add(hatBrim);

    // Gold hat band
    const hatBand = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.015, 6, 16), buckleMat);
    hatBand.position.set(0, 0.09, 0);
    hatBand.rotation.x = Math.PI / 2 - 0.12;
    headGroup.add(hatBand);

    // Cone top tilted back
    const hatCone = new THREE.Mesh(new THREE.ConeGeometry(0.125, 0.32, 8), hatMat);
    hatCone.position.set(0, 0.24, -0.04);
    hatCone.rotation.x = -0.35;
    headGroup.add(hatCone);
  } else if (heroClass === 'Pícaro' || heroClass === 'Nigromante') {
    // 🗡️ ROGUE / NECRO SHADOW HOOD
    const hoodMat = new THREE.MeshStandardMaterial({ color: tunicColor, roughness: 0.7, flatShading: true });
    const hoodDome = new THREE.Mesh(new THREE.SphereGeometry(0.155, 12, 12), hoodMat);
    hoodDome.position.set(0, 0.03, -0.02);
    hoodDome.scale.set(1.0, 1.1, 1.1);
    headGroup.add(hoodDome);
  } else if (isFemale) {
    // FEMALE ELF ADVENTURER HAIR
    [-0.06, 0, 0.06].forEach((bx, i) => {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 5), hairMat);
      bang.position.set(bx, 0.10, 0.10);
      bang.rotation.x = 0.35;
      bang.rotation.z = (i - 1) * 0.3;
      hairGroup.add(bang);
    });

    [-0.12, 0.12].forEach((sx) => {
      const lock1 = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.18, 5), hairMat);
      lock1.position.set(sx, -0.03, 0.03);
      lock1.rotation.z = sx > 0 ? -0.35 : 0.35;
      lock1.rotation.x = 0.15;
      hairGroup.add(lock1);
    });

    const backHair = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.20, 5), hairMat);
    backHair.position.set(0, 0.01, -0.13);
    backHair.rotation.x = -0.55;
    hairGroup.add(backHair);
  } else {
    // MALE HEROIC HAIR (Warrior Spikes & Headband)
    const headbandMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 });
    const headband = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.016, 8, 20), headbandMat);
    headband.position.set(0, 0.06, 0);
    headband.rotation.x = Math.PI / 2;
    hairGroup.add(headband);

    const spikePositions = [
      { x: 0, y: 0.16, z: 0.03, rx: -0.3, rz: 0, scale: 0.5 },
      { x: -0.06, y: 0.15, z: 0.02, rx: -0.2, rz: 0.4, scale: 0.45 },
      { x: 0.06, y: 0.15, z: 0.02, rx: -0.2, rz: -0.4, scale: 0.45 },
    ];

    spikePositions.forEach((sp) => {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.09 * sp.scale, 0.30 * sp.scale, 5), hairMat);
      spike.position.set(sp.x, sp.y, sp.z);
      spike.rotation.x = sp.rx;
      spike.rotation.z = sp.rz;
      hairGroup.add(spike);
    });
  }

  headGroup.add(hairGroup);
  heroGroup.add(headGroup);

  // 5. ARTICULATED HEROIC ARMS & BRACERS
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.16, 0.82, 0);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.16, 0.82, 0);

  const bracerMat = new THREE.MeshStandardMaterial({ color: 0x5c2b09, roughness: 0.6 });

  [leftArm, rightArm].forEach((arm) => {
    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.032, 0.20, 8), skinMat);
    bicep.position.y = -0.09;
    bicep.castShadow = true;
    arm.add(bicep);

    const bracer = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.038, 0.09, 8), bracerMat);
    bracer.position.y = -0.16;
    bracer.castShadow = true;
    arm.add(bracer);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), skinMat);
    hand.position.y = -0.22;
    arm.add(hand);

    heroGroup.add(arm);
  });

  // --- MODULAR 3D LOW-POLY WEAPON ATTACHMENT ---
  const weaponGroup = new THREE.Group();
  weaponGroup.position.set(0, -0.22, 0.08);
  const weaponMesh = createLowPolyWeaponMesh(weaponItem, heroClass);
  weaponGroup.add(weaponMesh);
  rightArm.add(weaponGroup);

  // Left hand secondary weapon for Rogue (Dual Daggers) or Shield for Warrior/Paladin
  if (heroClass === 'Pícaro') {
    const leftDaggerGroup = new THREE.Group();
    leftDaggerGroup.position.set(0, -0.22, 0.08);
    const leftDagger = createLowPolyWeaponMesh(weaponItem, 'Pícaro');
    leftDagger.scale.set(0.85, 0.85, 0.85);
    leftDaggerGroup.add(leftDagger);
    leftArm.add(leftDaggerGroup);
  } else if (heroClass === 'Guerrero' || heroClass === 'Paladín' || armorItem) {
    const shieldMesh = createLowPolyShieldMesh(armorItem, heroClass);
    if (shieldMesh) {
      const shieldGroup = new THREE.Group();
      shieldGroup.position.set(-0.05, -0.16, 0.08);
      shieldGroup.add(shieldMesh);
      leftArm.add(shieldGroup);
    }
  }

  // --- MODULAR 3D HELMET ATTACHMENT ---
  if (armorItem?.id.includes('a4') || armorItem?.id.includes('a3') || armorItem?.name.toLowerCase().includes('campeón') || armorItem?.name.toLowerCase().includes('magma')) {
    const helmetMesh = createLowPolyHelmetMesh('horned');
    helmetMesh.position.set(0, 0.02, 0);
    headGroup.add(helmetMesh);
  }

  return {
    group: heroGroup,
    leftLeg,
    rightLeg,
    leftArm,
    rightArm,
    torsoGroup,
    headGroup,
    weaponGroup,
    headbandTail,
  };
}

// ==========================================
// 2.5 PROCEDURAL LOW-POLY 3D ARSENAL (Matching Reference Image)
// ==========================================

/**
 * Creates 3D Low-Poly Weapons matching the reference image collection
 */
export function createLowPolyWeaponMesh(weaponItem: EquipmentItem | null, heroClass: string): THREE.Group {
  const group = new THREE.Group();
  const name = (weaponItem?.name || '').toLowerCase();
  const id = (weaponItem?.id || '').toLowerCase();

  // PBR Materials with high-definition textures & reflections
  const steelBladeTex = createProceduralSteelBladeTexture();
  const goldEngravedTex = createProceduralEngravedGoldTexture();
  const leatherStitchedTex = createProceduralStitchedLeatherTexture();

  const steelMat = new THREE.MeshStandardMaterial({
    map: steelBladeTex,
    color: 0xffffff,
    metalness: 0.94,
    roughness: 0.15,
  });
  const darkSteelMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.92,
    roughness: 0.22,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    map: goldEngravedTex,
    color: 0xffffff,
    metalness: 0.96,
    roughness: 0.16,
  });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.85 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x271c19, roughness: 0.9 });
  const leatherMat = new THREE.MeshStandardMaterial({
    map: leatherStitchedTex,
    color: 0xffffff,
    roughness: 0.60,
  });

  // 1. STAVES (BÁCULOS - Top-left in image)
  if (heroClass === 'Mago' || name.includes('báculo') || name.includes('varita') || id.includes('staff')) {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 1.25, 8), woodMat);
    shaft.position.y = 0.40;
    shaft.castShadow = true;
    group.add(shaft);

    // Leather shaft wraps
    for (let y of [0.15, 0.35, 0.55]) {
      const wrap = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.08, 8), leatherMat);
      wrap.position.y = y;
      group.add(wrap);
    }

    if (name.includes('celestial') || name.includes('luna') || name.includes('moon')) {
      // Crescent Moon Staff
      const moonMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 1.0, metalness: 0.8, roughness: 0.2 });
      const crescent = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 8, 16, Math.PI * 1.35), moonMat);
      crescent.position.y = 1.05;
      crescent.rotation.z = Math.PI * 0.3;
      group.add(crescent);

      const starGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x38bdf8, emissiveIntensity: 2.0 }));
      starGem.position.set(0.05, 1.05, 0);
      group.add(starGem);
    } else if (name.includes('volcán') || name.includes('fuego') || name.includes('sol')) {
      // Sunburst / Fire Orb Staff
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 8, 16), goldMat);
      ring.position.y = 1.05;
      group.add(ring);

      const flameOrb = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.11, 1),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xf97316, emissiveIntensity: 2.5 })
      );
      flameOrb.position.y = 1.05;
      group.add(flameOrb);
    } else {
      // Archmage Crystal Staff with Curved Branch Arms & Floating Arcane Crystal
      const branchL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.30, 6), darkWoodMat);
      branchL.position.set(-0.09, 1.0, 0);
      branchL.rotation.z = -0.45;
      group.add(branchL);

      const branchR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.30, 6), darkWoodMat);
      branchR.position.set(0.09, 1.0, 0);
      branchR.rotation.z = 0.45;
      group.add(branchR);

      // Floating Cyan Magic Gem with intense glow
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 2.8,
        metalness: 0.9,
        roughness: 0.05,
      });
      const floatingGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 0), gemMat);
      floatingGem.position.y = 1.08;
      group.add(floatingGem);
    }

    return group;
  }

  // 2. DAGGERS & KATARS (PÍCARO)
  if (heroClass === 'Pícaro' || name.includes('daga') || name.includes('sombrío') || name.includes('katar')) {
    // Dagger Blade (Pointed Diamond Cross-Section with Steel PBR)
    const daggerBladeMat = name.includes('veneno')
      ? new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 1.2, metalness: 0.85, roughness: 0.15 })
      : steelMat;

    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.65, 4), daggerBladeMat);
    blade.position.y = 0.38;
    blade.scale.set(1, 1, 0.4);
    blade.castShadow = true;
    group.add(blade);

    // Crossguard
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.04, 0.06), goldMat);
    guard.position.y = 0.04;
    group.add(guard);

    // Leather Grip & Gold Pommel
    const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.16, 8), leatherMat);
    hilt.position.y = -0.06;
    group.add(hilt);

    const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), goldMat);
    pommel.position.y = -0.16;
    group.add(pommel);

    return group;
  }

  // 3. WARHAMMERS & MACES
  if (name.includes('martillo') || name.includes('maza') || name.includes('titán')) {
    const haft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.95, 8), darkWoodMat);
    haft.position.y = 0.32;
    group.add(haft);

    // Warhammer Head (Chamfered Iron Block + Rear Pick Spike)
    const headBlock = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.18, 0.22), steelMat);
    headBlock.position.set(0.04, 0.72, 0);
    headBlock.castShadow = true;
    group.add(headBlock);

    // Gold trim plates on hammer
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.24), goldMat);
    trim.position.set(0.04, 0.72, 0);
    group.add(trim);

    // Rear armor piercing spike
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 6), darkSteelMat);
    spike.position.set(-0.16, 0.72, 0);
    spike.rotation.z = Math.PI / 2;
    group.add(spike);

    return group;
  }

  // 4. BOWS
  if (heroClass === 'Arquero' || name.includes('arco') || name.includes('bow')) {
    const bowWoodMat = new THREE.MeshStandardMaterial({ color: 0x6b3f1d, roughness: 0.65 });
    const bowGripMat = leatherMat;
    const bowGoldMat = goldMat;

    // Central Hand Leather Grip
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.10, 8), bowGripMat);
    grip.position.set(0, 0, 0);
    group.add(grip);

    // Gold grip rings
    [-0.05, 0.05].forEach((gy) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.006, 6, 12), bowGoldMat);
      ring.position.set(0, gy, 0);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    });

    // Upper Bow Limb
    const upperLimb1 = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.016, 0.16, 8), bowWoodMat);
    upperLimb1.position.set(0, 0.12, 0.02);
    upperLimb1.rotation.x = 0.25;
    group.add(upperLimb1);

    const upperLimb2 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, 0.16, 8), bowWoodMat);
    upperLimb2.position.set(0, 0.25, 0.01);
    upperLimb2.rotation.x = -0.30;
    group.add(upperLimb2);

    const topNock = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.04, 6), bowGoldMat);
    topNock.position.set(0, 0.33, -0.01);
    topNock.rotation.x = -0.45;
    group.add(topNock);

    // Lower Bow Limb
    const lowerLimb1 = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.016, 0.16, 8), bowWoodMat);
    lowerLimb1.position.set(0, -0.12, 0.02);
    lowerLimb1.rotation.x = -0.25;
    group.add(lowerLimb1);

    const lowerLimb2 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, 0.16, 6), bowWoodMat);
    lowerLimb2.position.set(0, -0.25, 0.01);
    lowerLimb2.rotation.x = 0.30;
    group.add(lowerLimb2);

    const bottomNock = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.04, 6), bowGoldMat);
    bottomNock.position.set(0, -0.33, -0.01);
    bottomNock.rotation.x = Math.PI + 0.45;
    group.add(bottomNock);

    // Taut Bowstring
    const stringMat = new THREE.LineBasicMaterial({ color: 0xf8fafc, linewidth: 2 });
    const stringGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.32, -0.02),
      new THREE.Vector3(0, 0, -0.05),
      new THREE.Vector3(0, -0.32, -0.02),
    ]);
    const bowstring = new THREE.Line(stringGeo, stringMat);
    group.add(bowstring);

    return group;
  }

  // 5. BATTLEAXES
  if (heroClass === 'Berserker' || name.includes('hacha') || name.includes('axe')) {
    const haft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.0, 8), woodMat);
    haft.position.y = 0.35;
    group.add(haft);

    // Double Crescent Blades with Steel PBR
    const bladeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.36, 0.03), steelMat);
    bladeLeft.position.set(-0.16, 0.70, 0);
    bladeLeft.scale.set(1, 1, 0.5);
    group.add(bladeLeft);

    const bladeRight = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.36, 0.03), steelMat);
    bladeRight.position.set(0.16, 0.70, 0);
    bladeRight.scale.set(1, 1, 0.5);
    group.add(bladeRight);

    // Top Spike
    const topSpike = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.20, 6), darkSteelMat);
    topSpike.position.y = 0.95;
    group.add(topSpike);

    return group;
  }

  // 6. SWORDS & GREATSWORDS (ESPADA / MANDOBLE / HOJA CELESTIAL)
  const isVolcanic = name.includes('volcán') || name.includes('fuego') || id.includes('w3');
  const isCelestial = name.includes('celestial') || name.includes('campeón') || id.includes('w4');
  const isSteel = name.includes('acero') || name.includes('mandoble') || id.includes('w2');

  const bladeMat = isVolcanic
    ? new THREE.MeshStandardMaterial({ color: 0x1c1917, emissive: 0xea580c, emissiveIntensity: 1.8, metalness: 0.7, roughness: 0.2 })
    : isCelestial
    ? new THREE.MeshStandardMaterial({ map: steelBladeTex, color: 0xffffff, emissive: 0x38bdf8, emissiveIntensity: 0.9, metalness: 0.96, roughness: 0.10 })
    : steelMat;

  // Long Stylized Blade
  const bladeHeight = isSteel || isCelestial ? 1.05 : 0.88;
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.13, bladeHeight, 0.035), bladeMat);
  blade.position.y = bladeHeight / 2 + 0.08;
  blade.castShadow = true;
  group.add(blade);

  // Blade Tip
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 4), bladeMat);
  tip.position.y = bladeHeight + 0.16;
  tip.rotation.y = Math.PI / 4;
  group.add(tip);

  // Crossguard (Engraved 24k Gold)
  const guardWidth = isCelestial ? 0.42 : isSteel ? 0.36 : 0.28;
  const guard = new THREE.Mesh(new THREE.BoxGeometry(guardWidth, 0.06, 0.08), goldMat);
  guard.position.y = 0.06;
  guard.castShadow = true;
  group.add(guard);

  // Central Gem Inset in Crossguard
  const gemColor = isVolcanic ? 0xef4444 : isCelestial ? 0x0284c7 : 0x10b981;
  const gemEmissive = isVolcanic ? 0xf97316 : isCelestial ? 0x38bdf8 : 0x34d399;
  const centerGem = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.05, 0),
    new THREE.MeshStandardMaterial({ color: gemColor, emissive: gemEmissive, emissiveIntensity: 1.6, metalness: 0.9, roughness: 0.1 })
  );
  centerGem.position.set(0, 0.06, 0.045);
  group.add(centerGem);

  // Stitched Leather Wrapped Hilt & Golden Pommel
  const hiltLen = isSteel ? 0.24 : 0.16;
  const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, hiltLen, 8), leatherMat);
  hilt.position.y = -hiltLen / 2;
  group.add(hilt);

  const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), goldMat);
  pommel.position.y = -hiltLen - 0.04;
  group.add(pommel);

  // Faceted Ruby in Pommel
  const pommelGem = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.025, 0),
    new THREE.MeshStandardMaterial({ color: 0xb91c1c, emissive: 0xef4444, emissiveIntensity: 1.2, roughness: 0.1 })
  );
  pommelGem.position.set(0, -hiltLen - 0.04, 0.035);
  group.add(pommelGem);

  return group;
}

/**
 * Creates 3D Low-Poly Shields with realistic wood and riveted steel PBR materials
 */
export function createLowPolyShieldMesh(armorItem: EquipmentItem | null, heroClass: string): THREE.Group | null {
  if (heroClass === 'Mago' && !armorItem?.id.includes('a3') && !armorItem?.id.includes('a4')) {
    return createLowPolyBookMesh();
  }

  const group = new THREE.Group();
  const name = (armorItem?.name || '').toLowerCase();
  const id = (armorItem?.id || '').toLowerCase();

  const steelBladeTex = createProceduralSteelBladeTexture();
  const goldEngravedTex = createProceduralEngravedGoldTexture();
  const leatherStitchedTex = createProceduralStitchedLeatherTexture();

  const steelMat = new THREE.MeshStandardMaterial({
    map: steelBladeTex,
    color: 0xffffff,
    metalness: 0.94,
    roughness: 0.16,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    map: goldEngravedTex,
    color: 0xffffff,
    metalness: 0.96,
    roughness: 0.15,
  });
  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x3b1c08,
    roughness: 0.75,
  });

  if (name.includes('campeón') || id.includes('a4')) {
    // Crusader / Herald Blue Cross Shield
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.4 });
    const shieldBody = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.05), baseMat);
    shieldBody.castShadow = true;
    group.add(shieldBody);

    // White Cross Heraldry with gold filigree
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.55, 0.06), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
    crossH.position.z = 0.01;
    group.add(crossH);

    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.10, 0.06), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
    crossV.position.set(0, 0.08, 0.01);
    group.add(crossV);

    // Riveted Steel Border Trim
    const rim = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.69, 0.03), steelMat);
    rim.position.z = -0.01;
    group.add(rim);

    // 4 Corner Gold Rivets
    [[-0.22, 0.30], [0.22, 0.30], [-0.22, -0.30], [0.22, -0.30]].forEach(([rx, ry]) => {
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), goldMat);
      rivet.position.set(rx, ry, 0.02);
      group.add(rivet);
    });
  } else if (name.includes('magma') || id.includes('a3')) {
    // Spiked Round Buckler
    const buckler = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 16), steelMat);
    buckler.rotation.x = Math.PI / 2;
    buckler.castShadow = true;
    group.add(buckler);

    // Conical gold spikes around rim
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 6), goldMat);
      spike.position.set(Math.cos(angle) * 0.23, Math.sin(angle) * 0.23, 0.05);
      spike.rotation.x = Math.PI / 2;
      group.add(spike);
    }

    const centerBoss = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.15, 8), goldMat);
    centerBoss.position.z = 0.06;
    centerBoss.rotation.x = Math.PI / 2;
    group.add(centerBoss);
  } else {
    // Nordic Plank Round Shield with Steel Rim & Center Boss
    const woodShield = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.05, 16), darkWoodMat);
    woodShield.rotation.x = Math.PI / 2;
    woodShield.castShadow = true;
    group.add(woodShield);

    // Steel Rim Ring with metallic shine
    const rimRing = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.025, 8, 20), steelMat);
    group.add(rimRing);

    // Steel Center Boss
    const boss = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), steelMat);
    boss.position.z = 0.04;
    group.add(boss);
  }

  return group;
}

/**
 * Creates 3D Low-Poly Grimoire / Spell Book (Bottom-left in reference image)
 */
export function createLowPolyBookMesh(): THREE.Group {
  const group = new THREE.Group();
  const coverMat = new THREE.MeshStandardMaterial({ color: 0x4c1d95, roughness: 0.6, flatShading: true });
  const pageMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.8, flatShading: true });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2, flatShading: true });

  // Leather book cover
  const cover = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.09), coverMat);
  cover.castShadow = true;
  group.add(cover);

  // Paper pages
  const pages = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.38, 0.07), pageMat);
  pages.position.set(0.01, 0, 0);
  group.add(pages);

  // Arcane cross emblem on cover
  const emblem = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.10), goldMat);
  emblem.position.set(0, 0, 0.01);
  group.add(emblem);

  return group;
}

/**
 * Creates 3D Low-Poly Horned / Knight Helmet (Scales perfectly with proportioned character head)
 */
export function createLowPolyHelmetMesh(style: 'horned' | 'knight' = 'horned'): THREE.Group {
  const group = new THREE.Group();
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.3, flatShading: true });
  const hornMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5, flatShading: true });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2, flatShading: true });

  // Skull Cap (Snugly fits around head radius 0.20)
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), ironMat);
  cap.position.set(0, 0.04, -0.01);
  cap.castShadow = true;
  group.add(cap);

  // Brow Band
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.018, 6, 24), goldMat);
  band.position.set(0, 0.04, -0.01);
  band.rotation.x = Math.PI / 2;
  group.add(band);

  // Noseguard / Forehead plate
  const noseguard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.025), goldMat);
  noseguard.position.set(0, 0.01, 0.215);
  group.add(noseguard);

  // Top Apex Spike
  const topSpike = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 6), goldMat);
  topSpike.position.set(0, 0.24, -0.01);
  group.add(topSpike);

  if (style === 'horned') {
    // Proportional Curved Ivory Horns
    [-0.18, 0.18].forEach((hx) => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.18, 6), hornMat);
      horn.position.set(hx, 0.10, -0.02);
      horn.rotation.z = hx > 0 ? -0.75 : 0.75;
      horn.rotation.x = -0.25;
      horn.castShadow = true;
      group.add(horn);
    });
  }

  return group;
}

/**
 * Creates 3D Low-Poly Potion Flask (Bottom-left in reference image)
 */
export function createLowPolyPotionMesh(type: 'hp' | 'mp' | 'all' | 'buff' = 'hp'): THREE.Group {
  const group = new THREE.Group();
  const liquidColor = type === 'hp' ? 0xef4444 : type === 'mp' ? 0x3b82f6 : type === 'buff' ? 0x10b981 : 0xf59e0b;

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    roughness: 0.1,
    flatShading: true,
  });

  const liquidMat = new THREE.MeshStandardMaterial({
    color: liquidColor,
    emissive: liquidColor,
    emissiveIntensity: 1.2,
    roughness: 0.2,
    flatShading: true,
  });

  const corkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8, flatShading: true });

  // Spherical flask body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), glassMat);
  group.add(body);

  const liquid = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), liquidMat);
  group.add(liquid);

  // Neck & Cork
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.14, 6), glassMat);
  neck.position.y = 0.20;
  group.add(neck);

  const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 6), corkMat);
  cork.position.y = 0.28;
  group.add(cork);

  return group;
}


// ==========================================
// 3. STYLIZED 3D ENEMY MESH GENERATOR (Matching the Reference Image)
// ==========================================

export interface RealisticEnemyMeshResult {
  group: THREE.Group;
  updateAnimation: (time: number, isAttacking: boolean, isHit: boolean) => void;
}

export function createRealisticEnemyMesh(enemy: Enemy): RealisticEnemyMeshResult {
  const group = new THREE.Group();
  const enemyName = enemy.name.toLowerCase();
  const spriteType = (enemy.spriteType || '').toLowerCase();

  // Determine enemy type
  const isGoblin = enemyName.includes('trasgo') || enemyName.includes('goblin') || enemyName.includes('orco') || spriteType.includes('goblin');
  const isDarkKnight = enemyName.includes('sombra') || enemyName.includes('caballero') || enemyName.includes('espectro') || enemyName.includes('dark');
  const isBat = enemyName.includes('murciélago') || enemyName.includes('bat') || spriteType.includes('bat');
  const isWolf = enemyName.includes('lobo') || spriteType.includes('wolf');
  const isGhost = enemyName.includes('fantasma') || spriteType.includes('ghost');
  const isGolem = enemyName.includes('golem') || enemyName.includes('roca') || spriteType.includes('golem');
  const isDragon = enemyName.includes('dragón') || enemyName.includes('voragof') || spriteType.includes('dragon');
  const isSpider = enemyName.includes('araña') || enemyName.includes('arácnido') || spriteType.includes('spider');
  const isSkeleton = enemyName.includes('esqueleto') || enemyName.includes('muerto') || spriteType.includes('skeleton');
  const isSlime = enemyName.includes('slime') || spriteType.includes('slime');

  let updateAnimation = (time: number, isAttacking: boolean, isHit: boolean) => {
    // Default placeholder
  };

  if (isGoblin) {
    // STYLIZED CHIBI GREEN GOBLIN BEAST (Direct match to Row 2 #2 in reference image!)
    const goblinSkinMat = new THREE.MeshStandardMaterial({
      color: 0x65a30d, // Lime Emerald Green
      roughness: 0.6,
      metalness: 0.1,
    });

    // Chunky Muscular Squat Torso
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), goblinSkinMat);
    torso.scale.set(1.2, 1.0, 0.9);
    torso.position.y = 0.65;
    torso.castShadow = true;
    group.add(torso);

    // Spiky Foliage / Horn Shoulders & Back Crest (Exact match to Row 2 #2!)
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.5 });
    const shoulderSpikes = [
      { x: -0.65, y: 0.85, z: -0.05, rx: 0.2, rz: 0.8, s: 1.2 },
      { x: -0.55, y: 1.05, z: -0.10, rx: 0.1, rz: 0.5, s: 1.0 },
      { x: 0.65, y: 0.85, z: -0.05, rx: 0.2, rz: -0.8, s: 1.2 },
      { x: 0.55, y: 1.05, z: -0.10, rx: 0.1, rz: -0.5, s: 1.0 },
      { x: 0, y: 1.15, z: -0.25, rx: -0.4, rz: 0, s: 1.1 },
    ];

    shoulderSpikes.forEach((sp) => {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.14 * sp.s, 0.48 * sp.s, 5), spikeMat);
      spike.position.set(sp.x, sp.y, sp.z);
      spike.rotation.x = sp.rx;
      spike.rotation.z = sp.rz;
      spike.castShadow = true;
      group.add(spike);
    });

    // Chunky Squat Legs
    [-0.28, 0.28].forEach((lx) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.40, 8), goblinSkinMat);
      leg.position.set(lx, 0.20, 0);
      leg.castShadow = true;
      group.add(leg);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.28), goblinSkinMat);
      foot.position.set(lx, 0.07, 0.06);
      foot.castShadow = true;
      group.add(foot);
    });

    // Stylized Face (Toothy grin & glowing eyes)
    const faceTex = createGoblinBeastFaceTexture();
    const headMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.5,
    });

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.44, 20, 20), headMat);
    headMesh.position.set(0, 0.95, 0.15);
    headMesh.scale.set(1.15, 0.95, 1.0);
    headMesh.rotation.y = -Math.PI / 2;
    headMesh.castShadow = true;
    group.add(headMesh);

    // Pointed Horn Goblin Ears
    [-0.45, 0.45].forEach((ex) => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.50, 5), goblinSkinMat);
      ear.position.set(ex * 1.1, 1.05, 0);
      ear.rotation.z = ex > 0 ? -1.1 : 1.1;
      ear.rotation.x = -0.2;
      group.add(ear);
    });

    // Heavy Wooden Spiked War Club
    const clubArm = new THREE.Group();
    clubArm.position.set(0.55, 0.75, 0.1);

    const armMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.10, 0.45, 8), goblinSkinMat);
    armMesh.position.y = -0.15;
    clubArm.add(armMesh);

    const clubMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 });
    const club = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.08, 0.85, 8), clubMat);
    club.position.set(0, 0.25, 0.25);
    club.rotation.x = 0.4;
    club.castShadow = true;
    clubArm.add(club);

    group.add(clubArm);

    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.10, 0.45, 8), goblinSkinMat);
    leftArm.position.set(-0.55, 0.60, 0.1);
    leftArm.rotation.z = 0.3;
    leftArm.castShadow = true;
    group.add(leftArm);

    group.scale.set(1.2, 1.2, 1.2);

    updateAnimation = (time: number, isAttacking: boolean, isHit: boolean) => {
      torso.scale.set(1.2 + Math.sin(time * 4) * 0.05, 1.0 - Math.sin(time * 4) * 0.05, 0.9);
      if (isAttacking) {
        clubArm.rotation.x = -Math.PI * 0.6;
        clubArm.position.z = 0.4;
      } else {
        clubArm.rotation.x = Math.sin(time * 3) * 0.15;
        clubArm.position.z = 0.1;
      }
    };
  } else if (isDarkKnight) {
    // STYLIZED HORNED DARK KNIGHT (Matching Row 1 #4 & Row 3 #1 in reference!)
    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b, // Deep Obsidian / Dark Indigo
      metalness: 0.85,
      roughness: 0.25,
    });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.35), armorMat);
    torso.position.y = 0.70;
    torso.castShadow = true;
    group.add(torso);

    // Spiked Pauldrons
    [-0.38, 0.38].forEach((px) => {
      const pauldron = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 5), armorMat);
      pauldron.position.set(px, 0.92, 0);
      pauldron.rotation.z = px > 0 ? -0.8 : 0.8;
      group.add(pauldron);
    });

    // Helmet with Sweeping Horns & Glowing Visor Slit
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.20, 0.05);

    const helm = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.48, 0.48), armorMat);
    helm.castShadow = true;
    headGroup.add(helm);

    // Sweeping Horns (Like Row 3 #1!)
    [-0.32, 0.32].forEach((hx) => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.55, 5), armorMat);
      horn.position.set(hx * 1.1, 0.25, -0.05);
      horn.rotation.z = hx > 0 ? -0.8 : 0.8;
      horn.rotation.x = -0.3;
      headGroup.add(horn);
    });

    // Glowing Visor Slits
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 2.5,
    });
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.04), visorMat);
    visor.position.set(0, 0.02, 0.25);
    headGroup.add(visor);

    group.add(headGroup);

    // Heavy Dark Jagged Blade
    const sword = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 1.1, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x7c2d12, emissiveIntensity: 0.8, metalness: 0.9 })
    );
    sword.position.set(0.42, 0.85, 0.3);
    sword.rotation.x = 0.3;
    group.add(sword);

    group.scale.set(1.2, 1.2, 1.2);

    updateAnimation = (time: number, isAttacking: boolean, isHit: boolean) => {
      headGroup.rotation.y = Math.sin(time * 2.5) * 0.1;
      sword.rotation.x = isAttacking ? -0.5 : 0.3 + Math.sin(time * 3) * 0.08;
    };
  } else if (isSlime) {
    // JELLY SLIME & KING SLIME
    const slimeMat = new THREE.MeshStandardMaterial({
      color: enemy.color || 0x22c55e,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88,
    });

    const body = new THREE.Mesh(new THREE.SphereGeometry(enemy.isBoss ? 0.85 : 0.6, 16, 16), slimeMat);
    body.position.y = enemy.isBoss ? 0.85 : 0.6;
    body.castShadow = true;
    group.add(body);

    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: enemy.color || 0x22c55e,
      emissiveIntensity: 1.5,
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(enemy.isBoss ? 0.35 : 0.22, 10, 10), coreMat);
    core.position.y = body.position.y;
    group.add(core);

    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    [-0.18, 0.18].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(enemy.isBoss ? 0.10 : 0.07), eyeMat);
      eye.position.set(ex * (enemy.isBoss ? 1.4 : 1.0), body.position.y + 0.1, enemy.isBoss ? 0.75 : 0.52);
      group.add(eye);
    });

    if (enemy.isBoss) {
      const crownMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 });
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.3, 0.25, 6), crownMat);
      crown.position.set(0, body.position.y + 0.85, 0);
      group.add(crown);
    }

    updateAnimation = (time: number, isAttacking: boolean, isHit: boolean) => {
      const squish = Math.sin(time * 6) * 0.12;
      body.scale.set(1 + squish, 1 - squish, 1 + squish);
      core.scale.setScalar(1 + Math.sin(time * 8) * 0.2);
    };
  } else if (isWolf) {
    // STYLIZED CARTOON WOLF
    const wolfFurTex = createWolfFurTexture();
    const wolfMat = new THREE.MeshStandardMaterial({
      map: wolfFurTex,
      roughness: 0.7,
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 1.2), wolfMat);
    body.position.y = 0.65;
    body.castShadow = true;
    group.add(body);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.95, 0.6);

    const headMesh = new THREE.BoxGeometry(0.48, 0.42, 0.50);
    const head = new THREE.Mesh(headMesh, wolfMat);
    headGroup.add(head);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.22, 0.35), wolfMat);
    snout.position.set(0, -0.06, 0.35);
    headGroup.add(snout);

    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 1.8 });
    [-0.18, 0.18].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06), eyeMat);
      eye.position.set(ex, 0.08, 0.30);
      headGroup.add(eye);
    });

    group.add(headGroup);

    updateAnimation = (time: number, isAttacking: boolean, isHit: boolean) => {
      headGroup.rotation.x = isAttacking ? 0.25 : Math.sin(time * 3) * 0.05;
    };
  } else if (isBat) {
    // STYLIZED CHIBI BAT
    const batMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 });
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, side: THREE.DoubleSide });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 10, 10), batMat);
    body.position.y = 1.1;
    group.add(body);

    const leftWing = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.7), wingMat);
    leftWing.position.set(-0.65, 1.1, 0);
    group.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.7), wingMat);
    rightWing.position.set(0.65, 1.1, 0);
    group.add(rightWing);

    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 2.0 });
    [-0.12, 0.12].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05), eyeMat);
      eye.position.set(ex, 1.18, 0.32);
      group.add(eye);
    });

    updateAnimation = (time: number, isAttacking: boolean, isHit: boolean) => {
      const flap = Math.sin(time * 12) * 0.6;
      leftWing.rotation.z = flap;
      rightWing.rotation.z = -flap;
      group.position.y = 1.0 + Math.sin(time * 4) * 0.15;
    };
  } else if (isGolem) {
    // STYLIZED ROCK GOLEM
    const stoneTex = createStoneTexture();
    const stoneMat = new THREE.MeshStandardMaterial({
      map: stoneTex,
      roughness: 0.85,
    });

    const torso = new THREE.Mesh(new THREE.DodecahedronGeometry(0.80, 1), stoneMat);
    torso.position.y = 1.0;
    torso.castShadow = true;
    group.add(torso);

    const coreMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 2.0 });
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.26), coreMat);
    core.position.set(0, 1.0, 0.55);
    group.add(core);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.38, 0.42), stoneMat);
    head.position.set(0, 1.70, 0.1);
    group.add(head);

    group.scale.set(1.2, 1.2, 1.2);

    updateAnimation = (time: number, isAttacking: boolean, isHit: boolean) => {
      core.scale.setScalar(1 + Math.sin(time * 6) * 0.15);
    };
  } else if (isDragon) {
    // CHIBI DRAGON
    const scaleTex = createDragonScaleTexture();
    const dragonMat = new THREE.MeshStandardMaterial({
      map: scaleTex,
      roughness: 0.4,
    });

    const body = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 1), dragonMat);
    body.position.y = 1.0;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.85, 6), dragonMat);
    head.position.set(0, 1.6, 0.4);
    head.rotation.x = Math.PI * 0.6;
    group.add(head);

    const wingMat = new THREE.MeshStandardMaterial({ color: 0x450a0a, side: THREE.DoubleSide });
    const leftWing = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9), wingMat);
    leftWing.position.set(-0.9, 1.4, -0.2);
    group.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9), wingMat);
    rightWing.position.set(0.9, 1.4, -0.2);
    group.add(rightWing);

    updateAnimation = (time: number, isAttacking: boolean, isHit: boolean) => {
      leftWing.rotation.z = Math.sin(time * 6) * 0.3;
      rightWing.rotation.z = -Math.sin(time * 6) * 0.3;
    };
  } else if (isSkeleton) {
    // CHIBI SKELETON
    const boneMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), boneMat);
    skull.position.y = 1.25;
    group.add(skull);

    const ribs = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.5, 8), boneMat);
    ribs.position.y = 0.75;
    group.add(ribs);

    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.5 });
    [-0.10, 0.10].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06), eyeMat);
      eye.position.set(ex, 1.30, 0.26);
      group.add(eye);
    });

    updateAnimation = (time: number, isAttacking: boolean, isHit: boolean) => {
      skull.rotation.y = Math.sin(time * 3) * 0.2;
    };
  } else {
    // GENERIC MONSTER
    const bodyMat = new THREE.MeshStandardMaterial({
      color: enemy.color || 0x10b981,
      roughness: 0.3,
    });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), bodyMat);
    body.position.y = 0.65;
    group.add(body);

    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    [-0.18, 0.18].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.12), eyeMat);
      eye.position.set(ex, 0.75, 0.5);
      group.add(eye);
    });

    updateAnimation = (time: number, isAttacking: boolean, isHit: boolean) => {
      body.scale.set(
        1 + Math.sin(time * 4) * (isAttacking ? 0.2 : 0.05),
        1 - Math.sin(time * 4) * (isAttacking ? 0.2 : 0.05),
        1 + Math.sin(time * 4) * (isAttacking ? 0.2 : 0.05)
      );
    };
  }

  return { group, updateAnimation };
}

// ==========================================
// 4. PROCEDURAL 3D TOWN & VILLAGE BUILDINGS
// ==========================================

export interface BuildingMeshResult {
  group: THREE.Group;
  updateAnimation?: (time: number) => void;
}

/**
 * Creates an authentic Nordic / Medieval Timber Cottage matching the user's reference image
 * Features:
 * - Raised stone masonry foundation with corner buttresses & entrance steps
 * - Heavy half-timbered walls with diagonal cross-braces & vertical wood planks
 * - Steep Nordic gabled roof with iconic crossed ridge finials (Viking roof apex)
 * - Multi-tiered overlapping wooden shake shingles
 * - Detailed side stone chimney with animated smoke
 * - Recessed entrance with ajar timber plank door (Z-brace) and glowing amber windows
 * - Rich procedural variations for size, materials, roof colors, and details
 */
export function createLowPolyCottage(
  customRoofColor?: number,
  hasChimney: boolean = true,
  variant: number = 0
): BuildingMeshResult {
  const group = new THREE.Group();

  // Deterministic variation based on variant index
  const v = Math.abs(variant) % 5;

  // Dimensions
  const width = v === 0 ? 1.65 : v === 1 ? 1.80 : v === 2 ? 1.55 : v === 3 ? 1.90 : 1.60;
  const depth = v === 0 ? 1.45 : v === 1 ? 1.35 : v === 2 ? 1.55 : v === 3 ? 1.40 : 1.45;
  const baseH = 0.38;
  const wallH = 0.85;
  const roofPitch = 0.85; // ~48 degrees

  // Color palettes matching medieval & Nordic themes
  const woodColors = [0x5c3a21, 0x452817, 0x6e472a, 0x3d2314, 0x543822]; // Weathered aged pine / oak
  const plankColors = [0x8c6b4f, 0x7a5b3e, 0x9c7a59, 0x6e5239, 0x856447]; // Vertical plank infill
  const stoneColors = [0x64748b, 0x475569, 0x52525b, 0x6b7280, 0x5b6574]; // Masonry stonework
  const roofColors = [0x785338, 0x5c3a21, 0x8b4513, 0x475569, 0x9a3412]; // Shake shingles

  const baseWoodColor = woodColors[v];
  const basePlankColor = plankColors[v];
  const baseStoneColor = stoneColors[v];
  const baseRoofColor = customRoofColor !== undefined ? customRoofColor : roofColors[v];

  // Textures and Materials
  const stoneTex = createProceduralStoneBrickTexture(v % 2 === 0 ? 'grey' : 'sandstone');
  const woodTex = createProceduralWoodPlankTexture(v % 2 === 0 ? 'oak' : 'dark');
  const roofTex = createProceduralRoofShinglesTexture(v % 3 === 0 ? 'terracotta' : v % 3 === 1 ? 'slate' : 'wood');
  const windowTex = createProceduralWindowGlassTexture();

  const stoneMat = new THREE.MeshStandardMaterial({
    map: stoneTex,
    color: 0xffffff,
    roughness: 0.85,
  });

  const darkStoneMat = new THREE.MeshStandardMaterial({
    map: stoneTex,
    color: 0xcccccc,
    roughness: 0.9,
  });

  const timberMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    color: 0xffffff,
    roughness: 0.7,
  });

  const darkTimberMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    color: 0x888888,
    roughness: 0.75,
  });

  const plankMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    color: 0xffffff,
    roughness: 0.8,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    map: roofTex,
    color: 0xffffff,
    roughness: 0.60,
  });

  const windowGlowMat = new THREE.MeshStandardMaterial({
    map: windowTex,
    color: 0xffffff,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.8,
    roughness: 0.2,
  });

  // ==========================================
  // 1. RAISED STONE FOUNDATION & STEPS (Reference Image)
  // ==========================================
  const foundationGroup = new THREE.Group();

  // Main Stone Base
  const foundation = new THREE.Mesh(new THREE.BoxGeometry(width, baseH, depth), stoneMat);
  foundation.position.y = baseH / 2;
  foundation.castShadow = true;
  foundation.receiveShadow = true;
  foundationGroup.add(foundation);

  // 4 Corner Stone Pilasters (Sillares reforzados en las esquinas)
  const cornerSize = 0.22;
  const halfW = width / 2;
  const halfD = depth / 2;
  [
    [-halfW, -halfD],
    [halfW, -halfD],
    [-halfW, halfD],
    [halfW, halfD],
  ].forEach(([cx, cz]) => {
    const pilaster = new THREE.Mesh(new THREE.BoxGeometry(cornerSize, baseH + 0.05, cornerSize), darkStoneMat);
    pilaster.position.set(cx, (baseH + 0.05) / 2, cz);
    pilaster.castShadow = true;
    foundationGroup.add(pilaster);
  });

  // Stone Perimeter Base Trim
  const baseTrim = new THREE.Mesh(new THREE.BoxGeometry(width + 0.06, 0.08, depth + 0.06), darkStoneMat);
  baseTrim.position.y = baseH - 0.04;
  foundationGroup.add(baseTrim);

  // Stone Entrance Steps (3 escalones de piedra al frente)
  const stepW = 0.52;
  const stepCount = 3;
  for (let s = 0; s < stepCount; s++) {
    const stepDepth = 0.16;
    const stepH = baseH / stepCount;
    const stepMesh = new THREE.Mesh(
      new THREE.BoxGeometry(stepW, stepH, stepDepth * (stepCount - s)),
      stoneMat
    );
    stepMesh.position.set(
      0.18,
      (s + 0.5) * stepH,
      halfD + (stepDepth * (stepCount - s)) / 2
    );
    stepMesh.castShadow = true;
    stepMesh.receiveShadow = true;
    foundationGroup.add(stepMesh);
  }

  // Little Stone Step Baluster Posts flanking the stairs
  [-0.14, 0.50].forEach((bx) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, baseH * 0.75, 0.12), darkStoneMat);
    post.position.set(bx, (baseH * 0.75) / 2, halfD + 0.16);
    foundationGroup.add(post);
  });

  group.add(foundationGroup);

  // ==========================================
  // 2. HALF-TIMBERED WALLS WITH CROSS-BRACES (Reference Image)
  // ==========================================
  const wallGroup = new THREE.Group();
  const wallY = baseH + wallH / 2;

  // Inner Wall Core (Vertical planks)
  const wallCore = new THREE.Mesh(new THREE.BoxGeometry(width - 0.12, wallH, depth - 0.12), plankMat);
  wallCore.position.y = wallY;
  wallCore.castShadow = true;
  wallCore.receiveShadow = true;
  wallGroup.add(wallCore);

  // Vertical Timber Corner Posts
  [
    [-halfW + 0.06, -halfD + 0.06],
    [halfW - 0.06, -halfD + 0.06],
    [-halfW + 0.06, halfD - 0.06],
    [halfW - 0.06, halfD - 0.06],
  ].forEach(([tx, tz]) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, wallH + 0.04, 0.12), timberMat);
    post.position.set(tx, wallY, tz);
    post.castShadow = true;
    wallGroup.add(post);
  });

  // Horizontal Sill and Top Timber Plates
  const topPlate = new THREE.Mesh(new THREE.BoxGeometry(width - 0.08, 0.09, depth - 0.08), timberMat);
  topPlate.position.y = baseH + wallH;
  wallGroup.add(topPlate);

  const bottomPlate = new THREE.Mesh(new THREE.BoxGeometry(width - 0.08, 0.08, depth - 0.08), darkTimberMat);
  bottomPlate.position.y = baseH + 0.04;
  wallGroup.add(bottomPlate);

  // Front Door Frame & Posts
  const doorPostL = new THREE.Mesh(new THREE.BoxGeometry(0.09, wallH, 0.10), timberMat);
  doorPostL.position.set(-0.06, wallY, halfD - 0.04);
  wallGroup.add(doorPostL);

  const doorPostR = new THREE.Mesh(new THREE.BoxGeometry(0.09, wallH, 0.10), timberMat);
  doorPostR.position.set(0.42, wallY, halfD - 0.04);
  wallGroup.add(doorPostR);

  const doorLintel = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.09, 0.10), timberMat);
  doorLintel.position.set(0.18, baseH + 0.68, halfD - 0.04);
  wallGroup.add(doorLintel);

  // Diagonal Wall Cross-Brace (Directly matching front-left timber brace in photo!)
  const frontBraceL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.06), timberMat);
  frontBraceL.position.set(-0.40, wallY, halfD - 0.04);
  frontBraceL.rotation.z = 0.65;
  frontBraceL.castShadow = true;
  wallGroup.add(frontBraceL);

  // Side Wall Diagonal Cross-Braces (X-bracing on sides)
  [-halfW + 0.04, halfW - 0.04].forEach((sx) => {
    const sideBrace1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.88, 0.08), timberMat);
    sideBrace1.position.set(sx, wallY, 0);
    sideBrace1.rotation.x = 0.62;
    wallGroup.add(sideBrace1);

    const sideBrace2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.88, 0.08), timberMat);
    sideBrace2.position.set(sx, wallY, 0);
    sideBrace2.rotation.x = -0.62;
    wallGroup.add(sideBrace2);
  });

  // Triangular Front & Back Gables
  const apexY = baseH + wallH + (width * 0.55);
  const gableH = width * 0.55;

  [-halfD + 0.06, halfD - 0.06].forEach((gz) => {
    const gable = new THREE.Mesh(
      new THREE.ConeGeometry((width - 0.10) / 2, gableH, 4),
      plankMat
    );
    gable.position.set(0, baseH + wallH + gableH / 2, gz);
    gable.rotation.y = Math.PI / 4;
    gable.scale.set(1.0, 1.0, 0.05);
    wallGroup.add(gable);
  });

  // ==========================================
  // 3. NORDIC CROSSED-GABLE ROOF (Reference Image!)
  // ==========================================
  const roofGroup = new THREE.Group();
  const roofApexY = baseH + wallH + gableH;

  // ICONIC NORDIC CROSSED BEAMS ON FRONT & REAR GABLES (The hallmark of the reference photo!)
  [-halfD - 0.02, halfD + 0.02].forEach((fz) => {
    const crossLeft = new THREE.Mesh(new THREE.BoxGeometry(0.11, gableH * 1.55, 0.12), timberMat);
    crossLeft.position.set(-0.20, baseH + wallH + gableH * 0.55, fz);
    crossLeft.rotation.z = -0.78;
    crossLeft.castShadow = true;
    roofGroup.add(crossLeft);

    const crossRight = new THREE.Mesh(new THREE.BoxGeometry(0.11, gableH * 1.55, 0.12), timberMat);
    crossRight.position.set(0.20, baseH + wallH + gableH * 0.55, fz);
    crossRight.rotation.z = 0.78;
    crossRight.castShadow = true;
    roofGroup.add(crossRight);

    // Horizontal Collar Tie Beam on Gable Peak
    const collarTie = new THREE.Mesh(new THREE.BoxGeometry(width * 0.65, 0.09, 0.12), timberMat);
    collarTie.position.set(0, baseH + wallH + gableH * 0.42, fz);
    roofGroup.add(collarTie);
  });

  // Ridge Beam (Cumbrera corrida)
  const ridgeBeam = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, depth + 0.45), darkTimberMat);
  ridgeBeam.position.set(0, roofApexY + 0.02, 0);
  roofGroup.add(ridgeBeam);

  // Multi-tiered Overlapping Wooden Shake Shingle Roof Slabs (Layered 3D tejas escalonadas)
  const shingleLayers = 4;
  const slopeLength = Math.hypot(width / 2 + 0.15, gableH);

  for (let side of [-1, 1]) {
    for (let layer = 0; layer < shingleLayers; layer++) {
      const frac = layer / (shingleLayers - 1);
      const layerW = slopeLength / shingleLayers + 0.08;
      const layerThick = 0.05;
      const layerLength = depth + 0.35 + (layer === 0 ? 0.08 : 0);

      const shingleSlab = new THREE.Mesh(
        new THREE.BoxGeometry(layerW, layerThick, layerLength),
        roofMat
      );

      const posX = side * ((width / 2 + 0.12) * (1 - frac * 0.85));
      const posY = (baseH + wallH - 0.04) + frac * (gableH + 0.02);
      const rotZ = side * -0.78;

      shingleSlab.position.set(posX, posY, 0);
      shingleSlab.rotation.z = rotZ;
      shingleSlab.castShadow = true;
      roofGroup.add(shingleSlab);

      // Staggered individual shake detail blocks
      if (layer % 2 === 0) {
        const detailShake = new THREE.Mesh(
          new THREE.BoxGeometry(layerW * 0.35, 0.06, layerLength * 0.3),
          darkTimberMat
        );
        detailShake.position.set(posX, posY + 0.02, (layer % 2 === 0 ? 0.2 : -0.2));
        detailShake.rotation.z = rotZ;
        roofGroup.add(detailShake);
      }
    }
  }

  // ==========================================
  // 4. SIDE STONE CHIMNEY WITH SMOKE (Reference Image)
  // ==========================================
  let updateAnimation: ((time: number) => void) | undefined;

  if (hasChimney) {
    const chimneyGroup = new THREE.Group();
    const chimX = -halfW - 0.14; // Adjoined to left wall like in reference photo
    const chimZ = -0.15;

    // Massive Stone Chimney Base
    const chimBase = new THREE.Mesh(new THREE.BoxGeometry(0.38, baseH + wallH * 0.65, 0.38), darkStoneMat);
    chimBase.position.set(chimX, (baseH + wallH * 0.65) / 2, chimZ);
    chimBase.castShadow = true;
    chimneyGroup.add(chimBase);

    // Tapered Upper Stone Stack
    const chimStackH = roofApexY - (baseH + wallH * 0.5) + 0.45;
    const chimStack = new THREE.Mesh(new THREE.BoxGeometry(0.30, chimStackH, 0.30), stoneMat);
    chimStack.position.set(chimX, (baseH + wallH * 0.65) + chimStackH / 2, chimZ);
    chimStack.castShadow = true;
    chimneyGroup.add(chimStack);

    // Stone Chimney Crown / Cap
    const chimCap = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.36), darkStoneMat);
    chimCap.position.set(chimX, (baseH + wallH * 0.65) + chimStackH + 0.04, chimZ);
    chimneyGroup.add(chimCap);

    // Animated Smoke Puffs
    const smokeMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.45 });
    const smokeGroup = new THREE.Group();
    const smokeStartY = (baseH + wallH * 0.65) + chimStackH + 0.12;
    smokeGroup.position.set(chimX, smokeStartY, chimZ);

    const puffs: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.09 + i * 0.04, 6, 6), smokeMat);
      puff.position.y = i * 0.22;
      smokeGroup.add(puff);
      puffs.push(puff);
    }
    chimneyGroup.add(smokeGroup);

    updateAnimation = (time: number) => {
      puffs.forEach((puff, idx) => {
        puff.position.y = ((time * 0.55 + idx * 0.35) % 0.95);
        puff.position.x = Math.sin(time * 1.5 + idx) * 0.07;
        puff.position.z = Math.cos(time * 1.2 + idx) * 0.05;
        const scale = 0.6 + puff.position.y * 0.9;
        puff.scale.setScalar(scale);
      });
    };

    group.add(chimneyGroup);
  }

  // ==========================================
  // 5. RUSTIC WOODEN DOOR & WINDOWS (Reference Image)
  // ==========================================
  const detailGroup = new THREE.Group();

  // Open / Ajar Heavy Wood Plank Door (Matching open door in photo!)
  const doorW = 0.38;
  const doorH = 0.62;
  const doorGroup = new THREE.Group();
  doorGroup.position.set(0.02, baseH + 0.04, halfD - 0.02);

  const doorPlanks = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH, 0.04), plankMat);
  doorPlanks.position.set(doorW / 2, doorH / 2, 0);
  doorGroup.add(doorPlanks);

  // Diagonal Z-Brace on Door
  const zBrace1 = new THREE.Mesh(new THREE.BoxGeometry(doorW * 0.9, 0.04, 0.05), timberMat);
  zBrace1.position.set(doorW / 2, doorH * 0.2, 0.01);
  doorGroup.add(zBrace1);

  const zBrace2 = new THREE.Mesh(new THREE.BoxGeometry(doorW * 0.9, 0.04, 0.05), timberMat);
  zBrace2.position.set(doorW / 2, doorH * 0.8, 0.01);
  doorGroup.add(zBrace2);

  const zDiag = new THREE.Mesh(new THREE.BoxGeometry(0.04, doorH * 0.85, 0.05), timberMat);
  zDiag.position.set(doorW / 2, doorH * 0.5, 0.01);
  zDiag.rotation.z = -0.65;
  doorGroup.add(zDiag);

  // Rotate door ajar (swing outward slightly like in photo)
  doorGroup.rotation.y = -0.55;
  doorGroup.castShadow = true;
  detailGroup.add(doorGroup);

  // Dark Interior Doorway Void
  const doorVoid = new THREE.Mesh(
    new THREE.BoxGeometry(doorW + 0.06, doorH + 0.04, 0.08),
    new THREE.MeshBasicMaterial({ color: 0x181008 })
  );
  doorVoid.position.set(0.18, baseH + doorH / 2 + 0.02, halfD - 0.08);
  detailGroup.add(doorVoid);

  // Front Window Frame with Mullion (Matching window to the left of the door)
  const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.06), timberMat);
  winFrame.position.set(-0.35, baseH + 0.44, halfD - 0.03);
  detailGroup.add(winFrame);

  const winGlass = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.02), windowGlowMat);
  winGlass.position.set(-0.35, baseH + 0.44, halfD - 0.02);
  detailGroup.add(winGlass);

  // Side Window
  const sideWin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 0.28), timberMat);
  sideWin.position.set(halfW - 0.03, baseH + 0.44, 0);
  detailGroup.add(sideWin);

  const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.22, 0.22), windowGlowMat);
  sideGlass.position.set(halfW - 0.02, baseH + 0.44, 0);
  detailGroup.add(sideGlass);

  group.add(wallGroup);
  group.add(roofGroup);
  group.add(detailGroup);

  return { group, updateAnimation };
}

/**
 * Creates an animated Windmill with rotating sails
 */
export function createLowPolyWindmill(): BuildingMeshResult {
  const group = new THREE.Group();

  const stoneTex = createProceduralStoneBrickTexture('grey');
  const woodTex = createProceduralWoodPlankTexture('oak');
  const roofTex = createProceduralRoofShinglesTexture('wood');

  const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, color: 0xffffff, roughness: 0.85 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, 0.7, 12), stoneMat);
  base.position.y = 0.35;
  base.castShadow = true;
  group.add(base);

  const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, color: 0xffffff, roughness: 0.7 });
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.85, 1.4, 12), woodMat);
  tower.position.y = 1.4;
  tower.castShadow = true;
  group.add(tower);

  // Conical Shingle Roof
  const roofMat = new THREE.MeshStandardMaterial({ map: roofTex, color: 0xd97706, roughness: 0.65 });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.9, 12), roofMat);
  roof.position.y = 2.55;
  roof.castShadow = true;
  group.add(roof);

  // Rotating Sails Hub
  const sailGroup = new THREE.Group();
  sailGroup.position.set(0, 2.0, 0.72);

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.15, 10), woodMat);
  hub.rotation.x = Math.PI / 2;
  sailGroup.add(hub);

  const sailClothMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5, side: THREE.DoubleSide });
  const beamMat = new THREE.MeshStandardMaterial({ map: woodTex, color: 0x5c2b09, roughness: 0.7 });

  // 4 Windmill Blades
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const bladeGroup = new THREE.Group();
    bladeGroup.rotation.z = angle;

    const spar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.3, 0.04), beamMat);
    spar.position.y = 0.65;
    bladeGroup.add(spar);

    const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.9), sailClothMat);
    cloth.position.set(0.12, 0.75, 0.01);
    bladeGroup.add(cloth);

    sailGroup.add(bladeGroup);
  }

  group.add(sailGroup);

  const updateAnimation = (time: number) => {
    sailGroup.rotation.z = time * 0.8;
  };

  return { group, updateAnimation };
}

/**
 * Creates a charming Village Water Well / Town Square Fountain
 */
export function createLowPolyWaterWell(): BuildingMeshResult {
  const group = new THREE.Group();

  const stoneTex = createProceduralStoneBrickTexture('grey');
  const woodTex = createProceduralWoodPlankTexture('dark');
  const roofTex = createProceduralRoofShinglesTexture('terracotta');

  // Cobblestone Circular Wall
  const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, color: 0xffffff, roughness: 0.85 });
  const wellRim = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.70, 0.45, 16, 1, true), stoneMat);
  wellRim.position.y = 0.225;
  wellRim.castShadow = true;
  group.add(wellRim);

  // Water inside well
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.8,
  });
  const water = new THREE.Mesh(new THREE.CircleGeometry(0.60, 16), waterMat);
  water.position.y = 0.20;
  water.rotation.x = -Math.PI / 2;
  group.add(water);

  // Wooden Posts
  const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, color: 0xffffff, roughness: 0.7 });
  [-0.55, 0.55].forEach((px) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), woodMat);
    post.position.set(px, 0.65, 0);
    post.castShadow = true;
    group.add(post);
  });

  // Crossbeam & Pulley
  const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.08), woodMat);
  crossBeam.position.set(0, 1.05, 0);
  group.add(crossBeam);

  // Little Canopy Roof
  const roofMat = new THREE.MeshStandardMaterial({ map: roofTex, color: 0xffffff, roughness: 0.6 });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.45, 4), roofMat);
  roof.position.set(0, 1.25, 0);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  group.add(roof);

  // Bucket hanging from rope
  const bucketMat = new THREE.MeshStandardMaterial({ map: woodTex, color: 0xffffff, roughness: 0.7 });
  const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.08, 0.15, 10), bucketMat);
  bucket.position.set(0, 0.55, 0);
  group.add(bucket);

  return { group };
}

/**
 * Creates an Open Air Market Stall with striped canopy and wares
 */
export function createLowPolyMarketStall(type: 'weapons' | 'potions' | 'food' = 'weapons'): BuildingMeshResult {
  const group = new THREE.Group();

  const woodTex = createProceduralWoodPlankTexture('oak');
  const crateTex = createProceduralWoodenCrateTexture();
  const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, color: 0xffffff, roughness: 0.75 });

  // Table / Wooden Cart
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 0.8), woodMat);
  table.position.y = 0.225;
  table.castShadow = true;
  group.add(table);

  // Canopy Corner Posts
  [
    [-0.55, -0.35],
    [0.55, -0.35],
    [-0.55, 0.35],
    [0.55, 0.35],
  ].forEach(([px, pz]) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8), woodMat);
    post.position.set(px, 0.75, pz);
    group.add(post);
  });

  // Striped Canopy
  const canopyMat = new THREE.MeshStandardMaterial({
    color: type === 'weapons' ? 0xdc2626 : type === 'potions' ? 0x9333ea : 0x16a34a,
    roughness: 0.4,
    side: THREE.DoubleSide,
  });
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.10, 0.95), canopyMat);
  canopy.position.set(0, 1.30, 0);
  canopy.rotation.x = 0.1;
  canopy.castShadow = true;
  group.add(canopy);

  // Goods on Table (Crates, potion bottles, swords)
  const crateMat = new THREE.MeshStandardMaterial({ map: crateTex, color: 0xffffff, roughness: 0.75 });
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.3), crateMat);
  crate.position.set(-0.35, 0.55, 0);
  group.add(crate);

  const potionMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 1.2, roughness: 0.1 });
  const pot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), potionMat);
  pot.position.set(0.15, 0.52, 0.1);
  group.add(pot);

  const pot2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 1.2, roughness: 0.1 }));
  pot2.position.set(0.35, 0.52, -0.1);
  group.add(pot2);

  return { group };
}

/**
 * Creates Blacksmith Forge with Anvil, Hearth & Sparks
 */
export function createLowPolyForge(): BuildingMeshResult {
  const group = new THREE.Group();

  const stoneTex = createProceduralStoneBrickTexture('dark');
  const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, color: 0xffffff, roughness: 0.9 });
  const hearth = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.8), stoneMat);
  hearth.position.set(0, 0.35, 0);
  hearth.castShadow = true;
  group.add(hearth);

  // Glowing Ember Cavity
  const emberMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 2.5,
  });
  const embers = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.4), emberMat);
  embers.position.set(0, 0.45, 0.25);
  group.add(embers);

  // Blacksmith Anvil on Log
  const logMat = new THREE.MeshStandardMaterial({ color: 0x5c2b09 });
  const log = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.35, 8), logMat);
  log.position.set(-0.6, 0.175, 0.4);
  group.add(log);

  const anvilMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.3 });
  const anvil = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.14), anvilMat);
  anvil.position.set(-0.6, 0.42, 0.4);
  group.add(anvil);

  const updateAnimation = (time: number) => {
    emberMat.emissiveIntensity = 2.0 + Math.sin(time * 5) * 0.8;
  };

  return { group, updateAnimation };
}

/**
 * Creates Warm Street Lantern on Wooden Post
 */
export function createLowPolyStreetLamp(): BuildingMeshResult {
  const group = new THREE.Group();

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c2b09, roughness: 0.7 });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.4, 6), woodMat);
  post.position.y = 0.7;
  post.castShadow = true;
  group.add(post);

  // Iron Arm
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.04), ironMat);
  arm.position.set(0.12, 1.35, 0);
  group.add(arm);

  // Lantern Glass & Warm Glowing Light
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xf59e0b,
    emissiveIntensity: 2.0,
  });
  const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.20, 0.14), lampMat);
  lantern.position.set(0.25, 1.25, 0);
  group.add(lantern);

  return { group };
}

// ==========================================
// 5. REALISTIC 3D HUMAN NPC GENERATOR WITH ANIMATED 3D QUEST EXCLAMATION
// ==========================================

export interface HumanNPCMeshResult {
  group: THREE.Group;
  markerGroup: THREE.Group;
  updateAnimation: (time: number) => void;
}

/**
 * Creates a detailed stylized 3D Human NPC matching the player character's anatomical proportions
 * with distinct role-specific outfits, hairstyles, accessories, and a gleaming animated 3D quest exclamation marker (!)
 */
export function createHumanNPCMesh(
  avatarStyle: string,
  hasQuest: boolean = false,
  isQuestReady: boolean = false
): HumanNPCMeshResult {
  const group = new THREE.Group();
  group.scale.set(1.1, 1.1, 1.1);

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfed7aa,
    roughness: 0.38,
    metalness: 0.02,
  });

  const leatherPBRTex = createProceduralStitchedLeatherTexture();
  const goldPBRTex = createProceduralEngravedGoldTexture();
  const steelPBRTex = createProceduralSteelBladeTexture();

  const leatherMat = new THREE.MeshStandardMaterial({ map: leatherPBRTex, color: 0xffffff, roughness: 0.55 });
  const darkLeatherMat = new THREE.MeshStandardMaterial({ color: 0x3d1c06, roughness: 0.65 });
  const goldMat = new THREE.MeshStandardMaterial({ map: goldPBRTex, color: 0xffffff, metalness: 0.96, roughness: 0.16 });
  const steelMat = new THREE.MeshStandardMaterial({ map: steelPBRTex, color: 0xffffff, metalness: 0.94, roughness: 0.15 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.8 });

  // 1. Determine NPC Role Palette & Attire Details
  let tunicColor = 0x15803d;  // default elder green
  let hairColor = '#e2e8f0';   // elder white/silver
  let eyeColor = '#10b981';
  let isFemale = false;

  if (avatarStyle === 'blacksmith') {
    tunicColor = 0x451a03;    // dark leather apron
    hairColor = '#451a03';    // dark brown
    eyeColor = '#d97706';
  } else if (avatarStyle === 'alchemist') {
    tunicColor = 0x581c87;    // arcane purple
    hairColor = '#a855f7';
    eyeColor = '#c084fc';
    isFemale = true;
  } else if (avatarStyle === 'fisherman') {
    tunicColor = 0x0369a1;    // nautical blue
    hairColor = '#78350f';
    eyeColor = '#38bdf8';
  } else if (avatarStyle === 'scout') {
    tunicColor = 0xd97706;    // bardo / traveler amber
    hairColor = '#f59e0b';
    eyeColor = '#10b981';
  } else if (avatarStyle === 'knight') {
    tunicColor = 0x1e293b;    // royal knight navy
    hairColor = '#b91c1c';
    eyeColor = '#38bdf8';
  } else if (avatarStyle === 'wizard') {
    tunicColor = 0x312e81;    // druid indigo
    hairColor = '#94a3b8';
    eyeColor = '#a855f7';
  } else if (avatarStyle === 'elf') {
    tunicColor = 0x166534;    // ranger green
    hairColor = '#facc15';
    eyeColor = '#10b981';
    isFemale = true;
  } else if (avatarStyle === 'dwarf') {
    tunicColor = 0x854d0e;    // dwarf bronze
    hairColor = '#ea580c';
    eyeColor = '#f59e0b';
  }

  const outfitMat = new THREE.MeshStandardMaterial({
    color: tunicColor,
    roughness: 0.55,
    flatShading: true,
  });

  // 2. LEGS & BOOTS (Proportional anatomy)
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.10, 0.48, 0);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.10, 0.48, 0);

  [leftLeg, rightLeg].forEach((leg) => {
    // Pants / Tights
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.052, 0.44, 10), outfitMat);
    thigh.position.y = -0.21;
    thigh.castShadow = true;
    leg.add(thigh);

    // Leather Boots
    const bootCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.18, 10), leatherMat);
    bootCuff.position.y = -0.32;
    bootCuff.castShadow = true;
    leg.add(bootCuff);

    const bootFoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.10, 0.18), leatherMat);
    bootFoot.position.set(0, -0.42, 0.03);
    bootFoot.castShadow = true;
    leg.add(bootFoot);

    group.add(leg);
  });

  // 3. TORSO & TUNIC / APPERAL
  const torsoGroup = new THREE.Group();
  torsoGroup.position.y = 0.70;

  const chest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.12, 0.38, 10),
    outfitMat
  );
  chest.scale.set(1.15, 1.0, 0.95);
  chest.position.y = 0.06;
  chest.castShadow = true;
  torsoGroup.add(chest);

  // Stitched Leather Belt with Buckle
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.05, 12), darkLeatherMat);
  belt.position.y = -0.06;
  torsoGroup.add(belt);

  const buckle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 12), goldMat);
  buckle.position.set(0, -0.06, 0.14);
  buckle.rotation.x = Math.PI / 2;
  torsoGroup.add(buckle);

  // Robe Flap / Apron / Skirt
  if (avatarStyle === 'elder' || avatarStyle === 'wizard') {
    // Long Mystic Scholar Robe
    const longRobe = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.28, 0.55, 10), outfitMat);
    longRobe.position.y = -0.28;
    longRobe.castShadow = true;
    torsoGroup.add(longRobe);
  } else if (avatarStyle === 'blacksmith') {
    // Leather Forging Apron
    const apron = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.42, 0.03), darkLeatherMat);
    apron.position.set(0, -0.08, 0.12);
    torsoGroup.add(apron);
  } else if (avatarStyle === 'knight') {
    // Knight Pauldrons
    [-0.18, 0.18].forEach((px) => {
      const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), steelMat);
      pauldron.position.set(px, 0.18, 0);
      pauldron.scale.set(1.2, 0.7, 1.0);
      torsoGroup.add(pauldron);
    });
  } else {
    // Standard Tunic Peplum
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.22, 0.18, 10, 1, true), outfitMat);
    skirt.position.y = -0.15;
    skirt.castShadow = true;
    torsoGroup.add(skirt);
  }

  group.add(torsoGroup);

  // 4. HEAD, FACE & HAIR
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.15;

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.075, 0.14, 8), skinMat);
  neck.position.y = -0.15;
  headGroup.add(neck);

  const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.20, 24, 24), skinMat);
  headBase.scale.set(0.95, 1.05, 0.95);
  headBase.castShadow = true;
  headGroup.add(headBase);

  // Elf ears for Elf NPC
  if (avatarStyle === 'elf') {
    [-0.19, 0.19].forEach((ex) => {
      const earGroup = new THREE.Group();
      earGroup.position.set(ex, 0.02, -0.03);
      earGroup.rotation.y = ex > 0 ? 0.35 : -0.35;
      earGroup.rotation.z = ex > 0 ? -0.85 : 0.85;
      earGroup.rotation.x = -0.2;

      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.19, 6), skinMat);
      ear.scale.set(0.9, 1.2, 0.35);
      earGroup.add(ear);
      headGroup.add(earGroup);
    });
  }

  // Button Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.023, 8, 8), skinMat);
  nose.position.set(0, -0.02, 0.20);
  headGroup.add(nose);

  // Facial Decal Texture
  const faceTex = createChibiAnimeFaceTexture(eyeColor, hairColor, 'confident', isFemale);
  const faceDecal = new THREE.Mesh(
    new THREE.PlaneGeometry(0.30, 0.30),
    new THREE.MeshBasicMaterial({ map: faceTex, transparent: true, depthWrite: false })
  );
  faceDecal.position.set(0, 0.01, 0.192);
  headGroup.add(faceDecal);

  // Role Hair / Hats / Beard
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.6 });

  if (avatarStyle === 'elder') {
    // Elder White Hair & Beard
    const hairDome = new THREE.Mesh(new THREE.SphereGeometry(0.21, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), hairMat);
    hairDome.position.set(0, 0.03, -0.02);
    headGroup.add(hairDome);

    // Long Flowing White Beard
    const beard = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.38, 6), hairMat);
    beard.position.set(0, -0.16, 0.14);
    beard.rotation.x = 0.15;
    headGroup.add(beard);
  } else if (avatarStyle === 'wizard') {
    // Wizard Pointed Hat with Golden Band
    const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.03, 16), outfitMat);
    hatBrim.position.set(0, 0.14, 0);
    headGroup.add(hatBrim);

    const hatCone = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.45, 10), outfitMat);
    hatCone.position.set(0, 0.36, -0.04);
    hatCone.rotation.x = -0.15;
    headGroup.add(hatCone);
  } else if (avatarStyle === 'fisherman') {
    // Straw Sun Hat
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
    const hat = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.14, 16), strawMat);
    hat.position.set(0, 0.18, 0);
    headGroup.add(hat);
  } else if (avatarStyle === 'knight') {
    // Steel Brow Circlet / Open Armet
    const circlet = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.025, 6, 20), steelMat);
    circlet.position.set(0, 0.08, 0);
    circlet.rotation.x = Math.PI / 2;
    headGroup.add(circlet);
  } else {
    // Casual stylized hair dome
    const hairDome = new THREE.Mesh(new THREE.SphereGeometry(0.21, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.65), hairMat);
    hairDome.position.set(0, 0.03, -0.02);
    headGroup.add(hairDome);
  }

  group.add(headGroup);

  // 5. ARMS & ROLE TOOLS / ACCESSORIES
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.21, 0.82, 0);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.21, 0.82, 0);

  [leftArm, rightArm].forEach((arm) => {
    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.042, 0.24, 8), outfitMat);
    bicep.position.y = -0.10;
    bicep.castShadow = true;
    arm.add(bicep);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 8), skinMat);
    hand.position.y = -0.25;
    arm.add(hand);

    group.add(arm);
  });

  // Attach tool in hand based on role
  if (avatarStyle === 'elder') {
    // Walking Staff
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 1.25, 6), woodMat);
    staff.position.set(0, 0.25, 0.10);
    rightArm.add(staff);
  } else if (avatarStyle === 'blacksmith') {
    // Forging Hammer
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), woodMat);
    handle.position.set(0, 0.05, 0.08);
    const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.10), steelMat);
    hammerHead.position.set(0, 0.28, 0.08);
    rightArm.add(handle);
    rightArm.add(hammerHead);
  } else if (avatarStyle === 'alchemist') {
    // Arcane Potion Flask
    const potion = createLowPolyPotionMesh('mp');
    potion.scale.set(0.65, 0.65, 0.65);
    potion.position.set(0, -0.22, 0.08);
    rightArm.add(potion);
  } else if (avatarStyle === 'fisherman') {
    // Bamboo Fishing Pole
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.025, 1.4, 6), woodMat);
    rod.position.set(0, 0.35, 0.15);
    rod.rotation.x = 0.3;
    rightArm.add(rod);
  }

  // ==========================================
  // 6. PROMINENT ANIMATED 3D FLOATING QUEST EXCLAMATION MARK (!)
  // ==========================================
  const markerGroup = new THREE.Group();
  markerGroup.position.set(0, 2.35, 0);

  let haloRing: THREE.Mesh | null = null;

  if (hasQuest || isQuestReady) {
    // Quest marker color scheme: Radiant Golden Amber for available quests, Emerald Green if ready to turn in
    const markerColor = isQuestReady ? 0x22c55e : 0xffd700;
    const markerEmissive = isQuestReady ? 0x15803d : 0xd97706;

    const markerMat = new THREE.MeshStandardMaterial({
      color: markerColor,
      emissive: markerEmissive,
      emissiveIntensity: 3.8,
      metalness: 0.3,
      roughness: 0.1,
    });

    // 3D Exclamation Stalk (Prominent tapered faceted column)
    const exclStalk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.08, 0.65, 8), markerMat);
    exclStalk.position.y = 0.38;
    markerGroup.add(exclStalk);

    // 3D Exclamation Dot
    const exclDot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), markerMat);
    exclDot.position.y = -0.10;
    markerGroup.add(exclDot);

    // Radiant Glowing Halo Ring around the exclamation
    haloRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.035, 8, 24),
      new THREE.MeshStandardMaterial({
        color: markerColor,
        emissive: markerEmissive,
        emissiveIntensity: 3.2,
        transparent: true,
        opacity: 0.9,
      })
    );
    haloRing.position.y = 0.22;
    haloRing.rotation.x = Math.PI / 2;
    markerGroup.add(haloRing);

    group.add(markerGroup);

    // Ground Interaction Aura Ring (At the NPC's feet)
    const auraRing = new THREE.Mesh(
      new THREE.RingGeometry(0.65, 0.85, 32),
      new THREE.MeshBasicMaterial({
        color: markerColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      })
    );
    auraRing.rotation.x = -Math.PI / 2;
    auraRing.position.y = 0.02;
    group.add(auraRing);
  }

  // Animation Updater Loop for NPC Breathing & Exclamation Bobbing/Spinning
  const updateAnimation = (time: number) => {
    // Floating exclamation mark bobbing up and down + rotating
    if (hasQuest || isQuestReady) {
      markerGroup.position.y = 2.35 + Math.sin(time * 3.5) * 0.12;
      markerGroup.rotation.y = time * 2.0;
      if (haloRing) haloRing.rotation.z = time * 2.8;
    }

    // Breathing posture
    torsoGroup.position.y = 0.70 + Math.sin(time * 2.5) * 0.012;
    headGroup.position.y = 1.15 + Math.sin(time * 2.5) * 0.015;
    rightArm.rotation.x = Math.sin(time * 2.0) * 0.05;
    leftArm.rotation.x = -Math.sin(time * 2.0) * 0.05;
  };

  return { group, markerGroup, updateAnimation };
}

// ==========================================
// 6. DWARVEN DUNGEON ARCHITECTURAL 3D MESH GENERATORS (Reference Image Aesthetic)
// ==========================================

export interface DungeonWallMeshResult {
  group: THREE.Group;
  updateAnimation?: (time: number) => void;
}

/**
 * Creates a monolithic carved stone dungeon wall block with recessed gothic/roman archways,
 * stone crenellations, and an animated flickering wall sconce torch with warm amber PointLight
 */
export function create3DDungeonStoneWallMesh(
  x: number,
  y: number,
  hasTorch: boolean = false
): DungeonWallMeshResult {
  const group = new THREE.Group();

  const stoneDarkMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.85,
    flatShading: true,
  });

  const stoneLightMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.78,
    flatShading: true,
  });

  const stoneTrimMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.9,
    flatShading: true,
  });

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.85,
    roughness: 0.3,
  });

  // 1. Main Solid Stone Block (Wall Body)
  const wallH = 2.25;
  const wallW = 2.48;
  const wallD = 2.48;

  const mainWall = new THREE.Mesh(new THREE.BoxGeometry(wallW, wallH, wallD), stoneDarkMat);
  mainWall.position.y = wallH / 2;
  mainWall.castShadow = true;
  mainWall.receiveShadow = true;
  group.add(mainWall);

  // 2. Heavy Foundation Base Trim
  const baseTrim = new THREE.Mesh(new THREE.BoxGeometry(wallW + 0.12, 0.35, wallD + 0.12), stoneTrimMat);
  baseTrim.position.y = 0.175;
  baseTrim.castShadow = true;
  baseTrim.receiveShadow = true;
  group.add(baseTrim);

  // 3. Top Parapet & Battlements / Crenellations
  const topCoping = new THREE.Mesh(new THREE.BoxGeometry(wallW + 0.08, 0.16, wallD + 0.08), stoneLightMat);
  topCoping.position.y = wallH + 0.08;
  topCoping.castShadow = true;
  group.add(topCoping);

  // 4 Corner Crenellation Blocks
  const crenSize = 0.55;
  const halfW = wallW / 2;
  const halfD = wallD / 2;
  [
    [-halfW + crenSize / 2, -halfD + crenSize / 2],
    [halfW - crenSize / 2, -halfD + crenSize / 2],
    [-halfW + crenSize / 2, halfD - crenSize / 2],
    [halfW - crenSize / 2, halfD - crenSize / 2],
  ].forEach(([cx, cz]) => {
    const cren = new THREE.Mesh(new THREE.BoxGeometry(crenSize, 0.45, crenSize), stoneDarkMat);
    cren.position.set(cx, wallH + 0.35, cz);
    cren.castShadow = true;
    group.add(cren);
  });

  // 4. Carved Recessed Archway on Front Face (Matching the reference photo!)
  const archGroup = new THREE.Group();
  archGroup.position.set(0, 1.05, halfD + 0.01);

  // Recessed Dark Alcove Void
  const alcoveVoid = new THREE.Mesh(
    new THREE.PlaneGeometry(1.25, 1.45),
    new THREE.MeshBasicMaterial({ color: 0x090d16 })
  );
  alcoveVoid.position.set(0, 0, 0);
  archGroup.add(alcoveVoid);

  // Left & Right Stone Arch Pillars
  [-0.68, 0.68].forEach((px) => {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.45, 0.16), stoneLightMat);
    pillar.position.set(px, 0, 0.08);
    pillar.castShadow = true;
    archGroup.add(pillar);

    // Pillar Capital
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.10, 0.20), stoneTrimMat);
    cap.position.set(px, 0.72, 0.08);
    archGroup.add(cap);
  });

  // Arched Stone Lintel / Keystone
  const archTop = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.18, 12, 1, false, 0, Math.PI), stoneLightMat);
  archTop.rotation.z = Math.PI;
  archTop.rotation.y = Math.PI / 2;
  archTop.position.set(0, 0.72, 0.08);
  archGroup.add(archTop);

  // Central Keystone Block
  const keystone = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.22), stoneTrimMat);
  keystone.position.set(0, 1.35, 0.09);
  archGroup.add(keystone);

  group.add(archGroup);

  // 5. Animated Flickering Wall Sconce Torch (Torchlight in Alcove)
  let updateAnimation: ((time: number) => void) | undefined;

  if (hasTorch) {
    const torchGroup = new THREE.Group();
    torchGroup.position.set(0, 1.35, halfD + 0.15);

    // Iron Sconce Bracket
    const bracketH = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.22), ironMat);
    bracketH.position.set(0, 0, 0.08);
    torchGroup.add(bracketH);

    const bracketV = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.32, 6), ironMat);
    bracketV.position.set(0, 0.12, 0.18);
    torchGroup.add(bracketV);

    // Burning Flame Mesh with Glowing Emissive
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      emissive: 0xf59e0b,
      emissiveIntensity: 3.5,
      roughness: 0.1,
    });
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.24, 6), flameMat);
    flame.position.set(0, 0.32, 0.18);
    torchGroup.add(flame);

    const flameCoreMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
    const flameCore = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 6), flameCoreMat);
    flameCore.position.set(0, 0.30, 0.18);
    torchGroup.add(flameCore);

    group.add(torchGroup);

    const seed = Math.abs(x * 13 + y * 29);
    updateAnimation = (time: number) => {
      flame.scale.y = 1.0 + Math.sin(time * 15 + seed) * 0.25;
      flame.scale.x = 1.0 + Math.cos(time * 18 + seed) * 0.2;
    };
  }

  return { group, updateAnimation };
}

/**
 * Creates the iconic flooded subterranean turquoise grotto water pool with carved stone rim
 */
export function create3DTurquoiseGrottoMesh(x: number, y: number): { group: THREE.Group; updateAnimation?: (time: number) => void } {
  const group = new THREE.Group();

  const stoneBorderMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.75,
    flatShading: true,
  });

  // Sunken Pit Floor
  const pitFloor = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.15, 2.5),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 })
  );
  pitFloor.position.y = -0.55;
  group.add(pitFloor);

  // Turquoise Translucent Cavern Water Siphon
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x0891b2,
    emissiveIntensity: 0.65,
    roughness: 0.1,
    metalness: 0.2,
  });

  const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(2.48, 0.45, 2.48), waterMat);
  waterMesh.position.y = -0.22;
  waterMesh.receiveShadow = true;
  group.add(waterMesh);

  // Carved Stone Coping Curbing on edges
  const curbH = 0.22;
  const curbThick = 0.16;
  const topCurb = new THREE.Mesh(new THREE.BoxGeometry(2.52, curbH, curbThick), stoneBorderMat);
  topCurb.position.set(0, -0.05, -1.22);
  topCurb.castShadow = true;
  group.add(topCurb);

  const botCurb = new THREE.Mesh(new THREE.BoxGeometry(2.52, curbH, curbThick), stoneBorderMat);
  botCurb.position.set(0, -0.05, 1.22);
  botCurb.castShadow = true;
  group.add(botCurb);

  // Stalagmite Spire emerging from the water in some tiles
  if ((x + y) % 3 === 0) {
    const stalagMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const stalag = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.85, 6), stalagMat);
    stalag.position.set(0.35, 0.12, -0.25);
    stalag.castShadow = true;
    group.add(stalag);
  }

  const updateAnimation = (time: number) => {
    waterMesh.position.y = -0.22 + Math.sin(time * 2.5 + (x + y)) * 0.03;
  };

  return { group, updateAnimation };
}

/**
 * Creates clusters of glowing subterranean amethyst & sapphire crystals
 */
export function create3DGlowingCrystalClusterMesh(x: number, y: number): THREE.Group {
  const group = new THREE.Group();

  const isSapphire = (x * 7 + y * 13) % 2 === 0;
  const crystalColor = isSapphire ? 0x38bdf8 : 0xc084fc;
  const emissiveColor = isSapphire ? 0x0284c7 : 0x9333ea;

  const crystalMat = new THREE.MeshStandardMaterial({
    color: crystalColor,
    emissive: emissiveColor,
    emissiveIntensity: 2.6,
    roughness: 0.15,
    metalness: 0.5,
  });

  const baseStone = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.35),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
  );
  baseStone.position.y = 0.12;
  baseStone.scale.set(1.4, 0.6, 1.2);
  group.add(baseStone);

  // 3 Sharp Crystal Shards
  const shard1 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.65, 5), crystalMat);
  shard1.position.set(-0.10, 0.42, 0.05);
  shard1.rotation.z = -0.25;
  shard1.castShadow = true;
  group.add(shard1);

  const shard2 = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.82, 5), crystalMat);
  shard2.position.set(0.08, 0.48, -0.05);
  shard2.rotation.z = 0.18;
  shard2.rotation.x = -0.15;
  shard2.castShadow = true;
  group.add(shard2);

  const shard3 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.48, 5), crystalMat);
  shard3.position.set(0.15, 0.32, 0.12);
  shard3.rotation.x = 0.35;
  group.add(shard3);

  return group;
}

/**
 * Creates a massive Dwarven Magma Forge & Anvil for tile 11 in caves
 */
export function create3DDwarvenForgeMesh(): { group: THREE.Group; updateAnimation?: (time: number) => void } {
  const group = new THREE.Group();

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
  const darkStoneMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
  const magmaMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 3.5,
    roughness: 0.2,
  });

  // Furnace Stone Hearth Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.85, 1.4), darkStoneMat);
  base.position.y = 0.425;
  base.castShadow = true;
  group.add(base);

  // Fiery Smelting Crucible Pit (Magma coals)
  const magmaPit = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.8), magmaMat);
  magmaPit.position.set(0, 0.85, 0);
  group.add(magmaPit);

  // Stone Chimney Hood
  const hood = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.2, 4), stoneMat);
  hood.position.set(0, 1.75, 0);
  hood.rotation.y = Math.PI / 4;
  hood.castShadow = true;
  group.add(hood);

  // Heavy Iron Anvil on Tree Stump Base
  const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.45, 8), darkStoneMat);
  stump.position.set(0.65, 0.225, 0.75);
  group.add(stump);

  const anvil = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.55), ironMat);
  anvil.position.set(0.65, 0.52, 0.75);
  anvil.castShadow = true;
  group.add(anvil);

  const anvilHorn = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.28, 6), ironMat);
  anvilHorn.rotation.x = Math.PI / 2;
  anvilHorn.position.set(0.65, 0.55, 1.08);
  group.add(anvilHorn);

  const updateAnimation = (time: number) => {
    magmaPit.scale.y = 1.0 + Math.sin(time * 6.0) * 0.1;
  };

  return { group, updateAnimation };
}

/**
 * Creates monolithic jagged Volcanic Basalt Crags & Spire walls (tile 1 in Volcano)
 * with option for erupting volcanic fumarola/geyser with animated flame column
 */
export function create3DVolcanicBasaltSpireMesh(
  x: number,
  y: number,
  hasGeyser: boolean = false
): { group: THREE.Group; updateAnimation?: (time: number) => void } {
  const group = new THREE.Group();

  const basaltDarkMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.92,
    flatShading: true,
  });

  const basaltHighlightMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.85,
    flatShading: true,
  });

  const magmaVeinMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 2.8,
    roughness: 0.2,
  });

  // 1. Monolithic Basalt Pillar Base
  const baseH = 2.4;
  const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, baseH, 7), basaltDarkMat);
  baseMesh.position.y = baseH / 2;
  baseMesh.rotation.y = (x * 7 + y * 13) % Math.PI;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // 2. Jagged Spire Shards on Top
  const topSpire = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.4, 6), basaltHighlightMat);
  topSpire.position.y = baseH + 0.6;
  topSpire.rotation.y = (x * 11 + y * 5) % Math.PI;
  topSpire.castShadow = true;
  group.add(topSpire);

  // Glowing Magma Fissure Veins on Sides
  [-0.65, 0.65].forEach((offset) => {
    const vein = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.12), magmaVeinMat);
    vein.position.set(offset, 1.1, (x % 2 === 0 ? 0.95 : -0.95));
    group.add(vein);
  });

  let updateAnimation: ((time: number) => void) | undefined;

  // 3. Optional Erupting Magma Geyser / Flaming Crater Chimney (Matching Reference Photo!)
  if (hasGeyser) {
    const ventCrater = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.42, 0.45, 8, 1, true),
      basaltDarkMat
    );
    ventCrater.position.set(0, baseH + 0.2, 0);
    group.add(ventCrater);

    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xf97316,
      emissiveIntensity: 4.0,
      roughness: 0.1,
    });
    const flameMesh = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.6, 7), flameMat);
    flameMesh.position.set(0, baseH + 0.9, 0);
    group.add(flameMesh);

    const innerCore = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 1.1, 7),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    innerCore.position.set(0, baseH + 0.75, 0);
    group.add(innerCore);

    const seed = Math.abs(x * 17 + y * 31);
    updateAnimation = (time: number) => {
      const pulse = Math.sin(time * 14 + seed) * 0.25 + Math.cos(time * 22 + seed) * 0.15;
      flameMesh.scale.y = 1.0 + pulse;
      flameMesh.scale.x = 1.0 + Math.sin(time * 18 + seed) * 0.15;
      flameMesh.scale.z = 1.0 + Math.cos(time * 18 + seed) * 0.15;
    };
  }

  return { group, updateAnimation };
}

/**
 * Creates glowing molten magma rivers with pulsing heat waves & basalt rim (tile 3 in Volcano)
 */
export function create3DLavaRiverTileMesh(x: number, y: number): { group: THREE.Group; updateAnimation?: (time: number) => void } {
  const group = new THREE.Group();

  const lavaMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 2.8,
    roughness: 0.15,
    metalness: 0.1,
  });

  const lavaMesh = new THREE.Mesh(new THREE.BoxGeometry(2.48, 0.45, 2.48), lavaMat);
  lavaMesh.position.y = -0.22;
  lavaMesh.receiveShadow = true;
  group.add(lavaMesh);

  // Floating dark obsidian crust flakes
  if ((x + y) % 2 === 0) {
    const crustMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95 });
    const crust1 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.55), crustMat);
    crust1.position.set(-0.35, -0.01, 0.3);
    group.add(crust1);

    const crust2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.4), crustMat);
    crust2.position.set(0.4, -0.01, -0.35);
    group.add(crust2);
  }

  const updateAnimation = (time: number) => {
    lavaMesh.position.y = -0.22 + Math.sin(time * 3.0 + (x + y)) * 0.035;
  };

  return { group, updateAnimation };
}

/**
 * Creates glowing ruby & magma crystal shards for Volcano
 */
export function create3DVolcanicRubyCrystalMesh(x: number, y: number): THREE.Group {
  const group = new THREE.Group();

  const rubyMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 2.8,
    roughness: 0.15,
    metalness: 0.6,
  });

  const baseStone = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.35),
    new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 })
  );
  baseStone.position.y = 0.12;
  baseStone.scale.set(1.4, 0.6, 1.2);
  group.add(baseStone);

  const shard1 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.75, 5), rubyMat);
  shard1.position.set(-0.10, 0.45, 0.05);
  shard1.rotation.z = -0.25;
  group.add(shard1);

  const shard2 = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.92, 5), rubyMat);
  shard2.position.set(0.08, 0.52, -0.05);
  shard2.rotation.z = 0.18;
  group.add(shard2);

  const shard3 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.55, 5), rubyMat);
  shard3.position.set(0.15, 0.35, 0.12);
  shard3.rotation.x = 0.35;
  group.add(shard3);

  return group;
}

/**
 * Creates massive Dragon Skull & Magma Crucible Forge for tile 11 in Volcano
 */
export function create3DDragonForgeMesh(): { group: THREE.Group; updateAnimation?: (time: number) => void } {
  const group = new THREE.Group();

  const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3, metalness: 0.9 });
  const magmaMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 3.8,
    roughness: 0.15,
  });

  // Hearth Stone Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.9, 1.6), obsidianMat);
  base.position.y = 0.45;
  base.castShadow = true;
  group.add(base);

  // Molten Magma Core
  const magmaCore = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.25, 1.0), magmaMat);
  magmaCore.position.set(0, 0.92, 0);
  group.add(magmaCore);

  // Dragon Horn Chimneys
  [-0.6, 0.6].forEach((hx) => {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.6, 6), obsidianMat);
    horn.position.set(hx, 1.6, -0.3);
    horn.rotation.z = hx < 0 ? 0.3 : -0.3;
    horn.castShadow = true;
    group.add(horn);
  });

  const updateAnimation = (time: number) => {
    magmaCore.scale.y = 1.0 + Math.sin(time * 7.0) * 0.12;
  };

  return { group, updateAnimation };
}

/**
 * Creates monumental Circular Watchtower Rotundas with concentric stone parapet rings,
 * stairs, gothic buttress arches, and warm amber wall sconce lanterns (Matching Reference Photo!)
 */
export function create3DCastleRotundaTowerMesh(
  x: number,
  y: number
): { group: THREE.Group; updateAnimation?: (time: number) => void } {
  const group = new THREE.Group();

  const stoneMainMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.78,
    flatShading: true,
  });

  const stoneTrimMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.85,
    flatShading: true,
  });

  const stonePavingMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.7,
    flatShading: true,
  });

  const lanternGlowMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xf59e0b,
    emissiveIntensity: 3.8,
    roughness: 0.1,
  });

  // 1. Massive Circular Stone Base Cylinder
  const baseRadius = 1.25;
  const baseH = 1.4;
  const rotundaBase = new THREE.Mesh(new THREE.CylinderGeometry(baseRadius, baseRadius + 0.15, baseH, 16), stoneMainMat);
  rotundaBase.position.y = baseH / 2;
  rotundaBase.castShadow = true;
  rotundaBase.receiveShadow = true;
  group.add(rotundaBase);

  // 2. Heavy Molded Foundation Plinth
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(baseRadius + 0.22, baseRadius + 0.28, 0.35, 16), stoneTrimMat);
  plinth.position.y = 0.175;
  plinth.castShadow = true;
  group.add(plinth);

  // 3. Concentric Stone Parapet Rings on Upper Observation Deck
  const deckY = baseH + 0.05;
  const floorDisc = new THREE.Mesh(new THREE.CylinderGeometry(baseRadius, baseRadius, 0.12, 16), stonePavingMat);
  floorDisc.position.y = deckY;
  group.add(floorDisc);

  // Outer Raised Stone Parapet Wall Ring
  const outerRing = new THREE.Mesh(new THREE.CylinderGeometry(baseRadius + 0.08, baseRadius + 0.08, 0.45, 16, 1, true), stoneMainMat);
  outerRing.position.y = deckY + 0.225;
  outerRing.castShadow = true;
  group.add(outerRing);

  // Inner Concentric Carved Stone Ring
  const innerRing = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.25, 14, 1, true), stoneTrimMat);
  innerRing.position.y = deckY + 0.125;
  group.add(innerRing);

  // Center Emblem Medallion / Celestial Relic Disc
  const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.14, 12), stoneTrimMat);
  emblem.position.y = deckY + 0.06;
  group.add(emblem);

  // 4. Gothic Flying Buttress Arches radiating outward (4 Cardinal Directions)
  [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].forEach((angle) => {
    const buttress = new THREE.Mesh(new THREE.BoxGeometry(0.24, baseH + 0.2, 0.55), stoneTrimMat);
    buttress.position.set(Math.sin(angle) * (baseRadius + 0.15), (baseH + 0.2) / 2, Math.cos(angle) * (baseRadius + 0.15));
    buttress.rotation.y = angle;
    buttress.castShadow = true;
    group.add(buttress);

    // Warm Amber Lantern Sconce on Each Buttress
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 8), lanternGlowMat);
    lantern.position.set(Math.sin(angle) * (baseRadius + 0.42), 0.95, Math.cos(angle) * (baseRadius + 0.42));
    group.add(lantern);
  });

  // 5. Stone Steps leading down
  for (let s = 0; s < 4; s++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.18, 0.3), stoneTrimMat);
    step.position.set(0, 0.09 + s * 0.18, baseRadius + 0.2 + (3 - s) * 0.25);
    step.castShadow = true;
    group.add(step);
  }

  const seed = Math.abs(x * 19 + y * 37);
  const updateAnimation = (time: number) => {
    // Subtle ambient torch gleam pulse
    lanternGlowMat.emissiveIntensity = 3.8 + Math.sin(time * 6.0 + seed) * 0.4;
  };

  return { group, updateAnimation };
}

/**
 * Creates imperial grey stone fortress walls with gothic crenellations and balustrades (tile 1 in Castle)
 */
export function create3DCastleArchedWallMesh(
  x: number,
  y: number,
  isWatchtower: boolean = false
): { group: THREE.Group; updateAnimation?: (time: number) => void } {
  if (isWatchtower) {
    return create3DCastleRotundaTowerMesh(x, y);
  }

  const group = new THREE.Group();

  const stoneWallMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.8,
    flatShading: true,
  });

  const stoneCopingMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.75,
    flatShading: true,
  });

  const bannerMat = new THREE.MeshStandardMaterial({
    color: 0x7c3aed,
    emissive: 0x6d28d9,
    emissiveIntensity: 0.6,
    roughness: 0.4,
  });

  // Main Wall Body
  const wallH = 2.4;
  const wallW = 2.48;
  const wallD = 2.48;

  const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(wallW, wallH, wallD), stoneWallMat);
  wallMesh.position.y = wallH / 2;
  wallMesh.castShadow = true;
  wallMesh.receiveShadow = true;
  group.add(wallMesh);

  // Top Crenellations / Balustrade
  const coping = new THREE.Mesh(new THREE.BoxGeometry(wallW + 0.1, 0.16, wallD + 0.1), stoneCopingMat);
  coping.position.y = wallH + 0.08;
  coping.castShadow = true;
  group.add(coping);

  // Corner Merlon Blocks
  const merlonSize = 0.55;
  [
    [-wallW / 2 + merlonSize / 2, -wallD / 2 + merlonSize / 2],
    [wallW / 2 - merlonSize / 2, -wallD / 2 + merlonSize / 2],
    [-wallW / 2 + merlonSize / 2, wallD / 2 - merlonSize / 2],
    [wallW / 2 - merlonSize / 2, wallD / 2 - merlonSize / 2],
  ].forEach(([cx, cz]) => {
    const merlon = new THREE.Mesh(new THREE.BoxGeometry(merlonSize, 0.42, merlonSize), stoneWallMat);
    merlon.position.set(cx, wallH + 0.35, cz);
    merlon.castShadow = true;
    group.add(merlon);
  });

  // Royal Purple Banner hanging on front face
  if ((x + y) % 4 === 0) {
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.4), bannerMat);
    banner.position.set(0, 1.3, wallD / 2 + 0.02);
    group.add(banner);
  }

  return { group };
}

/**
 * Creates crystalline azure/turquoise cascade water with foaming white ripples and stone curbs (tile 3 in Castle)
 */
export function create3DCastleWaterfallRiverMesh(x: number, y: number): { group: THREE.Group; updateAnimation?: (time: number) => void } {
  const group = new THREE.Group();

  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.5,
    roughness: 0.1,
    metalness: 0.2,
  });

  const stoneRimMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.78,
    flatShading: true,
  });

  const waterMesh = new THREE.Mesh(new THREE.BoxGeometry(2.48, 0.45, 2.48), waterMat);
  waterMesh.position.y = -0.22;
  waterMesh.receiveShadow = true;
  group.add(waterMesh);

  // White Foaming Rapids Stripe
  const foamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 });
  const foam = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), foamMat);
  foam.rotation.x = -Math.PI / 2;
  foam.position.set(0, 0.02, 0);
  group.add(foam);

  // Stone Abutment Curbs on edges
  const curbTop = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.22, 0.18), stoneRimMat);
  curbTop.position.set(0, -0.05, -1.22);
  group.add(curbTop);

  const curbBot = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.22, 0.18), stoneRimMat);
  curbBot.position.set(0, -0.05, 1.22);
  group.add(curbBot);

  const updateAnimation = (time: number) => {
    waterMesh.position.y = -0.22 + Math.sin(time * 3.2 + (x + y)) * 0.03;
    foam.scale.x = 1.0 + Math.sin(time * 5.0 + x) * 0.15;
    foam.position.z = Math.sin(time * 4.0 + y) * 0.15;
  };

  return { group, updateAnimation };
}

/**
 * Creates glowing Celestite / Sunstone crystal formations on ancient stone plinths (tile 0 in Castle)
 */
export function create3DRoyalRelicCrystalMesh(x: number, y: number): THREE.Group {
  const group = new THREE.Group();

  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    emissive: 0x9333ea,
    emissiveIntensity: 2.8,
    roughness: 0.15,
    metalness: 0.6,
  });

  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.25, 0.65),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 })
  );
  plinth.position.y = 0.125;
  group.add(plinth);

  // 3 Sharp Celestial Amethyst Crystal Shards
  const shard1 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.85, 5), crystalMat);
  shard1.position.set(-0.10, 0.52, 0.05);
  shard1.rotation.z = -0.22;
  group.add(shard1);

  const shard2 = new THREE.Mesh(new THREE.ConeGeometry(0.10, 1.05, 5), crystalMat);
  shard2.position.set(0.08, 0.62, -0.05);
  shard2.rotation.z = 0.18;
  group.add(shard2);

  const shard3 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.65, 5), crystalMat);
  shard3.position.set(0.15, 0.42, 0.12);
  shard3.rotation.x = 0.32;
  group.add(shard3);

  return group;
}

/**
 * Creates the Imperial Royal Blacksmith Forge with gold-trimmed anvil and azure flame crucible (tile 11 in Castle)
 */
export function create3DRoyalForgeMesh(): { group: THREE.Group; updateAnimation?: (time: number) => void } {
  const group = new THREE.Group();

  const marbleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 });
  const darkStoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
  const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
  const azureFlameMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 3.8,
    roughness: 0.15,
  });

  // Hearth Marble Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.9, 1.6), marbleMat);
  base.position.y = 0.45;
  base.castShadow = true;
  group.add(base);

  // Azure Magic Flame Crucible
  const crucible = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.25, 0.9), azureFlameMat);
  crucible.position.set(0, 0.92, 0);
  group.add(crucible);

  // Gold Trim Hearth Border
  const trim = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.12, 1.68), goldTrimMat);
  trim.position.y = 0.92;
  group.add(trim);

  // Imperial Anvil on Marble Plinth
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.45, 8), darkStoneMat);
  plinth.position.set(0.7, 0.225, 0.75);
  group.add(plinth);

  const anvil = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.25, 0.6), goldTrimMat);
  anvil.position.set(0.7, 0.55, 0.75);
  anvil.castShadow = true;
  group.add(anvil);

  const updateAnimation = (time: number) => {
    crucible.scale.y = 1.0 + Math.sin(time * 6.5) * 0.12;
  };

  return { group, updateAnimation };
}

// ==========================================
// 7. STYLIZED TREASURE CHEST MESH GENERATOR (Matching Reference Image)
// ==========================================

export interface ChestMeshResult {
  group: THREE.Group;
  lidGroup: THREE.Group;
  updateAnimation?: (time: number) => void;
}

/**
 * Creates an authentic Stylized RPG Treasure Chest matching the user's reference image:
 * - Rich warm amber-orange wood body with plank grooves
 * - Barrel-vaulted arched lid with top iron handle
 * - Heavy chiseled iron frame with corner brackets and silver hexagonal rivets
 * - Chunky shield-shaped front padlock with keyhole
 * - Sparkling gold coins, jewels & light beams when opened
 */
export function createStylizedChestMesh(isOpened: boolean = false): ChestMeshResult {
  const group = new THREE.Group();
  group.scale.set(1.15, 1.15, 1.15);

  // Materials
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0xc2410c, // Warm rich orange-amber wood
    roughness: 0.62,
    flatShading: true,
  });

  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x7c2d12,
    roughness: 0.75,
    flatShading: true,
  });

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // Chiseled slate dark iron
    metalness: 0.85,
    roughness: 0.35,
    flatShading: true,
  });

  const darkIronMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.9,
    roughness: 0.3,
    flatShading: true,
  });

  const rivetMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0, // Polished silver / chrome hex rivets
    metalness: 0.95,
    roughness: 0.15,
  });

  const goldCoinMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xd97706,
    emissiveIntensity: 0.6,
    metalness: 0.9,
    roughness: 0.2,
    flatShading: true,
  });

  // Dimensions
  const w = 0.88;
  const h = 0.42;
  const d = 0.60;
  const radius = d / 2;

  // ==========================================
  // 1. CHEST LOWER BODY & BASE FRAME
  // ==========================================
  const bodyGroup = new THREE.Group();

  // Main Wood Chest Box
  const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), woodMat);
  bodyMesh.position.y = h / 2 + 0.05;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  bodyGroup.add(bodyMesh);

  // Horizontal Plank Grooves on Front & Back
  [-1, 1].forEach((sideZ) => {
    [-0.05, 0.08].forEach((gy) => {
      const groove = new THREE.Mesh(new THREE.BoxGeometry(w - 0.08, 0.02, 0.02), darkWoodMat);
      groove.position.set(0, h / 2 + 0.05 + gy, sideZ * (d / 2 + 0.005));
      bodyGroup.add(groove);
    });
  });

  // Heavy Bottom Iron Plinth Rim
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(w + 0.10, 0.10, d + 0.10), ironMat);
  plinth.position.y = 0.05;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  bodyGroup.add(plinth);

  // 4 Chunky Reinforced Iron Corner Brackets at Base
  const cornerSize = 0.16;
  const halfW = (w + 0.08) / 2;
  const halfD = (d + 0.08) / 2;
  [
    [-halfW + cornerSize / 2, -halfD + cornerSize / 2],
    [halfW - cornerSize / 2, -halfD + cornerSize / 2],
    [-halfW + cornerSize / 2, halfD - cornerSize / 2],
    [halfW - cornerSize / 2, halfD - cornerSize / 2],
  ].forEach(([cx, cz]) => {
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(cornerSize, 0.14, cornerSize), darkIronMat);
    bracket.position.set(cx, 0.07, cz);
    bracket.castShadow = true;
    bodyGroup.add(bracket);
  });

  // Vertical Iron Corner Strips with Hex Rivets
  [
    [-w / 2 + 0.04, -d / 2 + 0.04],
    [w / 2 - 0.04, -d / 2 + 0.04],
    [-w / 2 + 0.04, d / 2 - 0.04],
    [w / 2 - 0.04, d / 2 - 0.04],
  ].forEach(([vx, vz]) => {
    const vBand = new THREE.Mesh(new THREE.BoxGeometry(0.10, h + 0.02, 0.10), ironMat);
    vBand.position.set(vx, h / 2 + 0.05, vz);
    vBand.castShadow = true;
    bodyGroup.add(vBand);

    // Silver Hexagonal Rivets near top & bottom
    [0.16, h - 0.04].forEach((ry) => {
      const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.02, 6), rivetMat);
      rivet.position.set(vx + (vx > 0 ? 0.052 : -0.052), ry, vz + (vz > 0 ? 0.052 : -0.052));
      rivet.rotation.z = Math.PI / 2;
      bodyGroup.add(rivet);
    });
  });

  group.add(bodyGroup);

  // ==========================================
  // 2. BARREL-VAULTED HINGED LID
  // ==========================================
  const lidHingeY = h + 0.05;
  const lidHingeZ = -d / 2 + 0.02;

  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, lidHingeY, lidHingeZ);

  // Container offset relative to hinge
  const lidOffsetZ = d / 2 - 0.02;
  const lidContent = new THREE.Group();
  lidContent.position.set(0, 0, lidOffsetZ);

  // Vaulted Wood Curve (Half cylinder rotated horizontally)
  const barrelWood = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, w - 0.02, 20, 1, false, 0, Math.PI),
    woodMat
  );
  barrelWood.rotation.z = Math.PI / 2;
  barrelWood.rotation.x = -Math.PI / 2;
  barrelWood.castShadow = true;
  lidContent.add(barrelWood);

  // Wood Side Gables
  [-w / 2 + 0.01, w / 2 - 0.01].forEach((gx) => {
    const sideGable = new THREE.Mesh(new THREE.CircleGeometry(radius, 20, 0, Math.PI), woodMat);
    sideGable.position.set(gx, 0, 0);
    sideGable.rotation.y = gx > 0 ? Math.PI / 2 : -Math.PI / 2;
    sideGable.rotation.z = -Math.PI / 2;
    lidContent.add(sideGable);
  });

  // Heavy Arched Iron Side Bands (The iconic curved metal ribs from photo!)
  [-w / 2 + 0.06, w / 2 - 0.06].forEach((ax) => {
    const archBand = new THREE.Mesh(
      new THREE.TorusGeometry(radius + 0.015, 0.045, 6, 20, Math.PI),
      ironMat
    );
    archBand.position.set(ax, 0, 0);
    archBand.rotation.y = Math.PI / 2;
    archBand.castShadow = true;
    lidContent.add(archBand);

    // Silver Hexagonal Rivets along the curve
    for (let r = 0.2; r < Math.PI - 0.2; r += 0.55) {
      const rx = Math.sin(r) * (radius + 0.045);
      const rz = -Math.cos(r) * (radius + 0.045);
      const hexRivet = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.025, 6), rivetMat);
      hexRivet.position.set(ax + (ax > 0 ? 0.03 : -0.03), rx, rz);
      hexRivet.rotation.z = Math.PI / 2;
      lidContent.add(hexRivet);
    }
  });

  // Top Iron Carrying Handle (Center of the lid ridge)
  const handleGroup = new THREE.Group();
  handleGroup.position.set(0, radius + 0.02, 0);

  // Handle Base Mounts
  [-0.12, 0.12].forEach((hx) => {
    const mount = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.06), darkIronMat);
    mount.position.set(hx, 0.01, 0);
    handleGroup.add(mount);
  });

  // Curved Handle Bar
  const handleBar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.035, 0.035), ironMat);
  handleBar.position.set(0, 0.08, 0);
  handleGroup.add(handleBar);

  const handleLegL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.07, 0.035), ironMat);
  handleLegL.position.set(-0.11, 0.04, 0);
  handleGroup.add(handleLegL);

  const handleLegR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.07, 0.035), ironMat);
  handleLegR.position.set(0.11, 0.04, 0);
  handleGroup.add(handleLegR);

  lidContent.add(handleGroup);

  // Front Upper Hasp Plate
  const haspUpper = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.04), darkIronMat);
  haspUpper.position.set(0, -0.02, radius + 0.02);
  lidContent.add(haspUpper);

  lidGroup.add(lidContent);
  group.add(lidGroup);

  // ==========================================
  // 3. MASSIVE SHIELD-SHAPED FRONT PADLOCK (Matching Reference Photo!)
  // ==========================================
  const lockGroup = new THREE.Group();
  lockGroup.position.set(0, h * 0.72, d / 2 + 0.06);

  // Curved Iron Lock Shackle
  const shackle = new THREE.Mesh(
    new THREE.TorusGeometry(0.075, 0.022, 6, 16, Math.PI * 1.3),
    ironMat
  );
  shackle.position.set(0, 0.11, 0);
  shackle.rotation.z = Math.PI * 0.85;
  lockGroup.add(shackle);

  // Shield-Shaped Lock Body (Hexagonal / Beveled Shield Contour)
  const shieldBody = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.06), darkIronMat);
  shieldBody.position.set(0, -0.02, 0);
  shieldBody.castShadow = true;
  lockGroup.add(shieldBody);

  // Tapered Shield Bottom Point
  const shieldPoint = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.14, 4), darkIronMat);
  shieldPoint.position.set(0, -0.16, 0);
  shieldPoint.rotation.y = Math.PI / 4;
  lockGroup.add(shieldPoint);

  // Front Beveled Steel Plate (With metallic specular highlights)
  const shieldPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.20, 0.18, 0.015),
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.25 })
  );
  shieldPlate.position.set(0, -0.02, 0.035);
  lockGroup.add(shieldPlate);

  // Central Dark Keyhole
  const keyholeUpper = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), new THREE.MeshBasicMaterial({ color: 0x020617 }));
  keyholeUpper.position.set(0, 0.01, 0.045);
  lockGroup.add(keyholeUpper);

  const keyholeSlot = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.06, 0.02), new THREE.MeshBasicMaterial({ color: 0x020617 }));
  keyholeSlot.position.set(0, -0.03, 0.045);
  lockGroup.add(keyholeSlot);

  group.add(lockGroup);

  // ==========================================
  // 4. OPEN VS CLOSED STATE DYNAMICS & GLOWING TREASURE
  // ==========================================
  let updateAnimation: ((time: number) => void) | undefined;

  if (isOpened) {
    // Swing lid wide open backward (~60 degrees)
    lidGroup.rotation.x = -Math.PI * 0.38;

    // Swing padlock down / ajar
    lockGroup.position.set(0, h * 0.45, d / 2 + 0.12);
    lockGroup.rotation.x = 0.45;
    lockGroup.rotation.z = -0.3;

    // Overflowing Treasure Mound (Gold Coins & Gems)
    const treasureGroup = new THREE.Group();
    treasureGroup.position.set(0, h * 0.85, 0);

    const coinMound = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 8), goldCoinMat);
    coinMound.scale.set(1.2, 0.5, 0.85);
    treasureGroup.add(coinMound);

    // Sparkling Multicolored Gems (Emerald, Ruby, Sapphire)
    const gemColors = [0x10b981, 0xef4444, 0x38bdf8, 0xa855f7];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const gem = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.06),
        new THREE.MeshStandardMaterial({
          color: gemColors[i % gemColors.length],
          emissive: gemColors[i % gemColors.length],
          emissiveIntensity: 2.0,
          roughness: 0.1,
        })
      );
      gem.position.set(Math.cos(angle) * 0.22, 0.10, Math.sin(angle) * 0.15);
      treasureGroup.add(gem);
    }

    // Upward Radiant Treasure Beam
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.35, 1.8, 12, 1, true), beamMat);
    beam.position.y = 0.9;
    treasureGroup.add(beam);

    group.add(treasureGroup);

    // Warm Golden Light
    const openLight = new THREE.PointLight(0xfbbf24, 2.2, 5);
    openLight.position.set(0, h + 0.4, 0);
    group.add(openLight);

    updateAnimation = (time: number) => {
      beam.rotation.y = time * 1.5;
      beamMat.opacity = 0.35 + Math.sin(time * 4.0) * 0.15;
    };
  } else {
    // Closed & Locked State
    lidGroup.rotation.x = 0;

    // Subtle amber mystery aura
    const lockedLight = new THREE.PointLight(0xf59e0b, 1.6, 4);
    lockedLight.position.set(0, h + 0.2, 0);
    group.add(lockedLight);

    updateAnimation = (time: number) => {
      lockedLight.intensity = 1.4 + Math.sin(time * 3.0) * 0.4;
    };
  }

  return { group, lidGroup, updateAnimation };
}

// ==========================================
// 8. VILLAGE DETAIL PROPS & DECORATIONS (Crates, Barrels, Merchant Carts & Planters)
// ==========================================

export function create3DWoodenCratesMesh(posX: number, posZ: number): THREE.Group {
  const group = new THREE.Group();
  group.position.set(posX, 0, posZ);

  const crateTex = createProceduralWoodenCrateTexture();
  const woodMat = new THREE.MeshStandardMaterial({ map: crateTex, color: 0xffffff, roughness: 0.75 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ map: crateTex, color: 0xcccccc, roughness: 0.8 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });

  // Crate 1 (Bottom Left)
  const crate1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.55), woodMat);
  crate1.position.set(-0.25, 0.225, 0.15);
  crate1.rotation.y = 0.1;
  crate1.castShadow = true;
  group.add(crate1);

  // Crate 2 (Bottom Right)
  const crate2 = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.40, 0.50), darkWoodMat);
  crate2.position.set(0.25, 0.20, -0.10);
  crate2.rotation.y = -0.25;
  crate2.castShadow = true;
  group.add(crate2);

  // Crate 3 (Top Stacked)
  const crate3 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.35, 0.42), woodMat);
  crate3.position.set(-0.10, 0.60, 0.05);
  crate3.rotation.y = 0.35;
  crate3.castShadow = true;
  group.add(crate3);

  // Metal Corner Brackets on top crate
  const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.44), ironMat);
  bracket.position.set(-0.10, 0.60, 0.05);
  bracket.rotation.y = 0.35;
  group.add(bracket);

  return group;
}

export function create3DOakBarrelsMesh(posX: number, posZ: number): THREE.Group {
  const group = new THREE.Group();
  group.position.set(posX, 0, posZ);

  const barrelTex = createProceduralOakBarrelTexture();
  const barrelMat = new THREE.MeshStandardMaterial({ map: barrelTex, color: 0xffffff, roughness: 0.70 });
  const bandMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.92, roughness: 0.20 });

  // Barrel 1 (Standing upright)
  const barrel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.65, 16), barrelMat);
  barrel1.position.set(-0.20, 0.325, 0.10);
  barrel1.castShadow = true;
  group.add(barrel1);

  const band1Top = new THREE.Mesh(new THREE.CylinderGeometry(0.265, 0.275, 0.05, 16), bandMat);
  band1Top.position.set(-0.20, 0.48, 0.10);
  group.add(band1Top);

  const band1Bot = new THREE.Mesh(new THREE.CylinderGeometry(0.275, 0.285, 0.05, 16), bandMat);
  band1Bot.position.set(-0.20, 0.18, 0.10);
  group.add(band1Bot);

  // Barrel 2 (Standing upright slightly smaller)
  const barrel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.58, 16), barrelMat);
  barrel2.position.set(0.22, 0.29, -0.12);
  barrel2.castShadow = true;
  group.add(barrel2);

  const band2Top = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.255, 0.04, 16), bandMat);
  band2Top.position.set(0.22, 0.44, -0.12);
  group.add(band2Top);

  // Barrel 3 (Laying sideways on ground)
  const barrel3 = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.23, 0.55, 14), barrelMat);
  barrel3.rotation.z = Math.PI / 2;
  barrel3.rotation.y = 0.4;
  barrel3.position.set(0.05, 0.20, 0.30);
  barrel3.castShadow = true;
  group.add(barrel3);

  return group;
}

export function create3DMerchantCartMesh(posX: number, posZ: number): THREE.Group {
  const group = new THREE.Group();
  group.position.set(posX, 0, posZ);

  const woodTex = createProceduralWoodPlankTexture('oak');
  const darkWoodTex = createProceduralWoodPlankTexture('dark');

  const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, color: 0xffffff, roughness: 0.75 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ map: darkWoodTex, color: 0xffffff, roughness: 0.80 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.25 });
  const sackMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 });
  const fruitMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });

  // Cart Wooden Bed
  const bed = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 1.8), woodMat);
  bed.position.set(0, 0.45, 0);
  bed.castShadow = true;
  group.add(bed);

  // Side Rails
  const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 1.8), darkWoodMat);
  sideL.position.set(-0.56, 0.65, 0);
  group.add(sideL);

  const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 1.8), darkWoodMat);
  sideR.position.set(0.56, 0.65, 0);
  group.add(sideR);

  const frontBack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.08), darkWoodMat);
  frontBack.position.set(0, 0.65, -0.86);
  group.add(frontBack);

  // Spoked Wooden Wheels
  [-0.68, 0.68].forEach((wx) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.10, 16), darkWoodMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(wx, 0.38, 0.10);
    wheel.castShadow = true;
    group.add(wheel);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.03, 8, 20), ironMat);
    rim.rotation.y = Math.PI / 2;
    rim.position.set(wx, 0.38, 0.10);
    group.add(rim);
  });

  // Pulling Shafts
  const shaftL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), darkWoodMat);
  shaftL.rotation.x = Math.PI / 2 + 0.15;
  shaftL.position.set(-0.40, 0.30, 1.3);
  group.add(shaftL);

  const shaftR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), darkWoodMat);
  shaftR.rotation.x = Math.PI / 2 + 0.15;
  shaftR.position.set(0.40, 0.30, 1.3);
  group.add(shaftR);

  // Cargo on the cart: Sacks & Fruit Crates
  const sack1 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), sackMat);
  sack1.scale.set(1.1, 0.7, 1.3);
  sack1.position.set(-0.20, 0.68, -0.35);
  group.add(sack1);

  const sack2 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 10), sackMat);
  sack2.scale.set(1.0, 0.7, 1.2);
  sack2.position.set(0.22, 0.68, -0.20);
  group.add(sack2);

  const fruitCrate = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.28, 0.45), woodMat);
  fruitCrate.position.set(0, 0.62, 0.40);
  group.add(fruitCrate);

  for (let i = 0; i < 4; i++) {
    const apple = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), fruitMat);
    apple.position.set(-0.10 + (i % 2) * 0.2, 0.80, 0.32 + Math.floor(i / 2) * 0.16);
    group.add(apple);
  }

  return group;
}

export function create3DStonePlanterMesh(posX: number, posZ: number): THREE.Group {
  const group = new THREE.Group();
  group.position.set(posX, 0, posZ);

  const stoneTex = createProceduralStoneBrickTexture('grey');
  const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, color: 0xffffff, roughness: 0.85 });
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x3d1c06, roughness: 0.95 });
  const bushMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
  const flowerMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3, emissive: 0x9f1239, emissiveIntensity: 0.5 });

  // Hexagonal Stone Planter Basin
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.30, 0.42, 8), stoneMat);
  basin.position.y = 0.21;
  basin.castShadow = true;
  group.add(basin);

  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.05, 8), soilMat);
  soil.position.y = 0.41;
  group.add(soil);

  // Lush Blooming Bush in Planter
  const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32, 1), bushMat);
  bush.position.y = 0.58;
  bush.castShadow = true;
  group.add(bush);

  // Colorful Flowers
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const flower = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), flowerMat);
    flower.position.set(Math.cos(angle) * 0.22, 0.65 + (i % 2) * 0.08, Math.sin(angle) * 0.22);
    group.add(flower);
  }

  return group;
}

// =========================================================================
// 🌿 1. BOTICA ALQUÍMICA 3D (APOTHECARY & POTION LABORATORY)
// =========================================================================
export function create3DApothecaryBuildingMesh(): BuildingMeshResult {
  const group = new THREE.Group();

  const stoneTex = createProceduralStoneBrickTexture('dark');
  const woodTex = createProceduralWoodPlankTexture('dark');
  const roofTex = createProceduralRoofShinglesTexture('terracotta');
  const windowTex = createProceduralWindowGlassTexture();

  const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, color: 0xffffff, roughness: 0.85 });
  const plasterMat = new THREE.MeshStandardMaterial({ map: stoneTex, color: 0xfef08a, roughness: 0.7 });
  const timberMat = new THREE.MeshStandardMaterial({ map: woodTex, color: 0xffffff, roughness: 0.75 });
  const greenRoofMat = new THREE.MeshStandardMaterial({ map: roofTex, color: 0x22c55e, roughness: 0.60 });
  const darkRoofMat = new THREE.MeshStandardMaterial({ map: roofTex, color: 0x14532d, roughness: 0.70 });
  const potionRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 1.5, roughness: 0.1 });
  const potionCyanMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 1.5, roughness: 0.1 });
  const potionGreenMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 1.5, roughness: 0.1 });
  const potionPurpleMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 1.5, roughness: 0.1 });
  const windowGlowMat = new THREE.MeshStandardMaterial({ map: windowTex, color: 0xffffff, emissive: 0x22c55e, emissiveIntensity: 1.4 });

  // 1. Stone Foundation Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.45, 1.85), stoneMat);
  plinth.position.y = 0.225;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  // 2. Plaster Walls (First Floor)
  const walls = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.15, 1.7), plasterMat);
  walls.position.y = 0.45 + 0.575;
  walls.castShadow = true;
  walls.receiveShadow = true;
  group.add(walls);

  // 3. Timber Corner Posts & Cross Beams
  const cornerPositions = [
    [-0.98, -0.83], [0.98, -0.83], [-0.98, 0.83], [0.98, 0.83]
  ];
  cornerPositions.forEach(([cx, cz]) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.25, 0.14), timberMat);
    post.position.set(cx, 1.05, cz);
    post.castShadow = true;
    group.add(post);
  });

  // Intermediate timber frame horizontal beams
  const beamFront = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.10, 0.08), timberMat);
  beamFront.position.set(0, 1.55, 0.84);
  group.add(beamFront);

  // 4. Slanted Shingled Green Roof
  const roofMain = new THREE.Mesh(new THREE.ConeGeometry(1.65, 1.10, 4), greenRoofMat);
  roofMain.rotation.y = Math.PI / 4;
  roofMain.position.set(0, 2.15, 0);
  roofMain.scale.set(1.0, 0.95, 0.85);
  roofMain.castShadow = true;
  group.add(roofMain);

  // Roof Ridge Beam
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.65), darkRoofMat);
  ridge.position.set(0, 2.65, 0);
  group.add(ridge);

  // 5. Front Bay Display Windows with Glowing Potions
  const bayBox = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.25), timberMat);
  bayBox.position.set(-0.55, 0.95, 0.92);
  group.add(bayBox);

  const bayGlass = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.08), windowGlowMat);
  bayGlass.position.set(-0.55, 0.95, 1.02);
  group.add(bayGlass);

  // Potion bottles in display window
  const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.14, 8), potionCyanMat);
  p1.position.set(-0.70, 0.90, 1.06);
  group.add(p1);

  const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.14, 8), potionRedMat);
  p2.position.set(-0.55, 0.90, 1.06);
  group.add(p2);

  const p3 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.14, 8), potionGreenMat);
  p3.position.set(-0.40, 0.90, 1.06);
  group.add(p3);

  // Window on right side
  const winR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.06), windowGlowMat);
  winR.position.set(0.55, 1.05, 0.86);
  group.add(winR);

  // 6. Stone Chimney with Magical Vapor
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.5, 0.35), stoneMat);
  chimney.position.set(0.65, 2.2, -0.35);
  chimney.castShadow = true;
  group.add(chimney);

  const chimneyCap = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.10, 0.42), darkRoofMat);
  chimneyCap.position.set(0.65, 2.98, -0.35);
  group.add(chimneyCap);

  // Smoke puffs animation
  const smokePuffs: THREE.Mesh[] = [];
  const smokeMat = new THREE.MeshBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.55 });
  for (let i = 0; i < 4; i++) {
    const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12 + i * 0.03, 1), smokeMat);
    puff.position.set(0.65, 3.05 + i * 0.25, -0.35);
    group.add(puff);
    smokePuffs.push(puff);
  }

  // 7. Hanging Mortar & Pestle Sign
  const signPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45), timberMat);
  signPole.rotation.z = Math.PI / 2;
  signPole.position.set(0.18, 1.45, 0.95);
  group.add(signPole);

  const mortar = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.06, 0.12, 8), potionPurpleMat);
  mortar.position.set(0.35, 1.35, 0.95);
  group.add(mortar);

  let smokeTimer = 0;
  const updateAnimation = (delta: number) => {
    smokeTimer += delta * 1.5;
    smokePuffs.forEach((p, idx) => {
      p.position.y = 3.05 + ((smokeTimer + idx * 0.6) % 1.6);
      p.position.x = 0.65 + Math.sin(smokeTimer * 2 + idx) * 0.08;
      const progress = ((smokeTimer + idx * 0.6) % 1.6) / 1.6;
      p.scale.setScalar(0.6 + progress * 0.9);
      (p.material as THREE.MeshBasicMaterial).opacity = (1.0 - progress) * 0.6;
    });
  };

  return { group, updateAnimation };
}

// =========================================================================
// 👑 2. GRAN SALÓN DEL TRONO / CASA CONSISTORIAL 3D (CASTLE CIVIC HALL)
// =========================================================================
export function create3DCityHallBuildingMesh(): BuildingMeshResult {
  const group = new THREE.Group();

  const ashlarTex = createProceduralStoneBrickTexture('grey');
  const darkStoneTex = createProceduralStoneBrickTexture('dark');
  const roofTex = createProceduralRoofShinglesTexture('slate');
  const windowTex = createProceduralWindowGlassTexture();

  const ashlarMat = new THREE.MeshStandardMaterial({ map: ashlarTex, color: 0xffffff, roughness: 0.75 });
  const darkStoneMat = new THREE.MeshStandardMaterial({ map: darkStoneTex, color: 0xffffff, roughness: 0.85 });
  const blueRoofMat = new THREE.MeshStandardMaterial({ map: roofTex, color: 0x38bdf8, roughness: 0.55 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.16 });
  const stainedGlassMat = new THREE.MeshStandardMaterial({ map: windowTex, color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.5 });
  const bannerMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6, side: THREE.DoubleSide });

  // 1. Monumental Stepped Base
  const baseStep1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.35, 2.3), darkStoneMat);
  baseStep1.position.y = 0.175;
  baseStep1.receiveShadow = true;
  group.add(baseStep1);

  // 2. Main Stone Civic Palace Body (2 Levels)
  const mainBody = new THREE.Mesh(new THREE.BoxGeometry(2.25, 1.85, 1.95), ashlarMat);
  mainBody.position.y = 0.35 + 0.925;
  mainBody.castShadow = true;
  mainBody.receiveShadow = true;
  group.add(mainBody);

  // 3. Classical Corner Pilasters
  const pilasterPositions = [
    [-1.10, -0.95], [1.10, -0.95], [-1.10, 0.95], [1.10, 0.95]
  ];
  pilasterPositions.forEach(([px, pz]) => {
    const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.95, 0.18), darkStoneMat);
    pilaster.position.set(px, 1.30, pz);
    pilaster.castShadow = true;
    group.add(pilaster);
  });

  // 4. Arched Grand Portal Framing Front Facade
  const portalArch = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.25), darkStoneMat);
  portalArch.position.set(0, 1.55, 0.98);
  group.add(portalArch);

  // Golden Royal Lion Crest above portal
  const crest = new THREE.Mesh(new THREE.DodecahedronGeometry(0.20, 1), goldMat);
  crest.position.set(0, 1.82, 1.0);
  group.add(crest);

  // 5. Stained Glass Windows (Upper Floor)
  for (let i = -1; i <= 1; i++) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.65, 0.06), stainedGlassMat);
    win.position.set(i * 0.65, 1.65, 0.99);
    group.add(win);

    const winArch = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 8, 1, false, 0, Math.PI), darkStoneMat);
    winArch.rotation.z = Math.PI / 2;
    winArch.position.set(i * 0.65, 1.98, 0.99);
    group.add(winArch);
  }

  // 6. Royal Blue High-Pitched Mansard Roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.85, 1.25, 4), blueRoofMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.set(0, 2.85, 0);
  roof.scale.set(1.0, 0.9, 0.85);
  roof.castShadow = true;
  group.add(roof);

  // 7. Twin Corner Spires with Fluttering Banners
  const turretPositions = [[-1.12, 0.98], [1.12, 0.98]];
  const banners: THREE.Mesh[] = [];
  turretPositions.forEach(([tx, tz]) => {
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 1.2, 8), darkStoneMat);
    turret.position.set(tx, 2.5, tz);
    turret.castShadow = true;
    group.add(turret);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.65, 8), blueRoofMat);
    spire.position.set(tx, 3.4, tz);
    group.add(spire);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), goldMat);
    finial.position.set(tx, 3.75, tz);
    group.add(finial);

    const banner = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.55), bannerMat);
    banner.position.set(tx + 0.18, 3.35, tz);
    group.add(banner);
    banners.push(banner);
  });

  let bannerTimer = 0;
  const updateAnimation = (delta: number) => {
    bannerTimer += delta * 4;
    banners.forEach((b, idx) => {
      b.rotation.y = Math.sin(bannerTimer + idx * Math.PI) * 0.35;
    });
  };

  return { group, updateAnimation };
}

// =========================================================================
// 🍻 3. GRAN TABERNA Y POSADA "EL JABALÍ DORADO" 3D
// =========================================================================
export function create3DTavernBuildingMesh(): BuildingMeshResult {
  const group = new THREE.Group();

  const stoneTex = createProceduralStoneBrickTexture('grey');
  const woodTex = createProceduralWoodPlankTexture('dark');
  const roofTex = createProceduralRoofShinglesTexture('terracotta');
  const windowTex = createProceduralWindowGlassTexture();

  const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, color: 0xffffff, roughness: 0.9 });
  const timberMat = new THREE.MeshStandardMaterial({ map: woodTex, color: 0xffffff, roughness: 0.8 });
  const plasterMat = new THREE.MeshStandardMaterial({ map: stoneTex, color: 0xfef3c7, roughness: 0.75 });
  const terracottaRoofMat = new THREE.MeshStandardMaterial({ map: roofTex, color: 0xffffff, roughness: 0.65 });
  const darkTerracottaMat = new THREE.MeshStandardMaterial({ map: roofTex, color: 0x888888, roughness: 0.7 });
  const windowGlowMat = new THREE.MeshStandardMaterial({ map: windowTex, color: 0xffffff, emissive: 0xf59e0b, emissiveIntensity: 1.8 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.92, roughness: 0.18 });

  // 1. Heavy Stone Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.55, 2.05), stoneMat);
  base.position.y = 0.275;
  base.receiveShadow = true;
  group.add(base);

  // 2. Timber & Plaster First Floor
  const floor1 = new THREE.Mesh(new THREE.BoxGeometry(2.20, 0.85, 1.90), plasterMat);
  floor1.position.y = 0.55 + 0.425;
  floor1.castShadow = true;
  group.add(floor1);

  // 3. Cantilevered Overhanging Second Floor (Classic Medieval)
  const floor2 = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.85, 2.05), plasterMat);
  floor2.position.y = 0.55 + 0.85 + 0.425;
  floor2.castShadow = true;
  group.add(floor2);

  // Timber vertical framing
  for (let x = -1.1; x <= 1.1; x += 0.55) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.10, 1.75, 0.08), timberMat);
    post.position.set(x, 1.45, 1.04);
    group.add(post);
  }

  // 4. Terracotta Pitched Gable Roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.85, 1.15, 4), terracottaRoofMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.set(0, 2.80, 0);
  roof.scale.set(1.0, 0.95, 0.88);
  roof.castShadow = true;
  group.add(roof);

  const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.85), darkTerracottaMat);
  ridge.position.set(0, 3.35, 0);
  group.add(ridge);

  // 5. Windows with Warm Candle Glow
  [[-0.65, 0.95], [0.65, 0.95], [-0.7, 1.85], [0, 1.85], [0.7, 1.85]].forEach(([wx, wy]) => {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.08), windowGlowMat);
    win.position.set(wx, wy, 1.05);
    group.add(win);
  });

  // 6. Stone Chimney with Smoke Puffs
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.40, 1.6, 0.40), stoneMat);
  chimney.position.set(-0.75, 2.8, -0.45);
  chimney.castShadow = true;
  group.add(chimney);

  const smokePuffs: THREE.Mesh[] = [];
  const smokeMat = new THREE.MeshBasicMaterial({ color: 0xd6d3d1, transparent: true, opacity: 0.5 });
  for (let i = 0; i < 4; i++) {
    const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14 + i * 0.03, 1), smokeMat);
    puff.position.set(-0.75, 3.6 + i * 0.25, -0.45);
    group.add(puff);
    smokePuffs.push(puff);
  }

  // 7. Hanging Wooden Boar Sign
  const ironBracket = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 0.04), timberMat);
  ironBracket.position.set(0.85, 1.35, 1.15);
  group.add(ironBracket);

  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.22, 0.04), timberMat);
  signBoard.position.set(0.95, 1.20, 1.15);
  group.add(signBoard);

  const boarIcon = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), goldMat);
  boarIcon.position.set(0.95, 1.20, 1.18);
  group.add(boarIcon);

  // 8. Ale Casks by the side
  for (let b = 0; b < 3; b++) {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.42, 8), timberMat);
    barrel.position.set(1.25, 0.21, 0.5 - b * 0.45);
    barrel.castShadow = true;
    group.add(barrel);
  }

  let timer = 0;
  const updateAnimation = (delta: number) => {
    timer += delta * 1.5;
    smokePuffs.forEach((p, idx) => {
      p.position.y = 3.6 + ((timer + idx * 0.6) % 1.6);
      p.position.x = -0.75 + Math.sin(timer * 2 + idx) * 0.08;
      const progress = ((timer + idx * 0.6) % 1.6) / 1.6;
      p.scale.setScalar(0.6 + progress * 0.9);
      (p.material as THREE.MeshBasicMaterial).opacity = (1.0 - progress) * 0.5;
    });
  };

  return { group, updateAnimation };
}





