import React from 'react';

export default function ATVIcon({ className = 'w-5 h-5', ...props }) {
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
      {/* 4 wheels */}
      <circle cx="5" cy="17" r="3" />
      <circle cx="19" cy="17" r="3" />
      <circle cx="5" cy="6" r="2.5" />
      <circle cx="19" cy="6" r="2.5" />

      {/* Chassis frame connecting wheels */}
      <line x1="5" y1="6" x2="5" y2="17" />
      <line x1="19" y1="6" x2="19" y2="17" />
      <line x1="5" y1="6" x2="19" y2="6" />
      <line x1="5" y1="17" x2="19" y2="17" />

      {/* Body / seat area */}
      <path d="M7.5 8.5h9l1.5 2H6z" />

      {/* Handlebars */}
      <line x1="15" y1="4" x2="18" y2="5" />
      <line x1="15" y1="4" x2="12" y2="5" />

      {/* Exhaust */}
      <path d="M16 14h2" />
    </svg>
  );
}