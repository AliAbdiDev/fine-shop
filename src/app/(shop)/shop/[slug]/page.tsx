// components/ProductDetailPage.tsx
"use client";

import { lazy, useEffect, useMemo, useState } from "react";

import { cn } from "cn";
import {
  Check,
  ChevronLeft,
  Minus,
  Plus,
  ShoppingCart,
  ZoomIn,
} from "lucide-react";
const Lightbox = lazy(() => import("yet-another-react-lightbox"));
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";

/* ----------------------------- Types ----------------------------- */
type EntityId = string | number;

type ProductAttribute = {
  id?: string;
  name: string;
  label?: string;
  values: string[];
};

type Images = {
  main: string;
  gallery?: string[];
};

export type Product = {
  id?: EntityId;
  name: string;
  category: string;
  categoryLabel?: string;
  stock: number;
  basePrice: number;
  discountedPrice?: number;
  description?: string;
  images: Images;
  isAvailable?: boolean;
  attributeList?: Array<ProductAttribute>;
};

/* -------------------------- Mock data ---------------------------- */
const DEMO_PRODUCT: Product = {
  id: "demo-001",
  name: "هودی پنبه‌ای یقه‌گرد مدل Basic",
  category: "hoodie",
  categoryLabel: "پوشاک مردانه",
  stock: 12,
  basePrice: 1_280_000,
  discountedPrice: 896_000,
  description:
    "هودی پنبه‌ای با یقه‌گرد و کشباف در آستین و پایین. برش راحت و مناسب استفادهٔ روزمره. دوخت مقاوم و پارچهٔ نرم که پس از شست‌وشو تغییر فرم نمی‌دهد.",
  images: {
    main: "https://picsum.photos/seed/hoodie-main/900/900",
    gallery: [
      "https://picsum.photos/seed/hoodie-side/900/900",
      "https://picsum.photos/seed/hoodie-back/900/900",
      "https://picsum.photos/seed/hoodie-detail/900/900",
    ],
  },
  isAvailable: true,
  attributeList: [
    {
      name: "size",
      label: "سایز",
      values: ["S", "M", "L", "XL", "2XL"],
    },
    {
      name: "color",
      label: "رنگ",
      values: ["مشکی", "خاکستری", "سفید", "زیتونی"],
    },
  ],
};

/* ---------------------------- Helpers ---------------------------- */
const faNum = new Intl.NumberFormat("fa-IR");
const formatPrice = (n: number) => `${faNum.format(n)} تومان`;

/* ---------------------------- Component -------------------------- */
type Props = {
  product?: Product;
  onAddToCart?: (payload: {
    productId?: EntityId;
    quantity: number;
    attributes: Record<string, string>;
  }) => void;
};

export default function ProductDetailPage({
  product = DEMO_PRODUCT,
  onAddToCart,
}: Props = {}) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(
    {},
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const allImages = useMemo(
    () =>
      [product?.images?.main, ...(product?.images?.gallery ?? [])].filter(
        Boolean,
      ),
    [product?.images],
  );
  const slides = useMemo(() => allImages.map((src) => ({ src })), [allImages]);

  const hasDiscount =
    product?.discountedPrice != null &&
    product?.discountedPrice < product.basePrice;
  const finalPrice = hasDiscount ? product.discountedPrice! : product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.discountedPrice! / product.basePrice) * 100)
    : 0;

  const inStock = (product.isAvailable ?? true) && product.stock > 0;
  const allAttrsSelected = (product.attributeList ?? []).every(
    (attr) => selectedAttrs[attr.name],
  );
  const canAddToCart = inStock && allAttrsSelected;

  const ctaLabel = !inStock
    ? "ناموجود"
    : !allAttrsSelected
      ? "ویژگی‌ها را انتخاب کنید"
      : "افزودن به سبد";

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    onAddToCart?.({
      productId: product.id,
      quantity,
      attributes: selectedAttrs,
    });
    setJustAdded(true);
  };

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(t);
  }, [justAdded]);

  const buttonLabel = justAdded ? "به سبد اضافه شد" : ctaLabel;

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* ---------------- Main ---------------- */}
      <main className="shop-section-space flex w-full items-start justify-between gap-12 py-10">
        {/* ---------- Gallery ---------- */}
        <section className="col-span-12 lg:col-span-7">
          <button
            onClick={() => setLightboxIndex(0)}
            className="group border-border bg-muted focus-visible:ring-ring relative block w-full cursor-zoom-in overflow-hidden rounded-xl border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            aria-label="بزرگ‌نمایی تصویر محصول"
          >
            <div className="h-145 w-160">
              <img
                src={allImages[0]}
                alt={product.name}
                loading="eager"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <span className="bg-background/90 text-muted-foreground absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              <ZoomIn className="h-3.5 w-3.5" />
              بزرگ‌نمایی
            </span>
          </button>

          {allImages.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {allImages.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setLightboxIndex(i)}
                  className={cn(
                    "bg-muted relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border ring-2 ring-offset-2 transition",
                    lightboxIndex === i
                      ? "border-primary ring-primary"
                      : "border-border hover:ring-border ring-transparent",
                  )}
                  aria-label={`تصویر ${i + 1}`}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ---------- Info ---------- */}
        <section className="col-span-12 divide-y *:py-6 lg:col-span-5">
          {/* Title */}
          <div className="space-y-3">
            <h1 className="font-vazir-bold text-2xl">{product.name}</h1>

            <p className="text-muted-foreground text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-vazir-bold text-2xl">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-muted-foreground text-base line-through">
                  {formatPrice(product.basePrice)}
                </span>
              </>
            )}
          </div>

          {/* Attributes */}
          {product.attributeList && product.attributeList.length > 0 && (
            <div className="space-y-5">
              {product.attributeList.map((attr) => (
                <div key={attr.name}>
                  <div className="flex flex-wrap gap-2">
                    {attr.values.map((val) => {
                      const selected = selectedAttrs[attr.name] === val;
                      return (
                        <Button
                          key={val}
                          type="button"
                          size="sm"
                          variant={selected ? "default" : "outline"}
                          onClick={() =>
                            setSelectedAttrs((s) => ({
                              ...s,
                              [attr.name]: val,
                            }))
                          }
                          aria-pressed={selected}
                          className="min-w-[3rem]"
                        >
                          {val}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity + CTA */}
          <div className="flex items-stretch gap-3">
            <div className="border-input flex h-11 items-center overflow-hidden rounded-md border">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-10 rounded-none"
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(Math.max(product.stock, 1), q + 1),
                  )
                }
                disabled={quantity >= product.stock || !inStock}
                aria-label="افزایش تعداد"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-sm font-medium tabular-nums">
                {faNum.format(quantity)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-10 rounded-none"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="کاهش تعداد"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="h-11 flex-1 gap-2"
              size="lg"
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  {buttonLabel}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  {buttonLabel}
                </>
              )}
            </Button>
          </div>
        </section>
      </main>

      {/* ---------------- Related Products ---------------- */}
      <section className="border-border mx-auto max-w-7xl border-t px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold">محصولات مشابه</h2>
          <Button
            variant="link"
            size="sm"
            className="text-muted-foreground gap-1"
          >
            مشاهده همه
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="group border-border/60 hover:border-primary/40 cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="bg-muted aspect-square rounded-t-lg" />
              <CardContent className="space-y-2 p-4">
                <div className="bg-muted h-4 w-3/4 rounded" />
                <div className="bg-muted h-4 w-1/3 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------------- Lightbox ---------------- */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex >= 0 ? lightboxIndex : 0}
        slides={slides}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 4 }}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
      />
    </div>
  );
}
