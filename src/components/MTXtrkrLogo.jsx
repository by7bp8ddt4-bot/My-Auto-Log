/**
 * MTXtrkr Logo — Photo-realistic PNG
 * Uses a generated PNG image of crossed Craftsman-style combo wrenches
 * instead of hand-coded SVG paths (which never looked realistic enough).
 * Domain: www.MTXtrkr.com
 */
import logoImage from '/assets/mtxtrkr-logo.png';

export default function MTXtrkrLogo({ className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Main Logo Row: MT + Crossed Combo Wrenches X + trkr */}
      <div className="flex items-center justify-center gap-0">
        {/* "MT" — gunmetal grey */}
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold italic text-zinc-400 tracking-tight -mr-1 sm:-mr-1.5">
          MT
        </span>

        {/* Photo-realistic crossed wrench PNG */}
        <img
          src={logoImage}
          alt="MTXtrkr"
          className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 -mx-0.5 sm:mx-0.5"
        />

        {/* "trkr" */}
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight -ml-1 sm:-ml-1.5">
          trkr
        </span>
      </div>

      {/* Taglines */}
      <p className="text-lg sm:text-xl text-slate-400 italic mt-1">
        Mainten<span className="text-red-800">X</span> Tracker
      </p>
      <p className="text-sm sm:text-base text-slate-500 italic">
        — Your Owner's Manual Simplified
      </p>
    </div>
  );
}