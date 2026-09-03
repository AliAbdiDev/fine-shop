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

// --- تایپ‌ها ---
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
  options: SelectOptions<T>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  onValueChange?: (value: T) => void;
  onBlur?: () => void;
  placeholder?: string;
  emptyText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

function isGroupedOptions<T extends SelectValueType>(
  options: SelectOptions<T>,
): options is SelectGroupOption<T>[] {
  return options.length > 0 && "group" in options[0];
}

export function SelectField<T extends SelectValueType = string>({
  options,
  value,
  defaultValue,
  onChange,
  onValueChange,
  onBlur,
  placeholder = "انتخاب کنید...",
  emptyText = "گزینه‌ای یافت نشد",
  isLoading = false,
  disabled = false,
  required,
  id,
  name,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  className,
  triggerClassName,
  contentClassName,
}: SelectFieldProps<T>) {
  const isDisabled = disabled || isLoading;

  const stringifiedValue = value !== undefined ? String(value) : undefined;
  const stringifiedDefaultValue =
    defaultValue !== undefined ? String(defaultValue) : undefined;

  const handleValueChange = (val: string | null) => {
    let convertedValue: T;
    if (val === null) {
      convertedValue = val as unknown as T;
    } else if (typeof value === "number" || typeof defaultValue === "number") {
      const numVal = Number(val);
      convertedValue = (isNaN(numVal) ? val : numVal) as T;
    } else {
      convertedValue = val as unknown as T;
    }

    if (onChange) {
      onChange(convertedValue);
    } else if (onValueChange) {
      onValueChange(convertedValue);
    }
  };

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

  const isEmpty =
    options.length === 0 ||
    (isGroupedOptions(options) && options.every((g) => g.items.length === 0));

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      <Select
        value={stringifiedValue}
        defaultValue={stringifiedDefaultValue}
        onValueChange={handleValueChange}
        disabled={isDisabled}
      >
        <SelectTrigger
          id={id}
          name={name}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          onBlur={onBlur}
          aria-required={required}
          className={cn(
            "w-full justify-between transition-all duration-200",
            triggerClassName,
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {isLoading && (
              <Loader2Icon className="text-muted-foreground size-4 shrink-0 animate-spin" />
            )}
            <SelectValue placeholder={placeholder}>
              {(selectedValue) => {
                const flatOptions = isGroupedOptions(options)
                  ? options.flatMap((group) => group.items)
                  : options;
                const selectedOption = flatOptions.find(
                  (opt) => String(opt.value) === selectedValue,
                );
                return selectedOption ? selectedOption.label : selectedValue;
              }}
            </SelectValue>{" "}
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
    </div>
  );
}
