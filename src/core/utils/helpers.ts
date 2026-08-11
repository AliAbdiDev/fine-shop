import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))


// ------- transform Keys -------

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
    if (!isPlainObject(value)) return value; // Date, File, Blob, Map, null, primitives

    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[convert(k)] = walk(v);
    }
    return out;
  };

  return walk(input) as T;
}
