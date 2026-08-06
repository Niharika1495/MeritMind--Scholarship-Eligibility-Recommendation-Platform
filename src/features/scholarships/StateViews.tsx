import { RefreshCw, SearchX, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  body,
  action,
  emoji = "🔍",
}: {
  title: string;
  body: string;
  action?: ReactNode;
  emoji?: string;
}) {
  return (
    <div className="surface relative overflow-hidden rounded-[2rem] px-8 py-16 text-center">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-56 aurora opacity-60" />
      <div className="relative">
        <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-muted text-3xl">
          {emoji}
        </div>
        <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{body}</p>
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

export function NoResultsState({ onClear }: { onClear: () => void }) {
  return (
    <EmptyState
      emoji="🛰️"
      title="No scholarships match those filters"
      body="Your filter combination is a little too tight. Widen the amount range, loosen CGPA, or clear a few chips to see more opportunities."
      action={
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-full gradient-hero px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <SearchX className="size-4" /> Clear all filters
        </button>
      }
    />
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="surface rounded-[2rem] px-8 py-14 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-destructive/12 text-destructive">
        <TriangleAlert className="size-6" />
      </div>
      <h3 className="mt-5 font-display text-lg font-bold">We couldn't load scholarships</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-full gradient-hero px-5 py-2.5 text-sm font-bold text-primary-foreground"
      >
        <RefreshCw className="size-4" /> Try again
      </button>
    </div>
  );
}
