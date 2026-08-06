import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Plus, Sparkles, Upload } from "lucide-react";
import { AppShell } from "@/components/meritmind/AppShell";
import { JourneyTimeline } from "@/components/meritmind/JourneyTimeline";
import { ProgressRing } from "@/components/meritmind/ProgressRing";
import { ScholarshipCard, DeadlinePill } from "@/components/meritmind/ScholarshipCard";
import { SectionHeading } from "@/components/meritmind/Bits";
import { daysLeft, inr, journey, student } from "@/data/mock";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, Lock, Loader2 } from "lucide-react";
import { scholarshipService, emptyFilters } from "@/services/scholarshipService";
import { recommendationService } from "@/services/recommendationService";
import { useState, useEffect } from "react";
import { apiRequest } from "@/services/apiClient";
import type { Scholarship } from "@/types/scholarship";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Today's opportunities — MeritMind" },
      {
        name: "description",
        content:
          "A personalised daily briefing: top scholarship picks, closing deadlines, newly added listings and your journey progress.",
      },
      { property: "og:title", content: "Today's opportunities — MeritMind" },
      {
        property: "og:description",
        content: "Your personalised scholarship briefing, refreshed every morning.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  { label: "Add skills", to: "/profile", icon: Plus },
  { label: "Upload docs", to: "/settings", icon: Upload },
  { label: "See matches", to: "/recommendations", icon: Sparkles },
];

function Dashboard() {
  const { isProfileSetupCompleted } = useAuth();
  const [picks, setPicks] = useState<Scholarship[]>([]);
  const [soon, setSoon] = useState<Scholarship[]>([]);
  const [fresh, setFresh] = useState<Scholarship[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const soonRes = await scholarshipService.query({
          filters: emptyFilters,
          sort: "deadline",
          page: 1,
          pageSize: 4,
        });
        setSoon(soonRes.items);

        const freshRes = await scholarshipService.query({
          filters: emptyFilters,
          sort: "newest",
          page: 1,
          pageSize: 4,
        });
        setFresh(freshRes.items);

        if (isProfileSetupCompleted) {
          const buckets = await recommendationService.buckets();
          const topBucket = buckets.find((b) => b.id === "top");
          if (topBucket) {
            setPicks(topBucket.items.map((r) => r.scholarship));
          }
          const appList = await apiRequest<any[]>("GET", "/applications");
          setApps(appList);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [isProfileSetupCompleted]);

  const hero = picks.length > 0 ? picks[0] : null;

  return (
    <AppShell>
      {!isProfileSetupCompleted && (
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-accent-soft border border-accent/20 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-accent-foreground text-sm">Your profile is incomplete</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Complete your profile to unlock personalized scholarship recommendations and compatibility match scores.</p>
            </div>
          </div>
          <Link
            to="/profile-setup"
            className="rounded-full bg-accent text-accent-foreground font-bold px-5 py-2.5 text-xs text-center transition-transform hover:-translate-y-0.5"
          >
            Complete Profile
          </Link>
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full gradient-hero opacity-10" />
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">
            Good morning, {student.name.split(" ")[0]}
          </p>
          {isProfileSetupCompleted && hero ? (
            <>
              <h1 className="mt-2 max-w-lg font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                One scholarship worth {inr(hero.amount)} is a {hero.match}% fit for you today.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                {hero.summary}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/scholarship/$id"
                  params={{ id: hero.id }}
                  className="inline-flex items-center gap-2 rounded-full gradient-hero px-5 py-3 text-sm font-bold text-primary-foreground"
                >
                  Open today's pick <ArrowRight className="size-4" />
                </Link>
                <DeadlinePill deadline={hero.deadline} />
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-2 max-w-lg font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                Unlock your daily scholarship matches.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                We are tracking 12,000+ scholarships. Complete your 5-step academic profile to calculate your compatibility fit and see personalized picks.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/profile-setup"
                  className="inline-flex items-center gap-2 rounded-full gradient-hero px-5 py-3 text-sm font-bold text-primary-foreground"
                >
                  Complete profile now <ArrowRight className="size-4" />
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="surface flex items-center gap-5 rounded-[2rem] p-6">
          <ProgressRing value={student.strength} size={112} caption="strength" />
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold">Continue your profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Two sections left. Finishing them unlocks 6 research scholarships.
            </p>
            <Link
              to="/profile"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary"
            >
              Complete now <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-4 flex flex-wrap gap-2">
        {quickActions.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
          >
            <a.icon className="size-4 text-primary" />
            {a.label}
          </Link>
        ))}
      </section>

      <section className="mt-12">
        <SectionHeading
          eyebrow="Top picks"
          title="Chosen for your profile"
          action={
            <Link to="/recommendations" className="text-sm font-bold text-primary">
              See all
            </Link>
          }
        />
        {isProfileSetupCompleted ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {picks.map((s) => (
              <ScholarshipCard key={s.id} s={s} reason />
            ))}
          </div>
        ) : (
          <div className="relative rounded-[2rem] overflow-hidden border border-dashed border-border bg-card/20 p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[3px] z-10" />
            <div className="relative z-20 max-w-sm flex flex-col items-center">
              <Lock className="size-8 text-muted-foreground mb-2" />
              <h4 className="font-display font-bold text-base">Recommendations Locked</h4>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Complete your profile to unlock personalized scholarship recommendations matching your background.</p>
              <Link to="/profile-setup" className="rounded-full bg-primary text-primary-foreground font-bold px-4 py-2.5 text-xs">
                Complete Setup
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="mt-12 grid gap-4 lg:grid-cols-2">
        <div className="surface rounded-[2rem] p-6">
          <SectionHeading eyebrow="Deadline coach" title="Closing soon" />
          <ul className="space-y-3">
            {soon.map((s) => {
              const d = daysLeft(s.deadline);
              return (
                <li key={s.id} className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-muted text-base">
                    {s.logo}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/scholarship/$id"
                      params={{ id: s.id }}
                      className="block truncate text-sm font-bold hover:text-primary"
                    >
                      {s.name}
                    </Link>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full gradient-hero"
                        style={{ width: `${Math.max(6, 100 - d * 1.6)}%` }}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-accent-foreground">
                    <CalendarClock className="mr-1 inline size-3.5" />
                    {d}d
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="surface rounded-[2rem] p-6">
          <SectionHeading eyebrow="Fresh from official portals" title="Recently added" />
          <ul className="space-y-3">
            {fresh.map((s) => (
              <li key={s.id} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-muted text-base">
                  {s.logo}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/scholarship/$id"
                    params={{ id: s.id }}
                    className="block truncate text-sm font-bold hover:text-primary"
                  >
                    {s.name}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.provider} · {s.state}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
                  {s.match}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading eyebrow="Your journey" title="Where you are right now" />
        <div className="surface rounded-[2rem] p-6 sm:p-8">
          <JourneyTimeline steps={journey} />
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading eyebrow="Application tracker" title="What's in motion" />
        {apps.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {apps.map((a) => (
              <Link
                key={a.id}
                to="/scholarship/$id"
                params={{ id: a.scholarship.id }}
                className="surface lift rounded-3xl p-5"
              >
                <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
                  {a.status}
                </span>
                <p className="mt-3 font-display text-sm font-bold leading-snug">{a.scholarship.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">Applied {a.appliedAt}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="surface rounded-3xl p-6 text-center border border-dashed border-border bg-card/20">
            <p className="text-sm text-muted-foreground">No applications in tracking. Find matching scholarships and start applying.</p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
