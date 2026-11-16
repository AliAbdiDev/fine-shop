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
    <main className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold md:text-2xl">
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
