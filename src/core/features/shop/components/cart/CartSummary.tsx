"use client";

import { type Route } from "next";

import Link from "next/link";

import { ArrowLeft, CheckCircle2, ShieldCheck, Truck } from "lucide-react";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import { ROUTES } from "@/core/constants/misc";
import { useCart } from "@/core/states/cart";
import { toPersianNum } from "@/core/utils/helpers";

export function CartSummary() {
  const { totalItems, subtotalPrice, totalDiscount, totalPayablePrice } =
    useCart();

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold">خلاصه سبد خرید</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Total Item Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">تعداد اقلام</span>
          <span className="font-vazir-bold">{toPersianNum(totalItems)} عدد</span>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">قیمت کالاها</span>
          <div className="flex items-baseline gap-1">
            <span className="font-vazir-bold">{toPersianNum(subtotalPrice)}</span>
            <span className="text-muted-foreground text-xs">تومان</span>
          </div>
        </div>

        {/* Discount (if any) */}
        {totalDiscount > 0 && (
          <div className="flex items-center justify-between text-sm text-destructive">
            <span>سود شما از خرید</span>
            <div className="flex items-baseline gap-1">
              <span className="font-vazir-bold">
                {toPersianNum(totalDiscount)}
              </span>
              <span className="text-xs">تومان</span>
            </div>
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">هزینه ارسال</span>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 px-2 py-0.5 text-xs">
            رایگان
          </Badge>
        </div>

        <Separator />

        {/* Total Payable Price */}
        <div className="flex items-center justify-between">
          <span className="font-heading text-base font-bold">
            مبلغ قابل پرداخت
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-vazir-bold text-primary text-xl">
              {toPersianNum(totalPayablePrice)}
            </span>
            <span className="text-muted-foreground text-xs">تومان</span>
          </div>
        </div>

        {/* Value Props / Guarantees */}
        <div className="bg-muted/40 divide-border/60 flex flex-col gap-2 rounded-xl p-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>ضمانت اصالت و سلامت فیزیکی کالا</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary shrink-0" />
            <span>ارسال سریع و مطمئن به سراسر کشور</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>پشتیبانی و پاسخگویی ۲۴ ساعته</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2.5 pt-2">
        <Button size="lg" className="w-full gap-2 text-sm font-semibold">
          <span>ادامه فرایند خرید</span>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          render={<Link href={ROUTES.SHOP as Route} />}
          nativeButton={false}
        >
          <span>افزودن کالاهای بیشتر</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
