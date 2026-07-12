/**
 * Watercraft / Marine Decoder Utilities
 * 
 * HIN (Hull Identification Number) Decoder
 * Outboard Engine Serial Number Validator
 * Marine Diesel Engine Serial Number Validator
 * 
 * HIN Format: 12 characters
 *   Chars 1-3: MIC (Manufacturer Identification Code) — USCG-assigned
 *   Chars 4-8: Serial number (manufacturer-specific)
 *   Chars 9-10: Date code (month letter + year digit)
 *   Chars 11-12: Model year indicator
 * 
 * Outboard serials: No universal format, manufacturer-specific (5-15 chars)
 * Marine diesel serials: Manufacturer prefix + digits (CAT, Cummins, Volvo, Yanmar)
 */

// ============================================================================
// HIN MIC DATABASE
// ============================================================================
const HIN_MIC_MAP = {
  YAM: { make: 'Yamaha', country: 'Japan' },
  YVE: { make: 'Sea-Doo (BRP)', country: 'Canada' },
  KAW: { make: 'Kawasaki', country: 'Japan' },
  HON: { make: 'Honda Marine', country: 'Japan' },
  BRP: { make: 'BRP', country: 'Canada' },
  SER: { make: 'Sea Ray', country: 'USA' },
  MER: { make: 'Mercury Marine', country: 'USA' },
  SUZ: { make: 'Suzuki Marine', country: 'Japan' },
  NIS: { make: 'Nissan Marine', country: 'Japan' },
  TOH: { make: 'Tohatsu', country: 'Japan' },
  TIG: { make: 'Tige', country: 'USA' },
  MAS: { make: 'MasterCraft', country: 'USA' },
  MAL: { make: 'Malibu Boats', country: 'USA' },
  COR: { make: 'Correct Craft', country: 'USA' },
  NAU: { make: 'Nautique', country: 'USA' },
  BAY: { make: 'Bayliner', country: 'USA' },
  BOS: { make: 'Boston Whaler', country: 'USA' },
  GRA: { make: 'Grady-White', country: 'USA' },
  CAR: { make: 'Carolina Skiff', country: 'USA' },
  KEY: { make: 'Key West Boats', country: 'USA' },
  SCO: { make: 'Scout Boats', country: 'USA' },
  REG: { make: 'Regulator', country: 'USA' },
  MEL: { make: 'Melges', country: 'USA' },
  BEN: { make: 'Beneteau', country: 'France' },
  JEN: { make: 'Jeanneau', country: 'France' },
  CAT: { make: 'Catalina Yachts', country: 'USA' },
  HUN: { make: 'Hunter Marine', country: 'USA' },
  POL: { make: 'Polaris', country: 'USA' },
};

/**
 * HIN month code mapping (USCG format)
 * A=Aug, B=Sep, C=Oct, D=Nov, E=Dec, F=Jan, G=Feb, H=Mar, I=Apr, J=May, K=Jun, L=Jul
 */
const HIN_MONTH_MAP = {
  A: 8, B: 9, C: 10, D: 11, E: 12,
  F: 1, G: 2, H: 3, I: 4, J: 5, K: 6, L: 7,
};

// ============================================================================
// HIN VALIDATION
// ============================================================================

/**
 * Validate a HIN (Hull Identification Number) format.
 * Standard format: 12 characters (MIC + serial + date code + year)
 */
export function isValidHin(hin) {
  if (!hin) return false;
  const trimmed = hin.trim().toUpperCase();
  if (trimmed.length !== 12) return false;
  return /^[A-HJ-NPR-Z0-9]{12}$/i.test(trimmed);
}

// ============================================================================
// HIN DECODER
// ============================================================================

/**
 * Decode a HIN (Hull Identification Number).
 * Extracts MIC, decodes date code and model year.
 * @param {string} hin - 12-character Hull Identification Number
 * @returns {{success: boolean, data?: object, error?: string}}
 */
export async function decodeHin(hin) {
  if (!hin) {
    return { success: false, error: 'HIN is required' };
  }
  if (!isValidHin(hin)) {
    return { success: false, error: 'HIN must be exactly 12 characters (no I, O, Q)' };
  }

  const cleaned = hin.trim().toUpperCase();
  const mic = cleaned.slice(0, 3);
  const serial = cleaned.slice(3, 8);
  const dateCode = cleaned.slice(8, 10);
  const yearIndicator = cleaned.slice(10, 12);

  const micInfo = HIN_MIC_MAP[mic] || null;

  // Decode date code
  const monthLetter = dateCode[0];
  const yearDigit = dateCode[1];
  const manufactureMonth = HIN_MONTH_MAP[monthLetter] || null;
  const manufactureYear = yearDigit ? 2010 + parseInt(yearDigit) : null; // rough decade estimate

  // Decode model year from indicator
  const modelYear = decodeHinYearCode(yearIndicator);

  const data = {
    hin: cleaned,
    mic,
    serial,
    make: micInfo?.make || null,
    country: micInfo?.country || null,
    manufactureDate: manufactureMonth && manufactureYear
      ? `${manufactureYear}-${String(manufactureMonth).padStart(2, '0')}`
      : null,
    modelYear,
    dateCode,
    yearIndicator,
  };

  return { success: true, data };
}

/**
 * Decode the model year from a HIN year indicator (last 2 chars of a 12-char HIN).
 */
function decodeHinYearCode(code) {
  if (!code) return null;
  const yearMap = {
    'A0': 2000, 'A1': 2001, 'A2': 2002, 'A3': 2003, 'A4': 2004,
    'A5': 2005, 'A6': 2006, 'A7': 2007, 'A8': 2008, 'A9': 2009,
    'B0': 2010, 'B1': 2011, 'B2': 2012, 'B3': 2013, 'B4': 2014,
    'B5': 2015, 'B6': 2016, 'B7': 2017, 'B8': 2018, 'B9': 2019,
    'C0': 2020, 'C1': 2021, 'C2': 2022, 'C3': 2023, 'C4': 2024,
    'C5': 2025, 'C6': 2026, 'C7': 2027, 'C8': 2028, 'C9': 2029,
    'D0': 2030, 'D1': 2031, 'D2': 2032, 'D3': 2033, 'D4': 2034,
  };
  return yearMap[code.toUpperCase()] || null;
}

/**
 * Format a HIN for display (uppercase, grouped).
 */
export function formatHin(hin) {
  if (!hin) return '';
  return hin.toUpperCase().replace(/(.{3})(.{5})(.{2})(.{2})/, '$1 $2 $3 $4').trim();
}

// ============================================================================
// OUTBOARD ENGINE SERIAL NUMBER
// ============================================================================

/**
 * Known outboard manufacturer prefixes for serial number identification.
 */
const OUTBOARD_PREFIXES = [
  { prefix: '0', make: 'Mercury Marine', note: 'Mercury serials often start with 0' },
  { prefix: '1', make: 'Mercury Marine', note: 'Mercury/Mariner serials' },
  { prefix: '6', make: 'Yamaha', note: 'Yamaha outboards often start with 6' },
  { prefix: '7', make: 'Yamaha', note: 'Yamaha outboards' },
  { prefix: 'S', make: 'Suzuki Marine', note: 'Suzuki serials start with S' },
  { prefix: 'T', make: 'Tohatsu/Nissan', note: 'Tohatsu serials start with T' },
  { prefix: 'E', make: 'Evinrude', note: 'Evinrude/BRP serials' },
  { prefix: 'J', make: 'Johnson', note: 'Johnson outboard serials' },
  { prefix: 'H', make: 'Honda Marine', note: 'Honda marine serials' },
  { prefix: 'Y', make: 'Yamaha', note: 'Yamaha outboard serials' },
  { prefix: 'M', make: 'Mercury Marine', note: 'Mercury serials' },
  { prefix: 'P', make: 'Parsun', note: 'Parsun outboard serials' },
];

/**
 * Validate an outboard engine serial number format.
 * Outboard serials are typically 5-15 alphanumeric characters.
 * @param {string} serial
 * @returns {{valid: boolean, make?: string, note?: string, error?: string}}
 */
export function validateOutboardSerial(serial) {
  if (!serial) return { valid: false, error: 'Serial number is required' };
  const cleaned = serial.trim().toUpperCase();
  if (cleaned.length < 5 || cleaned.length > 15) {
    return { valid: false, error: 'Outboard serials are typically 5-15 characters' };
  }
  if (!/^[A-HJ-NPR-Z0-9]{5,15}$/i.test(cleaned)) {
    return { valid: false, error: 'Serial contains invalid characters (no I, O, Q)' };
  }
  // Try to identify manufacturer by first character
  const firstChar = cleaned[0];
  const match = OUTBOARD_PREFIXES.find(p => p.prefix === firstChar);
  return {
    valid: true,
    serial: cleaned,
    make: match?.make || null,
    note: match?.note || 'Unknown manufacturer prefix — stored as reference identifier',
  };
}

// ============================================================================
// MARINE DIESEL ENGINE SERIAL NUMBER
// ============================================================================

/**
 * Known marine diesel engine serial number patterns.
 */
const MARINE_DIESEL_PATTERNS = [
  { pattern: /^CAT/i, make: 'Caterpillar', note: 'Caterpillar marine engines start with CAT prefix' },
  { pattern: /^C[0-9]/i, make: 'Cummins', note: 'Cummins marine engines start with letter + digits' },
  { pattern: /^6[BCT]/i, make: 'Cummins', note: 'Cummins B/C series marine engines' },
  { pattern: /^QSB/i, make: 'Cummins', note: 'Cummins QSB series' },
  { pattern: /^QSL/i, make: 'Cummins', note: 'Cummins QSL series' },
  { pattern: /^QSM/i, make: 'Cummins', note: 'Cummins QSM series' },
  { pattern: /^QSX/i, make: 'Cummins', note: 'Cummins QSX series' },
  { pattern: /^VP/i, make: 'Volvo Penta', note: 'Volvo Penta marine engines start with VP' },
  { pattern: /^[0-9]{6}/, make: 'Volvo Penta', note: 'Volvo Penta 6-digit serials' },
  { pattern: /^Y[0-9]/i, make: 'Yanmar', note: 'Yanmar marine engines start with Y + digits' },
  { pattern: /^4JH/i, make: 'Yanmar', note: 'Yanmar 4JH series' },
  { pattern: /^3JH/i, make: 'Yanmar', note: 'Yanmar 3JH series' },
  { pattern: /^6LY/i, make: 'Yanmar', note: 'Yanmar 6LY series' },
  { pattern: /^D[0-9]/i, make: 'John Deere', note: 'John Deere marine engines start with D + digits' },
  { pattern: /^MTU/i, make: 'MTU', note: 'MTU marine diesel engines' },
  { pattern: /^MAN/i, make: 'MAN Diesel', note: 'MAN marine diesel engines' },
  { pattern: /^SCANIA/i, make: 'Scania', note: 'Scania marine diesel engines' },
];

/**
 * Validate a marine diesel engine serial number format.
 * @param {string} serial
 * @returns {{valid: boolean, make?: string, note?: string, error?: string}}
 */
export function validateMarineDieselSerial(serial) {
  if (!serial) return { valid: false, error: 'Serial number is required' };
  const cleaned = serial.trim().toUpperCase();
  if (cleaned.length < 4 || cleaned.length > 20) {
    return { valid: false, error: 'Marine diesel serials are typically 4-20 characters' };
  }
  if (!/^[A-HJ-NPR-Z0-9]{4,20}$/i.test(cleaned)) {
    return { valid: false, error: 'Serial contains invalid characters (no I, O, Q)' };
  }
  // Try to identify manufacturer by pattern
  const match = MARINE_DIESEL_PATTERNS.find(p => p.pattern.test(cleaned));
  return {
    valid: true,
    serial: cleaned,
    make: match?.make || null,
    note: match?.note || 'Unknown manufacturer pattern — stored as reference identifier',
  };
}

// ============================================================================
// UTILITY
// ============================================================================

/**
 * Clean and format a serial number for storage.
 */
export function formatSerial(serial) {
  if (!serial) return '';
  return serial.trim().toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
}