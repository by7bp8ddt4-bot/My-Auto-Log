/**
 * Self-service plan switching — pure validation + description logic.
 *
 * The 3-tier model (owner-ratified 2026-08-14, amended 2026-08-17) allows a
 * subscriber to change their plan directly in the app. The only valid target
 * tier+interval combinations are:
 *
 *   'family-monthly'  → Family $4.99/mo
 *   'family-yearly'   → Family $39.99/yr
 *   'fleet-monthly'   → Fleet  $9.99/mo   (Fleet is MONTHLY ONLY — no yearly)
 *
 * This module centralises (a) normalising a requested tier+interval into a
 * canonical plan key, (b) validating that a target combination is one of the
 * known-good set (so we never invent a price), and (c) describing a switch for
 * the client-side confirmation / proration summary. It is intentionally free
 * of React/DOM so it is trivially unit-testable.
 */
import { TIERS } from './tiering.js';

/** The complete set of switchable target plans: '<tier>-<interval>'. */
export const VALID_TARGETS = ['family-monthly', 'family-yearly', 'fleet-monthly'];

/** Unknown tiers fall back to 'family' (legacy-safe, matches getTier). */
export function normalizeTier(tier) {
  return tier === 'fleet' ? 'fleet' : 'family';
}

/**
 * Fleet is MONTHLY ONLY — any requested interval collapses to 'monthly'.
 * Family honors 'yearly'; everything else defaults to 'monthly'.
 * @param {string} tier - 'family' | 'fleet'
 * @param {string} interval - 'monthly' | 'yearly'
 */
export function normalizeIntervalForTier(tier, interval) {
  if (normalizeTier(tier) === 'fleet') return 'monthly';
  return interval === 'yearly' ? 'yearly' : 'monthly';
}

/** Canonical plan key '<tier>-<interval>' after normalization. */
export function planKey(tier, interval) {
  return `${normalizeTier(tier)}-${normalizeIntervalForTier(tier, interval)}`;
}

/**
 * Whether a requested tier+interval is one of the known valid target plans.
 * This is a STRICT validator — it does NOT normalize:
 *   - an unknown tier label (anything other than 'family' / 'fleet') → false;
 *   - Fleet with an explicit 'yearly' interval → false (Fleet is MONTHLY ONLY).
 * Use it on the raw request before any normalization (e.g. in
 * api/switch-subscription.js) so invalid combos are rejected outright.
 */
export function isValidTargetPlan(tier, interval) {
  if (tier !== 'family' && tier !== 'fleet') return false; // must be an explicit known tier
  if (tier === 'fleet') return interval === 'monthly';      // Fleet is MONTHLY ONLY
  return interval === 'monthly' || interval === 'yearly';   // Family monthly or yearly
}

/** Break a plan key back into { tier, interval }. */
export function parsePlanKey(key) {
  const [tier, interval] = String(key || '').split('-');
  return { tier, interval };
}

/** Human price label for a given tier+interval. */
export function priceLabelFor(tier, interval) {
  const t = normalizeTier(tier) === 'fleet' ? TIERS.FLEET : TIERS.FAMILY;
  if (normalizeTier(tier) === 'fleet') return t.monthlyLabel; // monthly only
  return interval === 'yearly' ? t.yearlyLabel : t.monthlyLabel;
}

/** Human "Plan · interval (price)" label, e.g. "Family · Yearly ($39.99/yr)". */
export function planDisplay(tier, interval) {
  const t = normalizeTier(tier) === 'fleet' ? TIERS.FLEET : TIERS.FAMILY;
  const intLabel = normalizeTier(tier) === 'fleet' ? 'Monthly' : (interval === 'yearly' ? 'Yearly' : 'Monthly');
  return `${t.label} · ${intLabel} (${priceLabelFor(tier, interval)})`;
}

/**
 * Describe a proposed switch (current → target) for the confirmation step.
 * Returns the direction ('upgrade-tier' | 'downgrade-tier' | 'interval-change')
 * and a user-safe proration summary ('you'll pay the prorated difference now'
 * on upgrade/interval-bump, or 'you'll receive a credit' on downgrade/
 * interval-drop). The exact dollar amount is computed by Stripe at
 * confirmation (api/switch-subscription.js), so the summary is directional to
 * avoid showing a number we'd have to keep in sync with Stripe.
 */
export function describeSwitch(currentTier, currentInterval, targetTier, targetInterval) {
  const cur = normalizeTier(currentTier);
  const curInt = normalizeIntervalForTier(cur, currentInterval);
  const tgt = normalizeTier(targetTier);
  const tgtInt = normalizeIntervalForTier(tgt, targetInterval);

  if (cur === tgt && curInt === tgtInt) {
    return { same: true, direction: 'none', payNow: 'Target plan is identical to your current plan.' };
  }

  let direction;
  if (cur === 'family' && tgt === 'fleet') direction = 'upgrade-tier';
  else if (cur === 'fleet' && tgt === 'family') direction = 'downgrade-tier';
  else direction = 'interval-change'; // same tier, different interval

  const curLabel = priceLabelFor(cur, curInt);
  const tgtLabel = priceLabelFor(tgt, tgtInt);
  let payNow;
  if (direction === 'upgrade-tier') {
    payNow = `You'll pay the prorated difference between ${curLabel} and ${tgtLabel} right away; then renew at ${tgtLabel}.`;
  } else if (direction === 'downgrade-tier') {
    payNow = `You'll receive a credit for the unused portion of your ${curLabel} plan toward the new ${tgtLabel} plan.`;
  } else if (cur === 'family' && curInt === 'monthly' && tgtInt === 'yearly') {
    payNow = `You'll pay the prorated difference to move to ${tgtLabel} now, then renew yearly (save 33%).`;
  } else {
    // Family yearly → monthly (interval drop)
    payNow = `You'll receive a credit for the unused time on your ${curLabel} plan and switch to ${tgtLabel}.`;
  }

  return {
    same: false,
    direction,
    summary: `${planDisplay(cur, curInt)} → ${planDisplay(tgt, tgtInt)}`,
    payNow,
    curTier: cur,
    curInterval: curInt,
    tgtTier: tgt,
    tgtInterval: tgtInt,
  };
}
