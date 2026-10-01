import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { ArrowLeft, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section
      dir="rtl"
      className="from-primary/10 via-background to-background relative overflow-hidden rounded-2xl bg-gradient-to-l"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-12 text-center sm:gap-6 sm:px-10 sm:py-16 lg:py-20">
        <Badge variant="secondary" className="gap-1 text-xs">
          <Star className="h-3 w-3 fill-current" />
          جدیدترین‌های فروشگاه
        </Badge>

        <h1 className="text-2xl leading-tight font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
          بهترین محصولات دیجیتال
          <br />
          <span className="text-primary">با بهترین قیمت</span>
        </h1>

        <p className="text-muted-foreground max-w-md text-sm sm:text-base">
          خرید آسان، ارسال سریع و ضمانت اصالت کالا. همین حالا خرید خود را شروع
          کنید.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button size="lg" className="gap-2">
            شروع خرید
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg">
            مشاهده دسته‌بندی‌ها
          </Button>
        </div>
      </div>
    </section>
  );
}
