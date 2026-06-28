import { useState } from 'react';
import {
  Brain, Sparkles, MessageSquareText, Save, CheckCircle2, Loader2,
  Lightbulb, Wrench, Calendar, ArrowRight, Zap, AlertTriangle
} from 'lucide-react';
import { formatNumber, formatDate } from '../utils/helpers';
import { useMaintenanceSchedule } from '../hooks/useMaintenanceSchedule';
import { getManufacturerColor, ManufacturerBadge } from '../utils/manufacturerBranding.jsx';

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

export default function AICopilot({ vehicles, logs, onAddLog, onNavigate, isPremium }) {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [saved, setSaved] = useState(false);

  const activeVehicle = vehicles[0] || null;
  const schedule = useMaintenanceSchedule(activeVehicle, logs);
  const brandColor = getManufacturerColor(activeVehicle?.make);
  
  // Find the most urgent item (overdue or next upcoming)
  const urgentItem = schedule[0];

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
      {urgentItem && (
        <div 
          className={`p-5 rounded-2xl bg-gradient-to-br border transition-all ${
            urgentItem.status === 'overdue' ? 'from-red-600/5 to-orange-600/5 border-red-500/20 shadow-lg shadow-red-500/5' :
            urgentItem.status === 'due-soon' ? 'from-amber-600/5 to-orange-600/5 border-amber-500/20' :
            'from-blue-600/5 to-cyan-600/5 border-blue-500/20'
          }`}
          style={{ borderTop: `4px solid ${brandColor}` }}
        >
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
                }`}>
                  {urgentItem.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Personalized for your {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/50">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                urgentItem.status === 'overdue' ? 'bg-red-500/10' : 'bg-amber-500/10'
              }`}>
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
                  <button
                    onClick={() => {
                      onAddLog({
                        vehicleId: activeVehicle.id,
                        date: new Date().toISOString().split('T')[0],
                        mileage: activeVehicle.mileage,
                        serviceType: urgentItem.service,
                        description: `Maintenance completed: ${urgentItem.service}. ${urgentItem.description.slice(0, 100)}...`,
                        cost: 0,
                        documents: [],
                        source: 'ai-copilot-scheduled',
                      });
                      onNavigate('logs');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Log this Service
                  </button>
                  <button
                    onClick={() => onNavigate('schedule')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    View Full Schedule
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
