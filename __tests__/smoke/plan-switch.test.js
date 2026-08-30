/**
 * Smoke Test: Self-service plan switch validation.
 *
 * Covers src/utils/planSwitch.js — the pure validation logic behind the
 * "Change Plan" self-service UI (api/switch-subscription.js + the
 * ChangePlanSection in SubscriptionManagement.jsx).
 *
 * Specifically verifies the owner-ratified tier/interval rules:
 *   - Allowed targets: family-monthly, family-yearly, fleet-monthly.
 *   - Fleet is MONTHLY ONLY (fleet-yearly is rejected).
 *   - Unknown tiers collapse to family; intervals normalize to monthly unless
 *     the tier is Family AND the interval is explicitly 'yearly'.
 *   - describeSwitch() reports the right direction (upgrade / downgrade /
 *     interval-change / no-op) and a proration summary.
 */
import { describe, it, expect } from 'vitest';
import {
  VALID_TARGETS,
  normalizeTier,
  normalizeIntervalForTier,
  planKey,
  isValidTargetPlan,
  parsePlanKey,
  priceLabelFor,
  planDisplay,
  describeSwitch,
} from '../../src/utils/planSwitch.js';

describe('Plan switch — valid target combinations', () => {
  it('exposes exactly the known-good target set (Fleet has no yearly)', () => {
    expect(VALID_TARGETS).toEqual(['family-monthly', 'family-yearly', 'fleet-monthly']);
  });

  it('accepts family monthly and family yearly', () => {
    expect(isValidTargetPlan('family', 'monthly')).toBe(true);
    expect(isValidTargetPlan('family', 'yearly')).toBe(true);
  });

  it('accepts fleet monthly', () => {
    expect(isValidTargetPlan('fleet', 'monthly')).toBe(true);
  });

  it('rejects fleet yearly (Fleet is MONTHLY ONLY)', () => {
    expect(isValidTargetPlan('fleet', 'yearly')).toBe(false);
  });

  it('rejects an unknown tier', () => {
    expect(isValidTargetPlan('enterprise', 'monthly')).toBe(false);
  });
});

describe('Plan switch — normalization', () => {
  it('normalizes unknown tiers to family (legacy-safe)', () => {
    expect(normalizeTier('fleet')).toBe('fleet');
    expect(normalizeTier('family')).toBe('family');
    expect(normalizeTier('anything-else')).toBe('family');
  });

  it('collapses Fleet to monthly regardless of the requested interval', () => {
    expect(normalizeIntervalForTier('fleet', 'yearly')).toBe('monthly');
    expect(normalizeIntervalForTier('fleet', 'monthly')).toBe('monthly');
  });

  it('honors yearly for Family, defaults everything else to monthly', () => {
    expect(normalizeIntervalForTier('family', 'yearly')).toBe('yearly');
    expect(normalizeIntervalForTier('family', 'monthly')).toBe('monthly');
    expect(normalizeIntervalForTier('family', 'weekly')).toBe('monthly');
  });

  it('builds canonical plan keys', () => {
    expect(planKey('family', 'yearly')).toBe('family-yearly');
    expect(planKey('fleet', 'yearly')).toBe('fleet-monthly'); // yearly collapses
    expect(planKey('fleet', 'monthly')).toBe('fleet-monthly');
  });

  it('round-trips a plan key through parsePlanKey', () => {
    expect(parsePlanKey('family-yearly')).toEqual({ tier: 'family', interval: 'yearly' });
    expect(parsePlanKey('fleet-monthly')).toEqual({ tier: 'fleet', interval: 'monthly' });
  });
});

describe('Plan switch — price labels', () => {
  it('renders interval-aware Family labels', () => {
    expect(priceLabelFor('family', 'monthly')).toBe('$4.99/mo');
    expect(priceLabelFor('family', 'yearly')).toBe('$39.99/yr');
  });

  it('renders Fleet monthly-only label even if yearly is requested', () => {
    expect(priceLabelFor('fleet', 'monthly')).toBe('$9.99/mo');
    expect(priceLabelFor('fleet', 'yearly')).toBe('$9.99/mo');
  });

  it('renders a human plan display string', () => {
    expect(planDisplay('family', 'yearly')).toContain('Family');
    expect(planDisplay('family', 'yearly')).toContain('Yearly');
    expect(planDisplay('fleet', 'monthly')).toContain('Fleet');
  });
});

describe('Plan switch — describeSwitch direction & proration summary', () => {
  it('flags an identical plan as a no-op', () => {
    const d = describeSwitch('family', 'monthly', 'family', 'monthly');
    expect(d.same).toBe(true);
    expect(d.direction).toBe('none');
  });

  it('detects a Family → Fleet upgrade', () => {
    const d = describeSwitch('family', 'monthly', 'fleet', 'monthly');
    expect(d.same).toBe(false);
    expect(d.direction).toBe('upgrade-tier');
    expect(d.payNow.toLowerCase()).toContain('prorated difference');
  });

  it('detects a Fleet → Family downgrade (and its credit summary)', () => {
    const d = describeSwitch('fleet', 'monthly', 'family', 'monthly');
    expect(d.direction).toBe('downgrade-tier');
    expect(d.payNow.toLowerCase()).toContain('credit');
  });

  it('detects a Family monthly → yearly interval change (pay difference)', () => {
    const d = describeSwitch('family', 'monthly', 'family', 'yearly');
    expect(d.direction).toBe('interval-change');
    expect(d.payNow.toLowerCase()).toContain('prorated difference');
  });

  it('detects a Family yearly → monthly interval drop (credit)', () => {
    const d = describeSwitch('family', 'yearly', 'family', 'monthly');
    expect(d.direction).toBe('interval-change');
    expect(d.payNow.toLowerCase()).toContain('credit');
  });

  it('summarizes the change in plain language', () => {
    const d = describeSwitch('family', 'monthly', 'fleet', 'monthly');
    expect(d.summary).toContain('→');
  });
});
