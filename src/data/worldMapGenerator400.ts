/**
 * 🗺️ GENERADOR MAESTRO DE MUNDOS EXPANDIDOS (400x400 - 160.000 BALDOSAS)
 * Biomas a escala masiva para auténtica exploración de mundo abierto.
 */

export const MAP_SIZE = 400;

/**
 * 🌲 1. ALDEA Y BOSQUE ESMERALDA (400x400)
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

  // 2. Gran Río de Aethelgard (X ~ 195..205 fluye de Norte a Sur)
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    const rx = Math.round(200 + Math.sin(y * 0.035) * 35 + Math.cos(y * 0.08) * 10);
    for (let offset = -4; offset <= 4; offset++) {
      const cx = rx + offset;
      if (cx > 4 && cx < MAP_SIZE - 4) {
        map[y][cx] = 3; // Agua
      }
    }
  }

  // 3. Gran Lago Sagrado Oriental (X: 280..345, Y: 200..280)
  for (let y = 200; y <= 280; y++) {
    for (let x = 280; x <= 345; x++) {
      const dist = Math.hypot((x - 312) / 30, (y - 240) / 35);
      if (dist <= 1.0) {
        map[y][x] = 3;
      }
    }
  }
  // Isla sagrada en el centro del lago
  for (let y = 234; y <= 246; y++) {
    for (let x = 306; x <= 318; x++) {
      map[y][x] = 2;
    }
  }
  map[240][312] = 8; // Santuario de la Dama del Lago
  // Gran Puente de piedra hacia la isla
  for (let x = 250; x <= 306; x++) {
    map[240][x] = 2;
  }

  // 4. Puentes principales sobre el Gran Río
  const bridgesY = [60, 130, 200, 270, 340];
  bridgesY.forEach((by) => {
    for (let y = by - 2; y <= by + 2; y++) {
      for (let x = 140; x <= 260; x++) {
        if (map[y][x] === 3) {
          map[y][x] = 2; // Puente de madera reforzada
        }
      }
    }
  });

  // 5. Red de Carreteras Imperiales
  // Autopistas Horizontales
  for (let x = 15; x < MAP_SIZE - 15; x++) {
    map[60][x] = 2;
    map[130][x] = 2;
    map[200][x] = 2;
    map[270][x] = 2;
    map[340][x] = 2;
  }
  // Autopistas Verticales
  for (let y = 15; y < MAP_SIZE - 15; y++) {
    map[y][85] = 2;
    map[y][150] = 2;
    map[y][250] = 2;
    map[y][320] = 2;
  }

  // 6. Gran Aldea Central de los Sabios (X: 65..110, Y: 65..110)
  for (let y = 65; y <= 105; y++) {
    for (let x = 65; x <= 105; x++) {
      if (x % 5 === 0 || y % 5 === 0) {
        map[y][x] = 2; // Red de calles
      }
    }
  }
  // Plaza Mayor Monumental (X: 80..95, Y: 80..95)
  for (let y = 80; y <= 95; y++) {
    for (let x = 80; x <= 95; x++) {
      map[y][x] = 2;
    }
  }

  // Edificios de la Aldea
  map[87][87] = 10; // Gran Fuente de la Plaza Mayor
  map[75][75] = 5;  // Taberna del Dragón Verde
  map[75][95] = 9;  // Gran Mercado
  map[95][75] = 11; // Herrería y Forja de Brom
  map[95][95] = 6;  // Gran Molino de Viento
  map[75][85] = 8;  // Cabaña del Sabio
  map[95][85] = 8;  // Cabaña de Sanadores

  // 7. Masas Boscosas Densas y Laberintos
  // Bosque del Noroeste
  for (let y = 10; y <= 160; y++) {
    for (let x = 10; x <= 160; x++) {
      if (map[y][x] === 0 && (x * 7 + y * 13) % 4 !== 0) {
        map[y][x] = 1;
      }
    }
  }
  // Bosque del Suroeste
  for (let y = 220; y <= 385; y++) {
    for (let x = 10; x <= 170; x++) {
      if (map[y][x] === 0 && (x * 11 + y * 5) % 4 !== 0) {
        map[y][x] = 1;
      }
    }
  }
  // Bosque Profundo Oriental
  for (let y = 20; y <= 380; y++) {
    for (let x = 220; x <= 385; x++) {
      if (map[y][x] === 0 && (x * 3 + y * 9) % 3 !== 0) {
        map[y][x] = 1;
      }
    }
  }

  // 8. 24 Cofres del Tesoro esparcidos por los 4 cuadrantes
  const chestCoords = [
    [87, 83], [45, 45], [120, 35], [40, 120], [140, 140],
    [50, 240], [120, 250], [45, 330], [130, 350],
    [230, 45], [300, 50], [360, 40], [250, 120], [350, 130],
    [240, 210], [360, 220], [250, 320], [320, 330], [370, 360],
    [180, 75], [180, 310], [215, 180], [312, 220], [355, 75]
  ];
  chestCoords.forEach(([cx, cy]) => {
    map[cy][cx] = 7;
    // Asegurar acceso
    if (map[cy][cx - 1] === 1) map[cy][cx - 1] = 0;
    if (map[cy][cx + 1] === 1) map[cy][cx + 1] = 0;
  });

  // 9. Santuarios Ancestrales (10 santuarios)
  const shrines = [
    [40, 40], [140, 40], [40, 340], [140, 340],
    [240, 40], [360, 120], [240, 340], [360, 340],
    [190, 200], [312, 240]
  ];
  shrines.forEach(([sx, sy]) => {
    map[sy][sx] = 8;
  });

  // 10. Gran Portal del Jefe (Gran Rey Slime en X: 360, Y: 75)
  for (let y = 68; y <= 82; y++) {
    for (let x = 352; x <= 368; x++) {
      map[y][x] = 2; // Gran plaza ceremonial de piedra
    }
  }
  map[75][360] = 6; // Portal del Jefe

  return {
    tileData: map,
    bossPortalPos: { x: 360, y: 75 },
    defaultPlayerPos: { x: 88, y: 88 },
  };
}

/**
 * 🪨 2. MINAS DE ERIDU Y CUEVAS DE SOMBRAS (400x400)
 */
export function generateCave400(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(1)); // Todo roca inicialmente

  // 1. Campamento de Mineros (X: 60..100, Y: 60..100)
  for (let y = 60; y <= 100; y++) {
    for (let x = 60; x <= 100; x++) {
      map[y][x] = 0;
      if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
    }
  }
  map[75][75] = 5;  // Refugio Minero
  map[75][85] = 11; // Forja de Mithril
  map[85][80] = 10; // Fuente Subterránea

  // 2. Red de Vías y Túneles Gigantescos
  for (let x = 20; x <= 380; x++) {
    map[75][x] = 2; map[175][x] = 2; map[275][x] = 2; map[350][x] = 2;
  }
  for (let y = 20; y <= 380; y++) {
    map[y][75] = 2; map[y][175] = 2; map[y][275] = 2; map[y][350] = 2;
  }

  // 3. Gran Lago Subterráneo de Cristales (X: 160..240, Y: 160..240)
  for (let y = 160; y <= 240; y++) {
    for (let x = 160; x <= 240; x++) {
      const dist = Math.hypot((x - 200) / 36, (y - 200) / 36);
      if (dist <= 1.0) {
        map[y][x] = 3; // Agua cristalina
      } else if (dist <= 1.25) {
        map[y][x] = 0; // Orilla
      }
    }
  }
  // Puente sobre el lago
  for (let x = 160; x <= 240; x++) {
    map[200][x] = 2;
  }

  // 4. Cámaras Secundarias con Tesoros
  const caveRooms = [
    [120, 75, 18], [275, 75, 18], [75, 175, 18], [275, 175, 18],
    [75, 275, 18], [175, 275, 18], [275, 275, 18], [350, 175, 18],
    [120, 350, 18], [240, 350, 18]
  ];
  caveRooms.forEach(([rx, ry, radius]) => {
    for (let y = ry - radius; y <= ry + radius; y++) {
      for (let x = rx - radius; x <= rx + radius; x++) {
        if (x > 3 && x < MAP_SIZE - 4 && y > 3 && y < MAP_SIZE - 4) {
          if (Math.hypot(x - rx, y - ry) <= radius) {
            map[y][x] = 0;
          }
        }
      }
    }
    map[ry][rx] = 7; // Cofre
  });

  // 5. Cámara del Gólem de Obsidiana (X: 340..370, Y: 340..370)
  for (let y = 340; y <= 370; y++) {
    for (let x = 340; x <= 370; x++) {
      map[y][x] = 2;
    }
  }
  map[355][355] = 6;

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 75, y: 75 },
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
      } else if (Math.sin(x * 0.05) + Math.cos(y * 0.05) > 0.45) {
        map[y][x] = 3; // Aguas venenosas
      }
    }
  }

  // Red de pasarelas de madera
  for (let x = 15; x < MAP_SIZE - 15; x++) {
    map[75][x] = 2; map[175][x] = 2; map[275][x] = 2; map[350][x] = 2;
  }
  for (let y = 15; y < MAP_SIZE - 15; y++) {
    map[y][75] = 2; map[y][175] = 2; map[y][275] = 2; map[y][350] = 2;
  }

  // Campamento Alquímico de Morgana
  for (let y = 65; y <= 95; y++) {
    for (let x = 65; x <= 95; x++) {
      map[y][x] = 2;
    }
  }
  map[75][75] = 5;  // Chabola
  map[75][85] = 9;  // Puesto de Pociones
  map[85][80] = 10; // Pozo Purificado

  // Nido de la Gorgona
  for (let y = 340; y <= 370; y++) {
    for (let x = 340; x <= 370; x++) {
      map[y][x] = 2;
    }
  }
  map[355][355] = 6;

  const swampChests = [
    [75, 75], [120, 50], [250, 60], [340, 75],
    [50, 175], [175, 175], [280, 180], [350, 175],
    [60, 275], [175, 275], [275, 275], [350, 275],
    [80, 350], [200, 350], [320, 350]
  ];
  swampChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 75, y: 75 },
  };
}

/**
 * 🌋 4. VOLCÁN ANCESTRAL (400x400)
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
      } else if (Math.sin(x * 0.04) * Math.cos(y * 0.04) > 0.35) {
        map[y][x] = 3; // Lava
      }
    }
  }

  for (let x = 15; x < MAP_SIZE - 15; x++) {
    map[75][x] = 2; map[175][x] = 2; map[275][x] = 2; map[350][x] = 2;
  }
  for (let y = 15; y < MAP_SIZE - 15; y++) {
    map[y][75] = 2; map[y][175] = 2; map[y][275] = 2; map[y][350] = 2;
  }

  // Bastión de los Titanes
  for (let y = 65; y <= 95; y++) {
    for (let x = 65; x <= 95; x++) map[y][x] = 2;
  }
  map[75][75] = 11; // Gran Forja Volcánica
  map[75][85] = 5;  // Bastión
  map[85][80] = 10; // Fuente de Agua Bendita

  // Cubil del Dragón Ignis
  for (let y = 340; y <= 370; y++) {
    for (let x = 340; x <= 370; x++) map[y][x] = 2;
  }
  map[355][355] = 6;

  const volcanoChests = [
    [75, 75], [130, 75], [260, 75], [350, 75],
    [75, 175], [175, 175], [275, 175], [350, 175],
    [75, 275], [175, 275], [275, 275], [350, 275],
    [75, 350], [180, 350], [280, 350]
  ];
  volcanoChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 75, y: 75 },
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
      } else if ((x * y) % 19 === 0) {
        map[y][x] = 1;
      }
    }
  }

  for (let x = 15; x < MAP_SIZE - 15; x++) {
    map[75][x] = 2; map[175][x] = 2; map[275][x] = 2; map[350][x] = 2;
  }
  for (let y = 15; y < MAP_SIZE - 15; y++) {
    map[y][75] = 2; map[y][175] = 2; map[y][275] = 2; map[y][350] = 2;
  }

  // Refugio de Frostfall
  for (let y = 65; y <= 95; y++) {
    for (let x = 65; x <= 95; x++) map[y][x] = 2;
  }
  map[75][75] = 5;
  map[75][85] = 9;
  map[85][80] = 10;

  // Fortaleza de Ymir
  for (let y = 60; y <= 90; y++) {
    for (let x = 330; x <= 370; x++) map[y][x] = 2;
  }
  map[75][350] = 6;

  const tundraChests = [
    [75, 75], [130, 40], [250, 75], [350, 40],
    [50, 175], [175, 175], [280, 175], [350, 175],
    [60, 275], [175, 275], [280, 275], [350, 275],
    [75, 350], [200, 350], [320, 350]
  ];
  tundraChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 350, y: 75 },
    defaultPlayerPos: { x: 75, y: 75 },
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

  // Cuadrícula Urbana Imperial Monumental
  for (let i = 30; i < MAP_SIZE - 20; i += 40) {
    for (let x = 10; x < MAP_SIZE - 10; x++) map[i][x] = 2;
    for (let y = 10; y < MAP_SIZE - 10; y++) map[y][i] = 2;
  }

  // Gran Plaza Imperial
  for (let y = 65; y <= 95; y++) {
    for (let x = 65; x <= 95; x++) map[y][x] = 2;
  }
  map[75][75] = 5;
  map[75][85] = 11;
  map[85][75] = 9;
  map[85][85] = 10;

  // Salón del Trono Imperial
  for (let y = 330; y <= 370; y++) {
    for (let x = 330; x <= 370; x++) map[y][x] = 2;
  }
  map[350][350] = 6;

  const castleChests = [
    [75, 75], [150, 75], [270, 75], [350, 75],
    [75, 190], [190, 190], [310, 190], [350, 190],
    [75, 310], [190, 310], [310, 310], [350, 310]
  ];
  castleChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 350, y: 350 },
    defaultPlayerPos: { x: 75, y: 75 },
  };
}

/**
 * 🌌 7. GRIETA DEL VACÍO (400x400)
 */
export function generateVoid400(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(1)); // Todo vacío

  const platforms = [
    [75, 75, 24], [190, 75, 20], [310, 75, 20],
    [75, 190, 20], [190, 190, 26], [310, 190, 20],
    [75, 310, 20], [190, 310, 20], [350, 350, 28]
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

  // Puentes cósmicos
  for (let x = 75; x <= 350; x++) {
    map[75][x] = 2; map[190][x] = 2; map[310][x] = 2;
  }
  for (let y = 75; y <= 350; y++) {
    map[y][75] = 2; map[y][190] = 2; map[y][310] = 2;
  }

  // Templo de Malakor
  map[350][350] = 6;
  map[75][75] = 10;
  map[70][75] = 5;

  const voidChests = [
    [190, 75], [310, 75], [75, 190], [190, 190],
    [310, 190], [75, 310], [190, 310], [310, 310]
  ];
  voidChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 350, y: 350 },
    defaultPlayerPos: { x: 75, y: 75 },
  };
}

/**
 * 👑 8. PANTEÓN DE LOS INMORTALES (400x400)
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

  // Gran Calzada de Oro Divina (10 baldosas de ancho)
  for (let y = 20; y < MAP_SIZE - 20; y++) {
    for (let x = 195; x <= 205; x++) {
      map[y][x] = 2;
    }
  }

  // Gran Altar de Cronos
  for (let y = 60; y <= 100; y++) {
    for (let x = 175; x <= 225; x++) {
      map[y][x] = 2;
    }
  }
  map[80][200] = 6;
  map[340][200] = 10;

  return {
    tileData: map,
    bossPortalPos: { x: 200, y: 80 },
    defaultPlayerPos: { x: 200, y: 340 },
  };
}
