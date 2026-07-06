import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Helper to convert object keys to snake_case for Postgres
const toSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const keysToSnake = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const newObj = {};
  for (const key in obj) {
    newObj[toSnakeCase(key)] = obj[key];
  }
  return newObj;
};

// Helper to convert object keys to camelCase for React
const toCamelCase = (str) => str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
const keysToCamel = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(keysToCamel);
  const newObj = {};
  for (const key in obj) {
    newObj[toCamelCase(key)] = obj[key];
  }
  return newObj;
};

/**
 * Hook to fetch and manage data from Supabase with localStorage fallback.
 * Provides offline-capable CRUD operations.
 */
export function useSupabaseData(tableName, userId, filterColumn = 'user_id') {
  const [data, setData] = useState(() => {
    // Load from localStorage cache on init
    try {
      const cached = localStorage.getItem(`supabase_${tableName}`);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cache data to localStorage
  const cacheData = useCallback((newData) => {
    localStorage.setItem(`supabase_${tableName}`, JSON.stringify(newData));
  }, [tableName]);

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: result, error: err } = await supabase
        .from(tableName)
        .select('*')
        .eq(filterColumn, userId)
        .order('created_at', { ascending: false });

      if (err) throw err;
      const camelData = keysToCamel(result || []);
      setData(camelData);
      // Only overwrite cache if we got results, or if cache was already empty
      // This prevents realtime race conditions from wiping valid cached data
      const prevCache = JSON.parse(localStorage.getItem(`supabase_${tableName}`) || '[]');
      if (camelData.length > 0 || prevCache.length === 0) {
        cacheData(camelData);
      }
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${tableName}:`, err);
      setError(err.message);
      // Fallback to cached data
    } finally {
      setLoading(false);
    }
  }, [tableName, userId, cacheData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!userId) return;
    const subscription = supabase
      .channel(`${tableName}-changes`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: tableName, filter: `${filterColumn}=eq.${userId}` },
        (payload) => {
          // Refresh data when changes occur
          fetchData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [tableName, userId, fetchData]);

  // Insert a new record
  const add = useCallback(async (item) => {
    if (!userId) return null;
    const snakeItem = keysToSnake({ ...item, userId });
    try {
      const { data: result, error: err } = await supabase
        .from(tableName)
        .insert([snakeItem])
        .select()
        .single();

      if (err) throw err;
      const camelResult = keysToCamel(result);
      setData(prev => {
        const newData = [camelResult, ...prev];
        cacheData(newData);
        return newData;
      });
      return camelResult;
    } catch (err) {
      console.error(`Error inserting into ${tableName}:`, err);
      // Fallback: add to local state
      const fallback = { ...item, id: item.id || crypto.randomUUID(), userId, createdAt: new Date().toISOString() };
      setData(prev => {
        const newData = [fallback, ...prev];
        cacheData(newData);
        return newData;
      });
      return fallback;
    }
  }, [tableName, userId, data, cacheData]);

  // Update a record
  const updateItem = useCallback(async (id, updates) => {
    const snakeUpdates = keysToSnake({ ...updates, updatedAt: new Date().toISOString() });
    try {
      const { error: err } = await supabase
        .from(tableName)
        .update(snakeUpdates)
        .eq('id', id)
        .eq(filterColumn, userId);

      if (err) throw err;
      setData(prev => {
        const newData = prev.map(item =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
        );
        cacheData(newData);
        return newData;
      });
    } catch (err) {
      console.error(`Error updating ${tableName}:`, err);
      // Fallback to local update
      setData(prev => prev.map(item =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      ));
    }
  }, [tableName, userId, data, cacheData]);

  // Delete a record
  const remove = useCallback(async (id) => {
    try {
      const { error: err } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
        .eq(filterColumn, userId);

      if (err) throw err;
      const newData = data.filter(item => item.id !== id);
      setData(newData);
      cacheData(newData);
    } catch (err) {
      console.error(`Error deleting from ${tableName}:`, err);
      // Fallback to local delete
      const newData = data.filter(item => item.id !== id);
      setData(newData);
      cacheData(newData);
    }
  }, [tableName, userId, data, cacheData]);

  // Update entire dataset (for reset)
  const update = useCallback((newData) => {
    setData(newData);
    cacheData(newData);
  }, [cacheData]);

  return { data, setData, loading, error, add, updateItem, remove, update, refetch: fetchData };
}

/**
 * Auth state management hook
 */
export function useSupabaseAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(() => {
    // Detect recovery hash on mount (before Supabase processes it)
    if (window.location.hash && window.location.hash.includes('type=recovery')) return true;
    // Check sessionStorage — set by auth.html redirect page when hash was detected
    try {
      if (sessionStorage.getItem('mtxtrkr_recovery_hash')) return true;
    } catch(e) {}
    return false;
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        supabase.from('profiles').upsert({ id: s.user.id, email: s.user.email });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
      if (session?.user) {
        supabase.from('profiles').upsert({ id: session.user.id, email: session.user.email });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });
    if (data?.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, email: data.user.email });
    }
    return { data, error };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data?.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, email: data.user.email });
    }
    return { data, error };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    // For OAuth, we handle profile update in a separate useEffect or on return
    return { data, error };
  }, []);

  const signInWithApple = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { data, error };
  }, []);

  // Premium status — stored in profiles table so it persists across devices
  const checkPremium = useCallback(async () => {
    if (!user) return false;
    try {
      const { data } = await supabase.from('profiles').select('premium').eq('id', user.id).single();
      return data?.premium === true;
    } catch {
      return localStorage.getItem('mtxtrkr_premium_status') === 'true';
    }
  }, [user]);

  const setPremiumStatus = useCallback(async (userId) => {
    localStorage.setItem('mtxtrkr_premium_status', 'true');
    try {
      await supabase.from('profiles').upsert({ id: userId, premium: true, updated_at: new Date().toISOString() });
    } catch (e) {
      console.warn('Could not save premium to Supabase:', e);
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth.html`,
    });
    return { data, error };
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    // Clear cached data on logout
    ['vehicles', 'maintenance_logs', 'reminders'].forEach(key => {
      localStorage.removeItem(`supabase_${key}`);
    });
  }, []);

  return { user, session, loading, isRecovery, clearRecovery: () => setIsRecovery(false), signUp, signIn, signInWithGoogle, signInWithApple, signOut, checkPremium, setPremiumStatus, resetPassword, updatePassword };
}
