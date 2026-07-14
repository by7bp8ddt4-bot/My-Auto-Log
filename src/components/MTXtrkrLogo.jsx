/**
 * MTXtrkr Logo with Realistic Crossed Combo Wrenches "X"
 * Two crossed combo wrenches at different sizes:
 * - Wrench 1 (shorter): open-end UP, box-end DOWN, 45° rotation — forms the \
 * - Wrench 2 (longer, inverted): box-end UP, open-end DOWN, -45° rotation — forms the /
 * Metallic sheen highlights, tapered handles, 12-point box-end rings, toothed open-end jaws.
 */
export default function MTXtrkrLogo({ className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Main Logo Row: MT + Crossed Combo Wrenches X + trkr */}
      <div className="flex items-center justify-center gap-0">
        {/* "MT" — gunmetal grey */}
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-400 tracking-tight">
          MT
        </span>

        {/* Two Crossed Combo Wrenches forming the "X" */}
        <svg
          viewBox="0 0 80 80"
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-1 sm:mx-1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ═══════════════════════════════════════════════════════════
              Wrench 1 — SHORTER, open-end UP, box-end DOWN, 45° (\)
              Extends from y≈-2 to y≈68
              ═══════════════════════════════════════════════════════════ */}
          <g transform="rotate(45, 40, 40)">
            {/* ── Tapered handle ── */}
            <path
              d="M 36,10 Q 34,28 37,44 L 43,44 Q 46,28 44,10 Z"
              className="fill-red-600"
            />
            {/* Handle — primary metallic sheen (left side) */}
            <path
              d="M 36,10 Q 34,28 37.5,44 Q 35,28 37,10 Z"
              className="fill-red-500/50"
            />
            {/* Handle — secondary metallic sheen (center stripe) */}
            <path
              d="M 37.5,10 Q 36,28 39,44 Q 36.5,28 38,10 Z"
              className="fill-red-400/30"
            />

            {/* ── Open-end jaw (top) ── */}
            {/* Left fork prong with gripping tooth */}
            <path
              d="M 36,10 L 34,4 Q 32,0 28,-2 L 26,0 Q 30,2 31,6 L 36,10 Z"
              className="fill-red-600"
            />
            {/* Left prong — highlight */}
            <path
              d="M 35,9 L 33.5,5 Q 32,1 28.5,-1 L 27,0 Q 30,2 31,6 L 35,9 Z"
              className="fill-red-500/50"
            />
            {/* Right fork prong with gripping tooth */}
            <path
              d="M 44,10 L 46,4 Q 48,0 52,-2 L 54,0 Q 50,2 49,6 L 44,10 Z"
              className="fill-red-600"
            />
            {/* Right prong — highlight */}
            <path
              d="M 45,9 L 46.5,5 Q 48,1 51.5,-1 L 53,0 Q 50,2 49,6 L 45,9 Z"
              className="fill-red-500/50"
            />
            {/* Jaw head base — wider section connecting prongs to handle */}
            <path
              d="M 32,10 L 32,5 Q 33,10 36,10 L 44,10 Q 47,10 48,10 L 48,5 Z"
              className="fill-red-600"
            />

            {/* ── Box-end / closed ring (bottom) ── */}
            {/* Outer ring */}
            <circle cx="40" cy="56" r="12" stroke="currentColor" strokeWidth="3" className="text-red-600" />
            {/* 12-point interior — dashed ring suggests multi-point socket */}
            <circle cx="40" cy="56" r="9" stroke="currentColor" strokeWidth="2" className="text-red-600" strokeDasharray="2.5 2.5" />
            {/* Inner opening */}
            <circle cx="40" cy="56" r="6" stroke="currentColor" strokeWidth="1.5" className="text-red-500/30" />
          </g>

          {/* ═══════════════════════════════════════════════════════════
              Wrench 2 — LONGER, box-end UP, open-end DOWN, -45° (/)
              Inverted so it hangs lower at the bottom (y≈74 vs y≈68)
              ═══════════════════════════════════════════════════════════ */}
          <g transform="rotate(-45, 40, 40)">
            {/* ── Tapered handle — longer, extends further down ── */}
            <path
              d="M 36,8 Q 34,28 37,50 L 43,50 Q 46,28 44,8 Z"
              className="fill-red-600"
            />
            {/* Handle — primary metallic sheen */}
            <path
              d="M 36,8 Q 34,28 37.5,50 Q 35,28 37,8 Z"
              className="fill-red-500/50"
            />
            {/* Handle — secondary metallic sheen */}
            <path
              d="M 37.5,8 Q 36,28 39,50 Q 36.5,28 38,8 Z"
              className="fill-red-400/30"
            />

            {/* ── Box-end / closed ring (top — inverted) ── */}
            {/* Outer ring */}
            <circle cx="40" cy="2" r="12" stroke="currentColor" strokeWidth="3" className="text-red-600" />
            {/* 12-point interior */}
            <circle cx="40" cy="2" r="9" stroke="currentColor" strokeWidth="2" className="text-red-600" strokeDasharray="2.5 2.5" />
            {/* Inner opening */}
            <circle cx="40" cy="2" r="6" stroke="currentColor" strokeWidth="1.5" className="text-red-500/30" />

            {/* ── Open-end jaw (bottom — inverted) ── */}
            {/* Left fork prong */}
            <path
              d="M 36,50 L 34,56 Q 32,60 28,62 L 26,60 Q 30,58 31,54 L 36,50 Z"
              className="fill-red-600"
            />
            {/* Right fork prong */}
            <path
              d="M 44,50 L 46,56 Q 48,60 52,62 L 54,60 Q 50,58 49,54 L 44,50 Z"
              className="fill-red-600"
            />
            {/* Jaw head base */}
            <path
              d="M 32,50 L 32,55 Q 33,50 36,50 L 44,50 Q 47,50 48,50 L 48,55 Z"
              className="fill-red-600"
            />
          </g>
        </svg>

        {/* "trkr" */}
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
          trkr
        </span>
      </div>

      {/* Taglines */}
      <p className="text-lg sm:text-xl text-slate-400 italic mt-1">
        Mainten<span className="text-red-600">X</span> Tracker
      </p>
      <p className="text-sm sm:text-base text-slate-500 italic">
        — Your Owner's Manual Simplified
      </p>
    </div>
  );
}