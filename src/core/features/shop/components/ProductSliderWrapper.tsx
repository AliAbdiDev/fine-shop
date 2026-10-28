// ProductSliderWrapper.tsx
"use client";

import type { ReactNode } from "react";

import dynamic from "next/dynamic";

import { SliderSkeleton } from "./skeletons/slider-skeleton";

const ProductSliderClient = dynamic(
  () => import("./product-slider").then((mod) => mod.ProductSliderClient),
  {
    ssr: false,
    loading: () => <SliderSkeleton />,
  },
);

interface ProductSliderWrapperProps {
  title: string;
  children: ReactNode;
}

export function ProductSliderWrapper({
  title,
  children,
}: ProductSliderWrapperProps) {
  return <ProductSliderClient title={title}>{children}</ProductSliderClient>;
}
