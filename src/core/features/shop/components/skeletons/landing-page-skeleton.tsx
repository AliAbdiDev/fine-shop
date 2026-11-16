import { Skeleton } from "@/core/components/ui/skeleton";
import { SliderSkeleton } from "./slider-skeleton";

/**
 * Skeleton loading state for the main landing page.
 * Matches exact dimensions and layouts of all sections to eliminate Layout Shift (CLS).
 */
export function LandingPageSkeleton() {
  return (
    <div className="space-y-8 pb-6 sm:space-y-12">
      {/* ── 1. Hero Section ── */}
      <section className="shop-section-space">
        <div className="relative overflow-hidden">
          <div className="mx-auto grid items-center gap-8 md:grid-cols-2 md:gap-10">
            {/* Text column */}
            <div className="flex flex-col items-start gap-4 text-right md:gap-5">
              <div className="flex items-center justify-start gap-2">
                <Skeleton className="h-0.5 w-5.5 rounded-full" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>

              <div className="w-full space-y-2">
                <Skeleton className="h-7 w-3/4 rounded-md sm:h-9 lg:h-10" />
                <Skeleton className="h-7 w-1/2 rounded-md sm:h-9 lg:h-10" />
              </div>

              <div className="w-full max-w-md space-y-1.5">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-4/5 rounded-md" />
              </div>

              <div className="flex w-full gap-1 max-md:pe-1 sm:w-auto sm:gap-3">
                <Skeleton className="h-11 w-1/2 rounded-full sm:w-32" />
                <Skeleton className="h-11 w-1/2 rounded-full sm:w-32" />
              </div>

              <div className="mt-1 flex items-center gap-1.5">
                <Skeleton className="h-3.5 w-3.5 rounded-full" />
                <Skeleton className="h-3 w-48 rounded-md" />
              </div>
            </div>

            {/* Slider column */}
            <div className="hidden w-full md:block">
              <div className="bg-muted relative mx-auto aspect-4/3 w-full overflow-hidden rounded-2xl">
                <Skeleton className="absolute top-4 right-4 h-6 w-28 rounded-full" />
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                  <Skeleton className="h-1.75 w-6 rounded-full" />
                  <Skeleton className="h-1.75 w-1.75 rounded-full" />
                  <Skeleton className="h-1.75 w-1.75 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Categories Section ── */}
      <section className="shop-section-space">
        <div className="space-y-5">
          <div className="flex items-end justify-between">
            <Skeleton className="h-5 w-44 rounded-md sm:h-6" />
            <Skeleton className="h-3.5 w-24 rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 xl:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="border-border bg-secondary flex h-41.5 flex-col items-center justify-start gap-3 rounded-2xl border px-3 py-5 text-center shadow-none ring-0"
              >
                <Skeleton className="h-20 w-20 rounded-xl sm:h-24 sm:w-24" />
                <div className="flex flex-col items-center gap-1.5">
                  <Skeleton className="h-3.5 w-20 rounded-md" />
                  <Skeleton className="h-2.5 w-14 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Economical Slider (Secondary tone) ── */}
      <section className="shop-section-space bg-secondary py-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36 rounded-md sm:h-7" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
          <SliderSkeleton />
          <div className="mt-4 flex justify-center gap-1.5">
            <Skeleton className="h-1.5 w-6 rounded-full" />
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── 4. Popular Slider (Card tone) ── */}
      <section className="shop-section-space bg-card py-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36 rounded-md sm:h-7" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
          <SliderSkeleton />
          <div className="mt-4 flex justify-center gap-1.5">
            <Skeleton className="h-1.5 w-6 rounded-full" />
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── 5. Lifestyle Section ── */}
      <section className="shop-section-space">
        <div className="space-y-5">
          <div className="flex items-end justify-between">
            <Skeleton className="h-5 w-44 rounded-md sm:h-6" />
            <Skeleton className="h-3.5 w-24 rounded-md" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border-border bg-card ring-border flex size-full flex-col gap-0 overflow-hidden rounded-lg border py-0 shadow-none ring-1"
              >
                <Skeleton className="aspect-4/3 w-full rounded-none" />
                <div className="bg-secondary flex flex-1 flex-col items-center gap-2 p-5 text-center">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-5 w-40 rounded-md" />
                  <Skeleton className="h-3 w-48 rounded-md" />
                  <div className="mt-auto flex w-full items-center justify-between pt-3">
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-4 w-4 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Features Section ── */}
      <section className="shop-section-space">
        <div className="border-border bg-secondary grid grid-cols-2 gap-3 rounded-2xl border p-4 sm:gap-4 sm:p-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-xl p-3 text-center sm:p-4"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Reviews Section ── */}
      <section className="shop-section-space">
        <div className="space-y-12">
          <div className="flex items-end justify-between">
            <Skeleton className="h-5 w-44 rounded-md sm:h-6" />
            <Skeleton className="h-3.5 w-24 rounded-md" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-7 w-20 rounded-md sm:h-9" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border-border bg-secondary space-y-3 rounded-2xl border p-4 sm:p-5"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Skeleton key={s} className="h-3.5 w-3.5 rounded-sm" />
                  ))}
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-full rounded-md" />
                  <Skeleton className="h-3.5 w-4/5 rounded-md" />
                </div>
                <div className="border-border border-t pt-3 space-y-1">
                  <Skeleton className="h-3.5 w-20 rounded-md" />
                  <Skeleton className="h-2.5 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Newsletter Section ── */}
      <section className="shop-section-space">
        <div className="border-border bg-secondary grid items-center gap-6 rounded-2xl border p-6 sm:p-8 md:grid-cols-2 md:gap-10 md:p-10">
          <div className="space-y-2 text-center md:text-right">
            <Skeleton className="h-7 w-48 rounded-md sm:h-8" />
            <Skeleton className="h-3.5 w-64 rounded-md" />
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Skeleton className="h-11 flex-1 rounded-full" />
            <Skeleton className="h-11 w-full rounded-full sm:w-24" />
          </div>
        </div>
      </section>
    </div>
  );
}
