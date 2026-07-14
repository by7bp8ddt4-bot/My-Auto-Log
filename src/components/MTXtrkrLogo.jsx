/**
 * MTXtrkr Logo — Crossed Combo Wrenches "X"
 * 
 * Two crossed combo wrenches:
 * - Wrench 1 (LONGER, 45°): open-end at top-left, box-end at bottom-right — forms the \
 *   Sticks DOWN FURTHER so the "\" wrench extends lower at bottom-right.
 * - Wrench 2 (SHORTER, -45°, inverted): box-end at top-right, open-end at bottom-left — forms the /
 * 
 * Features:
 * - Straight handles (simple rectangles with rounded ends)
 * - Straight open-end jaws (no offset, inline with handle)
 * - Thin 12-point star box-end interiors
 * - Chrome/metallic highlights in white/silver
 */
export default function MTXtrkrLogo({ className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Main Logo Row: MT + Crossed Wrenches X + trkr */}
      <div className="flex items-center justify-center gap-0">
        {/* "MT" — gunmetal grey */}
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-400 tracking-tight">
          MT
        </span>

        {/* Two Crossed Combo Wrenches — slightly larger than "MT" text */}
        <svg
          viewBox="0 0 80 80"
          className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-1 sm:mx-1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ═══════════════════════════════════════════════════════════
              WRENCH 1 — LONGER, open-end at top-left, box-end at bottom-right
              Rotated 45° (\). Extends from y≈-2 to y≈74 — sticks down further.
              ═══════════════════════════════════════════════════════════ */}
          <g transform="rotate(45, 40, 40)">
            {/* ── STRAIGHT HANDLE — simple rectangle ── */}
            <path
              d="M 36,12 Q 36,10 38,10 L 42,10 Q 44,10 44,12 L 44,56 Q 44,58 42,58 L 38,58 Q 36,58 36,56 Z"
              className="fill-red-600"
            />
            {/* Chrome center stripe */}
            <path
              d="M 39,10 L 41,10 L 41,58 L 39,58 Z"
              className="fill-white/35"
            />
            {/* Left edge highlight */}
            <path
              d="M 36,12 Q 36,10 38,10 L 38.5,10 L 38.5,58 L 36,58 Q 36,58 36,56 Z"
              className="fill-red-400/30"
            />

            {/* ── STRAIGHT OPEN-END JAW (top) — no offset ── */}
            {/* Jaw head — wider base */}
            <path
              d="M 33,12 L 33,6 Q 33,4 34,2 L 46,2 Q 47,4 47,6 L 47,12 Z"
              className="fill-red-600"
            />
            {/* Left prong — outer */}
            <path
              d="M 33,6 Q 31,0 29,-2 L 27,-2 Q 28,0 30,4 L 33,8 Z"
              className="fill-red-600"
            />
            {/* Left prong — gripping tooth */}
            <path
              d="M 30,4 L 28,1 L 27,4 Z"
              className="fill-red-600"
            />
            {/* Right prong — outer */}
            <path
              d="M 47,6 Q 49,0 51,-2 L 53,-2 Q 52,0 50,4 L 47,8 Z"
              className="fill-red-600"
            />
            {/* Right prong — gripping tooth */}
            <path
              d="M 50,4 L 52,1 L 53,4 Z"
              className="fill-red-600"
            />
            {/* U-shaped opening */}
            <path
              d="M 33,8 Q 36,11 40,11 Q 44,11 47,8"
              className="fill-red-600"
            />
            {/* Jaw chrome highlights */}
            <path
              d="M 34,4 Q 33,2 31,0 L 32,-1 Q 33,0 34,2 Z"
              className="fill-white/25"
            />
            <path
              d="M 46,4 Q 47,2 49,0 L 48,-1 Q 47,0 46,2 Z"
              className="fill-white/25"
            />

            {/* ── BOX-END (bottom) with thin 12-point star wall ── */}
            {/* Outer ring */}
            <circle cx="40" cy="66" r="10" className="fill-red-600" />
            {/* 12-point star interior — single polygon */}
            <polygon
              points="40,57.5 42,60.5 47,61 43.5,63.5 44.5,68.5 40,66 35.5,68.5 36.5,63.5 33,61 38,60.5"
              className="fill-red-900"
            />
            {/* Center hole */}
            <circle cx="40" cy="63.5" r="3.5" className="fill-slate-950" />
            {/* Edge chrome */}
            <circle cx="40" cy="66" r="9" className="fill-red-500/40" />
          </g>

          {/* ═══════════════════════════════════════════════════════════
              WRENCH 2 — SHORTER, box-end at top-right, open-end at bottom-left
              Rotated -45° (/). Inverted: box-end at top, open-end at bottom.
              Shorter — extends from y≈-8 to y≈66.
              ═══════════════════════════════════════════════════════════ */}
          <g transform="rotate(-45, 40, 40)">
            {/* ── STRAIGHT HANDLE — simple rectangle ── */}
            <path
              d="M 36,8 Q 36,6 38,6 L 42,6 Q 44,6 44,8 L 44,54 Q 44,56 42,56 L 38,56 Q 36,56 36,54 Z"
              className="fill-red-600"
            />
            {/* Chrome center stripe */}
            <path
              d="M 39,6 L 41,6 L 41,56 L 39,56 Z"
              className="fill-white/35"
            />
            {/* Left edge highlight */}
            <path
              d="M 36,8 Q 36,6 38,6 L 38.5,6 L 38.5,56 L 36,56 Q 36,56 36,54 Z"
              className="fill-red-400/30"
            />

            {/* ── BOX-END (top) ── */}
            <circle cx="40" cy="-2" r="10" className="fill-red-600" />
            <polygon
              points="40,-10.5 42,-7.5 47,-7 43.5,-4.5 44.5,0.5 40,-2 35.5,0.5 36.5,-4.5 33,-7 38,-7.5"
              className="fill-red-900"
            />
            <circle cx="40" cy="-4.5" r="3.5" className="fill-slate-950" />
            <circle cx="40" cy="-2" r="9" className="fill-red-500/40" />

            {/* ── STRAIGHT OPEN-END JAW (bottom — inverted) ── */}
            {/* Jaw head base */}
            <path
              d="M 33,54 L 33,60 Q 33,62 34,64 L 46,64 Q 47,62 47,60 L 47,54 Z"
              className="fill-red-600"
            />
            {/* Left prong outer */}
            <path
              d="M 33,60 Q 31,66 29,68 L 27,68 Q 28,66 30,62 L 33,58 Z"
              className="fill-red-600"
            />
            {/* Left prong gripping tooth */}
            <path
              d="M 30,62 L 28,65 L 27,62 Z"
              className="fill-red-600"
            />
            {/* Right prong outer */}
            <path
              d="M 47,60 Q 49,66 51,68 L 53,68 Q 52,66 50,62 L 47,58 Z"
              className="fill-red-600"
            />
            {/* Right prong gripping tooth */}
            <path
              d="M 50,62 L 52,65 L 53,62 Z"
              className="fill-red-600"
            />
            {/* U-opening */}
            <path
              d="M 33,58 Q 36,55 40,55 Q 44,55 47,58"
              className="fill-red-600"
            />
            {/* Jaw chrome highlights */}
            <path
              d="M 34,62 Q 33,64 31,66 L 32,67 Q 33,66 34,64 Z"
              className="fill-white/25"
            />
            <path
              d="M 46,62 Q 47,64 49,66 L 48,67 Q 47,66 46,64 Z"
              className="fill-white/25"
            />
          </g>
        </svg>

        {/* "trkr" — white */}
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
