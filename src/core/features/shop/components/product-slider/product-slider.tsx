"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/core/components/ui/button";

import KeenSliderInner, {
  type SliderProduct,
  type SliderInstance,
} from "./keen-slider-inner";
import { SliderSkeleton } from "../skeletons/slider-skeleton";

interface ProductSliderProps {
  products: SliderProduct[];
  title: string;
}

export function ProductSlider({ products, title }: ProductSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<SliderInstance | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shouldLoadSlider, setShouldLoadSlider] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadSlider(true);
          observer.disconnect();
        }
      },
      /* Bigger margin on mobile so the slider is ready before the user reaches it */
      { rootMargin: "800px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-vazir-bold text-lg sm:text-xl">{title}</h2>
        {shouldLoadSlider && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => instanceRef.current?.prev()}
              aria-label="اسلاید قبلی"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => instanceRef.current?.next()}
              aria-label="اسلاید بعدی"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div ref={containerRef}>
        {shouldLoadSlider ? (
          <KeenSliderInner
            products={products}
            instanceRef={instanceRef}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
          />
        ) : (
          <SliderSkeleton />
        )}
      </div>
    </section>
  );
}
