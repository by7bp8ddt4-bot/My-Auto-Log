/**
 * VIN Decoder — uses the free NHTSA VPIC API (no API key required).
 *
 * API: https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/{vin}?format=json
 *
 * Returns decoded vehicle specs stored as a `vinDecoded` field on the vehicle object.
 */

const NHTSA_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues';

/**
 * Clean a string value from the NHTSA response — returns null for "Not Applicable", blank, etc.
 */
function clean(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'Not Applicable' || trimmed === 'Not Available' || 
      trimmed === '-' || trimmed === '' || trimmed === 'Unknown') return null;
  return trimmed;
}

/**
 * Decode a VIN using the NHTSA VPIC API.
 * @param {string} vin - 17-character Vehicle Identification Number
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function decodeVin(vin) {
  // Basic validation
  if (!vin || vin.length !== 17) {
    return { success: false, error: 'VIN must be 17 characters' };
  }
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
    return { success: false, error: 'VIN contains invalid characters (no I, O, Q)' };
  }

  try {
    const url = `${NHTSA_BASE}/${encodeURIComponent(vin.toUpperCase())}?format=json`;
    const response = await fetch(url);

    if (!response.ok) {
      return { success: false, error: `NHTSA API error: ${response.status} ${response.statusText}` };
    }

    const json = await response.json();
    const results = json.Results?.[0];

    if (!results) {
      return { success: false, error: 'No data returned from NHTSA' };
    }

    // Extract meaningful fields
    const make = clean(results.Make);
    const model = clean(results.Model);
    const year = clean(results.ModelYear);

    if (!make || !model) {
      return { success: false, error: 'NHTSA could not identify this VIN. Check the VIN and try again.' };
    }

    const data = {
      vin: vin.toUpperCase(),
      make,
      model,
      year: year ? parseInt(year, 10) : null,
      
      // Engine specs
      engine: {
        cylinders: clean(results.EngineCylinders) || null,
        displacement: clean(results.DisplacementCC) || null,
        horsepower: clean(results.EngineHP) || null,
        fuelType: clean(results.FuelTypePrimary) || null,
      },
      
      // Transmission & drivetrain
      transmission: clean(results.TransmissionStyle) || null,
      driveType: clean(results.DriveType) || null,
      
      // Vehicle type
      vehicleType: clean(results.VehicleType) || null,
      bodyClass: clean(results.BodyClass) || null,
      
      // Plant info
      plantCity: clean(results.PlantCity) || null,
      plantCountry: clean(results.PlantCountry) || null,
      
      // Raw NHTSA data for reference
      _raw: results,
    };

    return { success: true, data };
  } catch (err) {
    if (err.name === 'AbortError' || err.message?.includes('fetch')) {
      return { success: false, error: 'Network error — check your internet connection and try again.' };
    }
    return { success: false, error: `Failed to decode VIN: ${err.message}` };
  }
}

/**
 * Validate VIN format (17 chars, no I/O/Q).
 */
export function isValidVin(vin) {
  if (!vin) return false;
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin.trim());
}

/**
 * Format a VIN for display (uppercase, grouped).
 */
export function formatVin(vin) {
  if (!vin) return '';
  return vin.toUpperCase().replace(/(.{4})/g, '$1 ').trim();
}