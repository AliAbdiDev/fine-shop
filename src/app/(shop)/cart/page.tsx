"use client";

import { ShoppingBag } from "lucide-react";

import { Skeleton } from "@/core/components/ui/skeleton";
import { CartEmptyState } from "@/core/features/shop/components/cart/CartEmptyState";
import { CartItemList } from "@/core/features/shop/components/cart/CartItemList";
import { CartSummary } from "@/core/features/shop/components/cart/CartSummary";
import { useCart } from "@/core/states/cart";

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-8">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
      <div className="lg:col-span-4">
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, isHydrated } = useCart();

  return (
    <main className="container mx-auto max-w-7xl px-3 pb-8 sm:px-4 md:pb-12">
      {/* Page Header */}
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-xl sm:h-10 sm:w-10">
          <ShoppingBag className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold sm:text-xl md:text-2xl">
            سبد خرید
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            اقلام انتخابی خود را بررسی و سفارش خود را تکمیل کنید.
          </p>
        </div>
      </div>

      {/* Main Content */}
      {!isHydrated ? (
        <CartSkeleton />
      ) : items.length === 0 ? (
        <CartEmptyState />
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <CartItemList />
          </div>
          <div className="lg:sticky lg:top-24 lg:col-span-4">
            <CartSummary />
          </div>
        </div>
      )}
    </main>
  );
}
