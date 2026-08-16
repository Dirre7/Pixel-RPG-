// ==============================================================================
// 🗺️ GENERADOR COMPLETO DE TILESETS Y PROPS PIXEL ART 2D RETRO (8 BIOMAS)
// ==============================================================================

const tileCache = new Map<string, HTMLCanvasElement>();

/**
 * Genera una baldosa de suelo 2D (16x16) adaptada a cada uno de los 8 biomas
 */
export function getTileCanvas(tileType: number, zoneId: string, animPhase: number = 0): HTMLCanvasElement {
  const cacheKey = `tile_${zoneId}_${tileType}_${Math.floor(animPhase % 4)}`;
  if (tileCache.has(cacheKey)) {
    return tileCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const phase = Math.floor(animPhase % 4);

  // ---------------------------------------------------------------------------
  // 0. SUELO BASE POR BIOMA
  // ---------------------------------------------------------------------------
  if (tileType === 0) {
    if (zoneId === 'zone_forest') {
      // Hierba verde bosque
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(2, 3, 2, 2);
      ctx.fillRect(10, 8, 2, 2);
      ctx.fillRect(6, 12, 2, 2);
      ctx.fillStyle = '#14532d';
      ctx.fillRect(4, 4, 1, 1);
    } else if (zoneId === 'zone_cave') {
      // Roca cavernosa gris azulada
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#475569';
      ctx.fillRect(2, 2, 4, 3);
      ctx.fillRect(9, 8, 5, 4);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 15, 16, 1);
    } else if (zoneId === 'zone_swamp') {
      // Lodo cenagoso verdoso oscuro
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#292524';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#14532d'; // Musgo pantanoso
      ctx.fillRect(3, 4, 4, 3);
      ctx.fillRect(10, 9, 3, 2);
    } else if (zoneId === 'zone_volcano') {
      // Ceniza volcánica oscura con grieta tenue
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#27272a';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillStyle = '#dc2626'; // Grieta caliente
      ctx.fillRect(6, 6, 3, 1);
      ctx.fillRect(8, 7, 2, 1);
    } else if (zoneId === 'zone_tundra') {
      // Nieve nórdica blanca y hielo
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(2, 3, 4, 3);
      ctx.fillRect(9, 9, 5, 3);
      ctx.fillStyle = '#bae6fd'; // Escarcha azul
      ctx.fillRect(6, 6, 2, 2);
    } else if (zoneId === 'zone_castle') {
      // Adoquines de fortaleza imperial
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(1, 1, 6, 6);
      ctx.fillRect(8, 1, 7, 6);
      ctx.fillRect(1, 8, 7, 7);
      ctx.fillRect(9, 8, 6, 7);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(2, 2, 4, 1);
      ctx.fillRect(9, 9, 4, 1);
    } else if (zoneId === 'zone_void') {
      // Polvo estelar púrpura del Vacío
      ctx.fillStyle = '#0f0e17';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#2e1065';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillStyle = '#a855f7'; // Chispa cósmica
      ctx.fillRect((phase * 4) % 14, 4, 2, 2);
    } else {
      // Sagrario de los Antiguos: Mármol blanco y oro divino
      ctx.fillStyle = '#fef08a'; // Borde dorado
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#ffffff'; // Mármol puro
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#fef9c3';
      ctx.fillRect(3, 3, 10, 10);
      ctx.fillStyle = '#eab308'; // Estrella sagrada
      ctx.fillRect(7, 7, 2, 2);
    }
  }
  // ---------------------------------------------------------------------------
  // 2. CAMINOS Y SENDEROS POR BIOMA
  // ---------------------------------------------------------------------------
  else if (tileType === 2) {
    if (zoneId === 'zone_forest' || zoneId === 'zone_swamp') {
      // Camino de tierra batida
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(3, 4, 3, 2);
      ctx.fillRect(9, 8, 4, 2);
    } else if (zoneId === 'zone_cave' || zoneId === 'zone_castle') {
      // Calzada de losas de piedra
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#475569';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(2, 2, 12, 5);
      ctx.fillRect(2, 9, 12, 5);
    } else if (zoneId === 'zone_volcano') {
      // Sendero de obsidiana negra
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#27272a';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(4, 4, 2, 1);
    } else if (zoneId === 'zone_tundra') {
      // Sendero despejado de grava helada
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(1, 1, 14, 14);
    } else if (zoneId === 'zone_void') {
      // Puente de energía luminiscente
      ctx.fillStyle = '#4c1d95';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(0, 7, 16, 2);
    } else {
      // Pasarela de oro divino
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(2, 2, 12, 12);
    }
  }
  // ---------------------------------------------------------------------------
  // 3. LÍQUIDOS (AGUA / LAVA / CIÉNAGA / VACÍO)
  // ---------------------------------------------------------------------------
  else if (tileType === 3) {
    if (zoneId === 'zone_volcano') {
      // Lava incandescente
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 2 + phase, 16, 4);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(3 + (phase * 2) % 12, 4, 4, 2);
    } else if (zoneId === 'zone_swamp') {
      // Agua venenosa verde pútrida
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#047857';
      ctx.fillRect(0, (phase * 3) % 14, 16, 3);
      ctx.fillStyle = '#a7f3d0'; // Burbujas de gas
      ctx.fillRect((phase * 5) % 12, 4, 2, 2);
    } else if (zoneId === 'zone_void') {
      // Abismo infinito estrellado
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#581c87';
      ctx.fillRect(2 + phase, 2, 4, 12);
      ctx.fillStyle = '#e879f9';
      ctx.fillRect(8, 8, 1, 1);
    } else if (zoneId === 'zone_tundra') {
      // Lago de hielo puro reflectante
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(3, 3, 10, 2);
    } else {
      // Agua cristalina fluvial
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, (phase * 3) % 14, 16, 2);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect((phase * 4) % 12, 6, 3, 1);
    }
  }
  // ---------------------------------------------------------------------------
  // 12. PARTERRE DE FLORES / JARDÍN REAL
  // ---------------------------------------------------------------------------
  else if (tileType === 12) {
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, 16, 16);
    // Flores rojas, amarillas, azules y blancas
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(3, 3, 2, 2); ctx.fillRect(11, 10, 2, 2);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(10, 3, 2, 2); ctx.fillRect(4, 11, 2, 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(7, 7, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(13, 6, 1, 1); ctx.fillRect(2, 8, 1, 1);
  }
  // ---------------------------------------------------------------------------
  // 13. CAMPO DE CULTIVO / TRIGO DORADO
  // ---------------------------------------------------------------------------
  else if (tileType === 13) {
    ctx.fillStyle = '#78350f'; // Tierra de arado
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = '#ca8a04'; // Trigo
    ctx.fillRect(1, 2, 14, 2);
    ctx.fillRect(1, 6, 14, 2);
    ctx.fillRect(1, 10, 14, 2);
    ctx.fillRect(1, 14, 14, 2);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(3, 2, 2, 2); ctx.fillRect(8, 6, 2, 2); ctx.fillRect(12, 10, 2, 2);
  }
  // ---------------------------------------------------------------------------
  // 14. ZONA DE PELIGRO / GUARIDA ÉLITE (Tierra calcinada con runas oscuras)
  // ---------------------------------------------------------------------------
  else if (tileType === 14) {
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(1, 1, 14, 14);
    ctx.fillStyle = '#7f1d1d'; // Runa de sangre/fuego
    ctx.fillRect(4, 4, 8, 2);
    ctx.fillRect(7, 2, 2, 12);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(7, 7, 2, 2);
  }
  // ---------------------------------------------------------------------------
  // 15. MUELLE DE MADERA / TABLONES DE PUERTO
  // ---------------------------------------------------------------------------
  else if (tileType === 15) {
    ctx.fillStyle = '#0284c7'; // Agua de fondo
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = '#78350f'; // Pilares
    ctx.fillRect(2, 0, 12, 16);
    ctx.fillStyle = '#b45309'; // Tablones
    ctx.fillRect(3, 1, 10, 3);
    ctx.fillRect(3, 5, 10, 3);
    ctx.fillRect(3, 9, 10, 3);
    ctx.fillRect(3, 13, 10, 3);
    ctx.fillStyle = '#fef08a'; // Clavos de metal
    ctx.fillRect(4, 2, 1, 1); ctx.fillRect(11, 2, 1, 1);
  } else {
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, 16, 16);
  }

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🌲 Genera vegetación / obstáculos 2D adaptados a cada bioma (Roble, Pino nevado, Estalagmitas, Columnas de basalto, etc.)
 */
export function getTreeCanvas(zoneId: string): { trunk: HTMLCanvasElement; canopy: HTMLCanvasElement } {
  const cacheKeyTrunk = `tree_trunk_${zoneId}`;
  const cacheKeyCanopy = `tree_canopy_${zoneId}`;

  if (tileCache.has(cacheKeyTrunk) && tileCache.has(cacheKeyCanopy)) {
    return {
      trunk: tileCache.get(cacheKeyTrunk)!,
      canopy: tileCache.get(cacheKeyCanopy)!,
    };
  }

  const trunk = document.createElement('canvas');
  trunk.width = 32;
  trunk.height = 24;
  const tCtx = trunk.getContext('2d')!;
  tCtx.imageSmoothingEnabled = false;

  const canopy = document.createElement('canvas');
  canopy.width = 32;
  canopy.height = 32;
  const cCtx = canopy.getContext('2d')!;
  cCtx.imageSmoothingEnabled = false;

  // Sombra base
  tCtx.fillStyle = 'rgba(0,0,0,0.3)';
  tCtx.beginPath();
  tCtx.ellipse(16, 20, 10, 4, 0, 0, Math.PI * 2);
  tCtx.fill();

  if (zoneId === 'zone_volcano') {
    // Columna de basalto volcánico
    tCtx.fillStyle = '#18181b';
    tCtx.fillRect(10, 4, 12, 16);
    tCtx.fillStyle = '#3f3f46';
    tCtx.fillRect(12, 4, 8, 16);

    cCtx.fillStyle = '#7f1d1d';
    cCtx.beginPath();
    cCtx.arc(16, 16, 14, 0, Math.PI * 2);
    cCtx.fill();
    cCtx.fillStyle = '#dc2626';
    cCtx.fillRect(12, 10, 8, 4);
  } else if (zoneId === 'zone_tundra') {
    // Pino nevado
    tCtx.fillStyle = '#451a03';
    tCtx.fillRect(13, 6, 6, 14);

    cCtx.fillStyle = '#065f46';
    cCtx.beginPath();
    cCtx.moveTo(16, 2);
    cCtx.lineTo(4, 28);
    cCtx.lineTo(28, 28);
    cCtx.fill();

    // Nieve sobre las ramas
    cCtx.fillStyle = '#ffffff';
    cCtx.fillRect(14, 2, 4, 3);
    cCtx.fillRect(10, 12, 12, 4);
    cCtx.fillRect(6, 22, 20, 4);
  } else if (zoneId === 'zone_cave') {
    // Estalagmita de piedra y cristal
    tCtx.fillStyle = '#1e293b';
    tCtx.fillRect(11, 8, 10, 12);

    cCtx.fillStyle = '#475569';
    cCtx.beginPath();
    cCtx.moveTo(16, 2);
    cCtx.lineTo(8, 28);
    cCtx.lineTo(24, 28);
    cCtx.fill();
    cCtx.fillStyle = '#38bdf8'; // Veta de cristal brillante
    cCtx.fillRect(14, 10, 4, 10);
  } else if (zoneId === 'zone_void') {
    // Monolito del Vacío con runas púrpuras
    tCtx.fillStyle = '#09090b';
    tCtx.fillRect(10, 4, 12, 16);

    cCtx.fillStyle = '#581c87';
    cCtx.fillRect(8, 4, 16, 24);
    cCtx.fillStyle = '#c084fc';
    cCtx.fillRect(14, 8, 4, 16);
  } else if (zoneId === 'zone_sanctuary') {
    // Columna de mármol y capitel dorado
    tCtx.fillStyle = '#cbd5e1';
    tCtx.fillRect(10, 6, 12, 14);

    cCtx.fillStyle = '#facc15';
    cCtx.fillRect(6, 4, 20, 6);
    cCtx.fillStyle = '#ffffff';
    cCtx.fillRect(8, 10, 16, 18);
  } else {
    // Roble clásico de bosque / pantano
    const foliageMain = zoneId === 'zone_swamp' ? '#14532d' : '#15803d';
    const foliageLight = zoneId === 'zone_swamp' ? '#166534' : '#22c55e';
    const foliageDark = zoneId === 'zone_swamp' ? '#052e16' : '#14532d';

    tCtx.fillStyle = '#451a03';
    tCtx.fillRect(12, 2, 8, 18);
    tCtx.fillStyle = '#78350f';
    tCtx.fillRect(14, 2, 4, 18);

    cCtx.fillStyle = foliageDark;
    cCtx.beginPath();
    cCtx.arc(16, 16, 15, 0, Math.PI * 2);
    cCtx.fill();

    cCtx.fillStyle = foliageMain;
    cCtx.beginPath();
    cCtx.arc(16, 14, 13, 0, Math.PI * 2);
    cCtx.fill();

    cCtx.fillStyle = foliageLight;
    cCtx.beginPath();
    cCtx.arc(13, 10, 7, 0, Math.PI * 2);
    cCtx.fill();
  }

  tileCache.set(cacheKeyTrunk, trunk);
  tileCache.set(cacheKeyCanopy, canopy);

  return { trunk, canopy };
}

/**
 * 🏠 Genera una Casita de Aldea / Taberna Pixel Art (48x48)
 */
export function getCottageCanvas(roofColor: 'red' | 'blue' = 'red'): HTMLCanvasElement {
  const cacheKey = `cottage_${roofColor}`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(4, 40, 40, 6);

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(8, 20, 32, 22);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(8, 38, 32, 4);

  ctx.fillStyle = '#78350f';
  ctx.fillRect(8, 20, 3, 22);
  ctx.fillRect(37, 20, 3, 22);
  ctx.fillRect(8, 20, 32, 3);

  ctx.fillStyle = '#451a03';
  ctx.fillRect(20, 28, 8, 14);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(21, 29, 6, 13);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(25, 35, 1, 2);

  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(11, 25, 6, 6);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(13, 25, 1, 6);
  ctx.fillRect(11, 27, 6, 1);

  const rMain = roofColor === 'red' ? '#dc2626' : '#0284c7';
  const rDark = roofColor === 'red' ? '#991b1b' : '#0369a1';
  const rLight = roofColor === 'red' ? '#ef4444' : '#38bdf8';

  ctx.fillStyle = rDark;
  ctx.beginPath();
  ctx.moveTo(4, 20);
  ctx.lineTo(24, 4);
  ctx.lineTo(44, 20);
  ctx.fill();

  ctx.fillStyle = rMain;
  ctx.beginPath();
  ctx.moveTo(6, 19);
  ctx.lineTo(24, 6);
  ctx.lineTo(42, 19);
  ctx.fill();

  ctx.fillStyle = rLight;
  ctx.fillRect(12, 14, 8, 3);

  ctx.fillStyle = '#64748b';
  ctx.fillRect(30, 6, 6, 10);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(29, 5, 8, 2);

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🌾 Genera un Molino de Viento Pixel Art (48x56) con aspas giratorias
 */
export function getWindmillCanvas(angle: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 56;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
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

  ctx.fillStyle = '#451a03';
  ctx.fillRect(21, 40, 6, 12);

  const cx = 24;
  const cy = 18;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  ctx.fillStyle = '#78350f';
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.fillRect(-1, 0, 3, 20);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(2, 4, 7, 14);
    ctx.fillStyle = '#78350f';
  }

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  return canvas;
}

/**
 * 🪣 Genera un Pozo de Agua Dulce Pixel Art (28x32)
 */
export function getWaterWellCanvas(): HTMLCanvasElement {
  const cacheKey = 'water_well';
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 28;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(14, 28, 11, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#64748b';
  ctx.fillRect(4, 16, 20, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(6, 17, 16, 2);

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(6, 19, 16, 4);

  ctx.fillStyle = '#78350f';
  ctx.fillRect(4, 6, 3, 12);
  ctx.fillRect(21, 6, 3, 12);

  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.moveTo(2, 8);
  ctx.lineTo(14, 2);
  ctx.lineTo(26, 8);
  ctx.fill();

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🔨 Genera una Forja Mayor de Herrero Pixel Art (36x36)
 */
export function getForgeCanvas(timePhase: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 36;
  canvas.height = 36;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(2, 30, 32, 5);

  ctx.fillStyle = '#475569';
  ctx.fillRect(4, 12, 18, 20);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(6, 18, 14, 12);

  const flicker = Math.sin(timePhase * 8) * 2;
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(7, 20 + flicker, 12, 8);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(9, 22 + flicker, 8, 5);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(11, 24, 4, 3);

  ctx.fillStyle = '#334155';
  ctx.fillRect(24, 20, 10, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(22, 18, 12, 4);

  return canvas;
}

/**
 * 🔮 Genera un Santuario / Portal de Jefe Pixel Art (32x40)
 */
export function getShrineCanvas(isBossPortal: boolean = false, timePhase: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 40;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = '#334155';
  ctx.fillRect(4, 28, 24, 10);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(6, 26, 20, 3);

  ctx.fillStyle = '#475569';
  ctx.fillRect(4, 8, 4, 18);
  ctx.fillRect(24, 8, 4, 18);

  const floatY = Math.sin(timePhase * 3) * 3;
  const glowColor = isBossPortal ? '#ef4444' : '#38bdf8';
  const lightColor = isBossPortal ? '#fca5a5' : '#e0f2fe';

  ctx.fillStyle = glowColor;
  ctx.beginPath();
  ctx.moveTo(16, 6 + floatY);
  ctx.lineTo(22, 18 + floatY);
  ctx.lineTo(16, 24 + floatY);
  ctx.lineTo(10, 18 + floatY);
  ctx.fill();

  ctx.fillStyle = lightColor;
  ctx.fillRect(15, 14 + floatY, 3, 4);

  return canvas;
}

/**
 * 🎁 Genera un Cofre del Tesoro Pixel Art (16x16)
 */
export function getChestCanvas(isOpen: boolean): HTMLCanvasElement {
  const cacheKey = `chest_${isOpen ? 'open' : 'closed'}`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(1, 13, 14, 3);

  ctx.fillStyle = '#78350f';
  ctx.fillRect(2, 5, 12, 9);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(3, 6, 10, 7);

  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(2, 5, 12, 2);
  ctx.fillRect(7, 8, 2, 3);

  if (isOpen) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(3, 4, 10, 3);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(5, 5, 6, 2);
  }

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🏮 Genera una Farola de Camino / Poste con Farol (16x28)
 */
export function getStreetLampCanvas(timePhase: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 28;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(4, 25, 8, 3);

  // Poste de madera / forja
  ctx.fillStyle = '#334155';
  ctx.fillRect(7, 6, 2, 20);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(6, 4, 4, 3);
  ctx.fillRect(5, 7, 6, 2);

  // Farol con luz parpadeante
  const flicker = Math.sin(timePhase * 6) * 1.5;
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(5, 9, 6, 6);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(6, 10 + flicker * 0.5, 4, 4);

  return canvas;
}

/**
 * 🪦 Genera una Lápida de Cementerio / Cruz de Piedra (16x20)
 */
export function getGraveyardCanvas(): HTMLCanvasElement {
  const cacheKey = 'graveyard_tombstone';
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 20;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(2, 17, 12, 3);

  ctx.fillStyle = '#475569';
  ctx.fillRect(4, 4, 8, 14);
  ctx.beginPath();
  ctx.arc(8, 5, 4, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = '#64748b';
  ctx.fillRect(5, 5, 6, 12);
  ctx.fillStyle = '#1e293b'; // Cruz grabada
  ctx.fillRect(7, 7, 2, 6);
  ctx.fillRect(5, 9, 6, 2);

  // Musgo
  ctx.fillStyle = '#15803d';
  ctx.fillRect(4, 14, 2, 3);

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🏛️ Genera una Columna de Ruina Clásica (20x32)
 */
export function getRuinedPillarCanvas(): HTMLCanvasElement {
  const cacheKey = 'ruined_pillar';
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 20;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(2, 28, 16, 4);

  // Base y fuste
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(3, 24, 14, 6);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(5, 6, 10, 20);
  ctx.fillStyle = '#64748b'; // Grietas
  ctx.fillRect(7, 12, 2, 4);
  ctx.fillRect(11, 18, 3, 2);

  // Capitel roto
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(4, 2, 12, 5);

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🔥 Genera una Fogata de Campamento Encendida (20x20)
 */
export function getCampfireCanvas(timePhase: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 20;
  canvas.height = 20;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Piedras en círculo
  ctx.fillStyle = '#475569';
  ctx.fillRect(4, 14, 12, 4);
  ctx.fillRect(3, 10, 4, 6);
  ctx.fillRect(13, 10, 4, 6);

  // Leños
  ctx.fillStyle = '#78350f';
  ctx.fillRect(6, 12, 8, 3);

  // Llamas animadas
  const flick = Math.sin(timePhase * 10) * 2;
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(7, 6 + flick, 6, 8);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(8, 4 + flick, 4, 6);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(9, 6 + flick, 2, 3);

  return canvas;
}
