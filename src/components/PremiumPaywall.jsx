import { useState } from 'react';
import {
  Star, Crown, CheckCircle, X, ArrowRight, Sparkles, Zap, Shield, Cloud, BarChart3, Upload, Loader2
} from 'lucide-react';

export default function PremiumPaywall({ onClose, onUpgrade, userId, trackEvent }) {
  const [loading, setLoading] = useState(null);

  const handleCheckout = async (plan) => {
    if (loading) return;
    setLoading(plan);

    try {
      trackEvent?.('premium_checkout_started', { plan, price: plan === 'yearly' ? 39.99 : 4.99, userId });

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session:', data.error);
        alert('Could not start checkout. Please try again later.');
        setLoading(null);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('An error occurred. Please try again.');
      setLoading(null);
    }
  };

  const features = [
    { icon: Star, label: 'Unlimited Vehicles', desc: 'Track your entire fleet' },
    { icon: Zap, label: 'AI Mileage Predictions', desc: 'Auto-detect from fuel receipts*' },
    { icon: BarChart3, label: 'Advanced Analytics', desc: 'Expense breakdowns & charts' },
    { icon: Cloud, label: 'Cloud Document Storage', desc: 'Store receipts & PDFs' },
    { icon: Shield, label: 'Premium Resale Reports', desc: 'Full service history PDF' },
    { icon: Upload, label: 'Priority Support', desc: 'Fast, dedicated help' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Close */}
        <button onClick={onClose} className="mb-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            PREMIUM
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Upgrade Your Experience
          </h1>
          <p className="text-slate-400 text-sm">
            Unlock the full power of MTXtrkr
          </p>
        </div>

        {/* Pricing */}
        <div className="space-y-4 mb-6">
          {/* Monthly */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all hover:border-blue-500/30 group">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-lg">Monthly</h3>
                <p className="text-slate-400 text-xs">Flexible, cancel anytime</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">$4.99</div>
                <div className="text-[10px] text-slate-500">per month</div>
              </div>
            </div>
            <button
              onClick={() => handleCheckout('monthly')}
              disabled={loading !== null}
              className="w-full py-3 rounded-xl bg-slate-800 group-hover:bg-blue-600 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'monthly' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Choose Monthly
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Yearly */}
          <div className="bg-gradient-to-b from-blue-600/10 to-cyan-600/5 border border-blue-500/30 rounded-2xl p-5 shadow-xl shadow-blue-500/10 transition-all hover:border-blue-500/50 group relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <div className="bg-emerald-500 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Save 33%
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  Yearly
                  <span className="bg-blue-500/20 text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full">Best Value</span>
                </h3>
                <p className="text-slate-400 text-xs">One payment, full year access</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">$39.99</div>
                <div className="text-[10px] text-slate-500">per year</div>
              </div>
            </div>
            <button
              onClick={() => handleCheckout('yearly')}
              disabled={loading !== null}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'yearly' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Crown className="w-4 h-4 text-yellow-300" />
                  Choose Yearly
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-1.5 text-slate-500">
            <Shield className="w-3.5 h-3.5" />
            <p className="text-[10px] font-medium">Your purchase will be processed securely by Stripe</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{f.label}</div>
                  <div className="text-xs text-slate-500">{f.desc}</div>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            );
          })}
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