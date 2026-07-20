/**
 * Platform detection utilities for App Store compliance.
 * Detects Capacitor/iOS runtime to gate Stripe external payment links.
 */

/**
 * Returns true if the app is running inside Capacitor on iOS.
 * Used to hide Stripe checkout redirects — App Store §3.1.1 prohibits
 * external payment links in iOS apps.
 */
export function isCapacitorIOS() {
  if (typeof window === 'undefined') return false;
  // Check for Capacitor bridge with iOS platform
  try {
    if (window.Capacitor && window.Capacitor.getPlatform() === 'ios') return true;
  } catch (e) { /* Capacitor not available */ }
  return false;
}
