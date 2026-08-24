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
 * 1. BOSQUE ESMERALDA / GRAN REINO ORGÁNICO DE AETHELGARD (72x116 - Escala Colosal con 8 Regiones de Descubrimiento)
 */
export function generateForest400(): { tileData: number[][]; width: number; height: number } {
  const WIDTH = 72;
  const HEIGHT = 116;
  const map: number[][] = [];

  // Inicializar todo con -1 (Abismo / Vacío exterior no renderizado)
  for (let y = 0; y < HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < WIDTH; x++) {
      row.push(-1);
    }
    map.push(row);
  }

  // =========================================================================
  // 1. CARVE REGION 1: EL GRAN NÚCLEO URBANO DE AETHELGARD (X: 18..54, Y: 46..76)
  // =========================================================================
  for (let y = 46; y <= 76; y++) {
    for (let x = 18; x <= 54; x++) {
      map[y][x] = 0; // Hierba base del núcleo
    }
  }

  // =========================================================================
  // 2. CARVE REGION 2: 🌸 LA ARBOLEDA MÁGICA DEL ÁRBOL MILENARIO (Noroeste Oculto, X: 6..24, Y: 12..38)
  // =========================================================================
  for (let y = 12; y <= 38; y++) {
    for (let x = 6; x <= 24; x++) {
      map[y][x] = 0;
    }
  }
  // Senda que conecta la ciudad con la Arboleda Mágica
  for (let y = 36; y <= 48; y++) {
    map[y][22] = 2; map[y][23] = 2;
  }
  for (let y = 18; y <= 36; y++) {
    map[y][14] = 2; map[y][15] = 2;
  }
  map[24][14] = 8;  // 🏛️ Santuario Druídico Ancestral
  map[22][12] = 20; map[22][16] = 20; // 💎 Geodas de cristal feérico
  map[26][12] = 12; map[26][16] = 12; // Parterres de rosas sagradas
  map[18][14] = 7;  // 🎁 Cofre Secreto de la Arboleda Mágica
  // Robles milenarios de la arboleda
  [ [14,8], [14,12], [14,18], [16,10], [16,20], [28,8], [28,20], [32,10], [32,18] ].forEach(([y, x]) => {
    map[y][x] = 1;
  });

  // =========================================================================
  // 3. CARVE REGION 3: 🏰 CLAUSTRO Y CRIPTA DEL MONASTERIO CAÍDO (Noreste Montañoso, X: 48..66, Y: 12..38)
  // =========================================================================
  for (let y = 12; y <= 38; y++) {
    for (let x = 48; x <= 66; x++) {
      map[y][x] = 0;
    }
  }
  // Senda que conecta la ciudad con el monasterio
  for (let y = 36; y <= 48; y++) {
    map[y][49] = 2; map[y][50] = 2;
  }
  for (let y = 18; y <= 36; y++) {
    map[y][57] = 2; map[y][58] = 2;
  }
  map[24][58] = 8;   // 🏛️ Claustro en Ruinas del Monasterio
  map[25][58] = 28;  // 🚪 Entrada y Descenso a las Catacumbas del Monasterio
  map[22][56] = 18; map[22][60] = 18; // Columnas de mármol derruidas
  map[26][56] = 18; map[26][60] = 18;
  map[18][58] = 7;  // 🎁 Cofre de Reliquias del Monasterio Caído
  // Robles y lápidas del camposanto
  [ [14,52], [14,62], [16,50], [16,64], [28,52], [28,64], [32,50], [32,62] ].forEach(([y, x]) => {
    map[y][x] = 1;
  });

  // =========================================================================
  // 4. CARVE REGION 4: 🌋 EL CAÑÓN DE AZUFRE Y PORTAL DEL REY SLIME (Norte Profundo, X: 28..44, Y: 2..44)
  // =========================================================================
  for (let y = 2; y <= 44; y++) {
    for (let x = 28; x <= 44; x++) {
      map[y][x] = 0; // Hierba del cañón
    }
  }
  // Paredes de acantilados escarpados y robles en los márgenes del cañón norte
  for (let y = 2; y <= 42; y++) {
    map[y][28] = 21; map[y][29] = 21; map[y][30] = 1;
    map[y][42] = 1; map[y][43] = 21; map[y][44] = 21;
  }
  // Calzada real del Cañón Norte al Portal del Boss
  for (let y = 3; y <= 46; y++) {
    map[y][35] = 2; map[y][36] = 2; map[y][37] = 2;
  }
  map[4][36] = 11; // 🌀 Gran Portal Rúnico del Rey Slime
  map[5][33] = 18; map[5][39] = 18; // Columnas rúnicas
  map[7][33] = 19; map[7][39] = 19; // Braseros de fuego sagrado

  // Bosque salvaje para combates de slimes en el cañón norte
  [ [12,32], [12,40], [16,33], [16,39], [20,32], [20,40], [24,33], [24,39], [28,32], [28,40], [32,33], [32,39] ].forEach(([y, x]) => {
    map[y][x] = 1; // Robles del bosque salvaje
  });
  map[10][32] = 7; // Cofre secreto del cañón norte

  // =========================================================================
  // 5. CARVE REGION 5: 🌿 EL JARDÍN PROHIBIDO Y LABERINTO DE SETOS (Oeste Lejano, X: 4..18, Y: 46..74)
  // =========================================================================
  for (let y = 46; y <= 74; y++) {
    for (let x = 4; x <= 18; x++) {
      map[y][x] = 0;
    }
  }
  // Calzada principal de acceso este a oeste conectada con la ciudad
  for (let x = 6; x <= 24; x++) {
    map[60][x] = 2;
  }
  // Setos del laberinto (con accesos abiertos en las entradas viales)
  for (let y = 48; y <= 72; y++) {
    if (y < 59 || y > 61) {
      map[y][6] = 1;
      map[y][16] = 1;
    }
  }
  for (let x = 6; x <= 16; x++) {
    if (x < 10 || x > 12) {
      map[48][x] = 1;
      map[72][x] = 1;
    }
  }
  map[60][11] = 18; // Estatua central del laberinto
  map[60][9] = 7;   // 🎁 Cofre Secreto del Laberinto

  // =========================================================================
  // 6. CARVE REGION 6: 🌾 VALLE DE LOS VIÑEDOS, MOLINOS Y SANTUARIO (Suroeste, X: 8..28, Y: 76..112)
  // =========================================================================
  for (let y = 76; y <= 112; y++) {
    for (let x = 8; x <= 28; x++) {
      map[y][x] = 0;
    }
  }
  for (let y = 74; y <= 108; y++) {
    map[y][18] = 2; map[y][19] = 2; // Sendero del valle
  }
  map[82][24] = 6;  // 🌾 Molino de Viento con aspas animadas
  map[82][20] = 5;  // Casona del molinero
  map[78][12] = 5;  // Granja del Valle Alto
  map[84][12] = 5;  // Granero y Establo
  map[90][22] = 5;  // Cabaña de los Hortelanos
  map[96][22] = 5;  // Cobertizo de Herramientas
  map[88][18] = 4;  // Pozo de agua de la granja
  for (let y = 88; y <= 96; y++) {
    for (let x = 10; x <= 16; x++) {
      map[y][x] = 13; // Huertos de cultivo
    }
  }
  map[106][18] = 8;  // 🏛️ Gran Santuario Místico de los Valles
  map[105][16] = 18; map[105][20] = 18; // Columnas sagradas
  map[107][16] = 12; map[107][20] = 12; // Parterres florales
  map[108][18] = 7;  // 🎁 Cofre Sagrado del Valle

  // =========================================================================
  // 7. CARVE REGION 7: 🏴‍☠️ ENSENADA DE LOS CONTRABANDISTAS Y PUERTO (Sureste, X: 44..66, Y: 76..112)
  // =========================================================================
  for (let y = 76; y <= 112; y++) {
    for (let x = 44; x <= 66; x++) {
      map[y][x] = 0;
    }
  }
  for (let y = 74; y <= 108; y++) {
    map[y][52] = 2; map[y][53] = 2; // Senda del puerto
  }
  map[86][56] = 5;   // 🏠 Almacén Clandestino de Contrabando
  map[87][56] = 28;  // 🚪 Entrada a la Mazmorra: Cueva Secreta de los Contrabandistas
  map[80][58] = 5;   // Cabaña del Contramaestre
  map[84][58] = 5;   // Almacén de Velámenes
  map[92][56] = 5;   // Taller del Calafate
  map[86][50] = 14;  // Pilas de leña y suministros
  map[90][50] = 14;  map[94][50] = 14; // Cajas de provisiones marítimas
  map[96][60] = 18; map[98][60] = 18; // Canteras de pizarra
  map[97][62] = 20;  // 💎 Geoda de cristal de la cala
  map[106][56] = 7;  // 🎁 Cofre del Tesoro de los Contrabandistas
  map[108][52] = 18; map[108][56] = 18; // Torres vigía del muelle

  // =========================================================================
  // 8. CARVE REGION 8: 🌊 EL GRAN DELTA FLUVIAL Y ESTUARIO (Sur Fluvial, X: 30..42, Y: 76..115)
  // =========================================================================
  for (let y = 76; y <= 115; y++) {
    for (let x = 30; x <= 42; x++) {
      map[y][x] = 0;
    }
  }
  // Gran Río Fluvial Cristalino (Norte a Sur, Y: 20..115)
  for (let y = 20; y <= 76; y++) {
    map[y][35] = 3; map[y][36] = 3;
  }
  for (let y = 76; y <= 115; y++) {
    map[y][34] = 3; map[y][35] = 3; map[y][36] = 3; map[y][37] = 3; // Río ensanchado del estuario
  }
  map[84][32] = 17; map[88][32] = 17; map[92][32] = 17; // Farolas ribera oeste
  map[84][39] = 17; map[88][39] = 17; map[92][39] = 17; // Farolas ribera este
  map[88][33] = 14; map[92][38] = 14; // Redes y barriles de pesca
  map[98][35] = 0; map[98][36] = 0; // Islote central del delta
  map[99][35] = 0; map[99][36] = 0;
  map[98][35] = 7;  // 🎁 Cofre del tesoro del estuario
  map[104][35] = 19; map[104][36] = 19; // Braseros del estuario
  map[112][32] = 18; map[112][39] = 18; // Torres vigía de la desembocadura

  // =========================================================================
  // 9. RED VIAL DE LA GRAN CIUDAD (Calles y Avenidas en el núcleo urbano)
  // =========================================================================
  const cityHorizontal = [48, 54, 60, 66, 72];
  cityHorizontal.forEach((hy) => {
    for (let x = 20; x <= 52; x++) {
      if (x !== 35 && x !== 36) map[hy][x] = 2;
    }
  });
  const cityVertical = [22, 28, 34, 38, 44, 50];
  cityVertical.forEach((vx) => {
    for (let y = 48; y <= 74; y++) {
      map[y][vx] = 2;
    }
  });

  // Gran Plaza Mayor Central
  for (let y = 57; y <= 63; y++) {
    for (let x = 30; x <= 42; x++) {
      map[y][x] = 2;
    }
  }

  // 🌉 Los 3 Puentes Viales (Sobre el río en X: 35..36)
  map[48][35] = 2; map[48][36] = 2; // Puente Norte
  map[60][35] = 2; map[60][36] = 2; // Puente Central
  map[72][35] = 2; map[72][36] = 2; // Puente Sur

  // 🏛️ Elementos de la Gran Plaza Central
  map[60][36] = 4;  // Gran Fuente Central
  map[57][39] = 22; // Tablón de Misiones
  map[58][32] = 18; // Roca decorativa
  map[62][34] = 12; map[62][38] = 12; // Bancos de descanso
  map[56][30] = 9;  map[58][30] = 9;  // Puestos de mercado del bazar

  // 🏰 Grandes Mansiones y Casonas Nobles enmarcando la Plaza (Ubicadas en parcelas verdes)
  map[64][31] = 5;  // Casona Señorial del Roble (Suroeste Plaza)
  map[64][41] = 5;  // Casona Noble de la Ribera (Sureste Plaza)

  // 🍻 Taberna y Posada "El Jabalí Dorado" (Manzana Norte-Centro X: 31, Y: 51)
  map[51][31] = 5;  // Edificio de la Posada
  map[53][31] = 28; // 🚪 Puerta de Entrada a la Taberna y Posada "El Jabalí Dorado"
  map[51][41] = 5;  // Mansión del Gremio de Comerciantes (Noreste)

  // ⚔️ Distrito Oeste: Gran Forja de Brom, Posada de Viajeros y Talleres
  map[51][25] = 10; // Gran Forja Mayor de Brom (Edificio X: 25, Y: 51)
  map[53][25] = 28; // 🚪 Puerta de Entrada a la Gran Forja Real
  map[51][26] = 19; // Brasero ceremonial
  map[51][23] = 5;  // Gran Posada de los Viajeros
  map[57][25] = 5;  // Almacén de Minerales
  map[57][23] = 5;  // Mansión Comercial Oeste
  map[63][25] = 5;  // Taller de Curtidores
  map[63][23] = 5;  // Cabaña de Armeros
  map[69][23] = 5;  // Casa de Artesanos
  map[69][25] = 5;  // Almacén de Cuero

  // 🌿 Distrito Este: Botica de Lynda, Casa Consistorial y Mansiones
  map[45][47] = 31; // Gran Casa Consistorial / Castillo (Edificio X: 47, Y: 45)
  map[47][47] = 28; // 🚪 Puerta de Entrada al Gran Salón del Trono
  map[51][47] = 27; // Botica Alquímica de Lynda (Edificio X: 47, Y: 51)
  map[53][47] = 28; // 🚪 Puerta de Entrada a la Botica Alquímica
  map[51][49] = 5;  // Mansión Solariega Noreste
  map[51][51] = 5;  // Villa del Erudito
  map[57][47] = 5;  // Mansión "Villa Rosa"
  map[57][49] = 5;  // Casa del Bibliotecario
  map[57][51] = 5;  // Taller de Joyeros
  map[63][47] = 5;  // Mansión "Los Álamos"
  map[63][49] = 5;  // Palacio Residencial Este
  map[63][51] = 5;  // Casona de Seda
  map[69][47] = 5;  // Villa Ribereña
  map[69][49] = 5;  // Casa del Jardín
  map[69][51] = 5;  // Cabaña del Guarda

  // 🏘️ Nuevas Viviendas Residenciales del Distrito Central
  map[51][39] = 5;  // Residencia de los Mercaderes
  map[69][31] = 5;  // Residencia Sur del Molinero
  map[69][41] = 5;  // Residencia Sur Fluvial
  map[51][21] = 5;  // Cabaña Forestal Oeste
  map[57][21] = 5;  // Casa de Cazadores
  map[63][21] = 5;  // Casa de Leñadores
  map[69][21] = 5;  // Casa del Pastor

  // 🎪 Puestos de Mercado Adicionales en el Paseo Fluvial
  map[54][34] = 9;  map[54][38] = 9;
  map[66][34] = 9;  map[66][38] = 9;

  // 🏮 Farolas en las aceras principales
  [48, 60, 72].forEach((hy) => {
    [22, 28, 32, 40, 44, 50].forEach((fx) => {
      if (map[hy - 1]?.[fx] === 0) map[hy - 1][fx] = 17;
      if (map[hy + 1]?.[fx] === 0) map[hy + 1][fx] = 17;
    });
  });

  // 🛡️ BARRERA NATURAL PERIMETRAL:
  // En cualquier casilla de tierra (tile 0) que limite directamente con el vacío (-1),
  // colocar una barrera natural de acantilados escarpados (21) y robles milenarios (1)
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (map[y][x] === 0) {
        const hasVoidNeighbor =
          map[y - 1]?.[x] === -1 ||
          map[y + 1]?.[x] === -1 ||
          map[y]?.[x - 1] === -1 ||
          map[y]?.[x + 1] === -1;
        if (hasVoidNeighbor) {
          map[y][x] = (x + y) % 2 === 0 ? 21 : 1;
        }
      }
    }
  }

  // Restaurar la fuente en el centro
  map[60][36] = 4;

  return { tileData: map, width: WIDTH, height: HEIGHT };
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
