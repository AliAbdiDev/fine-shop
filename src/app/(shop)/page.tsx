import { Suspense, type ReactNode } from "react";

import { ProductCard } from "@/core/features/shop/components/card/ProductCard";
import { CategoriesSection } from "@/core/features/shop/components/landing/categories-section";
import { FeaturesSection } from "@/core/features/shop/components/landing/features-section";
import { HeroSection } from "@/core/features/shop/components/landing/hero/hero-section";
import { LifestyleSection } from "@/core/features/shop/components/landing/lifestyle-section";
import { NewsletterSection } from "@/core/features/shop/components/landing/newsletter-section";
import { ReviewsSection } from "@/core/features/shop/components/landing/reviews-section";
import { ProductSliderClient } from "@/core/features/shop/components/product-slider/product-slider";
import { SliderSkeleton } from "@/core/features/shop/components/skeletons/slider-skeleton";
import { productsAction } from "@/core/services/server/misc-action";
import { cn } from "@/core/utils/helpers";

interface SliderSectionProps {
  tone?: "secondary" | "card";
  children: ReactNode;
}

function SliderSection({ tone = "secondary", children }: SliderSectionProps) {
  return (
    <section
      className={cn(
        "shop-section-space py-5",
        tone === "secondary" ? "bg-secondary" : "bg-card",
      )}
    >
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Sliders                                   */
/* -------------------------------------------------------------------------- */

async function EconomicalSlider() {
  const result = await productsAction({ sort: "price_asc", pageSize: 6 });

  if (!result.ok || !result.data?.length) return null;

  return (
    <SliderSection tone="secondary">
      <ProductSliderClient title={"پیشنهادهای خوش‌قیمت"}>
        {result.data.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i === 0} />
        ))}
      </ProductSliderClient>
    </SliderSection>
  );
}

async function PopularSlider() {
  const result = await productsAction({ sort: "popular", pageSize: 6 });

  if (!result.ok || !result.data?.length) return null;

  return (
    <SliderSection tone="card">
      <ProductSliderClient title={"محبوب‌های این روزها"}>
        {result.data.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i === 0} />
        ))}
      </ProductSliderClient>
    </SliderSection>
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
          <SliderSection tone="secondary">
            <SliderSkeleton />
          </SliderSection>
        }
      >
        <EconomicalSlider />
      </Suspense>

      <Suspense
        fallback={
          <SliderSection tone="card">
            <SliderSkeleton />
          </SliderSection>
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
