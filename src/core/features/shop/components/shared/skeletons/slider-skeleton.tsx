import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/core/components/ui/card";
import { cn } from "@/core/utils/helpers";

function Bar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("bg-muted animate-pulse rounded-full", className)}
    />
  );
}

/**
 * Exact-size clone of the slider's `VerticalCard`, with bars in place of
 * text/image. Every section uses the SAME padding and layout classes as
 * the real card, and every bar's height matches the real text's
 * line-height — so the skeleton occupies the exact same box.
 */
export function SliderCardSkeleton() {
  return (
    <Card className="border-border bg-card ring-border flex size-full flex-col gap-0 overflow-hidden rounded-lg border py-0 shadow-none ring-1">
      {/* media: aspect-square + bg-secondary (matches VerticalCard aspect="square") */}
      <div className="bg-secondary aspect-square w-full animate-pulse" />

      {/* header: identical classes to the real card in the slider */}
      <CardHeader className="flex flex-col items-start gap-1.5 p-3.5 pb-1 text-right">
        {/* badge (category): text-[10px] → 15px line-height */}
        <Bar className="h-[15px] w-14" />
        {/* title: text-base leading-snug → 22px; sm: text-lg leading-snug → ~25px */}
        <Bar className="h-[22px] w-full sm:h-[25px]" />
      </CardHeader>

      {/* content (rating row): text-[10px] + h-3 star, pb-2 */}
      <CardContent className="flex flex-1 flex-col items-start gap-2 px-4 pb-2 text-right">
        <div className="flex items-center gap-1">
          <Bar className="h-3 w-3 shrink-0" />
          <Bar className="h-[15px] w-8" />
          <Bar className="h-[15px] w-16" />
        </div>
      </CardContent>

      {/* footer: price column + h-8 button, p-3.5 pt-0 */}
      <CardFooter className="mt-auto flex items-center justify-between gap-2 p-3.5 pt-0 text-right">
        <div className="flex w-full items-end justify-between gap-2">
          <div className="flex flex-col">
            {/* originalPrice: text-[10px] → 15px */}
            <Bar className="h-[15px] w-10" />
            {/* price: text-sm → 20px line-height */}
            <Bar className="h-[20px] w-20" />
          </div>
          {/* add-to-cart button: h-8 w-8 rounded-md */}
          <Bar className="h-8 w-8 shrink-0 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  );
}
export function SliderSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="flex gap-3 sm:gap-3 md:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-[76.923%] shrink-0 sm:w-[32.5%] md:w-[23.5%]"
            // 100% / 1.3 ≈ 76.923%  |  sm: 3 per view | md: 4 per view
          >
            <SliderCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
