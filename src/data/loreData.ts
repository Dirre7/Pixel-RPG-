import { LoreEntry } from '../types';

export const GAME_LORE_ENTRIES: LoreEntry[] = [
  // ==========================================
  // CAPÍTULOS DE LA CRÓNICA PRINCIPAL (8 ZONAS)
  // ==========================================
  {
    id: 'lore_prologue',
    title: 'El Mito del Cristal Primigenio',
    category: 'chronicle',
    unlockedByDefault: true,
    unlockConditionText: 'Desbloqueado desde el inicio de la aventura.',
    icon: '✨',
    dateOrEra: 'Era del Amanecer Astral',
    shortSummary: 'La creación de Aethelgard y el nacimiento del Cristal que mantenía el equilibrio elemental.',
    fullText: [
      'En los albores del tiempo, antes de que existieran los reinos y las fronteras, los Titanes Estelares descendieron sobre el mundo salvaje de Aethelgard.',
      'Para preservar el flujo de la vida, concentraron la magia elemental pura en el "Cristal Primigenio", un artefacto de luminosidad celestial depositado en el corazón de la Gran Ciudadela.',
      'Bajo su bendición, los bosques florecieron eternamente, las aguas subterráneas fluyeron puras y los volcanes alimentaron la fertilidad de las tierras en lugar de arrasarlas.',
      'Durante siglos, los pueblos vivieron en la Gran Concordia, jurando proteger el Cristal con sus vidas.'
    ],
    revelationBonusScore: 200,
  },
  {
    id: 'lore_fracture',
    title: 'La Noche de la Fractura Oscura',
    category: 'chronicle',
    unlockedByDefault: true,
    unlockConditionText: 'Comienza tu viaje en el Bosque Verde.',
    icon: '⚡',
    dateOrEra: 'Año 342 de la Gran Concordia',
    shortSummary: 'La traición del Archicanciller Malakor y la división del Cristal en 8 Fragmentos Elementales.',
    fullText: [
      'La paz no duraría para siempre. El Archicanciller real, Malakor, consumido por una insaciable sed de inmortalidad, descubrió en las catacumbas secretas los Tomos del Vértice Prohibido.',
      'En la fatídica noche del solsticio sombrío, Malakor ejecutó un ritual que hizo estallar el Cristal Primigenio en 8 poderosos Fragmentos Elementales esparcidos por todas las regiones de Aethelgard.',
      'Una niebla de desesperación cubrió el reino... hasta que las antiguas profecías anunciaron la llegada del Elegido.'
    ],
    revelationBonusScore: 300,
  },
  {
    id: 'lore_forest_secret',
    title: 'El Despertar del Bosque Esmeralda',
    category: 'location',
    zoneId: 'zone_forest',
    unlockConditionText: 'Descubre el Santuario o habla con Eldrin en el Bosque Verde.',
    icon: '🌿',
    dateOrEra: 'Post-Fractura • Primer Impacto',
    shortSummary: 'Cómo la energía vital pura desbordada transformó a las criaturas del bosque.',
    fullText: [
      'El Bosque Verde absorbió el Fragmento Esmeralda de la Vitalidad.',
      'En lugar de marchitarse, la vegetación creció de forma monstruosa y las pequeñas gotas de rocío mágico cobraron conciencia desmedida, creando al Gran Rey Slime.',
      'Purificar este bosque es el primer paso vital para reunir la fuerza elemental necesaria.'
    ],
    revelationBonusScore: 400,
  },
  {
    id: 'lore_cave_ruins',
    title: 'La Tragedia de las Minas de Eridu',
    category: 'location',
    zoneId: 'zone_cave',
    unlockConditionText: 'Ingresa a la Cueva de Sombras y habla con Thorin.',
    icon: '⛏️',
    dateOrEra: 'Año 343 • La Era Subterránea',
    shortSummary: 'El antiguo bastión minero enano y la creación del Gólem para contener el poder subterráneo.',
    fullText: [
      'Muy por debajo de las colinas yacen las Minas de Eridu, las legendarias excavaciones del clan enano Barbaespada.',
      'Cuando el Fragmento de Obsidiana cayó en el pozo abisal, los enanos intentaron canalizar su energía tallando al Gólem de Obsidiana.',
      'Sin embargo, el coloso se tornó incontrolable y expulsó a los mineros de sus galerías.'
    ],
    revelationBonusScore: 500,
  },
  {
    id: 'lore_swamp_ruins',
    title: 'El Miasma del Pantano de Vael',
    category: 'location',
    zoneId: 'zone_swamp',
    unlockConditionText: 'Ingresa al Pantano Espectral de Vael y habla con Morwen.',
    icon: '🐍',
    dateOrEra: 'Año 344 • La Bruma Venenosa',
    shortSummary: 'Las aguas estancadas donde anida la Reina Serpiente Gorgona y el Fragmento de Veneno.',
    fullText: [
      'El Pantano de Vael fue en otros tiempos un jardín de sauces y nenúfares sagrados.',
      'La caída del Fragmento Tóxico envenenó las aguas subterráneas, engendrando hidras y despertando a la Reina Serpiente Gorgona.',
      'Solo un héroe protegido por antídotos y temple de acero puede navegar sus ciénagas.'
    ],
    revelationBonusScore: 550,
  },
  {
    id: 'lore_volcano_forge',
    title: 'La Fragua de los Titanes & El Dragón Ignis',
    category: 'location',
    zoneId: 'zone_volcano',
    unlockConditionText: 'Llega al Volcán Ancestral y visita el Altar de Fuego.',
    icon: '🌋',
    dateOrEra: 'La Era de las Llamas Eternas',
    shortSummary: 'El despertar del dragón milenario en la caldera donde se forjaron las armas divinas.',
    fullText: [
      'En el corazón de la caldera dormía Ignis, el Dragón Primordial.',
      'El impacto del Fragmento de Magma calcinó la mente del dragón con una ira volcánica interminable.',
      'Reclamar el Fragmento de Magma requiere derrotar al dragón en su propio trono incandescente.'
    ],
    revelationBonusScore: 600,
  },
  {
    id: 'lore_tundra_ice',
    title: 'Los Glaciares Olvidados de Frostfall',
    category: 'location',
    zoneId: 'zone_tundra',
    unlockConditionText: 'Asciende a los Picos Helados de Frostfall.',
    icon: '❄️',
    dateOrEra: 'El Invierno Eterno',
    shortSummary: 'Las cumbres congeladas donde descansa el Titán de Escarcha Ymir.',
    fullText: [
      'En las cumbres más altas del continente el viento sopla a temperaturas que congelan el aliento.',
      'El Fragmento Glacial dio origen al Titán Ymir, un gigante de escarcha cuyo corazón es un bloque de hielo impenetrable.',
      'Romper el frío perpetuo es necesario para abrir el paso hacia la Ciudadela Imperial.'
    ],
    revelationBonusScore: 650,
  },
  {
    id: 'lore_castle_fall',
    title: 'La Necrópolis Real de Aethelgard',
    category: 'location',
    zoneId: 'zone_castle',
    unlockConditionText: 'Cruza las puertas del Castillo Maldito.',
    icon: '🏰',
    dateOrEra: 'El Asedio de las Sombras',
    shortSummary: 'La caída de la capital real y el bastión del General Lord Kael.',
    fullText: [
      'La majestuosa Ciudadela de Aethelgard es ahora una necrópolis custodiada por caballeros esqueléticos.',
      'El General de la Muerte Lord Kael custodia el salón real impidiendo el paso hacia el Vórtice del Vacío.'
    ],
    revelationBonusScore: 700,
  },
  {
    id: 'lore_void_rift',
    title: 'El Vórtice del Vacío & El Archilich Malakor',
    category: 'location',
    zoneId: 'zone_void',
    unlockConditionText: 'Atraviesa la fisura dimensional del Vacío.',
    icon: '🌌',
    dateOrEra: 'El Fin de la Realidad',
    shortSummary: 'La dimensión de antimateria donde Malakor planea devorar el cosmos.',
    fullText: [
      'Más allá del espacio conocido se abre el Vórtice del Vacío.',
      'Allí, Malakor se alimenta de la energía de la nada para borrar la existencia.',
      'Derrotarlo restaura el Cristal Primigenio y salva al mundo de la destrucción total.'
    ],
    revelationBonusScore: 850,
  },
  {
    id: 'lore_sanctuary_god',
    title: 'El Sagrario de los Antiguos & El Dios Cronos (100%)',
    category: 'location',
    zoneId: 'zone_sanctuary',
    unlockConditionText: 'Desbloquea el acceso al Sagrario tras salvar el mundo.',
    icon: '🌟',
    dateOrEra: 'El Origen del Cosmos',
    shortSummary: 'La prueba final definitiva para alcanzar el rango de Deidad Heroica.',
    fullText: [
      'En el vértice superior de Aethelgard se alza el Sagrario de los Antiguos.',
      'El Dios Primigenio Cronos aguarda para probar si el héroe que restauró el Cristal es digno de blandir el poder del infinito.',
      'Superar esta prueba consagra el 100% de la leyenda eterna.'
    ],
    revelationBonusScore: 1200,
  },

  // ==========================================
  // BESTIARIO & SECRETOS DE LOS 8 JEFES
  // ==========================================
  {
    id: 'lore_boss_slime',
    title: 'Registro de Batalla: El Gran Rey Slime',
    category: 'boss',
    unlockConditionText: 'Derrota al Gran Rey Slime en el Bosque Verde.',
    icon: '👑',
    dateOrEra: 'Bestiario • Rango I',
    shortSummary: 'El coloso de gelatina y su debilidad ante el fuego ardiente.',
    fullText: [
      'El Gran Rey Slime absorbe impactos contundentes gracias a su membrana elástica.',
      'Puntos débiles: Los hechizos de Fuego evaporan su consistencia rápidamente.'
    ],
    revelationBonusScore: 250,
  },
  {
    id: 'lore_boss_golem',
    title: 'Registro de Batalla: El Gólem de Obsidiana',
    category: 'boss',
    unlockConditionText: 'Derrota al Gólem de Obsidiana en la Cueva de Sombras.',
    icon: '🗿',
    dateOrEra: 'Bestiario • Rango II',
    shortSummary: 'El titán de roca enana y sus junturas de runas.',
    fullText: [
      'Su masa de obsidiana resiste espadas convencionales.',
      'Puntos débiles: Las descargas de Trueno y ataques mágicos agrietan sus junturas rúnicas.'
    ],
    revelationBonusScore: 350,
  },
  {
    id: 'lore_boss_serpent',
    title: 'Registro de Batalla: Reina Serpiente Gorgona',
    category: 'boss',
    unlockConditionText: 'Derrota a la Reina Serpiente Gorgona en el Pantano.',
    icon: '🐍',
    dateOrEra: 'Bestiario • Rango III',
    shortSummary: 'La señora de los venenos abisales de Vael.',
    fullText: [
      'Ataca con mordiscos venenosos que reducen la vida progresivamente.',
      'Puntos débiles: Es muy vulnerable al daño cortante veloz y a la magia Sagrada.'
    ],
    revelationBonusScore: 450,
  },
  {
    id: 'lore_boss_dragon',
    title: 'Registro de Batalla: Dragón Infernal Ignis',
    category: 'boss',
    unlockConditionText: 'Derrota al Dragón Infernal Ignis en el Volcán.',
    icon: '🐉',
    dateOrEra: 'Bestiario • Rango IV',
    shortSummary: 'El terror de los cielos volcánicos.',
    fullText: [
      'Exhala llamaradas colosales de magma derretido.',
      'Puntos débiles: La magia de Hielo extremo y estocadas críticas en sus escamas dorsales.'
    ],
    revelationBonusScore: 550,
  },
  {
    id: 'lore_boss_frost',
    title: 'Registro de Batalla: Titán de Escarcha Ymir',
    category: 'boss',
    unlockConditionText: 'Derrota al Titán Ymir en Frostfall.',
    icon: '❄️',
    dateOrEra: 'Bestiario • Rango V',
    shortSummary: 'El gigante que empuña el cero absoluto.',
    fullText: [
      'Golpea con un hacha colosal de hielo que congela en el acto.',
      'Puntos débiles: El Fuego concentrado derrite su armadura helada abriendo huecos para daño físico.'
    ],
    revelationBonusScore: 650,
  },
  {
    id: 'lore_boss_death_knight',
    title: 'Registro de Batalla: General Lord Kael',
    category: 'boss',
    unlockConditionText: 'Derrota al General Lord Kael en la Ciudadela.',
    icon: '🛡️',
    dateOrEra: 'Bestiario • Rango VI',
    shortSummary: 'El paladín caído que comanda la guardia de los no-muertos.',
    fullText: [
      'Porta una espada maldita con absorción de vida y gran defensa.',
      'Puntos débiles: Los conjuros de Luz Sagrada quiebran su escudo profano.'
    ],
    revelationBonusScore: 750,
  },
  {
    id: 'lore_boss_void',
    title: 'Registro de Batalla: Archilich Malakor del Abismo',
    category: 'boss',
    unlockConditionText: 'Derrota a Malakor en el Vórtice del Vacío.',
    icon: '💀',
    dateOrEra: 'Bestiario • Rango Supremo (Historia)',
    shortSummary: 'El conspirador de las sombras y señor de la antimateria.',
    fullText: [
      'Manipula rayos de vacío que desintegran cualquier defensa común.',
      'Puntos débiles: La Luz Sagrada, combos definitivos y el valor del héroe.'
    ],
    revelationBonusScore: 1000,
  },
  {
    id: 'lore_boss_ancient',
    title: 'Registro de Batalla: Dios Primigenio Cronos (100%)',
    category: 'boss',
    unlockConditionText: 'Derrota a Cronos en el Sagrario de los Antiguos.',
    icon: '🌟',
    dateOrEra: 'Bestiario • Rango Divino Máximo',
    shortSummary: 'El Creador y Custodio del Tiempo de Aethelgard.',
    fullText: [
      'El combate más exigente del juego. Emplea todos los elementos y cuenta con stats descomunales.',
      'Puntos débiles: Requiere Nivel 75-80, equipo Tier 8 y dominar todas las habilidades legendarias.'
    ],
    revelationBonusScore: 2000,
  }
];
