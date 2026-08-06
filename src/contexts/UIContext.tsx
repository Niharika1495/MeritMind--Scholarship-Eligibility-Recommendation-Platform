import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Scholarship } from "@/types/scholarship";

type UIState = {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean) => void;
  toggleFilters: () => void;
  shareTarget: Scholarship | null;
  openShare: (s: Scholarship) => void;
  closeShare: () => void;
};

const UIContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [shareTarget, setShareTarget] = useState<Scholarship | null>(null);

  const toggleFilters = useCallback(() => setFiltersOpen((v) => !v), []);
  const openShare = useCallback((s: Scholarship) => setShareTarget(s), []);
  const closeShare = useCallback(() => setShareTarget(null), []);

  const value = useMemo(
    () => ({ filtersOpen, setFiltersOpen, toggleFilters, shareTarget, openShare, closeShare }),
    [filtersOpen, toggleFilters, shareTarget, openShare, closeShare],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
}
