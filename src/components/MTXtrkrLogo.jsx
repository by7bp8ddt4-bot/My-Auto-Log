/**
 * MTXtrkr Logo with Wrench & Ratchet "X"
 * The "X" in MTXtrkr is rendered as a crossed wrench and ratchet.
 */
export default function MTXtrkrLogo({ className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Main Logo Row: MT + Wrench/Ratchet X + trkr */}
      <div className="flex items-center justify-center gap-0">
        {/* "MT" */}
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
          MT
        </span>

        {/* Wrench + Ratchet "X" — inline SVG */}
        <svg
          viewBox="0 0 64 64"
          className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-0.5 sm:mx-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wrench (top-left to bottom-right) — forms the \ of the X */}
          <g transform="rotate(45, 32, 32)">
            {/* Wrench handle */}
            <rect x="28" y="8" width="8" height="36" rx="3" className="fill-blue-400" />
            {/* Wrench jaw (open-end) */}
            <path
              d="M 24 44 L 18 50 L 20 52 L 26 48 L 28 48 Z"
              className="fill-blue-400"
            />
            <path
              d="M 40 44 L 46 50 L 44 52 L 38 48 L 36 48 Z"
              className="fill-blue-400"
            />
            {/* Wrench highlight */}
            <rect x="30" y="10" width="2" height="32" rx="1" className="fill-blue-300/50" />
          </g>

          {/* Ratchet (top-right to bottom-left) — forms the / of the X */}
          <g transform="rotate(-45, 32, 32)">
            {/* Ratchet body */}
            <rect x="28" y="8" width="8" height="36" rx="3" className="fill-cyan-400" />
            {/* Ratchet head (square drive) */}
            <rect x="26" y="44" width="12" height="8" rx="2" className="fill-cyan-400" />
            {/* Ratchet highlight */}
            <rect x="30" y="10" width="2" height="32" rx="1" className="fill-cyan-300/50" />
            {/* Ratchet teeth notches */}
            <line x1="28" y1="20" x2="36" y2="20" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
            <line x1="28" y1="26" x2="36" y2="26" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
            <line x1="28" y1="32" x2="36" y2="32" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
            {/* Direction switch */}
            <circle cx="32" cy="14" r="2" className="fill-white/40" />
          </g>
        </svg>

        {/* "trkr" */}
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
          trkr
        </span>
      </div>

      {/* Taglines */}
      <p className="text-lg sm:text-xl text-slate-400 italic mt-1">
        Mainten<span className="text-blue-400">X</span> Tracker
      </p>
      <p className="text-sm sm:text-base text-slate-500 italic">
        — Your Owner's Manual Simplified
      </p>
    </div>
  );
}