"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";

import { ArrowLeft, Flame, Sparkles } from "lucide-react";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { cn } from "@/core/utils/helpers";

interface HeroSlide {
  src: string;
  alt: string;
}

const slides: HeroSlide[] = [
  {
    src: "/images/hero1.png",
    alt: "هدفون، کوله و کفش منتخب",
  },
  {
    src: "/images/hero1.png",
    alt: "محصولات فصل جدید",
  },
  {
    src: "/images/hero1.png",
    alt: "کالکشن تازه بارزونو",
  },
];

const SLIDE_INTERVAL = 3500;

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto grid items-center gap-8 md:grid-cols-2 md:gap-10">
        {/* Text — right on desktop */}
        <div className="flex flex-col items-center gap-4 text-center md:items-start md:gap-5 md:text-right">
          <div className="text-primary font-vazir-bold flex items-center justify-center text-xs">
            <span className="bg-primary ml-2 h-0.5 w-5.5" />
            کمی تازه‌تر، کمی دل‌چسب‌تر
          </div>

          {/* extra bold */}
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
            <Button size="lg" className="gap-2 rounded-full">
              خرید کنید
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-full bg-transparent"
            >
              <Sparkles className="h-4 w-4" />
              کشف بارزونو
            </Button>
          </div>

          <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
            <Flame className="text-primary h-3.5 w-3.5" />
            تا ۳۰٪ تخفیف روی انتخاب‌های این هفته
          </div>
        </div>

        {/* Slider — left on desktop, hidden on mobile */}
        <div className="hidden w-full md:block">
          <div
            className="bg-muted relative mx-auto aspect-4/3 w-full overflow-hidden rounded-2xl md:max-w-md lg:max-w-lg xl:max-w-xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="محصولات منتخب"
          >
            {/* Slides */}
            {slides.map((slide, i) => (
              <Image
                key={i}
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 1024px) 448px, (max-width: 1280px) 512px, 576px"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
                quality={80}
                className={cn(
                  "object-cover transition-opacity duration-700 ease-out",
                  i === index ? "opacity-100" : "opacity-0",
                )}
                aria-hidden={i !== index}
              />
            ))}

            {/* Badge — top-right */}
            <Badge
              variant="secondary"
              className="bg-card/90 text-foreground hover:bg-card/90 absolute top-4 right-4 rounded-full px-3 py-1.5 text-[11px] font-medium shadow-sm backdrop-blur-sm"
            >
              منتخب‌های فصل تازه
            </Badge>

            {/* Navigation dots — bottom-left */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`رفتن به اسلاید ${i + 1}`}
                  aria-current={index === i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index
                      ? "bg-primary w-5"
                      : "bg-card/70 hover:bg-card w-1.5",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
