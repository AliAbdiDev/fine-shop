import { Card } from "@/core/components/ui/card";
import { Skeleton } from "@/core/components/ui/skeleton";

interface PageSkeletonProps {
  gridCount?: number;
  withFilters?: boolean;
  withPagination?: boolean;
  withBreadcrumb?: boolean;
}

export function ShopSkeleton({
  gridCount = 8,
  withFilters = true,
  withPagination = true,
  withBreadcrumb = true,
}: PageSkeletonProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6">
      {withBreadcrumb && (
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-3.5 w-3.5 rounded-sm" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-3.5 rounded-sm" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      )}

      <div className="space-y-3">
        <Skeleton className="h-8 w-56 sm:h-9 sm:w-72" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-2/3 max-w-md" />
      </div>

      {withFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full sm:w-24" />
          ))}
          <div className="mr-auto flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: gridCount }).map((_, i) => (
          <Card
            key={i}
            className="flex flex-col gap-0 overflow-hidden rounded-lg border bg-white py-0 shadow-none"
          >
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center justify-between p-4 pt-0">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </Card>
        ))}
      </div>

      {withPagination && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      )}
    </div>
  );
}
