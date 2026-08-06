import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { savedScholarshipService } from "@/services/savedScholarshipService";

type SavedState = {
  ids: string[];
  loading: boolean;
  error: string | null;
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clearAll: () => void;
};

const SavedContext = createContext<SavedState | null>(null);

export function SavedScholarshipProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    savedScholarshipService
      .list()
      .then((next) => alive && setIds(next))
      .catch((e: Error) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const isSaved = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: string) => {
      const saved = ids.includes(id);
      setIds((prev) => (saved ? prev.filter((x) => x !== id) : [id, ...prev])); // optimistic
      const call = saved ? savedScholarshipService.remove(id) : savedScholarshipService.add(id);
      call.then(setIds).catch((e: Error) => setError(e.message));
    },
    [ids],
  );

  const remove = useCallback((id: string) => {
    setIds((prev) => prev.filter((x) => x !== id));
    savedScholarshipService.remove(id).then(setIds).catch((e: Error) => setError(e.message));
  }, []);

  const clearAll = useCallback(() => {
    setIds([]);
    savedScholarshipService.clear().then(setIds).catch((e: Error) => setError(e.message));
  }, []);

  const value = useMemo(
    () => ({ ids, loading, error, isSaved, toggle, remove, clearAll }),
    [ids, loading, error, isSaved, toggle, remove, clearAll],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSavedScholarships() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSavedScholarships must be used inside SavedScholarshipProvider");
  return ctx;
}
