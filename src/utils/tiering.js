/**
 * 3-tier pricing model (owner-ratified 2026-08-14; amended 2026-08-17).
 *
 *   Free   — 1 automotive vehicle/vessel, limited app access. A 2nd vehicle
 *            OR any non-automotive type (motorcycle, boat, PWC, ATV, ag…)
 *            requires a paid tier.
 *   Family — $4.99/mo OR $39.99/yr, up to 4 vehicles/vessels (any type),
 *            full app access incl. Owner's Manual. Billing interval chosen
 *            at checkout (yearly ≈ 33% saving). Yearly option restored by
 *            the owner's pricing amendment 2026-08-17.
 *   Fleet  — $9.99/mo (MONTHLY ONLY — no yearly), unlimited vehicles/vessels,
 *            full access incl. Inspected Vessels (Fleet-only, NOT in Family).
 *
 * Plan keys stored in localStorage ('mtxtrkr_subscription_plan'):
 *   'family' | 'fleet' | 'free'   (legacy 'monthly'/'yearly' → 'family')
 *
 * Billing interval stored separately ('mtxtrkr_subscription_interval'):
 *   'monthly' | 'yearly'   (Family only — Fleet is always monthly)
 *
 * Tier derivation is client-side (Supabase DB is READ-ONLY — no columns added).
 * The `mtxtrkr_premium_status` flag stays the app-wide "paid" gate; the plan
 * key selects Family vs Fleet.
 */
import { STORAGE_KEYS } from './constants.js';

export const SUBSCRIPTION_PLAN_KEY = 'mtxtrkr_subscription_plan';
export const SUBSCRIPTION_INTERVAL_KEY = 'mtxtrkr_subscription_interval';
export const SUBSCRIPTION_STATUS_KEY = 'mtxtrkr_subscription_status';

/**
 * Account-scoping companion to `mtxtrkr_premium_status`.
 *
 * The premium flag is device-global (one per browser), so on its own it would
 * leak a paid marker from one account to the next account that signs in on the
 * same device. To close that leak, every premium grant now records the Supabase
 * user id that earned it in this key, and `isStickyPaid(userId)` only honors
 * the flag for that owning account. (Legacy markers written before scoping
 * shipped have no owner — see `isStickyPaid` for how they are handled.)
 */
export const PREMIUM_OWNER_KEY = 'mtxtrkr_premium_owner';

/**
 * Persist a premium grant locally, stamped with the account that earned it.
 * The durable source of truth remains server-side `profiles.premium` (set by
 * the Stripe webhook); this is only the device-local "sticky" marker used to
 * avoid bouncing a returning paid user to the paywall before the server poll.
 *
 * @param {string|null} userId - the Supabase user id that owns the grant.
 */
export function setPremiumFlag(userId) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
  if (userId) {
    localStorage.setItem(PREMIUM_OWNER_KEY, userId);
  }
}

/** Remove the device-local premium marker (flag + owner). */
export function clearPremiumFlag() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.PREMIUM_STATUS);
  localStorage.removeItem(PREMIUM_OWNER_KEY);
}

export const TIERS = {
  FREE: {
    id: 'free',
    label: 'Free',
    priceLabel: '$0',
    monthlyPrice: 0,
    monthlyLabel: '$0',
    vehicleLimit: 1,
    tagline: 'Get started',
    blurb: 'One automotive vehicle, core tracking tools.',
  },
  FAMILY: {
    id: 'family',
    label: 'Family',
    priceLabel: '$4.99/mo or $39.99/yr',
    monthlyPrice: 4.99,
    yearlyPrice: 39.99,
    monthlyLabel: '$4.99/mo',
    yearlyLabel: '$39.99/yr',
    hasYearly: true,
    yearlySavings: 'Save 33%',
    vehicleLimit: 4,
    tagline: 'Households & small fleets',
    blurb: 'Up to 4 vehicles of any type, full app access incl. Owner\u2019s Manual.',
  },
  FLEET: {
    id: 'fleet',
    label: 'Fleet',
    priceLabel: '$9.99/mo',
    monthlyPrice: 9.99,
    monthlyLabel: '$9.99/mo',
    hasYearly: false,
    vehicleLimit: Infinity,
    tagline: 'Unlimited vehicles',
    blurb: 'Unlimited vehicles of any type, full access incl. Inspected Vessels.',
  },
};

export const TIER_BY_ID = {
  free: TIERS.FREE,
  family: TIERS.FAMILY,
  fleet: TIERS.FLEET,
};

export const TIER_LIST = [TIERS.FREE, TIERS.FAMILY, TIERS.FLEET];

// Legacy single-premium plan values migrate to Family (billing interval is
// preserved separately — see resolveInterval). Read-time normalization —
// stored values are never rewritten (one-time, non-destructive migration;
// the value is simply interpreted as 'family').
export const LEGACY_PLAN_MAP = {
  monthly: 'family',
  yearly: 'family',
};

/**
 * Normalize a billing interval to 'monthly' | 'yearly'.
 * Anything other than 'yearly' → 'monthly' (Fleet is always monthly).
 */
export function normalizeInterval(interval) {
  return interval === 'yearly' ? 'yearly' : 'monthly';
}

/**
 * Resolve the billing interval for display/next-billing math.
 * Priority: explicit stored interval → legacy raw plan value ('yearly' →
 * yearly; 'monthly' → monthly) → 'monthly' default.
 */
export function resolveInterval(rawPlan, storedInterval) {
  if (storedInterval === 'yearly' || storedInterval === 'monthly') return storedInterval;
  return rawPlan === 'yearly' ? 'yearly' : 'monthly';
}

/**
 * Normalize a stored plan value to one of 'free' | 'family' | 'fleet'.
 * Legacy 'monthly'/'yearly' (or anything else unknown) → 'family'.
 * Missing/null → 'free'.
 */
export function normalizePlan(plan) {
  if (!plan) return TIERS.FREE.id;
  if (LEGACY_PLAN_MAP[plan]) return LEGACY_PLAN_MAP[plan];
  return TIER_BY_ID[plan] ? plan : TIERS.FAMILY.id; // unknown → family (safe for legacy premium)
}

/** Map a plan value to a tier object. */
export function tierForPlan(plan) {
  return TIER_BY_ID[normalizePlan(plan)] || TIERS.FAMILY;
}

/**
 * Resolve the subscription status a user should SEE.
 *
 * A premium user is 'active' unless they have EXPLICITLY cancelled (status
 * literally 'cancelled'). A missing/null stored status — legacy premium-only
 * accounts, or an older session whose subscription keys were wiped — must
 * never be presented as "Cancelled". That mislabeled genuine paid users as
 * cancelled right after sign-in (the post-auth glitch); the subscription UI
 * previously rendered "Cancelled" for ANY status !== 'active', including null.
 *
 * @param {{ isPremium: boolean, storedStatus?: string|null, explicitlyCancelled?: boolean }} opts
 * @returns {'active'|'cancelled'|null}
 */
export function resolveSubscriptionStatus({ isPremium, storedStatus, explicitlyCancelled = false }) {
  if (explicitlyCancelled || storedStatus === 'cancelled') return 'cancelled';
  if (isPremium) return 'active';
  return storedStatus || null;
}

/**
 * STICKY PAID gate — the single source of truth for "is this user paid" on
 * the current device.
 *
 * The grant of premium is durably stored server-side by the Stripe webhook
 * (profiles.premium = true), but a brand-new load (new tab, browser reopen,
 * Capacitor iOS webview) starts before the cloud sync has caught up — and
 * historically the ONLY local marker was `mtxtrkr_premium_status`, which is
 * device/browser-scoped. If that flag was missing or reset, the app read
 * premium=false and bounced a paying customer back to the paywall ("the loop").
 *
 * To close that gap the paid marker is now derived from ANY of:
 *   1. the app-wide premium flag (`mtxtrkr_premium_status === 'true'`), OR
 *   2. an explicit subscription plan + an active/trialing status.
 * As long as ANY local marker survived the reload, the user stays paid until
 * the server-side profile sync confirms/restores the grant. Safe to call on
 * every render and in add-time gates (reads localStorage synchronously).
 */
export function isStickyPaid(userId) {
  if (typeof localStorage === 'undefined') return false;
  if (localStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS) === 'true') {
    const owner = localStorage.getItem(PREMIUM_OWNER_KEY);
    // No user context yet (the very first render while the Supabase session is
    // still being restored): honor the flag so a returning paid user is never
    // bounced to the paywall before the server poll re-grants them.
    if (userId == null) return true;
    // Account-scoped: only the account that earned the flag may inherit it.
    // A legacy marker with no recorded owner (written before scoping shipped)
    // is honored for the current user for backward compatibility — it is
    // cleared on sign-out so it cannot leak to the next account.
    if (!owner) return true;
    return owner === userId;
  }
  const plan = localStorage.getItem(SUBSCRIPTION_PLAN_KEY);
  const status = localStorage.getItem(SUBSCRIPTION_STATUS_KEY);
  if (plan && (status === 'active' || status === 'trialing')) return true;
  return false;
}

/**
 * Current tier for the signed-in device.
 *
 * Reads the premium flag (app-wide paid gate) + subscription plan key.
 * A paid user without an explicit 'fleet' plan is ALWAYS at least Family —
 * this is the legacy-safe default and also covers the auth-change wipe
 * (subscription keys are intentionally NOT protected; the plan key can be
 * wiped on sign-in, but premium_status survives → tier stays Family).
 *
 * @param {{ isPremium?: boolean }} [opts] - optional override of the premium flag
 */
export function getTier({ isPremium } = {}) {
  const premium = isPremium !== undefined
    ? isPremium
    : (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS) === 'true');
  if (!premium) return TIERS.FREE;
  if (normalizePlan(typeof localStorage !== 'undefined' ? localStorage.getItem(SUBSCRIPTION_PLAN_KEY) : null) === TIERS.FLEET.id) {
    return TIERS.FLEET;
  }
  return TIERS.FAMILY;
}

/**
 * Automotive = road vehicles (car/truck, semi-truck, RV). Everything else
 * (motorcycle, ATV, ag equipment, forklift, PWC, outboard, marine diesel)
 * is non-automotive and requires a paid tier.
 */
export const AUTOMOTIVE_TYPES = ['car', 'semi-truck', 'rv'];

export function isAutomotiveType(type) {
  return AUTOMOTIVE_TYPES.includes(type);
}

/**
 * Client-side add-time gate for the garage.
 * @param {string} tierId - 'free' | 'family' | 'fleet'
 * @param {Array} currentVehicles - vehicles currently in the garage
 * @param {string} type - vehicle type id being added (defaults to 'car')
 * @returns {{ allowed: boolean, reason: 'limit'|'non-automotive'|null }}
 */
export function canAddVehicle(tierId, currentVehicles, type = 'car') {
  const count = Array.isArray(currentVehicles) ? currentVehicles.length : 0;

  if (tierId === TIERS.FLEET.id) return { allowed: true, reason: null };

  // Free users may not add ANY non-automotive type (even as their first vehicle).
  if (tierId === TIERS.FREE.id && !isAutomotiveType(type)) {
    return { allowed: false, reason: 'non-automotive' };
  }

  const limit = tierId === TIERS.FAMILY.id ? TIERS.FAMILY.vehicleLimit : TIERS.FREE.vehicleLimit;
  if (count >= limit) return { allowed: false, reason: 'limit' };

  return { allowed: true, reason: null };
}

/** Inspected Vessels is Fleet-only (owner-ratified). */
export function canAccessInspectedVessels(tierId) {
  return tierId === TIERS.FLEET.id;
}

/** Garage header badge, e.g. "Family · 2/4" or "Fleet · Unlimited". */
export function tierBadgeLabel(tierId, vehicleCount) {
  const tier = TIER_BY_ID[tierId] || TIERS.FREE;
  if (tier.vehicleLimit === Infinity) return `${tier.label} \u00b7 Unlimited`;
  return `${tier.label} \u00b7 ${vehicleCount || 0}/${tier.vehicleLimit}`;
}
