with open('/home/team/shared/myautolog-app/src/data/maintenance-schedules.js', 'r') as f:
    content = f.read()

# 1. Replace 3032e alias with dedicated entry
old_3032e = "'3032e': 'john-deere.3038e',"
new_3032e = """'3032e': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. John Deere Plus-50 II 15W-40. Compact utility tractor.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace fuel filter.' },
        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. John Deere Hy-Gard hydraulic/transmission oil.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Clean foam pre-filter in dusty conditions.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours or 3 years. Cool-Gard II.' },
        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Check belts, hoses, PTO, and 3-point hitch.' },
      ],"""
content = content.replace(old_3032e, new_3032e)

# 2. Update 4105 intervals to match lead's specs
old_4105_oil = "{ service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. John Deere Plus-50 II 15W-40. Utility tractor.' },"
new_4105_oil = "{ service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. John Deere Plus-50 II 15W-40. Utility tractor.' },"
content = content.replace(old_4105_oil, new_4105_oil)

old_4105_fuel = "{ service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace primary and secondary fuel filters.' },"
new_4105_fuel = "{ service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace primary and secondary fuel filters.' },"
content = content.replace(old_4105_fuel, new_4105_fuel)

old_4105_hyd = "{ service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1200 hours. John Deere Hy-Gard hydraulic/transmission oil.' },"
new_4105_hyd = "{ service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. John Deere Hy-Gard hydraulic/transmission oil.' },"
content = content.replace(old_4105_hyd, new_4105_hyd)

old_4105_air = "{ service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours or when indicator shows restricted.' },"
new_4105_air = "{ service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Clean foam pre-filter in dusty conditions.' },"
content = content.replace(old_4105_air, new_4105_air)

old_4105_insp = "{ service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Check belts, hoses, PTO, and 3-point hitch.' },"
new_4105_insp = "{ service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Check belts, hoses, PTO, and 3-point hitch.' },"
content = content.replace(old_4105_insp, new_4105_insp)

# 3. Replace Gator 825M alias with dedicated entry
old_gator = "'gator 825m': 'john-deere.gator 825i'"
new_gator = """'gator 825m': [
        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or annually. John Deere Plus-50 II 15W-40. Mid-size Gator.' },
        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours in dusty conditions. Clean foam and paper filters.' },
        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Replace Gator fuel filter.' },
        { service: 'Transmission Fluid Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. John Deere Hy-Gard transmission/hydraulic oil.' },
        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 2 years. DOT 4 brake fluid.' },
        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Cool-Gard II extended life.' },
        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 300 hours. NGK spark plugs.' },
        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check belts, tires, steering, and brakes.' },
      ]"""
content = content.replace(old_gator, new_gator)

with open('/home/team/shared/myautolog-app/src/data/maintenance-schedules.js', 'w') as f:
    f.write(content)
print('DONE: Updated 3032E, 4105, 4120, Gator 825M')