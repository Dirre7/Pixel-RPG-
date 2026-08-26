// ==============================================================================
// 🏰 GENERADOR DE INTERIORES E INSTANCIAS (MAZMORRAS, CASAS, CASTILLOS Y GRUTAS)
// ==============================================================================

export interface SubZoneMapResult {
  width: number;
  height: number;
  tileData: number[][];
}

/**
 * 1. 🍻 TABERNA Y POSADA "EL JABALÍ DORADO" (18x16)
 * Gran salón acogedor de madera con chimenea monumental, barra de tabernero,
 * mesas de banquete con comida y jarras, bodega de barriles y alfombra roja bordada.
 */
export function generateTavernInterior(): SubZoneMapResult {
  const width = 18;
  const height = 16;
  const map: number[][] = [];

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        row.push(1); // Muros de madera de roble noble y vigas
      } else {
        row.push(0); // Suelo de parqué de roble pulido
      }
    }
    map.push(row);
  }

  // Columnas maestras de madera
  map[4][4] = 1;
  map[4][13] = 1;
  map[10][4] = 1;
  map[10][13] = 1;

  // Gran Chimenea de piedra con cornamenta en la pared norte
  map[1][8] = 19;
  map[1][9] = 19;
  map[1][7] = 1;
  map[1][10] = 1;

  // Gran Barra del Tabernero en la esquina noroeste (tile 31)
  map[3][2] = 31;
  map[3][3] = 31;
  map[3][4] = 31;
  map[3][5] = 31;
  map[4][5] = 31;
  map[5][5] = 31;

  // Mesas de Comedor de la Taberna con Banquete y Taburetes (tile 30)
  map[7][3] = 30;   // Mesa Oeste Superior
  map[11][3] = 30;  // Mesa Oeste Inferior
  map[7][14] = 30;  // Mesa Este Superior
  map[11][14] = 30; // Mesa Este Inferior

  // Gran Alfombra Roja Real Bordada en el centro (tile 2)
  for (let y = 6; y <= 10; y++) {
    for (let x = 7; x <= 10; x++) {
      map[y][x] = 2;
    }
  }

  // Bodega de Barriles de Cerveza y Vino en la esquina noreste (tile 14)
  map[2][14] = 14;
  map[2][15] = 14;
  map[3][15] = 14;
  map[4][15] = 14;

  // Lámparas y Candiles de Pared (tile 17)
  map[1][2] = 17;
  map[1][15] = 17;
  map[5][1] = 17;
  map[5][16] = 17;
  map[9][1] = 17;
  map[9][16] = 17;
  map[13][1] = 17;
  map[13][16] = 17;

  // Camino de entrada con felpudo (tile 2)
  for (let y = 11; y < height - 1; y++) {
    map[y][8] = 2;
    map[y][9] = 2;
  }

  // Puerta doble de salida hacia la aldea (tile 28)
  map[height - 1][8] = 28;
  map[height - 1][9] = 28;

  return { width, height, tileData: map };
}

/**
 * 2. ⚔️ LA GRAN FORJA REAL DE BROM (18x16)
 * Taller monumental de herrería con hornos de fundición, yunques, armeros y pilas de mineral.
 */
export function generateForgeInterior(): SubZoneMapResult {
  const width = 18;
  const height = 16;
  const map: number[][] = [];

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        row.push(1); // Muros perimetrales de piedra de sillería y vigas de hierro
      } else {
        row.push(0); // Suelo de losa volcánica y pizarra ignífuga
      }
    }
    map.push(row);
  }

  // Columnas maestras y pilares interiores de piedra
  map[4][4] = 1;
  map[4][13] = 1;
  map[10][4] = 1;
  map[10][13] = 1;

  // Grandes Hornos de Fundición y Fraguas al norte
  // Horno Oeste
  map[1][4] = 1;
  map[1][5] = 19; // Fragua ardiente
  map[1][6] = 19;
  map[1][7] = 1;

  // Horno Este
  map[1][10] = 1;
  map[1][11] = 19; // Fragua ardiente
  map[1][12] = 19;
  map[1][13] = 1;

  // Chimenea central decorativa
  map[1][8] = 1;
  map[1][9] = 1;

  // Tinas de templado con agua (Quench Troughs)
  map[2][3] = 3;
  map[2][14] = 3;

  // Yunques de Forja (tile 29)
  map[6][6] = 29;   // Yunque de Maestro Brom
  map[6][11] = 29;  // Yunque del Aprendiz Thorgar
  map[8][8] = 29;   // Yunque central mayor
  map[8][9] = 29;

  // Armeros y Estantes de Armas (tile 16)
  map[3][1] = 16;
  map[7][1] = 16;
  map[11][1] = 16;
  map[3][16] = 16;
  map[7][16] = 16;
  map[11][16] = 16;

  // Pilas de Mineral de Hierro y Carbón (tile 22)
  map[5][2] = 22;
  map[9][2] = 22;
  map[5][15] = 22;
  map[9][15] = 22;

  // Antorchas y Braseros de Pared (tile 17)
  map[1][2] = 17;
  map[1][15] = 17;
  map[5][1] = 17;
  map[5][16] = 17;
  map[9][1] = 17;
  map[9][16] = 17;
  map[13][1] = 17;
  map[13][16] = 17;

  // Camino empedrado hacia la entrada sur (tile 2)
  for (let y = 11; y < height - 1; y++) {
    map[y][8] = 2;
    map[y][9] = 2;
  }

  // Puerta doble de salida hacia la aldea (tile 28)
  map[height - 1][8] = 28;
  map[height - 1][9] = 28;

  return { width, height, tileData: map };
}

/**
 * 3. 🌿 BOTICA ALQUÍMICA DE LYNDA (18x16)
 * Laboratorio botánico acogedor con gran caldero burbujeante central,
 * mostrador de alquimia con alambique y matraces, estantes de hierbas aromáticas y alfombra arcana.
 */
export function generateBoticaInterior(): SubZoneMapResult {
  const width = 18;
  const height = 16;
  const map: number[][] = [];

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        row.push(1); // Muros de madera y zócalo de cantería
      } else {
        row.push(0); // Suelo de losas botánicas de tilo
      }
    }
    map.push(row);
  }

  // Columnas maestras de madera noble
  map[4][4] = 1;
  map[4][13] = 1;
  map[10][4] = 1;
  map[10][13] = 1;

  // Gran Mostrador de Boticaria y Alquimia en el noroeste (tile 31)
  map[3][2] = 31;
  map[3][3] = 31;
  map[3][4] = 31;
  map[3][5] = 31;
  map[4][5] = 31;
  map[5][5] = 31;

  // Gran Caldero de Alquimia Central sobre brasas (tile 19)
  map[6][8] = 19;
  map[6][9] = 19;

  // Alfombra Arcana Esmeralda alrededor del caldero (tile 2)
  for (let y = 5; y <= 8; y++) {
    for (let x = 7; x <= 10; x++) {
      if (map[y][x] !== 19) {
        map[y][x] = 2;
      }
    }
  }

  // Bastidores y Estantes de Secado de Hierbas (tile 30)
  map[8][3] = 30;   // Secadero Oeste 1
  map[11][3] = 30;  // Secadero Oeste 2
  map[8][14] = 30;  // Secadero Este 1
  map[11][14] = 30; // Secadero Este 2

  // Bodega de Tarros y Esencias en la esquina noreste (tile 14)
  map[2][14] = 14;
  map[2][15] = 14;
  map[3][15] = 14;
  map[4][15] = 14;

  // Antorchas y Apliques de Pared Alquímicos (tile 17)
  map[1][2] = 17;
  map[1][15] = 17;
  map[5][1] = 17;
  map[5][16] = 17;
  map[9][1] = 17;
  map[9][16] = 17;
  map[13][1] = 17;
  map[13][16] = 17;

  // Pasillo de alfombra verde hacia la entrada (tile 2)
  for (let y = 9; y < height - 1; y++) {
    map[y][8] = 2;
    map[y][9] = 2;
  }

  // Puerta doble de salida hacia la aldea (tile 28)
  map[height - 1][8] = 28;
  map[height - 1][9] = 28;

  return { width, height, tileData: map };
}

/**
 * 4. 👑 GRAN SALÓN DEL TRONO DE AETHELGARD (22x20)
 * Salón noble con alfombra real, columnas de mármol y trono del Lord de Aethelgard.
 */
export function generateCastleInterior(): SubZoneMapResult {
  const width = 22;
  const height = 20;
  const map: number[][] = [];

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        row.push(1);
      } else {
        row.push(0); // Suelo de mármol blanco
      }
    }
    map.push(row);
  }

  // Columnas de mármol flanqueando la sala
  const columnCols = [4, 17];
  const columnRows = [4, 8, 12, 16];
  columnRows.forEach((cy) => {
    columnCols.forEach((cx) => {
      map[cy][cx] = 1;
    });
  });

  // Gran Alfombra Roja central
  for (let y = 3; y < height - 1; y++) {
    map[y][10] = 2;
    map[y][11] = 2;
  }

  // Estrado del Trono al norte
  map[2][10] = 1;
  map[2][11] = 1;
  map[2][9] = 17; // Candelabro dorado
  map[2][12] = 17;

  // Puerta monumental de salida al sur
  map[height - 1][10] = 28;
  map[height - 1][11] = 28;

  return { width, height, tileData: map };
}

/**
 * 5. 🪦 MAZMORRA: CATACUMBAS DEL MONASTERIO CAÍDO (28x28)
 * Laberinto subterráneo con pasillos de piedra, criptas, esqueletos y cofre de reliquias.
 */
export function generateCryptDungeon(): SubZoneMapResult {
  const width = 28;
  const height = 28;
  const map: number[][] = [];

  // Llenar de roca sólida
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      row.push(1);
    }
    map.push(row);
  }

  // Función para tallar salas
  const carveRoom = (rx: number, ry: number, rw: number, rh: number) => {
    for (let y = ry; y < ry + rh; y++) {
      for (let x = rx; x < rx + rw; x++) {
        if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
          map[y][x] = 0; // Suelo de cripta
        }
      }
    }
  };

  // Función para tallar pasillos
  const carveCorridorH = (x1: number, x2: number, y: number) => {
    const start = Math.min(x1, x2);
    const end = Math.max(x1, x2);
    for (let x = start; x <= end; x++) {
      if (x > 0 && x < width - 1) map[y][x] = 0;
    }
  };

  const carveCorridorV = (y1: number, y2: number, x: number) => {
    const start = Math.min(y1, y2);
    const end = Math.max(y1, y2);
    for (let y = start; y <= end; y++) {
      if (y > 0 && y < height - 1) map[y][x] = 0;
    }
  };

  // Sala de Entrada (Sur)
  carveRoom(11, 21, 6, 5);

  // Pasillo central
  carveCorridorV(15, 21, 14);

  // Sala Central de Encrucijada
  carveRoom(10, 11, 8, 5);

  // Pasillo Oeste hacia Cripta de los Caballeros
  carveCorridorH(4, 10, 13);
  carveRoom(2, 10, 5, 7);

  // Pasillo Este hacia Cripta de los Monjes
  carveCorridorH(18, 24, 13);
  carveRoom(21, 10, 5, 7);

  // Pasillo Norte hacia el Santuario del Jefe
  carveCorridorV(4, 11, 14);
  carveRoom(9, 2, 10, 6);

  // ⚰️ Cripta Oeste de los Caballeros: Sarcófagos de Piedra tallados (tile 30)
  map[12][3] = 30; map[14][3] = 30;
  map[12][5] = 30; map[14][5] = 30;

  // ⚰️ Cripta Este de los Monjes: Sarcófagos de Piedra tallados (tile 30)
  map[12][22] = 30; map[14][22] = 30;
  map[12][24] = 30; map[14][24] = 30;

  // 🔥 Braseros Espectrales de Fuego Fatuo (tile 19)
  map[11][11] = 19; map[11][16] = 19; // Sala central
  map[14][11] = 19; map[14][16] = 19;
  map[3][10] = 19;  map[3][17] = 19;  // Santuario del Jefe

  // 💀 Urnas Funerarias y Montículos de Huesos con Cirios (tile 14)
  map[10][2] = 14;  map[16][2] = 14;
  map[10][25] = 14; map[16][25] = 14;
  map[21][11] = 14; map[21][16] = 14;

  // 🪦 Alfombra Ritual Púrpura hacia el Altar Mayor del Jefe (tile 2)
  for (let y = 3; y <= 7; y++) {
    map[y][13] = 2;
    map[y][14] = 2;
  }

  // 🎁 Cofre de Reliquias Sagradas en el altar de la cámara del jefe
  map[3][14] = 7;

  // 🔥 Antorchas en las paredes de las criptas (tile 17)
  map[2][11] = 17; map[2][16] = 17;
  map[10][4] = 17; map[10][23] = 17;
  map[13][10] = 17; map[13][17] = 17;
  map[21][12] = 17; map[21][15] = 17;

  // Escalera de salida hacia la superficie (tile 28)
  map[25][13] = 28;
  map[25][14] = 28;

  return { width, height, tileData: map };
}

/**
 * 6. 🏴‍☠️ MAZMORRA: CUEVA SECRETA DE LOS CONTRABANDISTAS (24x24)
 * Gruta marina con pasarelas de madera sobre el agua, enemigos y cofre pirata.
 */
export function generateSmugglersCaveDungeon(): SubZoneMapResult {
  const width = 24;
  const height = 24;
  const map: number[][] = [];

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        row.push(1); // Roca de cueva
      } else {
        row.push(3); // Agua marina profunda
      }
    }
    map.push(row);
  }

  // Pasarela principal de madera desde la entrada (Sur)
  for (let y = 14; y < height - 1; y++) {
    map[y][11] = 2; // Madera
    map[y][12] = 2;
  }

  // Plataforma central de carga
  for (let y = 8; y <= 13; y++) {
    for (let x = 7; x <= 16; x++) {
      map[y][x] = 0; // Madera firme / Roca seca
    }
  }

  // Pasarela hacia la Cámara del Botín Pirata (Noreste)
  for (let x = 16; x <= 20; x++) {
    map[10][x] = 2;
  }
  for (let y = 4; y <= 9; y++) {
    for (let x = 17; x <= 21; x++) {
      map[y][x] = 0;
    }
  }
  map[5][19] = 7; // Cofre del Gran Botín Pirata

  // Pasarela hacia el almacén clandestino (Noroeste)
  for (let x = 3; x <= 7; x++) {
    map[10][x] = 2;
  }
  for (let y = 4; y <= 9; y++) {
    for (let x = 2; x <= 6; x++) {
      map[y][x] = 0;
    }
  }

  // Braseros y antorchas piratas
  map[8][7] = 19;
  map[8][16] = 19;

  // Escalera de salida hacia el muelle exterior
  map[height - 1][11] = 28;
  map[height - 1][12] = 28;

  return { width, height, tileData: map };
}
