import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================================================================
// 🎨 PURE NODE.JS PNG GENERATOR (Uses built-in zlib, 0 external dependencies)
// ==============================================================================

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crcData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crcVal = crc32(crcData);
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

function encodePNG(width, height, rgbaBuffer) {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bit depth
  ihdrData.writeUInt8(6, 9); // RGBA color type
  ihdrData.writeUInt8(0, 10); // Deflate
  ihdrData.writeUInt8(0, 11); // Filter
  ihdrData.writeUInt8(0, 12); // No interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  let srcOffset = 0;
  let dstOffset = 0;

  for (let y = 0; y < height; y++) {
    scanlines[dstOffset++] = 0; // Filter 0 (None)
    for (let x = 0; x < width; x++) {
      scanlines[dstOffset++] = rgbaBuffer[srcOffset++]; // R
      scanlines[dstOffset++] = rgbaBuffer[srcOffset++]; // G
      scanlines[dstOffset++] = rgbaBuffer[srcOffset++]; // B
      scanlines[dstOffset++] = rgbaBuffer[srcOffset++]; // A
    }
  }

  const compressedData = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// ==============================================================================
// 🗺️ COLOR PALETTES FOR EACH TILE TYPE PER BIOME
// ==============================================================================

function hexToRgba(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255,
    255
  ];
}

const PALETTES = {
  zone_forest: {
    0: '#15803d', // Hierba base
    1: '#0d4a22', // Árbol / Bosque espeso
    2: '#b45309', // Carretera / Adoquín
    3: '#0284c7', // Río / Lago
    4: '#38bdf8', // Pozo / Fuente
    5: '#dc2626', // Taberna / Cabaña Roja
    6: '#fbbf24', // Molino de Viento
    7: '#fde047', // Cofre del Tesoro Dorado
    8: '#10b981', // Santuario Sagrado
    9: '#3b82f6', // Mercado / Cabaña Azul
    10: '#f97316', // Forja del Herrero
    11: '#ef4444', // Portal del Jefe
    12: '#ec4899', // Jardín Botánico de Flores
    13: '#ca8a04', // Campo de Trigo Dorado
    14: '#7f1d1d', // Tierras Calcinadas Élite
    15: '#d97706', // Muelles de Madera
    16: '#64748b', // Lápidas de Cementerio
    17: '#fef08a', // Farolas de Camino
    18: '#94a3b8', // Ruinas Clásicas
    19: '#ea580c', // Fogata de Campamento
  },
  zone_cave: {
    0: '#334155',
    1: '#0f172a',
    2: '#64748b',
    3: '#38bdf8',
    4: '#38bdf8',
    5: '#f59e0b',
    6: '#475569',
    7: '#fde047',
    8: '#818cf8',
    9: '#9333ea',
    10: '#f97316',
    11: '#4338ca',
    12: '#6366f1',
    13: '#475569',
    14: '#1e1b4b',
    15: '#b45309',
    16: '#334155',
    17: '#fef08a',
    18: '#cbd5e1',
    19: '#ea580c',
  },
  zone_swamp: {
    0: '#1c1917',
    1: '#064e3b',
    2: '#78350f',
    3: '#047857',
    4: '#38bdf8',
    5: '#10b981',
    6: '#15803d',
    7: '#fde047',
    8: '#34d399',
    9: '#059669',
    10: '#b45309',
    11: '#047857',
    12: '#10b981',
    13: '#78350f',
    14: '#451a03',
    15: '#b45309',
    16: '#475569',
    17: '#a7f3d0',
    18: '#64748b',
    19: '#10b981',
  },
  zone_volcano: {
    0: '#18181b',
    1: '#09090b',
    2: '#27272a',
    3: '#dc2626',
    4: '#38bdf8',
    5: '#c2410c',
    6: '#f97316',
    7: '#fde047',
    8: '#f97316',
    9: '#ea580c',
    10: '#dc2626',
    11: '#991b1b',
    12: '#ea580c',
    13: '#27272a',
    14: '#450a0a',
    15: '#78350f',
    16: '#3f3f46',
    17: '#fbbf24',
    18: '#71717a',
    19: '#f59e0b',
  },
  zone_tundra: {
    0: '#f8fafc',
    1: '#065f46',
    2: '#cbd5e1',
    3: '#38bdf8',
    4: '#0284c7',
    5: '#0284c7',
    6: '#94a3b8',
    7: '#fde047',
    8: '#38bdf8',
    9: '#7dd3fc',
    10: '#0369a1',
    11: '#0284c7',
    12: '#bae6fd',
    13: '#cbd5e1',
    14: '#0c4a6e',
    15: '#94a3b8',
    16: '#64748b',
    17: '#fef08a',
    18: '#e2e8f0',
    19: '#ea580c',
  },
  zone_castle: {
    0: '#334155',
    1: '#1e293b',
    2: '#64748b',
    3: '#0284c7',
    4: '#38bdf8',
    5: '#9333ea',
    6: '#a855f7',
    7: '#fde047',
    8: '#c084fc',
    9: '#7e22ce',
    10: '#f97316',
    11: '#6b21a8',
    12: '#ec4899',
    13: '#ca8a04',
    14: '#3b0764',
    15: '#b45309',
    16: '#475569',
    17: '#fef08a',
    18: '#cbd5e1',
    19: '#ea580c',
  },
  zone_void: {
    0: '#0f0e17',
    1: '#020617',
    2: '#7c3aed',
    3: '#581c87',
    4: '#c084fc',
    5: '#ec4899',
    6: '#a855f7',
    7: '#fde047',
    8: '#e879f9',
    9: '#db2777',
    10: '#f472b6',
    11: '#be185d',
    12: '#d946ef',
    13: '#2e1065',
    14: '#4c0519',
    15: '#7c3aed',
    16: '#581c87',
    17: '#f0abfc',
    18: '#c084fc',
    19: '#ec4899',
  },
  zone_sanctuary: {
    0: '#ffffff',
    1: '#cbd5e1',
    2: '#facc15',
    3: '#38bdf8',
    4: '#fde047',
    5: '#fbbf24',
    6: '#ca8a04',
    7: '#fde047',
    8: '#eab308',
    9: '#fef08a',
    10: '#f59e0b',
    11: '#ca8a04',
    12: '#f472b6',
    13: '#fef08a',
    14: '#ca8a04',
    15: '#facc15',
    16: '#94a3b8',
    17: '#fef08a',
    18: '#e2e8f0',
    19: '#f59e0b',
  },
};

// ==============================================================================
// 🚀 EXPORT ALL 8 MAPS TO HIGH RES PNGs (1600x1600 - 4x Pixel Scaling)
// ==============================================================================

async function main() {
  const outputDir = path.resolve(__dirname, '../public/maps');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Import map generators directly
  const {
    generateForest400,
    generateCave400,
    generateSwamp400,
    generateVolcano400,
    generateTundra400,
    generateCastle400,
    generateVoid400,
    generatePantheon400,
  } = await import('../src/data/worldMapGenerator400.ts');

  const zones = [
    { id: 'zone_forest', name: '1_Bosque_Esmeralda_y_Aldeas', gen: generateForest400 },
    { id: 'zone_cave', name: '2_Cueva_de_Sombras_Minas_Eridu', gen: generateCave400 },
    { id: 'zone_swamp', name: '3_Pantano_Espectral_de_Vael', gen: generateSwamp400 },
    { id: 'zone_volcano', name: '4_Volcan_Ancestral_Fragua_Titanes', gen: generateVolcano400 },
    { id: 'zone_tundra', name: '5_Picos_Helados_de_Frostfall', gen: generateTundra400 },
    { id: 'zone_castle', name: '6_Ciudadela_Imperial_y_Necropolis', gen: generateCastle400 },
    { id: 'zone_void', name: '7_Vortice_del_Vacio', gen: generateVoid400 },
    { id: 'zone_sanctuary', name: '8_Sagrario_de_los_Antiguos', gen: generatePantheon400 },
  ];

  const MAP_SIZE = 400;
  const SCALE = 4; // 4x4 pixels per tile = 1600x1600 high res PNG
  const IMG_SIZE = MAP_SIZE * SCALE;

  console.log(`🗺️ Generando imágenes en alta resolución (${IMG_SIZE}x${IMG_SIZE} px) de los 8 mapas...`);

  for (const zone of zones) {
    const mapData = zone.gen().tileData;
    const palette = PALETTES[zone.id] || PALETTES.zone_forest;
    const rgbaBuffer = Buffer.alloc(IMG_SIZE * IMG_SIZE * 4);

    for (let y = 0; y < MAP_SIZE; y++) {
      for (let x = 0; x < MAP_SIZE; x++) {
        const tileType = mapData[y][x];
        const hexColor = palette[tileType] || palette[0];
        const [r, g, b, a] = hexToRgba(hexColor);

        // Draw SCALE x SCALE block
        for (let dy = 0; dy < SCALE; dy++) {
          for (let dx = 0; dx < SCALE; dx++) {
            const px = x * SCALE + dx;
            const py = y * SCALE + dy;
            const idx = (py * IMG_SIZE + px) * 4;
            rgbaBuffer[idx] = r;
            rgbaBuffer[idx + 1] = g;
            rgbaBuffer[idx + 2] = b;
            rgbaBuffer[idx + 3] = a;
          }
        }
      }
    }

    const pngBuffer = encodePNG(IMG_SIZE, IMG_SIZE, rgbaBuffer);
    const filename = `mapa_${zone.name}.png`;
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, pngBuffer);
    console.log(`✅ [${zone.id}] Guardado: public/maps/${filename} (${(pngBuffer.length / 1024).toFixed(1)} KB)`);
  }

  console.log(`\n🎉 ¡Las 8 imágenes de los mapas de 400x400 han sido generadas con éxito en public/maps/!`);
}

main().catch((err) => {
  console.error('Error generando mapas:', err);
  process.exit(1);
});
