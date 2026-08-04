import { useState } from 'react';
import {
  Brain, Sparkles, Loader2, Lightbulb, Wrench, AlertTriangle, BookOpen, Search
} from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import { getSpecsForVehicle, isEV } from '../data/maintenance-schedules.js';
import { findBestSymptomMatch } from '../data/symptom-decoder.js';
import { translateJargon, extractJargon } from '../data/jargon-translator.js';

// Vehicle-aware translation that pulls specs from the database
function aiTranslate(input, vehicle) {
  const lower = input.toLowerCase();
  const mileage = vehicle?.mileage || 0;
  const make = vehicle?.make || '';
  const model = vehicle?.model || '';
  const specs = getSpecsForVehicle(make, model);
  const isElectric = isEV(make, model);

  // EV-specific handling
  if (isElectric && (lower.includes('oil') || lower.includes('lube') || lower.includes('oil change'))) {
    return {
      diagnosis: 'No Engine Oil Required',
      severity: 'Info',
      action: `Your ${make} ${model} is an electric vehicle (EV) and does not have an engine oil system. Instead, consider: cabin air filter replacement (every 2 years), tire rotation (every 6,250 miles), or brake fluid test (every 2 years). Tesla recommends ${specs.brakeFluid.type} brake fluid and ${specs.tirePressure.psi} PSI tire pressure.`,
      estimatedCost: 'N/A (no oil change needed)'
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
      estimatedCost: '$120–$250'
    };
  }

  if (lower.includes('oil') || lower.includes('oil change') || lower.includes('lube')) {
    if (isElectric) {
      return {
        diagnosis: 'No Engine Oil Required (EV)',
        severity: 'Info',
        action: `Your ${make} ${model} is an EV — no oil changes needed! Focus on tire rotations and cabin filter instead.`,
        estimatedCost: 'N/A'
      };
    }
    const oil = specs?.oil;
    const oilStr = oil ? `Use **${oil.viscosity} ${oil.type}** (capacity: ${oil.capacity})` : 'Use manufacturer-recommended oil';
    return {
      diagnosis: 'Engine Oil & Filter Replacement',
      severity: 'Completed',
      action: `Oil change performed. Reset maintenance minder. ${oilStr}. For your ${make} ${model}, this is the most important service for engine longevity.`,
      estimatedCost: '$45–$80'
    };
  }

  if (lower.includes('brake') || lower.includes('squeaking') || lower.includes('grind')) {
    const fluid = specs?.brakeFluid?.type || 'DOT 3';
    return {
      diagnosis: 'Brake Pad Wear / Rotor Surface Irregularity',
      severity: 'High',
      action: `Inspect brake pads for minimum thickness (below 3mm = replace). Measure rotor runout. Use ${fluid} brake fluid for your ${make} ${model}. Replace pads if worn, resurface or replace rotors if scored.`,
      estimatedCost: '$150–$400 per axle'
    };
  }

  if (lower.includes('tire') || lower.includes('rotation') || lower.includes('flat')) {
    const psi = specs?.tirePressure?.psi || 34;
    return {
      diagnosis: 'Tire Wear / Rotation Due',
      severity: 'Medium',
      action: `Rotate tires in cross-pattern. Check tread depth (min 2/32"). Inflate to ${psi} PSI as recommended for your ${make} ${model}.${isElectric ? ' EVs are heavy — rotations are even more critical.' : ''}`,
      estimatedCost: '$20–$40 (DIY) / $40–$60 (shop)'
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
      estimatedCost: '$100–$200'
    };
  }

  if (lower.includes('check engine') || lower.includes('engine light') || lower.includes('service engine')) {
    return {
      diagnosis: 'Check Engine Light — Diagnostic Trouble Code Pending',
      severity: 'Varies',
      action: `Scan OBD-II system for stored/pending codes on your ${make} ${model}. Common causes: loose gas cap, O2 sensor, catalytic converter, or ignition coil.`,
      estimatedCost: '$0–$150 (scan) + parts as needed'
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
      estimatedCost: isElectric ? '$100–$200' : '$100–$300 (drain & fill)'
    };
  }

  // Symptom Decoder fallback — check specialist's symptom database
  const symptomMatch = findBestSymptomMatch(lower);
  if (symptomMatch && symptomMatch.causes.length > 0) {
    const topCause = symptomMatch.causes[0];
    return {
      diagnosis: symptomMatch.symptom,
      severity: topCause.severity.includes('🔴') ? 'High' : topCause.severity.includes('⚠️') ? 'Medium' : 'Low',
      action: `${topCause.cause}. ${topCause.urgency}`,
      estimatedCost: topCause.estimatedCost,
      allCauses: symptomMatch.causes,
      source: 'symptom-decoder',
    };
  }

  // Default fallback
  const psi = specs?.tirePressure?.psi || 34;
  return {
    diagnosis: 'General Vehicle Inspection Recommended',
    severity: 'Low',
    action: `Perform routine multi-point inspection on your ${make} ${model}. Check all fluid levels, belts, hoses, tire pressure (${psi} PSI), and condition.${isElectric ? ' For your EV, focus on HV battery health, coolant levels, and brake caliper function.' : ''}`,
    estimatedCost: '$0–$50 (inspection fee)'
  };
}

export default function AICopilot({ vehicles, isPremium, activeVehicleId }) {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null); // { type: 'jargon' | 'symptom', data: ... }
  const [isSearching, setIsSearching] = useState(false);

  const activeVehicle = activeVehicleId
    ? vehicles.find(v => v.id === activeVehicleId) || vehicles[0] || null
    : vehicles[0] || null;
  const specs = activeVehicle ? getSpecsForVehicle(activeVehicle.make, activeVehicle.model) : null;
  const electric = activeVehicle ? isEV(activeVehicle.make, activeVehicle.model) : false;

  const handleAsk = () => {
    if (!inputText.trim()) return;
    setIsSearching(true);
    setResult(null);

    setTimeout(() => {
      // 1. Check if the input directly matches a jargon term (exact or substring)
      let jargonRes = translateJargon(inputText);
      let foundJargon = false;

      if (jargonRes && (!Array.isArray(jargonRes) || jargonRes.length > 0)) {
        foundJargon = true;
      } else {
        // 2. Try extracting jargon terms from the text
        const extracted = extractJargon(inputText);
        if (extracted && extracted.length > 0) {
          jargonRes = extracted;
          foundJargon = true;
        }
      }

      if (foundJargon) {
        setResult({ type: 'jargon', data: jargonRes });
      } else {
        // 3. Symptom or general question fallback
        const diagnosticRes = aiTranslate(inputText, activeVehicle);
        setResult({ type: 'symptom', data: diagnosticRes });
      }

      setIsSearching(false);
    }, 1500);
  };

  if (!activeVehicle) {
    return (
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
            <p className="text-xs text-slate-500">Add a vehicle to activate</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unified AI Assistant Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 border border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">SMART</span>
            </div>
            <p className="text-xs text-slate-500">
              Your expert companion for {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
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

        {/* Clickable Sample Questions */}
        {!inputText.trim() && (
          <div className="mb-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-medium">Try asking:</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => { setInputText("What does DPF regeneration mean?"); setResult(null); }}
                className="px-3 py-1.5 text-xs rounded-full bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white hover:border-purple-500/40 hover:bg-slate-800/80 transition-all text-left flex items-center gap-1.5 group"
              >
                <BookOpen className="w-3 h-3 text-slate-500 group-hover:text-purple-400" />
                <span>"What does DPF regeneration mean?"</span>
              </button>
              <button
                onClick={() => { setInputText("Engine is squeaking when I turn on the AC"); setResult(null); }}
                className="px-3 py-1.5 text-xs rounded-full bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white hover:border-purple-500/40 hover:bg-slate-800/80 transition-all text-left flex items-center gap-1.5 group"
              >
                <Wrench className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
                <span>"Engine is squeaking when I turn on the AC"</span>
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder='Ask anything — "engine squeaks when turning", "CVT", "oil viscosity", etc.'
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all"
          />
        </div>

        <button
          onClick={handleAsk}
          disabled={!inputText.trim() || isSearching}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/20 transition-all"
        >
          {isSearching ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing request...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Ask AI Assistant</>
          )}
        </button>

        {/* Results Render Area */}
        {result && (
          <div className="animate-fade-in mt-4">
            {result.type === 'jargon' ? (
              // Jargon Decoder Result Rendering
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="text-xs font-medium text-purple-400">AI Jargon Translation Complete</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/50 space-y-3">
                  {Array.isArray(result.data) ? (
                    result.data.length === 0 ? (
                      <p className="text-xs text-slate-500">No matching jargon terms found.</p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {result.data.slice(0, 5).map((t, i) => (
                          <div key={i} className="pb-3 border-b border-slate-800 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-purple-400">{t.term}</span>
                              {t.standsFor && <span className="text-[10px] text-slate-500">({t.standsFor})</span>}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{t.plainEnglish}</p>
                            {t.commonFailures && (
                              <p className="text-[10px] text-slate-500 mt-1">⚠ Common issues: {t.commonFailures}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-purple-400">{result.data.term}</span>
                        {result.data.standsFor && <span className="text-[10px] text-slate-500">({result.data.standsFor})</span>}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{result.data.plainEnglish}</p>
                      {result.data.commonFailures && (
                        <p className="text-[10px] text-slate-500 mt-1">⚠ Common issues: {result.data.commonFailures}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Symptom / Translation Result Rendering
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">AI Diagnostic Complete</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/50 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Diagnosed Issue</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        result.data.severity === 'High' ? 'bg-red-500/20 text-red-300' :
                        result.data.severity === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                        result.data.severity === 'Info' ? 'bg-blue-500/20 text-blue-300' :
                        result.data.severity === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-slate-700/50 text-slate-300'
                      }`}>{result.data.severity}</span>
                    </div>
                    <p className="text-sm font-medium text-white">{result.data.diagnosis}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1 block">Recommended Action</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{result.data.action}</p>
                  </div>
                  {result.data.estimatedCost && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Estimated cost:</span>
                      <span className="text-emerald-400 font-medium">{result.data.estimatedCost}</span>
                    </div>
                  )}
                  {result.data.allCauses && result.data.allCauses.length > 1 && (
                    <div>
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1 block">Other Possible Causes</span>
                      <div className="space-y-1">
                        {result.data.allCauses.slice(1).map((c, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs">
                            <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              c.severity.includes('🔴') ? 'bg-red-400' : c.severity.includes('⚠️') ? 'bg-amber-400' : 'bg-emerald-400'
                            }`} />
                            <span className="text-slate-400">{c.cause} — <span className="text-slate-500">{c.estimatedCost}</span></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
