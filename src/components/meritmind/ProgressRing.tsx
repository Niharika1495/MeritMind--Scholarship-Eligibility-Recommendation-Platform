export function ProgressRing({
  value,
  size = 96,
  thickness = 9,
  label,
  caption,
}: {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
  caption?: string;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  const gid = `ring-${size}-${Math.round(value)}`;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="60%" stopColor="var(--secondary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-lg font-bold leading-none">
          {label ?? `${Math.round(value)}%`}
        </span>
        {caption ? (
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {caption}
          </span>
        ) : null}
      </div>
    </div>
  );
}
