import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

// Generic hook for localStorage CRUD operations with offline-first sync simulation
function useLocalStorage(key, initialValue = []) {
  const [data, setData] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);

  const update = useCallback((newData) => {
    setData(newData);
  }, []);

  const add = useCallback((item) => {
    const newItem = { ...item, id: item.id || generateId(), createdAt: new Date().toISOString() };
    setData(prev => {
      const exists = prev.find(p => p.id === newItem.id);
      if (exists) return prev.map(p => p.id === newItem.id ? { ...p, ...newItem, updatedAt: new Date().toISOString() } : p);
      return [...prev, newItem];
    });
    return newItem;
  }, []);

  const updateItem = useCallback((id, updates) => {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ));
  }, []);

  const remove = useCallback((id) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  const getById = useCallback((id) => {
    return data.find(item => item.id === id);
  }, [data]);

  return { data, setData, add, updateItem, remove, getById, update };
}

// Sync simulator hook
export function useSyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(() => localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || null);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const sync = useCallback(async () => {
    setSyncing(true);
    // Simulate cloud sync delay
    await new Promise(r => setTimeout(r, 1500));
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
    setLastSync(now);
    setPendingChanges(0);
    setSyncing(false);
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingChanges > 0) {
      sync();
    }
  }, [isOnline, pendingChanges, sync]);

  const markChanged = useCallback(() => {
    setPendingChanges(prev => prev + 1);
  }, []);

  return { isOnline, lastSync, pendingChanges, syncing, sync, markChanged };
}

export { useLocalStorage };

export default useLocalStorage;