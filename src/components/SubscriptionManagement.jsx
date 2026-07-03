import { useState } from 'react';
import {
  Crown, ArrowRight, X, CheckCircle2, AlertTriangle, Mail,
  CreditCard, Calendar, Shield, Zap, ChevronRight, ExternalLink
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

const SUBSCRIPTION_KEYS = {
  PLAN: 'mtxtrkr_subscription_plan',
  STATUS: 'mtxtrkr_subscription_status',
  NEXT_BILLING: 'mtxtrkr_subscription_next_billing',
};

export function getSubscriptionData() {
  return {
    plan: localStorage.getItem(SUBSCRIPTION_KEYS.PLAN) || 'monthly',
    status: localStorage.getItem(SUBSCRIPTION_KEYS.STATUS) || 'active',
    nextBilling: localStorage.getItem(SUBSCRIPTION_KEYS.NEXT_BILLING) || null,
  };
}

export function setSubscriptionData({ plan, status, nextBilling }) {
  if (plan) localStorage.setItem(SUBSCRIPTION_KEYS.PLAN, plan);
  if (status) localStorage.setItem(SUBSCRIPTION_KEYS.STATUS, status);
  if (nextBilling) localStorage.setItem(SUBSCRIPTION_KEYS.NEXT_BILLING, nextBilling);
}

export function clearSubscriptionData() {
  localStorage.removeItem(SUBSCRIPTION_KEYS.PLAN);
  localStorage.removeItem(SUBSCRIPTION_KEYS.STATUS);
  localStorage.removeItem(SUBSCRIPTION_KEYS.NEXT_BILLING);
}

// Estimate next billing date based on plan type and current date
function estimateNextBilling(plan, status) {
  if (status !== 'active') return null;
  const stored = localStorage.getItem(SUBSCRIPTION_KEYS.NEXT_BILLING);
  if (stored) return stored;
  // Estimate: start from today + interval
  const d = new Date();
  if (plan === 'yearly') {
    d.setFullYear(d.getFullYear() + 1);
  } else {
    d.setMonth(d.getMonth() + 1);
  }
  return d.toISOString().split('T')[0];
}

const STRIPE_URLS = {
  monthly: 'https://buy.stripe.com/6oU9AT5ko1Ob6GV36b0sU00',
  yearly: 'https://buy.stripe.com/eVq00j1480K77KZayD0sU01',
};

export default function SubscriptionManagement({ userId, isPremium, onNavigate, trackEvent }) {
  const sub = getSubscriptionData();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(sub.status === 'cancelled');

  const plan = sub.plan || 'monthly';
  const status = cancelled ? 'cancelled' : sub.status;
  const nextBilling = estimateNextBilling(plan, status);

  const planLabel = plan === 'yearly' ? 'Yearly' : 'Monthly';
  const planPrice = plan === 'yearly' ? '$39.99/yr' : '$4.99/mo';
  const planSavings = plan === 'yearly' ? 'Save 33% vs monthly' : null;

  const handleCancel = () => {
    // Mark as cancelled locally + show instructions
    localStorage.setItem(SUBSCRIPTION_KEYS.STATUS, 'cancelled');
    localStorage.removeItem(SUBSCRIPTION_KEYS.NEXT_BILLING);
    setCancelled(true);
    setShowCancelConfirm(false);
    trackEvent?.('subscription_cancelled', { plan, userId });
  };

  const handleReactivate = () => {
    const stripeUrl = STRIPE_URLS[plan];
    const url = userId ? `${stripeUrl}?client_reference_id=${userId}&prefilled_email=${userId}` : stripeUrl;
    trackEvent?.('subscription_reactivate_started', { plan, userId });
    window.location.href = url;
  };

  const handleUpgradeToYearly = () => {
    const url = userId
      ? `${STRIPE_URLS.yearly}?client_reference_id=${userId}&prefilled_email=${userId}`
      : STRIPE_URLS.yearly;
    trackEvent?.('subscription_upgrade_yearly_started', { userId });
    window.location.href = url;
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
        <p className="text-xs text-slate-500 mb-4">Upgrade to premium to manage your subscription.</p>
        <button
          onClick={() => onNavigate('premium')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
        >
          <Crown className="w-3.5 h-3.5" />
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Subscription</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Manage your MTXtrkr Premium plan
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
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  MTXtrkr Premium
                  {planSavings && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-tighter">
                      Best Value
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">{planLabel} — {planPrice}</p>
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
                  Your premium features will remain active until the end of your current billing period, then you'll revert to the free plan.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {status === 'active' && plan === 'monthly' && (
              <button
                onClick={handleUpgradeToYearly}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
              >
                <Zap className="w-4 h-4" />
                Upgrade to Yearly — Save 33%
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

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
                  Your premium features will remain active until the end of the current billing period. After that, you'll lose access to premium features.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 py-2 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-all"
                  >
                    Keep Premium
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
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Reactivate Subscription
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Plan Details */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            Plan Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Plan</span>
              <span className="text-white font-medium">MTXtrkr Premium — {planLabel}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Price</span>
              <span className="text-white font-medium">{planPrice}</span>
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