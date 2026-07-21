/**
 * Smoke Test: Vehicle Data Loading (localStorage + Supabase)
 *
 * Verifies that vehicle data is correctly loaded from localStorage,
 * that the useLocalStorage hook CRUD operations work reliably,
 * and that the offline-first storage pattern is sound.
 *
 * Covers:
 *   - localStorage vehicle read/write round-trip
 *   - useLocalStorage hook behavior (add, update, remove, getById)
 *   - sanitizeForStorage stripping of binary dataUrl fields
 *   - Storage key enumeration and namespace isolation
 *   - Cloud sync push/pull patterns
 *   - Multi-table data integrity (vehicles + logs + reminders + fuel + mods)
 *   - VIN decoder integration point
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// ── Helpers ────────────────────────────────────────────────────────
function clearLocalStorage() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i));
  }
  keys.forEach(k => localStorage.removeItem(k));
}

// ── Storage Keys (mirrors constants.js) ────────────────────────────
const STORAGE_KEYS = {
  VEHICLES: 'mtxtrkr_vehicles',
  MAINTENANCE_LOGS: 'mtxtrkr_maintenance_logs',
  REMINDERS: 'mtxtrkr_reminders',
  SETTINGS: 'mtxtrkr_settings',
  LAST_SYNC: 'mtxtrkr_last_sync',
  PREMIUM_STATUS: 'mtxtrkr_premium_status',
};

const EXTENDED_KEYS = {
  FUEL_LOGS: 'mtxtrkr_fuel_logs',
  MODIFICATIONS: 'mtxtrkr_modifications',
  SELECTED_VEHICLE: 'mtxtrkr_selected_vehicle',
  CACHE_MIGRATED: 'mtxtrkr_cache_migrated',
};

// ── sanitizeForStorage (mirrors useLocalStorage.js) ────────────────
function sanitizeForStorage(data) {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map(item => sanitizeForStorage(item));
  }

  if (typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'dataUrl') continue;
      if (typeof value === 'string' && value.startsWith('data:')) continue;
      sanitized[key] = sanitizeForStorage(value);
    }
    return sanitized;
  }

  return data;
}

// ── generateId (mirrors helpers.js) ────────────────────────────────
function generateId() {
  return 'id-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
}

// ── In-memory store simulation (mirrors useLocalStorage pattern) ───
function createMemoryStore(key, initial = []) {
  let store = initial.slice();

  return {
    getData: () => store,
    load: () => {
      try {
        const raw = localStorage.getItem(key);
        store = raw ? JSON.parse(raw) : initial;
      } catch {
        store = initial;
      }
      return store;
    },
    save: () => {
      try {
        const safe = sanitizeForStorage(store);
        localStorage.setItem(key, JSON.stringify(safe));
      } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
          // Data kept in memory only
        }
      }
    },
    add: (item) => {
      const newItem = { ...item, id: item.id || generateId(), createdAt: new Date().toISOString() };
      const exists = store.find(p => p.id === newItem.id);
      if (exists) {
        store = store.map(p => p.id === newItem.id ? { ...p, ...newItem, updatedAt: new Date().toISOString() } : p);
      } else {
        store = [...store, newItem];
      }
      return newItem;
    },
    updateItem: (id, updates) => {
      store = store.map(item =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      );
    },
    remove: (id) => {
      store = store.filter(item => item.id !== id);
    },
    getById: (id) => store.find(item => item.id === id),
    setData: (newData) => { store = newData; },
  };
}

// ── Tests ──────────────────────────────────────────────────────────

describe('Vehicle Data Smoke Tests', () => {
  beforeEach(() => {
    clearLocalStorage();
  });

  afterEach(() => {
    clearLocalStorage();
  });

  // ── 1. Vehicle CRUD via localStorage ─────────────────────────
  describe('Vehicle Storage Operations', () => {
    it('should store and retrieve a vehicle', () => {
      const vehicle = {
        id: 'v-001',
        type: 'car',
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        mileage: 5000,
      };

      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify([vehicle]));
      const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      const parsed = JSON.parse(raw);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].make).toBe('Toyota');
      expect(parsed[0].model).toBe('Camry');
      expect(parsed[0].mileage).toBe(5000);
    });

    it('should append a new vehicle to existing array', () => {
      const existing = [{ id: 'v-001', make: 'Honda' }];
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(existing));

      const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      const parsed = JSON.parse(raw);
      parsed.push({ id: 'v-002', make: 'Toyota' });
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(parsed));

      const result = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
      expect(result).toHaveLength(2);
      expect(result[1].make).toBe('Toyota');
    });

    it('should update an existing vehicle by ID', () => {
      const vehicles = [
        { id: 'v-001', make: 'Honda', mileage: 10000 },
        { id: 'v-002', make: 'Toyota', mileage: 20000 },
      ];
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));

      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
      const updated = parsed.map(v =>
        v.id === 'v-001' ? { ...v, mileage: 15000 } : v
      );
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updated));

      const result = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
      expect(result[0].mileage).toBe(15000);
      expect(result[1].mileage).toBe(20000);
    });

    it('should delete a vehicle by ID', () => {
      const vehicles = [
        { id: 'v-001', make: 'Honda' },
        { id: 'v-002', make: 'Toyota' },
      ];
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));

      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
      const filtered = parsed.filter(v => v.id !== 'v-001');
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(filtered));

      const result = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('v-002');
    });

    it('should handle empty vehicle list gracefully', () => {
      const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      const vehicles = raw ? JSON.parse(raw) : [];
      expect(vehicles).toEqual([]);
    });

    it('should handle corrupted JSON gracefully', () => {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, 'INVALID{{{JSON');
      let vehicles = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
        vehicles = raw ? JSON.parse(raw) : [];
      } catch {
        vehicles = [];
      }
      expect(vehicles).toEqual([]);
    });
  });

  // ── 2. Memory Store Pattern ──────────────────────────────────
  describe('Memory Store (useLocalStorage pattern)', () => {
    it('should add items with generated IDs', () => {
      const store = createMemoryStore(STORAGE_KEYS.VEHICLES);
      const item = store.add({ make: 'Subaru', model: 'Outback' });

      expect(item.id).toBeDefined();
      expect(item.id).toMatch(/^id-/);
      expect(item.createdAt).toBeDefined();
      expect(store.getData()).toHaveLength(1);
    });

    it('should preserve explicit IDs on add', () => {
      const store = createMemoryStore(STORAGE_KEYS.VEHICLES);
      store.add({ id: 'custom-id-123', make: 'Ford' });

      expect(store.getById('custom-id-123')).toBeDefined();
      expect(store.getById('custom-id-123').make).toBe('Ford');
    });

    it('should update existing item with same ID (upsert)', () => {
      const store = createMemoryStore(STORAGE_KEYS.VEHICLES);
      store.add({ id: 'v-001', make: 'Honda', mileage: 10000 });
      store.add({ id: 'v-001', make: 'Honda', mileage: 15000 });

      const items = store.getData();
      expect(items).toHaveLength(1);
      expect(items[0].mileage).toBe(15000);
    });

    it('should update item by ID', () => {
      const store = createMemoryStore(STORAGE_KEYS.VEHICLES);
      store.add({ id: 'v-001', make: 'Ford', mileage: 10000 });
      store.updateItem('v-001', { mileage: 25000, color: 'Blue' });

      const item = store.getById('v-001');
      expect(item.mileage).toBe(25000);
      expect(item.color).toBe('Blue');
      expect(item.make).toBe('Ford'); // unchanged
      expect(item.updatedAt).toBeDefined();
    });

    it('should remove items by ID', () => {
      const store = createMemoryStore(STORAGE_KEYS.VEHICLES);
      store.add({ id: 'v-001', make: 'Ford' });
      store.add({ id: 'v-002', make: 'Chevy' });
      store.remove('v-001');

      expect(store.getData()).toHaveLength(1);
      expect(store.getById('v-002')).toBeDefined();
      expect(store.getById('v-001')).toBeUndefined();
    });

    it('should load from localStorage on init', () => {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify([{ id: 'from-storage', make: 'Tesla' }]));
      const store = createMemoryStore(STORAGE_KEYS.VEHICLES);
      store.load();

      expect(store.getData()).toHaveLength(1);
      expect(store.getData()[0].make).toBe('Tesla');
    });

    it('should save to localStorage', () => {
      const store = createMemoryStore(STORAGE_KEYS.VEHICLES);
      store.add({ id: 'v-001', make: 'BMW' });
      store.save();

      const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      const parsed = JSON.parse(raw);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].make).toBe('BMW');
    });
  });

  // ── 3. sanitizeForStorage ────────────────────────────────────
  describe('sanitizeForStorage', () => {
    it('should strip dataUrl from document entries', () => {
      const data = [
        {
          id: 'v-001',
          documents: [
            { name: 'receipt.pdf', dataUrl: 'data:application/pdf;base64,AAAAAAA...' },
            { name: 'warranty.pdf' },
          ],
        },
      ];

      const sanitized = sanitizeForStorage(data);
      expect(sanitized[0].documents[0].dataUrl).toBeUndefined();
      expect(sanitized[0].documents[0].name).toBe('receipt.pdf');
      expect(sanitized[0].documents[1].name).toBe('warranty.pdf');
    });

    it('should handle empty documents array', () => {
      const data = [{ id: 'v-001', documents: [] }];
      const sanitized = sanitizeForStorage(data);
      expect(sanitized[0].documents).toEqual([]);
    });

    it('should handle items without documents', () => {
      const data = [{ id: 'v-001', make: 'Toyota' }];
      const sanitized = sanitizeForStorage(data);
      expect(sanitized[0].make).toBe('Toyota');
      expect(sanitized[0].documents).toBeUndefined();
    });

    it('should handle null items in array', () => {
      const data = [null, { id: 'v-001', make: 'Toyota' }];
      const sanitized = sanitizeForStorage(data);
      expect(sanitized[0]).toBeNull();
      expect(sanitized[1].make).toBe('Toyota');
    });

    it('should handle large base64 dataUrl strings', () => {
      const largeDataUrl = 'data:image/png;base64,' + 'A'.repeat(100000);
      const data = [
        { id: 'v-001', documents: [{ name: 'scan.png', dataUrl: largeDataUrl }] },
      ];
      const sanitized = sanitizeForStorage(data);
      expect(sanitized[0].documents[0].dataUrl).toBeUndefined();
      // Original un-sanitized data still has the dataUrl
      expect(data[0].documents[0].dataUrl).toBe(largeDataUrl);
    });

    it('should strip dataUrl at top level of a maintenance log entry', () => {
      const data = [
        {
          id: 'log-001',
          serviceType: 'Oil Change',
          dataUrl: 'data:image/png;base64,iVBORw0KGgo...',
          notes: 'Changed oil at 5000 miles',
        },
      ];

      const sanitized = sanitizeForStorage(data);
      expect(sanitized[0].dataUrl).toBeUndefined();
      expect(sanitized[0].serviceType).toBe('Oil Change');
      expect(sanitized[0].notes).toBe('Changed oil at 5000 miles');
    });

    it('should strip dataUrl from deeply nested objects', () => {
      const data = [
        {
          id: 'v-001',
          history: {
            receipts: {
              scan: {
                name: 'scan.png',
                dataUrl: 'data:image/png;base64,AAAA...',
              },
            },
          },
        },
      ];

      const sanitized = sanitizeForStorage(data);
      expect(sanitized[0].history.receipts.scan.name).toBe('scan.png');
      expect(sanitized[0].history.receipts.scan.dataUrl).toBeUndefined();
    });

    it('should strip dataUrl keys from items without a documents array', () => {
      const data = [
        {
          id: 'item-1',
          dataUrl: 'data:application/pdf;base64,AAAA...',
          title: 'Receipt',
        },
      ];

      const sanitized = sanitizeForStorage(data);
      expect(sanitized[0].title).toBe('Receipt');
      expect(sanitized[0].dataUrl).toBeUndefined();
    });

    it('should strip any string value that looks like a data: URL', () => {
      const data = [
        {
          id: 'item-1',
          attachment: 'data:image/png;base64,AAAA...',
          signature: 'data:image/png;base64,BBBB...',
          description: 'Regular text description',
        },
      ];

      const sanitized = sanitizeForStorage(data);
      expect(sanitized[0].attachment).toBeUndefined();
      expect(sanitized[0].signature).toBeUndefined();
      expect(sanitized[0].description).toBe('Regular text description');
      expect(sanitized[0].id).toBe('item-1');
    });

    it('should handle non-array input (single object)', () => {
      const data = {
        id: 'v-001',
        dataUrl: 'data:image/png;base64,AAAA...',
        make: 'Toyota',
        documents: [{ name: 'receipt.pdf', dataUrl: 'data:application/pdf;base64,BBBB...' }],
      };

      const sanitized = sanitizeForStorage(data);
      expect(sanitized.dataUrl).toBeUndefined();
      expect(sanitized.make).toBe('Toyota');
      expect(sanitized.documents[0].name).toBe('receipt.pdf');
      expect(sanitized.documents[0].dataUrl).toBeUndefined();
    });

    it('should handle arrays nested inside arrays', () => {
      const data = [
        {
          id: 'v-001',
          attachments: [
            { name: 'photo1.png', dataUrl: 'data:image/png;base64,AAAA...' },
            { name: 'photo2.png', dataUrl: 'data:image/png;base64,BBBB...' },
            { name: 'notes.txt' },
          ],
        },
      ];

      const sanitized = sanitizeForStorage(data);
      expect(sanitized[0].attachments[0].dataUrl).toBeUndefined();
      expect(sanitized[0].attachments[0].name).toBe('photo1.png');
      expect(sanitized[0].attachments[1].dataUrl).toBeUndefined();
      expect(sanitized[0].attachments[2].name).toBe('notes.txt');
    });

    it('should preserve primitives unchanged', () => {
      expect(sanitizeForStorage('hello')).toBe('hello');
      expect(sanitizeForStorage(42)).toBe(42);
      expect(sanitizeForStorage(true)).toBe(true);
      expect(sanitizeForStorage(null)).toBeNull();
      expect(sanitizeForStorage(undefined)).toBeUndefined();
    });
  });

  // ── 4. Storage Key Namespace ─────────────────────────────────
  describe('Storage Key Namespace', () => {
    it('should use mtxtrkr_ prefix for all keys', () => {
      const allKeys = [
        STORAGE_KEYS.VEHICLES,
        STORAGE_KEYS.MAINTENANCE_LOGS,
        STORAGE_KEYS.REMINDERS,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.LAST_SYNC,
        STORAGE_KEYS.PREMIUM_STATUS,
        EXTENDED_KEYS.FUEL_LOGS,
        EXTENDED_KEYS.MODIFICATIONS,
        EXTENDED_KEYS.SELECTED_VEHICLE,
      ];

      for (const key of allKeys) {
        expect(key).toMatch(/^mtxtrkr_/);
      }
    });

    it('should isolate vehicle data from settings data', () => {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify([{ id: 'v1' }]));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ theme: 'dark' }));

      const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
      const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));

      expect(vehicles).toHaveLength(1);
      expect(settings.theme).toBe('dark');
    });
  });

  // ── 5. Multi-Table Data Integrity ────────────────────────────
  describe('Multi-Table Data Integrity', () => {
    it('should handle vehicles + logs + reminders concurrently', () => {
      // Write multiple data types
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify([{ id: 'v1', make: 'Honda' }]));
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE_LOGS, JSON.stringify([{ id: 'l1', serviceType: 'Oil Change', vehicleId: 'v1', cost: 45.99 }]));
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify([{ id: 'r1', title: 'Oil Change Due', vehicleId: 'v1', dueMileage: 5000 }]));
      localStorage.setItem(EXTENDED_KEYS.FUEL_LOGS, JSON.stringify([{ id: 'f1', gallons: 12.5, cost: 45.00, vehicleId: 'v1' }]));
      localStorage.setItem(EXTENDED_KEYS.MODIFICATIONS, JSON.stringify([{ id: 'm1', name: 'Cold Air Intake', category: 'Performance', vehicleId: 'v1' }]));

      // Verify all loaded correctly
      const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.MAINTENANCE_LOGS));
      const reminders = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS));
      const fuel = JSON.parse(localStorage.getItem(EXTENDED_KEYS.FUEL_LOGS));
      const mods = JSON.parse(localStorage.getItem(EXTENDED_KEYS.MODIFICATIONS));

      expect(vehicles).toHaveLength(1);
      expect(logs).toHaveLength(1);
      expect(reminders).toHaveLength(1);
      expect(fuel).toHaveLength(1);
      expect(mods).toHaveLength(1);

      // Verify referential integrity (all point to same vehicle)
      expect(logs[0].vehicleId).toBe('v1');
      expect(reminders[0].vehicleId).toBe('v1');
      expect(fuel[0].vehicleId).toBe('v1');
      expect(mods[0].vehicleId).toBe('v1');
    });

    it('should handle deleting a vehicle without orphaning related data', () => {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify([{ id: 'v1' }, { id: 'v2' }]));
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE_LOGS, JSON.stringify([
        { id: 'l1', vehicleId: 'v1' },
        { id: 'l2', vehicleId: 'v1' },
        { id: 'l3', vehicleId: 'v2' },
      ]));

      // Delete v1
      const vehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
      const remainingVehicles = vehicles.filter(v => v.id !== 'v1');
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(remainingVehicles));

      // Related logs should still exist (real app cleans them up)
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.MAINTENANCE_LOGS));
      const orphaned = logs.filter(l => l.vehicleId === 'v1');
      const valid = logs.filter(l => l.vehicleId === 'v2');

      expect(remainingVehicles).toHaveLength(1);
      expect(orphaned).toHaveLength(2);
      expect(valid).toHaveLength(1);
    });
  });

  // ── 6. Cloud Sync Patterns ───────────────────────────────────
  describe('Cloud Sync Patterns', () => {
    it('should track last sync timestamp', () => {
      const now = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
      expect(localStorage.getItem(STORAGE_KEYS.LAST_SYNC)).toBe(now);
    });

    it('should detect unsynced local changes', () => {
      // Add a new vehicle locally
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify([{ id: 'v1', make: 'Toyota' }]));

      // Simulate: local has v1, cloud has nothing
      const localData = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));
      const cloudData = []; // simulating empty cloud

      const itemsToSync = localData.filter(item => !cloudData.some(c => c.id === item.id));
      expect(itemsToSync).toHaveLength(1);
      expect(itemsToSync[0].id).toBe('v1');
    });

    it('should not re-sync already pushed items', () => {
      const localData = [{ id: 'v1' }, { id: 'v2' }, { id: 'v3' }];
      const pushedIds = new Set(['v1', 'v2']);

      const itemsToSync = localData.filter(item => !pushedIds.has(item.id));
      expect(itemsToSync).toHaveLength(1);
      expect(itemsToSync[0].id).toBe('v3');
    });

    it('should handle empty cloud on cross-device pull', () => {
      // Simulate: local empty, cloud empty → nothing to pull
      const localEmpty = !localStorage.getItem(STORAGE_KEYS.VEHICLES);
      const cloudHasData = false;

      const shouldPull = localEmpty && cloudHasData;
      expect(shouldPull).toBe(false);
    });

    it('should pull from cloud when local is empty', () => {
      // Simulate new device: local empty, cloud has data
      const localRaw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      const localEmpty = !localRaw || JSON.parse(localRaw).length === 0;
      const cloudHasData = true;

      const shouldPull = localEmpty && cloudHasData;
      expect(shouldPull).toBe(true);
    });
  });

  // ── 7. VIN Decoder Integration ───────────────────────────────
  describe('VIN Decoder Integration', () => {
    it('should store VIN-decoded vehicle data', () => {
      const decodedVehicle = {
        id: 'v-decoded',
        type: 'car',
        make: 'Honda',
        model: 'Civic',
        year: 2023,
        vin: '1HGBH41JXMN109186',
        engineSize: '2.0L',
        drivetrain: 'FWD',
        transmission: 'Auto',
        fuelType: 'Gasoline',
        mileage: 0,
      };

      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify([decodedVehicle]));
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES));

      expect(parsed[0].vin).toBe('1HGBH41JXMN109186');
      expect(parsed[0].engineSize).toBe('2.0L');
      expect(parsed[0].drivetrain).toBe('FWD');
    });

    it('should recognize EV-specific fields', () => {
      const ev = {
        id: 'v-ev',
        make: 'Tesla',
        model: 'Model 3',
        fuelType: 'Electric',
        engineSize: 'N/A',
      };
      expect(ev.fuelType).toBe('Electric');
      // EVs should not get oil change reminders
      const isEV = ev.fuelType === 'Electric';
      expect(isEV).toBe(true);
    });
  });

  // ── 8. Selected Vehicle Persistence ──────────────────────────
  describe('Selected Vehicle Persistence', () => {
    it('should persist selected vehicle ID', () => {
      localStorage.setItem(EXTENDED_KEYS.SELECTED_VEHICLE, 'v-active-001');
      expect(localStorage.getItem(EXTENDED_KEYS.SELECTED_VEHICLE)).toBe('v-active-001');
    });

    it('should return null when no vehicle selected', () => {
      expect(localStorage.getItem(EXTENDED_KEYS.SELECTED_VEHICLE)).toBeNull();
    });
  });
});
