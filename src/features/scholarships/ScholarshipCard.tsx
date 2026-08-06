import { Link } from "@tanstack/react-router";
import { Bookmark, ExternalLink, Share2, Sparkles, TrendingUp } from "lucide-react";
import { ProgressRing } from "@/components/meritmind/ProgressRing";
import { useSavedScholarships } from "@/contexts/SavedScholarshipContext";
import { useUI } from "@/contexts/UIContext";
import { DeadlineBadge, EligibilityBadge, SectorBadge, TagPill } from "./Badges";
import type { Scholarship } from "@/types/scholarship";
import { eligibilityFor } from "@/utils/eligibility";
import { inr, ensureAbsoluteUrl } from "@/utils/format";

export function SaveButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const { isSaved, toggle } = useSavedScholarships();
  const saved = isSaved(id);
  return (
    <button
      onClick={() => toggle(id)}
      aria-label={saved ? "Remove from saved" : "Save scholarship"}
      className={`grid shrink-0 place-items-center rounded-full border transition-all active:scale-95 ${
        compact ? "size-9" : "size-10"
      } ${
        saved
          ? "border-primary bg-primary-soft text-primary"
          : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted"
      }`}
    >
      <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}

export function ShareButton({ s, compact = false }: { s: Scholarship; compact?: boolean }) {
  const { openShare } = useUI();
  return (
    <button
      onClick={() => openShare(s)}
      aria-label="Share scholarship"
      className={`grid shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:bg-muted active:scale-95 ${
        compact ? "size-9" : "size-10"
      }`}
    >
      <Share2 className="size-4" />
    </button>
  );
}

export function ScholarshipCard({ s, showReasons = false }: { s: Scholarship; showReasons?: boolean }) {
  const { status } = eligibilityFor(s);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.75rem] p-[1px] transition-transform duration-500 hover:-translate-y-1.5">
      {/* gradient border + neon glow */}
      <div className="absolute inset-0 rounded-[1.75rem] gradient-hero opacity-[0.18] transition-opacity duration-500 group-hover:opacity-60" />
      <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] gradient-hero opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20" />

      <div className="relative flex flex-1 flex-col rounded-[1.7rem] bg-card p-5">
        <div className="pointer-events-none absolute -right-14 -top-14 size-36 rounded-full gradient-hero opacity-[0.07] transition-opacity duration-500 group-hover:opacity-20" />

        <div className="flex items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-muted text-xl transition-transform duration-500 group-hover:scale-110">
            {s.logo}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {s.provider}
            </p>
            <Link
              to="/scholarship/$id"
              params={{ id: s.id }}
              className="font-display text-base font-bold leading-snug transition-colors hover:text-primary"
            >
              {s.name}
            </Link>
          </div>
          <ProgressRing value={s.match} size={54} thickness={6} caption="match" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full gradient-hero px-2.5 py-1 text-[11px] font-black text-primary-foreground">
            {inr(s.amount)} / year
          </span>
          <DeadlineBadge deadline={s.deadline} />
          <SectorBadge sector={s.sector} />
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

        <div className="mt-3 flex flex-wrap gap-1.5">
          <TagPill tone="primary">{s.category}</TagPill>
          <TagPill>{s.state}</TagPill>
          {s.branches.slice(0, 2).map((b) => (
            <TagPill key={b}>{b}</TagPill>
          ))}
          {s.branches.length > 2 ? <TagPill>{`+${s.branches.length - 2}`}</TagPill> : null}
        </div>

        {showReasons ? (
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

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Match Fit</p>
              <p className="text-sm font-black">{s.isEligible === false ? "0%" : `${s.match}%`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-3.5 shrink-0 text-success" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Status
              </p>
              <p className="text-xs font-black truncate">{s.isEligible === false ? "Ineligible" : (s.matchTier || "Eligible")}</p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-5">
          <Link
            to="/scholarship/$id"
            params={{ id: s.id }}
            className="flex-1 rounded-full border border-border px-3 py-2.5 text-center text-sm font-bold transition-colors hover:bg-muted"
          >
            Details
          </Link>
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
