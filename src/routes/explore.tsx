import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/meritmind/AppShell";
import { SectionHeading } from "@/components/meritmind/Bits";
import { ScholarshipProvider, useScholarships } from "@/contexts/ScholarshipContext";
import { ActiveFilterChips } from "@/features/scholarships/ActiveFilterChips";
import { FilterPanel } from "@/features/scholarships/FilterPanel";
import { ScholarshipCard } from "@/features/scholarships/ScholarshipCard";
import { ScholarshipGridSkeleton } from "@/features/scholarships/ScholarshipSkeleton";
import { SearchBar } from "@/features/scholarships/SearchBar";
import { SortMenu } from "@/features/scholarships/SortMenu";
import { ErrorState, NoResultsState } from "@/features/scholarships/StateViews";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore scholarships — MeritMind" },
      {
        name: "description",
        content:
          "Search verified scholarships and filter by provider, amount, deadline, state, branch, CGPA, income and special categories to see only what you qualify for.",
      },
      { property: "og:title", content: "Explore scholarships — MeritMind" },
      {
        property: "og:description",
        content: "Filter verified scholarships by provider, amount, deadline, CGPA and income.",
      },
    ],
  }),
  component: () => (
    <ScholarshipProvider>
      <Explore />
    </ScholarshipProvider>
  ),
});

function Results() {
  const {
    items,
    total,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    retry,
    resetFilters,
    mode,
    setMode,
    page,
    pageCount,
    goToPage,
  } = useScholarships();

  const sentinel = useInfiniteScroll(loadMore, mode === "infinite" && hasMore && !loading);

  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (loading) return <ScholarshipGridSkeleton />;
  if (!items.length) return <NoResultsState onClear={resetFilters} />;

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {items.map((s) => (
          <ScholarshipCard key={s.id} s={s} />
        ))}
      </div>

      {mode === "infinite" ? (
        <>
          <div ref={sentinel} className="h-1" />
          {loadingMore ? (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading more scholarships…
            </div>
          ) : null}
          {!hasMore ? (
            <p className="mt-8 text-center text-xs font-bold text-muted-foreground">
              You've reached the end · {total} scholarships
            </p>
          ) : (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setMode("pages")}
                className="rounded-full border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
              >
                Switch to pagination
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="rounded-full border border-border px-4 py-2 text-xs font-bold disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`size-9 rounded-full text-xs font-bold ${
                page === i + 1
                  ? "gradient-hero text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= pageCount}
            className="rounded-full border border-border px-4 py-2 text-xs font-bold disabled:opacity-40"
          >
            Next
          </button>
          <button
            onClick={() => setMode("infinite")}
            className="ml-2 text-xs font-bold text-muted-foreground underline-offset-4 hover:underline"
          >
            Infinite scroll
          </button>
        </div>
      )}
    </div>
  );
}

function Explore() {
  const { filters, setFilter, sort, setSort, total } = useScholarships();

  return (
    <AppShell wide>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">
          Scholarship explorer
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
          Search less. Qualify more.
        </h1>
        <div className="mt-7">
          <SearchBar
            value={filters.search}
            onChange={(v) => setFilter("search", v)}
            resultCount={total}
          />
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <FilterPanel />

        <div className="min-w-0">
          <SectionHeading
            eyebrow={`${total} scholarships`}
            title="Matching your filters"
            action={<SortMenu value={sort} onChange={setSort} />}
          />
          <ActiveFilterChips />
          <Results />
        </div>
      </div>
    </AppShell>
  );
}
