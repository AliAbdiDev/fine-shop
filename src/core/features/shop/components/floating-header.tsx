"use client";

import { type Route } from "next";

import Link from "next/link";

import { User, ShoppingBag, LogOut, Settings, Heart } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";

const categories: {
  label: string;
  href: Route;
}[] = [
  { label: "کالای دیجیتال", href: "#" },
  { label: "مد و پوشاک", href: "#" },
  { label: "خانه و آشپزخانه", href: "#" },
  { label: "زیبایی و سلامت", href: "#" },
];

export function FloatingHeader() {
  return (
    <header
      dir="rtl"
      className="bg-background/80 supports-backdrop-filter:bg-background/60 fixed inset-x-0 top-3 z-50 mx-auto w-[calc(100%-1.5rem)] max-w-6xl rounded-2xl border shadow-sm backdrop-blur-md"
    >
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <ShoppingBag className="text-primary h-5 w-5" />
          <span className="hidden sm:inline">فروشگاه من</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        {/* دکمه دسته‌بندی موبایل */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="md:hidden"
            render={
              <Button variant="ghost" size="sm" className="text-sm">
                دسته‌بندی‌ها
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="w-48">
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat.href}
                render={<Link href={cat.href} />}
              >
                {cat.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* دراپ‌داون اکانت */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="حساب کاربری">
                <User className="h-5 w-5" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>حساب من</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem render={<Link href="#" />}>
              <User className="h-4 w-4" />
              پروفایل
            </DropdownMenuItem>

            <DropdownMenuItem render={<Link href="#" />}>
              <ShoppingBag className="h-4 w-4" />
              سفارش‌های من
            </DropdownMenuItem>

            <DropdownMenuItem render={<Link href="#" />}>
              <Heart className="h-4 w-4" />
              علاقه‌مندی‌ها
            </DropdownMenuItem>

            <DropdownMenuItem render={<Link href="#" />}>
              <Settings className="h-4 w-4" />
              تنظیمات
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive">
              <LogOut className="h-4 w-4" />
              خروج از حساب
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
