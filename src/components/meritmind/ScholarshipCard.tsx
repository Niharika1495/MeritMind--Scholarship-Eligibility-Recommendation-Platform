import { Link } from "@tanstack/react-router";
import { Bookmark, CalendarClock, ExternalLink } from "lucide-react";
import { useState } from "react";
import { daysLeft, inr } from "@/data/mock";
import type { Scholarship } from "@/types/scholarship";
import { ensureAbsoluteUrl } from "@/utils/format";
import { ProgressRing } from "./ProgressRing";

export function DeadlinePill({ deadline }: { deadline: string }) {
  const d = daysLeft(deadline);
  const urgent = d <= 7;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        urgent
          ? "bg-accent/15 text-accent-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <CalendarClock className="size-3.5" />
      {d} days left
    </span>
  );
}

export function ScholarshipCard({
  s,
  reason,
  initiallySaved = false,
}: {
  s: Scholarship;
  reason?: boolean;
  initiallySaved?: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);

  return (
    <article className="surface lift group relative flex flex-col overflow-hidden rounded-3xl p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full gradient-hero opacity-[0.08] transition-opacity group-hover:opacity-20" />

      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-muted text-xl">
          {s.logo}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            {s.provider}
          </p>
          <Link
            to="/scholarship/$id"
            params={{ id: s.id }}
            className="font-display text-base font-bold leading-snug hover:text-primary"
          >
            {s.name}
          </Link>
        </div>
        <ProgressRing value={s.match} size={54} thickness={6} caption="fit" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
          {inr(s.amount)} / year
        </span>
        <DeadlinePill deadline={s.deadline} />
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
          {s.category}
        </span>
        {s.isEligible === false ? (
          <span className="rounded-full bg-destructive/15 px-2.5 py-1 text-[11px] font-bold text-destructive">
            Not Eligible: {s.ineligibleReason || "Ineligible"}
          </span>
        ) : (
          <span className="rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-bold text-success">
            Eligible ({s.match}% Match)
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>

      {reason ? (
        <ul className="mt-4 space-y-1.5 rounded-2xl bg-muted/60 p-3">
          {s.reasons.slice(0, 3).map((r) => (
            <li key={r} className="flex gap-2 text-xs font-medium leading-relaxed">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full gradient-hero" />
              {r}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs font-medium text-muted-foreground">
          Eligibility · {s.minCgpa}+ CGPA · income under {inr(s.maxIncome)} · {s.state}
        </p>
      )}

      <div className="mt-5 flex items-center gap-2">
        <Link
          to="/scholarship/$id"
          params={{ id: s.id }}
          className="flex-1 rounded-full gradient-hero px-4 py-2.5 text-center text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          View & apply
        </Link>
        <button
          onClick={() => setSaved((v) => !v)}
          aria-label={saved ? "Remove bookmark" : "Save scholarship"}
          className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors ${
            saved ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} />
        </button>
        <a
          href={ensureAbsoluteUrl(s.officialApplyUrl || s.official)}
          target="_blank"
          rel="noreferrer"
          aria-label="Official site"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted"
        >
          <ExternalLink className="size-4" />
        </a>
      </div>
    </article>
  );
}
