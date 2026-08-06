import { Building2, CalendarClock, Landmark, ShieldCheck, TriangleAlert } from "lucide-react";
import type { Scholarship } from "@/types/scholarship";
import { countdown, deadlineTone } from "@/utils/format";

export function SectorBadge({ sector }: { sector: Scholarship["sector"] }) {
  const gov = sector === "Government";
  const Icon = gov ? Landmark : Building2;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
        gov ? "bg-secondary/15 text-secondary" : "bg-accent-soft text-accent-foreground"
      }`}
    >
      <Icon className="size-3" />
      {sector}
    </span>
  );
}

export function DeadlineBadge({ deadline }: { deadline: string }) {
  const tone = deadlineTone(deadline);
  const cls =
    tone === "urgent"
      ? "bg-destructive/12 text-destructive"
      : tone === "soon"
        ? "bg-accent-soft text-accent-foreground"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${cls}`}>
      <CalendarClock className="size-3.5" />
      {countdown(deadline)}
    </span>
  );
}

export function EligibilityBadge({ status }: { status: "Eligible" | "Partially eligible" | "Not eligible" }) {
  const ok = status === "Eligible";
  const Icon = ok ? ShieldCheck : TriangleAlert;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        ok
          ? "bg-success/15 text-success"
          : status === "Partially eligible"
            ? "bg-accent-soft text-accent-foreground"
            : "bg-muted text-muted-foreground"
      }`}
    >
      <Icon className="size-3.5" />
      {status}
    </span>
  );
}

export function TagPill({ children, tone = "muted" }: { children: string; tone?: "muted" | "primary" }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        tone === "primary" ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}
