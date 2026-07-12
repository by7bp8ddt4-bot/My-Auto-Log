with open('/home/team/shared/myautolog-app/src/data/maintenance-schedules.js', 'r') as f:
    content = f.read()

# Find the Watercraft section comment and insert new PWC entries after it
# Also find the existing sections to update

# ============================================================
# 1. UPDATE seadoo - add Wake series, update intervals to 100hr
# ============================================================
old_seadoo_gtx = """      gtx: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 50 hours or annually. Rotax 4-TEC engine. Sea-Doo XPS 5W-40.' },
        { service: 'Supercharger Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect and rebuild supercharger. Critical for 4-TEC.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. NGK Iridium plugs. Prevents misfire on water.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Inspect impeller and wear ring annually. Debris damages pump.' },
        { service: 'Gear Oil Change', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Sea-Doo synthetic gear oil.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Sea-Doo XPS coolant. Prevents corrosion.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check battery and terminals before each season.' },
        { service: 'Winterization', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Annually before storage. Fog engine, stabilize fuel, drain water.' },
      ],
      rxp: 'seadoo.gtx', gti: 'seadoo.gtx', rxt: 'seadoo.gtx', spark: 'seadoo.gtx'"""
new_seadoo_gtx = """      gtx: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Sea-Doo BRP synthetic 5W-40. Rotax 4-TEC engine.' },
        { service: 'Supercharger Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Inspect and rebuild supercharger. Critical for supercharged models.' },
        { service: 'Jet Pump Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect jet pump, wear ring, and impeller.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. NGK Iridium plugs. Prevents misfire on water.' },
        { service: 'Intercooler Service', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Clean intercooler core on supercharged models.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check battery and terminals before each season.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check hoses, clamps, electrical connections, and bilge.' },
      ],
      rxp: 'seadoo.gtx', gti: 'seadoo.gtx', rxt: 'seadoo.gtx', spark: 'seadoo.gtx', 'wake': 'seadoo.gtx'"""
content = content.replace(old_seadoo_gtx, new_seadoo_gtx)

# ============================================================
# 2. UPDATE yamaha-wc - add SuperJet, update to 100hr intervals
# ============================================================
old_yamaha_wc = """      'fx cruiser': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Every 50 hours or annually. Yamaha 1.8L marine engine. Yamalube 10W-40.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. NGK Iridium plugs for reliable starting.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 6, severity: 'high', description: 'Inspect impeller and wear ring for damage. Debris causes vibration.' },
        { service: 'Gear Oil Change', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 100 hours or annually. Yamaha Marine Gear Oil.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Yamaha Long Life Coolant.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'AGM battery check. Top up charge before season.' },
        { service: 'Winterization', intervalMiles: 0, intervalMonths: 12, severity: 'high', description: 'Annually: fog engine, antifreeze, stabilize fuel.' },
      ],
      vx: 'yamaha-wc.fx cruiser', ex: 'yamaha-wc.fx cruiser', gp: 'yamaha-wc.fx cruiser', svho: 'yamaha-wc.fx cruiser'"""
new_yamaha_wc = """      'fx cruiser': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Yamalube 4T Marine 10W-40. 1.8L marine engine.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK Iridium plugs for reliable starting.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect impeller and wear ring for damage.' },
        { service: 'Impeller Check', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Replace water pump impeller.' },
        { service: 'Carbon Seal Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Check carbon seal for wear and leaks.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Supercharged models need fresh coolant.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'AGM battery check. Top up charge before season.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check hoses, clamps, and electrical connections.' },
      ],
      vx: 'yamaha-wc.fx cruiser', 'ex': 'yamaha-wc.fx cruiser', gp: 'yamaha-wc.fx cruiser', svho: 'yamaha-wc.fx cruiser', 'superjet': 'yamaha-wc.fx cruiser'"""
content = content.replace(old_yamaha_wc, new_yamaha_wc)

# ============================================================
# 3. UPDATE kawasaki-wc to kawasaki-pwc with updated intervals
# ============================================================
old_kawasaki_wc = """  'kawasaki-wc': {
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
  },"""
new_kawasaki_pwc = """  'kawasaki-pwc': {
    specs: { oil: { viscosity: '10W-40', type: 'Kawasaki 4-Stroke Marine Oil', capacity: '3.5 qt' }, gearOil: { type: 'Kawasaki Marine Gear Oil' }, coolant: { type: 'Kawasaki Long Life Coolant' }, sparkPlugs: { type: 'NGK Iridium', gap: '0.032 in' }, impeller: { note: 'Jet pump impeller — inspect annually' }, battery: { groupSize: 'Group 16 (AGM)' } },
    models: {
      'ultra 310': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Kawasaki 1.5L supercharged engine. 10W-40 marine oil.' },
        { service: 'Supercharger Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Inspect and rebuild supercharger clutch.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK Iridium plugs.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect impeller and wear ring for damage.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check battery and terminals before each season.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check hoses, clamps, and electrical connections.' },
      ],
      'stx 160': 'kawasaki-pwc.ultra 310'
    }
  },"""
content = content.replace(old_kawasaki_wc, new_kawasaki_pwc)

# ============================================================
# 4. ADD yamaha-waverunner (new entry, separate from yamaha-wc)
# ============================================================
# Insert after kawasaki-pwc (before the Motorcycles section)
yamaha_waverunner_entry = """  'yamaha-waverunner': {
    specs: { oil: { viscosity: '10W-40', type: 'Yamalube 4T Marine', capacity: '3.5 qt' }, gearOil: { type: 'Yamaha Marine Gear Oil' }, coolant: { type: 'Yamaha Long Life Coolant' }, sparkPlugs: { type: 'NGK Iridium', gap: '0.032 in' }, impeller: { note: 'Jet pump impeller — inspect annually' }, battery: { groupSize: 'Group 16 (AGM)' } },
    models: {
      fx: [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Yamalube 4T Marine 10W-40. Yamaha 1.8L engine.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK Iridium plugs.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect impeller and wear ring.' },
        { service: 'Impeller Check', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Replace water pump impeller.' },
        { service: 'Carbon Seal Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Check carbon seal for wear.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'AGM battery check. Top up before season.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check hoses, clamps, and electrical connections.' },
      ],
      vx: 'yamaha-waverunner.fx', gp: 'yamaha-waverunner.fx', ex: 'yamaha-waverunner.fx', 'superjet': 'yamaha-waverunner.fx'
    }
  },

  // --- Motorcycles ---"""
content = content.replace("  // --- Motorcycles ---", yamaha_waverunner_entry)

# ============================================================
# 5. UPDATE mercury outboard - update intervals
# ============================================================
old_mercury = """  mercury: {
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
  },"""
new_mercury = """  mercury: {
    specs: { oil: { viscosity: '10W-30', type: 'Mercury MerCruiser Full Synthetic', capacity: '6.0 qt' }, gearOil: { type: 'Mercury High Performance Gear Oil' }, coolant: { type: 'Mercury Extended Life Coolant' },
      sparkPlugs: { type: 'NGK Iridium', gap: '0.035 in' }, fuelFilters: { type: 'Mercury 10 micron water-separating' },
      impeller: { note: 'Water pump impeller' }, zincAnodes: { note: 'Replace annually' } },
    models: {
      'verado': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. Mercury Full Synthetic 10W-30.' },
        { service: 'Gearcase Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. Mercury High Performance Gear Oil.' },
        { service: 'Water Pump Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours or 3 years. Critical for Verado supercharged cooling.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK Iridium plugs.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Mercury 10 micron water-separating filter.' },
        { service: 'Anode Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace annually. Saltwater protection.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check electrical, cooling, and fuel systems.' },
      ],
      'pro xs': 'mercury.verado',
      'fourstroke': 'mercury.verado'
    }
  },"""
content = content.replace(old_mercury, new_mercury)

# ============================================================
# 6. UPDATE yamaha outboard - update intervals
# ============================================================
old_yamaha_outboard = """  yamaha: {
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
  },"""
new_yamaha_outboard = """  'yamaha-outboard': {
    specs: { oil: { viscosity: '10W-30', type: 'Yamalube 4M FC-W', capacity: '5.3 qt' }, gearOil: { type: 'Yamalube Marine Gear Oil' }, coolant: { type: 'Yamaha Long Life Coolant' },
      sparkPlugs: { type: 'NGK Iridium', gap: '0.044 in' }, fuelFilters: { type: 'Yamaha 10 micron' }, impeller: { note: 'Water pump impeller' },
      zincAnodes: { note: 'Replace annually' } },
    models: {
      'f115': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. Yamalube 4M FC-W 10W-30.' },
        { service: 'Gearcase Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. Yamalube Marine Gear Oil.' },
        { service: 'Water Pump Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours or 3 years. Critical for cooling.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK Iridium plugs.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. 10 micron Yamaha fuel filter.' },
        { service: 'Anode Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace annually. Critical in saltwater operation.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check fuel lines, hoses, electrical connections.' },
      ],
      'f150': 'yamaha-outboard.f115', 'f200': 'yamaha-outboard.f115', 'f250': 'yamaha-outboard.f115',
      'f300': 'yamaha-outboard.f115', 'f70': 'yamaha-outboard.f115'
    }
  },"""
content = content.replace(old_yamaha_outboard, new_yamaha_outboard)

# ============================================================
# 7. ADD suzuki-outboard, honda-outboard, cummins-mercruiser, volvo-penta
# ============================================================
# Insert after the new yamaha-outboard (before cat)
# Find the cat section to insert before
cat_pos = content.find("  cat: {")
new_entries = """
  'suzuki-outboard': {
    specs: { oil: { viscosity: '10W-30', type: 'Suzuki ECSTAR Marine 4T', capacity: '5.3 qt' }, gearOil: { type: 'Suzuki Marine Gear Oil' }, coolant: { type: 'Suzuki Long Life Coolant' },
      sparkPlugs: { type: 'NGK Iridium', gap: '0.044 in' }, fuelFilters: { type: 'Suzuki 10 micron' }, impeller: { note: 'Water pump impeller' },
      zincAnodes: { note: 'Replace annually' } },
    models: {
      'df-series': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Suzuki ECSTAR Marine 4T 10W-30.' },
        { service: 'Gearcase Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Suzuki Marine Gear Oil.' },
        { service: 'Water Pump Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours or 3 years. Critical for cooling.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK Iridium plugs.' },
        { service: 'Valve Adjustment', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours. Check intake and exhaust valve clearance.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Suzuki 10 micron fuel filter.' },
        { service: 'Anode Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace annually. Saltwater protection.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check fuel lines, hoses, electrical connections.' },
      ]
    }
  },
  'honda-outboard': {
    specs: { oil: { viscosity: '10W-30', type: 'Honda Marine 4-Stroke Oil', capacity: '5.0 qt' }, gearOil: { type: 'Honda Marine Gear Oil' }, coolant: { type: 'Honda Long Life Coolant' },
      sparkPlugs: { type: 'NGK Iridium', gap: '0.044 in' }, fuelFilters: { type: 'Honda 10 micron' }, impeller: { note: 'Water pump impeller' },
      zincAnodes: { note: 'Replace annually' } },
    models: {
      'bf-series': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Honda Marine 4-stroke oil 10W-30.' },
        { service: 'Gearcase Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Honda Marine Gear Oil.' },
        { service: 'Water Pump Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours or 3 years.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK Iridium plugs.' },
        { service: 'Valve Adjustment', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours. Check valve clearance.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Honda 10 micron fuel filter.' },
        { service: 'Anode Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace annually. Saltwater protection.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check fuel lines, hoses, electrical connections.' },
      ]
    }
  },
  'cummins-mercruiser': {
    specs: { oil: { viscosity: '15W-40', type: 'Cummins Premium Blue Marine', capacity: '6.0 gal' }, transmission: { type: 'ZF Marine / Twin Disc' }, coolant: { type: 'Fleetguard ES Compleat OAT' },
      fuelFilters: { type: 'Fleetguard FS1000 / FF5320' }, oilFilters: { type: 'Fleetguard LF3000' }, airFilter: { type: 'Fleetguard heavy-duty' },
      impeller: { note: 'Raw water pump impeller' }, aftercooler: { note: 'Inspect and clean annually' }, zincAnodes: { note: 'Replace annually' } },
    models: {
      'qsb': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. Cummins Premium Blue Marine 15W-40 diesel oil.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. Replace primary and secondary Fleetguard filters.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours or 2 years. Fleetguard ES Compleat OAT.' },
        { service: 'Raw Water Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace water pump impeller.' },
        { service: 'Aftercooler Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Inspect and clean aftercooler core.' },
        { service: 'Valve Adjustment', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 2000 hours. Check valve lash.' },
        { service: 'Zinc Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace zinc anodes annually. Corrosion protection.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Check hoses, belts, and seawater system.' },
      ],
      'qsc': 'cummins-mercruiser.qsb', 'qsl': 'cummins-mercruiser.qsb'
    }
  },
  'volvo-penta': {
    specs: { oil: { viscosity: '15W-40', type: 'Volvo Penta VDS-4', capacity: '5.5 gal' }, transmission: { type: 'Volvo Penta IPS / DPS' }, coolant: { type: 'Volvo Penta VCS' },
      fuelFilters: { type: 'Volvo Penta original' }, oilFilters: { type: 'Volvo Penta original' },
      impeller: { note: 'Raw water pump impeller' }, zincAnodes: { note: 'Replace annually' } },
    models: {
      'd-series': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Volvo Penta VDS-4 15W-40 diesel oil.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Replace Volvo Penta fuel filters.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours or 2 years. Volvo Penta VCS coolant.' },
        { service: 'Raw Water Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace water pump impeller.' },
        { service: 'Raw Water Pump Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. Rebuild raw water pump.' },
        { service: 'Zinc Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace zinc anodes annually. Corrosion protection.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Check hoses, belts, and seawater system.' },
      ],
      'ips': 'volvo-penta.d-series'
    }
  },

"""
content = content[:cat_pos] + new_entries + content[cat_pos:]

# ============================================================
# 8. UPDATE cat marine - update intervals to match lead's specs
# ============================================================
old_cat = """  cat: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CJ-4', capacity: '7.0 gal' }, transmission: { type: 'Marine gearbox' }, coolant: { type: 'CAT Extended Life Coolant (ELC)' },
      fuelFilters: { type: 'CAT 1R-0749 primary / 1R-0750 secondary' },
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
  },"""
new_cat = """  cat: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CJ-4', capacity: '7.0 gal' }, transmission: { type: 'Marine gearbox' }, coolant: { type: 'CAT Extended Life Coolant (ELC)' },
      fuelFilters: { type: 'CAT 1R-0749 primary / 1R-0750 secondary' },
      oilFilters: { type: 'CAT 3I-0852' }, airFilter: { type: 'CAT heavy-duty' }, valveAdjustment: { note: 'Required every 2000 hours' },
      zincAnodes: { note: 'Inspect and replace annually in saltwater' }, impeller: { note: 'Raw water pump impeller' } },
    models: {
      'c7': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. CAT diesel engine oil CJ-4 15W-40.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace primary and secondary fuel filters.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours or 3 years. CAT Extended Life Coolant (ELC).' },
        { service: 'Raw Water Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace water pump impeller.' },
        { service: 'Aftercooler Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. Inspect and clean aftercooler core.' },
        { service: 'Zinc Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace zinc anodes annually. Corrosion protection.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Check belts, hoses, clamps, and seawater system.' },
      ],
      'c9': 'cat.c7', 'c12': 'cat.c7', 'c18': 'cat.c7', 'c32': 'cat.c7',
      'c4.4': 'cat.c7', 'c6.6': 'cat.c7', 'c8.7': 'cat.c7'
    }
  },"""
content = content.replace(old_cat, new_cat)

# ============================================================
# 9. UPDATE yanmar marine - update intervals
# ============================================================
old_yanmar = """  yanmar: {
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
  },"""
new_yanmar = """  yanmar: {
    specs: { oil: { viscosity: '15W-40', type: 'Diesel Engine Oil CF-4/CH-4', capacity: '4.0 gal' }, transmission: { type: 'ZF Marine / Yanmar KM series' }, coolant: { type: 'Yanmar Long Life Coolant' },
      fuelFilters: { type: 'Yanmar Y-1001 primary / Y-1002 secondary' }, oilFilters: { type: 'Yanmar Y-2001' },
      zincAnodes: { note: 'Inspect annually' }, impeller: { note: 'Raw water pump impeller' } },
    models: {
      '4jh': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. Diesel engine oil CF-4/CH-4 15W-40.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. Replace primary and secondary Yanmar fuel filters.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours or 2 years. Yanmar Long Life Coolant.' },
        { service: 'Raw Water Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace water pump impeller.' },
        { service: 'Valve Adjustment', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 2000 hours. Check and adjust valve clearance.' },
        { service: 'Zinc Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace zinc anodes annually. Corrosion protection.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Check seawater system, hoses, belts.' },
      ],
      '3ym30': 'yanmar.4jh', '4jh5': 'yanmar.4jh', '6lp': 'yanmar.4jh',
      '6ly': 'yanmar.4jh'
    }
  },"""
content = content.replace(old_yanmar, new_yanmar)

with open('/home/team/shared/myautolog-app/src/data/maintenance-schedules.js', 'w') as f:
    f.write(content)
print('DONE: All watercraft, outboard, and marine diesel entries updated')