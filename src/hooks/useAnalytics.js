/**
 * useAnalytics — React hook for tracking page views and user actions
 *
 * Automatically tracks page views when page changes and provides
 * convenience methods for tracking important user events.
 *
 * Usage:
 *   const { track, trackPage } = useAnalytics(page, user);
 *   track('signup_completed', { method: 'google' });
 *   trackPage('dashboard');
 */

import { useEffect, useRef, useCallback } from 'react';
import {
  trackPageView,
  trackAction,
  initAnalytics,
  identifyUser,
  resetAnalytics,
  setAnalyticsProperties,
} from '../lib/analytics';

/**
 * @param {string} currentPage - The current page name from App state
 * @param {object} user - The Supabase auth user object (or null)
 * @param {boolean} isPremium - Whether the user is premium
 */
export default function useAnalytics(currentPage, user, isPremium = false) {
  const prevPage = useRef(null);
  const hasIdentified = useRef(false);
  const prevUserId = useRef(null);

  // Initialize analytics on first mount
  useEffect(() => {
    initAnalytics(user?.id);
  }, []);

  // Identify user when auth state changes, track signup/signin
  useEffect(() => {
    if (user?.id && !hasIdentified.current) {
      identifyUser(user.id, {
        email: user.email,
        premium: isPremium,
        source: 'web',
      });
      setAnalyticsProperties({
        premium: isPremium,
        app_version: import.meta.env.VITE_APP_VERSION || '0.0.0',
      });
      // Track signin event (signup is inferred by first-ever identify)
      trackAction('user_signin', {
        method: user.app_metadata?.provider || 'email',
        isNewUser: !prevUserId.current,
      });
      hasIdentified.current = true;
    } else if (!user?.id) {
      hasIdentified.current = false;
    }
    if (user?.id) prevUserId.current = user.id;
  }, [user?.id, isPremium]);

  // Track page views
  useEffect(() => {
    if (currentPage && currentPage !== prevPage.current) {
      const isAuthenticated = !!user;
      trackPageView(currentPage, {
        authenticated: isAuthenticated,
        premium: isPremium,
        userId: user?.id,
      });
      prevPage.current = currentPage;
    }
  }, [currentPage, user, isPremium]);

  // Track a custom action event
  const track = useCallback((action, properties = {}) => {
    trackAction(action, {
      page: currentPage,
      userId: user?.id,
      authenticated: !!user,
      premium: isPremium,
      ...properties,
    });
  }, [currentPage, user, isPremium]);

  // Manually track a page view
  const trackPage = useCallback((pageName) => {
    trackPageView(pageName, {
      authenticated: !!user,
      premium: isPremium,
      userId: user?.id,
    });
  }, [user, isPremium]);

  // Reset analytics on logout
  const logoutAnalytics = useCallback(() => {
    resetAnalytics();
    hasIdentified.current = false;
  }, []);

  return {
    track,
    trackPage,
    logoutAnalytics,
  };
}