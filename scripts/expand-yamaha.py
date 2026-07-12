with open('/home/team/shared/myautolog-app/src/data/maintenance-schedules.js', 'r') as f:
    content = f.read()

# ============================================================
# 1. REPLACE yamaha outboard with yamaha-outboard (detailed)
# ============================================================
old_yamaha = """  yamaha: {
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
    specs: { oil: { viscosity: '10W-30', type: 'Yamalube 4M FC-W', capacity: 'Varies by model' }, gearOil: { type: 'Yamalube Marine Gear Oil' }, coolant: { type: 'Yamaha Long Life Coolant' },
      sparkPlugs: { type: 'NGK Iridium', gap: 'Varies by model' }, fuelFilters: { type: 'Yamaha 10 micron' }, impeller: { note: 'Water pump impeller' },
      zincAnodes: { note: 'Replace annually' } },
    models: {
      'portable': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. SAE 10W-30, 0.6L. Models: F2.5 through F25.' },
        { service: 'Gearcase Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. SAE 90 hypoid gear oil, 0.3L.' },
        { service: 'Water Pump Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours or 3 years. Replace impeller and gaskets.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Check and replace as needed.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Replace inline fuel filter.' },
        { service: 'Anode Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace zinc anodes annually. Saltwater protection.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check fuel lines, hoses, and propeller.' },
      ],
      'mid': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. Yamalube 10W-30, 1.8-2.5L. Models: F40 through F90.' },
        { service: 'Gearcase Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. SAE 90 gear oil, 0.6-0.8L.' },
        { service: 'Water Pump Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours or 3 years. Critical for cooling.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK DPR6EA-9. Check gap 0.9mm.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Yamaha 10 micron fuel filter.' },
        { service: 'Valve Adjustment', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours. Check intake and exhaust valve clearance.' },
        { service: 'Anode Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace zinc anodes annually. Saltwater protection.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check fuel lines, hoses, and electrical connections.' },
      ],
      'large': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. Yamalube 10W-30, 3.5-4.8L. Models: F115 through F200.' },
        { service: 'Oil Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Replace Yamaha oil filter with every oil change.' },
        { service: 'Gearcase Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. SAE 90 gear oil, 0.9-1.0L.' },
        { service: 'Water Pump Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours or 3 years. Critical for cooling.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK LFR6A-11. Check gap 1.1mm.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Yamaha 10 micron fuel/water separator.' },
        { service: 'Timing Belt Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. Replace timing belt on F115/F150.' },
        { service: 'Valve Adjustment', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours. Check intake and exhaust valve clearance.' },
        { service: 'Anode Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace zinc anodes annually. Saltwater protection.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check fuel lines, hoses, electrical connections.' },
      ],
      'vf-series': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. Yamalube 10W-40 full synthetic, 5.0L. Vmax VF150-VF250.' },
        { service: 'Oil Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Replace Yamaha oil filter with every oil change.' },
        { service: 'Gearcase Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. SAE 90 high-performance gear oil, 1.0L.' },
        { service: 'Water Pump Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours or 3 years. Critical for high-performance cooling.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK LFR6A-11. Check gap 1.1mm.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Yamaha 10 micron fuel/water separator.' },
        { service: 'Anode Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace zinc anodes annually. Saltwater protection.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check fuel lines, hoses, electrical connections.' },
      ],
      'xto': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Yamalube 10W-40 full synthetic, 7.0L. XTO V8 F350-F425.' },
        { service: 'Oil Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Replace Yamaha oil filter with every oil change.' },
        { service: 'Gearcase Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or 1 year. SAE 90 gear oil, 1.2L.' },
        { service: 'Water Pump Impeller', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours or 3 years. Critical for V8 cooling.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Check and replace as needed.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Yamaha 10 micron fuel/water separator.' },
        { service: 'Valve Adjustment', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 1000 hours. Check valve clearance on V8 engine.' },
        { service: 'Anode Replacement', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Replace sacrificial anodes annually. Saltwater protection.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check fuel lines, hoses, and electrical connections.' },
      ]
    }
  },"""

content = content.replace(old_yamaha, new_yamaha_outboard)

# ============================================================
# 2. REPLACE yamaha-wc with yamaha-waverunner (detailed engine families)
# ============================================================
old_yamaha_wc = """  'yamaha-wc': {
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
  },"""

new_yamaha_waverunner = """  'yamaha-waverunner': {
    specs: { oil: { viscosity: '10W-40', type: 'Yamalube 4T Marine', capacity: 'Varies by engine' }, gearOil: { type: 'Yamaha Marine Gear Oil' }, coolant: { type: 'Yamaha Long Life Coolant' }, impeller: { note: 'Jet pump impeller — inspect annually' }, battery: { groupSize: 'Group 16 (AGM)' } },
    models: {
      '1049cc': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Yamalube 10W-40, 3.8L. 1049cc 4-cylinder. Models: EX, EX Deluxe, EX Sport, VX, VX Deluxe.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK MR7F. Gap 0.8mm.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect impeller and wear ring for damage.' },
        { service: 'Carbon Seal Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Check carbon seal for wear and leaks.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. 50/50 Yamaha Long Life Coolant.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'AGM battery check. Top up charge before season.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check hoses, clamps, and electrical connections.' },
      ],
      '1050cc-ho': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Yamalube 10W-40, 3.8L. H.O. 1050cc, premium fuel. Models: VX Cruiser HO, VX Limited.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK MR7F. Gap 0.8mm.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect impeller and wear ring.' },
        { service: 'Carbon Seal Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Check carbon seal for wear.' },
        { service: 'Valve Clearance Check', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours. Intake: 0.15-0.25mm, Exhaust: 0.25-0.35mm.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. 50/50 Yamaha Long Life Coolant.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'AGM battery check. Top up charge before season.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check hoses, clamps, and electrical connections.' },
      ],
      '1100cc': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Yamalube 10W-40, 4.1L. 1100cc 3-cylinder. Model: FX HO.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK LFR6A-11. Gap 1.1mm.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect impeller and wear ring.' },
        { service: 'Carbon Seal Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Check carbon seal for wear.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Yamaha Long Life Coolant.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'AGM battery check. Top up charge before season.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check hoses, clamps, and electrical connections.' },
      ],
      '1100cc-ho': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Yamalube 10W-40, 4.1L. 1100cc H.O., premium fuel required. Model: FX Cruiser HO.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK LFR6A-11. Gap 1.1mm.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect impeller and wear ring.' },
        { service: 'Carbon Seal Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Check carbon seal for wear.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Yamaha Long Life Coolant.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'AGM battery check. Top up charge before season.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check hoses, clamps, and electrical connections.' },
      ],
      '1800cc': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Yamalube 10W-40, 4.5L. 1812cc 4-cylinder. Models: FX, FX Cruiser.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK LFR6A-11. Gap 1.1mm.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect impeller and wear ring.' },
        { service: 'Water Pump Impeller Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Replace jet pump water pump impeller.' },
        { service: 'Carbon Seal Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Check carbon seal for wear.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Yamaha Long Life Coolant.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'AGM battery check. Top up charge before season.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check hoses, clamps, and electrical connections.' },
      ],
      '1800cc-sc': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Yamalube 10W-40 full synthetic, 4.5L. Supercharged. Models: FX SVHO, GP1800.' },
        { service: 'Supercharger Service', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Inspect supercharger clutch and bearings.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. NGK LFR6A-11. Gap 1.1mm.' },
        { service: 'Intercooler Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Inspect and clean intercooler core.' },
        { service: 'Jet Pump Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours. Inspect impeller and wear ring.' },
        { service: 'Water Pump Impeller Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 200 hours. Replace jet pump water pump impeller.' },
        { service: 'Carbon Seal Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Check carbon seal for wear.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Yamaha Long Life Coolant.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'AGM battery check. Top up charge before season.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check hoses, clamps, and electrical connections.' },
      ]
    }
  },"""

content = content.replace(old_yamaha_wc, new_yamaha_waverunner)

# Also update any cross-references from yamaha-wc to yamaha-waverunner
content = content.replace('yamaha-wc.', 'yamaha-waverunner.')

with open('/home/team/shared/myautolog-app/src/data/maintenance-schedules.js', 'w') as f:
    f.write(content)
print('DONE: Updated yamaha-outboard and yamaha-waverunner with detailed engine schedules')