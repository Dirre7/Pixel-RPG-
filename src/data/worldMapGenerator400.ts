/**
 * 🗺️ GENERADOR MAESTRO DE MUNDOS EXPANDIDOS Y VIVOS (400x400 - 160.000 BALDOSAS)
 * Biomas de alta densidad con múltiples pueblos, aldeas, granjas, parques reales,
 * zonas de peligro con enemigos élite, cementerios, puertos y ruinas antiguas.
 */

export const MAP_SIZE = 400;

/**
 * 🌲 1. REINO DE AETHELGARD: BOSQUE ESMERALDA, CIUDADES Y BIOMAS (400x400)
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

  // 2. Gran Río Fluvial de Aethelgard con meandros naturales
  for (let y = 4; y < MAP_SIZE - 4; y++) {
    const rx = Math.round(200 + Math.sin(y * 0.035) * 35 + Math.cos(y * 0.08) * 10);
    for (let offset = -4; offset <= 4; offset++) {
      const cx = rx + offset;
      if (cx > 4 && cx < MAP_SIZE - 4) {
        map[y][cx] = 3; // Agua
      }
    }
  }

  // 3. Gran Lago Sagrado Oriental (X: 275..345, Y: 195..275)
  for (let y = 195; y <= 275; y++) {
    for (let x = 275; x <= 345; x++) {
      const dist = Math.hypot((x - 310) / 32, (y - 235) / 38);
      if (dist <= 1.0) {
        map[y][x] = 3;
      }
    }
  }
  // Isla Sagrada del Templo
  for (let y = 230; y <= 242; y++) {
    for (let x = 304; x <= 316; x++) {
      map[y][x] = 2;
    }
  }
  map[236][310] = 8; // Santuario de la Dama del Lago
  map[236][306] = 17; // Farola
  map[236][314] = 17; // Farola
  // Gran Puente de Piedra hacia la Isla
  for (let x = 250; x <= 304; x++) {
    map[236][x] = 2;
  }

  // 4. Puentes Monumentales sobre el Gran Río (con farolas en los extremos)
  const bridgesY = [55, 125, 195, 265, 335];
  bridgesY.forEach((by) => {
    for (let y = by - 2; y <= by + 2; y++) {
      for (let x = 145; x <= 255; x++) {
        if (map[y][x] === 3) {
          map[y][x] = 2; // Calzada de madera reforzada
        }
      }
    }
    map[by - 3][170] = 17; map[by + 3][170] = 17;
    map[by - 3][230] = 17; map[by + 3][230] = 17;
  });

  // 5. Red de Carreteras Imperiales y Farolas de Camino
  // Autopistas Horizontales
  [55, 125, 195, 265, 335].forEach((hy) => {
    for (let x = 15; x < MAP_SIZE - 15; x++) {
      if (map[hy][x] !== 3) {
        map[hy][x] = 2;
        if (x % 14 === 0) map[hy - 1][x] = 17; // Farola de camino cada 14 casillas
      }
    }
  });
  // Autopistas Verticales
  [88, 155, 250, 320].forEach((vx) => {
    for (let y = 15; y < MAP_SIZE - 15; y++) {
      if (map[y][vx] !== 3) {
        map[y][vx] = 2;
        if (y % 14 === 0) map[y][vx + 1] = 17; // Farola
      }
    }
  });

  // =========================================================================
  // 🏰 A. CIUDAD CAPITAL DE ROBLE (Centro-Oeste: X: 70..115, Y: 70..115)
  // =========================================================================
  for (let y = 70; y <= 115; y++) {
    for (let x = 70; x <= 115; x++) {
      if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
    }
  }
  // Plaza Mayor Monumental de Adoquines
  for (let y = 82; y <= 98; y++) {
    for (let x = 82; x <= 98; x++) {
      map[y][x] = 2;
    }
  }
  // Jardines de flores rodeando la plaza
  for (let x = 83; x <= 97; x++) {
    map[81][x] = 12; map[99][x] = 12;
  }
  for (let y = 82; y <= 98; y++) {
    map[y][81] = 12; map[y][99] = 12;
  }
  // Farolas en las esquinas de la plaza
  map[83][83] = 17; map[83][97] = 17; map[97][83] = 17; map[97][97] = 17;
  map[88][88] = 4;  // Gran Fuente / Pozo de Agua de la Capital

  // Edificios Mayores de la Capital
  map[76][76] = 5;   // Taberna del Dragón Verde
  map[76][88] = 8;   // Cabaña del Anciano Sabio
  map[76][100] = 10; // Forja y Taller del Herrero Brom
  map[100][76] = 9;  // Gran Mercado Central (Casita Azul)
  map[100][88] = 8;  // Santuario de los Sanadores
  map[100][100] = 6; // Molino de Viento Imperial
  map[90][76] = 5;   // Posada de Descanso
  map[76][94] = 9;   // Tienda de Alquimia

  // =========================================================================
  // 🌷 B. GRAN PARQUE REAL Y JARDINES BOTÁNICOS (X: 130..175, Y: 70..115)
  // =========================================================================
  for (let y = 70; y <= 115; y++) {
    for (let x = 130; x <= 175; x++) {
      if ((x + y) % 4 === 0) {
        map[y][x] = 12; // Parterres de rosas y flores
      } else if (x === 152 || y === 92) {
        map[y][x] = 2;  // Paseos de grava
      }
    }
  }
  map[92][152] = 4;  // Fuente Ornamental del Parque
  map[85][145] = 17; map[85][160] = 17; map[100][145] = 17; map[100][160] = 17;
  map[92][136] = 8;  // Santuario de la Serenidad Floral

  // =========================================================================
  // 🌾 C. GRANJA REAL Y CAMPOS DE TRIGO DORADO (Noroeste: X: 20..65, Y: 20..65)
  // =========================================================================
  for (let y = 20; y <= 65; y++) {
    for (let x = 20; x <= 65; x++) {
      if (y % 8 >= 2 && y % 8 <= 6 && x % 8 >= 2 && x % 8 <= 6) {
        map[y][x] = 13; // Campos de trigo dorado
      }
    }
  }
  // Caminos entre campos
  for (let x = 20; x <= 65; x++) { map[35][x] = 2; map[50][x] = 2; }
  for (let y = 20; y <= 65; y++) { map[y][35] = 2; map[y][50] = 2; }
  map[25][25] = 6;  // Molino de Viento Norte
  map[45][25] = 6;  // Molino de Viento Sur
  map[25][55] = 5;  // Granero / Cabaña Campesina
  map[45][55] = 4;  // Pozo de Riego
  map[35][35] = 19; // Fogata campesina

  // =========================================================================
  // 🏹 D. PUEBLO FORESTAL DE CAZADORES Y DRUIDAS (Suroeste: X: 25..75, Y: 310..365)
  // =========================================================================
  for (let y = 310; y <= 365; y++) {
    for (let x = 25; x <= 75; x++) {
      if (x % 7 === 0 || y % 7 === 0) map[y][x] = 2;
    }
  }
  map[325][35] = 5;  // Cabaña de Cazadores
  map[325][55] = 9;  // Puesto de Arquería
  map[345][35] = 8;  // Santuario Druídico Ancestral
  map[345][55] = 10; // Forja de Flechas
  map[335][45] = 19; // Gran Fogata Central de Cazadores
  map[335][40] = 18; map[335][50] = 18; // Círculo de Menhires Místicos
  map[330][45] = 17; map[340][45] = 17;

  // =========================================================================
  // ⚓ E. PUEBLO PESQUERO Y MUELLES DEL LAGO (Este: X: 240..275, Y: 200..260)
  // =========================================================================
  for (let y = 200; y <= 260; y++) {
    for (let x = 240; x <= 275; x++) {
      if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
    }
  }
  // Muelles de madera que entran en el lago
  for (let y = 210; y <= 250; y += 10) {
    for (let x = 265; x <= 285; x++) {
      map[y][x] = 15; // Tablones de muelle sobre agua
    }
    map[y][286] = 17; // Farol en la punta del muelle
  }
  map[215][248] = 9;  // Lonja de Pescadores
  map[235][248] = 5;  // Taberna de la Sirena
  map[248][248] = 4;  // Pozo de Agua de Puerto

  // =========================================================================
  // ⚔️ F. PUESTO DE AVANZADA MILITAR DE LA FRONTERA (X: 175..215, Y: 45..75)
  // =========================================================================
  for (let y = 45; y <= 75; y++) {
    for (let x = 175; x <= 215; x++) {
      if (map[y][x] !== 3 && (x % 5 === 0 || y % 5 === 0)) map[y][x] = 2;
    }
  }
  map[50][185] = 5;  // Cuartel de la Guardia
  map[65][185] = 10; // Armería de Campaña
  map[55][190] = 19; // Fogata de Guardia
  map[55][180] = 17; map[55][200] = 17; // Antorchas

  // =========================================================================
  // ⚠️ G. TIERRAS CALCINADAS Y GUARIDA DE LA BESTIA ÉLITE (Sureste: X: 285..360, Y: 285..360)
  // =========================================================================
  for (let y = 285; y <= 360; y++) {
    for (let x = 285; x <= 360; x++) {
      const d = Math.hypot((x - 325) / 30, (y - 325) / 30);
      if (d <= 1.0) {
        map[y][x] = 14; // Tierra calcinada maldita
      }
    }
  }
  // Altar de la Bestia Élite
  for (let y = 320; y <= 330; y++) {
    for (let x = 320; x <= 330; x++) {
      map[y][x] = 2;
    }
  }
  map[325][325] = 19; // Gran Fuego Maldito
  map[322][322] = 18; map[322][328] = 18; map[328][322] = 18; map[328][328] = 18; // Columnas rotas
  map[320][325] = 7;  map[330][325] = 7; // Cofres del Tesoro de Élite
  map[325][320] = 7;  map[325][330] = 7;

  // =========================================================================
  // 🪦 H. CEMENTERIO ANTIGUO Y CRIPTA DE LOS REYES (X: 130..170, Y: 280..320)
  // =========================================================================
  for (let y = 280; y <= 320; y++) {
    for (let x = 130; x <= 170; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
      else if ((x * 3 + y * 7) % 5 === 0) map[y][x] = 16; // Lápidas góticas
    }
  }
  map[300][150] = 8;  // Mausoleo / Cripta Ancestral
  map[295][145] = 18; map[295][155] = 18; map[305][145] = 18; map[305][155] = 18;
  map[300][140] = 7;  map[300][160] = 7; // Cofres antiguos

  // =========================================================================
  // 👑 I. CÁMARA Y ALTAR MONUMENTAL DEL GRAN REY SLIME (Noreste: X: 345..375, Y: 60..90)
  // =========================================================================
  for (let y = 60; y <= 90; y++) {
    for (let x = 345; x <= 375; x++) {
      map[y][x] = 2; // Gran Plaza de Mármol Imperial
    }
  }
  // Columnas rúnicas rodeando el portal
  map[68][352] = 18; map[68][368] = 18; map[82][352] = 18; map[82][368] = 18;
  map[75][350] = 17; map[75][370] = 17;
  map[75][360] = 11; // Portal del Gran Rey Slime

  // =========================================================================
  // 1. MIRADOR DE LA CASCADA DEL NORTE (X: 160..190, Y: 12..28)
  // =========================================================================
  for (let y = 12; y <= 28; y++) {
    for (let x = 160; x <= 190; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[20][175] = 5;  // Cabaña de Exploradores del Norte
  map[20][168] = 19; // Fogata
  map[20][182] = 17; // Farola
  map[16][175] = 4;  // Pozo de agua de manantial
  map[24][175] = 7;  // Cofre del Mirador Norte

  // =========================================================================
  // 2. ASERRADERO Y CABAÑAS DE LEÑADORES DEL NORTE (X: 245..310, Y: 12..28)
  // =========================================================================
  for (let y = 12; y <= 28; y++) {
    for (let x = 245; x <= 310; x++) {
      if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
    }
  }
  map[20][260] = 5;  // Cabaña de Leñadores 1
  map[20][280] = 9;  // Almacén de Madera
  map[20][270] = 4;  // Pozo
  map[20][295] = 7;  // Cofre del Aserradero
  map[16][260] = 17; map[16][280] = 17;

  // =========================================================================
  // 3. PASO DEL ERMITAÑO FLORAL (X: 110..145, Y: 30..48)
  // =========================================================================
  for (let y = 30; y <= 48; y++) {
    for (let x = 110; x <= 145; x++) {
      map[y][x] = (x + y) % 3 === 0 ? 12 : 0;
    }
  }
  map[38][125] = 5;  // Cabaña del Ermitaño
  map[38][120] = 19; // Fogata
  map[38][130] = 17; // Farola
  map[38][138] = 7;  // Cofre del Ermitaño

  // =========================================================================
  // 4. ALDEA DE LA ARBOLEDA VIEJA (X: 15..45, Y: 125..185)
  // =========================================================================
  for (let y = 125; y <= 185; y++) {
    for (let x = 15; x <= 45; x++) {
      if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
    }
  }
  map[140][28] = 5;  // Cabaña de la Arboleda
  map[165][28] = 9;  // Cabaña de Hierbas
  map[152][28] = 4;  // Pozo de Agua Dulce
  map[140][35] = 7;  // Cofre
  map[165][35] = 17; // Farola

  // =========================================================================
  // 5. CAMPO DE TIRO Y ADIESTRAMIENTO DE GUARDIAS (X: 55..85, Y: 135..165)
  // =========================================================================
  for (let y = 135; y <= 165; y++) {
    for (let x = 55; x <= 85; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[148][70] = 5;  // Puesto de Guardia
  map[158][70] = 19; // Fogata de Adiestramiento
  map[148][60] = 18; map[148][80] = 18; // Dianas / Columnas
  map[148][78] = 7;  // Cofre de Armas

  // =========================================================================
  // 6. CAMPAMENTO DE EXPLORADORES DE LA ARBOLEDA (X: 85..125, Y: 165..190)
  // =========================================================================
  for (let y = 165; y <= 190; y++) {
    for (let x = 85; x <= 125; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[175][105] = 5;  // Cabaña de Exploradores
  map[182][105] = 19; // Fogata
  map[175][98] = 17;  // Farola
  map[175][118] = 7;  // Cofre de Provisiones

  // =========================================================================
  // 7. EMBARCADERO Y PUESTO FLUVIAL DEL RÍO (X: 180..215, Y: 105..135)
  // =========================================================================
  for (let y = 105; y <= 135; y++) {
    for (let x = 180; x <= 215; x++) {
      if (map[y][x] !== 3 && (x % 5 === 0 || y % 5 === 0)) map[y][x] = 2;
    }
  }
  map[118][188] = 5;  // Cabaña del Barquero
  map[118][196] = 15; // Muelle de madera sobre agua
  map[112][196] = 17; // Farol de muelle
  map[125][188] = 19; // Fogata de Pescadores
  map[110][188] = 7;  // Cofre de Redes

  // =========================================================================
  // 8. ALDEA DE LA FRUTA SILVESTRE Y HUERTO ORIENTAL (X: 245..290, Y: 95..125)
  // =========================================================================
  for (let y = 95; y <= 125; y++) {
    for (let x = 245; x <= 290; x++) {
      if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
      else if (x >= 260 && x <= 275 && y >= 112 && y <= 122) map[y][x] = 13; // Huerto de trigo
    }
  }
  map[105][260] = 5;  // Cabaña de Recolectores
  map[105][275] = 9;  // Puesto de Frutas
  map[105][268] = 4;  // Pozo de Agua
  map[105][285] = 7;  // Cofre de la Cosecha
  map[98][268] = 17;

  // =========================================================================
  // 9. GRAN ASENTAMIENTO DEL BOSQUE ORIENTAL (X: 310..370, Y: 135..165)
  // =========================================================================
  for (let y = 135; y <= 165; y++) {
    for (let x = 310; x <= 370; x++) {
      if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
    }
  }
  map[148][325] = 5;  // Casa del Este 1
  map[148][345] = 9;  // Mercado del Este
  map[148][360] = 5;  // Casa del Este 2
  map[138][335] = 6;  // Molino de Viento Oriental
  map[155][345] = 4;  // Pozo de la Plaza Este
  map[148][365] = 7;  // Cofre Oriental
  map[140][345] = 17; map[156][345] = 17;

  // =========================================================================
  // 10. CANTERA DE PIEDRA Y FORJA MENOR (X: 35..75, Y: 200..245)
  // =========================================================================
  for (let y = 200; y <= 245; y++) {
    for (let x = 35; x <= 75; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[215][55] = 5;  // Cabaña de Canteros
  map[215][65] = 10; // Forja de Piedra
  map[215][45] = 4;  // Pozo
  map[230][50] = 18; map[230][60] = 18; // Bloques de Cantera / Columnas
  map[225][70] = 7;  // Cofre de Minerales

  // =========================================================================
  // 11. MIRADOR DEL GRAN RÍO Y MERENDERO (X: 155..210, Y: 200..235)
  // =========================================================================
  for (let y = 200; y <= 235; y++) {
    for (let x = 155; x <= 210; x++) {
      if (map[y][x] !== 3) {
        if ((x + y) % 3 === 0) map[y][x] = 12; // Parterre de flores
        else if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2; // Paseo de losas
      }
    }
  }
  map[215][175] = 4;  // Fuente del Mirador
  map[210][170] = 17; map[210][180] = 17;
  map[215][188] = 7;  // Cofre del Mirador

  // =========================================================================
  // 12. JARDÍN MÍSTICO DE ALQUIMIA (X: 90..135, Y: 230..270)
  // =========================================================================
  for (let y = 230; y <= 270; y++) {
    for (let x = 90; x <= 135; x++) {
      if ((x + y) % 3 === 0) map[y][x] = 12;
      else if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
    }
  }
  map[250][112] = 8;  // Santuario Místico de Flores
  map[250][104] = 18; map[250][120] = 18; // Círculo de Menhires
  map[242][112] = 7;  // Cofre Místico

  // =========================================================================
  // 13. RUINAS DE LA VIEJA ERMITA (X: 15..50, Y: 260..290)
  // =========================================================================
  for (let y = 260; y <= 290; y++) {
    for (let x = 15; x <= 50; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[275][35] = 8;  // Altar de la Ermita
  map[270][25] = 18; map[270][45] = 18; map[280][25] = 18; map[280][45] = 18;
  map[275][40] = 7;  // Cofre Sagrado

  // =========================================================================
  // 14. PUESTO FRONTERIZO DEL SUR (X: 90..145, Y: 340..370)
  // =========================================================================
  for (let y = 340; y <= 370; y++) {
    for (let x = 90; x <= 145; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[355][115] = 5;  // Cuartel Sur
  map[355][125] = 19; // Fogata Sur
  map[355][110] = 17; map[355][130] = 17;
  map[355][138] = 7;  // Cofre Sur

  // =========================================================================
  // 15. MOLINO FLUVIAL DEL SUR (X: 205..260, Y: 340..370)
  // =========================================================================
  for (let y = 340; y <= 370; y++) {
    for (let x = 205; x <= 260; x++) {
      if (map[y][x] !== 3 && (x % 5 === 0 || y % 5 === 0)) map[y][x] = 2;
    }
  }
  map[355][220] = 6;  // Molino Fluvial
  map[355][235] = 5;  // Cabaña del Molinero
  map[355][210] = 15; // Muelle de Madera Sur
  map[350][220] = 17;
  map[355][245] = 7;  // Cofre del Molino

  // =========================================================================
  // 16. CAMPAMENTO DE EXPLORADORES DEL SURESTE (X: 320..365, Y: 360..385)
  // =========================================================================
  for (let y = 360; y <= 385; y++) {
    for (let x = 320; x <= 365; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[372][340] = 5;  // Cabaña de Expedición
  map[372][350] = 19; // Fogata
  map[372][335] = 17;
  map[372][358] = 7;  // Cofre de la Expedición

  // =========================================================================
  // 🌲 J. MASAS BOSCOSAS Y LABERINTOS NATURALES
  // =========================================================================
  for (let y = 10; y < MAP_SIZE - 10; y++) {
    for (let x = 10; x < MAP_SIZE - 10; x++) {
      if (map[y][x] === 0) {
        // Generar árboles densos en áreas no urbanizadas
        const noise = Math.sin(x * 0.06) * Math.cos(y * 0.06);
        if (noise > 0.15) {
          map[y][x] = 1;
        }
      }
    }
  }

  // =========================================================================
  // 🎁 K. 32 COFRES DEL TESORO DISTRIBUIDOS POR TODOS LOS BIOMAS
  // =========================================================================
  const allChests = [
    // Ciudad & Parque
    [88, 80], [105, 88], [152, 85], [165, 105],
    // Granja Noroeste
    [30, 30], [55, 30], [30, 55], [60, 60],
    // Cazadores Suroeste
    [35, 315], [65, 315], [35, 355], [65, 355],
    // Puerto Oriental
    [245, 205], [260, 220], [285, 230], [310, 240],
    // Cementerio
    [135, 285], [165, 285], [135, 315], [165, 315],
    // Zona Élite Sureste
    [305, 305], [345, 305], [305, 345], [345, 345],
    // Puesto Fronterizo & Río
    [185, 45], [215, 65], [195, 160], [205, 300],
    // Altar del Jefe & Claro Este
    [340, 50], [370, 50], [350, 75], [370, 85]
  ];
  allChests.forEach(([cx, cy]) => {
    map[cy][cx] = 7;
    // Despejar alrededores para acceso
    if (map[cy][cx - 1] === 1) map[cy][cx - 1] = 0;
    if (map[cy][cx + 1] === 1) map[cy][cx + 1] = 0;
  });

  return {
    tileData: map,
    bossPortalPos: { x: 360, y: 75 },
    defaultPlayerPos: { x: 88, y: 88 },
  };
}

/**
 * 🪨 2. CUEVAS DE SOMBRAS: MINAS DE ERIDU (400x400)
 */
export function generateCave400(): {
  tileData: number[][];
  bossPortalPos: { x: number; y: number };
  defaultPlayerPos: { x: number; y: number };
} {
  const map: number[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(1)); // Todo roca inicialmente

  // 1. Gran Ciudad Subterránea Enana (X: 65..115, Y: 65..115)
  for (let y = 65; y <= 115; y++) {
    for (let x = 65; x <= 115; x++) {
      map[y][x] = 0;
      if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
    }
  }
  map[75][75] = 5;  // Taberna del Piqueta de Oro
  map[75][95] = 10; // Gran Forja de Mithril
  map[95][75] = 9;  // Mercado Minero
  map[95][95] = 8;  // Santuario de Cristal Enano
  map[88][88] = 4;  // Fuente de Agua Subterránea
  map[82][82] = 17; map[82][94] = 17; map[94][82] = 17; map[94][94] = 17;

  // 2. Red de Vías y Galerías Mineras Principales
  [75, 150, 225, 300, 355].forEach((gy) => {
    for (let x = 15; x < MAP_SIZE - 15; x++) {
      map[gy][x] = 2; map[gy + 1][x] = 0; map[gy - 1][x] = 0;
      if (x % 16 === 0) map[gy][x] = 17; // Antorchas de mina
    }
  });
  [75, 150, 225, 300, 355].forEach((gx) => {
    for (let y = 15; y < MAP_SIZE - 15; y++) {
      map[y][gx] = 2; map[y][gx + 1] = 0; map[y][gx - 1] = 0;
    }
  });

  // 3. Gran Lago de Cristal Azul Subterráneo (X: 160..240, Y: 160..240)
  for (let y = 160; y <= 240; y++) {
    for (let x = 160; x <= 240; x++) {
      const d = Math.hypot((x - 200) / 36, (y - 200) / 36);
      if (d <= 1.0) {
        map[y][x] = 3; // Agua pura
      } else if (d <= 1.2) {
        map[y][x] = 0; // Orilla
      }
    }
  }
  // Puentes sobre el lago de cristal
  for (let x = 160; x <= 240; x++) { map[200][x] = 2; }
  for (let y = 160; y <= 240; y++) { map[y][200] = 2; }
  map[200][200] = 8; // Santuario del Cristal Azul

  // 4. ⚠️ Guarida del Coloso de Obsidiana Élite (X: 280..340, Y: 280..340)
  for (let y = 280; y <= 340; y++) {
    for (let x = 280; x <= 340; x++) {
      if (Math.hypot(x - 310, y - 310) < 25) {
        map[y][x] = 14; // Tierra de peligro
      }
    }
  }
  map[310][310] = 19; // Gran Fuego
  map[305][305] = 18; map[305][315] = 18; map[315][305] = 18; map[315][315] = 18;
  map[310][300] = 7;  map[310][320] = 7;

  // 5. Cámara del Jefe Gólem de Obsidiana (X: 345..375, Y: 345..375)
  for (let y = 345; y <= 375; y++) {
    for (let x = 345; x <= 375; x++) {
      map[y][x] = 2;
    }
  }
  map[360][360] = 11; // Portal del Gólem
  map[352][352] = 18; map[352][368] = 18; map[368][352] = 18; map[368][368] = 18;

  // =========================================================================
  // 1. CÁMARA DE LOS CRISTALES ESMERALDA (Noroeste Alto: X: 20..60, Y: 15..35)
  // =========================================================================
  for (let y = 15; y <= 35; y++) {
    for (let x = 20; x <= 60; x++) {
      map[y][x] = (x + y) % 3 === 0 ? 12 : 0; // Musgo fosforescente
    }
  }
  map[24][38] = 5;  // Refugio de Prospección
  map[24][48] = 19; // Fogata
  map[24][30] = 17; // Farola
  map[24][52] = 7;  // Cofre de Esmeraldas
  for (let x = 38; x <= 75; x++) map[24][x] = 2; // Vía de conexión

  // =========================================================================
  // 2. TALLER DE VAGONETAS Y RIELES (Norte Central: X: 80..115, Y: 15..35)
  // =========================================================================
  for (let y = 15; y <= 35; y++) {
    for (let x = 80; x <= 115; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[24][95] = 5;  // Taller de Maquinaria
  map[24][105] = 4; // Pozo de refrigeración
  map[24][85] = 7;  // Cofre de Herramientas
  map[20][95] = 17;

  // =========================================================================
  // 3. TÚNEL DE VENTEO Y FORJA DE GEMAS (Norte-Noreste: X: 130..165, Y: 15..45)
  // =========================================================================
  for (let y = 15; y <= 45; y++) {
    for (let x = 130; x <= 165; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[28][148] = 10; // Forja de Gemas
  map[28][138] = 5;  // Cabaña del Gemólogo
  map[28][158] = 7;  // Cofre de Rubíes
  map[22][148] = 17;

  // =========================================================================
  // 4. GRAN SALA DE LAS ESTALAGMITAS GIGANTES (X: 180..230, Y: 20..50)
  // =========================================================================
  for (let y = 20; y <= 50; y++) {
    for (let x = 180; x <= 230; x++) {
      map[y][x] = 0;
    }
  }
  map[35][205] = 8;  // Santuario de Cristal Antiguo
  map[30][195] = 18; map[30][215] = 18; map[40][195] = 18; map[40][215] = 18; // Estalagmitas
  map[35][220] = 7;  // Cofre Sagrado
  map[35][190] = 17;

  // =========================================================================
  // 5. CRIPTA DE LOS REYES DE LA MONTAÑA (Noreste Alto: X: 300..355, Y: 15..45)
  // =========================================================================
  for (let y = 15; y <= 45; y++) {
    for (let x = 300; x <= 355; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
      else if ((x + y) % 4 === 0) map[y][x] = 16; // Lápidas enanas
    }
  }
  map[30][325] = 8;  // Mausoleo Real de Mithril
  map[25][315] = 18; map[25][335] = 18; map[35][315] = 18; map[35][335] = 18;
  map[30][340] = 7;  // Cofre Real
  map[30][310] = 17;

  // =========================================================================
  // 6. GRAN CAVERNA DE LOS HONGOS LUMINISCENTES (Noroeste Lago: X: 150..220, Y: 75..140)
  // =========================================================================
  for (let y = 75; y <= 140; y++) {
    for (let x = 150; x <= 220; x++) {
      const d = Math.hypot((x - 185) / 32, (y - 105) / 30);
      if (d <= 1.0) {
        map[y][x] = (x + y) % 3 === 0 ? 12 : 0;
      }
    }
  }
  map[105][185] = 5;  // Cabaña del Ermitaño Troglodita
  map[115][185] = 8;  // Santuario de Hongos
  map[105][170] = 7;  // Cofre de Esporas
  map[105][195] = 19; // Fogata Azul
  map[95][185] = 17;

  // =========================================================================
  // 7. PUESTO MINERO DEL FILÓN DORADO (Noreste Lago: X: 235..295, Y: 80..140)
  // =========================================================================
  for (let y = 80; y <= 140; y++) {
    for (let x = 235; x <= 295; x++) {
      if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
    }
  }
  map[105][260] = 5;  // Cuartel Minero
  map[105][275] = 9;  // Almacén de Oro
  map[118][260] = 10; // Forja de Pepitas
  map[118][275] = 4;  // Pozo
  map[105][285] = 7;  // Cofre de Lingotes
  map[100][268] = 17;

  // =========================================================================
  // 8. NIDO DE MURCIÉLAGOS Y RUINAS SUBTERRÁNEAS (Este Alto: X: 355..390, Y: 80..145)
  // =========================================================================
  for (let y = 80; y <= 145; y++) {
    for (let x = 355; x <= 390; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
      else if ((x * y) % 7 === 0) map[y][x] = 14;
    }
  }
  map[110][375] = 7;  // Cofre Antiguo
  map[110][365] = 18; map[110][385] = 18;

  // =========================================================================
  // 9. CAMPAMENTO DE CANTEROS DE GRANITO (Oeste: X: 15..70, Y: 150..210)
  // =========================================================================
  for (let y = 150; y <= 210; y++) {
    for (let x = 15; x <= 70; x++) {
      if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
    }
  }
  map[175][40] = 5;  // Cabaña de Canteros
  map[175][55] = 10; // Forja de Picos
  map[175][30] = 4;  // Pozo de Cantera
  map[185][60] = 7;  // Cofre de Granito
  map[170][45] = 17;

  // =========================================================================
  // 10. LABORATORIO DE CRISTALOGRAFÍA Y ALQUIMIA (Medio-Oeste: X: 85..145, Y: 155..215)
  // =========================================================================
  for (let y = 155; y <= 215; y++) {
    for (let x = 85; x <= 145; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[185][115] = 9;  // Laboratorio de Alquimia
  map[175][115] = 8;  // Santuario de Cristal
  map[185][125] = 4;  // Pozo de Elixires
  map[185][105] = 7;  // Cofre Alquímico
  map[180][115] = 17;

  // =========================================================================
  // 11. EMBARCADERO DEL LAGO SUBTERRÁNEO (Medio-Este: X: 240..295, Y: 155..215)
  // =========================================================================
  for (let y = 155; y <= 215; y++) {
    for (let x = 240; x <= 295; x++) {
      if (map[y][x] !== 3 && (x % 5 === 0 || y % 5 === 0)) map[y][x] = 2;
    }
  }
  map[185][265] = 5;  // Cabaña del Pescador Cavernoso
  map[185][250] = 15; // Muelle sobre el lago
  map[180][250] = 17; // Farol de muelle
  map[185][280] = 7;  // Cofre de Perlas Cavernosas

  // =========================================================================
  // 12. CÁMARA DE LAS GEODAS DE AMATISTA (Este: X: 305..355, Y: 155..215)
  // =========================================================================
  for (let y = 155; y <= 215; y++) {
    for (let x = 305; x <= 355; x++) {
      map[y][x] = 0;
    }
  }
  map[185][330] = 8;  // Santuario de Amatista
  map[178][322] = 18; map[178][338] = 18; map[192][322] = 18; map[192][338] = 18;
  map[185][345] = 7;  // Cofre de Amatistas
  map[185][315] = 17;

  // =========================================================================
  // 13. PASO DEL ABISMO SILENCIOSO (Extremo Este: X: 360..395, Y: 155..215)
  // =========================================================================
  for (let y = 155; y <= 215; y++) {
    for (let x = 360; x <= 395; x++) {
      map[y][x] = 2; // Calzada sobre el abismo
    }
  }
  map[180][375] = 17; map[190][375] = 17;
  map[185][385] = 7;  // Cofre del Abismo

  // =========================================================================
  // 14. FUNDICIÓN DE HIERRO NEGRO (Suroeste: X: 15..75, Y: 235..290)
  // =========================================================================
  for (let y = 235; y <= 290; y++) {
    for (let x = 15; x <= 75; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[260][45] = 10; // Gran Forja de Hierro Negro
  map[260][35] = 5;  // Barracones de Herreros
  map[260][55] = 4;  // Pozo de Templado
  map[260][65] = 7;  // Cofre de Hierro Negro
  map[250][45] = 19; // Fuego de Fundición

  // =========================================================================
  // 15. SALA DE LAS FUENTES TERMALES SUBTERRÁNEAS (Sur del Lago: X: 145..215, Y: 245..295)
  // =========================================================================
  for (let y = 245; y <= 295; y++) {
    for (let x = 145; x <= 215; x++) {
      const d = Math.hypot((x - 180) / 30, (y - 270) / 22);
      if (d <= 0.6) map[y][x] = 3; // Pozas termales
      else if (d <= 1.0) map[y][x] = 2; // Bordes de piedra
    }
  }
  map[270][180] = 8;  // Santuario de las Termas
  map[270][160] = 4;  // Fuente Curativa
  map[270][195] = 7;  // Cofre Termal
  map[260][180] = 17; map[280][180] = 17;

  // =========================================================================
  // 16. CAMPAMENTO DE CAZADORES DE TROGLODITAS (Sur-Centro: X: 230..295, Y: 235..295)
  // =========================================================================
  for (let y = 235; y <= 295; y++) {
    for (let x = 230; x <= 295; x++) {
      if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
    }
  }
  map[265][260] = 5;  // Cabaña de Cazadores
  map[265][275] = 9;  // Puesto de Trofeos
  map[255][268] = 19; // Gran Fogata Subterránea
  map[265][285] = 7;  // Cofre de Cazadores
  map[265][250] = 17;

  // =========================================================================
  // 17. CÁMARA DE LOS ENGRANAJES Y BOMBAS DE AGUA (Sur-Oeste: X: 85..145, Y: 310..350)
  // =========================================================================
  for (let y = 310; y <= 350; y++) {
    for (let x = 85; x <= 145; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[330][115] = 5;  // Taller de Bombas
  map[330][128] = 10; // Forja de Engranajes
  map[330][105] = 4;  // Pozo de Presión
  map[330][135] = 7;  // Cofre de Engranajes
  map[325][115] = 17;

  // =========================================================================
  // 18. POBLADO DE LOS HERREROS DE LAS PROFUNDIDADES (Sur-Centro: X: 215..275, Y: 305..345)
  // =========================================================================
  for (let y = 305; y <= 345; y++) {
    for (let x = 215; x <= 275; x++) {
      if (x % 6 === 0 || y % 6 === 0) map[y][x] = 2;
    }
  }
  map[325][240] = 5;  // Vivienda Profunda 1
  map[325][255] = 9;  // Mercado de Joyas
  map[338][240] = 10; // Forja de Adamantio
  map[338][255] = 4;  // Pozo Profundo
  map[325][265] = 7;  // Cofre de Adamantio
  map[320][248] = 17;

  // =========================================================================
  // 19. ANTIGUO POLVORÍN Y ALMACÉN DE BARRENOS (Extremo Suroeste: X: 20..75, Y: 360..385)
  // =========================================================================
  for (let y = 360; y <= 385; y++) {
    for (let x = 20; x <= 75; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
    }
  }
  map[372][45] = 5;  // Cabaña de Barrenistas
  map[372][55] = 19; // Fogata
  map[372][65] = 7;  // Cofre de Pólvora
  map[368][45] = 17;

  // =========================================================================
  // 20. SANTUARIO DE LAS RAÍCES DE LA MONTAÑA (Fondo Sur: X: 160..230, Y: 360..385)
  // =========================================================================
  for (let y = 360; y <= 385; y++) {
    for (let x = 160; x <= 230; x++) {
      map[y][x] = 0;
    }
  }
  map[372][195] = 8;  // Santuario de las Raíces
  map[368][185] = 18; map[368][205] = 18; map[376][185] = 18; map[376][205] = 18;
  map[372][210] = 7;  // Cofre Titánico
  map[372][175] = 17;

  return {
    tileData: map,
    bossPortalPos: { x: 360, y: 360 },
    defaultPlayerPos: { x: 75, y: 78 },
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
  [75, 150, 225, 300, 355].forEach((py) => {
    for (let x = 15; x < MAP_SIZE - 15; x++) map[py][x] = 2;
  });
  [75, 150, 225, 300, 355].forEach((px) => {
    for (let y = 15; y < MAP_SIZE - 15; y++) map[y][px] = 2;
  });

  // Asentamiento Alquímico de Morgana
  for (let y = 65; y <= 100; y++) {
    for (let x = 65; x <= 100; x++) {
      map[y][x] = 2;
    }
  }
  map[75][75] = 5;  // Chabola de Pociones
  map[75][85] = 9;  // Puesto Alquímico
  map[85][80] = 4;  // Pozo de Agua Bendita
  map[75][95] = 8;  // Santuario de Purificación
  map[85][85] = 19; // Fogata verde

  // ⚠️ Cementerio Maldito del Pantano (X: 130..175, Y: 280..325)
  for (let y = 280; y <= 325; y++) {
    for (let x = 130; x <= 175; x++) {
      if (x % 5 === 0 || y % 5 === 0) map[y][x] = 2;
      else if ((x + y) % 4 === 0) map[y][x] = 16;
    }
  }
  map[300][150] = 14; map[300][155] = 7;

  // Nido de la Gorgona (X: 345..375, Y: 345..375)
  for (let y = 345; y <= 375; y++) {
    for (let x = 345; x <= 375; x++) map[y][x] = 2;
  }
  map[360][360] = 11;

  const swampChests = [
    [75, 50], [95, 50], [150, 75], [225, 75],
    [50, 150], [120, 150], [260, 150], [330, 150],
    [75, 225], [135, 225], [275, 225], [340, 225],
    [75, 300], [150, 300], [225, 300], [355, 300]
  ];
  swampChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 360, y: 360 },
    defaultPlayerPos: { x: 75, y: 78 },
  };
}

/**
 * 🌋 4. VOLCÁN ANCESTRAL: FRAGUA DE LOS TITANES (400x400)
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
      } else if (Math.sin(x * 0.04) * Math.cos(y * 0.04) > 0.32) {
        map[y][x] = 3; // Lava
      }
    }
  }

  [75, 150, 225, 300, 355].forEach((vy) => {
    for (let x = 15; x < MAP_SIZE - 15; x++) map[vy][x] = 2;
  });
  [75, 150, 225, 300, 355].forEach((vx) => {
    for (let y = 15; y < MAP_SIZE - 15; y++) map[y][vx] = 2;
  });

  // Bastión de los Titanes
  for (let y = 65; y <= 100; y++) {
    for (let x = 65; x <= 100; x++) map[y][x] = 2;
  }
  map[75][75] = 10; // Gran Forja Volcánica
  map[75][85] = 5;  // Bastión
  map[85][80] = 4;  // Fuente Sagrada
  map[75][95] = 8;  // Santuario de Fuego
  map[85][88] = 19; // Fogata Titánica

  // Cubil del Dragón Ignis
  for (let y = 345; y <= 375; y++) {
    for (let x = 345; x <= 375; x++) map[y][x] = 2;
  }
  map[360][360] = 11;

  const volcanoChests = [
    [75, 50], [95, 50], [150, 75], [225, 75],
    [50, 150], [120, 150], [260, 150], [330, 150],
    [75, 225], [135, 225], [275, 225], [340, 225],
    [75, 300], [150, 300], [225, 300], [355, 300]
  ];
  volcanoChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 360, y: 360 },
    defaultPlayerPos: { x: 75, y: 78 },
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

  [75, 150, 225, 300, 355].forEach((ty) => {
    for (let x = 15; x < MAP_SIZE - 15; x++) map[ty][x] = 2;
  });
  [75, 150, 225, 300, 355].forEach((tx) => {
    for (let y = 15; y < MAP_SIZE - 15; y++) map[y][tx] = 2;
  });

  // Pueblo Nórdico de Frostfall
  for (let y = 65; y <= 100; y++) {
    for (let x = 65; x <= 100; x++) map[y][x] = 2;
  }
  map[75][75] = 5;  // Cabaña Nórdica
  map[75][85] = 9;  // Puesto de Pieles
  map[85][80] = 4;  // Pozo de Agua Helada
  map[75][95] = 8;  // Santuario Glaciar
  map[85][88] = 19; // Gran Fogata Nórdica

  // Fortaleza del Titán Ymir
  for (let y = 60; y <= 90; y++) {
    for (let x = 335; x <= 375; x++) map[y][x] = 2;
  }
  map[75][355] = 11;

  const tundraChests = [
    [75, 50], [95, 50], [150, 75], [225, 75],
    [50, 150], [120, 150], [260, 150], [330, 150],
    [75, 225], [135, 225], [275, 225], [340, 225],
    [75, 300], [150, 300], [225, 300], [355, 300]
  ];
  tundraChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 75 },
    defaultPlayerPos: { x: 75, y: 78 },
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
  for (let i = 35; i < MAP_SIZE - 20; i += 38) {
    for (let x = 10; x < MAP_SIZE - 10; x++) map[i][x] = 2;
    for (let y = 10; y < MAP_SIZE - 10; y++) map[y][i] = 2;
  }

  // Gran Plaza Imperial
  for (let y = 65; y <= 100; y++) {
    for (let x = 65; x <= 100; x++) map[y][x] = 2;
  }
  map[75][75] = 5;  // Taberna de la Corona
  map[75][85] = 10; // Forja Imperial
  map[85][75] = 9;  // Mercado de la Corona
  map[85][85] = 4;  // Gran Fuente Imperial
  map[75][95] = 8;  // Santuario Real

  // Salón del Trono Imperial y Necrópolis
  for (let y = 330; y <= 375; y++) {
    for (let x = 330; x <= 375; x++) map[y][x] = 2;
  }
  map[355][355] = 11;

  const castleChests = [
    [75, 50], [95, 50], [150, 75], [225, 75],
    [50, 150], [120, 150], [260, 150], [330, 150],
    [75, 225], [135, 225], [275, 225], [340, 225],
    [75, 300], [150, 300], [225, 300], [355, 300]
  ];
  castleChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 75, y: 80 },
  };
}

/**
 * 🌌 7. EL VÓRTICE DEL VACÍO (400x400)
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
    [75, 310, 20], [190, 310, 20], [355, 355, 28]
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
  for (let x = 75; x <= 355; x++) {
    map[75][x] = 2; map[190][x] = 2; map[310][x] = 2;
  }
  for (let y = 75; y <= 355; y++) {
    map[y][75] = 2; map[y][190] = 2; map[y][310] = 2;
  }

  // Templo de Malakor
  map[355][355] = 11;
  map[75][75] = 4;
  map[70][75] = 5;
  map[80][75] = 8;

  const voidChests = [
    [190, 75], [310, 75], [75, 190], [190, 190],
    [310, 190], [75, 310], [190, 310], [310, 310]
  ];
  voidChests.forEach(([cx, cy]) => { map[cy][cx] = 7; });

  return {
    tileData: map,
    bossPortalPos: { x: 355, y: 355 },
    defaultPlayerPos: { x: 75, y: 78 },
  };
}

/**
 * 👑 8. SAGRARIO DE LOS ANTIGUOS (400x400)
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
  map[80][200] = 11;
  map[340][200] = 4;
  map[320][200] = 8;

  return {
    tileData: map,
    bossPortalPos: { x: 200, y: 80 },
    defaultPlayerPos: { x: 200, y: 340 },
  };
}
