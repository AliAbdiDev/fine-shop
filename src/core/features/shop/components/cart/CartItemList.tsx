"use client";

import Image from "next/image";
import Link from "next/link";

import { Minus, Package, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import { type CartItem, useCart } from "@/core/states/cart";
import { toPersianNum } from "@/core/utils/helpers";

interface CartItemRowProps {
  item: CartItem;
}

function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();

  const effectivePrice = item.discountedPrice ?? item.basePrice;
  const hasDiscount =
    item.discountedPrice != null && item.discountedPrice < item.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((item.basePrice - item.discountedPrice!) / item.basePrice) * 100,
      )
    : 0;
  const rowTotal = effectivePrice * item.quantity;

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  return (
    <div className="flex flex-col gap-3 py-4 sm:gap-4 md:flex-row md:items-center md:justify-between">
      {/* Product Image and Details */}
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
        <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border sm:h-20 sm:w-20">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 64px, 80px"
              unoptimized
            />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
              <Package className="h-6 w-6 stroke-[1.5] sm:h-8 sm:w-8" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Link
            href={`/shop`}
            className="hover:text-primary font-heading line-clamp-2 text-xs font-semibold transition-colors sm:text-sm"
          >
            {item.name}
          </Link>

          {/* Attributes */}
          {item.attributes && Object.keys(item.attributes).length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5 sm:gap-1.5 sm:pt-1">
              {Object.entries(item.attributes).map(([key, value]) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="px-1.5 py-0.5 text-[10px] font-normal sm:px-2 sm:text-[11px]"
                >
                  <span className="text-muted-foreground ml-1">{key}:</span>
                  <span>{value}</span>
                </Badge>
              ))}
            </div>
          )}

          {/* Unit Price */}
          <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-vazir-bold text-xs sm:text-sm">
              {toPersianNum(effectivePrice)}
            </span>
            <span className="text-muted-foreground text-[11px] sm:text-xs">
              تومان
            </span>

            {hasDiscount && (
              <>
                <span className="text-muted-foreground text-[11px] line-through sm:text-xs">
                  {toPersianNum(item.basePrice)}
                </span>
                <Badge
                  variant="destructive"
                  className="rounded-full px-1.5 py-0 text-[10px]"
                >
                  {toPersianNum(discountPercent)}٪
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stepper Quantity and Row Actions */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t pt-3 sm:gap-4 md:border-t-0 md:pt-0">
        {/* Quantity Controls */}
        <div className="bg-muted/50 flex shrink-0 items-center rounded-lg border p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md sm:h-8 sm:w-8"
            onClick={handleIncrement}
            aria-label="افزایش تعداد"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>

          <span className="font-vazir-bold min-w-6 text-center text-xs sm:min-w-8 sm:text-sm">
            {toPersianNum(item.quantity)}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive h-7 w-7 rounded-md sm:h-8 sm:w-8"
            onClick={handleDecrement}
            aria-label={item.quantity === 1 ? "حذف کالا" : "کاهش تعداد"}
          >
            {item.quantity === 1 ? (
              <Trash2 className="h-3.5 w-3.5" />
            ) : (
              <Minus className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        {/* Row Subtotal */}
        <div className="flex shrink-0 items-center gap-2.5 text-end sm:gap-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] sm:text-[11px]">
              مبلغ کل:
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-vazir-bold text-sm sm:text-base">
                {toPersianNum(rowTotal)}
              </span>
              <span className="text-muted-foreground text-[10px] sm:text-xs">
                تومان
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-7 w-7 sm:h-8 sm:w-8"
            onClick={() => removeItem(item.id)}
            aria-label="حذف از سبد خرید"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CartItemList() {
  const { items, clearCart, totalItems } = useCart();

  return (
    <Card className="p-3.5 sm:p-5 md:p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-base font-bold sm:text-lg">
              اقلام سبد خرید
            </h2>
            <Badge variant="secondary" className="px-2 text-xs">
              {toPersianNum(totalItems)} کالا
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-muted-foreground hover:text-destructive h-8 gap-1 px-2 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>حذف همه</span>
          </Button>
        </div>

        <Separator />

        <div className="divide-border flex flex-col divide-y">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
