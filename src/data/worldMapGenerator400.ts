/**
 * 🗺️ GENERADOR MAESTRO DE MUNDOS EXPANDIDOS Y ORDENADOS (400x400 - 160.000 BALDOSAS)
 * Réplica exacta 1:1 de la maqueta de diseño urbanístico RPG:
 * - Toda la ciudad con calzada base de piedra beige continua (tile 2).
 * - Glorieta central con gran fuente, 4 parterres de rosas y columnas de mármol.
 * - Flanqueando la fuente: dos casas integradas en la glorieta (azul izquierda, roja derecha).
 * - Distrito Norte: Casa central con huertos traseros y dos manzanas residenciales en las esquinas.
 * - Distrito Oeste: Dos casas azules alineadas con jardín de árboles, estanque y cofre.
 * - Distrito Este: Dos casas rojas alineadas con jardín de rosas y cofres.
 * - Distrito Suroeste: Cementerio con santuario, árbol guardián, farolas y 8 lápidas en 2 filas de 4.
 * - Distrito Sureste: Granja con bancales de zanahorias y trigo.
 * - Distrito Sur: Dos grandes casas con patios traseros de cofres.
 */

export const MAP_SIZE = 400;

function prng(x: number, y: number, seed: number = 42): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Genera la Ciudad Ordenada Réplica 1:1 de la Maqueta
 */
function buildMockupTown(
  map: number[][],
  cx: number,
  cy: number
) {
  // 1. Pavimentar toda el área interior de la ciudad con Calzada de Piedra Beige continua (tile 2)
  for (let y = cy - 15; y <= cy + 15; y++) {
    for (let x = cx - 15; x <= cx + 15; x++) {
      if (x >= 4 && x < MAP_SIZE - 4 && y >= 4 && y < MAP_SIZE - 4) {
        map[y][x] = 2; // Calzada continua beige
      }
    }
  }

  // 2. Muro perimetral continuo de bosque frondoso con salidas en cruz
  for (let y = cy - 15; y <= cy + 15; y++) {
    for (let x = cx - 15; x <= cx + 15; x++) {
      if (x >= 4 && x < MAP_SIZE - 4 && y >= 4 && y < MAP_SIZE - 4) {
        if (x === cx - 15 || x === cx + 15 || y === cy - 15 || y === cy + 15) {
          // Dejar abiertas las 4 avenidas cardinales (3 de ancho)
          const isNorthGate = y === cy - 15 && Math.abs(x - cx) <= 1;
          const isSouthGate = y === cy + 15 && Math.abs(x - cx) <= 1;
          const isWestGate = x === cx - 15 && Math.abs(y - cy) <= 1;
          const isEastGate = x === cx + 15 && Math.abs(y - cy) <= 1;

          if (!isNorthGate && !isSouthGate && !isWestGate && !isEastGate) {
            map[y][x] = 1; // Árbol perimetral
          }
        }
      }
    }
  }

  // 3. GLORIETA CENTRAL Y GRAN FUENTE
  map[cy][cx] = 4; // Gran Fuente Central

  // Parterre Norte de la Glorieta
  map[cy - 2][cx] = 12; map[cy - 3][cx] = 12;
  map[cy - 3][cx - 1] = 18; map[cy - 3][cx + 1] = 18;

  // Parterre Sur de la Glorieta
  map[cy + 2][cx] = 12; map[cy + 3][cx] = 12;
  map[cy + 3][cx - 1] = 18; map[cy + 3][cx + 1] = 18;

  // Parterres Laterales
  map[cy][cx - 2] = 12; map[cy][cx - 3] = 12;
  map[cy][cx + 2] = 12; map[cy][cx + 3] = 12;

  // Casas Flanqueando la Fuente Central en la Glorieta
  map[cy - 2][cx - 4] = 9; // Tienda Azul
  map[cy - 2][cx + 4] = 5; // Casa Roja

  // 4. DISTRITO NORTE CENTRAL
  map[cy - 8][cx - 1] = 9; // Casa Central Azul

  // Franjas de jardín/cultivo a los lados de la casa norte
  map[cy - 11][cx - 3] = 18; map[cy - 10][cx - 3] = 12; map[cy - 9][cx - 3] = 12; map[cy - 8][cx - 3] = 18;
  map[cy - 11][cx + 3] = 7;  map[cy - 10][cx + 3] = 13; map[cy - 9][cx + 3] = 13; map[cy - 8][cx + 3] = 7;

  // Manzana Residencial Noroeste (Césped, Estanque, Árboles)
  for (let y = cy - 13; y <= cy - 7; y++) {
    for (let x = cx - 13; x <= cx - 8; x++) {
      map[y][x] = 0; // Césped
    }
  }
  map[cy - 11][cx - 11] = 3; // Estanque
  map[cy - 12][cx - 9] = 1; map[cy - 10][cx - 8] = 1; // Árboles
  map[cy - 8][cx - 11] = 12; map[cy - 8][cx - 10] = 12; // Rosas

  // Manzana Residencial Noreste (Césped, Árboles, Rosas)
  for (let y = cy - 13; y <= cy - 7; y++) {
    for (let x = cx + 8; x <= cx + 13; x++) {
      map[y][x] = 0; // Césped
    }
  }
  map[cy - 10][cx + 10] = 1; map[cy - 12][cx + 12] = 1; // Árboles
  map[cy - 8][cx + 9] = 12; map[cy - 8][cx + 12] = 12; // Rosas

  // 5. DISTRITO OESTE (Dos Casas Azules alineadas mirando al este)
  map[cy - 3][cx - 7] = 9; // Casa Azul Superior
  map[cy + 3][cx - 7] = 9; // Casa Azul Inferior

  // Patio ajardinado detrás de las casas del oeste
  for (let y = cy - 5; y <= cy + 5; y++) {
    for (let x = cx - 13; x <= cx - 9; x++) {
      map[y][x] = 0; // Césped
    }
  }
  map[cy - 2][cx - 10] = 1; map[cy + 1][cx - 10] = 1; // Árboles

  // 6. DISTRITO ESTE (Dos Casas Rojas alineadas mirando al oeste)
  map[cy - 3][cx + 7] = 5; // Casa Roja Superior
  map[cy + 3][cx + 7] = 5; // Casa Roja Inferior

  // Patio ajardinado detrás de las casas del este
  for (let y = cy - 5; y <= cy + 5; y++) {
    for (let x = cx + 9; x <= cx + 13; x++) {
      map[y][x] = 0; // Césped
    }
  }
  map[cy - 1][cx + 10] = 12; map[cy + 1][cx + 10] = 12; // Rosales

  // 7. DISTRITO SUROESTE (El Santo Mausoleo y Cementerio)
  for (let y = cy + 7; y <= cy + 13; y++) {
    for (let x = cx - 13; x <= cx - 7; x++) {
      map[y][x] = 0; // Césped sagrado
    }
  }
  map[cy + 8][cx - 12] = 8;  // Santuario Ancestral
  map[cy + 9][cx - 10] = 1;  // Árbol guardián
  map[cy + 8][cx - 13] = 17; map[cy + 10][cx - 13] = 17; map[cy + 12][cx - 13] = 17; map[cy + 8][cx - 8] = 17; // Farolas

  // 8 Lápidas en 2 filas de 4
  map[cy + 11][cx - 12] = 16; map[cy + 11][cx - 11] = 16; map[cy + 11][cx - 10] = 16; map[cy + 11][cx - 9] = 16;
  map[cy + 12][cx - 12] = 16; map[cy + 12][cx - 11] = 16; map[cy + 12][cx - 10] = 16; map[cy + 12][cx - 9] = 16;

  // 8. DISTRITO SURESTE (Granja Real con Bancales)
  for (let y = cy + 7; y <= cy + 13; y++) {
    for (let x = cx + 7; x <= cx + 13; x++) {
      map[y][x] = 13; // Bancal de zanahorias y trigo
    }
  }

  // 9. DISTRITO SUR CENTRAL (Dos Grandes Casas de la Aldea)
  map[cy + 8][cx - 2] = 9; // Gran Casa Azul
  map[cy + 8][cx + 2] = 5; // Gran Casa Roja
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

  // 2. Gran Río Fluvial
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
  for (let y = 230; y <= 242; y++) {
    for (let x = 304; x <= 316; x++) map[y][x] = 2;
  }
  map[236][310] = 8; map[236][306] = 17; map[236][314] = 17; map[236][312] = 7;
  for (let x = 250; x <= 304; x++) map[236][x] = 2;

  // 4. Puentes Monumentales sobre el Río
  [55, 100, 195, 265, 335].forEach((by) => {
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

  // 6. CIUDAD PRINCIPAL RÉPLICA EXACTA DE LA MAQUETA (Centro: X: 100, Y: 100)
  buildMockupTown(map, 100, 100);

  // 7. CIUDADES SECUNDARIAS
  buildMockupTown(map, 300, 100);
  buildMockupTown(map, 100, 265);

  // =========================================================================
  // 🗺️ 8 POIS Y MAZMORRAS EN LAS 7 ZONAS MARCADAS
  // =========================================================================

  // 1. 🏹 Campamento de los Cazadores Reales (X: 30..65, Y: 40..65)
  for (let y = 44; y <= 60; y++) {
    for (let x = 36; x <= 60; x++) {
      if (x % 4 === 0 || y % 4 === 0) map[y][x] = 2;
    }
  }
  map[50][45] = 5; map[50][52] = 5; // Cabañas
  map[52][48] = 19; // Gran hoguera
  map[48][48] = 10; // Forja/Armero
  map[54][45] = 17; map[54][52] = 17; // Farolas
  map[52][42] = 7; map[52][55] = 7; // Cofres

  // 2. 🌾 El Valle de los Molinos de Viento (X: 130..185, Y: 40..65)
  for (let y = 44; y <= 62; y++) {
    for (let x = 135; x <= 180; x++) {
      if (x % 3 === 0) map[y][x] = 13; // Bancales de trigo
      if (y % 4 === 0) map[y][x] = 2;  // Caminos
    }
  }
  map[48][140] = 6; map[48][158] = 6; map[48][175] = 6; // 3 Molinos Gigantes
  map[56][150] = 5; map[56][165] = 9; // Granero y Tienda
  map[56][158] = 4; // Pozo de riego
  map[50][158] = 7; map[58][140] = 7; // Cofres

  // 3. 🔮 Santuario Megalítico de los Antiguos (X: 340..385, Y: 40..65)
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
    const px = Math.round(362 + Math.cos(angle) * 12);
    const py = Math.round(52 + Math.sin(angle) * 9);
    map[py][px] = 18; // Columnas en círculo tipo Stonehenge
    map[py][px - 1] = 12; // Flores arcanas
  }
  map[52][362] = 8; // Altar Central
  map[50][360] = 17; map[50][364] = 17; map[54][362] = 7; // Cofre arcano

  // 4. 🪓 Aserradero y Fuerte de los Leñadores (X: 25..65, Y: 90..115)
  for (let y = 92; y <= 112; y++) {
    for (let x = 32; x <= 62; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[98][40] = 5; map[98][52] = 9; // Cabañas
  map[104][40] = 10; map[104][52] = 5; // Forja y almacén
  map[101][46] = 19; map[96][46] = 4; // Fogata y pozo
  map[106][46] = 7; map[98][36] = 7; // Cofres

  // 5. 🪦 Gran Necrópolis y Cripta de los Reyes (X: 90..115, Y: 180..220)
  for (let y = 185; y <= 215; y++) {
    for (let x = 88; x <= 112; x++) {
      if (x === 88 || x === 112 || y === 185 || y === 215) map[y][x] = 1; // Muralla
      else if (x % 4 === 0 || y % 4 === 0) map[y][x] = 2;
    }
  }
  map[200][100] = 8; // Mausoleo de los Reyes
  for (let y = 190; y <= 210; y += 4) {
    map[y][92] = 16; map[y][96] = 16; map[y][104] = 16; map[y][108] = 16;
  }
  map[195][100] = 18; map[205][100] = 18; map[200][96] = 17; map[200][104] = 17;
  map[200][90] = 7; map[200][110] = 7; // Cofres del Panteón

  // 6. ⚓ Puerto Pesquero y Embarcadero del Este (X: 345..385, Y: 180..215)
  for (let y = 188; y <= 212; y++) {
    for (let x = 350; x <= 382; x++) {
      if (x % 4 === 0 || y % 4 === 0) map[y][x] = 2;
    }
  }
  map[195][356] = 5; map[195][370] = 9; // Cabañas portuarias
  map[205][356] = 5; map[205][370] = 4; // Taberna y pozo
  map[200][363] = 15; map[200][364] = 15; map[200][365] = 15; // Muelle de madera
  map[198][363] = 17; map[202][363] = 17;
  map[205][375] = 7; map[195][350] = 7; // Cofres

  // 7. 🧪 Arboleda Oculta de la Alquimista (X: 25..65, Y: 320..355)
  for (let y = 325; y <= 350; y++) {
    for (let x = 30; x <= 60; x++) {
      if ((x + y) % 3 === 0) map[y][x] = 12; // Setas y hierbas
    }
  }
  map[338][45] = 5; map[338][52] = 9; // Cabaña y Laboratorio
  map[334][48] = 19; map[342][48] = 19; // Calderos humeantes
  map[338][48] = 4; // Pozo de esencias
  map[340][40] = 7; map[340][56] = 7; // Cofres

  // 8. 🏰 Ruinas de la Ciudadela Perdida (Gran Mazmorra) (X: 180..300, Y: 300..365)
  for (let y = 305; y <= 360; y++) {
    for (let x = 185; x <= 295; x++) {
      // Murallas exteriores y patios interiores
      if (x === 185 || x === 295 || y === 305 || y === 360) map[y][x] = 1;
      else if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2; // Galerías de losas
      else if ((x + y) % 5 === 0) map[y][x] = 14; // Tierra calcinada / peligro
      else if ((x * y) % 7 === 0) map[y][x] = 18; // Columnas rotas
    }
  }
  // Patio de Armas de la Ciudadela
  map[332][240] = 8;  // Santuario de los Titanes
  map[325][220] = 10; map[325][260] = 10; // Forjas arcanas
  map[340][220] = 19; map[340][260] = 19; // Grandes piras de fuego
  map[332][210] = 7; map[332][270] = 7; map[315][240] = 7; map[350][240] = 7; // 4 Cofres Legendarios

  // Portal del Dragón Primigenio (X: 355, Y: 355)
  for (let y = 348; y <= 362; y++) {
    for (let x = 348; x <= 362; x++) {
      map[y][x] = (x === 348 || x === 362 || y === 348 || y === 362) ? 18 : 2;
    }
  }
  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  // DENSE SCATTER PASS EN LA NATURALEZA
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        const val = prng(x, y, 101);
        if (val < 0.28) map[y][x] = 1;
        else if (val < 0.38) map[y][x] = 12;
        else if (val < 0.42) map[y][x] = 13;
        else if (val < 0.44) map[y][x] = 19;
        else if (val < 0.46) map[y][x] = 18;
      }
    }
  }

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 98, y: 98 }, // En la plaza mayor frente al monumento ajardinado
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

  buildMockupTown(map, 100, 100);
  buildMockupTown(map, 300, 100);
  buildMockupTown(map, 100, 265);

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
    defaultPlayerPos: { x: 100, y: 101 },
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

  buildMockupTown(map, 100, 100);
  buildMockupTown(map, 300, 100);
  buildMockupTown(map, 100, 265);

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
    defaultPlayerPos: { x: 100, y: 101 },
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

  buildMockupTown(map, 100, 100);
  buildMockupTown(map, 300, 100);
  buildMockupTown(map, 100, 265);

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
    defaultPlayerPos: { x: 100, y: 101 },
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

  buildMockupTown(map, 100, 100);
  buildMockupTown(map, 300, 100);
  buildMockupTown(map, 100, 265);

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
    defaultPlayerPos: { x: 100, y: 101 },
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

  buildMockupTown(map, 100, 100);
  buildMockupTown(map, 300, 100);
  buildMockupTown(map, 100, 265);

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
    defaultPlayerPos: { x: 100, y: 101 },
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

  buildMockupTown(map, 100, 100);

  map[355][355] = 11; map[352][355] = 17; map[358][355] = 17; map[355][352] = 7;

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 100, y: 101 },
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

  buildMockupTown(map, 200, 200);

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
    defaultPlayerPos: { x: 200, y: 201 },
  };
}
