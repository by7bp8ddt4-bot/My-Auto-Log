import React from 'react';

export default function SemiTruckIcon({ className = 'w-5 h-5', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Trailer cargo box */}
      <rect x="2" y="5" width="8" height="12" rx="1" />
      
      {/* Tractor / Cab unit */}
      <path d="M13 17V9h3.5l2.5 3h3v5H13" />
      
      {/* Cab Side Window */}
      <path d="M14.5 11h2l1 1.5h-3Z" />
      
      {/* Connecting Hitch/Fifth Wheel Coupling */}
      <path d="M10 15h3" />
      <path d="M11 16h2" />
      
      {/* Classic Vertical Exhaust Stack */}
      <path d="M13.5 9V4" />
      
      {/* Front Bumper Detail */}
      <path d="M22 16h1" />

      {/* Wheels (radius 2, centered at cy=19) */}
      {/* Trailer Dual Axle */}
      <circle cx="4" cy="19" r="2" />
      <circle cx="8" cy="19" r="2" />
      
      {/* Tractor Drive Axles */}
      <circle cx="15" cy="19" r="2" />
      <circle cx="20" cy="19" r="2" />
    </svg>
  );
}
