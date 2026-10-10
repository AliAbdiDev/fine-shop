import { type Route } from "next";

import { VerticalCard } from "@/core/components/custom/verticalCard";
import { Badge } from "@/core/components/ui/badge";
import { type Product } from "@/core/types/entities.types";
import { isFile, toPersianNum } from "@/core/utils/helpers";

import { AddToCartButton } from "./AddToCartButton";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const hasDiscount =
    product.discountedPrice != null &&
    product.discountedPrice < product.basePrice;

  const discount = hasDiscount
    ? Math.round(
        ((product.basePrice - product.discountedPrice!) / product.basePrice) *
          100,
      )
    : 0;

  const price = product.discountedPrice ?? product.basePrice;
  const image = !isFile(product.images?.[0]) ? product.images?.[0] : null;
  const category = product.categoryLabel ?? product.category;

  return (
    <div className="keen-slider__slide">
      <VerticalCard
        image={image?.url || ""}
        imageAlt={image?.alt ?? product.name ?? ""}
        href={`/product/${product.id}` as Route}
        aspect="square"
        className="h-full"
        mediaClassName="bg-secondary"
        priority={priority}
        mediaOverlay={
          discount > 0 ? (
            <Badge
              variant="destructive"
              className="absolute top-2.5 left-2.5 rounded-full px-2 text-xs font-bold"
            >
              {toPersianNum(discount)}٪
            </Badge>
          ) : null
        }
        badge={category}
        title={product.name}
        headerClassName="p-3.5 pb-1"
        footerClassName="p-3.5 pt-0"
        footer={
          <div className="flex w-full items-end justify-between gap-2">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-muted-foreground text-xs line-through">
                  {toPersianNum(product.basePrice)}
                </span>
              )}
              <span className="text-sm font-extrabold">
                {toPersianNum(price)}
                <span className="text-muted-foreground mr-1 text-xs font-normal">
                  تومان
                </span>
              </span>
            </div>
            <AddToCartButton disabled={product.isAvailable === false} />
          </div>
        }
      />
    </div>
  );
}
