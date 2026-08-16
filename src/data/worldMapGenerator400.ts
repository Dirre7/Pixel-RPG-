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

  // =========================================================================
  // 🗺️ 12 GRANDES REGIONES TEMÁTICAS DEL MAPA 1 (RÉPLICA DE LA MAQUETA)
  // =========================================================================

  // 1. 🌾 ALDEA RURAL DE PAJA (Noroeste: X: 25..75, Y: 25..75)
  for (let y = 28; y <= 72; y++) {
    for (let x = 28; x <= 72; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2; // Senderos de tierra
      else if ((x + y) % 3 === 0) map[y][x] = 13;   // Bancales de huerto
    }
  }
  // 6 Cabañas rurales con chimenea
  map[34][36] = 5; map[34][48] = 5; map[34][60] = 5;
  map[52][36] = 5; map[52][48] = 5; map[52][60] = 5;
  map[43][48] = 4; // Pozo central de la aldea
  map[38][48] = 17; map[48][48] = 17; // Farolas
  map[58][62] = 7; // Cofre rural

  // 2. 🏛️ RUINAS CIRCULARES DEL TEMPLO DE MÁRMOL (Norte Central: X: 130..195, Y: 20..85)
  for (let y = 25; y <= 80; y++) {
    for (let x = 135; x <= 190; x++) {
      if (Math.hypot(x - 162, y - 52) <= 24) {
        map[y][x] = 2; // Suelo de losas agrietadas
      }
    }
  }
  // Círculo Monumental de Columnas (Stonehenge)
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
    const px = Math.round(162 + Math.cos(angle) * 20);
    const py = Math.round(52 + Math.sin(angle) * 16);
    map[py][px] = 18; // Columna corintia
    map[py][px - 1] = 12; // Enredaderas
  }
  map[52][162] = 8; // Altar Central Sagrado
  map[46][162] = 17; map[58][162] = 17; map[52][156] = 17; map[52][168] = 17;
  map[52][165] = 7; // Cofre Celestial

  // 3. 🌋 CORDILLERA VOLCÁNICA, RÍO DE LAVA Y CALDERA (Noreste: X: 300..390, Y: 10..120)
  for (let y = 15; y <= 115; y++) {
    for (let x = 305; x <= 388; x++) {
      const dist = Math.hypot((x - 355) / 32, (y - 50) / 28);
      if (dist <= 1.0) {
        map[y][x] = 1; // Montaña volcánica de obsidiana
      }
    }
  }
  // Río y Lago de Lava Ardiente
  for (let y = 50; y <= 110; y++) {
    const lx = Math.round(355 + Math.sin(y * 0.08) * 12);
    for (let ox = -2; ox <= 2; ox++) {
      if (lx + ox > 300 && lx + ox < 390) map[y][lx + ox] = 14; // Lava
    }
  }
  // Caldera / Lago de Magma
  for (let y = 95; y <= 115; y++) {
    for (let x = 340; x <= 375; x++) {
      if (Math.hypot((x - 358) / 16, (y - 105) / 10) <= 1.0) map[y][x] = 14;
    }
  }
  map[40][325] = 28; map[42][328] = 28; map[44][325] = 28; // Cristales de cuarzo

  // 4. 🍄 EL BOSQUE ENCANTADO (Oeste Superior: X: 20..95, Y: 95..165)
  for (let y = 100; y <= 160; y++) {
    for (let x = 25; x <= 90; x++) {
      if ((x + y) % 4 === 0) map[y][x] = 20; // Árboles mágicos azul/violeta & setas
      else if ((x * y) % 7 === 0) map[y][x] = 18; // Arcos de piedra en ruinas
    }
  }
  map[130][55] = 8;  // Santuario Místico
  map[135][55] = 28; // Cristal de maná gigante
  map[125][70] = 7;  // Cofre Arcano

  // 5. 🌿 EL LABERINTO ENCANTADO (Centro: X: 215..295, Y: 105..185)
  for (let y = 110; y <= 180; y++) {
    for (let x = 220; x <= 290; x++) {
      map[y][x] = 2; // Calzada base de piedra
    }
  }
  // Anillos concéntricos de setos verdes
  [0, 6, 12, 18, 24].forEach((ring) => {
    const minX = 220 + ring;
    const maxX = 290 - ring;
    const minY = 110 + ring;
    const maxY = 180 - ring;
    for (let x = minX; x <= maxX; x++) {
      if (x !== 255) { map[minY][x] = 21; map[maxY][x] = 21; }
    }
    for (let y = minY; y <= maxY; y++) {
      if (y !== 145) { map[y][minX] = 21; map[y][maxX] = 21; }
    }
  });
  map[145][255] = 8;  // Santuario en el corazón del laberinto
  map[142][255] = 28; map[148][255] = 28; // Cristales de maná
  map[145][258] = 7;  // Cofre del Laberinto

  // 6. 🏴‍☠️ CALA DEL NAUFRAGIO / BARCO PIRATA VARADO (Este Medio: X: 320..385, Y: 125..185)
  for (let y = 130; y <= 180; y++) {
    for (let x = 325; x <= 380; x++) {
      map[y][x] = 2; // Arena de playa
    }
  }
  map[155][350] = 22; // Galeón Pirata Naufragado
  map[160][360] = 7;  // Cofre del Tesoro Pirata
  map[152][340] = 19; // Fogata pirata

  // 7. 🍇 VIÑEDOS REALES Y BODEGA (Oeste: X: 20..75, Y: 195..265)
  for (let y = 200; y <= 260; y++) {
    for (let x = 25; x <= 70; x++) {
      if (y % 4 === 0 && x >= 30 && x <= 65) map[y][x] = 25; // Espalderas de uvas
      else if (x === 28 || x === 68 || y === 200 || y === 260) map[y][x] = 15; // Valla
    }
  }
  map[230][72] = 5; // Casa del Vinicultor / Bodega
  map[234][72] = 17; map[226][72] = 7; // Cofre de la bodega

  // 8. ⛏️ GRAN CANTERA / MINA A CIELO ABIERTO (Centro-Oeste: X: 105..190, Y: 190..265)
  for (let y = 198; y <= 258; y++) {
    for (let x = 110; x <= 185; x++) {
      const d = Math.hypot((x - 148) / 32, (y - 228) / 24);
      if (d <= 1.0) {
        map[y][x] = d > 0.65 ? 1 : 2; // Paredes de roca escalonadas y fondo
      }
    }
  }
  map[228][148] = 10; // Forja minera
  map[234][170] = 5;  // Choza de los mineros
  map[224][148] = 7;  // Cofre de gemas y hierro

  // 9. 🔭 LAGO CIRCULAR, OBSERVATORIO Y FARO (Este: X: 280..385, Y: 195..275)
  // Gran Lago Circular
  for (let y = 205; y <= 265; y++) {
    for (let x = 290; x <= 350; x++) {
      if (Math.hypot((x - 320) / 28, (y - 235) / 28) <= 1.0) map[y][x] = 3;
    }
  }
  // Muelle de madera hacia el altar de agua
  for (let x = 270; x <= 320; x++) map[235][x] = 15;
  map[235][320] = 8; map[235][322] = 7; // Santuario y Cofre

  // Observatorio Astronómico
  map[205][365] = 26; map[205][360] = 17;

  // Faro Costero en el espigón
  for (let x = 365; x <= 382; x++) map[245][x] = 2;
  map[245][380] = 23; // Faro costero con luz giratoria

  // 10. 🌸 PRADERA DE FLORES SILVESTRES / CLARO DE HADAS (Suroeste: X: 20..110, Y: 300..380)
  for (let y = 305; y <= 375; y++) {
    for (let x = 25; x <= 105; x++) {
      if ((x + y) % 2 === 0) map[y][x] = 12; // Rosas y flores silvestres
      else if ((x * y) % 9 === 0) map[y][x] = 28; // Pequeños cristales de hadas
    }
  }
  map[340][65] = 8; map[340][68] = 7; // Altar y Cofre de las Hadas

  // 11. 🏘️ GRAN CIUDAD COMERCIAL Y FORJA TITÁNICA (Sur Central: X: 185..295, Y: 295..370)
  for (let y = 300; y <= 365; y++) {
    for (let x = 190; x <= 290; x++) {
      map[y][x] = 2; // Gran calzada de piedra imperial
    }
  }
  map[315][210] = 27; // Botica de Pociones (letrero de matraz)
  map[315][240] = 5;  // Gran Casona
  map[315][270] = 10; // Forja Titánica con Chimenea
  map[345][210] = 9;  // Tienda Azul
  map[345][240] = 5;  // Casa Roja
  map[345][270] = 10; // Yunque de herrero
  map[330][240] = 4;  // Gran Fuente de la Ciudad
  map[330][220] = 17; map[330][260] = 17;
  map[355][285] = 7;  // Cofre de la ciudadela

  // 12. ⛪ CEMENTERIO GÓTICO Y CAPILLA DE PIEDRA (Sureste: X: 305..385, Y: 280..365)
  for (let y = 285; y <= 355; y++) {
    for (let x = 310; x <= 380; x++) {
      if (x === 310 || x === 380 || y === 285 || y === 355) map[y][x] = 15; // Verja de hierro
    }
  }
  map[320][368] = 24; // Iglesia / Capilla Gótica
  map[300][345] = 8;  // Mausoleo Señorial
  // 12 Lápidas alineadas
  for (let y = 295; y <= 345; y += 12) {
    for (let x = 320; x <= 350; x += 10) {
      map[y][x] = 16;
    }
  }
  map[325][335] = 7; // Cofre gótico

  // Portal del Dragón Primigenio (X: 360, Y: 360)
  for (let y = 352; y <= 368; y++) {
    for (let x = 352; x <= 368; x++) {
      map[y][x] = (x === 352 || x === 368 || y === 352 || y === 368) ? 18 : 2;
    }
  }
  map[360][360] = 11; map[356][360] = 17; map[364][360] = 17; map[360][356] = 7;

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
    bossPortalPos: { x: 360, y: 360 },
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
