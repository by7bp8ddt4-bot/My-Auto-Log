import { useMemo } from 'react';
import { Info, Gauge, Cog, Wrench, CircuitBoard, Car, Lightbulb, MapPin } from 'lucide-react';
import { referenceSpecs } from '../data/reference-specs.js';

/**
 * Matches a vehicle (make, model, year) to the appropriate reference specs data.
 * Traverses make → model → yearRange, checking if the vehicle year falls within the range.
 */
function findSpecs(make, model, year) {
  if (!make || !model || !year) return null;

  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();

  const makeData = referenceSpecs[makeLower];
  if (!makeData) return null;

  // Try exact model match first
  let modelData = makeData[modelLower];
  if (!modelData) {
    // Try matching model prefixes (e.g., "civic" matches "civic si")
    const modelKeys = Object.keys(makeData);
    const matchedKey = modelKeys.find(k => modelLower.startsWith(k) || k.startsWith(modelLower));
    if (matchedKey) modelData = makeData[matchedKey];
  }
  if (!modelData) {
    // Strip make name from model prefix (e.g., "mazda3" → "3")
    const strippedModel = modelLower.replace(new RegExp('^' + makeLower + '\\s*', 'i'), '').trim();
    if (strippedModel && strippedModel !== modelLower) {
      modelData = makeData[strippedModel];
      if (!modelData) {
        const modelKeys2 = Object.keys(makeData);
        const matchedKey2 = modelKeys2.find(k => strippedModel.startsWith(k) || k.startsWith(strippedModel));
        if (matchedKey2) modelData = makeData[matchedKey2];
      }
    }
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

/** Renders a single spec row: label + value */
function SpecRow({ label, value, className = '' }) {
  return (
    <div className={className}>
      <dt className="text-slate-400 text-xs">{label}</dt>
      <dd className="text-white text-sm mt-0.5">{value}</dd>
    </div>
  );
}

/** Renders a card section with icon, title, and content */
function SpecSection({ icon: Icon, title, children }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-4 h-4 text-blue-400" />}
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      </div>
      <dl className="space-y-2.5">
        {children}
      </dl>
    </div>
  );
}

export default function VehicleSpecs({ selectedVehicle }) {
  const vehicle = selectedVehicle;

  const specs = useMemo(() => {
    if (!vehicle) return null;
    return findSpecs(vehicle.make, vehicle.model, vehicle.year);
  }, [vehicle]);

  // No vehicle selected
  if (!vehicle) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
          <Info className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Vehicle Selected</h3>
          <p className="text-sm text-slate-400">Select a vehicle from the garage to view quick-reference specs.</p>
        </div>
      </div>
    );
  }

  // No specs data for this vehicle
  if (!specs) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Vehicle Specs</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
          </div>
        </div>
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
          <Info className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Specs Data Available</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            No specs data available for {vehicle.year} {vehicle.make} {vehicle.model} yet. We're continually expanding our database — check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Vehicle Specs</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Engine */}
        <SpecSection icon={Gauge} title="Engine">
          <SpecRow label="Oil Viscosity" value={specs.engine.oilViscosity} />
          <SpecRow label="Oil Capacity" value={specs.engine.oilCapacity} />
          <SpecRow label="Oil Filter PN" value={specs.engine.oilFilterPN} />
          <SpecRow label="Coolant Type" value={specs.engine.coolantType} />
          <SpecRow label="Coolant Capacity" value={specs.engine.coolantCapacity} />
        </SpecSection>

        {/* Transmission */}
        <SpecSection icon={Cog} title="Transmission">
          <SpecRow label="Fluid Type" value={specs.transmission.fluidType} />
          <SpecRow label="Capacity" value={specs.transmission.capacity} />
          {specs.transmission.note && (
            <SpecRow label="Note" value={specs.transmission.note} />
          )}
        </SpecSection>

        {/* Transfer Case — skip entirely if null */}
        {specs.transferCase && (
          <SpecSection icon={CircuitBoard} title="Transfer Case">
            <SpecRow label="Fluid Type" value={specs.transferCase.fluidType} />
            <SpecRow label="Capacity" value={specs.transferCase.capacity} />
            {specs.transferCase.note && (
              <SpecRow label="Note" value={specs.transferCase.note} />
            )}
          </SpecSection>
        )}

        {/* Differentials */}
        {(specs.differentials.front || specs.differentials.rear) && (
          <SpecSection icon={Wrench} title="Differentials">
            {specs.differentials.front && (
              <div className="pb-2.5 border-b border-slate-800 mb-2.5">
                <h4 className="text-xs font-semibold text-slate-300 mb-2">Front Differential</h4>
                <SpecRow label="Fluid Type" value={specs.differentials.front.fluidType} />
                <SpecRow label="Capacity" value={specs.differentials.front.capacity} />
                {specs.differentials.front.note && (
                  <SpecRow label="Note" value={specs.differentials.front.note} />
                )}
              </div>
            )}
            <div>
              {specs.differentials.front && <h4 className="text-xs font-semibold text-slate-300 mb-2">Rear Differential</h4>}
              <SpecRow label="Fluid Type" value={specs.differentials.rear.fluidType} />
              <SpecRow label="Capacity" value={specs.differentials.rear.capacity} />
              {specs.differentials.rear.note && (
                <SpecRow label="Note" value={specs.differentials.rear.note} />
              )}
            </div>
          </SpecSection>
        )}

        {/* Brakes */}
        <SpecSection icon={Car} title="Brakes">
          <SpecRow label="Brake Fluid Type" value={specs.brakeFluid} />
        </SpecSection>

        {/* Tires */}
        <SpecSection icon={Gauge} title="Tires">
          <SpecRow label="Front PSI" value={specs.tires.frontPSI} />
          <SpecRow label="Rear PSI" value={specs.tires.rearPSI} />
          <SpecRow label="OEM Sizes" value={specs.tires.oemSizes.join(', ')} />
          <SpecRow label="Lug Nut Torque" value={`${specs.tires.lugNutTorque} ft-lbs`} />
        </SpecSection>

        {/* Bulbs */}
        <SpecSection icon={Lightbulb} title="Bulbs">
          <SpecRow label="Low Beam" value={specs.bulbs.lowBeam} />
          <SpecRow label="High Beam" value={specs.bulbs.highBeam} />
          <SpecRow label="Front Turn" value={specs.bulbs.frontTurn} />
          <SpecRow label="Rear Turn" value={specs.bulbs.rearTurn} />
          <SpecRow label="Tail / Brake" value={specs.bulbs.tailBrake} />
          <SpecRow label="Interior" value={specs.bulbs.interior} />
          <SpecRow label="License" value={specs.bulbs.license} />
        </SpecSection>

        {/* OBD-II Port */}
        <SpecSection icon={MapPin} title="OBD-II Port">
          <SpecRow label="Location" value={specs.obd2Location} />
        </SpecSection>
      </div>
    </div>
  );
}
