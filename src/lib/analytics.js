/**
 * MTXtrkr Analytics — Supabase Backend
 *
 * Tracks user behavior, page views, conversion funnels, and product usage.
 * Stores events directly in the `analytics_events` Supabase table.
 * Zero external dependencies — works with existing Supabase setup.
 */

import { supabase } from './supabase';

// Store identity for consistent event metadata
let currentUserId = null;
let currentProperties = {};

/**
 * Initialize analytics.
 * Call once at app bootstrap.
 */
export function initAnalytics(userId = null) {
  if (userId) currentUserId = userId;
  console.log('[Analytics] Initialized with Supabase backend');
}

/**
 * Identify a user (call after auth state change).
 */
export function identifyUser(userId, properties = {}) {
  currentUserId = userId;
  currentProperties = { ...currentProperties, ...properties };
}

/**
 * Reset user identity (call on logout).
 */
export function resetAnalytics() {
  currentUserId = null;
  currentProperties = {};
}

/**
 * Track a page view event.
 */
export function trackPageView(pageName, properties = {}) {
  _track('page_view', {
    page: pageName,
    path: window.location.pathname,
    url: window.location.href,
    ...properties,
  });
}

/**
 * Track a custom event.
 */
export function trackEvent(eventName, properties = {}) {
  _track(eventName, {
    ...properties,
  });
}

/**
 * Track a user action with timestamp context.
 */
export function trackAction(action, properties = {}) {
  _track(action, {
    timestamp: new Date().toISOString(),
    ...properties,
  });
}

/**
 * Set super properties that persist across all events.
 */
export function setAnalyticsProperties(properties) {
  currentProperties = { ...currentProperties, ...properties };
}

/**
 * Feature flag check — not supported with Supabase backend.
 */
export function getFeatureFlag() {
  return false;
}

/**
 * Get analytics configuration status.
 */
export function getAnalyticsStatus() {
  return {
    configured: true,
    backend: 'supabase',
    userId: currentUserId,
  };
}

/**
 * Core tracking function — writes to `analytics_events` table.
 * Fire-and-forget: uses optimistic write, never throws.
 */
async function _track(event, properties = {}) {
  try {
    const payload = {
      event,
      user_id: currentUserId,
      properties: {
        ...currentProperties,
        ...properties,
      },
      url: window.location.href,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    // Optimistic write — don't block on it
    supabase.from('analytics_events').insert([payload]).then(({ error }) => {
      if (error) {
        // Fallback: store in localStorage if write fails
        try {
          const queue = JSON.parse(localStorage.getItem('analytics_queue') || '[]');
          queue.push(payload);
          // Keep only last 50 queued events
          if (queue.length > 50) queue.shift();
          localStorage.setItem('analytics_queue', JSON.stringify(queue));
        } catch (e) {
          // Silently fail — analytics should never break the app
        }
      }
    });
  } catch (e) {
    // Silently fail — analytics should never break the app
  }
}

/**
 * Flush any queued analytics events to Supabase.
 * Called periodically and on network recovery.
 */
export async function flushAnalyticsQueue() {
  try {
    const queue = JSON.parse(localStorage.getItem('analytics_queue') || '[]');
    if (queue.length === 0) return;
    
    const { error } = await supabase.from('analytics_events').insert(queue);
    if (!error) {
      localStorage.removeItem('analytics_queue');
    }
  } catch (e) {
    // Silently fail
  }
}