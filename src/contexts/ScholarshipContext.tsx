import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { emptyFilters, scholarshipService } from "@/services/scholarshipService";
import type { Page, Scholarship, ScholarshipFilters, SortKey } from "@/types/scholarship";

const PAGE_SIZE = 6;

type ScholarshipState = {
  filters: ScholarshipFilters;
  setFilter: <K extends keyof ScholarshipFilters>(key: K, value: ScholarshipFilters[K]) => void;
  toggleInArray: (key: "providers" | "categories" | "states" | "branches" | "sectors", value: string) => void;
  resetFilters: () => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  items: Scholarship[];
  total: number;
  page: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  loadMore: () => void;
  retry: () => void;
  mode: "infinite" | "pages";
  setMode: (m: "infinite" | "pages") => void;
  goToPage: (p: number) => void;
  pageCount: number;
};

const ScholarshipContext = createContext<ScholarshipState | null>(null);

export function ScholarshipProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ScholarshipFilters>(emptyFilters);
  const [sort, setSort] = useState<SortKey>("match");
  const [mode, setMode] = useState<"infinite" | "pages">("infinite");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Scholarship[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const debouncedSearch = useDebouncedValue(filters.search, 250);
  const queryFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );

  const requestId = useRef(0);

  // Reset to the first page whenever the query shape changes.
  useEffect(() => {
    setPage(1);
  }, [queryFilters, sort, mode]);

  useEffect(() => {
    const id = ++requestId.current;
    const first = page === 1;
    if (first) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    scholarshipService
      .query({ filters: queryFilters, sort, page, pageSize: PAGE_SIZE })
      .then((res: Page<Scholarship>) => {
        if (id !== requestId.current) return;
        setItems((prev) =>
          first || mode === "pages" ? res.items : [...prev, ...res.items.filter((r) => !prev.some((p) => p.id === r.id))],
        );
        setTotal(res.total);
        setHasMore(res.hasMore);
      })
      .catch((e: Error) => {
        if (id !== requestId.current) return;
        setError(e.message);
      })
      .finally(() => {
        if (id !== requestId.current) return;
        setLoading(false);
        setLoadingMore(false);
      });
  }, [queryFilters, sort, page, mode, nonce]);

  const setFilter = useCallback(
    <K extends keyof ScholarshipFilters>(key: K, value: ScholarshipFilters[K]) =>
      setFilters((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const toggleInArray = useCallback(
    (key: "providers" | "categories" | "states" | "branches" | "sectors", value: string) =>
      setFilters((prev) => {
        const list = prev[key] as string[];
        return {
          ...prev,
          [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
        };
      }),
    [],
  );

  const resetFilters = useCallback(() => setFilters(emptyFilters), []);
  const loadMore = useCallback(() => {
    if (!loadingMore && !loading && hasMore) setPage((p) => p + 1);
  }, [loadingMore, loading, hasMore]);
  const retry = useCallback(() => setNonce((n) => n + 1), []);
  const goToPage = useCallback((p: number) => setPage(Math.max(1, p)), []);

  const value = useMemo(
    () => ({
      filters,
      setFilter,
      toggleInArray,
      resetFilters,
      sort,
      setSort,
      items,
      total,
      page,
      hasMore,
      loading,
      loadingMore,
      error,
      loadMore,
      retry,
      mode,
      setMode,
      goToPage,
      pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    }),
    [
      filters,
      setFilter,
      toggleInArray,
      resetFilters,
      sort,
      items,
      total,
      page,
      hasMore,
      loading,
      loadingMore,
      error,
      loadMore,
      retry,
      mode,
      goToPage,
    ],
  );

  return <ScholarshipContext.Provider value={value}>{children}</ScholarshipContext.Provider>;
}

export function useScholarships() {
  const ctx = useContext(ScholarshipContext);
  if (!ctx) throw new Error("useScholarships must be used inside ScholarshipProvider");
  return ctx;
}
