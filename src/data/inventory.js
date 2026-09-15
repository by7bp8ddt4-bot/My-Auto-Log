/**
 * Vehicle Inventory — canonical catalog driving manual (non-VIN) add-vehicle
 * entry (strict dropdowns: type → make → model → year range).
 *
 * A make/model/year-range is in the inventory if it has data in ANY of:
 *   src/data/reference-specs.js        (PRIMARY — year ranges)
 *   src/data/maintenance-schedules.js  (models only; schedules carry no year ranges)
 *   src/data/manual-index.js           (models + year ranges)
 *   src/data/fuse-boxes.js             (automotive models + year ranges)
 *
 * KEY CONVENTIONS (match the app's existing lookup normalization):
 *   - Make keys are lowercase, separator-normalized, spaced keys quoted.
 *     Multi-type makes are TYPE-SCOPED using the maintenance-schedules
 *     convention so each type's model list stays unambiguous:
 *       yamaha (outboard) / yamaha-mc (motorcycle) / yamaha-wc (watercraft),
 *       honda (car) / honda-mc, bmw (car) / bmw-mc, kawasaki-mc / kawasaki-wc,
 *       suzuki-mc, seadoo (PWC), yanmar (marine diesel) / yanmar-ag,
 *       hyster / hyster-e (electric), john-deere, volvo-trucks, etc.
 *     Every emitted make key resolves downstream:
 *       - maintenance-schedules keys match directly (getScheduleForVehicle);
 *       - reference-specs keys resolve via the VehicleSpecs KEY_MAP
 *         (e.g. 'yamaha-mc' → 'yamaha', 'volvo-trucks' → 'volvo trucks',
 *          'seadoo' → 'sea-doo', 'yanmar-ag' → 'yanmar tractor',
 *          'hyster-e' → 'hyster electric', 'bmw-mc' → 'bmw motorrad');
 *       - manual-index keys resolve via manual-lookup.js MAKE_ALIASES
 *         (type-scoped makes alias to the folded base keys).
 *   - Model keys: prefer the reference-specs key, then manual-index, then
 *     fuse-boxes, then maintenance-schedules (deduped by squashed key).
 *     Spaced keys are quoted ('santa fe', 'camry hybrid'); numeric-leading
 *     keys are quoted ('4runner').
 *   - Year ranges use the app's 'YYYY-YYYY' convention, sorted ascending.
 *
 * TESLA is intentionally EXCLUDED (owner directive; no inventory coverage).
 *
 * Regenerate after data waves: /home/team/shared/vehicle-data/
 *   gen-inventory.mjs (writes this file verbatim).
 */
const VEHICLE_TYPES = ["car","motorcycle","atv","semi-truck","rv","ag-equipment","forklift","watercraft","outboard","marine-diesel"];

const INVENTORY = {
  'car': {
    'toyota': {
      label: "Toyota",
      models: {
      'camry': { label: "Camry", ranges: ['2018-2026', '2007-2011', '2012-2017'] },
      'rav4': { label: "RAV4", ranges: ['2019-2026', '2013-2018'] },
      'tacoma': { label: "Tacoma", ranges: ['2016-2026', '1995-2004', '2005-2015'] },
      'corolla': { label: "Corolla", ranges: ['2005-2008', '2009-2013', '2014-2018', '2019-2022', '2023-2026'] },
      'highlander': { label: "Highlander", ranges: ['2005-2013', '2014-2019', '2020-2022', '2023-2026'] },
      '4runner': { label: "4Runner", ranges: ['2005-2009', '2010-2026', '2025-2026'] },
      'tundra': { label: "Tundra", ranges: ['2005-2006', '2007-2009', '2010-2013', '2014-2021', '2022-2026'] },
      'prius': { label: "Prius", ranges: ['2005-2009', '2010-2015', '2016-2022', '2023-2026'] },
      'sienna': { label: "Sienna", ranges: ['2005-2010', '2011-2020', '2021-2026'] },
      'gr86': { label: "GR86", ranges: ['2022-2026'] },
      'bz4x': { label: "bZ4X", ranges: ['2023-2026'] },
      'camry hybrid': { label: "Camry Hybrid", ranges: ['2007-2026'] }
      }
    },
    'honda': {
      label: "Honda",
      models: {
      'civic': { label: "Civic", ranges: ['2016-2021', '2022-2026', '2006-2011', '2012-2015'] },
      'cr-v': { label: "CR-V", ranges: ['2005-2006', '2007-2011', '2012-2016', '2017-2022', '2023-2026'] },
      'accord': { label: "Accord", ranges: ['2005-2007', '2008-2012', '2013-2017', '2018-2022', '2023-2026'] },
      'pilot': { label: "Pilot", ranges: ['2005-2008', '2009-2015', '2016-2022', '2023-2026'] },
      'odyssey': { label: "Odyssey", ranges: ['2005-2010', '2011-2017', '2018-2026'] },
      'element': { label: "Element", ranges: ['2003-2011'] },
      'ridgeline': { label: "Ridgeline", ranges: ['2006-2026'] },
      'hrv': { label: "HR-V", ranges: ['2016-2026'] },
      'passport': { label: "Passport", ranges: ['2019-2026'] }
      }
    },
    'ford': {
      label: "Ford",
      models: {
      'f-150': { label: "F-150", ranges: ['2005-2008', '2009-2010', '2011-2014', '2015-2020', '2021-2026'] },
      'f-250': { label: "F-250", ranges: ['2017-2026', '1999-2007', '2008-2016'] },
      'e-250': { label: "E-250", ranges: ['2009-2026'] },
      'escape': { label: "Escape", ranges: ['2020-2026', '2001-2012', '2013-2019'] },
      'explorer': { label: "Explorer", ranges: ['2005-2010', '2011-2015', '2016-2019', '2020-2026'] },
      'mustang': { label: "Mustang", ranges: ['2005-2010', '2011-2014', '2015-2017', '2018-2023', '2024-2026'] },
      'edge': { label: "Edge", ranges: ['2007-2010', '2011-2014', '2015-2018', '2019-2026'] },
      'fusion': { label: "Fusion", ranges: ['2006-2009', '2010-2012', '2013-2016', '2017-2020'] },
      'bronco': { label: "Bronco", ranges: ['2021-2026'] },
      'ranger': { label: "Ranger", ranges: ['2019-2026', '1998-2011'] },
      'maverick': { label: "Maverick", ranges: ['2022-2026'] },
      'transit': { label: "Transit", ranges: ['2015-2026'] },
      'focus': { label: "Focus", ranges: ['2000-2011', '2012-2018'] },
      'f-350': { label: "F-350", ranges: ['1999-2026'] },
      'e-series': { label: "E-Series", ranges: ['2000-2026'] },
      'expedition': { label: "Expedition", ranges: ['2018-2019', '2020-2021', '2025-2026'] },
      'bronco sport': { label: "Bronco Sport", ranges: ['2021-2024', '2025-2026'] }
      }
    },
    'chevrolet': {
      label: "Chevrolet",
      models: {
      'silverado': { label: "Silverado", ranges: ['2019-2026', '2014-2018', '1999-2006', '2007-2013'] },
      'silverado 1500': { label: "Silverado 1500", ranges: ['2007-2013', '2014-2018', '2019-2024'] },
      'equinox': { label: "Equinox", ranges: ['2010-2017', '2018-2024'] },
      'malibu': { label: "Malibu", ranges: ['2008-2015', '2016-2024'] },
      'tahoe': { label: "Tahoe", ranges: ['2007-2014', '2015-2020', '2021-2024'] },
      'traverse': { label: "Traverse", ranges: ['2009-2017', '2018-2024'] },
      'colorado': { label: "Colorado", ranges: ['2015-2022', '2023-2024', '2004-2012'] },
      'camaro': { label: "Camaro", ranges: ['2016-2026', '2010-2015'] },
      'silverado 2500': { label: "Silverado 2500", ranges: ['2015-2019'] },
      'silverado 3500': { label: "Silverado 3500", ranges: ['2015-2019'] },
      'suburban': { label: "Suburban", ranges: ['2000-2006', '2007-2014', '2015-2020', '2021-2026'] },
      'trax': { label: "Trax", ranges: ['2015-2022'] },
      'blazer': { label: "Blazer", ranges: ['2019-2026'] },
      'corvette': { label: "Corvette", ranges: ['2005-2013', '2014-2019', '2020-2026'] },
      'impala': { label: "Impala", ranges: ['2000-2020'] },
      'express': { label: "Express", ranges: ['2000-2026'] },
      'bolt': { label: "Bolt", ranges: ['2016-2023'] },
      'bolt euv': { label: "Bolt EUV", ranges: ['2022-2023'] },
      'silverado-shared': { label: "Silverado-Shared", ranges: [] }
      }
    },
    'bmw': {
      label: "BMW",
      models: {
      '328i': { label: "328i", ranges: ['2007-2011', '2012-2016', '2017-2018'] },
      '330i': { label: "330i", ranges: ['2016-2018', '2019-2024', '2001-2005', '2006-2008'] },
      '335i': { label: "335i", ranges: ['2007-2010', '2011-2015'] },
      '340i': { label: "340i", ranges: ['2016-2018', '2019-2024'] },
      '330e': { label: "330e", ranges: ['2016-2018', '2019-2024'] },
      'm3': { label: "M3", ranges: ['2008-2013', '2015-2018', '2021-2024'] },
      '528i': { label: "528i", ranges: ['2005-2010', '2011-2016'] },
      '530i': { label: "530i", ranges: ['2006-2007', '2017-2024'] },
      '535i': { label: "535i", ranges: ['2005-2010', '2011-2016'] },
      '540i': { label: "540i", ranges: ['2017-2024', '1997-2003', '2006-2010'] },
      '530e': { label: "530e", ranges: ['2017-2024'] },
      'm5': { label: "M5", ranges: ['2005-2010', '2012-2016', '2018-2024'] },
      'x3': { label: "X3", ranges: ['2006-2010', '2011-2017', '2018-2024'] },
      'x5': { label: "X5", ranges: ['2006-2013', '2014-2018', '2019-2024'] },
      '3 series': { label: "3 Series", ranges: ['2006-2018', '2019-2024'] },
      '5 series': { label: "5 Series", ranges: ['2005-2016', '2017-2024'] },
      'r1250gs': { label: "R1250GS", ranges: ['2005-2012', '2013-2018', '2019-2026'] },
      's1000rr': { label: "S1000RR", ranges: ['2010-2014', '2015-2018', '2019-2026'] },
      '4 series': { label: "4 Series", ranges: ['2014-2026'] }
      }
    },
    'mercedes': {
      label: "Mercedes-Benz",
      models: {
      'c-class': { label: "C-Class", ranges: ['2008-2014', '2015-2024'] },
      'e-class': { label: "E-Class", ranges: ['2006-2016', '2017-2024'] },
      'gle': { label: "GLE", ranges: ['2016-2019', '2020-2024'] },
      'glc': { label: "GLC", ranges: ['2016-2022', '2023-2024'] },
      'c 300': { label: "C 300", ranges: ['2008-2011', '2012-2014', '2015-2021', '2022-2024'] },
      'c 43': { label: "C 43", ranges: ['2016-2022', '2023-2024'] },
      'c 63': { label: "C 63", ranges: ['2008-2014', '2015-2021', '2023-2024'] },
      'e 350': { label: "E 350", ranges: ['2006-2009', '2010-2016', '2017-2018'] },
      'e 300': { label: "E 300", ranges: ['2017-2020', '2021-2024'] },
      'e 450': { label: "E 450", ranges: ['2019-2020', '2021-2024'] },
      'e 63': { label: "E 63", ranges: ['2007-2009', '2010-2016', '2017-2024'] },
      'gle 350': { label: "GLE 350", ranges: ['2016-2019', '2020-2024'] },
      'gle 450': { label: "GLE 450", ranges: ['2016-2019', '2020-2024'] },
      'gle 53': { label: "GLE 53", ranges: ['2020-2024'] },
      'gle 63': { label: "GLE 63", ranges: ['2016-2019', '2020-2024'] },
      'glc 300': { label: "GLC 300", ranges: ['2016-2022', '2023-2024'] },
      'glc 43': { label: "GLC 43", ranges: ['2017-2023', '2024-2024'] },
      'glc 63': { label: "GLC 63", ranges: ['2017-2021', '2023-2024'] },
      'ml 350': { label: "ML 350", ranges: ['2006-2011', '2012-2015'] },
      'gla': { label: "GLA", ranges: ['2015-2026'] },
      'glb': { label: "GLB", ranges: ['2020-2026'] }
      }
    },
    'hyundai': {
      label: "Hyundai",
      models: {
      'elantra': { label: "Elantra", ranges: ['2007-2016', '2017-2024'] },
      'sonata': { label: "Sonata", ranges: ['2006-2014', '2015-2024'] },
      'tucson': { label: "Tucson", ranges: ['2010-2015', '2016-2021', '2022-2024'] },
      'santa fe': { label: "Santa FE", ranges: ['2007-2018', '2019-2024'] },
      'palisade': { label: "Palisade", ranges: ['2020-2024'] },
      'ioniq 5': { label: "IONIQ 5", ranges: ['2022-2026'] },
      'santa cruz': { label: "Santa Cruz", ranges: ['2022-2026'] },
      'kona': { label: "Kona", ranges: ['2018-2026'] },
      'ioniq 6': { label: "IONIQ 6", ranges: ['2023-2026'] },
      'venue': { label: "Venue", ranges: ['2020-2026'] }
      }
    },
    'kia': {
      label: "Kia",
      models: {
      'soul': { label: "Soul", ranges: ['2010-2019', '2020-2024'] },
      'sportage': { label: "Sportage", ranges: ['2007-2016', '2017-2022', '2023-2024'] },
      'sorento': { label: "Sorento", ranges: ['2007-2020', '2021-2024'] },
      'telluride': { label: "Telluride", ranges: ['2020-2024'] },
      'forte': { label: "Forte", ranges: ['2010-2018', '2019-2024'] },
      'k5': { label: "K5", ranges: ['2021-2026'] },
      'carnival': { label: "Carnival", ranges: ['2022-2026'] },
      'ev6': { label: "EV6", ranges: ['2022-2026'] },
      'niro': { label: "Niro", ranges: ['2017-2026'] }
      }
    },
    'nissan': {
      label: "Nissan",
      models: {
      'rogue': { label: "Rogue", ranges: ['2014-2026'] },
      'murano': { label: "Murano", ranges: ['2015-2026', '2003-2007', '2009-2014'] },
      'altima': { label: "Altima", ranges: ['2007-2012', '2013-2018', '2019-2024'] },
      'sentra': { label: "Sentra", ranges: ['2007-2012', '2013-2019', '2020-2024'] },
      'pathfinder': { label: "Pathfinder", ranges: ['2005-2012', '2013-2021', '2022-2024'] },
      'frontier': { label: "Frontier", ranges: ['2005-2019', '2020-2024'] },
      'armada': { label: "Armada", ranges: ['2017-2026', '2004-2015'] },
      'leaf': { label: "Leaf", ranges: ['2011-2026'] },
      'versa': { label: "Versa", ranges: ['2007-2026'] },
      'kicks': { label: "Kicks", ranges: ['2018-2026'] },
      'maxima': { label: "Maxima", ranges: ['2000-2023'] },
      'titan': { label: "Titan", ranges: ['2016-2024'] }
      }
    },
    'subaru': {
      label: "Subaru",
      models: {
      'outback': { label: "Outback", ranges: ['2005-2009', '2010-2014', '2015-2019', '2020-2024'] },
      'forester': { label: "Forester", ranges: ['2005-2010', '2011-2013', '2014-2018', '2019-2024'] },
      'crosstrek': { label: "Crosstrek", ranges: ['2013-2017', '2018-2020', '2021-2024'] },
      'impreza': { label: "Impreza", ranges: ['2005-2011', '2012-2023', '2024-2024'] },
      'ascent': { label: "Ascent", ranges: ['2019-2024'] },
      'legacy': { label: "Legacy", ranges: ['2015-2026'] }
      }
    },
    'jeep': {
      label: "Jeep",
      models: {
      'grand cherokee': { label: "Grand Cherokee", ranges: ['2005-2010', '2011-2013', '2014-2015', '2016-2021', '2022-2024'] },
      'wrangler': { label: "Wrangler", ranges: ['2007-2011', '2012-2017', '2018-2024'] },
      'cherokee': { label: "Cherokee", ranges: ['2014-2018', '2019-2024'] },
      'compass': { label: "Compass", ranges: ['2007-2016', '2017-2024'] },
      'grand wagoneer': { label: "Grand Wagoneer", ranges: ['2022-2026'] },
      'patriot': { label: "Patriot", ranges: ['2007-2017'] },
      'wagoneer': { label: "Wagoneer", ranges: ['2022-2026'] },
      'gladiator': { label: "Gladiator", ranges: ['2020-2026'] },
      'renegade': { label: "Renegade", ranges: ['2020-2023'] }
      }
    },
    'ram': {
      label: "RAM",
      models: {
      '1500': { label: "1500", ranges: ['2009-2012', '2013-2018', '2019-2024'] },
      '2500': { label: "2500", ranges: ['2010-2012', '2013-2018', '2019-2024'] },
      '3500': { label: "3500", ranges: ['2010-2012', '2013-2018', '2019-2024'] }
      }
    },
    'volkswagen': {
      label: "Volkswagen",
      models: {
      'golf': { label: "Golf", ranges: ['2006-2009', '2010-2014', '2015-2017', '2018-2021', '2022-2024'] },
      'gti': { label: "GTI", ranges: ['2006-2009', '2010-2014', '2015-2017', '2018-2021', '2022-2024'] },
      'jetta': { label: "Jetta", ranges: ['2005-2010', '2011-2014', '2015-2018', '2019-2021', '2022-2024'] },
      'passat': { label: "Passat", ranges: ['2006-2010', '2012-2019', '2020-2022'] },
      'tiguan': { label: "Tiguan", ranges: ['2009-2017', '2018-2024'] },
      'atlas': { label: "Atlas", ranges: ['2018-2023', '2024-2024'] },
      'id.4': { label: "ID.4", ranges: ['2021-2026'] },
      'taos': { label: "Taos", ranges: ['2022-2026'] }
      }
    },
    'gmc': {
      label: "GMC",
      models: {
      'yukon xl': { label: "Yukon XL", ranges: ['2015-2026', '2007-2014'] },
      'sierra': { label: "Sierra", ranges: ['2019-2026', '2014-2018', '1999-2006', '2007-2013'] },
      'yukon': { label: "Yukon", ranges: ['2015-2026', '2007-2014'] },
      'terrain': { label: "Terrain", ranges: ['2018-2026'] },
      'acadia': { label: "Acadia", ranges: ['2017-2026'] },
      'canyon': { label: "Canyon", ranges: ['2015-2018', '2019-2022', '2023-2026'] }
      }
    },
    'mazda': {
      label: "Mazda",
      models: {
      '3': { label: "3", ranges: ['2019-2026', '2005-2009', '2010-2013', '2014-2018'] },
      '6': { label: "6", ranges: ['2005-2008', '2009-2013', '2014-2017', '2018-2021'] },
      '626': { label: "626", ranges: ['1993-2002'] },
      'cx-5': { label: "CX-5", ranges: ['2013-2016', '2017-2024'] },
      'cx-9': { label: "CX-9", ranges: ['2007-2015', '2016-2024'] },
      'cx-30': { label: "CX-30", ranges: ['2020-2024'] },
      'mx-5 miata': { label: "MX-5 Miata", ranges: ['2006-2015', '2016-2024'] },
      'mazda3': { label: "Mazda3", ranges: ['2014-2026'] },
      'cx-50': { label: "CX-50", ranges: ['2023-2026'] },
      'cx-90': { label: "CX-90", ranges: ['2024-2026'] },
      'mazda6': { label: "Mazda6", ranges: ['2003-2021'] },
      'mx-6': { label: "MX-6", ranges: ['1993-1997'] },
      'protege': { label: "Protege", ranges: ['1995-2003'] },
      'millenia': { label: "Millenia", ranges: ['1995-2002'] },
      'b-series': { label: "B-Series", ranges: ['1994-2009'] },
      'rx-7': { label: "RX-7", ranges: ['1993-1995'] },
      'rx-8': { label: "RX-8", ranges: ['2004-2011'] },
      'mx-5': { label: "MX-5", ranges: ['1989-1997', '2002-2003', '2004-2005', '2006-2006', '2007-2009', '2010-2015', '2016-2016', '2017-2017', '2018-2026'] }
      }
    },
    'audi': {
      label: "Audi",
      models: {
      'a4': { label: "A4", ranges: ['2005-2008', '2009-2012', '2013-2016', '2017-2024'] },
      'a6': { label: "A6", ranges: ['2005-2008', '2009-2011', '2012-2018', '2019-2024'] },
      'q5': { label: "Q5", ranges: ['2009-2012', '2013-2017', '2018-2024'] },
      'q7': { label: "Q7", ranges: ['2007-2010', '2011-2015', '2016-2019', '2020-2024'] },
      's4': { label: "S4", ranges: ['2005-2008', '2009-2012', '2013-2016', '2017-2024'] },
      's6': { label: "S6", ranges: ['2005-2008', '2009-2011', '2012-2018', '2019-2024'] },
      'sq5': { label: "SQ5", ranges: ['2009-2012', '2013-2017', '2018-2024'] },
      'sq7': { label: "SQ7", ranges: ['2007-2010', '2011-2015', '2016-2019', '2020-2024'] },
      'a3': { label: "A3", ranges: ['2006-2026'] }
      }
    },
    'volvo': {
      label: "Volvo",
      models: {
      's60': { label: "S60", ranges: ['2005-2009', '2011-2013', '2014-2018', '2019-2024'] },
      'xc60': { label: "XC60", ranges: ['2009-2014', '2015-2017', '2018-2024'] },
      'xc90': { label: "XC90", ranges: ['2005-2006', '2007-2014', '2016-2019', '2020-2024'] },
      'xc40': { label: "XC40", ranges: ['2019-2026'] }
      }
    },
    'lexus': {
      label: "Lexus",
      models: {
      'rx': { label: "RX", ranges: ['2005-2009', '2010-2015', '2016-2022', '2023-2024'] },
      'es': { label: "ES", ranges: ['2007-2012', '2013-2018', '2019-2024'] },
      'is': { label: "IS", ranges: ['2006-2013', '2014-2020', '2021-2024'] },
      'nx': { label: "NX", ranges: ['2015-2026'] },
      'gx': { label: "GX", ranges: ['2010-2017'] }
      }
    },
    'acura': {
      label: "Acura",
      models: {
      'mdx': { label: "MDX", ranges: ['2007-2013', '2014-2020', '2022-2024'] },
      'rdx': { label: "RDX", ranges: ['2007-2012', '2013-2018', '2019-2024'] },
      'tlx': { label: "TLX", ranges: ['2015-2020', '2021-2024'] },
      'integra': { label: "Integra", ranges: ['2023-2026'] },
      'ilx': { label: "ILX", ranges: ['2013-2026'] }
      }
    },
    'dodge': {
      label: "Dodge",
      models: {
      'charger': { label: "Charger", ranges: ['2006-2010', '2011-2014', '2015-2023'] },
      'challenger': { label: "Challenger", ranges: ['2008-2010', '2011-2014', '2015-2023'] },
      'durango': { label: "Durango", ranges: ['2011-2013', '2014-2020', '2021-2024'] },
      'grand caravan': { label: "Grand Caravan", ranges: ['2008-2020'] },
      'journey': { label: "Journey", ranges: ['2009-2020'] }
      }
    },
    'chrysler': {
      label: "Chrysler",
      models: {
      '300': { label: "300", ranges: ['2005-2010', '2011-2014', '2015-2023'] },
      'pacifica': { label: "Pacifica", ranges: ['2017-2026'] }
      }
    },
    'lincoln': {
      label: "Lincoln",
      models: {
      'mkz': { label: "MKZ", ranges: ['2007-2012', '2013-2016', '2017-2020'] },
      'navigator': { label: "Navigator", ranges: ['2007-2014', '2015-2017', '2018-2024'] },
      'corsair': { label: "Corsair", ranges: ['2020-2026'] },
      'nautilus': { label: "Nautilus", ranges: ['2019-2026'] },
      'aviator': { label: "Aviator", ranges: ['2020-2026'] }
      }
    },
    'infiniti': {
      label: "Infiniti",
      models: {
      'g35': { label: "G35", ranges: ['2005-2007'] },
      'g37': { label: "G37", ranges: ['2008-2013'] },
      'q50': { label: "Q50", ranges: ['2014-2015', '2016-2024'] },
      'q60': { label: "Q60", ranges: ['2014-2022'] },
      'qx50': { label: "QX50", ranges: ['2014-2026'] },
      'qx60': { label: "QX60", ranges: ['2014-2026'] },
      'qx80': { label: "QX80", ranges: ['2014-2026'] }
      }
    },
    'buick': {
      label: "Buick",
      models: {
      'enclave': { label: "Enclave", ranges: ['2008-2009', '2010-2017', '2018-2024'] },
      'envision': { label: "Envision", ranges: ['2016-2026'] },
      'encore': { label: "Encore", ranges: ['2013-2022'] },
      'lacrosse': { label: "Lacrosse", ranges: ['2005-2009', '2010-2016', '2017-2019'] },
      'gnx': { label: "GNX", ranges: ['1987-1987'] },
      'riviera': { label: "Riviera", ranges: ['1995-1999'] },
      'lesabre': { label: "Lesabre", ranges: ['2000-2005'] },
      'park avenue': { label: "Park Avenue", ranges: ['1997-2005'] },
      'rendezvous': { label: "Rendezvous", ranges: ['2002-2007'] }
      }
    },
    'pontiac': {
      label: "Pontiac",
      models: {
      'grand prix': { label: "Grand Prix", ranges: ['2004-2008'] },
      'solstice': { label: "Solstice", ranges: ['2006-2010'] },
      'g8': { label: "G8", ranges: ['2008-2009'] },
      'vibe': { label: "Vibe", ranges: ['2003-2010'] },
      'firebird': { label: "Firebird", ranges: ['1993-2002'] },
      'g6': { label: "G6", ranges: ['2005-2010'] },
      'bonneville': { label: "Bonneville", ranges: ['2000-2005'] },
      'grand am': { label: "Grand AM", ranges: ['1999-2005'] },
      'sunfire': { label: "Sunfire", ranges: ['1995-2005'] },
      'montana': { label: "Montana", ranges: ['1999-2009'] },
      'torrent': { label: "Torrent", ranges: ['2006-2009'] },
      'solstice gxp': { label: "Solstice GXP", ranges: ['2007-2009'] },
      'g8 gt': { label: "G8 GT", ranges: ['2008-2009'] },
      'g8 gxp': { label: "G8 GXP", ranges: ['2009-2009'] },
      'vibe gt': { label: "Vibe GT", ranges: ['2003-2006'] },
      'firebird trans am': { label: "Firebird Trans Am", ranges: ['1993-2002'] },
      'firebird formula': { label: "Firebird Formula", ranges: ['1993-2002'] },
      'aztek': { label: "Aztek", ranges: ['2000-2005'] },
      'g3': { label: "G3", ranges: ['2009-2010'] },
      'g5': { label: "G5", ranges: ['2007-2010'] },
      'gto': { label: "GTO", ranges: ['2004-2006'] },
      'montana-sv6': { label: "Montana-SV6", ranges: ['2005-2009'] },
      'pursuit': { label: "Pursuit", ranges: ['2005-2006'] },
      'trans-sport': { label: "Trans-Sport", ranges: ['1997-1999'] }
      }
    },
    'plymouth': {
      label: "Plymouth",
      models: {
      'road runner': { label: "Road Runner", ranges: ['1968-1980'] },
      'barracuda': { label: "Barracuda", ranges: ['1964-1974'] },
      'superbird': { label: "Superbird", ranges: ['1970-1970'] },
      'gtx': { label: "GTX", ranges: ['1967-1971'] },
      'duster': { label: "Duster", ranges: ['1970-1976'] },
      'valiant': { label: "Valiant", ranges: ['1960-1976'] },
      'satellite': { label: "Satellite", ranges: ['1965-1974'] },
      'fury': { label: "Fury", ranges: ['1956-1978'] },
      'belvedere': { label: "Belvedere", ranges: ['1954-1970'] },
      'voyager': { label: "Voyager", ranges: ['1984-2000'] },
      'horizon': { label: "Horizon", ranges: ['1978-1990'] },
      'reliant': { label: "Reliant", ranges: ['1981-1989'] },
      'breeze': { label: "Breeze", ranges: ['1996-2000'] },
      'neon': { label: "Neon", ranges: ['1995-2001'] },
      'prowler': { label: "Prowler", ranges: ['1997-2001'] },
      'cuda': { label: "Cuda", ranges: ['1964-1974'] },
      'grand voyager': { label: "Grand Voyager", ranges: ['1984-2000'] }
      }
    },
    'oldsmobile': {
      label: "Oldsmobile",
      models: {
      '88': { label: "88", ranges: ['1960-1999'] },
      '98': { label: "98", ranges: ['1960-1996'] },
      '442': { label: "442", ranges: ['1964-1991'] },
      'cutlass': { label: "Cutlass", ranges: ['1961-1999'] },
      'cutlass supreme': { label: "Cutlass Supreme", ranges: ['1970-1997'] },
      'cutlass ciera': { label: "Cutlass Ciera", ranges: ['1982-1996'] },
      'toronado': { label: "Toronado", ranges: ['1966-1992'] },
      'silhouette': { label: "Silhouette", ranges: ['1990-2004'] },
      'intrigue': { label: "Intrigue", ranges: ['1998-2002'] },
      'alero': { label: "Alero", ranges: ['1999-2004'] },
      'aurora': { label: "Aurora", ranges: ['1995-2003'] },
      'bravada': { label: "Bravada", ranges: ['1991-2004'] },
      'delta 88': { label: "Delta 88", ranges: ['1960-1999'] },
      'achieva': { label: "Achieva", ranges: ['1992-1998'] }
      }
    },
    'amc': {
      label: "AMC",
      models: {
      'eagle': { label: "Eagle", ranges: ['1979-1988'] },
      'hornet': { label: "Hornet", ranges: ['1970-1977'] },
      'pacer': { label: "Pacer", ranges: ['1975-1980'] },
      'javelin': { label: "Javelin", ranges: ['1968-1974'] },
      'matador': { label: "Matador", ranges: ['1971-1978'] },
      'rambler': { label: "Rambler", ranges: ['1950-1969'] },
      'cj-7': { label: "CJ-7", ranges: ['1976-1986'] },
      'wagoneer': { label: "Wagoneer", ranges: ['1963-1990'] },
      'grand wagoneer': { label: "Grand Wagoneer", ranges: ['1984-1991'] },
      'cherokee xj': { label: "Cherokee XJ", ranges: ['1984-2001'] },
      'eagle sx/4': { label: "Eagle SX/4", ranges: ['1979-1988'] },
      'eagle wagon': { label: "Eagle Wagon", ranges: ['1979-1988'] },
      'concord': { label: "Concord", ranges: ['1970-1977'] },
      'spirit': { label: "Spirit", ranges: ['1970-1977'] },
      'gremlin': { label: "Gremlin", ranges: ['1970-1977'] },
      'amx': { label: "AMX", ranges: ['1968-1974'] },
      'ambassador': { label: "Ambassador", ranges: ['1971-1978'] },
      'classic': { label: "Classic", ranges: ['1961-1966'] },
      'rebel': { label: "Rebel", ranges: ['1967-1970'] },
      'marlin': { label: "Marlin", ranges: ['1965-1967'] },
      'machine': { label: "Machine", ranges: ['1969-1970'] },
      'sc/rambler': { label: "SC/Rambler", ranges: ['1969-1969'] },
      'cj-5': { label: "CJ-5", ranges: ['1976-1986'] },
      'cj-8 scrambler': { label: "CJ-8 Scrambler", ranges: ['1976-1986'] }
      }
    },
    'mg': {
      label: "MG",
      models: {
      'mg td': { label: "MG TD", ranges: ['1950-1953'] },
      'mg tf': { label: "MG TF", ranges: ['1953-1955'] },
      'mg a': { label: "MG A", ranges: ['1955-1962'] },
      'mga twin cam': { label: "MGA Twin Cam", ranges: ['1958-1960'] },
      'mg midget': { label: "MG Midget", ranges: ['1961-1979'] },
      'mg b': { label: "MG B", ranges: ['1962-1980'] },
      'mg b gt v8': { label: "MG B GT V8", ranges: ['1973-1976'] },
      'mg c': { label: "MG C", ranges: ['1967-1969'] },
      'mg metro': { label: "MG Metro", ranges: ['1980-1990'] },
      'mg maestro': { label: "MG Maestro", ranges: ['1983-1991'] },
      'mg rv8': { label: "MG RV8", ranges: ['1992-1995'] },
      'mg f': { label: "MG F", ranges: ['1995-2002'] },
      'mg b gt': { label: "MG B GT", ranges: ['1962-1980'] },
      'mg montego': { label: "MG Montego", ranges: ['1983-1991'] },
      'gs': { label: "GS", ranges: ['2015-2019'] },
      'hs': { label: "HS", ranges: ['2019-2023'] },
      'hs-phev': { label: "HS-Phev", ranges: ['2020-2023'] },
      'mg3': { label: "MG3", ranges: ['2013-2018', '2019-2023'] },
      'mg4': { label: "MG4", ranges: ['2022-2024'] },
      'mg5': { label: "MG5", ranges: ['2020-2024'] },
      'mg6': { label: "MG6", ranges: ['2014-2016'] },
      'zr': { label: "ZR", ranges: ['2001-2005'] },
      'zs': { label: "ZS", ranges: ['2017-2020', '2021-2023'] },
      'zs-ev': { label: "ZS-EV", ranges: ['2019-2021', '2022-2024'] }
      }
    },
    'mitsubishi': {
      label: "Mitsubishi",
      models: {
      'outlander': { label: "Outlander", ranges: ['2007-2013', '2014-2021', '2022-2024'] },
      'outlander sport': { label: "Outlander Sport", ranges: ['2011-2013', '2014-2024'] },
      'lancer': { label: "Lancer", ranges: ['2008-2017'] },
      'eclipse': { label: "Eclipse", ranges: ['2000-2012'] },
      'montero': { label: "Montero", ranges: ['2000-2006'] },
      '3000gt': { label: "3000GT", ranges: ['1991-1999'] },
      'galant': { label: "Galant", ranges: ['2000-2012'] },
      'eclipse cross': { label: "Eclipse Cross", ranges: ['2018-2026'] },
      'mirage': { label: "Mirage", ranges: ['2014-2026'] }
      }
    },
    'cadillac': {
      label: "Cadillac",
      models: {
      'xt5': { label: "XT5", ranges: ['2017-2026'] },
      'xt4': { label: "XT4", ranges: ['2019-2026'] },
      'xt6': { label: "XT6", ranges: ['2020-2026'] },
      'escalade': { label: "Escalade", ranges: ['2015-2026'] },
      'ct4': { label: "CT4", ranges: ['2020-2026'] },
      'ct5': { label: "CT5", ranges: ['2020-2026'] },
      'lyriq': { label: "LYRIQ", ranges: ['2023-2026'] }
      }
    },
  },
  'motorcycle': {
    'harley-davidson': {
      label: "Harley-Davidson",
      models: {
      'sportster': { label: "Sportster", ranges: ['2005-2006', '2007-2022'] },
      'softail': { label: "Softail", ranges: ['2005-2016', '2017-2026'] },
      'touring': { label: "Touring", ranges: ['2005-2016', '2017-2026'] },
      'street glide': { label: "Street Glide", ranges: ['2000-2026'] },
      'road king': { label: "Road King", ranges: ['2000-2026'] },
      'fat boy': { label: "Fat Boy", ranges: ['2000-2026'] },
      'electra glide': { label: "Electra Glide", ranges: ['2000-2026'] }
      }
    },
    'yamaha-mc': {
      label: "Yamaha",
      models: {
      'yzf-r6': { label: "YZF-R6", ranges: ['2005-2005', '2006-2020'] },
      'yzf-r1': { label: "YZF-R1", ranges: ['2005-2014', '2015-2026'] },
      'mt-07': { label: "MT-07", ranges: ['2015-2017', '2018-2026'] },
      'mt-09': { label: "MT-09", ranges: ['2014-2020', '2021-2026'] },
      'fz-07': { label: "FZ-07", ranges: ['2015-2017', '2018-2026'] },
      'fz-09': { label: "FZ-09", ranges: ['2014-2020', '2021-2026'] },
      'r1': { label: "R1", ranges: ['2000-2026'] },
      'r7': { label: "R7", ranges: [] },
      'super tenere': { label: "Super Tenere", ranges: [] }
      }
    },
    'honda-mc': {
      label: "Honda",
      models: {
      'cbr600rr': { label: "CBR600RR", ranges: ['2005-2006', '2007-2026'] },
      'cbr1000rr': { label: "CBR1000RR", ranges: ['2005-2016', '2017-2026'] },
      'gold wing': { label: "Gold Wing", ranges: ['2005-2017', '2018-2026'] },
      'cbr650r': { label: "CBR650R", ranges: ['2000-2026'] },
      'cb1000r': { label: "CB1000R", ranges: ['2000-2026'] },
      'rebel': { label: "Rebel", ranges: ['2000-2026'] },
      'nc750x': { label: "NC750X", ranges: ['2000-2026'] },
      'africa twin': { label: "Africa Twin", ranges: [] }
      }
    },
    'kawasaki-mc': {
      label: "Kawasaki",
      models: {
      'ninja 650': { label: "Ninja 650", ranges: ['2006-2016', '2017-2026'] },
      'ninja zx-6r': { label: "Ninja ZX-6R", ranges: ['2005-2008', '2009-2012', '2013-2026'] },
      'ninja zx-10r': { label: "Ninja ZX-10R", ranges: ['2005-2010', '2011-2026'] },
      'er-6f': { label: "ER-6F", ranges: ['2006-2016', '2017-2026'] },
      'z900': { label: "Z900", ranges: [] },
      'z650': { label: "Z650", ranges: [] },
      'versys 650': { label: "Versys 650", ranges: [] },
      'vulcan s': { label: "Vulcan S", ranges: [] }
      }
    },
    'suzuki-mc': {
      label: "Suzuki",
      models: {
      'gsx-r600': { label: "GSX-R600", ranges: ['2005-2010', '2011-2026'] },
      'gsx-r750': { label: "GSX-R750", ranges: ['2005-2010', '2011-2026'] },
      'hayabusa': { label: "Hayabusa", ranges: ['2005-2007', '2008-2020', '2021-2026'] },
      'gsx-r1000': { label: "GSX-R1000", ranges: ['2000-2026'] },
      'sv650': { label: "SV650", ranges: ['2000-2026'] },
      'v-strom 650': { label: "V-Strom 650", ranges: ['2000-2026'] }
      }
    },
    'bmw-mc': {
      label: "BMW",
      models: {
      'r1250gs': { label: "R1250GS", ranges: ['2005-2012', '2013-2018', '2019-2026'] },
      's1000rr': { label: "S1000RR", ranges: ['2010-2014', '2015-2018', '2019-2026'] },
      'r nine t': { label: "R Nine T", ranges: ['2000-2026'] },
      'f850gs': { label: "F850GS", ranges: ['2000-2026'] },
      'k1600': { label: "K1600", ranges: ['2000-2026'] }
      }
    },
    'indian': {
      label: "Indian",
      models: {
      'scout': { label: "Scout", ranges: ['2015-2020', '2021-2026'] },
      'chieftain': { label: "Chieftain", ranges: ['2014-2018', '2019-2026'] },
      'challenger': { label: "Challenger", ranges: ['2000-2026'] },
      'springfield': { label: "Springfield", ranges: ['2000-2026'] }
      }
    },
  },
  'atv': {
    'polaris': {
      label: "Polaris",
      models: {
      'sportsman 570': { label: "Sportsman 570", ranges: ['2014-2026'] },
      'sportsman 850': { label: "Sportsman 850", ranges: ['2016-2026', '2006-2015'] },
      'rzr 1000': { label: "RZR 1000", ranges: ['2014-2026'] },
      'rzr turbo r': { label: "RZR Turbo R", ranges: ['2022-2026'] },
      'general 1000': { label: "General 1000", ranges: ['2016-2026'] },
      'ranger 1000': { label: "Ranger 1000", ranges: ['2014-2026'] },
      'rzr xp 1000': { label: "RZR XP 1000", ranges: ['2014-2026'] },
      'ranger xp 1000': { label: "Ranger XP 1000", ranges: ['2014-2026'] },
      'sportsman 570 touring': { label: "Sportsman 570 Touring", ranges: ['2014-2026'] },
      'sportsman 850 high lifter': { label: "Sportsman 850 High Lifter", ranges: ['2016-2026', '2007-2015'] },
      'rzr': { label: "RZR", ranges: ['2008-2026'] },
      'general': { label: "General", ranges: ['2016-2026'] },
      'sportsman': { label: "Sportsman", ranges: ['2005-2026'] },
      'ace': { label: "Ace", ranges: ['2014-2026'] },
      'ranger': { label: "Ranger", ranges: ['2005-2026'] },
      'rzr turbo': { label: "RZR Turbo", ranges: ['2000-2026'] },
      'rzr xp': { label: "RZR XP", ranges: ['2000-2026'] },
      'rzr pro': { label: "RZR Pro", ranges: ['2000-2026'] },
      'rzr trail': { label: "RZR Trail", ranges: ['2000-2026'] },
      'rzr 570': { label: "RZR 570", ranges: ['2000-2026'] },
      'rzr 900': { label: "RZR 900", ranges: ['2000-2026'] },
      'general xp': { label: "General XP", ranges: ['2000-2026'] },
      'sportsman 450': { label: "Sportsman 450", ranges: ['2000-2026'] },
      'sportsman 1000': { label: "Sportsman 1000", ranges: ['2000-2026'] },
      'sportsman xp': { label: "Sportsman XP", ranges: ['2000-2026'] },
      'sportsman touring': { label: "Sportsman Touring", ranges: ['2000-2026'] },
      'scrambler': { label: "Scrambler", ranges: ['2000-2026'] },
      'ace 570': { label: "Ace 570", ranges: ['2000-2026'] },
      'ace 900': { label: "Ace 900", ranges: ['2000-2026'] },
      'ranger 570': { label: "Ranger 570", ranges: ['2000-2026'] },
      'ranger 900': { label: "Ranger 900", ranges: ['2000-2026'] },
      'ranger xp': { label: "Ranger XP", ranges: ['2000-2026'] },
      'ranger crew': { label: "Ranger Crew", ranges: ['2000-2026'] }
      }
    },
  },
  'semi-truck': {
    'freightliner': {
      label: "Freightliner",
      models: {
      'cascadia': { label: "Cascadia", ranges: ['2005-2014', '2015-2026'] },
      'm2 106': { label: "M2 106", ranges: ['2005-2014', '2015-2026'] },
      '114sd': { label: "114SD", ranges: ['2005-2014', '2015-2026'] },
      'columbia': { label: "Columbia", ranges: ['2005-2014', '2015-2026'] },
      'm2': { label: "M2", ranges: ['2000-2026'] },
      'coronado': { label: "Coronado", ranges: ['2000-2026'] }
      }
    },
    'kenworth': {
      label: "Kenworth",
      models: {
      't680': { label: "T680", ranges: ['2005-2014', '2015-2026'] },
      't880': { label: "T880", ranges: ['2005-2014', '2015-2026'] },
      'w900': { label: "W900", ranges: ['2005-2014', '2015-2026'] },
      't370': { label: "T370", ranges: ['2005-2014', '2015-2026'] },
      't440': { label: "T440", ranges: ['2000-2026'] }
      }
    },
    'peterbilt': {
      label: "Peterbilt",
      models: {
      '337': { label: "337", ranges: ['2005-2014', '2015-2026'] },
      '389': { label: "389", ranges: ['2005-2014', '2015-2026'] },
      '520': { label: "520", ranges: ['2000-2026'] },
      '567': { label: "567", ranges: ['2005-2014', '2015-2026'] },
      '579': { label: "579", ranges: ['2005-2014', '2015-2026'] }
      }
    },
    'mack': {
      label: "Mack",
      models: {
      'anthem': { label: "Anthem", ranges: ['2005-2014', '2015-2026'] },
      'granite': { label: "Granite", ranges: ['2005-2014', '2015-2026'] },
      'pinnacle': { label: "Pinnacle", ranges: ['2005-2014', '2015-2026'] },
      'lr': { label: "LR", ranges: ['2005-2014', '2015-2026'] }
      }
    },
    'international': {
      label: "International",
      models: {
      'lt series': { label: "LT Series", ranges: ['2005-2014', '2015-2026'] },
      'hx series': { label: "HX Series", ranges: ['2005-2014', '2015-2026'] },
      'mv series': { label: "MV Series", ranges: ['2005-2014', '2015-2026'] },
      'hv series': { label: "HV Series", ranges: ['2005-2014', '2015-2026'] },
      'lt': { label: "LT", ranges: ['2017-2026'] },
      'rh': { label: "RH", ranges: ['2000-2026'] },
      'lonestar': { label: "Lonestar", ranges: ['2000-2026'] },
      'mv': { label: "MV", ranges: ['2000-2026'] }
      }
    },
    'western-star': {
      label: "Western Star",
      models: {
      '4700': { label: "4700", ranges: ['2005-2014', '2015-2026'] },
      '4900': { label: "4900", ranges: ['2000-2026'] },
      '5700': { label: "5700", ranges: ['2000-2026'] },
      '6900': { label: "6900", ranges: ['2000-2026'] },
      '49x': { label: "49x", ranges: ['2005-2014', '2015-2026'] },
      '47x': { label: "47x", ranges: ['2005-2014', '2015-2026'] },
      '5700xe': { label: "5700XE", ranges: ['2005-2014', '2015-2026'] }
      }
    },
    'volvo-trucks': {
      label: "Volvo Trucks",
      models: {
      'vnl 760': { label: "VNL 760", ranges: ['2005-2014', '2015-2026'] },
      'vnl 860': { label: "VNL 860", ranges: ['2005-2014', '2015-2026'] },
      'vhd': { label: "VHD", ranges: ['2005-2014', '2015-2026'] },
      'vah': { label: "VAH", ranges: ['2005-2014', '2015-2026'] },
      'vnl': { label: "VNL", ranges: ['2005-2014', '2015-2026'] },
      'vnr': { label: "VNR", ranges: ['2000-2026'] },
      'vnx': { label: "VNX", ranges: ['2000-2026'] }
      }
    },
  },
  'rv': {
    'winnebago': {
      label: "Winnebago",
      models: {
      'vista': { label: "Vista", ranges: ['2005-2014', '2015-2026'] },
      'minnie winnie': { label: "Minnie Winnie", ranges: ['2005-2014', '2015-2026'] },
      'view/navion': { label: "View/Navion", ranges: ['2005-2014', '2015-2026'] },
      'travato': { label: "Travato", ranges: ['2005-2014', '2015-2026'] },
      'revel': { label: "Revel", ranges: ['2005-2014', '2015-2026'] },
      'solis': { label: "Solis", ranges: ['2020-2026'] },
      'ekko': { label: "Ekko", ranges: ['2022-2026'] }
      }
    },
    'thor': {
      label: "Thor",
      models: {
      'freedom elite': { label: "Freedom Elite", ranges: ['2005-2014', '2015-2026'] },
      'chateau': { label: "Chateau", ranges: ['2005-2014', '2015-2026'] },
      'ace': { label: "Ace", ranges: ['2005-2014', '2015-2026'] },
      'palazzo': { label: "Palazzo", ranges: ['2005-2014', '2015-2026'] },
      'tuscany': { label: "Tuscany", ranges: ['2005-2014', '2015-2026'] },
      'four winds': { label: "Four Winds", ranges: ['2015-2026', '2005-2014'] },
      'tellaro': { label: "Tellaro", ranges: ['2022-2026'] }
      }
    },
    'jayco': {
      label: "Jayco",
      models: {
      'redhawk': { label: "Redhawk", ranges: ['2005-2014', '2015-2026'] },
      'greyhawk': { label: "Greyhawk", ranges: ['2005-2014', '2015-2026'] },
      'seneca': { label: "Seneca", ranges: ['2005-2014', '2015-2026'] },
      'eagle': { label: "Eagle", ranges: ['2005-2014', '2015-2026'] },
      'alante': { label: "Alante", ranges: ['2018-2026'] },
      'precept': { label: "Precept", ranges: ['2018-2026'] }
      }
    },
    'airstream': {
      label: "Airstream",
      models: {
      'classic': { label: "Classic", ranges: ['2005-2014', '2015-2026'] },
      'flying cloud': { label: "Flying Cloud", ranges: ['2005-2014', '2015-2026'] },
      'globetrotter': { label: "Globetrotter", ranges: ['2005-2014', '2015-2026'] },
      'interstate': { label: "Interstate", ranges: ['2005-2014', '2015-2026'] },
      'atlas': { label: "Atlas", ranges: ['2019-2026'] },
      'bambi': { label: "Bambi", ranges: ['2015-2026'] }
      }
    },
    'newmar': {
      label: "Newmar",
      models: {
      'bay star': { label: "Bay Star", ranges: ['2005-2014', '2015-2026'] },
      'ventana': { label: "Ventana", ranges: ['2005-2014', '2015-2026'] },
      'dutch star': { label: "Dutch Star", ranges: ['2005-2014', '2015-2026'] },
      'king aire': { label: "King Aire", ranges: ['2005-2014', '2015-2026'] },
      'london aire': { label: "London Aire", ranges: ['2010-2026'] }
      }
    },
    'forest-river': {
      label: "Forest River",
      models: {
      'sunseeker': { label: "Sunseeker", ranges: ['2005-2014', '2015-2026'] },
      'forester': { label: "Forester", ranges: ['2005-2014', '2015-2026'] },
      'georgetown': { label: "Georgetown", ranges: ['2005-2014', '2015-2026'] },
      'fr3': { label: "FR3", ranges: ['2005-2014', '2015-2026'] },
      'rockwood': { label: "Rockwood", ranges: ['2005-2014', '2015-2026'] },
      'berkshire': { label: "Berkshire", ranges: ['2010-2026'] }
      }
    },
    'grand-design': {
      label: "Grand Design",
      models: {
      'reflection': { label: "Reflection", ranges: ['2005-2014', '2015-2026'] },
      'solitude': { label: "Solitude", ranges: ['2005-2014', '2015-2026'] },
      'momentum': { label: "Momentum", ranges: ['2005-2014', '2015-2026'] },
      'imagine': { label: "Imagine", ranges: ['2005-2014', '2015-2026'] },
      'transcend': { label: "Transcend", ranges: ['2005-2014', '2015-2026'] }
      }
    },
  },
  'ag-equipment': {
    'kubota': {
      label: "Kubota",
      models: {
      'l3301': { label: "L3301", ranges: ['2005-2013', '2014-2026'] },
      'l3901': { label: "L3901", ranges: ['2005-2013', '2014-2026'] },
      'l4701': { label: "L4701", ranges: ['2005-2013', '2014-2026'] },
      'm5': { label: "M5", ranges: ['2005-2013', '2014-2026'] },
      'm6': { label: "M6", ranges: ['2005-2013', '2014-2026'] },
      'm7': { label: "M7", ranges: ['2005-2013', '2014-2026'] },
      'bx1880': { label: "BX1880", ranges: ['2005-2013', '2014-2026'] },
      'bx2380': { label: "BX2380", ranges: ['2005-2013', '2014-2026'] },
      'bx2680': { label: "BX2680", ranges: ['2005-2013', '2014-2026'] },
      'lx3310': { label: "LX3310", ranges: ['2019-2026'] },
      'mx5200': { label: "MX5200", ranges: ['2013-2026'] },
      'b2601': { label: "B2601", ranges: ['2014-2026'] },
      'z700': { label: "Z700", ranges: ['2008-2026'] }
      }
    },
    'yanmar-ag': {
      label: "Yanmar",
      models: {
      'yt235': { label: "YT235", ranges: ['2005-2015', '2016-2026'] },
      'yt347': { label: "YT347", ranges: ['2005-2015', '2016-2026'] },
      'yt359': { label: "YT359", ranges: ['2005-2015', '2016-2026'] },
      'sa223': { label: "SA223", ranges: ['2005-2015', '2016-2026'] },
      'sa325': { label: "SA325", ranges: ['2005-2015', '2016-2026'] },
      'sa425': { label: "SA425", ranges: ['2005-2015', '2016-2026'] },
      'ym1500': { label: "YM1500", ranges: ['1975-1990'] },
      'ym2000': { label: "YM2000", ranges: ['1975-1990'] },
      'ym2500': { label: "YM2500", ranges: ['1975-1990'] },
      'ym3000': { label: "YM3000", ranges: ['1975-1990'] },
      'ym336': { label: "YM336", ranges: ['1975-1990'] },
      'ym342': { label: "YM342", ranges: ['1975-1990'] },
      'ym347': { label: "YM347", ranges: ['1975-1990'] },
      'ym359': { label: "YM359", ranges: ['1975-1990'] }
      }
    },
    'john-deere': {
      label: "John Deere",
      models: {
      '3000': { label: "3000", ranges: ['2015-2026', '2005-2014'] },
      '4000': { label: "4000", ranges: ['2015-2026', '2005-2014'] },
      '4105': { label: "4105", ranges: ['2015-2026'] },
      '4120': { label: "4120", ranges: ['2015-2026'] },
      '5000': { label: "5000", ranges: ['2015-2026', '2005-2014'] },
      '3032e': { label: "3032e", ranges: ['2005-2012', '2013-2026'] },
      '3038e': { label: "3038e", ranges: ['2005-2012', '2013-2026'] },
      '4044m': { label: "4044m", ranges: ['2015-2020', '2021-2026', '2014-2014'] },
      '4066m': { label: "4066m", ranges: ['2015-2020', '2021-2026'] },
      '5075e': { label: "5075e", ranges: ['2005-2016', '2017-2026'] },
      '5100e': { label: "5100e", ranges: ['2005-2016', '2017-2026'] },
      '6110m': { label: "6110m", ranges: ['2012-2019', '2020-2026'] },
      '6140m': { label: "6140m", ranges: ['2012-2019', '2020-2026'] },
      '6r': { label: "6r", ranges: ['2015-2026', '2012-2014'] },
      '5r': { label: "5r", ranges: ['2015-2026', '2012-2014'] },
      '7r': { label: "7r", ranges: ['2015-2026', '2012-2014'] },
      '8r': { label: "8r", ranges: ['2015-2026', '2012-2014'] },
      '9r': { label: "9r", ranges: ['2015-2026', '2012-2014'] },
      '3039r': { label: "3039r", ranges: ['2015-2026', '2012-2014'] },
      '3046r': { label: "3046r", ranges: ['2015-2026'] },
      '4052m': { label: "4052m", ranges: ['2015-2026', '2014-2014'] },
      '5045e': { label: "5045e", ranges: ['2015-2026', '2013-2014'] },
      '5055e': { label: "5055e", ranges: ['2015-2026', '2013-2014'] },
      '5065e': { label: "5065e", ranges: ['2015-2026', '2013-2014'] },
      'xuv': { label: "XUV", ranges: ['2015-2026', '2005-2014'] },
      'xuv825m': { label: "XUV825M", ranges: ['2015-2026', '2014-2014'] },
      'xuv865m': { label: "XUV865M", ranges: ['2015-2026', '2014-2014'] },
      'xuv590e': { label: "XUV590E", ranges: ['2015-2026', '2014-2014'] },
      'xuv560e': { label: "XUV560E", ranges: ['2015-2026', '2014-2014'] },
      'gator-xuv-835': { label: "Gator-XUV-835", ranges: ['2015-2026'] },
      'gator-hpx': { label: "Gator-Hpx", ranges: ['2015-2026', '2003-2014'] },
      'gator-te': { label: "Gator-TE", ranges: ['2015-2026', '2004-2014'] },
      'gator-tx': { label: "Gator-TX", ranges: ['2015-2026', '2004-2014'] }
      }
    },
  },
  'forklift': {
    'hyster': {
      label: "Hyster",
      models: {
      '50': { label: "50", ranges: ['1970-1999'] },
      'h40-60ft': { label: "H40-60FT", ranges: ['2005-2014', '2015-2026'] },
      'h70-110ft': { label: "H70-110FT", ranges: ['2005-2014', '2015-2026'] },
      's40-70ft': { label: "S40-70FT", ranges: ['2005-2014', '2015-2026'] },
      'h50ct': { label: "H50CT", ranges: ['2005-2014', '2015-2026'] },
      'h50': { label: "H50", ranges: ['2000-2026'] },
      'h60': { label: "H60", ranges: ['2000-2026'] },
      'h70': { label: "H70", ranges: ['2000-2026'] },
      'h80': { label: "H80", ranges: ['2000-2026'] },
      'h100': { label: "H100", ranges: ['2000-2026'] },
      'h120': { label: "H120", ranges: ['2000-2026'] },
      's50': { label: "S50", ranges: ['2000-2026'] },
      's60': { label: "S60", ranges: ['2000-2026'] },
      's70': { label: "S70", ranges: ['2000-2026'] },
      'h50a': { label: "H50A", ranges: ['1970-1999'] },
      'h50b': { label: "H50B", ranges: ['1970-1999'] },
      'h50c': { label: "H50C", ranges: ['1970-1999'] }
      }
    },
    'hyster-e': {
      label: "Hyster (Electric)",
      models: {
      'j30-40xnt': { label: "J30-40Xnt", ranges: ['2005-2014', '2015-2026'] },
      'e30-50xn': { label: "E30-50XN", ranges: ['2005-2014', '2015-2026'] },
      'e30': { label: "E30", ranges: ['2005-2014', '2015-2026'] },
      'e40': { label: "E40", ranges: ['2000-2026'] },
      'e50': { label: "E50", ranges: ['2000-2026'] },
      'e60': { label: "E60", ranges: ['2000-2026'] },
      'e80': { label: "E80", ranges: ['2000-2026'] },
      'e100': { label: "E100", ranges: ['2000-2026'] },
      'j30': { label: "J30", ranges: ['2000-2026'] },
      'j40': { label: "J40", ranges: ['2000-2026'] },
      'j50': { label: "J50", ranges: ['2000-2026'] }
      }
    },
  },
  'watercraft': {
    'seadoo': {
      label: "Sea-Doo",
      models: {
      'spark': { label: "Spark", ranges: ['2014-2026'] },
      'gti': { label: "GTI", ranges: ['2005-2011', '2016-2026'] },
      'gtx': { label: "GTX", ranges: ['2005-2013', '2014-2019', '2020-2026'] },
      'rxp': { label: "RXP", ranges: ['2005-2008', '2009-2019', '2020-2026'] },
      'rxt': { label: "RXT", ranges: ['2005-2009', '2010-2019', '2020-2026'] },
      'fish pro': { label: "Fish Pro", ranges: ['2021-2026'] }
      }
    },
    'kawasaki-wc': {
      label: "Kawasaki",
      models: {
      'stx': { label: "STX", ranges: ['2005-2008', '2010-2026'] },
      'ultra 310': { label: "Ultra 310", ranges: ['2014-2026'] },
      'stx-15f': { label: "STX-15F", ranges: ['2005-2008', '2010-2026'] },
      'stx-12f': { label: "STX-12F", ranges: ['2005-2008', '2010-2026'] },
      'ultra 310x': { label: "Ultra 310x", ranges: ['2014-2026'] },
      'ultra 310lx': { label: "Ultra 310LX", ranges: ['2014-2026'] },
      'stx 160': { label: "STX 160", ranges: ['2018-2026'] },
      'sx-r': { label: "SX-R", ranges: ['2017-2026'] }
      }
    },
    'yamaha-wc': {
      label: "Yamaha",
      models: {
      'vx': { label: "VX", ranges: ['2005-2018', '2019-2026'] },
      'vx-c': { label: "VX-C", ranges: ['2019-2026'] },
      'vx limited ho': { label: "VX Limited HO", ranges: ['2019-2026'] },
      'fx ho': { label: "FX HO", ranges: ['2005-2019', '2020-2026'] },
      'fx svho': { label: "FX Svho", ranges: ['2014-2026'] },
      'gp1800': { label: "GP1800", ranges: ['2017-2026'] },
      'fx cruiser': { label: "FX Cruiser", ranges: ['2000-2026'] },
      'ex': { label: "EX", ranges: [] },
      'gp': { label: "GP", ranges: [] },
      'svho': { label: "Svho", ranges: [] }
      }
    },
  },
  'outboard': {
    'yamaha': {
      label: "Yamaha",
      models: {
      'f115': { label: "F115", ranges: ['2000-2026'] },
      'f150': { label: "F150", ranges: [] },
      'f200': { label: "F200", ranges: [] },
      'f250': { label: "F250", ranges: [] },
      'f300': { label: "F300", ranges: [] },
      'f70': { label: "F70", ranges: [] }
      }
    },
    'mercury': {
      label: "Mercury",
      models: {
      '40 fourstroke': { label: "40 Fourstroke", ranges: ['2005-2018', '2019-2026'] },
      '75 fourstroke': { label: "75 Fourstroke", ranges: ['2005-2018', '2019-2026'] },
      '90 fourstroke': { label: "90 Fourstroke", ranges: ['2005-2018', '2019-2026'] },
      '115 pro xs': { label: "115 Pro XS", ranges: ['2015-2026'] },
      '150 fourstroke': { label: "150 Fourstroke", ranges: ['2018-2026'] },
      '250 verado': { label: "250 Verado", ranges: ['2005-2010', '2011-2026'] },
      '300 verado': { label: "300 Verado", ranges: ['2015-2026', '2008-2014'] },
      '350 verado': { label: "350 Verado", ranges: ['2015-2026', '2010-2014'] },
      'verado': { label: "Verado", ranges: ['2005-2014', '2015-2026'] },
      'pro xs': { label: "Pro XS", ranges: ['2010-2026'] },
      'fourstroke': { label: "Fourstroke", ranges: ['2005-2026'] },
      'optimax': { label: "Optimax", ranges: ['1998-2018'] }
      }
    },
  },
  'marine-diesel': {
    'cat': {
      label: "Caterpillar",
      models: {
      'c7': { label: "C7", ranges: ['2005-2012'] },
      'c12': { label: "C12", ranges: ['2005-2008'] },
      'c18': { label: "C18", ranges: ['2005-2026'] },
      'c32': { label: "C32", ranges: ['2005-2026'] },
      'c9': { label: "C9", ranges: ['2005-2026'] },
      'c4.4': { label: "C4.4", ranges: ['2005-2026'] },
      'c6.6': { label: "C6.6", ranges: ['2005-2026'] },
      'c8.7': { label: "C8.7", ranges: ['2010-2026'] }
      }
    },
    'cummins': {
      label: "Cummins",
      models: {
      'qsb 6.7': { label: "QSB 6.7", ranges: ['2007-2026'] },
      'qsc 8.3': { label: "QSC 8.3", ranges: ['2007-2018'] },
      'qsm11': { label: "QSM11", ranges: ['2005-2015'] },
      'kta19': { label: "KTA19", ranges: ['2005-2026'] },
      'qsb': { label: "QSB", ranges: ['2005-2026'] },
      'qsl': { label: "QSL", ranges: ['2005-2026'] },
      'qsx15': { label: "QSX15", ranges: ['2005-2026'] },
      '6bta': { label: "6BTA", ranges: ['1990-2006'] },
      '6cta': { label: "6CTA", ranges: ['1990-2006'] }
      }
    },
    'yanmar': {
      label: "Yanmar",
      models: {
      '4jh': { label: "4JH", ranges: ['2005-2011', '2012-2026'] },
      '6ly': { label: "6LY", ranges: ['2005-2026'] },
      '6cx': { label: "6CX", ranges: ['2005-2026'] },
      '8lv': { label: "8LV", ranges: ['2014-2026'] },
      '4jh40': { label: "4JH40", ranges: ['2005-2011', '2012-2026'] },
      '4jh45': { label: "4JH45", ranges: ['2005-2011', '2012-2026'] },
      '4jh57': { label: "4JH57", ranges: ['2005-2011', '2012-2026'] },
      '4jh3e': { label: "4JH3E", ranges: ['2005-2011', '2012-2026'] },
      '6ly2': { label: "6LY2", ranges: ['2005-2026'] },
      '6ly3': { label: "6LY3", ranges: ['2005-2026'] },
      '6cx-gt': { label: "6CX-GT", ranges: ['2005-2026'] },
      '8lv250': { label: "8LV250", ranges: ['2014-2026'] },
      '8lv320': { label: "8LV320", ranges: ['2014-2026'] },
      '8lv370': { label: "8LV370", ranges: ['2014-2026'] },
      '8lv440': { label: "8LV440", ranges: ['2014-2026'] },
      '3ym30': { label: "3YM30", ranges: ['2005-2026'] },
      '4jh5': { label: "4JH5", ranges: ['2005-2026'] },
      '6lp': { label: "6LP", ranges: ['2005-2026'] }
      }
    },
  },
};

/** All 10 vehicle-type ids. */
export { VEHICLE_TYPES };

/**
 * Makes for a vehicle type: [{ key, label }] sorted by label ascending.
 */
export function getInventoryMakesForType(vehicleType) {
  const makes = INVENTORY[vehicleType];
  if (!makes) return [];
  return Object.entries(makes)
    .map(([key, m]) => ({ key, label: m.label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Models for a make: [{ key, label }] sorted by label ascending.
 * key = the exact stored model key (spaced keys quoted, e.g. 'santa fe').
 */
export function getInventoryModelsForMake(makeKey) {
  for (const type of Object.values(INVENTORY)) {
    const m = type[makeKey];
    if (m) {
      return Object.entries(m.models)
        .map(([key, mod]) => ({ key, label: mod.label }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }
  return [];
}

/**
 * Year ranges for a make/model: [{ range, label }] sorted by start year.
 * range = the exact 'YYYY-YYYY' string used in the data files.
 */
export function getInventoryYearRangesForModel(makeKey, modelKey) {
  for (const type of Object.values(INVENTORY)) {
    const m = type[makeKey];
    if (m && m.models[modelKey]) {
      return [...m.models[modelKey].ranges]
        .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
        .map((r) => ({ range: r, label: r.replace('-', '\u2013') }));
    }
  }
  return [];
}

export default INVENTORY;
