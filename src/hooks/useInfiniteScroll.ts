import { useEffect, useRef } from "react";

/** Fires `onHit` when the returned sentinel scrolls into view. */
export function useInfiniteScroll(onHit: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  const cb = useRef(onHit);
  cb.current = onHit;

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) cb.current();
      },
      { rootMargin: "320px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [enabled]);

  return ref;
}
