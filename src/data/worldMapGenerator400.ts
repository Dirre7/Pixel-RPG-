/**
 * 🗺️ GENERADOR MAESTRO DE MUNDOS RPG RETRO (60x60 - 3.600 BALDOSAS)
 * 8 ZONAS COMPLETAMENTE ÚNICAS, INMERSIVAS Y CON PORTALES DE JEFE VISIBLES (TILE 11):
 *
 * 1. 🌲 Zona 1: Bosque Esmeralda & Aldea Orgánica (Portal Rey Slime en 30, 2)
 * 2. ⛏️ Zona 2: Minas de Eridu & Cavernas (Portal Gólem en 30, 6)
 * 3. 🌫️ Zona 3: Pantano de Vael (Portal Gorgona en 30, 6)
 * 4. 🌋 Zona 4: Volcán Ignis (Portal Dragón en 30, 6)
 * 5. ❄️ Zona 5: Picos de Frostfall (Portal Titán Ymir en 30, 6)
 * 6. 🏰 Zona 6: Ciudadela Imperial (Portal Lord Kael en 30, 8)
 * 7. 🌌 Zona 7: Dimensión del Vacío (Portal Archilich en 30, 6)
 * 8. ✨ Zona 8: Panteón Divino (Portal Cronos en 30, 6)
 */

export const MAP_SIZE = 60;

function createEmptyMap(fillTile: number = 0): number[][] {
  const map: number[][] = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    const row: number[] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      row.push(fillTile);
    }
    map.push(row);
  }
  return map;
}

/**
 * 1. BOSQUE ESMERALDA / GRAN ALDEA ORGÁNICA DE AETHELGARD (60x60)
 */
export function generateForest400(): { tileData: number[][]; width: number; height: number } {
  const map = createEmptyMap(0);
  const cx = 30;
  const cy = 30;

  // 1. Bosque Perimetral Impenetrable con 4 accesos cardinales
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 2 || x >= 57 || y <= 2 || y >= 57) {
        const isNorthGate = y <= 2 && Math.abs(x - cx) <= 2;
        const isSouthGate = y >= 57 && Math.abs(x - cx) <= 2;
        const isWestGate = x <= 2 && Math.abs(y - cy) <= 2;
        const isEastGate = x >= 57 && Math.abs(y - cy) <= 2;
        if (!isNorthGate && !isSouthGate && !isWestGate && !isEastGate) {
          map[y][x] = 1; // Roble
        }
      }
    }
  }

  // 2. Acantilados de Piedra al Norte (Relieve 2.5D de Elevación)
  for (let x = 18; x <= 38; x++) {
    map[20][x] = 1;  // Fila de árboles altos sobre el acantilado
    map[21][x] = 21; // 🪨 Acantilado de Roca / Cliff Tile
  }

  // 2. Acantilados de Piedra al Norte
  for (let x = 18; x <= 38; x++) {
    map[20][x] = 1;  // Fila de árboles altos sobre el acantilado
    map[21][x] = 21; // 🪨 Acantilado de Roca / Cliff Tile
  }

  // 3. 🌊 Gran Río Fluvial Cristalino (Cruza todo el mapa de Norte a Sur, Y: 0..59)
  for (let y = 0; y < MAP_SIZE; y++) {
    map[y][35] = 3;
    map[y][36] = 3;
  }

  // 4. 🏙️ GRAN RED VIAL INTERCONECTADA (80% del Reino: Avenidas, Bulevares y Calles)
  // Ejes Horizontales (Este - Oeste)
  const horizontalStreets = [6, 10, 16, 22, 29, 34, 40, 44, 48, 53];
  horizontalStreets.forEach((hy) => {
    for (let x = 8; x <= 52; x++) {
      map[hy][x] = 2;
    }
  });

  // Ejes Verticales (Norte - Sur)
  const verticalStreets = [8, 14, 18, 24, 28, 33, 38, 42, 46, 50];
  verticalStreets.forEach((vx) => {
    for (let y = 6; y <= 53; y++) {
      map[y][vx] = 2;
    }
  });

  // Gran Plaza Mayor Central (Manzana Amplia)
  for (let y = 26; y <= 32; y++) {
    for (let x = 24; x <= 32; x++) {
      map[y][x] = 2;
    }
  }

  // Acceso Norte al Gran Portal del Jefe Rey Slime
  for (let y = 3; y <= 6; y++) {
    map[y][30] = 2;
  }
  map[2][30] = 11; // Portal del Jefe

  // 🌉 Los 3 Puentes Viales (Cruce Adoquinado de Norte a Sur sobre el Río)
  map[10][35] = 2; map[10][36] = 2; // Puente Norte (Conecta Avenida del Aserradero)
  map[29][35] = 2; map[29][36] = 2; // Puente Central (Conecta Gran Plaza Mayor con el Distrito Noble)
  map[48][35] = 2; map[48][36] = 2; // Puente Sur (Conecta Distrito Granja y Santuario)

  // 🏮 Farolas Iluminando las Aceras de las Avenidas Principales
  [10, 29, 48].forEach((hy) => {
    [10, 16, 20, 26, 31, 39, 44, 48].forEach((fx) => {
      if (map[hy - 1]?.[fx] === 0) map[hy - 1][fx] = 17;
      if (map[hy + 1]?.[fx] === 0) map[hy + 1][fx] = 17;
    });
  });
  // Farolas de los 3 Puentes en el césped de las orillas
  [10, 29, 48].forEach((hy) => {
    map[hy - 1][34] = 17; map[hy + 1][34] = 17;
    map[hy - 1][37] = 17; map[hy + 1][37] = 17;
  });

  // 🏛️ Elementos de la Gran Plaza Central
  map[30][28] = 4;  // Gran Fuente Central (Restaura HP/MP)
  map[27][31] = 22; // Tablón de Misiones
  map[28][24] = 18; // Roca decorativa de la plaza
  map[32][26] = 12; // Bancos de descanso
  map[32][30] = 12;
  map[26][23] = 9;  // Puestos de mercado del bazar
  map[28][23] = 9;

  // 🏰 GRANDES MANSIONES, CASAS Y EDIFICIOS NOBLES
  // Distrito Central & Manzanas Adyacentes
  map[23][25] = 5;  // 🏠 Gran Posada del León Dorado (Norte de la Plaza)
  map[23][31] = 5;  // 🏠 Mansión del Gremio de Comerciantes (Noreste)
  map[33][25] = 5;  // 🏠 Casona Señorial del Roble (Suroeste)
  map[33][31] = 5;  // 🏠 Casona Noble de la Ribera (Sureste)

  // Distrito Oeste (Artesanos, Forja, Posada y Almacenes)
  map[16][15] = 5;  // 🏠 Gran Posada de los Viajeros
  map[22][15] = 10; // 🔨 Gran Forja Mayor de Brom
  map[22][17] = 19; // Brasero de carbón
  map[17][11] = 5;  // 🏠 Almacén de Minerales y Lingotes
  map[23][11] = 5;  // 🏠 Casona Comercial del Oeste
  map[28][11] = 5;  // 🏠 Mansión de los Curtidores
  map[34][15] = 5;  // 🏠 Taller Maderero

  // Distrito Este (Barrio Noble, Botica, Mansiones y Parque Floral)
  map[16][40] = 31; // 🏛️ Gran Casa Consistorial / Ayuntamiento Noble
  map[16][44] = 5;  // 🏠 Gran Mansión Solariega Noreste
  map[22][40] = 27; // 🧪 Botica de Pociones de Lynda
  map[22][44] = 5;  // 🏠 Gran Mansión Señorial "Villa Rosa"
  map[27][40] = 5;  // 🏠 Mansión "Los Álamos"
  map[27][44] = 5;  // 🏠 Palacio Residencial Este
  map[33][40] = 5;  // 🏠 Villa Ribereña del Mirador
  map[33][44] = 5;  // 🏠 Casona de los Laureles

  // Distrito Sur (Molino, Granjas, Santuario y Casas Adosadas)
  map[35][20] = 6;  // 🌾 Molino de Viento Tradicional con Aspas Animadas
  map[35][16] = 5;  // 🏠 Casona del Molinero
  map[41][16] = 5;  // 🏠 Casona Rústica Sur
  map[45][20] = 8;  // 🏛️ Gran Santuario Místico de Aethelgard
  map[43][18] = 18; map[43][22] = 18; // Columnas sagradas
  map[45][17] = 12; map[45][23] = 12; // Parterres de rosas sagradas
  map[46][22] = 7;  // Cofre de Reliquias Sagradas

  // Granjas y Casonas del Sureste
  map[35][44] = 5;  // 🏠 Gran Mansión Ribereña Sureste
  map[39][39] = 13; map[40][39] = 13; map[41][39] = 13; // Huertos de cultivo
  map[43][39] = 7;  // Cofre de la Granja
  map[41][44] = 5;  // 🏠 Cabaña del Pescador
  map[45][44] = 5;  // 🏠 Casona Solariega Sureste
  map[45][48] = 5;  // 🏠 Casona Adosada Este
  map[51][44] = 5;  // 🏠 Finca Rústica del Prado Sur

  // Aserradero y Canteras
  map[8][40] = 5;   // 🏠 Cabaña del Maestro Leñador
  map[6][40] = 14; map[7][40] = 14; // Pilas de leña
  map[8][44] = 5;   // 🏠 Cabaña del Maestro Cantero
  map[6][44] = 18; map[7][44] = 18; // Cantera de piedra

  // 🌲🌲 LAS 2 GRANDES ZONAS SALVAJES (20% PARA COMBATES, MONSTRUOS Y MISIONES)

  // 🌲 1. EL BOSQUE PROHIBIDO DEL NOROESTE (X: 2..12, Y: 2..9)
  // Arboleda densa y niebla donde habitan los Slimes corruptos
  [ [2,2], [2,5], [2,8], [2,11],
    [3,3], [3,7], [3,10],
    [4,2], [4,6], [4,9], [4,12],
    [5,3], [5,7], [5,10],
    [7,2], [7,5], [7,8], [7,11],
    [8,3], [8,6], [8,9] ].forEach(([y, x]) => {
    map[y][x] = 1; // Robles gigantes del bosque salvaje
  });
  map[5][7] = 7;  // Cofre Secreto del Bosque de Slimes
  map[4][4] = 20; // Geoda de cristal de savia corrupta

  // 🪨 2. EL VALLE MÍSTICO DE LOS ANTIGUOS (X: 2..12, Y: 36..47)
  // Ruinas mágicas, columnas rúnicas y criaturas ancestrales
  [ [36,3], [36,7], [36,11],
    [38,2], [38,6], [38,10],
    [40,4], [40,8], [40,12],
    [42,2], [42,6], [42,10],
    [44,3], [44,7], [44,11],
    [46,2], [46,6], [46,10] ].forEach(([y, x]) => {
    map[y][x] = 1; // Robles del claro sagrado
  });
  map[43][11] = 20; map[45][11] = 20; // Cristales y lápidas arcanas
  map[44][11] = 7;  // Cofre de los Antiguos
  map[46][7] = 18; map[46][9] = 18; // Columnas de mármol rúnico

  // 🌾 3. EL CLARO SILVESTRE DEL SURESTE (X: 52..57, Y: 36..52)
  [ [36,53], [36,56], [38,54], [40,55], [42,53], [44,56], [46,54], [48,56], [50,53], [52,55] ].forEach(([y, x]) => {
    map[y][x] = 1;
  });
  map[52][55] = 7; // Cofre del claro sureste

  // 🛡️ GARANTÍA DE SEGURIDAD VIAL TOTAL:
  // Aseguramos que el 100% de las carreteras de la red queden limpias y transitables (tile 2)
  horizontalStreets.forEach((hy) => {
    for (let x = 8; x <= 52; x++) {
      if (x !== 35 && x !== 36) {
        map[hy][x] = 2;
      }
    }
  });
  verticalStreets.forEach((vx) => {
    for (let y = 6; y <= 53; y++) {
      map[y][vx] = 2;
    }
  });
  // Plaza Central
  for (let y = 26; y <= 32; y++) {
    for (let x = 24; x <= 32; x++) {
      map[y][x] = 2;
    }
  }
  // Puentes
  map[10][35] = 2; map[10][36] = 2;
  map[29][35] = 2; map[29][36] = 2;
  map[48][35] = 2; map[48][36] = 2;
  // Camino al Boss
  for (let y = 3; y <= 6; y++) map[y][30] = 2;

  // Restaurar la fuente en el centro de la plaza
  map[30][28] = 4;

  return { tileData: map, width: MAP_SIZE, height: MAP_SIZE };
}



/**
 * 2. MINAS DE ERIDU / CAVERNAS PROFUNDAS (60x60)
 */
export function generateCave400(): { tileData: number[][]; width: number; height: number } {
  const map = createEmptyMap(12);
  const cx = 30;
  const cy = 30;

  for (let y = 6; y <= 54; y++) {
    for (let x = 6; x <= 54; x++) {
      const isGallery = (x % 6 === 0 || y % 6 === 0) && x >= 8 && x <= 52 && y >= 8 && y <= 52;
      const isCentralChamber = Math.hypot(x - cx, y - cy) <= 9;
      if (isGallery || isCentralChamber) {
        map[y][x] = 2;
      }
    }
  }

  // Lagos Subterráneos
  for (let y = 14; y <= 22; y++) {
    for (let x = 14; x <= 22; x++) {
      if (Math.hypot(x - 18, y - 18) <= 3.8) map[y][x] = 3;
    }
  }
  for (let y = 38; y <= 46; y++) {
    for (let x = 38; x <= 46; x++) {
      if (Math.hypot(x - 42, y - 42) <= 3.8) map[y][x] = 3;
    }
  }

  map[18][17] = 15; map[18][18] = 15; map[18][19] = 15;
  map[42][41] = 15; map[42][42] = 15; map[42][43] = 15;

  // ⚔️ GRAN PORTAL DEL JEFE GÓLEM DE OBSIDIANA (TILE 11)
  map[6][30] = 11;
  map[6][29] = 17; map[6][31] = 17;

  map[cy][cx] = 10; // Gran Forja Subterránea
  map[cy - 2][cx] = 18; map[cy + 2][cx] = 21;

  map[8][8] = 28; map[7][8] = 7;
  map[8][52] = 8; map[7][52] = 7;
  map[52][8] = 19; map[53][8] = 7;
  map[52][52] = 7;

  return { tileData: map, width: MAP_SIZE, height: MAP_SIZE };
}

/**
 * 3. PANTANO ESPECTRAL DE VAEL (60x60)
 */
export function generateSwamp400(): { tileData: number[][]; width: number; height: number } {
  const map = createEmptyMap(3);
  const cx = 30;
  const cy = 30;

  for (let y = 4; y <= 56; y++) {
    for (let x = 4; x <= 56; x++) {
      const isIsland1 = Math.hypot(x - cx, y - cy) <= 11;
      const isIslandNW = Math.hypot(x - 16, y - 16) <= 8;
      const isIslandNE = Math.hypot(x - 44, y - 16) <= 8;
      const isIslandSW = Math.hypot(x - 16, y - 44) <= 8;
      const isIslandSE = Math.hypot(x - 44, y - 44) <= 8;

      if (isIsland1 || isIslandNW || isIslandNE || isIslandSW || isIslandSE) {
        map[y][x] = 0;
      }
    }
  }

  for (let y = 6; y <= 44; y++) {
    map[y][cx] = 15;
  }
  for (let x = 16; x <= 44; x++) {
    map[cy][x] = 15;
  }

  // ⚔️ GRAN PORTAL DE LA REINA SERPIENTE GORGONA (TILE 11)
  map[6][30] = 11;
  map[6][29] = 17; map[6][31] = 17;

  map[cy - 2][cx - 3] = 5; map[cy - 2][cx + 3] = 5; map[cy + 3][cx] = 27;
  map[16][16] = 5; map[15][16] = 8;
  map[16][44] = 26; map[15][44] = 7;
  map[44][16] = 19; map[44][15] = 7;
  map[44][44] = 23; map[43][44] = 7;

  return { tileData: map, width: MAP_SIZE, height: MAP_SIZE };
}

/**
 * 4. FRAGUA DE LOS TITANES Y VOLCÁN IGNIS (60x60)
 */
export function generateVolcano400(): { tileData: number[][]; width: number; height: number } {
  const map = createEmptyMap(1);
  const cx = 30;
  const cy = 30;

  for (let y = 4; y <= 56; y++) {
    const lx = Math.round(30 + Math.sin(y * 0.15) * 12);
    for (let w = -2; w <= 2; w++) {
      const lavaX = lx + w;
      if (lavaX >= 4 && lavaX <= 56) map[y][lavaX] = 3;
    }
  }

  for (let x = 6; x <= 54; x++) {
    for (let y = cy - 1; y <= cy + 1; y++) map[y][x] = 2;
  }
  for (let y = 6; y <= 54; y++) {
    for (let x = cx - 1; x <= cx + 1; x++) map[y][x] = 2;
  }

  for (let y = cy - 6; y <= cy + 6; y++) {
    for (let x = cx - 6; x <= cx + 6; x++) map[y][x] = 2;
  }

  // ⚔️ GRAN PORTAL DEL DRAGÓN INFERNAL IGNIS (TILE 11)
  map[6][30] = 11;
  map[6][29] = 17; map[6][31] = 17;

  map[cy - 2][cx] = 10; map[cy][cx] = 18; map[cy + 3][cx] = 21;
  map[16][16] = 30; map[16][44] = 30; map[44][16] = 30; map[44][44] = 30;
  map[8][8] = 7; map[8][52] = 7; map[52][8] = 8; map[51][8] = 7; map[52][52] = 7;

  return { tileData: map, width: MAP_SIZE, height: MAP_SIZE };
}

/**
 * 5. PICOS HELADOS DE FROSTFALL Y TUNDRA (60x60)
 */
export function generateTundra400(): { tileData: number[][]; width: number; height: number } {
  const map = createEmptyMap(0);
  const cx = 30;
  const cy = 30;

  for (let y = 8; y <= 22; y++) {
    for (let x = 8; x <= 22; x++) {
      if (Math.hypot(x - 15, y - 15) <= 5.5) map[y][x] = 3;
    }
  }
  for (let y = 38; y <= 52; y++) {
    for (let x = 38; x <= 52; x++) {
      if (Math.hypot(x - 45, y - 45) <= 5.5) map[y][x] = 3;
    }
  }

  for (let y = 6; y <= 56; y++) {
    for (let x = cx - 1; x <= cx + 1; x++) map[y][x] = 2;
  }
  for (let x = 4; x <= 56; x++) {
    for (let y = cy - 1; y <= cy + 1; y++) map[y][x] = 2;
  }

  // ⚔️ GRAN PORTAL DEL TITÁN DE ESCARCHA YMIR (TILE 11)
  map[6][30] = 11;
  map[6][29] = 17; map[6][31] = 17;

  for (let y = cy - 5; y <= cy + 5; y++) {
    for (let x = cx - 5; x <= cx + 5; x++) map[y][x] = 2;
  }
  map[cy][cx] = 21;
  map[cy - 3][cx - 3] = 5; map[cy - 3][cx + 3] = 5;
  map[cy + 3][cx - 3] = 5; map[cy + 3][cx + 3] = 5;

  map[15][45] = 29; map[15][44] = 8;
  map[8][8] = 7; map[8][52] = 7; map[52][8] = 30; map[51][8] = 7; map[52][52] = 7;

  return { tileData: map, width: MAP_SIZE, height: MAP_SIZE };
}

/**
 * 6. CIUDADELA IMPERIAL Y CASTILLO REAL (60x60)
 */
export function generateCastle400(): { tileData: number[][]; width: number; height: number } {
  const map = createEmptyMap(12);
  const cx = 30;
  const cy = 30;

  for (let y = 6; y <= 54; y++) {
    for (let x = 6; x <= 54; x++) {
      const isAvenue = x >= 27 && x <= 33 || y >= 27 && y <= 33;
      const isCourtyard = Math.hypot(x - cx, y - cy) <= 12;
      const isGarden = (x >= 12 && x <= 22 && y >= 12 && y <= 22) || (x >= 38 && x <= 48 && y >= 38 && y <= 48);
      if (isAvenue || isCourtyard || isGarden) {
        map[y][x] = 2;
      }
    }
  }

  for (let y = 14; y <= 20; y++) {
    for (let x = 14; x <= 20; x++) {
      if (Math.hypot(x - 17, y - 17) <= 2.8) map[y][x] = 3;
    }
  }

  // ⚔️ GRAN PORTAL DEL GENERAL DE LA MUERTE LORD KAEL (TILE 11)
  map[8][30] = 11;
  map[8][29] = 17; map[8][31] = 17;

  map[18][30] = 31; map[18][22] = 29; map[18][38] = 30;
  map[cy][cx] = 4;
  map[26][26] = 17; map[26][34] = 17; map[34][26] = 17; map[34][34] = 17;
  map[38][18] = 5; map[38][22] = 5; map[38][38] = 5; map[38][42] = 5;
  map[8][8] = 19; map[7][8] = 7; map[8][52] = 32; map[7][52] = 7; map[52][8] = 7; map[52][52] = 7;

  return { tileData: map, width: MAP_SIZE, height: MAP_SIZE };
}

/**
 * 7. DIMENSIÓN DEL VACÍO Y ABISMO ASTRAL (60x60)
 */
export function generateVoid400(): { tileData: number[][]; width: number; height: number } {
  const map = createEmptyMap(3);
  const cx = 30;
  const cy = 30;

  for (let y = 4; y <= 56; y++) {
    for (let x = 4; x <= 56; x++) {
      const isCenterIsland = Math.hypot(x - cx, y - cy) <= 9;
      const isNW = Math.hypot(x - 16, y - 16) <= 6;
      const isNE = Math.hypot(x - 44, y - 16) <= 6;
      const isSW = Math.hypot(x - 16, y - 44) <= 6;
      const isSE = Math.hypot(x - 44, y - 44) <= 6;

      if (isCenterIsland || isNW || isNE || isSW || isSE) {
        map[y][x] = 2;
      }
    }
  }

  for (let y = 6; y <= 44; y++) {
    map[y][cx] = 15;
  }
  for (let x = 16; x <= 44; x++) {
    map[cy][x] = 15;
  }

  // ⚔️ GRAN PORTAL DEL ARCHILICH MALAKOR DEL ABISMO (TILE 11)
  map[6][30] = 11;
  map[6][29] = 17; map[6][31] = 17;

  map[cy][cx] = 26; map[cy - 2][cx] = 28; map[cy + 2][cx] = 28;
  map[16][16] = 30; map[16][44] = 30; map[44][16] = 30; map[44][44] = 30;
  map[8][8] = 7; map[8][52] = 7; map[52][8] = 7; map[52][52] = 8; map[51][52] = 7;

  return { tileData: map, width: MAP_SIZE, height: MAP_SIZE };
}

/**
 * 8. PANTEÓN DIVINO DE LOS DIOSES Y ELÍSEO (60x60)
 */
export function generatePantheon400(): { tileData: number[][]; width: number; height: number } {
  const map = createEmptyMap(0);
  const cx = 30;
  const cy = 30;

  for (let y = 4; y <= 56; y++) {
    for (let x = cx - 2; x <= cx + 2; x++) map[y][x] = 2;
  }
  for (let x = 4; x <= 56; x++) {
    for (let y = cy - 2; y <= cy + 2; y++) map[y][x] = 2;
  }

  for (let y = cy - 8; y <= cy + 8; y++) {
    for (let x = cx - 8; x <= cx + 8; x++) {
      if (Math.hypot(x - cx, y - cy) <= 8.5) map[y][x] = 2;
    }
  }

  // ⚔️ GRAN PORTAL DEL DIOS PRIMIGENIO CRONOS (TILE 11)
  map[6][30] = 11;
  map[6][29] = 17; map[6][31] = 17;

  map[cy - 2][cx] = 31; map[cy + 2][cx] = 4;

  const columnOffsets = [
    [-5, -5], [0, -7], [5, -5],
    [-7, 0], [7, 0],
    [-5, 5], [0, 7], [5, 5]
  ];
  columnOffsets.forEach(([ox, oy]) => {
    map[cy + oy][cx + ox] = 18;
  });

  map[16][16] = 29; map[16][44] = 29; map[44][16] = 29; map[44][44] = 29;
  map[6][6] = 8; map[5][6] = 7; map[6][54] = 7; map[54][6] = 7; map[54][54] = 8; map[53][54] = 7;

  return { tileData: map, width: MAP_SIZE, height: MAP_SIZE };
}
