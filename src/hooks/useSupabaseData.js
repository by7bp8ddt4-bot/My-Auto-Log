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
      const cached = localStorage.getItem(`supabase_cache_${tableName}`);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cache data to localStorage
  const cacheData = useCallback((newData) => {
    localStorage.setItem(`supabase_cache_${tableName}`, JSON.stringify(newData));
  }, [tableName]);

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    if (!userId) {
      // Don't set loading=false here — the initial state is already
      // loading=true (data not ready). Setting loading=false would make
      // the sync effect in App.jsx think data is available when it's not,
      // triggering a premature sync with empty data that permanently
      // blocks the actual sync from ever running.
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
      const prevCache = JSON.parse(localStorage.getItem(`supabase_cache_${tableName}`) || '[]');
      
      // If Supabase returned data, use it (latest from server)
      // If Supabase returned empty but we have cached data, keep the cache
      // to prevent data loss from Supabase resets
      if (camelData.length > 0) {
        setData(camelData);
        cacheData(camelData);
      } else if (prevCache.length > 0) {
        // Supabase is empty but cache has data — keep cache as fallback
        setData(prevCache);
      } else {
        setData([]);
        cacheData([]);
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
        .upsert([snakeItem], { onConflict: 'id' })
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
        // Check if item already exists in data to prevent duplicates
        const exists = prev.find(p => p.id === fallback.id);
        if (exists) return prev;
        const newData = [fallback, ...prev];
        cacheData(newData);
        return newData;
      });
      return fallback;
    }
  }, [tableName, userId, cacheData]);

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
  }, [tableName, userId, cacheData]);

  // Delete a record
  const remove = useCallback(async (id) => {
    try {
      const { error: err } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
        .eq(filterColumn, userId);

      if (err) throw err;
      setData(prev => {
        const newData = prev.filter(item => item.id !== id);
        cacheData(newData);
        return newData;
      });
    } catch (err) {
      console.error(`Error deleting from ${tableName}:`, err);
      // Fallback to local delete
      setData(prev => {
        const newData = prev.filter(item => item.id !== id);
        cacheData(newData);
        return newData;
      });
    }
  }, [tableName, userId, cacheData]);

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
  const [authError, setAuthError] = useState(null);
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
    // Check for OAuth callback errors in the URL BEFORE getSession().
    // When Supabase's GoTrue server fails to exchange the OAuth code
    // (e.g. Apple Sign-In with "sign up not completed"), it redirects
    // back with ?error=...&error_description=... in the URL.
    // The Supabase client processes these via _initialize() but the
    // error is silently swallowed — no onAuthStateChange fires, and
    // getSession() returns null. We capture the raw params here so
    // the user sees a meaningful error instead of a blank form.
    if (typeof window !== 'undefined' && !isRecovery) {
      try {
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get('error');
        const errorDesc = params.get('error_description') || params.get('error_code');
        if (errorParam) {
          const rawMsg = errorDesc
            ? `${errorParam}: ${errorDesc}`
            : errorParam;
          const decoded = decodeURIComponent(rawMsg);
          // Guard against empty/meaningless error strings from OAuth redirects
          const msg = (typeof decoded === 'string' && decoded.trim() && decoded !== '{}' && decoded !== '[]' && decoded !== 'null')
            ? decoded
            : 'Sign-in not completed. Please try again.';
          setAuthError(msg);
          // Clean the URL to prevent re-showing on refresh
          if (window.history?.replaceState) {
            const clean = new URL(window.location.href);
            clean.searchParams.delete('error');
            clean.searchParams.delete('error_description');
            clean.searchParams.delete('error_code');
            window.history.replaceState({}, '', clean.toString());
          }
          setLoading(false);
          return; // Don't proceed — there's no session to recover
        }
      } catch(e) {
        // Ignore URL parsing errors
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        supabase.from('profiles').upsert({ id: s.user.id, email: s.user.email });
      }
      if (!s) {
        // No session found after OAuth redirect — could be a silent
        // failure that the Supabase client already consumed from the URL.
        // Don't show an error here (getSession doesn't give us one),
        // but let the user see the sign-in form without a spinner.
      }
      setLoading(false);
    }).catch(err => {
      console.error('[useSupabaseAuth] getSession failed:', err);
      const rawMsg = err?.message;
      const msg = (typeof rawMsg === 'string' && rawMsg.trim() && rawMsg !== '{}' && rawMsg !== '[]' && rawMsg !== 'null')
        ? rawMsg
        : 'Could not restore session.';
      setAuthError(msg);
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
        // Fire-and-forget: upsert profile. Apple Sign-In may return
        // null email on subsequent sign-ins — still upsert with whatever
        // we have (Supabase user identity data handles the rest).
        supabase.from('profiles').upsert({
          id: session.user.id,
          email: session.user.email,
        }).then(({ error }) => {
          if (error) {
            console.warn('[useSupabaseAuth] profile upsert warning:', error.message);
          }
        });
      }
      // Clear any previous auth error on successful sign-in
      setAuthError(null);
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
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth.html`,
        });
        // Normalise error: Supabase's internal _getErrorMessage can fall through
        // to JSON.stringify(err) when the API returns an empty error body {},
        // producing the string "{}" as the error message. Ensure the error always
        // has a human-readable message before passing it to the UI.
        if (error && typeof error.message === 'string') {
          const msg = error.message.trim();
          // Filter out meaningless JSON-serialised fallbacks ("{}", "[]", "null")
          if (msg && msg !== '{}' && msg !== '[]' && msg !== 'null') {
            return { data, error };
          }
          return { data, error: { ...error, message: 'Something went wrong. Please try again.' } };
        }
        return { data, error };
      } catch (err) {
        // Network or unexpected errors — normalise to a readable message
        const message = (err && typeof err.message === 'string' && err.message.trim() && err.message !== '{}' && err.message !== '[]' && err.message !== 'null')
          ? err.message
          : 'Something went wrong. Please try again.';
        return { data: null, error: { message } };
      }
    }, []);

  const updatePassword = useCallback(async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error && typeof error.message === 'string') {
        const msg = error.message.trim();
        if (msg && msg !== '{}' && msg !== '[]' && msg !== 'null') {
          return { data, error };
        }
        return { data, error: { ...error, message: 'Failed to update password. Please try again.' } };
      }
      return { data, error };
    } catch (err) {
      const message = (err && typeof err.message === 'string' && err.message.trim() && err.message !== '{}' && err.message !== '[]' && err.message !== 'null')
        ? err.message
        : 'Failed to update password. Please try again.';
      return { data: null, error: { message } };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    // Keep cached data intact — it serves as a local backup
    // if Supabase data is unavailable on next sign-in
  }, []);

  return { user, session, loading, authError, clearAuthError: () => setAuthError(null), isRecovery, clearRecovery: () => setIsRecovery(false), signUp, signIn, signInWithGoogle, signInWithApple, signOut, checkPremium, setPremiumStatus, resetPassword, updatePassword };
}
