import Link from "next/link";

import { BadgePercent, Search, ShoppingBag, Truck } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Separator } from "@/core/components/ui/separator";
import { cn } from "@/core/utils/helpers";

import {
  type Category,
  DesktopAllCategories,
  MobileAllCategories,
} from "./AllCategories";
import { UserActions } from "./UserActions";

const categories: Category[] = [
  {
    title: "کل محصولات",
  },
  {
    title: "دیجیتال",
  },
  {
    title: "مد و پوشاک",
  },
  {
    title: "خانه و آشپزخانه",
  },
  {
    title: "زیبایی و سلامت",
  },
  {
    title: "ورزش و سفر",
  },
  {
    title: "کتاب و لوازم‌تحریر",
  },
  {
    title: "کودک و نوزاد",
  },
  {
    title: "سوپرمارکت",
  },
];

/* ─────────────────────────────────────────────
   Shared components
   ───────────────────────────────────────────── */

function Logo({ showSubtitle = true }: { showSubtitle?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl">
        <ShoppingBag className="h-5 w-5" />
      </span>
      <div className="flex flex-col items-start">
        {/* extra bold */}
        <span className="font-vazir-bold text-lg leading-tight">بارزونو</span>
        {showSubtitle && (
          <span className="text-muted-foreground text-[10px]">
            انتخاب‌های خوب، هر روز
          </span>
        )}
      </div>
    </Link>
  );
}

function SearchBar({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        placeholder="دنبال چه چیزی می‌گردید؟"
        className="bg-background border-border h-10 w-full rounded-lg pl-10"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Desktop header
   ───────────────────────────────────────────── */

function DesktopHeader() {
  return (
    <header className="border-border bg-card border-b">
      <div className="shop-section-space mx-auto flex items-center gap-3 py-3 md:gap-6">
        <Logo showSubtitle />
        <SearchBar className="flex-1" />
        <UserActions showText />
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   Mobile header
   ───────────────────────────────────────────── */

function MobileHeader() {
  return (
    <header className="border-border bg-card border-b">
      <div className="shop-section-space mx-auto flex items-center gap-3 py-3">
        <Logo showSubtitle={false} />
        <UserActions showText={false} />
      </div>
      <div className="px-5 pb-3">
        <SearchBar />
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   Desktop navigation
   ───────────────────────────────────────────── */

function DesktopNav() {
  return (
    <nav className="border-border bg-card shop-section-space border-b py-4">
      <div className="flex items-center gap-4">
        <DesktopAllCategories categories={categories} />
        <Separator orientation="vertical" className="bg-border h-4 shrink-0" />
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-5 overflow-x-auto">
            {categories?.slice(0, 5).map((cat) => (
              <Link
                key={cat.title}
                href={`#/${cat.title}`}
                className="text-foreground hover:text-primary shrink-0 text-xs whitespace-nowrap transition-colors"
              >
                {cat.title}
              </Link>
            ))}
          </div>
          <Button
            variant="ghost"
            className="font-vazir-bold text-primary hover:text-primary ms-auto h-auto shrink-0 gap-1.5 px-0 text-[13px] hover:bg-transparent"
            render={<Link href="#" />}
            nativeButton={false}
          >
            <BadgePercent />
            پیشنهادهای ویژه
          </Button>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   Mobile navigation
   ───────────────────────────────────────────── */

function MobileNav() {
  return (
    <nav className="border-border bg-card shop-section-space border-b py-4">
      <div className="flex items-center justify-between">
        <MobileAllCategories categories={categories} />
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="font-vazir-bold text-primary hover:text-primary h-auto shrink-0 gap-1.5 px-0 text-[13px] hover:bg-transparent"
            render={<Link href="#" />}
            nativeButton={false}
          >
            پیشنهادهای ویژه
          </Button>
          <Button
            variant="ghost"
            className="font-vazir-bold h-auto shrink-0 gap-1.5 px-0 text-[13px] hover:bg-transparent"
            render={<Link href="#" />}
            nativeButton={false}
          >
            پرفروش ها
          </Button>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   Announcement bar
   ───────────────────────────────────────────── */

function AnnouncementBar() {
  return (
    <div className="bg-tertiary text-tertiary-foreground py-2 text-center text-[11px]">
      <span className="inline-flex items-center gap-1.5">
        <Truck className="h-3.5 w-3.5" />
        ارسال رایگان سفارش‌های بالای ۱ میلیون تومان
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component (Server Component)
   ───────────────────────────────────────────── */

export function SiteHeader() {
  return (
    <>
      <AnnouncementBar />

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopHeader />
        <DesktopNav />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <MobileHeader />
        <MobileNav />
      </div>
    </>
  );
}
