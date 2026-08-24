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

  // 3. Red Vial Maestra Interconectada (100% Limpia de Obstáculos)
  // Ejes Horizontales Conectores de Cuadrantes y Puentes
  for (let x = 10; x <= 50; x++) {
    map[10][x] = 2; // Avenida Norte (Cruza Puente Norte en X: 35-36)
    map[29][x] = 2; // Avenida Central / Gran Plaza (Cruza Puente Central en X: 35-36)
    map[48][x] = 2; // Avenida Sur (Cruza Puente Sur en X: 35-36)
  }

  // Ejes Verticales Conectores
  for (let y = 10; y <= 48; y++) {
    map[y][18] = 2; // Gran Avenida del Oeste
    map[y][28] = 2; // Bulevar de la Plaza Mayor
    map[y][42] = 2; // Gran Avenida del Este
    map[y][48] = 2; // Paseo Ribereño del Este
  }

  // Calzadas y Plazas Centrales
  for (let y = 26; y <= 32; y++) {
    for (let x = 24; x <= 32; x++) {
      map[y][x] = 2; // Gran Plaza de la Aldea
    }
  }

  // Acceso Norte al Gran Portal del Jefe Rey Slime
  for (let y = 3; y <= 10; y++) {
    map[y][30] = 2;
  }
  map[2][30] = 11; // Portal del Jefe

  // 🌊 Gran Río Fluvial Cristalino (Cruza todo el mapa de Norte a Sur, Y: 0..59)
  for (let y = 0; y < MAP_SIZE; y++) {
    map[y][35] = 3;
    map[y][36] = 3;
  }

  // 🌉 Los 3 Puentes Viales (Restauración de Calzada de Cruce en el Río)
  map[10][35] = 2; map[10][36] = 2; // Puente Norte
  map[29][35] = 2; map[29][36] = 2; // Puente Central
  map[48][35] = 2; map[48][36] = 2; // Puente Sur

  // 🏮 Farolas en el Césped a los Bordes de los Caminos (Sin invadir la calzada)
  // Farolas de la Avenida Norte
  [12, 16, 20, 24, 32, 38, 44, 46].forEach((fx) => {
    map[9][fx] = 17;
    map[11][fx] = 17;
  });
  // Farolas del Puente Norte (en las esquinas de la hierba)
  map[9][34] = 17; map[11][34] = 17;
  map[9][37] = 17; map[11][37] = 17;

  // Farolas de la Gran Plaza y Puente Central
  [12, 16, 20, 24, 38, 44, 46].forEach((fx) => {
    map[28][fx] = 17;
    map[30][fx] = 17;
  });
  // Farolas del Puente Central
  map[28][34] = 17; map[30][34] = 17;
  map[28][37] = 17; map[30][37] = 17;

  // Farolas de la Avenida Sur
  [12, 16, 20, 24, 32, 38, 44, 46].forEach((fx) => {
    map[47][fx] = 17;
    map[49][fx] = 17;
  });
  // Farolas del Puente Sur
  map[47][34] = 17; map[49][34] = 17;
  map[47][37] = 17; map[49][37] = 17;

  // 🏛️ Elementos de la Gran Plaza Central (Colocados en sus posiciones armoniosas)
  map[30][28] = 4;  // Gran Fuente Central (Restaura HP/MP)
  map[27][31] = 22; // Tablón de Misiones
  map[28][24] = 18; // Roca decorativa de la plaza
  map[32][26] = 12; // Bancos de descanso
  map[32][30] = 12;
  map[26][23] = 9;  // Puestos de mercado del bazar
  map[28][23] = 9;

  // 🏰 Grandes Mansiones y Casonas Nobles enmarcando la Plaza Central
  map[23][25] = 5;  // 🏠 Gran Posada del León Dorado (Norte de la Plaza)
  map[23][31] = 5;  // 🏠 Mansión del Gremio de Comerciantes (Noreste)
  map[33][24] = 5;  // 🏠 Casona Señorial del Roble (Suroeste)
  map[33][32] = 5;  // 🏠 Casona Noble de la Ribera (Sureste)

  // 🏘️ GRANDES CASAS, MANSIONES Y DISTRITOS

  // 1. DISTRITO NOROESTE (Gremio de Exploradores & Viñedo)
  map[8][14] = 5;   // 🏠 Cabaña del Gremio de Exploradores
  map[7][14] = 19;  // Hoguera del campamento
  map[6][9] = 18; map[6][11] = 18; // Columnas rúnicas
  map[7][10] = 20; // 💎 Geoda Arcana
  map[5][7] = 7;   // Cofre Secreto
  map[7][20] = 13; map[7][22] = 13; // Huertos
  map[6][24] = 14; map[8][24] = 14; // Pilas de leña
  map[8][22] = 5;  // 🏠 Mansión del Guardabosques

  // 2. DISTRITO ARTESANAL OESTE (Herrería, Fundición & Posada)
  map[16][14] = 5;  // 🏠 Gran Posada del Roble (Edificio de 2 plantas)
  map[22][14] = 10; // Forja Mayor de Brom
  map[22][16] = 19; // Brasero de carbón
  map[19][11] = 5;  // 🏠 Almacén de Minerales
  map[20][9] = 18; map[20][13] = 18; // Cantera de hierro
  map[23][11] = 5;  // 🏠 Mansión Comercial del Oeste
  map[23][9] = 14; map[23][13] = 14;

  // 3. HUERTO DE HORTALIZAS OESTE
  for (let x = 19; x <= 23; x++) {
    map[24][x] = 13; map[25][x] = 13;
  }

  // 4. DISTRITO NORESTE (Cantera, Aserradero & Gran Mansión Consistorial)
  map[16][39] = 31; // 🏛️ Gran Casa Consistorial / Ayuntamiento Noble
  map[16][45] = 5;  // 🏠 Gran Mansión Solariega Noreste
  map[8][39] = 5;   // 🏠 Cabaña del Maestro Leñador
  map[6][39] = 14; map[6][41] = 14; // Pilas de leña
  map[6][45] = 18; map[8][45] = 18; // Cantera de piedra
  map[7][47] = 18; map[8][47] = 18;
  map[9][45] = 5;   // 🏠 Cabaña del Cantero Mayor
  map[13][45] = 13; map[13][47] = 13; // Huerto de boticaria

  // 5. DISTRITO RESIDENCIAL ESTE (Mansiones de la Ribera & Parque Floral)
  map[22][39] = 27; // Botica de Pociones
  map[22][45] = 5;  // 🏠 Gran Mansión Señorial "Villa Rosa"
  map[26][39] = 5;  // 🏠 Mansión "Los Álamos"
  map[26][45] = 5;  // 🏠 Palacio Residencial Este
  map[21][46] = 18; map[25][46] = 18; // Columnas clásicas de jardín
  map[20][49] = 12; map[24][49] = 12; map[28][49] = 12; // Bancos del paseo ribereño

  // 6. DISTRITO SUROESTE (Santuario Místico, Molino & Gran Casa de Campo)
  map[34][22] = 6;  // 🌾 Molino de Viento con aspas
  map[34][14] = 5;  // 🏠 Gran Casona del Molinero
  map[38][14] = 5;  // 🏠 Casona de Campo Suroeste
  map[44][18] = 8;  // 🏛️ Gran Santuario Místico
  map[42][16] = 18; map[42][20] = 18; // Columnas sagradas
  map[44][15] = 12; map[44][21] = 12; // Parterres de rosas sagradas
  map[45][22] = 7;  // Cofre sagrado

  // 7. DISTRITO SURESTE (Granja Noble, Casonas Ribereñas & Muelles)
  map[34][44] = 5;  // 🏠 Gran Mansión Ribereña Sureste
  map[39][39] = 13; map[40][39] = 13; map[41][39] = 13; // Huertos de la granja
  map[43][39] = 7;  // Cofre de la granja
  map[40][45] = 5;  // 🏠 Cabaña del Pescador
  map[44][44] = 5;  // 🏠 Casona Solariega Sureste
  map[44][48] = 5;  // 🏠 Casona Adosada Este

  // 🌳 ARBOLEDAS ORGÁNICAS Y PAISAJISMO EN EL CÉSPED (Sin tocar carreteras)
  // Bosquetes Noroeste
  [ [4,10], [4,16], [4,22], [4,26], [6,6], [9,6], [12,6], [14,6], [16,7], [20,5], [24,5] ].forEach(([y, x]) => {
    map[y][x] = 1;
  });
  // Bosquetes Noreste
  [ [4,34], [4,38], [4,44], [4,48], [6,50], [8,50], [12,50], [14,50], [18,51], [22,51], [26,51] ].forEach(([y, x]) => {
    map[y][x] = 1;
  });
  // Bosquetes Suroeste
  [ [34,9], [38,9], [34,13], [48,8], [51,8], [54,8], [53,18], [53,22], [49,24], [53,26], [46,26], [42,26] ].forEach(([y, x]) => {
    map[y][x] = 1;
  });
  // Bosquetes Sureste
  [ [34,48], [36,49], [43,50], [45,51], [52,38], [54,40], [54,48], [54,50] ].forEach(([y, x]) => {
    map[y][x] = 1;
  });

  // Cofres secretos en los claros del bosque
  map[6][6] = 7;
  map[6][50] = 7;
  map[52][6] = 7;
  map[52][50] = 7;

  // 🛡️ GARANTÍA DE SEGURIDAD VIAL TOTAL:
  // Aseguramos que ninguna casilla de camino (tile 2) tenga obstáculos accidentales
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      // Si la casilla es parte de la red de carreteras principales o puentes, forzar paso limpio (tile 2)
      const isNorthRoad = y === 10 && x >= 10 && x <= 50;
      const isCentralRoad = y === 29 && x >= 10 && x <= 50;
      const isSouthRoad = y === 48 && x >= 10 && x <= 50;
      const isWestAve = x === 18 && y >= 10 && y <= 48;
      const isMainPlazaAve = x === 28 && y >= 10 && y <= 48;
      const isEastAve = x === 42 && y >= 10 && y <= 48;
      const isRiverAve = x === 48 && y >= 10 && y <= 48;
      const isBossRoad = x === 30 && y >= 3 && y <= 10;
      const isPlazaSquare = y >= 26 && y <= 32 && x >= 24 && x <= 32 && !(y === 30 && x === 28); // Salvo la fuente

      if (isNorthRoad || isCentralRoad || isSouthRoad || isWestAve || isMainPlazaAve || isEastAve || isRiverAve || isBossRoad || isPlazaSquare) {
        map[y][x] = 2;
      }
    }
  }

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
