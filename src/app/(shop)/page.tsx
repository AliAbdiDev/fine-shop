import { Suspense } from "react";

import {
  EconomicalSlider,
  PopularSlider,
} from "@/core/features/shop/components/landing/cache-silder";
import { CategoriesSection } from "@/core/features/shop/components/landing/categories-section";
import { FeaturesSection } from "@/core/features/shop/components/landing/features-section";
import { HeroSection } from "@/core/features/shop/components/landing/hero/hero-section";
import { LifestyleSection } from "@/core/features/shop/components/landing/lifestyle-section";
import { NewsletterSection } from "@/core/features/shop/components/landing/newsletter-section";
import { ReviewsSection } from "@/core/features/shop/components/landing/reviews-section";
import { SectionSlider } from "@/core/features/shop/components/Section";
import { SliderSkeleton } from "@/core/features/shop/components/skeletons/slider-skeleton";

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
