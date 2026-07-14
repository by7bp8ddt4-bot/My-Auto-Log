/**
 * Shared mechanical schematic background components.
 * Used by LandingPage (full opacity) and Layout (reduced opacity for readability).
 */

// ============================================================================
// BLUEPRINT GRID PATTERN
// ============================================================================
export function BlueprintGrid({ className = '' }) {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full ${className}`}>
      <defs>
        <pattern id="sub-grid" width="15" height="15" patternUnits="userSpaceOnUse">
          <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(59, 130, 246, 0.12)" strokeWidth="0.5" />
        </pattern>
        <pattern id="main-grid" width="75" height="75" patternUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="url(#sub-grid)" />
          <path d="M 75 0 L 0 0 0 75" fill="none" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1" />
          <path d="M 0 4 L 0 -4 M -4 0 L 4 0 M 75 4 L 75 -4 M 71 0 L 79 0 M 0 79 L 0 71" fill="none" stroke="rgba(59, 130, 246, 0.45)" strokeWidth="0.75" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#main-grid)" />
    </svg>
  );
}

// ============================================================================
// SCHEMATIC 1: Rotary Dial / Differential Spec
// ============================================================================
export function SchematicDial({ className }) {
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

// ============================================================================
// SCHEMATIC 2: Combustion Cylinder / Piston
// ============================================================================
export function CylinderSchematic({ className }) {
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

// ============================================================================
// SCHEMATIC 3: Coil Spring Suspension / Shock Absorber
// ============================================================================
export function SuspensionSchematic({ className }) {
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

// ============================================================================
// SCHEMATIC 4: AWD Drivetrain Layout
// ============================================================================
export function DrivetrainSchematic({ className }) {
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

// ============================================================================
// SCHEMATIC 5: Interlocking Gear Train
// ============================================================================
export function GearTrainSchematic({ className }) {
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

// ============================================================================
// SCHEMATIC 6: Planetary Gear System (Complex, high density)
// ============================================================================
export function PlanetaryGearSchematic({ className }) {
  return (
    <svg className={`pointer-events-none select-none ${className}`} width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Ring Gear */}
      <g transform="translate(200, 200)">
        <circle cx="0" cy="0" r="130" stroke="currentColor" strokeWidth="1.5" className="text-slate-500" />
        <circle cx="0" cy="0" r="120" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
        <circle cx="0" cy="0" r="110" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" className="text-slate-400" />
        
        {/* Ring Gear Internal Teeth (36 teeth) */}
        {[...Array(36)].map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const x1 = 110 * Math.cos(angle);
          const y1 = 110 * Math.sin(angle);
          const x2 = 120 * Math.cos(angle);
          const y2 = 120 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.2" className="text-slate-400/60" />;
        })}
        
        {/* Central Sun Gear */}
        <circle cx="0" cy="0" r="40" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
        <circle cx="0" cy="0" r="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" className="text-slate-400" />
        <circle cx="0" cy="0" r="14" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
        <circle cx="0" cy="0" r="6" fill="currentColor" className="text-blue-400/30" />
        
        {/* Sun Gear Teeth (12 teeth) */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 38 * Math.cos(angle);
          const y1 = 38 * Math.sin(angle);
          const x2 = 44 * Math.cos(angle);
          const y2 = 44 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-slate-400" />;
        })}
        
        {/* 4 Planet Gears at offset distance of 80 */}
        {/* Planet 1 (Top) */}
        <g transform="translate(0, -80)">
          <circle cx="0" cy="0" r="40" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
          <circle cx="0" cy="0" r="14" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
          {/* Teeth (12 teeth) */}
          {[...Array(12)].map((_, i) => {
            const angle = ((i * 30 + 15) * Math.PI) / 180;
            const x1 = 38 * Math.cos(angle);
            const y1 = 38 * Math.sin(angle);
            const x2 = 44 * Math.cos(angle);
            const y2 = 44 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-slate-400" />;
          })}
        </g>
        
        {/* Planet 2 (Bottom) */}
        <g transform="translate(0, 80)">
          <circle cx="0" cy="0" r="40" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
          <circle cx="0" cy="0" r="14" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
          {/* Teeth (12 teeth) */}
          {[...Array(12)].map((_, i) => {
            const angle = ((i * 30 + 15) * Math.PI) / 180;
            const x1 = 38 * Math.cos(angle);
            const y1 = 38 * Math.sin(angle);
            const x2 = 44 * Math.cos(angle);
            const y2 = 44 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-slate-400" />;
          })}
        </g>

        {/* Planet 3 (Left) */}
        <g transform="translate(-80, 0)">
          <circle cx="0" cy="0" r="40" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
          <circle cx="0" cy="0" r="14" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
          {/* Teeth (12 teeth) */}
          {[...Array(12)].map((_, i) => {
            const angle = ((i * 30 + 15) * Math.PI) / 180;
            const x1 = 38 * Math.cos(angle);
            const y1 = 38 * Math.sin(angle);
            const x2 = 44 * Math.cos(angle);
            const y2 = 44 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-slate-400" />;
          })}
        </g>

        {/* Planet 4 (Right) */}
        <g transform="translate(80, 0)">
          <circle cx="0" cy="0" r="40" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
          <circle cx="0" cy="0" r="14" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
          {/* Teeth (12 teeth) */}
          {[...Array(12)].map((_, i) => {
            const angle = ((i * 30 + 15) * Math.PI) / 180;
            const x1 = 38 * Math.cos(angle);
            const y1 = 38 * Math.sin(angle);
            const x2 = 44 * Math.cos(angle);
            const y2 = 44 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-slate-400" />;
          })}
        </g>

        {/* Planet Carrier Frame (Cross Structure Overlay) */}
        <line x1="0" y1="-80" x2="0" y2="80" stroke="currentColor" strokeWidth="1.5" className="text-blue-400/40" />
        <line x1="-80" y1="0" x2="80" y2="0" stroke="currentColor" strokeWidth="1.5" className="text-blue-400/40" />
        <circle cx="0" cy="-80" r="5" fill="currentColor" className="text-blue-400/60" />
        <circle cx="0" cy="80" r="5" fill="currentColor" className="text-blue-400/60" />
        <circle cx="-80" cy="0" r="5" fill="currentColor" className="text-blue-400/60" />
        <circle cx="80" cy="0" r="5" fill="currentColor" className="text-blue-400/60" />
      </g>
    </svg>
  );
}

// ============================================================================
// SCHEMATIC 7: Spur Gears (Compact dual gears for filling gaps)
// ============================================================================
export function SpurGearsSchematic({ className }) {
  return (
    <svg className={`pointer-events-none select-none ${className}`} width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gear A (Medium - Left) */}
      <g transform="translate(60, 75)">
        <circle cx="0" cy="0" r="45" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
        <circle cx="0" cy="0" r="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" className="text-slate-400" />
        <circle cx="0" cy="0" r="10" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
        
        {/* Teeth (12 teeth) */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 43 * Math.cos(angle);
          const y1 = 43 * Math.sin(angle);
          const x2 = 50 * Math.cos(angle);
          const y2 = 50 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-slate-400" />;
        })}
      </g>

      {/* Gear B (Small - Right, meshed) */}
      <g transform="translate(135, 75)">
        <circle cx="0" cy="0" r="30" stroke="currentColor" strokeWidth="1" className="text-slate-500" />
        <circle cx="0" cy="0" r="22" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" className="text-slate-400" />
        <circle cx="0" cy="0" r="8" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
        
        {/* Teeth (8 teeth, offset) */}
        {[...Array(8)].map((_, i) => {
          const angle = ((i * 45 + 22.5) * Math.PI) / 180;
          const x1 = 28 * Math.cos(angle);
          const y1 = 28 * Math.sin(angle);
          const x2 = 35 * Math.cos(angle);
          const y2 = 35 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2.2" className="text-slate-400" />;
        })}
      </g>

      {/* Connection shaft line and center hubs */}
      <line x1="60" y1="75" x2="135" y2="75" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" className="text-blue-400/40" />
      <circle cx="60" cy="75" r="2" fill="currentColor" className="text-blue-400/40" />
      <circle cx="135" cy="75" r="2" fill="currentColor" className="text-blue-400/40" />
      
      {/* Label */}
      <text x="50" y="130" fill="currentColor" className="text-slate-400/40 font-mono text-[6px]" style={{ fontSize: '5.5px' }}>DRIVE_SYSTEM: RATIO 1.5</text>
    </svg>
  );
}

// ============================================================================
// COMPOSITE: MechanicalBackground — places all schematics + grid in a container
// ============================================================================
export default function MechanicalBackground({ isAppPage = false }) {
  // For app pages (Layout), use lower opacity so content remains readable
  // For landing page, use full opacity
  const schematicOpacity = isAppPage ? 'opacity-20' : 'opacity-50 sm:opacity-50';
  const gridOpacity = isAppPage ? 'opacity-10' : 'opacity-15';
  const hoverEffects = isAppPage ? '' : 'hover:opacity-75 hover:scale-[1.03] transition-all duration-700';

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Blueprint Grid */}
      <div className={`absolute inset-0 ${gridOpacity}`}>
        <BlueprintGrid className="opacity-60" />
      </div>

      {/* Mechanical Schematic Artwork */}
      <div className={`absolute inset-0 ${schematicOpacity}`}>
        {/* Graphic 1: Rotary Assembly / Dial - Top Right behind Hero */}
        <SchematicDial className={`absolute top-[3%] right-0 sm:right-0 lg:right-16 xl:right-32 w-48 h-48 sm:w-[420px] sm:h-[420px] ${hoverEffects}`} />

        {/* Graphic 1b: Interlocking Gear Train - Left Upper Section */}
        <GearTrainSchematic className={`absolute top-[16%] left-0 sm:-left-20 lg:left-0 xl:left-12 w-48 h-auto sm:w-72 ${hoverEffects}`} />

        {/* Graphic 2: Combustion Cylinder - Right margin behind Features */}
        <CylinderSchematic className={`absolute top-[32%] right-0 sm:-right-20 lg:right-0 xl:right-12 w-48 h-auto sm:w-64 ${hoverEffects}`} />

        {/* Graphic 3: Coil Spring Suspension - Left margin behind Lease Section */}
        <SuspensionSchematic className={`absolute top-[52%] left-0 sm:-left-20 lg:left-0 xl:left-12 w-48 h-auto sm:w-64 ${hoverEffects}`} />

        {/* Graphic 4: AWD Drivetrain Layout - Right margin behind Testimonials/FAQ */}
        <DrivetrainSchematic className={`absolute top-[72%] right-0 sm:-right-20 lg:right-0 xl:right-12 w-48 h-auto sm:w-64 ${hoverEffects}`} />
      </div>
    </div>
  );
}