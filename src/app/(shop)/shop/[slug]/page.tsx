"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";

import {
  ProductDetailContent,
  ProductDetailSkeleton,
} from "@/core/features/shop/components/product-detail";
import { useProduct } from "@/core/services/client/products";
import { type EntityId, type Product } from "@/core/types/entities.types";

type Props = {
  product?: Product;
  onAddToCart?: (payload: {
    productId?: EntityId;
    quantity: number;
    attributes: Record<string, string>;
  }) => void;
};

export default function ProductDetailPage(props: Props) {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const productId = Number(slug);
  const isValidId = !isNaN(productId) && productId > 0;

  const { data, isPending, isError } = useProduct({
    id: isValidId ? productId : null,
    enabled: isValidId,
  });

  if (isPending && isValidId) {
    return <ProductDetailSkeleton />;
  }

  const product = data?.data ?? props.product;

  if (!product && (isError || isValidId)) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground text-lg">
          محصول مورد نظر یافت نشد.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent {...props} product={product} />
    </Suspense>
  );
}
