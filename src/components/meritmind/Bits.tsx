import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${
        active
          ? "gradient-hero text-primary-foreground"
          : "border border-border bg-card text-muted-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

export function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-3xl p-5">
      <p className="font-display text-2xl font-black text-gradient sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}
