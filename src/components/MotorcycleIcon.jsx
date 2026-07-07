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
      {/* Rear wheel */}
      <circle cx="6" cy="16" r="3.5" />
      {/* Front wheel */}
      <circle cx="18" cy="16" r="3.5" />
      {/* Frame - seat to rear axle */}
      <line x1="6" y1="16" x2="10.5" y2="10" />
      {/* Frame - seat to front */}
      <line x1="10.5" y1="10" x2="16" y2="10" />
      {/* Front fork */}
      <line x1="16" y1="10" x2="18" y2="13" />
      {/* Handlebars */}
      <line x1="15" y1="7.5" x2="18" y2="8.5" />
      {/* Seat */}
      <path d="M9 10.5c1.5 0 2.5-.5 4-.5" />
      {/* Exhaust */}
      <path d="M8 17.5c-.5 1.5 0 2.5 1 3" strokeWidth="1.5" />
    </svg>
  );
}
