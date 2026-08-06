import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { recommendationService } from "@/services/recommendationService";
import type { RecommendationBucket } from "@/types/scholarship";

type RecommendationState = {
  buckets: RecommendationBucket[];
  loading: boolean;
  error: string | null;
  retry: () => void;
};

const RecommendationContext = createContext<RecommendationState | null>(null);

export function RecommendationProvider({ children }: { children: ReactNode }) {
  const [buckets, setBuckets] = useState<RecommendationBucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    recommendationService
      .buckets()
      .then((res) => alive && setBuckets(res))
      .catch((e: Error) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [nonce]);

  const retry = useCallback(() => setNonce((n) => n + 1), []);

  const value = useMemo(() => ({ buckets, loading, error, retry }), [buckets, loading, error, retry]);

  return <RecommendationContext.Provider value={value}>{children}</RecommendationContext.Provider>;
}

export function useRecommendations() {
  const ctx = useContext(RecommendationContext);
  if (!ctx) throw new Error("useRecommendations must be used inside RecommendationProvider");
  return ctx;
}
