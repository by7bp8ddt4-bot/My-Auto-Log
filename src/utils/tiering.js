/**
 * 3-tier pricing model (owner-ratified 2026-08-14).
 *
 *   Free   — 1 automotive vehicle/vessel, limited app access. A 2nd vehicle
 *            OR any non-automotive type (motorcycle, boat, PWC, ATV, ag…)
 *            requires a paid tier.
 *   Family — $4.99/mo, up to 4 vehicles/vessels (any type), full app access
 *            incl. Owner's Manual. MONTHLY ONLY (no annual option).
 *   Fleet  — $9.99/mo, unlimited vehicles/vessels, full access incl.
 *            Inspected Vessels (Fleet-only, NOT in Family).
 *
 * Plan keys stored in localStorage ('mtxtrkr_subscription_plan'):
 *   'family' | 'fleet' | 'free'   (legacy 'monthly'/'yearly' → 'family')
 *
 * Tier derivation is client-side (Supabase DB is READ-ONLY — no columns added).
 * The `mtxtrkr_premium_status` flag stays the app-wide "paid" gate; the plan
 * key selects Family vs Fleet.
 */
import { STORAGE_KEYS } from './constants.js';

export const SUBSCRIPTION_PLAN_KEY = 'mtxtrkr_subscription_plan';

export const TIERS = {
  FREE: {
    id: 'free',
    label: 'Free',
    priceLabel: '$0',
    monthlyPrice: 0,
    vehicleLimit: 1,
    tagline: 'Get started',
    blurb: 'One automotive vehicle, core tracking tools.',
  },
  FAMILY: {
    id: 'family',
    label: 'Family',
    priceLabel: '$4.99/mo',
    monthlyPrice: 4.99,
    vehicleLimit: 4,
    tagline: 'Households & small fleets',
    blurb: 'Up to 4 vehicles of any type, full app access incl. Owner\u2019s Manual.',
  },
  FLEET: {
    id: 'fleet',
    label: 'Fleet',
    priceLabel: '$9.99/mo',
    monthlyPrice: 9.99,
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

// Legacy single-premium plan values migrate to Family (monthly-only model).
// Read-time normalization — stored values are never rewritten (one-time,
// non-destructive migration; the value is simply interpreted as 'family').
export const LEGACY_PLAN_MAP = {
  monthly: 'family',
  yearly: 'family',
};

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
