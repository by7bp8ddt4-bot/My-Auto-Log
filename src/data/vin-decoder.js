/**
 * VIN Decoder — validates VIN checksums and decodes basic vehicle info.
 * Data sourced from the Vehicle Data Specialist.
 */
import vinData from './vin-decoder.json';

const transliteration = {
  '0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
  'A':1,'B':2,'C':3,'D':4,'E':5,'F':6,'G':7,'H':8,
  'J':1,'K':2,'L':3,'M':4,'N':5,'P':7,'R':9,
  'S':2,'T':3,'U':4,'V':5,'W':6,'X':7,'Y':8,'Z':9
};

const weights = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];

/**
 * Validate a 17-character VIN by computing the check digit (position 9).
 * Returns { valid: boolean, error?: string }.
 */
export function validateVIN(vin) {
  if (!vin) return { valid: false, error: 'VIN is required' };
  const upper = vin.toUpperCase().trim();
  if (upper.length !== 17) return { valid: false, error: 'VIN must be exactly 17 characters' };
  if (/[IOQ]/.test(upper)) return { valid: false, error: 'Invalid characters in VIN (I, O, Q are not allowed)' };

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const value = transliteration[upper[i]];
    if (value === undefined) return { valid: false, error: `Invalid character at position ${i + 1}` };
    sum += value * weights[i];
  }

  const remainder = sum % 11;
  const expected = remainder === 10 ? 'X' : String(remainder);
  if (upper[8] !== expected) {
    return { valid: false, error: `Check digit mismatch: expected '${expected}', got '${upper[8]}'` };
  }
  return { valid: true };
}

/**
 * Decode the WMI (World Manufacturer Identifier) from VIN characters 1-3.
 * Returns { make, country } or null.
 */
export function decodeWMI(vin) {
  if (!vin || vin.length < 3) return null;
  const upper = vin.toUpperCase();

  // Try 3-char WMI first
  const wmi3 = upper.slice(0, 3);
  if (vinData.wmiLookup?.manufacturers?.[wmi3]) {
    return vinData.wmiLookup.manufacturers[wmi3];
  }

  // Try 2-char WMI
  const wmi2 = upper.slice(0, 2);
  for (const [key, val] of Object.entries(vinData.wmiLookup?.manufacturers || {})) {
    if (key.length === 2 && wmi2.startsWith(key.slice(0, 2))) {
      return val;
    }
  }

  // Try 1-char country code
  const countryChar = upper[0];
  const country = vinData.wmiLookup?.countryCodes?.[countryChar];
  return country ? { make: 'Unknown', country } : null;
}

/**
 * Get the model year from VIN character 10.
 * Returns the year number (e.g., 2025) or null if invalid.
 */
export function getModelYear(vin) {
  if (!vin || vin.length < 10) return null;
  const code = vin[9].toUpperCase();
  const years = vinData.modelYearCodes?.codes?.[code];
  if (!years) return null;
  // Codes repeat every 30 years — return the most recent year
  return Array.isArray(years) ? years[years.length - 1] : years;
}

export default { validateVIN, decodeWMI, getModelYear };