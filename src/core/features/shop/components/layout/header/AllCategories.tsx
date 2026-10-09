"use client";

import * as React from "react";

import Link from "next/link";

import { useVirtualizer } from "@tanstack/react-virtual";
import { LayoutGrid } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/core/components/ui/sheet";

export interface Category {
  title: string;
}

/* ─────────────────────────────────────────────
   Shared trigger
   ───────────────────────────────────────────── */

function TriggerButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      className="font-vazir-bold h-auto shrink-0 gap-1.5 px-0 text-[13px] hover:bg-transparent"
      {...props}
    >
      <LayoutGrid className="h-4 w-4" aria-hidden />
      همه دسته‌ها
    </Button>
  );
}

/* ─────────────────────────────────────────────
   Virtualized list (shared by desktop + mobile)
   ───────────────────────────────────────────── */

const ROW_HEIGHT_DESKTOP = 40;
const ROW_HEIGHT_MOBILE = 48;

interface VirtualizedCategoryListProps {
  categories: Category[];
  /** Height of each row in px. */
  rowHeight: number;
  /** Extra rows rendered above/below the viewport for smooth scrolling. */
  overscan?: number;
  /** Called when a category link is clicked. */
  onSelect: () => void;
  /** Class applied to each row's anchor. */
  itemClassName: string;
}

function VirtualizedCategoryList({
  categories,
  rowHeight,
  overscan = 6,
  onSelect,
  itemClassName,
}: VirtualizedCategoryListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: categories.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  return (
    <div ref={parentRef} className="overflow-y-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const cat = categories[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Link
                href={`#/${cat.title}`}
                onClick={onSelect}
                className={itemClassName}
              >
                {cat.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Desktop: Popover dropdown
   ───────────────────────────────────────────── */

export function DesktopAllCategories({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<TriggerButton />} />
      <PopoverContent
        align="start"
        sideOffset={12}
        className="w-64 overflow-hidden p-2"
      >
        {/* Fixed max-height on the scroll container so the virtualizer has
            a stable viewport to measure. 8 rows × 40px + padding ≈ 320px. */}
        <div className="max-h-80">
          <VirtualizedCategoryList
            categories={categories}
            rowHeight={ROW_HEIGHT_DESKTOP}
            onSelect={handleClose}
            itemClassName="hover:bg-muted hover:text-primary flex h-full items-center rounded-md px-3 text-[13px] transition-colors"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ─────────────────────────────────────────────
   Mobile: Sheet from bottom
   ───────────────────────────────────────────── */

export function MobileAllCategories({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = React.useState(false);
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

        {/* The header takes ~64px; the rest of the sheet scrolls. */}
        <div className="max-h-[calc(85vh-64px)] px-5 pb-6">
          <VirtualizedCategoryList
            categories={categories}
            rowHeight={ROW_HEIGHT_MOBILE}
            onSelect={handleClose}
            itemClassName="hover:text-primary flex h-full items-center border-b text-sm transition-colors"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
