import { ArrowLeft } from "lucide-react";

import { VerticalCard } from "@/core/components/custom/verticalCard";
import { toPersianNum } from "@/core/utils/helpers";

import { SectionHeader } from "../Section";

const cards = [
  {
    category: "سفر و ماجراجویی",
    title: "سبک‌بار، راهی روزهای تازه",
    description: "همراهی‌های کاربردی برای سفر و ماجراجویی‌های تازه",
    count: 42,
  },
  {
    category: "خانه و آرامش",
    title: "خانه‌ای برای آرام گرفتن",
    description: "جزئیات کوچک برای دکورهای دوست‌داشتنی خانه",
    count: 35,
  },
  {
    category: "زیبایی و حال خوب",
    title: "وقتی برای خودت",
    description: "یک فنجان آرامش، یک کتاب و کمی رسیدگی به خود.",
    count: 28,
  },
];

export function LifestyleSection() {
  return (
    <section className="space-y-5">
      <SectionHeader
        title="انتخاب‌هایی با یک حال‌وهوا"
        href="/shop"
        linkText="همه مجموعه‌ها"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card, i) => (
          <VerticalCard
            key={card.title}
            image={`/images/landing/lifestyle${i + 1}.png`}
            imageAlt={card.title}
            href="#"
            aspect="4/3"
            contentClassName="bg-secondary group p-5"
            className="rounded-lg"
          >
            <p className="text-primary font-vazir-bold text-[10px] sm:text-xs">
              {card.category}
            </p>

            <h3 className="font-vazir-bold text-center text-base sm:text-lg">
              {card.title}
            </h3>

            <p className="text-muted-foreground text-2xs text-center leading-relaxed sm:text-xs">
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
