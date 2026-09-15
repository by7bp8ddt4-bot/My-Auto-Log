/**
 * Vehicle Options — engine / transmission / fuel dropdown data.
 *
 * Powers the add-vehicle form's Engine Size / Transmission / Fuel Type
 * dropdowns: for a known make → model → year range, show ONLY the real
 * options that vehicle actually offered — never a generic list.
 *
 * Structure (mirrors reference-specs.js):
 *   makeKey -> modelKey -> yearRange -> { engines, transmissions, fuelTypes }
 *
 *   - makeKey / modelKey MUST match src/data/inventory.js exactly
 *     (automotive makes are plain single-type keys like 'toyota', 'ford';
 *      spaced model keys are quoted: 'santa fe', 'camry hybrid').
 *   - yearRange is the exact 'YYYY-YYYY' string from the inventory.
 *   - engines: normalized labels like '2.5L', '3.5L V6', '2.0L Turbo',
 *     '5.3L V8', '3.0L V6 Diesel', '2.5L Hybrid', 'Electric'.
 *   - transmissions: '6-Speed Automatic', 'CVT', 'Dual-Clutch',
 *     'eCVT (Hybrid)', 'Single-Speed Reduction', etc.
 *   - fuelTypes: 'Gasoline', 'Diesel', 'Hybrid', 'Plug-in Hybrid', 'Electric'.
 *
 * When no entry exists for a vehicle, callers fall back to
 * FALLBACK_VEHICLE_OPTIONS (the ONLY generic lists in the app).
 *
 * Sources: reference-specs.js variant notes (name the exact engines and
 * transmissions), cross-checked against maintenance-schedules.js and
 * OEM knowledge. CRITICAL RULE: never list an option a vehicle did not
 * actually offer — when in doubt, omit (empty/absent is honest, wrong is not).
 */

export const FALLBACK_VEHICLE_OPTIONS = {
  engines: [
    '2.0L Turbo',
    '2.5L',
    '3.5L V6',
    '5.3L V8',
    'Hybrid',
    'Electric',
    'Diesel',
  ],
  transmissions: [
    'Automatic',
    'Manual',
    'CVT',
    'Dual-Clutch',
    '8-Speed Automatic',
    '10-Speed Automatic',
    'eCVT (Hybrid)',
  ],
  fuelTypes: [
    'Gasoline',
    'Diesel',
    'Hybrid',
    'Plug-in Hybrid',
    'Electric',
  ],
  bodyClasses: [
    'Sedan',
    'SUV',
    'Crossover',
    'Pickup',
    'Coupe',
    'Hatchback',
    'Van',
    'Convertible',
    'Wagon',
  ],
};

/** Arrays are emitted sorted (deduped) so dropdown order is deterministic. */
const S = (arr) => [...new Set(arr)].sort();

export const vehicleOptions = {
  toyota: {
    camry: {
      '2018-2026': {
        engines: S(['2.5L', '3.5L V6', '2.5L Hybrid']),
        transmissions: S(['8-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '2007-2011': {
        engines: S(['2.4L', '3.5L V6', '2.4L Hybrid']),
        transmissions: S(['5-Speed Automatic', '6-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '2012-2017': {
        engines: S(['2.5L', '3.5L V6', '2.5L Hybrid']),
        transmissions: S(['6-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    rav4: {
      '2019-2026': {
        engines: S(['2.5L', '2.5L Hybrid', '2.5L Plug-in Hybrid']),
        transmissions: S(['8-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid', 'Plug-in Hybrid']),
      },
      '2013-2018': {
        engines: S(['2.5L', '2.5L Hybrid']),
        transmissions: S(['6-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    tacoma: {
      '2016-2026': {
        engines: S(['2.7L', '3.5L V6', '2.4L Turbo', '2.4L Turbo Hybrid']),
        transmissions: S(['5-Speed Automatic', '6-Speed Automatic', '6-Speed Manual', '8-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '1995-2004': {
        engines: S(['2.4L', '2.7L', '3.4L V6']),
        transmissions: S(['4-Speed Automatic', '5-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2005-2015': {
        engines: S(['2.7L', '4.0L V6']),
        transmissions: S(['4-Speed Automatic', '5-Speed Automatic', '5-Speed Manual', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
    },
    corolla: {
      '2005-2008': {
        engines: S(['1.8L']),
        transmissions: S(['4-Speed Automatic', '5-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2009-2013': {
        engines: S(['1.8L', '2.4L']),
        transmissions: S(['4-Speed Automatic', '5-Speed Manual', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2014-2018': {
        engines: S(['1.8L']),
        transmissions: S(['CVT', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2019-2022': {
        engines: S(['1.8L', '2.0L']),
        transmissions: S(['CVT', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2023-2026': {
        engines: S(['1.8L', '2.0L', '1.8L Hybrid']),
        transmissions: S(['CVT', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    highlander: {
      '2005-2013': {
        engines: S(['3.3L V6', '3.5L V6', '3.3L Hybrid', '3.5L Hybrid']),
        transmissions: S(['4-Speed Automatic', '5-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '2014-2019': {
        engines: S(['2.7L', '3.5L V6', '3.5L Hybrid']),
        transmissions: S(['6-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '2020-2022': {
        engines: S(['3.5L V6', '2.5L Hybrid']),
        transmissions: S(['8-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '2023-2026': {
        engines: S(['2.4L Turbo', '3.5L V6', '2.5L Hybrid']),
        transmissions: S(['8-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    '4runner': {
      '2005-2009': {
        engines: S(['4.0L V6', '4.7L V8']),
        transmissions: S(['5-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2010-2026': {
        engines: S(['4.0L V6']),
        transmissions: S(['5-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2025-2026': {
        engines: S(['2.4L Turbo', '2.4L Turbo Hybrid']),
        transmissions: S(['8-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    tundra: {
      '2005-2006': {
        engines: S(['4.0L V6', '4.7L V8']),
        transmissions: S(['5-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2007-2009': {
        engines: S(['4.0L V6', '4.7L V8', '5.7L V8']),
        transmissions: S(['5-Speed Automatic', '6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2010-2013': {
        engines: S(['4.0L V6', '4.6L V8', '5.7L V8']),
        transmissions: S(['5-Speed Automatic', '6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2014-2021': {
        engines: S(['4.6L V8', '5.7L V8']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2022-2026': {
        engines: S(['3.5L V6 Twin-Turbo', '3.4L V6 Twin-Turbo Hybrid']),
        transmissions: S(['10-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    prius: {
      '2005-2009': {
        engines: S(['1.5L Hybrid']),
        transmissions: S(['eCVT (Hybrid)']),
        fuelTypes: S(['Hybrid']),
      },
      '2010-2015': {
        engines: S(['1.8L Hybrid']),
        transmissions: S(['eCVT (Hybrid)']),
        fuelTypes: S(['Hybrid']),
      },
      '2016-2022': {
        engines: S(['1.8L Hybrid', '1.8L Plug-in Hybrid']),
        transmissions: S(['eCVT (Hybrid)']),
        fuelTypes: S(['Hybrid', 'Plug-in Hybrid']),
      },
      '2023-2026': {
        engines: S(['2.0L Hybrid', '2.0L Plug-in Hybrid']),
        transmissions: S(['eCVT (Hybrid)']),
        fuelTypes: S(['Hybrid', 'Plug-in Hybrid']),
      },
    },
    sienna: {
      '2005-2010': {
        engines: S(['3.3L V6', '3.5L V6']),
        transmissions: S(['5-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2011-2020': {
        engines: S(['3.5L V6']),
        transmissions: S(['6-Speed Automatic', '8-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2021-2026': {
        engines: S(['2.5L Hybrid']),
        transmissions: S(['eCVT (Hybrid)']),
        fuelTypes: S(['Hybrid']),
      },
    },
    gr86: {
      '2022-2026': {
        engines: S(['2.4L']),
        transmissions: S(['6-Speed Manual', '6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    bz4x: {
      '2023-2026': {
        engines: S(['Electric']),
        transmissions: S(['Single-Speed Reduction']),
        fuelTypes: S(['Electric']),
      },
    },
    'camry hybrid': {
      '2007-2026': {
        engines: S(['2.4L Hybrid', '2.5L Hybrid']),
        transmissions: S(['eCVT (Hybrid)']),
        fuelTypes: S(['Hybrid']),
      },
    },
  },
  honda: {
    civic: {
      '2016-2021': {
        engines: S(['2.0L', '1.5L Turbo', '2.0L Turbo']),
        transmissions: S(['CVT', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2022-2026': {
        engines: S(['2.0L', '1.5L Turbo', '2.0L Turbo', '2.0L Hybrid']),
        transmissions: S(['CVT', '6-Speed Manual', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '2006-2011': {
        engines: S(['1.8L', '2.0L']),
        transmissions: S(['5-Speed Automatic', '5-Speed Manual', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2012-2015': {
        engines: S(['1.8L', '2.4L', '1.5L Hybrid']),
        transmissions: S(['5-Speed Automatic', 'CVT', '5-Speed Manual', '6-Speed Manual', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    'cr-v': {
      '2005-2006': {
        engines: S(['2.4L']),
        transmissions: S(['4-Speed Automatic', '5-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2007-2011': {
        engines: S(['2.4L']),
        transmissions: S(['5-Speed Automatic', '5-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2012-2016': {
        engines: S(['2.4L']),
        transmissions: S(['5-Speed Automatic', 'CVT']),
        fuelTypes: S(['Gasoline']),
      },
      '2017-2022': {
        engines: S(['1.5L Turbo', '2.0L Hybrid', '2.4L']),
        transmissions: S(['CVT', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '2023-2026': {
        engines: S(['1.5L Turbo', '2.0L Hybrid']),
        transmissions: S(['CVT', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    accord: {
      '2005-2007': {
        engines: S(['2.4L', '3.0L V6']),
        transmissions: S(['5-Speed Automatic', '5-Speed Manual', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2008-2012': {
        engines: S(['2.4L', '3.5L V6']),
        transmissions: S(['5-Speed Automatic', '5-Speed Manual', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2013-2017': {
        engines: S(['2.4L', '3.5L V6']),
        transmissions: S(['CVT', '6-Speed Automatic', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2018-2022': {
        engines: S(['1.5L Turbo', '2.0L Turbo', '2.0L Hybrid']),
        transmissions: S(['CVT', '10-Speed Automatic', '6-Speed Manual', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '2023-2026': {
        engines: S(['1.5L Turbo', '2.0L Hybrid']),
        transmissions: S(['CVT', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    pilot: {
      '2005-2008': {
        engines: S(['3.5L V6']),
        transmissions: S(['5-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2009-2015': {
        engines: S(['3.5L V6']),
        transmissions: S(['5-Speed Automatic', '6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2016-2022': {
        engines: S(['3.5L V6']),
        transmissions: S(['9-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2023-2026': {
        engines: S(['3.5L V6']),
        transmissions: S(['10-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    odyssey: {
      '2005-2010': {
        engines: S(['3.5L V6']),
        transmissions: S(['5-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2011-2017': {
        engines: S(['3.5L V6']),
        transmissions: S(['6-Speed Automatic', '9-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2018-2026': {
        engines: S(['3.5L V6']),
        transmissions: S(['9-Speed Automatic', '10-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    element: {
      '2003-2011': {
        engines: S(['2.4L']),
        transmissions: S(['4-Speed Automatic', '5-Speed Automatic', '5-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
    },
    ridgeline: {
      '2006-2026': {
        engines: S(['3.5L V6']),
        transmissions: S(['5-Speed Automatic', '6-Speed Automatic', '9-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    hrv: {
      '2016-2026': {
        engines: S(['1.8L', '2.0L']),
        transmissions: S(['CVT']),
        fuelTypes: S(['Gasoline']),
      },
    },
    passport: {
      '2019-2026': {
        engines: S(['3.5L V6']),
        transmissions: S(['9-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
  },
  ford: {
    'f-150': {
      '2005-2008': {
        engines: S(['4.2L V6', '4.6L V8', '5.4L V8']),
        transmissions: S(['4-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2009-2010': {
        engines: S(['4.6L V8', '5.4L V8']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2011-2014': {
        engines: S(['3.7L V6', '3.5L V6 Turbo', '5.0L V8']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2015-2020': {
        engines: S(['2.7L V6 Turbo', '3.5L V6 Turbo', '5.0L V8', '3.0L V6 Diesel']),
        transmissions: S(['6-Speed Automatic', '10-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
      '2021-2026': {
        engines: S(['2.7L V6 Turbo', '3.5L V6 Turbo', '5.0L V8', '3.5L V6 Hybrid']),
        transmissions: S(['10-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    'f-250': {
      '2017-2026': {
        engines: S(['6.2L V8', '7.3L V8', '6.7L V8 Diesel']),
        transmissions: S(['6-Speed Automatic', '10-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
      '1999-2007': {
        engines: S(['5.4L V8', '6.8L V10', '7.3L V8 Diesel', '6.0L V8 Diesel']),
        transmissions: S(['4-Speed Automatic', '5-Speed Automatic', '6-Speed Manual']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
      '2008-2016': {
        engines: S(['5.4L V8', '6.2L V8', '6.4L V8 Diesel', '6.7L V8 Diesel']),
        transmissions: S(['5-Speed Automatic', '6-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
    },
    'e-250': {
      '2009-2026': {
        engines: S(['4.6L V8', '5.4L V8', '6.8L V10']),
        transmissions: S(['4-Speed Automatic', '5-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    escape: {
      '2020-2026': {
        engines: S(['1.5L Turbo', '2.0L Turbo', '2.5L Hybrid', '2.5L Plug-in Hybrid']),
        transmissions: S(['8-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid', 'Plug-in Hybrid']),
      },
      '2001-2012': {
        engines: S(['2.0L', '2.3L', '3.0L V6', '2.3L Hybrid', '2.5L Hybrid']),
        transmissions: S(['4-Speed Automatic', '5-Speed Automatic', '5-Speed Manual', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '2013-2019': {
        engines: S(['1.6L Turbo', '2.0L Turbo', '2.5L']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    explorer: {
      '2005-2010': {
        engines: S(['4.0L V6', '4.6L V8']),
        transmissions: S(['5-Speed Automatic', '6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2011-2015': {
        engines: S(['3.5L V6', '3.5L V6 Turbo', '2.0L Turbo']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2016-2019': {
        engines: S(['3.5L V6', '3.5L V6 Turbo', '2.3L Turbo']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2020-2026': {
        engines: S(['2.3L Turbo', '3.0L V6 Turbo', '3.3L V6 Hybrid']),
        transmissions: S(['10-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    mustang: {
      '2005-2010': {
        engines: S(['4.0L V6', '4.6L V8', '5.4L V8 Supercharged']),
        transmissions: S(['5-Speed Automatic', '5-Speed Manual', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2011-2014': {
        engines: S(['3.7L V6', '5.0L V8', '5.8L V8 Supercharged']),
        transmissions: S(['6-Speed Automatic', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2015-2017': {
        engines: S(['2.3L Turbo', '3.7L V6', '5.0L V8']),
        transmissions: S(['6-Speed Automatic', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2018-2023': {
        engines: S(['2.3L Turbo', '5.0L V8', '5.2L V8 Supercharged']),
        transmissions: S(['6-Speed Manual', '10-Speed Automatic', '7-Speed Dual-Clutch']),
        fuelTypes: S(['Gasoline']),
      },
      '2024-2026': {
        engines: S(['2.3L Turbo', '5.0L V8']),
        transmissions: S(['6-Speed Manual', '10-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    edge: {
      '2007-2010': {
        engines: S(['3.5L V6']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2011-2014': {
        engines: S(['3.5L V6', '3.7L V6', '2.0L Turbo']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2015-2018': {
        engines: S(['2.0L Turbo', '2.7L V6 Turbo', '3.5L V6']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2019-2026': {
        engines: S(['2.0L Turbo', '2.7L V6 Turbo']),
        transmissions: S(['8-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    fusion: {
      '2006-2009': {
        engines: S(['2.3L', '3.0L V6']),
        transmissions: S(['5-Speed Automatic', '6-Speed Automatic', '5-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2010-2012': {
        engines: S(['2.5L', '3.0L V6', '3.5L V6', '2.5L Hybrid']),
        transmissions: S(['6-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '2013-2016': {
        engines: S(['2.5L', '1.6L Turbo', '1.5L Turbo', '2.0L Turbo', '2.0L Hybrid', '2.0L Plug-in Hybrid']),
        transmissions: S(['6-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid', 'Plug-in Hybrid']),
      },
      '2017-2020': {
        engines: S(['2.5L', '1.5L Turbo', '2.0L Turbo', '2.0L Hybrid', '2.0L Plug-in Hybrid']),
        transmissions: S(['6-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid', 'Plug-in Hybrid']),
      },
    },
    bronco: {
      '2021-2026': {
        engines: S(['2.3L Turbo', '2.7L V6 Turbo']),
        transmissions: S(['7-Speed Manual', '10-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    ranger: {
      '2019-2026': {
        engines: S(['2.3L Turbo', '3.0L V6 Turbo']),
        transmissions: S(['10-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '1998-2011': {
        engines: S(['2.3L', '2.5L', '3.0L V6', '4.0L V6']),
        transmissions: S(['4-Speed Automatic', '5-Speed Automatic', '5-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
    },
    maverick: {
      '2022-2026': {
        engines: S(['2.5L Hybrid', '2.0L Turbo']),
        transmissions: S(['eCVT (Hybrid)', '8-Speed Automatic']),
        fuelTypes: S(['Hybrid', 'Gasoline']),
      },
    },
    transit: {
      '2015-2026': {
        engines: S(['3.5L V6', '3.7L V6', '3.5L V6 Turbo', '2.0L V6 Diesel']),
        transmissions: S(['6-Speed Automatic', '10-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
    },
    focus: {
      '2000-2011': {
        engines: S(['2.0L', '2.3L']),
        transmissions: S(['4-Speed Automatic', '5-Speed Automatic', '5-Speed Manual', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2012-2018': {
        engines: S(['2.0L', '1.0L Turbo', '2.0L Turbo', '2.3L Turbo']),
        transmissions: S(['5-Speed Manual', '6-Speed Manual', '6-Speed Automatic', 'Dual-Clutch']),
        fuelTypes: S(['Gasoline']),
      },
    },
    'f-350': {
      '1999-2026': {
        engines: S(['5.4L V8', '6.2L V8', '6.8L V10', '7.3L V8', '7.3L V8 Diesel', '6.0L V8 Diesel', '6.4L V8 Diesel', '6.7L V8 Diesel']),
        transmissions: S(['4-Speed Automatic', '5-Speed Automatic', '6-Speed Automatic', '10-Speed Automatic', '6-Speed Manual']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
    },
    'e-series': {
      '2000-2026': {
        engines: S(['4.6L V8', '5.4L V8', '6.8L V10', '7.3L V8', '6.0L V8 Diesel']),
        transmissions: S(['4-Speed Automatic', '5-Speed Automatic', '6-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
    },
    expedition: {
      '2018-2019': {
        engines: S(['3.5L V6 Turbo']),
        transmissions: S(['10-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2020-2021': {
        engines: S(['3.5L V6 Turbo']),
        transmissions: S(['10-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2025-2026': {
        engines: S(['3.5L V6 Turbo', '3.5L V6 Hybrid']),
        transmissions: S(['10-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    'bronco sport': {
      '2021-2024': {
        engines: S(['1.5L Turbo', '2.0L Turbo']),
        transmissions: S(['8-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2025-2026': {
        engines: S(['2.0L Turbo', '2.3L Turbo']),
        transmissions: S(['8-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
  },
  chevrolet: {
    silverado: {
      '2019-2026': {
        engines: S(['2.7L Turbo', '4.3L V6', '5.3L V8', '6.2L V8', '3.0L V6 Diesel']),
        transmissions: S(['8-Speed Automatic', '10-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
      '2014-2018': {
        engines: S(['4.3L V6', '5.3L V8', '6.2L V8']),
        transmissions: S(['6-Speed Automatic', '8-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '1999-2006': {
        engines: S(['4.3L V6', '4.8L V8', '5.3L V8']),
        transmissions: S(['4-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2007-2013': {
        engines: S(['4.3L V6', '4.8L V8', '5.3L V8', '6.0L V8', '6.2L V8']),
        transmissions: S(['4-Speed Automatic', '6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    'silverado 1500': {
      '2007-2013': {
        engines: S(['4.8L V8', '5.3L V8', '6.0L V8', '6.2L V8']),
        transmissions: S(['4-Speed Automatic', '6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2014-2018': {
        engines: S(['4.3L V6', '5.3L V8', '6.2L V8']),
        transmissions: S(['6-Speed Automatic', '8-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2019-2024': {
        engines: S(['2.7L Turbo', '4.3L V6', '5.3L V8', '6.2L V8', '3.0L V6 Diesel']),
        transmissions: S(['8-Speed Automatic', '10-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
    },
    equinox: {
      '2010-2017': {
        engines: S(['2.4L']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2018-2024': {
        engines: S(['1.5L Turbo', '2.0L Turbo']),
        transmissions: S(['6-Speed Automatic', '9-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    malibu: {
      '2008-2015': {
        engines: S(['2.4L', '2.5L', '3.6L V6', '2.0L Turbo']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2016-2024': {
        engines: S(['1.5L Turbo', '2.0L Turbo', '1.8L Hybrid']),
        transmissions: S(['6-Speed Automatic', '9-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    tahoe: {
      '2007-2014': {
        engines: S(['5.3L V8', '6.0L V8', '6.2L V8', '6.0L V8 Hybrid']),
        transmissions: S(['4-Speed Automatic', '6-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '2015-2020': {
        engines: S(['5.3L V8', '6.2L V8']),
        transmissions: S(['6-Speed Automatic', '10-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2021-2024': {
        engines: S(['5.3L V8', '6.2L V8', '3.0L V6 Diesel']),
        transmissions: S(['10-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
    },
    traverse: {
      '2009-2017': {
        engines: S(['3.6L V6']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2018-2024': {
        engines: S(['3.6L V6', '2.0L Turbo']),
        transmissions: S(['9-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    colorado: {
      '2015-2022': {
        engines: S(['2.5L', '3.6L V6', '2.8L V6 Diesel']),
        transmissions: S(['6-Speed Automatic', '8-Speed Automatic', '6-Speed Manual']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
      '2023-2024': {
        engines: S(['2.7L Turbo']),
        transmissions: S(['8-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2004-2012': {
        engines: S(['2.8L', '2.9L', '3.5L', '3.7L', '5.3L V8']),
        transmissions: S(['4-Speed Automatic', '5-Speed Automatic', '5-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
    },
    camaro: {
      '2016-2026': {
        engines: S(['2.0L Turbo', '3.6L V6', '6.2L V8', '6.2L V8 Supercharged']),
        transmissions: S(['6-Speed Manual', '8-Speed Automatic', '10-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2010-2015': {
        engines: S(['3.6L V6', '6.2L V8', '6.2L V8 Supercharged']),
        transmissions: S(['6-Speed Automatic', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
    },
    'silverado 2500': {
      '2015-2019': {
        engines: S(['6.0L V8', '6.6L V8 Diesel']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
    },
    'silverado 3500': {
      '2015-2019': {
        engines: S(['6.0L V8', '6.6L V8 Diesel']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
    },
    suburban: {
      '2000-2006': {
        engines: S(['5.3L V8', '6.0L V8', '8.1L V8']),
        transmissions: S(['4-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2007-2014': {
        engines: S(['5.3L V8', '6.0L V8', '6.2L V8', '6.0L V8 Hybrid']),
        transmissions: S(['4-Speed Automatic', '6-Speed Automatic', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
      '2015-2020': {
        engines: S(['5.3L V8', '6.2L V8']),
        transmissions: S(['6-Speed Automatic', '10-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2021-2026': {
        engines: S(['5.3L V8', '6.2L V8', '3.0L V6 Diesel']),
        transmissions: S(['10-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
    },
    trax: {
      '2015-2022': {
        engines: S(['1.4L Turbo']),
        transmissions: S(['6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    blazer: {
      '2019-2026': {
        engines: S(['2.5L', '2.0L Turbo', '3.6L V6']),
        transmissions: S(['9-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    corvette: {
      '2005-2013': {
        engines: S(['6.0L V8', '6.2L V8', '7.0L V8', '6.2L V8 Supercharged']),
        transmissions: S(['4-Speed Automatic', '6-Speed Automatic', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2014-2019': {
        engines: S(['6.2L V8', '6.2L V8 Supercharged']),
        transmissions: S(['7-Speed Manual', '8-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2020-2026': {
        engines: S(['5.5L V8', '6.2L V8', '6.2L V8 Hybrid']),
        transmissions: S(['8-Speed Dual-Clutch']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    impala: {
      '2000-2020': {
        engines: S(['3.4L V6', '3.8L V6', '3.5L V6', '3.9L V6', '5.3L V8', '2.5L', '3.6L V6']),
        transmissions: S(['4-Speed Automatic', '6-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    express: {
      '2000-2026': {
        engines: S(['4.3L V6', '4.8L V8', '5.3L V8', '6.0L V8', '6.6L V8 Diesel']),
        transmissions: S(['4-Speed Automatic', '6-Speed Automatic', '8-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
    },
    bolt: {
      '2016-2023': {
        engines: S(['Electric']),
        transmissions: S(['Single-Speed Reduction']),
        fuelTypes: S(['Electric']),
      },
    },
    'bolt euv': {
      '2022-2023': {
        engines: S(['Electric']),
        transmissions: S(['Single-Speed Reduction']),
        fuelTypes: S(['Electric']),
      },
    },
  },
  nissan: {
    rogue: {
      '2014-2026': {
        engines: S(['2.5L', '1.5L Turbo', '2.0L Hybrid']),
        transmissions: S(['CVT', 'eCVT (Hybrid)']),
        fuelTypes: S(['Gasoline', 'Hybrid']),
      },
    },
    murano: {
      '2015-2026': {
        engines: S(['3.5L V6']),
        transmissions: S(['CVT']),
        fuelTypes: S(['Gasoline']),
      },
      '2003-2007': {
        engines: S(['3.5L V6']),
        transmissions: S(['CVT']),
        fuelTypes: S(['Gasoline']),
      },
      '2009-2014': {
        engines: S(['3.5L V6']),
        transmissions: S(['CVT']),
        fuelTypes: S(['Gasoline']),
      },
    },
    altima: {
      '2007-2012': {
        engines: S(['2.5L', '3.5L V6']),
        transmissions: S(['CVT', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2013-2018': {
        engines: S(['2.5L', '3.5L V6']),
        transmissions: S(['CVT']),
        fuelTypes: S(['Gasoline']),
      },
      '2019-2024': {
        engines: S(['2.5L', '2.0L Turbo']),
        transmissions: S(['CVT']),
        fuelTypes: S(['Gasoline']),
      },
    },
    sentra: {
      '2007-2012': {
        engines: S(['2.0L', '2.5L']),
        transmissions: S(['CVT', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2013-2019': {
        engines: S(['1.8L']),
        transmissions: S(['CVT', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2020-2024': {
        engines: S(['2.0L']),
        transmissions: S(['CVT']),
        fuelTypes: S(['Gasoline']),
      },
    },
    pathfinder: {
      '2005-2012': {
        engines: S(['4.0L V6', '5.6L V8']),
        transmissions: S(['5-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2013-2021': {
        engines: S(['3.5L V6']),
        transmissions: S(['CVT']),
        fuelTypes: S(['Gasoline']),
      },
      '2022-2024': {
        engines: S(['3.5L V6']),
        transmissions: S(['9-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    frontier: {
      '2005-2019': {
        engines: S(['2.5L', '4.0L V6']),
        transmissions: S(['5-Speed Automatic', '5-Speed Manual', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
      '2020-2024': {
        engines: S(['3.8L V6']),
        transmissions: S(['9-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    armada: {
      '2017-2026': {
        engines: S(['5.6L V8']),
        transmissions: S(['7-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
      '2004-2015': {
        engines: S(['5.6L V8']),
        transmissions: S(['5-Speed Automatic']),
        fuelTypes: S(['Gasoline']),
      },
    },
    leaf: {
      '2011-2026': {
        engines: S(['Electric']),
        transmissions: S(['Single-Speed Reduction']),
        fuelTypes: S(['Electric']),
      },
    },
    versa: {
      '2007-2026': {
        engines: S(['1.6L', '1.8L']),
        transmissions: S(['CVT', '4-Speed Automatic', '5-Speed Manual', '6-Speed Manual']),
        fuelTypes: S(['Gasoline']),
      },
    },
    kicks: {
      '2018-2026': {
        engines: S(['1.6L', '2.0L']),
        transmissions: S(['CVT']),
        fuelTypes: S(['Gasoline']),
      },
    },
    maxima: {
      '2000-2023': {
        engines: S(['3.0L V6', '3.5L V6']),
        transmissions: S(['4-Speed Automatic', '5-Speed Automatic', '6-Speed Manual', 'CVT']),
        fuelTypes: S(['Gasoline']),
      },
    },
    titan: {
      '2016-2024': {
        engines: S(['5.6L V8', '5.0L V8 Diesel']),
        transmissions: S(['6-Speed Automatic', '7-Speed Automatic', '9-Speed Automatic']),
        fuelTypes: S(['Gasoline', 'Diesel']),
      },
    },
  },
};

/**
 * Exact-lookup for a vehicle's engine/transmission/fuel options.
 *
 * @param {string} makeKey   inventory make key (e.g. 'toyota').
 * @param {string} modelKey  inventory model key (e.g. 'camry', 'camry hybrid').
 * @param {string} yearRange exact 'YYYY-YYYY' inventory range (e.g. '2018-2026').
 * @returns {{engines: string[], transmissions: string[], fuelTypes: string[]}|null}
 *   The authored options for that exact vehicle, or null when no specific data
 *   has been authored yet (callers should then show FALLBACK_VEHICLE_OPTIONS).
 */
export function getVehicleOptions(makeKey, modelKey, yearRange) {
  const make = vehicleOptions[makeKey];
  if (!make) return null;
  const model = make[modelKey];
  if (!model) return null;
  return model[yearRange] ?? null;
}

/** Convenience: engine list for a vehicle, or null when un-authored. */
export function getEnginesForVehicle(makeKey, modelKey, yearRange) {
  const opts = getVehicleOptions(makeKey, modelKey, yearRange);
  return opts ? opts.engines : null;
}

/** Convenience: transmission list for a vehicle, or null when un-authored. */
export function getTransmissionsForVehicle(makeKey, modelKey, yearRange) {
  const opts = getVehicleOptions(makeKey, modelKey, yearRange);
  return opts ? opts.transmissions : null;
}

/** Convenience: fuel type list for a vehicle, or null when un-authored. */
export function getFuelTypesForVehicle(makeKey, modelKey, yearRange) {
  const opts = getVehicleOptions(makeKey, modelKey, yearRange);
  return opts ? opts.fuelTypes : null;
}

export default vehicleOptions;