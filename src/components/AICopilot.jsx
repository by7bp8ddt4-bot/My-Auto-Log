import { useState, useCallback } from 'react';
import {
  Brain, Sparkles, Save, CheckCircle2, Loader2,
  Lightbulb, Wrench, Calendar, Zap, AlertTriangle
} from 'lucide-react';
import { formatNumber, formatDate, getLocalDateString } from '../utils/helpers';
import { useMaintenanceSchedule } from '../hooks/useMaintenanceSchedule';
import { getManufacturerColor, ManufacturerBadge } from '../utils/manufacturerBranding.jsx';
import { getSpecsForVehicle, isEV } from '../data/maintenance-schedules.js';

// Vehicle-aware translation that pulls specs from the database
function aiTranslate(input, vehicle) {
  const lower = input.toLowerCase();
  const mileage = vehicle?.mileage || 0;
  const make = vehicle?.make || '';
  const model = vehicle?.model || '';
  const specs = getSpecsForVehicle(make, model);
  const isElectric = isEV(make, model);

  // EV-specific handling
  if (isElectric && (lower.includes('oil') || lower.includes('lube') || lower.includes('change'))) {
    return {
      diagnosis: 'No Engine Oil Required',
      severity: 'Info',
      action: `Your ${make} ${model} is an electric vehicle (EV) and does not have an engine oil system. Instead, consider: cabin air filter replacement (every 2 years), tire rotation (every 6,250 miles), or brake fluid test (every 2 years). Tesla recommends ${specs.brakeFluid.type} brake fluid and ${specs.tirePressure.psi} PSI tire pressure.`,
      estimatedCost: 'N/A (no oil change needed)',
      loggable: null
    };
  }

  if (lower.includes('squeal') || lower.includes('squeak') || lower.includes('belt')) {
    const action = isElectric
      ? 'EVs have no serpentine belt. Check suspension bushings and A/C compressor for noise.'
      : `Inspect serpentine belt tension and pulley bearings. ${make} engines typically use a multi-rib belt. Replace if cracked or glazed.`;
    return {
      diagnosis: 'Serpentine Belt / Accessory Drive Noise',
      severity: 'Medium',
      action,
      estimatedCost: '$120–$250',
      loggable: !isElectric ? { serviceType: 'Belt Inspection & Replacement', description: `Diagnosed: Serpentine belt wear on ${make} ${model}. Action: Inspect belt tension and pulley bearings.`, mileage } : null
    };
  }

  if (lower.includes('oil') || lower.includes('oil change') || lower.includes('lube')) {
    if (isElectric) {
      return {
        diagnosis: 'No Engine Oil Required (EV)',
        severity: 'Info',
        action: `Your ${make} ${model} is an EV — no oil changes needed! Focus on tire rotations and cabin filter instead.`,
        estimatedCost: 'N/A',
        loggable: null
      };
    }
    const oil = specs?.oil;
    const oilStr = oil ? `Use **${oil.viscosity} ${oil.type}** (capacity: ${oil.capacity})` : 'Use manufacturer-recommended oil';
    return {
      diagnosis: 'Engine Oil & Filter Replacement',
      severity: 'Completed',
      action: `Oil change performed. Reset maintenance minder. ${oilStr}. For your ${make} ${model}, this is the most important service for engine longevity.`,
      estimatedCost: '$45–$80',
      loggable: { serviceType: 'Oil & Filter Change', description: `Engine oil & filter replacement completed on ${make} ${model}. Used ${oil?.viscosity || 'recommended'} ${oil?.type || 'oil'}.`, mileage }
    };
  }

  if (lower.includes('brake') || lower.includes('squeaking') || lower.includes('grind')) {
    const fluid = specs?.brakeFluid?.type || 'DOT 3';
    return {
      diagnosis: 'Brake Pad Wear / Rotor Surface Irregularity',
      severity: 'High',
      action: `Inspect brake pads for minimum thickness (below 3mm = replace). Measure rotor runout. Use ${fluid} brake fluid for your ${make} ${model}. Replace pads if worn, resurface or replace rotors if scored.`,
      estimatedCost: '$150–$400 per axle',
      loggable: { serviceType: 'Brake Service', description: `Diagnosed: Brake pad wear on ${make} ${model}. Action: Inspect pads and rotors. Use ${fluid}.`, mileage }
    };
  }

  if (lower.includes('tire') || lower.includes('rotation') || lower.includes('flat')) {
    const psi = specs?.tirePressure?.psi || 34;
    return {
      diagnosis: 'Tire Wear / Rotation Due',
      severity: 'Medium',
      action: `Rotate tires in cross-pattern. Check tread depth (min 2/32"). Inflate to ${psi} PSI as recommended for your ${make} ${model}.${isElectric ? ' EVs are heavy — rotations are even more critical.' : ''}`,
      estimatedCost: '$20–$40 (DIY) / $40–$60 (shop)',
      loggable: { serviceType: 'Tire Rotation', description: `Tire rotation performed on ${make} ${model}. Inflated to ${psi} PSI.`, mileage }
    };
  }

  if (lower.includes('battery') || lower.includes('click') || lower.includes("won't start") || lower.includes('dead')) {
    const batt = specs?.battery;
    const battStr = batt?.groupSize ? `Your ${make} ${model} typically uses a ${batt.groupSize} battery.` : '';
    return {
      diagnosis: isElectric ? '12V Auxiliary Battery Discharge' : 'Battery Discharge / Starting System Fault',
      severity: 'High',
      action: isElectric
        ? `Test the 12V auxiliary battery in your ${make} ${model}. Even EVs have a 12V battery for accessories. Check the main HV battery state of charge too.`
        : `Test battery voltage (target 12.6V+). Load test battery. Check alternator output (13.5-14.5V). Clean corrosion from terminals. ${battStr}`,
      estimatedCost: '$100–$200',
      loggable: { serviceType: 'Battery Check', description: `Diagnosed: Battery/starting system issue on ${make} ${model}. ${battStr}`, mileage }
    };
  }

  if (lower.includes('check engine') || lower.includes('engine light') || lower.includes('service engine')) {
    return {
      diagnosis: 'Check Engine Light — Diagnostic Trouble Code Pending',
      severity: 'Varies',
      action: `Scan OBD-II system for stored/pending codes on your ${make} ${model}. Common causes: loose gas cap, O2 sensor, catalytic converter, or ignition coil.`,
      estimatedCost: '$0–$150 (scan) + parts as needed',
      loggable: { serviceType: 'Diagnostic Scan', description: `Check Engine Light diagnosed via OBD-II scan on ${make} ${model}.`, mileage }
    };
  }

  if (lower.includes('transmission') || lower.includes('shifting') || lower.includes('slip') || lower.includes('gear')) {
    const trans = specs?.transmission;
    const transStr = trans ? `Your ${make} ${model} uses ${trans.type} (capacity: ${trans.capacity || 'check manual'}).` : '';
    return {
      diagnosis: isElectric ? 'EV Gearbox Fluid Check' : 'Transmission Fluid Condition / Shift Quality Concern',
      severity: 'Medium',
      action: isElectric
        ? `Your ${make} ${model} has a single-speed gearbox. ${transStr} Check gearbox fluid level per service manual.`
        : `Check transmission fluid level and color (should be bright red/pink, not dark/burnt). ${transStr} Perform drain-and-fill if due.`,
      estimatedCost: isElectric ? '$100–$200' : '$100–$300 (drain & fill)',
      loggable: { serviceType: 'Transmission Service', description: `Transmission fluid checked on ${make} ${model}. ${transStr || ''}`, mileage }
    };
  }

  // Default fallback
  const psi = specs?.tirePressure?.psi || 34;
  return {
    diagnosis: 'General Vehicle Inspection Recommended',
    severity: 'Low',
    action: `Perform routine multi-point inspection on your ${make} ${model}. Check all fluid levels, belts, hoses, tire pressure (${psi} PSI), and condition.${isElectric ? ' For your EV, focus on HV battery health, coolant levels, and brake caliper function.' : ''}`,
    estimatedCost: '$0–$50 (inspection fee)',
    loggable: { serviceType: 'Inspection', description: `Concern reported: "${input}". General inspection performed on ${make} ${model}.`, mileage }
  };
}

export default function AICopilot({ vehicles, logs, onAddLog, onNavigate, isPremium, activeVehicleId }) {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [saved, setSaved] = useState(false);

  const activeVehicle = activeVehicleId
    ? vehicles.find(v => v.id === activeVehicleId) || vehicles[0] || null
    : vehicles[0] || null;
  const schedule = useMaintenanceSchedule(activeVehicle, logs);
  const brandColor = getManufacturerColor(activeVehicle?.make);
  const urgentItem = schedule[0];
  const specs = activeVehicle ? getSpecsForVehicle(activeVehicle.make, activeVehicle.model) : null;
  const electric = activeVehicle ? isEV(activeVehicle.make, activeVehicle.model) : false;

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setSaved(false);
    setTimeout(() => {
      const result = aiTranslate(inputText, activeVehicle);
      setTranslation(result);
      setIsTranslating(false);
    }, 1500);
  };

  const handleSaveToLog = () => {
    if (!translation?.loggable || !activeVehicle) return;
    onAddLog({
      vehicleId: activeVehicle.id,
      date: getLocalDateString(),
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
      {/* Feature 1: AI Co-Pilot - Informal Input Translator */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 border border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">AI Maintenance Co-Pilot</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">SMART</span>
            </div>
            <p className="text-xs text-slate-500">
              Vehicle-aware AI for your {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
              {electric && <span className="text-emerald-400 ml-1">⚡ EV</span>}
            </p>
          </div>
        </div>

        {/* Vehicle Specs Quick Reference */}
        {specs && (
          <div className="mb-4 p-3 rounded-xl bg-slate-900 border border-slate-700/50">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-medium">Your Vehicle Specs</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {!electric && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-slate-400">Oil:</span>
                  <span className="text-slate-200 font-medium">{specs.oil?.viscosity || '—'}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-slate-400">Tires:</span>
                <span className="text-slate-200 font-medium">{specs.tirePressure?.psi || '—'} PSI</span>
              </div>
              {!electric && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-slate-400">Trans:</span>
                  <span className="text-slate-200 font-medium truncate">{specs.transmission?.type?.slice(0, 15) || '—'}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-400">Brake:</span>
                <span className="text-slate-200 font-medium">{specs.brakeFluid?.type || '—'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-slate-400">Coolant:</span>
                <span className="text-slate-200 font-medium truncate">{specs.coolant?.type?.slice(0, 15) || '—'}</span>
              </div>
              {!electric && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="text-slate-400">Plugs:</span>
                  <span className="text-slate-200 font-medium">{specs.sparkPlugs?.type || '—'}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input Area */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='Ask it anything — "engine is squeaking when I turn on the AC" or "did the oil thing yesterday"'
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all"
        />
        <button
          onClick={handleTranslate}
          disabled={!inputText.trim() || isTranslating}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/20 transition-all"
        >
          {isTranslating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing with AI...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Translate to Health Record</>
          )}
        </button>

        {/* Translation Result */}
        {translation && (
          <div className="animate-fade-in mt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">AI Translation Complete</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/50 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Diagnosed Issue</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    translation.severity === 'High' ? 'bg-red-500/20 text-red-300' :
                    translation.severity === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                    translation.severity === 'Info' ? 'bg-blue-500/20 text-blue-300' :
                    translation.severity === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-slate-700/50 text-slate-300'
                  }`}>{translation.severity}</span>
                </div>
                <p className="text-sm font-medium text-white">{translation.diagnosis}</p>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1 block">Recommended Action</span>
                <p className="text-xs text-slate-300 leading-relaxed">{translation.action}</p>
              </div>
              {translation.estimatedCost && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Estimated cost:</span>
                  <span className="text-emerald-400 font-medium">{translation.estimatedCost}</span>
                </div>
              )}
              {translation.loggable && (
                <button onClick={handleSaveToLog} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all">
                  <Save className="w-3.5 h-3.5" /> Save to Maintenance Log
                </button>
              )}
              {!translation.loggable && translation.severity === 'Info' && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" /> No maintenance log needed for your EV.
                </div>
              )}
            </div>
          </div>
        )}

        {saved && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4" />
            Saved! <button onClick={() => onNavigate('logs')} className="underline hover:text-emerald-200">View log →</button>
          </div>
        )}
      </div>

      {/* Feature 2: Proactive Guidance */}
      {urgentItem && (
        <div className={`p-5 rounded-2xl bg-gradient-to-br border transition-all ${
          urgentItem.status === 'overdue' ? 'from-red-600/5 to-orange-600/5 border-red-500/20 shadow-lg shadow-red-500/5' :
          urgentItem.status === 'due-soon' ? 'from-amber-600/5 to-orange-600/5 border-amber-500/20' :
          'from-blue-600/5 to-cyan-600/5 border-blue-500/20'
        }`}
          style={{ borderTop: `4px solid ${brandColor}` }}>
          <div className="flex items-center gap-3 mb-4">
            <ManufacturerBadge make={activeVehicle.make} size={28} className="bg-slate-900/60 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white truncate">
                  {urgentItem.status === 'overdue' ? 'Urgent Maintenance Required' : 'AI Assistant — Proactive Guidance'}
                </h3>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tracking-wider ${
                  urgentItem.status === 'overdue' ? 'bg-red-500/20 text-red-300' :
                  urgentItem.status === 'due-soon' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>{urgentItem.status.toUpperCase()}</span>
              </div>
              <p className="text-xs text-slate-500">
                Personalized for your {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/50">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${urgentItem.status === 'overdue' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                {urgentItem.status === 'overdue' ? <Wrench className="w-4 h-4 text-red-400" /> : <Zap className="w-4 h-4 text-amber-400" />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-2">{urgentItem.service}</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-1">{urgentItem.description}</p>
                <p className="text-[10px] text-slate-500 mb-4 font-medium uppercase tracking-tighter">
                  {urgentItem.status === 'overdue' ? (
                    <span className="text-red-400">Overdue by {formatNumber(Math.abs(urgentItem.milesUntilDue))} miles</span>
                  ) : (
                    <span>Due in {formatNumber(urgentItem.milesUntilDue)} miles / ~{Math.round(urgentItem.daysUntilDue / 30)} months</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => {
                    onAddLog({
                      vehicleId: activeVehicle.id, date: getLocalDateString(),
                      mileage: activeVehicle.mileage, serviceType: urgentItem.service,
                      description: `Completed: ${urgentItem.service}.`, cost: 0, documents: [], source: 'ai-copilot-scheduled',
                    }); onNavigate('logs');
                  }} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all">
                    <Calendar className="w-3.5 h-3.5" /> Log this Service
                  </button>
                  <button onClick={() => onNavigate('schedule')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-all">
                    <Calendar className="w-3.5 h-3.5" /> View Full Schedule
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