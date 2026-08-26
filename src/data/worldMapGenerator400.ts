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
  // Calzada principal de acceso este a oeste conectada con la ciudad (Completamente despejada)
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
  // 🏛️ Glorieta Monumental ajardinada al norte del camino
  map[56][13] = 18; // Columna clásica con hiedra
  map[56][12] = 12; map[56][14] = 12; // Setos de flores rodeando la columna
  map[54][9] = 7;   // 🎁 Cofre Secreto del Claro del Bosque Oeste

  // =========================================================================
  // 6. CARVE REGION 6: 🌾 VALLE DE LOS VIÑEDOS, MOLINOS Y SANTUARIO (Suroeste, X: 8..28, Y: 76..112)
  // =========================================================================
  for (let y = 76; y <= 112; y++) {
    for (let x = 8; x <= 28; x++) {
      map[y][x] = 0;
    }
  }
  // Calzada principal norte a sur totalmente limpia y despejada (X: 18..19)
  for (let y = 74; y <= 108; y++) {
    map[y][18] = 2; map[y][19] = 2;
  }

  // 🏡 Sector Agrícola Oeste: Granjas, Plazoleta del Pozo y Huertos Reales
  // Cabaña 1: Granja del Valle Alto
  map[78][13] = 5;
  map[79][13] = 2; map[79][14] = 2; map[79][15] = 2; map[79][16] = 2; map[79][17] = 2; map[79][18] = 2;
  map[78][12] = 14; // Barriles y suministros

  // Cabaña 2: Granero y Establo
  map[82][13] = 5;
  map[83][13] = 2; map[83][14] = 2; map[83][15] = 2; map[83][16] = 2; map[83][17] = 2; map[83][18] = 2;

  // Plazoleta de Descanso del Pozo (Lateral Oeste, sin invadir la calzada)
  map[86][15] = 4; // Pozo de piedra
  map[85][15] = 12; map[87][15] = 12; // Bancos
  map[86][16] = 2; map[86][17] = 2; // Acceso

  // Huerto Real de Cultivo (Calabazas y Zanahorias)
  for (let y = 90; y <= 98; y++) {
    for (let x = 9; x <= 15; x++) {
      map[y][x] = 13;
    }
  }
  map[89][9] = 12; map[89][12] = 12; map[89][15] = 12; // Setos protectores del huerto
  map[99][9] = 12; map[99][12] = 12; map[99][15] = 12;

  // 🌾 Sector del Molino y Casonas del Este (X: 24)
  // Cabaña 3: Casona del Molinero
  map[78][24] = 5;
  map[79][19] = 2; map[79][20] = 2; map[79][21] = 2; map[79][22] = 2; map[79][23] = 2; map[79][24] = 2;

  // 🌾 Gran Molino de Viento con aspas animadas y sacos de grano
  map[84][25] = 6;
  map[85][19] = 2; map[85][20] = 2; map[85][21] = 2; map[85][22] = 2; map[85][23] = 2; map[85][24] = 2; map[85][25] = 2;
  map[85][26] = 14; map[83][25] = 14; // Sacos de harina y pacas de trigo

  // Cabaña 4: Cabaña de los Hortelanos
  map[92][24] = 5;
  map[93][19] = 2; map[93][20] = 2; map[93][21] = 2; map[93][22] = 2; map[93][23] = 2; map[93][24] = 2;

  // Cabaña 5: Cobertizo de Herramientas
  map[96][24] = 5;
  map[97][19] = 2; map[97][20] = 2; map[97][21] = 2; map[97][22] = 2; map[97][23] = 2; map[97][24] = 2;

  // Farolas de la calzada (en márgenes verdes, sin solapar NPCs)
  map[76][20] = 17; map[84][20] = 17; map[90][20] = 17; map[100][20] = 17;

  // 🏛️ Recinto Sagrado del Santuario Místico (Plaza Monumental Oeste)
  map[104][12] = 8; // 🏛️ Santuario Místico de Mármol
  map[103][10] = 18; map[103][14] = 18; // Columnas de mármol
  map[105][10] = 18; map[105][14] = 18;
  map[104][13] = 2; map[104][14] = 2; map[104][15] = 2; map[104][16] = 2; map[104][17] = 2; map[104][18] = 2;
  map[105][12] = 7; // 🎁 Cofre Sagrado del Valle

  // 🌄 Glorieta y Mirador del Valle al final del camino sur
  map[107][17] = 2; map[107][20] = 2;
  map[108][17] = 2; map[108][20] = 2;
  map[107][16] = 12; map[107][21] = 12; // Bancos de piedra
  map[108][16] = 17; map[108][21] = 17; // Farolas de mirador

  // =========================================================================
  // 7. CARVE REGION 7: 🏴‍☠️ ENSENADA DE LOS CONTRABANDISTAS Y PUERTO (Sureste, X: 44..66, Y: 76..112)
  // =========================================================================
  for (let y = 76; y <= 112; y++) {
    for (let x = 44; x <= 66; x++) {
      map[y][x] = 0;
    }
  }
  // Senda ancha del paseo marítimo norte a sur (X: 53..54)
  for (let y = 74; y <= 108; y++) {
    map[y][53] = 2; map[y][54] = 2;
  }

  // 🪨 GRAN ENTRADA A LA CUEVA DE LOS CONTRABANDISTAS (X: 58, Y: 86)
  map[86][58] = 26;  // Gran Acantilado y Gruta Marina 2.5D HD
  map[87][58] = 28;  // 🚪 Portal de Descenso a la Cueva
  for (let x = 54; x <= 58; x++) {
    map[87][x] = 2;  // Sendero empedrado de acceso a la cueva
  }

  // 🏡 Cabañas de Pescadores Alineadas y Ordenadas en la Ribera Este (X: 60)
  // Cabaña 1: Cabaña del Contramaestre
  map[78][60] = 5;
  map[79][55] = 2; map[79][56] = 2; map[79][57] = 2; map[79][58] = 2; map[79][59] = 2; map[79][60] = 2;
  map[78][59] = 14; // Redes y barriles
  map[77][60] = 12; // Setos

  // Cabaña 2: Almacén de Velámenes
  map[82][60] = 5;
  map[83][55] = 2; map[83][56] = 2; map[83][57] = 2; map[83][58] = 2; map[83][59] = 2; map[83][60] = 2;
  map[82][59] = 14;

  // Cabaña 3: Taller del Calafate
  map[92][60] = 5;
  map[93][55] = 2; map[93][56] = 2; map[93][57] = 2; map[93][58] = 2; map[93][59] = 2; map[93][60] = 2;
  map[92][59] = 14;

  // 🌊 Paseo Fluvial y Muelle Oeste (X: 51..52)
  map[76][51] = 17; map[84][51] = 17; map[92][51] = 17; map[100][51] = 17; // Farolas náuticas del paseo
  map[80][51] = 12; map[88][51] = 12; map[96][51] = 12; // Bancos de madera con vistas al agua
  map[78][51] = 14; map[86][51] = 14; map[94][51] = 14; // Barriles de pesca y redes

  // Canteras de pizarra y geodas del acantilado sur
  map[102][60] = 18; map[104][60] = 18;
  map[103][62] = 20; // 💎 Geoda marina
  map[106][56] = 7;  // 🎁 Cofre del Tesoro Pirata
  map[108][52] = 18; map[108][56] = 18; // Balizas de piedra marítimas

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
  // 9. TRAZADO URBANO MEDIEVAL ORGÁNICO DE LA ALDEA DE AETHELGARD
  // =========================================================================

  // A. Gran Plaza Mayor Central de Adoquines (X: 30..42, Y: 56..64)
  for (let y = 56; y <= 64; y++) {
    for (let x = 30; x <= 42; x++) {
      map[y][x] = 2;
    }
  }

  // B. Red de Calles Sinuosas y Avenidas Principales
  // 1. Camino Real Norte (Hacia el Castillo y puente norte)
  for (let y = 46; y <= 56; y++) {
    map[y][36] = 2; map[y][37] = 2;
  }
  // 2. Calzada del Castillo Noreste (Hacia el Salón del Trono X: 43, Y: 43)
  for (let x = 37; x <= 46; x++) {
    map[48][x] = 2; map[49][x] = 2;
  }
  for (let y = 44; y <= 48; y++) {
    map[y][43] = 2;
  }
  // 3. Callejón de la Taberna y Posada "El Jabalí Dorado" (Noroeste X: 31, Y: 51)
  for (let x = 24; x <= 36; x++) {
    map[53][x] = 2; map[54][x] = 2;
  }
  for (let y = 50; y <= 54; y++) {
    map[y][31] = 2;
  }
  // 4. Callejón de la Gran Forja de Brom (Oeste X: 25, Y: 51)
  for (let y = 51; y <= 55; y++) {
    map[y][25] = 2;
  }
  // 5. Paseo de los Boticarios (Este X: 47, Y: 51)
  for (let x = 37; x <= 48; x++) {
    map[53][x] = 2; map[54][x] = 2;
  }
  for (let y = 51; y <= 55; y++) {
    map[y][47] = 2;
  }
  // 6. Paseo Fluvial Ribera Oeste (Y: 56..74, X: 33..34)
  for (let y = 56; y <= 74; y++) {
    map[y][33] = 2; map[y][34] = 2;
  }
  // 7. Paseo Fluvial Ribera Este (Y: 56..74, X: 38..39)
  for (let y = 56; y <= 74; y++) {
    map[y][38] = 2; map[y][39] = 2;
  }
  // 8. Senda Sur Residencial y Artesanal (Y: 68..69, X: 20..48)
  for (let x = 20; x <= 48; x++) {
    if (x !== 35 && x !== 36) {
      map[68][x] = 2; map[69][x] = 2;
    }
  }
  for (let y = 56; y <= 68; y++) {
    map[y][23] = 2; // Conexión senda oeste
    map[y][46] = 2; // Conexión senda este
  }

  // 🌉 Los 3 Puentes de Piedra y Madera sobre el Río (X: 35..36)
  map[48][35] = 2; map[48][36] = 2; // Puente Norte
  map[60][35] = 2; map[60][36] = 2; // Puente Central de la Plaza
  map[68][35] = 2; map[68][36] = 2; // Puente Sur
  map[69][35] = 2; map[69][36] = 2;

  // 🏛️ Elementos de la Gran Plaza Central
  map[60][36] = 4;  // Gran Fuente Monumental de Mármol
  map[57][39] = 22; // Tablón de Anuncios y Misiones
  map[57][33] = 12; map[57][37] = 12; // Bancos de descanso
  map[63][33] = 12; map[63][39] = 12;
  map[56][30] = 17; map[56][42] = 17; // Farolas clásicas en esquinas
  map[64][30] = 17; map[64][42] = 17;

  // 🎪 Puestos Temáticos del Bazar en la Plaza
  map[58][31] = 9;  // Puesto de Frutas y Verduras
  map[62][31] = 9;  // Puesto de Panadería y Raciones
  map[58][41] = 9;  // Puesto de Armería y Escudos
  map[62][41] = 9;  // Puesto de Pociones y Pergaminos

  // 🍻 EDIFICIO 1: Gran Taberna y Posada "El Jabalí Dorado" (X: 31, Y: 51, Puerta: 31, 52)
  map[51][31] = 5;  // Edificio de la Taberna
  map[52][28] = 14; map[52][29] = 14; // Barriles de cerveza y cajas en terraza
  map[50][30] = 12; map[50][32] = 12; // Setos florales
  map[52][34] = 17; // Farola en la orilla del canal/césped
  map[53][33] = 2;  // Calzada despejada

  // ⚔️ EDIFICIO 2: Gran Forja Real de Brom (X: 25, Y: 51, Puerta: 25, 52)
  map[51][25] = 10; // Gran Edificio de la Forja con Chimenea y Rótulo
  map[52][24] = 2; map[52][25] = 2; map[52][26] = 2; // Patio empedrado de la forja
  map[51][24] = 2; map[51][26] = 2;
  map[52][23] = 29; // Yunque de trabajo exterior con martillo y chispas
  map[52][27] = 22; // Pilas de mineral de hierro, carbón y lingotes
  map[50][27] = 16; // Armero con espadas y hachas
  map[52][22] = 17; // Farola en el borde exterior
  map[53][23] = 2;  // Calzada despejada

  // 🌿 EDIFICIO 3: Botica Alquímica de Lynda (X: 47, Y: 51, Puerta: 47, 52)
  map[51][47] = 27; // Edificio de la Botica
  map[50][46] = 12; map[50][48] = 12; // Setos de lavanda y rosas
  map[52][49] = 14; // Maceteros con hierbas
  map[52][43] = 17; // Farola en la esquina del jardín botánico
  map[53][45] = 2;  // Calzada despejada

  // 👑 EDIFICIO 4: Gran Salón del Trono de Aethelgard (X: 43, Y: 43, Puerta: 43, 45)
  map[43][43] = 31; // Gran Mansión Consistorial
  map[42][41] = 12; map[42][45] = 12; // Setos reales
  map[45][41] = 19; map[45][45] = 19; // Braseros ceremoniales
  map[45][40] = 18; map[45][46] = 18; // Columnas de mármol

  // 🌾 EDIFICIO 5: El Molino de Viento con Aspas y Huerto Harinero (Noroeste X: 19, Y: 48)
  map[48][19] = 6;  // Molino de Viento
  map[47][18] = 13; map[47][20] = 13; // Huerto de trigo
  map[49][18] = 14; // Sacos de harina

  // 🎯 EDIFICIO 6: Gremio de Arqueros y Campo de Tiro (Oeste X: 21, Y: 56, Entrada Norte de la Calzada)
  map[56][21] = 5;  // Cabaña de los Arqueros
  map[57][21] = 2; map[58][21] = 2; map[59][21] = 2; // Camino de acceso empedrado hacia la calzada
  map[55][20] = 12; map[55][22] = 12; // Setos florales en la fachada
  map[56][17] = 14; map[57][17] = 14; // Dianas de paja con flechas clavadas
  map[56][18] = 16; // Armero con arcos y carcajes
  map[58][18] = 12; // Banco de descanso para arqueros
  map[58][23] = 17; // Farola de la entrada

  // 🌳 Alameda Oeste: Bancos y Farolas en los bordes del Paseo (Y: 59 y Y: 61)
  map[59][10] = 12; map[59][15] = 17; map[59][18] = 12; // Borde norte de la calzada
  map[61][8] = 17;  map[61][12] = 12; map[61][16] = 17; map[61][20] = 12; // Borde sur de la calzada

  // 🌺 Jardines del Prado Suroeste (X: 8..22, Y: 63..68)
  map[64][10] = 18; map[64][11] = 12; // Rocas decorativas con musgo y lavandas
  map[65][16] = 13; map[65][17] = 13; // Parcela de flores silvestres
  map[66][12] = 12; map[66][18] = 17;

  // ⛪ EDIFICIO 7: Capilla y Ermita del Clérigo (Este X: 51, Y: 60)
  map[60][51] = 29; // Templo / Capilla con vidrieras góticas
  map[59][50] = 12; map[59][52] = 12; // Jardín de rosas sagradas
  map[60][47] = 2; map[60][48] = 2; map[60][49] = 2; map[60][50] = 2; // Camino de acceso empedrado
  map[61][52] = 17; // Farola devocional

  // 🐄 EDIFICIO 8: Granero y Establo de Animales (Suroeste X: 25, Y: 72)
  map[72][25] = 5;  // Granero
  map[71][24] = 15; map[71][26] = 15; // Vallas de madera
  map[73][24] = 14; // Pacas de paja dorada

  // 📚 EDIFICIO 9: Biblioteca de los Sabios y Observatorio (Sureste X: 43, Y: 72)
  map[72][43] = 30; // Torre de los Sabios
  map[71][42] = 18; map[71][44] = 18; // Columnas de mármol
  map[73][44] = 12;

  // 🏡 Cabaña Fluvial del Pescador con Muelle (Sur X: 31, Y: 72)
  map[72][31] = 5;
  map[71][30] = 12; map[71][32] = 12;
  map[73][32] = 14; // Barriles

  // 🎣 Muelle de Pescadores en el Río
  map[70][34] = 14; map[71][34] = 14; // Barriles de pesca y redes
  map[70][33] = 17; // Farola del muelle

  // 🌳 JARDINES COMUNITARIOS Y PLAZAS DE DESCANSO (Zonas Verdes Enriquecidas)
  // Jardín Oeste (Entre sendero oeste y plaza)
  map[61][27] = 4;  // Pozo de agua de piedra comunal con polea y cubo
  map[58][27] = 12; map[64][27] = 12; // Bancos de descanso de madera
  map[57][25] = 14; // Carreta de madera de provisiones
  map[59][28] = 12; map[63][28] = 12; // Setos florales con rosas
  map[58][26] = 1;  map[64][26] = 1;  // Manzanos frutales

  // Jardín Este (Entre sendero este y plaza)
  map[61][43] = 4;  // Pozo de agua de piedra comunal
  map[58][43] = 12; map[64][43] = 12; // Bancos de descanso de madera
  map[57][45] = 14; // Carreta de madera
  map[59][42] = 12; map[63][42] = 12; // Setos florales
  map[58][44] = 1;  map[64][44] = 1;  // Manzanos frutales

  // 🛡️ BARRERA NATURAL PERIMETRAL:
  // En cualquier casilla de tierra (tile 0) que limite directamente con el vacío (-1),
  // colocar una barrera natural impenetrable de robles milenarios (1)
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (map[y][x] === 0) {
        const hasVoidNeighbor =
          map[y - 1]?.[x] === -1 ||
          map[y + 1]?.[x] === -1 ||
          map[y]?.[x - 1] === -1 ||
          map[y]?.[x + 1] === -1;
        if (hasVoidNeighbor) {
          map[y][x] = 1; // Robles milenarios densos
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
