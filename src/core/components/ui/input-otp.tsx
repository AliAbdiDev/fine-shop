"use client";

import * as React from "react";

import { MinusIcon } from "lucide-react";

import { cn } from "@/core/utils/helpers";

/* -------------------------------------------------------------------------- */
/* patterns                                                                   */
/* -------------------------------------------------------------------------- */

const REGEXP_ONLY_DIGITS = "^\\d+$";
const REGEXP_ONLY_CHARS = "^[a-zA-Z]+$";
const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$";
const REGEXP_ANY_DIGITS = "^[0-9\u06F0-\u06F9\u0660-\u0669]+$";

/* -------------------------------------------------------------------------- */
/* context                                                                    */
/* -------------------------------------------------------------------------- */

type OTPSlotState = {
  char: string | null;
  placeholderChar: string | null;
  isActive: boolean;
  hasFakeCaret: boolean;
};

type OTPInputContextValue = {
  slots: OTPSlotState[];
  isFocused: boolean;
};

const OTPInputContext = React.createContext<OTPInputContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* core input                                                                 */
/* -------------------------------------------------------------------------- */

type OTPInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "maxLength" | "pattern" | "children"
> & {
  maxLength: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** الگوی مجاز. رشته یا RegExp. `null` برای غیرفعال کردن اعتبارسنجی */
  pattern?: string | RegExp | null;
  /** کاراکتر(های) placeholder؛ یک کاراکتر برای همه، یا رشته‌ای هم‌طول */
  placeholder?: string;
  containerClassName?: string;
  children?: React.ReactNode;
};

function OTPInput({
  ref,
  maxLength,
  value: valueProp,
  defaultValue = "",
  onChange,
  onComplete,
  pattern = REGEXP_ONLY_DIGITS,
  placeholder,
  containerClassName,
  className,
  children,
  onFocus,
  onBlur,
  onSelect,
  onKeyDown,
  onMouseDown,
  onPaste,
  ...props
}: OTPInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = (isControlled ? (valueProp ?? "") : internalValue).slice(
    0,
    maxLength,
  );

  const [isFocused, setIsFocused] = React.useState(false);
  const [selection, setSelection] = React.useState<[number, number]>([0, 0]);

  const regexp = React.useMemo(() => {
    if (!pattern) return null;
    return typeof pattern === "string" ? new RegExp(pattern) : pattern;
  }, [pattern]);

  const commit = (next: string) => {
    const clamped = next.slice(0, maxLength);

    if (!isControlled) setInternalValue(clamped);
    onChange?.(clamped);

    if (clamped.length === maxLength && clamped !== value) {
      onComplete?.(clamped);
    }
  };

  /**
   * selection واقعی input را در محدوده‌ی مجاز نگه می‌دارد و در state آینه می‌کند.
   * قرارداد: caret همیشه روی اولین اسلات خالی است؛ وقتی همه پر شد آخرین
   * کاراکتر انتخاب می‌شود تا تایپ بعدی جایگزینش کند.
   */
  const syncSelection = React.useCallback(() => {
    const input = inputRef.current;
    if (!input || document.activeElement !== input) return;

    const length = input.value.length;
    let start = input.selectionStart ?? length;
    let end = input.selectionEnd ?? length;

    if (start === end) {
      if (start !== length) start = end = length;
      if (length > 0 && length === maxLength) start = length - 1;
    } else {
      start = Math.min(start, length);
      end = Math.min(end, length);
    }

    if (start !== input.selectionStart || end !== input.selectionEnd) {
      input.setSelectionRange(start, end);
    }

    setSelection((previous) =>
      previous[0] === start && previous[1] === end ? previous : [start, end],
    );
  }, [maxLength]);

  React.useEffect(() => {
    syncSelection();
  }, [value, syncSelection]);

  const slots = React.useMemo<OTPSlotState[]>(() => {
    const [start, end] = selection;

    return Array.from({ length: maxLength }, (_, index) => {
      const isSelected = start !== end && index >= start && index < end;
      const isCaret = start === end && index === start;

      return {
        char: value[index] ?? null,
        placeholderChar:
          value.length === 0
            ? ((placeholder?.length === 1
                ? placeholder
                : placeholder?.[index]) ?? null)
            : null,
        isActive: isFocused && (isSelected || isCaret),
        hasFakeCaret: isFocused && isCaret,
      };
    });
  }, [maxLength, selection, value, placeholder, isFocused]);

  const context = React.useMemo<OTPInputContextValue>(
    () => ({ slots, isFocused }),
    [slots, isFocused],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.currentTarget.value.slice(0, maxLength);

    if (next.length > 0 && regexp && !regexp.test(next)) {
      event.currentTarget.value = value;
      syncSelection();
      return;
    }

    commit(next);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (
      [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(event.key)
    ) {
      event.preventDefault();
      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();
      commit(value.slice(0, -1));
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(event);
    if (event.defaultPrevented) return;

    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text/plain")
      .replace(/\s/g, "")
      .slice(0, maxLength);

    if (!pasted || (regexp && !regexp.test(pasted))) return;

    commit(pasted);
  };

  return (
    <OTPInputContext.Provider value={context}>
      <div
        data-slot="input-otp-container"
        className={cn("relative", containerClassName)}
      >
        {children}

        <input
          ref={inputRef}
          dir="ltr"
          autoComplete="one-time-code"
          inputMode="numeric"
          spellCheck={false}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={(event) => {
            setIsFocused(true);
            requestAnimationFrame(syncSelection);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onSelect={(event) => {
            syncSelection();
            onSelect?.(event);
          }}
          onMouseDown={(event) => {
            onMouseDown?.(event);
            if (event.defaultPrevented) return;

            // کلیک روی هر اسلات، caret را جابه‌جا نمی‌کند.
            event.preventDefault();
            inputRef.current?.focus();
          }}
          className={cn(
            "absolute inset-0 size-full text-[16px] text-transparent caret-transparent opacity-0 outline-none",
            "selection:bg-transparent disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
      </div>
    </OTPInputContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** groups را به آرایه‌ای از طول هر گروه تبدیل می‌کند. */
function resolveGroups(length: number, groups?: number | number[]): number[] {
  if (Array.isArray(groups)) {
    const total = groups.reduce((sum, size) => sum + size, 0);

    if (total !== length) {
      throw new Error(
        `<InputOTP />: مجموع groups (${total}) با length (${length}) برابر نیست.`,
      );
    }

    return groups;
  }

  if (typeof groups === "number" && groups > 0) {
    const chunks: number[] = [];

    for (let index = 0; index < length; index += groups) {
      chunks.push(Math.min(groups, length - index));
    }

    return chunks;
  }

  return [length];
}

function useOTPSlot(index: number) {
  const context = React.useContext(OTPInputContext);
  const slot = context?.slots[index];

  if (!slot) {
    throw new Error(
      `<InputOTPSlot index={${index}} /> باید داخل <InputOTP /> و در بازه‌ی length باشد.`,
    );
  }

  return slot;
}

/* -------------------------------------------------------------------------- */
/* root                                                                       */
/* -------------------------------------------------------------------------- */

type InputOTPProps = Omit<OTPInputProps, "maxLength" | "children"> & {
  /** تعداد کاراکترها. پیش‌فرض ۶ */
  length?: number;
  /**
   * تقسیم اسلات‌ها به گروه.
   * عدد: اندازه‌ی هر گروه (`3` → 3-3)
   * آرایه: اندازه‌ی دلخواه هر گروه (`[2, 3, 2]`)
   */
  groups?: number | number[];
  /** جداکننده‌ی بین گروه‌ها. `false` برای حذف، یا هر ReactNode */
  separator?: React.ReactNode | boolean;
  /** کلاس اضافی روی هر اسلات */
  slotClassName?: string;
  children?: React.ReactNode;
};

function InputOTP({
  length = 6,
  groups,
  separator = true,
  className,
  slotClassName,
  containerClassName,
  children,
  ...props
}: InputOTPProps) {
  const chunks = React.useMemo(
    () => resolveGroups(length, groups),
    [length, groups],
  );

  let cursor = 0;

  return (
    <OTPInput
      data-slot="input-otp"
      maxLength={length}
      containerClassName={cn(
        "group/otp flex w-full mx-auto max-w-3xs sm:max-w-xs items-center has-disabled:opacity-50",
        containerClassName,
      )}
      className={className}
      {...props}
    >
      {children ??
        chunks.map((size, chunkIndex) => {
          const offset = cursor;
          cursor += size;

          return (
            <React.Fragment key={offset}>
              {chunkIndex > 0 && separator !== false && (
                <InputOTPSeparator>
                  {separator === true ? undefined : separator}
                </InputOTPSeparator>
              )}

              <InputOTPGroup className="">
                {Array.from({ length: size }, (_, slotIndex) => (
                  <InputOTPSlot
                    key={offset + slotIndex}
                    index={offset + slotIndex}
                    className={slotClassName}
                  />
                ))}
              </InputOTPGroup>
            </React.Fragment>
          );
        })}
    </OTPInput>
  );
}

/* -------------------------------------------------------------------------- */
/* parts                                                                      */
/* -------------------------------------------------------------------------- */

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      dir="ltr"
      className={cn(
        "flex w-full shrink-0 items-center justify-between",
        className,
      )}
      {...props}
    />
  );
}

type InputOTPSlotProps = React.ComponentProps<"div"> & {
  index: number;
};

function InputOTPSlot({ index, className, ...props }: InputOTPSlotProps) {
  const { char, placeholderChar, isActive, hasFakeCaret } = useOTPSlot(index);

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive || undefined}
      data-filled={char !== null || undefined}
      className={cn(
        "border-input bg-background relative flex size-9 shrink-0 items-center justify-center md:size-11",
        "rounded-[16px] border text-base font-medium tabular-nums transition-[color,box-shadow,border-color] md:text-lg",
        "data-active:border-ring data-active:ring-ring/50 data-active:z-10 data-active:ring-[3px]",
        "group-has-aria-invalid/otp:border-destructive",
        "group-has-aria-invalid/otp:data-active:ring-destructive/20 dark:group-has-aria-invalid/otp:data-active:ring-destructive/40",
        className,
      )}
      {...props}
    >
      {char ?? (
        <span className="text-muted-foreground/60">{placeholderChar}</span>
      )}

      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-5 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      aria-hidden
      className={cn(
        "text-muted-foreground flex shrink-0 items-center",
        className,
      )}
      {...props}
    >
      {children ?? <MinusIcon className="size-4" />}
    </div>
  );
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  OTPInput,
  OTPInputContext,
  REGEXP_ANY_DIGITS,
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
  type InputOTPProps,
  type OTPInputProps,
  type OTPSlotState,
};
