// ==============================================================================
// 🗺️ GENERADOR MAESTRO DE TILESETS, PROPS Y EDIFICIOS RETRO 16/32-BIT (HD PIXEL ART)
// Estilo Top-Down Clásico: A Link to the Past / Chrono Trigger / RPG Maker
// ==============================================================================

const tileCache = new Map<string, HTMLCanvasElement>();

/**
 * Genera una baldosa de suelo 2D (32x32) con sombreado rico adaptado a cada uno de los 8 biomas
 */
export function getTileCanvas(tileType: number, zoneId: string, animPhase: number = 0): HTMLCanvasElement {
  const cacheKey = `tile_snes_${zoneId}_${tileType}_${Math.floor(animPhase % 4)}`;
  if (tileCache.has(cacheKey)) {
    return tileCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const phase = Math.floor(animPhase % 4);

  // ---------------------------------------------------------------------------
  // 0. SUELO BASE POR BIOMA (Césped vibrante, piedra suave, nieve, etc.)
  // ---------------------------------------------------------------------------
  if (tileType === 0) {
    if (zoneId === 'zone_forest') {
      // Césped verde vibrante estilo 16-bit con textura suave
      ctx.fillStyle = '#4d8a24';
      ctx.fillRect(0, 0, 32, 32);

      // Parches tonales de hierba
      ctx.fillStyle = '#5c9e2d';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillRect(18, 18, 12, 12);

      // Briznas sutiles de césped
      ctx.fillStyle = '#3c6e1c';
      ctx.fillRect(4, 8, 2, 4);
      ctx.fillRect(20, 10, 2, 4);
      ctx.fillRect(10, 22, 2, 4);
      ctx.fillRect(26, 24, 2, 4);

      // Pequeñas flores silvestres rojas y amarillas
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(14, 6, 2, 2);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(24, 16, 2, 2);
    } else if (zoneId === 'zone_cave') {
      // Suelo rocoso de caverna
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#475569';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillRect(18, 18, 12, 12);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 15, 32, 2);
      ctx.fillRect(15, 0, 2, 32);
    } else if (zoneId === 'zone_swamp') {
      // Lodo pantanoso verdoso con musgo
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#292524';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#14532d';
      ctx.fillRect(4, 6, 8, 6);
      ctx.fillRect(18, 18, 10, 8);
    } else if (zoneId === 'zone_volcano') {
      // Ceniza y basalto con grietas
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#27272a';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(6, 14, 8, 2);
    } else if (zoneId === 'zone_tundra') {
      // Nieve suave
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(2, 4, 12, 8);
      ctx.fillRect(18, 16, 12, 10);
    } else if (zoneId === 'zone_castle') {
      // Adoquines de castillo
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#475569';
      ctx.fillRect(2, 2, 13, 13);
      ctx.fillRect(17, 2, 13, 13);
      ctx.fillRect(2, 17, 13, 13);
      ctx.fillRect(17, 17, 13, 13);
    } else if (zoneId === 'zone_void') {
      // Polvo estelar cósmico
      ctx.fillStyle = '#090814';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#1e1035';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect((phase * 7) % 28, 8, 3, 3);
    } else {
      // Sagrario de los Antiguos: Mármol dorado
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(14, 14, 4, 4);
    }
  }
  // ---------------------------------------------------------------------------
  // 2. CALZADAS Y PLAZAS DE PIEDRA BEIGE Y GRIS PIZARRA (Exacto como la imagen)
  // ---------------------------------------------------------------------------
  else if (tileType === 2) {
    if (zoneId === 'zone_forest' || zoneId === 'zone_swamp') {
      // Calzada de baldosas de piedra beige / arena con juntas limpias
      ctx.fillStyle = '#997a4d'; // Junta oscura
      ctx.fillRect(0, 0, 32, 32);

      // Baldosa 1 (arriba izquierda)
      ctx.fillStyle = '#dfcaa0';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#ebd5b3';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillStyle = '#f7ecd5'; // Bisel luz
      ctx.fillRect(2, 2, 12, 2);
      ctx.fillRect(2, 2, 2, 12);

      // Baldosa 2 (arriba derecha)
      ctx.fillStyle = '#dfcaa0';
      ctx.fillRect(17, 1, 14, 14);
      ctx.fillStyle = '#ebd5b3';
      ctx.fillRect(18, 2, 12, 12);
      ctx.fillStyle = '#f7ecd5';
      ctx.fillRect(18, 2, 12, 2);
      ctx.fillRect(18, 2, 2, 12);

      // Baldosa 3 (abajo izquierda)
      ctx.fillStyle = '#dfcaa0';
      ctx.fillRect(1, 17, 14, 14);
      ctx.fillStyle = '#ebd5b3';
      ctx.fillRect(2, 18, 12, 12);
      ctx.fillStyle = '#f7ecd5';
      ctx.fillRect(2, 18, 12, 2);
      ctx.fillRect(2, 18, 2, 12);

      // Baldosa 4 (abajo derecha)
      ctx.fillStyle = '#dfcaa0';
      ctx.fillRect(17, 17, 14, 14);
      ctx.fillStyle = '#ebd5b3';
      ctx.fillRect(18, 18, 12, 12);
      ctx.fillStyle = '#f7ecd5';
      ctx.fillRect(18, 18, 12, 2);
      ctx.fillRect(18, 18, 2, 12);
    } else if (zoneId === 'zone_cave' || zoneId === 'zone_castle') {
      // Gran Plaza de losas gris pizarra
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#475569';
      ctx.fillRect(1, 1, 14, 14); ctx.fillRect(17, 1, 14, 14);
      ctx.fillRect(1, 17, 14, 14); ctx.fillRect(17, 17, 14, 14);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(2, 2, 12, 3); ctx.fillRect(18, 2, 12, 3);
      ctx.fillRect(2, 18, 12, 3); ctx.fillRect(18, 18, 12, 3);
    } else if (zoneId === 'zone_volcano') {
      // Losas de basalto con calor
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#27272a';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#3f3f46';
      ctx.fillRect(4, 4, 24, 10); ctx.fillRect(4, 18, 24, 10);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(2, 15, 28, 2);
    } else if (zoneId === 'zone_tundra') {
      // Losas de hielo azul
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(4, 4, 11, 10); ctx.fillRect(17, 4, 11, 10);
      ctx.fillRect(4, 17, 11, 10); ctx.fillRect(17, 17, 11, 10);
    } else {
      // Pasarela de oro
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(4, 4, 11, 11); ctx.fillRect(17, 4, 11, 11);
      ctx.fillRect(4, 17, 11, 11); ctx.fillRect(17, 17, 11, 11);
    }
  }
  // ---------------------------------------------------------------------------
  // 3. ESTANQUES / LAGOS CON MURO DE CONTENCIÓN Y NENÚFARES (Exacto como la imagen)
  // ---------------------------------------------------------------------------
  else if (tileType === 3) {
    if (zoneId === 'zone_volcano') {
      // Lava ardiente
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 4, 32, 10); ctx.fillRect(0, 18, 32, 10);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect((phase * 6) % 28, 6, 8, 4);
    } else if (zoneId === 'zone_swamp') {
      // Ciénaga con lodo
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#047857';
      ctx.fillRect(0, 4, 32, 10); ctx.fillRect(0, 18, 32, 10);
      ctx.fillStyle = '#6ee7b7';
      ctx.fillRect((phase * 5) % 28, 8, 3, 3);
    } else {
      // Agua azul profunda con gradiente y nenúfares
      ctx.fillStyle = '#0f4f8a'; // Azul profundo
      ctx.fillRect(0, 0, 32, 32);

      ctx.fillStyle = '#1e6bb8'; // Azul medio
      ctx.fillRect(2, 2, 28, 28);

      // Reflejos cristalinos
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect((phase * 6) % 24, 6, 8, 2);
      ctx.fillRect((phase * 8 + 10) % 24, 20, 8, 2);

      // Nenúfar verde flotante con flor
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(20, 14, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(19, 13, 2, 2);
    }
  }
  // ---------------------------------------------------------------------------
  // 12. SETOS Y JARDINES DE ROSAS ROJAS
  // ---------------------------------------------------------------------------
  else if (tileType === 12) {
    ctx.fillStyle = '#4d8a24';
    ctx.fillRect(0, 0, 32, 32);

    // Seto frondoso denso
    ctx.fillStyle = '#1b4d13';
    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2d7320';
    ctx.beginPath();
    ctx.arc(16, 14, 12, 0, Math.PI * 2);
    ctx.fill();

    // Rosas rojas con sombreado
    const drawRose = (rx: number, ry: number) => {
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(rx, ry, 6, 6);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(rx + 1, ry + 1, 4, 4);
      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(rx + 2, ry + 2, 2, 2);
    };

    drawRose(8, 8);
    drawRose(18, 10);
    drawRose(12, 18);
  }
  // ---------------------------------------------------------------------------
  // 13. CAMPOS DE CULTIVO / HUERTOS
  // ---------------------------------------------------------------------------
  else if (tileType === 13) {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(2, 2, 28, 6);
    ctx.fillRect(2, 10, 28, 6);
    ctx.fillRect(2, 18, 28, 6);
    ctx.fillRect(2, 26, 28, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(4, 3, 4, 3); ctx.fillRect(14, 3, 4, 3);
  } else {
    ctx.fillStyle = '#4d8a24';
    ctx.fillRect(0, 0, 32, 32);
  }

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🌳 Genera Árboles Frondosos de Bosque Continuo con Volumen y Sombra (64x64 px)
 */
export function getTreeCanvas(zoneId: string): { trunk: HTMLCanvasElement; canopy: HTMLCanvasElement } {
  const cacheKeyTrunk = `tree_trunk_rpg_${zoneId}`;
  const cacheKeyCanopy = `tree_canopy_rpg_${zoneId}`;

  if (tileCache.has(cacheKeyTrunk) && tileCache.has(cacheKeyCanopy)) {
    return {
      trunk: tileCache.get(cacheKeyTrunk)!,
      canopy: tileCache.get(cacheKeyCanopy)!,
    };
  }

  const trunk = document.createElement('canvas');
  trunk.width = 48;
  trunk.height = 36;
  const tCtx = trunk.getContext('2d')!;
  tCtx.imageSmoothingEnabled = false;

  const canopy = document.createElement('canvas');
  canopy.width = 64;
  canopy.height = 64;
  const cCtx = canopy.getContext('2d')!;
  cCtx.imageSmoothingEnabled = false;

  // 1. Sombra suave elíptica en el suelo
  tCtx.fillStyle = 'rgba(0,0,0,0.4)';
  tCtx.beginPath();
  tCtx.ellipse(24, 28, 20, 7, 0, 0, Math.PI * 2);
  tCtx.fill();

  // 2. Tronco de madera con vetas
  tCtx.fillStyle = '#381c08'; // Sombra corteza
  tCtx.fillRect(18, 6, 12, 24);
  tCtx.fillStyle = '#663914'; // Corteza media
  tCtx.fillRect(20, 6, 8, 24);
  tCtx.fillStyle = '#8f5321'; // Brillo lateral
  tCtx.fillRect(21, 6, 3, 24);
  // Raíces
  tCtx.fillStyle = '#381c08';
  tCtx.fillRect(16, 26, 4, 4);
  tCtx.fillRect(28, 26, 4, 4);

  // 3. Copa del Árbol (Esferas frondosas multicapa estilo Chrono Trigger)
  if (zoneId === 'zone_tundra') {
    // Pino nórdico con nieve
    cCtx.fillStyle = '#064e3b';
    cCtx.beginPath();
    cCtx.moveTo(32, 4);
    cCtx.lineTo(10, 56);
    cCtx.lineTo(54, 56);
    cCtx.fill();

    cCtx.fillStyle = '#047857';
    cCtx.beginPath();
    cCtx.moveTo(32, 8);
    cCtx.lineTo(14, 52);
    cCtx.lineTo(50, 52);
    cCtx.fill();

    cCtx.fillStyle = '#ffffff';
    cCtx.fillRect(26, 4, 12, 6);
    cCtx.fillRect(18, 22, 28, 8);
    cCtx.fillRect(12, 42, 40, 10);
  } else if (zoneId === 'zone_volcano') {
    // Columna de basalto y roca ardiente
    cCtx.fillStyle = '#18181b';
    cCtx.beginPath();
    cCtx.arc(32, 32, 26, 0, Math.PI * 2);
    cCtx.fill();
    cCtx.fillStyle = '#27272a';
    cCtx.beginPath();
    cCtx.arc(30, 28, 20, 0, Math.PI * 2);
    cCtx.fill();
    cCtx.fillStyle = '#dc2626';
    cCtx.fillRect(24, 20, 16, 6);
  } else {
    // Roble majestuoso clásico estilo 16-bit
    const darkOutline = '#15330e';
    const deepShadow = '#1e5414';
    const midTone = '#2f7a1f';
    const highlight = '#4ea633';
    const rimLight = '#7ad959';

    // Borde exterior oscuro
    cCtx.fillStyle = darkOutline;
    cCtx.beginPath();
    cCtx.arc(32, 32, 28, 0, Math.PI * 2);
    cCtx.fill();

    // Sombra profunda
    cCtx.fillStyle = deepShadow;
    cCtx.beginPath();
    cCtx.arc(32, 30, 26, 0, Math.PI * 2);
    cCtx.fill();

    // Cuerpo medio
    cCtx.fillStyle = midTone;
    cCtx.beginPath();
    cCtx.arc(32, 26, 22, 0, Math.PI * 2);
    cCtx.fill();

    // Cúmulos de hojas superiores iluminados
    cCtx.fillStyle = highlight;
    cCtx.beginPath();
    cCtx.arc(24, 20, 14, 0, Math.PI * 2);
    cCtx.fill();
    cCtx.beginPath();
    cCtx.arc(40, 22, 12, 0, Math.PI * 2);
    cCtx.fill();

    // Brillos de sol
    cCtx.fillStyle = rimLight;
    cCtx.beginPath();
    cCtx.arc(22, 16, 7, 0, Math.PI * 2);
    cCtx.fill();
  }

  tileCache.set(cacheKeyTrunk, trunk);
  tileCache.set(cacheKeyCanopy, canopy);

  return { trunk, canopy };
}

/**
 * 🧱 Muros de Piedra y Cantería 2.5D con Cornisa (tile 1)
 */
export function getStoneWallCanvas(): HTMLCanvasElement {
  const cacheKey = `stone_wall_rpg`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 36;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0,0,0,0.38)';
  ctx.fillRect(0, 32, 32, 4);

  // Cara frontal de piedra
  ctx.fillStyle = '#3a4a5e';
  ctx.fillRect(0, 10, 32, 22);

  // Juntas de mortero
  ctx.fillStyle = '#222d3b';
  ctx.fillRect(0, 18, 32, 2);
  ctx.fillRect(0, 26, 32, 2);
  ctx.fillRect(15, 10, 2, 8);
  ctx.fillRect(8, 18, 2, 8);
  ctx.fillRect(24, 18, 2, 8);

  // Cornisa superior de piedra labrada
  ctx.fillStyle = '#5a718c';
  ctx.fillRect(0, 2, 32, 8);
  ctx.fillStyle = '#839cb8';
  ctx.fillRect(0, 2, 32, 2);

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * ⛲ Gran Fuente Monumental Circular de Piedra (tile 4 - 64x64 px)
 */
export function getWaterWellCanvas(animPhase: number = 0): HTMLCanvasElement {
  const cacheKey = `fountain_rpg_${Math.floor(animPhase % 4)}`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra circular
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(32, 40, 28, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Brocal exterior de sillares
  ctx.fillStyle = '#3a4a5e';
  ctx.beginPath();
  ctx.ellipse(32, 34, 26, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5a718c';
  ctx.beginPath();
  ctx.ellipse(32, 32, 24, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Agua azul cristalina
  ctx.fillStyle = '#0f4f8a';
  ctx.beginPath();
  ctx.ellipse(32, 33, 18, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ondas brillantes
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(26, 31, 12, 3);
  ctx.fillRect(28, 35, 8, 2);

  // Pilar y surtidor central
  ctx.fillStyle = '#3a4a5e';
  ctx.fillRect(29, 16, 6, 16);
  ctx.fillStyle = '#839cb8';
  ctx.fillRect(28, 14, 8, 4);

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🏡 Edificios con Muros Perimetrales y Distribución de Madera (tiles 5 y 9 - 64x64 px)
 */
export function getCottageCanvas(roofColor: 'red' | 'blue' = 'red'): HTMLCanvasElement {
  const cacheKey = `cottage_rpg_${roofColor}`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0,0,0,0.42)';
  ctx.fillRect(4, 52, 56, 10);

  // Muros perimetrales de madera noble
  ctx.fillStyle = '#451a03';
  ctx.fillRect(8, 22, 48, 32);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(10, 24, 44, 28);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(12, 26, 40, 24);

  // Suelo interior de parqué / piedra
  ctx.fillStyle = '#c79a63';
  ctx.fillRect(14, 28, 36, 20);

  // Puerta de entrada
  ctx.fillStyle = '#451a03';
  ctx.fillRect(26, 42, 12, 12);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(28, 44, 8, 10);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(33, 48, 2, 2);

  // Cajas y barriles apilados fuera (como en la imagen de referencia)
  // Barril
  ctx.fillStyle = '#451a03';
  ctx.fillRect(10, 44, 6, 8);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(11, 45, 4, 6);
  ctx.fillStyle = '#ca8a04'; // Aros dorados
  ctx.fillRect(10, 46, 6, 1); ctx.fillRect(10, 49, 6, 1);

  // Caja de madera
  ctx.fillStyle = '#78350f';
  ctx.fillRect(48, 46, 7, 7);
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(49, 47, 5, 5);

  // Tejado / Cornisa de tejas
  const rMain = roofColor === 'red' ? '#b91c1c' : '#0369a1';
  const rDark = roofColor === 'red' ? '#7f1d1d' : '#075985';
  const rLight = roofColor === 'red' ? '#ef4444' : '#38bdf8';

  ctx.fillStyle = rDark;
  ctx.beginPath();
  ctx.moveTo(6, 24);
  ctx.lineTo(32, 6);
  ctx.lineTo(58, 24);
  ctx.fill();

  ctx.fillStyle = rMain;
  ctx.beginPath();
  ctx.moveTo(8, 22);
  ctx.lineTo(32, 8);
  ctx.lineTo(56, 22);
  ctx.fill();

  ctx.fillStyle = rLight;
  ctx.fillRect(16, 16, 32, 2);
  ctx.fillRect(22, 11, 20, 2);

  // Chimenea de piedra
  ctx.fillStyle = '#3a4a5e';
  ctx.fillRect(42, 8, 6, 12);
  ctx.fillStyle = '#5a718c';
  ctx.fillRect(41, 6, 8, 3);

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * ⚒️ Forja del Herrero con Yunque y Fuego (tile 10 - 48x48 px)
 */
export function getForgeCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.38)';
  ctx.fillRect(4, 38, 40, 6);

  ctx.fillStyle = '#334155';
  ctx.fillRect(6, 12, 36, 28);
  ctx.fillStyle = '#475569';
  ctx.fillRect(8, 14, 32, 24);

  // Horno con fuego ardiente
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(16, 22, 16, 14);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(18, 24, 12, 10);
  ctx.fillStyle = '#fbbf24';
  const flicker = Math.sin(time * 8) * 2;
  ctx.fillRect(20, 26 + flicker, 8, 6);

  // Yunque
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(34, 28, 8, 10);

  return canvas;
}

/**
 * 🌟 Santuario / Portal Rúnico (tile 8 y 11 - 48x48 px)
 */
export function getShrineCanvas(isBoss: boolean = false, time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.38)';
  ctx.fillRect(4, 38, 40, 6);

  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(8, 34, 32, 6);
  ctx.fillRect(12, 30, 24, 4);

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(12, 14, 4, 16);
  ctx.fillRect(32, 14, 4, 16);

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(8, 14);
  ctx.lineTo(24, 4);
  ctx.lineTo(40, 14);
  ctx.fill();

  const pulse = Math.sin(time * 4) * 2;
  ctx.fillStyle = isBoss ? '#ef4444' : '#38bdf8';
  ctx.fillRect(22, 18 + pulse, 4, 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(23, 19 + pulse, 2, 2);

  return canvas;
}

/**
 * 🏮 Farola Rúnica (tile 17 - 24x36 px)
 */
export function getStreetLampCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 24;
  canvas.height = 36;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(12, 32, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(11, 8, 2, 24);
  ctx.fillRect(9, 30, 6, 2);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(8, 4, 8, 8);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(9, 5, 6, 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(11, 7, 2, 2);

  return canvas;
}

/**
 * 🪦 Lápida de Cementerio (tile 16 - 24x28 px)
 */
export function getGraveyardCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 24;
  canvas.height = 28;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(4, 22, 16, 4);

  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(12, 10, 6, Math.PI, 0);
  ctx.rect(6, 10, 12, 12);
  ctx.fill();

  ctx.fillStyle = '#64748b';
  ctx.fillRect(7, 10, 10, 10);

  ctx.fillStyle = '#334155';
  ctx.fillRect(11, 8, 2, 8);
  ctx.fillRect(9, 10, 6, 2);

  return canvas;
}

/**
 * 🏛️ Columna de Ruina Clásica (tile 18 - 24x36 px)
 */
export function getRuinedPillarCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 24;
  canvas.height = 36;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(2, 30, 20, 4);

  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(6, 8, 12, 22);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(8, 8, 3, 22);
  ctx.fillRect(13, 8, 3, 22);

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(4, 4, 16, 4);
  ctx.fillRect(4, 28, 16, 4);

  return canvas;
}

/**
 * 🔥 Hoguera / Campfire (tile 19 - 28x28 px)
 */
export function getCampfireCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 28;
  canvas.height = 28;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.ellipse(14, 18, 10, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#451a03';
  ctx.fillRect(8, 16, 12, 3);
  ctx.fillRect(12, 14, 4, 8);

  const flick = Math.sin(time * 10) * 2;
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(10, 8 + flick, 8, 8);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(11, 10 + flick, 6, 6);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(13, 12 + flick, 2, 3);

  return canvas;
}

/**
 * 🌾 Molino de Viento (tile 6 - 48x56 px)
 */
export function getWindmillCanvas(angle: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 56;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(24, 50, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(12, 52);
  ctx.lineTo(16, 20);
  ctx.lineTo(32, 20);
  ctx.lineTo(36, 52);
  ctx.fill();

  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.moveTo(14, 20);
  ctx.lineTo(24, 8);
  ctx.lineTo(34, 20);
  ctx.fill();

  ctx.save();
  ctx.translate(24, 20);
  ctx.rotate(angle);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-2, -18, 4, 36);
  ctx.fillRect(-18, -2, 36, 4);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(2, -16, 8, 12);
  ctx.fillRect(2, 4, 8, 12);
  ctx.fillRect(-16, 2, 12, 8);
  ctx.fillRect(4, -10, 12, 8);
  ctx.restore();

  return canvas;
}

/**
 * 💎 Cofre del Tesoro Dorado (tile 7 - 28x28 px)
 */
export function getChestCanvas(isOpen: boolean = false): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 28;
  canvas.height = 28;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(2, 22, 24, 4);

  if (isOpen) {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(4, 12, 20, 12);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(6, 14, 16, 8);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(4, 4, 20, 6);
  } else {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(4, 8, 20, 16);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(6, 10, 16, 12);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(4, 12, 20, 2);
    ctx.fillRect(4, 8, 2, 16);
    ctx.fillRect(22, 8, 2, 16);
    ctx.fillRect(12, 12, 4, 6);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(13, 14, 2, 2);
  }

  return canvas;
}
