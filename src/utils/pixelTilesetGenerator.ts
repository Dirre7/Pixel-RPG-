// ==============================================================================
// 🗺️ GENERADOR MAESTRO DE TILESETS, EDIFICIOS Y PROPS RETRO 16/32-BIT (HD PIXEL ART)
// Estilo Top-Down Clásico: Stardew Valley / RPG Maker HD / Golden Sun
// ==============================================================================

const tileCache = new Map<string, HTMLCanvasElement>();

/**
 * Genera una baldosa de suelo 2D (32x32) con sombreado rico adaptado a cada uno de los 8 biomas
 */
export function getTileCanvas(tileType: number, zoneId: string, animPhase: number = 0): HTMLCanvasElement {
  const cacheKey = `tile_stardew_${zoneId}_${tileType}_${Math.floor(animPhase % 4)}`;
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
  // 0. SUELO BASE: CÉSPED FRONDOSO VIBRANTE
  // ---------------------------------------------------------------------------
  if (tileType === 0) {
    if (zoneId === 'zone_forest') {
      // Base verde pradera cálida y suave
      ctx.fillStyle = '#4a9b2b';
      ctx.fillRect(0, 0, 32, 32);

      // Manchas orgánicas de luz y sombra en la pradera
      ctx.fillStyle = '#56ad32';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillRect(18, 18, 12, 12);
      ctx.fillStyle = '#3c8322';
      ctx.fillRect(16, 2, 14, 12);
      ctx.fillRect(2, 16, 14, 14);

      // Briznas finas de hierba viva
      ctx.fillStyle = '#68c73c';
      ctx.fillRect(6, 6, 2, 3); ctx.fillRect(22, 8, 2, 3);
      ctx.fillRect(10, 22, 2, 3); ctx.fillRect(24, 20, 2, 3);

      ctx.fillStyle = '#2d6318';
      ctx.fillRect(7, 8, 2, 2); ctx.fillRect(23, 10, 2, 2);
      ctx.fillRect(11, 24, 2, 2);

      // Margaritas y flores silvestres
      if (phase % 4 === 0) {
        ctx.fillStyle = '#ffffff'; ctx.fillRect(14, 12, 2, 2);
        ctx.fillStyle = '#fde047'; ctx.fillRect(15, 13, 1, 1);
      } else if (phase % 4 === 1) {
        ctx.fillStyle = '#f43f5e'; ctx.fillRect(24, 14, 2, 2);
      } else if (phase % 4 === 2) {
        ctx.fillStyle = '#38bdf8'; ctx.fillRect(12, 22, 2, 2);
      }
    } else if (zoneId === 'zone_cave') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#475569';
      ctx.fillRect(2, 2, 12, 12); ctx.fillRect(18, 18, 12, 12);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 15, 32, 2); ctx.fillRect(15, 0, 2, 32);
    } else if (zoneId === 'zone_swamp') {
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#292524';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#14532d';
      ctx.fillRect(4, 6, 8, 6); ctx.fillRect(18, 18, 10, 8);
    } else if (zoneId === 'zone_volcano') {
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#27272a';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(6, 14, 8, 2);
    } else if (zoneId === 'zone_tundra') {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(2, 4, 12, 8); ctx.fillRect(18, 16, 12, 10);
    } else if (zoneId === 'zone_castle') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#475569';
      ctx.fillRect(2, 2, 13, 13); ctx.fillRect(17, 2, 13, 13);
      ctx.fillRect(2, 17, 13, 13); ctx.fillRect(17, 17, 13, 13);
    } else if (zoneId === 'zone_void') {
      ctx.fillStyle = '#090814';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#1e1035';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect((phase * 7) % 28, 8, 3, 3);
    } else {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(14, 14, 4, 4);
    }
  }
  // ---------------------------------------------------------------------------
  // 2. CALZADAS Y PLAZAS DE ADOQUINES MEDIEVALES CÁLIDOS (SEAMLESS 2.5D)
  // ---------------------------------------------------------------------------
  else if (tileType === 2) {
    // Mortero de tierra y piedra cálida continua
    ctx.fillStyle = '#5c4e3f';
    ctx.fillRect(0, 0, 32, 32);

    // Hiladas de adoquines cálidos con relieve (estilo aldea medieval)
    const drawCobble = (x: number, y: number, w: number, h: number, tone: 'mid' | 'light' | 'dark' = 'mid') => {
      ctx.fillStyle = tone === 'light' ? '#a3937f' : tone === 'dark' ? '#786957' : '#8c7d6b';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = tone === 'light' ? '#bfb09d' : tone === 'dark' ? '#948472' : '#a89885';
      ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
      // Relieve de luz superior izquierda
      ctx.fillStyle = '#dcd0bf';
      ctx.fillRect(x + 1, y + 1, w - 2, 1);
      ctx.fillRect(x + 1, y + 1, 1, h - 2);
      // Sombra inferior derecha
      ctx.fillStyle = '#42372c';
      ctx.fillRect(x + 1, y + h - 1, w - 1, 1);
      ctx.fillRect(x + w - 1, y + 1, 1, h - 1);
    };

    // Fila 1
    drawCobble(0, 0, 10, 7, 'light');
    drawCobble(11, 0, 10, 7, 'mid');
    drawCobble(22, 0, 10, 7, 'dark');

    // Fila 2 (Desplazada)
    drawCobble(0, 8, 14, 7, 'mid');
    drawCobble(15, 8, 10, 7, 'light');
    drawCobble(26, 8, 6, 7, 'mid');

    // Fila 3
    drawCobble(0, 16, 8, 7, 'dark');
    drawCobble(9, 16, 11, 7, 'light');
    drawCobble(21, 16, 11, 7, 'mid');

    // Fila 4 (Desplazada)
    drawCobble(0, 24, 12, 8, 'mid');
    drawCobble(13, 24, 11, 8, 'dark');
    drawCobble(25, 24, 7, 8, 'light');
  }
  // ---------------------------------------------------------------------------
  // 3. CANAL Y ESTANQUES DE AGUA CRISTALINA CON NENÚFARES
  // ---------------------------------------------------------------------------
  else if (tileType === 3) {
    if (zoneId === 'zone_volcano') {
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 4, 32, 10); ctx.fillRect(0, 18, 32, 10);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect((phase * 6) % 28, 6, 8, 4);
    } else if (zoneId === 'zone_swamp') {
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#047857';
      ctx.fillRect(0, 4, 32, 10); ctx.fillRect(0, 18, 32, 10);
      ctx.fillStyle = '#6ee7b7';
      ctx.fillRect((phase * 5) % 28, 8, 3, 3);
    } else {
      // Agua azul profunda con gradiente y nenúfares
      ctx.fillStyle = '#164e87'; // Borde profundo
      ctx.fillRect(0, 0, 32, 32);

      ctx.fillStyle = '#2563eb'; // Azul medio
      ctx.fillRect(2, 2, 28, 28);

      // Reflejos cristalinos de superficie
      ctx.fillStyle = '#93c5fd';
      ctx.fillRect((phase * 6) % 24, 6, 8, 2);
      ctx.fillRect((phase * 8 + 10) % 24, 20, 8, 2);

      // Nenúfar verde flotante con flor
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(20, 14, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(19, 13, 2, 2);
    }
  }
  // ---------------------------------------------------------------------------
  // 12. ARBUSTOS DE BAYAS Y SETOS DE BOJ
  // ---------------------------------------------------------------------------
  else if (tileType === 12) {
    ctx.fillStyle = '#408722';
    ctx.fillRect(0, 0, 32, 32);

    // Arbusto redondeado denso
    ctx.fillStyle = '#1b4332';
    ctx.beginPath();
    ctx.arc(16, 16, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2d6a4f';
    ctx.beginPath();
    ctx.arc(16, 14, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#40916c';
    ctx.beginPath();
    ctx.arc(14, 11, 6, 0, Math.PI * 2);
    ctx.fill();

    // Bayas rojas maduras
    const drawBerry = (bx: number, by: number) => {
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(bx, by, 3, 3);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(bx, by, 2, 2);
      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(bx, by, 1, 1);
    };

    drawBerry(8, 10);
    drawBerry(20, 9);
    drawBerry(12, 18);
    drawBerry(21, 19);
  }
  // ---------------------------------------------------------------------------
  // 13. BANCALES DE CULTIVO CON ZANAHORIAS Y TRIGO
  // ---------------------------------------------------------------------------
  else if (tileType === 13) {
    // Tierra de arado marrón oscuro fértil
    ctx.fillStyle = '#45220a';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#5c3112';
    ctx.fillRect(2, 2, 28, 28);

    // Surco 1: Zanahorias (parte naranja y hojas verdes)
    for (let x = 4; x <= 26; x += 8) {
      // Tierra removida
      ctx.fillStyle = '#381a07';
      ctx.fillRect(x - 1, 4, 6, 6);
      // Zanahoria naranja
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(x + 1, 6, 2, 3);
      // Hojas verdes
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x, 4, 4, 2);
      ctx.fillRect(x + 1, 3, 2, 1);
    }

    // Surco 2: Trigo dorado
    for (let x = 4; x <= 26; x += 8) {
      ctx.fillStyle = '#381a07';
      ctx.fillRect(x - 1, 18, 6, 8);
      // Espiga dorada
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(x + 1, 18, 2, 8);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(x, 18, 4, 3);
      ctx.fillRect(x, 23, 4, 3);
    }
  } else {
    ctx.fillStyle = '#408722';
    ctx.fillRect(0, 0, 32, 32);
  }

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🌲 CIPRESES CÓNICOS Y ROBLES FRONDOSOS (64x64 px)
 */
export function getTreeCanvas(zoneId: string): { trunk: HTMLCanvasElement; canopy: HTMLCanvasElement } {
  const cacheKeyTrunk = `tree_trunk_sd_${zoneId}`;
  const cacheKeyCanopy = `tree_canopy_sd_${zoneId}`;

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

  // Sombra suave elíptica
  tCtx.fillStyle = 'rgba(0,0,0,0.42)';
  tCtx.beginPath();
  tCtx.ellipse(24, 28, 18, 6, 0, 0, Math.PI * 2);
  tCtx.fill();

  // Tronco con corteza
  tCtx.fillStyle = '#3b2211';
  tCtx.fillRect(20, 8, 8, 22);
  tCtx.fillStyle = '#5c3a21';
  tCtx.fillRect(22, 8, 4, 22);

  // Copa Cónica Estilo Ciprés Medieval
  if (zoneId === 'zone_forest' || zoneId === 'zone_castle') {
    // Ciprés cónico denso
    cCtx.fillStyle = '#1b4332';
    cCtx.beginPath();
    cCtx.moveTo(32, 4);
    cCtx.lineTo(14, 56);
    cCtx.lineTo(50, 56);
    cCtx.fill();

    cCtx.fillStyle = '#2d6a4f';
    cCtx.beginPath();
    cCtx.moveTo(32, 8);
    cCtx.lineTo(17, 52);
    cCtx.lineTo(47, 52);
    cCtx.fill();

    cCtx.fillStyle = '#40916c';
    cCtx.beginPath();
    cCtx.arc(32, 24, 8, 0, Math.PI * 2);
    cCtx.fill();
    cCtx.beginPath();
    cCtx.arc(32, 40, 10, 0, Math.PI * 2);
    cCtx.fill();

    cCtx.fillStyle = '#74c69d';
    cCtx.fillRect(30, 18, 4, 4);
    cCtx.fillRect(28, 34, 4, 4);
  } else {
    // Roble majestuoso
    cCtx.fillStyle = '#14361b';
    cCtx.beginPath();
    cCtx.arc(32, 32, 26, 0, Math.PI * 2);
    cCtx.fill();

    cCtx.fillStyle = '#23592c';
    cCtx.beginPath();
    cCtx.arc(32, 28, 22, 0, Math.PI * 2);
    cCtx.fill();

    cCtx.fillStyle = '#3a8747';
    cCtx.beginPath();
    cCtx.arc(26, 22, 12, 0, Math.PI * 2);
    cCtx.fill();
    cCtx.beginPath();
    cCtx.arc(38, 24, 10, 0, Math.PI * 2);
    cCtx.fill();

    cCtx.fillStyle = '#5ec270';
    cCtx.beginPath();
    cCtx.arc(24, 18, 6, 0, Math.PI * 2);
    cCtx.fill();
  }

  tileCache.set(cacheKeyTrunk, trunk);
  tileCache.set(cacheKeyCanopy, canopy);

  return { trunk, canopy };
}

/**
 * 🧱 Muros de Cantería y Contención de Piedra (tile 1)
 */
export function getStoneWallCanvas(): HTMLCanvasElement {
  const cacheKey = `stone_wall_sd`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 36;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(0, 32, 32, 4);

  // Muro frontal de sillares
  ctx.fillStyle = '#3b4a5c';
  ctx.fillRect(0, 10, 32, 22);

  ctx.fillStyle = '#222c38';
  ctx.fillRect(0, 18, 32, 2);
  ctx.fillRect(0, 26, 32, 2);
  ctx.fillRect(15, 10, 2, 8);
  ctx.fillRect(8, 18, 2, 8);
  ctx.fillRect(24, 18, 2, 8);

  // Cornisa superior biselada
  ctx.fillStyle = '#5c728c';
  ctx.fillRect(0, 2, 32, 8);
  ctx.fillStyle = '#8ea3bd';
  ctx.fillRect(0, 2, 32, 2);

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * ⛲ Gran Fuente Circular de Piedra (tile 4 - 64x64 px)
 */
export function getWaterWellCanvas(animPhase: number = 0): HTMLCanvasElement {
  const cacheKey = `fountain_sd_${Math.floor(animPhase % 4)}`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.42)';
  ctx.beginPath();
  ctx.ellipse(32, 40, 28, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#3b4a5c';
  ctx.beginPath();
  ctx.ellipse(32, 34, 26, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5c728c';
  ctx.beginPath();
  ctx.ellipse(32, 32, 24, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#164e87';
  ctx.beginPath();
  ctx.ellipse(32, 33, 18, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(26, 31, 12, 3);
  ctx.fillRect(28, 35, 8, 2);

  // Pilar central
  ctx.fillStyle = '#3b4a5c';
  ctx.fillRect(29, 16, 6, 16);
  ctx.fillStyle = '#8ea3bd';
  ctx.fillRect(28, 14, 8, 4);

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🏡 CASA MEDIEVAL DE ENTRAMADO DE MADERA (FACHWERK) (tiles 5 y 9 - 64x64 px)
 * Con barriles de roble, pila de leña y ventana con luz cálida
 */
export function getCottageCanvas(styleVariant: 'red' | 'blue' | 'straw' | 'stone' = 'red'): HTMLCanvasElement {
  const cacheKey = `cottage_variety_${styleVariant}`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base en el suelo
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(4, 52, 56, 10);

  // Zócalo de piedra basal
  ctx.fillStyle = '#475569';
  ctx.fillRect(8, 46, 48, 8);

  // Fachada
  const wallColor = styleVariant === 'stone' ? '#64748b' : styleVariant === 'straw' ? '#fef3c7' : '#f1f5f9';
  ctx.fillStyle = wallColor;
  ctx.fillRect(8, 22, 48, 24);

  // Vigas de madera oscura (Entramado Fachwerk)
  if (styleVariant !== 'stone') {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(8, 22, 4, 32);
    ctx.fillRect(52, 22, 4, 32);
    ctx.fillRect(8, 22, 48, 3);
    ctx.fillRect(8, 44, 48, 3);
    // Vigas cruzadas en X
    ctx.beginPath();
    ctx.moveTo(12, 25); ctx.lineTo(24, 44);
    ctx.moveTo(24, 25); ctx.lineTo(12, 44);
    ctx.moveTo(40, 25); ctx.lineTo(52, 44);
    ctx.moveTo(52, 25); ctx.lineTo(40, 44);
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    // Sillar de piedra
    ctx.fillStyle = '#334155';
    ctx.fillRect(16, 26, 8, 4);
    ctx.fillRect(36, 34, 8, 4);
    ctx.fillRect(20, 40, 8, 4);
  }

  // Puerta de madera
  ctx.fillStyle = '#451a03';
  ctx.fillRect(26, 30, 12, 22);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(28, 32, 8, 20);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(33, 40, 2, 2);

  // Ventana iluminada con travesaño
  ctx.fillStyle = '#451a03';
  ctx.fillRect(14, 28, 8, 8);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(15, 29, 6, 6);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(17, 29, 1, 6); ctx.fillRect(15, 31, 6, 1);

  // Tejado a dos aguas según estilo
  let rMain = '#a44e2b';
  let rDark = '#6b2d15';
  let rLight = '#c46942';

  if (styleVariant === 'blue') {
    rMain = '#1d4ed8'; rDark = '#1e3a8a'; rLight = '#3b82f6';
  } else if (styleVariant === 'straw') {
    rMain = '#d97706'; rDark = '#92400e'; rLight = '#fbbf24';
  } else if (styleVariant === 'stone') {
    rMain = '#475569'; rDark = '#1e293b'; rLight = '#64748b';
  }

  ctx.fillStyle = rDark;
  ctx.beginPath();
  ctx.moveTo(4, 24); ctx.lineTo(32, 4); ctx.lineTo(60, 24);
  ctx.fill();

  ctx.fillStyle = rMain;
  ctx.beginPath();
  ctx.moveTo(6, 22); ctx.lineTo(32, 6); ctx.lineTo(58, 22);
  ctx.fill();

  // Líneas de tejas / paja
  ctx.fillStyle = rLight;
  ctx.fillRect(14, 16, 36, 2);
  ctx.fillRect(20, 11, 24, 2);

  // Chimenea de sillar
  ctx.fillStyle = '#334155';
  ctx.fillRect(44, 6, 6, 12);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(43, 4, 8, 3);

  // Barriles de roble apilados o pila de leña
  if (styleVariant === 'straw') {
    // Leña apilada
    ctx.fillStyle = '#78350f';
    ctx.fillRect(52, 46, 8, 6);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(53, 47, 6, 4);
  } else {
    // Barriles
    ctx.fillStyle = '#451a03';
    ctx.fillRect(52, 44, 8, 10);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(53, 45, 6, 8);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(53, 47, 6, 1);
    ctx.fillRect(53, 50, 6, 1);
  }

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🏰 AYUNTAMIENTO / MANSIÓN CENTRAL DE PIEDRA (80x70 px)
 * Con escudo heráldico, columnas, arcada y tejado de tejas
 */
export function getStoneManorCanvas(): HTMLCanvasElement {
  const cacheKey = `stone_manor_hd`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 80;
  canvas.height = 70;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0,0,0,0.48)';
  ctx.fillRect(6, 58, 68, 10);

  // Fachada de sillares de piedra gris
  ctx.fillStyle = '#475569';
  ctx.fillRect(10, 24, 60, 36);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(12, 26, 56, 32);

  // Columnas gemelas de la entrada
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(30, 28, 4, 32);
  ctx.fillRect(46, 28, 4, 32);

  // Portal de arco
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(40, 42, 6, Math.PI, 0);
  ctx.rect(34, 42, 12, 18);
  ctx.fill();

  // Escudo heráldico dorado sobre la puerta
  ctx.fillStyle = '#b45309';
  ctx.fillRect(37, 28, 6, 8);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(38, 29, 4, 5);

  // Ventanas de saetera
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(18, 34, 4, 10);
  ctx.fillRect(58, 34, 4, 10);

  // Tejado de terracota a dos aguas
  ctx.fillStyle = '#6b2d15';
  ctx.beginPath();
  ctx.moveTo(6, 26); ctx.lineTo(40, 6); ctx.lineTo(74, 26);
  ctx.fill();

  ctx.fillStyle = '#a44e2b';
  ctx.beginPath();
  ctx.moveTo(8, 24); ctx.lineTo(40, 8); ctx.lineTo(72, 24);
  ctx.fill();

  ctx.fillStyle = '#c46942';
  ctx.fillRect(20, 18, 40, 2);
  ctx.fillRect(28, 13, 24, 2);

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🍎 PUESTO DE MERCADO 2.5D CON TOLDO DE RAYAS Y CAJONES DE VÍVERES (48x48 px)
 */
export function getMarketStallCanvas(stallVariant: number = 0): HTMLCanvasElement {
  const v = stallVariant % 3;
  const cacheKey = `market_stall_25d_${v}`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra de contacto en el suelo
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(24, 42, 20, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Barril lateral
  ctx.fillStyle = '#451a03';
  ctx.fillRect(4, 32, 7, 10);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(5, 33, 5, 8);
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(5, 35, 5, 1); ctx.fillRect(5, 39, 5, 1);

  // Mostrador de madera maciza en 2.5D
  ctx.fillStyle = '#451a03';
  ctx.fillRect(10, 24, 30, 18);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(11, 26, 28, 15);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(10, 24, 30, 3); // Borde superior biselado

  // Cajón 1: Manzanas rojas / Pescado / Pan
  ctx.fillStyle = '#451a03';
  ctx.fillRect(13, 25, 11, 7);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(14, 26, 9, 5);
  if (v === 0) {
    ctx.fillStyle = '#dc2626'; // Manzanas
    ctx.fillRect(15, 25, 7, 4);
    ctx.fillStyle = '#f87171';
    ctx.fillRect(16, 25, 2, 2);
  } else if (v === 1) {
    ctx.fillStyle = '#38bdf8'; // Pescado
    ctx.fillRect(15, 26, 7, 3);
  } else {
    ctx.fillStyle = '#d97706'; // Panes dorados
    ctx.fillRect(15, 25, 7, 4);
  }

  // Cajón 2: Verduras / Naranjas / Uvas
  ctx.fillStyle = '#451a03';
  ctx.fillRect(26, 25, 11, 7);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(27, 26, 9, 5);
  if (v === 0) {
    ctx.fillStyle = '#16a34a'; // Verduras
    ctx.fillRect(28, 25, 7, 4);
  } else if (v === 1) {
    ctx.fillStyle = '#ea580c'; // Naranjas
    ctx.fillRect(28, 25, 7, 4);
  } else {
    ctx.fillStyle = '#9333ea'; // Uvas
    ctx.fillRect(28, 25, 7, 4);
  }

  // Postes de madera de soporte
  ctx.fillStyle = '#451a03';
  ctx.fillRect(11, 10, 3, 20);
  ctx.fillRect(36, 10, 3, 20);

  // Farolillo colgante del poste
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(10, 18, 3, 4);

  // Toldo de tela a rayas en 2.5D con festón ondulado
  const stripeColor = v === 0 ? '#15803d' : v === 1 ? '#b91c1c' : '#0369a1';
  const shadowColor = v === 0 ? '#166534' : v === 1 ? '#7f1d1d' : '#075985';

  for (let i = 8; i <= 36; i += 8) {
    ctx.fillStyle = stripeColor;
    ctx.fillRect(i, 6, 4, 14);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(i + 4, 6, 4, 14);
  }

  // Sombra y festón inferior del toldo
  ctx.fillStyle = shadowColor;
  ctx.fillRect(8, 18, 32, 4);
  for (let i = 8; i <= 36; i += 4) {
    ctx.fillStyle = stripeColor;
    ctx.fillRect(i, 21, 3, 2);
  }

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🛡️ EXPOSITOR DE ARMAS Y ESCUDOS (32x32 px)
 */
export function getWeaponRackCanvas(): HTMLCanvasElement {
  const cacheKey = `weapon_rack_hd`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(4, 26, 24, 4);

  // Soporte de madera
  ctx.fillStyle = '#78350f';
  ctx.fillRect(4, 12, 3, 16);
  ctx.fillRect(25, 12, 3, 16);
  ctx.fillRect(4, 16, 24, 3);

  // Espadas y lanzas de acero
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(10, 6, 2, 20);
  ctx.fillRect(16, 4, 2, 22);
  ctx.fillRect(22, 6, 2, 20);

  // Guardas doradas
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(9, 18, 4, 2);
  ctx.fillRect(15, 16, 4, 2);
  ctx.fillRect(21, 18, 4, 2);

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🐔 GALLINA ANIMADA DE GRANJA (16x16 px)
 */
export function getChickenCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const peck = Math.sin(time * 6) > 0.5 ? 1 : 0;

  // Cuerpo blanco/amarillo
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(4, 6 + peck, 8, 6);

  // Cabeza
  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(10, 3 + peck, 4, 4);

  // Pico
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(14, 5 + peck, 2, 2);

  // Cresta roja
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(11, 1 + peck, 3, 2);

  // Patitas
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(6, 12, 2, 3);
  ctx.fillRect(9, 12, 2, 3);

  return canvas;
}

/**
 * ⚒️ FORJA DEL HERRERO (48x48 px)
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

  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(16, 22, 16, 14);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(18, 24, 12, 10);
  ctx.fillStyle = '#fbbf24';
  const flicker = Math.sin(time * 8) * 2;
  ctx.fillRect(20, 26 + flicker, 8, 6);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(34, 28, 8, 10);

  return canvas;
}

/**
 * 🌟 SANTUARIO / PORTAL RÚNICO (48x48 px)
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
  ctx.moveTo(8, 14); ctx.lineTo(24, 4); ctx.lineTo(40, 14);
  ctx.fill();

  const pulse = Math.sin(time * 4) * 2;
  ctx.fillStyle = isBoss ? '#ef4444' : '#38bdf8';
  ctx.fillRect(22, 18 + pulse, 4, 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(23, 19 + pulse, 2, 2);

  return canvas;
}

/**
 * 🏮 FAROLA RÚNICA DE FORJA (24x36 px)
 */
export function getStreetLampCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 56;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra elíptica realista anclada al suelo
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(24, 48, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Halo de luz dorada en el suelo
  const glow = ctx.createRadialGradient(24, 48, 2, 24, 48, 22);
  glow.addColorStop(0, 'rgba(253, 224, 71, 0.22)');
  glow.addColorStop(0.5, 'rgba(251, 191, 36, 0.08)');
  glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(24, 48, 22, 0, Math.PI * 2);
  ctx.fill();

  // Base de hierro forjado con remaches
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(20, 46, 8, 3);
  ctx.fillStyle = '#334155';
  ctx.fillRect(21, 45, 6, 2);

  // Poste de hierro esbelto
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(23, 18, 2, 28);
  ctx.fillStyle = '#475569';
  ctx.fillRect(23, 18, 1, 28); // Brillo metálico izquierdo

  // Soporte ornamental superior
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(20, 16, 8, 2);
  ctx.fillRect(21, 14, 6, 2);

  // Farol de bronce y cristal con luz cálida
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(19, 6, 10, 8);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(20, 7, 8, 6);

  // Llama interior titilante
  const flicker = Math.sin(time * 8) * 0.5 + 0.5;
  ctx.fillStyle = flicker > 0.4 ? '#ffffff' : '#fef08a';
  ctx.fillRect(22, 9, 4, 3);

  // Caperuza del farol y remate
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(18, 4, 12, 2);
  ctx.fillRect(23, 2, 2, 2);

  return canvas;
}

/**
 * 🪦 LÁPIDA DE CEMENTERIO (24x28 px)
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
 * 🏛️ COLUMNA DE RUINA CLÁSICA (24x36 px)
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
  ctx.fillRect(8, 8, 3, 22); ctx.fillRect(13, 8, 3, 22);

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(4, 4, 16, 4);
  ctx.fillRect(4, 28, 16, 4);

  return canvas;
}

/**
 * 🔥 HOGUERA / CAMPFIRE (28x28 px)
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
 * 🌾 MOLINO DE VIENTO (48x56 px)
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
  ctx.moveTo(12, 52); ctx.lineTo(16, 20); ctx.lineTo(32, 20); ctx.lineTo(36, 52);
  ctx.fill();

  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.moveTo(14, 20); ctx.lineTo(24, 8); ctx.lineTo(34, 20);
  ctx.fill();

  ctx.save();
  ctx.translate(24, 20);
  ctx.rotate(angle);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-2, -18, 4, 36);
  ctx.fillRect(-18, -2, 36, 4);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(2, -16, 8, 12); ctx.fillRect(2, 4, 8, 12);
  ctx.fillRect(-16, 2, 12, 8); ctx.fillRect(4, -10, 12, 8);
  ctx.restore();

  return canvas;
}

/**
 * 💎 COFRE DEL TESORO DORADO (28x28 px)
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

/**
 * 🌳 ÁRBOL DEL BOSQUE ENCANTADO (64x64 px - HD 16-Bit Retro Art)
 * Tronco retorcido de corteza índigo/violeta con frondosa copa de robles místicos en capas púrpura y turquesa
 */
export function getEnchantedTreeCanvas(): { trunk: HTMLCanvasElement; canopy: HTMLCanvasElement } {
  const trunk = document.createElement('canvas');
  trunk.width = 48; trunk.height = 36;
  const tCtx = trunk.getContext('2d')!;
  tCtx.imageSmoothingEnabled = false;

  // Sombra proyectada en el suelo
  tCtx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  tCtx.beginPath();
  tCtx.ellipse(24, 28, 18, 6, 0, 0, Math.PI * 2);
  tCtx.fill();

  // Tronco retorcido místico
  tCtx.fillStyle = '#1e1b4b'; // Índigo profundo
  tCtx.fillRect(16, 6, 16, 22);
  tCtx.fillRect(12, 22, 6, 8); // Raíz izquierda
  tCtx.fillRect(30, 22, 6, 8); // Raíz derecha

  // Vetas y textura de corteza
  tCtx.fillStyle = '#312e81';
  tCtx.fillRect(18, 8, 12, 18);
  tCtx.fillStyle = '#4338ca';
  tCtx.fillRect(20, 10, 4, 14);
  tCtx.fillRect(26, 12, 3, 10);
  tCtx.fillStyle = '#818cf8'; // Reflejo mágico en la corteza
  tCtx.fillRect(21, 14, 2, 6);

  const canopy = document.createElement('canvas');
  canopy.width = 64; canopy.height = 64;
  const cCtx = canopy.getContext('2d')!;
  cCtx.imageSmoothingEnabled = false;

  // 1. Sombra de la copa
  cCtx.fillStyle = '#0f172a';
  cCtx.beginPath();
  cCtx.arc(32, 36, 26, 0, Math.PI * 2);
  cCtx.fill();

  // 2. Capa base oscura púrpura/índigo
  cCtx.fillStyle = '#3b0764';
  cCtx.beginPath();
  cCtx.arc(32, 32, 24, 0, Math.PI * 2);
  cCtx.arc(22, 28, 16, 0, Math.PI * 2);
  cCtx.arc(42, 28, 16, 0, Math.PI * 2);
  cCtx.arc(32, 18, 16, 0, Math.PI * 2);
  cCtx.fill();

  // 3. Bloques de follaje medio amatista / violeta
  cCtx.fillStyle = '#6b21a8';
  cCtx.beginPath();
  cCtx.arc(26, 24, 14, 0, Math.PI * 2);
  cCtx.arc(38, 22, 14, 0, Math.PI * 2);
  cCtx.arc(32, 30, 14, 0, Math.PI * 2);
  cCtx.fill();

  // 4. Luces superiores fucsia y turquesa místico
  cCtx.fillStyle = '#9333ea';
  cCtx.beginPath();
  cCtx.arc(24, 18, 10, 0, Math.PI * 2);
  cCtx.arc(36, 16, 10, 0, Math.PI * 2);
  cCtx.fill();

  // Toques de brillo turquesa y flores mágicas
  cCtx.fillStyle = '#38bdf8';
  cCtx.fillRect(20, 14, 4, 3);
  cCtx.fillRect(34, 12, 4, 3);
  cCtx.fillRect(28, 22, 3, 3);

  cCtx.fillStyle = '#f472b6'; // Esporas fucsias luminiscentes
  cCtx.fillRect(16, 24, 2, 2);
  cCtx.fillRect(44, 20, 2, 2);
  cCtx.fillRect(30, 10, 2, 2);
  cCtx.fillRect(38, 28, 2, 2);

  return { trunk, canopy };
}

/**
 * 🍄 SETAS GIGANTES DEL BOSQUE ENCANTADO (32x32 px)
 */
export function getEnchantedMushroomCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(4, 26, 24, 4);

  // Seta 1 (Cyan)
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(8, 16, 4, 12);
  ctx.fillStyle = '#06b6d4';
  ctx.beginPath(); ctx.arc(10, 16, 8, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#a5f3fc';
  ctx.fillRect(8, 12, 2, 2); ctx.fillRect(12, 14, 2, 2);

  // Seta 2 (Fucsia/Violeta)
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(20, 14, 4, 14);
  ctx.fillStyle = '#d946ef';
  ctx.beginPath(); ctx.arc(22, 14, 9, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#fae8ff';
  ctx.fillRect(19, 10, 2, 2); ctx.fillRect(24, 12, 2, 2);

  return canvas;
}

/**
 * 🌿 SETO VERDE DEL LABERINTO ENCANTADO (32x32 px)
 */
export function getLabyrinthHedgeCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = '#14532d'; // Verde bosque profundo
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillStyle = '#16a34a'; // Verde vibrante
  ctx.fillRect(2, 2, 28, 28);
  ctx.fillStyle = '#22c55e'; // Iluminación superior
  ctx.fillRect(4, 4, 24, 12);
  ctx.fillStyle = '#86efac';
  ctx.fillRect(6, 6, 8, 4); ctx.fillRect(18, 6, 8, 4);

  return canvas;
}

/**
 * 💎 CRISTAL DE MANÁ ARCANO (24x36 px)
 */
export function getManaCrystalCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 24; canvas.height = 36;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(4, 30, 16, 4);

  const glow = (Math.sin(time * 3) + 1) * 0.5;
  ctx.fillStyle = glow > 0.5 ? '#38bdf8' : '#0284c7';
  ctx.beginPath();
  ctx.moveTo(12, 4); ctx.lineTo(20, 24); ctx.lineTo(12, 32); ctx.lineTo(4, 24);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#e0f2fe';
  ctx.beginPath();
  ctx.moveTo(12, 6); ctx.lineTo(16, 22); ctx.lineTo(12, 28); ctx.lineTo(10, 22);
  ctx.closePath();
  ctx.fill();

  return canvas;
}

/**
 * 🏴‍☠️ GALEÓN NAUFRAGADO EN LA ARENA (64x54 px)
 */
export function getShipwreckCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 54;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra sobre arena
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(6, 42, 52, 8);

  // Casco de madera podrida
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.moveTo(8, 30); ctx.lineTo(56, 30); ctx.lineTo(48, 46); ctx.lineTo(16, 46);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#78350f';
  ctx.fillRect(12, 32, 40, 10);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(14, 34, 36, 4);

  // Mástiles partidos
  ctx.fillStyle = '#451a03';
  ctx.fillRect(24, 8, 4, 26);
  ctx.fillRect(42, 14, 4, 20);

  // Velas rotas
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(24, 10); ctx.lineTo(12, 22); ctx.lineTo(24, 20);
  ctx.fill();

  return canvas;
}

/**
 * 🍇 VIÑEDO DE ESPALDERA CON UVAS (32x32 px)
 */
export function getVineyardCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Postes de madera
  ctx.fillStyle = '#78350f';
  ctx.fillRect(2, 6, 3, 24);
  ctx.fillRect(27, 6, 3, 24);
  ctx.fillStyle = '#94a3b8'; // Alambres
  ctx.fillRect(5, 10, 22, 1);
  ctx.fillRect(5, 20, 22, 1);

  // Hojas de parra
  ctx.fillStyle = '#15803d';
  ctx.fillRect(4, 8, 24, 14);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(6, 9, 20, 8);

  // Racimos de uvas moradas
  ctx.fillStyle = '#7e22ce';
  ctx.fillRect(8, 18, 4, 6); ctx.fillRect(16, 18, 4, 6); ctx.fillRect(24, 18, 4, 6);
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(9, 19, 2, 3); ctx.fillRect(17, 19, 2, 3); ctx.fillRect(25, 19, 2, 3);

  return canvas;
}

/**
 * 🔭 OBSERVATORIO ASTRONÓMICO (48x54 px)
 */
export function getObservatoryCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48; canvas.height = 54;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(4, 46, 40, 6);

  // Torre de piedra
  ctx.fillStyle = '#475569';
  ctx.fillRect(10, 24, 28, 24);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(12, 26, 24, 20);

  // Cúpula
  ctx.fillStyle = '#334155';
  ctx.beginPath(); ctx.arc(24, 24, 16, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#0ea5e9';
  ctx.beginPath(); ctx.arc(24, 24, 13, Math.PI, 0); ctx.fill();

  // Telescopio de latón dorado
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.moveTo(24, 18); ctx.lineTo(42, 6); ctx.lineTo(44, 9); ctx.lineTo(26, 21);
  ctx.fill();

  return canvas;
}

/**
 * 🌊 FARO COSTERO BLANCO Y ROJO (36x64 px)
 */
export function getLighthouseCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 36; canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(4, 56, 28, 6);

  // Torre cónica a franjas rojas y blancas
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(10, 20); ctx.lineTo(26, 20); ctx.lineTo(30, 58); ctx.lineTo(6, 58);
  ctx.fill();

  ctx.fillStyle = '#f8fafc'; // Franja blanca media
  ctx.fillRect(8, 30, 20, 14);

  // Linterna superior
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(10, 14, 16, 6);
  ctx.fillStyle = '#fef08a'; // Foco luminoso
  ctx.fillRect(12, 8, 12, 8);

  // Tejado cónico
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(8, 8); ctx.lineTo(18, 0); ctx.lineTo(28, 8);
  ctx.fill();

  return canvas;
}

/**
 * ⛪ IGLESIA / CAPILLA GÓTICA DE PIEDRA (64x64 px)
 */
export function getChurchCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(4, 54, 56, 8);

  // Cuerpo principal de piedra
  ctx.fillStyle = '#334155';
  ctx.fillRect(12, 24, 40, 32);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(14, 26, 36, 28);

  // Tejado a dos aguas
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(8, 24); ctx.lineTo(32, 8); ctx.lineTo(56, 24);
  ctx.fill();

  // Campanario
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(26, 0, 12, 16);
  ctx.fillStyle = '#eab308'; // Campana de bronce
  ctx.fillRect(30, 8, 4, 6);

  // Cruz dorada
  ctx.fillStyle = '#fde047';
  ctx.fillRect(31, -4, 2, 8); ctx.fillRect(29, -2, 6, 2);

  // Ventana ojival de vidriera
  ctx.fillStyle = '#0284c7';
  ctx.beginPath(); ctx.arc(32, 36, 6, Math.PI, 0); ctx.fill();
  ctx.fillRect(26, 36, 12, 8);

  return canvas;
}

/**
 * 🧪 BOTICA DE POCIONES Y ALQUIMIA (56x56 px)
 */
export function getApothecaryCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 56; canvas.height = 56;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(4, 46, 48, 8);

  // Fachada
  ctx.fillStyle = '#475569';
  ctx.fillRect(8, 20, 40, 28);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(10, 22, 36, 24);

  // Tejado morado alquímico
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.moveTo(4, 20); ctx.lineTo(28, 4); ctx.lineTo(52, 20);
  ctx.fill();

  // Cartel colgante de Poción
  ctx.fillStyle = '#78350f';
  ctx.fillRect(44, 22, 8, 2);
  ctx.fillStyle = '#c084fc';
  ctx.fillRect(46, 24, 6, 8);

  // Puerta de roble
  ctx.fillStyle = '#78350f';
  ctx.fillRect(22, 32, 12, 16);

  return canvas;
}

/**
 * ⛪ GRAN TEMPLO DEL SOL / CATEDRAL MONUMENTAL (64x80 px)
 * Gran fachada gótica con vidrieras de rosetón, tejado azul pizarra y estatuas
 */
export function getTempleOfSunCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 80;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(4, 70, 56, 8);

  // Muros de sillar de piedra
  ctx.fillStyle = '#475569';
  ctx.fillRect(10, 28, 44, 48);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(12, 30, 40, 44);

  // Tejado gótico empinado azul pizarra
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.moveTo(6, 30); ctx.lineTo(32, 4); ctx.lineTo(58, 30);
  ctx.fill();

  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.moveTo(10, 30); ctx.lineTo(32, 8); ctx.lineTo(54, 30);
  ctx.fill();

  // Gran Rosetón de Vidriera Solar
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(32, 28, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.arc(32, 28, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fde047';
  ctx.fillRect(31, 22, 2, 12); ctx.fillRect(26, 27, 12, 2);

  // Gran Portal Arqueado con columnas
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(32, 60, 8, Math.PI, 0); ctx.fill();
  ctx.fillRect(24, 60, 16, 14);

  // Puertas de roble con herrajes dorados
  ctx.fillStyle = '#78350f';
  ctx.fillRect(26, 62, 12, 12);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(31, 66, 2, 4);

  // Vidrieras laterales ojivales
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(16, 44, 4, 12);
  ctx.fillRect(44, 44, 4, 12);

  return canvas;
}

/**
 * 🔮 TORRE DEL MAGO / AGUJA ARCANA (48x80 px)
 * Torreón cilíndrico de piedra con tejado cónico púrpura y orbe mágico giratorio
 */
export function getMageTowerCanvas(animPhase: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48; canvas.height = 80;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(4, 70, 40, 8);

  // Torre cilíndrica de mampostería
  ctx.fillStyle = '#334155';
  ctx.fillRect(10, 24, 28, 52);
  ctx.fillStyle = '#475569';
  ctx.fillRect(12, 26, 24, 48);

  // Ventanas arcanas luminiscentes
  const glow = (Math.sin(animPhase * 3) + 1) * 0.5;
  ctx.fillStyle = glow > 0.5 ? '#c084fc' : '#9333ea';
  ctx.fillRect(22, 38, 4, 8);
  ctx.fillRect(22, 54, 4, 8);

  // Tejado cónico de mago (Púrpura)
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.moveTo(6, 24); ctx.lineTo(24, 4); ctx.lineTo(42, 24);
  ctx.fill();

  ctx.fillStyle = '#7e22ce';
  ctx.beginPath();
  ctx.moveTo(10, 24); ctx.lineTo(24, 7); ctx.lineTo(38, 24);
  ctx.fill();

  // Orbe mágico flotante en la cúspide
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath(); ctx.arc(24, 3, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e0f2fe';
  ctx.beginPath(); ctx.arc(23, 2, 2, 0, Math.PI * 2); ctx.fill();

  return canvas;
}

/**
 * 🏛️ GRAN AYUNTAMIENTO / CASA GREMIAL (80x64 px)
 * Edificio monumental de dos plantas con vigas entramadas, estandartes y chimeneas
 */
export function getGreatHallCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 80; canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(4, 56, 72, 8);

  // Primera Planta: Muro de piedra
  ctx.fillStyle = '#334155';
  ctx.fillRect(8, 32, 64, 28);
  ctx.fillStyle = '#475569';
  ctx.fillRect(10, 34, 60, 24);

  // Segunda Planta: Entramado de madera noble
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(6, 16, 68, 18);
  ctx.fillStyle = '#451a03'; // Vigas de madera
  ctx.fillRect(6, 16, 68, 3);
  ctx.fillRect(6, 31, 68, 3);
  ctx.fillRect(6, 16, 4, 18);
  ctx.fillRect(70, 16, 4, 18);
  ctx.fillRect(26, 16, 4, 18);
  ctx.fillRect(50, 16, 4, 18);

  // Tejado señorial a dos aguas
  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.moveTo(2, 16); ctx.lineTo(40, 2); ctx.lineTo(78, 16);
  ctx.fill();

  // Estandarte real colgante
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(36, 20, 8, 12);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(39, 23, 2, 6);

  // Puerta de doble hoja
  ctx.fillStyle = '#78350f';
  ctx.fillRect(34, 42, 12, 18);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(36, 50, 2, 2); ctx.fillRect(42, 50, 2, 2);

  return canvas;
}

/**
 * ⛲ GRAN ESTANQUE CON FUENTE DE GÁRGOLA (64x64 px)
 */
export function getGargoyleFountainCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Bordillo exterior de mármol
  ctx.fillStyle = '#64748b';
  ctx.beginPath(); ctx.roundRect(4, 4, 56, 56, 12); ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath(); ctx.roundRect(6, 6, 52, 52, 10); ctx.fill();

  // Agua cristalina animada
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(10, 10, 44, 44);
  const wave = Math.sin(time * 4) * 2;
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(14 + wave, 16, 20, 4);
  ctx.fillRect(30 - wave, 32, 18, 4);

  // Pedestal central con gárgola de piedra
  ctx.fillStyle = '#334155';
  ctx.fillRect(24, 20, 16, 24);
  ctx.fillStyle = '#475569';
  ctx.fillRect(26, 22, 12, 20);

  // Chorro de agua que cae
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(30, 36, 4, 12);
  ctx.fillRect(28, 44, 8, 4);

  return canvas;
}

/**
 * ⛲ FUENTE DE AGUA OCTOGONAL DE LA PLAZA CENTRAL (56x56 px)
 * Réplica exacta de la plaza central con brocal de sillar, estanque azul y surtidor de piedra
 */
export function getSquarePlazaFountainCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 56;
  canvas.height = 56;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra de contacto en el suelo
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(28, 50, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Brocal exterior de sillares de piedra gris clara (con esquinas achaflanadas)
  ctx.fillStyle = '#334155'; // Sombra exterior
  ctx.beginPath();
  ctx.roundRect(4, 8, 48, 42, 8);
  ctx.fill();

  ctx.fillStyle = '#64748b'; // Cuerpo del brocal
  ctx.beginPath();
  ctx.roundRect(5, 9, 46, 40, 7);
  ctx.fill();

  ctx.fillStyle = '#94a3b8'; // Bisel superior
  ctx.beginPath();
  ctx.roundRect(6, 10, 44, 38, 6);
  ctx.fill();

  ctx.fillStyle = '#cbd5e1'; // Luz en la coronación
  ctx.beginPath();
  ctx.roundRect(7, 10, 42, 4, 2);
  ctx.fill();

  // Estanque interior de agua cristalina azul
  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.roundRect(11, 15, 34, 28, 4);
  ctx.fill();

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.roundRect(13, 17, 30, 24, 3);
  ctx.fill();

  // Ondas animadas de agua
  const ripple = Math.sin(time * 5) * 2;
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(16 + ripple, 22, 10, 2);
  ctx.fillRect(30 - ripple, 32, 10, 2);
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(22, 26 + ripple * 0.5, 12, 2);

  // Pedestal central de piedra
  ctx.fillStyle = '#334155';
  ctx.fillRect(23, 18, 10, 16);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(24, 19, 8, 14);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(25, 20, 6, 12);

  // Columna y surtidor superior
  ctx.fillStyle = '#475569';
  ctx.fillRect(26, 14, 4, 6);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(27, 14, 2, 6);

  // Chorro y espuma de agua
  const splash = Math.sin(time * 10) * 1.5;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(27, 10 + splash * 0.5, 2, 4);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(25, 13, 6, 2);
  ctx.fillRect(24, 15, 8, 2);

  return canvas;
}

/**
 * 🌉 PASARELA ELEVADA / ACUEDUCTO DE MADERA (64x32 px)
 */
export function getSkybridgeCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(4, 26, 56, 6);

  // Postes de madera de soporte
  ctx.fillStyle = '#451a03';
  ctx.fillRect(8, 8, 6, 20);
  ctx.fillRect(50, 8, 6, 20);

  // Arco / puente superior
  ctx.fillStyle = '#78350f';
  ctx.fillRect(2, 6, 60, 8);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(2, 8, 60, 4);

  // Barandilla de madera
  ctx.fillStyle = '#b45309';
  ctx.fillRect(2, 2, 60, 3);
  for (let x = 6; x < 60; x += 8) {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x, 2, 2, 6);
  }

  return canvas;
}

/**
 * 🛡️ GREMIO DE CURTIDORES / SASTRERÍA (64x64 px)
 */
export function getLeatherworkersGuildCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(4, 52, 56, 8);

  // Fachada
  ctx.fillStyle = '#451a03';
  ctx.fillRect(8, 22, 48, 34);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(10, 24, 44, 30);

  // Tejado marrón
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.moveTo(4, 22); ctx.lineTo(32, 6); ctx.lineTo(60, 22);
  ctx.fill();

  // Pieles de cuero secándose colgadas
  ctx.fillStyle = '#d97706';
  ctx.fillRect(14, 32, 8, 12);
  ctx.fillRect(26, 32, 8, 12);

  // Puerta
  ctx.fillStyle = '#451a03';
  ctx.fillRect(42, 38, 10, 16);

  return canvas;
}

