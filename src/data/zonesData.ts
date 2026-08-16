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
        x: 310,
        y: 236,
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
      {
        id: 'npc_forest_farmer',
        zoneId: 'zone_forest',
        x: 35,
        y: 35,
        name: 'Granjero Barnaby',
        title: 'Maestro de los Campos Dorados',
        avatarStyle: 'scout',
        dialogue: [
          '¡Bienvenido a la Granja Real del Noroeste! Nuestros molinos de viento procesan el mejor trigo del reino.',
          'Si exploras los campos, encontrarás cofres ocultos entre las cosechas y pozos de agua fresca.'
        ],
        tip: '💡 CONSEJO DE GRANJA: Los molinos de viento son puntos de referencia visibles en el minimapa.',
      },
      {
        id: 'npc_forest_hunter',
        zoneId: 'zone_forest',
        x: 45,
        y: 335,
        name: 'Cazador Silas',
        title: 'Líder del Campamento Forestal',
        avatarStyle: 'scout',
        dialogue: [
          'Este es el campamento de cazadores y druidas del Suroeste. Mantente cerca de las fogatas por la noche.',
          'Hacia el Este se extienden las Tierras Calcinadas donde habitan bestias alfa extremadamente peligrosas.'
        ],
        tip: '💡 CONSEJO DE CAZA: En las Tierras Calcinadas encontrarás cofres dorados custodiados por fuego.',
      },
      {
        id: 'npc_forest_fisherman',
        zoneId: 'zone_forest',
        x: 248,
        y: 235,
        name: 'Capitán Finn',
        title: 'Pescador Mayor de los Muelles',
        avatarStyle: 'scout',
        dialogue: [
          '¡Ah del barco, aventurero! Los muelles del este están conectados con la Isla del Lago Sagrado.',
          'Cruza el puente de piedra central para visitar el templo de la Druida Elenor.'
        ],
        tip: '💡 CONSEJO DE PUERTO: Los tablones de madera te permiten caminar sobre el agua con seguridad.',
      },
      {
        id: 'npc_forest_gravedigger',
        zoneId: 'zone_forest',
        x: 150,
        y: 300,
        name: 'Enterrador Mortis',
        title: 'Custodio de la Cripta de los Reyes',
        avatarStyle: 'blacksmith',
        dialogue: [
          'Pisas el suelo sagrado del Cementerio Antiguo. Los antiguos monarcas descansan en estos mausoleos.',
          'Los ladrones de tumbas suelen dejar cofres con reliquias entre las lápidas de piedra.'
        ],
        tip: '💡 CONSEJO DE CRIPTA: En los cementerios antiguos las magias Sagradas de Luz causan daño crítico masivo.',
      },
      {
        id: 'npc_forest_waterfall',
        zoneId: 'zone_forest',
        x: 175,
        y: 20,
        name: 'Explorador Torvald',
        title: 'Vigía de las Cascadas del Norte',
        avatarStyle: 'scout',
        dialogue: [
          '¡El aire aquí arriba es puro y revitalizante! Desde este mirador se domina todo el curso del Gran Río de Aethelgard.',
          'Las aguas nacen en los glaciares del norte y alimentan todas las aldeas del reino.'
        ],
        tip: '💡 CONSEJO DE VIGÍA: Descansar junto a las fogatas restaura tu espíritu antes de largas expediciones.',
      },
      {
        id: 'npc_forest_lumberjack',
        zoneId: 'zone_forest',
        x: 260,
        y: 20,
        name: 'Leñador Gunnar',
        title: 'Maestro del Aserradero Norteño',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡Hola, viajero! Cortamos robles ancestrales para reforzar los puentes y murallas de la capital.',
          'Cuidado si sigues hacia el este: los trasgos merodean cerca de las ruinas del jefe.'
        ],
        tip: '💡 CONSEJO DE MADERA: Los almacenes de leña suelen esconder cofres con provisiones útiles.',
      },
      {
        id: 'npc_forest_hermit',
        zoneId: 'zone_forest',
        x: 125,
        y: 38,
        name: 'Ermitaño Oakhaven',
        title: 'Sabio de las Flores Silvestres',
        avatarStyle: 'wizard',
        dialogue: [
          'Pocos aventureros encuentran este sendero floral entre la granja y la capital.',
          'Las flores de este claro poseen esencias calmantes que ahuyentan a las fieras salvajes.'
        ],
        tip: '💡 CONSEJO FLORAL: Los parterres de flores marcan zonas seguras libres de emboscadas enemigas.',
      },
      {
        id: 'npc_forest_grovelady',
        zoneId: 'zone_forest',
        x: 28,
        y: 140,
        name: 'Anciana Maeve',
        title: 'Matriarca de la Arboleda Vieja',
        avatarStyle: 'elder',
        dialogue: [
          'Nuestra aldea occidental es pacífica y antigua. Vivimos en armonía con los espíritus del bosque.',
          'Bebe agua de nuestro pozo comunal para seguir tu camino con energía renovada.'
        ],
        tip: '💡 CONSEJO DE ALDEA: Cada pueblo del reino cuenta con fuentes y pozos gratuitos para curarte.',
      },
      {
        id: 'npc_forest_instructor',
        zoneId: 'zone_forest',
        x: 70,
        y: 148,
        name: 'Instructor Vaelen',
        title: 'Capitán de Instrucción de la Guardia',
        avatarStyle: 'knight',
        dialogue: [
          '¡Firmeza en la empuñadura y vista al blanco! Aquí entrenamos a los nuevos reclutas del rey.',
          'Un buen guerrero practica sus artes de combate antes de adentrarse en territorio hostil.'
        ],
        tip: '💡 CONSEJO DE INSTRUCCIÓN: Combina ataques físicos y mágicos para vencer las defensas de los monstruos.',
      },
      {
        id: 'npc_forest_scoutleader',
        zoneId: 'zone_forest',
        x: 105,
        y: 175,
        name: 'Capitana Kaelen',
        title: 'Líder de Batidores de la Arboleda',
        avatarStyle: 'scout',
        dialogue: [
          'Patrullamos este corredor central para mantener los caminos despejados de bandidos y lobos.',
          'Si sigues el camino de piedra hacia el este, llegarás al Gran Parque Real.'
        ],
        tip: '💡 CONSEJO DE BATIDOR: Las carreteras adoquinadas te permiten orientarte con facilidad en el mapa.',
      },
      {
        id: 'npc_forest_ferryman',
        zoneId: 'zone_forest',
        x: 188,
        y: 118,
        name: 'Barquero Charon',
        title: 'Guardián del Embarcadero Fluvial',
        avatarStyle: 'scout',
        dialogue: [
          '¡Bienvenido al meandro central del río! Los muelles de madera resisten las corrientes más bravas.',
          'Nuestras redes a menudo recogen cofres y tesoros arrastrados por las aguas.'
        ],
        tip: '💡 CONSEJO FLUVIAL: Los muelles de madera te permiten cruzar sobre aguas profundas.',
      },
      {
        id: 'npc_forest_gatherer',
        zoneId: 'zone_forest',
        x: 260,
        y: 105,
        name: 'Recolectora Liora',
        title: 'Hortelana de la Fruta Silvestre',
        avatarStyle: 'wizard',
        dialogue: [
          '¡Nuestros huertos producen las bayas y manzanas más dulces de todo el continente!',
          'Hacia el sur verás los grandes muelles del lago y la isla mística.'
        ],
        tip: '💡 CONSEJO DE HUERTO: Los alimentos y pociones son vitales para aguantar los combates de jefes.',
      },
      {
        id: 'npc_forest_merchant',
        zoneId: 'zone_forest',
        x: 345,
        y: 148,
        name: 'Mercader Darius',
        title: 'Comerciante del Asentamiento Este',
        avatarStyle: 'scout',
        dialogue: [
          '¡Saludos, distinguido cliente! Este asentamiento oriental es la última parada antes de las tierras salvajes.',
          'Aquí acuden los viajeros a pertrecharse antes de retar a los monstruos del cuadrante este.'
        ],
        tip: '💡 CONSEJO COMERCIAL: Guardar oro te permitirá comprar armaduras y espadas superiores en la tienda.',
      },
      {
        id: 'npc_forest_stonemason',
        zoneId: 'zone_forest',
        x: 55,
        y: 215,
        name: 'Maestro Cantero Brann',
        title: 'Jefe de la Cantera Occidental',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡De esta cantera se extrajeron las piedras que construyeron las murallas de la capital!',
          'En nuestra forja pequeña templamos picos y herramientas resistentes como el diamante.'
        ],
        tip: '💡 CONSEJO DE CANTERA: Las zonas con forjas son ideales para reparar tu equipamiento.',
      },
      {
        id: 'npc_forest_bard_river',
        zoneId: 'zone_forest',
        x: 175,
        y: 215,
        name: 'Juglar Lysander',
        title: 'Trovador del Mirador del Río',
        avatarStyle: 'scout',
        dialogue: [
          '🎵 "Bajo la luna plateada, las aguas del río cantan la balada del héroe prometido..." 🎵',
          '¡Toma asiento en este merendero floral y disfruta de la brisa del agua cristalina!'
        ],
        tip: '💡 CONSEJO DE JUGAR: La música y las historias aumentan la puntuación y el rango de tu héroe.',
      },
      {
        id: 'npc_forest_alchemist',
        zoneId: 'zone_forest',
        x: 112,
        y: 250,
        name: 'Alquimista Selene',
        title: 'Erudita del Jardín Místico',
        avatarStyle: 'wizard',
        dialogue: [
          'Este círculo de menhires canaliza la energía telúrica de la tierra.',
          'Las flores mágicas que crecen aquí se utilizan para preparar los elixires más poderosos.'
        ],
        tip: '💡 CONSEJO ALQUÍMICO: Visita el Santuario Místico para recibir bendiciones mágicas.',
      },
      {
        id: 'npc_forest_southguard',
        zoneId: 'zone_forest',
        x: 115,
        y: 355,
        name: 'Centinela Rorik',
        title: 'Guardián del Paso Fronterizo Sur',
        avatarStyle: 'knight',
        dialogue: [
          '¡Alto en nombre del reino! Este puesto protege el paso meridional frente a las criaturas de las ciénagas.',
          'Mantén tu espada afilada si te adentras en los bosques del sur.'
        ],
        tip: '💡 CONSEJO FRONTERIZO: Los puestos de avanzada cuentan con cofres de armamento de emergencia.',
      },
      {
        id: 'npc_forest_miller',
        zoneId: 'zone_forest',
        x: 235,
        y: 355,
        name: 'Molinero Tobías',
        title: 'Custodio del Molino Fluvial Sur',
        avatarStyle: 'scout',
        dialogue: [
          'La fuerza de las corrientes fluviales mueve la gran rueda de nuestro molino día y noche.',
          'Al este de aquí verás el campamento de exploradores que vigila la frontera de las tierras calcinadas.'
        ],
        tip: '💡 CONSEJO DE MOLINO: Los molinos fluviales aprovechan el agua para generar harina y suministros.',
      },
      {
        id: 'npc_forest_explorer',
        zoneId: 'zone_forest',
        x: 340,
        y: 372,
        name: 'Explorador Bran',
        title: 'Vigía de las Tierras Calcinadas',
        avatarStyle: 'scout',
        dialogue: [
          '¡Cuidado si das un paso más hacia el norte! Las Tierras Calcinadas están llenas de fuego y bestias élite.',
          'Solo los guerreros más experimentados se atreven a reclamar los cofres de la bestia.'
        ],
        tip: '💡 CONSEJO DE EXPEDICIÓN: Equípate con armas de elemento Hielo o Agua para enfrentarte al fuego élite.',
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
      {
        id: 'npc_cave_miner_emerald',
        zoneId: 'zone_cave',
        x: 38,
        y: 24,
        name: 'Minero Galdor',
        title: 'Prospector de Esmeraldas',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡Mira cómo brillan estas vetas verdes entre el musgo fosforescente!',
          'Estas esmeraldas se forman por la presión de miles de toneladas de roca sobre el techo de la cueva.'
        ],
        tip: '💡 CONSEJO DE CRISTAL: Los cristales esmeralda potencian las artes curativas de viento y tierra.',
      },
      {
        id: 'npc_cave_machinist',
        zoneId: 'zone_cave',
        x: 95,
        y: 24,
        name: 'Maquinista Flint',
        title: 'Ingeniero de Vagonetas de Riel',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡Mis raíles conectan todos los cuadrantes mineros de Eridu!',
          'Si sigues las vías hacia el este, llegarás a la Forja de Gemas y a las estalagmitas gigantes.'
        ],
        tip: '💡 CONSEJO DE RIELES: Los rieles te indican los túneles seguros que evitan desprendimientos.',
      },
      {
        id: 'npc_cave_gemologist',
        zoneId: 'zone_cave',
        x: 138,
        y: 28,
        name: 'Gemólogo Bori',
        title: 'Tallador de Rubíes Subterráneos',
        avatarStyle: 'wizard',
        dialogue: [
          'El calor de los túneles de venteo permite fundir y tallar gemas con una pureza inigualable.',
          'Nuestras forjas no usan leña, sino calor geotérmico de la roca viva.'
        ],
        tip: '💡 CONSEJO DE GEMAS: Engarzar rubíes en tus armas añade daño de Fuego adicional.',
      },
      {
        id: 'npc_cave_cryptkeeper',
        zoneId: 'zone_cave',
        x: 325,
        y: 30,
        name: 'Custodio Dwalin',
        title: 'Guardián de la Cripta de Mithril',
        avatarStyle: 'elder',
        dialogue: [
          'En estas tumbas de piedra descansan los primeros reyes enanos que excavaron Eridu.',
          'Que tus pisadas sean silenciosas; los murciélagos espectrales anidan en las bóvedas altas.'
        ],
        tip: '💡 CONSEJO DE MITHRIL: Las armaduras de mithril reducen a la mitad el daño de ataques físicos pesados.',
      },
      {
        id: 'npc_cave_mushroom_hermit',
        zoneId: 'zone_cave',
        x: 185,
        y: 105,
        name: 'Ermitaño Gribble',
        title: 'Sabio de los Hongos Luminiscentes',
        avatarStyle: 'wizard',
        dialogue: [
          '¡Shhh! Las esporas azules están cantando... ¡la luz de los hongos guía a las almas perdidas en la oscuridad!',
          'Come un poco de espora azul y tu maná fluirá como el agua de los manantiales subterráneos.'
        ],
        tip: '💡 CONSEJO FÚNGICO: La Caverna de Hongos es un santuario natural que restaura tus energías.',
      },
      {
        id: 'npc_cave_goldforeman',
        zoneId: 'zone_cave',
        x: 260,
        y: 105,
        name: 'Capataz Thrain',
        title: 'Jefe del Filón Dorado',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡Pico y pala sin parar! Este filón de oro abastece a todo el Reino de Aethelgard.',
          'Cuidado si vas más al este: hay nidos de murciélagos voraces merodeando en las ruinas oscuras.'
        ],
        tip: '💡 CONSEJO AURÍFERO: Los cofres mineros cercanos al filón contienen sacos abundantes de oro.',
      },
      {
        id: 'npc_cave_stonemason',
        zoneId: 'zone_cave',
        x: 40,
        y: 175,
        name: 'Cantero Balin',
        title: 'Maestro del Granito Cavernoso',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡El granito de estas paredes es tan duro que resiste hasta los golpes del Gólem de Piedra!',
          'Tallamos los bloques que sostienen las bóvedas de la Ciudad Enana.'
        ],
        tip: '💡 CONSEJO DE CANTERÍA: Los escudos pesados de granito aumentan en un 40% tu bloqueo.',
      },
      {
        id: 'npc_cave_alchemist',
        zoneId: 'zone_cave',
        x: 115,
        y: 185,
        name: 'Alquimista Ruby',
        title: 'Erudita de la Cristalografía',
        avatarStyle: 'wizard',
        dialogue: [
          'Muelo polvo de cristal azul del lago para preparar pociones de concentración pura.',
          'Si bebes de nuestro pozo alquímico, tus sentidos se agudizarán en la oscuridad.'
        ],
        tip: '💡 CONSEJO ALQUÍMICO: Las pociones de maná mayor te permiten lanzar hasta 4 artes mágicas seguidas.',
      },
      {
        id: 'npc_cave_lake_fisherman',
        zoneId: 'zone_cave',
        x: 265,
        y: 185,
        name: 'Pescador Nori',
        title: 'Navegante del Lago de Cristal',
        avatarStyle: 'scout',
        dialogue: [
          '¡Ah del lago! Las aguas de cristal son tan transparentes que puedes ver el fondo a cien metros de profundidad.',
          'Cruza los muelles de madera para llegar a las Cámaras de Geodas de Amatista.'
        ],
        tip: '💡 CONSEJO DEL LAGO: Los peces de cristal restauran salud instantáneamente sin consumir turnos de combate.',
      },
      {
        id: 'npc_cave_thermal_keeper',
        zoneId: 'zone_cave',
        x: 180,
        y: 270,
        name: 'Sanadora Freya',
        title: 'Guardiana de las Fuentes Termales',
        avatarStyle: 'wizard',
        dialogue: [
          'Siente los vapores minerales... estas aguas cálidas disuelven la fatiga de las batallas más duras.',
          'El Santuario Termal bendice a todo aventurero que se sumerja con humildad.'
        ],
        tip: '💡 CONSEJO TERMAL: Bañarse en las aguas termales otorga regeneración pasiva de vida durante 5 combates.',
      },
      {
        id: 'npc_cave_trog_hunter',
        zoneId: 'zone_cave',
        x: 260,
        y: 265,
        name: 'Cazador Gimli',
        title: 'Líder del Campamento de las Profundidades',
        avatarStyle: 'scout',
        dialogue: [
          'Mantenemos la fogata bien alta para que las bestias de roca no se acerquen al campamento.',
          'Hacia el este se encuentra la Guarida Maldita del Gólem de Obsidiana... no vayas solo ni desarmado.'
        ],
        tip: '💡 CONSEJO DE CAZA: Equipa habilidades rompe-armaduras antes de desafiar al jefe colosal.',
      },
      {
        id: 'npc_cave_pump_engineer',
        zoneId: 'zone_cave',
        x: 115,
        y: 330,
        name: 'Ingeniero Kili',
        title: 'Operador de las Bombas de Presión',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡Estas bombas impiden que las aguas subterráneas inunden los túneles inferiores de Eridu!',
          'Engrasamos los grandes pistones y engranajes de bronce todos los días.'
        ],
        tip: '💡 CONSEJO DE INGENIERÍA: Las cámaras con maquinaria enana albergan cofres con piezas y planos únicos.',
      },
      {
        id: 'npc_cave_deep_merchant',
        zoneId: 'zone_cave',
        x: 255,
        y: 325,
        name: 'Joyero Thorin',
        title: 'Mercader de Adamantio y Joyas',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡Compro pepitas y gemas preciosas al mejor precio de todas las minas!',
          'En nuestras forjas profundas trabajamos el codiciado adamantio, el metal de los dioses.'
        ],
        tip: '💡 CONSEJO DE ADAMANTIO: Las armas de adamantio ignoran un 30% de la armadura enemiga.',
      },
      {
        id: 'npc_cave_blaster',
        zoneId: 'zone_cave',
        x: 45,
        y: 372,
        name: 'Barrenista Bomba-Boom',
        title: 'Maestro de Explosivos del Polvorín',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡Tres, dos, uno... BOOM! ¡Nada como la dinamita enana para abrir túneles en la roca viva!',
          'Cuidado con las chispas cerca de los barriles de pólvora negra.'
        ],
        tip: '💡 CONSEJO DE EXPLOSIVOS: Las bombas de mano aturden a grupos enteros de enemigos durante 1 turno.',
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
      {
        id: 'npc_swamp_scout_high',
        zoneId: 'zone_swamp',
        x: 35,
        y: 30,
        name: 'Explorador Corvus',
        title: 'Vigía de las Ciénagas Altas',
        avatarStyle: 'scout',
        dialogue: [
          'Desde esta plataforma elevada se divisa la espesa niebla tóxica que cubre el valle.',
          'Camina siempre por las pasarelas de madera: el fango profundo atrapa y devora a los incautos.'
        ],
        tip: '💡 CONSEJO DE PASARELAS: Las tablas de madera te aíslan del daño por ácido de las aguas estancadas.',
      },
      {
        id: 'npc_swamp_stilt_hermit',
        zoneId: 'zone_swamp',
        x: 160,
        y: 25,
        name: 'Ermitaño Bogdan',
        title: 'Guardián de la Calzada de Palafitos',
        avatarStyle: 'elder',
        dialogue: [
          'Llevo cincuenta años viviendo sobre estas estacas de roble pantanoso.',
          'Nuestras casas flotantes resisten las crecidas de las aguas venenosas en época de lluvias.'
        ],
        tip: '💡 CONSEJO LACUSTRE: En los palafitos del norte encontrarás pozos de agua pura purificada.',
      },
      {
        id: 'npc_swamp_witch_morgana_hut',
        zoneId: 'zone_swamp',
        x: 245,
        y: 88,
        name: 'Bruja Baba Yuliana',
        title: 'Boticaria del Caldero Verde',
        avatarStyle: 'wizard',
        dialogue: [
          '¡Ji, ji, ji! Remuevo ojos de serpiente y raíces de sauce para crear los mejores antídotos de Vael.',
          'Toma un trago de mi pócima humeante y no temerás a las toxinas de la Gorgona.'
        ],
        tip: '💡 CONSEJO BOTICARIO: Los fuegos verdes ahuyentan a las serpientes e insectos del pantano.',
      },
      {
        id: 'npc_swamp_eel_fisherman',
        zoneId: 'zone_swamp',
        x: 285,
        y: 120,
        name: 'Pescador Silas',
        title: 'Patrón de los Muelles de Anguilas',
        avatarStyle: 'scout',
        dialogue: [
          '¡Las anguilas eléctricas de este lago producen una carne deliciosa si sabes limpiarlas sin electrocutarte!',
          'Hacia el sur verás la gran Isla de los Sauces Sagrados.'
        ],
        tip: '💡 CONSEJO PESQUERO: Los muelles de madera te permiten navegar y pescar en aguas tóxicas sin riesgo.',
      },
      {
        id: 'npc_swamp_village_chief',
        zoneId: 'zone_swamp',
        x: 68,
        y: 185,
        name: 'Jefa Nimue',
        title: 'Matriarca de la Aldea de Vael',
        avatarStyle: 'wizard',
        dialogue: [
          '¡Bienvenido a la Gran Aldea de Vael! Nuestro pueblo es el refugio más seguro en todo el pantano.',
          'Visita nuestra forja de bronce y descansa en la Taberna del Fango antes de tu viaje.'
        ],
        tip: '💡 CONSEJO DE ALDEA: Las armas de bronce forjadas con calor del pantano poseen afinidad de Veneno.',
      },
      {
        id: 'npc_swamp_blacksmith',
        zoneId: 'zone_swamp',
        x: 85,
        y: 185,
        name: 'Herrero Torgar',
        title: 'Forjador del Bronce Pantanoso',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡El bronce de ciénaga se templa con lodo rico en azufre! El filo nunca se desafila ni se oxida.',
          'Si me traes escamas de basilisco, forjaré una cota impenetrable.'
        ],
        tip: '💡 CONSEJO DE FORJA: Las cotas de escamas de reptil confieren inmunidad total al veneno.',
      },
      {
        id: 'npc_swamp_druid_island',
        zoneId: 'zone_swamp',
        x: 190,
        y: 185,
        name: 'Druida Elara',
        title: 'Custodia de los Sauces Sagrados',
        avatarStyle: 'wizard',
        dialogue: [
          'Los sauces llorones absorben el veneno del suelo y lo transforman en savia de luz.',
          'El Santuario Espectral de este islote otorga bendiciones de regeneración de maná permanente.'
        ],
        tip: '💡 CONSEJO DRUÍDICO: Meditar en el santuario de la isla aumenta tu afinidad elemental un 25%.',
      },
      {
        id: 'npc_swamp_basilisk_hunter',
        zoneId: 'zone_swamp',
        x: 265,
        y: 175,
        name: 'Cazador Drake',
        title: 'Rastreador de Basiliscos',
        avatarStyle: 'knight',
        dialogue: [
          '¡Nunca mires fijamente a los ojos de un basilisco o la Gorgona! Su mirada petrifica en un instante.',
          'Llevamos antorchas encendidas para deslumbrar a los reptiles de las ciénagas.'
        ],
        tip: '💡 CONSEJO DE CAZA: Equipa escudos pulidos para reflejar el rayo de petrificación de la Gorgona.',
      },
      {
        id: 'npc_swamp_tar_gatherer',
        zoneId: 'zone_swamp',
        x: 330,
        y: 165,
        name: 'Recolector Jarek',
        title: 'Maestro de la Brea y Turba',
        avatarStyle: 'blacksmith',
        dialogue: [
          'La brea del pantano se usa para calafatear barcos e impermeabilizar las casas de madera.',
          'También es un combustible excelente que arde incluso bajo la lluvia torrencial.'
        ],
        tip: '💡 CONSEJO DE BREA: Las bombas de brea prenden fuego prolongado sobre los monstruos acuáticos.',
      },
      {
        id: 'npc_swamp_watchman',
        zoneId: 'zone_swamp',
        x: 375,
        y: 185,
        name: 'Vigía Valen',
        title: 'Centinela del Horizonte Tóxico',
        avatarStyle: 'scout',
        dialogue: [
          '¡Mantente alerta! Al este de esta atalaya las aguas hierven con gases pútridos.',
          'Solo los guerreros con protecciones mágicas se adentran más allá de este punto.'
        ],
        tip: '💡 CONSEJO DE ATALAYA: Los puestos fronterizos marcan los límites del mapa explorable.',
      },
      {
        id: 'npc_swamp_herbalist',
        zoneId: 'zone_swamp',
        x: 125,
        y: 240,
        name: 'Botánica Mirabel',
        title: 'Cultivadora del Huerto Flotante',
        avatarStyle: 'wizard',
        dialogue: [
          'Cultivo raíces de loto negro en estas parcelas de agua. Sus extractos curan las fiebres del pantano.',
          'El suelo húmedo produce cosechas fértiles durante todo el año.'
        ],
        tip: '💡 CONSEJO BOTÁNICO: Las hierbas de loto negro restauran 150 puntos de salud de golpe.',
      },
      {
        id: 'npc_swamp_poacher',
        zoneId: 'zone_swamp',
        x: 205,
        y: 270,
        name: 'Furtivo Vane',
        title: 'Cazador de Sombras',
        avatarStyle: 'scout',
        dialogue: [
          'Oculto mi cabaña entre los cañaverales. Nadie me molesta aquí.',
          'He dejado varios cofres de provisiones escondidos cerca de la Necrópolis... si eres valiente, ve a buscarlos.'
        ],
        tip: '💡 CONSEJO FURTIVO: Las trampas de caza inmovilizan a los enemigos rápidos durante el primer turno.',
      },
      {
        id: 'npc_swamp_necro_crypt',
        zoneId: 'zone_swamp',
        x: 290,
        y: 290,
        name: 'Custodio Malakor',
        title: 'Guardián de la Necrópolis Sumergida',
        avatarStyle: 'wizard',
        dialogue: [
          'Pisas las criptas anegadas de la antigua dinastía de Vael. Las almas errantes flotan sobre el fango.',
          'Los cuatro cofres malditos contienen reliquias arcanas custodiadas por fuegos fatuos.'
        ],
        tip: '💡 CONSEJO DE NECRÓPOLIS: Los ataques de elemento Sagrado o Fuego causan daño x2 a los muertos vivientes.',
      },
      {
        id: 'npc_swamp_canoeman',
        zoneId: 'zone_swamp',
        x: 85,
        y: 370,
        name: 'Canotero Charon Jr.',
        title: 'Barquero de Aguas Negras',
        avatarStyle: 'scout',
        dialogue: [
          '¡Suban a bordo! Mis canoas de cedro navegan por los canales más oscuros del sur.',
          'Al este verás el Santuario de las Brumas Eternas, un lugar de paz y bendición en medio de la podredumbre.'
        ],
        tip: '💡 CONSEJO DE CANOA: Las fogatas junto al embarcadero restauran todo tu maná de forma gratuita.',
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
      {
        id: 'npc_volcano_crater_scout',
        zoneId: 'zone_volcano',
        x: 35,
        y: 30,
        name: 'Vigía Kael',
        title: 'Observador del Cráter Superior',
        avatarStyle: 'scout',
        dialogue: [
          '¡El humo del cráter arde con fuerza hoy! El río de lava corre directamente hacia la Gran Calzada.',
          'Nuestras cabañas de basalto negro están reforzadas para resistir la lluvia de cenizas.'
        ],
        tip: '💡 CONSEJO DE CRÁTER: En los pozos térmicos del norte puedes enfriar y forjar armas incandescentes.',
      },
      {
        id: 'npc_volcano_master_foundry',
        zoneId: 'zone_volcano',
        x: 140,
        y: 25,
        name: 'Maestro Vulkan',
        title: 'Gran Fundidor de Ignis',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡Canalizamos el magma volcánico directamente a través de las calzadas de piedra para alimentar nuestras forjas!',
          'El acero de titanio forjado aquí no se quiebra ni bajo la fuerza de un dragón colosal.'
        ],
        tip: '💡 CONSEJO DE FUNDICIÓN: Las armas de titanio ígneo causan un 40% de daño continuo por quemadura.',
      },
      {
        id: 'npc_volcano_ash_sentinel',
        zoneId: 'zone_volcano',
        x: 365,
        y: 40,
        name: 'Centinela Ragnor',
        title: 'Vigía de las Cenizas Ardientes',
        avatarStyle: 'knight',
        dialogue: [
          'Desde esta atalaya rocosa vigilamos el espacio aéreo del volcán. Los dragones menores surcan los cielos.',
          'Mantén tu escudo arriba; los proyectiles de lava caen sin previo aviso.'
        ],
        tip: '💡 CONSEJO DE VIGÍA: El elemento Hielo ralentiza la velocidad de los monstruos de fuego a la mitad.',
      },
      {
        id: 'npc_volcano_high_blacksmith',
        zoneId: 'zone_volcano',
        x: 70,
        y: 130,
        name: 'Herrero Brann',
        title: 'Armero del Barrio Alto',
        avatarStyle: 'blacksmith',
        dialogue: [
          'Nuestras forjas del oeste templan espadas de magma con una aleación secreta de azufre y obsidiana.',
          'Si sigues la avenida de basalto hacia el sur, llegarás a la Plaza Central y a la Taberna de la Brasa.'
        ],
        tip: '💡 CONSEJO DE AVENIDA: La gran calzada de basalto occidental te permite cruzar el mapa de norte a sur sin pisar lava.',
      },
      {
        id: 'npc_volcano_innkeeper',
        zoneId: 'zone_volcano',
        x: 55,
        y: 220,
        name: 'Tabernero Gorim',
        title: 'Patrón de la Taberna de la Brasa',
        avatarStyle: 'blacksmith',
        dialogue: [
          '¡Pasa y refréscate con un hidromiel helado de montaña! Aquí descansan los aventureros más intrépidos.',
          'Nuestro pozo de agua fría se alimenta de nieves glaciares canalizadas bajo tierra.'
        ],
        tip: '💡 CONSEJO DE TABERNA: El descanso completo en la posada cura todas las quemaduras y restaura 100% de PS.',
      },
      {
        id: 'npc_volcano_obsidian_mason',
        zoneId: 'zone_volcano',
        x: 55,
        y: 320,
        name: 'Cantero Harek',
        title: 'Maestro de la Obsidiana',
        avatarStyle: 'blacksmith',
        dialogue: [
          'La obsidiana es vidrio volcánico afilado como una navaja. Tallamos puntas de flecha y dagas mortíferas.',
          'Los cofres del bastión sur contienen gemas y lingotes preciosos extraídos de la roca fundida.'
        ],
        tip: '💡 CONSEJO DE OBSIDIANA: Las dagas de obsidiana tienen una probabilidad de crítico aumentada en un 35%.',
      },
      {
        id: 'npc_volcano_pyro_alchemist',
        zoneId: 'zone_volcano',
        x: 130,
        y: 130,
        name: 'Alquimista Zarek',
        title: 'Erudito Piroclástico',
        avatarStyle: 'wizard',
        dialogue: [
          'Destilo azufre puro y sales de lava para preparar elixires de inmunidad al fuego.',
          'El Santuario de Fuego Purificador bendice a los guerreros con resistencia piroclástica permanente.'
        ],
        tip: '💡 CONSEJO PIROCLÁSTICO: Las pociones ignífugas absorben el 50% de todo el daño de fuego entrante.',
      },
      {
        id: 'npc_volcano_viaduct_guard',
        zoneId: 'zone_volcano',
        x: 170,
        y: 150,
        name: 'Capitán Torin',
        title: 'Comandante del Gran Viaducto',
        avatarStyle: 'knight',
        dialogue: [
          '¡Este viaducto es la maravilla arquitectónica de los Titanes! Cruza en diagonal sobre el mar de magma ardiente.',
          'Los puestos de control intermedios están equipados con fogatas y cofres de suministros.'
        ],
        tip: '💡 CONSEJO DEL VIADUCTO: El viaducto conecta directamente el norte con el corazón del volcán.',
      },
      {
        id: 'npc_volcano_ruby_gemologist',
        zoneId: 'zone_volcano',
        x: 330,
        y: 160,
        name: 'Gemóloga Pyra',
        title: 'Talladora del Rubí de Sangre',
        avatarStyle: 'wizard',
        dialogue: [
          'En esta cúpula de geodas crecen los rubíes volcánicos más puros de todo el reino.',
          'Las formaciones de cuarzo de fuego amplifican la magia elemental de los hechiceros.'
        ],
        tip: '💡 CONSEJO DE GEMAS: Engarzar rubíes volcánicos añade +30 de ataque de fuego a cualquier arma.',
      },
      {
        id: 'npc_volcano_bridge_sentinel',
        zoneId: 'zone_volcano',
        x: 275,
        y: 225,
        name: 'Centinela Vane',
        title: 'Guardián del Puente de Fuego',
        avatarStyle: 'knight',
        dialogue: [
          '¡Alto! Al sur de este puente se extienden los dominios del Dragón Ignis y sus bestias salamandra.',
          'Asegúrate de llevar pociones de salud abundantes antes de cruzar hacia la caldera.'
        ],
        tip: '💡 CONSEJO DEL PUENTE: Las armas de hielo causan congelación, haciendo perder turnos al enemigo.',
      },
      {
        id: 'npc_volcano_salamander_tamer',
        zoneId: 'zone_volcano',
        x: 150,
        y: 280,
        name: 'Domador Rex',
        title: 'Criador de Salamandras de Magma',
        avatarStyle: 'scout',
        dialogue: [
          'Criamos salamandras gigantes capaces de nadar en lava pura.',
          'Con sus escamas caídas forjamos las corazas más resistentes al fuego del continente.'
        ],
        tip: '💡 CONSEJO DE CRIADOR: Las corazas de salamandra reflejan el 20% del daño recibido hacia el atacante.',
      },
      {
        id: 'npc_volcano_dragon_cryptkeeper',
        zoneId: 'zone_volcano',
        x: 315,
        y: 295,
        name: 'Custodio Ignar',
        title: 'Guardián del Bastión de Dragones',
        avatarStyle: 'elder',
        dialogue: [
          'Aquí reposan los antiguos dragones de los Titanes en la Cripta de Ceniza.',
          'Los tres cofres titánicos contienen armaduras legendarias custodiadas por llamas milenarias.'
        ],
        tip: '💡 CONSEJO DE DRAGONES: Derrotar al Dragón Infernal Ignis abre el portal hacia los Picos Helados de Frostfall.',
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
      {
        id: 'npc_tundra_wind_scout',
        zoneId: 'zone_tundra',
        x: 35,
        y: 30,
        name: 'Explorador Einar',
        title: 'Vigía del Ventisquero Norte',
        avatarStyle: 'scout',
        dialogue: [
          '¡El viento polar azota con fuerza en estas cumbres! Las chimeneas de nuestras cabañas no se apagan nunca.',
          'Si caminas sobre la nieve endurecida podrás evitar las trampas de hielo fino.'
        ],
        tip: '💡 CONSEJO DE VENTISQUERO: Las capas de piel de oso reducen en un 50% el daño por congelación.',
      },
      {
        id: 'npc_tundra_ice_sentinel',
        zoneId: 'zone_tundra',
        x: 365,
        y: 35,
        name: 'Centinela Gunnar',
        title: 'Guardián de los Glaciares Eternos',
        avatarStyle: 'knight',
        dialogue: [
          'Desde esta atalaya vigilo las murallas de la Fortaleza del Titán Ymir.',
          'Solo aquellos armados con llamas vivientes pueden derretir las defensas de escarcha del titán.'
        ],
        tip: '💡 CONSEJO DE FORTALEZA: Las armas imbuidas con fuego rompen los escudos glaciares de Ymir.',
      },
      {
        id: 'npc_tundra_mammoth_hunter',
        zoneId: 'zone_tundra',
        x: 150,
        y: 30,
        name: 'Maestro Cazador Bjorn',
        title: 'Rastreador del Gran Valle Glaciar',
        avatarStyle: 'scout',
        dialogue: [
          '¡Rastreamos mamuts lanudos y lobos del cero absoluto por todo este valle blanco!',
          'En nuestro molino de nieve procesamos harina de líquenes para alimentar a las aldeas nórdicas.'
        ],
        tip: '💡 CONSEJO DE CAZA: Los lobos árticos son vulnerables a ataques físicos cargados.',
      },
      {
        id: 'npc_tundra_lumberjack',
        zoneId: 'zone_tundra',
        x: 55,
        y: 140,
        name: 'Leñador Leif',
        title: 'Cortador de Pinos Nevados',
        avatarStyle: 'blacksmith',
        dialogue: [
          'La madera de pino nevado es densa y flexible, ideal para construir arcos largos y mástiles de barcos.',
          'Nuestras fogatas de resina arden sin humo incluso a treinta grados bajo cero.'
        ],
        tip: '💡 CONSEJO DE PINO: Los arcos de pino nevado tienen un 20% más de alcance y velocidad.',
      },
      {
        id: 'npc_tundra_tavernkeeper',
        zoneId: 'zone_tundra',
        x: 55,
        y: 230,
        name: 'Tabernera Sigrid',
        title: 'Patrona del Fiordo Helado',
        avatarStyle: 'wizard',
        dialogue: [
          '¡Bienvenido al Fiordo, viajero! Siéntate junto al fuego y bebe un cuerno de hidromiel caliente.',
          'Nuestra forja nórdica templa hachas de guerra capaces de quebrar bloques de hielo milenario.'
        ],
        tip: '💡 CONSEJO DE FIORDO: El hidromiel de Frostfall incrementa la fuerza física durante 3 combates.',
      },
      {
        id: 'npc_tundra_winter_blacksmith',
        zoneId: 'zone_tundra',
        x: 55,
        y: 330,
        name: 'Herrero Torvald',
        title: 'Armero del Acero Glacial',
        avatarStyle: 'blacksmith',
        dialogue: [
          'Forjamos acero endurecido al hielo. Nuestras espadas conservan un filo helado que congela las heridas.',
          'En el bastión sur descansan los campeones que defienden la frontera de la Ciudadela Imperial.'
        ],
        tip: '💡 CONSEJO DE FORJA: Las espadas de acero glacial ralentizan la velocidad de los enemigos en un 25%.',
      },
      {
        id: 'npc_tundra_ice_sculptor',
        zoneId: 'zone_tundra',
        x: 355,
        y: 150,
        name: 'Escultor Einar',
        title: 'Artesano del Hielo Puro',
        avatarStyle: 'wizard',
        dialogue: [
          'Esculpo gemas y dagas directamente de bloques de hielo azul transparente.',
          'El hielo de estas cordilleras orientales nunca se derrite, pues está imbuido de magia ártica.'
        ],
        tip: '💡 CONSEJO DE ESCULTURA: Las dagas de hielo puro aumentan el daño crítico mágico en un 40%.',
      },
      {
        id: 'npc_tundra_sled_master',
        zoneId: 'zone_tundra',
        x: 355,
        y: 240,
        name: 'Maestro Sven',
        title: 'Guía de Trineos de Montaña',
        avatarStyle: 'scout',
        dialogue: [
          '¡Mis trineos tirados por perros nórdicos abastecen de pescado y pieles a todas las cumbres!',
          'Hacia el sur se erige el Altar del Viento Polar, donde los antiguos rezaban para aplacar las tormentas.'
        ],
        tip: '💡 CONSEJO DE TRINEOS: Los puestos de suministros cuentan con alimentos de curación rápida.',
      },
      {
        id: 'npc_tundra_polar_druid',
        zoneId: 'zone_tundra',
        x: 355,
        y: 330,
        name: 'Druida Freydis',
        title: 'Sacerdotisa del Viento Polar',
        avatarStyle: 'wizard',
        dialogue: [
          'El viento polar susurra los secretos de los dioses nórdicos.',
          'El Altar de Escarcha confiere bendiciones de inmunidad a las ventiscas y heladas.'
        ],
        tip: '💡 CONSEJO POLAR: Meditar en los altares de hielo restaura completamente la energía de maná.',
      },
      {
        id: 'npc_tundra_crystal_gatherer',
        zoneId: 'zone_tundra',
        x: 145,
        y: 160,
        name: 'Recolectora Ingrid',
        title: 'Hortelana de las Flores de Nieve',
        avatarStyle: 'wizard',
        dialogue: [
          'En esta meseta crecen las rarísimas flores de escarcha. Sus pétalos brillan con destellos de zafiro.',
          'Con ellos elaboramos ungüentos que descongelan miembros entumecidos en segundos.'
        ],
        tip: '💡 CONSEJO BOTÁNICO: Las flores de escarcha son ingredientes vitales para elixires legendarios.',
      },
      {
        id: 'npc_tundra_pass_ranger',
        zoneId: 'zone_tundra',
        x: 165,
        y: 185,
        name: 'Guardabosques Olaf',
        title: 'Vigilante del Paso de las Avalanchas',
        avatarStyle: 'knight',
        dialogue: [
          '¡Pisa con cuidado en el desfiladero! El eco de un grito fuerte puede provocar una avalancha de nieve.',
          'Nuestros puentes de piedra reforzada están anclados a la roca viva para mayor seguridad.'
        ],
        tip: '💡 CONSEJO DEL PASO: Las calzadas reforzadas te guían a través de los abismos sin peligro.',
      },
      {
        id: 'npc_tundra_lake_fisher',
        zoneId: 'zone_tundra',
        x: 180,
        y: 250,
        name: 'Pescador Ragnar',
        title: 'Navegante del Gran Lago de Hielo Azul',
        avatarStyle: 'scout',
        dialogue: [
          '¡El lago está tan congelado que podemos caminar, patinar y construir iglús sobre su superficie!',
          'Aquel barco atrapado en el hielo era un drakkar mercante... su bodega aún esconde un cofre valioso.'
        ],
        tip: '💡 CONSEJO DE HIELO: Los tablones de madera sobre hielo azul te otorgan tracción y velocidad.',
      },
      {
        id: 'npc_tundra_storm_cryptkeeper',
        zoneId: 'zone_tundra',
        x: 225,
        y: 340,
        name: 'Custodio Ylva',
        title: 'Guardián del Templo de la Tormenta Glaciar',
        avatarStyle: 'elder',
        dialogue: [
          'En este templo reposan los Gigantes de Escarcha de la era primigenia.',
          'Los cuatro cofres árticos contienen reliquias de zafiro custodiadas por columnas de hielo eterno.'
        ],
        tip: '💡 CONSEJO DE TEMPLO: Tras derrotar al Titán Ymir, se abrirá la puerta hacia la Ciudadela Imperial.',
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
      {
        id: 'npc_castle_queen_gardener',
        zoneId: 'zone_castle',
        x: 75,
        y: 35,
        name: 'Jardinera Beatrice',
        title: 'Cuidadora de los Rosales Reales',
        avatarStyle: 'wizard',
        dialogue: [
          'Las rosas imperiales resisten incluso la plaga de la oscuridad.',
          'Nuestras fuentes de mármol blanco purifican cualquier maldición que azote el cuerpo.'
        ],
        tip: '💡 CONSEJO REAL: Las fuentes de la realeza limpian los efectos de estado negativos.',
      },
      {
        id: 'npc_castle_ambassador',
        zoneId: 'zone_castle',
        x: 330,
        y: 35,
        name: 'Lord Reginald',
        title: 'Embajador de las Altas Cortes',
        avatarStyle: 'elder',
        dialogue: [
          'Este palacio albergó a los emisarios de los siete reinos antes del gran cataclismo.',
          'La forja de plata de este distrito produce escudos pulidos que desvían la magia oscura.'
        ],
        tip: '💡 CONSEJO DIPLOMÁTICO: Los escudos de plata bendecida reflejan el 30% del daño mágico.',
      },
      {
        id: 'npc_castle_banker',
        zoneId: 'zone_castle',
        x: 150,
        y: 135,
        name: 'Banquero Midas',
        title: 'Tesorero de la Corona Imperial',
        avatarStyle: 'elder',
        dialogue: [
          '¡El Gran Mercado Imperial manejaba las reservas de oro de todo el continente!',
          'En nuestros cofres aún se custodian lingotes de oro puro y gemas de la realeza.'
        ],
        tip: '💡 CONSEJO DE MERCADO: El equipo imperial de oro confiere bonificaciones de EXP y oro +20%.',
      },
      {
        id: 'npc_castle_archmage',
        zoneId: 'zone_castle',
        x: 140,
        y: 210,
        name: 'Archimaestre Varis',
        title: 'Rector de la Universidad Arcana',
        avatarStyle: 'wizard',
        dialogue: [
          'Los libros de esta biblioteca contienen las fórmulas arcanas más poderosas jamás concebidas.',
          'Para derrotar al General Lord Kael, debes combinar magias sagradas y elementales en armonía.'
        ],
        tip: '💡 CONSEJO UNIVERSITARIO: Las habilidades de Nivel 60 ignoran el 40% de la armadura enemiga.',
      },
      {
        id: 'npc_castle_legion_commander',
        zoneId: 'zone_castle',
        x: 315,
        y: 200,
        name: 'Comandante Titus',
        title: 'Mariscal de la Legión Imperial',
        avatarStyle: 'knight',
        dialogue: [
          'Entrenamos a los caballeros más fieros del reino en este campo de torneos.',
          'Nuestras armerías pesadas forjan corazas de acero valyrio impenetrables.'
        ],
        tip: '💡 CONSEJO MARCIAL: Las armaduras de la legión reducen a la mitad los golpes críticos recibidos.',
      },
      {
        id: 'npc_castle_silk_weaver',
        zoneId: 'zone_castle',
        x: 160,
        y: 280,
        name: 'Maestra Vivienne',
        title: 'Tejedora de la Seda Imperial',
        avatarStyle: 'wizard',
        dialogue: [
          'Tejemos túnicas con hilo de seda celestial y polvo de diamante.',
          'Nuestras vestiduras confieren una velocidad de lanzamiento de hechizos sin rival.'
        ],
        tip: '💡 CONSEJO DE TALLER: Las túnicas de seda permiten actuar primero en cada turno de batalla.',
      },
      {
        id: 'npc_castle_royal_cryptkeeper',
        zoneId: 'zone_castle',
        x: 60,
        y: 320,
        name: 'Custodio Aurelius',
        title: 'Guardián del Panteón de los Reyes',
        avatarStyle: 'elder',
        dialogue: [
          'Aquí reposan los primeros emperadores de Aethelgard en criptas de mármol sagrado.',
          'Los cuatro cofres imperiales contienen las reliquias de la corona... ¡cuidado con los espectros reales!'
        ],
        tip: '💡 CONSEJO DE CRIPTA: Tras vencer al General Lord Kael se abrirá la brecha al Vórtice del Vacío.',
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
      {
        id: 'npc_void_astrologer',
        zoneId: 'zone_void',
        x: 60,
        y: 75,
        name: 'Astrólogo Zephyr',
        title: 'Cartógrafo de Constelaciones Perdidas',
        avatarStyle: 'wizard',
        dialogue: [
          'Desde este observatorio flotante contemplo las estrellas que el Vacío devora.',
          'El Santuario Astral de esta isla bendice con inmunidad al drenaje de energía cósmica.'
        ],
        tip: '💡 CONSEJO ASTRAL: Los santuarios del vacío protegen contra el estado de silencio mágico.',
      },
      {
        id: 'npc_void_dark_matter',
        zoneId: 'zone_void',
        x: 235,
        y: 75,
        name: 'Alquimista Nyx',
        title: 'Investigadora de la Materia Oscura',
        avatarStyle: 'wizard',
        dialogue: [
          'Nuestras forjas dimensionales canalizan la antimateria para templar armaduras estelares.',
          'Las fuentes de energía cósmica recargan todo tu maná instantáneamente.'
        ],
        tip: '💡 CONSEJO DE MATERIA OSCURA: Las armas oscuras absorben el 15% del daño infligido en vida propia.',
      },
      {
        id: 'npc_void_crystal_mage',
        zoneId: 'zone_void',
        x: 350,
        y: 80,
        name: 'Mago Kaelen',
        title: 'Custodio de los Cristales Dimensionales',
        avatarStyle: 'wizard',
        dialogue: [
          'Los monolitos rúnicos de este archipiélago oriental mantienen unidas las islas del vacío.',
          'Si un puente de energía se desvanece, las islas caerán al abismo infinito.'
        ],
        tip: '💡 CONSEJO DE CRISTALES: Los monolitos rúnicos incrementan el poder de hechizos un 35%.',
      },
      {
        id: 'npc_void_time_weaver',
        zoneId: 'zone_void',
        x: 70,
        y: 230,
        name: 'Tejedora Chronia',
        title: 'Señora del Espacio-Tiempo',
        avatarStyle: 'wizard',
        dialogue: [
          'El tiempo fluye en círculos en este enclave occidental.',
          'Nuestras runas permiten a los hechiceros ejecutar dos turnos consecutivos en combate.'
        ],
        tip: '💡 CONSEJO TEMPORAL: La habilidad Parada de Tiempo te otorga ventaja absoluta de iniciativa.',
      },
      {
        id: 'npc_void_singularity_guard',
        zoneId: 'zone_void',
        x: 205,
        y: 195,
        name: 'Guardián Voiden',
        title: 'Centinela de la Singularidad Central',
        avatarStyle: 'knight',
        dialogue: [
          'Esta es la Gran Plaza Central del Vórtice. El agujero negro absorbe toda la materia circundante.',
          'Los dos cofres de la singularidad contienen armaduras del vacío impenetrable.'
        ],
        tip: '💡 CONSEJO DE SINGULARIDAD: Las corazas del vacío anulan todo el daño de elemento Sombra.',
      },
      {
        id: 'npc_void_shadow_hunter',
        zoneId: 'zone_void',
        x: 230,
        y: 295,
        name: 'Cazador Raven',
        title: 'Comandante del Bastión de Sombras',
        avatarStyle: 'scout',
        dialogue: [
          'Damos caza a las aberraciones y segadores dimensionales que emergen del horizonte.',
          'Hacia el sur se extiende la Gran Calzada que conduce al Templo del Archilich Malakor.'
        ],
        tip: '💡 CONSEJO DE BASTIÓN: Derrotar a Malakor abre el portal sagrado al Sagrario de los Antiguos.',
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
      {
        id: 'npc_sanctuary_eternity_angel',
        zoneId: 'zone_sanctuary',
        x: 45,
        y: 55,
        name: 'Ángel Lumiel',
        title: 'Custodio del Jardín de la Eternidad',
        avatarStyle: 'wizard',
        dialogue: [
          'En este jardín sagrado crecen las flores de luz pura que alimentan a los dioses.',
          'La fuente sagrada restaura toda herida física y espiritual al instante.'
        ],
        tip: '💡 CONSEJO CELESTIAL: Las flores de luz aumentan todas tus estadísticas un 20% de forma permanente.',
      },
      {
        id: 'npc_sanctuary_celestial_watch',
        zoneId: 'zone_sanctuary',
        x: 350,
        y: 45,
        name: 'Centinela Helios',
        title: 'Vigía del Amanecer Eterno',
        avatarStyle: 'knight',
        dialogue: [
          'Desde esta atalaya dorada se contempla el nacimiento de todas las realidades y constelaciones.',
          'El cofre celestial de esta cumbre contiene el Escudo del Sol Invencible.'
        ],
        tip: '💡 CONSEJO SOLAR: Los escudos sagrados otorgan 50% de resistencia a toda la magia.',
      },
      {
        id: 'npc_sanctuary_hero_champion',
        zoneId: 'zone_sanctuary',
        x: 100,
        y: 170,
        name: 'Paladín Roland',
        title: 'Héroe Ascendido del Panteón',
        avatarStyle: 'knight',
        dialogue: [
          'Llegué aquí tras mil batallas en el mundo mortal. Los dioses me acogieron en sus terrazas doradas.',
          'Para desafiar a Cronos, debes estar preparado para resistir sus ataques de tiempo que envejecen el alma.'
        ],
        tip: '💡 CONSEJO DE CAMPEÓN: Equipa accesorios con inmunidad a muerte súbita y parada temporal.',
      },
      {
        id: 'npc_sanctuary_youth_healer',
        zoneId: 'zone_sanctuary',
        x: 100,
        y: 270,
        name: 'Náyade Amara',
        title: 'Espíritu de la Juventud Eterna',
        avatarStyle: 'wizard',
        dialogue: [
          'Las aguas doradas de estas fuentes brotan directamente del manantial de la creación.',
          'Bebe de su néctar y purifica tu cuerpo antes de ascender la Gran Calzada hacia el trono de Cronos.'
        ],
        tip: '💡 CONSEJO DE NÉCTAR: La Fuente de la Juventud revive y recupera al 100% todo tu poder.',
      },
      {
        id: 'npc_sanctuary_pantheon_gatekeeper',
        zoneId: 'zone_sanctuary',
        x: 100,
        y: 350,
        name: 'Themis la Justiciera',
        title: 'Custodia de las Puertas del Panteón',
        avatarStyle: 'elder',
        dialogue: [
          'Pisas el umbral del final de tu odisea. Los cuatro cofres divinos guardan los tesoros definitivos del juego.',
          '¡Que la luz de los Antiguos guíe tu espada hacia la victoria final!'
        ],
        tip: '💡 CONSEJO FINAL: Derrotar a Cronos completa la historia y desbloquea el Rango de Héroe Omnipotente.',
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
