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
              <img src={heroImage} alt="MTXtrkr Dashboard" className="w-full h-auto group-hover:scale-[1.01] transition-transform duration-700" />
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
            From basic logging to smart predictive maintenance, MTXtrkr has you covered.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Vehicle Management', desc: 'Track all your vehicles in one place with detailed specs, photos, and license info.', img: vehicleMgmtImg },
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

      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 border-t border-slate-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From driveway to digital health record in 3 simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              step: '01',
              title: 'Add Your Vehicle',
              desc: 'Scan your VIN or select your make/model. We instantly load your manufacturer’s exact maintenance schedule.'
            },
            {
              step: '02',
              title: 'Log with Ease',
              desc: 'Log services in seconds. Use our AI Co-Pilot to translate informal notes into professional records—even offline.'
            },
            {
              step: '03',
              title: 'Drive with Confidence',
              desc: 'Receive smart, predictive reminders. Generate a professional Resale Report that proves your car was meticulously maintained.'
            }
          ].map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="text-5xl font-black text-blue-500/10 absolute -top-8 -left-4 group-hover:text-blue-500/20 transition-colors">{item.step}</div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 border-t border-slate-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by Thousands of Drivers
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From single-vehicle owners to multi-asset fleets — MTXtrkr keeps them on the road.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Testimonial 1 — Non-Auto-Savvy Owner */}
          <div className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-sm text-slate-300 leading-relaxed mb-6 min-h-[80px]">
              "I used to nod along whenever my mechanic said I needed something — had no idea if it was real or just an upsell. Now I check MTXtrkr first. It tells me what's actually due, in plain English. Saved me $400 on a 'needed' transmission flush that wasn't due for another 30,000 miles."
            </blockquote>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center text-sm font-bold text-blue-300">
                MG
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Maria Gonzalez</p>
                <p className="text-xs text-slate-500">2021 Toyota Tacoma · San Antonio, TX</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 — DIY Enthusiast */}
          <div className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-sm text-slate-300 leading-relaxed mb-6 min-h-[80px]">
              "I've got a Miata project car and a Civic daily driver — keeping track of parts, services, and mileage for both used to be a spreadsheet nightmare. MTXtrkr handles everything: I scan receipts at the parts store, log my weekend work with the AI Co-Pilot, and get reminded when the daily needs tires. Premium was a no-brainer for multiple vehicles."
            </blockquote>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-sm font-bold text-purple-300">
                JM
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Jake Morrison</p>
                <p className="text-xs text-slate-500">'97 Mazda Miata + '20 Honda Civic · Portland, OR</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 — Fleet Manager */}
          <div className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-sm text-slate-300 leading-relaxed mb-6 min-h-[80px]">
              "I run 5 F-150s, 2 tractors, and a forklift for my landscaping business. Before MTXtrkr, I had three different spreadsheets and still missed oil changes. Now everything lives in one dashboard — different vehicle types, different schedules, all tracked. My mechanic even commented that our fleet records are the best he's ever seen from a small business."
            </blockquote>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center text-sm font-bold text-emerald-300">
                TC
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Trevor Chen</p>
                <p className="text-xs text-slate-500">Fleet Manager — GreenScape Landscaping · Denver, CO</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 border-t border-slate-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Is MTXtrkr really free?',
              a: 'Yes! Our Free tier allows you to track one vehicle with manual mileage updates and standard reminders. Premium unlocks unlimited vehicles, AI predictions, and advanced analytics.'
            },
            {
              q: 'Does it work for electric vehicles (EVs)?',
              a: 'Absolutely. MTXtrkr is EV-aware. We won’t remind you to change your oil on a Tesla, but we will help you track tire rotations and brake fluid health.'
            },
            {
              q: 'Can I use it without an internet connection?',
              a: 'Yes. MTXtrkr is built as an offline-first PWA. You can log services in underground garages, and your data syncs automatically once you’re back online.'
            },
            {
              q: 'How does the AI Co-Pilot work?',
              a: 'Type informal notes like "engine is squeaking." Our AI analyzes your vehicle’s engineering and suggests the likely issue, estimated costs, and logs it professionally.'
            }
          ].map((faq, idx) => (
            <details key={idx} className="group rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden transition-all">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="text-sm font-semibold text-white">{faq.q}</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Email Capture Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Never Miss a Service Again</h2>
              <p className="text-blue-50/80 text-sm">Join 12,000+ drivers and get our "Vehicle Longevity Checklist" free when you sign up for updates.</p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-100/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button className="px-6 py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-colors shadow-lg">
                Get My Checklist
              </button>
            </form>
          </div>
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
            <p className="text-[10px] text-slate-600 mt-3 text-center">Secure checkout via Stripe</p>
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
          © 2026 MTXtrkr. All rights reserved. Built with ❤️ for car enthusiasts.
        </div>
      </footer>
    </div>
  );
}