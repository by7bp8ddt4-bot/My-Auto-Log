import { useState } from 'react';
import {
  Crown, ArrowRight, X, CheckCircle2, AlertTriangle, Mail,
  CreditCard, Calendar, Shield, ChevronRight, ExternalLink, Loader2
} from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { isCapacitorIOS } from '../utils/platform.js';
import { normalizePlan, tierForPlan, getTier, TIER_BY_ID, resolveInterval } from '../utils/tiering.js';

const SUBSCRIPTION_KEYS = {
  PLAN: 'mtxtrkr_subscription_plan',
  STATUS: 'mtxtrkr_subscription_status',
  NEXT_BILLING: 'mtxtrkr_subscription_next_billing',
  INTERVAL: 'mtxtrkr_subscription_interval',
};

// Legacy direct payment links for Family were REMOVED as a reactivate
// fallback. They can't reliably carry the Supabase user id into the Stripe
// Checkout Session, so the webhook would silently no-op. Reactivation always
// goes through the id-carrying startTierCheckout → create-checkout-session.js
// flow (which stamps `client_reference_id` + `metadata.userId`), so the webhook
// can always grant premium server-side.

export function getSubscriptionData() {
  const rawPlan = localStorage.getItem(SUBSCRIPTION_KEYS.PLAN);
  const storedInterval = localStorage.getItem(SUBSCRIPTION_KEYS.INTERVAL);
  // Read-time normalization: legacy 'monthly'/'yearly' plan values are
  // interpreted as 'family' (one-time migration — no rewrite needed), and
  // the legacy raw value feeds the billing interval (yearly → Family yearly)
  // so next-billing display stays correct for pre-3-tier yearly subscribers.
  return {
    plan: normalizePlan(rawPlan),
    interval: resolveInterval(rawPlan, storedInterval),
    status: localStorage.getItem(SUBSCRIPTION_KEYS.STATUS) || null,
    nextBilling: localStorage.getItem(SUBSCRIPTION_KEYS.NEXT_BILLING) || null,
  };
}

export function setSubscriptionData({ plan, status, nextBilling, interval }) {
  if (plan) localStorage.setItem(SUBSCRIPTION_KEYS.PLAN, plan);
  if (status) localStorage.setItem(SUBSCRIPTION_KEYS.STATUS, status);
  if (nextBilling) localStorage.setItem(SUBSCRIPTION_KEYS.NEXT_BILLING, nextBilling);
  if (interval) localStorage.setItem(SUBSCRIPTION_KEYS.INTERVAL, interval);
}

export function clearSubscriptionData() {
  localStorage.removeItem(SUBSCRIPTION_KEYS.PLAN);
  localStorage.removeItem(SUBSCRIPTION_KEYS.STATUS);
  localStorage.removeItem(SUBSCRIPTION_KEYS.NEXT_BILLING);
  localStorage.removeItem(SUBSCRIPTION_KEYS.INTERVAL);
}

// App-wide tier helpers — single source of truth for tier lookups.
export { tierForPlan, getTier, TIER_BY_ID };

/**
 * Start Stripe checkout via the serverless API (api/create-checkout-session.js).
 * POSTs { userId, tier, interval } ('family' | 'fleet'; interval 'monthly' |
 * 'yearly' — yearly is only honored for Family; Fleet is always monthly).
 * Returns the checkout URL. Throws an Error with a user-safe message when the
 * API refuses (e.g. Fleet price not configured yet — the owner must add
 * STRIPE_PRICE_ID_FLEET).
 */
export async function startTierCheckout({ tier, userId, interval }) {
  let res;
  try {
    res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, tier, interval }),
    });
  } catch (e) {
    throw new Error('Could not reach checkout. Check your connection and try again.');
  }
  let data = {};
  try { data = await res.json(); } catch (e) { /* non-JSON error body */ }
  if (!res.ok) {
    throw new Error(data?.error || `Checkout failed (${res.status})`);
  }
  if (!data?.url) {
    throw new Error('Checkout session did not return a payment URL.');
  }
  return data.url;
}

// Estimate next billing date from the billing interval (Family: monthly →
// +1 month / yearly → +1 year; Fleet: monthly only).
function estimateNextBilling(status, interval) {
  if (status !== 'active') return null;
  const stored = localStorage.getItem(SUBSCRIPTION_KEYS.NEXT_BILLING);
  if (stored) return stored;
  const d = new Date();
  if (interval === 'yearly') {
    d.setFullYear(d.getFullYear() + 1);
  } else {
    d.setMonth(d.getMonth() + 1);
  }
  return d.toISOString().split('T')[0];
}

export default function SubscriptionManagement({ userId, isPremium, onNavigate, trackEvent }) {
  const isIOS = isCapacitorIOS();
  const sub = getSubscriptionData();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(sub.status === 'cancelled');
  const [showIOSNotice, setShowIOSNotice] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const tier = getTier({ isPremium });
  const status = cancelled ? 'cancelled' : sub.status;
  // Billing interval: Family may be 'monthly' or 'yearly' (legacy 'yearly'
  // plan values migrate to family + yearly); Fleet is always 'monthly'.
  const interval = tier.id === 'family' ? sub.interval : 'monthly';
  const nextBilling = estimateNextBilling(status, interval);
  const tierDef = TIER_BY_ID[tier.id] || TIER_BY_ID.family;
  // Interval-aware price display (e.g. Family yearly → $39.99/yr).
  const priceLabel = tierDef.hasYearly && interval === 'yearly'
    ? tierDef.yearlyLabel
    : (tierDef.monthlyLabel || tierDef.priceLabel);

  const handleCancel = () => {
    // Mark as cancelled locally + show instructions
    localStorage.setItem(SUBSCRIPTION_KEYS.STATUS, 'cancelled');
    localStorage.removeItem(SUBSCRIPTION_KEYS.NEXT_BILLING);
    setCancelled(true);
    setShowCancelConfirm(false);
    trackEvent?.('subscription_cancelled', { tier: tier.id, userId });
  };

  const handleReactivate = async () => {
    if (isIOS) { setShowIOSNotice(true); return; }
    setBusy(true);
    setError(null);
    trackEvent?.('subscription_reactivate_started', { tier: tier.id, userId });
    try {
      const url = await startTierCheckout({ tier: tier.id, userId, interval });
      window.location.href = url;
    } catch (e) {
      // No legacy buy.stripe.com fallback here: it can't carry the Supabase
      // user id (the webhook would silently no-op → premium loop). Surface the
      // error so the user retries the id-carrying checkout flow.
      setError(e.message || 'Checkout failed. Please try again.');
      setBusy(false);
    }
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@mtxtrkr.app?subject=Cancellation%20Request';
  };

  if (!isPremium) {
    return (
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
          <Crown className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-sm font-bold text-white mb-2">No Active Subscription</h3>
        <p className="text-xs text-slate-500 mb-4">Upgrade to Family or Fleet to manage your subscription.</p>
        <button
          onClick={() => onNavigate('premium')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
        >
          <Crown className="w-3.5 h-3.5" />
          Choose a Plan
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Subscription</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Manage your MTXtrkr {tierDef.label} plan
        </p>
      </div>

      <div className="space-y-4">
        {/* Current Plan Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          status === 'active'
            ? 'bg-gradient-to-b from-blue-600/10 to-cyan-600/5 border-blue-500/30 shadow-lg shadow-blue-500/5'
            : 'bg-slate-900/60 border-slate-700/60'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                status === 'active' ? 'bg-blue-500/20' : 'bg-slate-800'
              }`}>
                <Crown className={`w-6 h-6 ${
                  status === 'active' ? 'text-yellow-400' : 'text-slate-500'
                }`} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  MTXtrkr {tierDef.label}
                </h3>
                <p className="text-xs text-slate-400">
                  {tierDef.label === 'Fleet' ? 'Unlimited vehicles' : `Up to ${tierDef.vehicleLimit} vehicles`} — {priceLabel}
                </p>
              </div>
            </div>
            {/* Status Badge */}
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              status === 'active'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}>
              {status === 'active' ? 'Active' : 'Cancelled'}
            </span>
          </div>

          {/* Next Billing Date */}
          {status === 'active' && nextBilling && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800 mb-4">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-slate-400">Next billing date</p>
                <p className="text-sm font-semibold text-white">{formatDate(nextBilling)}</p>
              </div>
              <CreditCard className="w-4 h-4 text-slate-500" />
            </div>
          )}

          {/* Cancelled notice */}
          {status === 'cancelled' && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-300 mb-0.5">Subscription Cancelled</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Your paid features will remain active until the end of your current billing period, then you'll revert to the free plan.
                </p>
              </div>
            </div>
          )}

          {/* Error (e.g. Fleet checkout not configured yet) */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {status === 'active' && !showCancelConfirm && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all"
              >
                <X className="w-4 h-4" />
                Cancel Subscription
              </button>
            )}

            {status === 'active' && showCancelConfirm && (
              <div className="space-y-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                <p className="text-xs text-red-300 font-medium">Are you sure you want to cancel?</p>
                <p className="text-[10px] text-slate-400 mb-2">
                  Your paid features will remain active until the end of the current billing period. After that, you'll lose access.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 py-2 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-all"
                  >
                    Keep Plan
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-all"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            )}

            {status === 'cancelled' && (
              <button
                onClick={handleReactivate}
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all disabled:opacity-60"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {busy ? 'Starting checkout…' : 'Reactivate Subscription'}
                {!busy && <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* iOS Notice — App Store §3.1.1 prohibits external payment links */}
        {showIOSNotice && (
          <div className="p-5 rounded-2xl bg-blue-600/10 border border-blue-500/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white mb-1">Manage on the Web</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Subscription management (upgrades, plan changes) is available at <strong className="text-blue-300">www.MTXtrkr.com</strong>. Visit on any desktop or mobile browser to manage your subscription.
                </p>
                <button
                  onClick={() => setShowIOSNotice(false)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plan Details */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            Plan Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Plan</span>
              <span className="text-white font-medium">MTXtrkr {tierDef.label} — {interval === 'yearly' ? 'yearly' : 'monthly'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Vehicles</span>
              <span className="text-white font-medium">
                {tierDef.vehicleLimit === Infinity ? 'Unlimited' : `Up to ${tierDef.vehicleLimit}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Price</span>
              <span className="text-white font-medium">{priceLabel}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Status</span>
              <span className={`font-medium ${status === 'active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {status === 'active' ? 'Active' : 'Cancelled'}
              </span>
            </div>
            {status === 'active' && nextBilling && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Next Billing</span>
                <span className="text-white font-medium">{formatDate(nextBilling)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Need Help? */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            Need Help?
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            For billing questions, refunds, or account changes, contact our support team.
          </p>
          <button
            onClick={handleContactSupport}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-300 hover:bg-slate-800 transition-all"
          >
            <Mail className="w-4 h-4" />
            Contact Support
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Back to Settings */}
        <button
          onClick={() => onNavigate('settings')}
          className="flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-all mx-auto"
        >
          <ChevronRight className="w-3 h-3 rotate-180" />
          Back to Settings
        </button>
      </div>
    </div>
  );
}
