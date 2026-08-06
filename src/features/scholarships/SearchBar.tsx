import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { scholarshipService } from "@/services/scholarshipService";
import type { SearchSuggestion } from "@/types/scholarship";

export function SearchBar({
  value,
  onChange,
  resultCount,
}: {
  value: string;
  onChange: (v: string) => void;
  resultCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const term = useDebouncedValue(value, 180);
  const wrap = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    if (!term.trim()) {
      setSuggestions([]);
      return;
    }
    scholarshipService
      .suggest(term)
      .then((s) => alive && setSuggestions(s))
      .catch(() => alive && setSuggestions([]));
    return () => {
      alive = false;
    };
  }, [term]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={wrap} className="relative">
      <div className="glass flex items-center gap-3 rounded-full px-5 py-3.5 transition-shadow focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_22%,transparent)]">
        <Search className="size-5 shrink-0 text-muted-foreground" />
        <input
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          placeholder="Search by name, provider, branch, state or keyword…"
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
        />
        {value ? (
          <button
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        ) : null}
        {typeof resultCount === "number" ? (
          <span className="hidden shrink-0 text-xs font-bold text-muted-foreground sm:block">
            {resultCount} results
          </span>
        ) : null}
      </div>

      {open && suggestions.length ? (
        <ul className="glass absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-auto rounded-3xl p-2 text-left">
          {suggestions.map((s) => (
            <li key={`${s.kind}-${s.value}`}>
              <button
                onClick={() => {
                  onChange(s.value);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left hover:bg-muted"
              >
                <Search className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{s.value}</span>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {s.kind}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
