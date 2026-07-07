// Data model keys
export const STORAGE_KEYS = {
  VEHICLES: 'mtxtrkr_vehicles',
  MAINTENANCE_LOGS: 'mtxtrkr_maintenance_logs',
  REMINDERS: 'mtxtrkr_reminders',
  SETTINGS: 'mtxtrkr_settings',
  LAST_SYNC: 'mtxtrkr_last_sync',
  PREMIUM_STATUS: 'mtxtrkr_premium_status',
};

// Default reminder templates based on common maintenance intervals
export const DEFAULT_REMINDER_TEMPLATES = [
  {
    id: 'oil-change',
    title: 'Oil & Filter Change',
    description: 'Regular oil and filter replacement',
    intervalMiles: 5000,
    intervalDays: 180,
    icon: 'Droplets',
  },
  {
    id: 'tire-rotation',
    title: 'Tire Rotation',
    description: 'Rotate tires for even wear',
    intervalMiles: 7500,
    intervalDays: 180,
    icon: 'RefreshCw',
  },
  {
    id: 'brake-inspection',
    title: 'Brake Inspection',
    description: 'Check brake pads, rotors, and fluid',
    intervalMiles: 10000,
    intervalDays: 365,
    icon: 'CircleDot',
  },
  {
    id: 'air-filter',
    title: 'Air Filter Replacement',
    description: 'Replace engine air filter',
    intervalMiles: 15000,
    intervalDays: 365,
    icon: 'Wind',
  },
  {
    id: 'cabin-air-filter',
    title: 'Cabin Air Filter',
    description: 'Replace cabin air filter for fresh AC air',
    intervalMiles: 15000,
    intervalDays: 365,
    icon: 'Wind',
  },
  {
    id: 'wiper-blades',
    title: 'Wiper Blades',
    description: 'Replace windshield wiper blades',
    intervalMiles: 10000,
    intervalDays: 180,
    icon: 'Wrench',
  },
  {
    id: 'battery-check',
    title: 'Battery Check',
    description: 'Test battery health and terminals',
    intervalMiles: 20000,
    intervalDays: 365,
    icon: 'BatteryFull',
  },
  {
    id: 'spark-plugs',
    title: 'Spark Plugs Replacement',
    description: 'Replace spark plugs',
    intervalMiles: 30000,
    intervalDays: 730,
    icon: 'Zap',
  },
  {
    id: 'transmission-fluid',
    title: 'Transmission Fluid',
    description: 'Flush and replace transmission fluid',
    intervalMiles: 60000,
    intervalDays: 1095,
    icon: 'Gauge',
  },
  {
    id: 'timing-belt',
    title: 'Timing Belt Replacement',
    description: 'Replace timing belt and tensioner',
    intervalMiles: 90000,
    intervalDays: 1825,
    icon: 'AlertTriangle',
  },
];

// Vehicle types — config-driven for easy expansion
// Add new types here; UI buttons auto-generate from this array
export const VEHICLE_TYPES = [
  { id: 'car', label: 'Car/Truck', icon: 'Car', color: 'bg-blue-600 hover:bg-blue-500', border: 'border-transparent', badgeColor: 'bg-blue-600' },
  { id: 'motorcycle', label: 'Motorcycle', icon: 'Motorcycle', color: 'bg-slate-800 hover:bg-slate-700', border: 'border-slate-700', badgeColor: 'bg-slate-800' },
  // Future: { id: 'tractor', label: 'Tractor', icon: 'Tractor', color: 'bg-green-700 hover:bg-green-600', border: 'border-green-600', badgeColor: 'bg-green-700' },
  // Future: { id: 'forklift', label: 'Forklift', icon: 'Warehouse', color: 'bg-amber-700 hover:bg-amber-600', border: 'border-amber-600', badgeColor: 'bg-amber-700' },
];

export const SERVICE_TYPES = [
  'Oil & Filter Change',
  'Tire Rotation',
  'New Tires',
  'Brake Service',
  'Engine Service',
  'Transmission Service',
  'Battery Replacement',
  'Filter Replacement',
  'Cabin Air Filter',
  'Wiper Blades',
  'Fluid Check/Top-Up',
  'Inspection',
  'Repair',
  'Other',
];// Deploy trigger 1783131821
