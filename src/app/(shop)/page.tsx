import type { Metadata } from "next";

import { FeaturesSection } from "@/core/features/shop/components/features-section";
import { HeroSection } from "@/core/features/shop/components/hero-section";
import { ProductSlider } from "@/core/features/shop/components/product-slider";
import { type SliderProduct } from "@/core/features/shop/components/product-slider-card";
import { PromoBanner } from "@/core/features/shop/components/promo-banner";

export const metadata: Metadata = {
  title: "فروشگاه من | خرید آنلاین کالای دیجیتال",
  description:
    "خرید آنلاین انواع کالای دیجیتال، موبایل، لپ‌تاپ و لوازم جانبی با ارسال سریع و ضمانت اصالت کالا.",
  openGraph: {
    title: "فروشگاه من",
    description: "خرید آنلاین با بهترین قیمت",
    type: "website",
  },
  alternates: { canonical: "https://example.com" },
};

const popularProducts: SliderProduct[] = [
  {
    id: 1,
    title: "هدفون بی‌سیم سونی",
    price: 18500000,
    originalPrice: 21000000,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    title: "ساعت هوشمند اپل",
    price: 24900000,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    title: "گوشی شیائومی",
    price: 32000000,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    title: "لپ‌تاپ مک‌بوک",
    price: 78000000,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    title: "اسپیکر بلوتوثی",
    price: 4500000,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
  },
];

const bestSellers: SliderProduct[] = [
  {
    id: 6,
    title: "پاوربانک انکر",
    price: 2800000,
    originalPrice: 3200000,
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    title: "کیبورد مکانیکال",
    price: 8900000,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    title: "ماوس گیمینگ",
    price: 3500000,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
  },
  {
    id: 9,
    title: "هدست گیمینگ",
    price: 12000000,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
  },
  {
    id: 10,
    title: "مانیتور ۲۷ اینچ",
    price: 22000000,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
  },
];

const newArrivals: SliderProduct[] = [
  {
    id: 11,
    title: "ایرپاد پرو",
    price: 19500000,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop",
  },
  {
    id: 12,
    title: "تبلت سامسونگ",
    price: 35000000,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
  },
  {
    id: 13,
    title: "دوربین کانن",
    price: 55000000,
    originalPrice: 62000000,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
  },
  {
    id: 14,
    title: "کنسول بازی",
    price: 42000000,
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
  },
  {
    id: 15,
    title: "ساعت هوشمند سامسونگ",
    price: 18000000,
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop",
  },
];

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: popularProducts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.title,
        image: p.image,
        offers: {
          "@type": "Offer",
          price: p.price,
          priceCurrency: "IRR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div dir="rtl" className="space-y-8 sm:space-y-12">
        <HeroSection />
        <FeaturesSection />

        <ProductSlider
          title="محبوب‌ترین‌ها"
          products={popularProducts}
          priority
        />

        <PromoBanner />

        <ProductSlider title="پرفروش‌ترین‌ها" products={bestSellers} />

        <ProductSlider title="جدیدترین‌ها" products={newArrivals} />
      </div>
    </>
  );
}
