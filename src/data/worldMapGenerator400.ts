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
  for (let y = 2; y <= 38; y++) {
    map[y][28] = 21; map[y][29] = 21; map[y][30] = 1;
    map[y][42] = 1; map[y][43] = 21; map[y][44] = 21;
  }
  // Despejar el patio monumental del Castillo de Aethelgard (X: 39..47, Y: 39..44)
  for (let cy = 39; cy <= 44; cy++) {
    for (let cx = 39; cx <= 47; cx++) {
      map[cy][cx] = 0;
    }
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

  // 👑 EDIFICIO 4: Gran Castillo Real de Aethelgard (X: 43, Y: 43, Fachada 160x160 px, Puerta: 43, 44)
  map[43][43] = 31; // Gran Castillo Real de Aethelgard
  map[44][43] = 2;  // Calzada real de acceso directo
  map[45][43] = 2;
  map[46][43] = 2;
  map[44][41] = 18; map[44][45] = 18; // Columnas de mármol de entrada
  map[45][41] = 19; map[45][45] = 19; // Braseros ceremoniales reales

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

  // 🏡 Casona del Valle Sur (Suroeste X: 25, Y: 72)
  map[72][25] = 5;
  map[71][24] = 0; map[71][25] = 0; map[71][26] = 0; // Tejado despejado sin vallas flotantes
  map[73][24] = 12; map[73][26] = 12; // Setos florales decorativos
  map[71][23] = 14; // Barriles junto al porche

  // 🏡 Cabaña Fluvial del Pescador (Sur X: 31, Y: 72)
  map[72][31] = 5;
  map[71][30] = 0; map[71][31] = 0; map[71][32] = 0;
  map[73][30] = 12; map[73][32] = 12; // Setos florales
  map[73][33] = 12; // Banco con vistas al canal

  // 🌊 Ribera Oeste del Canal (Despejada y con farola espaciada)
  map[70][34] = 0; map[71][34] = 0; map[70][33] = 0; // Despejar el borde del agua
  map[69][33] = 17; // Farola en la acera del puente

  // 🌳 Pérgola y Jardín Merendero del Sureste (X: 42..45, Y: 71..73)
  map[71][40] = 2; map[71][41] = 2; map[71][42] = 2; map[71][43] = 2; // Senda ajardinada
  map[72][40] = 2; map[72][41] = 2; map[72][42] = 2; map[72][43] = 2;
  map[71][44] = 12; map[72][44] = 12; // Bancos de descanso de madera
  map[70][42] = 1;  // Manzano frutal sombreado
  map[73][42] = 17; // Farola del jardín
  map[70][44] = 12; map[73][44] = 12; // Setos de rosas florales

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

  // =========================================================================
  // 5. CARVE REGION 5: 🌿 EL JARDÍN PROHIBIDO Y ACCESO AL PANTANO (Oeste Lejano, X: 4..18, Y: 46..74)
  // =========================================================================
  for (let y = 46; y <= 74; y++) {
    for (let x = 4; x <= 18; x++) {
      map[y][x] = 0;
    }
  }
  // 🛣️ Gran Calzada Oeste hacia el Puente del Pantano (Completamente Despejada y Limpia de 3 casillas)
  for (let x = 2; x <= 24; x++) {
    map[59][x] = 2;
    map[60][x] = 2;
    map[61][x] = 2;
  }
  // Limpiar corredor de entrada al puente (X: 2..10, Y: 57..63) garantizando cero obstáculos
  for (let cy = 57; cy <= 63; cy++) {
    for (let cx = 2; cx <= 10; cx++) {
      if (cy >= 59 && cy <= 61) map[cy][cx] = 2;
      else map[cy][cx] = 0; // Hierba limpia sin árboles
    }
  }

  // Setos del laberinto alejados de la calzada
  for (let y = 48; y <= 56; y++) {
    map[y][6] = 1; map[y][16] = 1;
  }
  for (let y = 64; y <= 72; y++) {
    map[y][6] = 1; map[y][16] = 1;
  }

  // 🏛️ Glorieta Monumental ajardinada al norte del camino
  map[54][13] = 18; // Columna clásica con hiedra
  map[54][12] = 12; map[54][14] = 12; // Setos de flores rodeando la columna
  map[52][9] = 7;   // 🎁 Cofre Secreto del Claro del Bosque Oeste

  // =========================================================================
  // 6. CARVE REGION 6: 🌾 VALLE DE LOS VIÑEDOS, MOLINOS Y ACCESO SUR (Suroeste, X: 8..28, Y: 76..112)
  // =========================================================================
  for (let y = 76; y <= 112; y++) {
    for (let x = 8; x <= 28; x++) {
      map[y][x] = 0;
    }
  }
  // Calzada principal norte a sur totalmente limpia y despejada (X: 14..16)
  for (let y = 74; y <= 108; y++) {
    map[y][14] = 2; map[y][15] = 2; map[y][16] = 2;
  }

  // 🏡 Sector Agrícola Oeste: Granjas, Plazoleta del Pozo y Huertos Reales
  map[78][11] = 5;
  map[79][11] = 2; map[79][12] = 2; map[79][13] = 2;
  map[78][10] = 14;

  map[82][11] = 5;
  map[83][11] = 2; map[83][12] = 2; map[83][13] = 2;

  // Plazoleta de Descanso del Pozo
  map[86][11] = 4;
  map[85][11] = 12; map[87][11] = 12;

  // Huerto Real de Cultivo
  for (let y = 90; y <= 98; y++) {
    for (let x = 9; x <= 12; x++) {
      map[y][x] = 13;
    }
  }
  map[104][11] = 8; // Molino de viento
  map[106][11] = 7; // Cofre del molino

  // =========================================================================
  // 7. CARVE REGION 7: 🌲 BOSQUE SOMBRÍO DEL ESTE Y ARBOLEDA (Sureste, X: 44..66, Y: 76..112)
  // =========================================================================
  for (let y = 76; y <= 112; y++) {
    for (let x = 44; x <= 66; x++) {
      map[y][x] = 0;
    }
  }
  // Calzada este hacia el Acceso 5 del Volcán (X: 57..59)
  for (let y = 74; y <= 108; y++) {
    map[y][57] = 2; map[y][58] = 2; map[y][59] = 2;
  }
  map[88][62] = 5; map[89][60] = 2; map[89][61] = 2;
  map[96][62] = 18; map[96][54] = 18;
  map[104][62] = 7;

  // =========================================================================
  // 8. DESPEJAR CALZADAS DE ACCESO NOROESTE (1) Y NORESTE (2)
  // =========================================================================
  for (let y = 10; y <= 46; y++) {
    map[y][14] = 2; map[y][15] = 2; map[y][16] = 2;
  }
  for (let cy = 10; cy <= 18; cy++) {
    for (let cx = 12; cx <= 18; cx++) {
      if (cx >= 14 && cx <= 16) map[cy][cx] = 2;
      else map[cy][cx] = 0;
    }
  }

  for (let y = 10; y <= 46; y++) {
    map[y][57] = 2; map[y][58] = 2; map[y][59] = 2;
  }
  for (let cy = 10; cy <= 18; cy++) {
    for (let cx = 55; cx <= 61; cx++) {
      if (cx >= 57 && cx <= 59) map[cy][cx] = 2;
      else map[cy][cx] = 0;
    }
  }

  // Restaurar la fuente en el centro
  map[60][36] = 4;

  return { tileData: map, width: WIDTH, height: HEIGHT };
}

/**
 * 2. MINAS DE ERIDU / GRAN CIUDADELA ENANA (72x116 - Escala Monumental 100% Conectada y Sin Portales de Jefe)
 */
export function generateCave400(): { tileData: number[][]; width: number; height: number } {
  const WIDTH = 72;
  const HEIGHT = 116;
  const map: number[][] = [];

  // 1. Inicializar todo el mapa con suelo de roca natural de montaña (0 = transitable)
  for (let y = 0; y < HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < WIDTH; x++) {
      // Muros perimetrales exteriores de acantilado sólido (tile 21)
      if (x <= 3 || x >= WIDTH - 4 || y <= 1 || (y >= HEIGHT - 2 && (x < 13 || x > 18))) {
        row.push(21); // Acantilado infranqueable
      } else {
        row.push(0); // Suelo de roca de montaña transitable y continuo
      }
    }
    map.push(row);
  }

  // =========================================================================
  // 2. SECTOR SUR: GRAN CALZADA IMPERIAL Y GUARNICIONES (Y: 86..115)
  // =========================================================================
  // Gran Calzada del Sur (X: 14..17, Y: 88..115)
  for (let y = 88; y < HEIGHT; y++) {
    map[y][14] = 2; map[y][15] = 2; map[y][16] = 2; map[y][17] = 2;
  }
  // Farolas de forja a lo largo de la calzada sur
  for (let y = 92; y <= 112; y += 6) {
    map[y][13] = 17; map[y][18] = 17;
  }

  // Bulevar que curva suavemente hacia la entrada sur de la Ciudadela (X: 15..38, Y: 86..89)
  for (let x = 15; x <= 38; x++) {
    map[86][x] = 2; map[87][x] = 2; map[88][x] = 2; map[89][x] = 2;
  }

  // 🏰 Guarnición y Puesto de Guardia del Cañón Suroeste (X: 8..26, Y: 96..110)
  for (let y = 98; y <= 108; y++) {
    for (let x = 8; x <= 26; x++) {
      map[y][x] = 2; // Explanada adoquinada
    }
  }
  map[100][11] = 5; map[100][23] = 5; // Barracones de guardia
  map[104][17] = 19; // Gran fogata del campamento
  map[102][14] = 14; map[102][20] = 14; // Cajas de armas y suministros
  map[98][9] = 18; map[98][25] = 18; // Torres vigía

  // 💎 Lago de Maná y Cantera de Cristales del Sureste (X: 44..66, Y: 88..112)
  for (let x = 38; x <= 64; x++) {
    map[92][x] = 2; map[93][x] = 2; map[94][x] = 2;
  }
  // Estanque subterráneo de aguas termales de maná
  for (let y = 98; y <= 108; y++) {
    for (let x = 48; x <= 62; x++) {
      if (Math.hypot(x - 55, y - 103) <= 6.5) {
        map[y][x] = 3;
      }
    }
  }
  // Pasarela de madera sobre el agua
  for (let x = 48; x <= 62; x++) {
    map[103][x] = 15;
  }
  map[96][46] = 5; map[96][64] = 5; // Yacimientos de cristales
  map[108][46] = 5; map[108][64] = 5;
  map[103][55] = 7; // Cofre secreto del lago de maná

  // =========================================================================
  // 3. LA GRAN CIUDADELA MINERA DE ERIDU (X: 12..60, Y: 46..86)
  // =========================================================================
  // Gran Avenida Central Norte-Sur (X: 34..38, Y: 46..86)
  for (let y = 46; y <= 86; y++) {
    map[y][34] = 2; map[y][35] = 2; map[y][36] = 2; map[y][37] = 2; map[y][38] = 2;
  }
  // Gran Avenida Transversal Este-Oeste (X: 14..58, Y: 64..68)
  for (let y = 64; y <= 68; y++) {
    for (let x = 14; x <= 58; x++) {
      map[y][x] = 2;
    }
  }
  // Anillo Interior de Bulevares
  for (let y = 50; y <= 53; y++) {
    for (let x = 18; x <= 54; x++) map[y][x] = 2;
  }
  for (let y = 79; y <= 82; y++) {
    for (let x = 18; x <= 54; x++) map[y][x] = 2;
  }

  // 🏛️ Plaza Mayor del Gran Pozo Monumental (X: 28..44, Y: 60..72)
  for (let y = 60; y <= 72; y++) {
    for (let x = 28; x <= 44; x++) {
      map[y][x] = 2;
    }
  }
  map[66][36] = 4; // Gran Pozo Monumental de Agua
  map[66][32] = 12; map[66][40] = 12; // Bancos de cantería
  map[62][36] = 12; map[70][36] = 12;
  map[61][29] = 17; map[61][43] = 17; // Farolas de plaza
  map[71][29] = 17; map[71][43] = 17;

  // 🔨 Distrito de la Gran Fundición Enana (Oeste, X: 14..28, Y: 56..76)
  for (let y = 56; y <= 76; y++) {
    for (let x = 14; x <= 28; x++) {
      map[y][x] = 2;
    }
  }
  map[60][18] = 10; map[70][18] = 10; // Grandes Forjas de Fundición
  map[64][22] = 14; map[66][22] = 14; map[68][22] = 14; // Pilas de lingotes y carbón
  map[58][18] = 19; map[72][18] = 19; // Braseros de fundición

  // 🏘️ Barrio Residencial Norte y Sur (Casas de Cantería)
  map[48][20] = 5; map[48][30] = 5; map[48][42] = 5; map[48][52] = 5;
  map[84][20] = 5; map[84][30] = 5; map[84][42] = 5; map[84][52] = 5;
  map[48][25] = 17; map[48][36] = 17; map[48][47] = 17;
  map[84][25] = 17; map[84][36] = 17; map[84][47] = 17;

  // 📦 Distrito Comercial y Mercado de Suministros (Este, X: 44..58, Y: 56..76)
  for (let y = 56; y <= 76; y++) {
    for (let x = 44; x <= 58; x++) {
      map[y][x] = 2;
    }
  }
  map[60][54] = 14; map[68][54] = 14; // Almacenes de provisiones
  map[64][52] = 4; // Fuente de agua del mercado

  // =========================================================================
  // 4. AVENIDA NORTE: MAZMORRA Y GRANDES GALERÍAS (Y: 18..46)
  // =========================================================================
  // Bulevar Central Norte (X: 34..38, Y: 18..46)
  for (let y = 18; y <= 46; y++) {
    map[y][34] = 2; map[y][35] = 2; map[y][36] = 2; map[y][37] = 2; map[y][38] = 2;
  }
  for (let y = 22; y <= 42; y += 6) {
    map[y][33] = 17; map[y][39] = 17;
  }

  // 🚪 Distrito Este: Entrada a la Mazmorra "Las Profundidades de Eridu" (X: 38..66, Y: 24..38)
  for (let y = 26; y <= 36; y++) {
    for (let x = 38; x <= 66; x++) {
      map[y][x] = 2; // Explanada fortificada
    }
  }
  map[31][62] = 28; // Puerta de la Mazmorra
  map[29][60] = 19; map[29][64] = 19; // Braseros
  map[33][60] = 19; map[33][64] = 19;
  map[31][58] = 18; map[31][66] = 18; // Columnas monumentales
  map[31][52] = 14; map[31][54] = 14;

  // ⛏️ Sector Oeste: Grandes Galerías de Extracción y Vías (X: 8..34, Y: 20..42)
  for (let y = 22; y <= 40; y++) {
    for (let x = 8; x <= 34; x++) {
      map[y][x] = 2;
    }
  }
  // Vías de vagoneta minera
  for (let x = 12; x <= 30; x++) {
    map[26][x] = 15; map[36][x] = 15;
  }
  // Vetas masivas de mineral brillante
  map[22][14] = 5; map[22][28] = 5; map[38][14] = 5; map[38][28] = 5;
  map[30][12] = 5; map[30][30] = 5;
  map[26][20] = 7; map[36][20] = 7; // Cofres mineros

  // =========================================================================
  // 5. CIMA NORTE: GRAN ANFITEATRO DEL GÓLEM DE OBSIDIANA (X: 20..52, Y: 2..18)
  // =========================================================================
  // Gran Arena Circular Adoquinada para el Combate en Tiempo Real
  for (let y = 4; y <= 16; y++) {
    for (let x = 22; x <= 50; x++) {
      map[y][x] = 2;
    }
  }
  // Columnas Ciclópeas y Braseros Mágicos rodeando la arena
  map[4][24] = 18; map[4][48] = 18;
  map[16][24] = 18; map[16][48] = 18;
  map[4][32] = 19; map[4][40] = 19;
  map[16][32] = 19; map[16][40] = 19;

  return { tileData: map, width: WIDTH, height: HEIGHT };
}

/**
 * 3. CRIPTA Y MONASTERIO CAÍDO (72x116 - Escala Colosal Artesanal)
 */
export function generateCrypt400(): { tileData: number[][]; width: number; height: number } {
  const WIDTH = 72;
  const HEIGHT = 116;
  const map: number[][] = [];

  for (let y = 0; y < HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < WIDTH; x++) {
      row.push(-1);
    }
    map.push(row);
  }

  // 1. Calzada de Entrada Sur (X: 52..64, Y: 80..115)
  for (let y = 80; y < HEIGHT; y++) {
    for (let x = 52; x <= 64; x++) {
      map[y][x] = 0;
    }
  }
  for (let y = 80; y < HEIGHT; y++) {
    map[y][57] = 2; map[y][58] = 2; map[y][59] = 2;
  }

  // 2. Claustro y Ruinas del Monasterio (X: 16..56, Y: 46..80)
  for (let y = 46; y <= 80; y++) {
    for (let x = 16; x <= 56; x++) {
      map[y][x] = 0;
    }
  }
  for (let y = 48; y <= 80; y++) {
    map[y][35] = 2; map[y][36] = 2; map[y][37] = 2;
  }
  for (let x = 20; x <= 58; x++) {
    map[64][x] = 2; map[65][x] = 2;
  }
  map[56][24] = 8; map[56][48] = 8; // Mausoleos
  map[72][24] = 8; map[72][48] = 8;
  map[64][36] = 18; map[60][36] = 28; // Altar central y sarcófago
  map[52][36] = 7;

  // 3. Catacumbas y Biblioteca Prohibida (X: 8..64, Y: 16..46)
  for (let y = 16; y <= 46; y++) {
    for (let x = 8; x <= 64; x++) {
      const isHallW = Math.hypot(x - 22, y - 30) <= 12;
      const isHallE = Math.hypot(x - 50, y - 30) <= 12;
      const isAvenue = x >= 33 && x <= 39;
      if (isHallW || isHallE || isAvenue) {
        map[y][x] = 0;
      }
    }
  }
  map[28][22] = 7; map[28][50] = 7;

  // 4. Santuario del Lich Malakor (Norte X: 28..44, Y: 2..16)
  for (let y = 2; y <= 16; y++) {
    for (let x = 28; x <= 44; x++) {
      map[y][x] = 0;
    }
  }
  for (let y = 4; y <= 20; y++) {
    map[y][35] = 2; map[y][36] = 2; map[y][37] = 2;
  }
  map[6][36] = 11;
  map[6][33] = 18; map[6][39] = 18;
  map[8][33] = 19; map[8][39] = 19;

  return { tileData: map, width: WIDTH, height: HEIGHT };
}

/**
 * 4. PANTANO SOMBRÍO DE VAEL (72x116 - Escala Monumental con Aldea Flotante y Puentes Reales)
 */
export function generateSwamp400(): { tileData: number[][]; width: number; height: number } {
  const WIDTH = 72;
  const HEIGHT = 116;
  const map: number[][] = [];

  // 1. Inicializar con aguas poco profundas de ciénaga y bordes de acantilado
  for (let y = 0; y < HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < WIDTH; x++) {
      if (x <= 3 || x >= WIDTH - 4 || y <= 1 || y >= HEIGHT - 2) {
        // En la entrada este (Y: 58..62, X: 68..71) dejar paso abierto
        if (x >= WIDTH - 4 && y >= 58 && y <= 62) {
          row.push(2);
        } else {
          row.push(21); // Acantilado infranqueable
        }
      } else {
        row.push(3); // Ciénaga de agua
      }
    }
    map.push(row);
  }

  // =========================================================================
  // 2. ENTRADA ESTE: GRAN PUENTE IMPERIAL CONECTADO CON AETHELGARD (Y: 58..62)
  // =========================================================================
  for (let y = 58; y <= 62; y++) {
    for (let x = 50; x < WIDTH; x++) {
      map[y][x] = 2; // Gran calzada de piedra y madera sólida (Capa 0)
    }
  }
  for (let x = 54; x <= 66; x += 4) {
    map[57][x] = 17; map[63][x] = 17; // Farolas de puente
  }

  // =========================================================================
  // 3. LA GRAN ALDEA FLOTANTE DE PALAFITOS DE VAEL (X: 14..56, Y: 46..86)
  // =========================================================================
  // Gran Plataforma Central y Avenidas Principales (Tile 2)
  for (let y = 46; y <= 86; y++) {
    map[y][34] = 2; map[y][35] = 2; map[y][36] = 2; map[y][37] = 2; map[y][38] = 2;
  }
  for (let y = 58; y <= 62; y++) {
    for (let x = 14; x <= 56; x++) map[y][x] = 2;
  }
  // Anillo de Pasarelas Residenciales
  for (let y = 50; y <= 53; y++) {
    for (let x = 18; x <= 54; x++) map[y][x] = 2;
  }
  for (let y = 78; y <= 81; y++) {
    for (let x = 18; x <= 54; x++) map[y][x] = 2;
  }

  // 🏛️ Plaza Mayor del Gran Pozo del Pantano (X: 28..44, Y: 56..68)
  for (let y = 56; y <= 68; y++) {
    for (let x = 28; x <= 44; x++) map[y][x] = 2;
  }
  map[62][36] = 4; // Gran Pozo de Aguas Puras
  map[62][32] = 12; map[62][40] = 12; // Bancos de descanso
  map[58][36] = 12; map[66][36] = 12;
  map[57][29] = 17; map[57][43] = 17; // Farolas de plaza
  map[67][29] = 17; map[67][43] = 17;

  // 🧪 Choza de la Bruja y Taller Alquímico (Oeste, X: 16..28, Y: 54..72)
  for (let y = 54; y <= 72; y++) {
    for (let x = 16; x <= 28; x++) map[y][x] = 2;
  }
  map[62][20] = 5; // Choza de la Bruja
  map[60][24] = 19; map[64][24] = 19; // Calderos humeantes
  map[62][24] = 14; map[58][20] = 14; map[66][20] = 14; // Barriles de pociones

  // 🏘️ Barrios de Palafitos Norte y Sur (Casas de Pescadores sobre Pilotes)
  map[48][20] = 5; map[48][30] = 5; map[48][42] = 5; map[48][52] = 5;
  map[84][20] = 5; map[84][30] = 5; map[84][42] = 5; map[84][52] = 5;
  map[48][25] = 17; map[48][36] = 17; map[48][47] = 17;
  map[84][25] = 17; map[84][36] = 17; map[84][47] = 17;

  // 🎣 Distrito de Muelles y Pescadores (Este, X: 44..56, Y: 56..72)
  for (let y = 56; y <= 72; y++) {
    for (let x = 44; x <= 56; x++) map[y][x] = 2;
  }
  map[60][52] = 14; map[66][52] = 14; // Barriles de pescado y redes
  map[63][50] = 4; // Pozo de agua fresca

  // =========================================================================
  // 4. RUTAS SECUNDARIAS DEL PANTANO (72x116)
  // =========================================================================
  // 🍄 Sudoeste: Los Manglares Venenosos y Bosque de Esporas (X: 8..34, Y: 86..112)
  for (let y = 88; y <= 108; y++) {
    for (let x = 12; x <= 32; x++) {
      if (x >= 20 && x <= 24) map[y][x] = 2; // Calzada principal sur
      else if (Math.hypot(x - 18, y - 98) <= 8 || Math.hypot(x - 28, y - 102) <= 7) {
        map[y][x] = 0; // Islotes de tierra firme
      }
    }
  }
  map[98][18] = 7; map[102][28] = 7; // Cofres de reliquias del fango
  map[100][22] = 19; // Fogata de campamento

  // 🏛️ Sureste: Archipiélago de las Ruinas Hundidas (X: 44..66, Y: 86..112)
  for (let y = 88; y <= 108; y++) {
    for (let x = 46; x <= 62; x++) {
      if (x >= 48 && x <= 52) map[y][x] = 2;
      else if (Math.hypot(x - 56, y - 98) <= 7) map[y][x] = 0;
    }
  }
  map[96][56] = 18; map[104][56] = 18; // Columnas sumergidas
  map[100][56] = 7; // Cofre de las ruinas

  // 🚪 Noroeste: Distrito de la Mazmorra "La Cripta Sumergida de Vael" (X: 8..34, Y: 18..44)
  for (let y = 26; y <= 34; y++) {
    for (let x = 10; x <= 34; x++) map[y][x] = 2;
  }
  for (let y = 24; y <= 36; y++) {
    for (let x = 10; x <= 22; x++) map[y][x] = 2; // Gran explanada de la mazmorra
  }
  map[30][14] = 28; // Puerta de la Mazmorra Instanciada
  map[28][12] = 19; map[28][16] = 19;
  map[32][12] = 19; map[32][16] = 19;
  map[30][10] = 18; map[30][18] = 18;

  // =========================================================================
  // 5. CIMA NORTE: GRAN SANTUARIO DE LA REINA SERPIENTE GORGONA (X: 20..52, Y: 2..18)
  // =========================================================================
  // Avenida Ceremonial Norte
  for (let y = 16; y <= 46; y++) {
    map[y][34] = 2; map[y][35] = 2; map[y][36] = 2; map[y][37] = 2; map[y][38] = 2;
  }
  // Gran Arena Circular de Piedra para el Combate en Tiempo Real
  for (let y = 4; y <= 16; y++) {
    for (let x = 22; x <= 50; x++) {
      map[y][x] = 2;
    }
  }
  // Columnas Serpentinas y Braseros de Fuego Esmeralda
  map[4][24] = 18; map[4][48] = 18;
  map[16][24] = 18; map[16][48] = 18;
  map[4][32] = 19; map[4][40] = 19;
  map[16][32] = 19; map[16][40] = 19;

  return { tileData: map, width: WIDTH, height: HEIGHT };
}

/**
 * 5. COSTA Y CALETA DE CONTRABANDISTAS (72x116 - Escala Monumental con Gran Puerto Corsario)
 */
export function generateCoast400(): { tileData: number[][]; width: number; height: number } {
  const WIDTH = 72;
  const HEIGHT = 116;
  const map: number[][] = [];

  // 1. Inicializar con mar profundo y acantilados exteriores
  for (let y = 0; y < HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < WIDTH; x++) {
      if (x <= 3 || x >= WIDTH - 4 || y >= HEIGHT - 2 || (y <= 1 && (x < 13 || x > 18))) {
        row.push(21); // Acantilado infranqueable
      } else {
        row.push(3); // Mar abierto profundo
      }
    }
    map.push(row);
  }

  // =========================================================================
  // 2. ENTRADA NORTE: GRAN CALZADA DEL ACANTILADO (Y: 0..24)
  // =========================================================================
  for (let y = 0; y <= 22; y++) {
    for (let x = 14; x <= 17; x++) {
      map[y][x] = 2; // Calzada de piedra sólida
    }
  }
  for (let y = 4; y <= 20; y += 4) {
    map[y][13] = 17; map[y][18] = 17; // Farolas náuticas
  }
  // Curva hacia el centro del Puerto Corsario
  for (let x = 15; x <= 36; x++) {
    map[22][x] = 2; map[23][x] = 2; map[24][x] = 2;
  }

  // =========================================================================
  // 3. LA GRAN CIUDADELA Y PUERTO CORSARIO DE PUERTO NEGRO (X: 14..58, Y: 24..72)
  // =========================================================================
  // Gran Bulevar Central y Explanada (Tile 2)
  for (let y = 24; y <= 72; y++) {
    map[y][34] = 2; map[y][35] = 2; map[y][36] = 2; map[y][37] = 2; map[y][38] = 2;
  }
  for (let y = 44; y <= 48; y++) {
    for (let x = 14; x <= 58; x++) map[y][x] = 2;
  }
  // Anillo de Pasarelas y Muelles
  for (let y = 32; y <= 35; y++) {
    for (let x = 18; x <= 54; x++) map[y][x] = 2;
  }
  for (let y = 62; y <= 65; y++) {
    for (let x = 18; x <= 54; x++) map[y][x] = 2;
  }

  // 🏛️ Plaza Mayor del Gran Faro (X: 28..44, Y: 42..54)
  for (let y = 42; y <= 54; y++) {
    for (let x = 28; x <= 44; x++) map[y][x] = 2;
  }
  map[48][36] = 18; // Gran Faro de Cantería Marina
  map[48][32] = 4;  // Pozo de agua dulce
  map[48][40] = 12; map[44][36] = 12; map[52][36] = 12; // Bancos
  map[43][29] = 17; map[43][43] = 17; // Farolas de plaza
  map[53][29] = 17; map[53][43] = 17;

  // ⚓ Distrito de Muelles y Astillero (Este, X: 44..58, Y: 36..60)
  for (let y = 36; y <= 60; y++) {
    for (let x = 44; x <= 58; x++) map[y][x] = 2;
  }
  map[40][52] = 5; map[56][52] = 5; // Almacenes de contrabando
  map[44][48] = 14; map[48][48] = 14; map[52][48] = 14; // Barriles de ron y anclas

  // 🍻 Barrio de Pescadores y Taberna Pirata (Oeste, X: 14..28, Y: 36..60)
  for (let y = 36; y <= 60; y++) {
    for (let x = 14; x <= 28; x++) map[y][x] = 2;
  }
  map[40][20] = 5; map[56][20] = 5; // Cabañas corsarias
  map[48][20] = 10; // Forja y calafateado de anclas
  map[44][24] = 14; map[52][24] = 14;

  // 🏘️ Barrios Residenciales Norte y Sur
  map[30][20] = 5; map[30][30] = 5; map[30][42] = 5; map[30][52] = 5;
  map[68][20] = 5; map[68][30] = 5; map[68][42] = 5; map[68][52] = 5;
  map[30][25] = 17; map[30][36] = 17; map[30][47] = 17;
  map[68][25] = 17; map[68][36] = 17; map[68][47] = 17;

  // =========================================================================
  // 4. RUTAS SECUNDARIAS DEL LITORAL (72x116)
  // =========================================================================
  // ⛵ Este: Bahía del Gran Galeón Encallado (X: 44..66, Y: 72..96)
  for (let y = 74; y <= 94; y++) {
    for (let x = 46; x <= 62; x++) {
      if (y >= 78 && y <= 82) map[y][x] = 2; // Pasarela de abordaje
      else if (Math.hypot(x - 56, y - 84) <= 8) map[y][x] = 0; // Islote arenoso
    }
  }
  map[84][56] = 19; // Fogata pirata
  map[80][60] = 7; map[88][52] = 7; // Cofres del Gran Botín del Galeón
  map[82][54] = 14; map[86][54] = 14;

  // 🏖️ Sudoeste: Calas Secretas y Pozas de Marea (X: 8..34, Y: 72..96)
  for (let y = 74; y <= 94; y++) {
    for (let x = 12; x <= 32; x++) {
      if (x >= 20 && x <= 24) map[y][x] = 2;
      else if (Math.hypot(x - 18, y - 84) <= 8 || Math.hypot(x - 28, y - 88) <= 7) {
        map[y][x] = 0; // Arena firme de playa
      }
    }
  }
  map[84][18] = 19; // Fogata de náufragos
  map[80][14] = 7; map[90][26] = 7; // Cofres enterrados

  // 🚪 Noroeste: Distrito de la Mazmorra "La Gruta Secreta de Contrabandistas" (X: 8..34, Y: 10..32)
  for (let y = 14; y <= 22; y++) {
    for (let x = 10; x <= 34; x++) map[y][x] = 2;
  }
  for (let y = 12; y <= 24; y++) {
    for (let x = 10; x <= 20; x++) map[y][x] = 2; // Explanada de la Gruta
  }
  map[18][12] = 28; // Entrada a la Mazmorra Instanciada
  map[16][10] = 19; map[16][14] = 19;
  map[20][10] = 19; map[20][14] = 19;
  map[18][8] = 18; map[18][16] = 18;

  // =========================================================================
  // 5. BAHÍA SUR: SANTUARIO DEL LEVIATÁN DE LAS MAREAS (X: 20..52, Y: 96..114)
  // =========================================================================
  // Gran Calzada Marina hacia el Arrecife
  for (let y = 72; y <= 100; y++) {
    map[y][34] = 2; map[y][35] = 2; map[y][36] = 2; map[y][37] = 2; map[y][38] = 2;
  }
  // Gran Arena Circular de Arrecife para el Combate en Tiempo Real
  for (let y = 100; y <= 112; y++) {
    for (let x = 22; x <= 50; x++) {
      map[y][x] = 2;
    }
  }
  // Columnas de Coral y Braseros Náuticos
  map[100][24] = 18; map[100][48] = 18;
  map[112][24] = 18; map[112][48] = 18;
  map[100][32] = 19; map[100][40] = 19;
  map[112][32] = 19; map[112][40] = 19;

  return { tileData: map, width: WIDTH, height: HEIGHT };
}

/**
 * 6. GARGANTA DEL VOLCÁN IGNIS (72x116 - Escala Colosal Artesanal)
 */
export function generateVolcano400(): { tileData: number[][]; width: number; height: number } {
  const WIDTH = 72;
  const HEIGHT = 116;
  const map: number[][] = [];

  for (let y = 0; y < HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < WIDTH; x++) {
      row.push(-1);
    }
    map.push(row);
  }

  // 1. Calzada de Entrada Norte (X: 52..64, Y: 0..20)
  for (let y = 0; y <= 20; y++) {
    for (let x = 52; x <= 64; x++) {
      map[y][x] = 0;
    }
  }
  for (let y = 0; y <= 20; y++) {
    map[y][57] = 2; map[y][58] = 2; map[y][59] = 2;
  }

  // 2. Fortaleza de los Titanes del Fuego (X: 14..58, Y: 20..76)
  for (let y = 20; y <= 76; y++) {
    for (let x = 14; x <= 58; x++) {
      if (Math.hypot(x - 36, y - 48) <= 22) {
        map[y][x] = 0;
      }
    }
  }
  for (let y = 20; y <= 76; y++) {
    map[y][35] = 2; map[y][36] = 2; map[y][37] = 2;
  }
  for (let x = 18; x <= 58; x++) {
    map[48][x] = 2; map[49][x] = 2;
  }
  // Forja Ancestral de Magma
  map[48][36] = 10;
  map[42][26] = 19; map[42][46] = 19;
  map[54][26] = 19; map[54][46] = 19;
  map[38][36] = 7; map[58][36] = 7;

  // 3. Caldera del Draco Primordial Ignis (Sur X: 28..44, Y: 96..112)
  for (let y = 96; y <= 112; y++) {
    for (let x = 28; x <= 44; x++) {
      map[y][x] = 0;
    }
  }
  for (let y = 74; y <= 104; y++) {
    map[y][35] = 2; map[y][36] = 2; map[y][37] = 2;
  }
  map[106][36] = 11;
  map[106][33] = 19; map[106][39] = 19;

  return { tileData: map, width: WIDTH, height: HEIGHT };
}

/**
 * 7. PICOS HELADOS DE FROSTFALL (72x116 - Escala Colosal)
 */
export function generateTundra400(): { tileData: number[][]; width: number; height: number } {
  return generateCave400();
}

/**
 * 8. CIUDADELA IMPERIAL (72x116 - Escala Colosal)
 */
export function generateCastle400(): { tileData: number[][]; width: number; height: number } {
  return generateCrypt400();
}

export function generateVoid400(): { tileData: number[][]; width: number; height: number } {
  return generateCastle400();
}

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
