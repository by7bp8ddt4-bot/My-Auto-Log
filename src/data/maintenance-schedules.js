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
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace primary and secondary fuel filters.' },
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
      '9r': 'john-deere.6r',
      '3038e': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. John Deere Plus-50 II 15W-40. Compact tractor needs fresh oil.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace fuel filter. Diesel fuel quality matters.' },
        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. John Deere Hy-Gard hydraulic/transmission oil.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Clean foam pre-filter more often in dusty conditions.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours or 3 years. Cool-Gard II.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Check belts, hoses, PTO, and 3-point hitch.' },
      ],
      '3046r': 'john-deere.3038e', '4044m': 'john-deere.3038e', '4066r': 'john-deere.3038e',
      '5055e': 'john-deere.3038e', '5065e': 'john-deere.3038e', '5075e': 'john-deere.3038e',
      '3032e': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. John Deere Plus-50 II 15W-40. Compact utility tractor.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace fuel filter.' },
        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. John Deere Hy-Gard hydraulic/transmission oil.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Clean foam pre-filter in dusty conditions.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours or 3 years. Cool-Gard II.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Check belts, hoses, PTO, and 3-point hitch.' },
      ],
      '4105': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. John Deere Plus-50 II 15W-40. Utility tractor.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace primary and secondary fuel filters.' },
        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. John Deere Hy-Gard hydraulic/transmission oil.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Clean foam pre-filter in dusty conditions.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours or 3 years. Cool-Gard II.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Check belts, hoses, PTO, and 3-point hitch.' },
      ],
      '4120': 'john-deere.4105',
      'gator 825i': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or annually. John Deere Plus-50 II 15W-40.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours in dusty conditions. Clean foam and paper filters.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Replace Gator fuel filter.' },
        { service: 'Transmission Fluid Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. John Deere Hy-Gard transmission/hydraulic oil.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 2 years. DOT 4 brake fluid.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Cool-Gard II extended life.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 300 hours. NGK spark plugs for Kawasaki gasoline engine.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check belts, tires, steering, and brakes.' },
      ],
      'xuv 835': 'john-deere.gator 825i', 'xuv 845': 'john-deere.gator 825i', 'xuv 855': 'john-deere.gator 825i',
      'gator 825m': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or annually. John Deere Plus-50 II 15W-40. Mid-size Gator.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours in dusty conditions. Clean foam and paper filters.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Replace Gator fuel filter.' },
        { service: 'Transmission Fluid Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. John Deere Hy-Gard transmission/hydraulic oil.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 2 years. DOT 4 brake fluid.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Cool-Gard II extended life.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 300 hours. NGK spark plugs.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check belts, tires, steering, and brakes.' },
      ]
    }
  },

  'new-holland': {
    specs: { oil: { viscosity: '15W-40', type: 'New Holland NH 300 / Ambra Master', capacity: '5.0 gal' }, transmission: { type: 'New Holland Multi-G / Hydraulic Oil' }, coolant: { type: 'New Holland Extended Life' },
      fuelFilters: { type: 'New Holland original' }, oilFilters: { type: 'New Holland original' },
      airFilter: { type: 'New Holland heavy-duty' }, battery: { groupSize: 'Group 94R' }, tirePressure: { psi: 28 } },
    models: {
      'workmaster': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. New Holland NH 300 15W-40 diesel oil.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace primary and secondary fuel filters.' },
        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. New Holland Multi-G hydraulic/transmission oil.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Clean foam pre-filter in dusty conditions.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours or 3 years. New Holland Extended Life Coolant.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals, charge, and electrolyte levels every 6 months.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Check PTO, 3-point hitch, belts, hoses, and tires.' },
      ],
      'boomer': 'new-holland.workmaster', 't4': 'new-holland.workmaster', 't6': 'new-holland.workmaster',
      'tc33d': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 150 hours. New Holland Ambra Master 15W-40. Compact diesel.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours. Replace fuel filter and water separator.' },
        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 600 hours. New Holland hydraulic oil for compact tractors.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Clean foam pre-filter.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1500 hours or 2 years. New Holland Extended Life Coolant.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 150 hours. Check belts, hoses, and safety systems.' },
      ]
    }
  },

  hyster: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CF-4/CH-4', capacity: '3.0 gal' }, transmission: { type: 'Hyster Powershift / Hydrostatic' }, coolant: { type: 'Universal OAT' },
      fuelFilters: { type: 'Hyster original' }, oilFilters: { type: 'Hyster original' },
      airFilter: { type: 'Hyster heavy-duty' }, battery: { groupSize: 'Group 31' }, tirePressure: { psi: 'Varies by tire type' } },
    models: {
      'h50': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. Diesel engine oil CF-4/CH-4 15W-40. Classic models: check for straight-weight 30W if pre-1970.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Clean foam pre-filter in dusty conditions.' },
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

  ducati: {
    specs: { oil: { viscosity: '15W-50', type: 'Ducati Full Synthetic Eni i-Ride', capacity: '3.4 qt' }, transmission: { type: 'Ducati 15W-50 (shared with engine)' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 33 }, battery: { groupSize: 'Group 12' }, chain: { type: '525/520 O-ring chain' }, desmo: { note: 'Desmodromic valve system — special service required' } },
    models: {
      monster: [
        { service: 'Oil & Filter Change', intervalMiles: 7500, intervalMonths: 12, severity: 'high', description: 'Ducati Testastretta engine. Eni i-Ride 15W-50 full synthetic.' },
        { service: 'Chain Lube & Adjustment', intervalMiles: 600, intervalMonths: 0, severity: 'medium', description: 'Every 600 miles. 525 chain needs regular attention.' },
        { service: 'Brake Fluid Flush', intervalMiles: 15000, intervalMonths: 12, severity: 'medium', description: 'DOT 4. Ducati brakes are high-performance.' },
        { service: 'Desmo Service (Valve Check)', intervalMiles: 15000, intervalMonths: 24, severity: 'high', description: 'Ducati Desmodromic valve adjustment. Dealer-only job.' },
        { service: 'Spark Plugs', intervalMiles: 24000, intervalMonths: 24, severity: 'medium', description: 'NGK Iridium plugs. Critical for Ducati twin performance.' },
        { service: 'Coolant Exchange', intervalMiles: 30000, intervalMonths: 48, severity: 'medium', description: 'Ducati specific coolant.' },
        { service: 'Tire Inspection', intervalMiles: 3000, intervalMonths: 0, severity: 'low', description: 'Sport tires wear fast. Check tread and pressure.' },
      ],
      panigale: 'ducati.monster', multistrada: 'ducati.monster',
      'streetfighter': 'ducati.monster', supersport: 'ducati.monster', scrambler: 'ducati.monster'
    }
  },
  ktm: {
    specs: { oil: { viscosity: '10W-50', type: 'Motorex Power Synt 4T', capacity: '3.0 qt' }, transmission: { type: 'KTM 10W-50 (shared with engine)' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 32 }, battery: { groupSize: 'Group 12' }, chain: { type: '520 O-ring chain' } },
    models: {
      '390 duke': [
        { service: 'Oil & Filter Change', intervalMiles: 4500, intervalMonths: 6, severity: 'high', description: 'KTM single-cylinder LC4c engine. Motorex 10W-50. Ready to Race.' },
        { service: 'Chain Lube & Adjustment', intervalMiles: 500, intervalMonths: 0, severity: 'medium', description: 'Every 500 miles. 520 O-ring chain needs care.' },
        { service: 'Brake Fluid Flush', intervalMiles: 15000, intervalMonths: 12, severity: 'medium', description: 'DOT 4. BYBRE brakes need fresh fluid.' },
        { service: 'Spark Plugs', intervalMiles: 18000, intervalMonths: 24, severity: 'medium', description: 'NGK Iridium plug for single-cylinder.' },
        { service: 'Valve Clearance Check', intervalMiles: 18000, intervalMonths: 24, severity: 'high', description: 'KTM recommends valve check every 18k miles.' },
        { service: 'Coolant Exchange', intervalMiles: 30000, intervalMonths: 48, severity: 'medium', description: 'KTM specific coolant. Single-cylinders run hot.' },
        { service: 'Air Filter Cleaning', intervalMiles: 6000, intervalMonths: 12, severity: 'low', description: 'Clean foam air filter every 6k miles.' },
      ],
      '1290 super adventure': 'ktm.390 duke',
      '890 adventure': 'ktm.390 duke', '790 adventure': 'ktm.390 duke',
      'rc 390': 'ktm.390 duke', '250 duke': 'ktm.390 duke'
    }
  },
  triumph: {
    specs: { oil: { viscosity: "10W-40", type: "Triumph Full Synthetic", capacity: "3.8 qt" }, transmission: { type: "Triumph 10W-40 (shared with engine)" }, brakeFluid: { type: "DOT 4" }, tirePressure: { psi: 34 }, battery: { groupSize: "Group 12" }, chain: { type: "525/530 O-ring chain" } },
    models: {
      bonneville: [
        { service: "Oil & Filter Change", intervalMiles: 6000, intervalMonths: 12, severity: "high", description: "Triumph Bonneville parallel twin. 10W-40 full synthetic." },
        { service: "Chain Lube & Adjustment", intervalMiles: 600, intervalMonths: 0, severity: "medium", description: "Every 600 miles. 525 O-ring chain." },
        { service: "Brake Fluid Flush", intervalMiles: 15000, intervalMonths: 12, severity: "medium", description: "DOT 4. Nissin brakes." },
        { service: "Valve Clearance Check", intervalMiles: 12000, intervalMonths: 24, severity: "high", description: "Triumph recommends valve check every 12k miles." },
        { service: "Spark Plugs", intervalMiles: 24000, intervalMonths: 24, severity: "medium", description: "NGK Iridium plugs." },
        { service: "Coolant Exchange", intervalMiles: 30000, intervalMonths: 48, severity: "medium", description: "Triumph specific coolant." },
        { service: "Tire Inspection", intervalMiles: 4000, intervalMonths: 0, severity: "low", description: "Check tire condition and pressure." },
      ],
      "street triple": "triumph.bonneville", tiger: "triumph.bonneville",
      "speed triple": "triumph.bonneville", "rocket 3": "triumph.bonneville",
      "scrambler 900": "triumph.bonneville", "trident 660": "triumph.bonneville"
    }
  },

      polaris: {
    specs: { oil: { viscosity: '10W-40', type: 'Polaris PS-4 Full Synthetic', capacity: '2.0 qt' }, transmission: { type: 'Polaris PVT (CVT) / Gearcase' }, coolant: { type: 'Polaris Extended Life Coolant' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 14 }, battery: { groupSize: 'Group 16' }, cvt: { note: 'Polaris Variable Transmission - belt driven' } },
    models: {
      rzr: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or annually. Polaris ProStar engine. PS-4 10W-40 full synthetic.' },
        { service: 'CVT Belt Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect PVT drive belt. Off-road abuse wears belts fast.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours in dusty conditions. Clean foam pre-filter and main filter.' },
        { service: 'Gearcase Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Polaris gearcase oil. Front and rear differentials.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 2 years. DOT 4. RZR brakes work hard in mud.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Polaris Extended Life Coolant.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK Iridium plugs for ProStar engine.' },
        { service: 'Suspension Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours. Check A-arms, bushings, shocks. Off-road takes a toll.' },
      ],
      sportsman: 'polaris.rzr', ranger: 'polaris.rzr',
      general: 'polaris.rzr', 'rzr pro': 'polaris.rzr'
    }
  },
  'can-am': {
    specs: { oil: { viscosity: '5W-40', type: 'Rotax XPS Full Synthetic', capacity: '3.5 qt' }, transmission: { type: 'Can-Am CVT (pDrive) / Gearcase' }, coolant: { type: 'Rotax XPS Coolant' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 10 }, battery: { groupSize: 'Group 16' }, cvt: { note: 'Can-Am pDrive clutch system' } },
    models: {
      maverick: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or annually. Rotax engine. XPS 5W-40 full synthetic.' },
        { service: 'CVT Belt Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect pDrive belt. Mud and water kill belts.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours off-road. Clean foam pre-filter. Dusty conditions clog fast.' },
        { service: 'Front & Rear Diff Oil', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Can-Am gearcase oil. Critical for 4WD system.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 2 years. DOT 4.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK Iridium plugs for Rotax engine.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Rotax XPS coolant.' },
        { service: 'Suspension Check', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours. Check Fox shocks, A-arms, and trailing arms.' },
      ],
      outlander: 'can-am.maverick', renegade: 'can-am.maverick',
      defender: 'can-am.maverick', commander: 'can-am.maverick'
    }
  },
  cfmoto: {
    specs: { oil: { viscosity: '10W-40', type: 'CFMOTO Premium 4T', capacity: '2.0 qt' }, transmission: { type: 'CFMOTO CVT / Gearcase' }, coolant: { type: 'CFMOTO Long Life Coolant' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 10 }, battery: { groupSize: 'Group 16' }, cvt: { note: 'CVT belt drive' } },
    models: {
      zforce: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or annually. CFMOTO engine. Premium 10W-40 4T oil.' },
        { service: 'CVT Belt Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect CVT drive belt. Replace if glazed or cracked.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours off-road. Clean foam pre-filter and paper main filter.' },
        { service: 'Gearcase Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Front and rear gearcase oil.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 2 years. DOT 4.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK spark plugs.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. CFMOTO Long Life Coolant.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 50 hours. Check suspension, tires, steering, and safety systems.' },
      ],
      uforce: 'cfmoto.zforce', 'cforce': 'cfmoto.zforce'
    }
  },
  hisun: {
    specs: { oil: { viscosity: '10W-40', type: 'Hisun 4-Stroke Engine Oil', capacity: '2.0 qt' }, transmission: { type: 'Hisun CVT / Gearcase' }, coolant: { type: 'Hisun Long Life Coolant' }, brakeFluid: { type: 'DOT 4' }, tirePressure: { psi: 10 }, battery: { groupSize: 'Group 16' }, cvt: { note: 'CVT belt drive' } },
    models: {
      sector: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or annually. Hisun 4-stroke engine. 10W-40 oil.' },
        { service: 'CVT Belt Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect CVT belt for glazing and wear.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours in dusty conditions. Clean foam pre-filter.' },
        { service: 'Gearcase Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Front and rear gearcase oil for 4WD models.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 2 years. DOT 4.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Standard spark plug.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Hisun Long Life Coolant.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 50 hours. Check drivetrain, suspension, tires, and safety systems.' },
      ],
      axis: 'hisun.sector', 'tacker': 'hisun.sector', 'hamer': 'hisun.sector',
      'trailblazer': 'hisun.sector', 'mega 500': 'hisun.sector'
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
      enclave: 'chevrolet.silverado', envision: 'chevrolet.silverado', encore: 'chevrolet.silverado', lacrosse: 'chevrolet.silverado'
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