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
  // 1. Base verde natural en toda la parcela urbana (Césped limpio)
  for (let y = cy - 15; y <= cy + 15; y++) {
    for (let x = cx - 15; x <= cx + 15; x++) {
      if (x >= 4 && x < MAP_SIZE - 4 && y >= 4 && y < MAP_SIZE - 4) {
        map[y][x] = 0; // Césped esmeralda
      }
    }
  }

  // 2. Muro perimetral continuo de robles con 4 accesos abiertos
  for (let y = cy - 15; y <= cy + 15; y++) {
    for (let x = cx - 15; x <= cx + 15; x++) {
      if (x >= 4 && x < MAP_SIZE - 4 && y >= 4 && y < MAP_SIZE - 4) {
        if (x === cx - 15 || x === cx + 15 || y === cy - 15 || y === cy + 15) {
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

  // 3. RED DE AVENIDAS CARDINALES Y CALLES (100% DESPEJADAS Y CONTINUAS)
  // Gran Avenida Norte-Sur (3 casillas de ancho: X: cx - 1..cx + 1) - COMPLETAMENTE LIBRE
  for (let y = cy - 15; y <= cy + 15; y++) {
    for (let x = cx - 1; x <= cx + 1; x++) {
      map[y][x] = 2;
    }
  }
  // Gran Avenida Este-Oeste (3 casillas de ancho: Y: cy - 1..cy + 1) - COMPLETAMENTE LIBRE
  for (let y = cy - 1; y <= cy + 1; y++) {
    for (let x = cx - 15; x <= cx + 15; x++) {
      map[y][x] = 2;
    }
  }

  // Plaza Mayor Central (7x7 en el cruce de avenidas)
  for (let y = cy - 3; y <= cy + 3; y++) {
    for (let x = cx - 3; x <= cx + 3; x++) {
      map[y][x] = 2;
    }
  }

  // Calles Secundarias de los Cuadrantes
  // Calle Comercial Noroeste
  for (let y = cy - 6; y <= cy - 4; y++) {
    for (let x = cx - 13; x <= cx - 2; x++) {
      map[y][x] = 2;
    }
  }
  // Terraza Artesanal Norte
  for (let y = cy - 12; y <= cy - 10; y++) {
    for (let x = cx - 13; x <= cx - 2; x++) {
      map[y][x] = 2;
    }
  }

  // Calle Residencial Noreste
  for (let y = cy - 6; y <= cy - 4; y++) {
    for (let x = cx + 2; x <= cx + 13; x++) {
      map[y][x] = 2;
    }
  }
  // Terraza Noreste
  for (let y = cy - 12; y <= cy - 10; y++) {
    for (let x = cx + 2; x <= cx + 13; x++) {
      map[y][x] = 2;
    }
  }

  // Calle Residencial Sureste
  for (let y = cy + 4; y <= cy + 6; y++) {
    for (let x = cx + 2; x <= cx + 13; x++) {
      map[y][x] = 2;
    }
  }

  // Calle del Santuario Suroeste
  for (let y = cy + 4; y <= cy + 6; y++) {
    for (let x = cx - 13; x <= cx - 2; x++) {
      map[y][x] = 2;
    }
  }

  // 4. PLAZA MAYOR CENTRAL (Único elemento: La Fuente en el centro exacto)
  map[cy][cx] = 4; // Gran Fuente Central (Beber agua restaura HP/MP)

  // 5. CUADRANTE NOROESTE (Distrito Artesanal & Comercial)
  // Gran Posada del Roble (en su propia parcela adoquinada, fuera del camino central)
  map[cy - 12][cx - 5] = 5;
  map[cy - 12][cx - 2] = 5; // Círculo 1: Casa Norte-Oeste junto a la avenida

  // Taller de Gran Forja & Armería
  map[cy - 12][cx - 10] = 10;
  map[cy - 13][cx - 11] = 19; // Brasero de carbón

  // Manzana Central Oeste (3 Casas en fila - Círculos 3, 4, 5)
  map[cy - 8][cx - 8] = 5; // Casa 1 bulevar oeste (Círculo 3)
  map[cy - 8][cx - 6] = 5; // Casa 2 bulevar oeste (Círculo 4)
  map[cy - 8][cx - 4] = 5; // Casa 3 bulevar oeste (Círculo 5)

  // Esquina Noroeste de la Plaza Mayor (Círculo 9)
  map[cy - 3][cx - 5] = 5;

  // Hilera de Puestos de Mercado del Bazar
  map[cy - 7][cx - 12] = 9; map[cy - 7][cx - 10] = 9;
  map[cy - 3][cx - 12] = 9; map[cy - 3][cx - 10] = 9;
  map[cy - 5][cx - 13] = 7; // Cofre del bazar

  // 6. CUADRANTE NORESTE (Distrito Residencial & Administrativo)
  // Casa Consistorial / Ayuntamiento y Casa Norte-Este
  map[cy - 12][cx + 2] = 5; // Círculo 2: Casa Norte-Este junto a la avenida
  map[cy - 12][cx + 5] = 5; // Casa Consistorial

  // Botica del Boticario
  map[cy - 12][cx + 10] = 27;

  // Manzana Central Este (3 Casas en fila - Círculos 6, 7, 8)
  map[cy - 8][cx + 4] = 5; // Casa 1 residencial este (Círculo 6)
  map[cy - 8][cx + 6] = 5; // Casa 2 residencial este (Círculo 7)
  map[cy - 8][cx + 8] = 5; // Casa 3 residencial este (Círculo 8)

  // Esquina Noreste de la Plaza Mayor (Círculo 10)
  map[cy - 3][cx + 5] = 5;

  // 7. CUADRANTE SURESTE (Barrio Residencial Sur & Granja)
  // Casa Residencial "Los Álamos 2" (Casa 6)
  map[cy + 4][cx + 5] = 5;
  map[cy + 5][cx + 3] = 17; // Farola en la puerta
  map[cy + 3][cx + 7] = 12; // Rosales

  // Granja Municipal (X: cx + 7..cx + 13, Y: cy + 7..cy + 13)
  for (let y = cy + 7; y <= cy + 13; y++) {
    for (let x = cx + 7; x <= cx + 13; x++) {
      if (y === cy + 7 || y === cy + 13 || x === cx + 7 || x === cx + 13) {
        if (!(y === cy + 7 && x === cx + 10)) {
          map[y][x] = 15; // Valla de madera perimetral
        }
      }
    }
  }
  for (let y = cy + 8; y <= cy + 12; y++) {
    map[y][cx + 10] = 15; // Valla divisoria interna
  }
  map[cy + 8][cx + 8] = 13; map[cy + 8][cx + 9] = 13;
  map[cy + 9][cx + 8] = 13; map[cy + 9][cx + 9] = 13;
  map[cy + 10][cx + 8] = 13; map[cy + 10][cx + 9] = 13;
  map[cy + 11][cx + 8] = 3;  // Abrevadero / Pozo
  map[cy + 12][cx + 8] = 7;  // Cofre agrícola
  map[cy + 8][cx + 11] = 13; // Gallina
  map[cy + 9][cx + 12] = 13; // Gallina
  map[cy + 11][cx + 11] = 3;  // Abrevadero vaca
  map[cy + 11][cx + 12] = 13; // Vaca

  // 8. CUADRANTE SUROESTE (Ermita & Santuario Ancestral)
  // Ermita del Clérigo (Casa 7)
  map[cy + 4][cx - 8] = 5;
  map[cy + 5][cx - 6] = 17; // Farola en la puerta
  map[cy + 3][cx - 10] = 12; // Rosales

  // Santuario Ancestral de Piedra
  map[cy + 10][cx - 9] = 8;
  map[cy + 9][cx - 11] = 17; map[cy + 9][cx - 7] = 17; // Farolas del altar
  map[cy + 11][cx - 12] = 16; map[cy + 11][cx - 11] = 16; map[cy + 11][cx - 10] = 16; map[cy + 11][cx - 9] = 16;
  map[cy + 12][cx - 12] = 16; map[cy + 12][cx - 11] = 16; map[cy + 12][cx - 10] = 16; map[cy + 12][cx - 9] = 16;
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

  // 4. 🍄 EL BOSQUE ENCANTADO Y CLARO FEÉRICO (Oeste Secluido: X: 32..80, Y: 112..160)
  // Limpiar área de transición para que la carretera principal en Y: 96..105 sea 100% transitable y limpia
  for (let y = 96; y <= 106; y++) {
    for (let x = 20; x <= 95; x++) {
      if (map[y][x] === 20 || map[y][x] === 28) map[y][x] = 0; // Pradera normal
    }
  }

  // Corona perimetral de árboles púrpuras místicos (Fae Trees)
  for (let y = 112; y <= 158; y++) {
    for (let x = 32; x <= 80; x++) {
      const distFromCenter = Math.hypot((x - 56) / 22, (y - 135) / 20);
      if (distFromCenter >= 0.75 && distFromCenter <= 1.05) {
        if (prng(x, y, 777) < 0.6) {
          map[y][x] = 20; // Árbol místico púrpura en el anillo exterior
        }
      } else if (distFromCenter < 0.75) {
        map[y][x] = 0; // Claro central de césped místico
      }
    }
  }

  // Senda de Adoquines Místicos de acceso desde el norte (X: 56, Y: 106..124)
  for (let y = 106; y <= 124; y++) {
    map[y][56] = 2;
  }

  // Estanque sagrado de aguas cristalinas en el centro del claro (X: 53..59, Y: 133..137)
  for (let y = 133; y <= 137; y++) {
    for (let x = 53; x <= 59; x++) {
      map[y][x] = 3; // Agua pura
    }
  }

  // Santuario Místico y Cofre Arcano
  map[126][56] = 8; // Altar sagrado
  map[144][56] = 7; // Cofre arcano
  map[124][54] = 17; map[124][58] = 17; // Farolas de luz feérica

  // Círculo Sagrado de Geodas de Cristal de Maná Arcano (Sinfonía simétrica alrededor del santuario)
  map[126][50] = 28; map[126][62] = 28;
  map[135][48] = 28; map[135][64] = 28;
  map[144][50] = 28; map[144][62] = 28;

  // Setas gigantes mágicas enmarcando el santuario
  map[128][52] = 23; map[128][60] = 23;
  map[142][52] = 23; map[142][60] = 23;
  map[135][51] = 12; map[135][61] = 12; // Rosales mágicos

  // Entrada de la Caverna Secreta (X: 74, Y: 135)
  map[135][74] = 18; map[135][75] = 18;
  map[136][75] = 7; // Cofre de la Caverna

  // 5. 🌿 EL LABERINTO ENCANTADO REAL (Centro: X: 215..295, Y: 105..185)
  // Llenar todo el cuadrante con muros de setos impenetrables
  for (let y = 110; y <= 180; y++) {
    for (let x = 220; x <= 290; x++) {
      map[y][x] = 21; // Muro de seto impenetrable
    }
  }

  // Pasillos tallados del laberinto (ancho de 2 baldosas para fluidez de movimiento)
  const carveH = (y: number, x1: number, x2: number) => {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    for (let x = minX; x <= maxX; x++) {
      map[y][x] = 2; map[y + 1][x] = 2;
    }
  };

  const carveV = (x: number, y1: number, y2: number) => {
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    for (let y = minY; y <= maxY; y++) {
      map[y][x] = 2; map[y][x + 1] = 2;
    }
  };

  // Entrada única por el Sur
  for (let y = 174; y <= 180; y++) {
    map[y][254] = 2; map[y][255] = 2;
  }

  // Red intrincada de pasillos, bifurcaciones y desvíos falsos:
  carveH(174, 224, 286);
  
  // Ala Oeste (Ruta con trampas y callejones)
  carveV(224, 114, 174);
  carveH(114, 224, 250);
  carveV(248, 114, 136);
  carveH(136, 230, 248);
  carveV(230, 136, 166);
  carveH(166, 230, 246);
  carveV(244, 146, 166); // Callejón sin salida oeste con estatua
  map[150][244] = 18;

  // Ala Este (Ruta sinuosa que conecta con el centro)
  carveV(284, 114, 174);
  carveH(114, 258, 284);
  carveV(260, 114, 134);
  carveH(134, 260, 276);
  carveV(276, 134, 166);
  carveH(166, 254, 276);
  carveV(266, 148, 166);
  carveH(148, 266, 280); // Callejón este con cristal de maná
  map[148][278] = 28;

  // Pasillo de acceso final a la Cámara Central
  carveH(124, 240, 270);
  carveV(254, 124, 142);

  // Cámara Secreta Central (9x9)
  for (let y = 141; y <= 149; y++) {
    for (let x = 251; x <= 259; x++) {
      map[y][x] = 2; // Suelo de losas arcanas
    }
  }
  map[145][255] = 7;  // Cofre Legendario del Laberinto
  map[143][253] = 28; map[143][257] = 28; // Cristales de Maná
  map[147][253] = 17; map[147][257] = 17; // Farolas Arcanas

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

  // 11. 🏰 LA GRAN CIUDADELA IMPERIAL / CAPITAL (Sur Central: X: 198..282, Y: 298..366)
  // 1. Suelo base natural: Césped verde esmeralda
  for (let y = 298; y <= 366; y++) {
    for (let x = 198; x <= 282; x++) {
      map[y][x] = 0; // Césped natural
    }
  }

  // 2. Red de Calles Adoquinadas Proporcionales (4-5 casillas de ancho)
  // Gran Avenida Real Norte-Sur (X: 238..242)
  for (let y = 298; y <= 366; y++) {
    for (let x = 238; x <= 242; x++) map[y][x] = 2;
  }
  // Bulevar Transversal Este-Oeste (Y: 327..329)
  for (let y = 327; y <= 329; y++) {
    for (let x = 202; x <= 278; x++) map[y][x] = 2;
  }
  // Paseo Norte (Y: 302..304) y Paseo Sur (Y: 360..362)
  for (let y = 302; y <= 304; y++) {
    for (let x = 202; x <= 278; x++) map[y][x] = 2;
  }
  for (let y = 360; y <= 362; y++) {
    for (let x = 202; x <= 278; x++) map[y][x] = 2;
  }
  // Callejón Artesano Oeste (X: 212..214) y Callejón Gremial Este (X: 266..268)
  for (let y = 304; y <= 362; y++) {
    map[y][212] = 2; map[y][213] = 2;
    map[y][266] = 2; map[y][267] = 2;
  }

  // Calzada Peatonal Compacta del Gran Mercado Bazar (X: 247..257, Y: 330..356)
  for (let y = 330; y <= 356; y++) {
    for (let x = 247; x <= 257; x++) map[y][x] = 2;
  }

  // Atrio de la Catedral (X: 214..224, Y: 305..313)
  for (let y = 305; y <= 313; y++) {
    for (let x = 214; x <= 224; x++) map[y][x] = 2;
  }

  // 3. Murallas Defensivas de Piedra con Torreones y Almenas
  for (let x = 198; x <= 282; x++) {
    if (x < 215 || (x > 221 && x < 237) || (x > 243 && x < 263) || x > 269) {
      map[298][x] = 1; // Muralla Norte
    }
    if (x < 237 || x > 243) {
      map[366][x] = 1; // Muralla Sur
    }
  }
  for (let y = 298; y <= 366; y++) {
    map[y][198] = 1; // Muralla Oeste
    map[y][282] = 1; // Muralla Este
  }

  // 4. DISTRITO NORTE: CATEDRAL, AYUNTAMIENTO, TORRE DEL MAGO Y MANZANAS NOBLES
  map[308][218] = 29; // Gran Templo del Sol (Catedral)
  map[306][214] = 18; map[306][222] = 18; // Estatuas de mármol del atrio
  map[312][214] = 17; map[312][222] = 17; // Farolas del atrio

  map[308][240] = 31; // Gran Ayuntamiento / Casa Gremial
  map[308][268] = 30; // Torre del Mago Arcano
  map[306][266] = 28; map[306][270] = 28; // Cristales mágicos

  // Casonas con jardines en el Distrito Norte
  [204, 228, 252, 276].forEach((hx) => {
    map[308][hx] = 5; // Casona noble
    map[305][hx] = 12; // Rosales
  });
  [204, 228, 252, 276].forEach((hx) => {
    map[318][hx] = 5;
  });

  // 5. GRAN PASARELA ELEVADA / ACUEDUCTO (Cruza en Y: 326 justo encima del mercado)
  for (let x = 200; x <= 280; x += 4) {
    if (x < 236 || x > 244) {
      map[326][x] = 33; // Pasarela de madera
    }
  }

  // 6. DISTRITO SUROESTE: GREMIO DE CURTIDORES, HUERTOS VALLADOS Y CASAS
  map[334][206] = 34; // Gremio de Curtidores
  map[334][216] = 5;  // Taller textil
  map[334][211] = 17; // Farola

  // Huerto cercado con vallas de madera y cultivos
  for (let y = 342; y <= 354; y++) {
    for (let x = 202; x <= 218; x++) {
      if (x === 202 || x === 218 || y === 342 || y === 354) map[y][x] = 15; // Valla de madera
      else map[y][x] = (x % 3 === 0) ? 13 : 0; // Cultivos y césped
    }
  }
  map[348][210] = 4; // Pozo de agua
  map[358][206] = 5; map[358][214] = 5; // Casas del gremio

  // 7. DISTRITO RESIDENCIAL: PASEO VERTICAL ENTRE CASAS Y CERCADO (RÉPLICA EXACTA IMAGEN 1 EN [232, 351])
  for (let y = 336; y <= 360; y++) {
    for (let x = 218; x <= 246; x++) {
      map[y][x] = 0; // Pradera de hierba limpia
    }
  }

  // Calle peatonal vertical de adoquines entre las dos casas (X: 232..233, Y: 345..358)
  for (let y = 345; y <= 358; y++) {
    map[y][232] = 2;
    map[y][233] = 2;
  }

  // Casas Medievales Flanqueando la Calle Peatonal
  map[350][227] = 5; // Casa Izquierda (Mirando al paseo)
  map[350][238] = 5; // Casa Derecha (Mirando al paseo)

  // Hilera Horizontal de Vallas de Madera detrás de las casas (Y: 344, X: 221..243)
  for (let x = 221; x <= 243; x++) {
    if (x !== 232 && x !== 233) {
      map[344][x] = 15; // Valla de madera
    }
  }
  // Valla vertical del cercado superior derecho
  map[341][243] = 15; map[342][243] = 15; map[343][243] = 15;

  // Zona de Granja y Pasto Superior (Y: 338..343)
  map[340][228] = 13; // Gallina en la pradera
  map[340][239] = 13; // Vaca pastando en el cercado superior
  map[340][232] = 13; map[340][233] = 13; // Sacos y cajas de víveres
  map[342][231] = 12; map[342][236] = 12; // Rosales decorativos

  // Patio Inferior y Accesos: Farolas y Almacén
  map[355][228] = 17; // Farola patio izquierdo
  map[355][237] = 17; // Farola patio derecho
  map[355][244] = 17; // Farola entrada este
  map[360][221] = 19; // Brasero esquina suroeste

  // Árboles enmarcando exclusivamente los laterales y la parte superior
  [
    [221, 338], [225, 338], [230, 338], [236, 338], [242, 338],
    [221, 346], [224, 346], [221, 351], [224, 355], [221, 358],
    [230, 346], [235, 346], // Árboles entre casas y vallas
    [241, 346], [244, 346], [241, 351], [244, 351], [241, 355], [244, 358],
    [230, 354], [235, 354]
  ].forEach(([ax, ay]) => {
    map[ay][ax] = 1;
  });

  // 8. DISTRITO CENTRAL: GRAN CALZADA DEL MERCADO BAZAR (RÉPLICA EXACTA DE REFERENCIA)
  // Calzada de adoquines principal (X: 247..257, Y: 322..360)
  for (let y = 322; y <= 360; y++) {
    for (let x = 247; x <= 257; x++) {
      map[y][x] = 2; // Suelo de adoquines
    }
  }

  // Setos verticales de árboles enmarcando la calzada (X: 246 y X: 258)
  for (let y = 324; y <= 358; y++) {
    map[y][246] = 1; // Hilera de árboles izquierda
    map[y][258] = 1; // Hilera de árboles derecha
  }

  // Fuente Central Monumental en el corazón del bulevar
  map[340][252] = 4;

  // Farolas alineadas en el eje central norte-sur
  map[324][252] = 17;
  map[332][252] = 17;
  map[348][252] = 17;
  map[356][252] = 17;

  // Pozos de agua en las 4 esquinas de la calzada
  map[323][247] = 4;
  map[323][257] = 4;
  map[357][247] = 4;
  map[357][257] = 4;

  // PUESTOS DE MERCADO (FLANCO IZQUIERDO - EN PAREJAS)
  map[330][248] = 9; map[330][249] = 9; // Toldo Rojo + Toldo Verde
  map[333][248] = 9; map[333][249] = 9; // Toldo Rojo + Toldo Verde
  map[336][248] = 9; map[336][249] = 9; // Toldo Rojo + Toldo Verde
  map[344][248] = 9; map[344][249] = 9; // Toldo Azul + Toldo Rojo
  map[347][248] = 9; map[347][249] = 9; // Toldo Azul + Toldo Verde
  map[350][249] = 9;                     // Toldo Rojo

  // PUESTOS DE MERCADO (FLANCO DERECHO)
  map[330][255] = 9; // Toldo Rojo
  map[333][255] = 9; // Toldo Azul
  map[336][255] = 9; // Toldo Azul
  map[344][255] = 9; // Toldo Rojo
  map[347][255] = 9; // Toldo Verde
  map[350][255] = 9; // Toldo Azul

  // JARDÍN IZQUIERDO (X: 240..245, Y: 324..358)
  for (let y = 324; y <= 358; y++) {
    for (let x = 240; x <= 245; x++) {
      map[y][x] = 0; // Hierba
    }
  }
  map[332][241] = 17; map[344][241] = 17; // Farolas del jardín
  map[349][242] = 13; map[349][243] = 13; map[350][242] = 13; map[350][243] = 13; // Parche de tierra
  map[328][242] = 1; map[334][243] = 1; map[340][242] = 1; map[346][243] = 1; map[352][242] = 1; // Árboles

  // CORRAL DERECHO CON VALLAS Y VACA (X: 259..272, Y: 324..358)
  for (let y = 324; y <= 358; y++) {
    for (let x = 259; x <= 272; x++) {
      map[y][x] = 0; // Hierba
    }
  }
  // Vallas del corral cerrado (X: 263..268, Y: 332..337)
  for (let y = 332; y <= 337; y++) {
    for (let x = 263; x <= 268; x++) {
      if (x === 263 || x === 268 || y === 332 || y === 337) map[y][x] = 15;
    }
  }
  map[334][266] = 13; // Casilla de pasto para la vaca
  map[335][267] = 3;  // Abrevadero de agua
  map[334][264] = 1;  // Árbol junto al corral
  map[348][265] = 19; // Brasero / Hoguera
  // Arboleda compacta inferior derecha
  for (let y = 350; y <= 355; y++) {
    for (let x = 264; x <= 268; x++) {
      map[y][x] = 1;
    }
  }

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

  // Portal del Dragón Primigenio (X: 360, Y: 360) - Círculo Ceremonial de Columnas de Mármol
  for (let y = 352; y <= 368; y++) {
    for (let x = 352; x <= 368; x++) {
      map[y][x] = (x === 352 || x === 368 || y === 352 || y === 368) ? 18 : 2;
    }
  }
  map[360][360] = 11; map[356][360] = 17; map[364][360] = 17; map[360][356] = 7;

  // DENSE SCATTER PASS EN LA NATURALEZA (Bosque puro y salvaje: solo robles y flores, protegiendo las ciudades)
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    for (let x = 4; x < MAP_SIZE - 4; x++) {
      if (map[y][x] === 0) {
        // Proteger el perímetro urbano de las ciudades (para que huertos y jardines queden limpios)
        const isInsideTown = [
          { cx: 100, cy: 100 },
          { cx: 200, cy: 100 },
          { cx: 300, cy: 100 },
          { cx: 100, cy: 200 },
          { cx: 200, cy: 200 },
          { cx: 300, cy: 200 },
          { cx: 100, cy: 300 },
          { cx: 200, cy: 300 },
          { cx: 300, cy: 300 },
          { cx: 250, cy: 340 }
        ].some(({ cx, cy }) => Math.abs(x - cx) <= 16 && Math.abs(y - cy) <= 16);

        if (!isInsideTown) {
          const val = prng(x, y, 101);
          if (val < 0.28) map[y][x] = 1;      // Roble de fantasía
          else if (val < 0.36) map[y][x] = 12; // Matorral silvestre / Rosas
        }
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
