import { Star } from "lucide-react";

import { SectionHeader } from "../Section";

const stats = [
  { value: "۴.۸ از ۵", label: "امتیاز تجربه خرید" },
  { value: "۹۶٪", label: "رضایت مشتریان" },
  { value: "+۱۲,۰۰۰", label: "مشتری خوشحال" },
];

const reviews = [
  {
    text: "از این خریدها راضی‌ام و روزی که مرسوم هم نیست همکاری می‌کنم. ارسال سریع و بسته‌بندی عالی بود.",
    name: "سارا محمدی",
    role: "خریدار - اصفهان",
    rating: 5,
  },
  {
    text: "کیفیت کالا واقعاً عالیه. تجربه خرید از سایت راحت بود و پشتیبانی هم سریع جواب داد.",
    name: "رضا کریمی",
    role: "خریدار - شیراز",
    rating: 5,
  },
  {
    text: "قیمت‌ها منصفانه و ارسال به‌موقع. حتماً باز هم از بارزونو خرید می‌کنم.",
    name: "نگار احمدی",
    role: "خریدار - تهران",
    rating: 4,
  },
];

export function ReviewsSection() {
  return (
    <div className="space-y-12">
      <SectionHeader title="از زبان همراهان بارزونو" linkText="همه دیدگاه‌ها" />

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="text-brand-dark">
            <p className="font-vazir-bold text-tertiary-strong text-xl sm:text-3xl">
              {s.value}
            </p>
            <p className="text-muted-foreground text-2xs mt-1 sm:text-xs">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="border-border bg-secondary space-y-3 rounded-2xl border p-4 sm:p-5"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < r.rating
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <p className="text-foreground/80 text-xs leading-relaxed sm:text-sm">
              {r.text}
            </p>
            <div className="border-border border-t pt-3">
              <p className="font-vazir-bold text-xs">{r.name}</p>
              <p className="text-muted-foreground text-[10px]">{r.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
