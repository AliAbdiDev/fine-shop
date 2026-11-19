"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { ArrowUp } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { Button, ButtonLink } from "@/core/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/core/components/ui/sheet";
import {
  FilterSidebar,
  MobileFilterPanel,
  MobileFilterTrigger,
} from "@/core/features/shop/components/shop-explore/Filter";
import { ProductGrid } from "@/core/features/shop/components/shop-explore/ProductGrid";
import { useInfiniteProducts } from "@/core/services/client/products";

const categories = [
  { id: 1, name: "دیجیتال", slug: "digital", count: 120 },
  { id: 2, name: "مد و پوشاک", slug: "fashion", count: 340 },
];

const brands = [
  { id: 1, name: "سامسونگ", slug: "samsung", count: 42 },
  { id: 2, name: "اپل", slug: "apple", count: 18 },
];

const colors = [
  { id: 1, name: "مشکی", slug: "black", value: "#000" },
  { id: 2, name: "سفید", slug: "white", value: "#fff" },
];

const sizes = [
  { id: 1, name: "S", slug: "s" },
  { id: 2, name: "M", slug: "m" },
  { id: 3, name: "L", slug: "l" },
];

export default function ExplorePage() {
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const queryParams = useSearchParams();
  const sort = queryParams.get("sort") || undefined;
  const activeFilterCount = Array.from(queryParams.keys()).filter(
    (k) =>
      k !== "sort" &&
      k !== "page" &&
      k !== "page_size" &&
      k !== "search",
  ).length;

  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteProducts({
      pageSize: 12,
      sort,
    });

  const { ref, inView } = useInView({
    rootMargin: "200px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  const props = {
    categories,
    brands,
    colors,
    sizes,
    maxPrice: 10_000_000,
  };

  return (
    <div className="mx-auto px-4 pt-1 pb-6">
      <div className="flex flex-col gap-5 lg:flex-row">
        <FilterSidebar {...props} />

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between lg:hidden">
            <MobileFilterTrigger
              onOpen={() => setOpen(true)}
              activeCount={activeFilterCount}
            />
          </div>
          <div className="bg-card border-border w-full rounded-lg border p-0.5">
            <ButtonLink
              href={{ query: { sort: "descending" } }}
              className={
                queryParams.get("sort") === "descending" ? "underline" : ""
              }
              variant={"link"}
            >
              خوش قیمت ترین
            </ButtonLink>
            <ButtonLink
              href={{ query: { sort: "popular" } }}
              className={
                queryParams.get("sort") === "popular" ? "underline" : ""
              }
              variant={"link"}
            >
              محبوب ترین
            </ButtonLink>
          </div>

          <ProductGrid
            products={products}
            isPending={isPending}
            isFetchingNextPage={isFetchingNextPage}
          />

          {hasNextPage && (
            <div ref={ref} className="h-10 w-full" aria-hidden="true" />
          )}
        </div>
      </div>

      {showScrollTop && (
        <Button
          type="button"
          onClick={scrollToTop}
          size="default"
          variant={"outline"}
          className="border-primary/60 hover:border-primary fixed bottom-6 left-6 z-50 rounded-md border shadow-lg"
          aria-label="رفتن به ابتدای لیست"
        >
          <ArrowUp className="text-primary h-5 w-5 stroke-3" />
        </Button>
      )}

      {showScrollTop && (
        <Button
          type="button"
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 left-6 z-50 rounded-md shadow-lg"
          aria-label="رفتن به ابتدای لیست"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl p-0">
          <SheetHeader className="border-border border-b px-5 py-4">
            <SheetTitle className="font-vazir-bold text-base">فیلترها</SheetTitle>
          </SheetHeader>
          <div className="max-h-[calc(85vh-5rem)] overflow-y-auto pt-2">
            <MobileFilterPanel {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
