import { ProductCard } from "@/core/features/shop/components/card/ProductCard";
import {
  productsAsc,
  productsPopular,
} from "@/core/services/server/misc-cache";

import { ProductSliderWrapper } from "../shared/ProductSliderWrapper";
import { SectionSlider } from "../shared/Section";

export async function EconomicalSlider() {
  try {
    const result = await productsAsc();
    if (!result?.ok || !result.data || result.data.length === 0) {
      return <div className="hidden" aria-hidden="true" />;
    }

    return (
      <SectionSlider tone="secondary">
        <ProductSliderWrapper title={"پیشنهادهای خوش‌قیمت"}>
          {result.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductSliderWrapper>
      </SectionSlider>
    );
  } catch {
    return <div className="hidden" aria-hidden="true" />;
  }
}

export async function PopularSlider() {
  try {
    const result = await productsPopular();
    if (!result?.ok || !result.data || result.data.length === 0) {
      return <div className="hidden" aria-hidden="true" />;
    }

    return (
      <SectionSlider tone="card">
        <ProductSliderWrapper title={"محبوب‌های این روزها"}>
          {result.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductSliderWrapper>
      </SectionSlider>
    );
  } catch {
    return <div className="hidden" aria-hidden="true" />;
  }
}
