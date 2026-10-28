"use client";

import { useState } from "react";

import {
  FilterSidebar,
  MobileFilterTrigger,
} from "@/core/features/shop/components/shop-explore/Filter";
import { ProductGrid } from "@/core/features/shop/components/shop-explore/ProductGrid";

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

  const props = {
    categories,
    brands,
    colors,
    sizes,
    maxPrice: 10_000_000,
  };

  return (
    <div className="mx-auto px-4 py-6">
      <div className="flex flex-col gap-5 lg:flex-row">
        <FilterSidebar {...props} />

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between lg:hidden">
            <MobileFilterTrigger onOpen={() => setOpen(true)} activeCount={0} />
          </div>
          <ProductGrid />
        </div>
      </div>
      {/* 
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>فیلترها</DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <MobileFilterPanel {...props} />
          </div>
        </DrawerContent>
      </Drawer> */}
    </div>
  );
}
