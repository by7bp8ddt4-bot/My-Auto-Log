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

## Adding New Vehicles

To add a new vehicle to the maintenance data:

1. Add the manufacturer key or add to an existing one in `maintenance-schedules.js`
2. Define `specs` (fluids, pressures, battery)
3. Add `models` with service arrays
4. If the model shares a schedule, use a string reference (e.g., `'highlander': 'camry'`)
5. For cross-manufacturer references, use dot notation (e.g., `'soul': 'hyundai.elantra'`)

## Research Reference Files

The Vehicle Data Specialist maintains detailed OEM-specific research in `/home/team/shared/vehicle-data/`. These files contain engine codes, fluid capacities, common issues, and more granular data than what's currently in the app's `maintenance-schedules.js`.