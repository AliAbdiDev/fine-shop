import Link from "next/link";

import { ArrowLeft, Flame, Sparkles } from "lucide-react";

import { Button } from "@/core/components/ui/button";

import { HeroSlider, type HeroSlide } from "./hero-slider";

const slides: HeroSlide[] = [
  {
    src: "/images/landing/hero1.png",
    alt: "هدفون، کوله و کفش منتخب",
  },
  {
    src: "/images/landing/hero2.jfif",
    alt: "محصولات فصل جدید",
  },
  {
    src: "/images/landing/hero3.jfif",
    alt: "کالکشن تازه بارزونو",
  },
];

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto grid items-center gap-8 md:grid-cols-2 md:gap-10">
        {/* ── Text column — fully server-rendered, zero JS ── */}
        <div className="flex flex-col items-center gap-4 text-center md:items-start md:gap-5 md:text-right">
          <div className="text-primary font-vazir-bold flex items-center justify-center text-xs">
            <span className="bg-primary ml-2 h-0.5 w-5.5" />
            کمی تازه‌تر، کمی دل‌چسب‌تر
          </div>

          <h1 className="font-vazir-bold text-2xl leading-tight tracking-tight sm:text-3xl lg:text-[40px]">
            حال خوب، از انتخاب‌های
            <br />
            کوچک شروع می‌شود.
          </h1>

          <p className="text-muted-foreground max-w-md text-sm leading-relaxed sm:text-base">
            از خانه تا محیط کار، از پوشاک تا لوازم خانگی، انتخاب‌های تازه برای
            ساختن روزهای بهتر.
          </p>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
            <Button
              size="lg"
              className="gap-2 rounded-full"
              render={<Link href="/shop" />}
              nativeButton={false}
            >
              خرید کنید
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-full bg-transparent"
              render={<Link href="/shop" />}
              nativeButton={false}
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              کشف بارزونو
            </Button>
          </div>

          <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
            <Flame className="text-primary h-3.5 w-3.5" aria-hidden />
            تا ۳۰٪ تخفیف روی انتخاب‌های این هفته
          </div>
        </div>

        {/* ── Slider column — client island ── */}
        <div className="hidden w-full md:block">
          <HeroSlider slides={slides} />
        </div>
      </div>
    </div>
  );
}
