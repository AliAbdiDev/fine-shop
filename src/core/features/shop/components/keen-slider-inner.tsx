"use client";

import { useEffect } from "react";

import { type KeenSliderInstance, useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { ProductSliderCard, type SliderProduct } from "./product-slider-card";
export type SliderInstance = KeenSliderInstance;

export type SliderInstanceRef = React.RefObject<SliderInstance | null>;

interface KeenSliderInnerProps {
  products: SliderProduct[];
  instanceRef: SliderInstanceRef;
  currentSlide: number;
  setCurrentSlide: (n: number) => void;
}

export default function KeenSliderInner({
  products,
  instanceRef,
  currentSlide,
  setCurrentSlide,
}: KeenSliderInnerProps) {
  const [ref, instance] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: true,
    slides: { perView: 1.2, spacing: 12 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 3, spacing: 18 } },
      "(min-width: 768px)": { slides: { perView: 3, spacing: 18 } },
      "(min-width: 1024px)": { slides: { perView: 3.2, spacing: 20 } },
    },
  });

  useEffect(() => {
    instanceRef.current = instance.current;
  }, [instance, instanceRef]);

  return (
    <>
      <div ref={ref} className="keen-slider">
        {products.map((product) => (
          <div key={product.id} className="keen-slider__slide">
            <ProductSliderCard product={product} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {products.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => instanceRef.current?.moveToIdx(i)}
            className={`h-1.5 rounded-full transition-all ${
              currentSlide === i
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 w-1.5"
            }`}
            aria-label={`رفتن به اسلاید ${i + 1}`}
            aria-current={currentSlide === i}
          />
        ))}
      </div>
    </>
  );
}
