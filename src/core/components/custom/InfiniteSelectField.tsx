"use client";

import * as React from "react";

import { Loader2Icon } from "lucide-react";

import { cn } from "@/core/utils/helpers";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type SelectValueType = string | number;

export interface SelectOption<T extends SelectValueType = string> {
  label: React.ReactNode;
  value: T;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: React.ReactNode;
}

type TriggerProps = Omit<
  React.ComponentProps<typeof SelectTrigger>,
  "onChange" | "children" | "value" | "defaultValue" | "className"
>;

export interface InfiniteSelectFieldProps<
  TValue extends SelectValueType = string,
> extends TriggerProps {
  options: SelectOption<TValue>[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  value?: TValue;
  defaultValue?: TValue;
  onChange?: (value: TValue) => void;
  className?: string;
  selectedLabel?: string; // عنوانِ پشتیبان برای زمانی که آیتم انتخاب‌شده در لیست لود نشده وجود ندارد
}

const LOADING_TEXT = "در حال بارگذاری...";

export function InfiniteSelectField<TValue extends SelectValueType = string>({
  options,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore,
  value,
  defaultValue,
  onChange,
  className,
  disabled,
  selectedLabel,
  ...triggerProps
}: InfiniteSelectFieldProps<TValue>) {
  const isDisabled = disabled || isLoading;

  const stringifiedValue =
    value !== undefined && value !== null ? String(value) : "";
  const stringifiedDefaultValue =
    defaultValue !== undefined && defaultValue !== null
      ? String(defaultValue)
      : undefined;

  // اگر آیتم اولیه در لیست options لودشده نباشد، آن را به عنوان یک option موقت اضافه می‌کنیم
  const effectiveOptions = React.useMemo(() => {
    if (!stringifiedValue) return options;

    const exists = options.some((o) => String(o.value) === stringifiedValue);
    if (!exists) {
      const fallbackOption: SelectOption<TValue> = {
        label: selectedLabel || stringifiedValue,
        value: value as TValue,
      };
      return [fallbackOption, ...options];
    }

    return options;
  }, [options, stringifiedValue, value, selectedLabel]);

  const handleValueChange = React.useCallback(
    (val: unknown) => {
      let converted: TValue;
      if (val === null || val === undefined || val === "") {
        converted = "" as TValue;
      } else if (
        typeof value === "number" ||
        typeof defaultValue === "number"
      ) {
        const n = Number(val);
        converted = (Number.isNaN(n) ? val : n) as TValue;
      } else {
        converted = String(val) as TValue;
      }
      onChange?.(converted);
    },
    [value, defaultValue, onChange],
  );

  const [viewport, setViewport] = React.useState<HTMLElement | null>(null);
  const sentinelCallbackRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) {
        setViewport(null);
        return;
      }
      const vp = node.closest(
        "[data-base-ui-select-viewport]",
      ) as HTMLElement | null;
      setViewport(vp);
    },
    [],
  );

  const onLoadMoreRef = React.useRef(onLoadMore);
  const hasNextRef = React.useRef(hasNextPage);
  const isFetchingRef = React.useRef(isFetchingNextPage);

  React.useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
    hasNextRef.current = hasNextPage;
    isFetchingRef.current = isFetchingNextPage;
  });

  React.useEffect(() => {
    if (!viewport) return;
    const handleScroll = () => {
      if (!hasNextRef.current) return;
      if (isFetchingRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      if (scrollTop + clientHeight >= scrollHeight - 48) {
        onLoadMoreRef.current?.();
      }
    };
    viewport.addEventListener("scroll", handleScroll, { passive: true });
    const raf = requestAnimationFrame(handleScroll);
    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [viewport]);

  const renderItem = (item: SelectOption<TValue>) => (
    <SelectItem
      key={String(item.value)}
      value={String(item.value)}
      disabled={item.disabled || isLoading}
      className="cursor-pointer"
    >
      <div className="flex items-center gap-2">
        {item.icon && <span className="shrink-0">{item.icon}</span>}
        <div className="flex flex-col">
          <span>{item.label}</span>
          {item.description && (
            <span className="text-muted-foreground text-xs font-normal">
              {item.description}
            </span>
          )}
        </div>
      </div>
    </SelectItem>
  );

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      <Select
        value={stringifiedValue}
        defaultValue={stringifiedDefaultValue}
        onValueChange={handleValueChange}
        disabled={isDisabled}
      >
        <SelectTrigger
          {...triggerProps}
          disabled={isDisabled}
          className="w-full justify-between transition-all duration-200"
        >
          <div className="flex items-center gap-2 truncate">
            {isLoading && (
              <Loader2Icon className="text-muted-foreground size-4 shrink-0 animate-spin" />
            )}

            <SelectValue placeholder="انتخاب کنید..." />
          </div>
        </SelectTrigger>

        <SelectContent>
          {isLoading ? (
            <div className="text-muted-foreground flex items-center justify-center gap-2 p-3 text-xs">
              <Loader2Icon className="size-3 animate-spin" />
              {LOADING_TEXT}
            </div>
          ) : effectiveOptions.length === 0 ? (
            <div className="text-muted-foreground p-3 text-center text-xs">
              گزینه‌ای یافت نشد
            </div>
          ) : (
            <>
              {effectiveOptions.map(renderItem)}
              <div ref={sentinelCallbackRef} className="h-px" aria-hidden />
              {isFetchingNextPage && (
                <div className="text-muted-foreground flex items-center justify-center gap-2 p-2 text-xs">
                  <Loader2Icon className="size-3 animate-spin" />
                  {LOADING_TEXT}
                </div>
              )}
              {!hasNextPage && !isFetchingNextPage && (
                <div className="text-muted-foreground p-2 text-center text-[10px]">
                  پایان لیست
                </div>
              )}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
