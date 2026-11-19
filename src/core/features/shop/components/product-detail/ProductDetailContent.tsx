"use client";

import { useEffect, useMemo, useState } from "react";
import { type Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ImageIcon,
  Minus,
  Plus,
  ShoppingCart,
  ZoomIn,
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { Button } from "@/core/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/core/components/ui/radio-group";
import { useCart } from "@/core/states/cart";
import { type EntityId, type Product } from "@/core/types/entities.types";
import { showAddToCartToast } from "@/core/utils/cart-toast";
import { cn, isFile } from "@/core/utils/helpers";
import { RelatedProductsSection } from "./RelatedProductsSection";

/* -------------------------- Mock fallback ---------------------------- */
const DEMO_PRODUCT: Product = {
  id: 0,
  name: "محصول نمونه",
  category: "عمومی",
  categoryLabel: "دسته‌بندی عمومی",
  stock: 12,
  basePrice: 1_280_000,
  discountedPrice: 896_000,
  description: "توضیحات پیش‌فرض محصول.",
  images: [],
  isAvailable: true,
  attributeList: [],
};

/* ---------------------------- Helpers ---------------------------- */
const COLOR_MAP: Record<string, string> = {
  مشکی: "#000000",
  سفید: "#ffffff",
  خاکستری: "#6b7280",
  زیتونی: "#556b2f",
  قرمز: "#ef4444",
  آبی: "#3b82f6",
  سبز: "#22c55e",
  زرد: "#eab308",
};

const faNum = new Intl.NumberFormat("fa-IR");
const formatPrice = (n: number) => `${faNum.format(n)} تومان`;

/* ---------------------------- Component -------------------------- */
export type ProductDetailContentProps = {
  product?: Product;
  onAddToCart?: (payload: {
    productId?: EntityId;
    quantity: number;
    attributes: Record<string, string>;
  }) => void;
};

export function ProductDetailContent({
  product = DEMO_PRODUCT,
  onAddToCart,
}: ProductDetailContentProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { addItem } = useCart();

  const imageParam = searchParams.get("image");
  const lightboxIndex =
    imageParam !== null && !isNaN(Number(imageParam))
      ? parseInt(imageParam, 10)
      : -1;

  const openLightbox = (index: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("image", index.toString());
    router.push(`${pathname}?${params.toString()}` as Route, { scroll: false });
  };

  const closeLightbox = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("image");
      const nextQuery = params.toString();
      router.replace(
        (nextQuery ? `${pathname}?${nextQuery}` : pathname) as Route,
        {
          scroll: false,
        },
      );
    }
  };

  const handleSlideChange = ({ index }: { index: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("image", index.toString());
    router.replace(`${pathname}?${params.toString()}` as Route, {
      scroll: false,
    });
  };

  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(
    {},
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const allImages = useMemo(() => {
    if (!product?.images) return [];
    if (Array.isArray(product.images)) {
      return product.images
        .map((img) =>
          typeof img === "object" && img && "url" in img ? img.url : "",
        )
        .filter(Boolean);
    }
    const legacy = product.images as unknown as {
      main?: string;
      gallery?: string[];
    };
    return [legacy?.main, ...(legacy?.gallery ?? [])].filter(
      Boolean,
    ) as string[];
  }, [product]);

  const slides = useMemo(() => allImages.map((src) => ({ src })), [allImages]);

  const hasDiscount =
    product?.discountedPrice != null &&
    product?.discountedPrice < product.basePrice;
  const finalPrice = hasDiscount ? product.discountedPrice! : product.basePrice;

  const inStock = (product.isAvailable ?? true) && product.stock > 0;
  const allAttrsSelected = (product.attributeList ?? []).every((attr) => {
    const key = attr.key || (attr as unknown as { name?: string }).name;
    return key ? selectedAttrs[key] : true;
  });
  const canAddToCart = inStock && allAttrsSelected;

  const ctaLabel = !inStock
    ? "ناموجود"
    : !allAttrsSelected
      ? "ویژگی‌ها را انتخاب کنید"
      : "افزودن به سبد";

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    if (onAddToCart) {
      onAddToCart({
        productId: product.id,
        quantity,
        attributes: selectedAttrs,
      });
    } else if (product.id != null) {
      const firstImage = product.images?.[0];
      const imageUrl =
        firstImage && !isFile(firstImage) ? firstImage.url : undefined;

      const attrSuffix = Object.entries(selectedAttrs)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${v}`)
        .join("-");

      const itemId = attrSuffix
        ? `${product.id}-${attrSuffix}`
        : String(product.id);

      addItem({
        id: itemId,
        productId: Number(product.id),
        name: product.name,
        image: imageUrl,
        basePrice: product.basePrice,
        discountedPrice: product.discountedPrice,
        quantity,
        attributes:
          Object.keys(selectedAttrs).length > 0 ? selectedAttrs : undefined,
      });
    }

    showAddToCartToast();
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
      <main className="shop-section-space flex w-full flex-col items-start justify-between gap-12 py-10 lg:flex-row">
        {/* ---------- Gallery ---------- */}
        <section className="w-full lg:w-7/12">
          {allImages.length > 0 ? (
            <button
              onClick={() => openLightbox(0)}
              className="group border-border bg-muted focus-visible:ring-ring relative block aspect-square max-h-[520px] w-full cursor-zoom-in overflow-hidden rounded-xl border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              aria-label="بزرگ‌نمایی تصویر محصول"
            >
              <img
                src={allImages[0]}
                alt={product.name}
                loading="eager"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <span className="bg-background/90 text-muted-foreground absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <ZoomIn className="h-3.5 w-3.5" />
                بزرگ‌نمایی
              </span>
            </button>
          ) : (
            <div className="border-border bg-muted flex aspect-square max-h-[520px] w-full items-center justify-center rounded-xl border">
              <ImageIcon className="text-muted-foreground size-20 opacity-40" />
            </div>
          )}

          {allImages.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {allImages.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => openLightbox(i)}
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
        <section className="w-full divide-y *:py-6 lg:w-5/12">
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
              {product.attributeList.map((attr, idx) => {
                const attrKey =
                  attr.key ||
                  (attr as unknown as { name?: string }).name ||
                  `attr-${idx}`;
                const attrLabel =
                  (attr as unknown as { label?: string }).label || attrKey;
                const isColor =
                  (attr as unknown as { type?: string }).type === "color" ||
                  attrKey === "color" ||
                  attrKey === "رنگ";

                return (
                  <div key={attrKey} className="space-y-2">
                    <span className="text-muted-foreground text-sm font-medium">
                      {attrLabel}:
                    </span>
                    {isColor ? (
                      <RadioGroup
                        value={selectedAttrs[attrKey] ?? ""}
                        onValueChange={(val) =>
                          setSelectedAttrs((s) => ({
                            ...s,
                            [attrKey]: String(val),
                          }))
                        }
                        className="flex flex-row flex-wrap gap-2.5"
                      >
                        {attr.values.map((val) => {
                          const colorHex = COLOR_MAP[val] ?? val;
                          return (
                            <RadioGroupItem
                              key={val}
                              value={val}
                              aria-label={val}
                              title={val}
                              className={cn(
                                "border-border/80 size-7 rounded-full border transition-all",
                                "cursor-pointer hover:scale-105",
                                "data-checked:ring-primary data-checked:ring-offset-background data-checked:ring-2 data-checked:ring-offset-2",
                                "[&_[data-slot=radio-group-indicator]>span]:bg-white [&_[data-slot=radio-group-indicator]>span]:mix-blend-difference",
                              )}
                              style={{ backgroundColor: colorHex }}
                            />
                          );
                        })}
                      </RadioGroup>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {attr.values.map((val) => {
                          const selected = selectedAttrs[attrKey] === val;
                          return (
                            <Button
                              key={val}
                              type="button"
                              size="sm"
                              variant={selected ? "default" : "outline"}
                              onClick={() =>
                                setSelectedAttrs((s) => ({
                                  ...s,
                                  [attrKey]: val,
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
                    )}
                  </div>
                );
              })}
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
      <RelatedProductsSection
        currentProductId={product.id}
        category={product.category}
      />

      {/* ---------------- Lightbox ---------------- */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={closeLightbox}
        index={lightboxIndex >= 0 ? lightboxIndex : 0}
        slides={slides}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 4 }}
        on={{ view: handleSlideChange }}
      />
    </div>
  );
}
