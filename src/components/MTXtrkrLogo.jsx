/**
 * MTXtrkr Logo — Realistic Crossed Craftsman-Style Combo Wrenches "X"
 *
 * Two mechanic's combo wrenches crossed at ±45°:
 * - Wrench 1 (LONGER): open-end UP, box-end DOWN, 45° rotation (\) — box-end extends further
 * - Wrench 2 (shorter): box-end UP, open-end DOWN, -45° rotation (/) — inverted
 *
 * Designed with Craftsman 14mm combo wrench proportions:
 * tapered handle, 12-point star box-end, angled fork jaw, metallic chrome sheen.
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
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 -mx-0.5 sm:mx-0.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ═══════════════════════════════════════════════════════════
              Wrench 1 — LONGER (70 units), open-end UP, box-end DOWN, 45° (\)
              The \ wrench's box-end at bottom-right sticks down lower
              Craftsman 14mm combo wrench proportions
              ═══════════════════════════════════════════════════════════ */}
          <g transform="rotate(45, 40, 40)">
            {/* ── Handle: tapered with smooth bezier contour ── */}
            {/* Main body — dark metallic red */}
            <path
              d="M 37.5,7 C 36,16 35,30 38,42 L 42,42 C 45,30 44,16 42.5,7 Z"
              className="fill-red-800"
            />
            {/* Left edge highlight (primary sheen) */}
            <path
              d="M 37.5,7 C 36.2,16 35.5,30 38.5,42 C 36.5,30 36.8,16 38,7 Z"
              className="fill-red-700"
            />
            {/* Center metallic stripe — catches the light */}
            <path
              d="M 38.5,7 C 37.5,16 37,30 39.5,42 C 37.8,30 38,16 39,7 Z"
              className="fill-red-600/40"
            />
            {/* Bright spot — highest light reflection */}
            <path
              d="M 39,7 C 38.2,16 38,30 40,39 C 38.5,30 38.8,16 39.5,7 Z"
              className="fill-red-500/20"
            />

            {/* ── Open-end jaw (top) with angled fork prongs ── */}
            {/* Head base — wider than handle neck */}
            <path
              d="M 33,9 C 33,5 34,2 33,1 L 47,1 C 46,2 47,5 47,9 C 46,7 44,7 36,7 C 34,7 33,9 33,9 Z"
              className="fill-red-800"
            />
            {/* Head base highlight */}
            <path
              d="M 34.5,8 C 35,5 35.5,2 35,1.5 L 36.5,1.5 C 37,2 36.5,5 36,8 Z"
              className="fill-red-700"
            />
            {/* Left fork prong with gripping surface */}
            <path
              d="M 36,7 C 35,5 33,1 29,-5 L 27,-3 C 30,1 32,5 36,7 Z"
              className="fill-red-800"
            />
            {/* Left prong — outer edge highlight */}
            <path
              d="M 35.5,6 C 34.5,4 33,1 29.5,-4 L 28,-3 C 30,1 32,4 35.5,6 Z"
              className="fill-red-700"
            />
            {/* Right fork prong */}
            <path
              d="M 44,7 C 45,5 47,1 51,-5 L 53,-3 C 50,1 48,5 44,7 Z"
              className="fill-red-800"
            />
            {/* Right prong — highlight */}
            <path
              d="M 44.5,6 C 45.5,4 47,1 50.5,-4 L 52,-3 C 50,1 48,4 44.5,6 Z"
              className="fill-red-700"
            />

            {/* ── Box-end 12-point ring (bottom) — extends lower ── */}
            {/* Outer ring wall */}
            <circle cx="40" cy="56" r="9" stroke="currentColor" strokeWidth="3" className="text-red-800" />
            {/* Outer ring chrome highlight */}
            <circle cx="40" cy="56" r="9" stroke="currentColor" strokeWidth="0.75" className="text-red-600/30" />
            {/* 12-point mid-ring — dashed to suggest alternating points */}
            <circle cx="40" cy="56" r="7.5" stroke="currentColor" strokeWidth="2" className="text-red-800" strokeDasharray="2 2" />
            {/* 12-point star interior — accurate alternating outer/inner radii */}
            <polygon
              points="
                40,48.5 43,50.8 46.5,52.25 46,56
                46.5,59.75 43,61.2 40,63.5 37,61.2
                33.5,59.75 34,56 33.5,52.25 37,50.8
              "
              className="fill-red-800"
            />
            {/* Inner ring opening */}
            <circle cx="40" cy="56" r="5.5" stroke="currentColor" strokeWidth="1.5" className="text-red-800" />
            {/* Inner notch detail */}
            <circle cx="40" cy="56" r="4" stroke="currentColor" strokeWidth="1" className="text-red-700" strokeDasharray="1.5 1.5" />
          </g>

          {/* ═══════════════════════════════════════════════════════════
              Wrench 2 — SHORTER (58 units), box-end UP, open-end DOWN, -45° (/)
              Inverted so open-end is at bottom — shorter than Wrench 1
              ═══════════════════════════════════════════════════════════ */}
          <g transform="rotate(-45, 40, 40)">
            {/* ── Handle: tapered with smooth bezier contour ── */}
            <path
              d="M 37.5,9 C 36,18 35.5,28 38,38 L 42,38 C 44.5,28 44,18 42.5,9 Z"
              className="fill-red-800"
            />
            {/* Handle — left edge highlight */}
            <path
              d="M 37.5,9 C 36.2,18 36,28 38.5,38 C 36.5,28 36.8,18 38,9 Z"
              className="fill-red-700"
            />
            {/* Handle — center metallic stripe */}
            <path
              d="M 38.5,9 C 37.5,18 37.5,28 39.5,38 C 38,28 38,18 39,9 Z"
              className="fill-red-600/40"
            />
            {/* Handle — bright spot */}
            <path
              d="M 39,9 C 38.5,18 38.5,28 40,36 C 38.8,28 38.8,18 39.5,9 Z"
              className="fill-red-500/20"
            />

            {/* ── Box-end 12-point ring (top) ── */}
            <circle cx="40" cy="2" r="9" stroke="currentColor" strokeWidth="3" className="text-red-800" />
            <circle cx="40" cy="2" r="9" stroke="currentColor" strokeWidth="0.75" className="text-red-600/30" />
            <circle cx="40" cy="2" r="7.5" stroke="currentColor" strokeWidth="2" className="text-red-800" strokeDasharray="2 2" />
            <polygon
              points="
                40,-5.5 43,-3.2 46.5,-1.75 46,2
                46.5,5.75 43,7.2 40,9.5 37,7.2
                33.5,5.75 34,2 33.5,-1.75 37,-3.2
              "
              className="fill-red-800"
            />
            <circle cx="40" cy="2" r="5.5" stroke="currentColor" strokeWidth="1.5" className="text-red-800" />
            <circle cx="40" cy="2" r="4" stroke="currentColor" strokeWidth="1" className="text-red-700" strokeDasharray="1.5 1.5" />

            {/* ── Open-end jaw (bottom) — inverted ── */}
            {/* Head base */}
            <path
              d="M 33,41 C 33,45 34,48 33,49 L 47,49 C 46,48 47,45 47,41 C 46,43 44,43 36,43 C 34,43 33,41 33,41 Z"
              className="fill-red-800"
            />
            {/* Left fork prong — angled downward */}
            <path
              d="M 36,43 C 35,45 33,49 29,55 L 27,53 C 30,49 32,45 36,43 Z"
              className="fill-red-800"
            />
            {/* Right fork prong */}
            <path
              d="M 44,43 C 45,45 47,49 51,55 L 53,53 C 50,49 48,45 44,43 Z"
              className="fill-red-800"
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
        Mainten<span className="text-red-800">X</span> Tracker
      </p>
      <p className="text-sm sm:text-base text-slate-500 italic">
        — Your Owner's Manual Simplified
      </p>
    </div>
  );
}