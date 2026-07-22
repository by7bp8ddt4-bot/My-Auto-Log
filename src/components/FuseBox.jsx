import { useState, useMemo } from 'react';
import { Search, Zap, AlertTriangle, Info, MapPin } from 'lucide-react';
import { fuseBoxData } from '../data/fuse-boxes.js';

/**
 * Matches a vehicle (make, model, year) to the appropriate fuse box data.
 * Traverses make → model → yearRange, checking if the vehicle year falls within the range.
 */
function findFuseData(make, model, year) {
  if (!make || !model || !year) return null;
  
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();
  
  const makeData = fuseBoxData[makeLower];
  if (!makeData) return null;
  
  // Handle model name variations — try exact match first, then prefix match
  let modelData = makeData[modelLower];
  if (!modelData) {
    // Try matching model prefixes (e.g., "civic" matches "civic si")
    const modelKeys = Object.keys(makeData);
    const matchedKey = modelKeys.find(k => modelLower.startsWith(k) || k.startsWith(modelLower));
    if (matchedKey) modelData = makeData[matchedKey];
  }
  if (!modelData) return null;
  
  // Find matching year range
  const numYear = parseInt(year);
  for (const [range, data] of Object.entries(modelData)) {
    const [start, end] = range.split('-').map(Number);
    if (numYear >= start && numYear <= end) {
      return data;
    }
  }
  
  return null;
}

export default function FuseBox({ selectedVehicle }) {
  const [search, setSearch] = useState('');
  const [expandedPanels, setExpandedPanels] = useState({});
  
  const vehicle = selectedVehicle;
  const fuseData = useMemo(() => {
    if (!vehicle) return null;
    return findFuseData(vehicle.make, vehicle.model, vehicle.year);
  }, [vehicle]);
  
  // Toggle panel expand/collapse
  const togglePanel = (panelIdx) => {
    setExpandedPanels(prev => ({ ...prev, [panelIdx]: !prev[panelIdx] }));
  };

  // Filter items by search term
  const filterItems = (items) => {
    if (!search.trim()) return items;
    const term = search.toLowerCase();
    return items.filter(item => 
      (item.circuit && item.circuit.toLowerCase().includes(term)) ||
      (item.desc && item.desc.toLowerCase().includes(term)) ||
      (item.pos && String(item.pos).toLowerCase().includes(term))
    );
  };
  
  // If no vehicle selected
  if (!vehicle) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
          <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Vehicle Selected</h3>
          <p className="text-sm text-slate-400">Select a vehicle from the garage to view its fuse box diagrams.</p>
        </div>
      </div>
    );
  }
  
  // If data not available for this vehicle
  if (!fuseData || !fuseData.panels || fuseData.panels.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Wiring Diagrams</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
          </div>
        </div>
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
          <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Fuse Box Data Coming Soon</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Fuse box data is not yet available for the {vehicle.year} {vehicle.make} {vehicle.model}. 
            We're continually expanding our database — check back soon!
          </p>
        </div>
      </div>
    );
  }
  
  const panels = fuseData.panels;
  const searchTerm = search.trim();
  
  // Auto-expand first panel if none toggled yet
  // But only do this once — use the fact that expandedPanels starts empty
  const getPanelExpanded = (idx) => {
    if (Object.keys(expandedPanels).length === 0) return true; // all expanded by default
    return expandedPanels[idx] !== false;
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Wiring Diagrams</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {vehicle.year} {vehicle.make} {vehicle.model} — {panels.length} fuse panel{panels.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300/90 leading-relaxed">
          <span className="font-semibold">⚠️ Verify against your vehicle's fuse box cover.</span> Never substitute a higher-rated fuse. 
          Fuse assignments may vary by trim level, region, and optional equipment. Always check your owner's manual or fuse box cover label before replacing.
        </p>
      </div>
      
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search fuses and relays by circuit name or description..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Panels */}
      <div className="space-y-6">
        {panels.map((panel, panelIdx) => {
          const filteredFuses = filterItems(panel.fuses || []);
          const filteredRelays = filterItems(panel.relays || []);
          const totalFiltered = filteredFuses.length + filteredRelays.length;
          const totalAll = (panel.fuses || []).length + (panel.relays || []).length;
          const isExpanded = getPanelExpanded(panelIdx);
          const hasSearch = !!searchTerm;
          
          return (
            <div key={panelIdx} className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
              {/* Panel Header */}
              <button
                onClick={() => togglePanel(panelIdx)}
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-slate-800/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white">{panel.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <p className="text-xs text-slate-400 truncate">{panel.location}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                      {panel.fuses?.length || 0} fuses
                    </span>
                    {panel.relays && panel.relays.length > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                        {panel.relays.length} relays
                      </span>
                    )}
                    {hasSearch && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                        {totalFiltered} match{totalFiltered !== 1 ? 'es' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-500 shrink-0 mt-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Panel Content */}
              {isExpanded && (
                <div className="border-t border-slate-800">
                  {/* If search active and no results in this panel */}
                  {hasSearch && totalFiltered === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-xs text-slate-500">No matching fuses or relays in this panel.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-800/50">
                            <th className="px-4 py-2.5 font-medium text-slate-400 w-16">Position</th>
                            <th className="px-4 py-2.5 font-medium text-slate-400 w-16">Amps</th>
                            <th className="px-4 py-2.5 font-medium text-slate-400">Circuit</th>
                            <th className="px-4 py-2.5 font-medium text-slate-400">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {/* Fuses */}
                          {filteredFuses.map((fuse, i) => (
                            <tr key={`f-${i}`} className="hover:bg-slate-800/20 transition-colors">
                              <td className="px-4 py-2.5">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-cyan-400 font-mono font-bold text-xs">
                                  {fuse.pos}
                                </span>
                              </td>
                              <td className="px-4 py-2.5">
                                <span className={`font-mono font-semibold ${
                                  typeof fuse.amps === 'number' 
                                    ? fuse.amps >= 30 ? 'text-orange-400' : fuse.amps >= 20 ? 'text-amber-400' : 'text-emerald-400'
                                    : 'text-slate-500'
                                }`}>
                                  {typeof fuse.amps === 'number' ? `${fuse.amps}A` : (fuse.amps || '—')}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 font-medium text-slate-200">{fuse.circuit}</td>
                              <td className="px-4 py-2.5 text-slate-400">{fuse.desc}</td>
                            </tr>
                          ))}
                          
                          {/* Relays */}
                          {filteredRelays.length > 0 && (
                            <>
                              {/* Relay sub-header */}
                              <tr>
                                <td colSpan={4} className="px-4 py-2 bg-slate-800/30">
                                  <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Relays</span>
                                </td>
                              </tr>
                              {filteredRelays.map((relay, i) => (
                                <tr key={`r-${i}`} className="hover:bg-slate-800/20 transition-colors">
                                  <td className="px-4 py-2.5">
                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono font-bold text-xs">
                                      {relay.pos}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <span className="text-slate-600">—</span>
                                  </td>
                                  <td className="px-4 py-2.5 font-medium text-purple-300/80">{relay.circuit}</td>
                                  <td className="px-4 py-2.5 text-slate-400">{relay.desc}</td>
                                </tr>
                              ))}
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Summary footer */}
      <div className="mt-6 flex items-center gap-3 text-[10px] text-slate-600 justify-center">
        <Info className="w-3 h-3" />
        <span>Data sourced from manufacturer owner's manuals and NHTSA publications.</span>
      </div>
    </div>
  );
}
