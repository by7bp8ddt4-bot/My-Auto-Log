/**
 * MTXtrkr Logo — Realistic Crossed Combo Wrenches "X"
 * 
 * Two crossed combo wrenches at different sizes:
 * - Wrench 1 (shorter): open-end UP-left, box-end DOWN-right, 45° rotation — forms the \
 * - Wrench 2 (longer, inverted): box-end UP-right, open-end DOWN-left, -45° rotation — forms the /
 * 
 * Features:
 * - Contoured grip with hourglass indentations
 * - 15° offset open-end jaw with gripping teeth
 * - 12-point star polygon box-end interior
 * - Chrome/metallic highlights in white/silver/light-gray
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

        {/* Two Crossed Combo Wrenches forming the "X" */}
        <svg
          viewBox="0 0 80 80"
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-1 sm:mx-1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ═══════════════════════════════════════════════════════════
              WRENCH 1 — SHORTER, open-end UP-left, box-end DOWN-right
              Rotated 45° (\). Open-end at top-left, box-end at bottom-right.
              Built vertically then rotated. Shorter — extends y≈2 to y≈66.
              ═══════════════════════════════════════════════════════════ */}
          <g transform="rotate(45, 40, 40)">
            {/* ── HANDLE with contoured grip ── */}
            {/* Main body — thicker mid-handle with indentations */}
            <path
              d="M 36,12 
                 Q 33,16 32,22 
                 Q 31,28 33,34 
                 Q 34,37 35,40 
                 Q 36,44 37,50 
                 L 43,50 
                 Q 44,44 45,40 
                 Q 46,37 47,34 
                 Q 49,28 48,22 
                 Q 47,16 44,12 
                 Z"
              className="fill-red-600"
            />
            {/* Bright chrome center stripe — white reflection */}
            <path
              d="M 38.5,12 
                 Q 37,16 36.5,22 
                 Q 36,28 37,34 
                 Q 37.5,37 38,40 
                 Q 38.5,44 39,50 
                 L 41,50 
                 Q 41.5,44 42,40 
                 Q 42.5,37 43,34 
                 Q 44,28 43.5,22 
                 Q 43,16 41.5,12 
                 Z"
              className="fill-white/40"
            />
            {/* Chrome secondary highlight — silver */}
            <path
              d="M 37,12 
                 Q 35,16 34.5,22 
                 Q 33.5,28 34.5,34 
                 Q 35,37 35.5,40 
                 Q 36,44 36.5,50 
                 L 38.5,50 
                 Q 38,44 37.5,40 
                 Q 37,37 36.5,34 
                 Q 35.5,28 36.5,22 
                 Q 37,16 38,12 
                 Z"
              className="fill-slate-300/30"
            />
            {/* Left edge highlight */}
            <path
              d="M 36,12 
                 Q 33,16 32,22 
                 Q 31,28 33,34 
                 Q 34,37 35,40 
                 Q 36,44 37,50 
                 L 37.5,50 
                 Q 36.5,44 35.5,40 
                 Q 34.5,37 33.5,34 
                 Q 32,28 33,22 
                 Q 34,16 36.5,12 
                 Z"
              className="fill-red-400/30"
            />

            {/* ── OPEN-END JAW (top) — 15° offset ── */}
            <g transform="rotate(15, 40, 10)">
              {/* Jaw head — wider base where prongs attach */}
              <path
                d="M 31,10 L 31,3 Q 32,1 33,-1 L 47,-1 Q 48,1 49,3 L 49,10 Z"
                className="fill-red-600"
              />
              {/* Left prong — outer curve to tip */}
              <path
                d="M 31,3 Q 28,-2 24,-6 Q 23,-7 24,-8 L 26,-7 Q 29,-4 32,0 Z"
                className="fill-red-600"
              />
              {/* Left prong — gripping tooth (small triangle on inner face) */}
              <path
                d="M 32,0 L 29,-3 L 28,0 Z"
                className="fill-red-600"
              />
              {/* Left prong — inner face between tooth and U */}
              <path
                d="M 28,0 L 29,2 L 32,4 Z"
                className="fill-red-600"
              />
              {/* Right prong — outer curve to tip */}
              <path
                d="M 49,3 Q 52,-2 56,-6 Q 57,-7 56,-8 L 54,-7 Q 51,-4 48,0 Z"
                className="fill-red-600"
              />
              {/* Right prong — gripping tooth */}
              <path
                d="M 48,0 L 51,-3 L 52,0 Z"
                className="fill-red-600"
              />
              {/* Right prong — inner face */}
              <path
                d="M 52,0 L 51,2 L 48,4 Z"
                className="fill-red-600"
              />
              {/* U-shaped opening bottom — curves between prongs */}
              <path
                d="M 32,4 Q 35,7 40,7 Q 45,7 48,4"
                className="fill-red-600"
              />
              {/* Jaw chrome highlights */}
              <path
                d="M 33,0 Q 30,-1 28,-3 L 29,-4 Q 31,-2 33,0 Z"
                className="fill-white/25"
              />
              <path
                d="M 47,0 Q 50,-1 52,-3 L 51,-4 Q 49,-2 47,0 Z"
                className="fill-white/25"
              />
            </g>

            {/* ── BOX-END (bottom) with 12-point star interior ── */}
            {/* Outer ring */}
            <circle cx="40" cy="62" r="11" className="fill-red-600" />
            {/* Outer ring chrome highlight */}
            <circle cx="40" cy="62" r="10" className="fill-red-500/50" />
            {/* 12-point star interior — using a polygon */}
            <polygon
              points="40,52.5 42,55.5 47,56 43.5,59 44.5,64 40,61.5 35.5,64 36.5,59 33,56 38,55.5"
              className="fill-red-900"
            />
            {/* 12-point star secondary layer for depth */}
            <polygon
              points="40,54 41.5,56 45,56.5 42.5,58.5 43,62 40,60 37,62 37.5,58.5 35,56.5 38.5,56"
              className="fill-red-800"
            />
            {/* Center hole */}
            <circle cx="40" cy="59" r="3" className="fill-slate-950" />
            {/* Box-end edge chrome */}
            <path
              d="M 31,62 A 9 9 0 0 1 49,62 A 9 9 0 0 1 31,62"
              fill="none"
              className="stroke-white/15"
              strokeWidth="1"
            />
          </g>

          {/* ═══════════════════════════════════════════════════════════
              WRENCH 2 — LONGER, box-end UP-right, open-end DOWN-left
              Rotated -45° (/). Box-end at top-right, open-end at bottom-left.
              INVERTED: longer handle — extends y≈-4 to y≈74 so open-end
              sticks DOWN FURTHER at bottom-left than Wrench 1's box-end.
              ═══════════════════════════════════════════════════════════ */}
          <g transform="rotate(-45, 40, 40)">
            {/* ── HANDLE with contoured grip — LONGER ── */}
            {/* Main body — extends further down */}
            <path
              d="M 36,8 
                 Q 33,12 32,18 
                 Q 31,24 33,30 
                 Q 34,33 35,38 
                 Q 36,44 37,54 
                 L 43,54 
                 Q 44,44 45,38 
                 Q 46,33 47,30 
                 Q 49,24 48,18 
                 Q 47,12 44,8 
                 Z"
              className="fill-red-600"
            />
            {/* Bright chrome center stripe */}
            <path
              d="M 38.5,8 
                 Q 37,12 36.5,18 
                 Q 36,24 37,30 
                 Q 37.5,33 38,38 
                 Q 38.5,44 39,54 
                 L 41,54 
                 Q 41.5,44 42,38 
                 Q 42.5,33 43,30 
                 Q 44,24 43.5,18 
                 Q 43,12 41.5,8 
                 Z"
              className="fill-white/40"
            />
            {/* Chrome secondary highlight */}
            <path
              d="M 37,8 
                 Q 35,12 34.5,18 
                 Q 33.5,24 34.5,30 
                 Q 35,33 35.5,38 
                 Q 36,44 36.5,54 
                 L 38.5,54 
                 Q 38,44 37.5,38 
                 Q 37,33 36.5,30 
                 Q 35.5,24 36.5,18 
                 Q 37,12 38,8 
                 Z"
              className="fill-slate-300/30"
            />
            {/* Left edge highlight */}
            <path
              d="M 36,8 
                 Q 33,12 32,18 
                 Q 31,24 33,30 
                 Q 34,33 35,38 
                 Q 36,44 37,54 
                 L 37.5,54 
                 Q 36.5,44 35.5,38 
                 Q 34.5,33 33.5,30 
                 Q 32,24 33,18 
                 Q 34,12 36.5,8 
                 Z"
              className="fill-red-400/30"
            />

            {/* ── BOX-END (top) ── */}
            <circle cx="40" cy="-4" r="11" className="fill-red-600" />
            <circle cx="40" cy="-4" r="10" className="fill-red-500/50" />
            <polygon
              points="40,-13.5 42,-10.5 47,-10 43.5,-7 44.5,-2 40,-4.5 35.5,-2 36.5,-7 33,-10 38,-10.5"
              className="fill-red-900"
            />
            <polygon
              points="40,-12 41.5,-10 45,-9.5 42.5,-7.5 43,-4 40,-6 37,-4 37.5,-7.5 35,-9.5 38.5,-10"
              className="fill-red-800"
            />
            <circle cx="40" cy="-7" r="3" className="fill-slate-950" />
            <path
              d="M 31,-4 A 9 9 0 0 1 49,-4 A 9 9 0 0 1 31,-4"
              fill="none"
              className="stroke-white/15"
              strokeWidth="1"
            />

            {/* ── OPEN-END JAW (bottom — INVERTED, 15° offset) ── */}
            <g transform="rotate(-15, 40, 54)">
              {/* Jaw head base */}
              <path
                d="M 31,54 L 31,61 Q 32,63 33,65 L 47,65 Q 48,63 49,61 L 49,54 Z"
                className="fill-red-600"
              />
              {/* Left prong outer */}
              <path
                d="M 31,61 Q 28,66 24,70 Q 23,71 24,72 L 26,71 Q 29,68 32,64 Z"
                className="fill-red-600"
              />
              {/* Left prong gripping tooth */}
              <path
                d="M 32,64 L 29,67 L 28,64 Z"
                className="fill-red-600"
              />
              {/* Left prong inner face */}
              <path
                d="M 28,64 L 29,62 L 32,60 Z"
                className="fill-red-600"
              />
              {/* Right prong outer */}
              <path
                d="M 49,61 Q 52,66 56,70 Q 57,71 56,72 L 54,71 Q 51,68 48,64 Z"
                className="fill-red-600"
              />
              {/* Right prong gripping tooth */}
              <path
                d="M 48,64 L 51,67 L 52,64 Z"
                className="fill-red-600"
              />
              {/* Right prong inner face */}
              <path
                d="M 52,64 L 51,62 L 48,60 Z"
                className="fill-red-600"
              />
              {/* U-opening */}
              <path
                d="M 32,60 Q 35,57 40,57 Q 45,57 48,60"
                className="fill-red-600"
              />
              {/* Jaw chrome highlights */}
              <path
                d="M 33,64 Q 30,65 28,67 L 29,68 Q 31,66 33,64 Z"
                className="fill-white/25"
              />
              <path
                d="M 47,64 Q 50,65 52,67 L 51,68 Q 49,66 47,64 Z"
                className="fill-white/25"
              />
            </g>
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
