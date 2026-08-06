import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { AppShell } from "@/components/meritmind/AppShell";
import { ScholarshipCard } from "@/components/meritmind/ScholarshipCard";
import { SectionHeading } from "@/components/meritmind/Bits";
import { inr } from "@/utils/format";
import { scholarshipService } from "@/services/scholarshipService";
import type { Scholarship } from "@/types/scholarship";
import { useState, useEffect } from "react";
import { apiRequest } from "@/services/apiClient";
import { useSavedScholarships } from "@/contexts/SavedScholarshipContext";
import { Loader2 } from "lucide-react";
import { daysLeft } from "@/data/mock";


export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved scholarships — MeritMind" },
      {
        name: "description",
        content:
          "Your bookmarked scholarships with total potential value, application stage and days remaining before each deadline.",
      },
      { property: "og:title", content: "Saved scholarships — MeritMind" },
      {
        property: "og:description",
        content: "Bookmarks, application stages and deadlines in one calm shelf.",
      },
    ],
  }),
  component: Saved,
});

function Saved() {
  const { ids, loading: contextLoading } = useSavedScholarships();
  const [saved, setSaved] = useState<Scholarship[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!ids.length) {
        setSaved([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const items = await scholarshipService.byIds(ids);
        setSaved(items);
        const appList = await apiRequest<any[]>("GET", "/applications");
        setApps(appList);
      } catch (e) {
        console.error("Failed to load saved items", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [ids]);

  const total = saved.reduce((a, s) => a + s.amount, 0);
  const stageOf = (id: string) => apps.find((a) => a.scholarshipId === id)?.status ?? "Saved";

  if (contextLoading || loading) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="pointer-events-none absolute -left-20 -bottom-24 size-72 rounded-full gradient-hero opacity-10" />
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">
          <Bookmark className="size-3.5" /> Your shelf
        </span>
        <h1 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
          {saved.length} saved · {inr(total)} of potential funding
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Everything you bookmarked, sorted by how soon it closes so nothing slips away.
        </p>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[...saved]
          .sort((a, b) => a.deadline.localeCompare(b.deadline))
          .map((s) => (
            <Link
              key={s.id}
              to="/scholarship/$id"
              params={{ id: s.id }}
              className="surface lift flex items-center gap-3 rounded-3xl p-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-muted">
                {s.logo}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {stageOf(s.id)} · {daysLeft(s.deadline)} days left
                </p>
              </div>
            </Link>
          ))}
      </section>

      <section className="mt-12">
        <SectionHeading
          eyebrow="Bookmarks"
          title="Full details"
          action={
            <Link to="/explore" className="text-sm font-bold text-primary">
              Find more
            </Link>
          }
        />
        {saved.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {saved.map((s) => (
              <ScholarshipCard key={s.id} s={s} initiallySaved />
            ))}
          </div>
        ) : (
          <div className="surface rounded-3xl p-12 text-center">
            <p className="text-4xl">🔖</p>
            <h3 className="mt-3 font-display text-lg font-bold">Your shelf is empty</h3>
            <Link to="/explore" className="mt-3 inline-block text-sm font-bold text-primary">
              Start exploring
            </Link>
          </div>
        )}
      </section>
    </AppShell>
  );
}
