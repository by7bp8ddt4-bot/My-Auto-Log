// Generate solid-color PNG splash images at key iOS device resolutions
// Pure Node.js — no external dependencies needed (uses zlib for PNG compression)

import { createWriteStream } from 'fs';
import { readFileSync } from 'fs';
import { deflateSync } from 'zlib';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '..', 'public', 'assets', 'splash');
mkdirSync(outputDir, { recursive: true });

// Background color: #0f172a = RGB(15, 23, 42)
const R = 15, G = 23, B = 42;

// Key iPhone resolutions (width × height, CSS px × scale factor = actual px)
const splashSizes = [
  { name: 'iphone-15-pro-max', width: 430, height: 932, scale: 3 },     // 1290×2796
  { name: 'iphone-15-pro', width: 393, height: 852, scale: 3 },          // 1179×2556
  { name: 'iphone-15-plus', width: 430, height: 932, scale: 3 },         // 1290×2796
  { name: 'iphone-14-pro-max', width: 430, height: 932, scale: 3 },      // 1290×2796
  { name: 'iphone-14-pro', width: 393, height: 852, scale: 3 },          // 1179×2556
  { name: 'iphone-13-pro-max', width: 428, height: 926, scale: 3 },      // 1284×2778
  { name: 'iphone-12-pro-max', width: 428, height: 926, scale: 3 },      // 1284×2778
  { name: 'iphone-x', width: 375, height: 812, scale: 3 },               // 1125×2436
  { name: 'iphone-se', width: 375, height: 667, scale: 2 },              // 750×1334
  { name: 'ipad-pro', width: 1024, height: 1366, scale: 2 },             // 2048×2732
];

function createPNG(width, height) {
  // Minimal PNG with IDAT chunk containing raw pixel data
  // Using filter byte 0 (none) for each row

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);   // bit depth
  ihdrData.writeUInt8(2, 9);   // color type: RGB
  ihdrData.writeUInt8(0, 10);  // compression
  ihdrData.writeUInt8(0, 11);  // filter
  ihdrData.writeUInt8(0, 12);  // interlace

  const ihdr = createChunk('IHDR', ihdrData);

  // IDAT: raw pixel data
  const rawData = Buffer.alloc((width * 3 + 1) * height); // +1 for filter byte per row
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 3 + 1);
    rawData[rowOffset] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      rawData[pxOffset] = R;
      rawData[pxOffset + 1] = G;
      rawData[pxOffset + 2] = B;
    }
  }

  const compressed = deflateSync(rawData, { level: 9 });
  const idat = createChunk('IDAT', compressed);

  // IEND
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = crc32(Buffer.concat([typeBuffer, data]));

  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 implementation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate all sizes
for (const size of splashSizes) {
  const actualW = size.width * size.scale;
  const actualH = size.height * size.scale;
  const filename = `splash-${actualW}x${actualH}.png`;
  const filepath = join(outputDir, filename);

  console.log(`Generating ${filename} (${actualW}×${actualH})...`);
  const png = createPNG(actualW, actualH);
  const ws = createWriteStream(filepath);
  ws.write(png);
  ws.end();
  await new Promise(resolve => ws.on('finish', resolve));
  console.log(`  → ${(png.length / 1024).toFixed(1)} KB`);
}

console.log('\nDone! Splash images generated in', outputDir);
