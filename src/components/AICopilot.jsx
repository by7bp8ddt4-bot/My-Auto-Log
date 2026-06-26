import { useState } from 'react';
import {
  Brain, Sparkles, MessageSquareText, Save, CheckCircle2, Loader2,
  Lightbulb, Wrench, Calendar, ArrowRight, Zap
} from 'lucide-react';
import { formatNumber, formatDate } from '../utils/helpers';

// Mock AI translations for the informal input
function mockTranslate(input, vehicleMileage) {
  const lower = input.toLowerCase();

  if (lower.includes('squeal') || lower.includes('squeak') || lower.includes('belt')) {
    return {
      diagnosis: 'Serpentine Belt / A/C Compressor Pulley Wear',
      severity: 'Medium',
      action: 'Inspect belt tension and pulley bearings. Replace serpentine belt if cracked or glazed.',
      estimatedCost: '$120–$250',
      loggable: {
        serviceType: 'Belt Inspection & Replacement',
        description: 'Diagnosed: Serpentine belt wear. Action: Inspect belt tension and pulley bearings.',
        mileage: vehicleMileage,
      }
    };
  }
  if (lower.includes('oil') || lower.includes('oil change') || lower.includes('oil thing') || lower.includes('lube')) {
    return {
      diagnosis: 'Engine Oil & Filter Replacement',
      severity: 'Completed',
      action: 'Oil change performed. Reset maintenance minder. Note: Use 0W-20 full synthetic for optimal fuel economy.',
      estimatedCost: '$45–$80',
      loggable: {
        serviceType: 'Oil Change',
        description: 'Engine oil & filter replacement completed.',
        mileage: vehicleMileage,
      }
    };
  }
  if (lower.includes('brake') || lower.includes('squeaking') || lower.includes('grind')) {
    return {
      diagnosis: 'Brake Pad Wear / Rotor Surface Irregularity',
      severity: 'High',
      action: 'Inspect brake pads for minimum thickness. Measure rotor runout. Replace pads if below 3mm, resurface or replace rotors if scored.',
      estimatedCost: '$150–$400 per axle',
      loggable: {
        serviceType: 'Brake Service',
        description: 'Diagnosed: Brake pad wear. Action: Inspect pads and rotors.',
        mileage: vehicleMileage,
      }
    };
  }
  if (lower.includes('tire') || lower.includes('tyre') || lower.includes('rotation') || lower.includes('flat')) {
    return {
      diagnosis: 'Tire Wear / Rotation Due',
      severity: 'Medium',
      action: 'Rotate tires in cross-pattern. Check tread depth (min 2/32"). Inflate to manufacturer spec (usually 32-35 PSI).',
      estimatedCost: '$20–$40 (DIY) / $40–$60 (shop)',
      loggable: {
        serviceType: 'Tire Rotation',
        description: 'Tire rotation performed. Checked tread depth and inflation.',
        mileage: vehicleMileage,
      }
    };
  }
  if (lower.includes('battery') || lower.includes('click') || lower.includes('won\'t start') || lower.includes("wont start") || lower.includes('dead')) {
    return {
      diagnosis: 'Battery Discharge / Starting System Fault',
      severity: 'High',
      action: 'Test battery voltage (target 12.6V+). Load test battery. Check alternator output (13.5-14.5V). Clean corrosion from terminals.',
      estimatedCost: '$100–$200',
      loggable: {
        serviceType: 'Battery Check',
        description: 'Diagnosed: Battery/starting system issue. Action: Test battery and charging system.',
        mileage: vehicleMileage,
      }
    };
  }
  if (lower.includes('check engine') || lower.includes('engine light') || lower.includes('service engine')) {
    return {
      diagnosis: 'Check Engine Light — Diagnostic Trouble Code Pending',
      severity: 'Varies',
      action: 'Scan OBD-II system for stored/ pending codes. Common causes: loose gas cap, O2 sensor, catalytic converter, or ignition coil.',
      estimatedCost: '$0–$150 (scan) + parts as needed',
      loggable: {
        serviceType: 'Diagnostic Scan',
        description: 'Check Engine Light diagnosed via OBD-II scan. Codes retrieved and analyzed.',
        mileage: vehicleMileage,
      }
    };
  }
  if (lower.includes('transmission') || lower.includes('shifting') || lower.includes('slip') || lower.includes('gear')) {
    return {
      diagnosis: 'Transmission Fluid Condition / Shift Quality Concern',
      severity: 'Medium',
      action: 'Check transmission fluid level and color (should be bright red/pink, not dark/burnt). Perform drain-and-fill if due.',
      estimatedCost: '$100–$300 (drain & fill)',
      loggable: {
        serviceType: 'Transmission Service',
        description: 'Transmission fluid checked. Level and condition assessed.',
        mileage: vehicleMileage,
      }
    };
  }
  // Default fallback
  return {
    diagnosis: 'General Vehicle Inspection Recommended',
    severity: 'Low',
    action: 'Perform routine multi-point inspection. Check all fluid levels, belts, hoses, and tire condition.',
    estimatedCost: '$0–$50 (inspection fee)',
    loggable: {
      serviceType: 'Inspection',
      description: `Concern reported: "${input}". General inspection performed.`,
      mileage: vehicleMileage,
    }
  };
}

// Vehicle-specific guidance library
function getSpecificGuidance(vehicle) {
  if (!vehicle) return null;
  const { make, model, year, mileage } = vehicle;
  const m = model?.toLowerCase() || '';
  const mk = make?.toLowerCase() || '';
  const mi = mileage || 0;

  // Honda Civic guidance
  if (mk.includes('honda') && m.includes('civic')) {
    if (mi >= 55000 && mi <= 65000) {
      return {
        title: 'Spark Plug Replacement Recommended',
        icon: 'Zap',
        body: `Your ${year} Civic has a Maintenance Minder system that tracks oil life and component wear. Since you're near 60,000 miles, it's highly recommended to replace your spark plugs. Why? Platinum-tipped plugs gradually lose firing efficiency — fresh ones restore crisp acceleration, prevent misfires, and protect your catalytic converter from expensive damage. Your Civic's 1.5L turbo and 2.0L engines both benefit from genuine NGK or Denso plugs. No complicated jargon: just smooth starts and great fuel economy.`,
        logAction: 'Schedule Spark Plug Replacement',
        logServiceType: 'Spark Plugs Replacement',
        estimatedMileage: 60000,
      };
    }
    if (mi >= 29000 && mi <= 31000) {
      return {
        title: 'Transmission Fluid Change',
        icon: 'Gauge',
        body: `Your ${year} Civic's CVT (Continuously Variable Transmission) uses specialized Honda HCF-2 fluid. At 30,000 miles, Honda recommends a CVT fluid change to keep your transmission shifting buttery-smooth. Think of it like fresh blood for your gearbox — old fluid loses its friction properties, which can lead to hesitation or jerky acceleration over time. This is one of the most important services for CVT longevity, and it's far cheaper than a $4,000 transmission replacement down the road.`,
        logAction: 'Schedule CVT Fluid Change',
        logServiceType: 'Transmission Fluid Change',
        estimatedMileage: 30000,
      };
    }
    if (mi >= 99000 && mi <= 101000) {
      return {
        title: 'Timing Belt & Water Pump Service',
        icon: 'AlertTriangle',
        body: `Your ${year} Civic is approaching 100,000 miles — a major milestone. If your Civic has the 1.8L or 2.0L non-turbo engine, it has a timing belt that needs replacement (the 1.5L turbo uses a chain — check your specific model). A snapped timing belt can destroy your engine in seconds. We recommend doing the water pump at the same time since it's driven by the same belt. Think of it as replacing a bicycle chain before it snaps — cheap insurance against a ruined engine.`,
        logAction: 'Schedule Timing Belt Service',
        logServiceType: 'Timing Belt & Water Pump',
        estimatedMileage: 100000,
      };
    }
    return {
      title: 'Oil Change Reminder',
      icon: 'Droplets',
      body: `Your ${year} Civic's 1.5L turbo engine uses 0W-20 full synthetic oil. Your Maintenance Minder will alert you when oil life hits 15%. Typically every 5,000-7,500 miles depending on driving conditions. Using the correct viscosity is crucial for your turbo's bearing lubrication — cheap oil can lead to turbo failure. Stick with genuine Honda or high-quality synthetic for best protection.`,
      logAction: 'Schedule Oil Change',
      logServiceType: 'Oil Change',
      estimatedMileage: mi + 5000,
    };
  }

  // Toyota Camry
  if (mk.includes('toyota') && (m.includes('camry') || m.includes('corolla'))) {
    if (mi >= 59000 && mi <= 61000) {
      return {
        title: 'Major Service — 60,000 Mile Checkpoint',
        icon: 'ClipboardCheck',
        body: `Your ${year} ${model} is at the 60,000-mile service milestone. Toyota recommends: spark plugs (iridium tips last ~60K miles), engine air filter, cabin air filter, brake fluid flush, and inspect the drive belt. Your ${model}'s 2.5L 4-cylinder or 3.5L V6 both benefit from fresh spark plugs — they restore throttle response and prevent misfires. The brake fluid absorbs moisture over time, which can cause internal corrosion in your ABS system.`,
        logAction: 'Schedule 60K Mile Service',
        logServiceType: '60,000 Mile Service',
        estimatedMileage: 60000,
      };
    }
    return {
      title: 'ToyotaCare Maintenance Schedule',
      icon: 'CalendarCheck',
      body: `Your ${year} ${model} is covered by Toyota's recommended maintenance schedule. For your current mileage (${formatNumber(mi)}): oil change with 0W-20 synthetic every 5,000 miles, tire rotation every 5,000 miles, and engine/cabin air filters every 15,000 miles. The ${model} is known for its reliability - staying on schedule keeps it running for 200,000+ miles easily.`,
      logAction: 'Schedule Routine Service',
      logServiceType: 'Routine Maintenance',
      estimatedMileage: mi + 5000,
    };
  }

  // Ford F-150
  if (mk.includes('ford') && m.includes('f-150')) {
    return {
      title: 'Ford F-150 — Heavy Duty Maintenance',
      icon: 'Truck',
      body: `Your ${year} F-150 is built tough, but even trucks need TLC. At ${formatNumber(mi)} miles: if you have the 2.7L EcoBoost, check the intercooler for moisture buildup (known issue). For the 5.0L V8, listen for timing chain noise. All F-150 engines benefit from 5W-30 synthetic oil every 5,000 miles — especially if you tow. Don't forget the 10-speed transmission fluid at 60,000 miles if you haven't done it.`,
      logAction: 'Schedule F-150 Service',
      logServiceType: 'Routine Maintenance',
      estimatedMileage: mi + 5000,
    };
  }

  // Generic guidance
  return {
    title: 'Routine Maintenance Check',
    icon: 'Wrench',
    body: `Your ${year} ${make} ${model} with ${formatNumber(mi)} miles is due for routine maintenance. We recommend checking your owner's manual for the specific maintenance schedule. General guidelines: oil change every 5,000-7,500 miles, tire rotation every 5,000-7,500 miles, air filter every 15,000-30,000 miles, and spark plugs every 60,000-100,000 miles. Keeping up with these services prevents costly repairs and maintains your vehicle's resale value.`,
    logAction: 'Schedule Routine Check',
    logServiceType: 'Routine Maintenance',
    estimatedMileage: mi + 5000,
  };
}

export default function AICopilot({ vehicles, logs, onAddLog, onNavigate, isPremium }) {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [saved, setSaved] = useState(false);

  const activeVehicle = vehicles[0] || null;

  const guidance = activeVehicle ? getSpecificGuidance(activeVehicle) : null;

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setSaved(false);
    // Simulate AI processing delay
    setTimeout(() => {
      const result = mockTranslate(inputText, activeVehicle?.mileage || 0);
      setTranslation(result);
      setIsTranslating(false);
    }, 1500);
  };

  const handleSaveToLog = () => {
    if (!translation?.loggable || !activeVehicle) return;
    onAddLog({
      vehicleId: activeVehicle.id,
      date: new Date().toISOString().split('T')[0],
      mileage: activeVehicle.mileage,
      serviceType: translation.loggable.serviceType,
      description: translation.loggable.description,
      cost: 0,
      documents: [],
      source: 'ai-copilot',
    });
    setSaved(true);
    setTranslation(null);
    setInputText('');
  };

  const handleScheduleGuidance = (guide) => {
    if (!activeVehicle) return;
    onAddLog({
      vehicleId: activeVehicle.id,
      date: new Date().toISOString().split('T')[0],
      mileage: guide.estimatedMileage || activeVehicle.mileage,
      serviceType: guide.logServiceType,
      description: `Scheduled via AI Co-Pilot: ${guide.title}. ${guide.body.slice(0, 100)}...`,
      cost: 0,
      documents: [],
      source: 'ai-copilot-scheduled',
    });
  };

  if (!activeVehicle) {
    return (
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Maintenance Co-Pilot</h3>
            <p className="text-xs text-slate-500">Add a vehicle to activate</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feature 1: AI Maintenance Co-Pilot - Informal Input Translator */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 border border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">AI Maintenance Co-Pilot</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">BETA</span>
            </div>
            <p className="text-xs text-slate-500">
              Describe your issue or service in plain language — I'll translate it
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="relative mb-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='e.g. "my engine is making a high-pitched squeal when I turn on the AC" or "i did the oil thing yesterday in my driveway"'
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all"
          />
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Translate to Health Record
              </>
            )}
          </button>
        </div>

        {/* Translation Result */}
        {translation && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">AI Translation Complete</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/50 space-y-3">
              {/* Diagnosis */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Diagnosed Issue</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    translation.severity === 'High' ? 'bg-red-500/20 text-red-300' :
                    translation.severity === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                    translation.severity === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-slate-700/50 text-slate-300'
                  }`}>
                    {translation.severity}
                  </span>
                </div>
                <p className="text-sm font-medium text-white">{translation.diagnosis}</p>
              </div>

              {/* Action */}
              <div>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1 block">Recommended Action</span>
                <p className="text-xs text-slate-300 leading-relaxed">{translation.action}</p>
              </div>

              {/* Estimated Cost */}
              {translation.estimatedCost && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Estimated cost:</span>
                  <span className="text-emerald-400 font-medium">{translation.estimatedCost}</span>
                </div>
              )}

              {/* Save to Log Button */}
              <button
                onClick={handleSaveToLog}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                Save to Maintenance Log
              </button>
            </div>
          </div>
        )}

        {saved && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4" />
            Saved to your maintenance log! <button onClick={() => onNavigate('logs')} className="underline hover:text-emerald-200">View log →</button>
          </div>
        )}
      </div>

      {/* Feature 2: Proactive Jargon-Free Timelines */}
      {guidance && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">AI Assistant — Proactive Guidance</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">SMART</span>
              </div>
              <p className="text-xs text-slate-500">
                Personalized for your {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-2">{guidance.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{guidance.body}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      handleScheduleGuidance(guidance);
                      onNavigate('logs');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {guidance.logAction}
                  </button>
                  <button
                    onClick={() => onNavigate('logs')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-all"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    View Service History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}