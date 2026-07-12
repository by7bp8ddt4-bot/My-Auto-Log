with open('/home/team/shared/myautolog-app/src/data/maintenance-schedules.js', 'r') as f:
    content = f.read()

# Add 3032e referencing 3038e
content = content.replace(
    "'5075e': 'john-deere.3038e',",
    "'5075e': 'john-deere.3038e',\n      '3032e': 'john-deere.3038e',"
)

# Add 4105 utility tractor model with its own schedule
content = content.replace(
    "'gator 825i': [",
    "'4105': [\n        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. John Deere Plus-50 II 15W-40. Utility tractor.' },\n        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace primary and secondary fuel filters.' },\n        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1200 hours. John Deere Hy-Gard hydraulic/transmission oil.' },\n        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours or when indicator shows restricted.' },\n        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours or 3 years. Cool-Gard II.' },\n        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },\n        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Check belts, hoses, PTO, and 3-point hitch.' },\n      ],\n      '4120': 'john-deere.4105',\n      'gator 825i': ["
)

# Add Gator 825M referencing 825i
content = content.replace(
    "'xuv 855': 'john-deere.gator 825i'",
    "'xuv 855': 'john-deere.gator 825i',\n      'gator 825m': 'john-deere.gator 825i'"
)

with open('/home/team/shared/myautolog-app/src/data/maintenance-schedules.js', 'w') as f:
    f.write(content)
print('DONE: Added 3032E, 4105, 4120, Gator 825M')