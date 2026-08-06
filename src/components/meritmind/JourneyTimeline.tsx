import { Check } from "lucide-react";

export type JourneyStep = {
  id: string;
  label: string;
  caption: string;
  status: "done" | "current" | "next";
};

export function JourneyTimeline({ steps }: { steps: readonly JourneyStep[] }) {
  return (
    <ol className="no-scrollbar flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-6 md:gap-2 md:overflow-visible">
      {steps.map((step, i) => {
        const done = step.status === "done";
        const current = step.status === "current";
        return (
          <li key={step.id} className="relative min-w-[148px] md:min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                  done
                    ? "gradient-hero text-primary-foreground"
                    : current
                      ? "border-2 border-primary bg-primary-soft text-primary"
                      : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </span>
              {i < steps.length - 1 ? (
                <span
                  className={`h-0.5 flex-1 rounded-full ${done ? "bg-primary/50" : "bg-border"}`}
                />
              ) : null}
            </div>
            <p
              className={`mt-2.5 text-sm font-bold ${current ? "text-primary" : ""}`}
            >
              {step.label}
            </p>
            <p className="text-xs text-muted-foreground">{step.caption}</p>
          </li>
        );
      })}
    </ol>
  );
}
