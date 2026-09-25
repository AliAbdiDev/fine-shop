"use client";

import * as React from "react";

import { CheckIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/core/utils/helpers";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type DropdownValueType = string | number;

export interface DropdownOption<T extends DropdownValueType = string> {
  label: React.ReactNode;
  value: T;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  /** کال‌بک اختصاصی این آپشن (قبل از انتخاب صدا زده می‌شود) */
  onClick?: (value: T) => void;
  /** کلاس اختصاصی این آپشن */
  className?: string;
}

export interface DropdownGroupOption<T extends DropdownValueType = string> {
  group?: string;
  items?: DropdownOption<T>[];
}

export type DropdownOptions<T extends DropdownValueType = string> =
  DropdownOption<T>[] | DropdownGroupOption<T>[];

export interface DropdownFieldProps<T extends DropdownValueType = string> {
  options: DropdownOptions<T>;
  trigger?: React.ReactElement;
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

function isGroupedOptions<T extends DropdownValueType>(
  options: DropdownOptions<T>,
): options is DropdownGroupOption<T>[] {
  return options.length > 0 && "group" in options[0];
}

function flattenOptions<T extends DropdownValueType>(
  options: DropdownOptions<T>,
): DropdownOption<T>[] {
  return isGroupedOptions(options)
    ? options.flatMap((g) => g.items ?? [])
    : options;
}

export function Dropdown<T extends DropdownValueType = string>({
  options,
  trigger,
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
}: DropdownFieldProps<T>) {
  const isDisabled = disabled || isLoading;

  const [internalValue, setInternalValue] = React.useState<T | undefined>(
    defaultValue,
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const flatOptions = React.useMemo(() => flattenOptions(options), [options]);

  const selectedOption = React.useMemo(
    () =>
      currentValue !== undefined
        ? flatOptions.find((opt) => String(opt.value) === String(currentValue))
        : undefined,
    [flatOptions, currentValue],
  );

  const handleSelect = (next: T) => {
    if (!isControlled) setInternalValue(next);
    if (onChange) onChange(next);
    else if (onValueChange) onValueChange(next);
  };

  const isEmpty =
    options.length === 0 ||
    (isGroupedOptions(options)
      ? flatOptions.length === 0
      : (options as DropdownOption<T>[]).length === 0);

  const renderItem = (item: DropdownOption<T>) => {
    const isSelected =
      currentValue !== undefined && String(item.value) === String(currentValue);

    return (
      <DropdownMenuItem
        key={String(item.value)}
        disabled={item.disabled}
        onClick={() => {
          item.onClick?.(item.value);
          handleSelect(item.value);
        }}
        className={cn(
          "flex cursor-pointer items-start gap-2",
          isSelected && "bg-accent/60",
          item.className,
        )}
      >
        {item.icon && <span className="mt-0.5 shrink-0">{item.icon}</span>}

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate">{item.label}</span>
          {item.description && (
            <span className="text-muted-foreground truncate text-xs font-normal">
              {item.description}
            </span>
          )}
        </div>

        {isSelected && (
          <CheckIcon className="text-primary mt-0.5 size-4 shrink-0" />
        )}
      </DropdownMenuItem>
    );
  };

  const defaultTriggerContent = (
    <div className="flex min-w-0 items-center gap-2 truncate">
      {isLoading && (
        <Loader2Icon className="text-muted-foreground size-4 shrink-0 animate-spin" />
      )}

      {selectedOption ? (
        <>
          {selectedOption.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">{selectedOption.label}</span>
        </>
      ) : (
        <span className="text-muted-foreground truncate">{placeholder}</span>
      )}
    </div>
  );

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      <DropdownMenu>
        {trigger ? (
          <DropdownMenuTrigger
            render={(triggerProps) =>
              React.cloneElement(trigger, {
                ...triggerProps,
                id,
                onBlur,
                disabled: isDisabled,
                "aria-invalid": ariaInvalid,
                "aria-describedby": ariaDescribedBy,
                "aria-required": required,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any)
            }
          />
        ) : (
          <DropdownMenuTrigger
            render={
              <Button
                id={id}
                name={name}
                type="button"
                variant="outline"
                disabled={isDisabled}
                onBlur={onBlur}
                aria-invalid={ariaInvalid}
                aria-describedby={ariaDescribedBy}
                aria-required={required}
                aria-haspopup="menu"
                className={cn(
                  "bg-input/50 h-9 w-full justify-between rounded-2xl border-transparent px-3 font-normal transition-all duration-200 focus-visible:ring-3",
                  triggerClassName,
                )}
              />
            }
          >
            {defaultTriggerContent}
          </DropdownMenuTrigger>
        )}

        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className={cn("max-h-72 overflow-y-auto", contentClassName)}
        >
          {isLoading ? (
            <div className="text-muted-foreground flex items-center justify-center gap-2 p-3 text-xs">
              <Loader2Icon className="size-3 animate-spin" />
              در حال بارگذاری...
            </div>
          ) : isEmpty ? (
            <div className="text-muted-foreground p-3 text-center text-xs">
              {emptyText}
            </div>
          ) : isGroupedOptions(options) ? (
            options
              .filter((group) => (group.items ?? []).length > 0)
              .map((group, groupIdx) => (
                <React.Fragment key={group.group || groupIdx}>
                  {groupIdx > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuGroup>
                    {group.group && (
                      <DropdownMenuLabel>{group.group}</DropdownMenuLabel>
                    )}
                    {(group.items ?? []).map(renderItem)}
                  </DropdownMenuGroup>
                </React.Fragment>
              ))
          ) : (
            <DropdownMenuGroup>
              {(options as DropdownOption<T>[]).map(renderItem)}
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
