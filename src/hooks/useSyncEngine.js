import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import { sanitizeForStorage } from './useLocalStorage.js';
import { setSubscriptionData } from '../components/SubscriptionManagement.jsx';

/**
 * Sync engine hook — manages localStorage ↔ Supabase data synchronization.
 *
 * Handles:
 * - Two-way sync on sign-in (push local → Supabase, pull Supabase → local)
 * - Background continuous sync (push updated items)
 * - Visibility change handler (push on tab close/hide)
 * - Manual push-to-cloud and pull-from-cloud
 * - Cross-account data isolation (reset on auth change)
 */
export default function useSyncEngine({
  isAuthenticated,
  userId,
  syncStores,
  showSyncError,
  analytics,
  premium,
  setPremium,
  // Individual store references for handleSyncFromCloud and handlePushToCloud
  supabaseVehicles,
  supabaseLogs,
  supabaseReminders,
  supabaseFuelLogs,
  supabaseMods,
  supabaseDocuments,
  localVehicles,
  localLogs,
  localReminders,
  localFuelLogs,
  localMods,
  localDocuments,
}) {
  // ── Initial sync state ────────────────────────────────────────
  const [initialSyncDone, setInitialSyncDone] = useState(false);
  const pushedIdsRef = useRef({});
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ── Reset on auth change ──────────────────────────────────────
  useEffect(() => {
    setInitialSyncDone(false);
    pushedIdsRef.current = {};

    // Fix 1: Capture FULL data snapshot BEFORE resetting React state.
    // This is the safety net — if Supabase has no data for a store after
    // the two-way sync, we restore from this backup so no data is lost.
    const preWipeData = {
      timestamp: new Date().toISOString(),
      userId,
      vehicles: [...(localVehicles.data || [])],
      logs: [...(localLogs.data || [])],
      reminders: [...(localReminders.data || [])],
      fuel_logs: [...(localFuelLogs.data || [])],
      modifications: [...(localMods.data || [])],
      documents: [...(localDocuments.data || [])],
    };

    // Reset all React state for data stores
    localVehicles.setData([]);
    localLogs.setData([]);
    localReminders.setData([]);
    localFuelLogs.setData([]);
    localMods.setData([]);
    localDocuments.setData([]);
    supabaseVehicles.resetData();
    supabaseLogs.resetData();
    supabaseReminders.resetData();
    supabaseFuelLogs.resetData();
    supabaseMods.resetData();
    supabaseDocuments.resetData();

    // Fix 2: 'mtxtrkr_auth_reset_backup' added to PROTECTED_KEYS so it
    // survives the localStorage wipe below — the backup is restored in the
    // two-way sync effect after Supabase data is loaded.
    const PROTECTED_KEYS = [
      'mtxtrkr_premium_status',
      'mtxtrkr_selected_vehicle',
      'mtxtrkr_stale_cache_cleaned',
      'mtxtrkr_cache_migrated',
      'mtxtrkr_supabase_cache_migrated',
      'mtxtrkr_onboarding_dismissed',
      'mtxtrkr_performance_mods',
      'mtxtrkr_auth_reset_backup',
    ];

    // Skip the wipe cycle entirely when userId is falsy (signed out).
    // Only signed-in users trigger the two-way sync that restores from backup.
    if (!userId) return;

    (async () => {
      // Fix 4: Best-effort push of pre-wipe data to Supabase BEFORE clearing
      // localStorage. This gives Supabase every chance to receive the data
      // before the wipe. Failures are silently ignored — the backup (Fixes 1-3)
      // is the real safety net.
      if (isAuthenticated) {
        const keyToField = {
          [STORAGE_KEYS.VEHICLES]: 'vehicles',
          [STORAGE_KEYS.MAINTENANCE_LOGS]: 'logs',
          [STORAGE_KEYS.REMINDERS]: 'reminders',
          'mtxtrkr_fuel_logs': 'fuel_logs',
          'mtxtrkr_modifications': 'modifications',
          [STORAGE_KEYS.DOCUMENTS]: 'documents',
        };
        for (const { supabase, key } of syncStores) {
          const field = keyToField[key];
          if (!field) continue;
          const snapshotData = preWipeData[field] || [];
          if (snapshotData.length === 0) continue;
          // Filter out items already known to Supabase (avoid unnecessary writes)
          const supabaseIds = new Set((supabase.data || []).map(s => s.id));
          const itemsToPush = snapshotData.filter(item => !supabaseIds.has(item.id));
          for (const item of itemsToPush) {
            try {
              await supabase.add(item);
            } catch (_) {
              // Best-effort only — backup is the safety net
            }
          }
        }
      }

      // Fix 1: Save FULL data backup to protected key.
      // Uses sanitizeForStorage to strip large binary fields (receipt images)
      // that would exceed localStorage quota, while keeping all structured data.
      try {
        let backupStr;
        try {
          backupStr = JSON.stringify(preWipeData);
          // Test-write to catch quota errors before the wipe
          localStorage.setItem('mtxtrkr_auth_reset_backup', backupStr);
        } catch (e) {
          if (e.name === 'QuotaExceededError' || e.code === 22) {
            const sanitized = sanitizeForStorage(preWipeData);
            backupStr = JSON.stringify(sanitized);
            localStorage.setItem('mtxtrkr_auth_reset_backup', backupStr);
          } else {
            throw e;
          }
        }
      } catch (e) {
        console.warn('[Cleanup] Failed to save auth-reset backup:', e);
      }

      // Wipe localStorage mtxtrkr_* and supabase_cache_* keys.
      // PROTECTED_KEYS (including the backup we just wrote) are skipped.
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('mtxtrkr_') || key.startsWith('supabase_cache_')) && !PROTECTED_KEYS.includes(key)) {
          localStorage.removeItem(key);
        }
      }
    })();
  }, [userId]);

  // ── Two-way sync on sign-in ────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const allLoaded = !supabaseVehicles.loading && !supabaseLogs.loading && !supabaseReminders.loading && !supabaseFuelLogs.loading && !supabaseMods.loading && !supabaseDocuments.loading;
    if (!allLoaded) return;

    if (initialSyncDone) return;

    (async () => {
      if (!isMountedRef.current) return;
      const confirmedVehicleIds = new Set(
        (supabaseVehicles.data || []).map(v => v.id)
      );
      for (const { local, supabase, key } of syncStores) {
        const localData = local.data || [];
        if (localData.length === 0) continue;
        const supabaseIds = new Set((supabase.data || []).map(s => s.id));
        const itemsToPush = localData.filter(item => !supabaseIds.has(item.id));
        for (const item of itemsToPush) {
          const isVehicleStore = key === STORAGE_KEYS.VEHICLES;
          if (!isVehicleStore) {
            const vehicleId = item.vehicleId || item.vehicle_id;
            if (vehicleId && !confirmedVehicleIds.has(vehicleId)) {
              continue;
            }
          }
          try {
            const result = await supabase.add(item);
            if (isVehicleStore && result && !result.error) {
              confirmedVehicleIds.add(result.id || item.id);
            }
            if (result?.error) {
              console.warn(`[Sync] Failed to push ${item.id} to ${key}:`, result.message);
              if (isMountedRef.current) showSyncError(`Failed to sync ${key.replace('mtxtrkr_', '')} — tap Push to Cloud to retry`);
            }
          } catch (e) {
            console.warn(`[Sync] Failed to push ${item.id} to ${key}:`, e);
            if (isMountedRef.current) showSyncError(`Failed to sync ${key.replace('mtxtrkr_', '')} — tap Push to Cloud to retry`);
          }
        }
      }

      if (!isMountedRef.current) return;
      for (const { key } of syncStores) {
        const cacheKey = `supabase_cache_${key.replace('mtxtrkr_', '')}`;
        localStorage.removeItem(cacheKey);
      }
      for (const { local, supabase, key } of syncStores) {
        const supabaseHasData = supabase.data && supabase.data.length > 0;

        if (supabaseHasData) {
          try {
            localStorage.setItem(key, JSON.stringify(supabase.data));
          } catch (e) {
            if (e.name === 'QuotaExceededError' || e.code === 22) {
              console.warn(`[Sync] Quota exceeded for "${key}", trying sanitized...`);
              try {
                const sanitized = sanitizeForStorage(supabase.data);
                localStorage.setItem(key, JSON.stringify(sanitized));
              } catch (e2) {
                console.warn(`[Sync] Still too large after sanitization for "${key}", keeping in memory only`, e2);
                if (isMountedRef.current) showSyncError(`Local storage full — could not save ${key.replace('mtxtrkr_', '')}. Free up space and try again.`);
              }
            } else {
              console.warn(`[Sync] Failed to write "${key}" to localStorage:`, e);
              if (isMountedRef.current) showSyncError(`Could not save ${key.replace('mtxtrkr_', '')} locally — try refreshing.`);
            }
          }
          if (isMountedRef.current) local.setData(supabase.data);
        } else {
          try {
            const localRaw = localStorage.getItem(key);
            const localParsed = localRaw ? JSON.parse(localRaw) : [];
            if (Array.isArray(localParsed) && localParsed.length > 0 &&
                (!local.data || local.data.length === 0)) {
              if (isMountedRef.current) local.setData(localParsed);
            }
          } catch (e) {
            // Ignore corrupt localStorage
          }
        }
      }
      // Fix 3: Restore from auth-reset backup if Supabase has no data.
      // The userId effect saves a full data snapshot to mtxtrkr_auth_reset_backup
      // BEFORE wiping localStorage. If the two-way push/pull above didn't populate
      // a store (e.g. Supabase was empty for logs), restore from the backup so no
      // data is permanently lost.
      const backupRaw = localStorage.getItem('mtxtrkr_auth_reset_backup');
      if (backupRaw) {
        try {
          const backup = JSON.parse(backupRaw);
          // Map backup fields → { local, key, supabase } for each store
          const backupFieldToStore = [
            { field: 'vehicles', local: localVehicles, key: STORAGE_KEYS.VEHICLES, supabase: supabaseVehicles },
            { field: 'logs', local: localLogs, key: STORAGE_KEYS.MAINTENANCE_LOGS, supabase: supabaseLogs },
            { field: 'reminders', local: localReminders, key: STORAGE_KEYS.REMINDERS, supabase: supabaseReminders },
            { field: 'fuel_logs', local: localFuelLogs, key: 'mtxtrkr_fuel_logs', supabase: supabaseFuelLogs },
            { field: 'modifications', local: localMods, key: 'mtxtrkr_modifications', supabase: supabaseMods },
            { field: 'documents', local: localDocuments, key: STORAGE_KEYS.DOCUMENTS, supabase: supabaseDocuments },
          ];
          for (const { field, local, key, supabase } of backupFieldToStore) {
            const backupData = backup[field];
            if (!Array.isArray(backupData) || backupData.length === 0) continue;
            const supabaseHasData = supabase.data && supabase.data.length > 0;
            if (!supabaseHasData) {
              // Supabase returned no data for this store — restore from backup
              try {
                localStorage.setItem(key, JSON.stringify(backupData));
              } catch (e) {
                if (e.name === 'QuotaExceededError' || e.code === 22) {
                  try {
                    const sanitized = sanitizeForStorage(backupData);
                    localStorage.setItem(key, JSON.stringify(sanitized));
                  } catch (_) { /* best effort */ }
                }
              }
              if (isMountedRef.current) local.setData(backupData);
            }
          }
        } catch (e) {
          console.warn('[Sync] Failed to restore from auth-reset backup:', e);
        }
        // Remove the backup — it's a one-shot safety net, don't let it accumulate
        localStorage.removeItem('mtxtrkr_auth_reset_backup');
      }

      if (isMountedRef.current) setInitialSyncDone(true);
    })();
  }, [
    isAuthenticated, userId, initialSyncDone,
    supabaseVehicles.loading, supabaseLogs.loading, supabaseReminders.loading, supabaseFuelLogs.loading, supabaseMods.loading, supabaseDocuments.loading,
    supabaseVehicles.data, supabaseLogs.data, supabaseReminders.data, supabaseFuelLogs.data, supabaseMods.data, supabaseDocuments.data
  ]);

  // ── Background continuous sync ────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    (async () => {
      if (!isMountedRef.current) return;
      const confirmedVehicleIds = new Set(
        (supabaseVehicles.data || []).map(v => v.id)
      );
      for (const { local, supabase, key } of syncStores) {
        const localData = local.data || [];
        if (localData.length === 0) continue;

        const itemsToSync = localData.filter(item => {
          const lastPushed = pushedIdsRef.current[item.id];
          if (!lastPushed) return true;
          const itemUpdated = item.updatedAt || item.createdAt || '';
          return itemUpdated > lastPushed;
        });
        if (itemsToSync.length === 0) continue;

        for (const item of itemsToSync) {
          const isVehicleStore = key === STORAGE_KEYS.VEHICLES;
          if (!isVehicleStore) {
            const vehicleId = item.vehicleId || item.vehicle_id;
            if (vehicleId && !confirmedVehicleIds.has(vehicleId)) {
              continue;
            }
          }
          const itemTimestamp = item.updatedAt || item.createdAt || new Date().toISOString();
          pushedIdsRef.current[item.id] = itemTimestamp;
          try {
            const result = await supabase.add(item);
            if (isVehicleStore && result && !result.error) {
              confirmedVehicleIds.add(result.id || item.id);
            }
            if (result?.error) {
              console.error(`[Sync] Failed to push ${item.id} to ${key}:`, result.message);
              if (isMountedRef.current) showSyncError(`${key.replace('mtxtrkr_', '')}: failed to sync ${item.id} — tap Push to Cloud to retry`);
              delete pushedIdsRef.current[item.id];
            }
          } catch (e) {
            console.error(`[Sync] Failed to push ${item.id} to ${key}:`, e);
            if (isMountedRef.current) showSyncError(`${key.replace('mtxtrkr_', '')}: failed to sync ${item.id} — tap Push to Cloud to retry`);
            delete pushedIdsRef.current[item.id];
          }
        }
      }
    })();
  }, [isAuthenticated, userId,
    localVehicles.data, localLogs.data, localReminders.data,
    localFuelLogs.data, localMods.data, localDocuments.data
  ]);

  // ── Visibility change handler ──────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        if (!isMountedRef.current) return;
        const confirmedVehicleIds = new Set(
          (supabaseVehicles.data || []).map(v => v.id)
        );
        for (const { local, supabase, key } of syncStores) {
          const localData = local.data || [];
          if (localData.length === 0) continue;
          const itemsToSync = localData.filter(item => {
            const lastPushed = pushedIdsRef.current[item.id];
            if (!lastPushed) return true;
            const itemUpdated = item.updatedAt || item.createdAt || '';
            return itemUpdated > lastPushed;
          });
          if (itemsToSync.length === 0) continue;
          for (const item of itemsToSync) {
            const isVehicleStore = key === STORAGE_KEYS.VEHICLES;
            if (!isVehicleStore) {
              const vehicleId = item.vehicleId || item.vehicle_id;
              if (vehicleId && !confirmedVehicleIds.has(vehicleId)) {
                continue;
              }
            }
            const itemTimestamp = item.updatedAt || item.createdAt || new Date().toISOString();
            pushedIdsRef.current[item.id] = itemTimestamp;
            try {
              const result = await supabase.add(item);
              if (isVehicleStore && result && !result.error) {
                confirmedVehicleIds.add(result.id || item.id);
              }
              if (result?.error) {
                console.error('[VisibilitySync] Push failed:', result.message);
                if (isMountedRef.current) showSyncError(`${key.replace('mtxtrkr_', '')}: failed to sync ${item.id} — tap Push to Cloud to retry`);
                delete pushedIdsRef.current[item.id];
              }
            } catch (e) {
              console.error('[VisibilitySync] Push failed:', e);
              if (isMountedRef.current) showSyncError(`${key.replace('mtxtrkr_', '')}: failed to sync ${item.id} — tap Push to Cloud to retry`);
              delete pushedIdsRef.current[item.id];
            }
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, userId,
    localVehicles.data, localLogs.data, localReminders.data,
    localFuelLogs.data, localMods.data, localDocuments.data
  ]);

  // ── Pull from cloud ────────────────────────────────────────────
  const handleSyncFromCloud = useCallback(async () => {
    if (!userId) return { success: false, failedStores: [] };
    pushedIdsRef.current = {};
    const tables = [
      { table: 'vehicles', local: localVehicles, key: STORAGE_KEYS.VEHICLES },
      { table: 'maintenance_logs', local: localLogs, key: STORAGE_KEYS.MAINTENANCE_LOGS },
      { table: 'reminders', local: localReminders, key: STORAGE_KEYS.REMINDERS },
      { table: 'fuel_logs', local: localFuelLogs, key: 'mtxtrkr_fuel_logs' },
      { table: 'modifications', local: localMods, key: 'mtxtrkr_modifications' },
      { table: 'documents', local: localDocuments, key: STORAGE_KEYS.DOCUMENTS },
    ];
    const toCamel = (str) => str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
    const keysToCamel = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(keysToCamel);
      const newObj = {};
      for (const key in obj) {
        newObj[toCamel(key)] = obj[key];
      }
      return newObj;
    };
    const failedStores = [];
    for (const { table, local, key } of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        const camelData = keysToCamel(data || []);
        if (camelData.length > 0) {
          localStorage.setItem(key, JSON.stringify(camelData));
          local.setData(camelData);
        }
      } catch (err) {
        console.error(`[SyncFromCloud] Error fetching ${table}:`, err);
        failedStores.push(table);
      }
    }
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('premium')
        .eq('id', userId)
        .single();
      if (profile?.premium === true) {
        localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
        setPremium(true);
        setSubscriptionData({ plan: 'monthly', status: 'active', nextBilling: null });
      }
    } catch (err) {
      console.error('[SyncFromCloud] Error fetching premium status:', err);
    }
    analytics.track('sync_from_cloud', { failedStores: failedStores.length > 0 ? failedStores : undefined });
    return { success: failedStores.length === 0, failedStores };
  }, [userId, localVehicles, localLogs, localReminders, localFuelLogs, localMods, localDocuments, setPremium, analytics]);

  // ── Push to cloud ──────────────────────────────────────────────
  const handlePushToCloud = useCallback(async () => {
    if (!userId) return { success: false, failedStores: [] };
    const stores = [
      { local: localVehicles, supabase: supabaseVehicles, table: 'vehicles' },
      { local: localLogs, supabase: supabaseLogs, table: 'maintenance_logs' },
      { local: localReminders, supabase: supabaseReminders, table: 'reminders' },
      { local: localFuelLogs, supabase: supabaseFuelLogs, table: 'fuel_logs' },
      { local: localMods, supabase: supabaseMods, table: 'modifications' },
      { local: localDocuments, supabase: supabaseDocuments, table: 'documents' },
    ];
    const confirmedVehicleIds = new Set(
      (supabaseVehicles.data || []).map(v => v.id)
    );
    const storesWithErrors = new Set();
    const failedCounts = {};
    const trackStoreFailure = (table) => {
      storesWithErrors.add(table);
      failedCounts[table] = (failedCounts[table] || 0) + 1;
    };

    for (const { local, supabase, table } of stores) {
      const localData = local.data || [];
      if (localData.length === 0) continue;
      const supabaseMap = new Map((supabase.data || []).map(s => [s.id, s]));
      const itemsToSync = localData.filter(item => {
        const cloud = supabaseMap.get(item.id);
        if (!cloud) return true;
        const localUpdated = item.updatedAt || item.createdAt || '';
        const cloudUpdated = cloud.updatedAt || cloud.createdAt || '';
        return localUpdated > cloudUpdated;
      });
      if (itemsToSync.length === 0) continue;
      const now = new Date().toISOString();
      for (const item of itemsToSync) {
        const isVehicleStore = table === 'vehicles';
        if (!isVehicleStore) {
          const vehicleId = item.vehicleId || item.vehicle_id;
          if (vehicleId && !confirmedVehicleIds.has(vehicleId)) {
            continue;
          }
        }
        let result;
        try {
          result = await supabase.add(item);
        } catch (error) {
          console.error(`[PushToCloud] Unexpected error pushing ${item.id} to ${table}:`, error);
          trackStoreFailure(table);
          continue;
        }

        if (isVehicleStore && result && !result.error) {
          confirmedVehicleIds.add(result.id || item.id);
        }
        if (result?.error) {
          trackStoreFailure(table);
        } else {
          pushedIdsRef.current[item.id] = item.updatedAt || item.createdAt || now;
        }
      }
    }

    const failedStores = Object.entries(failedCounts).map(([store, failedCount]) => ({
      store,
      failedCount,
    }));

    if (failedStores.length > 0) {
      showSyncError('Some items failed to push — try again');
    }

    if (!storesWithErrors.has('vehicles')) supabaseVehicles.clearAllFailedWrites();
    if (!storesWithErrors.has('maintenance_logs')) supabaseLogs.clearAllFailedWrites();
    if (!storesWithErrors.has('reminders')) supabaseReminders.clearAllFailedWrites();
    if (!storesWithErrors.has('fuel_logs')) supabaseFuelLogs.clearAllFailedWrites();
    if (!storesWithErrors.has('modifications')) supabaseMods.clearAllFailedWrites();
    if (!storesWithErrors.has('documents')) supabaseDocuments.clearAllFailedWrites();

    if (premium) {
      localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
      await supabase.from('profiles').upsert({ id: userId, premium: true });
    }
    analytics.track('push_to_cloud', {
      failedStores: failedStores.length > 0 ? failedStores : undefined,
    });
    return { success: failedStores.length === 0, failedStores };
  }, [userId, premium, localVehicles, localLogs, localReminders, localFuelLogs, localMods, localDocuments, supabaseVehicles, supabaseLogs, supabaseReminders, supabaseFuelLogs, supabaseMods, supabaseDocuments, analytics]);

  return {
    handleSyncFromCloud,
    handlePushToCloud,
  };
}
