import React from 'react';

export default function ComparisonIllustration({
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
    <div className="comparison-illustration w-[360px] p-4">
      <svg viewBox="0 0 360 360" width="320" height="320" className="mx-auto">
        {/* simple professional figure */}
        <g fill="none" stroke="url(#g)" strokeWidth="2">
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0%" stopColor="#00e0ff" />
              <stop offset="100%" stopColor="#00aaff" />
            </linearGradient>
          </defs>
        </g>

        {/* head */}
        <circle cx="180" cy="70" r="26" fill="#082125" stroke="#06f0ff" strokeOpacity="0.18" />
        {/* torso */}
        <rect x="150" y="96" width="60" height="80" rx="8" fill="#06242a" stroke="#06f0ff" strokeOpacity="0.12" />
        {/* tie */}
        <polygon points="180,110 170,140 190,140" fill="#00d1ff" opacity="0.9" />

        {/* left arm */}
        <line x1="150" y1="120" x2="70" y2="180" stroke="#06f0ff" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.85" />
        {/* right arm */}
        <line x1="210" y1="120" x2="290" y2="180" stroke="#06f0ff" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.85" />

        {/* left hand marker */}
        <circle cx="68" cy="180" r="8" fill="#00f0ff" />
        <text x="40" y="170" className="text-label" fill="#9ff6ff" fontFamily="monospace" fontSize="11">{leftLabel}</text>
        <text x="20" y="188" fill="#bafcff" fontFamily="monospace" fontSize="13" fontWeight="700">{leftValue}</text>

        {/* right hand marker */}
        <circle cx="292" cy="180" r="8" fill="#00f0ff" />
        <text x="260" y="170" className="text-label" fill="#9ff6ff" fontFamily="monospace" fontSize="11">{rightLabel}</text>
        <text x="248" y="188" fill="#bafcff" fontFamily="monospace" fontSize="13" fontWeight="700">{rightValue}</text>

        {/* comparison banner */}
        <rect x="40" y="210" width="280" height="60" rx="12" fill="#04282c" stroke="#06f0ff" strokeOpacity="0.12" />
        <text x="180" y="240" textAnchor="middle" fill="#7ef0ff" fontFamily="monospace" fontSize="13">Comparison</text>
        <text x="180" y="260" textAnchor="middle" fill="#bffcff" fontFamily="monospace" fontSize="12">Master vs Office — Delay & Drift</text>
      </svg>
    </div>
  );
}
