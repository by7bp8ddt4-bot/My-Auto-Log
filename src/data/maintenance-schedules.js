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
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Fresh oil keeps your engine internals slippery and cool.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Moving tires around helps them wear evenly.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Filters the air you breathe inside the car.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Keeps dust out so the engine can breathe easy.' },
        { service: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Brake fluid absorbs water — fresh fluid keeps brakes crisp.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 120, severity: 'high', description: 'Coolant prevents your engine from overheating.' },
        { service: 'Spark Plugs', intervalMiles: 120000, intervalMonths: 144, severity: 'medium', description: 'Fresh plugs help your car start fast and run smooth.' },
      ],
      corolla: 'camry', rav4: 'camry',
      tacoma: [
        { service: 'Oil & Filter Change', intervalMiles: 5000, intervalMonths: 6, severity: 'medium', description: 'Trucks work hard. Fresh oil prevents wear.' },
        { service: 'Tire Rotation', intervalMiles: 5000, intervalMonths: 6, severity: 'low', description: 'Even wear is crucial for truck tires.' },
        { service: 'Differential Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'medium', description: 'Fresh fluid prevents gears from grinding.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Keeps the trail dust out of your lungs.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 36, severity: 'low', description: 'Clean air means better fuel economy for your truck.' },
        { service: 'Spark Plugs', intervalMiles: 120000, intervalMonths: 144, severity: 'medium', description: 'Ensures reliable ignition even in tough conditions.' },
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
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 84, severity: 'medium', description: 'Keeps your engine efficient and responsive.' },
      ],
      accord: 'civic', 'cr-v': 'civic', pilot: 'civic'
    }
  },
  ford: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'Mercon LV', capacity: '4.0 qt' }, coolant: { type: 'Motorcraft Orange' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 36 }, sparkPlugs: { type: 'Iridium', gap: '0.049 in' }, battery: { groupSize: 'Group 65' } },
    models: {
      'f-150': [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 6, severity: 'medium', description: 'Heavy duty use requires regular oil changes.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 6, severity: 'low', description: 'Keeps your truck stable.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Maintains power and fuel efficiency.' },
        { service: 'Transmission Fluid', intervalMiles: 150000, intervalMonths: 120, severity: 'high', description: 'Modern Ford transmissions have long intervals.' },
        { service: 'Coolant Exchange', intervalMiles: 100000, intervalMonths: 72, severity: 'high', description: 'Protects against overheating.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 72, severity: 'medium', description: 'Prevents misfires.' },
      ],
      escape: 'f-150', explorer: 'f-150', mustang: 'f-150'
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
      equinox: 'silverado', malibu: 'silverado'
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
        { service: 'Vehicle Check', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Comprehensive health check.' },
      ],
      '5 series': '3 series', x3: '3 series', x5: '3 series'
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
  hyundai: {
    specs: { oil: { viscosity: '5W-30', type: 'Full Synthetic', capacity: '5.1 qt' }, transmission: { type: 'SP-IV / ATF', capacity: '4.0 qt' }, coolant: { type: 'Hyundai/Kia Long Life' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 33 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 47' } },
    models: {
      elantra: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'medium', description: 'Keeps engine healthy and maintains warranty.' },
        { service: 'Tire Rotation', intervalMiles: 7500, intervalMonths: 12, severity: 'low', description: 'Prevents uneven tread wear.' },
        { service: 'Cabin Air Filter', intervalMiles: 15000, intervalMonths: 12, severity: 'low', description: 'Keeps cabin air fresh.' },
        { service: 'Brake Fluid Flush', intervalMiles: 45000, intervalMonths: 48, severity: 'medium', description: 'Prevents moisture buildup.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Long-lasting plugs.' },
      ],
      sonata: 'elantra', tucson: 'elantra', 'santa fe': 'elantra'
    }
  },
  kia: {
    specs: { oil: { viscosity: '5W-30', type: 'Full Synthetic', capacity: '5.1 qt' }, transmission: { type: 'SP-IV / ATF', capacity: '4.0 qt' }, coolant: { type: 'Hyundai/Kia Long Life' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 34 }, sparkPlugs: { type: 'Iridium', gap: '0.044 in' }, battery: { groupSize: 'Group 47' } },
    models: { forte: 'hyundai.elantra', k5: 'hyundai.elantra', sportage: 'hyundai.elantra', sorento: 'hyundai.elantra' }
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
      rogue: 'altima', sentra: 'altima', pathfinder: 'altima'
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
      ],
      forester: 'outback', crosstrek: 'outback', impreza: 'outback'
    }
  },
  jeep: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'ATF+4 / ZF 8/9 speed', capacity: '4.0 qt' }, coolant: { type: 'Mopar OAT' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 36 }, sparkPlugs: { type: 'Copper', gap: '0.043 in' }, battery: { groupSize: 'Group 48' } },
    models: {
      wrangler: [
        { service: 'Oil & Filter Change', intervalMiles: 8000, intervalMonths: 12, severity: 'medium', description: 'Essential for rugged Jeep engines.' },
        { service: 'Tire Rotation', intervalMiles: 8000, intervalMonths: 12, severity: 'low', description: 'Keeps tires wearing evenly.' },
        { service: 'Cabin Air Filter', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'Keeps trail dust out of cabin.' },
        { service: 'Transfer Case Fluid', intervalMiles: 30000, intervalMonths: 36, severity: 'high', description: 'Crucial for 4x4 health.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Ensures reliable ignition.' },
      ],
      'grand cherokee': 'wrangler'
    }
  },
  ram: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'ATF+4 / ZF 8 speed', capacity: '4.0 qt' }, coolant: { type: 'Mopar OAT' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 38 }, sparkPlugs: { type: 'Copper', gap: '0.043 in' }, battery: { groupSize: 'Group 48' } },
    models: {
      1500: [
        { service: 'Oil & Filter Change', intervalMiles: 8000, intervalMonths: 12, severity: 'medium', description: 'Keeps HEMI or EcoDiesel running strong.' },
        { service: 'Tire Rotation', intervalMiles: 8000, intervalMonths: 12, severity: 'low', description: 'Important for heavy trucks.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Helps truck breathe while towing.' },
        { service: 'Differential Fluid', intervalMiles: 20000, intervalMonths: 24, severity: 'medium', description: 'Towing requires regular diff service.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Optimal power and fuel economy.' },
      ]
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
      'cx-5': 'mazda3', 'cx-9': 'mazda3', 'mx-5 miata': 'mazda3'
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
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '6.0 qt' }, transmission: { type: 'ATF+4 / ZF 8 speed', capacity: '4.0 qt' }, coolant: { type: 'Mopar OAT' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 36 }, sparkPlugs: { type: 'Copper', gap: '0.043 in' }, battery: { groupSize: 'Group 48' } },
    models: {
      charger: [
        { service: 'Oil & Filter Change', intervalMiles: 8000, intervalMonths: 6, severity: 'medium', description: 'Vital for HEMI or Pentastar engines.' },
        { service: 'Tire Rotation', intervalMiles: 8000, intervalMonths: 6, severity: 'low', description: 'Important for RWD muscle cars.' },
        { service: 'Cabin Air Filter', intervalMiles: 20000, intervalMonths: 24, severity: 'low', description: 'Clean cockpit air.' },
        { service: 'Engine Air Filter', intervalMiles: 30000, intervalMonths: 24, severity: 'low', description: 'Maximum power.' },
        { service: 'Spark Plugs', intervalMiles: 100000, intervalMonths: 120, severity: 'medium', description: 'Quick starts every time.' },
      ],
      challenger: 'charger', durango: 'charger'
    }
  },
  chrysler: {
    specs: { oil: { viscosity: '5W-20', type: 'Full Synthetic', capacity: '5.0 qt' }, transmission: { type: 'ATF+4 / ZF 8 speed', capacity: '4.0 qt' }, coolant: { type: 'Mopar OAT' }, brakeFluid: { type: 'DOT 3' }, tirePressure: { psi: 35 }, sparkPlugs: { type: 'Copper', gap: '0.043 in' }, battery: { groupSize: 'Group 48' } },
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
      'optipop': 'mercury.verado'
    }
  },
  'john-deere': {
    specs: { oil: { viscosity: '15W-40', type: 'John Deere Plus-50 II', capacity: '5.0 gal' }, transmission: { type: 'Hy-Gard Transmission & Hydraulic Oil' }, coolant: { type: 'John Deere Cool-Gard II' },
      fuelFilters: { type: 'John Deere original' }, oilFilters: { type: 'John Deere original' },
      airFilter: { type: 'John Deere heavy-duty' }, battery: { groupSize: 'Group 94R' }, tirePressure: { psi: 30 } },
    models: {
      '6r': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. John Deere Plus-50 II 15W-40.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace both primary and secondary filters.' },
        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1500 hours. John Deere Hy-Gard hydraulic/transmission oil.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours. Cool-Gard II extended life.' },
        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours or when indicator says so.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },
        { service: 'Tire Pressure Check', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Check daily for proper inflation.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Full inspection of belts, hoses, controls.' },
      ],
      '5r': 'john-deere.6r', '7r': 'john-deere.6r', '8r': 'john-deere.6r',
      '9r': 'john-deere.6r'
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
  const m = make.toLowerCase().trim();
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
  const m = make.toLowerCase().trim();
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
  const m = make.toLowerCase().trim();
  const mo = model?.toLowerCase().trim();
  const evMakes = ['tesla', 'rivian', 'lucid', 'polestar'];
  const evModels = ['id.4', 'id.3', 'ev6', 'ev9', 'ioniq 5', 'ioniq 6', 'mustang mach-e', 'f-150 lightning', 'bolt', 'bolt euv', 'leaf'];
  if (evMakes.includes(m)) return true;
  if (evModels.includes(mo)) return true;
  return MAINTENANCE_SCHEDULES[m]?.specs?.oil?.isEV === true;
}