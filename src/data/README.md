# MTXtrkr Vehicle Data Layer

This directory contains all structured vehicle data consumed by the MTXtrkr app. It powers the AI Co-Pilot, maintenance schedules, symptom decoder, jargon translator, and VIN decoder modules.

## File Overview

| File | Format | Purpose |
|------|--------|---------|
| `maintenance-schedules.js` | JS (export) | Vehicle maintenance intervals + specs + lookup helpers |
| `vin-decoder.js` | JS (module) | VIN validation, WMI decoding, model year lookup |
| `vin-decoder.json` | JSON | WMI codes, transliteration table, model year codes |
| `symptom-decoder.js` | JS (module) | Search symptoms, match free-text input to known issues |
| `symptom-decoder.json` | JSON | Symptom-to-cause mappings with severity, urgency, cost |
| `jargon-translator.js` | JS (module) | Translate mechanic terms, extract jargon from text |
| `jargon-translator.json` | JSON | 40+ mechanic terms → plain English |

## How Components Use the Data

### AI Co-Pilot (`components/AICopilot.jsx`)

```js
import { getSpecsForVehicle, isEV } from '../data/maintenance-schedules.js';
import { findBestSymptomMatch } from '../data/symptom-decoder.js';
import { translateJargon, extractJargon } from '../data/jargon-translator.js';
```

- `getSpecsForVehicle(make, model)` — Returns fluid specs, tire pressure, battery group, etc.
- `findBestSymptomMatch(input)` — Matches driver text ("clunking when turning") to likely causes
- `translateJargon(term)` — Translates mechanic terms ("wastegate actuator") to plain English
- `extractJargon(text)` — Scans text and finds all jargon terms present

### Maintenance Schedule View (`components/MaintenanceSchedule.jsx`)

Uses `getScheduleForVehicle(make, model)` to show personalized maintenance timelines.

### VIN Decoder (available for future use)

```js
import { validateVIN, decodeWMI, getModelYear } from '../data/vin-decoder.js';
```

- `validateVIN(vin)` — `{ valid: true/false, error?: string }`
- `decodeWMI(vin)` — `{ make, country }` from VIN characters 1-3
- `getModelYear(vin)` — Year number from character 10

## Data Structure

### `maintenance-schedules.js`
- Organized by manufacturer (`toyota`, `honda`, `ford`, etc.)
- Each manufacturer has `specs` (oil, transmission, coolant, brake fluid, tire pressure, spark plugs, battery)
- Each manufacturer has `models` → array of services with `service`, `intervalMiles`, `intervalMonths`, `severity`, `description`
- Models can reference another model's schedule (e.g., `corolla: 'camry'`)
- Cross-manufacturer references (e.g., `sportage: 'hyundai.elantra'`)

### `symptom-decoder.json`
- Array of `symptoms` with `symptom`, `plainEnglish`, `likelyCauses`
- Each cause: `cause`, `severity`, `urgency`, `estimatedCost`, `commonVehicles`

### `jargon-translator.json`
- Object keyed by term name
- Each entry: `term`, `standsFor`, `plainEnglish`, `commonFailures`

### `vin-decoder.json`
- `vinStructure` — Position meanings
- `modelYearCodes` — Character 10 → year lookup
- `wmiLookup` — 200+ WMI codes (characters 1-3) → make + country
- `vinValidation` — Check digit calculation algorithm + transliteration table

## Fuse Box Data (`fuse-boxes.js`)

Shape: `make → model → yearRange → { panels: [...] }`. Each panel:

```js
{
  name: 'Engine Compartment Fuse Box',   // display name
  location: 'Driver side of engine bay', // where the panel physically sits
  fuses:  [{ pos, amps, circuit, desc }, ...],
  relays: [{ pos, circuit, desc }, ...],
  layout: { ... }                        // OPTIONAL — see below
}
```

- `pos` is an opaque label — numeric (`"1"`, `"26"`), alphanumeric (`"A10"`, `"84A"`, `"R1"`, `"S/B01"`, `"RLY1"`, `"*K16"`), or anything else. The renderer never parses it; it is displayed as-is.
- `amps` may be a number (`10`), a compound string (`"7.5/30"` — largest value governs the color tier), or `"—"` (unknown → slate color).

### Optional `layout` block (physical diagram)

When present, the Wiring Diagrams **Diagram** view draws the panel as an SVG grid that
matches the panel's ACTUAL physical fuse layout. Without it (most panels today), the
Diagram view falls back to a reading-order grid and shows an **"Approximate layout"**
amber banner. Add `layout` whenever you can transcribe a real OEM diagram.

```js
layout: {
  cols: 12,          // grid width in cells (>= 1)
  rows: 6,           // grid height in cells (>= 1)
  cells: {           // keyed by the EXACT pos string; 1-based col/row, w/h >= 1
    '1':  { col: 1, row: 1, w: 1, h: 1 },
    '7':  { col: 2, row: 1, w: 1, h: 2 },   // taller fuse slot
    'R1': { col: 10, row: 5, w: 2, h: 1 }   // relay block
  },
  notes: [            // explanatory lines shown under the diagram
    'Layout matches 2021-2024 gas trims; hybrid adds 2 fuses near position 20.',
    'Relay R3 position approximated from the OEM diagram; verify against the fuse box cover.'
  ]
}
```

Rules:
1. Cells are keyed by the exact `pos` string (`'1'` matches fuse `pos: 1`; `'R1'` matches relay `pos: 'R1'`).
2. Positions present in the panel but NOT in `cells` are auto-placed into the first
   free slots in reading order (never overlapping); positions in `cells` with no
   matching fuse/relay render as empty slots.
3. `col`/`row` are 1-based; `w`/`h` default to 1 and must be >= 1. Any span that would
   overflow the grid is clamped to the grid edge (never crashes, never draws outside).
4. Only add `layout` when you have the physical diagram; otherwise leave the panel
   without one — the app will show the honest "Approximate layout" banner.
5. Always add a `notes` entry when any position was approximated, and mention
   trim/region/hybrid differences that change the layout.

Reference fixture: the Toyota Camry 2018-2026 engine compartment panel carries a
transcribed `layout` block — copy its structure when authoring new ones. Renderer
contract: `computePanelLayout(panel)` in `src/components/FuseBox.jsx` (unit-tested in
`__tests__/smoke/fuse-diagram-layout.test.js`).

## Adding New Vehicles

To add a new vehicle to the maintenance data:

1. Add the manufacturer key or add to an existing one in `maintenance-schedules.js`
2. Define `specs` (fluids, pressures, battery)
3. Add `models` with service arrays
4. If the model shares a schedule, use a string reference (e.g., `'highlander': 'camry'`)
5. For cross-manufacturer references, use dot notation (e.g., `'soul': 'hyundai.elantra'`)

## Research Reference Files

The Vehicle Data Specialist maintains detailed OEM-specific research in `/home/team/shared/vehicle-data/`. These files contain engine codes, fluid capacities, common issues, and more granular data than what's currently in the app's `maintenance-schedules.js`.