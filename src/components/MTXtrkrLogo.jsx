/**
 * MTXtrkr Logo with Crossed Combo Wrenches "X"
 * The "X" in MTXtrkr is rendered as two combo wrenches crossed —
 * each has an open-end jaw on one side and a box-end (closed ring) on the other.
 * ~20% larger than the previous version.
 */
export default function MTXtrkrLogo({ className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Main Logo Row: MT + Crossed Combo Wrenches X + trkr */}
      <div className="flex items-center justify-center gap-0">
        {/* "MT" */}
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-400 tracking-tight">
          MT
        </span>

        {/* Two Crossed Combo Wrenches forming the "X" — ~20% larger */}
        <svg
          viewBox="0 0 80 80"
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-1 sm:mx-1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Combo Wrench 1 (top-left to bottom-right, 45° rotation, red) — forms the \ of the X */}
          <g transform="rotate(45, 40, 40)">
            {/* Wrench handle */}
            <rect x="35" y="6" width="10" height="46" rx="3" className="fill-red-400" />
            {/* Handle highlight */}
            <rect x="38" y="8" width="2" height="42" rx="1" className="fill-red-300/50" />

            {/* Open-end jaw (top — fork shape) */}
            <path
              d="M 30 52 L 22 60 L 24 62 L 32 56 L 34 56 Z"
              className="fill-red-400"
            />
            <path
              d="M 50 52 L 58 60 L 56 62 L 48 56 L 46 56 Z"
              className="fill-red-400"
            />

            {/* Box-end / closed ring (bottom) */}
            <circle cx="40" cy="68" r="12" stroke="currentColor" strokeWidth="2.5" className="text-red-400" />
            <circle cx="40" cy="68" r="6" stroke="currentColor" strokeWidth="1.5" className="text-red-300/30" />
          </g>

          {/* Combo Wrench 2 (top-right to bottom-left, -45° rotation, red) — forms the / of the X */}
          <g transform="rotate(-45, 40, 40)">
            {/* Wrench handle */}
            <rect x="35" y="6" width="10" height="46" rx="3" className="fill-red-400" />
            {/* Handle highlight */}
            <rect x="38" y="8" width="2" height="42" rx="1" className="fill-red-300/50" />

            {/* Open-end jaw (top — fork shape) */}
            <path
              d="M 30 52 L 22 60 L 24 62 L 32 56 L 34 56 Z"
              className="fill-red-400"
            />
            <path
              d="M 50 52 L 58 60 L 56 62 L 48 56 L 46 56 Z"
              className="fill-red-400"
            />

            {/* Box-end / closed ring (bottom) */}
            <circle cx="40" cy="68" r="12" stroke="currentColor" strokeWidth="2.5" className="text-red-400" />
            <circle cx="40" cy="68" r="6" stroke="currentColor" strokeWidth="1.5" className="text-red-300/30" />
          </g>
        </svg>

        {/* "trkr" */}
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
          trkr
        </span>
      </div>

      {/* Taglines */}
      <p className="text-lg sm:text-xl text-slate-400 italic mt-1">
        Mainten<span className="text-red-400">X</span> Tracker
      </p>
      <p className="text-sm sm:text-base text-slate-500 italic">
        — Your Owner's Manual Simplified
      </p>
    </div>
  );
}