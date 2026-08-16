/**
 * 🗺️ GENERADOR MAESTRO DE MUNDOS EXPANDIDOS Y ORDENADOS (400x400 - 160.000 BALDOSAS)
 * Ciudades estructuradas por distritos con simetría urbanística clásica (estilo Chrono Trigger / Zelda):
 * - Glorieta central con gran fuente, jardines cruciformes y columnas de mármol.
 * - Distritos residenciales y comerciales con patios vallados, árboles frutales y cofres.
 * - Distrito sacro (Mausoleo con santuario, lápidas en hilera y farolas).
 * - Distrito agrícola (Granja con surcos de cultivo geométricos).
 * - Distrito de gremios (Forja, taberna y mercados).
 * - Muro perimetral continuo de bosque que enmarca cada ciudad.
 */

export const MAP_SIZE = 400;

function prng(x: number, y: number, seed: number = 42): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Helper para construir una Ciudad Ordenada y Estructurada por Distritos
 */
function buildOrderlyTown(
  map: number[][],
  cx: number,
  cy: number,
  biome: 'forest' | 'cave' | 'swamp' | 'volcano' | 'tundra' | 'castle' | 'void' | 'sanctuary'
) {
  // 1. Muro perimetral continuo de bosque/roca (35x35)
  for (let y = cy - 17; y <= cy + 17; y++) {
    for (let x = cx - 17; x <= cx + 17; x++) {
      if (x >= 4 && x < MAP_SIZE - 4 && y >= 4 && y < MAP_SIZE - 4) {
        if (x === cx - 17 || x === cx + 17 || y === cy - 17 || y === cy + 17) {
          map[y][x] = 1; // Muro perimetral
        } else {
          map[y][x] = 0; // Césped interior
        }
      }
    }
  }

  // 2. Red de Avenidas Principales (3 baldosas de ancho)
  // Avenida Norte-Sur
  for (let y = cy - 17; y <= cy + 17; y++) {
    for (let x = cx - 1; x <= cx + 1; x++) {
      if (x >= 4 && x < MAP_SIZE - 4 && y >= 4 && y < MAP_SIZE - 4) {
        map[y][x] = 2;
      }
    }
  }
  // Avenida Este-Oeste
  for (let x = cx - 17; x <= cx + 17; x++) {
    for (let y = cy - 1; y <= cy + 1; y++) {
      if (x >= 4 && x < MAP_SIZE - 4 && y >= 4 && y < MAP_SIZE - 4) {
        map[y][x] = 2;
      }
    }
  }
  // Anillo de circunvalación
  for (let x = cx - 15; x <= cx + 15; x++) {
    map[cy - 15][x] = 2; map[cy + 15][x] = 2;
  }
  for (let y = cy - 15; y <= cy + 15; y++) {
    map[y][cx - 15] = 2; map[y][cx + 15] = 2;
  }

  // 3. Gran Glorieta Central con Fuente y Jardines Cruciformes
  for (let y = cy - 6; y <= cy + 6; y++) {
    for (let x = cx - 6; x <= cx + 6; x++) {
      if (Math.abs(x - cx) <= 5 && Math.abs(y - cy) <= 5) {
        map[y][x] = 2; // Pavimento de la plaza
      }
    }
  }
  map[cy][cx] = 4; // Gran Fuente Central

  // Jardines cruciformes de la plaza con flores y columnas
  const gardenOffsets = [
    [cx - 3, cy - 3], [cx + 3, cy - 3],
    [cx - 3, cy + 3], [cx + 3, cy + 3]
  ];
  gardenOffsets.forEach(([gx, gy]) => {
    map[gy][gx] = 12; // Flores
    map[gy - 1][gx] = 12; map[gy + 1][gx] = 12;
    map[gy][gx - 1] = 12; map[gy][gx + 1] = 12;
    map[gy - 1][gx - 1] = 18; map[gy + 1][gx + 1] = 18; // Columnas
  });

  // 4. Distrito Norte (Comercial / Residencial)
  map[cy - 9][cx - 4] = 9;  // Tienda Azul
  map[cy - 9][cx + 4] = 5;  // Casa Roja
  map[cy - 8][cx - 4] = 2;  map[cy - 8][cx + 4] = 2; // Entrada
  map[cy - 12][cx - 4] = 13; map[cy - 12][cx + 4] = 13; // Huerto trasero
  map[cy - 13][cx + 4] = 7;  // Cofre trasero

  // 5. Distrito Oeste (Residencial de la Arboleda)
  map[cy - 4][cx - 9] = 9;
  map[cy + 4][cx - 9] = 5;
  map[cy - 4][cx - 8] = 2; map[cy + 4][cx - 8] = 2;
  map[cy][cx - 12] = 1; map[cy - 2][cx - 12] = 12; map[cy + 2][cx - 12] = 12;
  map[cy + 4][cx - 13] = 7; // Cofre

  // 6. Distrito Este (Residencial de los Rosales)
  map[cy - 4][cx + 9] = 5;
  map[cy + 4][cx + 9] = 5;
  map[cy - 4][cx + 8] = 2; map[cy + 4][cx + 8] = 2;
  map[cy][cx + 12] = 1; map[cy - 2][cx + 12] = 12; map[cy + 2][cx + 12] = 12;
  map[cy - 4][cx + 13] = 7; // Cofre

  // 7. Distrito Suroeste (Mausoleo y Cementerio Sagrado)
  map[cy + 8][cx - 12] = 8; // Santuario
  map[cy + 8][cx - 10] = 17; map[cy + 8][cx - 14] = 17; // Farolas
  map[cy + 10][cx - 12] = 1; // Árbol guardián
  for (let x = cx - 14; x <= cx - 8; x += 2) {
    map[cy + 12][x] = 16; // Hileras de lápidas
    map[cy + 13][x] = 16;
  }

  // 8. Distrito Sureste (Granja Real y Huertos)
  for (let y = cy + 8; y <= cy + 13; y++) {
    for (let x = cx + 8; x <= cx + 14; x++) {
      if (y % 2 === 0 && x % 2 === 0) {
        map[y][x] = 13; // Surcos de trigo
      } else {
        map[y][x] = 12; // Verduras
      }
    }
  }
  map[cy + 13][cx + 14] = 7; // Cofre de la cosecha

  // 9. Distrito Sur Central (La Gran Forja y Taberna Mayor)
  map[cy + 8][cx - 3] = 9;  // Mercado
  map[cy + 8][cx + 3] = 5;  // Taberna
  map[cy + 7][cx - 3] = 2;  map[cy + 7][cx + 3] = 2;
  map[cy + 10][cx - 3] = 7; map[cy + 10][cx + 3] = 7; // Cofres traseros
}

/**
 * 🌲 1. REINO DE AETHELGARD: BOSQUE ESMERALDA, CIUDADES Y BIOMAS (400x400)
 */
export function generateForest400(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  // 1. Bordes de bosque impenetrable
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 3 || x >= MAP_SIZE - 4 || y <= 3 || y >= MAP_SIZE - 4) {
        map[y][x] = 1;
      }
    }
  }

  // 2. Gran Río Fluvial con meandros
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    const rx = Math.round(200 + Math.sin(y * 0.035) * 35 + Math.cos(y * 0.08) * 10);
    for (let offset = -3; offset <= 3; offset++) {
      const cx = rx + offset;
      if (cx > 4 && cx < MAP_SIZE - 4) map[y][cx] = 3;
    }
  }

  // 3. Gran Lago Sagrado Oriental
  for (let y = 195; y <= 275; y++) {
    for (let x = 275; x <= 345; x++) {
      if (Math.hypot((x - 310) / 32, (y - 235) / 38) <= 1.0) map[y][x] = 3;
    }
  }
  // Isla Sagrada del Templo
  for (let y = 230; y <= 242; y++) {
    for (let x = 304; x <= 316; x++) map[y][x] = 2;
  }
  map[236][310] = 8; map[236][306] = 17; map[236][314] = 17; map[236][312] = 7;
  for (let x = 250; x <= 304; x++) map[236][x] = 2;

  // 4. Puentes Monumentales sobre el Río
  [55, 125, 195, 265, 335].forEach((by) => {
    for (let y = by - 1; y <= by + 1; y++) {
      for (let x = 150; x <= 250; x++) {
        if (map[y][x] === 3) map[y][x] = 2;
      }
    }
    map[by - 2][175] = 17; map[by + 2][175] = 17;
  });

  // 5. Red de Carreteras Imperiales Conectoras (3 de ancho)
  [55, 100, 195, 265, 335].forEach((hy) => {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      if (map[hy][x] !== 3) {
        map[hy - 1][x] = 2; map[hy][x] = 2; map[hy + 1][x] = 2;
        if (x % 10 === 0) map[hy - 2][x] = 17;
      }
    }
  });
  [100, 200, 300].forEach((vx) => {
    for (let y = 10; y < MAP_SIZE - 10; y++) {
      if (map[y][vx] !== 3) {
        map[y][vx - 1] = 2; map[y][vx] = 2; map[y][vx + 1] = 2;
        if (y % 10 === 0) map[y][vx + 2] = 17;
      }
    }
  });

  // 6. CIUDAD PRINCIPAL DE ROBLE ESTRUCTURADA (Centro: X: 100, Y: 100)
  buildOrderlyTown(map, 100, 100, 'forest');

  // 7. SEGUNDA CIUDAD ORIENTAL (Centro: X: 300, Y: 100)
  buildOrderlyTown(map, 300, 100, 'forest');

  // 8. TERCERA CIUDAD MERIDIONAL (Centro: X: 100, Y: 265)
  buildOrderlyTown(map, 100, 265, 'forest');

  // Portal del Dragón Primigenio (X: 355, Y: 355)
  for (let y = 348; y <= 362; y++) {
    for (let x = 348; x <= 362; x++) {
      map[y][x] = (x === 348 || x === 362 || y === 348 || y === 362) ? 18 : 2;
    }
  }
  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  // DENSE SCATTER PASS EN LA NATURALEZA (Fuera de las ciudades)
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 101);
        if (val < 0.28) map[y][x] = 1;  // Árbol frondoso (28%)
        else if (val < 0.38) map[y][x] = 12; // Flores silvestres (10%)
        else if (val < 0.42) map[y][x] = 13; // Trigo silvestre (4%)
        else if (val < 0.44) map[y][x] = 19; // Fogata (2%)
        else if (val < 0.46) map[y][x] = 18; // Ruinas (2%)
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 100, y: 112 }, // En la gran avenida de la ciudad
  };
}

/**
 * ⛏️ 2. CUEVA DE SOMBRAS: MINAS DE ERIDU (400x400)
 */
export function generateCave400(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 3 || x >= MAP_SIZE - 4 || y <= 3 || y >= MAP_SIZE - 4) {
        map[y][x] = 1;
      }
    }
  }

  [55, 100, 195, 265, 335].forEach((cy) => {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      map[cy - 1][x] = 2; map[cy][x] = 2; map[cy + 1][x] = 2;
      if (x % 10 === 0) map[cy - 2][x] = 17;
    }
  });
  [100, 200, 300].forEach((cx) => {
    for (let y = 10; y < MAP_SIZE - 10; y++) {
      map[y][cx - 1] = 2; map[y][cx] = 2; map[y][cx + 1] = 2;
      if (y % 10 === 0) map[y][cx + 2] = 17;
    }
  });

  buildOrderlyTown(map, 100, 100, 'cave');
  buildOrderlyTown(map, 300, 100, 'cave');
  buildOrderlyTown(map, 100, 265, 'cave');

  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 202);
        if (val < 0.30) map[y][x] = 1;
        else if (val < 0.44) map[y][x] = 12;
        else if (val < 0.48) map[y][x] = 3;
        else if (val < 0.52) map[y][x] = 17;
        else if (val < 0.56) map[y][x] = 19;
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 100, y: 112 },
  };
}

/**
 * 🐍 3. PANTANO ESPECTRAL DE VAEL (400x400)
 */
export function generateSwamp400(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 3 || x >= MAP_SIZE - 4 || y <= 3 || y >= MAP_SIZE - 4) {
        map[y][x] = 1;
      }
    }
  }

  [55, 100, 195, 265, 335].forEach((sy) => {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      map[sy - 1][x] = 2; map[sy][x] = 2; map[sy + 1][x] = 2;
      if (x % 10 === 0) map[sy - 2][x] = 17;
    }
  });
  [100, 200, 300].forEach((sx) => {
    for (let y = 10; y < MAP_SIZE - 10; y++) {
      map[y][sx - 1] = 2; map[y][sx] = 2; map[y][sx + 1] = 2;
      if (y % 10 === 0) map[y][sx + 2] = 17;
    }
  });

  buildOrderlyTown(map, 100, 100, 'swamp');
  buildOrderlyTown(map, 300, 100, 'swamp');
  buildOrderlyTown(map, 100, 265, 'swamp');

  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 303);
        if (val < 0.32) map[y][x] = 3;
        else if (val < 0.54) map[y][x] = 1;
        else if (val < 0.64) map[y][x] = 12;
        else if (val < 0.68) map[y][x] = 19;
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 100, y: 112 },
  };
}

/**
 * 🌋 4. VOLCÁN ANCESTRAL: FRAGUA DE LOS TITANES (400x400)
 */
export function generateVolcano400(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 3 || x >= MAP_SIZE - 4 || y <= 3 || y >= MAP_SIZE - 4) {
        map[y][x] = 1;
      }
    }
  }

  [55, 100, 195, 265, 335].forEach((vy) => {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      map[vy - 1][x] = 2; map[vy][x] = 2; map[vy + 1][x] = 2;
      if (x % 10 === 0) map[vy - 2][x] = 17;
    }
  });
  [100, 200, 300].forEach((vx) => {
    for (let y = 10; y < MAP_SIZE - 10; y++) {
      map[y][vx - 1] = 2; map[y][vx] = 2; map[y][vx + 1] = 2;
      if (y % 10 === 0) map[y][vx + 2] = 17;
    }
  });

  buildOrderlyTown(map, 100, 100, 'volcano');
  buildOrderlyTown(map, 300, 100, 'volcano');
  buildOrderlyTown(map, 100, 265, 'volcano');

  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 404);
        if (val < 0.28) map[y][x] = 3;
        else if (val < 0.50) map[y][x] = 1;
        else if (val < 0.62) map[y][x] = 14;
        else if (val < 0.68) map[y][x] = 19;
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 100, y: 112 },
  };
}

/**
 * ❄️ 5. PICOS HELADOS DE FROSTFALL (400x400)
 */
export function generateTundra400(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 3 || x >= MAP_SIZE - 4 || y <= 3 || y >= MAP_SIZE - 4) {
        map[y][x] = 1;
      }
    }
  }

  [55, 100, 195, 265, 335].forEach((ty) => {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      map[ty - 1][x] = 2; map[ty][x] = 2; map[ty + 1][x] = 2;
      if (x % 10 === 0) map[ty - 2][x] = 17;
    }
  });
  [100, 200, 300].forEach((tx) => {
    for (let y = 10; y < MAP_SIZE - 10; y++) {
      map[y][tx - 1] = 2; map[y][tx] = 2; map[y][tx + 1] = 2;
      if (y % 10 === 0) map[y][tx + 2] = 17;
    }
  });

  buildOrderlyTown(map, 100, 100, 'tundra');
  buildOrderlyTown(map, 300, 100, 'tundra');
  buildOrderlyTown(map, 100, 265, 'tundra');

  map[75][355] = 11; map[72][355] = 17; map[78][355] = 17; map[75][352] = 7;

  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 505);
        if (val < 0.30) map[y][x] = 1;
        else if (val < 0.46) map[y][x] = 3;
        else if (val < 0.58) map[y][x] = 12;
        else if (val < 0.68) map[y][x] = 19;
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 75 },
    defaultPlayerPos: { x: 100, y: 112 },
  };
}

/**
 * 🏰 6. CIUDADELA IMPERIAL Y NECRÓPOLIS (400x400)
 */
export function generateCastle400(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 3 || x >= MAP_SIZE - 4 || y <= 3 || y >= MAP_SIZE - 4) {
        map[y][x] = 1;
      }
    }
  }

  for (let i = 40; i < MAP_SIZE - 20; i += 50) {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      map[i - 1][x] = 2; map[i][x] = 2; map[i + 1][x] = 2;
      if (x % 8 === 0) map[i - 2][x] = 17;
    }
    for (let y = 10; y < MAP_SIZE - 10; y++) {
      map[y][i - 1] = 2; map[y][i] = 2; map[y][i + 1] = 2;
      if (y % 8 === 0) map[y][i - 2] = 17;
    }
  }

  buildOrderlyTown(map, 100, 100, 'castle');
  buildOrderlyTown(map, 300, 100, 'castle');
  buildOrderlyTown(map, 100, 265, 'castle');

  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 606);
        if (val < 0.28) map[y][x] = 1;
        else if (val < 0.44) map[y][x] = 12;
        else if (val < 0.52) map[y][x] = 17;
        else if (val < 0.58) map[y][x] = 18;
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 100, y: 112 },
  };
}

/**
 * 🌌 7. EL VÓRTICE DEL VACÍO (400x400)
 */
export function generateVoid400(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(1));

  const platforms = [
    [100, 100, 26], [235, 100, 26], [355, 120, 28],
    [100, 230, 26], [205, 195, 30], [355, 285, 26],
    [230, 295, 26], [355, 355, 30]
  ];

  platforms.forEach(([px, py, rad]) => {
    for (let y = py - rad; y <= py + rad; y++) {
      for (let x = px - rad; x <= px + rad; x++) {
        if (x > 3 && x < MAP_SIZE - 4 && y > 3 && y < MAP_SIZE - 4) {
          if (Math.hypot(x - px, y - py) <= rad) {
            map[y][x] = 2;
          }
        }
      }
    }
  });

  for (let x = 100; x <= 355; x++) {
    map[100][x] = 2; map[195][x] = 2; map[295][x] = 2;
  }
  for (let y = 100; y <= 355; y++) {
    map[y][100] = 2; map[y][205] = 2; map[y][355] = 2;
  }

  buildOrderlyTown(map, 100, 100, 'void');

  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 100, y: 112 },
  };
}

/**
 * 👑 8. SAGRARIO DE LOS ANTIGUOS (400x400)
 */
export function generatePantheon400(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 3 || x >= MAP_SIZE - 4 || y <= 3 || y >= MAP_SIZE - 4) {
        map[y][x] = 1;
      }
    }
  }

  for (let y = 20; y < MAP_SIZE - 20; y++) {
    for (let x = 193; x <= 207; x++) map[y][x] = 2;
  }

  buildOrderlyTown(map, 200, 200, 'sanctuary');

  map[80][200] = 11;
  map[78][200] = 17; map[82][200] = 17;

  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 808);
        if (val < 0.28) map[y][x] = 18;
        else if (val < 0.50) map[y][x] = 12;
        else if (val < 0.60) map[y][x] = 17;
        else if (val < 0.68) map[y][x] = 4;
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 200, y: 80 },
    defaultPlayerPos: { x: 200, y: 212 },
  };
}
