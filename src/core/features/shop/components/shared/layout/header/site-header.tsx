import { Suspense } from "react";

import { type Route } from "next";

import Link from "next/link";

import { BadgePercent, Search, Truck } from "lucide-react";

import { Logo } from "@/core/components/custom/Logos";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Separator } from "@/core/components/ui/separator";
import { getAllCategories } from "@/core/services/server/categorie";
import { type Categorys } from "@/core/types/entities.types";
import { cn } from "@/core/utils/helpers";

import { DesktopAllCategories, MobileAllCategories } from "./AllCategories";
import { UserActions } from "./UserActions";

/* ─────────────────────────────────────────────
   Shared components
   ───────────────────────────────────────────── */
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
function DesktopHeader({ className }: { className?: string }) {
  return (
    <header className={cn("border-border bg-card border-b", className)}>
      <div className="shop-section-space mx-auto flex items-center gap-3 pt-2 pb-0 md:gap-6">
        <Link href="/" className="w-fit">
          <Logo size="lg" priority type="logo" />
        </Link>
        <SearchBar className="flex-1" />
        <UserActions showText />
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   Mobile header
   ───────────────────────────────────────────── */
function MobileHeader({ className }: { className?: string }) {
  return (
    <header className={cn("border-border bg-card border-b", className)}>
      <div className="shop-section-space mx-auto flex items-center gap-3 py-3">
        <Link href="/">
          <Logo size="md" priority />
        </Link>
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
function DesktopNav({
  className,
  categories,
}: {
  className?: string;
  categories: Categorys;
}) {
  return (
    <nav
      className={cn(
        "border-border bg-card shop-section-space border-b py-2",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <DesktopAllCategories categories={categories} />
        <Separator orientation="vertical" className="shrink-0" />
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3 overflow-x-auto lg:gap-5">
            <Link
              href={`/shop`}
              className="text-foreground hover:text-primary text-2xs shrink-0 whitespace-nowrap transition-colors lg:text-xs"
            >
              کل محصولات
            </Link>
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.name}` as Route}
                className="text-foreground hover:text-primary text-2xs shrink-0 whitespace-nowrap transition-colors lg:text-xs"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <Button
            variant="ghost"
            className="font-vazir-bold text-primary hover:text-primary shrink-0 text-[13px] hover:bg-transparent"
            render={<Link href="/shop" />}
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
function MobileNav({
  className,
  categories,
}: {
  className?: string;
  categories: Categorys;
}) {
  return (
    <nav
      className={cn(
        "border-border bg-card shop-section-space border-b py-4",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <MobileAllCategories categories={categories} />
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="font-vazir-bold text-primary hover:text-primary text-2xs shrink-0 px-0 hover:bg-transparent"
            render={<Link href="/shop" />}
            nativeButton={false}
          >
            پیشنهادهای ویژه
          </Button>
          <Button
            variant="ghost"
            className="font-vazir-bold text-2xs h-auto shrink-0 gap-1.5 px-0 hover:bg-transparent"
            render={<Link href="/shop" />}
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
   Skeleton (matches DesktopNav + MobileNav)
   ───────────────────────────────────────────── */
function NavSkeleton() {
  return (
    <>
      {/* Desktop skeleton */}
      <div className="border-border bg-card shop-section-space border-b py-4 max-md:hidden">
        <div className="flex items-center gap-4">
          <div className="bg-muted h-9 w-36 animate-pulse rounded-md" />
          <div className="bg-border h-4 w-px shrink-0" />
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-muted h-3 w-14 animate-pulse rounded"
                />
              ))}
            </div>
            <div className="bg-muted h-4 w-28 animate-pulse rounded" />
          </div>
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="border-border bg-card shop-section-space border-b py-4 md:hidden">
        <div className="flex items-center justify-between">
          <div className="bg-muted h-9 w-32 animate-pulse rounded-md" />
          <div className="flex items-center gap-4">
            <div className="bg-muted h-4 w-24 animate-pulse rounded" />
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Announcement bar
   ───────────────────────────────────────────── */
function AnnouncementBar() {
  return (
    <div className="bg-tertiary text-tertiary-foreground text-2xs py-2 text-center">
      <span className="inline-flex items-center gap-1.5">
        <Truck className="h-3.5 w-3.5" />
        ارسال رایگان سفارش‌های بالای ۱ میلیون تومان
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Nav — fetches and passes categories down
   ───────────────────────────────────────────── */
async function Nav() {
  const r = await getAllCategories();

  const categories: Categorys = r.ok ? r.data : [];

  return (
    <>
      <DesktopNav className="max-md:hidden" categories={categories} />
      <MobileNav className="md:hidden" categories={categories} />
    </>
  );
}

/* ─────────────────────────────────────────────
   Main component (Server Component)
   ───────────────────────────────────────────── */

export async function SiteHeader() {
  return (
    <>
      <AnnouncementBar />
      <DesktopHeader className="max-md:hidden" />
      <MobileHeader className="md:hidden" />

      <Suspense fallback={<NavSkeleton />}>
        <Nav />
      </Suspense>
    </>
  );
}
