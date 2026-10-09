"use client";
import { useEffect } from "react";

import "keen-slider/keen-slider.min.css";

import { type Route } from "next";

import { type KeenSliderInstance, useKeenSlider } from "keen-slider/react";
import { Plus, Star } from "lucide-react";

import { VerticalCard } from "@/core/components/custom/verticalCard";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { toPersianNum } from "@/core/utils/helpers";

export interface SliderProduct {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
}
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
    slides: { perView: 1.15, spacing: 12 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    breakpoints: {
      "(min-width: 480px)": { slides: { perView: 2, spacing: 12 } },
      "(min-width: 640px)": { slides: { perView: 2.3, spacing: 14 } },
      "(min-width: 1024px)": { slides: { perView: 3, spacing: 20 } },
      "(min-width: 1280px)": { slides: { perView: 4, spacing: 20 } },
    },
  });

  useEffect(() => {
    instanceRef.current = instance.current;
  }, [instance, instanceRef]);

  return (
    <>
      <div ref={ref} className="keen-slider">
        {products.map((product, i) => {
          const discount =
            product.originalPrice && product.originalPrice > product.price
              ? Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100,
                )
              : 0;

          return (
            <div key={product.id} className="keen-slider__slide">
              <VerticalCard
                image={product.image}
                imageAlt={product.title}
                href={`/product/${product.id}` as Route}
                aspect="square"
                className="h-full"
                mediaClassName="bg-secondary"
                priority={i === 0}
                mediaOverlay={
                  discount > 0 ? (
                    <Badge
                      variant="destructive"
                      className="absolute top-2.5 left-2.5 rounded-full px-2 text-[10px] font-bold"
                    >
                      {toPersianNum(discount)}٪
                    </Badge>
                  ) : null
                }
                badge={product.category}
                title={product.title}
                headerClassName="p-3.5 pb-1"
                footerClassName="p-3.5 pt-0"
                footer={
                  <div className="flex w-full items-end justify-between gap-2">
                    <div className="flex flex-col">
                      {product.originalPrice && (
                        <span className="text-muted-foreground text-[10px] line-through">
                          {product.originalPrice.toLocaleString("fa-IR")}
                        </span>
                      )}
                      <span className="text-sm font-extrabold">
                        {product.price.toLocaleString("fa-IR")}
                        <span className="text-muted-foreground mr-1 text-[10px] font-normal">
                          تومان
                        </span>
                      </span>
                    </div>

                    <Button
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-md"
                      aria-label="افزودن به سبد خرید"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                }
              >
                {product.rating != null && (
                  <div className="flex items-center gap-1 text-[10px]">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="font-semibold">
                      {product.rating.toLocaleString("fa-IR")}
                    </span>
                    {product.reviewCount != null && (
                      <span className="text-muted-foreground">
                        ({product.reviewCount.toLocaleString("fa-IR")} دیدگاه)
                      </span>
                    )}
                  </div>
                )}
              </VerticalCard>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {products.reverse().map((_, i) => (
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
