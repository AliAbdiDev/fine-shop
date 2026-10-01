"use client";

import { useState } from "react";

import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Label } from "@/core/components/ui/label";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { Separator } from "@/core/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/core/components/ui/sheet";
import { Slider } from "@/core/components/ui/slider";

const categories = [
  { id: "digital", label: "کالای دیجیتال" },
  { id: "fashion", label: "مد و پوشاک" },
  { id: "home", label: "خانه و آشپزخانه" },
  { id: "beauty", label: "زیبایی و سلامت" },
];

const brands = [
  { id: "apple", label: "اپل" },
  { id: "samsung", label: "سامسونگ" },
  { id: "xiaomi", label: "شیائومی" },
  { id: "sony", label: "سونی" },
];

function FilterFields() {
  const [price, setPrice] = useState<number[]>([0, 5000000]);
  const [inStock, setInStock] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleCategory = (id: string) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const toggleBrand = (id: string) =>
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );

  const handlePriceChange = (value: number | readonly number[]) => {
    setPrice(Array.isArray(value) ? [...value] : [value]);
  };

  return (
    <div dir="rtl" className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">محدوده قیمت</h4>
        <Slider
          value={price}
          onValueChange={handlePriceChange}
          min={0}
          max={5000000}
          step={100000}
          dir="rtl"
        />
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>{price[0]?.toLocaleString("fa-IR")} تومان</span>
          <span>{price[1]?.toLocaleString("fa-IR")} تومان</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold">دسته‌بندی</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
              />
              <Label
                htmlFor={`cat-${cat.id}`}
                className="cursor-pointer text-sm"
              >
                {cat.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold">برند</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={() => toggleBrand(brand.id)}
              />
              <Label
                htmlFor={`brand-${brand.id}`}
                className="cursor-pointer text-sm"
              >
                {brand.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold">وضعیت</h4>
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock"
            checked={inStock}
            onCheckedChange={(v) => setInStock(!!v)}
          />
          <Label htmlFor="in-stock" className="cursor-pointer text-sm">
            فقط کالاهای موجود
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="has-discount"
            checked={hasDiscount}
            onCheckedChange={(v) => setHasDiscount(!!v)}
          />
          <Label htmlFor="has-discount" className="cursor-pointer text-sm">
            فقط کالاهای تخفیف‌دار
          </Label>
        </div>
      </div>

      <Separator />

      <Button className="w-full" variant="secondary">
        اعمال فیلترها
      </Button>
    </div>
  );
}

export function ResponsiveProductFilter() {
  return (
    <>
      {/* سایدبار دسکتاپ */}
      <aside className="hidden lg:block">
        <div className="bg-card sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-lg border p-4">
          <h3 className="mb-4 text-base font-semibold">فیلترها</h3>
          <FilterFields />
        </div>
      </aside>

      {/* دراور موبایل و تبلت */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="me-2 h-4 w-4" />
              فیلترها
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            dir="rtl"
            className="max-h-[85vh] rounded-t-2xl p-0"
          >
            <SheetHeader className="border-b p-4">
              <SheetTitle className="text-center">فیلتر محصولات</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(85vh-4rem)] p-4">
              <FilterFields />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
