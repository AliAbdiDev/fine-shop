"use client";

import { type Route } from "next";

import Link from "next/link";

import { ArrowLeft, ShoppingBag } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import { ROUTES } from "@/core/constants/misc";

export function CartEmptyState() {
  return (
    <Card className="mx-auto my-12 max-w-lg border-dashed text-center">
      <CardContent className="flex flex-col items-center justify-center p-8 sm:p-12">
        <div className="bg-muted/60 text-muted-foreground mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <ShoppingBag className="h-10 w-10 stroke-[1.5]" aria-hidden="true" />
        </div>
        <h2 className="font-heading mb-2 text-xl font-bold">
          سبد خرید شما در حال حاضر خالی است
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm text-sm leading-relaxed">
          می‌توانید برای مشاهده محصولات متنوع و جذاب به صفحه فروشگاه بازگردید و
          کالاهای دلخواه خود را انتخاب کنید.
        </p>
        <Button
          size="lg"
          className="gap-2"
          render={<Link href={ROUTES.SHOP as Route} />}
          nativeButton={false}
        >
          <span>مشاهده محصولات فروشگاه</span>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
