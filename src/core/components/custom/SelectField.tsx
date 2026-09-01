"use client";

import * as React from "react";

import { Loader2Icon } from "lucide-react";

import { cn } from "@/core/utils/helpers";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
// کامپوننت پایه شما

// --- تعریف دقیق تایپ‌ها ---
export type SelectValueType = string | number;

export interface SelectOption<T extends SelectValueType = string> {
  label: React.ReactNode;
  value: T;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: React.ReactNode;
}

export interface SelectGroupOption<T extends SelectValueType = string> {
  group: string;
  items: SelectOption<T>[];
}

export type SelectOptions<T extends SelectValueType = string> =
  SelectOption<T>[] | SelectGroupOption<T>[];

export interface SelectFieldProps<T extends SelectValueType = string> {
  /** گزینه های انتخابی */
  options: SelectOptions<T>;
  /** مقدار کنترل شده */
  value?: T;
  /** مقدار اولیه */
  defaultValue?: T;
  /** کال بک تغییر مقدار */
  onValueChange?: (value: T) => void;
  /** متن جایگزین */
  placeholder?: string;
  /** متن حالت خالی (وقتی گزینه‌ای وجود ندارد) */
  emptyText?: string;
  /** لیبل بالای کامپوننت */
  label?: string;
  /** پیام خطا */
  error?: string;
  /** متن راهنما */
  helperText?: string;
  /** وضعیت بارگذاری */
  isLoading?: boolean;
  /** غیرفعال سازی */
  disabled?: boolean;
  /** ضروری بودن */
  required?: boolean;
  /** شناسه یکتا برای accessibility */
  id?: string;
  /** اندازه */
  size?: "sm" | "default";
  /** کلاس های سفارشی */
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

// Type Guard برای تشخیص گروه‌بندی
function isGroupedOptions<T extends SelectValueType>(
  options: SelectOptions<T>,
): options is SelectGroupOption<T>[] {
  return options.length > 0 && "group" in options[0];
}

export function SelectField<T extends SelectValueType = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "انتخاب کنید...",
  emptyText = "گزینه‌ای یافت نشد",
  label,
  error,
  helperText,
  isLoading = false,
  disabled = false,
  required = false,
  id,
  size = "default",
  className,
  triggerClassName,
  contentClassName,
}: SelectFieldProps<T>) {
  // تولید شناسه یکتا برای دسترسی‌پذیری (Accessibility)
  const generatedId = React.useId();
  const selectId = id || generatedId;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  const isInvalid = Boolean(error);
  const isDisabled = disabled || isLoading;

  // مدیریت امن تبدیل متغیرهای String/Number
  const stringifiedValue = value !== undefined ? String(value) : undefined;
  const stringifiedDefaultValue =
    defaultValue !== undefined ? String(defaultValue) : undefined;

  // اصلاح تابع handleValueChange
  const handleValueChange = (val: string | null) => {
    if (!onValueChange) return;

    // اگر مقدار null بود (مثلاً پاک شدن انتخاب)
    if (val === null) {
      onValueChange(val as unknown as T);
      return;
    }

    // اگر جنس ورودی اصلی Number بوده، آن را دوباره به Number تبدیل می‌کنیم
    if (typeof value === "number" || typeof defaultValue === "number") {
      const numVal = Number(val);
      onValueChange((isNaN(numVal) ? val : numVal) as T);
    } else {
      onValueChange(val as unknown as T);
    }
  };

  // رندر هر آیتم به صورت ایمن
  const renderItem = (item: SelectOption<T>) => (
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

  // بررسی خالی بودن گزینه‌ها
  const isEmpty =
    options.length === 0 ||
    (isGroupedOptions(options) && options.every((g) => g.items.length === 0));

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {/* Label معتبر با اتصال id */}
      {label && (
        <label
          htmlFor={selectId}
          className="text-foreground flex cursor-pointer items-center gap-1 text-xs font-medium select-none"
        >
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}

      {/* Select الاصلی */}
      <Select
        value={stringifiedValue}
        defaultValue={stringifiedDefaultValue}
        onValueChange={handleValueChange}
        disabled={isDisabled}
      >
        <SelectTrigger
          id={selectId}
          size={size}
          aria-invalid={isInvalid}
          aria-describedby={
            isInvalid ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "w-full justify-between transition-all duration-200",
            isInvalid &&
              "border-destructive focus-visible:ring-destructive/20 text-destructive",
            triggerClassName,
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {isLoading && (
              <Loader2Icon className="text-muted-foreground size-4 shrink-0 animate-spin" />
            )}
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>

        <SelectContent className={contentClassName}>
          {isEmpty ? (
            <div className="text-muted-foreground p-3 text-center text-xs">
              {emptyText}
            </div>
          ) : isGroupedOptions(options) ? (
            options.map((group, groupIdx) => (
              <React.Fragment key={group.group || groupIdx}>
                {groupIdx > 0 && <SelectSeparator />}
                <SelectGroup>
                  {group.group && <SelectLabel>{group.group}</SelectLabel>}
                  {group.items.map(renderItem)}
                </SelectGroup>
              </React.Fragment>
            ))
          ) : (
            options.map(renderItem)
          )}
        </SelectContent>
      </Select>

      {/* Helper text / Error Message با شناسه دسترسی‌پذیری */}
      {error ? (
        <p id={errorId} className="text-destructive text-xs font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-muted-foreground text-xs">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
