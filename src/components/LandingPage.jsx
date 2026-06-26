import {
  Car, Bell, Cloud, Shield, Star, CheckCircle, ChevronRight, ArrowRight,
  Smartphone, Wifi, BarChart3, DollarSign, Clock, Upload
} from 'lucide-react';
import heroImage from '/assets/hero.png';
import vehicleMgmtImg from '/assets/features/vehicle-mgmt.png';
import remindersImg from '/assets/features/reminders.png';
import aiCopilotImg from '/assets/features/ai-copilot.png';
import analyticsImg from '/assets/features/analytics.png';
import documentsImg from '/assets/features/documents.png';
import serviceLogImg from '/assets/features/service-log.png';

export default function LandingPage({ onGetStarted, onViewPremium }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

        <div className="max-w-6xl mx-auto px-4 pt-16 pb-24 relative">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-8">
              <Star className="w-3.5 h-3.5" />
              Smart Vehicle Maintenance Tracker
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              <span className="text-white">Never Miss a </span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Service</span>
              <span className="text-white"> Again</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
              The smartest way to track your vehicle's maintenance history,
              get mileage-based reminders, and maximize resale value — all
              from your phone, even offline.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200"
              >
                <Car className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onViewPremium}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200"
              >
                <Star className="w-5 h-5" />
                See Premium
              </button>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-3xl">
              {[
                { label: 'Active Users', value: '12K+' },
                { label: 'Services Logged', value: '150K+' },
                { label: 'Avg. Savings', value: '$420/yr' },
                { label: 'Rating', value: '4.9 ★' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
            {/* Hero Image */}
            <div className="relative mt-16 max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-blue-500/20 group">
              <img src={heroImage} alt="MyAutoLog Dashboard" className="w-full h-auto group-hover:scale-[1.01] transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From basic logging to smart predictive maintenance, MyAutoLog has you covered.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Vehicle Management', desc: 'Add unlimited vehicles with detailed specs, photos, and license info.', img: vehicleMgmtImg },
            { title: 'Smart Reminders', desc: 'Mileage & time-based alerts that learn your driving patterns.', img: remindersImg },
            { title: 'AI Co-Pilot', desc: 'Convert informal notes into structured maintenance records instantly.', img: aiCopilotImg },
            { title: 'Expense Analytics', desc: 'Track costs per vehicle, per month, with beautiful charts.', img: analyticsImg },
            { title: 'Document Storage', desc: 'Upload and store receipts, photos, and service documents in the cloud.', img: documentsImg },
            { title: 'Service History', desc: 'Generate a complete digital health record to boost resale value.', img: serviceLogImg },
          ].map(feat => {
            return (
              <div key={feat.title} className="group p-1 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300">
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-slate-950">
                  <img src={feat.img} alt={feat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Teaser / Mock Paywall */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Start free, upgrade when you need more power.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="relative p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
            <p className="text-sm text-slate-400 mb-6">Perfect for getting started</p>
            <div className="text-4xl font-bold text-white mb-6">
              $0<span className="text-lg text-slate-500 font-normal">/mo</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                '1 Vehicle',
                'Basic service logging',
                'Manual mileage updates',
                'Standard reminders',
                'Email support',
              ].map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-all"
            >
              Get Started Free
            </button>
          </div>

          {/* Premium Tier - Highlighted */}
          <div className="relative p-8 rounded-2xl bg-gradient-to-b from-blue-600/10 to-cyan-600/5 border border-blue-500/30 shadow-xl shadow-blue-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-xs font-bold text-white shadow-lg">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
            <p className="text-sm text-slate-400 mb-6">For serious car enthusiasts</p>
            <div className="text-4xl font-bold text-white mb-6">
              $4.99<span className="text-lg text-slate-500 font-normal">/mo</span>
            </div>
            <div className="text-sm text-emerald-400 mb-4 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Save 33% — <strong>$39.99/yr</strong></span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited Vehicles',
                'AI mileage predictions*',
                'Auto mileage from fuel receipts',
                'Advanced expense analytics',
                'Cloud document storage (PDFs)',
                'Premium resale reports',
                'Priority support',
              ].map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={onViewPremium}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200"
            >
              Upgrade to Premium
            </button>
            <p className="text-[10px] text-slate-600 mt-3 text-center">*Coming soon</p>
          </div>
        </div>
      </div>

      {/* Offline Demo */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-4">
                <Wifi className="w-3 h-3" />
                Offline-First Architecture
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Works Offline. Syncs Automatically.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Log your oil change in a parking garage with no signal.
                Upload receipts on the go. Every change syncs to the cloud
                the moment you're back online — no manual export, no data loss.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Smartphone, label: 'Mobile First' },
                  { icon: Wifi, label: 'Auto Sync' },
                  { icon: Clock, label: 'Real-time' },
                  { icon: Cloud, label: 'Cloud Backup' },
                ].map(f => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-400" />
                      </div>
                      {f.label}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex-1 w-full max-w-sm">
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    Last sync: Just now
                    <Wifi className="w-3 h-3 ml-auto text-emerald-400" />
                  </div>
                  {[
                    { label: '2023 Toyota Camry', sub: '45,230 miles — 3 reminders due' },
                    { label: '2018 Honda Civic', sub: '89,100 miles — Service overdue' },
                    { label: '2021 Ford F-150', sub: '32,500 miles — All good' },
                  ].map((v, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50">
                      <div className="font-medium text-sm text-white">{v.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{v.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-600">
          © 2026 MyAutoLog. All rights reserved. Built with ❤️ for car enthusiasts.
        </div>
      </footer>
    </div>
  );
}