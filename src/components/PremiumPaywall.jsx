import { useState } from 'react';
import {
  X, ArrowRight, Sparkles, Shield, Loader2, AlertTriangle
} from 'lucide-react';
import { setSubscriptionData, startTierCheckout } from './SubscriptionManagement.jsx';
import { isCapacitorIOS } from '../utils/platform.js';
import { TIER_LIST, TIERS } from '../utils/tiering.js';

// Feature matrix per tier (owner-ratified 3-tier model, 2026-08-14).
const TIER_FEATURES = [
  { label: 'Vehicles', free: '1 automotive', family: 'Up to 4 (any type)', fleet: 'Unlimited (any type)' },
  { label: 'Motorcycle / boat / ATV / ag', free: '✕', family: '✓', fleet: '✓' },
  { label: 'Owner\u2019s Manual highlights', free: '✕', family: '✓', fleet: '✓' },
  { label: 'AI mileage predictions', free: '✕', family: '✓', fleet: '✓' },
  { label: 'Cloud sync & documents', free: 'Basic', family: '✓', fleet: '✓' },
  { label: 'Premium resale reports', free: '✕', family: '✓', fleet: '✓' },
  { label: 'Inspected Vessels', free: '✕', family: '✕', fleet: '✓' },
];

export default function PremiumPaywall({ onClose, onUpgrade, userId, trackEvent }) {
  const isIOS = isCapacitorIOS();
  const [busyTier, setBusyTier] = useState(null);
  const [error, setError] = useState(null);

  const handleChoose = async (tierId) => {
    setError(null);
    setBusyTier(tierId);
    const tier = TIERS[tierId.toUpperCase()];
    trackEvent?.('checkout_started', { tier: tierId, price: tier.monthlyPrice, userId });

    if (isIOS) {
      // iOS: no external payment links (App Store §3.1.1). Optimistically
      // activate so the user isn't blocked in-app; manage billing on the web.
      const nextBilling = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
      setSubscriptionData({ plan: tierId, status: 'active', nextBilling });
      await onUpgrade();
      setBusyTier(null);
      return;
    }

    // Prefer the serverless checkout session (needed for Fleet — no direct
    // payment link exists until STRIPE_PRICE_ID_FLEET is configured).
    try {
      const url = await startTierCheckout({ tier: tierId, userId });
      // Optimistic write: record the plan + premium before redirecting so the
      // tier model is correct when the user returns (payment_success=true).
      const nextBilling = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
      setSubscriptionData({ plan: tierId, status: 'active', nextBilling });
      await onUpgrade();
      window.location.href = url;
    } catch (e) {
      if (tierId === 'family') {
        // Fallback: legacy direct payment link (proven in production).
        const nextBilling = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
        setSubscriptionData({ plan: 'family', status: 'active', nextBilling });
        await onUpgrade();
        const base = 'https://buy.stripe.com/6oU9AT5ko1Ob6GV36b0sU00';
        window.location.href = userId ? `${base}?client_reference_id=${userId}` : base;
      } else {
        setError(e.message || 'Fleet checkout is not configured yet. Please try again later.');
        setBusyTier(null);
      }
    }
  };

  const cardStyles = {
    free: 'bg-slate-900/60 border-slate-800',
    family: 'bg-gradient-to-b from-blue-600/10 to-cyan-600/5 border-blue-500/30',
    fleet: 'bg-gradient-to-b from-purple-600/10 to-indigo-600/5 border-purple-500/30',
  };
  const ctaStyles = {
    free: 'bg-slate-800 hover:bg-slate-700 text-white',
    family: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25',
    fleet: 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/25',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Close */}
        <button onClick={onClose} className="mb-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            CHOOSE YOUR PLAN
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Plans for every garage
          </h1>
          <p className="text-slate-400 text-sm">
            Monthly only — cancel anytime. No annual commitments.
          </p>
        </div>

        {/* Error banner (e.g. Fleet checkout not configured yet) */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {TIER_LIST.map((tier) => {
            const isFamily = tier.id === 'family';
            const isFleet = tier.id === 'fleet';
            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl border p-4 flex flex-col ${cardStyles[tier.id]} ${
                  isFamily ? 'shadow-lg shadow-blue-500/10' : ''
                }`}
              >
                {isFamily && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-[9px] font-bold text-white whitespace-nowrap shadow-lg">
                    MOST POPULAR
                  </div>
                )}
                {isFleet && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 text-[9px] font-bold text-white whitespace-nowrap shadow-lg">
                    FOR FLEETS
                  </div>
                )}
                <h3 className={`text-sm font-bold text-white mt-1 ${isFamily || isFleet ? 'mt-3' : ''}`}>{tier.label}</h3>
                <p className="text-2xl font-bold text-white mt-1">
                  {tier.monthlyPrice === 0 ? '$0' : `$${tier.monthlyPrice}`}
                  {tier.monthlyPrice > 0 && <span className="text-xs text-slate-500 font-normal">/mo</span>}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed flex-1">{tier.blurb}</p>
                {isFleet && (
                  <span className="inline-flex items-center gap-1 mt-2 self-start px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold uppercase tracking-tighter">
                    <Shield className="w-3 h-3" /> Includes Inspected Vessels
                  </span>
                )}
                <button
                  onClick={() => handleChoose(tier.id)}
                  disabled={busyTier === tier.id}
                  className={`mt-4 w-full py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 ${ctaStyles[tier.id]}`}
                >
                  {busyTier === tier.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : tier.monthlyPrice === 0 ? (
                    'Current Plan'
                  ) : (
                    <>
                      Choose {tier.label}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature comparison */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden mb-6">
          <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-slate-900/80 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-500">Feature</span>
            <span className="text-center text-slate-400">Free</span>
            <span className="text-center text-blue-400">Family</span>
            <span className="text-center text-purple-400">Fleet</span>
          </div>
          {TIER_FEATURES.map(f => (
            <div key={f.label} className="grid grid-cols-4 gap-2 px-4 py-2.5 border-b border-slate-800/50 last:border-0 text-xs">
              <span className="text-slate-400">{f.label}</span>
              <span className={`text-center ${f.free === '✓' ? 'text-emerald-400' : f.free === '✕' ? 'text-slate-600' : 'text-slate-500'}`}>{f.free}</span>
              <span className={`text-center ${f.family === '✓' ? 'text-emerald-400' : f.family === '✕' ? 'text-slate-600' : 'text-blue-300'}`}>{f.family}</span>
              <span className={`text-center ${f.fleet === '✓' ? 'text-emerald-400' : f.fleet === '✕' ? 'text-slate-600' : 'text-purple-300'}`}>{f.fleet}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-slate-500">
          <Shield className="w-3.5 h-3.5" />
          <p className="text-[10px] font-medium">Payment processing is handled securely.</p>
        </div>

        {/* Free Tier Note */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            Free plan continues working. You don't lose saved data if you don't upgrade.
          </p>
          <button onClick={onClose} className="mt-2 text-xs text-blue-400 hover:text-blue-300">
            Continue with Free Plan →
          </button>
        </div>

        <p className="text-[10px] text-slate-700 text-center mt-4">Safe & secure checkout</p>
      </div>
    </div>
  );
}
