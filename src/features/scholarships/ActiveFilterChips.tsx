import { X } from "lucide-react";
import { useScholarships } from "@/contexts/ScholarshipContext";
import { AMOUNT_BOUNDS, countActiveFilters } from "@/services/scholarshipService";
import { inr } from "@/utils/format";

type ChipDef = { label: string; clear: () => void };

export function ActiveFilterChips() {
  const { filters, setFilter, toggleInArray, resetFilters } = useScholarships();
  const chips: ChipDef[] = [];

  (["sectors", "categories", "states", "branches", "providers"] as const).forEach((key) =>
    (filters[key] as string[]).forEach((v) =>
      chips.push({ label: v, clear: () => toggleInArray(key, v) }),
    ),
  );
  if (filters.yearLevel)
    chips.push({ label: filters.yearLevel, clear: () => setFilter("yearLevel", null) });
  if (filters.amountMin !== AMOUNT_BOUNDS.min || filters.amountMax !== AMOUNT_BOUNDS.max)
    chips.push({
      label: `${inr(filters.amountMin)} – ${inr(filters.amountMax)}`,
      clear: () => {
        setFilter("amountMin", AMOUNT_BOUNDS.min);
        setFilter("amountMax", AMOUNT_BOUNDS.max);
      },
    });
  if (filters.deadlineWithinDays !== null)
    chips.push({
      label: `Closes in ${filters.deadlineWithinDays}d`,
      clear: () => setFilter("deadlineWithinDays", null),
    });
  if (filters.cgpa !== null)
    chips.push({ label: `CGPA ${filters.cgpa.toFixed(1)}`, clear: () => setFilter("cgpa", null) });
  if (filters.income !== null)
    chips.push({ label: `Income ${inr(filters.income)}`, clear: () => setFilter("income", null) });
  if (filters.forWomen) chips.push({ label: "Women", clear: () => setFilter("forWomen", false) });
  if (filters.forMinority)
    chips.push({ label: "Minority", clear: () => setFilter("forMinority", false) });
  if (filters.forDisability)
    chips.push({ label: "Disability", clear: () => setFilter("forDisability", false) });

  if (!countActiveFilters(filters)) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.label}
          onClick={c.clear}
          className="group inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-3 py-1.5 text-[11px] font-bold text-primary transition-colors hover:bg-primary/15"
        >
          {c.label}
          <X className="size-3 opacity-60 group-hover:opacity-100" />
        </button>
      ))}
      <button
        onClick={resetFilters}
        className="text-[11px] font-bold text-muted-foreground underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
