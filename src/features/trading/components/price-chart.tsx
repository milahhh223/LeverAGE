"use client";

import { motion } from "framer-motion";

interface PricePoint {
  t: number;
  price: number;
}

export function PriceChart({ points }: { points: PricePoint[] }) {
  const values = points.map((p) => p.price);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const trendingUp = (values.at(-1) ?? 0) >= (values[0] ?? 0);
  const color = trendingUp ? "var(--positive)" : "var(--negative)";

  const width = 480;
  const height = 200;
  const padding = 12;
  const rightGutter = 56;

  const chartWidth = width - padding - rightGutter;

  const coords = points.map((p, i) => {
    const x = padding + (points.length > 1 ? (i / (points.length - 1)) * chartWidth : chartWidth);
    const y = height - padding - ((p.price - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const last = coords.at(-1);
  const areaPath = last ? `${linePath} L ${last.x} ${height} L ${coords[0]?.x ?? 0} ${height} Z` : "";

  const gridLines = [0, 0.5, 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full" role="img" aria-label="Real price chart, days shown so far">
      <defs>
        <linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {gridLines.map((f) => {
        const y = padding + f * (height - padding * 2);
        const price = max - f * range;
        return (
          <g key={f}>
            <line x1={padding} y1={y} x2={width - rightGutter} y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 4" />
            <text x={width - rightGutter + 8} y={y + 4} fontSize="11" fill="var(--foreground-subtle)" fontFamily="var(--font-mono, monospace)">
              ${price.toFixed(0)}
            </text>
          </g>
        );
      })}

      {areaPath && <path d={areaPath} fill="url(#price-fill)" />}

      {coords.length > 1 && (
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      {last && (
        <g>
          <circle cx={last.x} cy={last.y} r="8" fill={color} opacity="0.25" className="animate-ping" style={{ transformOrigin: `${last.x}px ${last.y}px` }} />
          <circle cx={last.x} cy={last.y} r="4" fill={color} stroke="var(--background)" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}
