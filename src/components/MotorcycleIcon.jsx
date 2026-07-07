import React from 'react';

export default function MotorcycleIcon({ className = 'w-5 h-5', ...props }) {
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
      {/* Wheels (radius 3.5, centered at y=16) */}
      <circle cx="6" cy="16" r="3.5" />
      <circle cx="18" cy="16" r="3.5" />
      
      {/* Swingarm & Engine Cradle */}
      <path d="M6 16h6.5l1.5-3.5h-5.5" />
      
      {/* Seat and Tank Line */}
      <path d="M7 11.5c2.5 0 3.5-1.5 6.5-1.5h2.5" />
      
      {/* Handlebars */}
      <line x1="14.5" y1="7" x2="17.5" y2="8.5" />
      
      {/* Front Fork - connects triple clamp directly to axle */}
      <line x1="16" y1="10" x2="18" y2="16" />
      
      {/* Exhaust (standard stroke-width inheriting from parent container) */}
      <path d="M9 16.5h6l1.5-1" />
    </svg>
  );
}
