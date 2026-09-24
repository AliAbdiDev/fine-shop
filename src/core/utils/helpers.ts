import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/* -------------------------------------------------------------------------- */
/*                              transform keys                                */
/* -------------------------------------------------------------------------- */

export type Casing = "snake" | "camel";

const toCamelCase = (str: string) =>
  str.replace(/_+([a-z0-9])/g, (_, c: string) => c.toUpperCase());

const toSnakeCase = (str: string) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" &&
  v !== null &&
  (Object.getPrototypeOf(v) === Object.prototype ||
    Object.getPrototypeOf(v) === null);

export function transformKeys<T>(input: T, mode: Casing): T {
  const convert = mode === "snake" ? toSnakeCase : toCamelCase;

  const walk = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(walk);
    if (!isPlainObject(value)) return value;

    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[convert(k)] = walk(v);
    }
    return out;
  };

  return walk(input) as T;
}

/* -------------------------------------------------------------------------- */
/*                                asRecord                                    */
/* -------------------------------------------------------------------------- */

export const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

/* -------------------------------------------------------------------------- */
/*                              toPersianNum                                  */
/* -------------------------------------------------------------------------- */

export const toPersianNum = (input: string | number): string => {
  const num = isFinite(+input) ? +input : "";
  return num.toLocaleString("fa-IR");
};

/* -------------------------------------------------------------------------- */
/*                                toFormData                                  */
/* -------------------------------------------------------------------------- */

/**
 * تبدیل یک آبجکت به FormData برای ارسال به بک‌اند.
 *
 * @param values - آبجکت ورودی
 * @param options.fileKeys - کلیدهایی که به عنوان فایل append می‌شوند (تکرارشونده)
 * @param options.jsonKeys - کلیدهایی که به صورت JSON stringify می‌شوند
 *
 * @example
 * const fd = toFormData(values, {
 *   fileKeys: ["images"],
 *   jsonKeys: ["attributeList"],
 * });
 */
export function toFormData(
  values: Record<string, unknown>,
  options?: {
    fileKeys?: string[];
    jsonKeys?: string[];
  },
): FormData {
  const fileKeys = options?.fileKeys ?? [];
  const jsonKeys = options?.jsonKeys ?? [];
  const fd = new FormData();

  for (const key of Object.keys(values)) {
    const value = values[key];

    if (value === undefined || value === null) {
      continue;
    }

    // ۱) فایل‌ها
    if (fileKeys.includes(key)) {
      const files = Array.isArray(value) ? value : [value];

      for (const f of files) {
        if (typeof File !== "undefined" && f instanceof File) {
          fd.append(key, f);
        } else if (typeof Blob !== "undefined" && f instanceof Blob) {
          fd.append(key, f);
        }
      }

      continue;
    }

    // ۲) فیلدهای JSON
    if (jsonKeys.includes(key)) {
      fd.append(key, JSON.stringify(value));
      continue;
    }

    // ۳) آرایه‌ی مقادیر ساده
    if (Array.isArray(value)) {
      for (const v of value) {
        fd.append(key, String(v));
      }
      continue;
    }

    // ۴) مقادیر ساده
    fd.append(key, String(value));
  }

  return fd;
}

// -----
export interface DiscountInfo {
  hasDiscount: boolean;
  amount: number;
  percent: number;
  finalPrice: number;
  basePrice: number;
}

/**
 *
 * @example
 *   getDiscountInfo(450_000, 380_000)
 *   // { hasDiscount: true, amount: 70000, percent: 16, finalPrice: 380000, basePrice: 450000 }
 */
export function getDiscountInfo(
  basePrice: number,
  discountedPrice?: number | null,
): DiscountInfo {
  const base = Number.isFinite(basePrice) && basePrice > 0 ? basePrice : 0;
  const discounted =
    Number.isFinite(discountedPrice) && (discountedPrice ?? 0) > 0
      ? (discountedPrice as number)
      : null;


  const hasDiscount =
    base > 0 && discounted !== null && discounted < base;

  const finalPrice = hasDiscount ? discounted! : base;
  const amount = hasDiscount ? base - finalPrice : 0;
  const percent = hasDiscount ? Math.round((amount / base) * 100) : 0;

  return {
    hasDiscount,
    amount,
    percent,
    finalPrice,
    basePrice: base,
  };
}
