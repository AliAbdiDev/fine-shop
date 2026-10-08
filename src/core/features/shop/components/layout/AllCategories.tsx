"use client";

import * as React from "react";

import Link from "next/link";

import { LayoutGrid } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/core/components/ui/accordion";
import { Button } from "@/core/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { Separator } from "@/core/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/core/components/ui/sheet";
import { cn } from "@/core/utils/helpers";

export interface Category {
  title: string;
  subcategories?: string[];
}

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */

function hasSubcategories(cat: Category): boolean {
  return Boolean(cat.subcategories && cat.subcategories.length > 0);
}

/* ─────────────────────────────────────────────
   Shared trigger — MUST forward props
   ───────────────────────────────────────────── */

function TriggerButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      className="font-vazir-bold h-auto shrink-0 gap-1.5 px-0 text-[13px] hover:bg-transparent"
      {...props}
    >
      <LayoutGrid className="h-4 w-4" />
      همه دسته‌ها
    </Button>
  );
}

/* ─────────────────────────────────────────────
   Desktop: Popover + Mega Menu
   ───────────────────────────────────────────── */

export function DesktopAllCategories({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = React.useState(false);

  /* Close popover when any link is clicked */
  const handleClose = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<TriggerButton />} />
      <PopoverContent
        align="start"
        sideOffset={12}
        className="w-[900px] max-w-[95vw] p-6"
      >
        <div className="grid grid-cols-4 gap-x-8 gap-y-6">
          {categories.map((cat) => (
            <div key={cat.title} className="space-y-3">
              <Link
                href={`#/${cat.title}`}
                onClick={handleClose}
                className="font-vazir-bold hover:text-primary flex items-center gap-2 text-sm transition-colors"
              >
                {cat.title}
              </Link>

              {hasSubcategories(cat) ? (
                <ul className="space-y-2">
                  {cat.subcategories!.map((sub) => (
                    <li key={sub}>
                      <Link
                        href={`#/${cat.title}/${sub}`}
                        onClick={handleClose}
                        className="text-muted-foreground hover:text-primary text-xs transition-colors"
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>

        <Separator className="my-5" />
        <Link
          href="/#"
          onClick={handleClose}
          className="font-vazir-bold text-primary hover:text-primary/80 block text-center text-xs transition-colors"
        >
          مشاهده همه دسته‌بندی‌ها
        </Link>
      </PopoverContent>
    </Popover>
  );
}

/* ─────────────────────────────────────────────
   Mobile: Sheet from bottom
   - If subcategories exist → Accordion
   - Otherwise → plain Link (selectable item)
   ───────────────────────────────────────────── */

export function MobileAllCategories({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = React.useState(false);

  /* Close sheet when any link is clicked */
  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<TriggerButton />} />
      <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl p-0">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-vazir-bold text-base">
            همه دسته‌ها
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto px-5 pb-6">
          <Accordion className="w-full border-none">
            {categories.map((cat) => {
              /* ── No subcategories: render selectable Link ── */
              if (!hasSubcategories(cat)) {
                return (
                  <Link
                    key={cat.title}
                    href={`#/${cat.title}`}
                    onClick={handleClose}
                    className={cn(
                      "font-vazir-bold hover:text-primary flex h-12 items-center border-b text-sm transition-colors",
                    )}
                  >
                    {cat.title}
                  </Link>
                );
              }

              /* ── Has subcategories: render Accordion item ── */
              return (
                <AccordionItem key={cat.title} value={cat.title}>
                  <AccordionTrigger className="font-vazir-bold hover:text-primary hover:no-underline">
                    <span className="flex items-center gap-2 text-sm">
                      {cat.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2.5 pr-6">
                      {cat.subcategories!.map((sub) => (
                        <li key={sub}>
                          <Link
                            href={`#/${cat.title}/${sub}`}
                            onClick={handleClose}
                            className="text-muted-foreground hover:text-primary block text-xs transition-colors"
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={`#/${cat.title}`}
                          onClick={handleClose}
                          className="text-primary font-vazir-bold block pt-1 text-xs"
                        >
                          مشاهده همه {cat.title}
                        </Link>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
