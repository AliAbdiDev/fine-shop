import type { Metadata } from "next";

import { CategoriesSection } from "@/core/features/shop/components/categories-section";
import { FeaturesSection } from "@/core/features/shop/components/features-section";
import { HeroSection } from "@/core/features/shop/components/hero-section";
import { LifestyleSection } from "@/core/features/shop/components/lifestyle-section";
import { NewsletterSection } from "@/core/features/shop/components/newsletter-section";
import { ProductSlider } from "@/core/features/shop/components/product-slider";
import { type SliderProduct } from "@/core/features/shop/components/product-slider-card";
import { ReviewsSection } from "@/core/features/shop/components/reviews-section";

export const metadata: Metadata = {
  title: "بارزونو | فروشگاه آنلاین",
  description:
    "خرید آنلاین با ارسال سریع، ضمانت اصالت و بازگشت ۷ روزه. انتخاب‌های خوب برای روزهای بهتر.",
  alternates: { canonical: "https://barzono.ir" },
};

const dealProducts: SliderProduct[] = [
  {
    id: 1,
    title: "کوله‌پشتی سفر چندکاره",
    category: "ورزش و سفر",
    price: 1_820_000,
    originalPrice: 2_400_000,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    title: "کفش روزمره مینیمال",
    category: "مد و پوشاک",
    price: 3_150_000,
    originalPrice: 3_900_000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    title: "کتری برقی استیل",
    category: "خانه و آشپزخانه",
    price: 6_750_000,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    title: "هدفون بی‌سیم نویزکنسل",
    category: "دیجیتال",
    price: 9_200_000,
    originalPrice: 11_500_000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
];

const popularProducts: SliderProduct[] = [
  {
    id: 5,
    title: "شمع رایحه‌دار آرامش",
    category: "خانه و آشپزخانه",
    price: 1_450_000,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1602874801006-9f4d8d3b6b93?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    title: "سرم آبرسان هالورونیک",
    category: "زیبایی و سلامت",
    price: 790_000,
    originalPrice: 980_000,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    title: "کتاب داستان‌های کوتاه",
    category: "کتاب و لوازم‌تحریر",
    price: 245_000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    title: "بازی فکری چوبی",
    category: "کودک و نوزاد",
    price: 380_000,
    originalPrice: 460_000,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&h=400&fit=crop",
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-8 pb-6 sm:space-y-12">
      <section className="shop-section-space">
        <HeroSection />
      </section>
      <section className="shop-section-space">
        <CategoriesSection />
      </section>

      <section className="shop-section-space bg-secondary py-5">
        <ProductSlider
          title="پیشنهادهای خوش‌قیمت"
          products={dealProducts}
          priority
        />
      </section>

      <section className="shop-section-space bg-card py-5">
        <ProductSlider title="محبوب‌های این روزها" products={popularProducts} />
      </section>
      <section className="shop-section-space">
        <LifestyleSection />
      </section>

      <section className="shop-section-space">
        <FeaturesSection />
      </section>
      <section className="shop-section-space">
        <ReviewsSection />
      </section>
      <section className="shop-section-space">
        <NewsletterSection />
      </section>
    </div>
  );
}
