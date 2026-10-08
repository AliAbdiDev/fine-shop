import Image from "next/image";

import { Plus, Star } from "lucide-react";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardFooter } from "@/core/components/ui/card";
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

interface Props {
  product: SliderProduct;
  priority?: boolean;
}

export function ProductSliderCard({ product, priority = false }: Props) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  return (
    <Card className="border-border bg-card ring-border flex size-full flex-col gap-0 overflow-hidden rounded-lg border py-0 shadow-none ring-1">
      {/* تصویر */}
      <div className="bg-secondary relative aspect-square w-full overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
          className="object-cover"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          quality={75}
        />

        {/* درصد تخفیف */}
        {discount > 0 && (
          <Badge
            variant="destructive"
            className="font-vazir-bold absolute top-2.5 left-2.5 rounded-full px-2 text-[10px]"
          >
            {toPersianNum(discount)}٪
          </Badge>
        )}
      </div>

      {/* محتوا */}
      <CardContent className="flex flex-1 flex-col gap-1.5 p-3.5">
        {product.category && (
          <p className="text-muted-foreground text-[10px]">
            {product.category}
          </p>
        )}

        <h3 className="font-vazir-bold line-clamp-1 text-xs sm:text-sm">
          {product.title}
        </h3>

        {product.rating != null && (
          <div className="flex items-center gap-1 text-[10px]">
            <Star className="fill-primary text-primary h-3 w-3" />
            <span className="font-vazir-bold">
              {product.rating.toLocaleString("fa-IR")}
            </span>
            {product.reviewCount != null && (
              <span className="text-muted-foreground">
                ({product.reviewCount.toLocaleString("fa-IR")} دیدگاه)
              </span>
            )}
          </div>
        )}
      </CardContent>

      {/* قیمت + افزودن */}
      <CardFooter className="mt-auto flex items-end justify-between gap-2 p-3.5 pt-0">
        <div className="flex flex-col">
          {product.originalPrice && (
            <span className="text-muted-foreground text-[10px] line-through">
              {product.originalPrice.toLocaleString("fa-IR")}
            </span>
          )}
          {/* extra bold */}
          <span className="font-vazir-bold text-sm">
            {product.price.toLocaleString("fa-IR")}
            <span className="text-muted-foreground mr-1 text-[10px] font-normal">
              تومان
            </span>
          </span>
        </div>

        <Button
          size="icon"
          className="h-8 w-8 shrink-0"
          aria-label="افزودن به سبد خرید"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
