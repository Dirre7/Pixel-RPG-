import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width: number, height: number, drawPixel: (x: number, y: number) => [number, number, number, number]): Buffer {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawPixel(x, y);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const makeChunk = (type: string, data: Buffer): Buffer => {
    const len = data.length;
    const chunk = Buffer.alloc(8 + len + 4);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4);
    data.copy(chunk, 8);

    let crc = 0xffffffff;
    const crcBuf = Buffer.concat([Buffer.from(type), data]);
    for (let i = 0; i < crcBuf.length; i++) {
      crc ^= crcBuf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    chunk.writeUInt32BE(crc, 8 + len);
    return chunk;
  };

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function generateAppIcon(size: number, isMaskable: boolean = false): Buffer {
  return createPNG(size, size, (x, y) => {
    const cx = size / 2;
    const cy = size / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Background gradient: Deep slate / obsidian
    const bgRad = size * 0.48;
    if (!isMaskable && dist > bgRad) {
      return [0, 0, 0, 0]; // Transparent outer if non-maskable
    }

    // Border ring (Golden retro RPG border)
    if (dist > bgRad - size * 0.04 && dist <= bgRad) {
      return [245, 158, 11, 255]; // Amber border
    }

    // Golden inner shield / sword emblem
    const normX = (x - cx) / (size * 0.38);
    const normY = (y - cy) / (size * 0.38);

    // Sword Blade (vertical bar)
    if (Math.abs(normX) < 0.12 && normY > -0.75 && normY < 0.45) {
      return [241, 245, 249, 255]; // Silver blade
    }
    // Sword Edge highlight
    if (Math.abs(normX) < 0.04 && normY > -0.75 && normY < 0.4) {
      return [56, 189, 248, 255]; // Blue glowing magic core
    }
    // Sword Crossguard
    if (Math.abs(normX) < 0.45 && Math.abs(normY - 0.45) < 0.08) {
      return [245, 158, 11, 255]; // Golden crossguard
    }
    // Sword Handle
    if (Math.abs(normX) < 0.08 && normY >= 0.45 && normY <= 0.75) {
      return [180, 83, 9, 255]; // Wood grip
    }
    // Sword Pommel
    if (Math.sqrt(normX * normX + (normY - 0.78) * (normY - 0.78)) < 0.12) {
      return [245, 158, 11, 255]; // Gold pommel
    }

    // Ruby Gem in center
    if (Math.sqrt(normX * normX + (normY - 0.45) * (normY - 0.45)) < 0.1) {
      return [239, 68, 68, 255]; // Ruby
    }

    // Shield background fill (gradient from navy to dark slate)
    const darkness = Math.min(1, dist / (size * 0.45));
    const r = Math.floor(15 + darkness * 10);
    const g = Math.floor(23 + darkness * 15);
    const b = Math.floor(42 + darkness * 30);

    return [r, g, b, 255];
  });
}

const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), generateAppIcon(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), generateAppIcon(512));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), generateAppIcon(512, true));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), generateAppIcon(180, true));

console.log('✅ PWA Icons successfully generated in public/icons/');
