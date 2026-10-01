import { Zap } from "lucide-react";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";

export function PromoBanner() {
  return (
    <section
      dir="rtl"
      className="bg-primary text-primary-foreground relative overflow-hidden rounded-2xl px-6 py-8 sm:px-10 sm:py-10"
    >
      <div className="relative z-10 flex flex-col items-center gap-3 text-center sm:gap-4">
        <Badge variant="secondary" className="gap-1 text-xs">
          <Zap className="h-3 w-3" />
          پیشنهاد ویژه
        </Badge>
        <h2 className="text-xl font-bold sm:text-2xl">
          تا ۴۰٪ تخفیف روی محصولات منتخب
        </h2>
        <p className="max-w-md text-sm opacity-90">
          فرصت محدود است. همین حالا از تخفیف‌های ویژه ما بهره‌مند شوید.
        </p>
        <Button variant="secondary" size="lg" className="mt-1">
          مشاهده تخفیف‌ها
        </Button>
      </div>
    </section>
  );
}
