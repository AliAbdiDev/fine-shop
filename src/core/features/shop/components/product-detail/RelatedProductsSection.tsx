"use client";

import { type Route } from "next";
import { ChevronLeft } from "lucide-react";

import { VerticalCard } from "@/core/components/custom/verticalCard";
import { Badge } from "@/core/components/ui/badge";
import { ButtonLink } from "@/core/components/ui/button";
import { Skeleton } from "@/core/components/ui/skeleton";
import { ROUTES } from "@/core/constants/misc";
import { AddToCartButton } from "@/core/features/shop/components/card/AddToCartButton";
import { useProducts } from "@/core/services/client/products";
import { type EntityId } from "@/core/types/entities.types";
import { isFile, toPersianNum } from "@/core/utils/helpers";

export type RelatedProductsSectionProps = {
  currentProductId?: EntityId;
  category?: string;
};

export function RelatedProductsSection({
  currentProductId,
  category,
}: RelatedProductsSectionProps) {
  const { data, isPending } = useProducts({
    pageSize: 5,
    ...(category ? { category } : {}),
  });

  const products = (data?.data ?? [])
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (!isPending && products.length === 0) return null;

  return (
    <section className="border-border mx-auto max-w-7xl border-t px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold">محصولات پیشنهادی</h2>
        <ButtonLink
          href={ROUTES.SHOP as any}
          variant="link"
          size="sm"
          className="text-muted-foreground gap-1"
        >
          مشاهده همه
          <ChevronLeft className="h-4 w-4" />
        </ButtonLink>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border-border bg-card flex flex-col space-y-3 overflow-hidden rounded-lg border p-3.5"
              >
                <Skeleton className="aspect-square w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          : products.map((item) => {
              const hasDiscount =
                item.discountedPrice != null &&
                item.discountedPrice < item.basePrice;

              const discount = hasDiscount
                ? Math.round(
                    ((item.basePrice - item.discountedPrice!) /
                      item.basePrice) *
                      100,
                  )
                : 0;

              const price = item.discountedPrice ?? item.basePrice;
              const image = !isFile(item.images?.[0]) ? item.images?.[0] : null;

              return (
                <VerticalCard
                  key={item.id}
                  image={image?.url || ""}
                  imageAlt={image?.alt ?? item.name}
                  href={`/shop/${item.id}` as Route}
                  aspect="square"
                  className="h-full"
                  mediaClassName="bg-secondary"
                  badge={item.categoryLabel ?? item.category}
                  title={item.name}
                  description={item.description}
                  headerClassName="p-3.5 pb-1"
                  footerClassName="p-3.5 pt-0"
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
                  footer={
                    <div className="flex w-full items-end justify-between gap-2">
                      <div className="flex flex-col">
                        {hasDiscount && (
                          <span className="text-muted-foreground text-xs line-through">
                            {toPersianNum(item.basePrice)}
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
                        product={item}
                        disabled={item.isAvailable === false}
                        showToast
                      />
                    </div>
                  }
                />
              );
            })}
      </div>
    </section>
  );
}
