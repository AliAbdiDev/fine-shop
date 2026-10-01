import { Badge } from "@/core/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { cn } from "@/core/utils/helpers";

export interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  attributes?: Record<string, string>;
  className?: string;
}

// نسخه موبایل تا تبلت: تصویر راست، متن چپ
export function MobileProductCard({
  image,
  title,
  price,
  originalPrice,
  discount,
  attributes,
  className,
}: ProductCardProps) {
  return (
    <Card
      dir="rtl"
      className={cn(
        "flex h-full flex-row items-stretch overflow-hidden p-0 md:hidden",
        className,
      )}
    >
      <div className="relative w-1/3 shrink-0">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="flex w-2/3 flex-col justify-between p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-sm leading-tight font-semibold">
            {title}
          </CardTitle>
          {attributes && (
            <CardDescription className="mt-1 flex flex-wrap gap-1">
              {Object.entries(attributes).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="text-xs">
                  {value}
                </Badge>
              ))}
            </CardDescription>
          )}
        </CardHeader>

        <CardFooter className="flex items-center justify-end gap-2 p-0 pt-2">
          {originalPrice && (
            <span className="text-muted-foreground text-sm line-through">
              {originalPrice.toLocaleString("fa-IR")}
            </span>
          )}
          <span className="text-primary text-base font-bold">
            {price.toLocaleString("fa-IR")}
          </span>
          {discount && (
            <Badge variant="destructive" className="text-xs">
              {discount}٪
            </Badge>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}

// نسخه تبلت به بالا: تصویر بالا، محتوا پایین
export function TabletProductCard({
  image,
  title,
  price,
  originalPrice,
  discount,
  attributes,
  className,
}: ProductCardProps) {
  return (
    <Card
      dir="rtl"
      className={cn(
        "hidden h-full flex-col overflow-hidden md:flex",
        className,
      )}
    >
      <div className="relative aspect-video w-full">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {attributes && (
          <CardDescription className="mt-1 flex flex-wrap gap-1">
            {Object.entries(attributes).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="text-xs">
                {value}
              </Badge>
            ))}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-0" />

      <CardFooter className="flex items-center justify-end gap-2 pt-2">
        {originalPrice && (
          <span className="text-muted-foreground text-sm line-through">
            {originalPrice.toLocaleString("fa-IR")}
          </span>
        )}
        <span className="text-primary text-lg font-bold">
          {price.toLocaleString("fa-IR")}
        </span>
        {discount && <Badge variant="destructive">{discount}٪</Badge>}
      </CardFooter>
    </Card>
  );
}

export function ResponsiveProductCard(props: ProductCardProps) {
  return (
    <>
      <MobileProductCard {...props} />
      <TabletProductCard {...props} />
    </>
  );
}
