import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { VerticalCard } from "@/core/components/custom/verticalCard";
import { toPersianNum } from "@/core/utils/helpers";

const cards = [
  {
    category: "سفر و ماجراجویی",
    title: "سبک‌بار، راهی روزهای تازه",
    description: "همراهی‌های کاربردی برای سفر و ماجراجویی‌های تازه",
    count: 42,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
  },
  {
    category: "خانه و آرامش",
    title: "خانه‌ای برای آرام گرفتن",
    description: "جزئیات کوچک برای دکورهای دوست‌داشتنی خانه",
    count: 35,
    image:
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=600&fit=crop",
  },
  {
    category: "زیبایی و حال خوب",
    title: "وقتی برای خودت",
    description: "یک فنجان آرامش، یک کتاب و کمی رسیدگی به خود.",
    count: 28,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop",
  },
];

export function LifestyleSection() {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between">
        <h2 className="font-vazir-bold text-lg sm:text-xl">
          انتخاب‌هایی با یک حال‌وهوا
        </h2>
        <Link
          href="/shop"
          className="text-primary flex items-center gap-1 text-xs"
        >
          همه مجموعه‌ها
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card, i) => (
          <VerticalCard
            key={card.title}
            image={"/images/landing/lifestyle" + (i + 1) + ".png"}
            imageAlt={card.title}
            href="#"
            aspect="4/3"
            contentClassName="bg-secondary p-5"
            className="rounded-lg"
          >
            {/* extra bold */}
            <p className="text-primary font-vazir-bold text-[10px] sm:text-xs">
              {card.category}
            </p>

            {/* extra bold */}
            <h3 className="font-vazir-bold text-center text-base sm:text-lg">
              {card.title}
            </h3>

            <p className="text-muted-foreground text-center text-[11px] leading-relaxed sm:text-xs">
              {card.description}
            </p>

            <div className="mt-auto flex items-center justify-between pt-3">
              <span className="text-foreground/70 text-[10px] sm:text-xs">
                دیدن مجموعه
                <span className="text-muted-foreground mx-1">•</span>
                {toPersianNum(card.count)} انتخاب
              </span>
              <ArrowLeft className="text-primary h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </VerticalCard>
        ))}
      </div>
    </section>
  );
}
