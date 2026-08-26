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
  // 0. SUELO BASE: CÉSPED / FORJA / PARQUÉ DE TABERNA / PIEDRA IGNÍFUGA
  // ---------------------------------------------------------------------------
  if (tileType === 0) {
    if (zoneId === 'subzone_tavern' || zoneId.includes('tavern')) {
      // 🪵 Suelo de Taberna Medieval: Parqué de tablones de roble noble pulido
      ctx.fillStyle = '#451a03'; // Base de sombra
      ctx.fillRect(0, 0, 32, 32);

      // Tablones horizontales de roble
      const drawPlank = (y: number, h: number, tone: number) => {
        ctx.fillStyle = tone === 0 ? '#78350f' : tone === 1 ? '#92400e' : '#854d0e';
        ctx.fillRect(0, y, 32, h - 1);
        // Veta de madera
        ctx.fillStyle = tone === 0 ? '#92400e' : '#a16207';
        ctx.fillRect(4, y + 2, 16, 1);
        ctx.fillRect(22, y + 4, 8, 1);
        // Clavos de hierro en los extremos
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(2, y + 3, 1, 1);
        ctx.fillRect(30, y + 3, 1, 1);
      };

      drawPlank(0, 8, 0);
      drawPlank(8, 8, 1);
      drawPlank(16, 8, 2);
      drawPlank(24, 8, 0);

      // Juntas verticales escalonadas
      ctx.fillStyle = '#271202';
      ctx.fillRect(14, 0, 1, 7);
      ctx.fillRect(24, 8, 1, 7);
      ctx.fillRect(10, 16, 1, 7);
      ctx.fillRect(20, 24, 1, 7);
    } else if (zoneId === 'subzone_botica' || zoneId.includes('botica')) {
      // 🌿 Suelo de Botica Alquímica: Baldosas de cantería suave con vetas y musgo botánico
      ctx.fillStyle = '#064e3b'; // Base sombra oscura
      ctx.fillRect(0, 0, 32, 32);

      // Losas de piedra caliza cálida
      ctx.fillStyle = '#065f46';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillRect(17, 1, 14, 14);
      ctx.fillRect(1, 17, 14, 14);
      ctx.fillRect(17, 17, 14, 14);

      // Brillo y relieve
      ctx.fillStyle = '#047857';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillRect(18, 2, 12, 12);
      ctx.fillRect(2, 18, 12, 12);
      ctx.fillRect(18, 18, 12, 12);

      // Detalles botánicos / polvo de hierbas
      ctx.fillStyle = '#34d399';
      ctx.fillRect(6, 6, 2, 2);
      ctx.fillRect(22, 22, 2, 2);
      ctx.fillStyle = '#c084fc'; // Polvo arcano lavanda
      ctx.fillRect(22, 6, 1, 1);
      ctx.fillRect(6, 22, 1, 1);
    } else if (zoneId === 'subzone_crypt' || zoneId.includes('crypt')) {
      // 🪦 Suelo de Cripta y Catacumbas: Losas de piedra ceniza fría con fisuras y polvo de tumbas
      ctx.fillStyle = '#09090b'; // Fondo negro abisal
      ctx.fillRect(0, 0, 32, 32);

      // Losas de piedra oscura
      ctx.fillStyle = '#18181b';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillRect(17, 1, 14, 14);
      ctx.fillRect(1, 17, 14, 14);
      ctx.fillRect(17, 17, 14, 14);

      // Relieve y textura de desgaste
      ctx.fillStyle = '#27272a';
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillRect(18, 2, 12, 12);
      ctx.fillRect(2, 18, 12, 12);
      ctx.fillRect(18, 18, 12, 12);

      // Fisuras en la piedra y polvo de ceniza
      ctx.fillStyle = '#09090b';
      ctx.fillRect(6, 4, 1, 5);
      ctx.fillRect(7, 8, 3, 1);
      ctx.fillRect(20, 22, 4, 1);
      ctx.fillStyle = '#3f3f46';
      ctx.fillRect(8, 8, 1, 1);
      ctx.fillStyle = '#581c87'; // Brillo espectral tenue
      ctx.fillRect(24, 6, 1, 1);
    } else if (zoneId === 'subzone_forge' || zoneId.includes('forge')) {
      // Suelo de Taller de Herrería: Losas de basalto oscuras con hollín y polvo de carbón
      ctx.fillStyle = '#1c1917'; // Base losa oscura
      ctx.fillRect(0, 0, 32, 32);

      // Bloques de losa de piedra
      ctx.fillStyle = '#292524';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillRect(17, 1, 14, 14);
      ctx.fillRect(1, 17, 14, 14);
      ctx.fillRect(17, 17, 14, 14);

      // Juntas de mortero y polvo de ceniza
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, 15, 32, 2);
      ctx.fillRect(15, 0, 2, 32);

      // Relieve y textura de piedra rugosa
      ctx.fillStyle = '#44403c';
      ctx.fillRect(3, 3, 10, 2);
      ctx.fillRect(19, 19, 10, 2);
      ctx.fillRect(3, 19, 4, 4);

      // Manchas de carbón y chispas cálidas
      if (phase % 2 === 0) {
        ctx.fillStyle = 'rgba(234, 88, 12, 0.4)';
        ctx.fillRect(8, 8, 2, 2);
        ctx.fillRect(24, 22, 2, 2);
      }
    } else if (zoneId === 'zone_forest') {
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
    if (zoneId === 'subzone_tavern' || zoneId.includes('tavern')) {
      // 🔴 Alfombra Roja Real de Terciopelo con Cenefa Dorada
      ctx.fillStyle = '#7f1d1d'; // Borde sombra
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#991b1b'; // Terciopelo rojo
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(4, 4, 24, 24);

      // Cenefa dorada bordada
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(3, 3, 26, 26);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(3, 3, 2, 2);
      ctx.fillRect(27, 3, 2, 2);
      ctx.fillRect(3, 27, 2, 2);
      ctx.fillRect(27, 27, 2, 2);

      // Patrón de rombos bordados en el centro
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(16, 8); ctx.lineTo(24, 16); ctx.lineTo(16, 24); ctx.lineTo(8, 16);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(15, 15, 2, 2);
      return canvas;
    } else if (zoneId === 'subzone_botica' || zoneId.includes('botica')) {
      // 🌿 Alfombra Arcana Esmeralda y Violeta con Runa Alquímica
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#047857';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#059669';
      ctx.fillRect(4, 4, 24, 24);

      // Estrella mágica y runas doradas
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(16, 16, 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.moveTo(16, 8); ctx.lineTo(22, 22); ctx.lineTo(10, 22);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.fillRect(15, 15, 2, 2);
      return canvas;
    } else if (zoneId === 'subzone_crypt' || zoneId.includes('crypt')) {
      // 🪦 Alfombra Ritual Púrpura Profanada con Calaveras y Runas de Muerte
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#3b0764'; // Púrpura ceremonial
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#581c87';
      ctx.fillRect(4, 4, 24, 24);

      // Cenefa plateada desgastada
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(3, 3, 26, 26);

      // Calavera mágica central
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(13, 11, 6, 6);
      ctx.fillRect(14, 17, 4, 3);
      ctx.fillStyle = '#09090b';
      ctx.fillRect(14, 13, 2, 2);
      ctx.fillRect(17, 13, 2, 2);

      // Ojos espectrales brillantes
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(14, 13, 1, 1);
      ctx.fillRect(17, 13, 1, 1);
      return canvas;
    }

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
    // Sombra de contacto en el suelo
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.beginPath();
    ctx.ellipse(16, 27, 13, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Racimo base de follaje profundo (Silueta exterior con lóbulos festoneados)
    ctx.fillStyle = '#14532d'; // Sombra de contorno
    ctx.beginPath();
    ctx.arc(9, 17, 7, 0, Math.PI * 2);
    ctx.arc(23, 17, 7, 0, Math.PI * 2);
    ctx.arc(16, 12, 9, 0, Math.PI * 2);
    ctx.arc(16, 19, 8, 0, Math.PI * 2);
    ctx.fill();

    // Capa de follaje verde oscuro
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.arc(9, 16, 6.5, 0, Math.PI * 2);
    ctx.arc(23, 16, 6.5, 0, Math.PI * 2);
    ctx.arc(16, 11, 8, 0, Math.PI * 2);
    ctx.arc(16, 18, 7, 0, Math.PI * 2);
    ctx.fill();

    // Capa de follaje medio (Volumen principal)
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(9, 15, 5.5, 0, Math.PI * 2);
    ctx.arc(23, 15, 5.5, 0, Math.PI * 2);
    ctx.arc(16, 10, 7, 0, Math.PI * 2);
    ctx.fill();

    // Capa de luz verde viva
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(9, 14, 4.5, 0, Math.PI * 2);
    ctx.arc(23, 14, 4.5, 0, Math.PI * 2);
    ctx.arc(16, 9, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Toques de brillo superior en las copas de las hojas
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(8, 10, 4, 3);
    ctx.fillRect(20, 10, 4, 3);
    ctx.fillRect(14, 5, 5, 3);

    ctx.fillStyle = '#86efac';
    ctx.fillRect(9, 10, 2, 1);
    ctx.fillRect(21, 10, 2, 1);
    ctx.fillRect(15, 5, 3, 1);

    // Pequeñas rosas y capullos de flores integrados
    const drawRose = (rx: number, ry: number) => {
      ctx.fillStyle = '#991b1b'; // Sombra de pétalo
      ctx.fillRect(rx - 1, ry, 5, 4);
      ctx.fillStyle = '#dc2626'; // Pétalo principal
      ctx.fillRect(rx, ry, 3, 3);
      ctx.fillStyle = '#f87171'; // Brillo superior
      ctx.fillRect(rx + 1, ry, 2, 1);
      ctx.fillStyle = '#fef08a'; // Pistilo central
      ctx.fillRect(rx + 1, ry + 1, 1, 1);
    };

    if (animPhase % 3 === 0) {
      drawRose(8, 14);
      drawRose(21, 13);
      drawRose(15, 18);
    } else if (animPhase % 3 === 1) {
      drawRose(12, 11);
      drawRose(22, 16);
      drawRose(9, 18);
    } else {
      drawRose(16, 12);
      drawRose(7, 16);
      drawRose(23, 15);
    }
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

const cuteHouseCache = new Map<string, HTMLCanvasElement>();

/**
 * 🏡 CASA 2.5D CUTE FANTASY RECOLOREADA HD
 * Conserva el 100% de la perspectiva 2.5D, madera, sombreado y textura de tejas original
 */
export function getRecoloredCuteHouseCanvas(
  baseImg: HTMLImageElement,
  variant: 'blue' | 'red' | 'stone' | 'purple'
): HTMLCanvasElement {
  if (cuteHouseCache.has(variant)) return cuteHouseCache.get(variant)!;
  if (!baseImg.complete || baseImg.naturalWidth === 0) {
    const dummy = document.createElement('canvas');
    dummy.width = 96; dummy.height = 128;
    return dummy;
  }

  const canvas = document.createElement('canvas');
  canvas.width = baseImg.naturalWidth || 96;
  canvas.height = baseImg.naturalHeight || 128;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(baseImg, 0, 0);

  if (variant === 'blue') {
    cuteHouseCache.set(variant, canvas);
    return canvas;
  }

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Detectar exclusivamente los píxeles del tejado azul (azul dominante sobre rojo y verde)
    if (b > r + 8 && b > g - 15) {
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      if (variant === 'red') {
        // Paleta Tejado Rojo Terracota 2.5D
        if (lum < 0.3) {
          data[i] = Math.min(255, Math.round(90 * (lum / 0.3)));
          data[i + 1] = Math.min(255, Math.round(20 * (lum / 0.3)));
          data[i + 2] = Math.min(255, Math.round(15 * (lum / 0.3)));
        } else if (lum < 0.55) {
          const t = (lum - 0.3) / 0.25;
          data[i] = Math.round(90 + (186 - 90) * t);
          data[i + 1] = Math.round(20 + (54 - 20) * t);
          data[i + 2] = Math.round(15 + (32 - 15) * t);
        } else if (lum < 0.8) {
          const t = (lum - 0.55) / 0.25;
          data[i] = Math.round(186 + (234 - 186) * t);
          data[i + 1] = Math.round(54 + (100 - 54) * t);
          data[i + 2] = Math.round(32 + (70 - 32) * t);
        } else {
          const t = (lum - 0.8) / 0.2;
          data[i] = Math.round(234 + (248 - 234) * t);
          data[i + 1] = Math.round(100 + (150 - 100) * t);
          data[i + 2] = Math.round(70 + (115 - 70) * t);
        }
      } else if (variant === 'stone') {
        // Paleta Tejado Pizarra Gris Señorial 2.5D
        if (lum < 0.3) {
          const v = Math.round(35 * (lum / 0.3));
          data[i] = v; data[i + 1] = Math.round(v * 1.1); data[i + 2] = Math.round(v * 1.25);
        } else if (lum < 0.55) {
          const t = (lum - 0.3) / 0.25;
          data[i] = Math.round(35 + (70 - 35) * t);
          data[i + 1] = Math.round(40 + (80 - 40) * t);
          data[i + 2] = Math.round(50 + (98 - 50) * t);
        } else if (lum < 0.8) {
          const t = (lum - 0.55) / 0.25;
          data[i] = Math.round(70 + (115 - 70) * t);
          data[i + 1] = Math.round(80 + (130 - 80) * t);
          data[i + 2] = Math.round(98 + (150 - 98) * t);
        } else {
          const t = (lum - 0.8) / 0.2;
          data[i] = Math.round(115 + (165 - 115) * t);
          data[i + 1] = Math.round(130 + (180 - 130) * t);
          data[i + 2] = Math.round(150 + (205 - 150) * t);
        }
      } else if (variant === 'purple') {
        // Paleta Tejado Amatista Mística 2.5D
        if (lum < 0.3) {
          data[i] = Math.min(255, Math.round(75 * (lum / 0.3)));
          data[i + 1] = Math.min(255, Math.round(20 * (lum / 0.3)));
          data[i + 2] = Math.min(255, Math.round(110 * (lum / 0.3)));
        } else if (lum < 0.55) {
          const t = (lum - 0.3) / 0.25;
          data[i] = Math.round(75 + (125 - 75) * t);
          data[i + 1] = Math.round(20 + (38 - 20) * t);
          data[i + 2] = Math.round(110 + (180 - 110) * t);
        } else if (lum < 0.8) {
          const t = (lum - 0.55) / 0.25;
          data[i] = Math.round(125 + (170 - 125) * t);
          data[i + 1] = Math.round(38 + (75 - 38) * t);
          data[i + 2] = Math.round(180 + (230 - 180) * t);
        } else {
          const t = (lum - 0.8) / 0.2;
          data[i] = Math.round(170 + (210 - 170) * t);
          data[i + 1] = Math.round(75 + (130 - 75) * t);
          data[i + 2] = Math.round(230 + (250 - 230) * t);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  cuteHouseCache.set(variant, canvas);
  return canvas;
}

/**
 * ⚒️ GRAN FORJA Y HERRERÍA REAL (CUTE FANTASY 2.5D HD - 96x128 px)
 * Misma arquitectura, madera y perspectiva 2.5D que la Taberna, con tejado de pizarra,
 * chimenea humeante, ventanas con resplandor de fragua y rótulo de yunque dorado.
 */
export function getBlacksmithCuteHouseCanvas(
  baseImg: HTMLImageElement,
  time: number = 0
): HTMLCanvasElement {
  const baseHouse = getRecoloredCuteHouseCanvas(baseImg, 'stone');
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // 1. Dibujar la casa base 2.5D de Cute Fantasy (tejado de pizarra)
  ctx.drawImage(baseHouse, 0, 0);

  // 2. Ventana con resplandor cálido de la fragua parpadeante
  // Ventana superior (en buhardilla)
  const flicker = Math.sin(time * 8) * 0.15 + 0.85;
  ctx.fillStyle = `rgba(249, 115, 22, ${flicker})`;
  ctx.fillRect(44, 46, 7, 7);
  ctx.fillStyle = `rgba(254, 240, 138, ${flicker * 0.9})`;
  ctx.fillRect(45, 47, 5, 5);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(47, 46, 1, 7);
  ctx.fillRect(44, 49, 7, 1);

  // Ventana inferior derecha
  ctx.fillStyle = `rgba(249, 115, 22, ${flicker})`;
  ctx.fillRect(66, 68, 8, 8);
  ctx.fillStyle = `rgba(254, 240, 138, ${flicker * 0.9})`;
  ctx.fillRect(67, 69, 6, 6);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(70, 68, 1, 8);
  ctx.fillRect(66, 72, 8, 1);

  // 3. Gran Chimenea de Cantería en el tejado con humo animado
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(68, 26, 8, 20);
  ctx.fillStyle = '#334155';
  ctx.fillRect(69, 28, 6, 17);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(67, 24, 10, 3); // Coronamiento de chimenea

  // Bocanadas de humo animado
  const sOffset1 = Math.sin(time * 3) * 3;
  const sOffset2 = Math.cos(time * 2.5) * 4;
  const sRise1 = (time * 12) % 18;
  const sRise2 = ((time + 1) * 12) % 18;
  ctx.fillStyle = 'rgba(203, 213, 225, 0.5)';
  ctx.beginPath();
  ctx.arc(72 + sOffset1, 20 - sRise1, 4 + (sRise1 / 4), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.beginPath();
  ctx.arc(74 + sOffset2, 12 - sRise2, 5 + (sRise2 / 3), 0, Math.PI * 2);
  ctx.fill();

  // 4. Rótulo de Madera de la Forja con Yunque Dorado sobre la entrada
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(36, 60, 24, 2); // Barra de hierro
  ctx.fillStyle = '#451a03';
  ctx.fillRect(38, 62, 20, 9);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(39, 63, 18, 7);
  // Yunque dorado brillante
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(44, 65, 8, 3);
  ctx.fillRect(42, 66, 12, 2);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(45, 65, 6, 1);

  // 5. Cajas de Carbón y Leña al lado izquierdo del porche
  ctx.fillStyle = '#451a03';
  ctx.fillRect(20, 84, 12, 10);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(21, 85, 10, 8);
  // Trozos de carbón negro
  ctx.fillStyle = '#09090b';
  ctx.fillRect(22, 82, 8, 3);
  ctx.fillRect(24, 80, 4, 3);

  // Troncos de leña apilados
  ctx.fillStyle = '#92400e';
  ctx.fillRect(14, 88, 5, 2);
  ctx.fillRect(14, 91, 5, 2);

  return canvas;
}

/**
 * 🍺 GRAN TABERNA Y POSADA "EL JABALÍ DORADO" (CUTE FANTASY 2.5D HD - 96x128 px)
 * Tejado cálido de terracota/madera, toldo festivo a rayas rojas y blancas,
 * jarras de cerveza, barriles de roble y rótulo de posada con jarra de cerveza espumosa.
 */
export function getTavernCuteHouseCanvas(
  baseImg: HTMLImageElement,
  time: number = 0
): HTMLCanvasElement {
  const baseHouse = getRecoloredCuteHouseCanvas(baseImg, 'red');
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // 1. Dibujar la casa base 2.5D con tejado rojo cálido
  ctx.drawImage(baseHouse, 0, 0);

  // 2. Toldo festivo a rayas rojas y blancas sobre el porche (Perspectiva 2.5D)
  const awningW = 44;
  const awningH = 14;
  const aX = 26;
  const aY = 66;

  // Faldón de rayas rojas y blancas con volantes
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#f8fafc';
    ctx.fillRect(aX + i * 6, aY, 6, awningH);
    // Borde inferior ondeado / festoneado
    ctx.fillStyle = i % 2 === 0 ? '#991b1b' : '#cbd5e1';
    ctx.fillRect(aX + i * 6 + 1, aY + awningH, 4, 3);
  }
  // Viga de soporte del toldo
  ctx.fillStyle = '#451a03';
  ctx.fillRect(aX - 2, aY - 2, awningW + 4, 2);

  // Guirnalda de farolillos cálidos festivos bajo el toldo
  for (let i = 0; i < 4; i++) {
    const lX = aX + 4 + i * 11;
    const lY = aY + awningH + 2;
    const lGlow = Math.sin(time * 4 + i) * 0.2 + 0.8;
    ctx.fillStyle = `rgba(251, 191, 36, ${lGlow})`;
    ctx.fillRect(lX, lY, 3, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(lX + 1, lY + 1, 1, 2);
  }

  // 3. Rótulo colgante de taberna con Jarra de Cerveza Dorada (`🍺`)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(40, 52, 20, 2); // Soporte de hierro
  ctx.fillStyle = '#451a03';
  ctx.fillRect(42, 54, 18, 9);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(43, 55, 16, 7);
  // Jarra de cerveza dorada con espuma blanca
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(48, 57, 6, 4);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(49, 58, 4, 3);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(48, 56, 6, 2); // Espuma
  // Asa de la jarra
  ctx.fillStyle = '#d97706';
  ctx.fillRect(54, 58, 2, 2);

  // 4. Barriles de Roble y Cerveza a los lados del porche
  // Barril izquierdo
  ctx.fillStyle = '#451a03';
  ctx.fillRect(16, 84, 10, 14);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(17, 85, 8, 12);
  // Aros de hierro del barril
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(16, 87, 10, 2);
  ctx.fillRect(16, 93, 10, 2);
  // Grifo de latón dorado
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(14, 90, 3, 2);

  // Barril derecho / Cesta de manzanas
  ctx.fillStyle = '#451a03';
  ctx.fillRect(72, 86, 10, 12);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(73, 87, 8, 10);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(74, 85, 6, 3); // Manzanas

  return canvas;
}

/**
 * 🍷 BARRA DE TABERNERO Y MOSTRADOR DE ROBLE (32x32 px)
 */
export function getTavernBarCounterCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(16, 26, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cuerpo del mostrador de madera de caoba
  ctx.fillStyle = '#451a03';
  ctx.fillRect(2, 10, 28, 18);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(4, 12, 24, 15);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(6, 14, 20, 12);

  // Tablero superior de roble barnizado con brillo
  ctx.fillStyle = '#92400e';
  ctx.fillRect(0, 8, 32, 5);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(1, 8, 30, 2);

  // Botellas de vino y licor sobre la barra
  ctx.fillStyle = '#15803d'; // Botella verde
  ctx.fillRect(4, 3, 3, 6);
  ctx.fillStyle = '#dc2626'; // Botella de vino tinto
  ctx.fillRect(9, 2, 3, 7);
  ctx.fillStyle = '#38bdf8'; // Botella de licor azul
  ctx.fillRect(14, 4, 3, 5);

  // Jarras de cerveza de barro
  ctx.fillStyle = '#d97706';
  ctx.fillRect(20, 4, 4, 5);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(20, 3, 4, 2); // Espuma blanca

  ctx.fillStyle = '#d97706';
  ctx.fillRect(26, 4, 4, 5);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(26, 3, 4, 2);

  return canvas;
}

/**
 * 🪑 MESA DE COMEDOR DE TABERNA CON BANQUETE Y TABURETES (32x32 px)
 */
export function getTavernTableCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(16, 26, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Patas de la mesa
  ctx.fillStyle = '#451a03';
  ctx.fillRect(6, 16, 3, 10);
  ctx.fillRect(23, 16, 3, 10);

  // Tablero de madera noble
  ctx.fillStyle = '#451a03';
  ctx.fillRect(3, 8, 26, 10);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(4, 9, 24, 8);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(5, 9, 22, 2);

  // Plato de asado / pollo
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.ellipse(16, 13, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#b45309';
  ctx.fillRect(14, 11, 4, 3);

  // Jarra de cerveza con espuma
  ctx.fillStyle = '#d97706';
  ctx.fillRect(8, 7, 3, 4);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(8, 6, 3, 2);

  // Vela en candelabro de latón
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(23, 8, 2, 2);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(23, 6, 2, 3);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(23, 4, 2, 2); // Llama

  // Taburetes de madera redondos
  // Taburete izquierdo
  ctx.fillStyle = '#451a03';
  ctx.fillRect(1, 18, 4, 8);
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(3, 18, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Taburete derecho
  ctx.fillStyle = '#451a03';
  ctx.fillRect(27, 18, 4, 8);
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(29, 18, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

/**
 * 🔥 CHIMENEA ACOGEDORA DE TABERNA CON CORNAMENTA (48x48 px)
 */
export function getTavernFireplaceCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(24, 42, 20, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Estructura de piedra de chimenea
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(6, 12, 36, 32);
  ctx.fillStyle = '#334155';
  ctx.fillRect(8, 14, 32, 28);
  ctx.fillStyle = '#475569';
  ctx.fillRect(10, 16, 28, 24);

  // Repisa de madera noble
  ctx.fillStyle = '#451a03';
  ctx.fillRect(4, 10, 40, 5);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(5, 10, 38, 2);

  // Cornamenta de ciervo decorativa sobre la repisa
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(23, 4, 2, 6); // Cabeza
  ctx.fillRect(17, 2, 2, 5); // Asta izq
  ctx.fillRect(19, 4, 4, 2);
  ctx.fillRect(29, 2, 2, 5); // Asta der
  ctx.fillRect(25, 4, 4, 2);

  // Hogar ardiente con leña y fuego vivo
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(14, 24, 20, 18);
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(16, 26, 16, 15);

  // Troncos
  ctx.fillStyle = '#451a03';
  ctx.fillRect(16, 37, 16, 4);

  // Fuego animado parpadeante
  const flicker = Math.sin(time * 8) * 2;
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(17, 30 + flicker, 14, 9);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(19, 32 + flicker * 0.7, 10, 7);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(22, 35 + flicker * 0.5, 4, 4);

  return canvas;
}

/**
 * 🍷 PILA DE BARRILES DE VINO Y CERVEZA (32x32 px)
 */
export function getTavernBarrelStackCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(16, 26, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2 Barriles inferiores
  const drawBarrel = (x: number, y: number) => {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x, y, 14, 14);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 1, y + 1, 12, 12);
    // Aros de hierro
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, y + 3, 14, 2);
    ctx.fillRect(x, y + 9, 14, 2);
    // Grifo de latón
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 5, y + 6, 4, 2);
  };

  drawBarrel(2, 14);
  drawBarrel(16, 14);
  // 1 Barril superior
  drawBarrel(9, 4);

  return canvas;
}

/**
 * 🔥 ANTORCHA Y APLIQUE DE PARED MEDIEVAL DE FORJA (32x32 px)
 * Con soporte de hierro, antorcha de madera con llama crepitante animada y halo cálido
 */
export function getWallTorchCanvas(
  time: number = 0,
  side: 'front' | 'left' | 'right' = 'front'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const flicker = Math.sin(time * 8) * 1.5;
  const tX = side === 'left' ? 8 : side === 'right' ? 24 : 16;
  const tY = 16;

  // 1. Halo de luz cálida ámbar proyectado en la pared
  const glow = ctx.createRadialGradient(tX, tY - 4, 2, tX, tY - 4, 16);
  glow.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
  glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
  glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(tX, tY - 4, 16, 0, Math.PI * 2);
  ctx.fill();

  // 2. Placa y soporte de hierro forjado en la pared
  ctx.fillStyle = '#0f172a';
  if (side === 'left') {
    ctx.fillRect(2, tY + 2, 4, 8); // Placa pared
    ctx.fillRect(4, tY + 4, 6, 3); // Brazo curvo
  } else if (side === 'right') {
    ctx.fillRect(26, tY + 2, 4, 8);
    ctx.fillRect(22, tY + 4, 6, 3);
  } else {
    ctx.fillRect(tX - 4, tY + 4, 8, 8);
    ctx.fillStyle = '#334155';
    ctx.fillRect(tX - 3, tY + 5, 6, 6);
  }

  // 3. Casquillo de bronce y mango de madera de la antorcha
  ctx.fillStyle = '#451a03';
  ctx.fillRect(tX - 2, tY - 2, 4, 12); // Palo de madera
  ctx.fillStyle = '#b45309';
  ctx.fillRect(tX - 3, tY - 4, 6, 4); // Casquillo de bronce
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(tX - 4, tY - 6, 8, 3); // Aro superior

  // 4. Llama animada de fuego vivo
  ctx.fillStyle = '#ea580c'; // Fuego exterior
  ctx.beginPath();
  ctx.ellipse(tX, tY - 9 + flicker * 0.5, 4, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f59e0b'; // Núcleo naranja
  ctx.beginPath();
  ctx.ellipse(tX, tY - 8 + flicker * 0.4, 3, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef08a'; // Brillo blanco/amarillo
  ctx.beginPath();
  ctx.ellipse(tX, tY - 7 + flicker * 0.3, 1.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Chispas flotantes
  const sparkY = ((time * 20) % 10);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(tX - 1 + Math.sin(time * 6) * 3, tY - 14 - sparkY, 1, 1);

  return canvas;
}

/**
 * 🕯️ CANDELABRO DE ARAÑA COLGANTE DE TABERNA (48x48 px)
 */
export function getTavernChandelierCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const flicker = Math.sin(time * 7) * 1.2;

  // Cadena superior de hierro
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(23, 0, 2, 16);
  ctx.fillStyle = '#334155';
  ctx.fillRect(23, 4, 2, 2);
  ctx.fillRect(23, 10, 2, 2);

  // Rueda de madera de roble y hierro
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(24, 40, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.ellipse(24, 24, 20, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(24, 24, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Aros de hierro
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4 Velas con llamas vivas
  const candlePositions = [8, 16, 32, 40];
  for (let i = 0; i < candlePositions.length; i++) {
    const cX = candlePositions[i];
    const cY = 20;

    // Cera blanca
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(cX - 1, cY - 5, 3, 6);
    // Llama
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(cX - 2, cY - 9 + flicker * 0.4, 4, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cX - 1, cY - 8 + flicker * 0.3, 2, 3);
  }

  return canvas;
}

/**
 * 🌿 GRAN BOTICA ALQUÍMICA DE LYNDA (CUTE FANTASY 2.5D HD - 96x128 px)
 * Tejado amatista mística, ventanas con luz esmeralda viva, rótulo con matraz de poción,
 * chimenea con humo mágico y jardineras de hierbas aromáticas en el porche.
 */
export function getApothecaryCuteHouseCanvas(
  baseImg: HTMLImageElement,
  time: number = 0
): HTMLCanvasElement {
  const baseHouse = getRecoloredCuteHouseCanvas(baseImg, 'purple');
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // 1. Dibujar la casa base 2.5D de Cute Fantasy (tejado amatista)
  ctx.drawImage(baseHouse, 0, 0);

  // 2. Ventana con resplandor mágico esmeralda / cian alquímico
  const pulse = Math.sin(time * 6) * 0.15 + 0.85;
  // Ventana superior
  ctx.fillStyle = `rgba(16, 185, 129, ${pulse})`;
  ctx.fillRect(44, 46, 7, 7);
  ctx.fillStyle = `rgba(167, 243, 208, ${pulse * 0.9})`;
  ctx.fillRect(45, 47, 5, 5);
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(47, 46, 1, 7);
  ctx.fillRect(44, 49, 7, 1);

  // Ventana inferior derecha
  ctx.fillStyle = `rgba(16, 185, 129, ${pulse})`;
  ctx.fillRect(66, 68, 8, 8);
  ctx.fillStyle = `rgba(167, 243, 208, ${pulse * 0.9})`;
  ctx.fillRect(67, 69, 6, 6);
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(70, 68, 1, 8);
  ctx.fillRect(66, 72, 8, 1);

  // 3. Gran Chimenea con Humo Mágico Alquímico (púrpura y esmeralda)
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(68, 26, 8, 20);
  ctx.fillStyle = '#312e81';
  ctx.fillRect(69, 28, 6, 17);
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(67, 24, 10, 3);

  // Volutas de humo mágico animado
  const sOffset1 = Math.sin(time * 3) * 3;
  const sOffset2 = Math.cos(time * 2.5) * 4;
  const sRise1 = (time * 12) % 18;
  const sRise2 = ((time + 1) * 12) % 18;
  ctx.fillStyle = 'rgba(192, 132, 252, 0.55)'; // Humo lavanda
  ctx.beginPath();
  ctx.arc(72 + sOffset1, 20 - sRise1, 4 + (sRise1 / 4), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(110, 231, 183, 0.4)'; // Humo esmeralda
  ctx.beginPath();
  ctx.arc(74 + sOffset2, 12 - sRise2, 5 + (sRise2 / 3), 0, Math.PI * 2);
  ctx.fill();

  // 4. Rótulo colgante de boticario con Hoja y Matraz de Poción (`🌿`)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(38, 52, 20, 2); // Soporte
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(40, 54, 18, 9);
  ctx.fillStyle = '#047857';
  ctx.fillRect(41, 55, 16, 7);
  // Matraz de poción verde esmeralda
  ctx.fillStyle = '#10b981';
  ctx.fillRect(47, 57, 5, 4);
  ctx.fillRect(48, 56, 3, 2);
  ctx.fillStyle = '#a7f3d0';
  ctx.fillRect(48, 58, 2, 2);
  // Hoja mágica dorada
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(53, 56, 3, 4);

  // 5. Jardineras de Hierbas Medicinales en el Porche
  // Jardinera izquierda
  ctx.fillStyle = '#451a03';
  ctx.fillRect(16, 86, 12, 10);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(17, 87, 10, 8);
  // Flores de lavanda y hierbabuena
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(17, 83, 10, 4);
  ctx.fillStyle = '#c084fc'; // Lavanda
  ctx.fillRect(18, 81, 2, 3);
  ctx.fillRect(21, 80, 2, 4);
  ctx.fillRect(24, 82, 2, 3);

  // Cesta de ingredientes y tarros a la derecha
  ctx.fillStyle = '#78350f';
  ctx.fillRect(72, 88, 10, 10);
  // Frascos de poción roja y azul en la cesta
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(73, 85, 3, 4);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(77, 85, 3, 4);

  return canvas;
}

/**
 * 🧙 GRAN CALDERO DE ALQUIMIA BURBUJEANTE (48x48 px)
 */
export function getAlchemyCauldronCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(24, 40, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Brasas y fuego bajo el caldero
  const flicker = Math.sin(time * 8) * 1.5;
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(14, 34, 20, 6);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(16, 33 + flicker * 0.4, 16, 5);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(18, 35 + flicker * 0.3, 12, 3);

  // 3 Patas de hierro forjado
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(12, 30, 4, 10);
  ctx.fillRect(32, 30, 4, 10);
  ctx.fillRect(22, 32, 4, 8);

  // Cuerpo del Caldero de hierro fundido
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(24, 24, 16, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(24, 23, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Aro superior del caldero
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(24, 15, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Poción mágica esmeralda burbujeante
  const pPulse = Math.sin(time * 5) * 0.1 + 0.9;
  ctx.fillStyle = `rgba(16, 185, 129, ${pPulse})`;
  ctx.beginPath();
  ctx.ellipse(24, 15, 12, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#a7f3d0';
  ctx.fillRect(20, 14, 3, 2);

  // Burbujas y vapores mágicos animados ascendiendo
  const bRise1 = (time * 15) % 20;
  const bRise2 = ((time + 0.5) * 15) % 20;
  ctx.fillStyle = 'rgba(52, 211, 153, 0.7)';
  ctx.beginPath();
  ctx.arc(20 + Math.sin(time * 4) * 4, 14 - bRise1, 2 + (bRise1 / 8), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(192, 132, 252, 0.6)';
  ctx.beginPath();
  ctx.arc(28 + Math.cos(time * 3) * 4, 14 - bRise2, 2.5 + (bRise2 / 7), 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

/**
 * ⚗️ MOSTRADOR DE ALQUIMIA CON ALAMBIQUE Y MATRACES (32x32 px)
 */
export function getApothecaryCounterCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(16, 26, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mostrador de madera de caoba
  ctx.fillStyle = '#312e81';
  ctx.fillRect(2, 10, 28, 18);
  ctx.fillStyle = '#4338ca';
  ctx.fillRect(4, 12, 24, 15);
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(6, 14, 20, 12);

  // Tablero superior pulido
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(0, 8, 32, 5);
  ctx.fillStyle = '#047857';
  ctx.fillRect(1, 8, 30, 2);

  // Alambique de cobre a la izquierda
  ctx.fillStyle = '#b45309';
  ctx.fillRect(4, 3, 5, 6);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(5, 1, 3, 3);
  // Tubo curvado
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(8, 2, 4, 1);
  ctx.fillRect(11, 3, 1, 5);

  // Mortero de piedra
  ctx.fillStyle = '#64748b';
  ctx.fillRect(14, 5, 5, 4);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(16, 3, 2, 4); // Mano del mortero

  // Matraces de pociones mágicas de colores
  ctx.fillStyle = '#ef4444'; // Vida roja
  ctx.fillRect(21, 4, 3, 5);
  ctx.fillStyle = '#3b82f6'; // Maná azul
  ctx.fillRect(25, 3, 3, 6);
  ctx.fillStyle = '#10b981'; // Aguante verde
  ctx.fillRect(29, 5, 2, 4);

  return canvas;
}

/**
 * 🌿 ESTANTE DE SECADO DE HIERBAS MEDICINALES (32x32 px)
 */
export function getHerbDryingRackCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(16, 26, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Marco de madera del bastidor
  ctx.fillStyle = '#451a03';
  ctx.fillRect(2, 4, 3, 24);
  ctx.fillRect(27, 4, 3, 24);
  ctx.fillRect(2, 6, 28, 2);
  ctx.fillRect(2, 14, 28, 2);

  // Manojos de hierbas secándose colgadas
  // Fila superior
  ctx.fillStyle = '#c084fc'; // Lavanda
  ctx.fillRect(8, 8, 3, 6);
  ctx.fillStyle = '#15803d'; // Salvia
  ctx.fillRect(14, 8, 3, 6);
  ctx.fillStyle = '#eab308'; // Manzanilla
  ctx.fillRect(20, 8, 3, 6);

  // Fila inferior
  ctx.fillStyle = '#16a34a'; // Menta
  ctx.fillRect(6, 16, 3, 6);
  ctx.fillStyle = '#ec4899'; // Flor de loto
  ctx.fillRect(12, 16, 3, 6);
  ctx.fillStyle = '#38bdf8'; // Raíz de escarcha
  ctx.fillRect(18, 16, 3, 6);
  ctx.fillStyle = '#f97316'; // Hongo ígneo
  ctx.fillRect(23, 16, 3, 6);

  return canvas;
}

/**
 * 🪦 GRAN MAUSOLEO Y CRIPTA GÓTICA (CUTE FANTASY 2.5D HD - 96x128 px)
 * Misma geometría y perspectiva isométrica 2.5D que los demás edificios nobles,
 * con tejado de pizarra oscura, sillería de piedra basalto, portal ojival con verja negra,
 * tímpano con calavera sepulcral, antorchas de fuego fatuo y niebla espectral animada.
 */
export function getCryptMausoleumCanvas(
  baseImg: HTMLImageElement,
  time: number = 0
): HTMLCanvasElement {
  const baseHouse = getRecoloredCuteHouseCanvas(baseImg, 'stone');
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // 1. Dibujar la casa base 2.5D isométrica de Cute Fantasy (tejado de pizarra oscura)
  ctx.drawImage(baseHouse, 0, 0);

  // 2. Tonalidad y Textura de Piedra Gótica en la Fachada Frontal y Flanco Lateral 2.5D
  // Fachada frontal
  ctx.fillStyle = 'rgba(24, 24, 27, 0.45)';
  ctx.fillRect(20, 56, 48, 48);
  // Flanco lateral en perspectiva isométrica
  ctx.fillStyle = 'rgba(9, 9, 11, 0.55)';
  ctx.fillRect(68, 62, 16, 46);

  // Bloques de sillería de piedra esculpida en la fachada
  ctx.fillStyle = 'rgba(63, 63, 70, 0.35)';
  for (let y = 60; y < 100; y += 8) {
    for (let x = 22; x < 66; x += 12) {
      ctx.fillRect(x + ((y / 8) % 2 * 6), y, 10, 6);
    }
  }

  // 3. Gran Cruz Gótica en la Cumbrera del Tejado 2.5D
  ctx.fillStyle = '#18181b';
  ctx.fillRect(46, 2, 4, 16); // Mástil
  ctx.fillRect(42, 6, 12, 4); // Travesaño
  ctx.fillStyle = '#52525b';
  ctx.fillRect(47, 3, 2, 14);
  ctx.fillRect(43, 7, 10, 2);

  // Pináculos góticos en los extremos del alero
  ctx.fillStyle = '#27272a';
  ctx.fillRect(12, 48, 4, 10);
  ctx.fillRect(13, 44, 2, 4);
  ctx.fillRect(80, 52, 4, 10);
  ctx.fillRect(81, 48, 2, 4);

  // 4. Portal Gótico Ojival Rehundido en la Entrada
  ctx.fillStyle = '#09090b'; // Fondo abismal
  ctx.beginPath();
  ctx.moveTo(34, 102);
  ctx.lineTo(34, 76);
  ctx.quadraticCurveTo(46, 62, 58, 76);
  ctx.lineTo(58, 102);
  ctx.closePath();
  ctx.fill();

  // Moldura de piedra del arco
  ctx.strokeStyle = '#52525b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(34, 102);
  ctx.lineTo(34, 76);
  ctx.quadraticCurveTo(46, 62, 58, 76);
  ctx.lineTo(58, 102);
  ctx.stroke();

  // Rejas de hierro forjado negro con puntas de flecha
  ctx.fillStyle = '#27272a';
  for (let rx = 38; rx <= 54; rx += 4) {
    ctx.fillRect(rx, 74, 2, 28);
    // Púas superiores
    ctx.fillStyle = '#71717a';
    ctx.fillRect(rx - 1, 71, 4, 3);
    ctx.fillStyle = '#27272a';
  }
  ctx.fillRect(35, 84, 22, 2);
  ctx.fillRect(35, 94, 22, 2);

  // 5. Tímpano Esculpido con Calavera Sepulcral (`☠️`)
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.arc(46, 56, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e4e4e7'; // Calavera de piedra
  ctx.fillRect(43, 53, 6, 5);
  ctx.fillRect(44, 58, 4, 2);
  ctx.fillStyle = '#09090b'; // Cuencas oculares
  ctx.fillRect(44, 54, 2, 2);
  ctx.fillRect(47, 54, 2, 2);
  // Brillo espectral en los ojos
  ctx.fillStyle = '#c084fc';
  ctx.fillRect(44, 54, 1, 1);
  ctx.fillRect(47, 54, 1, 1);

  // 6. Antorchas de Fuego Fatuo (Llama espectral violeta y cian animada)
  const specFlicker = Math.sin(time * 8) * 1.5;
  const drawSpectralTorch = (tx: number, ty: number) => {
    ctx.fillStyle = '#09090b';
    ctx.fillRect(tx, ty, 3, 6); // Soporte
    ctx.fillStyle = '#7c3aed'; // Resplandor violeta
    ctx.fillRect(tx - 2, ty - 6 + specFlicker * 0.4, 7, 7);
    ctx.fillStyle = '#a78bfa';
    ctx.fillRect(tx - 1, ty - 5 + specFlicker * 0.3, 5, 5);
    ctx.fillStyle = '#38bdf8'; // Núcleo cian etéreo
    ctx.fillRect(tx, ty - 4 + specFlicker * 0.2, 3, 3);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(tx + 1, ty - 3, 1, 2);
  };
  drawSpectralTorch(26, 78);
  drawSpectralTorch(64, 80);

  // 7. Niebla Espectral Fría arrastrándose por el suelo 2.5D
  const mist1 = Math.sin(time * 2) * 5;
  const mist2 = Math.cos(time * 1.7) * 7;
  ctx.fillStyle = 'rgba(192, 132, 252, 0.22)';
  ctx.beginPath();
  ctx.ellipse(40 + mist1, 106, 26, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
  ctx.beginPath();
  ctx.ellipse(54 + mist2, 108, 30, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

/**
 * ⚰️ SARCÓFAGO DE PIEDRA CON EFIGIE TALLADA (32x48 px)
 */
export function getStoneSarcophagusCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.ellipse(16, 42, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Base y caja del sarcófago de piedra
  ctx.fillStyle = '#18181b';
  ctx.fillRect(4, 10, 24, 34);
  ctx.fillStyle = '#27272a';
  ctx.fillRect(5, 11, 22, 32);

  // Tapa esculpida de piedra
  ctx.fillStyle = '#3f3f46';
  ctx.fillRect(6, 8, 20, 32);
  ctx.fillStyle = '#52525b';
  ctx.fillRect(7, 9, 18, 30);

  // Efigie del Caballero Caído tallada en relieve
  // Cabeza con yelmo y almohada
  ctx.fillStyle = '#71717a';
  ctx.fillRect(12, 12, 8, 7);
  ctx.fillStyle = '#27272a';
  ctx.fillRect(13, 15, 6, 2); // Visera del yelmo

  // Pecho con cruz en relieve y manos cruzadas
  ctx.fillStyle = '#a1a1aa';
  ctx.fillRect(11, 20, 10, 10);
  ctx.fillStyle = '#71717a';
  ctx.fillRect(15, 21, 2, 8); // Cruz
  ctx.fillRect(13, 23, 6, 2);

  // Espada descansando a lo largo del cuerpo
  ctx.fillStyle = '#e4e4e7';
  ctx.fillRect(15, 30, 2, 8); // Hoja
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(14, 29, 4, 1); // Guarda dorada

  // Musgo en la base del sarcófago
  ctx.fillStyle = '#14532d';
  ctx.fillRect(4, 38, 4, 4);
  ctx.fillRect(23, 40, 5, 3);

  return canvas;
}

/**
 * 🔥 BRASERO ESPECTRAL CON FUEGO FATUO VIOLETA (32x32 px)
 */
export function getSpectralBrazierCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(16, 26, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Trípode de hierro forjado gótico
  ctx.fillStyle = '#09090b';
  ctx.fillRect(8, 16, 3, 12);
  ctx.fillRect(21, 16, 3, 12);
  ctx.fillRect(14, 18, 4, 10);

  // Cuenco del brasero
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.ellipse(16, 16, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#27272a';
  ctx.beginPath();
  ctx.ellipse(16, 15, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Llama espectral violeta y cian animada
  const f1 = Math.sin(time * 7) * 1.5;
  const f2 = Math.cos(time * 6) * 1.5;

  ctx.fillStyle = 'rgba(124, 58, 237, 0.9)'; // Púrpura oscuro
  ctx.beginPath();
  ctx.moveTo(8, 15);
  ctx.quadraticCurveTo(16 + f1, 2, 24, 15);
  ctx.fill();

  ctx.fillStyle = '#a78bfa'; // Lavanda
  ctx.beginPath();
  ctx.moveTo(11, 15);
  ctx.quadraticCurveTo(16 + f2, 5, 21, 15);
  ctx.fill();

  ctx.fillStyle = '#38bdf8'; // Cian espectral interior
  ctx.fillRect(14, 10 + f1 * 0.4, 4, 5);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(15, 11, 2, 3);

  // Volutas de almas ascendiendo
  const sRise = (time * 12) % 15;
  ctx.fillStyle = 'rgba(192, 132, 252, 0.5)';
  ctx.fillRect(15 + Math.sin(time * 4) * 3, 8 - sRise, 2, 2);

  return canvas;
}

/**
 * 💀 PILA DE URNAS FUNERARIAS Y CRÁNEOS CON CIRIOS (32x32 px)
 */
export function getBoneUrnStackCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(16, 26, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Gran urna de arcilla oscura
  ctx.fillStyle = '#27272a';
  ctx.beginPath();
  ctx.ellipse(10, 18, 7, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3f3f46';
  ctx.fillRect(7, 10, 6, 3); // Boca de la urna

  // Urna dorada antigua con pátina
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(22, 20, 6, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cráneo con cirio derritiéndose encima
  ctx.fillStyle = '#e4e4e7';
  ctx.fillRect(13, 19, 7, 6);
  ctx.fillRect(14, 25, 5, 3); // Mandíbula
  ctx.fillStyle = '#18181b';
  ctx.fillRect(14, 21, 2, 2); // Ojos
  ctx.fillRect(17, 21, 2, 2);

  // Cirio blanco goteando cera sobre el cráneo
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(15, 12, 3, 7);
  // Llama
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(15, 8, 3, 4);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(16, 9, 1, 2);

  // Huesos y costillas dispersas
  ctx.fillStyle = '#d4d4d8';
  ctx.fillRect(4, 25, 8, 2);
  ctx.fillRect(20, 26, 9, 2);

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
 * 📜 TABLÓN DE ANUNCIOS Y MISIONES DE LA ALDEA (40x48 px)
 */
export function getNoticeBoardCanvas(): HTMLCanvasElement {
  const cacheKey = `notice_board_hd`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 40;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra de contacto
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(20, 44, 16, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Postes de madera maciza
  ctx.fillStyle = '#451a03';
  ctx.fillRect(8, 14, 4, 30);
  ctx.fillRect(28, 14, 4, 30);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(9, 15, 2, 28);
  ctx.fillRect(29, 15, 2, 28);

  // Tablero de madera de roble
  ctx.fillStyle = '#451a03';
  ctx.fillRect(4, 12, 32, 22);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(6, 14, 28, 18);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(7, 15, 26, 16);

  // Tejadillo de tejas de pizarra
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(2, 6, 36, 6);
  ctx.fillStyle = '#334155';
  ctx.fillRect(3, 7, 34, 3);
  ctx.fillStyle = '#475569';
  ctx.fillRect(2, 6, 36, 2);

  // Pergaminos y avisos de recompensas
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(9, 17, 8, 11);
  ctx.fillRect(19, 18, 7, 9);
  ctx.fillRect(27, 20, 5, 8);

  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(10, 19, 6, 1);
  ctx.fillRect(10, 21, 5, 1);
  ctx.fillRect(10, 23, 6, 1);
  ctx.fillRect(20, 20, 5, 1);
  ctx.fillRect(20, 22, 4, 1);

  // Chinchetas rojas / sellos de cera
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(12, 17, 2, 2);
  ctx.fillRect(22, 18, 2, 2);

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🪨 GRAN ROCA REDONDEADA CON MUSGO (36x32 px)
 */
export function getMossyBoulderCanvas(): HTMLCanvasElement {
  const cacheKey = `mossy_boulder_hd`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 36;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra elíptica
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.beginPath();
  ctx.ellipse(18, 26, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Roca redondeada base
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(18, 18, 13, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cuerpo gris de piedra
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.ellipse(17, 16, 11, 8, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Relieve de luz superior
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(15, 13, 8, 4, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(14, 12, 4, 2);

  // Manchas de musgo verde vivo
  ctx.fillStyle = '#15803d';
  ctx.beginPath(); ctx.ellipse(12, 16, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(22, 19, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(12, 15, 2, 2);
  ctx.fillRect(23, 18, 3, 2);

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
 * ⚒️ GRAN EDIFICIO DE LA FORJA REAL Y MAESTRANZA (96x112 px)
 * Arquitectura de cantería pesada con tejado de pizarra, chimenea industrial humeante y rótulo de yunque
 */
export function getForgeCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 112;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // 1. Sombra de contacto suave
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.beginPath();
  ctx.ellipse(48, 100, 42, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Muros de cantería de piedra basalto (Cuerpo principal: 68x50 px)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(14, 52, 68, 50);
  ctx.fillStyle = '#334155';
  ctx.fillRect(16, 54, 64, 46);

  // Textura de sillares de piedra y juntas
  ctx.fillStyle = '#1e293b';
  for (let r = 0; r < 5; r++) {
    const yLine = 54 + r * 9;
    ctx.fillRect(16, yLine, 64, 1);
    const offset = (r % 2) * 12;
    for (let c = 0; c < 4; c++) {
      ctx.fillRect(20 + offset + c * 16, yLine, 1, 9);
    }
  }

  // Refuerzos de esquinas con remaches de hierro
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(14, 52, 5, 50);
  ctx.fillRect(77, 52, 5, 50);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(16, 58, 2, 2);
  ctx.fillRect(16, 76, 2, 2);
  ctx.fillRect(16, 92, 2, 2);
  ctx.fillRect(79, 58, 2, 2);
  ctx.fillRect(79, 76, 2, 2);
  ctx.fillRect(79, 92, 2, 2);

  // 3. Gran Chimenea de Piedra en el lateral derecho
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(70, 8, 18, 50);
  ctx.fillStyle = '#334155';
  ctx.fillRect(72, 10, 14, 46);
  ctx.fillStyle = '#475569';
  ctx.fillRect(73, 11, 12, 44);
  // Remate superior de chimenea
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(69, 6, 20, 4);

  // Bocanadas de humo animado
  const smokeP1 = Math.sin(time * 3) * 3;
  const smokeP2 = Math.cos(time * 2.5) * 4;
  ctx.fillStyle = 'rgba(203, 213, 225, 0.45)';
  ctx.beginPath();
  ctx.arc(79 + smokeP1, 3, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.beginPath();
  ctx.arc(82 + smokeP2, -5, 7, 0, Math.PI * 2);
  ctx.fill();

  // 4. Tejado a dos aguas de pizarra negra volcánica
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.moveTo(48, 14); ctx.lineTo(6, 54); ctx.lineTo(90, 54);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(48, 17); ctx.lineTo(10, 52); ctx.lineTo(86, 52);
  ctx.fill();

  // Tejas de pizarra
  ctx.fillStyle = '#1e293b';
  for (let step = 0; step < 4; step++) {
    const yT = 24 + step * 8;
    const wT = 20 + step * 16;
    ctx.fillRect(48 - wT / 2, yT, wT, 2);
  }

  // Viga maestra de madera en frontón
  ctx.fillStyle = '#78350f';
  ctx.fillRect(46, 20, 4, 32);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(10, 52, 76, 3);

  // 5. Puerta doble de roble con arco de medio punto y herrajes
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(38, 70, 20, 32);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(40, 72, 16, 30);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(41, 73, 6, 28);
  ctx.fillRect(49, 73, 6, 28);
  // Bisagras de hierro negro y pomo
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(39, 76, 3, 3);
  ctx.fillRect(39, 92, 3, 3);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(46, 86, 2, 2);
  ctx.fillRect(48, 86, 2, 2);

  // 6. Ventana enrejada con resplandor del fuego interior
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(20, 66, 14, 16);
  // Resplandor cálido de la fragua parpadeando
  const fireFlicker = Math.sin(time * 8) * 0.15 + 0.85;
  ctx.fillStyle = `rgba(249, 115, 22, ${fireFlicker})`;
  ctx.fillRect(21, 67, 12, 14);
  ctx.fillStyle = `rgba(254, 240, 138, ${fireFlicker * 0.9})`;
  ctx.fillRect(24, 70, 6, 8);
  // Rejas de hierro
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(27, 67, 1, 14);
  ctx.fillRect(21, 74, 12, 1);

  // 7. Rótulo colgante de herrería con yunque dorado
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(32, 56, 32, 2); // Barra de hierro
  ctx.fillStyle = '#451a03';
  ctx.fillRect(36, 58, 24, 10);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(37, 59, 22, 8);
  // Icono del yunque dorado
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(44, 61, 8, 4);
  ctx.fillRect(42, 62, 12, 2);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(45, 62, 6, 1);

  // 8. Cobertizo lateral con leña y carbón (Izquierda: 14x24 px)
  ctx.fillStyle = '#451a03';
  ctx.fillRect(2, 74, 12, 28);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(3, 72, 12, 4); // Tejadillo
  // Troncos apilados
  ctx.fillStyle = '#92400e';
  ctx.fillRect(4, 82, 8, 3);
  ctx.fillRect(4, 87, 8, 3);
  ctx.fillRect(4, 92, 8, 3);
  ctx.fillRect(4, 97, 8, 3);

  return canvas;
}

/**
 * 🌋 GRAN HORNO MONUMENTAL DE FUNDICIÓN (64x64 px)
 */
export function getBlastFurnaceCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra elíptica amplia
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(32, 54, 26, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Estructura de piedra volcánica / basalto
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(8, 12, 48, 44);
  ctx.fillStyle = '#334155';
  ctx.fillRect(10, 14, 44, 40);
  ctx.fillStyle = '#475569';
  ctx.fillRect(12, 16, 40, 36);

  // Chimenea superior de sillería
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(20, 2, 24, 12);
  ctx.fillStyle = '#334155';
  ctx.fillRect(22, 4, 20, 10);

  // Bandas y remaches de hierro forjado
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(8, 18, 48, 3);
  ctx.fillRect(8, 48, 48, 3);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(12, 19, 2, 2);
  ctx.fillRect(30, 19, 2, 2);
  ctx.fillRect(50, 19, 2, 2);

  // Arco del Horno con Fuego Ardiente
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(18, 28, 28, 24);
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(20, 30, 24, 22);

  // Llamas animadas y metal incandescente
  const flicker = Math.sin(time * 10) * 2;
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(22, 34 + flicker, 20, 18);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(24, 38 + flicker * 0.7, 16, 12);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(28, 42 + flicker * 0.5, 8, 6);

  // Crisol de fundición con metal líquido
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(44, 38, 12, 14);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(46, 40, 8, 4);

  return canvas;
}

/**
 * 🔨 YUNQUE DE HERRERO Y ESTACIÓN DE TRABAJO (32x32 px)
 */
export function getAnvilWorkstationCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(16, 26, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tronco de madera noble como soporte
  ctx.fillStyle = '#451a03';
  ctx.fillRect(8, 16, 16, 10);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(10, 17, 12, 8);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(11, 16, 10, 2);

  // Abrazadera de hierro del tronco
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(8, 20, 16, 2);

  // Yunque de Acero Macizo (con cuerno y base pesada)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(6, 10, 20, 7);
  ctx.fillStyle = '#475569';
  ctx.fillRect(4, 8, 22, 5); // Cuerno y cara plana
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(8, 8, 14, 2); // Brillo metálico superior
  ctx.fillStyle = '#334155';
  ctx.fillRect(2, 9, 4, 3);  // Punta del cuerno

  // Martillo de forja reposando
  ctx.fillStyle = '#78350f';
  ctx.fillRect(10, 5, 2, 5); // Mango
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(9, 4, 4, 3); // Cabeza de acero

  // Cubo de agua de enfriamiento al lado
  ctx.fillStyle = '#334155';
  ctx.fillRect(24, 18, 6, 8);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(25, 19, 4, 2);

  // Chispas de forjado ocasionales
  if (Math.sin(time * 6) > 0.5) {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(13, 3, 2, 2);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(17, 4, 1, 1);
  }

  return canvas;
}

/**
 * 🪨 PILA DE MINERAL DE HIERRO, CARBÓN Y LINGOTES (32x32 px)
 */
export function getOrePileCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(16, 24, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rocas de carbón negro
  ctx.fillStyle = '#09090b';
  ctx.fillRect(4, 16, 10, 8);
  ctx.fillStyle = '#18181b';
  ctx.fillRect(6, 18, 6, 5);

  // Rocas de mineral de hierro plateado
  ctx.fillStyle = '#334155';
  ctx.fillRect(14, 12, 12, 12);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(16, 14, 8, 8);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(18, 15, 4, 3);

  // Lingotes de acero apilados
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(8, 20, 16, 4);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(9, 21, 14, 2);
  ctx.fillStyle = '#f59e0b'; // Lingote de oro
  ctx.fillRect(12, 17, 10, 3);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(13, 17, 8, 1);

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
 * 🪵 VALLA DE MADERA CONECTADA RÚSTICA (32x32 px)
 */
export function getWoodenFenceCanvas(hasLeft: boolean, hasRight: boolean, hasTop: boolean, hasBottom: boolean): HTMLCanvasElement {
  const cacheKey = `wooden_fence_${hasLeft}_${hasRight}_${hasTop}_${hasBottom}`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra del poste central en el suelo
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(16, 26, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Travesaño Horizontal Superior (si conecta a izquierda o derecha)
  if (hasLeft) {
    ctx.fillStyle = '#451a03'; // Sombra
    ctx.fillRect(0, 11, 16, 4);
    ctx.fillStyle = '#78350f'; // Cuerpo
    ctx.fillRect(0, 12, 16, 2);
    ctx.fillStyle = '#b45309'; // Luz
    ctx.fillRect(0, 12, 16, 1);
  }
  if (hasRight) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(16, 11, 16, 4);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(16, 12, 16, 2);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(16, 12, 16, 1);
  }

  // Travesaño Horizontal Inferior
  if (hasLeft) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, 18, 16, 4);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 19, 16, 2);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 19, 16, 1);
  }
  if (hasRight) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(16, 18, 16, 4);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(16, 19, 16, 2);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(16, 19, 16, 1);
  }

  // Travesaño Vertical (si conecta arriba o abajo)
  if (hasTop) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(13, 0, 6, 16);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(14, 0, 4, 16);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(14, 0, 1, 16);
  }
  if (hasBottom) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(13, 16, 6, 16);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(14, 16, 4, 16);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(14, 16, 1, 16);
  }

  // Poste Central Vertical Robusto
  ctx.fillStyle = '#451a03'; // Sombra del poste
  ctx.fillRect(12, 5, 8, 21);
  ctx.fillStyle = '#78350f'; // Cuerpo de madera
  ctx.fillRect(13, 6, 6, 19);
  ctx.fillStyle = '#b45309'; // Vetas iluminadas
  ctx.fillRect(14, 6, 2, 19);
  ctx.fillStyle = '#d97706'; // Reflejo en la cabeza biselada
  ctx.fillRect(13, 5, 6, 2);

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🥕 HORTALIZAS Y CULTIVOS AGRÍCOLAS LIMPIOS (32x32 px)
 */
export function getFarmCropCanvas(variant: number = 0): HTMLCanvasElement {
  const cacheKey = `farm_crop_clean_${variant}`;
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra sobre la tierra arada
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.beginPath();
  ctx.ellipse(16, 25, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  if (variant % 3 === 0) {
    // 🥕 Bancal de Zanahorias
    ctx.fillStyle = '#c2410c'; // Cuerpo naranja
    ctx.fillRect(9, 21, 4, 5); ctx.fillRect(19, 20, 4, 6);
    ctx.fillStyle = '#fb923c'; // Luz
    ctx.fillRect(10, 21, 2, 4); ctx.fillRect(20, 20, 2, 5);
    // Hojas verdes frondosas
    ctx.fillStyle = '#15803d';
    ctx.fillRect(8, 14, 6, 7); ctx.fillRect(18, 13, 6, 7);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(9, 13, 4, 4); ctx.fillRect(19, 12, 4, 4);
  } else if (variant % 3 === 1) {
    // 🎃 Calabaza dorada de huerto
    ctx.fillStyle = '#c2410c'; // Sombra
    ctx.beginPath(); ctx.ellipse(16, 20, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ea580c'; // Cuerpo
    ctx.beginPath(); ctx.ellipse(16, 20, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f97316'; // Relieve
    ctx.fillRect(14, 16, 4, 7);
    ctx.fillStyle = '#15803d'; // Tallo verde
    ctx.fillRect(15, 13, 2, 3);
  } else {
    // 🥬 Lechuga / Col rizada
    ctx.fillStyle = '#166534';
    ctx.beginPath(); ctx.arc(16, 21, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.arc(16, 20, 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#86efac';
    ctx.fillRect(15, 17, 3, 3);
  }

  tileCache.set(cacheKey, canvas);
  return canvas;
}

/**
 * 🪣 ABREVADERO RÚSTICO DE MADERA CON AGUA (32x32 px)
 */
export function getWaterTroughCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra en el suelo
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(16, 26, 13, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Estructura de madera exterior
  ctx.fillStyle = '#451a03';
  ctx.fillRect(3, 12, 26, 14);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(4, 13, 24, 12);

  // Cuenca de agua cristalina
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(6, 15, 20, 8);
  ctx.fillStyle = '#38bdf8';
  const wave = Math.sin(time * 4) * 1.5;
  ctx.fillRect(7, 16, 18, 5);
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(8 + Math.round(wave), 16, 6, 2);

  // Refuerzos de hierro forjado
  ctx.fillStyle = '#334155';
  ctx.fillRect(8, 12, 2, 14);
  ctx.fillRect(22, 12, 2, 14);

  return canvas;
}

/**
 * 🪑 BANCO DE MADERA RÚSTICO PARA PLAZAS (32x32 px)
 */
export function getWoodenBenchCanvas(): HTMLCanvasElement {
  const cacheKey = 'wooden_bench_rustic';
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra en el suelo
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(16, 26, 12, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Patas de hierro forjado
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(6, 18, 3, 8);
  ctx.fillRect(23, 18, 3, 8);

  // Asiento de tablones de madera
  ctx.fillStyle = '#78350f';
  ctx.fillRect(4, 17, 24, 4);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(4, 17, 24, 1);

  // Respaldo de madera
  ctx.fillStyle = '#78350f';
  ctx.fillRect(4, 11, 24, 4);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(4, 11, 24, 1);

  tileCache.set(cacheKey, canvas);
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
 * 🏛️ COLUMNA MONUMENTAL DE MÁRMOL CLÁSICO CON HIEDRA (28x44 px)
 */
export function getRuinedPillarCanvas(): HTMLCanvasElement {
  const cacheKey = 'classical_marble_column_25d';
  if (tileCache.has(cacheKey)) return tileCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 28;
  canvas.height = 44;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra de contacto en el suelo
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.beginPath();
  ctx.ellipse(14, 39, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pedestal inferior de sillar de piedra con molduras
  ctx.fillStyle = '#334155'; // Base oscura
  ctx.fillRect(4, 34, 20, 6);
  ctx.fillStyle = '#64748b'; // Bisel inferior
  ctx.fillRect(5, 34, 18, 5);
  ctx.fillStyle = '#94a3b8'; // Moldura intermedia
  ctx.fillRect(6, 31, 16, 3);
  ctx.fillStyle = '#cbd5e1'; // Luz en la repisa del pedestal
  ctx.fillRect(6, 31, 16, 1);

  // Fuste de columna cilíndrica estriada (Cuerpo)
  ctx.fillStyle = '#475569'; // Sombra lateral izquierda
  ctx.fillRect(8, 11, 2, 20);
  ctx.fillStyle = '#94a3b8'; // Cuerpo principal de mármol
  ctx.fillRect(10, 11, 8, 20);
  ctx.fillStyle = '#cbd5e1'; // Franja iluminada
  ctx.fillRect(11, 11, 4, 20);
  ctx.fillStyle = '#f1f5f9'; // Reflejo de luz frontal
  ctx.fillRect(12, 11, 2, 20);
  ctx.fillStyle = '#334155'; // Sombra lateral derecha
  ctx.fillRect(18, 11, 2, 20);

  // Estrías verticales del mármol
  ctx.fillStyle = '#64748b';
  ctx.fillRect(10, 11, 1, 20);
  ctx.fillRect(14, 11, 1, 20);
  ctx.fillRect(17, 11, 1, 20);

  // Hiedra trepadora sutil en la columna
  ctx.fillStyle = '#14532d';
  ctx.fillRect(8, 26, 3, 3); ctx.fillRect(9, 21, 2, 2); ctx.fillRect(17, 28, 2, 3);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(8, 26, 2, 2); ctx.fillRect(9, 21, 1, 1); ctx.fillRect(17, 28, 1, 2);

  // Capitel jónico/corintio superior con volutas labradas
  ctx.fillStyle = '#334155'; // Sombra bajo el capitel
  ctx.fillRect(6, 9, 16, 2);
  ctx.fillStyle = '#64748b'; // Cuerpo del capitel
  ctx.fillRect(5, 6, 18, 4);
  ctx.fillStyle = '#94a3b8'; // Relieve frontal
  ctx.fillRect(6, 6, 16, 3);
  ctx.fillStyle = '#cbd5e1'; // Coronación superior
  ctx.fillRect(4, 3, 20, 3);
  ctx.fillStyle = '#f8fafc'; // Brillo en la cornisa
  ctx.fillRect(5, 3, 18, 1);

  // Volutas en los extremos del capitel
  ctx.fillStyle = '#475569';
  ctx.fillRect(4, 5, 2, 2); ctx.fillRect(22, 5, 2, 2);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(5, 5, 1, 1); ctx.fillRect(22, 5, 1, 1);

  tileCache.set(cacheKey, canvas);
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
 * 🌳 ÁRBOL DEL BOSQUE ENCANTADO (64x80 px - ESTILO OAK TREE FOLLAJE VIOLETA 2.5D)
 */
export function getEnchantedTreeCanvas(): { trunk: HTMLCanvasElement; canopy: HTMLCanvasElement } {
  const trunk = document.createElement('canvas');
  trunk.width = 48; trunk.height = 36;
  const tCtx = trunk.getContext('2d')!;
  tCtx.imageSmoothingEnabled = false;

  // Sombra proyectada en el suelo
  tCtx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  tCtx.beginPath();
  tCtx.ellipse(24, 24, 14, 4, 0, 0, Math.PI * 2);
  tCtx.fill();

  // Tronco de madera mística plateada / índigo
  tCtx.fillStyle = '#1e1b4b'; // Índigo profundo
  tCtx.fillRect(18, 4, 12, 22);
  tCtx.fillRect(14, 18, 6, 8); // Raíz izquierda
  tCtx.fillRect(28, 18, 6, 8); // Raíz derecha

  // Vetas y corteza mágica
  tCtx.fillStyle = '#312e81';
  tCtx.fillRect(20, 6, 8, 18);
  tCtx.fillStyle = '#4338ca';
  tCtx.fillRect(21, 8, 3, 14);
  tCtx.fillStyle = '#818cf8'; // Runas brillantes en la corteza
  tCtx.fillRect(22, 12, 2, 6);

  const canopy = document.createElement('canvas');
  canopy.width = 64; canopy.height = 64;
  const cCtx = canopy.getContext('2d')!;
  cCtx.imageSmoothingEnabled = false;

  // 1. Sombra exterior
  cCtx.fillStyle = '#1e1035';
  cCtx.beginPath();
  cCtx.arc(32, 34, 24, 0, Math.PI * 2);
  cCtx.fill();

  // 2. Capa base festoneada púrpura oscura
  cCtx.fillStyle = '#3b0764';
  cCtx.beginPath();
  cCtx.arc(18, 30, 14, 0, Math.PI * 2);
  cCtx.arc(46, 30, 14, 0, Math.PI * 2);
  cCtx.arc(32, 20, 18, 0, Math.PI * 2);
  cCtx.arc(32, 36, 16, 0, Math.PI * 2);
  cCtx.fill();

  // 3. Follaje medio amatista
  cCtx.fillStyle = '#6b21a8';
  cCtx.beginPath();
  cCtx.arc(18, 28, 12, 0, Math.PI * 2);
  cCtx.arc(46, 28, 12, 0, Math.PI * 2);
  cCtx.arc(32, 18, 16, 0, Math.PI * 2);
  cCtx.fill();

  // 4. Luces esmeralda y violeta místico
  cCtx.fillStyle = '#9333ea';
  cCtx.beginPath();
  cCtx.arc(18, 26, 9, 0, Math.PI * 2);
  cCtx.arc(46, 26, 9, 0, Math.PI * 2);
  cCtx.arc(32, 16, 12, 0, Math.PI * 2);
  cCtx.fill();

  // 5. Brillos en la coronación de las hojas
  cCtx.fillStyle = '#c084fc';
  cCtx.fillRect(14, 18, 8, 4);
  cCtx.fillRect(40, 18, 8, 4);
  cCtx.fillRect(26, 8, 12, 5);

  cCtx.fillStyle = '#f0abfc'; // Brillo feérico superior
  cCtx.fillRect(16, 18, 4, 2);
  cCtx.fillRect(42, 18, 4, 2);
  cCtx.fillRect(28, 8, 8, 2);

  // Esporas mágicas celestes luminosas
  cCtx.fillStyle = '#38bdf8';
  cCtx.fillRect(18, 22, 2, 2);
  cCtx.fillRect(44, 24, 2, 2);
  cCtx.fillRect(32, 14, 2, 2);

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
 * 🌿 SETO VERDE DEL LABERINTO ENCANTADO (32x32 px - ESTILO OAK TREE)
 */
export function getLabyrinthHedgeCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Sombra base
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(16, 28, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Contorno lobulado
  ctx.fillStyle = '#14532d';
  ctx.beginPath();
  ctx.arc(8, 16, 8, 0, Math.PI * 2);
  ctx.arc(24, 16, 8, 0, Math.PI * 2);
  ctx.arc(16, 12, 10, 0, Math.PI * 2);
  ctx.arc(16, 20, 9, 0, Math.PI * 2);
  ctx.fill();

  // Follaje verde medio
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.arc(8, 15, 6.5, 0, Math.PI * 2);
  ctx.arc(24, 15, 6.5, 0, Math.PI * 2);
  ctx.arc(16, 11, 8.5, 0, Math.PI * 2);
  ctx.fill();

  // Luces esmeralda
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(8, 14, 5, 0, Math.PI * 2);
  ctx.arc(24, 14, 5, 0, Math.PI * 2);
  ctx.arc(16, 10, 6.5, 0, Math.PI * 2);
  ctx.fill();

  // Brillos superiores en las hojas
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(6, 10, 5, 3);
  ctx.fillRect(20, 10, 5, 3);
  ctx.fillRect(13, 6, 6, 3);

  ctx.fillStyle = '#86efac';
  ctx.fillRect(7, 10, 3, 1);
  ctx.fillRect(21, 10, 3, 1);
  ctx.fillRect(14, 6, 4, 1);

  return canvas;
}

/**
 * 💎 GEODA DE CRISTALES DE MANÁ ARCANO (28x40 px)
 */
export function getManaCrystalCanvas(time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 28; canvas.height = 40;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Aura luminiscente mágica pulsante
  const pulse = (Math.sin(time * 3) + 1) * 0.5;
  const aura = ctx.createRadialGradient(14, 22, 2, 14, 22, 16);
  aura.addColorStop(0, `rgba(56, 189, 248, ${0.4 + pulse * 0.3})`);
  aura.addColorStop(0.6, `rgba(14, 165, 233, ${0.15 + pulse * 0.15})`);
  aura.addColorStop(1, 'rgba(14, 165, 233, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.ellipse(14, 22, 14, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sombra de contacto en el suelo
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.beginPath();
  ctx.ellipse(14, 36, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pedestal / Roca base de sillar oscuro
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(4, 30, 20, 6);
  ctx.fillStyle = '#334155';
  ctx.fillRect(6, 29, 16, 5);
  ctx.fillStyle = '#475569';
  ctx.fillRect(7, 29, 6, 3);

  // Cristal Central Alto
  ctx.fillStyle = '#0369a1'; // Sombra posterior
  ctx.beginPath();
  ctx.moveTo(14, 6); ctx.lineTo(19, 22); ctx.lineTo(14, 32); ctx.lineTo(9, 22);
  ctx.fill();

  ctx.fillStyle = '#0284c7'; // Cara izquierda oscura
  ctx.beginPath();
  ctx.moveTo(14, 6); ctx.lineTo(9, 22); ctx.lineTo(14, 32);
  ctx.fill();

  ctx.fillStyle = '#38bdf8'; // Cara derecha iluminada
  ctx.beginPath();
  ctx.moveTo(14, 6); ctx.lineTo(19, 22); ctx.lineTo(14, 32);
  ctx.fill();

  ctx.fillStyle = '#7dd3fc'; // Faceta frontal biselada
  ctx.beginPath();
  ctx.moveTo(14, 8); ctx.lineTo(16, 22); ctx.lineTo(14, 30); ctx.lineTo(12, 22);
  ctx.fill();

  ctx.fillStyle = '#ffffff'; // Destello blanco en la arista
  ctx.fillRect(13, 8, 2, 6);
  ctx.fillRect(14, 14, 1, 8);

  // Cristal Lateral Izquierdo Pequeño
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.moveTo(7, 16); ctx.lineTo(10, 24); ctx.lineTo(6, 32); ctx.lineTo(4, 26);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(7, 16); ctx.lineTo(10, 24); ctx.lineTo(7, 30);
  ctx.fill();
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(7, 18, 1, 4);

  // Cristal Lateral Derecho Pequeño
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.moveTo(21, 16); ctx.lineTo(24, 26); ctx.lineTo(22, 32); ctx.lineTo(18, 24);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(21, 16); ctx.lineTo(24, 26); ctx.lineTo(21, 30);
  ctx.fill();
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(21, 18, 1, 4);

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

