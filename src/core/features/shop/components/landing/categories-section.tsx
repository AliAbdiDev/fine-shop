import Image from "next/image";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { Card } from "@/core/components/ui/card";
import { cn } from "@/core/utils/helpers";
import { toPersianNum } from "@/core/utils/helpers";

interface CategoryItem {
  title: string;
  count: number;
}

const items: CategoryItem[] = [
  {
    title: "کودک و اسباب‌بازی",
    count: 600,
  },
  {
    title: "کتاب و لوازم‌تحریر",
    count: 1500,
  },
  {
    title: "ورزش و سفر",
    count: 750,
  },
  {
    title: "زیبایی و سلامت",
    count: 900,
  },

  {
    title: "خانه و آشپزخانه",
    count: 1800,
  },
  {
    title: "مد و پوشاک",
    count: 2400,
  },
  {
    title: "دیجیتال",
    count: 1200,
  },
];

export function CategoriesSection() {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <h2 className="font-vazir-bold text-lg sm:text-xl">
          برای هر سلیقه، یک انتخاب
        </h2>
        <Link href="#" className="text-primary flex items-center gap-1 text-xs">
          همه دسته‌بندی‌ها
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-7">
        {items.map((item, i) => (
          <Link key={item.title} href={`#/${item.title}`}>
            <Card
              className={cn(
                "border-border bg-secondary flex h-41.5 flex-col items-center justify-start gap-3 rounded-2xl border px-3 py-5 text-center shadow-none ring-0 transition",
                "hover:brightness-95",
              )}
            >
              {/* Image */}
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

              {/* Text */}
              <div className="flex flex-col gap-1">
                {/* extra bold */}
                <p className="font-vazir-bold text-xs sm:text-[13px]">
                  {item.title}
                </p>
                <p className="text-muted-foreground text-[10px] sm:text-[11px]">
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
