import { type Route } from "next";

import { VerticalCard } from "@/core/components/custom/verticalCard";
import { Badge } from "@/core/components/ui/badge";
import { Skeleton } from "@/core/components/ui/skeleton";
import { AddToCartButton } from "@/core/features/shop/components/card/AddToCartButton";
import { type Product } from "@/core/types/entities.types";
import { isFile, toPersianNum } from "@/core/utils/helpers";

interface ProductGridProps {
  products?: Product[];
  isPending?: boolean;
  isFetchingNextPage?: boolean;
}

export function ProductGrid({
  products = [],
  isPending = false,
  isFetchingNextPage = false,
}: ProductGridProps) {
  if (isPending) {
    return (
      <div className="3xl:grid-cols-4 grid gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border-border bg-card flex flex-col space-y-3 overflow-hidden rounded-lg border p-3.5"
          >
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        محصولی یافت نشد.
      </div>
    );
  }

  return (
    <div className="3xl:grid-cols-4 grid gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {products.map((product) => {
        const hasDiscount =
          product.discountedPrice != null &&
          product.discountedPrice < product.basePrice;

        const discount = hasDiscount
          ? Math.round(
              ((product.basePrice - product.discountedPrice!) /
                product.basePrice) *
                100,
            )
          : 0;

        const price = product.discountedPrice ?? product.basePrice;
        const image = !isFile(product.images?.[0]) ? product.images?.[0] : null;
        const category = product.categoryLabel ?? product.category;

        return (
          <VerticalCard
            key={product.id}
            image={image?.url || ""}
            imageAlt={image?.alt ?? product.name}
            href={`/shop/${product.id}` as Route}
            aspect="square"
            className="h-full"
            mediaClassName="bg-secondary"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
            description={product.description}
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
                <AddToCartButton
                  product={product}
                  disabled={product.isAvailable === false}
                  showToast
                />
              </div>
            }
          />
        );
      })}

      {isFetchingNextPage &&
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`next-skeleton-${i}`}
            className="border-border bg-card flex flex-col space-y-3 overflow-hidden rounded-lg border p-3.5"
          >
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
    </div>
  );
}
