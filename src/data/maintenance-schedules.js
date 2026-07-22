/**
 * Manufacturer maintenance schedules for common vehicles.
 * Each manufacturer has:
 * - specs: Vehicle-specific fluid and part specifications
 * - models: Map of model names to arrays of maintenance items
 */

export const MAINTENANCE_SCHEDULES = {
  toyota: {
    specs: { oil: { viscosity: '0W-20', type: 'Full Synthetic', capacity: '5.0 qt' }, transmission: { type: 'ATF WS', capacity: '4.0 qt' }, coolant: { type: 'Toyota Super Long Life Coolant', capacity: '2.5 gal' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 35 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 35' } },
    models: {
      camry: [
        { service: 'Oil & Filter Change', intervalMiles: 10000, intervalMonths: 12, severity: 'medium', description: "0W-20 full synthetic (normal schedule). Use 5,000 mi / 6 mo for severe service (towing, dusty roads, frequent short trips)." },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Moving tires around helps them wear evenly.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Filters the air you breathe inside the car.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Keeps dust out so the engine can breathe easy.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Brake fluid absorbs water — fresh fluid keeps brakes crisp.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 120, severity: 'high', description: 'Coolant prevents your engine from overheating.' },
        { service: 'Spark Plugs', intervalMiles: 120000, intervalMonths: 144, severity: 'medium', description: 'Fresh plugs help your car start fast and run smooth.' },
      ],
      corolla: 'camry', rav4: 'camry', highlander: 'camry',
      tacoma: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Trucks work hard. Fresh oil prevents wear.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Even wear is crucial for truck tires.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Fresh fluid prevents gears from grinding.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Keeps the trail dust out of your lungs.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Clean air means better fuel economy for your truck.' },
        { service: 'Spark Plugs', intervalMiles: 120000, intervalMonths: 144, severity: 'medium', description: 'Ensures reliable ignition even in tough conditions.' },
      ],
      tundra: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Full-size truck. i-Force V6 or V8. 0W-20 full synthetic.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Crucial for heavy truck tires.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Heavy towing needs fresh diff fluid.' },
        { service: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 48, severity: 'high', description: '10-speed automatic. Towing demands fresh fluid.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Clean air for towing power.' },
        { service: 'Spark Plugs', intervalMiles: 120000, intervalMonths: 144, severity: 'medium', description: 'Reliable V8 ignition.' },
      ],
      '4runner': 'toyota.tundra',
      sienna: [
        { service: 'Oil & Filter Change', intervalMiles: 10000, intervalMonths: 12, severity: 'medium', description: "0W-20 full synthetic (normal schedule). Use 5,000 mi / 6 mo for severe service (towing, dusty roads, frequent short trips). Family hauler. Maintains reliability." },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Even wear for minivan safety.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Clean air for passengers.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Better fuel economy on road trips.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Safe stops for family.' },
      ],
      'camry hybrid': 'toyota.camry',
      'gr86': [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Subaru boxer engine. 0W-20. High-revving sports car.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Performance tires wear fast.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Track-ready braking.' },
        { service: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 72, severity: 'medium', description: 'Boxer engine spark plugs.' },
      ],
      'bz4x': [
        { service: 'Tire Rotation', intervalMiles: 6250, intervalMonths: 0, severity: 'low', description: 'EV weight requires regular rotations.' },
        { service: 'Cabin Air Filter', intervalMiles: 0, intervalMonths: 24, severity: 'low', description: 'Replace every 2 years.' },
        { service: 'Brake Fluid Test', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Test for moisture every 2 years.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 120, severity: 'high', description: 'EV battery thermal management coolant.' },
        { service: 'Reduction Gear Oil', intervalMiles: 60000, intervalMonths: 48, severity: 'medium', description: 'EV gearbox fluid change.' },
        { service: 'Vehicle Inspection', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'Annual EV system check.' },
      ]
    }
  },
  honda: {
    specs: { oil: { viscosity: '0W-20', type: 'Full Synthetic', capacity: '4.5 qt' }, transmission: { type: 'HCF-2 (CVT) / ATF DW-1', capacity: '4.0 qt' }, coolant: { type: 'Honda Type 2' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 32 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 51R' } },
    models: {
      civic: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: 'Hondas need clean oil to thrive.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Helps your tires live their longest.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Filters out pollen and dust.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Prevents corrosion in your braking system.' },
        { service: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 48, severity: 'high', description: 'Fresh fluid prevents expensive repairs.' },
        { service: 'Valve Adjustment', intervalMiles: 100000, intervalMonths: 96, severity: 'high', description: 'Inspect and adjust valve clearance. Required on K-series and J-series engines.' },
        { service: 'Coolant Exchange', intervalMiles: 120000, intervalMonths: 120, severity: 'high', description: 'Honda specifies first change at 120,000 miles / 10 years, then every 60,000 miles / 5 years.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 84, severity: 'medium', description: 'Keeps your engine efficient and responsive.' },
      ],
      accord: 'civic', 'cr-v': 'civic', pilot: 'civic', odyssey: 'honda.pilot', element: 'honda.cr-v', ridgeline: 'honda.pilot'
    }
  },
  ford: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'Mercon LV', capacity: '4.0 qt' }, coolant: { type: 'Motorcraft Orange' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 36 }, sparkPlugs: { type: 'Iridium', gap: '0.049 in' }, battery: { groupSize: 'Group 65' } },
    models: {
      'f-150': [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 6, severity: 'medium', description: 'Heavy duty use requires regular oil changes.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 6, severity: 'low', description: 'Keeps your truck stable.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Maintains power and fuel efficiency.' },
        { service: 'Transmission Fluid', intervalMiles: 150000, intervalMonths: 120, severity: 'high', description: 'Normal use only — see Severe Use schedule if you tow or haul.' },
        { service: 'Transmission Fluid (Severe Use)', intervalMiles: 60000, intervalMonths: 48, severity: 'high', description: 'Required for trucks used for towing, hauling, off-road, or frequent stop-and-go. Severe-service interval per Ford specification.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 72, severity: 'high', description: 'Protects against overheating.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 72, severity: 'medium', description: "Iridium plugs rated for 100k. EcoBoost (2.7L/3.5L) engines benefit from 60k replacements (severe schedule)." },
      ],
      escape: 'f-150', explorer: 'f-150', mustang: 'f-150',
      edge: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 6, severity: 'medium', description: 'Ford crossover. 5W-20 full synthetic. Reliable EcoBoost.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 6, severity: 'low', description: 'Even wear for AWD crossover.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Better fuel economy.' },
        { service: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60, severity: 'medium', description: "Turbocharged EcoBoost engines are hard on spark plugs. 60k best practice (Ford severe schedule)." },
      ],
      bronco: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 6, severity: 'medium', description: 'Off-road legend. 2.3L EcoBoost or 2.7L V6.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 6, severity: 'low', description: 'Off-road tires wear unevenly.' },
        { service: 'Cabin Air Filter', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'Keeps trail dust out.' },
        { service: 'Transfer Case Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'high', description: '4x4 system essential maintenance.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Front and rear diff. Off-road use accelerates wear.' },
        { service: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60, severity: 'medium', description: "2.3L/2.7L EcoBoost. Turbo DI engines need 60k plug changes." }
      ],
      ranger: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 6, severity: 'medium', description: 'Mid-size truck. 2.3L EcoBoost. 5W-20 full synthetic.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 6, severity: 'low', description: 'Truck tires need regular rotation.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Dusty job sites need clean filters.' },
        { service: 'Transmission Fluid', intervalMiles: 150000, intervalMonths: 120, severity: 'high', description: '10-speed automatic. Towing stresses transmission.' },
        { service: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60, severity: 'medium', description: "2.3L EcoBoost. Replace at 60k for reliable turbo ignition." }
      ],
      transit: 'ford.edge',
      maverick: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 6, severity: 'medium', description: 'Compact truck. 2.5L hybrid or 2.0L EcoBoost.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 6, severity: 'low', description: 'Truck tires need regular rotation.' },
        { service: 'Cabin Air Filter', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'Clean cabin air.' },
        { service: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60, severity: 'medium', description: "EcoBoost needs fresh plugs. 60k best practice (Ford severe schedule)." },
      ],
      focus: 'ford.edge', 'f-250': 'ford.f-150', 'f-350': 'ford.f-150', 'e-series': 'ford.transit'
    }
  },
  chevrolet: {
    specs: { oil: { viscosity: '5W-30', type: 'Dexos Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'Dexron VI', capacity: '4.0 qt' }, coolant: { type: 'Dex-Cool Orange' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 36 }, sparkPlugs: { type: 'Iridium', gap: '0.040 in' }, battery: { groupSize: 'Group 48' } },
    models: {
      silverado: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: 'Essential protection for your engine.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Reduces road noise.' },
        { service: 'Engine Air Filter', intervalMiles: 45000, intervalMonths: 48, severity: 'low', description: 'Ensures your engine gets oxygen.' },
        { service: 'Brake Fluid Flush', intervalMiles: 45000, intervalMonths: 36, severity: 'medium', description: 'Prevents corrosion in your braking system.' },
        { service: 'Transmission Fluid', intervalMiles: 45000, intervalMonths: 48, severity: 'high', description: 'Keeps gear shifts smooth.' },
        { service: 'Front Differential Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: 'Protects front differential gears in 4x4 trucks.' },
        { service: 'Rear Differential Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: 'Fresh fluid prevents rear axle gear wear.' },
        { service: 'Transfer Case Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: 'Keeps 4x4 transfer case operating smoothly.' },
        { service: 'Spark Plugs', intervalMiles: 97500, intervalMonths: 96, severity: 'medium', description: 'Maintains engine performance.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 60, severity: 'high', description: 'Prevents overheating and corrosion.' },
      ],
      equinox: 'silverado', malibu: 'silverado',
      tahoe: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: 'Full-size SUV. Dexos 5W-30. Essential for heavy loads.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Important for heavy SUV tire life.' },
        { service: 'Engine Air Filter', intervalMiles: 22500, intervalMonths: 24, severity: 'low', description: 'Clean air for better towing power.' },
        { service: 'Brake Fluid Flush', intervalMiles: 45000, intervalMonths: 36, severity: 'medium', description: 'Safe stopping for a big SUV.' },
        { service: 'Transmission Fluid', intervalMiles: 45000, intervalMonths: 48, severity: 'high', description: 'Hydra-Matic transmission. Towing stresses the gearbox.' },
        { service: 'Transfer Case Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: '4WD system needs fresh fluid.' },
        { service: 'Spark Plugs', intervalMiles: 97500, intervalMonths: 96, severity: 'medium', description: 'Maintains V8 performance.' },
      ],
      suburban: 'chevrolet.tahoe', traverse: 'chevrolet.tahoe',
      colorado: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: 'Mid-size truck needs Dexos oil. 5W-30 full synthetic.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Even wear for truck tires.' },
        { service: 'Engine Air Filter', intervalMiles: 22500, intervalMonths: 24, severity: 'low', description: 'Off-road use needs clean filters.' },
        { service: 'Brake Fluid Flush', intervalMiles: 45000, intervalMonths: 36, severity: 'medium', description: 'Important for towing safety.' },
        { service: 'Transmission Fluid', intervalMiles: 45000, intervalMonths: 48, severity: 'high', description: '8-speed automatic. Keep it cool.' },
      ],
      camaro: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: 'LT1 or V6. Dexos full synthetic for performance.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Performance tires need even wear.' },
        { service: 'Cabin Air Filter', intervalMiles: 22500, intervalMonths: 24, severity: 'low', description: 'Fresh air for the cockpit.' },
        { service: 'Brake Fluid Flush', intervalMiles: 45000, intervalMonths: 36, severity: 'medium', description: 'Track-ready brakes need fresh fluid.' },
        { service: 'Spark Plugs', intervalMiles: 97500, intervalMonths: 96, severity: 'medium', description: 'Maximum V8 performance.' },
      ],
      trax: 'chevrolet.equinox',
      blazer: 'chevrolet.tahoe', corvette: 'chevrolet.camaro', impala: 'chevrolet.malibu', express: 'chevrolet.suburban'
    }
  },
  bmw: {
    specs: { oil: { viscosity: '0W-40', type: 'Full Synthetic LL-01', capacity: '6.9 qt' }, transmission: { type: 'ZF Lifeguard 8', capacity: '4.0 qt' }, coolant: { type: 'BMW Blue' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 33 }, sparkPlugs: { type: 'Iridium', gap: '0.032 in' }, battery: { groupSize: 'Group 49 (AGM)' } },
    models: {
      '3 series': [
        { service: 'Oil & Filter Change', intervalMiles: 10000, intervalMonths: 12, severity: 'medium', description: 'Precision engineering needs precision lubrication.' },
        { service: 'Microfilter (Cabin)', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'Keeps the luxury interior fresh.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'Ensures high-performance brakes.' },
        { service: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 72, severity: 'medium', description: 'Prevents performance drop-off.' },
        { service: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 96, severity: 'high', description: 'ZF recommends 50,000–75,000 mile intervals. BMW claims "lifetime" but ZF (the transmission manufacturer) disagrees. Critical for 8HP longevity.' },
        { service: 'Vehicle Check', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Comprehensive health check.' },
      ],
      '5 series': '3 series', x3: '3 series', x5: '3 series', '4 series': 'bmw.3 series'
    }
  },
  mercedes: {
    specs: { oil: { viscosity: '0W-40', type: 'Full Synthetic MB 229.5', capacity: '8.0 qt' }, transmission: { type: 'MB 236.15 / 236.17', capacity: '4.0 qt' }, coolant: { type: 'MB 325.0' }, brakeFluid: { type: 'DOT 4+' }, tirePressure: { psi: 35 }, sparkPlugs: { type: 'Iridium', gap: '0.035 in' }, battery: { groupSize: 'Group 49 (AGM)' } },
    models: {
      'c-class': [
        { service: 'Service A (Oil/Filter)', intervalMiles: 10000, intervalMonths: 12, severity: 'medium', description: 'Standard maintenance.' },
        { service: 'Service B (Comprehensive)', intervalMiles: 20000, intervalMonths: 24, severity: 'high', description: 'Deep check for long-term health.' },
        { service: 'Brake Fluid Flush', intervalMiles: 20000, intervalMonths: 24, severity: 'medium', description: 'Critical for safety.' },
        { service: 'Engine Air Filter', intervalMiles: 40000, intervalMonths: 48, severity: 'low', description: 'Keeps engine breathing optimally.' },
        { service: 'Transmission Service', intervalMiles: 60000, intervalMonths: 72, severity: 'high', description: 'Essential for transmission longevity.' },
      ],
      'e-class': 'c-class', glc: 'c-class', gle: 'c-class'
    }
  },
  mitsubishi: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '4.5 qt' }, transmission: { type: 'Diamond SP-III / CVT', capacity: '4.0 qt' }, coolant: { type: 'Mitsubishi Long Life' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 33 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 35' } },
    models: {
      lancer: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: '5W-20 full synthetic keeps the engine running clean.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Even wear extends tire life.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Clean cabin air for all occupants.' },
        { service: 'Engine Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Clean air for proper fuel mixture.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'DOT 3 brake fluid absorbs moisture over time.' },
        { service: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60, severity: 'medium', description: 'Iridium plugs — long life, consistent spark.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Diamond SP-III or CVT fluid. Keeps shifts smooth.' },
        { service: 'Coolant Flush', intervalMiles: 60000, intervalMonths: 60, severity: 'medium', description: 'Mitsubishi Long Life coolant prevents corrosion.' },
      ],
      eclipse: 'lancer',
      montero: 'lancer',
      '3000gt': 'lancer',
      galant: 'lancer',
    }
  },
  hyundai: {
    specs: { oil: { viscosity: '5W-30', type: 'Full Synthetic', capacity: '5.1 qt' }, transmission: { type: 'SP-IV / ATF', capacity: '4.0 qt' }, coolant: { type: 'Hyundai/Kia Long Life' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 33 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 47' } },
    models: {
      elantra: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: 'Keeps engine healthy and maintains warranty.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Prevents uneven tread wear.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Keeps cabin air fresh.' },
        { service: 'Brake Fluid Flush', intervalMiles: 45000, intervalMonths: 48, severity: 'medium', description: 'Prevents moisture buildup.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Long-lasting plugs.' },
        { service: 'Coolant Exchange', intervalMiles: 120000, intervalMonths: 120, severity: 'high', description: 'Hyundai specifies first change at 120,000 miles / 10 years, then every 30,000 miles / 24 months.' },
      ],
      sonata: 'elantra', tucson: 'elantra', 'santa fe': 'elantra',
      palisade: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: '3.8L V6. 5W-30 full synthetic. Hyundai flagship SUV.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Heavy SUV needs even tire wear.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Clean air for passengers.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Maintains V6 efficiency.' },
        { service: 'Brake Fluid Flush', intervalMiles: 45000, intervalMonths: 48, severity: 'medium', description: 'Safe SUV braking.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Long-life iridium plugs.' },
      ],
      kona: 'hyundai.elantra',
      'ioniq 5': [
        { service: 'Tire Rotation', intervalMiles: 6250, intervalMonths: 0, severity: 'low', description: 'EV weight needs regular rotations.' },
        { service: 'Cabin Air Filter', intervalMiles: 0, intervalMonths: 24, severity: 'low', description: 'Replace every 2 years.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Regen braking maintenance.' },
        { service: 'Reduction Gear Oil', intervalMiles: 60000, intervalMonths: 48, severity: 'medium', description: 'EV gearbox fluid.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 120, severity: 'high', description: 'Battery thermal management.' },
        { service: 'Battery Health Check', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'Annual EV diagnostic.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'Annual EV system check.' },
      ],
      'ioniq 6': 'hyundai.ioniq 5',
      venue: 'hyundai.elantra',
      'santa cruz': [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: 'Compact truck. 2.5L or turbo. 5W-30 full synthetic.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Truck tires need even wear.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Fresh cabin air.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Truck use needs clean filters.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Maintains performance.' },
      ]
    }
  },
  kia: {
    specs: { oil: { viscosity: '5W-30', type: 'Full Synthetic', capacity: '5.1 qt' }, transmission: { type: 'SP-IV / ATF', capacity: '4.0 qt' }, coolant: { type: 'Hyundai/Kia Long Life' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 34 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 47' } },
    models: { forte: 'hyundai.elantra', k5: 'hyundai.elantra', sportage: 'hyundai.elantra', sorento: 'hyundai.elantra', soul: 'hyundai.elantra' }
  },
  nissan: {
    specs: { oil: { viscosity: '0W-20', type: 'Full Synthetic', capacity: '5.0 qt' }, transmission: { type: 'NS-3 (CVT) / Matic S', capacity: '4.0 qt' }, coolant: { type: 'Nissan Blue' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 34 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 35' } },
    models: {
      altima: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Regular changes prevent engine trouble.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Ensures even wear.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Protects engine from dust.' },
        { service: 'CVT Transmission Fluid', intervalMiles: 60000, intervalMonths: 48, severity: 'high', description: 'Nissan CVTs need fresh fluid.' },
        { service: 'Brake Fluid Flush', intervalMiles: 20000, intervalMonths: 24, severity: 'medium', description: 'Keeps brakes safe.' },
      ],
      rogue: 'altima', sentra: 'altima', pathfinder: 'altima',
      frontier: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Mid-size truck. 3.8L V6. 0W-20 full synthetic.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Truck tires need even wear.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Off-road use needs clean filters.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: '4x4 diff fluid. Towing accelerates wear.' },
        { service: 'Spark Plugs', intervalMiles: 105000, intervalMonths: 84, severity: 'medium', description: 'Endurance V6 reliability.' },
      ],
      murano: 'nissan.altima',
      versa: 'nissan.altima',
      kicks: 'nissan.altima', maxima: 'nissan.altima',
      armada: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Full-size SUV. 5.6L V8. 0W-20 full synthetic.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Heavy SUV needs regular rotation.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'V8 needs clean air.' },
        { service: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 48, severity: 'high', description: '7-speed automatic. Towing stresses gearbox.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: '4WD diff. Heavy duty.' },
        { service: 'Spark Plugs', intervalMiles: 105000, intervalMonths: 84, severity: 'medium', description: 'Endurance V8 spark plugs.' },
      ],
      leaf: [
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 0, severity: 'low', description: 'EV weight requires regular rotations.' },
        { service: 'Cabin Air Filter', intervalMiles: 0, intervalMonths: 24, severity: 'low', description: 'Replace every 2 years.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Regen braking uses pads less, but fluid still ages.' },
        { service: 'Reduction Gear Oil', intervalMiles: 60000, intervalMonths: 48, severity: 'medium', description: 'EV gearbox fluid.' },
        { service: 'Battery Health Check', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'Annual EV battery diagnostic.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'Annual EV system check.' },
      ]
    }
  },
  subaru: {
    specs: { oil: { viscosity: '0W-20', type: 'Full Synthetic', capacity: '5.1 qt' }, transmission: { type: 'CVT Fluid / ATF HP', capacity: '4.0 qt' }, coolant: { type: 'Subaru Super Coolant' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 34 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 35' } },
    models: {
      outback: [
        { service: 'Oil & Filter Change', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Subaru boxer engines love fresh oil.' },
        { service: 'Tire Rotation', intervalMiles: 6000, intervalMonths: 6, severity: 'low', description: 'Critical for AWD systems.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 30, severity: 'low', description: 'Keeps boxer engine breathing.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 30, severity: 'medium', description: 'Maintains braking power.' },
        { service: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60, severity: 'medium', description: 'Ensures efficient combustion.' },
        { service: 'Front Differential Fluid', intervalMiles: 30000, intervalMonths: 30, severity: 'high', description: 'Critical for AWD system longevity. Subaru symmetrical AWD depends on both differentials.' },
        { service: 'Rear Differential Fluid', intervalMiles: 30000, intervalMonths: 30, severity: 'high', description: 'Critical for AWD system longevity.' },
        { service: 'Coolant Exchange', intervalMiles: 137500, intervalMonths: 132, severity: 'high', description: 'Subaru Super Coolant: first change at 137,500 miles / 11 years, then every 75,000 miles / 60 months. Boxer engines are sensitive to cooling system neglect.' },
      ],
      forester: 'outback', crosstrek: 'outback', impreza: 'outback'
    }
  },
  jeep: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'ATF+4 / ZF 8/9 speed', capacity: '4.0 qt' }, coolant: { type: 'Mopar OAT' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 36 }, sparkPlugs: { type: 'Iridium', gap: '0.043 in' }, battery: { groupSize: 'Group 48' } },
    models: {
      wrangler: [
        { service: 'Oil & Filter Change', intervalMiles: 8000, intervalMonths: 12, severity: 'medium', description: 'Essential for rugged Jeep engines.' },
        { service: 'Tire Rotation', intervalMiles: 8000, intervalMonths: 12, severity: 'low', description: 'Keeps tires wearing evenly.' },
        { service: 'Cabin Air Filter', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'Keeps trail dust out of cabin.' },
        { service: 'Transfer Case Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'high', description: 'Crucial for 4x4 health.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Ensures reliable ignition.' },
      ],
      'grand cherokee': 'wrangler', compass: 'jeep.wrangler', patriot: 'jeep.wrangler', cherokee: 'jeep.wrangler',
      'grand wagoneer': [
        { service: 'Oil & Filter Change', intervalMiles: 8000, intervalMonths: 12, severity: 'medium', description: 'Full-size luxury SUV. 6.4L V8 or 3.0L Hurricane twin-turbo I6. 5W-20 full synthetic.' },
        { service: 'Tire Rotation', intervalMiles: 8000, intervalMonths: 12, severity: 'low', description: 'Keeps premium tires wearing evenly on this heavy SUV.' },
        { service: 'Cabin Air Filter', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: '4-zone climate control needs clean filters.' },
        { service: 'Transfer Case Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'high', description: 'Crucial for Quadra-Drive II 4x4 system.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Iridium plugs for reliable V8/I6 ignition.' },
        { service: 'Air Suspension Check', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Quadra-Lift air suspension. Inspect annually.' },
      ], wagoneer: 'jeep.grand cherokee'
    }
  },
  ram: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'ATF+4 / ZF 8 speed', capacity: '4.0 qt' }, coolant: { type: 'Mopar OAT' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 38 }, sparkPlugs: { type: 'Iridium', gap: '0.043 in' }, battery: { groupSize: 'Group 48' } },
    models: {
      1500: [
        { service: 'Oil & Filter Change', intervalMiles: 8000, intervalMonths: 12, severity: 'medium', description: 'Keeps HEMI or EcoDiesel running strong.' },
        { service: 'Tire Rotation', intervalMiles: 8000, intervalMonths: 12, severity: 'low', description: 'Important for heavy trucks.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Helps truck breathe while towing.' },
        { service: 'Differential Fluid', intervalMiles: 20000, intervalMonths: 24, severity: 'medium', description: 'Towing requires regular diff service.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Optimal power and fuel economy.' },
      ],
      '2500': 'ram.1500', '3500': 'ram.1500'
    }
  },
  tesla: {
    specs: { oil: { isEV: true, note: 'No engine oil required (EV)' }, transmission: { type: 'Gearbox fluid (check service manual)' }, coolant: { type: 'Tesla specific' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 44 }, sparkPlugs: { note: 'No spark plugs (EV)' }, battery: { note: 'High-voltage lithium-ion traction battery' } },
    models: {
      'model 3': [
        { service: 'Cabin Air Filter', intervalMiles: 0, intervalMonths: 24, severity: 'low', description: 'Tesla recommends a fresh filter every 2 years.' },
        { service: 'Tire Rotation', intervalMiles: 6250, intervalMonths: 0, severity: 'low', description: 'EVs are heavy; regular rotations critical.' },
        { service: 'Brake Fluid Test', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Test for moisture every 2 years.' },
        { service: 'A/C Desiccant Bag', intervalMiles: 0, intervalMonths: 48, severity: 'medium', description: 'Keeps A/C system dry and efficient.' },
        { service: 'Brake Caliper Cleaning', intervalMiles: 12500, intervalMonths: 12, severity: 'low', description: 'Important in cold climates with road salt.' },
      ],
      'model y': 'model 3'
    }
  },
  volkswagen: {
    specs: { oil: { viscosity: '5W-40', type: 'Full Synthetic VW 508.00', capacity: '5.5 qt' }, transmission: { type: 'DSG fluid / ATF', capacity: '4.0 qt' }, coolant: { type: 'VW G12/G13' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 34 }, sparkPlugs: { type: 'Iridium', gap: '0.032 in' }, battery: { groupSize: 'Group 47 (AGM)' } },
    models: {
      jetta: [
        { service: 'Oil & Filter Change', intervalMiles: 10000, intervalMonths: 12, severity: 'medium', description: 'German engines thrive on synthetic oil.' },
        { service: 'Tire Rotation', intervalMiles: 10000, intervalMonths: 12, severity: 'low', description: 'Maintains crisp VW handling.' },
        { service: 'Cabin Air Filter', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'Clean interior environment.' },
        { service: 'Spark Plugs', intervalMiles: 40000, intervalMonths: 48, severity: 'medium', description: 'VW turbo engines need fresh plugs.' },
        { service: 'Transmission Service', intervalMiles: 80000, intervalMonths: 72, severity: 'high', description: 'Critical for DSG transmission health.' },
      ],
      tiguan: 'jetta', golf: 'jetta', passat: 'jetta', atlas: 'jetta',
      'id.4': [
        { service: 'Cabin Air Filter', intervalMiles: 0, intervalMonths: 24, severity: 'low', description: 'Fresh filter every 2 years for EV.' },
        { service: 'Tire Rotation', intervalMiles: 10000, intervalMonths: 0, severity: 'low', description: 'Regular rotations critical for heavy EV.' },
        { service: 'Brake Fluid Test', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Test for moisture every 2 years.' },
        { service: 'Vehicle Inspection', intervalMiles: 0, intervalMonths: 24, severity: 'low', description: 'Check high-voltage components.' },
      ]
    }
  },
  gmc: {
    specs: { oil: { viscosity: '5W-30', type: 'Dexos Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'Dexron VI', capacity: '4.0 qt' }, coolant: { type: 'Dex-Cool Orange' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 36 }, sparkPlugs: { type: 'Iridium', gap: '0.040 in' }, battery: { groupSize: 'Group 48' } },
    models: { sierra: 'chevrolet.silverado', yukon: 'chevrolet.silverado' }
  },
  mazda: {
    specs: { oil: { viscosity: '0W-20', type: 'Full Synthetic', capacity: '4.8 qt' }, transmission: { type: 'Mazda ATF FZ', capacity: '4.0 qt' }, coolant: { type: 'Mazda FL22' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 34 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 35' } },
    models: {
      mazda3: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Mazda engines need fresh oil.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Ensures balanced Zoom-Zoom handling.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Keeps cabin air crisp.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Better power and gas mileage.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'Responsive Mazda brake feel.' },
      ],
      'cx-5': 'mazda3', 'cx-9': 'mazda3', 'mx-5 miata': 'mazda3', 'cx-30': 'mazda.mazda3', 'cx-50': 'mazda.mazda3', 'cx-90': 'mazda.cx-9', 'mazda6': 'mazda.mazda3', '626': 'mazda.mazda3', 'mx-6': 'mazda.mx-5 miata', protege: 'mazda.mazda3', millenia: 'mazda.mazda3', 'b-series': 'ford.ranger',
            'rx-7': {
        specs: {
          oil: { viscosity: '10W-30', type: 'Conventional', capacity: '4.5 qt', note: 'Rotary engine — check oil every 2nd fill-up. Burns oil by design.' },
          transmission: { type: 'GL-4 75W-90', capacity: '2.5 qt' },
          coolant: { type: 'Ethylene glycol (green)', capacity: '9.0 qt' },
          brakeFluid: { type: 'DOT 3' },
          tirePressure: { psi: 32 },
          sparkPlugs: { type: 'NGK BUR7EQP/9EQP (rotary-specific)', gap: '0.039 in' },
          battery: { groupSize: 'Group 35' }
        },
        services: [
          { service: 'Oil & Filter', intervalMiles: 3000, intervalMonths: 6, severity: 'high', description: 'Rotary engine. Check oil level every 2nd fuel fill-up. Burns oil by design.' },
          { service: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36, severity: 'high', description: 'Rotary engines consume spark plugs faster. Use NGK trailing/leading plugs.' },
          { service: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Rotary engines run hot — fresh coolant is critical.' },
          { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'GL-4 75W-90. Do NOT use GL-5 (damages synchros).' },
          { service: 'Brake Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium' },
          { service: 'Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low' },
          { service: 'Cabin Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low' },
          { service: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'medium' },
          { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'medium' },
          { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low' },
          { service: 'Ignition Wires', intervalMiles: 60000, intervalMonths: 60, severity: 'medium', description: 'Rotary-specific ignition wires.' }
        ]
      }, 'rx-8': 'mazda.rx-7',
    }
  },
  audi: {
    specs: { oil: { viscosity: '5W-40', type: 'Full Synthetic VW 508.00', capacity: '5.5 qt' }, transmission: { type: 'DSG fluid / ATF', capacity: '4.0 qt' }, coolant: { type: 'VW G12/G13' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 34 }, sparkPlugs: { type: 'Iridium', gap: '0.032 in' }, battery: { groupSize: 'Group 49 (AGM)' } },
    models: {
      a4: [
        { service: 'Oil & Filter Change', intervalMiles: 10000, intervalMonths: 12, severity: 'medium', description: 'High-performance Audi needs synthetic oil.' },
        { service: 'Dust & Pollen Filter', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'Luxury cabin air quality.' },
        { service: 'Brake Fluid Flush', intervalMiles: 20000, intervalMonths: 24, severity: 'medium', description: 'Consistent stopping power.' },
        { service: 'Spark Plugs', intervalMiles: 40000, intervalMonths: 48, severity: 'medium', description: 'Prevents misfires in turbo engines.' },
        { service: 'Engine Air Filter', intervalMiles: 60000, intervalMonths: 72, severity: 'low', description: 'Essential for Audi performance.' },
        { service: 'Transmission Service', intervalMiles: 40000, intervalMonths: 48, severity: 'high', description: 'Crucial for S-tronic longevity.' },
      ],
      a3: 'a4', q5: 'a4', q7: 'a4'
    }
  },
  volvo: {
    specs: { oil: { viscosity: '0W-20', type: 'Full Synthetic Volvo Spec', capacity: '5.6 qt' }, transmission: { type: 'Volvo ATF', capacity: '4.0 qt' }, coolant: { type: 'Volvo Green' }, brakeFluid: { type: 'DOT 4+' }, tirePressure: { psi: 36 }, sparkPlugs: { type: 'Iridium', gap: '0.032 in' }, battery: { groupSize: 'Group 48 (AGM)' } },
    models: {
      xc60: [
        { service: 'Oil & Filter Change', intervalMiles: 10000, intervalMonths: 12, severity: 'medium', description: 'Foundation of Volvo longevity.' },
        { service: 'Tire Rotation', intervalMiles: 10000, intervalMonths: 12, severity: 'low', description: 'Stable and long-lasting tires.' },
        { service: 'Cabin Air Filter', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'CleanZone air quality.' },
        { service: 'Brake Fluid Flush', intervalMiles: 40000, intervalMonths: 24, severity: 'medium', description: 'Safe braking in all conditions.' },
        { service: 'Engine Air Filter', intervalMiles: 40000, intervalMonths: 48, severity: 'low', description: 'Protects engine and efficiency.' },
        { service: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60, severity: 'medium', description: 'Optimal fuel combustion.' },
      ],
      xc40: 'xc60', xc90: 'xc60', s60: 'xc60'
    }
  },
  lexus: {
    specs: { oil: { viscosity: '0W-20', type: 'Full Synthetic', capacity: '5.0 qt' }, transmission: { type: 'ATF WS', capacity: '4.0 qt' }, coolant: { type: 'Toyota Super Long Life Coolant' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 35 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 35' } },
    models: {
      rx: [
        { service: 'Oil & Filter Change', intervalMiles: 10000, intervalMonths: 12, severity: 'medium', description: 'Legendary Lexus reliability.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Smooth and quiet ride.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Luxury cabin air.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Crisp braking feel.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Engine efficiency.' },
      ],
      es: 'rx', nx: 'rx', is: 'rx'
    }
  },
  acura: {
    specs: { oil: { viscosity: '0W-20', type: 'Full Synthetic', capacity: '4.5 qt' }, transmission: { type: 'HCF-2 (CVT) / ATF DW-1', capacity: '4.0 qt' }, coolant: { type: 'Honda Type 2' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 32 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 51R' } },
    models: {
      mdx: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: 'High-revving Acura performance.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Precision Crafted Handling.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Fresh interior air.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Safe braking performance.' },
        { service: 'Transfer Case Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'Crucial for SH-AWD.' },
      ],
      rdx: 'mdx', tlx: 'mdx', integra: 'mdx'
    }
  },
  dodge: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'ATF+4 / ZF 8 speed', capacity: '4.0 qt' }, coolant: { type: 'Mopar OAT' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 36 }, sparkPlugs: { type: 'Iridium', gap: '0.043 in' }, battery: { groupSize: 'Group 48' } },
    models: {
      charger: [
        { service: 'Oil & Filter Change', intervalMiles: 8000, intervalMonths: 6, severity: 'medium', description: 'Vital for HEMI or Pentastar engines.' },
        { service: 'Tire Rotation', intervalMiles: 8000, intervalMonths: 6, severity: 'low', description: 'Important for RWD muscle cars.' },
        { service: 'Cabin Air Filter', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'Clean cockpit air.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Maximum power.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Quick starts every time.' },
      ],
      challenger: 'charger', durango: 'charger',
      'grand caravan': [
        { service: 'Oil & Filter Change', intervalMiles: 8000, intervalMonths: 6, severity: 'medium', description: 'Family minivan needs reliable oil changes. Pentastar V6.' },
        { service: 'Tire Rotation', intervalMiles: 8000, intervalMonths: 6, severity: 'low', description: 'Even wear for safe family travel.' },
        { service: 'Cabin Air Filter', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'Fresh air for the whole family.' },
        { service: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 48, severity: 'high', description: 'ZF 9-speed or 6-speed. Fresh fluid prevents rough shifts.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Smooth engine performance.' },
      ],
      journey: 'charger'
    }
  },
  chrysler: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '5.0 qt' }, transmission: { type: 'ATF+4 / ZF 8 speed', capacity: '4.0 qt' }, coolant: { type: 'Mopar OAT' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 35 }, sparkPlugs: { type: 'Iridium', gap: '0.043 in' }, battery: { groupSize: 'Group 48' } },
    models: {
      pacifica: [
        { service: 'Oil & Filter Change', intervalMiles: 8000, intervalMonths: 12, severity: 'medium', description: 'Keeps family mover reliable.' },
        { service: 'Tire Rotation', intervalMiles: 8000, intervalMonths: 12, severity: 'low', description: 'Maintains stability.' },
        { service: 'Cabin Air Filter', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'Clean air for passengers.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Improves fuel economy.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Smooth idling.' },
      ],
      300: 'pacifica'
    }
  },
  cat: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CJ-4', capacity: '7.0 gal' }, transmission: { type: 'Marine gearbox' }, coolant: { type: 'CAT Extended Life Coolant (ELC)' }, fuelFilters: { type: 'CAT 1R-0749 primary / 1R-0750 secondary' },
      oilFilters: { type: 'CAT 3I-0852' }, airFilter: { type: 'CAT heavy-duty' }, valveAdjustment: { note: 'Required every 2000 hours' },
      zincAnodes: { note: 'Inspect and replace annually in saltwater' }, impeller: { note: 'Raw water pump impeller' } },
    models: {
      'c7': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours of operation. CAT diesel engine oil CJ-4 15W-40.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace primary and secondary fuel filters.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours or 3 years. CAT Extended Life Coolant (ELC).' },
        { service: 'Valve Adjustment', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 2000 hours. Inspect and adjust valve lash.' },
        { service: 'Zinc Anode Replacement', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Inspect every 6 months in saltwater. Replace if 50% consumed.' },
        { service: 'Raw Water Impeller', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Replace annually. Critical for cooling system.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Check belts, hoses, clamps, and seawater system.' },
      ],
      'c9': 'cat.c7', 'c12': 'cat.c7', 'c18': 'cat.c7', 'c32': 'cat.c7',
      'c4.4': 'cat.c7', 'c6.6': 'cat.c7', 'c8.7': 'cat.c7'
    }
  },
  cummins: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CJ-4/CH-4', capacity: '6.0 gal' }, transmission: { type: 'ZF Marine / Twin Disc' }, coolant: { type: 'Fleetguard ES Compleat OAT' },
      fuelFilters: { type: 'Fleetguard FS1000 / FF5320' }, oilFilters: { type: 'Fleetguard LF3000' }, airFilter: { type: 'Fleetguard heavy-duty' },
      zincAnodes: { note: 'Inspect annually' }, impeller: { note: 'Raw water pump impeller' }, aftercooler: { note: 'Inspect and clean annually' } },
    models: {
      'qsb': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. Cummins approved CJ-4 15W-40 diesel oil.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace primary and secondary Fleetguard filters.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours or 2 years. Fleetguard ES Compleat OAT.' },
        { service: 'Aftercooler Service', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Inspect and clean aftercooler core annually. Prevents seawater corrosion.' },
        { service: 'Zinc Anode Replacement', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Inspect every 6 months. Replace as needed for corrosion protection.' },
        { service: 'Raw Water Impeller', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Replace annually. Critical seawater cooling circulation.' },
        { service: 'Valve Adjustment', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 2000 hours. Check and adjust valve lash.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Check hoses, belts, and seawater strainer.' },
      ],
      'qsl': 'cummins.qsb', 'qsm11': 'cummins.qsb', 'qsx15': 'cummins.qsb',
      '6bta': 'cummins.qsb', '6cta': 'cummins.qsb'
    }
  },
  yamaha: {
    specs: { oil: { viscosity: '10W-30', type: 'Yamalube 4M FC-W', capacity: '5.3 qt' }, gearOil: { type: 'Yamalube Marine Gear Oil' }, coolant: { type: 'Yamaha Long Life Coolant' },
      sparkPlugs: { type: 'NGK Iridium', gap: '0.044 in' }, fuelFilters: { type: 'Yamaha 10 micron' }, impeller: { note: 'Water pump impeller' },
      zincAnodes: { note: 'Replace annually' }, timingBelt: { note: '4-stroke outboards — check every 1000 hours' } },
    models: {
      'f115': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 100 hours or annually. Use Yamalube 4M FC-W 10W-30.' },
        { service: 'Gear Oil Change', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Every 100 hours or annually. Yamalube Marine Gear Oil.' },
        { service: 'Water Pump Impeller', intervalMiles: 0, intervalMonths: 24, severity: 'high', description: 'Replace every 300 hours or 3 years. Critical for cooling.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK Iridium plugs.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace annually. 10 micron Yamaha fuel filter.' },
        { service: 'Zinc Anode Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace annually. Critical in saltwater operation.' },
        { service: 'Valve Adjustment', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours. Check intake and exhaust valve clearance.' },
        { service: 'Timing Belt Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 1000 hours. Inspect 4-stroke timing mechanism.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Bi-annual inspection. Check fuel lines, hoses, electrical connections.' },
      ],
      'f150': 'yamaha.f115', 'f200': 'yamaha.f115', 'f250': 'yamaha.f115',
      'f300': 'yamaha.f115', 'f70': 'yamaha.f115'
    }
  },
  mercury: {
    specs: { oil: { viscosity: '10W-30', type: 'Mercury MerCruiser Full Synthetic', capacity: '6.0 qt' }, gearOil: { type: 'Mercury High Performance Gear Oil' }, coolant: { type: 'Mercury Extended Life Coolant' },
      sparkPlugs: { type: 'NGK Iridium', gap: '0.035 in' }, fuelFilters: { type: 'Mercury 10 micron water-separating' },
      impeller: { note: 'Water pump impeller' }, zincAnodes: { note: 'Replace annually' } },
    models: {
      'verado': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 100 hours or annually. Mercury Full Synthetic 10W-30.' },
        { service: 'Gear Oil Change', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Every 100 hours or annually. Mercury High Performance Gear Oil.' },
        { service: 'Water Pump Impeller', intervalMiles: 0, intervalMonths: 24, severity: 'high', description: 'Replace every 300 hours. Critical for Verado supercharged cooling.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK Iridium plugs.' },
        { service: 'Fuel/Water Separator', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace annually. Mercury 10 micron water-separating filter.' },
        { service: 'Zinc Anode Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace annually. Saltwater protection.' },
        { service: 'Supercharger Belt', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours. Inspect and replace Verado supercharger belt.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Bi-annual check of electrical, cooling, and fuel systems.' },
      ],
      'pro xs': 'mercury.verado',
      'fourstroke': 'mercury.verado',
      'optimax': 'mercury.verado'
    }
  },
  kubota: {
    specs: { oil: { viscosity: '10W-30', type: 'Kubota UDT / Super UDT', capacity: '3.5 gal' }, transmission: { type: 'Kubota Super UDT2' }, coolant: { type: 'Kubota Long Life Coolant' },
      fuelFilters: { type: 'Kubota original' }, oilFilters: { type: 'Kubota original' },
      airFilter: { type: 'Kubota heavy-duty dry' }, battery: { groupSize: 'Group 27' } },
    models: {
      'lx3310': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Kubota UDT or Super UDT 10W-30.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace Kubota original fuel filter.' },
        { service: 'Transmission Fluid Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Kubota Super UDT2 hydraulic/transmission fluid.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours. Kubota Long Life Coolant.' },
        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 400 hours or when indicator shows restricted.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Check belts, hoses, fluid levels.' },
      ],
      'l4701': 'kubota.lx3310', 'mx5200': 'kubota.lx3310',
      'b2601': 'kubota.lx3310', 'z700': 'kubota.lx3310'
    }
  },
  yanmar: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CF-4/CH-4', capacity: '4.0 gal' }, transmission: { type: 'ZF Marine / Yanmar KM series' }, coolant: { type: 'Yanmar Long Life Coolant' },
      fuelFilters: { type: 'Yanmar Y-1001 primary / Y-1002 secondary' }, oilFilters: { type: 'Yanmar Y-2001' },
      zincAnodes: { note: 'Inspect annually' }, impeller: { note: 'Raw water pump impeller' } },
    models: {
      '4jh': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. Diesel engine oil CF-4/CH-4 15W-40.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace primary and secondary Yanmar fuel filters.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours or 2 years. Yanmar Long Life Coolant.' },
        { service: 'Raw Water Impeller', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Replace annually. Critical for saltwater cooling.' },
        { service: 'Zinc Anode Replacement', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Inspect every 6 months. Replace if 50% consumed.' },
        { service: 'Valve Adjustment', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 1000 hours. Check and adjust valve clearance.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Check seawater system, hoses, belts.' },
      ],
      '3ym30': 'yanmar.4jh', '4jh5': 'yanmar.4jh', '6lp': 'yanmar.4jh',
      '6ly': 'yanmar.4jh'
    }
  },
  hyster: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CF-4/CH-4', capacity: '3.0 gal' }, transmission: { type: 'Hyster Powershift / Hydrostatic' }, coolant: { type: 'Universal OAT' },
      fuelFilters: { type: 'Hyster original' }, oilFilters: { type: 'Hyster original' },
      airFilter: { type: 'Hyster heavy-duty' }, battery: { groupSize: 'Group 31' }, tirePressure: { psi: 'Varies by tire type' } },
    models: {
      'h50': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. Diesel engine oil CF-4/CH-4 15W-40. Classic models: check for straight-weight 30W if pre-1970.' },
        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours or when indicator shows restricted.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace Hyster original or equivalent fuel filter.' },
        { service: 'Transmission Fluid Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. Hyster Powershift or Monotrol transmission fluid.' },
        { service: 'Hydraulic Fluid Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. Replace hydraulic oil and return filter.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours. Universal OAT coolant.' },
        { service: 'Brake Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours. Check brake pads, discs, and fluid.' },
        { service: 'Tire Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Check tire condition and pressure.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Full inspection of mast, chains, forks, and safety systems.' },
      ],
      'h60': 'hyster.h50', 'h70': 'hyster.h50', 'h80': 'hyster.h50',
      'h100': 'hyster.h50', 'h120': 'hyster.h50',
      's50': 'hyster.h50', 's60': 'hyster.h50', 's70': 'hyster.h50',
      '50': 'hyster.h50', 'h50a': 'hyster.h50', 'h50b': 'hyster.h50', 'h50c': 'hyster.h50'
    }
  },
  // --- Semi-Trucks ---
  freightliner: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CJ-4', capacity: '12.0 gal' }, transmission: { type: 'Eaton Fuller / Allison', capacity: '4.0 gal' }, coolant: { type: 'Fleetguard ES Compleat OAT', capacity: '8.0 gal' }, brakeFluid: { type: 'DOT 5' }, tirePressure: { psi: 100 }, fuelFilters: { type: 'Primary + Secondary spin-on' }, airFilter: { type: 'Heavy-duty Donaldson' }, battery: { groupSize: 'Group 31 (4x)' } },
    models: {
      cascadia: [
        { service: 'Oil & Filter Change', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Detroit Diesel engine. Use CJ-4 15W-40. Change every 25k miles or 6 months.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Replace primary and secondary fuel filters. Critical for fuel system health.' },
        { service: 'Air Filter Replacement', intervalMiles: 50000, intervalMonths: 12, severity: 'medium', description: 'Check restriction indicator. Replace as needed for optimal fuel economy.' },
        { service: 'Coolant Exchange', intervalMiles: 150000, intervalMonths: 36, severity: 'high', description: 'Drain and refill with Fleetguard ES Compleat. Protects against freezing and corrosion.' },
        { service: 'Transmission Fluid Change', intervalMiles: 100000, intervalMonths: 24, severity: 'high', description: 'Eaton Fuller or Allison transmission. Use recommended synthetic gear oil.' },
        { service: 'Differential Fluid', intervalMiles: 100000, intervalMonths: 24, severity: 'medium', description: 'Drive axle differentials. Prevents gear wear under heavy loads.' },
        { service: 'Brake Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Check air brake system, slack adjusters, and brake linings.' },
        { service: 'Tire Rotation', intervalMiles: 25000, intervalMonths: 6, severity: 'low', description: 'Steer, drive, and trailer tires. Even wear extends tire life.' },
        { service: 'Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'low', description: 'Full PM inspection: belts, hoses, lights, brakes, suspension.' },
      ],
      m2: 'freightliner.cascadia', coronado: 'freightliner.cascadia', '114sd': 'freightliner.cascadia'
    }
  },
  kenworth: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CJ-4', capacity: '11.0 gal' }, transmission: { type: 'Eaton Fuller / PACCAR', capacity: '4.0 gal' }, coolant: { type: 'PACCAR Extended Life Coolant', capacity: '8.0 gal' }, brakeFluid: { type: 'DOT 5' }, tirePressure: { psi: 105 }, fuelFilters: { type: 'PACCAR primary + secondary' }, airFilter: { type: 'PACCAR heavy-duty' }, battery: { groupSize: 'Group 31 (4x)' } },
    models: {
      t680: [
        { service: 'Oil & Filter Change', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'PACCAR MX engine. Use CJ-4 15W-40. The backbone of your truck.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Replace PACCAR primary and secondary fuel filters. Don\'t skip.' },
        { service: 'Air Filter Replacement', intervalMiles: 50000, intervalMonths: 12, severity: 'medium', description: 'When restriction indicator lights up, it\'s time.' },
        { service: 'Coolant Exchange', intervalMiles: 150000, intervalMonths: 36, severity: 'high', description: 'PACCAR Extended Life Coolant. Protects your engine from extreme temps.' },
        { service: 'Transmission Fluid Change', intervalMiles: 100000, intervalMonths: 24, severity: 'high', description: 'Eaton Fuller 10/13/18-speed. Use synthetic gear oil.' },
        { service: 'Differential Fluid', intervalMiles: 100000, intervalMonths: 24, severity: 'medium', description: 'Front and rear differentials. Prevents costly axle failures.' },
        { service: 'Brake Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Air brake system check. Linings, drums, slack adjusters.' },
        { service: 'Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'low', description: 'Complete PM. Check steering, suspension, tires, lights.' },
      ],
      t880: 'kenworth.t680', w900: 'kenworth.t680', t440: 'kenworth.t680'
    }
  },
  peterbilt: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CJ-4', capacity: '11.0 gal' }, transmission: { type: 'Eaton Fuller / Allison', capacity: '4.0 gal' }, coolant: { type: 'PACCAR Extended Life Coolant', capacity: '8.0 gal' }, brakeFluid: { type: 'DOT 5' }, tirePressure: { psi: 100 }, fuelFilters: { type: 'Primary + Secondary' }, airFilter: { type: 'Peterbilt heavy-duty' }, battery: { groupSize: 'Group 31 (4x)' } },
    models: {
      '579': [
        { service: 'Oil & Filter Change', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'PACCAR MX-13 engine. CJ-4 15W-40 diesel oil.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Replace both primary and secondary fuel filters.' },
        { service: 'Air Filter Replacement', intervalMiles: 50000, intervalMonths: 12, severity: 'medium', description: 'Replace when restriction gauge indicates.' },
        { service: 'Coolant Exchange', intervalMiles: 150000, intervalMonths: 36, severity: 'high', description: 'Extended life coolant protects against cavitation and freezing.' },
        { service: 'Transmission Service', intervalMiles: 100000, intervalMonths: 24, severity: 'high', description: 'Eaton Fuller automated or manual transmission.' },
        { service: 'Brake Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Air disc or drum brake inspection.' },
        { service: 'Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'low', description: 'Level 1 PM: all fluid levels, belts, hoses, lights.' },
      ],
      '389': 'peterbilt.579', '567': 'peterbilt.579', '520': 'peterbilt.579'
    }
  },
  'volvo-trucks': {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil VDS-5', capacity: '11.0 gal' }, transmission: { type: 'Volvo I-Shift / AT', capacity: '4.0 gal' }, coolant: { type: 'Volvo VCS OAT', capacity: '8.0 gal' }, brakeFluid: { type: 'DOT 5' }, tirePressure: { psi: 100 }, fuelFilters: { type: 'Volvo original' }, airFilter: { type: 'Volvo heavy-duty' }, battery: { groupSize: 'Group 31 (4x)' } },
    models: {
      vnl: [
        { service: 'Oil & Filter Change', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Volvo D13 engine. VDS-5 approved 15W-40 oil. Critical for engine life.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Volvo fuel filters. Essential for high-pressure fuel system.' },
        { service: 'Air Filter Replacement', intervalMiles: 50000, intervalMonths: 12, severity: 'medium', description: 'Replace based on restriction indicator.' },
        { service: 'Coolant Exchange', intervalMiles: 150000, intervalMonths: 36, severity: 'high', description: 'Volvo VCS OAT coolant. Protects D13 engine.' },
        { service: 'I-Shift Transmission Service', intervalMiles: 100000, intervalMonths: 24, severity: 'high', description: 'Volvo I-Shift automated transmission. Use genuine Volvo fluid.' },
        { service: 'Brake Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Check air disc brakes and electronic braking system.' },
        { service: 'Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'low', description: 'Full PM. Volvo recommends dealer inspection every 25k.' },
      ],
      vnr: 'volvo-trucks.vnl', vnx: 'volvo-trucks.vnl', vhd: 'volvo-trucks.vnl'
    }
  },
  mack: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil EOS-4.5', capacity: '11.0 gal' }, transmission: { type: 'Mack mDRIVE / Allison', capacity: '4.0 gal' }, coolant: { type: 'Mack Extended Life Coolant', capacity: '8.0 gal' }, brakeFluid: { type: 'DOT 5' }, tirePressure: { psi: 100 }, fuelFilters: { type: 'Mack original' }, airFilter: { type: 'Mack heavy-duty' }, battery: { groupSize: 'Group 31 (4x)' } },
    models: {
      anthem: [
        { service: 'Oil & Filter Change', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Mack MP8 or MP7 engine. EOS-4.5 15W-40. Built to last.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Replace Mack fuel filters. Critical for MP engine fuel system.' },
        { service: 'Air Filter Replacement', intervalMiles: 50000, intervalMonths: 12, severity: 'medium', description: 'Replace when restriction indicator shows.' },
        { service: 'Coolant Exchange', intervalMiles: 150000, intervalMonths: 36, severity: 'high', description: 'Mack Extended Life Coolant. Protects your Bulldog engine.' },
        { service: 'mDRIVE Service', intervalMiles: 100000, intervalMonths: 24, severity: 'high', description: 'Mack mDRIVE automated transmission. Use genuine Mack fluid.' },
        { service: 'Brake Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Air brake system. Linings, drums, chambers.' },
        { service: 'Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'low', description: 'PM inspection. All fluids, belts, hoses, chassis.' },
      ],
      pinnacle: 'mack.anthem', granite: 'mack.anthem', lr: 'mack.anthem'
    }
  },
  international: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CJ-4', capacity: '11.0 gal' }, transmission: { type: 'Eaton Fuller / Allison', capacity: '4.0 gal' }, coolant: { type: 'Navistar Extended Life Coolant', capacity: '8.0 gal' }, brakeFluid: { type: 'DOT 5' }, tirePressure: { psi: 100 }, fuelFilters: { type: 'International original' }, airFilter: { type: 'International heavy-duty' }, battery: { groupSize: 'Group 31 (4x)' } },
    models: {
      lt: [
        { service: 'Oil & Filter Change', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'International A26 or N13 engine. CJ-4 15W-40 diesel oil.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Replace diamond-plate fuel filters.' },
        { service: 'Air Filter Replacement', intervalMiles: 50000, intervalMonths: 12, severity: 'medium', description: 'Replace when restriction gauge indicates.' },
        { service: 'Coolant Exchange', intervalMiles: 150000, intervalMonths: 36, severity: 'high', description: 'Navistar ELC coolant. Prevents liner pitting.' },
        { service: 'Transmission Fluid Change', intervalMiles: 100000, intervalMonths: 24, severity: 'high', description: 'Eaton Fuller or Allison transmission.' },
        { service: 'Brake Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Inspect air brake system components.' },
        { service: 'Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'low', description: 'Full PM. Diamond Check inspection process.' },
      ],
      rh: 'international.lt', lonestar: 'international.lt', mv: 'international.lt'
    }
  },
  'western-star': {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CJ-4', capacity: '11.0 gal' }, transmission: { type: 'Detroit DT12 / Allison', capacity: '4.0 gal' }, coolant: { type: 'Detroit ELC', capacity: '8.0 gal' }, brakeFluid: { type: 'DOT 5' }, tirePressure: { psi: 100 }, fuelFilters: { type: 'Detroit Diesel original' }, airFilter: { type: 'Western Star heavy-duty' }, battery: { groupSize: 'Group 31 (4x)' } },
    models: {
      '4700': [
        { service: 'Oil & Filter Change', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Detroit DD13/DD15 engine. CJ-4 15W-40. Keep your Western Star on the road.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Replace Detroit Diesel fuel filters.' },
        { service: 'Air Filter Replacement', intervalMiles: 50000, intervalMonths: 12, severity: 'medium', description: 'Replace when restriction indicator shows.' },
        { service: 'Coolant Exchange', intervalMiles: 150000, intervalMonths: 36, severity: 'high', description: 'Detroit ELC coolant. Protects against extreme conditions.' },
        { service: 'DT12 Transmission Service', intervalMiles: 100000, intervalMonths: 24, severity: 'high', description: 'Detroit DT12 automated transmission. Use genuine Detroit fluid.' },
        { service: 'Brake Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'high', description: 'Air brake system. Linings, drums, slack adjusters.' },
        { service: 'Inspection', intervalMiles: 25000, intervalMonths: 6, severity: 'low', description: 'Full PM. Check all systems for safety and reliability.' },
      ],
      '4900': 'western-star.4700', '5700': 'western-star.4700', '6900': 'western-star.4700'
    }
  },

  // --- RVs (Ford F-53 chassis-based) ---
  winnebago: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'Ford TorqShift / Mercon LV', capacity: '4.0 qt' }, coolant: { type: 'Motorcraft Orange', capacity: '3.0 gal' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 80 }, sparkPlugs: { type: 'Iridium', gap: '0.049 in' }, battery: { groupSize: 'Group 65 (chassis) + house batteries' }, generator: { note: 'Onan generator — service every 150 hours' } },
    models: {
      vista: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'high', description: 'Ford F-53 chassis. 5W-20 full synthetic. RV weight means extra wear.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Heavy RV tires need regular rotation to prevent blowouts.' },
        { service: 'Generator Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 150 hours. Onan generator oil and filter change.' },
        { service: 'Engine Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'medium', description: 'Motorcraft air filter. RVs kick up dust at campgrounds.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'Ford TorqShift transmission. Mercon LV. Towing stresses transmission.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 60, severity: 'high', description: 'Motorcraft Orange coolant. Prevents overheating on long grades.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'DOT 4 brake fluid. Heavy RV braking generates heat.' },
        { service: 'Slide-Out Lubrication', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Lubricate slide-out mechanisms every 6 months. Keeps them moving smoothly.' },
        { service: 'Roof Inspection', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Inspect RV roof sealant and seams annually. Prevents leaks.' },
        { service: 'Inspection', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Full RV inspection: chassis, generator, house systems, tires.' },
      ],
      travato: 'winnebago.vista', solis: 'winnebago.vista', ekko: 'winnebago.vista'
    }
  },
  thor: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'Ford TorqShift / Mercon LV', capacity: '4.0 qt' }, coolant: { type: 'Motorcraft Orange', capacity: '3.0 gal' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 80 }, sparkPlugs: { type: 'Iridium', gap: '0.049 in' }, battery: { groupSize: 'Group 65 (chassis) + house' }, generator: { note: 'Onan/Cummins generator — service every 150 hours' } },
    models: {
      'four winds': [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'high', description: 'Ford F-53 chassis. 5W-20 synthetic. Protects under heavy load.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Regular rotation extends tire life on heavy RVs.' },
        { service: 'Generator Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 150 hours. Onan/Cummins generator maintenance.' },
        { service: 'Engine Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'medium', description: 'Motorcraft air filter for Ford chassis.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'TorqShift transmission. Essential for towing.' },
        { service: 'Slide-Out Maintenance', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Lubricate and inspect slide-out mechanisms.' },
        { service: 'Roof Sealant Check', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Inspect and reseal roof seams as needed.' },
        { service: 'Inspection', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'PM: chassis, generator, house systems, tires.' },
      ],
      ace: 'thor.four winds', chateau: 'thor.four winds', tellaro: 'thor.four winds'
    }
  },
  'forest-river': {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'Ford TorqShift / Mercon LV', capacity: '4.0 qt' }, coolant: { type: 'Motorcraft Orange', capacity: '3.0 gal' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 80 }, sparkPlugs: { type: 'Iridium', gap: '0.049 in' }, generator: { note: 'Onan generator — service every 150 hours' } },
    models: {
      sunseeker: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'high', description: 'Ford F-53 chassis. 5W-20 full synthetic. Regular changes prevent engine wear.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Heavy Class C motorhome. Rotate to prevent irregular wear.' },
        { service: 'Generator Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 150 hours. Onan generator oil and filter.' },
        { service: 'Engine Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'medium', description: 'Replace Ford chassis air filter.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'TorqShift transmission fluid change.' },
        { service: 'Slide-Out Lubrication', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Keep slide mechanisms lubricated.' },
        { service: 'Inspection', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Full RV inspection.' },
      ],
      forester: 'forest-river.sunseeker', berkshire: 'forest-river.sunseeker', georgetown: 'forest-river.sunseeker'
    }
  },
  jayco: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'Ford TorqShift / Mercon LV', capacity: '4.0 qt' }, coolant: { type: 'Motorcraft Orange', capacity: '3.0 gal' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 80 }, sparkPlugs: { type: 'Iridium', gap: '0.049 in' }, generator: { note: 'Onan generator — service every 150 hours' } },
    models: {
      greyhawk: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'high', description: 'Ford F-53 chassis. 5W-20 full synthetic. Trust Jayco engineering.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Regular rotation extends tire life.' },
        { service: 'Generator Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 150 hours. Onan generator maintenance.' },
        { service: 'Engine Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'medium', description: 'Motorcraft air filter replacement.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'Ford TorqShift transmission fluid.' },
        { service: 'Slide-Out Lubrication', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Keep Jayco slide mechanisms operating smoothly.' },
        { service: 'Inspection', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Full RV PM inspection.' },
      ],
      redhawk: 'jayco.greyhawk', alante: 'jayco.greyhawk', precept: 'jayco.greyhawk'
    }
  },
  airstream: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'Ford TorqShift / Mercon LV', capacity: '4.0 qt' }, coolant: { type: 'Motorcraft Orange', capacity: '3.0 gal' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 80 }, sparkPlugs: { type: 'Iridium', gap: '0.049 in' }, battery: { groupSize: 'Group 65 (chassis) + lithium house' }, generator: { note: 'Onan generator — service every 150 hours' } },
    models: {
      classic: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'high', description: 'Ford E-Transit or RAM Promaster chassis. Use recommended oil.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Keep your Airstream rolling smoothly.' },
        { service: 'Generator Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 150 hours. Onan generator maintenance.' },
        { service: 'Engine Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'medium', description: 'Replace chassis air filter.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'Chassis transmission fluid change.' },
        { service: 'Roof AC Service', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Clean and inspect roof A/C units annually.' },
        { service: 'Inspection', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Full RV inspection: chassis, house systems, propane.' },
      ],
      interstate: 'airstream.classic', atlas: 'airstream.classic', bambi: 'airstream.classic'
    }
  },
  newmar: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CJ-4 (Diesel Pusher)', capacity: '11.0 gal' }, transmission: { type: 'Allison 3000 / 4000', capacity: '4.0 gal' }, coolant: { type: 'Extended Life OAT', capacity: '8.0 gal' }, brakeFluid: { type: 'DOT 5' }, tirePressure: { psi: 110 }, fuelFilters: { type: 'Primary + Secondary' }, airFilter: { type: 'Heavy-duty' }, battery: { groupSize: 'Group 31 (chassis) + 8D house' }, generator: { note: 'Cummins/Onan — service every 150 hours' } },
    models: {
      'bay star': [
        { service: 'Oil & Filter Change', intervalMiles: 15000, intervalMonths: 6, severity: 'high', description: 'Diesel pusher chassis. CJ-4 15W-40. Newmar luxury demands attention.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 15000, intervalMonths: 6, severity: 'high', description: 'Replace diesel fuel filters. Clean fuel is critical.' },
        { service: 'Generator Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 150 hours. Cummins/Onan generator oil and filter.' },
        { service: 'Air Filter Replacement', intervalMiles: 30000, intervalMonths: 12, severity: 'medium', description: 'Replace when restriction indicator shows.' },
        { service: 'Transmission Fluid Change', intervalMiles: 60000, intervalMonths: 24, severity: 'high', description: 'Allison 3000/4000. Use genuine Allison TES 295.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 60, severity: 'high', description: 'Extended life OAT coolant for diesel engine.' },
        { service: 'Slide-Out Service', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Lubricate and adjust Newmar slide mechanisms.' },
        { service: 'Roof Inspection', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Inspect roof sealant, AC units, and satellite dome.' },
        { service: 'Inspection', intervalMiles: 15000, intervalMonths: 6, severity: 'low', description: 'Full luxury RV inspection. Chassis, generator, house systems.' },
      ],
      ventana: 'newmar.bay star', 'dutch star': 'newmar.bay star', 'london aire': 'newmar.bay star'
    }
  },
  'grand-design': {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'Ford TorqShift / Mercon LV', capacity: '4.0 qt' }, coolant: { type: 'Motorcraft Orange', capacity: '3.0 gal' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 80 }, sparkPlugs: { type: 'Iridium', gap: '0.049 in' } },
    models: {
      solitude: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'high', description: 'Ford F-53 chassis. 5W-20 full synthetic. Grand Design durability.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Fifth wheel and motorhome. Rotate for even wear.' },
        { service: 'Generator Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 150 hours if equipped with generator.' },
        { service: 'Engine Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'medium', description: 'Ford chassis air filter.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'TorqShift transmission fluid change.' },
        { service: 'Slide-Out Lubrication', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Grand Design slide mechanisms. Lubricate every 6 months.' },
        { service: 'Inspection', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Full RV inspection. Includes chassis, house, propane systems.' },
      ],
      reflection: 'grand-design.solitude', imagine: 'grand-design.solitude', momentum: 'grand-design.solitude'
    }
  },

  // --- Watercraft (engine hours) ---
  seadoo: {
    specs: { oil: { viscosity: '5W-40', type: 'Synthetic 2-Stroke / 4-Tec', capacity: '3.0 qt' }, gearOil: { type: 'Sea-Doo synthetic gear oil' }, coolant: { type: 'Sea-Doo XPS', capacity: '1.5 gal' }, sparkPlugs: { type: 'NGK Iridium', gap: '0.028 in' }, impeller: { note: 'Jet pump impeller — inspect annually' }, battery: { groupSize: 'Group 16 (Li-ion or AGM)' } },
    models: {
      gtx: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 50 hours or annually. Rotax 4-TEC engine. Sea-Doo XPS 5W-40.' },
        { service: 'Supercharger Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect and rebuild supercharger. Critical for 4-TEC.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. NGK Iridium plugs. Prevents misfire on water.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Inspect impeller and wear ring annually. Debris damages pump.' },
        { service: 'Gear Oil Change', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Sea-Doo synthetic gear oil.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Sea-Doo XPS coolant. Prevents corrosion.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check battery and terminals before each season.' },
        { service: 'Winterization', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Annually before storage. Fog engine, stabilize fuel, drain water.' },
      ],
      rxp: 'seadoo.gtx', gti: 'seadoo.gtx', rxt: 'seadoo.gtx', spark: 'seadoo.gtx'
    }
  },
  'yamaha-wc': {
    specs: { oil: { viscosity: '10W-40', type: 'Yamalube 4T Marine', capacity: '3.5 qt' }, gearOil: { type: 'Yamaha Marine Gear Oil' }, coolant: { type: 'Yamaha Long Life Coolant' }, sparkPlugs: { type: 'NGK Iridium', gap: '0.032 in' }, impeller: { note: 'Jet pump impeller — inspect annually' }, battery: { groupSize: 'Group 16 (AGM)' } },
    models: {
      'fx cruiser': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 50 hours or annually. Yamaha 1.8L marine engine. Yamalube 10W-40.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. NGK Iridium plugs for reliable starting.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Inspect impeller and wear ring for damage. Debris causes vibration.' },
        { service: 'Gear Oil Change', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Yamaha Marine Gear Oil.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Yamaha Long Life Coolant.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'AGM battery check. Top up charge before season.' },
        { service: 'Winterization', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Annually: fog engine, antifreeze, stabilize fuel.' },
      ],
      vx: 'yamaha-wc.fx cruiser', ex: 'yamaha-wc.fx cruiser', gp: 'yamaha-wc.fx cruiser', svho: 'yamaha-wc.fx cruiser'
    }
  },
  'kawasaki-wc': {
    specs: { oil: { viscosity: '10W-40', type: 'Kawasaki 4-Stroke Marine Oil', capacity: '3.5 qt' }, gearOil: { type: 'Kawasaki Marine Gear Oil' }, coolant: { type: 'Kawasaki Long Life Coolant' }, sparkPlugs: { type: 'NGK Iridium', gap: '0.032 in' }, impeller: { note: 'Jet pump impeller — inspect annually' }, battery: { groupSize: 'Group 16 (AGM)' } },
    models: {
      'ultra 310': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 50 hours or annually. Kawasaki 1.5L supercharged engine. 10W-40.' },
        { service: 'Supercharger Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect and rebuild supercharger clutch.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. NGK Iridium plugs.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Inspect impeller and wear ring for damage.' },
        { service: 'Gear Oil Change', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Kawasaki Marine Gear Oil.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Kawasaki Long Life Coolant.' },
        { service: 'Winterization', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Annually: fog engine, drain water, stabilize fuel.' },
      ],
      'stx 160': 'kawasaki-wc.ultra 310', 'sx-r': 'kawasaki-wc.ultra 310'
    }
  },

  // --- Motorcycles ---
  'harley-davidson': {
    specs: { oil: { viscosity: '20W-50', type: 'Harley-Davidson Screamin\' Eagle Full Synthetic', capacity: '4.0 qt' }, primaryChain: { type: 'Harley Formula+ Primary Chaincase Oil' }, transmission: { type: 'Harley Formula+ Transmission Oil' }, brakeFluid: { type: 'DOT 5' }, tirePressure: { psi: 36 }, battery: { groupSize: 'Group 24' } },
    models: {
      'street glide': [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'high', description: 'Harley V-Twin loves fresh Screamin\' Eagle 20W-50. Belt drive — no chain maintenance needed.' },
        { service: 'Primary Chaincase Oil', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Replace Harley Formula+ primary chaincase oil. Keeps the clutch and primary running smooth.' },
        { service: 'Transmission Oil', intervalMiles: 10000, intervalMonths: 12, severity: 'medium', description: 'Replace with Harley Formula+ transmission oil. Essential for smooth shifting.' },
        { service: 'Brake Fluid Flush', intervalMiles: 20000, intervalMonths: 24, severity: 'medium', description: 'DOT 5 silicone-based fluid. Does not absorb water like DOT 3/4.' },
        { service: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Replace Harley twin cam or Milwaukee-Eight spark plugs.' },
        { service: 'Drive Belt Inspection', intervalMiles: 10000, intervalMonths: 12, severity: 'low', description: 'Inspect belt tension and wear. Harley belt drive is low maintenance but needs checking.' },
        { service: 'Tire Inspection', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Check tire pressure and tread depth. Harley tires wear faster than car tires.' },
      ],
      'road king': 'harley-davidson.street glide', 'fat boy': 'harley-davidson.street glide',
      'softail': 'harley-davidson.street glide', 'sportster': 'harley-davidson.street glide',
      'electra glide': 'harley-davidson.street glide'
    }
  },
  'yamaha-mc': {
    specs: { oil: { viscosity: '10W-40', type: 'Yamalube 4T Full Synthetic', capacity: '3.5 qt' }, transmission: { type: 'Yamalube 10W-40 (shared with engine)' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 33 }, battery: { groupSize: 'Group 12' }, chain: { type: '520 / 530 O-ring chain' } },
    models: {
      'r1': [
        { service: 'Oil & Filter Change', intervalMiles: 4000, intervalMonths: 6, severity: 'high', description: 'High-revving CP4 crossplane engine. Yamalube 10W-40 full synthetic.' },
        { service: 'Chain Lube & Adjustment', intervalMiles: 500, intervalMonths: 0, severity: 'medium', description: 'Lube and adjust every 500 miles. 520 O-ring chain needs frequent care.' },
        { service: 'Brake Fluid Flush', intervalMiles: 15000, intervalMonths: 12, severity: 'medium', description: 'DOT 4. Sport bike brakes run hot.' },
        { service: 'Spark Plugs', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'NGK Iridium plugs. Critical for high-RPM performance.' },
        { service: 'Coolant Exchange', intervalMiles: 30000, intervalMonths: 48, severity: 'medium', description: 'Yamaha Long Life Coolant. Prevents overheating during spirited riding.' },
        { service: 'Tire Inspection', intervalMiles: 2000, intervalMonths: 0, severity: 'low', description: 'Sport bike tires wear fast. Check every 2000 miles.' },
        { service: 'Valve Clearance Check', intervalMiles: 26000, intervalMonths: 48, severity: 'high', description: 'CP4 engine needs valve adjustments. Dealer service recommended.' },
      ],
      'r7': 'yamaha-mc.r1', 'mt-09': 'yamaha-mc.r1', 'mt-07': 'yamaha-mc.r1',
      'yzf-r6': 'yamaha-mc.r1', 'super tenere': 'yamaha-mc.r1'
    }
  },
  'honda-mc': {
    specs: { oil: { viscosity: '10W-30', type: 'Honda GN4/HP4 Full Synthetic', capacity: '3.0 qt' }, transmission: { type: 'Honda 10W-30 (shared with engine)' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 34 }, battery: { groupSize: 'Group 12' }, chain: { type: '520 O-ring chain' } },
    models: {
      'cbr1000rr': [
        { service: 'Oil & Filter Change', intervalMiles: 4000, intervalMonths: 6, severity: 'high', description: 'Honda Fireblade engine. Use Honda GN4 or HP4 10W-30.' },
        { service: 'Chain Lube & Adjustment', intervalMiles: 500, intervalMonths: 0, severity: 'medium', description: 'Every 500 miles. 520 O-ring chain lube and tension check.' },
        { service: 'Brake Fluid Flush', intervalMiles: 15000, intervalMonths: 12, severity: 'medium', description: 'DOT 4 brake fluid. Consistent braking feel.' },
        { service: 'Spark Plugs', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'Iridium plugs for consistent ignition.' },
        { service: 'Valve Clearance Check', intervalMiles: 16000, intervalMonths: 24, severity: 'high', description: 'Honda recommends valve check every 16k miles.' },
        { service: 'Coolant Exchange', intervalMiles: 30000, intervalMonths: 48, severity: 'medium', description: 'Honda Type 2 coolant.' },
      ],
      'cbr600rr': 'honda-mc.cbr1000rr', 'cbr650r': 'honda-mc.cbr1000rr',
      'cb1000r': 'honda-mc.cbr1000rr', 'africa twin': 'honda-mc.cbr1000rr',
      'nc750x': 'honda-mc.cbr1000rr', 'gold wing': 'honda-mc.cbr1000rr'
    }
  },
  'kawasaki-mc': {
    specs: { oil: { viscosity: '10W-40', type: 'Kawasaki Performance Full Synthetic', capacity: '3.5 qt' }, transmission: { type: 'Kawasaki 10W-40 (shared with engine)' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 34 }, battery: { groupSize: 'Group 12' }, chain: { type: '520/525 O-ring chain' } },
    models: {
      'ninja zx-10r': [
        { service: 'Oil & Filter Change', intervalMiles: 4000, intervalMonths: 6, severity: 'high', description: 'Kawasaki superbike engine. Full synthetic 10W-40.' },
        { service: 'Chain Lube & Adjustment', intervalMiles: 500, intervalMonths: 0, severity: 'medium', description: 'Every 500 miles. 525 O-ring chain care.' },
        { service: 'Brake Fluid Flush', intervalMiles: 15000, intervalMonths: 12, severity: 'medium', description: 'DOT 4 fluid flush.' },
        { service: 'Spark Plugs', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'NGK Iridium plugs.' },
        { service: 'Valve Clearance Check', intervalMiles: 15000, intervalMonths: 24, severity: 'high', description: 'Kawasaki recommends checking every 15k miles.' },
        { service: 'Coolant Exchange', intervalMiles: 30000, intervalMonths: 48, severity: 'medium', description: 'Kawasaki Long Life Coolant.' },
      ],
      'ninja 650': 'kawasaki-mc.ninja zx-10r', 'z900': 'kawasaki-mc.ninja zx-10r',
      'z650': 'kawasaki-mc.ninja zx-10r', 'versys 650': 'kawasaki-mc.ninja zx-10r',
      'vulcan s': 'kawasaki-mc.ninja zx-10r'
    }
  },
  'suzuki-mc': {
    specs: { oil: { viscosity: '10W-40', type: 'Suzuki ECSTAR Full Synthetic', capacity: '3.2 qt' }, transmission: { type: 'Suzuki 10W-40 (shared with engine)' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 34 }, battery: { groupSize: 'Group 12' }, chain: { type: '525 O-ring chain' } },
    models: {
      'gsx-r1000': [
        { service: 'Oil & Filter Change', intervalMiles: 4000, intervalMonths: 6, severity: 'high', description: 'Suzuki GSX-R engine. ECSTAR 10W-40 full synthetic.' },
        { service: 'Chain Lube & Adjustment', intervalMiles: 500, intervalMonths: 0, severity: 'medium', description: 'Every 500 miles. 525 O-ring chain.' },
        { service: 'Brake Fluid Flush', intervalMiles: 15000, intervalMonths: 12, severity: 'medium', description: 'DOT 4 brake fluid.' },
        { service: 'Spark Plugs', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'Iridium plugs for GSX-R performance.' },
        { service: 'Valve Clearance Check', intervalMiles: 15000, intervalMonths: 24, severity: 'high', description: 'Every 15k miles. Dealer service.' },
        { service: 'Coolant Exchange', intervalMiles: 30000, intervalMonths: 48, severity: 'medium', description: 'Suzuki Long Life Coolant.' },
      ],
      'gsx-r750': 'suzuki-mc.gsx-r1000', 'gsx-r600': 'suzuki-mc.gsx-r1000',
      'sv650': 'suzuki-mc.gsx-r1000', 'v-strom 650': 'suzuki-mc.gsx-r1000',
      'hayabusa': 'suzuki-mc.gsx-r1000'
    }
  },
  'bmw-mc': {
    specs: { oil: { viscosity: '5W-40', type: 'BMW Advantec Pro Full Synthetic', capacity: '4.0 qt' }, transmission: { type: 'BMW Gear Oil 75W-90 (separate)' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 36 }, battery: { groupSize: 'Group 12' }, shaftDrive: { note: 'Shaft drive — no chain maintenance needed' } },
    models: {
      'r1250gs': [
        { service: 'Oil & Filter Change', intervalMiles: 6000, intervalMonths: 12, severity: 'high', description: 'BMW boxer twin. Advantec 5W-40. Shaft drive — no chain to lube.' },
        { service: 'Transmission Oil Change', intervalMiles: 12000, intervalMonths: 24, severity: 'medium', description: 'Separate gearbox. BMW 75W-90 gear oil.' },
        { service: 'Final Drive Oil Change', intervalMiles: 12000, intervalMonths: 24, severity: 'high', description: 'Replace shaft drive final drive oil. Critical for BMW shaft reliability.' },
        { service: 'Brake Fluid Flush', intervalMiles: 20000, intervalMonths: 24, severity: 'medium', description: 'DOT 4. BMW linked braking system.' },
        { service: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Iridium plugs for boxer engine.' },
        { service: 'Valve Clearance Check', intervalMiles: 12000, intervalMonths: 24, severity: 'high', description: 'Boxer engine valve adjustment. Dealer service recommended.' },
        { service: 'Coolant Exchange', intervalMiles: 40000, intervalMonths: 48, severity: 'medium', description: 'BMW coolant. Prevents overheating during long tours.' },
        { service: 'Tire Inspection', intervalMiles: 6000, intervalMonths: 6, severity: 'low', description: 'Adventure tires need regular checking for punctures and wear.' },
      ],
      's1000rr': 'bmw-mc.r1250gs', 'r nine t': 'bmw-mc.r1250gs', 'f850gs': 'bmw-mc.r1250gs',
      'k1600': 'bmw-mc.r1250gs'
    }
  },
  indian: {
    specs: { oil: { viscosity: '20W-50', type: 'Indian Motorcycle Full Synthetic', capacity: '4.0 qt' }, primaryChain: { type: 'Indian Formula+ Primary Chaincase Oil' }, transmission: { type: 'Indian Formula+ Transmission Oil' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 36 }, battery: { groupSize: 'Group 24' } },
    models: {
      'challenger': [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'high', description: 'Indian PowerPlus V-Twin. 20W-50 full synthetic. Belt drive — no chain.' },
        { service: 'Primary Chaincase Oil', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Replace Indian Formula+ primary oil. Keeps clutch smooth.' },
        { service: 'Transmission Oil', intervalMiles: 10000, intervalMonths: 12, severity: 'medium', description: 'Indian Formula+ transmission oil.' },
        { service: 'Brake Fluid Flush', intervalMiles: 20000, intervalMonths: 24, severity: 'medium', description: 'DOT 4. Indian braking system.' },
        { service: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Replace PowerPlus engine spark plugs.' },
        { service: 'Drive Belt Inspection', intervalMiles: 10000, intervalMonths: 12, severity: 'low', description: 'Check belt tension and condition.' },
      ],
      'chieftain': 'indian.challenger', 'springfield': 'indian.challenger', 'scout': 'indian.challenger'
    }
  },

  // --- Ford cross-references (Lincoln) ---
  lincoln: {
    specs: { oil: { viscosity: '5W-20', type: 'Ford Motorcraft Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'Mercon LV', capacity: '4.0 qt' }, coolant: { type: 'Motorcraft Orange' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 36 }, sparkPlugs: { type: 'Iridium', gap: '0.049 in' }, battery: { groupSize: 'Group 65' } },
    models: {
      corsair: 'ford.f-150', nautilus: 'ford.f-150', aviator: 'ford.f-150', navigator: 'ford.f-150'
    }
  },
  // --- Nissan cross-references (Infiniti) ---
  infiniti: {
    specs: { oil: { viscosity: '0W-20', type: 'Nissan Ester Full Synthetic', capacity: '5.0 qt' }, transmission: { type: 'NS-3 (CVT) / Matic S', capacity: '4.0 qt' }, coolant: { type: 'Nissan Blue' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 34 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 35' } },
    models: {
      q50: 'nissan.altima', q60: 'nissan.altima', qx50: 'nissan.altima', qx60: 'nissan.altima', qx80: 'nissan.altima'
    }
  },
  // --- Chevrolet cross-references (Buick) ---
  buick: {
    specs: { oil: { viscosity: '5W-30', type: 'Dexos Full Synthetic', capacity: '5.0 qt' }, transmission: { type: 'Dexron VI', capacity: '4.0 qt' }, coolant: { type: 'Dex-Cool Orange' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 34 }, sparkPlugs: { type: 'Iridium', gap: '0.040 in' }, battery: { groupSize: 'Group 48' } },
    models: {
      enclave: 'chevrolet.silverado', envision: 'chevrolet.silverado', encore: 'chevrolet.silverado', lacrosse: 'chevrolet.silverado', gnx: 'chevrolet.silverado', riviera: 'chevrolet.silverado', lesabre: 'chevrolet.silverado', 'park avenue': 'chevrolet.silverado', rendezvous: 'chevrolet.silverado'
    }
  },

  // --- Electric Forklift (Hyster e-series — battery/charging maintenance) ---
  'hyster-e': {
    specs: { battery: { type: 'Lead-acid / Lithium-ion', voltage: '36V - 80V', capacity: '500-1200 Ah' }, charger: { type: 'Industrial HF / SCR' }, tirePressure: { psi: 'Varies by tire type' } },
    models: {
      'e30': [
        { service: 'Battery Watering', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 5 charge cycles (lead-acid). Check electrolyte levels. Use distilled water only.' },
        { service: 'Battery Charge Check', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Daily. Check charge status after each shift. Never discharge below 20%.' },
        { service: 'Connector Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Weekly. Inspect battery connectors and charger cables for damage.' },
        { service: 'Equalization Charge', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 30 charge cycles (lead-acid). Equalization charge prevents sulfation.' },
        { service: 'Brake Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours. Check brake pads, discs, and regenerative braking.' },
        { service: 'Tire Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Check tire condition and pressure. Solid tires need rotation.' },
        { service: 'Coolant Check (Charger)', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check charger cooling system every 6 months. Clean cooling fans.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Full PM: mast, forks, hydraulics, safety systems.' },
      ],
      'e40': 'hyster-e.e30', 'e50': 'hyster-e.e30', 'e60': 'hyster-e.e30',
      'e80': 'hyster-e.e30', 'e100': 'hyster-e.e30',
      'j30': 'hyster-e.e30', 'j40': 'hyster-e.e30', 'j50': 'hyster-e.e30'
    }
  },

  // --- Ag Equipment (hours-based) ---
  'john-deere': {
    specs: { oil: { viscosity: '15W-40', type: 'John Deere Plus-50 II', capacity: '5.0 gal' }, transmission: { type: 'Hy-Gard Transmission & Hydraulic Oil' }, coolant: { type: 'John Deere Cool-Gard II' },
      fuelFilters: { type: 'John Deere original' }, oilFilters: { type: 'John Deere original' },
      airFilter: { type: 'John Deere heavy-duty' }, battery: { groupSize: 'Group 94R' }, tirePressure: { psi: 30, note: '30 psi for ag tractors. XUV/Gator models: 10-15 psi.' } },
    models: {
      // R-Series large row-crop tractors (diesel, hours-based)
      '6r': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. John Deere Plus-50 II 15W-40 diesel oil.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace both primary and secondary fuel filters.' },
        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1500 hours. John Deere Hy-Gard hydraulic/transmission oil.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours. Cool-Gard II extended life coolant.' },
        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours or when air restriction indicator shows.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },
        { service: 'Tire Pressure Check', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Check daily for proper inflation. 30 PSI typical for ag tires.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Full inspection of belts, hoses, controls, and PTO.' },
      ],
      '5r': 'john-deere.6r', '7r': 'john-deere.6r', '8r': 'john-deere.6r', '9r': 'john-deere.6r',

      // 3000 Series compact tractors (diesel)
      '3000': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. John Deere Plus-50 II 15W-40. 3-cylinder diesel.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace fuel filter and water separator.' },
        { service: 'Hydraulic/Transmission Fluid', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. John Deere Hy-Gard.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1500 hours. Cool-Gard II coolant.' },
        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 400 hours or when restriction indicator shows.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Check belts, hoses, tire pressure, and 3-point hitch.' },
      ],
      '3032e': 'john-deere.3000', '3038e': 'john-deere.3000', '3039r': 'john-deere.3000', '3046r': 'john-deere.3000',

      // 4000 Series compact utility tractors (diesel)
      '4000': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. John Deere Plus-50 II 15W-40. 4-cylinder diesel.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace fuel filter and water separator.' },
        { service: 'Hydraulic/Transmission Fluid', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1200 hours. John Deere Hy-Gard.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours. Cool-Gard II coolant.' },
        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours. Replace inner and outer elements.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Check belts, hoses, and loader mounts.' },
      ],
      '4105': 'john-deere.4000', '4120': 'john-deere.4000', '4044m': 'john-deere.4000', '4052m': 'john-deere.4000', '4066m': 'john-deere.4000',

      // 5000 Series utility tractors (diesel)
      '5000': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. John Deere Plus-50 II 15W-40. PowerTech diesel.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace fuel filter and water separator.' },
        { service: 'Hydraulic/Transmission Fluid', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1500 hours. John Deere Hy-Gard.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours. Cool-Gard II extended life.' },
        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours when restriction indicator shows.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Check tires, PTO, brakes, and safety systems.' },
      ],
      '5045e': 'john-deere.5000', '5055e': 'john-deere.5000', '5065e': 'john-deere.5000', '5075e': 'john-deere.5000',

      // XUV Utility Vehicles & Gators (gasoline/small diesel)
      'xuv': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 100 hours or annually. 10W-30 (gas) or 15W-40 (diesel).' },
        { service: 'Engine Air Filter', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 200 hours or annually. Replace pre-cleaner and main filter.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Every 200 hours or annually. Replace inline fuel filter.' },
        { service: 'Spark Plug Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 300 hours (gasoline models). NGK or Champion equivalent.' },
        { service: 'Transmission/Hydro Fluid', intervalMiles: 0, intervalMonths: 24, severity: 'high', description: 'Every 500 hours or 2 years. John Deere Hy-Gard.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. 50/50 ethylene glycol mix.' },
        { service: 'Brake Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Every 100 hours or annually. Check pads and fluid.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge before storage season.' },
        { service: 'Tire Pressure Check', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Check before each use. 10-15 PSI typical.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Every 100 hours or annually. Check belts, hoses, and chassis.' },
      ],
      'xuv825m': 'john-deere.xuv', 'xuv865m': 'john-deere.xuv', 'xuv590e': 'john-deere.xuv', 'xuv560e': 'john-deere.xuv',
      'gator-xuv-835': 'john-deere.xuv', 'gator-hpx': 'john-deere.xuv', 'gator-te': 'john-deere.xuv', 'gator-tx': 'john-deere.xuv'
    }
  },

  // --- MG (British classic, 1952-2000) ---
  mg: {
    specs: { oil: { viscosity: '20W-50', type: 'High-Zinc Classic (mineral)', capacity: '4.5 qt' }, transmission: { type: 'GL-4 Gear Oil 75W-90', capacity: '2.5 pt' }, coolant: { type: 'Green IAT Coolant', capacity: '2.0 gal' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 28 }, sparkPlugs: { type: 'Copper Core', gap: '0.025 in' }, battery: { groupSize: 'Group 27F' } },
    models: {
      'mg td': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '1250cc XPAG. 20W-50 high-zinc. Old engines need frequent changes.' },
        { service: 'Valve Adjustment', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Solid lifters. Adjust to 0.012" hot.' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'T-series Lucas distributor. Gap 0.015".' },
        { service: 'Timing Chain', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'Check timing chain tension and wear.' },
        { service: 'Grease Chassis', intervalMiles: 1000, intervalMonths: 1, severity: 'low', description: 'Lever-arm shocks and steering joints. Old-school lube.' },
        { service: 'Gearbox Oil', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'GL-4 75W-90. Brass synchros need sulfur-free GL-4 only.' },
        { service: 'Coolant Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT coolant. Old iron blocks need corrosion protection.' },
        { service: 'Brake Adjustment', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Lockheed drum brakes. Adjust at each wheel.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Copper core. Gap 0.025". Replace at tune-up.' },
        { service: 'Clutch Adjustment', intervalMiles: 6000, intervalMonths: 6, severity: 'low', description: 'Cable-operated. Check free play at pedal.' },
      ],
      'mg tf': 'mg.mg td',
      'mg a': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '1500/1600 B-series. 20W-50 high-zinc. Classic oil discipline.' },
        { service: 'Valve Adjustment', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'B-series pushrods. Hot clearance 0.012".' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Lucas 25D distributor. Keep spare points.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Wire wheels. Check spoke tension too.' },
        { service: 'Gearbox Oil', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'GL-4 75W-90. Only GL-4 for brass synchros.' },
        { service: 'Coolant Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT. Twin-cam owners watch the oil cooler.' },
        { service: 'Brake Fluid Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'DOT 4. Disc front, drum rear on later cars.' },
        { service: 'Differential Oil', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'GL-5 80W-90. Banjo axle.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Copper core. Gap 0.025".' },
        { service: 'Timing Chain Tension', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'Check tension on B-series. Noisy chain needs shimming.' },
      ],
      'mga twin cam': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'high', description: '1.6L DOHC. 20W-50. Twin cams run hotter — more frequent.' },
        { service: 'Valve Adjustment', intervalMiles: 3000, intervalMonths: 3, severity: 'high', description: 'Double overhead cam shim adjustment. Check often.' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Lucas distributor with vacuum advance.' },
        { service: 'Oil Cooler Lines', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Twin-cam notorious for oil cooler failure. Inspect lines.' },
        { service: 'Timing Chain', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'DOHC timing chain is critical. Replace at signs of stretch.' },
        { service: 'Coolant Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'high', description: 'Runs hot. Green IAT. Keep clean.' },
        { service: 'Differential Oil', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'GL-5 80W-90.' },
        { service: 'Spark Plugs', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Copper core. Gap 0.022". Twin cam demands crisp ignition.' },
      ],
      'mg midget': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: 'A-series (MkI-III) or Triumph 1500. 20W-50 high-zinc.' },
        { service: 'Valve Adjustment', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'A-series pushrods. Hot clearance 0.012".' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Lucas distributor. Gap 0.015".' },
        { service: 'SU Carb Adjustment', intervalMiles: 3000, intervalMonths: 3, severity: 'low', description: 'Tune SU HS2 or HS4 carbs. Damper oil level check.' },
        { service: 'Gearbox Oil', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'GL-4 75W-90. Ribcase or smooth case gearbox.' },
        { service: 'Differential Oil', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'GL-5 80W-90.' },
        { service: 'Coolant Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT. Small rad needs clean coolant.' },
        { service: 'Brake Adjustment', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Drum brakes all around. Adjust each corner.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Copper core. Gap 0.025".' },
        { service: 'Rust Inspection', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'Midgets rust in the sills and floors. Check and treat.' },
      ],
      'mg b': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '1798cc B-series. 20W-50 high-zinc. The classic MG engine.' },
        { service: 'Valve Adjustment', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'B-series pushrods. 0.012" hot. Easy driveway job.' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Lucas 25D. Gap 0.015".' },
        { service: 'SU Carb Tune', intervalMiles: 3000, intervalMonths: 3, severity: 'low', description: 'Twin SU HS4s. Balance with Unisyn. Check dashpot oil.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Cross-ply or radial. Check wire wheel spokes.' },
        { service: 'Gearbox Oil', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'GL-4 75W-90. MGB 4-speed synchro box.' },
        { service: 'Differential Oil', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'GL-5 80W-90. Tube axle.' },
        { service: 'Coolant Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT. B-series prone to overheating in traffic.' },
        { service: 'Brake Fluid Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'DOT 4. Disc front, drum rear.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Copper core NGK BP6ES. Gap 0.025".' },
        { service: 'Clutch Hydraulic Fluid', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'MGB has hydraulic clutch. Check slave cylinder.' },
      ],
      'mg b gt': 'mg.mg b',
      'mg b gt v8': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: 'Rover 3.5L V8. 20W-50. More cylinders, same classic care.' },
        { service: 'Valve Adjustment', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Rover V8 hydraulic lifters. Check preload.' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Lucas distributor. V8 fires hotter.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'V8 torque wears tires fast.' },
        { service: 'Gearbox Oil', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'GL-4 75W-90. LT77 5-speed.' },
        { service: 'Differential Oil', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'GL-5 80W-90.' },
        { service: 'Coolant Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'high', description: 'Green IAT. V8 runs hot in the tight engine bay.' },
        { service: 'Brake Fluid Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'DOT 4. V8 needs upgraded stopping power.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Copper core 8 plugs. Gap 0.035".' },
      ],
      'mg c': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '2912cc C-series straight-6. 20W-50 high-zinc.' },
        { service: 'Valve Adjustment', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Straight-6 pushrods. 0.012" hot.' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Lucas distributor. 6-cylinder version.' },
        { service: 'SU Carb Tune', intervalMiles: 3000, intervalMonths: 3, severity: 'low', description: 'Twin SU HIF6. Balance 3 carbs on straight-6.' },
        { service: 'Gearbox Oil', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'GL-4 75W-90. MGC stronger gearbox.' },
        { service: 'Differential Oil', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'GL-5 80W-90.' },
        { service: 'Coolant Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'high', description: 'Green IAT. Straight-6 needs extra cooling.' },
        { service: 'Brake Fluid Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'DOT 4. Disc all around (unique to MGC).' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Copper core 6 plugs. Gap 0.025".' },
        { service: 'Torsion Bar Check', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'MGC has torsion bar front suspension. Check ride height.' },
      ],
      'mg metro': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '1275cc A-series. 20W-50. Hot hatch from the 80s.' },
        { service: 'Valve Adjustment', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'A-series. 0.012" hot.' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Lucas distributor. Later models may have electronic.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Hydragas suspension. Check ride height.' },
        { service: 'Gearbox Oil', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'GL-4 75W-90.' },
        { service: 'Hydragas Pressure Check', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Hydragas spheres need pressurizing. Unique to Metro.' },
        { service: 'Coolant Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT.' },
        { service: 'Brake Fluid Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'DOT 4. Disc front, drum rear.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Copper core.' },
        { service: 'Rust Check', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'Metro rust-prone in subframes and sills.' },
      ],
      'mg maestro': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '1600/2000cc S-series. 20W-50 high-zinc.' },
        { service: 'Valve Adjustment', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'S-series. Check clearances.' },
        { service: 'Timing Belt', intervalMiles: 40000, intervalMonths: 48, severity: 'high', description: 'S-series belt. Interference engine. Critical.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Front-drive hatch. Check uneven wear.' },
        { service: 'Gearbox Oil', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'GL-4 75W-90. PG1 gearbox.' },
        { service: 'Coolant Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT.' },
        { service: 'Brake Fluid Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'DOT 4.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Copper core.' },
        { service: 'Digital Dash Check', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'Maestro had futuristic LCD dash. Check for dead pixels.' },
      ],
      'mg montego': 'mg.mg maestro',
      'mg rv8': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: 'Rover 3.9L V8. 20W-50 high-zinc. Limited edition.' },
        { service: 'Valve Adjustment', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Rover V8 hydraulic lifters.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Performance tires on factory alloys.' },
        { service: 'Gearbox Oil', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'GL-4 75W-90. LT77 5-speed.' },
        { service: 'Differential Oil', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'GL-5 80W-90.' },
        { service: 'Coolant Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'high', description: 'Green IAT. V8 needs efficient cooling.' },
        { service: 'Brake Fluid Flush', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'DOT 4. Upgraded brakes for V8 power.' },
        { service: 'Soft Top Care', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Convertible roof. Treat and seal.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Copper core 8 plugs. Gap 0.035".' },
      ],
      'mg f': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '1.8L K-series. 20W-50 or 10W-40. Mid-engine roadster.' },
        { service: 'Timing Belt', intervalMiles: 40000, intervalMonths: 48, severity: 'high', description: 'K-series belt. Interference engine. Do not skip.' },
        { service: 'Valve Adjustment', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'K-series shim-over-bucket.' },
        { service: 'Coolant Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'high', description: 'K-series HGF-prone. Keep coolant perfect. Green IAT.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Mid-engine weight distribution. Rotate front to rear.' },
        { service: 'Gearbox Oil', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'GL-4 75W-90. PG1 transaxle.' },
        { service: 'Brake Fluid Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'DOT 4. Mid-engine needs strong brakes.' },
        { service: 'Spark Plugs', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'Iridium or copper. K-series MEMS ignition.' },
        { service: 'Hydragas Check', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Hydragas suspension. Check ride height and pressure.' },
        { service: 'Soft Top Mechanism', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'MGF folding roof. Check cables and tension.' },
      ]
    }
  },


  // --- Polaris (powersports: RZR, General, Sportsman, ACE — hours-based) ---
  polaris: {
    specs: { oil: { viscosity: '5W-50', type: 'Polaris PS-4 Full Synthetic', capacity: '2.0 qt' }, transmission: { type: 'Polaris AGL / Demand Drive' }, coolant: { type: 'Polaris 50/50 Extended Life' }, brakeFluid: { type: 'DOT 4' }, sparkPlugs: { type: 'NGK Iridium', gap: '0.032 in' }, battery: { groupSize: 'Group 14 (AGM)' }, tirePressure: { psi: 10 }, frontDiff: { type: 'Polaris Demand Drive Fluid' }, rearDiff: { type: 'Polaris ATV Angle Drive Fluid' }, airFilter: { type: 'Polaris OEM paper element' } },
    models: {
      rzr: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 50 hours or 6 months. Polaris PS-4 5W-50 full synthetic. ProStar engine.' },
        { service: 'Front Differential Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Polaris Demand Drive fluid.' },
        { service: 'Rear Differential Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Polaris ATV Angle Drive fluid.' },
        { service: 'Engine Air Filter', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours. Clean and inspect. Replace as needed. More often in dusty conditions.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. NGK Iridium plugs for reliable starting.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. DOT 4. Off-road braking generates heat.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'high', description: 'Every 2 years. Polaris 50/50 extended life coolant.' },
        { service: 'Transmission Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Every 100 hours or annually. Polaris AGL gearcase lubricant.' },
        { service: 'CVT Belt Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Every 50 hours or 6 months. Check PVT belt for wear, cracking, or glazing.' },
        { service: 'Suspension & Chassis Lube', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Every 50 hours. Grease all zerks and check A-arm bushings.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Every 50 hours. Full inspection: CV boots, tie rods, brakes, skid plates.' },
      ],
      'rzr turbo': 'polaris.rzr', 'rzr xp': 'polaris.rzr', 'rzr pro': 'polaris.rzr', 'rzr trail': 'polaris.rzr', 'rzr 570': 'polaris.rzr', 'rzr 900': 'polaris.rzr', 'rzr 1000': 'polaris.rzr',
      general: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 50 hours or 6 months. Polaris PS-4 5W-50. General-purpose UTV.' },
        { service: 'Front Differential Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Polaris Demand Drive.' },
        { service: 'Rear Differential Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Angle Drive fluid.' },
        { service: 'Engine Air Filter', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours. Clean and inspect. Dusty work demands clean filters.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. NGK Iridium.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. DOT 4.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'high', description: 'Every 2 years. Polaris 50/50 coolant.' },
        { service: 'Transmission Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Every 100 hours or annually. Polaris AGL.' },
        { service: 'CVT Belt Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Every 50 hours. Check PVT belt condition.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Every 50 hours. Full chassis and drivetrain check.' },
      ],
      'general xp': 'polaris.general', 'general 1000': 'polaris.general',
      sportsman: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 50 hours or 6 months. Polaris PS-4 5W-50 full synthetic.' },
        { service: 'Front Differential Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Polaris Demand Drive (4x4 models).' },
        { service: 'Rear Differential Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Polaris ATV Angle Drive fluid.' },
        { service: 'Engine Air Filter', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours. Clean foam filter and re-oil. Replace paper filter yearly.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. NGK Iridium plugs.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. DOT 4. Hand and foot brake circuits.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'high', description: 'Every 2 years. Polaris 50/50 coolant. Liquid-cooled engines only.' },
        { service: 'Transmission Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Every 100 hours or annually. Polaris AGL gearcase fluid.' },
        { service: 'CVT Belt Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Every 50 hours. Check CVT belt and clutch operation.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Every 50 hours. Check tie rods, ball joints, A-arm bushings, and skid plates.' },
      ],
      'sportsman 450': 'polaris.sportsman', 'sportsman 570': 'polaris.sportsman', 'sportsman 850': 'polaris.sportsman', 'sportsman 1000': 'polaris.sportsman', 'sportsman xp': 'polaris.sportsman', 'sportsman touring': 'polaris.sportsman', scrambler: 'polaris.sportsman',
      ace: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 50 hours or 6 months. Polaris PS-4 5W-50. Single-seat sport machine.' },
        { service: 'Engine Air Filter', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours. Clean and inspect. Tight engine bay needs clean air.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. NGK Iridium.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. DOT 4.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'high', description: 'Every 2 years. Polaris 50/50 coolant.' },
        { service: 'Transmission Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Every 100 hours or annually. Polaris AGL.' },
        { service: 'CVT Belt Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Every 50 hours. Check belt and clutch faces.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Every 50 hours. Check suspension, steering, and skid plates.' },
      ],
      'ace 570': 'polaris.ace', 'ace 900': 'polaris.ace',
      ranger: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 50 hours or 6 months. Polaris PS-4 5W-50. Hard-working utility UTV.' },
        { service: 'Front Differential Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Polaris Demand Drive fluid.' },
        { service: 'Rear Differential Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Polaris Angle Drive fluid.' },
        { service: 'Engine Air Filter', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours. Farm and trail dust clogs filters fast.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. NGK Iridium plugs.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. DOT 4.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'high', description: 'Every 2 years. Polaris 50/50 coolant.' },
        { service: 'Transmission Fluid', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Every 100 hours or annually. Polaris AGL.' },
        { service: 'CVT Belt Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'Every 50 hours. Check PVT belt. Heavy loads stress the belt.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Every 50 hours. Full chassis, suspension, and drivetrain check.' },
      ],
      'ranger 570': 'polaris.ranger', 'ranger 900': 'polaris.ranger', 'ranger 1000': 'polaris.ranger', 'ranger xp': 'polaris.ranger', 'ranger crew': 'polaris.ranger'
    }
  },
  // --- Pontiac (GM corporate — rebadged Chevrolet/Buick vehicles, 1926–2010) ---
  pontiac: {
    specs: { oil: { viscosity: '5W-30', type: 'Dexos Full Synthetic', capacity: '5.0 qt' }, transmission: { type: 'Dexron VI', capacity: '4.0 qt' }, coolant: { type: 'Dex-Cool Orange' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 34 }, sparkPlugs: { type: 'Iridium', gap: '0.040 in' }, battery: { groupSize: 'Group 48' } },
    models: {
      'grand prix': 'chevrolet.silverado',
      g6: 'chevrolet.silverado',
      bonneville: 'chevrolet.silverado',
      'grand am': 'chevrolet.silverado',
      sunfire: 'chevrolet.silverado',
      montana: 'chevrolet.silverado',
      torrent: 'chevrolet.silverado',
      solstice: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: '2.4L Ecotec or 2.0L turbo. Dexos 5W-30 full synthetic.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'RWD sports car. Staggered fitment — rotation limited.' },
        { service: 'Engine Air Filter', intervalMiles: 22500, intervalMonths: 24, severity: 'low', description: 'Ecotec engine needs clean air for turbo spool.' },
        { service: 'Brake Fluid Flush', intervalMiles: 45000, intervalMonths: 36, severity: 'medium', description: 'DOT 3. Sports car braking demands fresh fluid.' },
        { service: 'Spark Plugs', intervalMiles: 97500, intervalMonths: 96, severity: 'medium', description: 'Iridium plugs. Turbo engines prefer 60k intervals.' },
        { service: 'Differential Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: 'RWD differential. GL-5 75W-90 synthetic gear oil.' },
      ],
      'solstice gxp': 'pontiac.solstice',
      g8: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: '3.6L V6 or 6.0L V8 (GT/GXP). Dexos 5W-30. Holden engineering.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'RWD sedan. Rotate for even wear on performance tires.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'V8 needs clean air for LS power.' },
        { service: 'Transmission Fluid', intervalMiles: 45000, intervalMonths: 48, severity: 'high', description: '6L80 automatic (V8) or 5L40 (V6). Dexron VI.' },
        { service: 'Brake Fluid Flush', intervalMiles: 45000, intervalMonths: 36, severity: 'medium', description: 'DOT 3. Brembo brakes on GXP need fresh fluid.' },
        { service: 'Differential Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: 'RWD limited-slip diff. GL-5 75W-90 synthetic.' },
        { service: 'Spark Plugs', intervalMiles: 97500, intervalMonths: 96, severity: 'medium', description: 'Iridium plugs for GM LS or LY7 V6.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 60, severity: 'high', description: 'Dex-Cool. Holden-spec cooling system.' },
      ],
      'g8 gt': 'pontiac.g8', 'g8 gxp': 'pontiac.g8',
      vibe: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Toyota 1ZZ-FE 1.8L engine. 5W-30. Toyota engineering in Pontiac body.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Front-wheel drive. Rotate for even wear.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Filters the air you breathe.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Toyota 1ZZ-FE engine air filter.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'DOT 3. Toyota brakes with Pontiac badge.' },
        { service: 'Spark Plugs', intervalMiles: 120000, intervalMonths: 144, severity: 'medium', description: 'Iridium plugs. Long-life Toyota spec.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 120, severity: 'high', description: 'Toyota Super Long Life Coolant or Dex-Cool (2009+).' },
      ],
      'vibe gt': 'pontiac.vibe',
      firebird: [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: 'V6 or V8 (LS1 on 1998–2002). 5W-30 conventional/synthetic. Period-correct: 3k intervals for pre-2000 models.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'RWD muscle car. Rotate if non-staggered.' },
        { service: 'Engine Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Keep the V8 breathing strong.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: '4L60E automatic or T-56 manual. Dexron III/Mercon (auto), ATF (manual).' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'DOT 3. Disc/drum or 4-wheel disc on later models.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'RWD differential. GL-5 80W-90. Limited-slip additive if equipped.' },
        { service: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'Copper plugs on older models (30k). Iridium on LS1 (100k).' },
        { service: 'Coolant Exchange', intervalMiles: 50000, intervalMonths: 48, severity: 'high', description: 'Green IAT (pre-1996) or Dex-Cool (1996+). Period-correct antifreeze.' },
      ],
      'firebird trans am': 'pontiac.firebird', 'firebird formula': 'pontiac.firebird',
    }
  },
  // --- Plymouth (Chrysler/Mopar corporate, mostly pre-2001 vehicles) ---
  plymouth: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic / 10W-30 Conventional (pre-1990)', capacity: '5.0 qt' }, transmission: { type: 'ATF+4 / Dexron III (older)', capacity: '4.0 qt' }, coolant: { type: 'Mopar OAT / Green IAT (pre-2000)' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 32 }, sparkPlugs: { type: 'Iridium / Copper (period-correct)', gap: '0.040 in' }, battery: { groupSize: 'Group 34' } },
    models: {
      voyager: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Chrysler minivan. 3.3L/3.8L V6. Period recommendation: 5W-30 every 5k miles.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Minivan tires need even wear for family safety.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Keep the cabin air fresh for passengers.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Chrysler V6 needs clean intake air.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: '41TE/A604 automatic. ATF+4. Chrysler transmissions need regular service.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'DOT 3. Family hauler needs safe brakes.' },
        { service: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'Copper plugs for 1990s Chryslers. Replace at 30k.' },
        { service: 'Coolant Exchange', intervalMiles: 50000, intervalMonths: 48, severity: 'high', description: 'Green IAT (pre-2000) or Mopar HOAT (later). Flush every 50k/4 years.' },
      ],
      'grand voyager': 'plymouth.voyager',
      breeze: 'plymouth.voyager',
      neon: [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '2.0L SOHC/DOHC. 5W-30. Period-correct: frequent changes for 90s engines.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Compact car rotation.' },
        { service: 'Engine Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: '2.0L Chrysler engine air filter.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: '31TH 3-speed auto or NV-T350 5-speed manual. ATF+4 (auto), 75W-90 (manual).' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'DOT 3. Disc/drum setup.' },
        { service: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'Copper Champion RC9YC. Replace every 30k.' },
        { service: 'Timing Belt', intervalMiles: 105000, intervalMonths: 84, severity: 'high', description: '2.0L DOHC: replace timing belt. Interference engine — do NOT skip.' },
        { service: 'Coolant Exchange', intervalMiles: 50000, intervalMonths: 48, severity: 'high', description: 'Green IAT. Old coolant corrodes Chrysler radiators.' },
      ],
      'road runner': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '383/440/426 HEMI V8. 10W-40 or 20W-50 high-zinc for flat-tappet cams. Classic muscle discipline.' },
        { service: 'Valve Adjustment', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Mechanical lifters on HEMI. Hydraulic on standard V8s — check preload.' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Chrysler electronic ignition (1972+) or points (pre-1972).' },
        { service: 'Engine Air Filter', intervalMiles: 12000, intervalMonths: 12, severity: 'low', description: 'Air Grabber hood needs clean filter.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'TorqueFlite 727 3-speed auto or A-833 4-speed manual. Dexron III (auto), GL-4 80W-90 (manual).' },
        { service: 'Brake Fluid Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'DOT 3. Drum brakes all around or disc/drum. 1960s brakes need regular attention.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: '8-3/4" or Dana 60 rear axle. GL-5 80W-90. Sure-Grip limited slip needs additive.' },
        { service: 'Coolant Exchange', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT. Big blocks run hot. Clean coolant is essential.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Copper core. Gap 0.035". Replace at tune-up for crisp ignition.' },
        { service: 'Chassis Lube', intervalMiles: 3000, intervalMonths: 3, severity: 'low', description: 'Grease all suspension zerks. Classic Mopars need regular chassis lube.' },
      ],
      barracuda: 'plymouth.road runner',
      cuda: 'plymouth.road runner',
      superbird: 'plymouth.road runner',
      gtx: 'plymouth.road runner',
      duster: 'plymouth.road runner',
      valiant: [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: 'Slant-6 or 273/318 V8. 10W-30 high-zinc. Legendary Slant-6 durability.' },
        { service: 'Valve Adjustment', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Mechanical lifters on Slant-6. Adjust hot: intake 0.010", exhaust 0.020".' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Chrysler points distributor. Gap 0.017".' },
        { service: 'Engine Air Filter', intervalMiles: 12000, intervalMonths: 12, severity: 'low', description: 'Slant-6 air filter.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'TorqueFlite 904 or A-903 3-speed manual. Dexron III (auto), GL-4 (manual).' },
        { service: 'Brake Fluid Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'DOT 3. 9" drum brakes all around on early models.' },
        { service: 'Coolant Exchange', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT. Slant-6 cooling system.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Champion N12Y copper. Gap 0.035".' },
        { service: 'Chassis Lube', intervalMiles: 3000, intervalMonths: 3, severity: 'low', description: 'Grease steering linkage, ball joints, and U-joints.' },
      ],
      reliant: 'plymouth.valiant',
      horizon: 'plymouth.valiant',
      prowler: [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 6, severity: 'medium', description: '3.5L SOHC V6 (Chrysler EGG). 5W-30 full synthetic. Aluminum block.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Staggered fitment — limited rotation. Check tire pressures.' },
        { service: 'Engine Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Keep the 3.5L breathing clean.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: '42LE 4-speed AutoStick transaxle (rear-mounted). ATF+4.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'DOT 3. Four-wheel disc with performance pads.' },
        { service: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'Copper plugs. Chrysler V6 ignition.' },
        { service: 'Coolant Exchange', intervalMiles: 50000, intervalMonths: 48, severity: 'high', description: 'Mopar HOAT. Aluminum engine needs corrosion protection.' },
        { service: 'Suspension Inspection', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Prowler has unique aluminum suspension. Check for cracks annually.' },
      ],
    }
  },
  // --- Oldsmobile (GM corporate, 1897–2004) ---
  oldsmobile: {
    specs: { oil: { viscosity: '5W-30', type: 'Dexos Full Synthetic', capacity: '5.0 qt' }, transmission: { type: 'Dexron VI', capacity: '4.0 qt' }, coolant: { type: 'Dex-Cool Orange' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 34 }, sparkPlugs: { type: 'Iridium', gap: '0.040 in' }, battery: { groupSize: 'Group 48' } },
    models: {
      alero: 'chevrolet.silverado',
      intrigue: 'chevrolet.silverado',
      silhouette: 'chevrolet.silverado',
      aurora: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: '4.0L Aurora V8 or 3.5L Shortstar V6. Dexos 5W-30. DOHC luxury engine.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Premium sedan tire rotation.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Luxury cabin air quality.' },
        { service: 'Engine Air Filter', intervalMiles: 22500, intervalMonths: 24, severity: 'low', description: 'Aurora V8 needs clean breathing.' },
        { service: 'Transmission Fluid', intervalMiles: 45000, intervalMonths: 48, severity: 'high', description: '4T80-E heavy-duty transaxle. Dexron VI. Oldsmobile flagship.' },
        { service: 'Brake Fluid Flush', intervalMiles: 45000, intervalMonths: 36, severity: 'medium', description: 'DOT 3. Four-wheel disc with ABS.' },
        { service: 'Spark Plugs', intervalMiles: 97500, intervalMonths: 96, severity: 'medium', description: 'Iridium plugs. DOHC engine spark plug access is tight.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 60, severity: 'high', description: 'Dex-Cool. Northstar-derived V8 is sensitive to cooling neglect.' },
      ],
      bravada: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: '4.2L Atlas I6. Dexos 5W-30. GMT360 platform flagship.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'AWD SUV rotation.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Atlas I6 needs clean air for smooth power.' },
        { service: 'Transmission Fluid', intervalMiles: 45000, intervalMonths: 48, severity: 'high', description: '4L60E automatic. Dexron VI. AWD demands fresh fluid.' },
        { service: 'Transfer Case Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: 'SmartTrak AWD transfer case. Auto-Trak II fluid.' },
        { service: 'Brake Fluid Flush', intervalMiles: 45000, intervalMonths: 36, severity: 'medium', description: 'DOT 3. SUV braking with trailer tow package.' },
        { service: 'Spark Plugs', intervalMiles: 97500, intervalMonths: 96, severity: 'medium', description: 'Iridium plugs for Atlas I6.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 60, severity: 'high', description: 'Dex-Cool. Atlas I6 engine.' },
      ],
      cutlass: [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: 'Cutlass spans decades. 1970s: Rocket V8 10W-40 high-zinc. 1990s: 3.1L V6 5W-30. Adjust by era.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Keep tires wearing evenly.' },
        { service: 'Engine Air Filter', intervalMiles: 12000, intervalMonths: 12, severity: 'low', description: 'Replace based on era: 12k for classic, 30k for modern.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'TH350/TH400 (classic) or 4T60-E (modern). Dexron III/VI by era.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'DOT 3. Front disc/rear drum on most years.' },
        { service: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'Copper for classic (30k), Iridium for 1990s+ (100k).' },
        { service: 'Coolant Exchange', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT (classic) or Dex-Cool (1996+). Flush based on era.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'RWD models (classic). GL-5 80W-90.' },
      ],
      'cutlass supreme': 'oldsmobile.cutlass', 'cutlass ciera': 'oldsmobile.cutlass',
      '442': 'oldsmobile.cutlass',
      'delta 88': 'oldsmobile.cutlass',
      88: 'oldsmobile.cutlass',
      98: 'oldsmobile.cutlass',
      toronado: 'oldsmobile.cutlass',
    }
  },
  // --- AMC (American Motors Corporation, 1954–1987 — absorbed by Chrysler) ---
  amc: {
    specs: { oil: { viscosity: '10W-30', type: 'Conventional High-Zinc (flat-tappet cams)', capacity: '5.0 qt' }, transmission: { type: 'Dexron III (auto) / GL-4 80W-90 (manual)', capacity: '4.0 qt' }, coolant: { type: 'Green IAT Coolant', capacity: '2.5 gal' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 30 }, sparkPlugs: { type: 'Copper Core', gap: '0.035 in' }, battery: { groupSize: 'Group 24F' } },
    models: {
      eagle: [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '258ci I6 or 4.2L. 10W-30 high-zinc. AMC inline-6 is legendary. Period-correct 3k changes.' },
        { service: 'Valve Adjustment', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'AMC I6 hydraulic lifters. Check lifter preload every 12k.' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Motorcraft or Prestolite electronic ignition (1978+). Pre-1978: points gap 0.016".' },
        { service: 'Engine Air Filter', intervalMiles: 12000, intervalMonths: 12, severity: 'low', description: 'AMC 258ci air filter. Clean regularly in dusty conditions.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'TorqueFlite 998/727 auto or T-4/T-5 manual. Dexron III (auto), GL-4 80W-90 (manual).' },
        { service: 'Transfer Case Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'NP129 "Select-Drive" or NP119 full-time 4WD. Dexron III ATF for transfer case.' },
        { service: 'Front Differential Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'Dana 30 IFS. GL-5 80W-90.' },
        { service: 'Rear Differential Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'AMC Model 35 or Dana 35 rear axle. GL-5 80W-90.' },
        { service: 'Brake Fluid Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'DOT 3. Front disc/rear drum. AMC brake parts are getting rare.' },
        { service: 'Coolant Exchange', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT. I6 engine with cast iron block and head. Corrosion protection is critical.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Champion RFN14LY copper. Gap 0.035". Replace at annual tune-up.' },
        { service: 'Chassis Lube', intervalMiles: 3000, intervalMonths: 3, severity: 'low', description: 'Grease all zerks. Eagle had unique front suspension with CV joints.' },
        { service: 'Vacuum System Check', intervalMiles: 0, intervalMonths: 6, severity: 'medium', description: 'AMC Eagle uses vacuum-operated 4WD and HVAC. Check lines and actuators.' },
      ],
      'eagle sx/4': 'amc.eagle', 'eagle wagon': 'amc.eagle',
      concord: 'amc.eagle',
      spirit: 'amc.eagle',
      hornet: [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '232ci/258ci I6 or 304ci V8. 10W-30 high-zinc. AMC engineering.' },
        { service: 'Valve Adjustment', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'AMC I6 hydraulic / V8 hydraulic. Check preload.' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Prestolite points distributor (1970–1974). Electronic ignition 1975+. Gap 0.016".' },
        { service: 'Engine Air Filter', intervalMiles: 12000, intervalMonths: 12, severity: 'low', description: 'Round air cleaner housing. Replace annually.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'TorqueFlite 904/727 or Borg-Warner auto. Dexron III (auto). GL-4 (manual).' },
        { service: 'Brake Fluid Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'DOT 3. Drum brakes all around on base — disc front on later models.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'AMC Model 20 or 15 rear axle. GL-5 80W-90.' },
        { service: 'Coolant Exchange', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT. Cast iron block.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Champion copper. Gap 0.035".' },
        { service: 'Chassis Lube', intervalMiles: 3000, intervalMonths: 3, severity: 'low', description: 'Lube all suspension and steering joints.' },
      ],
      gremlin: 'amc.hornet',
      pacer: [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '232ci/258ci I6. 10W-30 high-zinc. The "flying fishbowl" engine.' },
        { service: 'Valve Adjustment', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'AMC I6 hydraulic lifters.' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Prestolite electronic ignition (standard from 1975).' },
        { service: 'Engine Air Filter', intervalMiles: 12000, intervalMonths: 12, severity: 'low', description: 'Tight engine bay — check filter access.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'TorqueFlite 998 auto or T-150 3-speed manual. Dexron (auto), GL-4 (manual).' },
        { service: 'Brake Fluid Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'DOT 3. Front disc/rear drum.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'AMC Model 15 rear axle (no V8 option on Pacer). GL-5 80W-90.' },
        { service: 'Coolant Exchange', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Champion copper. Gap 0.035".' },
        { service: 'Door Hinge Check', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'Pacer has a famously heavy passenger door. Check hinges annually.' },
      ],
      javelin: [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '290/304/343/360/390/401ci V8 or 232/258ci I6. 10W-40 or 20W-50 high-zinc for flat-tappet cams.' },
        { service: 'Valve Adjustment', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Hydraulic lifters on most AMC V8s. Solid on 390/401 — adjust hot: 0.012" intake, 0.018" exhaust.' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Prestolite dual-point (performance) or Motorcraft electronic. Gap per distributor spec.' },
        { service: 'Engine Air Filter', intervalMiles: 6000, intervalMonths: 6, severity: 'low', description: 'Performance air cleaner. Ram Air on AMX.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'TorqueFlite 727 auto or Borg-Warner T-10 4-speed manual. Dexron III (auto), GL-4 80W-90 (manual).' },
        { service: 'Brake Fluid Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'DOT 3. Disc front/drum rear on most V8 models. AMX got 4-piston front discs.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'AMC Model 20 with Twin-Grip limited-slip option. GL-5 80W-90 + friction modifier if LS.' },
        { service: 'Coolant Exchange', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT. Big AMC V8s need cooling system health.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Champion copper. V8 gap 0.035". Performance models may prefer Autolite.' },
        { service: 'Chassis Lube', intervalMiles: 3000, intervalMonths: 3, severity: 'low', description: 'Grease front suspension, U-joints, and steering linkage.' },
      ],
      amx: 'amc.javelin',
      matador: [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '258ci I6, 304/360ci V8. 10W-30 high-zinc. AMC full-size car.' },
        { service: 'Valve Adjustment', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Hydraulic lifters on I6 and V8.' },
        { service: 'Points & Condenser', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Prestolite electronic ignition.' },
        { service: 'Engine Air Filter', intervalMiles: 12000, intervalMonths: 12, severity: 'low', description: 'Full-size air filter element.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'TorqueFlite 727 or 998. Dexron III.' },
        { service: 'Brake Fluid Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'DOT 3. Front disc/rear drum.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'AMC Model 20 rear axle. GL-5 80W-90.' },
        { service: 'Coolant Exchange', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Champion copper. Gap 0.035".' },
        { service: 'Chassis Lube', intervalMiles: 3000, intervalMonths: 3, severity: 'low', description: 'Full-size sedan chassis lube.' },
      ],
      ambassador: 'amc.matador',
      'cj-7': [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '258ci I6 or 304ci V8. 10W-30 high-zinc. AMC-era Jeep. Legendary off-road.' },
        { service: 'Valve Adjustment', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'AMC I6 hydraulic lifters. Check preload.' },
        { service: 'Engine Air Filter', intervalMiles: 6000, intervalMonths: 6, severity: 'medium', description: 'Off-road dust means frequent air filter checks. Clean or replace.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'T-176 4-speed manual or TorqueFlite 999 auto. GL-4 (manual), Dexron III (auto).' },
        { service: 'Transfer Case Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'Dana 300 transfer case. GL-5 80W-90 or ATF depending on year. Check spec.' },
        { service: 'Front Differential Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'Dana 30 front axle. GL-5 80W-90.' },
        { service: 'Rear Differential Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'AMC Model 20 or Dana 44 rear axle. GL-5 80W-90.' },
        { service: 'Brake Fluid Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'DOT 3. Front disc/rear drum.' },
        { service: 'Coolant Exchange', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT. AMC I6 cooling is vital for trail reliability.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Champion copper. Gap 0.035".' },
        { service: 'Chassis & U-Joint Lube', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: 'Grease all U-joints, steering linkage, and driveshaft slip yokes.' },
      ],
      'cj-5': 'amc.cj-7', 'cj-8 scrambler': 'amc.cj-7',
      wagoneer: [
        { service: 'Oil & Filter Change', intervalMiles: 3000, intervalMonths: 3, severity: 'medium', description: '360ci/401ci V8 or 258ci I6. 10W-30 high-zinc. The original luxury SUV.' },
        { service: 'Valve Adjustment', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'AMC V8 hydraulic lifters.' },
        { service: 'Engine Air Filter', intervalMiles: 12000, intervalMonths: 12, severity: 'low', description: 'Full-size SUV air filter.' },
        { service: 'Transmission Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'TorqueFlite 727 or 999 auto. Dexron III.' },
        { service: 'Transfer Case Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'high', description: 'NP208 or NP228/229 (Selec-Trac). ATF for chain-driven cases.' },
        { service: 'Front Differential Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'Dana 44 front axle. GL-5 80W-90.' },
        { service: 'Rear Differential Fluid', intervalMiles: 30000, intervalMonths: 24, severity: 'medium', description: 'AMC Model 20 or Dana 44 rear. GL-5 80W-90.' },
        { service: 'Brake Fluid Flush', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'DOT 3. Front disc/rear drum.' },
        { service: 'Coolant Exchange', intervalMiles: 24000, intervalMonths: 24, severity: 'high', description: 'Green IAT. Big V8 in a big SUV.' },
        { service: 'Spark Plugs', intervalMiles: 12000, intervalMonths: 12, severity: 'medium', description: 'Champion copper. Gap 0.035".' },
        { service: 'Chassis Lube', intervalMiles: 3000, intervalMonths: 3, severity: 'low', description: 'Full-size SUV needs all zerks greased. Steering, driveshafts, U-joints.' },
        { service: 'Rust Inspection', intervalMiles: 0, intervalMonths: 12, severity: 'low', description: 'Wagoneer rusts in floors, rockers, and rear quarters. Annual check.' },
      ],
      'grand wagoneer': 'amc.wagoneer',
      'cherokee xj': 'amc.wagoneer',
    }
  },
  // --- Yanmar Ag (agricultural tractors and equipment — separate from Yanmar marine) ---
  'yanmar-ag': {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CJ-4', capacity: '1.5 gal' }, transmission: { type: 'Yanmar TF500A Hydraulic/Transmission Fluid' }, coolant: { type: 'Yanmar Long Life Coolant' },
      fuelFilters: { type: 'Yanmar original' }, oilFilters: { type: 'Yanmar original' },
      airFilter: { type: 'Yanmar heavy-duty dry' }, hydraulicFilter: { type: 'Yanmar HST/hydraulic filter' },
      battery: { groupSize: 'Group 27' }, tirePressure: { psi: '22 (rear) / 30 (front)' } },
    models: {
      'yt235': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Yanmar 3-cylinder diesel engine. CJ-4 15W-40 diesel oil.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace Yanmar fuel filter and water separator. Diesel fuel cleanliness is critical.' },
        { service: 'Hydraulic/Transmission Fluid', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Yanmar TF500A hydraulic fluid. Shared sump for transmission and hydraulics.' },
        { service: 'Hydraulic Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace Yanmar hydraulic/HST filter with fluid change.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours. Yanmar Long Life Coolant. Protects diesel engine.' },
        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 400 hours or when air restriction indicator shows. Clean pre-cleaner regularly.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months. Diesel cold starts need strong battery.' },
        { service: 'Tire Pressure Check', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Check before each use. 22 PSI rear, 30 PSI front (typical for ag tires).' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Full inspection: belts, hoses, controls, PTO, 3-point hitch.' },
      ],
      'yt347': 'yanmar-ag.yt235', 'yt359': 'yanmar-ag.yt235',
      'sa325': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Yanmar 3-cylinder diesel. CJ-4 15W-40.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace fuel filter and water separator.' },
        { service: 'Hydraulic/Transmission Fluid', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Yanmar TF500A hydraulic fluid for hydrostatic transmission.' },
        { service: 'Hydraulic Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace HST filter with fluid change.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1500 hours. Yanmar Long Life Coolant.' },
        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 400 hours. Clean pre-cleaner every 100 hours in dusty conditions.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Sub-compact battery maintenance.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Check belts, hoses, mower deck (if equipped), and safety switches.' },
      ],
      'sa425': 'yanmar-ag.sa325',
      'ym2000': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Yanmar 2-cylinder diesel. 15W-40 CJ-4. Classic Yanmar reliability.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours. Replace fuel filter. Older diesels need clean fuel.' },
        { service: 'Hydraulic/Transmission Fluid', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Yanmar hydraulic fluid or JD 303 equivalent for gear-drive models.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. Green IAT coolant for older engines.' },
        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 300 hours. Clean oil-bath or replace dry element.' },
        { service: 'Valve Adjustment', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours. Check intake and exhaust valve clearance.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Older tractors may need battery tender during storage.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check belts, hoses, radiator screen, and PTO clutch.' },
      ],
      'ym1500': 'yanmar-ag.ym2000', 'ym2500': 'yanmar-ag.ym2000', 'ym3000': 'yanmar-ag.ym2000',
      'ym336': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Yanmar 4-cylinder diesel. CJ-4 15W-40.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace Yanmar fuel filter and water separator.' },
        { service: 'Hydraulic/Transmission Fluid', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Yanmar TF500A fluid for hydrostatic transmission.' },
        { service: 'Hydraulic Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace HST filter with fluid change.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours. Yanmar Long Life Coolant.' },
        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 400 hours. Clean pre-cleaner frequently.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check battery condition every 6 months.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Full inspection.' },
      ],
      'ym342': 'yanmar-ag.ym336', 'ym347': 'yanmar-ag.ym336', 'ym359': 'yanmar-ag.ym336',
    }
  },

  default: {
    specs: { oil: { viscosity: '5W-30', type: 'Conventional/Synthetic Blend', capacity: '5.0 qt' }, transmission: { type: "Check owner's manual" }, coolant: { type: 'Universal OAT' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 34 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 35' } },
    services: [
      { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'The gold standard for any engine.' },
      { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Prevents premature tire replacement.' },
      { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Fresh air for you.' },
      { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'More power with clean filter.' },
      { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Essential safety maintenance.' },
      { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 60, severity: 'high', description: 'Temperature regulation.' },
      { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 84, severity: 'medium', description: "Modern plugs don't last forever." },
    ]
  }
};

export function getSpecsForVehicle(make, model) {
  if (!make) return MAINTENANCE_SCHEDULES.default.specs;
  const m = make.toLowerCase().trim().replace(/\s+/g, '-');
  const mo = model?.toLowerCase().trim();
  const d = MAINTENANCE_SCHEDULES[m];
  if (d?.specs) return d.specs;
  if (d?.models && mo) {
    const ref = d.models[mo];
    if (typeof ref === 'string' && ref.includes('.')) {
      const [rm] = ref.split('.');
      if (MAINTENANCE_SCHEDULES[rm]?.specs) return MAINTENANCE_SCHEDULES[rm].specs;
    }
  }
  return MAINTENANCE_SCHEDULES.default.specs;
}

export function getScheduleForVehicle(make, model) {
  if (!make) return MAINTENANCE_SCHEDULES.default.services || MAINTENANCE_SCHEDULES.default;
  const m = make.toLowerCase().trim().replace(/\s+/g, '-');
  const mo = model?.toLowerCase().trim();
  const d = MAINTENANCE_SCHEDULES[m];
  if (!d) return MAINTENANCE_SCHEDULES.default.services || MAINTENANCE_SCHEDULES.default;
  let ms = d.models[mo];
  if (typeof ms === 'string') {
    if (ms.includes('.')) { const [rm, rmo] = ms.split('.'); return MAINTENANCE_SCHEDULES[rm].models[rmo]; }
    return d.models[ms];
  }
  return ms || MAINTENANCE_SCHEDULES.default.services || MAINTENANCE_SCHEDULES.default;
}

export function isEV(make, model) {
  if (!make) return false;
  const m = make.toLowerCase().trim().replace(/\s+/g, '-');
  const mo = model?.toLowerCase().trim();
  const evMakes = ['tesla', 'rivian', 'lucid', 'polestar'];
  const evModels = [
  'id.4', 'id.3', 'ev6', 'ev9', 'ioniq 5', 'ioniq 6',
  'mustang mach-e', 'f-150 lightning', 'bolt', 'bolt euv', 'leaf',
  'blazer ev', 'equinox ev', 'silverado ev', 'hummer ev',
  'lyriq', 'celestiq',
  'i4', 'i5', 'ix', 'i7',
  'eqs', 'eqe', 'eqb',
  'id.buzz',
  'ex30', 'ex90', 'xc40 recharge', 'c40 recharge',
  'ariya', 'bz4x', 'solterra',
  'gv60', 'electrified g80', 'electrified gv70',
  'prologue', 'zdx', 'mx-30'
];
  if (evMakes.includes(m)) return true;
  if (evModels.includes(mo)) return true;
  return MAINTENANCE_SCHEDULES[m]?.specs?.oil?.isEV === true;
}