/**
 * Lightweight blueprint background component.
 * Uses the designer-crafted blueprint-bg.png as a CSS background image.
 * Used by LandingPage (full opacity) and Layout (Dashboard only, reduced opacity).
 */

import blueprintBg from '/assets/blueprint-bg.png';

export default function MechanicalBackground({ isAppPage = false }) {
  const opacity = isAppPage ? 'opacity-[0.10]' : 'opacity-[0.18]';

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat ${opacity}`}
      style={{ backgroundImage: `url(${blueprintBg})` }}
      aria-hidden="true"
    />
  );
}