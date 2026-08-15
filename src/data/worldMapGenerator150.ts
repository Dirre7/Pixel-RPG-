/**
 * 🗺️ GENERADOR MAESTRO DE MUNDOS EXPANDIDOS (150x150) PARA AETHELGARD
 * Construye biomas inmensos con aldeas, ríos navegables, puentes, laberintos,
 * ruinas milenarias, cofres ocultos y portales de jefes épicos.
 */

export const MAP_SIZE = 150;

/**
 * 🌲 1. ALDEA Y BOSQUE ESMERALDA (150x150)
 * Hub Central (Aldea de los Sabios), Gran Río de Aethelgard, Lago Sagrado,
 * Bosque Frondoso, Ruinas de Roble y Altar del Gran Rey Slime.
 */
export function generateForest150(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  // 1. Bordes de bosque impenetrable
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 1 || x >= MAP_SIZE - 2 || y <= 1 || y >= MAP_SIZE - 2) {
        map[y][x] = 1; // Árboles límite
      }
    }
  }

  // 2. Gran Río de Aethelgard (Fluye de Norte a Sur con meandros)
  for (let y = 2; y < MAP_SIZE - 2; y++) {
    const rx = Math.round(75 + Math.sin(y * 0.08) * 12);
    for (let offset = -2; offset <= 2; offset++) {
      const cx = rx + offset;
      if (cx > 2 && cx < MAP_SIZE - 2) {
        map[y][cx] = 3; // Agua
      }
    }
  }

  // 3. Gran Lago Sagrado al Este (X: 110..135, Y: 70..100)
  for (let y = 70; y <= 100; y++) {
    for (let x = 110; x <= 135; x++) {
      const dist = Math.hypot((x - 122) / 13, (y - 85) / 15);
      if (dist <= 1.0) {
        map[y][x] = 3; // Lago
      }
    }
  }
  // Isla sagrada en el centro del lago
  for (let y = 83; y <= 87; y++) {
    for (let x = 120; x <= 124; x++) {
      map[y][x] = 2;
    }
  }
  map[85][122] = 8; // Santuario de la Dama del Lago
  // Puente hacia la isla
  for (let x = 97; x <= 120; x++) {
    map[85][x] = 2;
  }

  // 4. Puentes de madera sobre el Gran Río
  const bridgeYs = [25, 55, 75, 105, 130];
  bridgeYs.forEach((by) => {
    for (let y = by - 1; y <= by + 1; y++) {
      for (let x = 55; x <= 95; x++) {
        if (map[y][x] === 3) {
          map[y][x] = 2; // Puente de madera
        }
      }
    }
  });

  // 5. Red de Carreteras y Caminos Principales
  // Gran Vía Este-Oeste
  for (let x = 10; x < MAP_SIZE - 10; x++) {
    map[25][x] = 2;
    map[75][x] = 2;
    map[130][x] = 2;
  }
  // Gran Vía Norte-Sur (Oeste y Este)
  for (let y = 10; y < MAP_SIZE - 10; y++) {
    map[y][30] = 2;
    map[y][122] = 2;
  }

  // 6. Hub Principal: Gran Aldea de los Sabios (X: 18..42, Y: 18..40)
  for (let y = 18; y <= 38; y++) {
    for (let x = 18; x <= 42; x++) {
      if (x % 4 === 0 || y % 4 === 0) {
        map[y][x] = 2; // Calles adoquinadas
      }
    }
  }
  // Gran Plaza Mayor de la Aldea
  for (let y = 23; y <= 28; y++) {
    for (let x = 27; x <= 33; x++) {
      map[y][x] = 2;
    }
  }
  // Estructuras de la Aldea
  map[24][30] = 10; // Pozo de Agua Dulce Central
  map[20][22] = 5;  // Taberna / Posada del Dragón Verde
  map[20][38] = 9;  // Mercado y Tienda de Pociones
  map[34][22] = 11; // Forja y Herrería de Brom
  map[34][38] = 6;  // Gran Molino de Viento

  // Cabañas y Casas de Aldeanos
  map[20][28] = 8;
  map[20][34] = 8;
  map[34][28] = 8;
  map[34][34] = 8;

  // 7. Bosques Frondosos y Arboledas Laberínticas
  // Masa boscosa del Noroeste (X: 45..70, Y: 5..45)
  for (let y = 5; y <= 45; y++) {
    for (let x = 45; x <= 70; x++) {
      if (map[y][x] === 0 && (x + y) % 3 !== 0) {
        map[y][x] = 1;
      }
    }
  }
  // Masa boscosa del Suroeste (X: 5..65, Y: 85..145)
  for (let y = 85; y <= 145; y++) {
    for (let x = 5; x <= 65; x++) {
      if (map[y][x] === 0 && (x * 7 + y * 13) % 5 !== 0) {
        map[y][x] = 1;
      }
    }
  }
  // Bosque Profundo Oriental (X: 85..145, Y: 10..65)
  for (let y = 10; y <= 65; y++) {
    for (let x = 85; x <= 145; x++) {
      if (map[y][x] === 0 && (x * 3 + y * 11) % 4 !== 0) {
        map[y][x] = 1;
      }
    }
  }

  // 8. Cofres del Tesoro esparcidos por los 4 cuadrantes (12 cofres)
  const chestCoords = [
    [25, 25], [12, 12], [55, 15], [38, 55], [18, 95],
    [50, 135], [95, 30], [138, 20], [90, 85], [140, 95],
    [105, 135], [140, 140]
  ];
  chestCoords.forEach(([cx, cy]) => {
    map[cy][cx] = 7;
    // Despejar casilla adyacente para acceso
    if (map[cy][cx - 1] === 1) map[cy][cx - 1] = 0;
    if (map[cy][cx + 1] === 1) map[cy][cx + 1] = 0;
  });

  // 9. Santuarios Ancestrales Adicionales
  map[12][55] = 8;
  map[95][15] = 8;
  map[135][55] = 8;
  map[65][125] = 8;
  map[120][135] = 8;

  // 10. Gran Portal del Jefe (Gran Rey Slime en las Ruinas Profundas - X: 138, Y: 25)
  // Despejar claro monumental para el combate
  for (let y = 20; y <= 30; y++) {
    for (let x = 132; x <= 144; x++) {
      map[y][x] = 2;
    }
  }
  map[25][138] = 6; // Portal del Jefe

  return {
    tileData: map,
    bossPortalPos: { x: 138, y: 25 },
    defaultPlayerPos: { x: 30, y: 26 }, // Centro de la Aldea
  };
}

/**
 * 🪨 2. MINAS DE ERIDU Y CUEVAS DE SOMBRAS (150x150)
 */
export function generateCave150(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(1)); // Todo roca

  // Excavar Grandes Galerías y Red de Túneles
  // 1. Campamento de Entrada de Mineros (X: 15..35, Y: 15..35)
  for (let y = 15; y <= 35; y++) {
    for (let x = 15; x <= 35; x++) {
      map[y][x] = 0;
    }
  }
  // Vías y plaza del campamento minero
  for (let y = 20; y <= 30; y++) {
    for (let x = 20; x <= 30; x++) {
      map[y][x] = 2;
    }
  }
  map[22][22] = 5;  // Refugio / Taberna de Mineros
  map[22][28] = 11; // Forja de Mithril
  map[28][25] = 10; // Manantial Subterráneo

  // 2. Túneles Principales que cruzan el mapa
  for (let x = 25; x <= 135; x++) {
    map[25][x] = 2;
    map[75][x] = 2;
    map[125][x] = 2;
  }
  for (let y = 25; y <= 125; y++) {
    map[y][25] = 2;
    map[y][75] = 2;
    map[y][125] = 2;
  }

  // 3. Gran Lago de Cristales Azules (X: 60..90, Y: 60..90)
  for (let y = 60; y <= 90; y++) {
    for (let x = 60; x <= 90; x++) {
      const dist = Math.hypot((x - 75) / 14, (y - 75) / 14);
      if (dist <= 1.0) {
        map[y][x] = 3; // Agua subterránea
      } else if (dist <= 1.25) {
        map[y][x] = 0; // Orilla de cristal
      }
    }
  }
  // Pasarela de piedra sobre el lago subterráneo
  for (let x = 60; x <= 90; x++) {
    map[75][x] = 2;
  }

  // 4. Cámaras Secundarias con Tesoros Enanos
  const caveRooms = [
    [50, 25, 8], [110, 25, 8], [25, 75, 8], [125, 75, 8],
    [50, 125, 8], [110, 125, 8], [100, 50, 10], [50, 100, 10]
  ];
  caveRooms.forEach(([rx, ry, radius]) => {
    for (let y = ry - radius; y <= ry + radius; y++) {
      for (let x = rx - radius; x <= rx + radius; x++) {
        if (x > 2 && x < MAP_SIZE - 2 && y > 2 && y < MAP_SIZE - 2) {
          if (Math.hypot(x - rx, y - ry) <= radius) {
            map[y][x] = 0;
          }
        }
      }
    }
    // Cofre en el centro de cada cámara
    map[ry][rx] = 7;
  });

  // 5. Cámara del Gólem de Obsidiana (X: 125..142, Y: 120..140)
  for (let y = 120; y <= 140; y++) {
    for (let x = 125; x <= 142; x++) {
      map[y][x] = 2;
    }
  }
  map[130][135] = 6; // Portal del Jefe

  return {
    tileData: map,
    bossPortalPos: { x: 135, y: 130 },
    defaultPlayerPos: { x: 25, y: 25 },
  };
}

/**
 * 🐍 3. PANTANO ESPECTRAL DE VAEL (150x150)
 */
export function generateSwamp150(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  // Ciénagas de aguas cenagosas
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 1 || x >= MAP_SIZE - 2 || y <= 1 || y >= MAP_SIZE - 2) {
        map[y][x] = 1;
      } else if ((Math.sin(x * 0.12) + Math.cos(y * 0.12)) > 0.4) {
        map[y][x] = 3; // Aguas venenosas
      }
    }
  }

  // Pasarelas de madera y senderos seguros
  for (let x = 10; x < MAP_SIZE - 10; x++) {
    map[25][x] = 2;
    map[75][x] = 2;
    map[125][x] = 2;
  }
  for (let y = 10; y < MAP_SIZE - 10; y++) {
    map[y][25] = 2;
    map[y][75] = 2;
    map[y][125] = 2;
  }

  // Campamento Alquímico de Morgana (X: 20..32, Y: 20..32)
  for (let y = 20; y <= 32; y++) {
    for (let x = 20; x <= 32; x++) {
      map[y][x] = 2;
    }
  }
  map[22][24] = 5;  // Chabola Alquímica
  map[22][28] = 9;  // Puesto de Pociones
  map[28][26] = 10; // Pozo Purificado

  // Nido de la Reina Serpiente Gorgona (X: 130..142, Y: 125..138)
  for (let y = 125; y <= 138; y++) {
    for (let x = 130; x <= 142; x++) {
      map[y][x] = 2;
    }
  }
  map[130][136] = 6;

  // Cofres del Pantano
  const swampChests = [[25, 25], [15, 65], [65, 20], [80, 80], [120, 30], [30, 120], [100, 130], [135, 90]];
  swampChests.forEach(([cx, cy]) => {
    map[cy][cx] = 7;
  });

  return {
    tileData: map,
    bossPortalPos: { x: 136, y: 130 },
    defaultPlayerPos: { x: 26, y: 26 },
  };
}

/**
 * 🌋 4. VOLCÁN ANCESTRAL: FRAGUA DE LOS TITANES (150x150)
 */
export function generateVolcano150(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  // Ríos de lava
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 1 || x >= MAP_SIZE - 2 || y <= 1 || y >= MAP_SIZE - 2) {
        map[y][x] = 1;
      } else if (Math.sin(x * 0.09) * Math.cos(y * 0.09) > 0.35) {
        map[y][x] = 3; // Lava ardiente
      }
    }
  }

  // Puentes de basalto y carreteras
  for (let x = 10; x < MAP_SIZE - 10; x++) {
    map[25][x] = 2; map[75][x] = 2; map[125][x] = 2;
  }
  for (let y = 10; y < MAP_SIZE - 10; y++) {
    map[y][25] = 2; map[y][75] = 2; map[y][125] = 2;
  }

  // Forja Central de los Titanes (X: 20..32, Y: 20..32)
  for (let y = 20; y <= 32; y++) {
    for (let x = 20; x <= 32; x++) map[y][x] = 2;
  }
  map[22][24] = 11; // Gran Forja Volcánica
  map[22][28] = 5;  // Bastión de Refugio
  map[28][26] = 10; // Fuente de Agua Bendita

  // Cubil del Dragón Infernal Ignis (X: 130..144, Y: 125..140)
  for (let y = 125; y <= 140; y++) {
    for (let x = 130; x <= 144; x++) map[y][x] = 2;
  }
  map[132][137] = 6; // Portal del Dragón

  const volcanoChests = [[25, 25], [60, 25], [120, 25], [25, 80], [75, 75], [130, 75], [40, 130], [95, 135]];
  volcanoChests.forEach(([cx, cy]) => {
    map[cy][cx] = 7;
  });

  return {
    tileData: map,
    bossPortalPos: { x: 137, y: 132 },
    defaultPlayerPos: { x: 26, y: 26 },
  };
}

/**
 * ❄️ 5. PICOS HELADOS DE FROSTFALL (150x150)
 */
export function generateTundra150(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 1 || x >= MAP_SIZE - 2 || y <= 1 || y >= MAP_SIZE - 2) {
        map[y][x] = 1; // Picos de roca helada
      } else if ((x * y) % 17 === 0) {
        map[y][x] = 1;
      }
    }
  }

  // Grietas de hielo profundo
  for (let y = 2; y < MAP_SIZE - 2; y++) {
    const rx = Math.round(75 + Math.cos(y * 0.07) * 10);
    map[y][rx] = 3; map[y][rx + 1] = 3;
  }

  for (let x = 10; x < MAP_SIZE - 10; x++) {
    map[25][x] = 2; map[75][x] = 2; map[125][x] = 2;
  }
  for (let y = 10; y < MAP_SIZE - 10; y++) {
    map[y][25] = 2; map[y][75] = 2; map[y][125] = 2;
  }

  // Refugio de Frostfall
  for (let y = 20; y <= 32; y++) {
    for (let x = 20; x <= 32; x++) map[y][x] = 2;
  }
  map[22][24] = 5;
  map[22][28] = 9;
  map[28][26] = 10;

  // Fortaleza de Hielo del Titán Ymir (X: 130..144, Y: 20..35)
  for (let y = 20; y <= 35; y++) {
    for (let x = 130; x <= 144; x++) map[y][x] = 2;
  }
  map[27][137] = 6;

  const tundraChests = [[25, 25], [15, 45], [85, 20], [130, 50], [35, 120], [80, 130], [135, 125]];
  tundraChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 137, y: 27 },
    defaultPlayerPos: { x: 26, y: 26 },
  };
}

/**
 * 🏰 6. CIUDADELA IMPERIAL Y NECRÓPOLIS (150x150)
 */
export function generateCastle150(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  // Murallas imperiales concéntricas
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 1 || x >= MAP_SIZE - 2 || y <= 1 || y >= MAP_SIZE - 2) {
        map[y][x] = 1;
      }
    }
  }

  // Cuadrícula urbana imperial
  for (let i = 15; i < MAP_SIZE - 10; i += 20) {
    for (let x = 5; x < MAP_SIZE - 5; x++) map[i][x] = 2;
    for (let y = 5; y < MAP_SIZE - 5; y++) map[y][i] = 2;
  }

  // Gran Plaza Imperial
  for (let y = 20; y <= 35; y++) {
    for (let x = 20; x <= 35; x++) map[y][x] = 2;
  }
  map[24][24] = 5;
  map[24][30] = 11;
  map[30][24] = 9;
  map[30][30] = 10;

  // Salón del Trono de Lord Kael y Necrópolis de Malakor (X: 125..142, Y: 125..142)
  for (let y = 125; y <= 142; y++) {
    for (let x = 125; x <= 142; x++) map[y][x] = 2;
  }
  map[133][133] = 6;

  const castleChests = [[25, 25], [75, 25], [130, 25], [25, 75], [75, 75], [130, 75], [25, 130], [75, 130]];
  castleChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 133, y: 133 },
    defaultPlayerPos: { x: 27, y: 27 },
  };
}

/**
 * 🌌 7. GRIETA DEL VACÍO Y ABISMO ASTRAL (150x150)
 */
export function generateVoid150(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(1)); // Todo abismo

  // Plataformas flotantes conectadas
  const platforms = [
    [25, 25, 12], [75, 25, 10], [125, 25, 10],
    [25, 75, 10], [75, 75, 14], [125, 75, 10],
    [25, 125, 10], [75, 125, 10], [130, 130, 14]
  ];

  platforms.forEach(([px, py, rad]) => {
    for (let y = py - rad; y <= py + rad; y++) {
      for (let x = px - rad; x <= px + rad; x++) {
        if (x > 2 && x < MAP_SIZE - 2 && y > 2 && y < MAP_SIZE - 2) {
          if (Math.hypot(x - px, y - py) <= rad) {
            map[y][x] = 2;
          }
        }
      }
    }
  });

  // Puentes de éter estelar
  for (let x = 25; x <= 130; x++) {
    map[25][x] = 2; map[75][x] = 2; map[125][x] = 2;
  }
  for (let y = 25; y <= 130; y++) {
    map[y][25] = 2; map[y][75] = 2; map[y][125] = 2;
  }

  // Templo de Cronos (X: 130, Y: 130)
  map[130][130] = 6;

  // Santuario de Inicio
  map[25][25] = 10;
  map[22][25] = 5;

  const voidChests = [[75, 25], [125, 25], [25, 75], [75, 75], [125, 75], [25, 125], [75, 125]];
  voidChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 130, y: 130 },
    defaultPlayerPos: { x: 26, y: 26 },
  };
}

/**
 * 👑 8. PANTEÓN DE LOS INMORTALES (150x150)
 */
export function generatePantheon150(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(0));

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x <= 1 || x >= MAP_SIZE - 2 || y <= 1 || y >= MAP_SIZE - 2) {
        map[y][x] = 1;
      }
    }
  }

  // Gran Calzada de Oro Divina
  for (let y = 10; y < MAP_SIZE - 10; y++) {
    for (let x = 70; x <= 80; x++) {
      map[y][x] = 2;
    }
  }

  // Santuario de los Dioses
  for (let y = 20; y <= 40; y++) {
    for (let x = 60; x <= 90; x++) {
      map[y][x] = 2;
    }
  }
  map[30][75] = 6;
  map[120][75] = 10;

  return {
    tileData: map,
    bossPortalPos: { x: 75, y: 30 },
    defaultPlayerPos: { x: 75, y: 135 },
  };
}
