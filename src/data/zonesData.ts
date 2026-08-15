import { Zone } from '../types';
import { ALL_GAME_QUESTS } from './questsData';
import {
  generateForest400,
  generateCave400,
  generateSwamp400,
  generateVolcano400,
  generateTundra400,
  generateCastle400,
  generateVoid400,
  generatePantheon400,
  MAP_SIZE,
} from './worldMapGenerator400';

// ==============================================================================
// 🗺️ GENERACIÓN DE MAPAS MASIVOS DE 400x400 (160.000 BALDOSAS)
// ==============================================================================

const forestWorld = generateForest400();
const caveWorld = generateCave400();
const swampWorld = generateSwamp400();
const volcanoWorld = generateVolcano400();
const tundraWorld = generateTundra400();
const castleWorld = generateCastle400();
const voidWorld = generateVoid400();
const pantheonWorld = generatePantheon400();

// ==============================================================================
// 🌟 CONFIGURACIÓN COMPLETA DE LAS 8 REGIONES DE AETHELGARD (400x400)
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
    mapWidth: MAP_SIZE,
    mapHeight: MAP_SIZE,
    tileData: forestWorld.tileData,
    npcs: [
      {
        id: 'npc_forest_1',
        zoneId: 'zone_forest',
        x: 87,
        y: 84,
        name: 'Anciano Eldrin',
        title: 'Sabio de la Aldea de Roble',
        avatarStyle: 'elder',
        dialogue: [
          '¡Bienvenido a las inmensas Tierras de Aethelgard, joven héroe! Descansa en la taberna y visita la forja antes de emprender viaje.',
          'La corrupción del Gran Rey Slime amenaza con devorar los cuatro cuadrantes del reino.',
          'Habla con los aldeanos, artesanos y druidas para descubrir secretos y pertrecharte adecuadamente.'
        ],
        tip: '💡 CONSEJO DE SABIDURÍA: Las criaturas tipo Slime sufren un 50% más de daño cuando usas habilidades de elemento Fuego.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_main_forest_3'),
      },
      {
        id: 'npc_forest_2',
        zoneId: 'zone_forest',
        x: 95,
        y: 78,
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
        x: 75,
        y: 92,
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
      {
        id: 'npc_forest_4',
        zoneId: 'zone_forest',
        x: 195,
        y: 60,
        name: 'Thorne el Guardabosques',
        title: 'Vigilante del Gran Río',
        avatarStyle: 'knight',
        dialogue: [
          'Más allá de este puente oriental, los bosques se vuelven salvajes y peligrosos.',
          'Los slimes gigantes y lobos salvajes merodean por los senderos hacia las ruinas.'
        ],
        tip: '💡 CONSEJO DE COMBATE: Usa pociones de maná antes de que se agote para mantener tus artes activas.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_main_forest_1'),
      },
      {
        id: 'npc_forest_5',
        zoneId: 'zone_forest',
        x: 312,
        y: 240,
        name: 'Druida Elenor',
        title: 'Guardiana del Lago Sagrado',
        avatarStyle: 'wizard',
        dialogue: [
          'Las aguas del lago sagrado purifican toda maldición.',
          'El Gran Rey Slime aguarda en su altar milenario en el extremo noreste de este bosque.'
        ],
        tip: '💡 CONSEJO DEL LAGO: Este santuario concede bendiciones permanentes de maná.',
        quest: ALL_GAME_QUESTS.find((q) => q.id === 'q_side_forest_2'),
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
        goldReward: 3,
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
        goldReward: 4,
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
        goldReward: 6,
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
      goldReward: 50,
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
    mapWidth: MAP_SIZE,
    mapHeight: MAP_SIZE,
    tileData: caveWorld.tileData,
    npcs: [
      {
        id: 'npc_cave_1',
        zoneId: 'zone_cave',
        x: 75,
        y: 78,
        name: 'Capataz Durin',
        title: 'Líder de la Expedición Minera',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡Cuidado con las estalagmitas! Las criaturas rocosas se han despertado con la energía oscura del Gólem.',
          'Nuestras vagonetas quedaron atrapadas cerca del gran lago subterráneo de cristal.'
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
        goldReward: 8,
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
        goldReward: 14,
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
      goldReward: 130,
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
    mapWidth: MAP_SIZE,
    mapHeight: MAP_SIZE,
    tileData: swampWorld.tileData,
    npcs: [
      {
        id: 'npc_swamp_1',
        zoneId: 'zone_swamp',
        x: 75,
        y: 78,
        name: 'Morgana la Alquimista',
        title: 'Bruja de la Niebla de Vael',
        avatarStyle: 'wizard',
        dialogue: [
          'Las aguas están cargadas de toxinas milenarias. Lleva siempre antídotos y pociones restauradoras.',
          'La Reina Serpiente acecha en su nido en el extremo suroriental de estas ciénagas.'
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
        goldReward: 18,
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
        goldReward: 22,
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
      goldReward: 220,
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
    mapWidth: MAP_SIZE,
    mapHeight: MAP_SIZE,
    tileData: volcanoWorld.tileData,
    npcs: [
      {
        id: 'npc_volcano_1',
        zoneId: 'zone_volcano',
        x: 75,
        y: 78,
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
        goldReward: 32,
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
        goldReward: 42,
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
      goldReward: 420,
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
    mapWidth: MAP_SIZE,
    mapHeight: MAP_SIZE,
    tileData: tundraWorld.tileData,
    npcs: [
      {
        id: 'npc_tundra_1',
        zoneId: 'zone_tundra',
        x: 75,
        y: 78,
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
        goldReward: 52,
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
        goldReward: 68,
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
      goldReward: 650,
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
    mapWidth: MAP_SIZE,
    mapHeight: MAP_SIZE,
    tileData: castleWorld.tileData,
    npcs: [
      {
        id: 'npc_castle_1',
        zoneId: 'zone_castle',
        x: 75,
        y: 80,
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
        goldReward: 85,
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
        goldReward: 105,
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
      goldReward: 950,
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
    mapWidth: MAP_SIZE,
    mapHeight: MAP_SIZE,
    tileData: voidWorld.tileData,
    npcs: [
      {
        id: 'npc_void_1',
        zoneId: 'zone_void',
        x: 75,
        y: 78,
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
        goldReward: 140,
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
        goldReward: 175,
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
      goldReward: 1600,
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
    mapWidth: MAP_SIZE,
    mapHeight: MAP_SIZE,
    tileData: pantheonWorld.tileData,
    npcs: [
      {
        id: 'npc_sanctuary_1',
        zoneId: 'zone_sanctuary',
        x: 200,
        y: 320,
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
        goldReward: 240,
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
        goldReward: 310,
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
      goldReward: 4000,
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

export function isZoneUnlocked(zoneId: string, defeatedBosses: string[]): boolean {
  const zoneIndex = ZONES.findIndex((z) => z.id === zoneId);
  if (zoneIndex <= 0) return true; // Zona inicial siempre desbloqueada
  const previousZone = ZONES[zoneIndex - 1];
  return defeatedBosses.includes(previousZone.boss.name);
}

export function areZoneMainQuestsCompleted(
  zoneId: string,
  completedQuests: string[]
): { isUnlocked: boolean; pendingQuests: any[] } {
  const mainQuestsInZone = ALL_GAME_QUESTS.filter(
    (q) => q.zoneId === zoneId && q.category === 'main' && q.targetType !== 'defeat_boss'
  );

  const pending = mainQuestsInZone.filter((q) => !completedQuests.includes(q.id));
  return {
    isUnlocked: pending.length === 0,
    pendingQuests: pending,
  };
}

export function getZoneRequirementMessage(zoneId: string): string {
  const zoneIndex = ZONES.findIndex((z) => z.id === zoneId);
  if (zoneIndex <= 0) return 'Zona inicial desbloqueada.';
  const previousZone = ZONES[zoneIndex - 1];
  return `🔒 Requiere derrotar al Jefe Supremo de "${previousZone.name}" (${previousZone.boss.name}).`;
}
