import re

with open("/home/team/shared/myautolog-app/src/data/maintenance-schedules.js", "r") as f:
    content = f.read()

# Build the new john-deere entry with expanded models
jd_lines = []
jd_lines.append("  'john-deere': {")
jd_lines.append("    specs: { oil: { viscosity: '15W-40', type: 'John Deere Plus-50 II', capacity: '5.0 gal' }, transmission: { type: 'Hy-Gard Transmission & Hydraulic Oil' }, coolant: { type: 'John Deere Cool-Gard II' },")
jd_lines.append("      fuelFilters: { type: 'John Deere original' }, oilFilters: { type: 'John Deere original' },")
jd_lines.append("      airFilter: { type: 'John Deere heavy-duty' }, battery: { groupSize: 'Group 94R' }, tirePressure: { psi: 30 } },")
jd_lines.append("    models: {")
jd_lines.append("      '6r': [")
jd_lines.append("        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 250 hours. John Deere Plus-50 II 15W-40.' },")
jd_lines.append("        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 500 hours. Replace both primary and secondary filters.' },")
jd_lines.append("        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1500 hours. John Deere Hy-Gard hydraulic/transmission oil.' },")
jd_lines.append("        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours. Cool-Gard II extended life.' },")
jd_lines.append("        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours or when indicator says so.' },")
jd_lines.append("        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },")
jd_lines.append("        { service: 'Tire Pressure Check', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Check daily for proper inflation.' },")
jd_lines.append("        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 250 hours. Full inspection of belts, hoses, controls.' },")
jd_lines.append("      ],")
jd_lines.append("      '5r': 'john-deere.6r', '7r': 'john-deere.6r', '8r': 'john-deere.6r',")
jd_lines.append("      '9r': 'john-deere.6r',")
jd_lines.append("      '3038e': [")
jd_lines.append("        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. John Deere Plus-50 II 15W-40. Compact tractor needs fresh oil.' },")
jd_lines.append("        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace fuel filter. Diesel fuel quality matters.' },")
jd_lines.append("        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. John Deere Hy-Gard hydraulic/transmission oil.' },")
jd_lines.append("        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Clean foam pre-filter more often in dusty conditions.' },")
jd_lines.append("        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours or 3 years. Cool-Gard II.' },")
jd_lines.append("        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },")
jd_lines.append("        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Check belts, hoses, PTO, and 3-point hitch.' },")
jd_lines.append("      ],")
jd_lines.append("      '3046r': 'john-deere.3038e', '4044m': 'john-deere.3038e', '4066r': 'john-deere.3038e',")
jd_lines.append("      '5055e': 'john-deere.3038e', '5065e': 'john-deere.3038e', '5075e': 'john-deere.3038e',")
jd_lines.append("      'gator 825i': [")
jd_lines.append("        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 100 hours or annually. John Deere Plus-50 II 15W-40.' },")
jd_lines.append("        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 50 hours in dusty conditions. Clean foam and paper filters.' },")
jd_lines.append("        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. Replace Gator fuel filter.' },")
jd_lines.append("        { service: 'Transmission Fluid Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. John Deere Hy-Gard transmission/hydraulic oil.' },")
jd_lines.append("        { service: 'Brake Fluid Flush', intervalMiles: 0, intervalMonths: 12, severity: 'medium', description: 'Every 2 years. DOT 4 brake fluid.' },")
jd_lines.append("        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 24, severity: 'medium', description: 'Every 2 years. Cool-Gard II extended life.' },")
jd_lines.append("        { service: 'Spark Plugs', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 300 hours. NGK spark plugs for Kawasaki gasoline engine.' },")
jd_lines.append("        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 100 hours. Check belts, tires, steering, and brakes.' },")
jd_lines.append("      ],")
jd_lines.append("      'xuv 835': 'john-deere.gator 825i', 'xuv 845': 'john-deere.gator 825i', 'xuv 855': 'john-deere.gator 825i'")
jd_lines.append("    }")
jd_lines.append("  },")

# Build new-holland entry
nh_lines = []
nh_lines.append("  'new-holland': {")
nh_lines.append("    specs: { oil: { viscosity: '15W-40', type: 'New Holland NH 300 / Ambra Master', capacity: '5.0 gal' }, transmission: { type: 'New Holland Multi-G / Hydraulic Oil' }, coolant: { type: 'New Holland Extended Life' },")
nh_lines.append("      fuelFilters: { type: 'New Holland original' }, oilFilters: { type: 'New Holland original' },")
nh_lines.append("      airFilter: { type: 'New Holland heavy-duty' }, battery: { groupSize: 'Group 94R' }, tirePressure: { psi: 28 } },")
nh_lines.append("    models: {")
nh_lines.append("      'workmaster': [")
nh_lines.append("        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 200 hours. New Holland NH 300 15W-40 diesel oil.' },")
nh_lines.append("        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 400 hours. Replace primary and secondary fuel filters.' },")
nh_lines.append("        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1000 hours. New Holland Multi-G hydraulic/transmission oil.' },")
nh_lines.append("        { service: 'Air Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 500 hours or when indicator shows restricted.' },")
nh_lines.append("        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 2000 hours or 3 years. New Holland Extended Life Coolant.' },")
nh_lines.append("        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals, charge, and electrolyte levels every 6 months.' },")
nh_lines.append("        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 200 hours. Check PTO, 3-point hitch, belts, hoses, and tires.' },")
nh_lines.append("      ],")
nh_lines.append("      'boomer': 'new-holland.workmaster', 't4': 'new-holland.workmaster', 't6': 'new-holland.workmaster',")
nh_lines.append("      'tc33d': [")
nh_lines.append("        { service: 'Oil & Filter Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 150 hours. New Holland Ambra Master 15W-40. Compact diesel.' },")
nh_lines.append("        { service: 'Fuel Filter Replacement', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 300 hours. Replace fuel filter and water separator.' },")
nh_lines.append("        { service: 'Hydraulic Oil Change', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 600 hours. New Holland hydraulic oil for compact tractors.' },")
nh_lines.append("        { service: 'Air Filter Cleaning', intervalMiles: 0, intervalMonths: 0, severity: 'medium', description: 'Every 100 hours. Clean foam pre-filter.' },")
nh_lines.append("        { service: 'Coolant Exchange', intervalMiles: 0, intervalMonths: 0, severity: 'high', description: 'Every 1500 hours or 2 years. New Holland Extended Life Coolant.' },")
nh_lines.append("        { service: 'Battery Check', intervalMiles: 0, intervalMonths: 6, severity: 'low', description: 'Check terminals and charge every 6 months.' },")
nh_lines.append("        { service: 'Inspection', intervalMiles: 0, intervalMonths: 0, severity: 'low', description: 'Every 150 hours. Check belts, hoses, and safety systems.' },")
nh_lines.append("      ]")
nh_lines.append("    }")
nh_lines.append("  },")

jd_new = '\n'.join(jd_lines)
nh_new = '\n'.join(nh_lines)

# Find the old john-deere entry and replace it
old_jd_start = content.find("  'john-deere': {")
old_jd_end = content.find("  },\n", old_jd_start)
old_jd_end = content.find("  },\n", old_jd_end + 1)  # closing of models and then closing of manufacturer

# Find the end of the full john-deere block (after the last model reference line)
# Lines end with "    }\n  },\n"
# Find the "  },\n" after the last model line
search_start = old_jd_start
for _ in range(3):
    # Find the closing braces
    idx = content.find("  },", search_start)
    if idx >= 0:
        old_jd_end = content.find("\n", idx) + 1
        search_start = old_jd_end

# More precise: find the exact pattern that ends john-deere
# The pattern is: "    }\n  },\n" 
# Actually, let me just find the exact end
jd_end = content.find("  },\n", content.find("'xuv 855': 'john-deere.gator 825i'") if "'xuv 855'" in content else old_jd_start)
if jd_end < 0:
    # Fallback: find the closing of john-deere
    jd_end = content.find("  },\n", old_jd_start + 200)

# Actually, let me use a simpler approach - find the old john-deere block and replace it
# Find the block from "  'john-deere': {" to the "  },\n" that closes it
# The block ends with the models section closing "    }\n  },\n" followed by the next manufacturer

# Find the exact position after "      '9r': 'john-deere.6r'\n" and before "    }\n  },\n"
# Then replace everything from start of john-deere to the end of its block

# Let me find the full john-deere block
jd_start = content.find("  'john-deere': {")
# Find the end: after the last model line, there's "    }\n  },\n"
# Search for the closing of the models object
search_pos = jd_start
closing_count = 0
while closing_count < 3:
    pos = content.find("  },\n", search_pos)
    if pos < 0:
        break
    search_pos = pos + 5
    closing_count += 1

jd_end = search_pos

# Replace the old john-deere block with the new one
new_content = content[:jd_start] + jd_new + '\n\n' + nh_new + '\n\n' + content[jd_end:]

with open("/home/team/shared/myautolog-app/src/data/maintenance-schedules.js", "w") as f:
    f.write(new_content)

print(f"SUCCESS: Updated john-deere with new models and added new-holland")
print(f"File size: {len(new_content)} bytes")