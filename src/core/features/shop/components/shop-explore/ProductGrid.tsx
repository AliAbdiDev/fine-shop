import { type Route } from "next";

import { VerticalCard } from "@/core/components/custom/verticalCard";

interface Product {
  id: number;
  title: string;
  price: string;
  description: string;
  badge: string;
  footer: string;
}

const products: Product[] = [
  {
    id: 1,
    title: "هدفون بلوتوثی",
    price: "۲,۴۰۰,۰۰۰ تومان",
    description: "صدای شفاف با نویز کنسلینگ",
    badge: "٪۲۰ تخفیف",
    footer: "ارسال رایگان",
  },
  {
    id: 2,
    title: "کوله‌پشتی",
    price: "۱,۲۰۰,۰۰۰ تومان",
    description: "ضدآب، مناسب سفر و کار",
    badge: "جدید",
    footer: "ارسال رایگان",
  },
  {
    id: 3,
    title: "ساعت هوشمند",
    price: "۳,۸۰۰,۰۰۰ تومان",
    description: "پایش ضربان قلب و خواب",
    badge: "٪۱۵ تخفیف",
    footer: "ارسال رایگان",
  },
  {
    id: 4,
    title: "کفش ورزشی",
    price: "۲,۱۰۰,۰۰۰ تومان",
    description: "سبک و راحت برای دویدن",
    badge: "پرفروش",
    footer: "ارسال رایگان",
  },
  {
    id: 5,
    title: "عینک آفتابی",
    price: "۸۵۰,۰۰۰ تومان",
    description: "UV400، فریم سبک",
    badge: "٪۱۰ تخفیف",
    footer: "ارسال رایگان",
  },
  {
    id: 6,
    title: "کیف چرمی",
    price: "۱,۶۰۰,۰۰۰ تومان",
    description: "چرم طبیعی، دست‌دوز",
    badge: "محدود",
    footer: "ارسال رایگان",
  },
  {
    id: 6,
    title: "کیف چرمی",
    price: "۱,۶۰۰,۰۰۰ تومان",
    description: "چرم طبیعی، دست‌دوز",
    badge: "محدود",
    footer: "ارسال رایگان",
  },
  {
    id: 6,
    title: "کیف چرمی",
    price: "۱,۶۰۰,۰۰۰ تومان",
    description: "چرم طبیعی، دست‌دوز",
    badge: "محدود",
    footer: "ارسال رایگان",
  },
  {
    id: 6,
    title: "کیف چرمی",
    price: "۱,۶۰۰,۰۰۰ تومان",
    description: "چرم طبیعی، دست‌دوز",
    badge: "محدود",
    footer: "ارسال رایگان",
  },
  {
    id: 6,
    title: "کیف چرمی",
    price: "۱,۶۰۰,۰۰۰ تومان",
    description: "چرم طبیعی، دست‌دوز",
    badge: "محدود",
    footer: "ارسال رایگان",
  },
  {
    id: 6,
    title: "کیف چرمی",
    price: "۱,۶۰۰,۰۰۰ تومان",
    description: "چرم طبیعی، دست‌دوز",
    badge: "محدود",
    footer: "ارسال رایگان",
  },
  {
    id: 6,
    title: "کیف چرمی",
    price: "۱,۶۰۰,۰۰۰ تومان",
    description: "چرم طبیعی، دست‌دوز",
    badge: "محدود",
    footer: "ارسال رایگان",
  },
];

export function ProductGrid() {
  return (
    <div className="xs:grid-cols-2 grid gap-3 sm:gap-4 xl:grid-cols-3">
      {products.map((product, i) => (
        <VerticalCard
          key={i}
          href={`/product/${product.id}` as Route}
          image={undefined}
          imageAlt={product.title}
          badge={product.badge}
          title={product.title}
          description={product.description}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        >
          <p className="text-primary font-vazir-bold text-sm">
            {product.price}
          </p>
        </VerticalCard>
      ))}
    </div>
  );
}
