"use client";

import { useCallback, useState, useTransition, type ReactNode } from "react";

import { type Route } from "next";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Check, Search, Star, X } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/core/components/ui/accordion";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { ScrollArea } from "@/core/components/ui/scroll-area";
// import { Switch } from "@/core/components/ui/switch";
import { cn, toPersianNum } from "@/core/utils/helpers";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

export interface FilterOption {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface ColorOption {
  id: number;
  name: string;
  slug: string;
  value: string;
}

export interface SizeOption {
  id: number;
  name: string;
  slug: string;
}

export interface FilterSidebarProps {
  categories: FilterOption[];
  brands: FilterOption[];
  colors: ColorOption[];
  sizes: SizeOption[];
  maxPrice: number;
  className?: string;
}

/* ─────────────────────────────────────────────
   URL state hook
   ───────────────────────────────────────────── */

type ParamValue = string | string[] | number | boolean | null | undefined;

function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const getArray = useCallback(
    (key: string): string[] => {
      const v = searchParams.get(key);
      return v ? v.split(",").filter(Boolean) : [];
    },
    [searchParams],
  );

  const getNumber = useCallback(
    (key: string): number | null => {
      const v = searchParams.get(key);
      if (!v) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    },
    [searchParams],
  );

  const getBool = useCallback(
    (key: string) => searchParams.get(key) === "1",
    [searchParams],
  );

  const setParams = useCallback(
    (updates: Record<string, ParamValue>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else if (typeof value === "boolean") {
          if (value) params.set(key, "1");
          else params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}` as Route, {
          scroll: false,
        });
      });
    },
    [router, pathname, searchParams],
  );

  const toggleArray = useCallback(
    (key: string, value: string) => {
      const current = getArray(key);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setParams({ [key]: next });
    },
    [getArray, setParams],
  );

  const clearAll = useCallback(() => {
    startTransition(() => {
      router.push(pathname as Route, { scroll: false });
    });
  }, [router, pathname]);

  const activeCount = Array.from(searchParams.keys()).filter(
    (k) => k !== "sort" && k !== "page",
  ).length;

  return {
    getArray,
    getNumber,
    getBool,
    setParams,
    toggleArray,
    clearAll,
    isPending,
    activeCount,
  };
}

/* ─────────────────────────────────────────────
   Section wrapper
   ───────────────────────────────────────────── */

function FilterSection({
  value,
  title,
  children,
}: {
  value: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <AccordionItem value={value} className="border-b-0">
      <AccordionTrigger className="font-vazir-bold py-3 text-sm hover:no-underline">
        {title}
      </AccordionTrigger>
      <AccordionContent className="pb-4">{children}</AccordionContent>
    </AccordionItem>
  );
}

/* ─────────────────────────────────────────────
   Checkbox list
   ───────────────────────────────────────────── */

function CheckboxList({
  paramKey,
  options,
  searchable = false,
  maxVisible = 8,
}: {
  paramKey: string;
  options: FilterOption[];
  searchable?: boolean;
  maxVisible?: number;
}) {
  const { getArray, toggleArray } = useFilters();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const selected = getArray(paramKey);

  const filtered = query
    ? options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))
    : options;

  const visible = expanded ? filtered : filtered.slice(0, maxVisible);
  const hasMore = !query && filtered.length > maxVisible;
  const hiddenCount = filtered.length - maxVisible;

  return (
    <div className="w-full min-w-0 space-y-3">
      {searchable && (
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو…"
            className="h-8 pr-9 text-xs"
          />
        </div>
      )}

      <ul className="w-full space-y-2.5">
        {visible.map((opt) => {
          const id = `${paramKey}-${opt.id}`;
          const checked = selected.includes(opt.slug);

          return (
            <li key={opt.id} className="w-full min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={() => toggleArray(paramKey, opt.slug)}
                    className="shrink-0"
                  />
                  <Label
                    htmlFor={id}
                    title={opt.name}
                    className="cursor-pointer truncate text-xs font-normal sm:text-[13px]"
                  >
                    {opt.name}
                  </Label>
                </div>
                {opt.count != null && (
                  <span className="text-muted-foreground shrink-0 text-[10px] tabular-nums">
                    {toPersianNum(opt.count)}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-primary text-xs hover:underline"
        >
          {expanded
            ? "نمایش کمتر"
            : `نمایش ${toPersianNum(hiddenCount)} مورد دیگر`}
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Price
   ───────────────────────────────────────────── */

function PriceFilter({ maxPrice }: { maxPrice: number }) {
  const { getNumber, setParams } = useFilters();
  const [min, setMin] = useState(() => getNumber("minPrice")?.toString() ?? "");
  const [max, setMax] = useState(() => getNumber("maxPrice")?.toString() ?? "");

  const apply = () => {
    setParams({
      minPrice: min ? Number(min) : null,
      maxPrice: max ? Number(max) : null,
    });
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          inputMode="numeric"
          value={min}
          onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))}
          onBlur={apply}
          placeholder="از"
          className="h-9 min-w-0 flex-1 text-xs"
        />
        <span className="text-muted-foreground shrink-0 text-xs">تا</span>
        <Input
          type="text"
          inputMode="numeric"
          value={max}
          onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))}
          onBlur={apply}
          placeholder="تا"
          className="h-9 min-w-0 flex-1 text-xs"
        />
      </div>
      <p className="text-muted-foreground text-[10px]">
        حداکثر تا {toPersianNum(maxPrice)} تومان
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Color
   ───────────────────────────────────────────── */

function ColorFilter({ colors }: { colors: ColorOption[] }) {
  const { getArray, toggleArray } = useFilters();
  const selected = getArray("color");

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => {
        const checked = selected.includes(c.slug);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => toggleArray("color", c.slug)}
            aria-label={c.name}
            aria-pressed={checked}
            title={c.name}
            className={cn(
              "ring-border hover:ring-foreground/40 relative h-7 w-7 shrink-0 rounded-full ring-1 transition",
              checked && "ring-primary ring-2",
            )}
            style={{ backgroundColor: c.value }}
          >
            {checked && (
              <Check
                className="absolute inset-0 m-auto h-3.5 w-3.5 text-white mix-blend-difference"
                strokeWidth={3}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Size
   ───────────────────────────────────────────── */

function SizeFilter({ sizes }: { sizes: SizeOption[] }) {
  const { getArray, toggleArray } = useFilters();
  const selected = getArray("size");

  return (
    <div className="flex flex-wrap gap-1.5">
      {sizes.map((s) => {
        const checked = selected.includes(s.slug);
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => toggleArray("size", s.slug)}
            aria-pressed={checked}
            className={cn(
              "border-border min-w-10 shrink-0 rounded-md border px-2.5 py-1.5 text-xs transition-colors",
              checked
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:border-foreground/40",
            )}
          >
            {s.name}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Rating
   ───────────────────────────────────────────── */

function RatingFilter() {
  const { getNumber, setParams } = useFilters();
  const current = getNumber("rating");

  return (
    <ul className="w-full space-y-2">
      {[4, 3, 2, 1].map((r) => {
        const active = current === r;
        return (
          <li key={r} className="w-full">
            <button
              type="button"
              onClick={() => setParams({ rating: active ? null : r })}
              aria-pressed={active}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-xs transition-colors",
                active ? "bg-secondary" : "hover:bg-secondary/60",
              )}
            >
              <span className="flex shrink-0 items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < r
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/40",
                    )}
                  />
                ))}
              </span>
              <span className="text-muted-foreground truncate">و بالاتر</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ─────────────────────────────────────────────
   Switch row
   ───────────────────────────────────────────── */

function SwitchRow({ paramKey, label }: { paramKey: string; label: string }) {
  const { getBool, setParams } = useFilters();
  const checked = getBool(paramKey);

  return (
    <div className="flex items-center justify-between gap-2">
      <Label
        htmlFor={paramKey}
        className="cursor-pointer truncate text-xs font-normal sm:text-[13px]"
      >
        {label}
      </Label>
      {/* <Switch
        id={paramKey}
        checked={checked}
        onCheckedChange={(v) => setParams({ [paramKey]: v })}
      /> */}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Header
   ───────────────────────────────────────────── */

function FilterHeader() {
  const { activeCount, clearAll, isPending } = useFilters();

  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <h2 className="font-vazir-bold truncate text-sm">فیلترها</h2>
        {activeCount > 0 && (
          <Badge
            variant="secondary"
            className="h-5 shrink-0 px-1.5 text-[10px]"
          >
            {toPersianNum(activeCount)}
          </Badge>
        )}
      </div>
      {activeCount > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearAll}
          disabled={isPending}
          className="text-muted-foreground hover:text-destructive h-7 shrink-0 gap-1 px-2 text-[11px]"
        >
          <X className="h-3 w-3" />
          پاک کردن
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Content — shared
   ───────────────────────────────────────────── */

function FilterContent({
  categories,
  brands,
  colors,
  sizes,
  maxPrice,
}: Omit<FilterSidebarProps, "className">) {
  return (
    <div className="w-full min-w-0 space-y-1">
      <FilterHeader />

      <Accordion
        multiple
        className="border-none"
        defaultValue={["category", "price", "brand", "color", "size"]}
      >
        <FilterSection value="category" title="دسته‌بندی">
          <CheckboxList paramKey="category" options={categories} searchable />
        </FilterSection>

        <FilterSection value="price" title="قیمت">
          <PriceFilter maxPrice={maxPrice} />
        </FilterSection>

        <FilterSection value="brand" title="برند">
          <CheckboxList
            paramKey="brand"
            options={brands}
            searchable
            maxVisible={6}
          />
        </FilterSection>

        <FilterSection value="color" title="رنگ">
          <ColorFilter colors={colors} />
        </FilterSection>

        <FilterSection value="size" title="سایز">
          <SizeFilter sizes={sizes} />
        </FilterSection>

        <FilterSection value="rating" title="امتیاز">
          <RatingFilter />
        </FilterSection>

        <FilterSection value="other" title="سایر">
          <div className="space-y-3">
            <SwitchRow paramKey="inStock" label="فقط کالاهای موجود" />
            <SwitchRow paramKey="onSale" label="فقط تخفیف‌دارها" />
          </div>
        </FilterSection>
      </Accordion>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Exports
   ───────────────────────────────────────────── */

export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <aside
      className={cn(
        "bg-card border-border sticky top-4 hidden h-fit w-80 shrink-0 overflow-hidden rounded-lg border lg:block",
        props.className,
      )}
    >
      <ScrollArea className="h-[calc(100vh-2rem)]">
        <div className="p-4">
          <FilterContent {...props} />
        </div>
      </ScrollArea>
    </aside>
  );
}

export function MobileFilterTrigger({
  onOpen,
  activeCount,
}: {
  onOpen: () => void;
  activeCount: number;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onOpen}
      className="gap-2 lg:hidden"
    >
      فیلترها
      {activeCount > 0 && (
        <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
          {toPersianNum(activeCount)}
        </Badge>
      )}
    </Button>
  );
}

export function MobileFilterPanel(props: FilterSidebarProps) {
  return (
    <div className="w-full px-4 pb-6">
      <FilterContent {...props} />
    </div>
  );
}
