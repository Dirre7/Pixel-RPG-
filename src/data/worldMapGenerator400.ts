/**
 * 🗺️ GENERADOR MAESTRO DE MUNDOS EXPANDIDOS, HIPERDENSOS Y VIVOS (400x400 - 160.000 BALDOSAS)
 * Cada pantalla (30x20 casillas) está completamente repleta de elementos visuales:
 * - Calles adoquinadas, plazas acogedoras, casas agrupadas, forjas, tiendas, molinos, pozos y farolas.
 * - Bosques densos de robles, flores silvestres, campos de trigo, hogueras, estanques y ruinas.
 * - Cavernas con estalagmitas, setas luminiscentes, cristales, antorchas mineras y vías.
 * - Pantanos con palafitos, cañaverales, aguas venenosas, calderos verdes y puentes de madera.
 * - Volcanes con ríos de magma, forjas de titanio, rocas de basalto, antorchas y bastiones.
 * - Picos helados con pinos nevados, lagos de hielo azul, cabañas nórdicas y flores de escarcha.
 * - Ciudades imperiales amuralladas, jardines de rosas, panteones reales y columnatas.
 * - Islas cósmicas en el vacío con monolitos rúnicos, santuarios y puentes de energía estelar.
 * - Sagrarios dorados con columnatas de mármol divino, fuentes de la juventud y jardines del Olimpo.
 */

export const MAP_SIZE = 400;

/**
 * Función determinista pseudoaleatoria para distribución orgánica de elementos naturales
 */
function prng(x: number, y: number, seed: number = 42): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return n - Math.floor(n);
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

  // 1. Bordes de bosque impenetrable (4 baldosas de grosor)
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 3 || x >= MAP_SIZE - 4 || y <= 3 || y >= MAP_SIZE - 4) {
        map[y][x] = 1;
      }
    }
  }

  // 2. Gran Río Fluvial de Aethelgard con meandros naturales
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    const rx = Math.round(200 + Math.sin(y * 0.035) * 35 + Math.cos(y * 0.08) * 10);
    for (let offset = -3; offset <= 3; offset++) {
      const cx = rx + offset;
      if (cx > 4 && cx < MAP_SIZE - 4) {
        map[y][cx] = 3; // Agua
      }
    }
  }

  // 3. Gran Lago Sagrado Oriental (X: 275..345, Y: 195..275)
  for (let y = 195; y <= 275; y++) {
    for (let x = 275; x <= 345; x++) {
      const dist = Math.hypot((x - 310) / 32, (y - 235) / 38);
      if (dist <= 1.0) map[y][x] = 3;
    }
  }
  // Isla Sagrada del Templo
  for (let y = 230; y <= 242; y++) {
    for (let x = 304; x <= 316; x++) map[y][x] = 2;
  }
  map[236][310] = 8; map[236][306] = 17; map[236][314] = 17; map[236][312] = 7;
  for (let x = 250; x <= 304; x++) map[236][x] = 2;

  // 4. Puentes Monumentales sobre el Gran Río
  const bridgesY = [55, 125, 195, 265, 335];
  bridgesY.forEach((by) => {
    for (let y = by - 1; y <= by + 1; y++) {
      for (let x = 150; x <= 250; x++) {
        if (map[y][x] === 3) map[y][x] = 2;
      }
    }
    map[by - 2][175] = 17; map[by + 2][175] = 17;
    map[by - 2][225] = 17; map[by + 2][225] = 17;
  });

  // 5. Red de Carreteras Principales (2 baldosas de ancho)
  [55, 125, 195, 265, 335].forEach((hy) => {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      if (map[hy][x] !== 3) {
        map[hy][x] = 2;
        map[hy + 1][x] = 2;
        if (x % 8 === 0) map[hy - 1][x] = 17; // Farola cada 8 casillas
      }
    }
  });
  [88, 155, 250, 320].forEach((vx) => {
    for (let y = 10; y < MAP_SIZE - 10; y++) {
      if (map[y][vx] !== 3) {
        map[y][vx] = 2;
        map[y][vx + 1] = 2;
        if (y % 8 === 0) map[y][vx - 1] = 17; // Farola
      }
    }
  });

  // =========================================================================
  // 🏰 A. CIUDAD CAPITAL DE ROBLE (Alrededor de X: 75..105, Y: 75..105)
  // =========================================================================
  // Calles interiores
  for (let y = 74; y <= 104; y++) {
    for (let x = 74; x <= 104; x++) {
      if (x % 6 === 0 || y % 6 === 0 || x % 6 === 1 || y % 6 === 1) {
        map[y][x] = 2; // Calles adoquinadas
      } else if ((x + y) % 4 === 0) {
        map[y][x] = 12; // Flores
      } else if ((x * y) % 5 === 0) {
        map[y][x] = 13; // Jardín
      }
    }
  }
  // Plaza Central del Jugador y NPCs Iniciales (X: 88, Y: 88)
  map[88][88] = 2;
  map[86][88] = 4;  // Fuente Central de la Plaza
  map[85][85] = 9;  // Tienda / Mercado Azul
  map[85][91] = 5;  // Taberna de Roble
  map[91][85] = 10; // Forja de la Ciudad
  map[91][91] = 8;  // Santuario de los Ancestros
  map[87][86] = 17; map[87][90] = 17; map[89][86] = 17; map[89][90] = 17; // 4 Farolas de plaza
  map[88][84] = 7;  // Cofre de la Ciudad

  // Casas y comercios adicionales en los bloques de la ciudad
  const townBuildings = [
    [76, 76, 5], [82, 76, 9], [94, 76, 5], [100, 76, 5],
    [76, 82, 9], [100, 82, 10], [76, 94, 5], [100, 94, 9],
    [76, 100, 5], [82, 100, 6], [94, 100, 5], [100, 100, 5]
  ];
  townBuildings.forEach(([bx, by, type]) => {
    map[by][bx] = type;
    map[by + 1][bx] = 2; // Entrada de camino
  });

  // =========================================================================
  // 🌾 B. ASENTAMIENTOS PERIFÉRICOS RICOS Y DETALLADOS
  // =========================================================================
  // Granja Real (X: 155, Y: 55)
  map[52][152] = 6; map[52][158] = 5; map[58][152] = 5; map[58][158] = 4;
  for (let y = 48; y <= 62; y++) {
    for (let x = 145; x <= 165; x++) {
      if ((x >= 147 && x <= 150) || (x >= 160 && x <= 163)) {
        if (y % 2 === 0) map[y][x] = 13; // Campos de trigo
      }
    }
  }
  map[55][162] = 7; map[54][155] = 17;

  // Campamento de Cazadores (X: 250, Y: 55)
  map[53][247] = 5; map[53][253] = 5; map[55][250] = 19; // Gran fogata
  map[57][247] = 17; map[57][253] = 7;

  // Pueblo Pesquero del Río (X: 195, Y: 125)
  map[122][185] = 5; map[122][190] = 9; map[128][185] = 5; map[125][188] = 4;
  map[125][180] = 15; map[125][181] = 15; map[125][182] = 15; // Muelle
  map[124][188] = 17; map[126][185] = 7;

  // Gran Cementerio Antiguo y Mausoleo (X: 88, Y: 265)
  for (let y = 258; y <= 272; y++) {
    for (let x = 80; x <= 96; x++) {
      if ((x * y) % 3 === 0 && map[y][x] === 0) map[y][x] = 16; // Lápidas
      else if ((x + y) % 4 === 0) map[y][x] = 12;
    }
  }
  map[262][88] = 8; map[265][84] = 18; map[265][92] = 18; map[260][88] = 7;

  // Tierras Calcinadas de los Titanes (X: 88, Y: 335)
  for (let y = 328; y <= 342; y++) {
    for (let x = 80; x <= 96; x++) {
      if ((x + y) % 3 === 0) map[y][x] = 14;
    }
  }
  map[332][88] = 19; map[335][85] = 18; map[335][91] = 18; map[330][88] = 7;

  // Portal del Jefe Dragón Primigenio (X: 355, Y: 355)
  for (let y = 348; y <= 362; y++) {
    for (let x = 348; x <= 362; x++) {
      map[y][x] = (x === 348 || x === 362 || y === 348 || y === 362) ? 18 : 2;
    }
  }
  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  // =========================================================================
  // 🌲 C. DENSE SCATTER PASS: RELLENO ORGÁNICO EN TODA LA NATURALEZA
  // =========================================================================
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 101);
        if (val < 0.28) {
          map[y][x] = 1; // Árbol / Roble frondoso (28%)
        } else if (val < 0.38) {
          map[y][x] = 12; // Flores silvestres / Arbusto de bayas (10%)
        } else if (val < 0.43) {
          map[y][x] = 13; // Parche de trigo silvestre / Vegetación alta (5%)
        } else if (val < 0.45) {
          map[y][x] = 17; // Farola rúnica / Linterna de camino (2%)
        } else if (val < 0.47) {
          map[y][x] = 19; // Fogata de exploradores (2%)
        } else if (val < 0.49) {
          map[y][x] = 18; // Columna / Menhir de ruina antigua (2%)
        } else if (val < 0.51) {
          map[y][x] = 3;  // Pequeña charca de agua fresca (2%)
        }
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 88, y: 88 },
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
        map[y][x] = 1; // Muro rocoso
      }
    }
  }

  // Red de Galerías y Túneles Mineros
  [55, 125, 195, 265, 335].forEach((cy) => {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      map[cy][x] = 2; map[cy + 1][x] = 2;
      if (x % 8 === 0) map[cy - 1][x] = 17; // Antorcha minera
    }
  });
  [75, 155, 250, 325].forEach((cx) => {
    for (let y = 10; y < MAP_SIZE - 10; y++) {
      map[y][cx] = 2; map[y][cx + 1] = 2;
      if (y % 8 === 0) map[y][cx - 1] = 17;
    }
  });

  // Ciudad Subterránea Enana Central (X: 75, Y: 78)
  for (let y = 68; y <= 90; y++) {
    for (let x = 68; x <= 90; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
      else if ((x + y) % 3 === 0) map[y][x] = 12; // Setas luminiscentes
    }
  }
  map[75][75] = 5;  // Taller Minero
  map[75][81] = 10; // Forja de Mithril
  map[81][75] = 9;  // Banco Enano
  map[81][81] = 4;  // Fuente Termal Subterránea
  map[78][78] = 19; // Gran Hoguera Minera
  map[77][75] = 17; map[79][75] = 17; map[75][77] = 17; map[75][79] = 17;
  map[75][73] = 7;  // Cofre de Minerales

  // Lago de Cristal Azul Subterráneo (X: 250, Y: 125)
  for (let y = 110; y <= 140; y++) {
    for (let x = 235; x <= 265; x++) {
      const d = Math.hypot((x - 250) / 14, (y - 125) / 14);
      if (d <= 1.0) map[y][x] = 3;
    }
  }
  map[125][250] = 8; map[125][246] = 15; map[125][254] = 15; map[125][242] = 7;

  // Guarida del Gólem de Obsidiana (X: 355, Y: 355)
  for (let y = 348; y <= 362; y++) {
    for (let x = 348; x <= 362; x++) {
      map[y][x] = (x === 348 || x === 362 || y === 348 || y === 362) ? 18 : 2;
    }
  }
  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  // DENSE SCATTER PASS: Muros de roca, cristales y setas luminiscentes
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 202);
        if (val < 0.30) map[y][x] = 1;  // Estalagmita / Muro rocoso (30%)
        else if (val < 0.44) map[y][x] = 12; // Cristales y setas brillantes (14%)
        else if (val < 0.48) map[y][x] = 3;  // Charca subterránea (4%)
        else if (val < 0.52) map[y][x] = 17; // Antorcha en la roca (4%)
        else if (val < 0.56) map[y][x] = 19; // Fogata minera (4%)
        else if (val < 0.60) map[y][x] = 18; // Columna enana tallada (4%)
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 75, y: 78 },
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

  // Red de Pasarelas de Madera Elevadas
  [55, 125, 195, 265, 335].forEach((sy) => {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      map[sy][x] = 2; map[sy + 1][x] = 2;
      if (x % 8 === 0) map[sy - 1][x] = 17;
    }
  });
  [75, 155, 250, 325].forEach((sx) => {
    for (let y = 10; y < MAP_SIZE - 10; y++) {
      map[y][sx] = 2; map[y][sx + 1] = 2;
      if (y % 8 === 0) map[y][sx - 1] = 17;
    }
  });

  // Aldea Palafítica de Morgana (X: 75, Y: 78)
  for (let y = 68; y <= 90; y++) {
    for (let x = 68; x <= 90; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
      else if ((x + y) % 3 === 0) map[y][x] = 12;
    }
  }
  map[75][75] = 5;  // Cabaña de Morgana
  map[75][81] = 9;  // Tienda de Elixires
  map[81][75] = 4;  // Pozo de Agua Purificada
  map[81][81] = 8;  // Santuario de Purificación
  map[78][78] = 19; // Caldero Verde Humeante
  map[77][75] = 17; map[79][75] = 17; map[75][77] = 17; map[75][79] = 17;
  map[75][73] = 7;  // Cofre de Pociones

  // Nido de la Reina Gorgona (X: 355, Y: 355)
  for (let y = 348; y <= 362; y++) {
    for (let x = 348; x <= 362; x++) {
      map[y][x] = (x === 348 || x === 362 || y === 348 || y === 362) ? 18 : 2;
    }
  }
  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  // DENSE SCATTER PASS: Aguas venenosas, sauces llorones, calderos y musgo
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 303);
        if (val < 0.32) map[y][x] = 3;  // Aguas venenosas (32%)
        else if (val < 0.54) map[y][x] = 1; // Sauces llorones / Manglares (22%)
        else if (val < 0.64) map[y][x] = 12; // Nenúfares / Musgo brillante (10%)
        else if (val < 0.68) map[y][x] = 19; // Fuegos fatuos / Calderos (4%)
        else if (val < 0.72) map[y][x] = 18; // Columnas góticas sumergidas (4%)
        else if (val < 0.76) map[y][x] = 15; // Pasarelas de tablas sobre agua (4%)
        else if (val < 0.79) map[y][x] = 17; // Faroles de aceite (3%)
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 75, y: 78 },
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

  // Viaductos de Basalto Reforzado
  [55, 125, 195, 265, 335].forEach((vy) => {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      map[vy][x] = 2; map[vy + 1][x] = 2;
      if (x % 8 === 0) map[vy - 1][x] = 17;
    }
  });
  [75, 155, 250, 325].forEach((vx) => {
    for (let y = 10; y < MAP_SIZE - 10; y++) {
      map[y][vx] = 2; map[y][vx + 1] = 2;
      if (y % 8 === 0) map[y][vx - 1] = 17;
    }
  });

  // Bastión de los Titanes Central (X: 75, Y: 78)
  for (let y = 68; y <= 90; y++) {
    for (let x = 68; x <= 90; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
      else if ((x + y) % 3 === 0) map[y][x] = 14;
    }
  }
  map[75][75] = 10; // Gran Forja Volcánica
  map[75][81] = 5;  // Bastión de Basalto
  map[81][75] = 4;  // Pozo Térmico de Enfriamiento
  map[81][81] = 8;  // Santuario de Fuego
  map[78][78] = 19; // Fogata Titánica
  map[77][75] = 17; map[79][75] = 17; map[75][77] = 17; map[75][79] = 17;
  map[75][73] = 7;  // Cofre de Titanio

  // Cubil del Dragón Ignis (X: 355, Y: 355)
  for (let y = 348; y <= 362; y++) {
    for (let x = 348; x <= 362; x++) {
      map[y][x] = (x === 348 || x === 362 || y === 348 || y === 362) ? 18 : 2;
    }
  }
  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  // DENSE SCATTER PASS: Ríos de magma, rocas de basalto, ascuas y forjas
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 404);
        if (val < 0.28) map[y][x] = 3;  // Magma ardiente (28%)
        else if (val < 0.50) map[y][x] = 1; // Basalto y roca volcánica (22%)
        else if (val < 0.62) map[y][x] = 14; // Suelo de ascuas / Tierra calcinada (12%)
        else if (val < 0.67) map[y][x] = 18; // Columnas de obsidiana (5%)
        else if (val < 0.72) map[y][x] = 19; // Grandes hogueras (5%)
        else if (val < 0.76) map[y][x] = 10; // Forjas de magma (4%)
        else if (val < 0.80) map[y][x] = 17; // Antorchas de fuego (4%)
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 75, y: 78 },
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

  // Caminos de Nieve Pisada
  [55, 125, 195, 265, 335].forEach((ty) => {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      map[ty][x] = 2; map[ty + 1][x] = 2;
      if (x % 8 === 0) map[ty - 1][x] = 17;
    }
  });
  [75, 155, 250, 325].forEach((tx) => {
    for (let y = 10; y < MAP_SIZE - 10; y++) {
      map[y][tx] = 2; map[y][tx + 1] = 2;
      if (y % 8 === 0) map[y][tx - 1] = 17;
    }
  });

  // Pueblo Nórdico de Astrid (X: 75, Y: 78)
  for (let y = 68; y <= 90; y++) {
    for (let x = 68; x <= 90; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
      else if ((x + y) % 3 === 0) map[y][x] = 12; // Flores de escarcha
    }
  }
  map[75][75] = 5;  // Cabaña Nórdica
  map[75][81] = 9;  // Puesto de Pieles
  map[81][75] = 4;  // Pozo de Agua Helada
  map[81][81] = 8;  // Santuario Glaciar
  map[78][78] = 19; // Gran Fogata Nórdica
  map[77][75] = 17; map[79][75] = 17; map[75][77] = 17; map[75][79] = 17;
  map[75][73] = 7;  // Cofre de Escarcha

  // Fortaleza del Titán Ymir (X: 355, Y: 75)
  for (let y = 68; y <= 82; y++) {
    for (let x = 348; x <= 362; x++) {
      map[y][x] = (x === 348 || x === 362 || y === 68 || y === 82) ? 18 : 2;
    }
  }
  map[75][355] = 11; map[72][355] = 17; map[78][355] = 17; map[75][352] = 7;

  // DENSE SCATTER PASS: Pinos nevados, lagos de hielo azul, flores de escarcha y fogatas
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 505);
        if (val < 0.30) map[y][x] = 1;  // Pino nevado / Muro de hielo (30%)
        else if (val < 0.46) map[y][x] = 3;  // Lago de hielo puro reflectante (16%)
        else if (val < 0.58) map[y][x] = 12; // Flores de escarcha / Zafiros (12%)
        else if (val < 0.63) map[y][x] = 18; // Columnas de hielo tallado (5%)
        else if (val < 0.68) map[y][x] = 19; // Fogatas de campamento (5%)
        else if (val < 0.72) map[y][x] = 15; // Tablones sobre hielo (4%)
        else if (val < 0.76) map[y][x] = 17; // Farolas de nieve (4%)
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 75 },
    defaultPlayerPos: { x: 75, y: 78 },
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

  // Avenidas Imperiales Monumentales (3 baldosas de ancho)
  for (let i = 40; i < MAP_SIZE - 20; i += 45) {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      map[i][x] = 2; map[i + 1][x] = 2; map[i + 2][x] = 2;
      if (x % 6 === 0) map[i - 1][x] = 17; // Farolas doradas
    }
    for (let y = 10; y < MAP_SIZE - 10; y++) {
      map[y][i] = 2; map[y][i + 1] = 2; map[y][i + 2] = 2;
      if (y % 6 === 0) map[y][i - 1] = 17;
    }
  }

  // Plaza Imperial Central de la Corona (X: 75, Y: 80)
  for (let y = 68; y <= 92; y++) {
    for (let x = 68; x <= 92; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
      else if ((x + y) % 3 === 0) map[y][x] = 12; // Rosas reales
    }
  }
  map[75][75] = 5;  // Taberna de la Corona
  map[75][81] = 10; // Forja Imperial
  map[81][75] = 9;  // Mercado de la Corona
  map[81][81] = 4;  // Gran Fuente Imperial de Mármol
  map[78][78] = 8;  // Santuario Real
  map[77][75] = 17; map[79][75] = 17; map[75][77] = 17; map[75][79] = 17;
  map[75][73] = 7;  // Cofre de la Corona

  // Salón del Trono Imperial y Necrópolis (X: 355, Y: 355)
  for (let y = 348; y <= 362; y++) {
    for (let x = 348; x <= 362; x++) {
      map[y][x] = (x === 348 || x === 362 || y === 348 || y === 362) ? 18 : 2;
    }
  }
  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  // DENSE SCATTER PASS: Murallas, jardines palaciegos, columnas, tumbas y farolas
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 606);
        if (val < 0.28) map[y][x] = 1;  // Muros de castillo / Torres (28%)
        else if (val < 0.44) map[y][x] = 12; // Rosaledas y jardines reales (16%)
        else if (val < 0.52) map[y][x] = 17; // Farolas doradas (8%)
        else if (val < 0.58) map[y][x] = 18; // Columnas de mármol (6%)
        else if (val < 0.64) map[y][x] = 16; // Panteones y lápidas reales (6%)
        else if (val < 0.70) map[y][x] = 14; // Suelo sombrío del castillo (6%)
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 75, y: 80 },
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
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(1)); // Abismo

  const platforms = [
    [75, 75, 28], [235, 75, 28], [355, 120, 30],
    [75, 230, 28], [205, 195, 34], [355, 285, 26],
    [230, 295, 26], [355, 355, 32]
  ];

  platforms.forEach(([px, py, rad]) => {
    for (let y = py - rad; y <= py + rad; y++) {
      for (let x = px - rad; x <= px + rad; x++) {
        if (x > 3 && x < MAP_SIZE - 4 && y > 3 && y < MAP_SIZE - 4) {
          if (Math.hypot(x - px, y - py) <= rad) {
            map[y][x] = 2; // Calzada cósmica
          }
        }
      }
    }
  });

  // Gran Calzada del Horizonte de Sucesos
  for (let y = 345; y <= 370; y++) {
    for (let x = 20; x <= 380; x++) map[y][x] = 2;
  }

  // Puentes de Energía Estelar
  for (let x = 75; x <= 355; x++) {
    map[75][x] = 2; map[195][x] = 2; map[295][x] = 2;
  }
  for (let y = 75; y <= 355; y++) {
    map[y][75] = 2; map[y][205] = 2; map[y][355] = 2;
  }

  // Plataforma Inicial del Oráculo (X: 75, Y: 78)
  map[75][75] = 8;  // Santuario Astral
  map[75][72] = 5;  // Observatorio
  map[75][81] = 4;  // Fuente Cósmica
  map[78][75] = 19; // Fuego Púrpura Ethereal
  map[75][73] = 7;  // Cofre del Vacío

  // Templo de Malakor (X: 355, Y: 355)
  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  // DENSE SCATTER PASS EN LAS ISLAS FLOTANTES
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 2 && !(x === 75 && y === 78) && !(x === 355 && y === 355)) {
        const val = prng(x, y, 707);
        if (val < 0.15) map[y][x] = 12; // Cristales dimensionales
        else if (val < 0.22) map[y][x] = 18; // Monolitos rúnicos
        else if (val < 0.28) map[y][x] = 14; // Materia oscura
        else if (val < 0.33) map[y][x] = 17; // Chispas de energía
        else if (val < 0.37) map[y][x] = 19; // Fuegos astrales
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 75, y: 78 },
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

  // Gran Calzada de Oro Divina Central (14 baldosas de ancho)
  for (let y = 20; y < MAP_SIZE - 20; y++) {
    for (let x = 193; x <= 207; x++) {
      map[y][x] = 2;
    }
  }

  // Gran Templo Celestial de Cronos (X: 140..260, Y: 15..120)
  for (let y = 15; y <= 120; y++) {
    for (let x = 140; x <= 260; x++) {
      if (x % 4 === 0 || y % 4 === 0) map[y][x] = 2;
      else if ((x + y) % 3 === 0) map[y][x] = 12; // Flores divinas
    }
  }
  map[80][200] = 11; // Altar del Dios Cronos
  map[75][185] = 4;  map[75][215] = 4; // Fuentes sagradas
  map[85][185] = 8;  map[85][215] = 8; // Santuarios
  map[78][200] = 17; map[82][200] = 17;

  // Terrazas de los Héroes Ascendidos y Fuentes de la Juventud
  for (let y = 130; y <= 380; y++) {
    for (let x = 20; x <= 380; x++) {
      if ((x >= 20 && x <= 185) || (x >= 215 && x <= 380)) {
        if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
        else if ((x + y) % 3 === 0) map[y][x] = 12;
      }
    }
  }

  // Umbral del Jugador (X: 200, Y: 340)
  map[340][200] = 2;
  map[336][200] = 8;  // Santuario Celestial
  map[340][195] = 4;  map[340][205] = 4;  // Fuentes de la Juventud Eterna
  map[338][197] = 17; map[338][203] = 17; // Farolas solares
  map[340][190] = 7;  map[340][210] = 7;  // Cofres divinos

  // DENSE SCATTER PASS: Columnas de oro, parterres divinos, fuentes y farolas
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 808);
        if (val < 0.28) map[y][x] = 18; // Columnas de mármol y oro divino (28%)
        else if (val < 0.50) map[y][x] = 12; // Parterres de flores sagradas (22%)
        else if (val < 0.60) map[y][x] = 17; // Farolas doradas solares (10%)
        else if (val < 0.68) map[y][x] = 4;  // Fuentes de néctar (8%)
        else if (val < 0.74) map[y][x] = 8;  // Altares de luz (6%)
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 200, y: 80 },
    defaultPlayerPos: { x: 200, y: 340 },
  };
}
