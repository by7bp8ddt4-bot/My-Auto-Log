import React from 'react';

export default function RVIcon({ className = 'w-5 h-5', ...props }) {
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
      {/* Main Motorhome Body Outline (Class C Cab-Over silhouette) */}
      <path d="M2 17V6h15v3h-3l3 3h4v5H2" />
      
      {/* Living Area Windows */}
      <rect x="4" y="8" width="4" height="3" rx="0.5" />
      <rect x="9.5" y="8" width="3" height="3" rx="0.5" />
      
      {/* Driver Window */}
      <path d="M15 12h2.5l-1 1.5H15Z" />
      
      {/* Roof-Mounted Air Conditioning Unit */}
      <path d="M6 6V5h5v1" />
      
      {/* Rear Mounted Ladder */}
      <path d="M3 7v8" />
      <path d="M2.5 9h1" />
      <path d="M2.5 11h1" />
      <path d="M2.5 13h1" />

      {/* Wheels (radius 2, centered at cy=19) */}
      <circle cx="6" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
    </svg>
  );
}
