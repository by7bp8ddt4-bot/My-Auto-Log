/**
 * MTXtrkr Logo — Realistic Crossed Combo Wrenches "X"
 * Based on reference image study of real combination wrenches.
 * 
 * Two crossed combo wrenches:
 * - Wrench 1 (LONGER, 45°): open-end at top-left, box-end at bottom-right — forms the \
 * - Wrench 2 (SHORTER, -45°, inverted): box-end at top-right, open-end at bottom-left — forms the /
 * 
 * Realistic features:
 * - Straight handle with rounded ends
 * - Open-end jaw with angled gripping surfaces and visible teeth
 * - Thin 12-point star box-end interior
 * - Multi-layer chrome/metallic highlights
 */
export default function MTXtrkrLogo({ className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center justify-center gap-0">
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-400 tracking-tight">
          MT
        </span>

        <svg
          viewBox="0 0 80 80"
          className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-1 sm:mx-1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ═══════════════════════════════════════════════════════════
              WRENCH 1 — LONGER, open-end at top-left, box-end at bottom-right
              Rotated 45° (\). Extends from y≈0 to y≈76.
              ═══════════════════════════════════════════════════════════ */}
          <g transform="rotate(45, 40, 40)">
            {/* ── STRAIGHT HANDLE — simple rectangle with rounded ends ── */}
            <path
              d="M 36,12 Q 36,10 38,10 L 42,10 Q 44,10 44,12 L 44,58 Q 44,60 42,60 L 38,60 Q 36,60 36,58 Z"
              className="fill-red-600"
            />
            {/* Chrome center stripe */}
            <path
              d="M 39,10 L 41,10 L 41,60 L 39,60 Z"
              className="fill-white/35"
            />
            {/* Secondary chrome highlight */}
            <path
              d="M 38,10 L 39,10 L 39,60 L 38,60 Z"
              className="fill-slate-300/30"
            />
            {/* Left edge highlight */}
            <path
              d="M 36,12 L 36,58 L 38.5,60 L 38.5,10 Z"
              className="fill-red-400/30"
            />

            {/* ── OPEN-END JAW (top) — realistic gripping surfaces ── */}
            {/* Jaw head base — wider section */}
            <path
              d="M 32,12 L 32,5 Q 32,3 33,1 L 47,1 Q 48,3 48,5 L 48,12 Z"
              className="fill-red-600"
            />
            {/* Left prong — outer shape */}
            <path
              d="M 32,5 Q 30,-1 29,-4 L 27,-4 Q 28,-2 30,1 L 32,5 Z"
              className="fill-red-600"
            />
            {/* Left prong — angled gripping surface with teeth */}
            <path
              d="M 32,5 L 30,1 Q 29,-1 28,-3 L 28,-2 L 29,-1 L 28,0 L 29,1 L 28,2 L 30,4 Z"
              className="fill-red-600"
            />
            {/* Right prong — outer shape */}
            <path
              d="M 48,5 Q 50,-1 51,-4 L 53,-4 Q 52,-2 50,1 L 48,5 Z"
              className="fill-red-600"
            />
            {/* Right prong — angled gripping surface with teeth */}
            <path
              d="M 48,5 L 50,1 Q 51,-1 52,-3 L 52,-2 L 51,-1 L 52,0 L 51,1 L 52,2 L 50,4 Z"
              className="fill-red-600"
            />
            {/* U-shaped opening */}
            <path
              d="M 32,8 Q 35,11 40,11 Q 45,11 48,8"
              className="fill-red-600"
            />
            {/* Jaw chrome highlights */}
            <path
              d="M 33,3 Q 32,1 31,-1 L 32,-2 Q 33,0 34,2 Z"
              className="fill-white/25"
            />
            <path
              d="M 47,3 Q 48,1 49,-1 L 48,-2 Q 47,0 46,2 Z"
              className="fill-white/25"
            />

            {/* ── BOX-END (bottom) — thin 12-point star ── */}
            {/* Outer ring */}
            <circle cx="40" cy="68" r="10" className="fill-red-600" />
            {/* Outer ring chrome */}
            <circle cx="40" cy="68" r="9" className="fill-red-500/40" />
            {/* 12-point star interior */}
            <polygon
              points="40,59.5 42,62.5 47,63 43.5,65.5 44.5,70.5 40,68 35.5,70.5 36.5,65.5 33,63 38,62.5"
              className="fill-red-900"
            />
            {/* Center hole */}
            <circle cx="40" cy="65.5" r="3.5" className="fill-slate-950" />
            {/* Edge chrome highlight */}
            <path
              d="M 31,68 A 9 9 0 0 1 49,68"
              fill="none"
              className="stroke-white/20"
              strokeWidth="1.5"
            />
          </g>

          {/* ═══════════════════════════════════════════════════════════
              WRENCH 2 — SHORTER, box-end at top-right, open-end at bottom-left
              Rotated -45° (/). Inverted: box-end at top, open-end at bottom.
              Shorter — extends from y≈-8 to y≈68.
              ═══════════════════════════════════════════════════════════ */}
          <g transform="rotate(-45, 40, 40)">
            {/* ── STRAIGHT HANDLE — simple rectangle with rounded ends ── */}
            <path
              d="M 36,8 Q 36,6 38,6 L 42,6 Q 44,6 44,8 L 44,54 Q 44,56 42,56 L 38,56 Q 36,56 36,54 Z"
              className="fill-red-600"
            />
            {/* Chrome center stripe */}
            <path
              d="M 39,6 L 41,6 L 41,56 L 39,56 Z"
              className="fill-white/35"
            />
            {/* Secondary chrome */}
            <path
              d="M 38,6 L 39,6 L 39,56 L 38,56 Z"
              className="fill-slate-300/30"
            />
            {/* Edge highlight */}
            <path
              d="M 36,8 L 36,54 L 38.5,56 L 38.5,6 Z"
              className="fill-red-400/30"
            />

            {/* ── BOX-END (top) ── */}
            <circle cx="40" cy="-2" r="10" className="fill-red-600" />
            <circle cx="40" cy="-2" r="9" className="fill-red-500/40" />
            <polygon
              points="40,-10.5 42,-7.5 47,-7 43.5,-4.5 44.5,0.5 40,-2 35.5,0.5 36.5,-4.5 33,-7 38,-7.5"
              className="fill-red-900"
            />
            <circle cx="40" cy="-4.5" r="3.5" className="fill-slate-950" />
            <path
              d="M 31,-2 A 9 9 0 0 1 49,-2"
              fill="none"
              className="stroke-white/20"
              strokeWidth="1.5"
            />

            {/* ── OPEN-END JAW (bottom — inverted) ── */}
            <path
              d="M 32,54 L 32,61 Q 32,63 33,65 L 47,65 Q 48,63 48,61 L 48,54 Z"
              className="fill-red-600"
            />
            <path
              d="M 32,61 Q 30,67 29,70 L 27,70 Q 28,68 30,65 L 32,61 Z"
              className="fill-red-600"
            />
            <path
              d="M 32,61 L 30,65 Q 29,67 28,69 L 28,68 L 29,67 L 28,66 L 29,65 L 28,64 L 30,62 Z"
              className="fill-red-600"
            />
            <path
              d="M 48,61 Q 50,67 51,70 L 53,70 Q 52,68 50,65 L 48,61 Z"
              className="fill-red-600"
            />
            <path
              d="M 48,61 L 50,65 Q 51,67 52,69 L 52,68 L 51,67 L 52,66 L 51,65 L 52,64 L 50,62 Z"
              className="fill-red-600"
            />
            <path
              d="M 32,58 Q 35,55 40,55 Q 45,55 48,58"
              className="fill-red-600"
            />
            <path
              d="M 33,63 Q 32,65 31,67 L 32,68 Q 33,66 34,64 Z"
              className="fill-white/25"
            />
            <path
              d="M 47,63 Q 48,65 49,67 L 48,68 Q 47,66 46,64 Z"
              className="fill-white/25"
            />
          </g>
        </svg>

        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
          trkr
        </span>
      </div>

      <p className="text-lg sm:text-xl text-slate-400 italic mt-1">
        Mainten<span className="text-red-600">X</span> Tracker
      </p>
      <p className="text-sm sm:text-base text-slate-500 italic">
        — Your Owner's Manual Simplified
      </p>
    </div>
  );
}