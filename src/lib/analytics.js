/**
 * MyAutoLog Analytics — PostHog Integration
 *
 * Tracks user behavior, page views, conversion funnels, and product usage.
 * Configure via VITE_POSTHOG_KEY and VITE_POSTHOG_HOST env vars.
 * Falls back to a no-op stub when PostHog is not configured (dev/local).
 */

import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';
const IS_CONFIGURED = !!POSTHOG_KEY;

// Track whether we've already initialized
let initialized = false;

/**
 * Initialize PostHog analytics.
 * Call once at app bootstrap (in App.jsx or main.jsx).
 */
export function initAnalytics(userId = null) {
  if (!IS_CONFIGURED) {
    console.log('[Analytics] PostHog not configured — skipping init');
    return;
  }
  if (initialized) return;
  initialized = true;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // We'll manually track page views for control
    persistence: 'localStorage',
    loaded: (ph) => {
      if (userId) ph.identify(userId);
      console.log('[Analytics] PostHog initialized');
    },
  });
}

/**
 * Identify a user (call after auth state change).
 * @param {string} userId - The user's UUID from Supabase auth
 * @param {object} properties - Optional user properties (email, plan, etc.)
 */
export function identifyUser(userId, properties = {}) {
  if (!IS_CONFIGURED || !initialized || !userId) return;
  posthog.identify(userId, properties);
}

/**
 * Reset user identity (call on logout).
 */
export function resetAnalytics() {
  if (!IS_CONFIGURED) return;
  posthog.reset();
}

/**
 * Track a page view event (manual).
 * @param {string} pageName - e.g. 'landing', 'dashboard', 'premium-paywall'
 * @param {object} properties - Optional extra properties
 */
export function trackPageView(pageName, properties = {}) {
  if (!IS_CONFIGURED) return;
  posthog.capture('$pageview', {
    page: pageName,
    path: window.location.pathname,
    ...properties,
  });
}

/**
 * Track a custom event.
 * @param {string} eventName - e.g. 'vehicle_added', 'signup_completed', 'premium_upgraded'
 * @param {object} properties - Event-specific properties
 */
export function trackEvent(eventName, properties = {}) {
  if (!IS_CONFIGURED) return;
  posthog.capture(eventName, properties);
}

/**
 * Track a user action with identity context.
 * Wraps the core tracking with consistent metadata.
 */
export function trackAction(action, properties = {}) {
  trackEvent(action, {
    timestamp: new Date().toISOString(),
    ...properties,
  });
}

/**
 * Set super properties that persist across all events.
 * @param {object} properties
 */
export function setAnalyticsProperties(properties) {
  if (!IS_CONFIGURED || !initialized) return;
  posthog.register(properties);
}

/**
 * Feature flag check (for gradual rollouts).
 * @param {string} flagKey
 * @param {object} options
 * @returns {boolean|string|number}
 */
export function getFeatureFlag(flagKey, options = {}) {
  if (!IS_CONFIGURED || !initialized) return false;
  return posthog.getFeatureFlag(flagKey, options);
}

// Expose the raw posthog object for advanced usage
export { posthog };

/**
 * Get analytics configuration status for debugging
 */
export function getAnalyticsStatus() {
  return {
    configured: IS_CONFIGURED,
    initialized,
    host: POSTHOG_HOST,
  };
}