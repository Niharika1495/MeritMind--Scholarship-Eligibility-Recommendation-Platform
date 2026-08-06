import { Skeleton } from "@/components/ui/skeleton";

export function ScholarshipCardSkeleton() {
  return (
    <div className="surface flex flex-col gap-4 rounded-[1.75rem] p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="size-12 shrink-0 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="size-[54px] shrink-0 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="size-9 rounded-full" />
      </div>
    </div>
  );
}

export function ScholarshipGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ScholarshipCardSkeleton key={i} />
      ))}
    </div>
  );
}
