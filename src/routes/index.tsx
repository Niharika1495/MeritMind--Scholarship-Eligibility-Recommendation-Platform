import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BellRing,
  Compass,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JourneyTimeline } from "@/components/meritmind/JourneyTimeline";
import { StatBlock } from "@/components/meritmind/Bits";
import { faqs, journey, stats, stories, inr, daysLeft } from "@/data/mock";
import { scholarshipService, emptyFilters } from "@/services/scholarshipService";
import heroArt from "@/assets/journey-hero.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MeritMind — Your personal scholarship coach" },
      {
        name: "description",
        content:
          "MeritMind discovers scholarships from official sources and coaches you toward the ones you can actually win, with match scores and deadline reminders.",
      },
      { property: "og:title", content: "MeritMind — Your personal scholarship coach" },
      {
        property: "og:description",
        content:
          "Not a scholarship directory. A guided journey from profile to award, with personalised matches and deadline coaching.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Compass,
    title: "Discovery that never sleeps",
    body: "Listings collected from 260+ official government, state and CSR portals — deduplicated and verified.",
  },
  {
    icon: Target,
    title: "Match score, not a search box",
    body: "Eligibility, income, branch, CGPA and time-to-deadline blend into a single honest fit percentage.",
  },
  {
    icon: BellRing,
    title: "A coach that nudges you",
    body: "Reminders at 14, 7 and 2 days, plus a final morning-of alert so nothing quietly closes.",
  },
  {
    icon: ShieldCheck,
    title: "Straight to the official page",
    body: "Every apply button opens the provider's own portal. No middlemen, no application fees.",
  },
];

function Landing() {
  const { user, isProfileSetupCompleted } = useAuth();
  const destination = user 
    ? (isProfileSetupCompleted ? "/dashboard" : "/profile-setup") 
    : "/auth";

  const [spotlight, setSpotlight] = useState<any[]>([]);

  useEffect(() => {
    scholarshipService
      .query({ filters: emptyFilters, sort: "deadline", page: 1, pageSize: 3 })
      .then((res) => setSpotlight(res.items))
      .catch((err) => console.error("Failed to fetch landing spotlight", err));
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] aurora" />

      <header className="relative z-30 mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
        <span className="grid size-9 place-items-center rounded-full gradient-hero text-sm font-black text-primary-foreground">
          M
        </span>
        <span className="font-display text-lg font-bold">MeritMind</span>
        <nav className="ml-auto hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex">
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#stories" className="hover:text-foreground">Stories</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <Link
          to={destination}
          className="ml-auto rounded-full gradient-hero px-4 py-2.5 text-sm font-bold text-primary-foreground md:ml-6"
        >
          Start my journey
        </Link>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-8 pt-6 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-12">
        <div>
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold">
            <Sparkles className="size-3.5 text-accent" />
            12,480 scholarships watched today
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            You are three steps away from a <span className="text-gradient">fully funded</span> degree.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            MeritMind is not a list of links. Tell it who you are once, and it becomes a coach that
            finds, ranks and reminds you about the scholarships you can genuinely win.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={destination}
              className="inline-flex items-center gap-2 rounded-full gradient-hero px-6 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Build my profile <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/explore"
              className="rounded-full border border-border bg-card px-6 py-3.5 text-sm font-bold transition-colors hover:bg-muted"
            >
              Browse scholarships
            </Link>
          </div>
          <p className="mt-4 text-xs font-semibold text-muted-foreground">
            Free for students · No application fees · Official sources only
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2.5rem] border border-border shadow-[var(--shadow-lift)]">
            <img
              src={heroArt}
              alt="A student climbing a glowing staircase of scholarship documents toward a medal"
              width={1280}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="glass absolute -bottom-6 left-4 right-4 rounded-2xl p-4 sm:left-8 sm:right-8">
            <p className="text-[11px] font-black uppercase tracking-widest text-primary">
              Closing soonest
            </p>
            <div className="mt-2 space-y-2">
              {spotlight.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-xs font-semibold">
                  <span>{s.logo}</span>
                  <span className="min-w-0 flex-1 truncate">{s.name}</span>
                  <span className="shrink-0 text-primary">{inr(s.amount)}</span>
                  <span className="shrink-0 text-muted-foreground">{daysLeft(s.deadline)}d</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:px-6 lg:grid-cols-4">
        {stats.map((s) => (
          <StatBlock key={s.label} {...s} />
        ))}
      </section>

      <section id="how" className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">
          The journey
        </p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
          Six steps, in the order that actually wins money.
        </h2>
        <div className="surface mt-8 rounded-[2rem] p-6 sm:p-8">
          <JourneyTimeline steps={journey} />
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="surface lift rounded-3xl p-6">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="stories" className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">
          Students who got funded
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Real journeys, real disbursements.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {stories.map((t) => (
            <figure key={t.name} className="glass flex flex-col rounded-3xl p-6">
              <span className="text-3xl">{t.avatar}</span>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-5">
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs font-semibold text-primary">{t.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto mt-24 max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Questions, answered</h2>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-b border-border">
              <AccordionTrigger className="text-left font-display text-base font-bold">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-hero p-8 text-center sm:p-14">
          <h2 className="font-display text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            Your next scholarship is already open.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
            Spend four minutes on your profile. MeritMind spends the rest of the year watching every
            official portal for you.
          </p>
          <Link
            to={destination}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-card px-6 py-3.5 text-sm font-bold text-foreground"
          >
            Start my journey <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="mx-auto mt-20 max-w-6xl px-4 pb-14 sm:px-6">
        <div className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full gradient-hero text-xs font-black text-primary-foreground">
              M
            </span>
            <span className="font-display font-bold">MeritMind</span>
          </div>
          <p className="text-xs text-muted-foreground sm:ml-auto">
            Scholarship data sourced from official portals. Always verify on the provider's site.
          </p>
        </div>
      </footer>
    </div>
  );
}
