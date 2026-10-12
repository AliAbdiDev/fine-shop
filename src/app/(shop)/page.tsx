import { Suspense } from "react";

import { ProductCard } from "@/core/features/shop/components/card/ProductCard";
import { CategoriesSection } from "@/core/features/shop/components/landing/categories-section";
import { FeaturesSection } from "@/core/features/shop/components/landing/features-section";
import { HeroSection } from "@/core/features/shop/components/landing/hero/hero-section";
import { LifestyleSection } from "@/core/features/shop/components/landing/lifestyle-section";
import { NewsletterSection } from "@/core/features/shop/components/landing/newsletter-section";
import { ReviewsSection } from "@/core/features/shop/components/landing/reviews-section";
import { ProductSliderClient } from "@/core/features/shop/components/product-slider";
import { SectionSlider } from "@/core/features/shop/components/Section";
import { SliderSkeleton } from "@/core/features/shop/components/skeletons/slider-skeleton";
import { productsAction } from "@/core/services/server/misc-action";

/* -------------------------------------------------------------------------- */
/*                                  Sliders                                   */
/* -------------------------------------------------------------------------- */

async function EconomicalSlider() {
  const result = await productsAction({ sort: "price_asc", pageSize: 6 });

  if (!result.ok || !result.data?.length) return null;

  return (
    <SectionSlider tone="secondary">
      <ProductSliderClient title={"پیشنهادهای خوش‌قیمت"}>
        {result.data.map((product, i) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductSliderClient>
    </SectionSlider>
  );
}

async function PopularSlider() {
  const result = await productsAction({ sort: "popular", pageSize: 6 });

  if (!result.ok || !result.data?.length) return null;

  return (
    <SectionSlider tone="card">
      <ProductSliderClient title={"محبوب‌های این روزها"}>
        {result.data.map((product, i) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductSliderClient>
    </SectionSlider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  return (
    <div className="space-y-8 pb-6 sm:space-y-12">
      <section className="shop-section-space">
        <HeroSection />
      </section>

      <section className="shop-section-space">
        <CategoriesSection />
      </section>

      <Suspense
        fallback={
          <SectionSlider tone="secondary">
            <SliderSkeleton />
          </SectionSlider>
        }
      >
        <EconomicalSlider />
      </Suspense>

      <Suspense
        fallback={
          <SectionSlider tone="card">
            <SliderSkeleton />
          </SectionSlider>
        }
      >
        <PopularSlider />
      </Suspense>

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
