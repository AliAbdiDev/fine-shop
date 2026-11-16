"use client";

import { Suspense, useEffect, useMemo, useState } from "react";

import { type Route } from "next";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Check,
  ChevronLeft,
  ImageIcon,
  Minus,
  Plus,
  ShoppingCart,
  ZoomIn,
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { VerticalCard } from "@/core/components/custom/verticalCard";
import { Badge } from "@/core/components/ui/badge";
import { Button, ButtonLink } from "@/core/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/core/components/ui/radio-group";
import { Skeleton } from "@/core/components/ui/skeleton";
import { ROUTES } from "@/core/constants/misc";
import { AddToCartButton } from "@/core/features/shop/components/card/AddToCartButton";
import { useProduct, useProducts } from "@/core/services/client/products";
import { useCart } from "@/core/states/cart";
import { type EntityId, type Product } from "@/core/types/entities.types";
import { showAddToCartToast } from "@/core/utils/cart-toast";
import { cn, isFile, toPersianNum } from "@/core/utils/helpers";

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

/* ---------------------------- Skeleton -------------------------- */
function ProductDetailSkeleton() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="shop-section-space flex w-full flex-col items-start justify-between gap-12 py-10 lg:flex-row">
        <section className="w-full lg:w-7/12">
          <Skeleton className="aspect-square max-h-[500px] w-full rounded-xl" />
          <div className="mt-4 flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
        </section>
        <section className="w-full space-y-6 lg:w-5/12">
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-8 w-1/3" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-14 rounded-md" />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-11 w-32 rounded-md" />
            <Skeleton className="h-11 flex-1 rounded-md" />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ------------------- Related Products Section ------------------- */
function RelatedProductsSection({
  currentProductId,
  category,
}: {
  currentProductId?: EntityId;
  category?: string;
}) {
  const { data, isPending } = useProducts({
    pageSize: 5,
    ...(category ? { category } : {}),
  });

  const products = (data?.data ?? [])
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (!isPending && products.length === 0) return null;

  return (
    <section className="border-border mx-auto max-w-7xl border-t px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold">محصولات پیشنهادی</h2>
        <ButtonLink
          href={ROUTES.SHOP as any}
          variant="link"
          size="sm"
          className="text-muted-foreground gap-1"
        >
          مشاهده همه
          <ChevronLeft className="h-4 w-4" />
        </ButtonLink>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border-border bg-card flex flex-col space-y-3 overflow-hidden rounded-lg border p-3.5"
              >
                <Skeleton className="aspect-square w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          : products.map((item) => {
              const hasDiscount =
                item.discountedPrice != null &&
                item.discountedPrice < item.basePrice;

              const discount = hasDiscount
                ? Math.round(
                    ((item.basePrice - item.discountedPrice!) /
                      item.basePrice) *
                      100,
                  )
                : 0;

              const price = item.discountedPrice ?? item.basePrice;
              const image = !isFile(item.images?.[0]) ? item.images?.[0] : null;

              return (
                <VerticalCard
                  key={item.id}
                  image={image?.url || ""}
                  imageAlt={image?.alt ?? item.name}
                  href={`/shop/${item.id}` as Route}
                  aspect="square"
                  className="h-full"
                  mediaClassName="bg-secondary"
                  badge={item.categoryLabel ?? item.category}
                  title={item.name}
                  description={item.description}
                  headerClassName="p-3.5 pb-1"
                  footerClassName="p-3.5 pt-0"
                  mediaOverlay={
                    discount > 0 ? (
                      <Badge
                        variant="destructive"
                        className="absolute top-2.5 left-2.5 rounded-full px-2 text-xs font-bold"
                      >
                        {toPersianNum(discount)}٪
                      </Badge>
                    ) : null
                  }
                  footer={
                    <div className="flex w-full items-end justify-between gap-2">
                      <div className="flex flex-col">
                        {hasDiscount && (
                          <span className="text-muted-foreground text-xs line-through">
                            {toPersianNum(item.basePrice)}
                          </span>
                        )}
                        <span className="text-sm font-extrabold">
                          {toPersianNum(price)}
                          <span className="text-muted-foreground mr-1 text-xs font-normal">
                            تومان
                          </span>
                        </span>
                      </div>
                      <AddToCartButton
                        product={item}
                        disabled={item.isAvailable === false}
                        showToast
                      />
                    </div>
                  }
                />
              );
            })}
      </div>
    </section>
  );
}

/* ---------------------------- Component -------------------------- */
type Props = {
  product?: Product;
  onAddToCart?: (payload: {
    productId?: EntityId;
    quantity: number;
    attributes: Record<string, string>;
  }) => void;
};

function ProductDetailContent({
  product = DEMO_PRODUCT,
  onAddToCart,
}: Props = {}) {
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
                                "size-7 rounded-full border border-border/80 transition-all",
                                "hover:scale-105 cursor-pointer",
                                "data-checked:ring-2 data-checked:ring-primary data-checked:ring-offset-2 data-checked:ring-offset-background",
                                "[&_[data-slot=radio-group-indicator]>span]:mix-blend-difference [&_[data-slot=radio-group-indicator]>span]:bg-white",
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

function ProductDetailPageInner(props: Props) {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const productId = Number(slug);
  const isValidId = !isNaN(productId) && productId > 0;

  const { data, isPending, isError } = useProduct({
    id: isValidId ? productId : null,
    enabled: isValidId,
  });

  if (isPending && isValidId) {
    return <ProductDetailSkeleton />;
  }

  const product = data?.data ?? props.product;

  if (!product && (isError || isValidId)) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground text-lg">
          محصول مورد نظر یافت نشد.
        </p>
      </div>
    );
  }

  return <ProductDetailContent {...props} product={product ?? DEMO_PRODUCT} />;
}

export default function ProductDetailPage(props: Props) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailPageInner {...props} />
    </Suspense>
  );
}
