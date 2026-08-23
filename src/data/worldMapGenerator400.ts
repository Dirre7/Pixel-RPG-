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

  // 2. Río Fluvial Exterior (Fluye por el bosque este en X: 52..54 de forma limpia)
  for (let y = 3; y <= 56; y++) {
    map[y][52] = 3;
    map[y][53] = 3;
    map[y][54] = 3;
  }
  // Puente hacia la Arboleda Secreta Este
  map[30][52] = 15; map[30][53] = 15; map[30][54] = 15;

  // 3. Gran Red de Avenidas Cardinales de Piedra Beige (Tile 2)
  for (let y = 3; y <= 56; y++) {
    for (let x = cx - 1; x <= cx + 1; x++) map[y][x] = 2;
  }
  for (let x = 3; x <= 56; x++) {
    for (let y = cy - 1; y <= cy + 1; y++) map[y][x] = 2;
  }

  // 4. Gran Plaza Central Adoquinada (11x11)
  for (let y = cy - 5; y <= cy + 5; y++) {
    for (let x = cx - 5; x <= cx + 5; x++) map[y][x] = 2;
  }
  map[cy][cx] = 4; // Gran Fuente Central Monumental (Restaura HP/MP)
  map[cy - 4][cx - 4] = 17; map[cy - 4][cx + 4] = 17; // Farolas
  map[cy + 4][cx - 4] = 17; map[cy + 4][cx + 4] = 17;
  map[cy - 3][cx - 3] = 12; map[cy - 3][cx + 3] = 12; // Parterres de Rosas
  map[cy + 3][cx - 3] = 12; map[cy + 3][cx + 3] = 12;

  // 5. ⚔️ GRAN PORTAL DEL JEFE REY SLIME (TILE 11) EN EL EXTREMO NORTE
  map[2][30] = 11;
  map[2][28] = 17; map[2][32] = 17; // Farolas de piedra del portal

  // 6. Calles Secundarias de los Cuadrantes
  for (let x = 16; x <= 28; x++) {
    map[18][x] = 2; map[24][x] = 2; map[36][x] = 2; map[42][x] = 2;
  }
  for (let x = 32; x <= 44; x++) {
    map[18][x] = 2; map[24][x] = 2; map[36][x] = 2; map[42][x] = 2;
  }
  for (let y = 16; y <= 44; y++) {
    map[y][20] = 2; map[y][40] = 2;
  }

  // 7. CUADRANTE NOROESTE (Distrito Artesanal, Gremio de Exploradores, Viñedo & Círculo Sagrado)
  // Red de calles del sector noroeste
  for (let x = 12; x <= 28; x++) map[10][x] = 2; // Calle de los Exploradores
  for (let y = 5; y <= 15; y++) map[y][18] = 2;  // Avenida del Oeste
  map[10][14] = 17; map[10][22] = 17; // Farolas de la encrucijada

  // Campamento y Taberna del Gremio de Exploradores (X: 12..16, Y: 6..10)
  map[9][14] = 5;   // 🏠 Cabaña del Gremio de Exploradores
  map[7][14] = 19;  // Hoguera de campamento con brasas vivas
  map[7][12] = 12;  // Banco de descanso
  map[8][16] = 17;  // Farola del campamento

  // Círculo Druídico de Piedras Rúnicas & Geoda Arcana (X: 6..11, Y: 4..8) -> Recolección de Gemas 💎
  map[6][9] = 18; map[6][11] = 18; // Columnas rúnicas de mármol
  map[7][10] = 20; // 💎 Geoda Arcana de Cristales Mágicos (+Gemas Arcanas)
  map[5][7] = 7;   // Cofre Secreto de los Exploradores

  // Campo de Siembra y Viñedo Silvestre (X: 20..26, Y: 5..10) -> Recolección de Cosechas & Madera 🥕🪵
  map[7][20] = 13; map[7][22] = 13; // Bancales de siembra
  map[8][20] = 13; map[8][22] = 13;
  map[6][24] = 14; map[8][24] = 14; // Pilas de leña
  map[9][23] = 5;  // 🏠 Cabaña del Guardabosques Noroeste

  // Zona Artesanal Central
  map[16][18] = 5;  // Gran Posada del Roble
  map[16][22] = 5;  // Casa Residencial Noroeste
  map[22][18] = 10; // Forja Mayor de Brom
  map[22][16] = 19; // Brasero de carbón
  map[22][22] = 5;  // Casa del Artesano
  map[20][18] = 1;  // Árbol ornamental dentro del césped

  // Puestos del Bazar flanqueando la calle (sin tapar el paso en X: 20)
  for (let y = 25; y <= 28; y++) {
    for (let x = 16; x <= 24; x++) map[y][x] = 2;
  }
  map[26][17] = 9; map[28][17] = 9; // Puestos lado oeste
  map[26][23] = 9; map[28][23] = 9; // Puestos lado este

  // Arboleda de Robles Nobles en los claros noroeste
  map[4][10] = 1; map[4][16] = 1; map[4][22] = 1; map[4][26] = 1;
  map[6][6] = 1; map[9][6] = 1; map[12][6] = 1; map[14][6] = 1;
  map[12][10] = 1; map[14][12] = 1; map[14][26] = 1;

  // 8. CUADRANTE NORESTE (Distrito Residencial, Aserradero, Cantera & Huerto de la Boticaria)
  // Red de calles del sector norte
  for (let x = 30; x <= 50; x++) map[10][x] = 2; // Calle del Aserradero y la Cantera
  for (let y = 5; y <= 15; y++) map[y][41] = 2;  // Avenida del Este
  map[10][36] = 17; map[10][46] = 17; // Farolas de la encrucijada

  // Aserradero y Pila de Madera del Bosque Norte (X: 34..40, Y: 5..9) -> Recolección de Madera 🪵
  map[6][36] = 14; map[6][38] = 14; // Pilas de leña
  map[8][36] = 14; map[8][38] = 14;
  map[9][35] = 5;   // 🏠 Cabaña del Maestro Leñador
  map[8][34] = 17;  // Farola del aserradero

  // Cantera de Minerales y Bloques de Cantería (X: 43..49, Y: 5..9) -> Recolección de Hierro y Piedra 🪨
  map[5][44] = 14; map[5][45] = 14; map[5][46] = 14; map[5][47] = 14; // Valla de cantera
  map[6][45] = 18; map[8][45] = 18; // Vetas de mineral y rocas de cantería
  map[7][47] = 18; map[8][48] = 18;
  map[9][42] = 5;   // 🏠 Cabaña del Maestro Cantero
  map[6][43] = 17;  // Farola minera

  // Huerto Silvestre y Plantación de Hierbas Medicinales (X: 43..49, Y: 11..14) -> Recolección de Cosechas 🥕
  map[12][45] = 13; map[12][47] = 13; // Bancales de cultivo fértiles
  map[13][45] = 13; map[13][47] = 13;
  map[12][43] = 17; // Farola de la plantación

  // Zona Residencial & Administrativa Central
  map[16][38] = 31; // Casa Consistorial / Ayuntamiento
  map[16][42] = 5;  // Casa Residencial Noreste
  map[22][38] = 27; // Botica de Pociones
  map[22][42] = 5;  // Casa de la Boticaria
  map[26][38] = 5;  // Mansión Residencial "Los Álamos"
  map[26][42] = 5;  // Casa Señorial

  // Arboleda de Robles Nobles en los claros noreste
  map[4][34] = 1; map[4][38] = 1; map[4][44] = 1; map[4][48] = 1;
  map[6][50] = 1; map[8][50] = 1; map[12][50] = 1; map[14][50] = 1;
  map[14][34] = 1; map[14][48] = 1;
  map[20][43] = 1; map[22][44] = 1;

  // Cofre del Claro Noreste
  map[5][49] = 7; // Cofre escondido en la arboleda ribereña

  // 9. CUADRANTE SUROESTE (Distrito Sagrado, Molino, Camposanto & Arboleda)
  map[34][22] = 6;  // 🌾 Molino de Viento Tradicional con Aspas Animadas
  map[34][17] = 5;  // 🏡 Cabaña del Molinero
  map[38][18] = 5;  // ⛪ Ermita del Clérigo

  // Plazoleta Monumental del Santuario Sagrado (Tile 8)
  map[43][18] = 2; map[44][17] = 2; map[44][18] = 8; map[44][19] = 2; map[45][18] = 2;
  map[43][16] = 17; map[43][20] = 17; // Farolas de luz cálida
  map[45][16] = 17; map[45][20] = 17;
  map[42][16] = 18; map[42][20] = 18; // Columnas clásicas de mármol con hiedra
  map[44][15] = 12; map[44][21] = 12; // Parterres de rosas sagradas
  map[45][22] = 7;  // Cofre de Reliquias Sagradas

  // Camposanto Histórico Cercado (Al Oeste del Santuario)
  map[42][10] = 14; map[42][11] = 14; map[42][12] = 14; map[42][13] = 14;
  map[47][10] = 14; map[47][11] = 14; map[47][12] = 14; map[47][13] = 14;
  map[43][9] = 14; map[44][9] = 14; map[45][9] = 14; map[46][9] = 14;
  map[44][14] = 2;  // Camino de entrada al camposanto
  map[43][14] = 17; // Farol del cementerio
  map[43][11] = 20; map[43][13] = 20; // Lápidas góticas antiguas
  map[45][11] = 20; map[45][13] = 20;
  map[46][11] = 20; map[46][13] = 20;
  map[44][11] = 7;  // Cofre Secreto de los Antiguos

  // Campamento Ermitaño & Arboleda Sagrada de Robles
  map[50][18] = 19; // Hoguera mística ardiendo con brasas
  map[50][16] = 12; // Banco de meditación

  // Arboleda de robles centenarios poblando la llanura suroeste
  map[34][9] = 1; map[38][9] = 1; map[34][13] = 1; map[38][13] = 1;
  map[48][8] = 1; map[51][8] = 1; map[54][8] = 1;
  map[48][14] = 1; map[53][13] = 1;
  map[53][18] = 1; map[53][22] = 1;
  map[49][24] = 1; map[53][26] = 1;
  map[46][26] = 1; map[42][26] = 1;

  // 10. CUADRANTE SURESTE (Granja, Casas Adosadas de la Ribera & Muelle)
  map[34][36] = 5;  // 🏠 Cabaña del Guardián de la Granja

  // Granja Municipal (Huertos, Corrales y Vallas)
  for (let y = 37; y <= 45; y++) {
    for (let x = 37; x <= 45; x++) {
      if (y === 37 || y === 45 || x === 37 || x === 45) {
        if (!(y === 37 && x === 40) && !(y === 45 && x === 40)) map[y][x] = 14; // Vallas con accesos norte y sur
      }
    }
  }
  for (let y = 38; y <= 44; y++) map[y][41] = 14; // Valla divisoria
  map[39][39] = 13; map[40][39] = 13; map[41][39] = 13; // Cultivos
  map[43][39] = 7;  // Cofre de la Granja
  map[39][43] = 13; map[40][43] = 13; // Animales

  // Cabaña del Pescador & Embarcadero de Madera en el Río (X: 49, Y: 40)
  map[40][49] = 5;  // Cabaña del Pescador
  map[40][47] = 2; map[40][48] = 2; // Sendero de piedra al muelle
  map[40][51] = 15; // Embarcadero / Muelle de madera sobre el agua
  map[39][50] = 17; // Farola del puerto fluvial

  // Hilera de Casas Adosadas de la Ribera (Y: 48, X: 40..48)
  for (let x = 38; x <= 50; x++) map[46][x] = 2; // Calle adoquinada de las casas adosadas
  map[46][40] = 2; map[46][44] = 2; map[46][48] = 2; // Entradas peatonales
  map[46][42] = 17; map[46][46] = 17; map[46][50] = 17; // Farolas de la calle
  map[47][42] = 12; map[47][46] = 12; // Parterres de flores entre portales

  map[48][40] = 5;  // 🏡 Casa Adosada 1 (Tejado Rojo)
  map[48][44] = 5;  // 🏡 Casa Adosada 2 (Cantería Gris)
  map[48][48] = 5;  // 🏡 Casa Adosada 3 (Tejado Azul)

  // Cercado de Pasto Sur con Abrevadero (Y: 51..54, X: 42..48)
  for (let x = 42; x <= 48; x++) {
    map[53][x] = 14; // Valla de madera del pasto
  }
  map[51][42] = 14; map[52][42] = 14;
  map[51][48] = 14; map[52][48] = 14;
  map[52][44] = 3;  // Abrevadero de agua fresca

  // Arboleda de Robles Ribereños (Poblando la llanura sureste)
  map[34][48] = 1; map[36][49] = 1;
  map[43][48] = 1; map[45][50] = 1;
  map[52][38] = 1; map[54][40] = 1;
  map[54][48] = 1; map[54][50] = 1;

  // 11. Secretos de Exploración en las esquinas del bosque
  map[6][6] = 7;   // Cofre oculto en arboleda noroeste
  map[6][50] = 7;  // Cofre del río noreste
  map[52][6] = 7;  // Cofre suroeste
  map[52][50] = 7; // Cofre del jardín este

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
