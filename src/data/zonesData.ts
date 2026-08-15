import { Zone } from '../types';
import { ALL_GAME_QUESTS } from './questsData';

// ==============================================================================
// 🗺️ CONSTRUCTORES ARTESANALES DE MAPAS (8 BIOMAS ÚNICOS Y DIFERENCIADOS)
// ==============================================================================

/**
 * 🌲 1. ALDEA Y BOSQUE ESMERALDA (Plaza, río, puentes, molino, forja y ruinas)
 */
function buildForestMap(width = 40, height = 36): number[][] {
  const map: number[][] = Array.from({ length: height }, () => Array(width).fill(0));

  // Bordes del bosque frondoso
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        map[y][x] = 1; // Árboles límite
      }
    }
  }

  // Río navegable que cruza de Norte a Sur (X=11..13)
  for (let y = 1; y < height - 1; y++) {
    map[y][11] = 3;
    map[y][12] = 3;
    map[y][13] = 3;
  }

  // Puentes de madera sobre el río (Y=8..9 y Y=22..23)
  map[8][11] = 2; map[8][12] = 2; map[8][13] = 2;
  map[9][11] = 2; map[9][12] = 2; map[9][13] = 2;
  map[22][11] = 2; map[22][12] = 2; map[22][13] = 2;
  map[23][11] = 2; map[23][12] = 2; map[23][13] = 2;

  // Red de caminos principales
  // Camino de la Aldea (Oeste)
  for (let x = 2; x <= 11; x++) {
    map[8][x] = 2;
    map[22][x] = 2;
  }
  for (let y = 4; y <= 26; y++) {
    map[y][5] = 2;
  }

  // Plaza Central de la Aldea (X=3..8, Y=6..10)
  for (let py = 6; py <= 10; py++) {
    for (let px = 3; px <= 8; px++) {
      map[py][px] = 2;
    }
  }

  // Caminos del Bosque Oriental (Este)
  for (let x = 13; x <= 36; x++) {
    map[8][x] = 2;
    map[22][x] = 2;
  }
  for (let y = 4; y <= 32; y++) {
    map[y][25] = 2;
  }
  for (let y = 4; y <= 16; y++) {
    map[y][34] = 2;
  }

  // Estructuras de la Aldea
  map[4][3] = 5;  // Taberna / Posada del Dragón Verde
  map[4][7] = 9;  // Puesto de Comercio
  map[6][5] = 4;  // Pozo de agua de la plaza
  map[12][3] = 10; // Forja de Brom
  map[12][8] = 6;  // Molino de viento

  // Arboledas y espesuras
  for (let y = 14; y <= 20; y++) {
    for (let x = 1; x <= 3; x++) map[y][x] = 1;
    for (let x = 7; x <= 9; x++) map[y][x] = 1;
  }
  for (let y = 2; y <= 6; y++) {
    for (let x = 15; x <= 22; x++) map[y][x] = 1;
  }
  for (let y = 11; y <= 19; y++) {
    for (let x = 16; x <= 22; x++) map[y][x] = 1;
    for (let x = 28; x <= 32; x++) map[y][x] = 1;
  }
  for (let y = 25; y <= 33; y++) {
    for (let x = 15; x <= 22; x++) map[y][x] = 1;
    for (let x = 28; x <= 36; x++) map[y][x] = 1;
  }

  // Santuario y Portal del Gran Rey Slime
  map[5][20] = 8;   // Santuario de la Naturaleza
  map[30][20] = 8;  // Santuario Menhir del Sur
  map[8][34] = 11;  // Portal del Jefe (Gran Rey Slime)

  // Cofres del Tesoro
  map[6][6] = 7;
  map[28][6] = 7;
  map[20][10] = 7;
  map[10][26] = 7;
  map[28][32] = 7;

  return map;
}

/**
 * 🪨 2. MINAS DE ERIDU Y CUEVA DE SOMBRAS (Galerías de piedra, lago subterráneo, vías)
 */
function buildCaveMap(width = 40, height = 36): number[][] {
  const map: number[][] = Array.from({ length: height }, () => Array(width).fill(1)); // Todo roca inicialmente

  // Excavar galerías y salas subterráneas principales
  // 1. Sala de Entrada de Mineros (Noroeste)
  for (let y = 2; y <= 9; y++) {
    for (let x = 2; x <= 10; x++) map[y][x] = 0;
  }

  // 2. Túnel Norte
  for (let x = 10; x <= 35; x++) {
    map[4][x] = 2; map[5][x] = 2;
  }

  // 3. Gran Lago Subterráneo Turquesa (Centro-Este)
  for (let y = 12; y <= 22; y++) {
    for (let x = 18; x <= 32; x++) map[y][x] = 3;
  }
  // Puente de piedra sobre el lago subterráneo
  for (let x = 18; x <= 32; x++) {
    map[17][x] = 2;
  }

  // 4. Galerías del Túnel Central y Sur
  for (let y = 5; y <= 32; y++) {
    map[y][10] = 2;
    map[y][35] = 2;
  }
  for (let x = 10; x <= 35; x++) {
    map[28][x] = 2; map[29][x] = 2;
  }

  // 5. Salas auxiliares de tesoro y cristales
  for (let y = 14; y <= 20; y++) {
    for (let x = 3; x <= 8; x++) map[y][x] = 0;
  }
  for (let y = 25; y <= 32; y++) {
    for (let x = 3; x <= 8; x++) map[y][x] = 0;
  }
  for (let y = 25; y <= 33; y++) {
    for (let x = 18; x <= 32; x++) map[y][x] = 0;
  }

  // Estructuras del Campamento Minero
  map[4][4] = 5;   // Puesto de Descanso de Mineros
  map[7][4] = 10;  // Forja y Yunque Subterráneo
  map[7][8] = 4;   // Pozo de agua de manantial subterráneo

  // Santuarios rúnicos y Portal del Gólem
  map[17][5] = 8;  // Santuario de Cristal Azul
  map[30][5] = 8;  // Santuario de la Tierra
  map[30][25] = 11; // Portal del Gólem de Obsidiana

  // Cofres
  map[15][6] = 7;
  map[28][5] = 7;
  map[4][32] = 7;
  map[26][20] = 7;
  map[31][30] = 7;

  return map;
}

/**
 * 🌿 3. PANTANO ESPECTRAL DE VAEL (Ciénagas verdes, pasarelas de madera, ruinas brumosas)
 */
function buildSwampMap(width = 40, height = 36): number[][] {
  const map: number[][] = Array.from({ length: height }, () => Array(width).fill(0));

  // Bordes pantanosos
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) map[y][x] = 1;
    }
  }

  // Zonas de aguas venenosas pantanosas (Lagos pantanosos)
  for (let y = 3; y <= 12; y++) {
    for (let x = 12; x <= 22; x++) map[y][x] = 3;
  }
  for (let y = 18; y <= 30; y++) {
    for (let x = 6; x <= 18; x++) map[y][x] = 3;
    for (let x = 24; x <= 35; x++) map[y][x] = 3;
  }

  // Pasarelas flotantes de madera sobre el pantano
  for (let x = 3; x <= 36; x++) {
    map[15][x] = 2; // Gran pasarela central
  }
  for (let y = 3; y <= 32; y++) {
    map[y][5] = 2;
    map[y][25] = 2;
    map[y][35] = 2;
  }

  // Islotes y campamento de la Bruja del Pantano
  map[6][5] = 5;   // Cabaña de la Bruja de Vael
  map[6][8] = 4;   // Caldero / Pozo Purificador
  map[15][25] = 10; // Forja de Veneno
  map[6][35] = 11; // Portal de la Reina Serpiente Gorgona

  // Santuarios y Cofres
  map[10][25] = 8;
  map[28][25] = 8;
  map[5][32] = 7;
  map[25][12] = 7;
  map[25][30] = 7;
  map[32][5] = 7;

  // Árboles marchitos
  for (let y = 2; y <= 10; y += 2) {
    map[y][2] = 1; map[y][10] = 1;
  }

  return map;
}

/**
 * 🌋 4. VOLCÁN ANCESTRAL (Ríos de lava, puentes de obsidiana, fragua de titanes)
 */
function buildVolcanoMap(width = 40, height = 36): number[][] {
  const map: number[][] = Array.from({ length: height }, () => Array(width).fill(0));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) map[y][x] = 1;
    }
  }

  // Ríos y piscinas de magma ardiente
  for (let y = 2; y < height - 2; y++) {
    map[y][14] = 3; map[y][15] = 3;
    map[y][26] = 3; map[y][27] = 3;
  }
  for (let x = 4; x <= 36; x++) {
    map[20][x] = 3; map[21][x] = 3;
  }

  // Puentes de obsidiana sobre la lava
  map[8][14] = 2; map[8][15] = 2;
  map[8][26] = 2; map[8][27] = 2;
  map[28][14] = 2; map[28][15] = 2;
  map[28][26] = 2; map[28][27] = 2;
  for (let y = 18; y <= 23; y++) {
    map[y][8] = 2;
    map[y][20] = 2;
    map[y][32] = 2;
  }

  // Calzadas de obsidiana
  for (let x = 3; x <= 36; x++) {
    map[8][x] = 2;
    map[28][x] = 2;
  }
  for (let y = 3; y <= 32; y++) {
    map[y][8] = 2;
    map[y][20] = 2;
    map[y][32] = 2;
  }

  // Fortaleza de la Fragua de los Titanes (Centro X=18..22, Y=6..10)
  map[6][20] = 10; // Gran Forja Volcánica
  map[6][18] = 5;  // Bastión de Enanos Ígneos
  map[6][22] = 4;  // Fuente de Magma Purificada

  // Santuarios y Portal del Dragón Ignis
  map[14][8] = 8;
  map[14][32] = 8;
  map[28][35] = 11; // Portal del Dragón Infernal Ignis

  // Cofres
  map[4][4] = 7;
  map[32][4] = 7;
  map[12][20] = 7;
  map[4][35] = 7;
  map[32][35] = 7;

  // Columnas de basalto
  for (let y = 10; y <= 16; y++) {
    map[y][3] = 1; map[y][36] = 1;
  }

  return map;
}

/**
 * ❄️ 5. PICOS HELADOS DE FROSTFALL (Lagos de hielo, nieve, pinos nórdicos)
 */
function buildTundraMap(width = 40, height = 36): number[][] {
  const map: number[][] = Array.from({ length: height }, () => Array(width).fill(0));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) map[y][x] = 1;
    }
  }

  // Lago de hielo glaciar reflectante (Centro-Oeste)
  for (let y = 10; y <= 22; y++) {
    for (let x = 8; x <= 20; x++) map[y][x] = 3;
  }

  // Caminos nórdicos entre la nieve
  for (let x = 3; x <= 36; x++) {
    map[6][x] = 2;
    map[26][x] = 2;
  }
  for (let y = 3; y <= 32; y++) {
    map[y][5] = 2;
    map[y][25] = 2;
    map[y][35] = 2;
  }

  // Aldea Nórdica de Frostfall
  map[4][5] = 5;   // Cabaña Nórdica de Troncos
  map[4][8] = 9;   // Puesto de Peletería
  map[4][11] = 10; // Forja Glacial
  map[8][5] = 4;   // Pozo de Agua de Glaciar

  // Santuarios y Portal de Ymir
  map[16][25] = 8; // Santuario del Invierno Eterno
  map[6][35] = 11; // Portal del Titán de Escarcha Ymir

  // Cofres
  map[32][5] = 7;
  map[16][14] = 7;
  map[4][32] = 7;
  map[32][35] = 7;

  // Pinos nevados
  for (let y = 12; y <= 24; y += 2) {
    map[y][28] = 1; map[y][32] = 1;
  }

  return map;
}

/**
 * 🏰 6. CIUDADELA IMPERIAL Y NECRÓPOLIS (Murallas, adoquines, plazas reales)
 */
function buildCastleMap(width = 40, height = 36): number[][] {
  const map: number[][] = Array.from({ length: height }, () => Array(width).fill(0));

  // Murallas exteriores con torreones
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) map[y][x] = 1;
      // Muralla interna que divide la ciudadela del castillo
      if (y === 14 && x !== 19 && x !== 20 && x !== 21) map[y][x] = 1;
    }
  }

  // Gran Avenida Imperial de adoquines
  for (let y = 1; y < height - 1; y++) {
    map[y][19] = 2; map[y][20] = 2; map[y][21] = 2;
  }
  for (let x = 2; x <= 37; x++) {
    map[8][x] = 2;
    map[26][x] = 2;
  }
  for (let y = 4; y <= 32; y++) {
    map[y][8] = 2;
    map[y][32] = 2;
  }

  // Plaza de la Ciudadela Baja (Sur)
  map[22][14] = 5;  // Taberna Real
  map[22][26] = 9;  // Mercado de la Corona
  map[28][14] = 10; // Forja de la Guardia Real
  map[25][20] = 4;  // Fuente Monumental de la Plaza

  // Patio del Castillo Alto y Trono (Norte)
  map[5][14] = 8;   // Santuario de la Luz Sagrada
  map[5][26] = 8;   // Santuario de los Reyes
  map[5][20] = 11;  // Portal del General de la Muerte Lord Kael

  // Cofres del Tesoro Real
  map[4][4] = 7;
  map[4][35] = 7;
  map[32][4] = 7;
  map[32][35] = 7;
  map[18][20] = 7;

  return map;
}

/**
 * 🌌 7. EL VÓRTICE DEL VACÍO (Islas flotantes en el abismo estelar, puentes de energía)
 */
function buildVoidMap(width = 40, height = 36): number[][] {
  const map: number[][] = Array.from({ length: height }, () => Array(width).fill(3)); // Abismo estelar cósmico

  // 1. Isla de Entrada (Noroeste X=3..11, Y=3..11)
  for (let y = 3; y <= 11; y++) {
    for (let x = 3; x <= 11; x++) map[y][x] = 0;
  }

  // 2. Isla Central de Poder (Centro X=15..25, Y=13..23)
  for (let y = 13; y <= 23; y++) {
    for (let x = 15; x <= 25; x++) map[y][x] = 0;
  }

  // 3. Isla del Trono del Archilich Malakor (Sureste X=27..36, Y=24..33)
  for (let y = 24; y <= 33; y++) {
    for (let x = 27; x <= 36; x++) map[y][x] = 0;
  }

  // 4. Isla del Santuario Noreste (X=27..36, Y=3..11)
  for (let y = 3; y <= 11; y++) {
    for (let x = 27; x <= 36; x++) map[y][x] = 0;
  }

  // Puentes de Energía Luminiscente Púrpura que unen las islas
  for (let x = 11; x <= 15; x++) { map[7][x] = 2; map[8][x] = 2; }
  for (let y = 8; y <= 13; y++) { map[y][15] = 2; map[y][16] = 2; }
  for (let x = 25; x <= 27; x++) { map[8][x] = 2; map[18][x] = 2; map[28][x] = 2; }
  for (let y = 18; y <= 28; y++) { map[y][25] = 2; map[y][26] = 2; }

  // Estructuras cósmicas
  map[6][7] = 5;   // Monolito de Descanso Dimensional
  map[6][9] = 10;  // Forja de Antimateria
  map[18][20] = 8; // Santuario del Vacío
  map[6][31] = 8;  // Santuario de las Estrellas
  map[28][32] = 11; // Portal del Archilich Malakor

  // Cofres
  map[4][4] = 7;
  map[4][34] = 7;
  map[15][17] = 7;
  map[31][29] = 7;

  return map;
}

/**
 * 🏛️ 8. SAGRARIO DE LOS ANTIGUOS (Templo divino de mármol blanco y oro, Altar de Cronos)
 */
function buildSanctuaryMap(width = 40, height = 36): number[][] {
  const map: number[][] = Array.from({ length: height }, () => Array(width).fill(0));

  // Columnatas divinas perimetrales
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) map[y][x] = 1;
    }
  }

  // Pasarelas de Oro Sagrado en Cruz y Círculo Divino
  for (let y = 2; y < height - 2; y++) {
    map[y][19] = 2; map[y][20] = 2; map[y][21] = 2;
  }
  for (let x = 2; x < width - 2; x++) {
    map[17][x] = 2; map[18][x] = 2; map[19][x] = 2;
  }

  // Cuadrilátero Ceremonial
  for (let x = 6; x <= 34; x++) {
    map[6][x] = 2;
    map[30][x] = 2;
  }
  for (let y = 6; y <= 30; y++) {
    map[y][6] = 2;
    map[y][34] = 2;
  }

  // Fuentes y Altar del Dios Primigenio Cronos
  map[18][10] = 4;  // Fuente de la Juventud Eterna
  map[18][30] = 4;  // Fuente de la Omnisciencia
  map[30][20] = 10; // Forja Divina de la Creación
  map[30][10] = 8;  // Santuario de la Eternidad
  map[30][30] = 8;  // Santuario del Destino
  map[6][20] = 11;  // Portal del Dios Primigenio Cronos

  // Cofres Divinos
  map[8][8] = 7;
  map[8][32] = 7;
  map[28][8] = 7;
  map[28][32] = 7;
  map[18][20] = 7;

  // Columnas sagradas
  for (let y = 8; y <= 28; y += 4) {
    map[y][14] = 1; map[y][26] = 1;
  }

  return map;
}

// ==============================================================================
// 🌟 CONFIGURACIÓN COMPLETA DE LAS 8 REGIONES DE AETHELGARD
// ==============================================================================

export const ZONES: Zone[] = [
  // =========================================================================
  // 1. BOSQUE ESMERALDA (Niveles 1 a 10)
  // =========================================================================
  {
    id: 'zone_forest',
    name: 'Reino de Aethelgard: Bosque Esmeralda y Aldea',
    description: 'Aldea pacífica protegida por robles ancestrales, forjas y un río cristalino.',
    themeColor: '#22c55e',
    bgMusicTheme: 'forest',
    requiredLevel: 1,
    mapWidth: 40,
    mapHeight: 36,
    tileData: buildForestMap(),
    npcs: [
      {
        id: 'npc_forest_1',
        zoneId: 'zone_forest',
        x: 5,
        y: 8,
        name: 'Anciano Eldrin',
        title: 'Sabio de la Aldea de Roble',
        avatarStyle: 'elder',
        dialogue: [
          '¡Bienvenido a las Tierras de Aethelgard, joven héroe! Descansa en la taberna y visita la forja antes de emprender viaje.',
          'La corrupción del Gran Rey Slime amenaza con devorar los cuatro cuadrantes del reino.',
          'Habla con los aldeanos, artesanos y druidas para descubrir secretos y pertrecharte adecuadamente.'
        ],
        tip: '💡 CONSEJO DE SABIDURÍA: Las criaturas tipo Slime sufren un 50% más de daño cuando usas habilidades de elemento Fuego.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_main_forest_3'),
      },
      {
        id: 'npc_forest_2',
        zoneId: 'zone_forest',
        x: 5,
        y: 12,
        name: 'Brom el Maestro Forjador',
        title: 'Herrero Mayor de la Aldea',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡Por el fuego y el fuelle! Mis yunques no descansan forjando espadas, hachas y arcos.',
          'Si buscas acero de primera calidad, necesitaré minerales raros ocultos en los cofres del reino.'
        ],
        tip: '💡 CONSEJO DE FORJA: Abrir cofres del tesoro por el mapa te otorgará oro abundante y materiales raros.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_side_forest_1'),
      },
      {
        id: 'npc_forest_3',
        zoneId: 'zone_forest',
        x: 25,
        y: 8,
        name: 'Bardo Corin',
        title: 'Trovador de la Arboleda',
        avatarStyle: 'scout',
        dialogue: [
          '🎵 "Bajo las aguas del río cristalino, duerme un tesoro de poder ancestral..." 🎵',
          '¡Bienvenido a la orilla este! Beber agua fresca en los pozos del pueblo restaurará tu vigor por completo.'
        ],
        tip: '💡 CONSEJO DE EXPLORACIÓN: Los pozos de agua y santuarios restauran tu Vida y Maná al 100% de forma gratuita.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_side_forest_4'),
      },
    ],
    enemies: [
      {
        name: 'Slime Verde',
        isBoss: false,
        hp: 45,
        maxHp: 45,
        attack: 13,
        defense: 5,
        speed: 8,
        expReward: 22,
        goldReward: 5,
        spriteType: 'slime',
        color: '#4ade80',
        zoneId: 'zone_forest',
        description: 'Una gelatina inquieta que intenta corroer a los aventureros.',
      },
      {
        name: 'Lobo Silvestre',
        isBoss: false,
        hp: 72,
        maxHp: 72,
        attack: 17,
        defense: 7,
        speed: 13,
        expReward: 30,
        goldReward: 7,
        spriteType: 'wolf',
        color: '#a8a29e',
        zoneId: 'zone_forest',
        description: 'Depredador ágil que ataca en cuanto divisa una presa.',
      },
      {
        name: 'Trasgo Cazador',
        isBoss: false,
        hp: 98,
        maxHp: 98,
        attack: 22,
        defense: 9,
        speed: 10,
        expReward: 42,
        goldReward: 9,
        spriteType: 'goblin',
        color: '#84cc16',
        zoneId: 'zone_forest',
        description: 'Pequeño humanoide verde armado con un garrote rudimentario.',
      },
    ],
    boss: {
      name: 'Gran Rey Slime',
      isBoss: true,
      hp: 300,
      maxHp: 300,
      attack: 32,
      defense: 17,
      speed: 12,
      expReward: 180,
      goldReward: 100,
      spriteType: 'boss_slime',
      color: '#16a34a',
      specialSkills: [
        { name: 'Aplastamiento Gigante', power: 1.8, element: 'physical' },
        { name: 'Ácido Corrosivo', power: 1.4, element: 'shadow' },
      ],
      zoneId: 'zone_forest',
      description: '¡El monarca indiscutible de la multitud gelificante del bosque!',
    },
  },

  // =========================================================================
  // 2. CUEVA DE SOMBRAS / MINAS DE ERIDU (Niveles 10 a 20)
  // =========================================================================
  {
    id: 'zone_cave',
    name: 'Cueva de Sombras: Minas de Eridu',
    description: 'Minas subterráneas enanas con vetas de cristal y lagos subterráneos.',
    themeColor: '#6366f1',
    bgMusicTheme: 'cave',
    requiredLevel: 10,
    mapWidth: 40,
    mapHeight: 36,
    tileData: buildCaveMap(),
    npcs: [
      {
        id: 'npc_cave_1',
        zoneId: 'zone_cave',
        x: 6,
        y: 4,
        name: 'Capataz Durin',
        title: 'Líder de la Expedición Minera',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡Cuidado con las estalagmitas! Las criaturas rocosas se han despertado con la energía oscura del Gólem.',
          'Nuestras vagonetas quedaron atrapadas cerca del lago subterráneo.'
        ],
        tip: '💡 CONSEJO MINERO: El Gólem de Obsidiana tiene una defensa altísima, usa daño mágico para atravesarla.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_main_cave_1'),
      },
    ],
    enemies: [
      {
        name: 'Murciélago Espectral',
        isBoss: false,
        hp: 120,
        maxHp: 120,
        attack: 34,
        defense: 14,
        speed: 22,
        expReward: 55,
        goldReward: 15,
        spriteType: 'bat',
        color: '#818cf8',
        zoneId: 'zone_cave',
        description: 'Vuela en la oscuridad atacando por la espalda.',
      },
      {
        name: 'Gólem de Piedra',
        isBoss: false,
        hp: 210,
        maxHp: 210,
        attack: 42,
        defense: 28,
        speed: 9,
        expReward: 80,
        goldReward: 25,
        spriteType: 'golem',
        color: '#64748b',
        zoneId: 'zone_cave',
        description: 'Construcción rocosa impenetrable que aplasta todo a su paso.',
      },
    ],
    boss: {
      name: 'Gólem de Obsidiana',
      isBoss: true,
      hp: 750,
      maxHp: 750,
      attack: 65,
      defense: 45,
      speed: 16,
      expReward: 450,
      goldReward: 280,
      spriteType: 'boss_golem',
      color: '#4338ca',
      specialSkills: [
        { name: 'Terremoto de Cristal', power: 2.0, element: 'physical' },
        { name: 'Ráfaga de Esquirlas', power: 1.6, element: 'shadow' },
      ],
      zoneId: 'zone_cave',
      description: 'El coloso milenario forjado en el núcleo de las minas enanas.',
    },
  },

  // =========================================================================
  // 3. PANTANO ESPECTRAL DE VAEL (Niveles 20 a 30)
  // =========================================================================
  {
    id: 'zone_swamp',
    name: 'Pantano Espectral de Vael',
    description: 'Ciénagas de aguas venenosas, pasarelas de madera y ruinas sumergidas.',
    themeColor: '#10b981',
    bgMusicTheme: 'forest',
    requiredLevel: 20,
    mapWidth: 40,
    mapHeight: 36,
    tileData: buildSwampMap(),
    npcs: [
      {
        id: 'npc_swamp_1',
        zoneId: 'zone_swamp',
        x: 5,
        y: 8,
        name: 'Morgana la Alquimista',
        title: 'Bruja de la Niebla de Vael',
        avatarStyle: 'wizard',
        dialogue: [
          'Las aguas están cargadas de toxinas milenarias. Lleva siempre antídotos y pociones restauradoras.',
          'La Reina Serpiente acecha en su nido en el extremo oriental.'
        ],
        tip: '💡 CONSEJO ALQUÍMICO: Las bendiciones sagradas disipan el veneno y fortalecen tu velocidad.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_main_swamp_1'),
      },
    ],
    enemies: [
      {
        name: 'Serpiente Ciénaga',
        isBoss: false,
        hp: 240,
        maxHp: 240,
        attack: 52,
        defense: 22,
        speed: 28,
        expReward: 110,
        goldReward: 35,
        spriteType: 'serpent',
        color: '#059669',
        zoneId: 'zone_swamp',
        description: 'Rápida y venenosa, se oculta bajo las aguas turbias.',
      },
      {
        name: 'Fantasmal de Vael',
        isBoss: false,
        hp: 290,
        maxHp: 290,
        attack: 58,
        defense: 25,
        speed: 20,
        expReward: 135,
        goldReward: 42,
        spriteType: 'ghost',
        color: '#34d399',
        zoneId: 'zone_swamp',
        description: 'Alma errante que drena la vitalidad de los vivos.',
      },
    ],
    boss: {
      name: 'Reina Serpiente Gorgona',
      isBoss: true,
      hp: 1250,
      maxHp: 1250,
      attack: 92,
      defense: 52,
      speed: 32,
      expReward: 850,
      goldReward: 500,
      spriteType: 'boss_serpent',
      color: '#047857',
      specialSkills: [
        { name: 'Mirada Petrificante', power: 2.2, element: 'shadow' },
        { name: 'Mordisco Venenoso Fatal', power: 1.8, element: 'physical' },
      ],
      zoneId: 'zone_swamp',
      description: 'Soberana inmortal de las ciénagas, capaz de convertir en piedra a sus presas.',
    },
  },

  // =========================================================================
  // 4. VOLCÁN ANCESTRAL (Niveles 30 a 40)
  // =========================================================================
  {
    id: 'zone_volcano',
    name: 'Volcán Ancestral: Fragua de los Titanes',
    description: 'Caldera de lava ardiente, puentes de obsidiana y la Forja de los Titanes.',
    themeColor: '#f97316',
    bgMusicTheme: 'volcano',
    requiredLevel: 30,
    mapWidth: 40,
    mapHeight: 36,
    tileData: buildVolcanoMap(),
    npcs: [
      {
        id: 'npc_volcano_1',
        zoneId: 'zone_volcano',
        x: 20,
        y: 8,
        name: 'Ignatius el Maestro Ígneo',
        title: 'Guardián de la Forja Titánica',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡El calor de este volcán derrite el metal más resistente! Solo los héroes templados en batalla sobreviven aquí.',
          'El Dragón Infernal Ignis protege la caldera ardiente.'
        ],
        tip: '💡 CONSEJO DE FUEGO: Usa habilidades de elemento Hielo o Sagrado para infligir daño crítico en el volcán.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_main_volcano_1'),
      },
    ],
    enemies: [
      {
        name: 'Elemental de Fuego',
        isBoss: false,
        hp: 380,
        maxHp: 380,
        attack: 78,
        defense: 35,
        speed: 25,
        expReward: 190,
        goldReward: 60,
        spriteType: 'elemental_fire',
        color: '#ea580c',
        zoneId: 'zone_volcano',
        description: 'Llama viviente que incinera todo a su alrededor.',
      },
      {
        name: 'Demonio de Magma',
        isBoss: false,
        hp: 480,
        maxHp: 480,
        attack: 90,
        defense: 45,
        speed: 21,
        expReward: 240,
        goldReward: 75,
        spriteType: 'demon',
        color: '#c2410c',
        zoneId: 'zone_volcano',
        description: 'Guerrero infernal armado con espadones de piedra ardiente.',
      },
    ],
    boss: {
      name: 'Dragón Infernal Ignis',
      isBoss: true,
      hp: 1900,
      maxHp: 1900,
      attack: 130,
      defense: 75,
      speed: 38,
      expReward: 1500,
      goldReward: 900,
      spriteType: 'boss_dragon',
      color: '#dc2626',
      specialSkills: [
        { name: 'Llamarada Cataclísmica', power: 2.5, element: 'fire' },
        { name: 'Garra de Obsidiana', power: 2.0, element: 'physical' },
      ],
      zoneId: 'zone_volcano',
      description: 'El dragón supremo de fuego primigenio que custodia los fuegos de la creación.',
    },
  },

  // =========================================================================
  // 5. PICOS HELADOS DE FROSTFALL (Niveles 40 a 50)
  // =========================================================================
  {
    id: 'zone_tundra',
    name: 'Picos Helados de Frostfall',
    description: 'Picos glaciales, lagos de hielo, nieve eterna y cabañas nórdicas.',
    themeColor: '#38bdf8',
    bgMusicTheme: 'cave',
    requiredLevel: 40,
    mapWidth: 40,
    mapHeight: 36,
    tileData: buildTundraMap(),
    npcs: [
      {
        id: 'npc_tundra_1',
        zoneId: 'zone_tundra',
        x: 5,
        y: 8,
        name: 'Valkiria Astrid',
        title: 'Centinela de los Glaciares',
        avatarStyle: 'knight',
        dialogue: [
          'El viento aúlla con la furia del Titán Ymir. Mantén encendido tu fuego interior.',
          'Nuestras cabañas nórdicas ofrecen calor y refugio antes de subir a la cima helada.'
        ],
        tip: '💡 CONSEJO GLACIAL: Las magias de Fuego causan daño doble sobre los gigantes de hielo.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_main_tundra_1'),
      },
    ],
    enemies: [
      {
        name: 'Lobo del Cero Absoluto',
        isBoss: false,
        hp: 550,
        maxHp: 550,
        attack: 110,
        defense: 52,
        speed: 42,
        expReward: 310,
        goldReward: 95,
        spriteType: 'wolf_ice',
        color: '#7dd3fc',
        zoneId: 'zone_tundra',
        description: 'Bestia veloz cuyos colmillos congelan la sangre.',
      },
      {
        name: 'Gigante de Hielo',
        isBoss: false,
        hp: 720,
        maxHp: 720,
        attack: 125,
        defense: 65,
        speed: 24,
        expReward: 390,
        goldReward: 120,
        spriteType: 'giant_ice',
        color: '#0284c7',
        zoneId: 'zone_tundra',
        description: 'Coloso de escarcha indestructible armado con garrotes glaciares.',
      },
    ],
    boss: {
      name: 'Titán de Escarcha Ymir',
      isBoss: true,
      hp: 2600,
      maxHp: 2600,
      attack: 165,
      defense: 95,
      speed: 40,
      expReward: 2200,
      goldReward: 1400,
      spriteType: 'boss_frost',
      color: '#0369a1',
      specialSkills: [
        { name: 'Ventisca Cero Absoluto', power: 2.6, element: 'ice' },
        { name: 'Impacto Glaciar', power: 2.1, element: 'physical' },
      ],
      zoneId: 'zone_tundra',
      description: 'El soberano milenario del hielo eterno cuyo aliento congela reinos enteros.',
    },
  },

  // =========================================================================
  // 6. CIUDADELA IMPERIAL Y NECRÓPOLIS (Niveles 50 a 60)
  // =========================================================================
  {
    id: 'zone_castle',
    name: 'Ciudadela Imperial y Necrópolis Real',
    description: 'Gran fortaleza imperial amurallada, avenidas adoquinadas y el trono caído.',
    themeColor: '#a855f7',
    bgMusicTheme: 'castle',
    requiredLevel: 50,
    mapWidth: 40,
    mapHeight: 36,
    tileData: buildCastleMap(),
    npcs: [
      {
        id: 'npc_castle_1',
        zoneId: 'zone_castle',
        x: 20,
        y: 26,
        name: 'Capitán Vane',
        title: 'Último Guardia de la Corona',
        avatarStyle: 'knight',
        dialogue: [
          'La Ciudadela Imperial ha caído bajo el influjo del General Lord Kael. Los caballeros caídos vagan como no-muertos.',
          'Reúne las mejores armas de la forja antes de desafiar el salón del trono.'
        ],
        tip: '💡 CONSEJO REAL: El daño Sagrado del Paladín y Clérigo desintegra a los no-muertos.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_main_castle_1'),
      },
    ],
    enemies: [
      {
        name: 'Caballero Caído',
        isBoss: false,
        hp: 850,
        maxHp: 850,
        attack: 145,
        defense: 80,
        speed: 35,
        expReward: 520,
        goldReward: 160,
        spriteType: 'death_knight',
        color: '#9333ea',
        zoneId: 'zone_castle',
        description: 'Antiguo paladín imperial reanimado por magia oscura.',
      },
      {
        name: 'Gárgola Imperial',
        isBoss: false,
        hp: 950,
        maxHp: 950,
        attack: 160,
        defense: 90,
        speed: 38,
        expReward: 620,
        goldReward: 190,
        spriteType: 'gargoyle',
        color: '#7e22ce',
        zoneId: 'zone_castle',
        description: 'Estatua alada de piedra maldita con garras letales.',
      },
    ],
    boss: {
      name: 'General de la Muerte Lord Kael',
      isBoss: true,
      hp: 3500,
      maxHp: 3500,
      attack: 210,
      defense: 120,
      speed: 48,
      expReward: 3500,
      goldReward: 2200,
      spriteType: 'boss_death_knight',
      color: '#6b21a8',
      specialSkills: [
        { name: 'Juicio del Vacío Maldito', power: 2.8, element: 'shadow' },
        { name: 'Tajo Fantasmal de la Corona', power: 2.3, element: 'physical' },
      ],
      zoneId: 'zone_castle',
      description: 'El comandante supremo de los ejércitos reales corrupto por la ambición de la inmortalidad.',
    },
  },

  // =========================================================================
  // 7. EL VÓRTICE DEL VACÍO (Niveles 60 a 70)
  // =========================================================================
  {
    id: 'zone_void',
    name: 'El Vórtice del Vacío',
    description: 'Islas cósmicas flotantes sobre el abismo estelar unidas por puentes de energía.',
    themeColor: '#ec4899',
    bgMusicTheme: 'castle',
    requiredLevel: 60,
    mapWidth: 40,
    mapHeight: 36,
    tileData: buildVoidMap(),
    npcs: [
      {
        id: 'npc_void_1',
        zoneId: 'zone_void',
        x: 7,
        y: 8,
        name: 'Oráculo del Abismo',
        title: 'Espíritu de las Estrellas Olvidadas',
        avatarStyle: 'wizard',
        dialogue: [
          'Aquí el tiempo y el espacio pierden su forma. El Archilich Malakor canaliza el fin de la realidad.',
          'Pisa con firmeza sobre los puentes cósmicos y purifica el Núcleo Sombrío.'
        ],
        tip: '💡 CONSEJO CÓSMICO: El Archilich alterna barreras de inmunidad física y mágica, usa habilidades mixtas.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_main_void_1'),
      },
    ],
    enemies: [
      {
        name: 'Aberración del Vacío',
        isBoss: false,
        hp: 1200,
        maxHp: 1200,
        attack: 195,
        defense: 105,
        speed: 50,
        expReward: 850,
        goldReward: 280,
        spriteType: 'void_horror',
        color: '#f472b6',
        zoneId: 'zone_void',
        description: 'Entidad de antimateria que devora la luz y la magia.',
      },
      {
        name: 'Segador Dimensional',
        isBoss: false,
        hp: 1400,
        maxHp: 1400,
        attack: 220,
        defense: 115,
        speed: 55,
        expReward: 1050,
        goldReward: 350,
        spriteType: 'void_reaper',
        color: '#db2777',
        zoneId: 'zone_void',
        description: 'Ejecutor sombrío con guadaña de materia oscura.',
      },
    ],
    boss: {
      name: 'Archilich Malakor del Abismo',
      isBoss: true,
      hp: 4800,
      maxHp: 4800,
      attack: 280,
      defense: 160,
      speed: 60,
      expReward: 6000,
      goldReward: 4000,
      spriteType: 'boss_void',
      color: '#be185d',
      specialSkills: [
        { name: 'Singularidad de la Nada Absoluta', power: 3.2, element: 'shadow' },
        { name: 'Destello Astral de Supernova', power: 2.6, element: 'magic' },
      ],
      zoneId: 'zone_void',
      description: 'El archicanciller traidor que fracturó el Cristal Primigenio y abrió las puertas del Abismo.',
    },
  },

  // =========================================================================
  // 8. SAGRARIO DE LOS ANTIGUOS (Niveles 70 a 80 - JEFE FINAL SUPREMO 100%)
  // =========================================================================
  {
    id: 'zone_sanctuary',
    name: 'Sagrario de los Antiguos (Torre del Infinito)',
    description: 'Templo celestial de mármol blanco y oro donde aguarda el Creador del Tiempo.',
    themeColor: '#fbbf24',
    bgMusicTheme: 'forest',
    requiredLevel: 70,
    mapWidth: 40,
    mapHeight: 36,
    tileData: buildSanctuaryMap(),
    npcs: [
      {
        id: 'npc_sanctuary_1',
        zoneId: 'zone_sanctuary',
        x: 20,
        y: 20,
        name: 'Ángel Serafín Uriel',
        title: 'Guardián del Sagrario Celestial',
        avatarStyle: 'knight',
        dialogue: [
          'Has alcanzado la cima de toda la creación, Héroe Legendario.',
          'Ante ti descansa el Altar de Cronos, el Creador del Tiempo. Derrotarlo te consagrará en el 100% absoluto de la historia.'
        ],
        tip: '💡 CONSEJO DIVINO: Usa tus habilidades de Nivel 70 y 80 con pociones de elixir completo.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_main_sanctuary_1'),
      },
    ],
    enemies: [
      {
        name: 'Centinela Celestial',
        isBoss: false,
        hp: 1800,
        maxHp: 1800,
        attack: 260,
        defense: 140,
        speed: 62,
        expReward: 1500,
        goldReward: 500,
        spriteType: 'seraph_guard',
        color: '#fde047',
        zoneId: 'zone_sanctuary',
        description: 'Guardián dorado inmortal con armadura de luz pura.',
      },
      {
        name: 'Querubín de Juicio',
        isBoss: false,
        hp: 2100,
        maxHp: 2100,
        attack: 290,
        defense: 155,
        speed: 68,
        expReward: 1900,
        goldReward: 650,
        spriteType: 'cherub_arbiter',
        color: '#eab308',
        zoneId: 'zone_sanctuary',
        description: 'Entidad angélica que juzga el alma de los mortales.',
      },
    ],
    boss: {
      name: 'Dios Primigenio Cronos',
      isBoss: true,
      hp: 7500,
      maxHp: 7500,
      attack: 380,
      defense: 220,
      speed: 75,
      expReward: 15000,
      goldReward: 10000,
      spriteType: 'boss_ancient',
      color: '#ca8a04',
      specialSkills: [
        { name: 'Colapso del Tiempo y Espacio', power: 3.6, element: 'holy' },
        { name: 'Juicio Divino de la Creación', power: 3.0, element: 'magic' },
      ],
      zoneId: 'zone_sanctuary',
      description: 'La deidad primordial que tejió el tejido del universo y del tiempo en Aethelgard.',
    },
  },
];
