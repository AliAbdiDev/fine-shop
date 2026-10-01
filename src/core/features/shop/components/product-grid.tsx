import { cn } from "@/core/utils/helpers";

import {
  ResponsiveProductCard,
  type ProductCardProps,
} from "./responsive-product-card";

export interface Product extends ProductCardProps {
  id: string | number;
}

interface ProductGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div
      dir="rtl"
      className={cn(
        "grid w-full gap-4",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map(({ id, ...product }) => (
        <ResponsiveProductCard key={id} {...product} className="h-full" />
      ))}
    </div>
  );
}
