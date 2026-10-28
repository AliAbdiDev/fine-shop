import { ProductCard } from "@/core/features/shop/components/card/ProductCard";
import {
  productsAsc,
  productsPopular,
} from "@/core/services/server/misc-cache";

import { ProductSliderWrapper } from "../ProductSliderWrapper";
import { SectionSlider } from "../Section";

export async function EconomicalSlider() {
  const result = await productsAsc();
  if (!result.ok || result.data?.length === 0) return null;

  return (
    <SectionSlider tone="secondary">
      <ProductSliderWrapper title={"پیشنهادهای خوش‌قیمت"}>
        {result.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductSliderWrapper>
    </SectionSlider>
  );
}

export async function PopularSlider() {
  const result = await productsPopular();
  if (!result.ok || result.data?.length === 0) return null;

  return (
    <SectionSlider tone="card">
      <ProductSliderWrapper title={"محبوب‌های این روزها"}>
        {result.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductSliderWrapper>
    </SectionSlider>
  );
}
