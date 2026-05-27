import React from 'react';

export default function ComparisonIllustration2({
  leftLabel = 'MASTER',
  rightLabel = 'IITTNIF',
  leftValue = '+70.000 ms',
  rightValue = '-70.000 ms',
}: {
  leftLabel?: string;
  rightLabel?: string;
  leftValue?: string;
  rightValue?: string;
}) {
  return (
    <div className="comparison-illustration-2 w-[360px] p-2">
      <svg viewBox="0 0 360 360" width="320" height="320" className="mx-auto">
        <defs>
          <linearGradient id="gA" x1="0" x2="1">
            <stop offset="0%" stopColor="#00e6ff" />
            <stop offset="100%" stopColor="#00a6ff" />
          </linearGradient>
        </defs>

        {/* left clock */}
        <g transform="translate(40,40)">
          <circle cx="0" cy="0" r="48" fill="#041d22" stroke="url(#gA)" strokeWidth="2" />
          <line x1="0" y1="0" x2="0" y2="-34" stroke="#9ff6ff" strokeWidth="3" strokeLinecap="round" />
          <line x1="0" y1="0" x2="22" y2="6" stroke="#9ff6ff" strokeWidth="2.5" strokeLinecap="round" />
          <text x="-2" y="64" fill="#9ff6ff" fontFamily="monospace" fontSize="12" textAnchor="middle">{leftLabel}</text>
          <text x="-2" y="80" fill="#bffcff" fontFamily="monospace" fontSize="13" fontWeight="700" textAnchor="middle">{leftValue}</text>
        </g>

        {/* right clock */}
        <g transform="translate(320,40)">
          <circle cx="0" cy="0" r="48" fill="#041d22" stroke="url(#gA)" strokeWidth="2" />
          <line x1="0" y1="0" x2="0" y2="-34" stroke="#9ff6ff" strokeWidth="3" strokeLinecap="round" transform="rotate(12)" />
          <line x1="0" y1="0" x2="22" y2="6" stroke="#9ff6ff" strokeWidth="2.5" strokeLinecap="round" transform="rotate(12)" />
          <text x="0" y="64" fill="#9ff6ff" fontFamily="monospace" fontSize="12" textAnchor="middle">{rightLabel}</text>
          <text x="0" y="80" fill="#bffcff" fontFamily="monospace" fontSize="13" fontWeight="700" textAnchor="middle">{rightValue}</text>
        </g>

        {/* professional silhouette between clocks */}
        <g transform="translate(180,120)">
          <ellipse cx="0" cy="80" rx="50" ry="18" fill="#02161a" opacity="0.7" />
          <circle cx="0" cy="0" r="20" fill="#07262a" stroke="#07e8ff" strokeOpacity="0.12" />
          <rect x="-28" y="18" width="56" height="68" rx="10" fill="#05262a" stroke="#06e6ff" strokeOpacity="0.08" />
          <polygon points="0,30 -8,54 8,54" fill="#00cfff" opacity="0.95" />
        </g>

        {/* connecting arrows */}
        <g stroke="#00e6ff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9">
          <path d="M92 150 C 130 140, 200 140, 268 150" fill="none" />
          <polygon points="268,150 260,146 262,154" fill="#00e6ff" />
        </g>

        {/* caption */}
        <text x="180" y="220" textAnchor="middle" fill="#7ef0ff" fontFamily="monospace" fontSize="13">Master vs Office — Visual Comparison</text>
      </svg>
    </div>
  );
}
