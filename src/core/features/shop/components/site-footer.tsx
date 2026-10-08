import Link from "next/link";

import { BadgeCheck, Lock, Phone, Send, ShoppingBag } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";

// Custom Instagram icon (replacement for lucide-react)
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const columns = [
  {
    title: "همراه بازرنو",
    links: ["درباره ما", "تماس با ما", "مجله بازرنو", "همکاری با بازرنو"],
  },
  {
    title: "راهنمای خرید",
    links: ["ثبت سفارش", "روش‌های پرداخت", "شیوه‌های ارسال", "پیگیری سفارش"],
  },
  {
    title: "خدمات مشتریان",
    links: [
      "پرسش‌های متداول",
      "شرایط بازگشت کالا",
      "حریم خصوصی",
      "قوانین و مقررات",
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-tertiary text-tertiary-foreground">
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-7 md:px-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr_1.3fr]">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <div className="flex flex-col">
                {/* extra bold */}
                <span className="font-vazir-bold text-2xl leading-tight text-white">
                  بازرنو
                </span>
                <span className="text-[10px]">انتخاب‌های خوب، هر روز</span>
              </div>
            </div>

            <p className="text-[13px] leading-loose">
              بازارنو، جایی برای انتخاب‌های خوب؛ فروشگاهی برای نیازهای روزمره و
              چیزهایی که به زندگی رنگ تازه می‌دهند.
            </p>

            <div className="flex flex-col items-start gap-3 pt-1">
              <span className="text-xs">در ارتباط بمانیم</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-tertiary-foreground h-9 w-9 rounded-lg border border-white/20 hover:bg-white/10 hover:text-white"
                  render={
                    <a
                      href="https://t.me/bazarno"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  nativeButton={false}
                  aria-label="تلگرام"
                >
                  <Send className="h-4 w-4" strokeWidth={1.7} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-tertiary-foreground h-9 w-9 rounded-lg border border-white/20 hover:bg-white/10 hover:text-white"
                  render={
                    <a
                      href="https://instagram.com/bazarno"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  nativeButton={false}
                  aria-label="اینستاگرام"
                >
                  <InstagramIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-tertiary-foreground h-9 w-9 rounded-lg border border-white/20 hover:bg-white/10 hover:text-white"
                  nativeButton={false}
                  aria-label="شماره تماس"
                >
                  <Phone />
                </Button>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h3 className="font-vazir-bold text-sm text-white">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-xs transition-colors hover:text-white"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Support column */}
          <div className="space-y-3">
            <h3 className="font-vazir-bold text-sm text-white">
              پاسخگویی شما هستیم
            </h3>

            {/* extra bold */}
            <p className="font-vazir-bold text-2xl text-white">۰۲۱۹۱۰۰۱۲۳۴</p>

            <p className="text-xs">هر روز از ساعت ۹ تا ۲۱</p>

            <p className="text-xs">hello@bazarno.ir</p>

            <div className="flex gap-2.5 pt-3">
              <div className="flex h-21 w-21.5 flex-col items-center justify-center gap-1.5 rounded-lg bg-white/5">
                <BadgeCheck className="h-6.5 w-6.5" strokeWidth={1.7} />
                <span className="text-center text-[10px]">ضمانت اصالت</span>
              </div>
              <div className="flex h-[84px] w-21.5 flex-col items-center justify-center gap-1.5 rounded-lg bg-white/5">
                <Lock className="h-[26px] w-[26px]" strokeWidth={1.7} />
                <span className="text-center text-[10px]">پرداخت امن</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-8 bg-white/15" />

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-2 text-[10px] md:flex-row md:text-[11px]">
          <p>بازرنو؛ یک فروشگاه مفهومی برای انتخاب‌های تازه</p>
          <p>© ۱۴۰۵ بازرنو. همه حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
