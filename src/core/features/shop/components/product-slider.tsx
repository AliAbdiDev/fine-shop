"use client";

import { Children, useRef, useState, type ReactNode } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Tree-shakable CSS — only what's needed
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Button } from "@/core/components/ui/button";
import { cn } from "@/core/utils/helpers";

import type { Swiper as SwiperType } from "swiper";

interface ProductSliderClientProps {
  title: string;
  children: ReactNode;
}

export function ProductSliderClient({
  title,
  children,
}: ProductSliderClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const slides = Children.toArray(children);
  const count = slides.length;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-vazir-bold text-lg sm:text-xl">{title}</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="اسلاید قبلی"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="اسلاید بعدی"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        dir="rtl"
        loop
        spaceBetween={12}
        slidesPerView={1.15}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 12 },
          640: { slidesPerView: 2.3, spaceBetween: 14 },
          1024: { slidesPerView: 3, spaceBetween: 18 },
          1280: { slidesPerView: 3.7, spaceBetween: 20 },
        }}
      >
        {slides.map((child, i) => (
          <SwiperSlide key={i}>{child}</SwiperSlide>
        ))}
      </Swiper>

      {count > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                currentSlide === i
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 w-1.5",
              )}
              aria-label={`رفتن به اسلاید ${i + 1}`}
              aria-current={currentSlide === i}
            />
          ))}
        </div>
      )}
    </section>
  );
}
