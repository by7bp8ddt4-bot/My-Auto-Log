/**
 * Verify Wave 5 Ford fuse layouts in src/data/fuse-boxes.js.
 * Checks: (1) every layout cell position exists in the panel's fuses/relays;
 * (2) layout cells have valid col/row/w/h; (3) expected layouts present.
 * Run: bun tools/verify-wave5-layouts.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.join(here, '../src/data/fuse-boxes.js'), 'utf8');

// crude depth-aware parse to collect (model, year, panel, positions, layout)
const models = {};
const modelRe = /^    (\w+): \{/gm;
let m;
while ((m = modelRe.exec(src))) {
  const model = m[1];
  const start = m.index;
  // find matching close at depth
  let i = src.indexOf('{', m.index + m[0].length - 1);
  let depth = 1;
  while (i < src.length && depth > 0) {
    const c = src[i];
    if (c === "'" || c === '"') {
      const q = c; i++;
      while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; }
    } else if (c === '{') depth++;
    else if (c === '}') depth--;
    i++;
  }
  models[model] = src.slice(start, i);
}

let failures = [];
let totalCells = 0;
let layoutCount = 0;

const expect = new Map([
  ['fusion', 6], ['edge', 10], ['expedition', 6], ['bronco', 2], ['ranger', 7],
  ['mustang', 16], ['explorer', 1], ['maverick', 4], ['transit', 24],
]);

for (const [model, block] of Object.entries(models)) {
  const yearRe = /^      '(\d{4}-\d{4})': \{/gm;
  let y;
  while ((y = yearRe.exec(block))) {
    const year = y[1];
    const ystart = y.index;
    let i = block.indexOf('{', y.index + y[0].length - 1);
    let depth = 1;
    while (i < block.length && depth > 0) {
      const c = block[i];
      if (c === "'" || c === '"') { const q = c; i++; while (i < block.length && block[i] !== q) { if (block[i] === '\\') i++; i++; } }
      else if (c === '{') depth++;
      else if (c === '}') depth--;
      i++;
    }
    const yblock = block.slice(ystart, i);
    const pm = yblock.match(/panels: \[/);
    if (!pm) continue;
    let j = pm.index + pm[0].length;
    depth = 1;
    while (j < yblock.length && depth > 0) {
      const c = yblock[j];
      if (c === "'" || c === '"') { const q = c; j++; while (j < yblock.length && yblock[j] !== q) { if (yblock[j] === '\\') j++; j++; } }
      else if (c === '[') depth++;
      else if (c === ']') depth--;
      j++;
    }
    const panelsText = yblock.slice(pm.index + pm[0].length, j - 1);
    // split panels at depth 1
    let k = 0; const panels = [];
    while (k < panelsText.length) {
      if (panelsText[k] === '{') {
        depth = 1; let s = k + 1;
        while (s < panelsText.length && depth > 0) {
          const c = panelsText[s];
          if (c === "'" || c === '"') { const q = c; s++; while (s < panelsText.length && panelsText[s] !== q) { if (panelsText[s] === '\\') s++; s++; } }
          else if (c === '{') depth++;
          else if (c === '}') depth--;
          s++;
        }
        panels.push(panelsText.slice(k, s));
        k = s;
      } else k++;
    }
    for (const p of panels) {
      const nm = p.match(/name: '([^']*)'/);
      if (!nm) continue;
      const fuses = [...p.matchAll(/\{ pos: '([^']*)', amps:/g)].map(x => x[1]);
      const relays = [...p.matchAll(/\{ pos: '([^']*)', circuit:/g)].map(x => x[1]);
      const positions = new Set([...fuses, ...relays]);
      const lm = p.match(/layout: \{[\s\S]*?\n            \}/);
      if (!lm) continue;
      layoutCount++;
      const cellRe = /'([^']*)': \{ col: (\d+), row: (\d+), w: (\d+), h: (\d+) \}/g;
      let c;
      let cells = 0;
      while ((c = cellRe.exec(lm[0]))) {
        cells++;
        const [pos, col, row, w, h] = [c[1], +c[2], +c[3], +c[4], +c[5]];
        totalCells++;
        if (!positions.has(pos)) failures.push(`${model} ${year} ${nm[1]}: layout cell '${pos}' not in panel positions`);
        if (col < 1 || row < 1 || w < 1 || h < 1) failures.push(`${model} ${year} ${nm[1]}: bad cell dims for '${pos}'`);
      }
      if (cells !== positions.size) failures.push(`${model} ${year} ${nm[1]}: ${cells} cells vs ${positions.size} positions`);
    }
  }
}

// expected layout counts per model
for (const [model, n] of expect) {
  const modelRe2 = new RegExp(`^    ${model}: \\{`, 'm');
  if (!modelRe2.test(src)) { failures.push(`${model}: missing from fuse-boxes.js`); continue; }
}

const actual = {};
const layoutInModel = /^    (\w+): \{/gm;
let x;
while ((x = layoutInModel.exec(src))) {
  const start = x.index;
  const end = src.indexOf('\n\n  ', start);
  const blk = end > 0 ? src.slice(start, end) : src.slice(start, start + 2000000);
  actual[x[1]] = (blk.match(/layout: \{/g) || []).length;
}
for (const [model, n] of expect) {
  if (actual[model] === undefined) { failures.push(`${model}: not found`); continue; }
  if (actual[model] < n) failures.push(`${model}: expected >= ${n} layouts, found ${actual[model]}`);
}

if (failures.length) {
  console.error(`FAIL ${failures.length}:`);
  for (const f of failures) console.error('  -', f);
  process.exit(1);
}
console.log(`PASS: ${layoutCount} layouts, ${totalCells} cells verified across ${Object.keys(actual).length} models`);
