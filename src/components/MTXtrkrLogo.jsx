/**
 * MTXtrkr Logo — Crossed Combo Wrenches "X"
 * 
 * Two crossed combo wrenches:
 * - Wrench 1 (LONGER, 45°): open-end at top-left, box-end at bottom-right — forms the \
 * - Wrench 2 (SHORTER, -45°, inverted): box-end at top-right, open-end at bottom-left — forms the /
 * 
 * Design features:
 * - Straight handles (simple rectangles with rounded ends)
 * - Open-end jaws with curved outer prongs, straight inner edges, U-gap
 * - Thin 12-point star box-end interior
 * - Multi-layer chrome/metallic highlights
 * - Tops of X aligned, lower-right (\) extends further
 */
export default function MTXtrkrLogo({ className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center justify-center gap-0">
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold italic text-zinc-400 tracking-tight">
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
              Rotated 45° (\). Box-end extends to y=80 — sticks down further.
              Top of open-end at y≈-3 aligned with Wrench 2's box-end top.
              ═══════════════════════════════════════════════════════════ */}
          <g transform="rotate(45, 40, 40)">
            {/* ── STRAIGHT HANDLE — simple rectangle with rounded ends ── */}
            <path
              d="M 36,12 Q 36,10 38,10 L 42,10 Q 44,10 44,12 L 44,58 Q 44,60 42,60 L 38,60 Q 36,60 36,58 Z"
              className="fill-red-600"
            />
            <path d="M 39,10 L 41,10 L 41,60 L 39,60 Z" className="fill-white/35" />
            <path d="M 38,10 L 39,10 L 39,60 L 38,60 Z" className="fill-slate-300/30" />
            <path d="M 36,12 L 36,58 L 38.5,60 L 38.5,10 Z" className="fill-red-400/30" />

            {/* ── OPEN-END JAW (top) — curved outer bevels forward, straight inner, U-gap ── */}
            {/* Jaw head base — wider section connecting prongs */}
            <path
              d="M 31,12 L 31,4 Q 31,2 32,0 L 48,0 Q 49,2 49,4 L 49,12 Z"
              className="fill-red-600"
            />
            {/* Left prong — single path: curved outer bevels forward, straight inner, U-shape at bottom */}
            <path
              d="M 31,4 Q 27,-2 26,-6 L 28,-6 Q 29,-3 31,1 L 34,7"
              className="fill-red-600"
            />
            {/* Right prong — single path: curved outer bevels forward, straight inner */}
            <path
              d="M 49,4 Q 53,-2 54,-6 L 52,-6 Q 51,-3 49,1 L 46,7"
              className="fill-red-600"
            />
            {/* U-shaped opening connecting bottom of inner edges */}
            <path
              d="M 34,7 Q 38,11 40,11 Q 42,11 46,7"
              className="fill-red-600"
            />
            {/* Jaw chrome highlights */}
            <path d="M 32,2 Q 29,-1 28,-4 L 29,-5 Q 30,-2 33,0 Z" className="fill-white/25" />
            <path d="M 48,2 Q 51,-1 52,-4 L 51,-5 Q 50,-2 47,0 Z" className="fill-white/25" />

            {/* ── THIN BOX-END (bottom) — r=8 outer, 12-point star ── */}
            <circle cx="40" cy="72" r="8" className="fill-red-600" />
            <circle cx="40" cy="72" r="7" className="fill-red-500/40" />
            <polygon
              points="40,65.5 41.5,67.5 45,68 43,70 43.5,74 40,72 36.5,74 37,70 35,68 38.5,67.5"
              className="fill-red-900"
            />
            <circle cx="40" cy="70" r="2.5" className="fill-slate-950" />
            <path d="M 33,72 A 7 7 0 0 1 47,72" fill="none" className="stroke-white/20" strokeWidth="1" />
          </g>

          {/* ═══════════════════════════════════════════════════════════
              WRENCH 2 — SHORTER, box-end at top-right, open-end at bottom-left
              Rotated -45° (/). Inverted: box-end at top, open-end at bottom.
              Top of box-end at y≈-3 aligned with Wrench 1's open-end top.
              ═══════════════════════════════════════════════════════════ */}
          <g transform="rotate(-45, 40, 40)">
            {/* ── STRAIGHT HANDLE — simple rectangle with rounded ends ── */}
            <path
              d="M 36,8 Q 36,6 38,6 L 42,6 Q 44,6 44,8 L 44,54 Q 44,56 42,56 L 38,56 Q 36,56 36,54 Z"
              className="fill-red-600"
            />
            <path d="M 39,6 L 41,6 L 41,56 L 39,56 Z" className="fill-white/35" />
            <path d="M 38,6 L 39,6 L 39,56 L 38,56 Z" className="fill-slate-300/30" />
            <path d="M 36,8 L 36,54 L 38.5,56 L 38.5,6 Z" className="fill-red-400/30" />

            {/* ── THIN BOX-END (top) — r=8, aligned with Wrench 1's jaw top ── */}
            <circle cx="40" cy="4" r="8" className="fill-red-600" />
            <circle cx="40" cy="4" r="7" className="fill-red-500/40" />
            <polygon
              points="40,-2.5 41.5,-0.5 45,0 43,2 43.5,6 40,4 36.5,6 37,2 35,0 38.5,-0.5"
              className="fill-red-900"
            />
            <circle cx="40" cy="2" r="2.5" className="fill-slate-950" />
            <path d="M 33,4 A 7 7 0 0 1 47,4" fill="none" className="stroke-white/20" strokeWidth="1" />

            {/* ── OPEN-END JAW (bottom — inverted) — curved outer bevels forward, straight inner, U-gap ── */}
            <path
              d="M 31,54 L 31,62 Q 31,64 32,66 L 48,66 Q 49,64 49,62 L 49,54 Z"
              className="fill-red-600"
            />
            <path
              d="M 31,62 Q 27,68 26,72 L 28,72 Q 29,69 31,65 L 34,59"
              className="fill-red-600"
            />
            <path
              d="M 49,62 Q 53,68 54,72 L 52,72 Q 51,69 49,65 L 46,59"
              className="fill-red-600"
            />
            <path d="M 34,59 Q 38,55 40,55 Q 42,55 46,59" className="fill-red-600" />
            <path d="M 32,64 Q 29,67 28,70 L 29,71 Q 30,68 33,66 Z" className="fill-white/25" />
            <path d="M 48,64 Q 51,67 52,70 L 51,71 Q 50,68 47,66 Z" className="fill-white/25" />
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