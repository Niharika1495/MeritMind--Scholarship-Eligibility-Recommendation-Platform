import { Link } from "@tanstack/react-router";
import { Check, ExternalLink, Minus, TrendingUp } from "lucide-react";
import { ProgressRing } from "@/components/meritmind/ProgressRing";
import { DeadlineBadge, SectorBadge } from "@/features/scholarships/Badges";
import { SaveButton, ShareButton } from "@/features/scholarships/ScholarshipCard";
import type { Recommendation } from "@/types/scholarship";
import { inr, ensureAbsoluteUrl } from "@/utils/format";

export function RecommendationCard({ rec }: { rec: Recommendation }) {
  const s = rec.scholarship;

  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] p-[1px] transition-transform duration-500 hover:-translate-y-1.5">
      <div className="absolute inset-0 rounded-[1.75rem] gradient-hero opacity-20 transition-opacity duration-500 group-hover:opacity-60" />
      <div className="relative flex h-full flex-col rounded-[1.7rem] bg-card p-5">
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
          <ProgressRing value={s.match} size={56} thickness={6} caption="match" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full gradient-hero px-2.5 py-1 text-[11px] font-black text-primary-foreground">
            {inr(s.amount)} / year
          </span>
          <DeadlineBadge deadline={s.deadline} />
          <SectorBadge sector={s.sector} />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-bold text-success">
            <TrendingUp className="size-3.5" /> {s.successProbability}% odds
          </span>
        </div>

        <div className="mt-4 rounded-2xl bg-muted/60 p-3.5">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
            Why this matches you
          </p>
          <ul className="mt-2 space-y-1.5">
            {rec.checks.map((c) => (
              <li
                key={c.label}
                className={`flex gap-2 text-xs font-medium leading-relaxed ${
                  c.passed ? "" : "text-muted-foreground line-through decoration-border"
                }`}
              >
                {c.passed ? (
                  <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                ) : (
                  <Minus className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                )}
                {c.label}
              </li>
            ))}
          </ul>
        </div>

        {rec.missing.length ? (
          <div className="mt-3 rounded-2xl border border-accent/30 bg-accent-soft/50 p-3.5">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-accent-foreground">
              To strengthen this application
            </p>
            <ul className="mt-2 space-y-1.5">
              {rec.missing.map((m) => (
                <li key={m} className="flex gap-2 text-xs font-semibold leading-relaxed text-accent-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-5">
          <a
            href={ensureAbsoluteUrl(s.officialApplyUrl || s.official)}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full gradient-hero px-3 py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            Apply now <ExternalLink className="size-3.5" />
          </a>
          <SaveButton id={s.id} compact />
          <ShareButton s={s} compact />
        </div>
      </div>
    </article>
  );
}
