import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, ExternalLink, FileText } from "lucide-react";
import { AppShell } from "@/components/meritmind/AppShell";
import { ProgressRing } from "@/components/meritmind/ProgressRing";
import { ScholarshipCard, DeadlinePill } from "@/components/meritmind/ScholarshipCard";
import { SectionHeading } from "@/components/meritmind/Bits";
import { inr, ensureAbsoluteUrl } from "@/utils/format";
import { scholarshipService } from "@/services/scholarshipService";
import type { Scholarship } from "@/types/scholarship";
import { useState, useEffect } from "react";
import { apiRequest } from "@/services/apiClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


export const Route = createFileRoute("/scholarship/$id")({
  loader: async ({ params }) => {
    const s = await scholarshipService.byId(params.id);
    if (!s) throw notFound();
    const related = await scholarshipService.related(params.id);
    return { s, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Scholarship not found — MeritMind" }, { name: "robots", content: "noindex" }],
      };
    }
    const { s } = loaderData;
    const title = `${s.name} — ${inr(s.amount)} · MeritMind`;
    return {
      meta: [
        { title },
        { name: "description", content: s.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: s.summary },
      ],
    };
  },
  component: Detail,
});

function Detail() {
  const { s, related } = Route.useLoaderData() as { s: Scholarship; related: Scholarship[] };
  const [apps, setApps] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchApps = () => {
    apiRequest<any[]>("GET", "/applications")
      .then(setApps)
      .catch(console.error);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const activeApp = apps.find((a) => a.scholarshipId === s.id);
  const hasApplied = !!activeApp;

  const handleTrackApplication = async () => {
    setSubmitting(true);
    try {
      await apiRequest("POST", "/applications", { scholarshipId: s.id });
      toast.success("Added to your application tracker!");
      fetchApps();
    } catch (err: any) {
      toast.error(err.message || "Failed to add application");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelApplication = async () => {
    if (!activeApp) return;
    setSubmitting(true);
    try {
      await apiRequest("DELETE", `/applications/${activeApp.id}`);
      toast.success("Removed from your application tracker.");
      fetchApps();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <Link
        to="/explore"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to explorer
      </Link>

      <section className="relative mt-5 overflow-hidden rounded-[2rem] gradient-hero p-6 sm:p-10">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-card text-xl">
                {s.logo}
              </span>
              <p className="min-w-0 truncate text-sm font-bold text-primary-foreground/85">
                {s.provider}
              </p>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-primary-foreground sm:text-4xl">
              {s.name}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/85">
              {s.summary}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-card px-4 py-2 text-sm font-black">
                {inr(s.amount)} / year
              </span>
              <span className="rounded-full bg-card/20 px-4 py-2 text-sm font-bold text-primary-foreground">
                {s.category}
              </span>
              <span className="rounded-full bg-card/20 px-4 py-2 text-sm font-bold text-primary-foreground">
                {s.state}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-card p-5">
            <ProgressRing value={s.match} size={104} caption="match" />
            <div className="min-w-0">
              <p className="text-sm font-bold">Your fit</p>
              <p className="mt-1 max-w-[13rem] text-xs text-muted-foreground">
                Based on CGPA, income bracket, branch and time left.
              </p>
              <div className="mt-3">
                <DeadlinePill deadline={s.deadline} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-4">
          {/* ELIGIBILITY STATUS BANNER */}
          <div className={`surface rounded-[2rem] p-6 border ${s.isEligible === false ? 'border-destructive/40 bg-destructive/5' : 'border-success/40 bg-success/5'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Your Eligibility Status</p>
                <h3 className={`text-xl font-black mt-1 ${s.isEligible === false ? 'text-destructive' : 'text-success'}`}>
                  {s.isEligible === false ? `NOT ELIGIBLE — ${s.ineligibleReason || 'Criteria Not Met'}` : `ELIGIBLE — ${s.matchTier || 'Matched'} (${s.match}% Match)`}
                </h3>
              </div>
              <span className={`px-4 py-2 rounded-full text-xs font-black uppercase ${s.isEligible === false ? 'bg-destructive/15 text-destructive' : 'bg-success/15 text-success'}`}>
                {s.isEligible === false ? 'Ineligible' : '100% Eligible'}
              </span>
            </div>

            {/* Complete 9-Rule Checklist */}
            {s.ruleChecks && s.ruleChecks.length > 0 && (
              <div className="mt-5 border-t border-border/60 pt-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Why This Matches You / Eligibility Checklist</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {s.ruleChecks.map((rc: any) => (
                    <div key={rc.rule} className={`flex items-start gap-2.5 rounded-2xl p-3 border text-xs font-semibold ${rc.passed ? 'border-success/20 bg-success/10 text-foreground' : 'border-destructive/30 bg-destructive/10 text-destructive'}`}>
                      <span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full text-[10px] font-bold ${rc.passed ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}`}>
                        {rc.passed ? '✓' : '✕'}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold">{rc.rule}: <span className={rc.passed ? 'text-success' : 'text-destructive'}>{rc.passed ? 'PASS' : 'FAIL'}</span></p>
                        <p className="text-[11px] opacity-80 mt-0.5">{rc.detail || rc.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="surface rounded-[2rem] p-6">
            <SectionHeading eyebrow="Who can apply" title="Eligibility Criteria" />
            <ul className="space-y-2.5">
              {s.eligibility.map((e) => (
                <li key={e} className="flex gap-3 text-sm leading-relaxed">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {e}
                </li>
              ))}
            </ul>
          </div>

          <div className="surface rounded-[2rem] p-6">
            <SectionHeading eyebrow="What you get" title="Benefits" />
            <div className="grid gap-3 sm:grid-cols-2">
              {s.benefits.map((b) => (
                <div key={b} className="rounded-2xl bg-muted/60 p-4 text-sm font-medium leading-relaxed">
                  {b}
                </div>
              ))}
            </div>
          </div>

          <div className="surface rounded-[2rem] p-6">
            <SectionHeading eyebrow="Process" title="Timeline" />
            <ol className="relative space-y-5 border-l border-border pl-6">
              {s.timeline.map((t) => (
                <li key={t.label} className="relative">
                  <span
                    className={`absolute -left-[1.9rem] top-1 grid size-4 place-items-center rounded-full ${
                      t.done ? "gradient-hero" : "border-2 border-border bg-card"
                    }`}
                  />
                  <p className="text-sm font-bold">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-4">
          <div className="surface rounded-[2rem] p-6 lg:sticky lg:top-28">
            <SectionHeading eyebrow="Prepare" title="Required documents" />
            <ul className="space-y-2.5">
              {s.documents.map((d) => (
                <li key={d} className="flex items-center gap-3 rounded-2xl border border-border p-3">
                  <FileText className="size-4 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">{d}</span>
                </li>
              ))}
            </ul>
            <a
              href={ensureAbsoluteUrl(s.officialApplyUrl || s.official)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center justify-center gap-2 rounded-full gradient-hero px-5 py-3.5 text-sm font-bold text-primary-foreground hover:opacity-95 transition-opacity"
            >
              Apply on official site <ExternalLink className="size-4" />
            </a>

            {hasApplied ? (
              <div className="mt-3 space-y-2">
                <label className="text-xs font-bold text-muted-foreground block">Application Progress Stage</label>
                <select
                  value={activeApp.status}
                  disabled={submitting}
                  onChange={async (e) => {
                    const nextStatus = e.target.value;
                    setSubmitting(true);
                    try {
                      await apiRequest("PUT", `/applications/${activeApp.id}/status`, { status: nextStatus });
                      toast.success(`Updated stage to ${nextStatus}`);
                      fetchApps();
                    } catch (err: any) {
                      toast.error(err.message || "Failed to update status");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  className="w-full rounded-2xl border border-border bg-card p-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {[
                    "Saved", "Applying", "Applied", "Under Review",
                    "Documents Submitted", "Interview Scheduled",
                    "Selected", "Rejected", "Offer Accepted"
                  ].map((st) => (
                    <option key={st} value={st}>
                      Stage: {st}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleCancelApplication}
                  disabled={submitting}
                  variant="outline"
                  className="w-full rounded-full border-destructive text-destructive hover:bg-destructive/10 py-5 text-xs font-bold cursor-pointer transition-all mt-2"
                >
                  Remove from Tracker
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleTrackApplication}
                disabled={submitting}
                className="mt-3 w-full rounded-full bg-success text-success-foreground hover:bg-success/90 py-6 text-sm font-bold cursor-pointer transition-all"
              >
                Track Application Status
              </Button>
            )}

            <p className="mt-3 text-center text-xs text-muted-foreground">
              MeritMind redirects you directly to the official provider portal. We never charge application fees.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <SectionHeading eyebrow="Keep going" title="Related scholarships" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {related.map((r) => (
            <ScholarshipCard key={r.id} s={r} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
