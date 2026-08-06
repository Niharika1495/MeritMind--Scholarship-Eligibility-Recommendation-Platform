import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Chip } from "@/components/meritmind/Bits";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useScholarships } from "@/contexts/ScholarshipContext";
import { useUI } from "@/contexts/UIContext";
import { AMOUNT_BOUNDS, countActiveFilters, facetsSync } from "@/services/scholarshipService";
import type { YearLevel } from "@/types/scholarship";
import { inr } from "@/utils/format";

const deadlineWindows = [
  { label: "Any time", value: null },
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

const yearLevels: YearLevel[] = ["Fresher", "Final year"];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

export function FilterPanel() {
  const { filters, setFilter, toggleInArray, resetFilters } = useScholarships();
  const { filtersOpen, toggleFilters } = useUI();
  const active = countActiveFilters(filters);

  return (
    <aside className="surface h-fit overflow-hidden rounded-[1.75rem] lg:sticky lg:top-28">
      <button
        onClick={toggleFilters}
        className="flex w-full items-center gap-2 px-6 py-5 text-left"
        aria-expanded={filtersOpen}
      >
        <SlidersHorizontal className="size-4 text-primary" />
        <h2 className="font-display text-base font-bold">Advanced filters</h2>
        {active ? (
          <span className="rounded-full gradient-hero px-2 py-0.5 text-[10px] font-black text-primary-foreground">
            {active}
          </span>
        ) : null}
        <ChevronDown
          className={`ml-auto size-4 text-muted-foreground transition-transform ${
            filtersOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-500 ${
          filtersOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-6 px-6 pb-6">
            <Group title="Provider type">
              <div className="flex flex-wrap gap-2">
                {facetsSync.sectors.map((s) => (
                  <Chip
                    key={s}
                    active={filters.sectors.includes(s)}
                    onClick={() => toggleInArray("sectors", s)}
                  >
                    {s}
                  </Chip>
                ))}
              </div>
            </Group>

            <Group title="Category">
              <div className="flex flex-wrap gap-2">
                {facetsSync.categories.map((c) => (
                  <Chip
                    key={c}
                    active={filters.categories.includes(c)}
                    onClick={() => toggleInArray("categories", c)}
                  >
                    {c}
                  </Chip>
                ))}
              </div>
            </Group>

            <Group title="State">
              <div className="flex flex-wrap gap-2">
                {facetsSync.states.map((s) => (
                  <Chip
                    key={s}
                    active={filters.states.includes(s)}
                    onClick={() => toggleInArray("states", s)}
                  >
                    {s}
                  </Chip>
                ))}
              </div>
            </Group>

            <Group title="Branch">
              <div className="flex flex-wrap gap-2">
                {facetsSync.branches.map((b) => (
                  <Chip
                    key={b}
                    active={filters.branches.includes(b)}
                    onClick={() => toggleInArray("branches", b)}
                  >
                    {b}
                  </Chip>
                ))}
              </div>
            </Group>

            <Group title="Provider">
              <div className="no-scrollbar max-h-44 space-y-1.5 overflow-y-auto pr-1">
                {facetsSync.providers.map((p) => {
                  const on = filters.providers.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => toggleInArray("providers", p)}
                      className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition-colors ${
                        on ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span
                        className={`grid size-4 shrink-0 place-items-center rounded-[5px] border ${
                          on ? "gradient-hero border-transparent" : "border-border"
                        }`}
                      >
                        {on ? <span className="size-1.5 rounded-full bg-primary-foreground" /> : null}
                      </span>
                      <span className="min-w-0 truncate">{p}</span>
                    </button>
                  );
                })}
              </div>
            </Group>

            <Group title="Amount range">
              <div className="mb-3 flex items-center justify-between text-xs font-bold text-primary">
                <span>{inr(filters.amountMin)}</span>
                <span>{inr(filters.amountMax)}</span>
              </div>
              <Slider
                value={[filters.amountMin, filters.amountMax]}
                onValueChange={([lo, hi]) => {
                  setFilter("amountMin", lo ?? AMOUNT_BOUNDS.min);
                  setFilter("amountMax", hi ?? AMOUNT_BOUNDS.max);
                }}
                min={AMOUNT_BOUNDS.min}
                max={AMOUNT_BOUNDS.max}
                step={5000}
              />
            </Group>

            <Group title="Deadline within">
              <div className="flex flex-wrap gap-2">
                {deadlineWindows.map((d) => (
                  <Chip
                    key={d.label}
                    active={filters.deadlineWithinDays === d.value}
                    onClick={() => setFilter("deadlineWithinDays", d.value)}
                  >
                    {d.label}
                  </Chip>
                ))}
              </div>
            </Group>

            <Group title="Year of study">
              <div className="flex flex-wrap gap-2">
                <Chip active={filters.yearLevel === null} onClick={() => setFilter("yearLevel", null)}>
                  Any
                </Chip>
                {yearLevels.map((y) => (
                  <Chip
                    key={y}
                    active={filters.yearLevel === y}
                    onClick={() => setFilter("yearLevel", y)}
                  >
                    {y}
                  </Chip>
                ))}
              </div>
            </Group>

            <Group title="Your CGPA">
              <div className="mb-3 flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground">Show awards I qualify for</span>
                <span className="text-primary">
                  {filters.cgpa === null ? "Off" : filters.cgpa.toFixed(1)}
                </span>
              </div>
              <Slider
                value={[filters.cgpa ?? 5]}
                onValueChange={([v]) => setFilter("cgpa", v ?? 5)}
                min={5}
                max={10}
                step={0.1}
              />
              {filters.cgpa !== null ? (
                <button
                  onClick={() => setFilter("cgpa", null)}
                  className="mt-2 text-[11px] font-bold text-muted-foreground hover:text-foreground"
                >
                  Ignore CGPA
                </button>
              ) : null}
            </Group>

            <Group title="Family income">
              <div className="mb-3 flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground">Max income allowed</span>
                <span className="text-primary">
                  {filters.income === null ? "Off" : inr(filters.income)}
                </span>
              </div>
              <Slider
                value={[filters.income ?? 800000]}
                onValueChange={([v]) => setFilter("income", v ?? 800000)}
                min={100000}
                max={2500000}
                step={50000}
              />
              {filters.income !== null ? (
                <button
                  onClick={() => setFilter("income", null)}
                  className="mt-2 text-[11px] font-bold text-muted-foreground hover:text-foreground"
                >
                  Ignore income
                </button>
              ) : null}
            </Group>

            <Group title="Special categories">
              <div className="space-y-3">
                {[
                  { key: "forWomen" as const, label: "Women scholarships" },
                  { key: "forMinority" as const, label: "Minority scholarships" },
                  { key: "forDisability" as const, label: "Disability scholarships" },
                ].map((row) => (
                  <label key={row.key} className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-muted-foreground">{row.label}</span>
                    <Switch
                      checked={filters[row.key]}
                      onCheckedChange={(v) => setFilter(row.key, v)}
                    />
                  </label>
                ))}
              </div>
            </Group>

            <button
              onClick={resetFilters}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted"
            >
              <RotateCcw className="size-3.5" /> Clear all filters
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
