"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/core/components/ui/badge";
import { cn } from "@/core/utils/helpers";

export interface HeroSlide {
  src: string;
  alt: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
}

const SLIDE_INTERVAL = 3500;

export function HeroSlider({ slides }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, slides.length]);

  const nextIndex = (index + 1) % slides.length;

  return (
    <div
      className="bg-muted relative mx-auto aspect-4/3 w-full overflow-hidden rounded-2xl md:max-w-md lg:max-w-lg xl:max-w-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="محصولات منتخب"
    >
      {slides.map((slide, i) => {
        const shouldRender = i === index || i === nextIndex;
        if (!shouldRender) return null;

        return (
          <Link
            href="#"
            key={slide.src}
            className="absolute inset-0"
            aria-label={slide.alt}
            tabIndex={i === index ? 0 : -1}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 1024px) 448px, (max-width: 1280px) 512px, 576px"
              priority={i === 0}
              decoding={i === 0 ? "sync" : "async"}
              quality={i === 0 ? 80 : 70}
              draggable={false}
              className={cn(
                "object-cover transition-opacity duration-700 ease-out",
                i === index ? "opacity-100" : "opacity-0",
              )}
              aria-hidden={i !== index}
            />
          </Link>
        );
      })}

      <Badge
        variant="secondary"
        className="bg-card/90 text-foreground hover:bg-card/90 absolute top-4 right-4 rounded-full px-3 py-1.5 text-[11px] font-medium shadow-sm backdrop-blur-sm"
      >
        منتخب‌های فصل تازه
      </Badge>

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
              i === index ? "bg-primary w-5" : "bg-card/70 hover:bg-card w-1.5",
            )}
          />
        ))}
      </div>
    </div>
  );
}
