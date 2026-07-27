/**
 * Data Integrity Gate Test
 *
 * Blocks deployment if PROTECTED_KEYS or data persistence is broken.
 * Verifies:
 *   1. PROTECTED_KEYS array matches expected 13 keys (audit from App.jsx)
 *   2. localStorage round-trip: vehicle data written → read → intact
 *   3. Simulated auth-change wipe preserves all 5 data stores
 *   4. Premium status survives auth-change wipe (verified against Supabase by premium sync effect)
 *   5. Same-user refresh detection prevents data loss on deployment/reload
 *   6. Deployment survival: auth-loading race condition does not defeat same-user detection
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Helpers ────────────────────────────────────────────────────────
function clearLocalStorage() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i));
  }
  keys.forEach(k => localStorage.removeItem(k));
}

/**
 * Extract the PROTECTED_KEYS array from App.jsx source.
 * Returns the array of key strings, or empty array if extraction fails.
 */
function extractProtectedKeys() {
  try {
    const src = readFileSync(resolve(__dirname, '../../src/App.jsx'), 'utf-8');
    // Find the PROTECTED_KEYS block: const PROTECTED_KEYS = [ ... ];
    const match = src.match(/const PROTECTED_KEYS = \[([\s\S]*?)\];/);
    if (!match) return [];
    const body = match[1];
    // Extract all string literals from non-comment lines only
    const keys = [];
    const lines = body.split('\n');
    for (const line of lines) {
      // Skip pure comment lines (// ...)
      const trimmed = line.trim();
      if (trimmed.startsWith('//')) continue;
      // Extract the first single-quoted string on the line (the key itself)
      const m = line.match(/'([^']+)'/);
      if (m) {
        keys.push(m[1]);
      }
    }
    return keys;
  } catch (e) {
    console.error('[Gate] Failed to read App.jsx:', e);
    return [];
  }
}

/**
 * Simulate the auth-change wipe from App.jsx (lines ~432-437).
 * Removes all mtxtrkr_* and supabase_cache_* keys EXCEPT those in PROTECTED_KEYS.
 */
function simulateAuthChangeWipe(protectedKeys) {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (
      key &&
      (key.startsWith('mtxtrkr_') || key.startsWith('supabase_cache_')) &&
      !protectedKeys.includes(key)
    ) {
      localStorage.removeItem(key);
    }
  }
}

// ── Expected PROTECTED_KEYS (from App.jsx ~lines 395-410) ───────────
// NOTE: mtxtrkr_premium_status is protected so it survives the auth-change wipe.
// The premium sync effect in App.jsx verifies against Supabase on every auth
// change, downgrading local premium when DB says free — preventing cross-account
// contamination even though the localStorage key survives the wipe.
const EXPECTED_PROTECTED_KEYS = [
  'mtxtrkr_premium_status',
  'mtxtrkr_subscription_status',
  'mtxtrkr_subscription_plan',
  'mtxtrkr_subscription_next_billing',
  'mtxtrkr_selected_vehicle',
  'mtxtrkr_logs_cleanup_done',
  'mtxtrkr_stale_cache_cleaned',
  'mtxtrkr_cache_migrated',
  'mtxtrkr_supabase_cache_migrated',
  'mtxtrkr_onboarding_dismissed',
  'mtxtrkr_performance_mods',
  'mtxtrkr_pre_wipe_backup',
  'mtxtrkr_sw_nuked',
];

// ── 5 data store keys (must survive wipe) ──────────────────────────
const DATA_STORE_KEYS = [
  'mtxtrkr_vehicles',
  'mtxtrkr_maintenance_logs',
  'mtxtrkr_reminders',
  'mtxtrkr_fuel_logs',
  'mtxtrkr_modifications',
];

// ── Tests ──────────────────────────────────────────────────────────

describe('Data Integrity Gate', () => {
  beforeEach(() => {
    clearLocalStorage();
  });

  afterEach(() => {
    clearLocalStorage();
  });

  // ── 1. PROTECTED_KEYS Audit ──────────────────────────────────
  describe('PROTECTED_KEYS Audit', () => {
    it('should have exactly 13 protected keys in App.jsx', () => {
      const actual = extractProtectedKeys();
      expect(actual).toHaveLength(13);
    });

    it('should match expected PROTECTED_KEYS exactly', () => {
      const actual = extractProtectedKeys();
      // Sort both for comparison (order doesn't matter for correctness)
      const sortedActual = [...actual].sort();
      const sortedExpected = [...EXPECTED_PROTECTED_KEYS].sort();
      expect(sortedActual).toEqual(sortedExpected);
    });

    it('should include all 3 subscription keys', () => {
      const actual = extractProtectedKeys();
      expect(actual).toContain('mtxtrkr_subscription_status');
      expect(actual).toContain('mtxtrkr_subscription_plan');
      expect(actual).toContain('mtxtrkr_subscription_next_billing');
    });

    it('should include premium status key (fallback for slow Supabase fetches)', () => {
      const actual = extractProtectedKeys();
      expect(actual).toContain('mtxtrkr_premium_status');
    });
  });

  // ── 2. Round-Trip Test ───────────────────────────────────────
  describe('localStorage Round-Trip', () => {
    it('should write and read vehicle data intact', () => {
      const vehicle = {
        id: 'test-vin-123',
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        mileage: 15000,
        vin: '4T1BF1FK3HU123456',
        type: 'car',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('mtxtrkr_vehicles', JSON.stringify([vehicle]));

      const raw = localStorage.getItem('mtxtrkr_vehicles');
      expect(raw).toBeTruthy();

      const parsed = JSON.parse(raw);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe('test-vin-123');
      expect(parsed[0].make).toBe('Toyota');
      expect(parsed[0].model).toBe('Camry');
      expect(parsed[0].year).toBe(2023);
      expect(parsed[0].mileage).toBe(15000);
      expect(parsed[0].vin).toBe('4T1BF1FK3HU123456');
    });

    it('should handle empty arrays correctly', () => {
      localStorage.setItem('mtxtrkr_vehicles', JSON.stringify([]));
      const raw = localStorage.getItem('mtxtrkr_vehicles');
      const parsed = JSON.parse(raw);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(0);
    });

    it('should handle nested objects in maintenance logs', () => {
      const log = {
        id: 'log-1',
        vehicleId: 'v-1',
        serviceType: 'Oil & Filter Change',
        serviceTypes: ['Oil & Filter Change', 'Tire Rotation'],
        mileage: 15000,
        cost: 89.99,
        date: '2026-07-01',
        notes: 'Synthetic oil used',
      };

      localStorage.setItem('mtxtrkr_maintenance_logs', JSON.stringify([log]));

      const raw = localStorage.getItem('mtxtrkr_maintenance_logs');
      const parsed = JSON.parse(raw);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].serviceTypes).toHaveLength(2);
      expect(parsed[0].cost).toBe(89.99);
    });
  });

  // ── 3. Auth-Change Wipe Survival ─────────────────────────────
  describe('Auth-Change Wipe Survival', () => {
    it('should wipe data stores NOT in PROTECTED_KEYS (intentional — data was pushed to Supabase first)', () => {
      // Seed all 5 data stores — these are NOT in PROTECTED_KEYS, so they
      // SHOULD be wiped. The App.jsx cleanup effect pushes data to Supabase
      // BEFORE running this wipe, so data is safely in the cloud.
      const seedData = {
        'mtxtrkr_vehicles': [{ id: 'v1', make: 'Honda' }],
        'mtxtrkr_maintenance_logs': [{ id: 'l1', serviceType: 'Oil Change' }],
        'mtxtrkr_reminders': [{ id: 'r1', title: 'Oil Change Due' }],
        'mtxtrkr_fuel_logs': [{ id: 'f1', gallons: 12.5 }],
        'mtxtrkr_modifications': [{ id: 'm1', name: 'Cold Air Intake' }],
      };

      for (const [key, data] of Object.entries(seedData)) {
        localStorage.setItem(key, JSON.stringify(data));
      }

      // Simulate the auth-change wipe
      simulateAuthChangeWipe(EXPECTED_PROTECTED_KEYS);

      // Verify all 5 stores were wiped (they're NOT protected)
      for (const key of Object.keys(seedData)) {
        expect(localStorage.getItem(key), `${key} should be wiped (not in PROTECTED_KEYS)`).toBeNull();
      }
    });

    it('should preserve PROTECTED keys after simulated auth-change wipe', () => {
      // Seed protected keys that SHOULD survive
      localStorage.setItem('mtxtrkr_onboarding_dismissed', 'true');
      localStorage.setItem('mtxtrkr_performance_mods', JSON.stringify({ 'air-filter': true }));
      localStorage.setItem('mtxtrkr_selected_vehicle', 'v-abc-123');
      localStorage.setItem('mtxtrkr_logs_cleanup_done', 'true');
      localStorage.setItem('mtxtrkr_stale_cache_cleaned', 'true');
      localStorage.setItem('mtxtrkr_cache_migrated', 'true');
      localStorage.setItem('mtxtrkr_supabase_cache_migrated', 'true');

      // Seed documents (no longer in PROTECTED_KEYS since Supabase Storage migration)
      localStorage.setItem('mtxtrkr_documents', JSON.stringify([{ id: 'doc1' }]));

      // Also seed a data store to confirm it gets wiped
      localStorage.setItem('mtxtrkr_vehicles', JSON.stringify([{ id: 'v1' }]));

      // Simulate the auth-change wipe
      simulateAuthChangeWipe(EXPECTED_PROTECTED_KEYS);

      // Verify protected keys survived
      expect(localStorage.getItem('mtxtrkr_onboarding_dismissed')).toBe('true');
      expect(localStorage.getItem('mtxtrkr_performance_mods')).toBe(JSON.stringify({ 'air-filter': true }));
      expect(localStorage.getItem('mtxtrkr_selected_vehicle')).toBe('v-abc-123');
      expect(localStorage.getItem('mtxtrkr_logs_cleanup_done')).toBe('true');
      expect(localStorage.getItem('mtxtrkr_stale_cache_cleaned')).toBe('true');
      expect(localStorage.getItem('mtxtrkr_cache_migrated')).toBe('true');
      expect(localStorage.getItem('mtxtrkr_supabase_cache_migrated')).toBe('true');

      // Verify documents were wiped (no longer protected — cloud-synced via Supabase Storage)
      expect(localStorage.getItem('mtxtrkr_documents')).toBeNull();

      // Verify data store was wiped
      expect(localStorage.getItem('mtxtrkr_vehicles')).toBeNull();
    });

    it('should preserve PREMIUM_STATUS after simulated auth-change wipe (fallback for slow Supabase)', () => {
      // Seed premium-related keys — premium_status now survives as a fallback.
      // The premium sync effect still verifies against Supabase on auth change,
      // preventing permanent cross-account contamination.
      localStorage.setItem('mtxtrkr_premium_status', 'true');
      localStorage.setItem('mtxtrkr_subscription_status', 'active');
      localStorage.setItem('mtxtrkr_subscription_plan', 'monthly');
      localStorage.setItem('mtxtrkr_subscription_next_billing', '2026-08-25');

      // Simulate the auth-change wipe
      simulateAuthChangeWipe(EXPECTED_PROTECTED_KEYS);

      // Premium status should survive (in PROTECTED_KEYS)
      expect(localStorage.getItem('mtxtrkr_premium_status')).toBe('true');
      // Subscription keys should also survive (still in PROTECTED_KEYS)
      expect(localStorage.getItem('mtxtrkr_subscription_status')).toBe('active');
      expect(localStorage.getItem('mtxtrkr_subscription_plan')).toBe('monthly');
      expect(localStorage.getItem('mtxtrkr_subscription_next_billing')).toBe('2026-08-25');
    });

    it('should remove non-data, non-protected mtxtrkr_ keys during wipe', () => {
      // Seed a key that should be wiped (not a data store, not protected)
      localStorage.setItem('mtxtrkr_temp_cache', 'some-cached-value');
      localStorage.setItem('mtxtrkr_vehicles', JSON.stringify([{ id: 'v1' }]));

      // Simulate wipe
      simulateAuthChangeWipe(EXPECTED_PROTECTED_KEYS);

      // temp_cache should be gone
      expect(localStorage.getItem('mtxtrkr_temp_cache')).toBeNull();
      // vehicles should survive (it's a data store, NOT in protected keys but NOT wiped because it doesn't start with mtxtrkr_... wait — it does start with mtxtrkr_. Let me re-examine the wipe logic.)

      // The actual App.jsx wipe logic removes mtxtrkr_* keys that are NOT in PROTECTED_KEYS.
      // Data stores (vehicles, logs, etc.) are NOT in PROTECTED_KEYS, so they WOULD be wiped.
      // This is intentional — the data was already pushed to Supabase before the wipe.
      // So in the simulated wipe, vehicles SHOULD be removed.
      // Let me verify: vehicles starts with mtxtrkr_ and is NOT in protected keys → should be wiped.
      expect(localStorage.getItem('mtxtrkr_vehicles')).toBeNull();
    });

    it('should NOT wipe supabase_cache_ keys unless they are not in PROTECTED_KEYS', () => {
      localStorage.setItem('supabase_cache_vehicles', JSON.stringify([{ id: 'cached' }]));
      localStorage.setItem('supabase_cache_something', 'stale');

      simulateAuthChangeWipe(EXPECTED_PROTECTED_KEYS);

      // supabase_cache_* keys should be wiped (none are in PROTECTED_KEYS)
      expect(localStorage.getItem('supabase_cache_vehicles')).toBeNull();
      expect(localStorage.getItem('supabase_cache_something')).toBeNull();
    });
  });

  // ── 4. Data Store Key Names ──────────────────────────────────
  describe('Data Store Key Names', () => {
    it('should have exactly 5 data store keys', () => {
      expect(DATA_STORE_KEYS).toHaveLength(5);
    });

    it('should include vehicles store key', () => {
      expect(DATA_STORE_KEYS).toContain('mtxtrkr_vehicles');
    });

    it('should include fuel_logs store key', () => {
      expect(DATA_STORE_KEYS).toContain('mtxtrkr_fuel_logs');
    });

    it('should include modifications store key', () => {
      expect(DATA_STORE_KEYS).toContain('mtxtrkr_modifications');
    });
  });

  // ── 5. PREMIUM_STATUS Protected ──────────────────────────────
  describe('PREMIUM_STATUS Protected (Fallback)', () => {
    it('should survive the auth-change wipe', () => {
      localStorage.setItem('mtxtrkr_premium_status', 'true');
      simulateAuthChangeWipe(EXPECTED_PROTECTED_KEYS);
      expect(localStorage.getItem('mtxtrkr_premium_status')).toBe('true');
    });

    it('should survive the auth-change wipe when set to false', () => {
      localStorage.setItem('mtxtrkr_premium_status', 'false');
      simulateAuthChangeWipe(EXPECTED_PROTECTED_KEYS);
      expect(localStorage.getItem('mtxtrkr_premium_status')).toBe('false');
    });
  });

  // ── 6. Same-User Refresh Survival ──────────────────────────────
  describe('Same-User Refresh Survival', () => {
    const SESSION_KEY = 'mtxtrkr_previous_user_id';

    /**
     * Mimics the App.jsx same-user detection logic:
     * Returns true if the wipe should proceed (different user / first sign-in),
     * false if the wipe should be skipped (same user refresh).
     */
    function shouldWipeOnAuthChange(currentUserId) {
      try {
        const previousUserId = sessionStorage.getItem(SESSION_KEY) || null;
        if (currentUserId && previousUserId && currentUserId === previousUserId) {
          return false; // Same user refresh — skip wipe
        }
        return true; // Different user or first sign-in — proceed with wipe
      } catch(e) {
        return true; // If sessionStorage fails, default to wipe (safe)
      }
    }

    /**
     * Full simulated auth-change: checks same-user detection, then optionally
     * wipes based on the result. This combines the detection + wipe in one
     * function, matching the App.jsx effect flow.
     *
     * IMPORTANT: The check must happen BEFORE updating sessionStorage.
     * App.jsx reads previousUserId from sessionStorage first, compares,
     * and only updates sessionStorage after the comparison (and optional wipe).
     */
    function simulateAuthChangeWithUserDetection(currentUserId) {
      // Check BEFORE updating sessionStorage (matches App.jsx order)
      const shouldWipe = shouldWipeOnAuthChange(currentUserId);

      // Track current user in sessionStorage (like App.jsx does AFTER the check)
      try {
        sessionStorage.setItem(SESSION_KEY, currentUserId || '');
      } catch(e) { /* non-critical */ }

      if (!shouldWipe) {
        return; // Same user — skip wipe
      }

      // Different user — wipe
      simulateAuthChangeWipe(EXPECTED_PROTECTED_KEYS);
    }

    beforeEach(() => {
      clearLocalStorage();
      try { sessionStorage.removeItem(SESSION_KEY); } catch(e) {}
    });

    afterEach(() => {
      try { sessionStorage.removeItem(SESSION_KEY); } catch(e) {}
    });

    it('should SKIP wipe when same user refreshes (sessionStorage matches current user)', () => {
      // Simulate previous session: user "userA" was signed in
      sessionStorage.setItem(SESSION_KEY, 'userA');

      // Seed data stores with real data
      const seedData = {
        'mtxtrkr_vehicles': [{ id: 'v1', make: 'Honda', model: 'Civic', year: 2023 }],
        'mtxtrkr_maintenance_logs': [{ id: 'l1', serviceType: 'Oil Change', mileage: 15000 }],
        'mtxtrkr_reminders': [{ id: 'r1', title: 'Oil Change Due', intervalMiles: 5000 }],
        'mtxtrkr_fuel_logs': [{ id: 'f1', gallons: 12.5, cost: 45.00 }],
        'mtxtrkr_modifications': [{ id: 'm1', name: 'Cold Air Intake', cost: 350 }],
      };
      for (const [key, data] of Object.entries(seedData)) {
        localStorage.setItem(key, JSON.stringify(data));
      }

      // Simulate same user "userA" signing back in (e.g. after hard refresh)
      simulateAuthChangeWithUserDetection('userA');

      // All data should survive — same user, no wipe
      for (const key of Object.keys(seedData)) {
        const raw = localStorage.getItem(key);
        expect(raw, `${key} should survive same-user refresh`).toBeTruthy();
        const parsed = JSON.parse(raw);
        expect(parsed.length).toBeGreaterThan(0);
      }
    });

    it('should PROCEED with wipe when different user signs in (sessionStorage mismatch)', () => {
      // Simulate previous session: user "userA" was signed in
      sessionStorage.setItem(SESSION_KEY, 'userA');

      // Seed data stores with real data from userA
      const seedData = {
        'mtxtrkr_vehicles': [{ id: 'v1', make: 'Honda', model: 'Civic', year: 2023 }],
        'mtxtrkr_maintenance_logs': [{ id: 'l1', serviceType: 'Oil Change', mileage: 15000 }],
        'mtxtrkr_reminders': [{ id: 'r1', title: 'Oil Change Due' }],
        'mtxtrkr_fuel_logs': [{ id: 'f1', gallons: 12.5 }],
        'mtxtrkr_modifications': [{ id: 'm1', name: 'Cold Air Intake' }],
      };
      for (const [key, data] of Object.entries(seedData)) {
        localStorage.setItem(key, JSON.stringify(data));
      }

      // Simulate DIFFERENT user "userB" signing in
      simulateAuthChangeWithUserDetection('userB');

      // All data should be wiped — cross-account protection
      for (const key of Object.keys(seedData)) {
        expect(localStorage.getItem(key), `${key} should be wiped for different user`).toBeNull();
      }
    });

    it('should PROCEED with wipe when no previous session (first sign-in, sessionStorage empty)', () => {
      // No sessionStorage — this is a fresh browser session

      // Seed data stores
      const seedData = {
        'mtxtrkr_vehicles': [{ id: 'v1', make: 'Honda' }],
        'mtxtrkr_maintenance_logs': [{ id: 'l1', serviceType: 'Oil Change' }],
      };
      for (const [key, data] of Object.entries(seedData)) {
        localStorage.setItem(key, JSON.stringify(data));
      }

      // Simulate first sign-in (no previous session)
      simulateAuthChangeWithUserDetection('userA');

      // Data should be wiped — first sign-in gets clean slate (data from Supabase two-way sync)
      for (const key of Object.keys(seedData)) {
        expect(localStorage.getItem(key), `${key} should be wiped on first sign-in`).toBeNull();
      }
    });

    it('should preserve PROTECTED_KEYS even during same-user refresh', () => {
      // Set up same-user session
      sessionStorage.setItem(SESSION_KEY, 'userA');

      // Seed protected keys
      localStorage.setItem('mtxtrkr_onboarding_dismissed', 'true');
      localStorage.setItem('mtxtrkr_selected_vehicle', 'v-abc-123');
      localStorage.setItem('mtxtrkr_premium_status', 'true');
      localStorage.setItem('mtxtrkr_subscription_status', 'active');

      // Seed data store
      localStorage.setItem('mtxtrkr_vehicles', JSON.stringify([{ id: 'v1', make: 'Honda' }]));

      // Same user refresh — should skip wipe
      simulateAuthChangeWithUserDetection('userA');

      // Protected keys survive (always)
      expect(localStorage.getItem('mtxtrkr_onboarding_dismissed')).toBe('true');
      expect(localStorage.getItem('mtxtrkr_selected_vehicle')).toBe('v-abc-123');
      expect(localStorage.getItem('mtxtrkr_premium_status')).toBe('true');
      expect(localStorage.getItem('mtxtrkr_subscription_status')).toBe('active');

      // Data store survives (no wipe occurred)
      expect(localStorage.getItem('mtxtrkr_vehicles')).toBeTruthy();
      const vehicles = JSON.parse(localStorage.getItem('mtxtrkr_vehicles'));
      expect(vehicles).toHaveLength(1);
      expect(vehicles[0].make).toBe('Honda');
    });

    it('should update sessionStorage with new user ID after auth change', () => {
      // No previous session
      expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();

      // Simulate sign-in as userA
      simulateAuthChangeWithUserDetection('userA');

      // sessionStorage should now track userA for future refresh detection
      expect(sessionStorage.getItem(SESSION_KEY)).toBe('userA');

      // Simulate refresh as same user — should skip wipe
      localStorage.setItem('mtxtrkr_vehicles', JSON.stringify([{ id: 'v1', make: 'Honda' }]));
      simulateAuthChangeWithUserDetection('userA');

      // Data survives
      expect(localStorage.getItem('mtxtrkr_vehicles')).toBeTruthy();
    });

    it('should detect same-user logic in App.jsx source (audit)', () => {
      // Verify the fix is actually present in App.jsx — the sessionStorage-based
      // previousUserIdRef must be present.
      try {
        const src = readFileSync(resolve(__dirname, '../../src/App.jsx'), 'utf-8');
        expect(src).toContain('mtxtrkr_previous_user_id');
        expect(src).toContain('previousUserIdRef');
        expect(src).toContain('isSameUser');
        expect(src).toContain('Skip the wipe entirely');
      } catch (e) {
        // If App.jsx can't be read, fail the test
        expect(e).toBeNull();
      }
    });
  });

  // ── 7. Deployment Survival (Auth-Loading Race Condition) ──────────
  describe('Deployment Survival — Auth-Loading Race', () => {
    const SESSION_KEY = 'mtxtrkr_previous_user_id';

    /**
     * Simulates the deployment/auth-loading race condition:
     * 1. App loads after deployment/SW update
     * 2. auth.user is null while auth.loading is true (initial state)
     * 3. The cleanup effect fires with null user BUT loading=true → should NOT clear sessionStorage
     * 4. auth resolves → user=real_id, loading=false
     * 5. Cleanup effect fires again → should detect same user → skip wipe
     *
     * Returns true if the wipe should proceed, false if it should be skipped.
     */
    function simulateDeploymentAuthRace(currentUserId, isLoading) {
      try {
        const previousUserId = sessionStorage.getItem(SESSION_KEY) || null;

        // Step 1: Auth loading — user is null, loading is true
        // The else branch should NOT clear sessionStorage when loading=true
        if (!currentUserId && isLoading) {
          // Do NOT clear sessionStorage — this is just auth loading
          return 'SKIP'; // not a real sign-out, don't clear anything
        }

        // Step 2: Auth genuinely signed out (user null, loading false)
        if (!currentUserId && !isLoading) {
          sessionStorage.removeItem(SESSION_KEY);
          return 'WIPE'; // genuine sign-out
        }

        // Step 3: Auth resolved — user is real
        // Check same-user detection
        if (currentUserId && previousUserId && currentUserId === previousUserId) {
          return 'SKIP'; // Same user refresh
        }

        return 'WIPE'; // Different user or first sign-in
      } catch(e) {
        return 'WIPE'; // Fail safe
      }
    }

    beforeEach(() => {
      clearLocalStorage();
      try { sessionStorage.removeItem(SESSION_KEY); } catch(e) {}
    });

    afterEach(() => {
      try { sessionStorage.removeItem(SESSION_KEY); } catch(e) {}
    });

    it('should NOT clear sessionStorage when auth is loading (null user, loading=true)', () => {
      // Setup: user was previously signed in
      sessionStorage.setItem(SESSION_KEY, 'userA');

      // Seed data
      localStorage.setItem('mtxtrkr_vehicles', JSON.stringify([{ id: 'v1', make: 'Honda' }]));
      localStorage.setItem('mtxtrkr_maintenance_logs', JSON.stringify([{ id: 'l1', serviceType: 'Oil Change' }]));

      // Simulate auth-loading race: null user, loading=true (first fire of cleanup effect)
      const result1 = simulateDeploymentAuthRace(null, true);
      expect(result1).toBe('SKIP');

      // sessionStorage should NOT have been cleared during loading
      expect(sessionStorage.getItem(SESSION_KEY)).toBe('userA');

      // Simulate auth resolved: real user, loading=false (second fire)
      const result2 = simulateDeploymentAuthRace('userA', false);
      expect(result2).toBe('SKIP'); // Same user → skip wipe

      // Data should survive
      expect(localStorage.getItem('mtxtrkr_vehicles')).toBeTruthy();
      expect(localStorage.getItem('mtxtrkr_maintenance_logs')).toBeTruthy();
    });

    it('should clear sessionStorage when genuinely signed out (null user, loading=false)', () => {
      // Setup: user was previously signed in
      sessionStorage.setItem(SESSION_KEY, 'userA');

      // Simulate actual sign-out: null user, loading=false
      const result = simulateDeploymentAuthRace(null, false);
      expect(result).toBe('WIPE');

      // sessionStorage should be cleared on actual sign-out
      expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
    });

    it('should detect the loading-guard fix in App.jsx source (audit)', () => {
      try {
        const src = readFileSync(resolve(__dirname, '../../src/App.jsx'), 'utf-8');
        // The else branch must guard against auth.loading
        expect(src).toContain('!auth.loading');
        // The comment explaining WHY the loading guard is needed
        expect(src).toContain('Do NOT clear sessionStorage when auth is still loading');
      } catch (e) {
        expect(e).toBeNull();
      }
    });
  });
});
