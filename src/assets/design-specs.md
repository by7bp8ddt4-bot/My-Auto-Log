# MTXtrkr Design Specifications

## 1. Graph Color Palette
Define a cohesive color scheme for data visualization that complements the dark automotive theme.

| Feature | Gradient Start | Gradient End | Accent/Dot |
| :--- | :--- | :--- | :--- |
| **Mileage Tracking** | `#06b6d4` (Cyan-500) | `#2563eb` (Blue-600) | `#67e8f9` (Cyan-300) |
| **Fuel Economy** | `#10b981` (Emerald-500) | `#0d9488` (Teal-600) | `#6ee7b7` (Emerald-300) |
| **Expenses** | `#8b5cf6` (Purple-500) | `#4f46e5` (Indigo-600) | `#c4b5fd` (Purple-300) |

- **Grid Lines**: `rgba(30, 41, 59, 0.5)` (Slate-800)
- **Tooltip Background**: `rgba(15, 23, 42, 0.9)` (Slate-950)
- **Line Tension**: `0.4` (Smooth curves)

## 2. Dashboard Layout Recommendations
To integrate the new mileage graph and fuel economy widget while maintaining a clean, premium look:

- **Primary Chart**: The Mileage Graph should be placed below the Top Stats and above the AI Co-Pilot, spanning the full width of the container.
- **Sparklines**: Use small "sparkline" versions of the graphs inside the summary cards (Total Mileage, Avg Fuel) for immediate visual context.
- **Widget Placement**:
  - `Fuel Economy Widget`: Place as a 2x2 grid item on mobile or a 1-column card on desktop within a new "Efficiency" row.
  - `Maintenance Schedule`: Keep this compact with a "See More" button to avoid pushing important charts too far down.
- **Z-Index Layering**: Use subtle border glows (`shadow-cyan-500/10`) for the primary chart container to make it "pop" from the background.

## 3. Resale Report Template
Design for a professional PDF export intended for potential buyers.

- **Header**: Large typography with the vehicle's Year/Make/Model and a high-resolution manufacturer badge.
- **Summary Section**: 3 columns:
  1. Total Maintenance Cost
  2. Last Service Date/Mileage
  3. Service "Grade" (e.g., A+ for on-time maintenance)
- **History Table**: Alternating row colors (Light Slate) for maximum readability.
- **Footer**: "Verified by MTXtrkr" watermark with a QR code linking to the live record (if public sharing is enabled).
- **Mockup**: Refer to `src/assets/resale-report-mockup.html` for the high-fidelity layout.

## 4. Email Reminder Template
A clean, actionable HTML email for proactive maintenance.

- **Background**: Slate-950 (`#0f172a`)
- **Card**: Slate-800 (`#1e293b`)
- **Accent**: Dynamic top-border based on manufacturer color.
- **Call to Action**: High-contrast blue button (`#3b82f6`).
