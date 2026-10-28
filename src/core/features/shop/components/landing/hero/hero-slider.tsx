"use client";

import { useCallback, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Badge } from "@/core/components/ui/badge";
import { cn } from "@/core/utils/helpers";

import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";

export interface HeroSlide {
  src: string;
  alt: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
}

const SLIDE_INTERVAL = 3500;
const TRANSITION_MS = 700;

export function HeroSlider({ slides }: HeroSliderProps) {
  const swiperRef = useRef<SwiperClass | null>(null);

  const count = slides.length;
  const loop = count > 1;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const handleFirstLoad = useCallback(() => setFirstLoaded(true), []);

  const [reached, setReached] = useState<Set<number>>(() => new Set([0]));

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    const idx = swiper.realIndex;
    setCurrentSlide(idx);
    setReached((prev) => {
      if (prev.has(idx)) return prev;
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  const goToSlide = useCallback((i: number) => {
    swiperRef.current?.slideToLoop(i);
  }, []);

  return (
    <div
      className="bg-muted relative mx-auto aspect-4/3 w-full overflow-hidden rounded-2xl "
      aria-roledescription="carousel"
      aria-label="محصولات منتخب"
      onFocus={() => swiperRef.current?.autoplay?.stop()}
      onBlur={() => swiperRef.current?.autoplay?.start()}
    >
      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        loop={loop}
        speed={TRANSITION_MS}
        autoplay={
          loop
            ? {
                delay: SLIDE_INTERVAL,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        className="h-full w-full [&_.swiper-wrapper]:ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        {slides.map((slide, i) => {
          const shouldRenderImage = reached.has(i);

          return (
            <SwiperSlide key={slide.src}>
              {({ isActive }) => (
                <Link
                  href="#"
                  className="relative block h-full w-full"
                  aria-label={slide.alt}
                  aria-hidden={!isActive}
                  tabIndex={isActive ? 0 : -1}
                >
                  {shouldRenderImage ? (
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="(max-width: 1024px) 448px, (max-width: 1280px) 512px, 576px"
                      draggable={false}
                      quality={85}
                      className="object-cover"
                      onLoad={i === 0 ? handleFirstLoad : undefined}
                      {...(i === 0 ? { priority: true } : {})}
                    />
                  ) : (
                    <div className="bg-muted h-full w-full" aria-hidden />
                  )}
                </Link>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* ---- Skeleton overlay ---- */}
      <div
        aria-hidden
        className={cn(
          "bg-muted pointer-events-none absolute inset-0 z-20 transition-opacity duration-500",
          firstLoaded ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="from-muted via-muted-foreground/10 to-muted absolute inset-0 animate-pulse bg-linear-to-r" />
      </div>

      <Badge
        variant="secondary"
        className="bg-card/90 text-foreground hover:bg-card/90 text-2xs absolute top-4 right-4 z-10 rounded-full px-3 py-1.5 font-medium shadow-sm backdrop-blur-sm"
      >
        منتخب‌های فصل تازه
      </Badge>

      {loop && (
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-1.5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              aria-label={`رفتن به اسلاید ${i + 1}`}
              aria-current={currentSlide === i}
              className={cn(
                "h-1.75 rounded-full transition-all duration-300",
                currentSlide === i
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.75",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
