import Image from "next/image";

import { Badge } from "@/core/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/core/components/ui/card";

export interface SliderProduct {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
}

interface Props {
  product: SliderProduct;
  priority?: boolean;
}

export function ProductSliderCard({ product, priority = false }: Props) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <Card dir="rtl" className="overflow-hidden">
      <div className="bg-muted relative aspect-4/3 w-full overflow-hidden">
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
        {discount > 0 && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2 text-xs"
          >
            {discount}٪
          </Badge>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="line-clamp-1 text-sm font-medium">{product.title}</h3>
      </CardContent>
      <CardFooter className="flex items-center justify-end gap-2 p-3 pt-0">
        {product.originalPrice && (
          <span className="text-muted-foreground text-xs line-through">
            {product.originalPrice.toLocaleString("fa-IR")}
          </span>
        )}
        <span className="text-primary text-sm font-bold">
          {product.price.toLocaleString("fa-IR")}
        </span>
      </CardFooter>
    </Card>
  );
}
