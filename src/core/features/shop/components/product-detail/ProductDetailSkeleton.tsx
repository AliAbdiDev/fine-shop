import { Skeleton } from "@/core/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="shop-section-space flex w-full flex-col items-start justify-between gap-12 py-10 lg:flex-row">
        <section className="w-full lg:w-7/12">
          <Skeleton className="aspect-square max-h-[500px] w-full rounded-xl" />
          <div className="mt-4 flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
        </section>
        <section className="w-full space-y-6 lg:w-5/12">
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-8 w-1/3" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-14 rounded-md" />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-11 w-32 rounded-md" />
            <Skeleton className="h-11 flex-1 rounded-md" />
          </div>
        </section>
      </main>
    </div>
  );
}
