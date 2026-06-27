/**
 * Manufacturer maintenance schedules for common vehicles.
 * 
 * Intervals are based on typical manufacturer recommendations.
 * Each vehicle has a list of maintenance items with:
 * - service: Name of the service
 * - intervalMiles: Miles between services
 * - intervalMonths: Months between services
 * - severity: low | medium | high
 * - description: Jargon-free explanation
 */

export const MAINTENANCE_SCHEDULES = {
   toyota: {
    models: {
      camry: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Fresh oil keeps your engine internals slippery and cool. It is the single most important thing you can do for your car.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Moving tires around helps them wear evenly so they last longer and keep you safe on wet roads.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'This filters the air you breathe inside the car. A fresh one keeps the A/C smelling sweet and working hard.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Like a mask for your engine. It keeps dust out so the engine can breathe easy and use less gas.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Brake fluid absorbs water over time, which can make your brakes feel "mushy." Fresh fluid keeps them crisp.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 120, severity: 'high', description: 'Coolant prevents your engine from melting down. After many years, it loses its magic and needs a swap.' },
        { service: 'Spark Plugs', intervalMiles: 120000, intervalMonths: 144, severity: 'medium', description: 'These create the spark that starts the fire in your engine. New ones help the car start fast and run smooth.' },
      ],
      corolla: 'camry',
      rav4: 'camry',
      tacoma: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Trucks work hard. Fresh oil prevents wear and tear on your engine.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Even wear is crucial for truck tires, especially if you carry heavy loads.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'The differential is what turns your wheels. Fresh fluid prevents gears from grinding.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Keeps the dust from the trail out of your lungs.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Clean air means better fuel economy for your truck.' },
        { service: 'Spark Plugs', intervalMiles: 120000, intervalMonths: 144, severity: 'medium', description: 'Ensures reliable ignition even in tough conditions.' },
      ]
    }
  },
  honda: {
    models: {
      civic: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: 'Hondas are famous for reliability, but they still need clean oil to thrive.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Helps your tires live their longest, best life.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Filters out pollen and dust so you can breathe clearly.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Prevents corrosion in your braking system.' },
        { service: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 48, severity: 'high', description: 'The transmission handles the power. Fresh fluid prevents expensive repairs later.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 84, severity: 'medium', description: 'Keeps your engine efficient and responsive.' },
      ],
      accord: 'civic',
      'cr-v': 'civic',
      pilot: 'civic'
    }
  },
  ford: {
    models: {
      'f-150': [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 6, severity: 'medium', description: 'Heavy duty use requires regular oil changes to protect the engine.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 6, severity: 'low', description: 'Keeps your truck stable and your tires lasting longer.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Crucial for maintaining power and fuel efficiency.' },
        { service: 'Transmission Fluid', intervalMiles: 150000, intervalMonths: 120, severity: 'high', description: 'Modern Ford transmissions have long intervals, but this is a critical end-of-life service.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 72, severity: 'high', description: 'Protects against overheating and corrosion.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 72, severity: 'medium', description: 'Prevents misfires and keeps the engine running smooth.' },
      ],
      escape: 'f-150',
      explorer: 'f-150',
      mustang: 'f-150'
    }
  },
  chevrolet: {
    models: {
      silverado: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: 'Essential protection for your engine components.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Reduces road noise and improves tire longevity.' },
        { service: 'Engine Air Filter', intervalMiles: 45000, intervalMonths: 48, severity: 'low', description: 'Ensures your engine gets the oxygen it needs.' },
        { service: 'Transmission Fluid', intervalMiles: 45000, intervalMonths: 48, severity: 'high', description: 'Keeps gear shifts smooth and predictable.' },
        { service: 'Spark Plugs', intervalMiles: 97500, intervalMonths: 96, severity: 'medium', description: 'Maintains optimal engine performance.' },
      ],
      equinox: 'silverado',
      malibu: 'silverado'
    }
  },
  bmw: {
    models: {
      '3 series': [
        { service: 'Oil & Filter Change', intervalMiles: 10000, intervalMonths: 12, severity: 'medium', description: 'Precision engineering needs precision lubrication.' },
        { service: 'Microfilter (Cabin)', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'Keeps the luxury interior smelling fresh and clean.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'Ensures the high-performance brakes stop on a dime.' },
        { service: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 72, severity: 'medium', description: 'Prevents performance drop-off in turbocharged engines.' },
        { service: 'Vehicle Check', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'A comprehensive health check by a technician.' },
      ],
      '5 series': '3 series',
      x3: '3 series',
      x5: '3 series'
    }
  },
  mercedes: {
    models: {
      'c-class': [
        { service: 'Service A (Oil/Filter)', intervalMiles: 10000, intervalMonths: 12, severity: 'medium', description: 'Standard maintenance to keep your Mercedes in top shape.' },
        { service: 'Service B (Comprehensive)', intervalMiles: 20000, intervalMonths: 24, severity: 'high', description: 'Deep check and multiple filter replacements for long-term health.' },
        { service: 'Brake Fluid Flush', intervalMiles: 20000, intervalMonths: 24, severity: 'medium', description: 'Critical for safety and maintaining brake feel.' },
        { service: 'Engine Air Filter', intervalMiles: 40000, intervalMonths: 48, severity: 'low', description: 'Keeps the engine breathing optimally.' },
        { service: 'Transmission Service', intervalMiles: 60000, intervalMonths: 72, severity: 'high', description: 'Essential for the longevity of the refined transmission.' },
      ],
      'e-class': 'c-class',
      glc: 'c-class',
      gle: 'c-class'
    }
  },
  hyundai: {
    models: {
      elantra: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: 'Keeps your engine healthy and helps maintain your warranty.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Helps prevent uneven tread wear.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Keeps the air inside the cabin clean and fresh.' },
        { service: 'Climate Control Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Ensures the A/C system works efficiently.' },
        { service: 'Brake Fluid Flush', intervalMiles: 45000, intervalMonths: 48, severity: 'medium', description: 'Prevents moisture buildup in the braking system.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Long-lasting plugs that eventually need a fresh set.' },
      ],
      sonata: 'elantra',
      tucson: 'elantra',
      'santa fe': 'elantra'
    }
  },
  kia: {
    models: {
      forte: 'hyundai.elantra',
      k5: 'hyundai.elantra',
      sportage: 'hyundai.elantra',
      sorento: 'hyundai.elantra'
    }
  },
  nissan: {
    models: {
      altima: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Regular oil changes are the best way to prevent engine trouble.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Ensures even wear and balanced handling.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Protects the engine from dust and debris.' },
        { service: 'CVT Transmission Fluid', intervalMiles: 60000, intervalMonths: 48, severity: 'high', description: 'Nissan CVTs need fresh fluid to stay reliable and efficient.' },
        { service: 'Brake Fluid Flush', intervalMiles: 20000, intervalMonths: 24, severity: 'medium', description: 'Keeps your braking system safe and effective.' },
      ],
      rogue: 'altima',
      sentra: 'altima',
      pathfinder: 'altima'
    }
  },
  subaru: {
    models: {
      outback: [
        { service: 'Oil & Filter Change', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Subaru engines love fresh oil to keep their unique layout happy.' },
        { service: 'Tire Rotation', intervalMiles: 6000, intervalMonths: 6, severity: 'low', description: 'Critical for All-Wheel Drive systems to have matching tread depth.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 30, severity: 'low', description: 'Keeps the boxer engine breathing clearly.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 30, severity: 'medium', description: 'Maintains consistent braking power.' },
        { service: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60, severity: 'medium', description: 'Ensures efficient combustion and power delivery.' },
      ],
      forester: 'outback',
      crosstrek: 'outback',
      impreza: 'outback'
    }
  },
  default: [
    { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'The gold standard for keeping any engine running for a long time.' },
    { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Regular rotations prevent you from needing new tires prematurely.' },
    { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Fresh air for you and your passengers.' },
    { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Helps the engine work less to produce more power.' },
    { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Essential safety maintenance for any vehicle.' },
    { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 60, severity: 'high', description: 'Keeps your engine at the right temperature year-round.' },
    { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 84, severity: 'medium', description: "Modern plugs last a long time, but they don't last forever." },
  ]
};

/**
 * Helper to get the schedule for a specific vehicle.
 */
export function getScheduleForVehicle(make, model) {
  if (!make) return MAINTENANCE_SCHEDULES.default;
  
  const normalizedMake = make.toLowerCase().trim();
  const normalizedModel = model?.toLowerCase().trim();
  
  const makeData = MAINTENANCE_SCHEDULES[normalizedMake];
  if (!makeData) return MAINTENANCE_SCHEDULES.default;
  
  let modelSchedule = makeData.models[normalizedModel];
  
  // Handle aliases/references
  if (typeof modelSchedule === 'string') {
    if (modelSchedule.includes('.')) {
      const [refMake, refModel] = modelSchedule.split('.');
      return MAINTENANCE_SCHEDULES[refMake].models[refModel];
    }
    return makeData.models[modelSchedule];
  }
  
  return modelSchedule || MAINTENANCE_SCHEDULES.default;
}
