import * as React from "react";

/** Gold-ringed badge with a kitenge-print dress on a hanger and the AGB monogram. */
export function BrandLogo({ className = "" }: { className?: string }) {
  const id = React.useId();
  const u = (name: string) => `url(#${id}-${name})`;
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="Amazing Grace Boutique logo" className={className}>
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#2c7a57" />
          <stop offset="100%" stopColor="#0f3b2a" />
        </radialGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff1a8" />
          <stop offset="45%" stopColor="#f2c230" />
          <stop offset="100%" stopColor="#b8780c" />
        </linearGradient>
        <linearGradient id={`${id}-dress`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0543c" />
          <stop offset="100%" stopColor="#b3122f" />
        </linearGradient>
        <pattern id={`${id}-print`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.9" fill="#f6cf3f" opacity="0.75" />
          <circle cx="4.5" cy="4.5" r="0.7" fill="#ffffff" opacity="0.45" />
        </pattern>
      </defs>
      {/* badge */}
      <circle cx="32" cy="32" r="30.5" fill={u("bg")} stroke={u("gold")} strokeWidth="2.5" />
      <circle cx="32" cy="32" r="26.5" fill="none" stroke={u("gold")} strokeWidth="0.6" strokeDasharray="1.2 1.6" />
      {/* hanger */}
      <path d="M32 13.5c0-2 2.8-2 2.8-4S33.4 7 32 7.6" fill="none" stroke={u("gold")} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 13.5 21 18h22z" fill="none" stroke={u("gold")} strokeWidth="1.5" strokeLinejoin="round" />
      {/* dress */}
      <g>
        <path
          id={`${id}-shape`}
          d="M27 18h2q3 3.5 6 0h2c.8 3.5.4 6-.4 8.5 4.5 5.5 8.5 12.5 10.4 21.5q-15 5-30 0c1.9-9 5.9-16 10.4-21.5-.8-2.5-1.2-5-.4-8.5z"
          fill={u("dress")}
        />
        <path
          d="M27 18h2q3 3.5 6 0h2c.8 3.5.4 6-.4 8.5 4.5 5.5 8.5 12.5 10.4 21.5q-15 5-30 0c1.9-9 5.9-16 10.4-21.5-.8-2.5-1.2-5-.4-8.5z"
          fill={u("print")}
        />
        <rect x="26.6" y="25.6" width="10.8" height="2.4" rx="1.2" fill={u("gold")} />
      </g>
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="10.5"
        fill="#fff8e6"
        stroke="#7a0d1f"
        strokeWidth="0.4"
        paintOrder="stroke"
      >
        AGB
      </text>
      {/* sparkles */}
      <path d="M49 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill={u("gold")} />
      <path d="M15 22l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5z" fill={u("gold")} />
    </svg>
  );
}
