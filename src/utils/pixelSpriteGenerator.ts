// ==============================================================================
// 🎨 GENERADOR DE SPRITES PIXEL ART 2D RETRO (16-bit / 32-bit Classic RPG)
// ==============================================================================

export type Direction = 'down' | 'up' | 'left' | 'right';
export type AnimationState = 'idle' | 'walk1' | 'walk2' | 'attack' | 'cast' | 'hit';

interface ColorPalette {
  skin: string;
  skinShadow: string;
  hair: string;
  hairShadow: string;
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryDark: string;
  metal: string;
  metalDark: string;
  accent: string;
  eyes: string;
}

// Paletas cromáticas de 16-bits para cada clase y género
export function getClassPalette(heroClass: string, gender: 'male' | 'female'): ColorPalette {
  const isFemale = gender === 'female';

  switch (heroClass) {
    case 'Guerrero':
      return {
        skin: '#fbcfe8',
        skinShadow: '#f472b6',
        hair: isFemale ? '#f59e0b' : '#78350f',
        hairShadow: isFemale ? '#b45309' : '#451a03',
        primary: '#3b82f6',       // Azul de caballero
        primaryDark: '#1d4ed8',
        secondary: '#94a3b8',     // Acero pulido
        secondaryDark: '#475569',
        metal: '#cbd5e1',
        metalDark: '#64748b',
        accent: '#facc15',        // Bordes dorados
        eyes: '#0284c7',
      };
    case 'Mago':
      return {
        skin: '#fed7aa',
        skinShadow: '#fb923c',
        hair: isFemale ? '#c084fc' : '#94a3b8',
        hairShadow: isFemale ? '#7e22ce' : '#475569',
        primary: '#7c3aed',       // Púrpura arcano
        primaryDark: '#4c1d95',
        secondary: '#38bdf8',     // Ribetes celestes
        secondaryDark: '#0284c7',
        metal: '#fbbf24',
        metalDark: '#b45309',
        accent: '#f43f5e',        // Gema carmesí
        eyes: '#a855f7',
      };
    case 'Pícaro':
      return {
        skin: '#fed7aa',
        skinShadow: '#f97316',
        hair: isFemale ? '#18181b' : '#3f3f46',
        hairShadow: '#09090b',
        primary: '#27272a',       // Cuero sombrío
        primaryDark: '#09090b',
        secondary: '#10b981',     // Veneno esmeralda
        secondaryDark: '#047857',
        metal: '#71717a',
        metalDark: '#27272a',
        accent: '#22c55e',
        eyes: '#10b981',
      };
    case 'Paladín':
      return {
        skin: '#fed7aa',
        skinShadow: '#f97316',
        hair: isFemale ? '#fde047' : '#eab308',
        hairShadow: '#a16207',
        primary: '#f8fafc',       // Malla sagrada blanca
        primaryDark: '#cbd5e1',
        secondary: '#eab308',     // Oro radiante
        secondaryDark: '#a16207',
        metal: '#fef08a',
        metalDark: '#ca8a04',
        accent: '#38bdf8',
        eyes: '#0284c7',
      };
    case 'Nigromante':
      return {
        skin: '#cbd5e1',         // Piel pálida de ultratumba
        skinShadow: '#64748b',
        hair: '#0f172a',
        hairShadow: '#020617',
        primary: '#1e1b4b',       // Túnica oscura abisal
        primaryDark: '#0f0e17',
        secondary: '#10b981',     // Fuego espectral verde
        secondaryDark: '#064e3b',
        metal: '#475569',
        metalDark: '#1e293b',
        accent: '#22c55e',
        eyes: '#4ade80',
      };
    case 'Arquero':
      return {
        skin: '#fef08a',         // Tono élfico
        skinShadow: '#eab308',
        hair: isFemale ? '#bef264' : '#65a30d',
        hairShadow: isFemale ? '#65a30d' : '#365314',
        primary: '#15803d',       // Verde bosque
        primaryDark: '#14532d',
        secondary: '#92400e',     // Cuero curtido
        secondaryDark: '#451a03',
        metal: '#e2e8f0',
        metalDark: '#94a3b8',
        accent: '#facc15',
        eyes: '#22c55e',
      };
    case 'Berserker':
    default:
      return {
        skin: '#fed7aa',
        skinShadow: '#ea580c',
        hair: isFemale ? '#ea580c' : '#dc2626', // Pelirrojo guerrero
        hairShadow: '#991b1b',
        primary: '#7f1d1d',       // Rojo sangre bárbaro
        primaryDark: '#450a0a',
        secondary: '#78350f',     // Pieles curtidas
        secondaryDark: '#451a03',
        metal: '#94a3b8',
        metalDark: '#334155',
        accent: '#f59e0b',
        eyes: '#f97316',
      };
  }
}

// Cache de sprites generados para máximo rendimiento
const spriteCanvasCache = new Map<string, HTMLCanvasElement>();

/**
 * Genera un canvas con el sprite 2D de un personaje (32x32)
 */
export function getHeroSpriteCanvas(
  heroClass: string,
  gender: 'male' | 'female',
  dir: Direction = 'down',
  anim: AnimationState = 'idle'
): HTMLCanvasElement {
  const cacheKey = `hero_${heroClass}_${gender}_${dir}_${anim}`;
  if (spriteCanvasCache.has(cacheKey)) {
    return spriteCanvasCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const pal = getClassPalette(heroClass, gender);
  const isF = gender === 'female';

  // Offset de pasos en Y
  let stepY = 0;
  let legOffsetL = 0;
  let legOffsetR = 0;

  if (anim === 'walk1') {
    stepY = 1;
    legOffsetL = -2;
    legOffsetR = 2;
  } else if (anim === 'walk2') {
    stepY = 1;
    legOffsetL = 2;
    legOffsetR = -2;
  }

  // 1. Sombra bajo los pies
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(16, 29, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Capa / Pelo largo trasero
  if (isF || heroClass === 'Mago' || heroClass === 'Paladín' || heroClass === 'Nigromante') {
    ctx.fillStyle = pal.primaryDark;
    if (dir === 'up' || dir === 'down') {
      ctx.fillRect(10, 14 + stepY, 12, 11);
    } else if (dir === 'left') {
      ctx.fillRect(14, 14 + stepY, 8, 11);
    } else {
      ctx.fillRect(10, 14 + stepY, 8, 11);
    }
  }

  // 3. Piernas y Botas
  ctx.fillStyle = pal.secondaryDark;
  if (dir === 'down' || dir === 'up') {
    // Pierna Izquierda
    ctx.fillRect(11, 23 + legOffsetL, 4, 6);
    // Pierna Derecha
    ctx.fillRect(17, 23 + legOffsetR, 4, 6);
    // Botas
    ctx.fillStyle = pal.secondary;
    ctx.fillRect(11, 27 + legOffsetL, 4, 2);
    ctx.fillRect(17, 27 + legOffsetR, 4, 2);
  } else if (dir === 'left') {
    ctx.fillRect(13, 23 + legOffsetL, 5, 6);
    ctx.fillStyle = pal.secondary;
    ctx.fillRect(12, 27 + legOffsetL, 6, 2);
  } else {
    ctx.fillRect(14, 23 + legOffsetR, 5, 6);
    ctx.fillStyle = pal.secondary;
    ctx.fillRect(14, 27 + legOffsetR, 6, 2);
  }

  // 4. Torso / Armadura / Túnica
  ctx.fillStyle = pal.primary;
  ctx.fillRect(11, 14 + stepY, 10, 9);
  ctx.fillStyle = pal.primaryDark;
  ctx.fillRect(11, 21 + stepY, 10, 2); // Cinturón

  ctx.fillStyle = pal.accent;
  ctx.fillRect(15, 21 + stepY, 2, 2); // Hebilla dorada

  // Hombreras
  ctx.fillStyle = pal.metal;
  if (dir === 'down' || dir === 'up') {
    ctx.fillRect(9, 14 + stepY, 3, 4);
    ctx.fillRect(20, 14 + stepY, 3, 4);
  } else if (dir === 'left') {
    ctx.fillRect(12, 14 + stepY, 4, 4);
  } else {
    ctx.fillRect(16, 14 + stepY, 4, 4);
  }

  // 5. Cabeza y Rostro
  ctx.fillStyle = pal.skin;
  ctx.fillRect(11, 6 + stepY, 10, 8);

  if (dir === 'down') {
    // Ojos
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(13, 10 + stepY, 2, 2);
    ctx.fillRect(17, 10 + stepY, 2, 2);
    ctx.fillStyle = pal.eyes;
    ctx.fillRect(14, 10 + stepY, 1, 2);
    ctx.fillRect(18, 10 + stepY, 1, 2);
  } else if (dir === 'left') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 10 + stepY, 2, 2);
    ctx.fillStyle = pal.eyes;
    ctx.fillRect(12, 10 + stepY, 1, 2);
  } else if (dir === 'right') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(18, 10 + stepY, 2, 2);
    ctx.fillStyle = pal.eyes;
    ctx.fillRect(19, 10 + stepY, 1, 2);
  }

  // 6. Cabello / Casco / Sombrero de Clase
  if (heroClass === 'Guerrero') {
    // Casco de Cruzado con Ranura en T
    ctx.fillStyle = pal.metal;
    ctx.fillRect(10, 4 + stepY, 12, 6);
    ctx.fillStyle = pal.metalDark;
    if (dir === 'down') {
      ctx.fillRect(13, 8 + stepY, 6, 2);
      ctx.fillRect(15, 7 + stepY, 2, 4);
    }
  } else if (heroClass === 'Mago') {
    // Sombrero Puntiagudo de Mago
    ctx.fillStyle = pal.primaryDark;
    ctx.fillRect(8, 5 + stepY, 16, 2); // Ala ancha
    ctx.fillRect(11, 2 + stepY, 10, 3);
    ctx.fillRect(13, 0 + stepY, 6, 2);
    ctx.fillStyle = pal.accent;
    ctx.fillRect(10, 5 + stepY, 12, 1); // Cinta mágica
  } else if (heroClass === 'Pícaro' || heroClass === 'Nigromante') {
    // Capucha sombría
    ctx.fillStyle = pal.primaryDark;
    ctx.fillRect(10, 4 + stepY, 12, 5);
    ctx.fillRect(10, 8 + stepY, 2, 5);
    ctx.fillRect(20, 8 + stepY, 2, 5);
  } else {
    // Pelo peinado / Salvaje (Berserker / Arquero / Paladín)
    ctx.fillStyle = pal.hair;
    ctx.fillRect(10, 4 + stepY, 12, 4);
    if (isF) {
      // Coletas o melena
      ctx.fillRect(9, 7 + stepY, 2, 7);
      ctx.fillRect(21, 7 + stepY, 2, 7);
    }
    if (heroClass === 'Berserker' && !isF) {
      // Barba vikinga frondosa
      ctx.fillStyle = pal.hair;
      ctx.fillRect(12, 11 + stepY, 8, 4);
      ctx.fillRect(14, 15 + stepY, 4, 2);
    }
  }

  // 7. Armas y Escudos en mano
  if (heroClass === 'Guerrero' || heroClass === 'Paladín') {
    // Espada
    ctx.fillStyle = pal.metal;
    if (dir === 'right' || dir === 'down') {
      ctx.fillRect(23, 11 + stepY, 2, 10);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(22, 17 + stepY, 4, 2);
    } else {
      ctx.fillRect(7, 11 + stepY, 2, 10);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(6, 17 + stepY, 4, 2);
    }
  } else if (heroClass === 'Mago' || heroClass === 'Nigromante') {
    // Báculo con Orbe
    ctx.fillStyle = '#78350f';
    ctx.fillRect(23, 8 + stepY, 2, 16);
    ctx.fillStyle = pal.accent;
    ctx.fillRect(22, 6 + stepY, 4, 4);
  } else if (heroClass === 'Arquero') {
    // Arco de madera
    ctx.fillStyle = '#92400e';
    ctx.fillRect(7, 10 + stepY, 2, 12);
    ctx.fillRect(9, 9 + stepY, 2, 2);
    ctx.fillRect(9, 21 + stepY, 2, 2);
  } else if (heroClass === 'Berserker') {
    // Gran Martillo de Guerra
    ctx.fillStyle = '#78350f';
    ctx.fillRect(23, 10 + stepY, 2, 14);
    ctx.fillStyle = pal.metalDark;
    ctx.fillRect(21, 6 + stepY, 6, 6);
    ctx.fillStyle = pal.metal;
    ctx.fillRect(22, 7 + stepY, 4, 4);
  }

  spriteCanvasCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * Genera el sprite de un monstruo enemigo (40x40)
 */
export function getMonsterSpriteCanvas(type: string, timePhase: number = 0): HTMLCanvasElement {
  const cacheKey = `monster_${type}_${Math.floor(timePhase % 2)}`;
  if (spriteCanvasCache.has(cacheKey)) {
    return spriteCanvasCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 40;
  canvas.height = 40;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const breathe = Math.floor(timePhase % 2);

  // Sombra base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(20, 36, 11, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  const lower = type.toLowerCase();

  if (lower.includes('slime') || lower.includes('gel')) {
    // Slime Verde / Azul
    ctx.fillStyle = lower.includes('azul') ? '#0284c7' : '#16a34a';
    ctx.beginPath();
    ctx.ellipse(20, 26 - breathe, 12 + breathe, 9 - breathe, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = lower.includes('azul') ? '#38bdf8' : '#4ade80';
    ctx.beginPath();
    ctx.ellipse(17, 23 - breathe, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ojos de Slime
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(16, 23 - breathe, 3, 3);
    ctx.fillRect(22, 23 - breathe, 3, 3);
    ctx.fillStyle = '#000000';
    ctx.fillRect(17, 24 - breathe, 2, 2);
    ctx.fillRect(23, 24 - breathe, 2, 2);
  } else if (lower.includes('esqueleto') || lower.includes('calavera')) {
    // Esqueleto guerrero
    ctx.fillStyle = '#e2e8f0';
    // Cráneo
    ctx.fillRect(15, 8 + breathe, 10, 8);
    // Cuencas oculares oscuras
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(17, 11 + breathe, 2, 3);
    ctx.fillRect(21, 11 + breathe, 2, 3);
    ctx.fillStyle = '#ef4444'; // Brillo rojo en los ojos
    ctx.fillRect(17, 12 + breathe, 1, 1);
    ctx.fillRect(21, 12 + breathe, 1, 1);

    // Costillas y huesos
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(18, 16 + breathe, 4, 9);
    ctx.fillRect(14, 18 + breathe, 12, 2);
    ctx.fillRect(15, 21 + breathe, 10, 2);

    // Espada oxidada
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(27, 14 + breathe, 2, 14);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(26, 22 + breathe, 4, 2);
  } else if (lower.includes('dragon') || lower.includes('draco') || lower.includes('boss')) {
    // Dragón / Jefe Imponente
    ctx.fillStyle = '#991b1b'; // Escamas carmesí
    ctx.fillRect(10, 10 + breathe, 20, 18);
    // Alas
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(2, 6 + breathe, 10, 12);
    ctx.fillRect(28, 6 + breathe, 10, 12);

    // Cabeza con cuernos
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(14, 4 + breathe, 12, 10);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(12, 2 + breathe, 3, 4);
    ctx.fillRect(25, 2 + breathe, 3, 4);

    // Ojos ígneos
    ctx.fillStyle = '#facc15';
    ctx.fillRect(16, 8 + breathe, 2, 2);
    ctx.fillRect(22, 8 + breathe, 2, 2);
  } else {
    // Monstruo Bestia / Duende / Orco
    ctx.fillStyle = '#65a30d'; // Verde orco
    ctx.fillRect(12, 12 + breathe, 16, 16);
    ctx.fillStyle = '#3f6212';
    ctx.fillRect(14, 20 + breathe, 12, 6);

    // Ojos amarillos
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(15, 16 + breathe, 3, 3);
    ctx.fillRect(22, 16 + breathe, 3, 3);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(16, 17 + breathe, 1, 1);
    ctx.fillRect(23, 17 + breathe, 1, 1);

    // Colmillos
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(16, 22 + breathe, 2, 3);
    ctx.fillRect(22, 22 + breathe, 2, 3);
  }

  spriteCanvasCache.set(cacheKey, canvas);
  return canvas;
}
