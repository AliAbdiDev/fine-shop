"use client";

import { useEffect, useRef, useState } from "react";

import dynamic from "next/dynamic";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/core/components/ui/button";

import { type SliderInstance } from "./keen-slider-inner";
import { ProductSliderCard, type SliderProduct } from "./product-slider-card";

const KeenSliderInner = dynamic(() => import("./keen-slider-inner"), {
  ssr: false,
  loading: () => null,
});

interface ProductSliderProps {
  products: SliderProduct[];
  title: string;
  priority?: boolean;
}

export function ProductSlider({
  products,
  title,
  priority = false,
}: ProductSliderProps) {
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
      { rootMargin: "300px" },
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 4).map((product, i) => (
              <ProductSliderCard
                key={product.id}
                product={product}
                priority={priority && i < 4}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
