"use client";

import * as React from "react";

import { Loader2, SearchX } from "lucide-react";
import { useInView } from "react-intersection-observer";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/core/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { useDebounce } from "@/core/hooks/useDebounce";
import { useInfiniteProducts } from "@/core/services/client/products";
import { type Product } from "@/core/types/entities.types";
import { cn } from "@/core/utils/helpers";

export interface ProductCommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (product: Product) => void;
  trigger?: React.ReactNode;

  /** تعداد آیتم در هر صفحه (default: 20) */
  pageSize?: number;
  /** تاخیر دیبانس سرچ به میلی‌ثانیه (default: 350) */
  debounceMs?: number;
  className?: string;
}

/* ─────────────────────────────────────────────
   Product Item — فقط نام
   ───────────────────────────────────────────── */
function ProductCommandItem({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  const isDisabled = !product.isAvailable || product.stock <= 0;

  return (
    <CommandItem
      value={String(product.id)}
      disabled={isDisabled}
      onSelect={() => onSelect(product)}
      className="py-2"
    >
      <span className="truncate text-sm">{product.name}</span>
    </CommandItem>
  );
}

/* ─────────────────────────────────────────────
   Inner Command (remounts on popover open)
   ───────────────────────────────────────────── */
function ProductCommand({
  onSelect,
  pageSize,
  debounceMs,
}: {
  onSelect: (product: Product) => void;
  pageSize: number;
  debounceMs: number;
}) {
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search.trim(), debounceMs);

  const hasSearch = debouncedSearch.length > 0;

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(
    {
      search: debouncedSearch,
      page_size: pageSize,
    },
    { enabled: hasSearch },
  );

  const products = React.useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  React.useEffect(() => {
    console.log("[search]", JSON.stringify(search));
  }, [search]);

  React.useEffect(() => {
    console.log("[debouncedSearch]", JSON.stringify(debouncedSearch));
  }, [debouncedSearch]);

  /* Infinite scroll — فقط وقتی سرچ فعال است */
  const { ref: sentinelRef, inView } = useInView({
    rootMargin: "120px 0px",
    threshold: 0,
  });

  React.useEffect(() => {
    if (hasSearch && inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasSearch, inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const showLoading = hasSearch && isLoading;
  const showError = hasSearch && isError;
  const showEmpty =
    hasSearch && !isLoading && !isError && products.length === 0;
  const showResults = hasSearch && products.length > 0;

  return (
    <Command
      shouldFilter={false}
      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
    >
      <CommandInput
        value={search}
        onValueChange={setSearch}
        autoFocus
        placeholder="دنبال چه محصولی می‌گردید؟"
        inputGroupClassName="h-10! rounded-lg!"
      />

      <CommandList key={debouncedSearch} className="max-h-[min(60vh,22rem)]">
        {/* بدون سرچ: فقط راهنما */}
        {!hasSearch && (
          <div className="text-muted-foreground px-4 py-8 text-center text-sm">
            برای جستجو، نام محصول را تایپ کنید.
          </div>
        )}

        {/* لودینگ اولیه */}
        {showLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="text-muted-foreground size-4 animate-spin" />
          </div>
        )}

        {/* خطا */}
        {showError && (
          <div className="text-destructive px-4 py-8 text-center text-sm">
            خطا در دریافت محصولات. لطفاً دوباره تلاش کنید.
          </div>
        )}

        {/* نتیجه خالی */}
        {showEmpty && (
          <CommandEmpty className="py-8 text-center text-sm">
            <SearchX className="mx-auto mb-2 size-6 opacity-60" />
            محصولی با این مشخصات پیدا نشد.
          </CommandEmpty>
        )}

        {/* نتایج */}
        {showResults && (
          <CommandGroup heading="نتایج جستجو">
            {products.map((product) => (
              <ProductCommandItem
                key={product?.id}
                product={product}
                onSelect={onSelect}
              />
            ))}
          </CommandGroup>
        )}

        {/* Load more sentinel */}
        {hasSearch && hasNextPage && (
          <div
            ref={sentinelRef}
            className="flex items-center justify-center py-4"
          >
            {isFetchingNextPage && (
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            )}
          </div>
        )}
      </CommandList>
    </Command>
  );
}

/* ─────────────────────────────────────────────
   Public Popover
   ───────────────────────────────────────────── */
export function ProductCommandDialog({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  trigger,
  onSelect,
  pageSize = 20,
  debounceMs = 350,
  className,
}: ProductCommandDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value);
      onOpenChangeProp?.(value);
    },
    [isControlled, onOpenChangeProp],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {trigger ? (
        <PopoverTrigger render={<span>{trigger}</span>} nativeButton={false} />
      ) : null}

      <PopoverContent
        align="center"
        sideOffset={-43}
        initialFocus={false}
        className={cn(
          "w-(--anchor-width) min-w-[18rem] md:w-md",
          "overflow-hidden p-0",
          className,
        )}
      >
        <ProductCommand
          onSelect={(product) => {
            onSelect?.(product);
            setOpen(false);
          }}
          pageSize={pageSize}
          debounceMs={debounceMs}
        />
      </PopoverContent>
    </Popover>
  );
}
