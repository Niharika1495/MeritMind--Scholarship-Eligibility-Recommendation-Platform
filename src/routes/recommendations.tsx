import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/meritmind/AppShell";
import { SectionHeading } from "@/components/meritmind/Bits";
import { ProgressRing } from "@/components/meritmind/ProgressRing";
import { RecommendationProvider, useRecommendations } from "@/contexts/RecommendationContext";
import { RecommendationCard } from "@/features/recommendations/RecommendationCard";
import { ScholarshipGridSkeleton } from "@/features/scholarships/ScholarshipSkeleton";
import { EmptyState, ErrorState } from "@/features/scholarships/StateViews";
import { student } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Recommended for you — MeritMind" },
      {
        name: "description",
        content:
          "A personal advisor view: top matches, expiring awards and the exact profile gaps to close, with a plain-language reason for every recommendation.",
      },
      { property: "og:title", content: "Recommended for you — MeritMind" },
      {
        property: "og:description",
        content: "Why each scholarship matches you, and what to fix to unlock the rest.",
      },
    ],
  }),
  component: () => (
    <RecommendationProvider>
      <Recommendations />
    </RecommendationProvider>
  ),
});

function Recommendations() {
  const { isProfileSetupCompleted } = useAuth();
  const { buckets, loading, error, retry } = useRecommendations();
  const top = buckets.find((b) => b.id === "top");
  const avg = top?.items.length
    ? Math.round(top.items.reduce((a, r) => a + r.scholarship.match, 0) / top.items.length)
    : 0;

  return (
    <AppShell wide>
      <section className="surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full gradient-hero opacity-10" />
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" /> Your personal advisor
            </span>
            <h1 className="mt-4 max-w-lg font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              Here's your funding plan, {student.name.split(" ")[0]}.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Grouped by urgency and fit. Each card shows the checks you already pass and the exact
              gaps left to close.
            </p>
            <Link to="/profile" className="mt-4 inline-block text-sm font-bold text-primary">
              Improve profile to unlock more →
            </Link>
          </div>
          <ProgressRing value={avg} size={128} caption="avg fit" />
        </div>
      </section>

      {!isProfileSetupCompleted ? (
        <div className="mt-12 relative rounded-[2.5rem] overflow-hidden border border-dashed border-border bg-card/30 p-12 text-center min-h-[320px] flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[3px] z-10" />
          <div className="relative z-20 max-w-md flex flex-col items-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary mb-4 shadow-sm">
              <Lock className="size-6" />
            </div>
            <h2 className="font-display text-lg font-bold">Personal Advisor Locked</h2>
            <p className="text-xs text-muted-foreground mt-2 mb-6 leading-relaxed">
              Complete your profile setup to calculate match scores and find the best scholarships matching your education level, state, and category.
            </p>
            <Link 
              to="/profile-setup" 
              className="rounded-full gradient-hero font-bold px-6 py-3.5 text-xs text-primary-foreground shadow transition-transform hover:-translate-y-0.5"
            >
              Complete Profile Setup
            </Link>
          </div>
        </div>
      ) : error ? (
        <div className="mt-10">
          <ErrorState message={error} onRetry={retry} />
        </div>
      ) : loading ? (
        <div className="mt-10">
          <SectionHeading eyebrow="Analysing your profile" title="Building recommendations" />
          <ScholarshipGridSkeleton count={3} />
        </div>
      ) : (
        buckets.map((b) => (
          <section key={b.id} className="mt-12">
            <SectionHeading eyebrow={b.caption} title={b.title} />
            {b.items.length ? (
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {b.items.map((rec) => (
                  <RecommendationCard key={rec.scholarship.id} rec={rec} />
                ))}
              </div>
            ) : (
              <EmptyState
                emoji="✨"
                title={`Nothing in ${b.title.toLowerCase()} right now`}
                body="We'll surface awards here as soon as new listings or deadlines qualify."
              />
            )}
          </section>
        ))
      )}
    </AppShell>
  );
}
