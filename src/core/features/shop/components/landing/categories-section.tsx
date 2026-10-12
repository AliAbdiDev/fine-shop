import Image from "next/image";
import Link from "next/link";

import { Card } from "@/core/components/ui/card";
import { cn, toPersianNum } from "@/core/utils/helpers";

import { SectionHeader } from "../Section";

interface CategoryItem {
  title: string;
  count: number;
}

const items: CategoryItem[] = [
  { title: "کودک و اسباب‌بازی", count: 600 },
  { title: "کتاب و لوازم‌تحریر", count: 1500 },
  { title: "ورزش و سفر", count: 750 },
  { title: "زیبایی و سلامت", count: 900 },
  { title: "خانه و آشپزخانه", count: 1800 },
  { title: "مد و پوشاک", count: 2400 },
  { title: "دیجیتال", count: 1200 },
];

export function CategoriesSection() {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="برای هر سلیقه، یک انتخاب"
        href="#"
        linkText="همه دسته‌بندی‌ها"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 xl:grid-cols-7">
        {items.map((item, i) => (
          <Link key={item.title} href={`/shop`}>
            <Card
              className={cn(
                "border-border bg-secondary flex h-41.5 flex-col items-center justify-start gap-3 rounded-2xl border px-3 py-5 text-center shadow-none ring-0 transition",
                "hover:brightness-95",
              )}
            >
              <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                <Image
                  src={`/images/landing/cats/cat-${i + 1}.png`}
                  alt={item.title}
                  fill
                  quality={85}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 96px, 120px"
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col gap-1">
                <p className="font-vazir-bold text-xs sm:text-[13px]">
                  {item.title}
                </p>
                <p className="text-muted-foreground sm:text-2xs text-[10px]">
                  بیش از {toPersianNum(item.count)} کالا
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
