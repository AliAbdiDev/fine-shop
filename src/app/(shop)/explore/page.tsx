import { ProductGrid } from "@/core/features/shop/components/product-grid";
import { ResponsiveProductFilter } from "@/core/features/shop/components/responsive-product-filter";

const products = [
  {
    id: 1,
    image: "/images/p1.jpg",
    title: "هدفون بی‌سیم سونی WH-1000XM5",
    price: 18500000,
    originalPrice: 21000000,
    discount: 12,
    attributes: { color: "مشکی", warranty: "۱۸ ماه" },
  },
  {
    id: 2,
    image: "/images/p2.jpg",
    title: "ساعت هوشمند اپل واچ سری ۹",
    price: 24900000,
    originalPrice: 27500000,
    discount: 10,
    attributes: { color: "نقره‌ای", size: "۴۵mm" },
  },
  {
    id: 3,
    image: "/images/p3.jpg",
    title: "گوشی شیائومی ۱۳ پرو",
    price: 32000000,
    attributes: { color: "آبی", ram: "۱۲GB" },
  },
  {
    id: 4,
    image: "/images/p4.jpg",
    title: "لپ‌تاپ مک‌بوک ایر M3",
    price: 78000000,
    originalPrice: 85000000,
    discount: 8,
    attributes: { ram: "۸GB", storage: "۲۵۶GB" },
  },
];

export default function ExplorePage() {
  return (
    <div dir="rtl" className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-64 lg:shrink-0">
          <ResponsiveProductFilter />
        </div>
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
