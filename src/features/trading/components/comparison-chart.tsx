interface Series {
  label: string;
  color: string;
  points: { sequence: number; value: number }[];
}

export function ComparisonChart({ series }: { series: Series[] }) {
  const width = 400;
  const height = 140;
  const padding = 10;

  const allSequences = series.flatMap((s) => s.points.map((p) => p.sequence));
  const allValues = series.flatMap((s) => s.points.map((p) => p.value));
  const minSeq = Math.min(...allSequences);
  const maxSeq = Math.max(...allSequences);
  const seqRange = maxSeq - minSeq || 1;
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const valRange = maxVal - minVal || 1;

  function pathFor(points: { sequence: number; value: number }[]) {
    return points
      .map((p, i) => {
        const x = padding + ((p.sequence - minSeq) / seqRange) * (width - padding * 2);
        const y = height - padding - ((p.value - minVal) / valRange) * (height - padding * 2);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full" role="img" aria-label="Portfolio value comparison over time">
        {series.map((s) => (
          <path key={s.label} d={pathFor(s.points)} fill="none" stroke={s.color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-4">
        {series.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-caption text-foreground-muted">
            <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
