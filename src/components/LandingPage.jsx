import {
  Car, Bell, Cloud, Shield, Star, CheckCircle, ChevronRight, ArrowRight,
  Smartphone, Wifi, BarChart3, DollarSign, Clock, Upload,
  Crown, Gauge, Calendar, TrendingUp, Brain, Sparkles, Save, Wrench, Lightbulb,
  AlertTriangle, Tractor, Package, Ship, Anchor, Cog, Truck, Building, Database,
  Bike
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Dynamic Blueprint Engineering Grid Background - Dialed down to let mechanical graphics dominate */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10">
          <defs>
            <pattern id="sub-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.01)" strokeWidth="0.5" />
            </pattern>
            <pattern id="main-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100%" height="100%" fill="url(#sub-grid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(148, 163, 184, 0.025)" strokeWidth="1" />
              <path d="M 0 4 L 0 -4 M -4 0 L 4 0 M 100 4 L 100 -4 M 96 0 L 104 0 M 0 104 L 0 96" fill="none" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#main-grid)" />
        </svg>
      </div>

      {/* Absolutely Positioned Schematic Artwork - Prominent, staggered side-to-side mechanical schematics */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Graphic 1: Rotary Assembly / Dial - Top Right behind Hero */}
        <SchematicDial className="absolute top-[3%] right-0 sm:right-0 lg:right-16 xl:right-32 w-48 h-48 sm:w-[420px] sm:h-[420px] opacity-50 sm:opacity-50 hover:opacity-75 hover:scale-[1.03] transition-all duration-700" />

        {/* Graphic 1b: Interlocking Gear Train - Left Upper Section */}
        <GearTrainSchematic className="absolute top-[16%] left-0 sm:-left-20 lg:left-0 xl:left-12 w-48 h-auto sm:w-72 opacity-50 sm:opacity-50 hover:opacity-75 hover:scale-[1.03] transition-all duration-700" />

        {/* Graphic 2: Combustion Cylinder - Right margin behind Features */}
        <CylinderSchematic className="absolute top-[32%] right-0 sm:-right-20 lg:right-0 xl:right-12 w-48 h-auto sm:w-64 opacity-50 sm:opacity-50 hover:opacity-75 hover:scale-[1.03] transition-all duration-700" />

        {/* Graphic 3: Coil Spring Suspension - Left margin behind Lease Section */}
        <SuspensionSchematic className="absolute top-[52%] left-0 sm:-left-20 lg:left-0 xl:left-12 w-48 h-auto sm:w-64 opacity-50 sm:opacity-50 hover:opacity-75 hover:scale-[1.03] transition-all duration-700" />

        {/* Graphic 4: AWD Drivetrain Layout - Right margin behind Testimonials/FAQ */}
        <DrivetrainSchematic className="absolute top-[72%] right-0 sm:-right-20 lg:right-0 xl:right-12 w-48 h-auto sm:w-64 opacity-50 sm:opacity-50 hover:opacity-75 hover:scale-[1.03] transition-all duration-700" />
      </div>

      {/* Landing Page Content is wrapped in relative z-10 container to stay on top */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_70%)]" />

          <div className="max-w-6xl mx-auto px-4 pt-16 pb-24 relative">
          <div className="flex flex-col items-center text-center">
            {/* Brand Name + Tagline */}
            <div className="mb-8">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
                MTXtrkr
              </h2>
              <p className="text-lg sm:text-xl text-slate-400 italic mt-1">
                Maintenance Tracker
              </p>
              <p className="text-sm sm:text-base text-slate-500 italic">
                — Your Owner's Manual Simplified
              </p>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              <span className="text-white">Never Miss a </span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Service</span>
              <span className="text-white"> Again</span>
            </h1>

            {/* Text Block */}
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 sm:p-8 mb-10 max-w-2xl w-full">
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-4">
                Modern cars tell you when to change your oil —<br />
                <span className="text-white/80">then they go silent.</span>
              </p>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed">
                MTXtrkr translates your vehicle's engineering into plain English — so you know when a <strong className="text-slate-300">transmission flush</strong>, a <strong className="text-slate-300">differential service</strong>, or a <strong className="text-slate-300">coolant exchange</strong> is actually due. No more nodding along at the mechanic. No more costly breakdowns from what you didn't know you were missing.
              </p>
            </div>

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
            { title: 'Vehicle Management', desc: 'Track all your vehicles in one place with detailed specs, maintenance charts, records, registrations, photos, and more.', img: vehicleMgmtImg },
            { title: 'Smart Reminders', desc: 'Mileage & time-based alerts that learn your driving patterns.', img: remindersImg },
            { title: 'AI Co-Pilot', desc: 'Ask it anything — "engine is squeaking when I turn on the AC" or "the car shuttered when I pulled away from the stoplight". Our AI will give you a detailed assessment and send you in the right direction; not to mention keep you from getting swindled. Backed by maintenance schedules from 55+ manufacturers — from Ford and Toyota to CAT, Cummins, and Yamaha.', img: aiCopilotImg },
            { title: 'Expense Analytics', desc: 'Track costs per vehicle, per month, with beautiful charts.', img: analyticsImg },
            { title: 'Document Storage', desc: 'Organize purchase records, insurance, photos, and registration in one place. Get automatic renewal reminders 90, 60, and 30 days before your registration expires.', img: documentsImg },
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

      {/* Lease Mileage Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-blue-600/5 to-cyan-600/5 border border-blue-500/20 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start gap-10">
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-4">
                <Calendar className="w-3 h-3" />
                Lease Protection — Premium Feature
              </div>

              {/* Headline */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Your Lease Says 36,000 Miles.
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  MTXtrkr Tells You If You'll Make It.
                </span>
              </h2>

              {/* Body */}
              <p className="text-slate-400 leading-relaxed mb-6">
                The average lease overage fee is $0.25 per mile. Going 5,000 miles over costs $1,250 —
                on top of your turn-in fees. Most people don't realize they're over until the bill arrives.
              </p>
              <p className="text-slate-400 leading-relaxed mb-6">
                MTXtrkr's Lease Mileage Projector gives you a crystal ball. Tell us your lease end date
                and mileage limit. We track your actual driving and project your odometer at any future
                date — next month, next year, or at turn-in. If you're on track to exceed your limit,
                you'll see it before the fees pile up.
              </p>

              {/* Feature List */}
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {[
                  { icon: TrendingUp, label: 'Predictive mileage at any date' },
                  { icon: Gauge, label: 'Current vs. limit tracking' },
                  { icon: Calendar, label: 'Turn-in date awareness' },
                  { icon: Bell, label: 'Monthly email alerts (Premium)' },
                ].map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 font-medium">{feat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <button
                onClick={onViewPremium}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all text-sm"
              >
                <Crown className="w-4 h-4" />
                Get Premium — Protect Your Lease
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-slate-600 mt-2">Free plan includes basic lease setup. Premium adds predictions and alerts.</p>
            </div>

            {/* Visual — Dashboard Mockup */}
            <div className="flex-1 w-full max-w-sm">
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                {/* Dashboard Card */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-medium text-amber-300">Lease Mileage Projector</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-500">2023 Honda CR-V</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-medium">Leased</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Current</span>
                        <span className="text-white font-medium">24,450 mi</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Projected at turn-in</span>
                        <span className="text-amber-300 font-medium">38,200 mi</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Your limit</span>
                        <span className="text-white font-medium">36,000 mi</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>Used: 68%</span>
                        <span>Limit: 100%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500" style={{width: '106%'}} />
                      </div>
                      <p className="text-[10px] text-red-400 mt-1 font-medium">⚠️ 2,200 mi over — adjust driving or plan early turn-in</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              desc: 'Copy & Paste your VIN into "add vehicle" or select your make/model/engine/drivetrain. We instantly load your manufacturer’s exact maintenance schedule.'
            },
            {
              step: '02',
              title: 'Log with Ease',
              desc: 'Log services in seconds. Use our AI Co-Pilot to navigate issues or translate informal notes into professional records—or—simply upload a receipt and have a service record auto populate a log—even offline.'
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

          {/* Testimonial 2 — Multi-Vehicle Owner */}
          <div className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-sm text-slate-300 leading-relaxed mb-6 min-h-[80px]">
              "I needed one place to track the daily driver and the project car. The Datsun doesn't have a computer — it doesn't tell me anything. I just snap a photo of every part I buy for it, type 'installed new carb' into the AI thing, and it logs it for me. The Tucson is the opposite — I just scan the oil change receipts and it handles the rest. Two totally different cars, one app. That's all I needed."
            </blockquote>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-sm font-bold text-purple-300">
                CP
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Chris Park</p>
                <p className="text-xs text-slate-500">2022 Hyundai Tucson + 1972 Datsun 240Z · Seattle, WA</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 — Small Business Owner / Fleet Manager */}
          <div className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-sm text-slate-300 leading-relaxed mb-6 min-h-[80px]">
              "I run a landscaping company with three Transit vans, a GMC 2500 AT4, a Kubota tractor, and a Polaris ATV — six vehicles, four different types. Before MTXtrkr I had a binder full of handwritten oil change dates and sticky notes. Now all six are in one app, each tracked differently because they're not the same thing. The tractor and ATV run on hours, the vans and truck run on miles, and MTXtrkr handles both. My mechanic asked if I hired a fleet manager. Nope. Just the app."
            </blockquote>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center text-sm font-bold text-emerald-300">
                LK
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Lisa Kim</p>
                <p className="text-xs text-slate-500">3 Ford Transit vans + 1 GMC 2500 AT4 + 1 Kubota tractor + 1 Polaris ATV · Portland, OR</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Types Section — One App, Every Vehicle */}
      <div className="max-w-6xl mx-auto px-4 py-20 border-t border-slate-800/50">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-4">
            <Wrench className="w-3 h-3" />
            One App, Every Vehicle You Own
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            From Cars to Tractors to Semi-Trucks
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            MTXtrkr handles 9 different vehicle types — each with its own maintenance rules, 
            measurement units, and identification system. All in one dashboard.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {[
            { icon: Car, label: 'Car / Truck', color: 'bg-blue-600/20 text-blue-400' },
            { icon: Bike, label: 'Motorcycle', color: 'bg-slate-800/60 text-slate-300' },
            { icon: Tractor, label: 'Ag Equipment', color: 'bg-green-700/20 text-green-400' },
            { icon: Package, label: 'Forklift', color: 'bg-amber-700/20 text-amber-400' },
            { icon: Ship, label: 'Watercraft', color: 'bg-cyan-700/20 text-cyan-400' },
            { icon: Anchor, label: 'Outboard', color: 'bg-teal-700/20 text-teal-400' },
            { icon: Cog, label: 'Marine Diesel', color: 'bg-indigo-700/20 text-indigo-400' },
            { icon: Truck, label: 'Semi-Truck', color: 'bg-red-700/20 text-red-400' },
            { icon: Building, label: 'RV', color: 'bg-purple-700/20 text-purple-400' },
          ].map((vt, i) => {
            const Icon = vt.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/20 transition-all group">
                <div className={`w-10 h-10 rounded-xl ${vt.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {Icon ? <Icon className="w-5 h-5" /> : <span className="text-[10px] font-bold">{vt.icon}</span>}
                </div>
                <span className="text-[10px] text-slate-400 font-medium text-center leading-tight">{vt.label}</span>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <p className="text-xs text-slate-600 max-w-xl mx-auto">
            Each type gets its own form fields — VIN for cars and trucks, HIN for watercraft, 
            engine hours for equipment, serial numbers for marine engines. License plates show 
            where they're needed, hide where they're not. All tracked in one unified fleet dashboard.
          </p>
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
              a: '<div><p class="mb-4">Absolutely. MTXtrkr is built as an offline-first PWA. You can log services in underground garages, upload receipts on the go, and every change syncs automatically once you\'re back online — no manual export, no data loss.</p><div class="grid grid-cols-2 gap-3 mt-4"><div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"><span class="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg></span><span class="text-xs text-slate-300">Mobile First</span></div><div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"><span class="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12" y2="20"/></svg></span><span class="text-xs text-slate-300">Auto Sync</span></div><div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"><span class="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span><span class="text-xs text-slate-300">Real-time</span></div><div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"><span class="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg></span><span class="text-xs text-slate-300">Cloud Backup</span></div></div><div class="mt-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50"><div class="flex items-center gap-2 text-xs text-slate-400 mb-3"><span class="w-2 h-2 rounded-full bg-emerald-400"></span>Last sync: Just now<span class="ml-auto text-emerald-400"><svg class="w-3 h-3 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12" y2="20"/></svg></span></div><div class="space-y-2"><div class="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50"><div class="font-medium text-sm text-white">2023 Toyota Camry</div><div class="text-xs text-slate-500 mt-1">45,230 miles — 3 reminders due</div></div><div class="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50"><div class="font-medium text-sm text-white">2018 Honda Civic</div><div class="text-xs text-slate-500 mt-1">89,100 miles — Service overdue</div></div><div class="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50"><div class="font-medium text-sm text-white">2021 Ford F-150</div><div class="text-xs text-slate-500 mt-1">32,500 miles — All good</div></div></div></div></div>'
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
              <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4" dangerouslySetInnerHTML={{ __html: faq.a }}></div>
            </details>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-600">
          © 2026 MTXtrkr. All rights reserved. Built with ❤️ for car enthusiasts.
        </div>
      </footer>
      </div> {/* Close of z-10 wrapper */}
    </div>
  );
}

// ============================================================================
// MECHANICAL MEETS ORGANIZATION BACKGROUND DECORATIONS (SVG SCHEMATICS)
// ============================================================================

function SchematicDial({ className }) {
  return (
    <svg className={`pointer-events-none select-none ${className}`} width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,8" className="text-slate-400/40" />
      <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
      <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="12,12" className="text-slate-400/30" />
      <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="1" className="text-slate-400/30" />
      <circle cx="200" cy="200" r="10" stroke="currentColor" strokeWidth="1.5" className="text-blue-400/40" />
      
      {/* Central Crosshairs */}
      <line x1="200" y1="10" x2="200" y2="390" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,4" className="text-slate-400/30" />
      <line x1="10" y1="200" x2="390" y2="200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,4" className="text-slate-400/30" />
      
      {/* 45 Deg lines */}
      <line x1="66" y1="66" x2="334" y2="334" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,15" className="text-slate-500" />
      <line x1="66" y1="334" x2="334" y2="66" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,15" className="text-slate-500" />

      {/* Styled Ticks on the 150px circle */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 200 + 145 * Math.cos(angle);
        const y1 = 200 + 145 * Math.sin(angle);
        const x2 = 200 + 155 * Math.cos(angle);
        const y2 = 200 + 155 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" className="text-slate-400/40" />;
      })}

      {/* Dimension Line with Arrow */}
      <path d="M 200 80 L 110 80 M 110 80 L 115 76 M 110 80 L 115 84" stroke="currentColor" strokeWidth="1" className="text-blue-400/40" />
      <text x="115" y="72" fill="currentColor" className="text-blue-300/50 font-mono" style={{ fontSize: '8px' }}>R_120.00mm</text>

      <path d="M 200 320 L 320 320 M 320 320 L 315 316 M 320 320 L 315 324" stroke="currentColor" strokeWidth="1" className="text-slate-400/40" />
      <text x="240" y="315" fill="currentColor" className="text-slate-400/40 font-mono" style={{ fontSize: '7px' }}>PITCH_DIA: Ø240</text>

      {/* Angle markings */}
      <text x="205" y="25" fill="currentColor" className="text-slate-400/30 font-mono" style={{ fontSize: '8px' }}>000°</text>
      <text x="370" y="203" fill="currentColor" className="text-slate-400/30 font-mono" style={{ fontSize: '8px' }}>090°</text>
      <text x="205" y="385" fill="currentColor" className="text-slate-400/30 font-mono" style={{ fontSize: '8px' }}>180°</text>
      <text x="15" y="203" fill="currentColor" className="text-slate-400/30 font-mono" style={{ fontSize: '8px' }}>270°</text>

      <text x="215" y="155" fill="currentColor" className="text-slate-500/30 font-mono font-bold" style={{ fontSize: '8px' }}>DIFFERENTIAL SPEC</text>
      <text x="215" y="167" fill="currentColor" className="text-blue-400/40 font-mono" style={{ fontSize: '8px' }}>RATIO: 3.73:1</text>
    </svg>
  );
}

function CylinderSchematic({ className }) {
  return (
    <svg className={`pointer-events-none select-none ${className}`} width="300" height="500" viewBox="0 0 300 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Centerline */}
      <line x1="150" y1="10" x2="150" y2="490" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,6" className="text-slate-400/30" />

      {/* Cylinder Walls */}
      <line x1="70" y1="40" x2="70" y2="340" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
      <line x1="230" y1="40" x2="230" y2="340" stroke="currentColor" strokeWidth="1" className="text-slate-500" />

      {/* Piston Head */}
      <rect x="75" y="80" width="150" height="80" rx="4" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
      {/* Piston Rings slots */}
      <line x1="75" y1="95" x2="225" y2="95" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" className="text-slate-500" />
      <line x1="75" y1="105" x2="225" y2="105" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" className="text-slate-500" />
      <line x1="75" y1="115" x2="225" y2="115" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" className="text-slate-500" />

      {/* Piston Pin (Gudgeon Pin) */}
      <circle cx="150" cy="130" r="16" stroke="currentColor" strokeWidth="1" className="text-slate-400" />

      {/* Connecting Rod */}
      <path d="M 142 146 L 125 350 L 175 350 L 158 146 Z" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
      <circle cx="150" cy="350" r="22" stroke="currentColor" strokeWidth="1" className="text-slate-400" />

      {/* Crankshaft Orbit */}
      <circle cx="150" cy="350" r="70" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4" className="text-slate-400/30" />
      <circle cx="150" cy="350" r="6" stroke="currentColor" strokeWidth="1.5" className="text-blue-400/40" />
      <path d="M 150 350 L 210 310" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-slate-400/30" />
      <circle cx="210" cy="310" r="12" stroke="currentColor" strokeWidth="1" className="text-slate-500" />

      {/* Hatching/Section lines */}
      <path d="M 30 50 L 60 20 M 30 100 L 60 70 M 30 150 L 60 120 M 30 200 L 60 170 M 30 250 L 60 220" stroke="currentColor" strokeWidth="0.5" className="text-slate-700" />
      <path d="M 240 50 L 270 20 M 240 100 L 270 70 M 240 150 L 270 120 M 240 200 L 270 170 M 240 250 L 270 220" stroke="currentColor" strokeWidth="0.5" className="text-slate-700" />

      {/* Annotations */}
      <path d="M 70 50 L 230 50 M 70 45 L 70 55 M 230 45 L 230 55" stroke="currentColor" strokeWidth="0.75" className="text-blue-400/40" />
      <text x="110" y="44" fill="currentColor" className="text-blue-300/50 font-mono" style={{ fontSize: '8px' }}>BORE: 82.00mm</text>

      <path d="M 245 80 L 245 160 M 240 80 L 250 80 M 240 160 L 250 160" stroke="currentColor" strokeWidth="0.75" className="text-slate-400/40" />
      <text x="252" y="125" fill="currentColor" className="text-slate-400/40 font-mono rotate-90 origin-left" style={{ fontSize: '8px' }}>STROKE: 85.0mm</text>

      {/* Text block */}
      <text x="165" y="220" fill="currentColor" className="text-slate-500/30 font-mono" style={{ fontSize: '8px' }}>COMBUSTION CHAMBER</text>
      <text x="165" y="232" fill="currentColor" className="text-slate-500/30 font-mono" style={{ fontSize: '8px' }}>DISPLACEMENT: 449cc</text>
      <text x="165" y="244" fill="currentColor" className="text-slate-500/30 font-mono" style={{ fontSize: '8px' }}>COMPRESSION: 10.5:1</text>
    </svg>
  );
}

function SuspensionSchematic({ className }) {
  return (
    <svg className={`pointer-events-none select-none ${className}`} width="260" height="500" viewBox="0 0 260 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Centerline */}
      <line x1="130" y1="10" x2="130" y2="490" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,6" className="text-slate-400/30" />

      {/* Top Mount */}
      <rect x="90" y="40" width="80" height="30" rx="4" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
      <circle cx="130" cy="30" r="10" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
      <line x1="110" y1="70" x2="150" y2="70" stroke="currentColor" strokeWidth="1" className="text-slate-500" />

      {/* Inner Shaft */}
      <rect x="118" y="70" width="24" height="260" rx="2" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
      {/* Lower damper body */}
      <rect x="110" y="260" width="40" height="150" rx="4" stroke="currentColor" strokeWidth="1.2" className="text-slate-500" />

      {/* Helical Coil Spring */}
      {[...Array(8)].map((_, i) => {
        const yStart = 85 + i * 36;
        return (
          <g key={i}>
            {/* Front Coil Segment */}
            <path d={`M 90 ${yStart} C 90 ${yStart - 10}, 170 ${yStart + 15}, 170 ${yStart + 5}`} stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-slate-500" />
            <path d={`M 90 ${yStart} C 90 ${yStart - 10}, 170 ${yStart + 15}, 170 ${yStart + 5}`} stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-slate-400/60" />
            {/* Coil Highlight */}
            <path d={`M 92 ${yStart - 1} C 92 ${yStart - 8}, 168 ${yStart + 13}, 168 ${yStart + 4}`} stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-slate-300/40" />
          </g>
        );
      })}

      {/* Lower Mount Eyelet */}
      <circle cx="130" cy="440" r="18" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
      <circle cx="130" cy="440" r="8" stroke="currentColor" strokeWidth="1" className="text-slate-500" />

      {/* Dimension & Spec Labels */}
      <path d="M 85 85 L 85 373 M 80 85 L 90 85 M 80 373 L 90 373" stroke="currentColor" strokeWidth="0.75" className="text-slate-400/40" />
      <text x="70" y="240" fill="currentColor" className="text-slate-400/40 font-mono -rotate-90 origin-center" style={{ fontSize: '8px' }}>SPRING_FREE_LEN: 288mm</text>

      <text x="160" y="310" fill="currentColor" className="text-blue-400/40 font-mono" style={{ fontSize: '8px' }}>SPRING RATE: 45 N/mm</text>
      <text x="160" y="322" fill="currentColor" className="text-slate-500/30 font-mono" style={{ fontSize: '8px' }}>COIL OD: Ø90mm</text>
      <text x="160" y="334" fill="currentColor" className="text-slate-500/30 font-mono" style={{ fontSize: '8px' }}>DAMPER STROKE: 120mm</text>
      <text x="160" y="346" fill="currentColor" className="text-slate-500/30 font-mono" style={{ fontSize: '8px' }}>REV_SHOCK: TYPE-COILOVER</text>
    </svg>
  );
}

function DrivetrainSchematic({ className }) {
  return (
    <svg className={`pointer-events-none select-none ${className}`} width="300" height="480" viewBox="0 0 300 480" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Centerline */}
      <line x1="150" y1="10" x2="150" y2="470" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,6" className="text-slate-400/30" />

      {/* Chassis Frame Outline */}
      <path d="M 60 60 L 240 60 L 240 420 L 60 420 Z" stroke="currentColor" strokeWidth="1" strokeDasharray="12,12" className="text-slate-500" />
      {/* Front Bumper & Rear Bumper */}
      <path d="M 100 40 L 200 40" stroke="currentColor" strokeWidth="1.5" className="text-slate-400/40" />
      <path d="M 100 440 L 200 440" stroke="currentColor" strokeWidth="1.5" className="text-slate-400/40" />

      {/* Wheels */}
      <rect x="35" y="80" width="22" height="50" rx="3" stroke="currentColor" strokeWidth="1.2" className="text-slate-400" />
      <rect x="243" y="80" width="22" height="50" rx="3" stroke="currentColor" strokeWidth="1.2" className="text-slate-400" />
      <rect x="35" y="350" width="22" height="50" rx="3" stroke="currentColor" strokeWidth="1.2" className="text-slate-400" />
      <rect x="243" y="350" width="22" height="50" rx="3" stroke="currentColor" strokeWidth="1.2" className="text-slate-400" />

      {/* Axles */}
      <line x1="57" y1="105" x2="243" y2="105" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
      <line x1="57" y1="375" x2="243" y2="375" stroke="currentColor" strokeWidth="1" className="text-slate-500" />

      {/* Front Engine block */}
      <rect x="110" y="70" width="80" height="60" rx="4" stroke="currentColor" strokeWidth="1" className="text-slate-400" fill="rgba(30, 41, 59, 0.3)" />
      <text x="132" y="105" fill="currentColor" className="text-slate-400/40 font-mono font-bold" style={{ fontSize: '8px' }}>ENGINE</text>

      {/* Transmission */}
      <rect x="125" y="130" width="50" height="45" rx="2" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
      <text x="135" y="156" fill="currentColor" className="text-slate-400/30 font-mono" style={{ fontSize: '7px' }}>GEARBOX</text>

      {/* Transfer Case */}
      <rect x="135" y="210" width="30" height="25" rx="2" stroke="currentColor" strokeWidth="1.2" className="text-blue-400/40" />
      <text x="141" y="225" fill="currentColor" className="text-blue-300/50 font-mono" style={{ fontSize: '6px' }}>T-CASE</text>

      {/* Driveshafts */}
      <line x1="150" y1="175" x2="150" y2="210" stroke="currentColor" strokeWidth="2.5" className="text-slate-400" />
      <line x1="150" y1="235" x2="150" y2="375" stroke="currentColor" strokeWidth="2.5" className="text-slate-400" />

      {/* Differentials */}
      <circle cx="150" cy="105" r="10" stroke="currentColor" strokeWidth="1" className="text-slate-400" fill="rgba(30, 41, 59, 0.3)" />
      <circle cx="150" cy="375" r="12" stroke="currentColor" strokeWidth="1" className="text-slate-400" fill="rgba(30, 41, 59, 0.3)" />

      {/* Spec labels */}
      <path d="M 130 222 L 75 222 L 75 250" stroke="currentColor" strokeWidth="0.75" className="text-blue-400/40" />
      <text x="45" y="262" fill="currentColor" className="text-blue-300/50 font-mono" style={{ fontSize: '8px' }}>AWD TRANSFER CASE</text>
      <text x="45" y="274" fill="currentColor" className="text-slate-400/40 font-mono" style={{ fontSize: '7px' }}>FLUID CHANGE: 60K MI</text>

      <path d="M 162 375 L 215 375 L 215 345" stroke="currentColor" strokeWidth="0.75" className="text-slate-400/40" />
      <text x="180" y="335" fill="currentColor" className="text-slate-400/40 font-mono" style={{ fontSize: '8px' }}>REAR DIFFERENTIAL</text>

      <text x="80" y="460" fill="currentColor" className="text-slate-500/30 font-mono" style={{ fontSize: '8px' }}>DRIVETRAIN LAYOUT: AWD (4WD-LOCK)</text>
    </svg>
  );
}

function GearTrainSchematic({ className }) {
  return (
    <svg className={`pointer-events-none select-none ${className}`} width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gear 1 (Large - Left) */}
      <g transform="translate(130, 150)">
        <circle cx="0" cy="0" r="90" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
        <circle cx="0" cy="0" r="70" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" className="text-slate-400" />
        <circle cx="0" cy="0" r="30" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
        <circle cx="0" cy="0" r="10" stroke="currentColor" strokeWidth="1.5" className="text-blue-400/40" />
        
        {/* Gear Teeth for Gear 1 (24 teeth) */}
        {[...Array(24)].map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x1 = 88 * Math.cos(angle);
          const y1 = 88 * Math.sin(angle);
          const x2 = 100 * Math.cos(angle);
          const y2 = 100 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-slate-400" />;
        })}
        
        {/* Structural spokes */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180;
          const x1 = 30 * Math.cos(angle);
          const y1 = 30 * Math.sin(angle);
          const x2 = 90 * Math.cos(angle);
          const y2 = 90 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.75" className="text-slate-400/40" />;
        })}
        <text x="35" y="-10" fill="currentColor" className="text-slate-400/40 font-mono text-[8px]" style={{ fontSize: '7px' }}>GEAR_01: Z=24</text>
      </g>

      {/* Gear 2 (Medium - Right) */}
      {/* Centered to mesh with Gear 1 */}
      <g transform="translate(290, 150)">
        <circle cx="0" cy="0" r="60" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
        <circle cx="0" cy="0" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" className="text-slate-400" />
        <circle cx="0" cy="0" r="20" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
        <circle cx="0" cy="0" r="8" stroke="currentColor" strokeWidth="1.5" className="text-slate-400/40" />
        
        {/* Gear Teeth for Gear 2 (16 teeth, offset by 7.5 deg to mesh) */}
        {[...Array(16)].map((_, i) => {
          const angle = ((i * 22.5 + 7.5) * Math.PI) / 180;
          const x1 = 58 * Math.cos(angle);
          const y1 = 58 * Math.sin(angle);
          const x2 = 68 * Math.cos(angle);
          const y2 = 68 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2.2" className="text-slate-400" />;
        })}
        
        {/* Spokes */}
        {[...Array(4)].map((_, i) => {
          const angle = (i * 90 * Math.PI) / 180;
          const x1 = 20 * Math.cos(angle);
          const y1 = 20 * Math.sin(angle);
          const x2 = 60 * Math.cos(angle);
          const y2 = 60 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.75" className="text-slate-400/40" />;
        })}
        <text x="-55" y="-25" fill="currentColor" className="text-slate-400/40 font-mono text-[8px]" style={{ fontSize: '7px' }}>GEAR_02: Z=16</text>
        <text x="-55" y="-15" fill="currentColor" className="text-blue-400/40 font-mono text-[8px]" style={{ fontSize: '7px' }}>RPM_RATIO: 1.5</text>
      </g>

      {/* Meshing contact details */}
      <path d="M 194 150 L 194 130 M 194 150 L 210 150" stroke="currentColor" strokeWidth="0.5" className="text-blue-400/40" />
      <circle cx="194" cy="150" r="3" fill="currentColor" className="text-blue-400/40" />
      <text x="182" y="120" fill="currentColor" className="text-blue-300/50 font-mono text-[7px]" style={{ fontSize: '6.5px' }}>MESH_POINT</text>
    </svg>
  );
}