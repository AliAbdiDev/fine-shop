import {
    addDays,
    differenceInCalendarDays,
    endOfDay,
    endOfMonth,
    format,
    formatDistanceToNow,
    getDate,
    getMonth,
    getYear,
    isSameDay,
    isValid,
    parse,
    startOfDay,
    startOfMonth,
    subDays,
} from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

// ---------- Constants ----------
export const JALALI_DATE_FORMAT = "yyyy/MM/dd";
export const JALALI_DATE_TIME_FORMAT = "yyyy/MM/dd HH:mm";

const FA_LOCALE_OPTIONS = { locale: faIR } as const;

export type DateInput = Date | string | number;

// ---------- Digit utilities ----------
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/**
 * Convert Latin & Arabic-Indic digits to Persian digits.
 * Preserves signs and decimal separators.
 */
export const toPersianDigits = (value: string | number): string =>
    String(value)
        .replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)])
        .replace(/[٠-٩]/g, (d) => PERSIAN_DIGITS[ARABIC_DIGITS.indexOf(d)]);

/** Convert Persian & Arabic-Indic digits to Latin digits. */
export const toEnglishDigits = (value: string): string =>
    String(value)
        .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
        .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)));

const hasPersianOrArabicDigits = (v: string): boolean =>
    /[۰-۹٠-٩]/.test(v);

// ---------- Jalali detection ----------
const JALALI_YEAR_MIN = 1200;
const JALALI_YEAR_MAX = 1600;

export const isJalaliDateString = (value: unknown): value is string => {
    if (typeof value !== "string") return false;
    const str = value.trim();
    const match = toEnglishDigits(str).match(/^(\d{4})[/-]/);
    if (!match) return false;
    if (hasPersianOrArabicDigits(str)) return true;
    const year = Number(match[1]);
    return year >= JALALI_YEAR_MIN && year <= JALALI_YEAR_MAX;
};

// ---------- Pattern detection ----------
const JALALI_PATTERN_CANDIDATES: ReadonlyArray<readonly [RegExp, string]> = [
    [/^\d{4}[/-]\d{1,2}[/-]\d{1,2} \d{1,2}:\d{1,2}$/, "yyyy/MM/dd HH:mm"],
    [/^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/, "yyyy/MM/dd"],
    [/^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/, "dd/MM/yyyy"],
];

const detectJalaliPattern = (value: string): string | null => {
    const str = toEnglishDigits(value.trim()).replace(/-/g, "/");
    for (const [re, pattern] of JALALI_PATTERN_CANDIDATES) {
        if (re.test(str)) return pattern;
    }
    return null;
};

// ---------- Parse ----------
export interface ParseJalaliOptions {
    pattern?: string;
    referenceDate?: Date;
}

export const parseJalali = (
    value: string,
    options: ParseJalaliOptions = {},
): Date | null => {
    if (typeof value !== "string" || !value.trim()) return null;

    const normalized = toEnglishDigits(value.trim());
    const pattern =
        options.pattern ?? detectJalaliPattern(normalized) ?? JALALI_DATE_FORMAT;
    const reference = options.referenceDate ?? new Date();

    try {
        const parsed = parse(normalized, pattern, reference, FA_LOCALE_OPTIONS);
        return isValid(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

// ---------- Core conversion ----------
export const toDate = (value: DateInput): Date => {
    if (value instanceof Date) return value;
    if (typeof value === "number") return new Date(value);

    const str = String(value).trim();
    if (!str) return new Date(NaN);

    if (isJalaliDateString(str)) {
        return parseJalali(str) ?? new Date(NaN);
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        return new Date(`${str}T12:00:00`);
    }

    return new Date(str);
};

// ---------- Format ----------
export interface FormatJalaliOptions {
    persianDigits?: boolean;
}

export const formatJalali = (
    date: DateInput,
    pattern: string = JALALI_DATE_FORMAT,
    options: FormatJalaliOptions = {},
): string => {
    const d = toDate(date);
    if (!isValid(d)) return "";
    const result = format(d, pattern, FA_LOCALE_OPTIONS);
    return options.persianDigits === false
        ? toEnglishDigits(result)
        : toPersianDigits(result);
};

export const formatJalaliDate = (date: DateInput): string =>
    formatJalali(date, JALALI_DATE_FORMAT);

export const formatJalaliDateTime = (date: DateInput): string =>
    formatJalali(date, JALALI_DATE_TIME_FORMAT);

// ---------- Unified output formatter ----------
export type DateOutputType =
    | "jalali"           // ۱۴۰۳/۰۵/۱۲   ← default
    | "jalali-latin"     // 1403/05/12
    | "jalali-datetime"  // ۱۴۰۳/۰۵/۱۲ ۱۴:۳۰
    | "gregorian"        // 2024/08/02
    | "iso"              // 2024-08-02T12:00:00.000Z
    | "iso-date"         // 2024-08-02
    | "timestamp"        // 1722596400000
    | "date";            // Date object

interface BaseFormatAnyDateOptions {
    /** Fallback returned when input is invalid. @default "" */
    fallback?: string;
}

export interface JalaliFormatOptions extends BaseFormatAnyDateOptions {
    output?: "jalali";
    /** @default "yyyy/MM/dd" */
    pattern?: string;
}

export interface JalaliLatinFormatOptions extends BaseFormatAnyDateOptions {
    output: "jalali-latin";
    pattern?: string;
}

export interface JalaliDateTimeFormatOptions extends BaseFormatAnyDateOptions {
    output: "jalali-datetime";
    pattern?: string;
}

export interface GregorianFormatOptions extends BaseFormatAnyDateOptions {
    output: "gregorian";
    pattern?: string;
}

export interface ISOFormatOptions extends BaseFormatAnyDateOptions {
    output: "iso";
}

export interface ISODateFormatOptions extends BaseFormatAnyDateOptions {
    output: "iso-date";
}

export interface TimestampFormatOptions extends BaseFormatAnyDateOptions {
    output: "timestamp";
}

export interface DateObjectFormatOptions extends BaseFormatAnyDateOptions {
    output: "date";
}

export type FormatAnyDateOptions =
    | JalaliFormatOptions
    | JalaliLatinFormatOptions
    | JalaliDateTimeFormatOptions
    | GregorianFormatOptions
    | ISOFormatOptions
    | ISODateFormatOptions
    | TimestampFormatOptions
    | DateObjectFormatOptions;

/**
 * Unified date formatter.
 *
 * **Default behavior**: always returns Jalali `yyyy/MM/dd` with Persian digits,
 * regardless of input type (Date, timestamp, Jalali string, ISO string, …).
 *
 * Override the shape via `options.output`.
 *
 * @example
 * formatAnyDate("1403/05/12")             // "۱۴۰۳/۰۵/۱۲"
 * formatAnyDate("2024-08-02")             // "۱۴۰۳/۰۵/۱۲"
 * formatAnyDate(new Date())               // "۱۴۰۳/۰۵/۱۲"
 * formatAnyDate(1722596400000)            // "۱۴۰۳/۰۵/۱۲"
 * formatAnyDate("1403/05/12", { output: "iso" })        // "2024-08-02T…"
 * formatAnyDate("1403/05/12", { output: "gregorian" })  // "2024/08/02"
 * formatAnyDate("1403/05/12", { output: "date" })       // Date object
 */
// Overloads: default → string; output "date" → Date; "timestamp" → number
export function formatAnyDate(
    input: DateInput | null | undefined,
    options?: JalaliFormatOptions | JalaliLatinFormatOptions | JalaliDateTimeFormatOptions | GregorianFormatOptions | ISOFormatOptions | ISODateFormatOptions,
): string | null;
export function formatAnyDate(
    input: DateInput | null | undefined,
    options: TimestampFormatOptions,
): number | null;
export function formatAnyDate(
    input: DateInput | null | undefined,
    options: DateObjectFormatOptions,
): Date | null;
export function formatAnyDate(
    input: DateInput | null | undefined,
    options: FormatAnyDateOptions = {},
): string | number | Date | null {
    const { fallback = "" } = options;

    if (input == null || input === "") return fallback || null;

    const date = isJalaliDateString(input)
        ? parseJalali(String(input))
        : toDate(input);

    if (!date || Number.isNaN(date.getTime())) {
        return fallback || null;
    }

    const output: DateOutputType = options.output ?? "jalali";
    const pattern = "pattern" in options ? options.pattern : undefined;

    switch (output) {
        case "jalali":
            return formatJalali(date, pattern ?? JALALI_DATE_FORMAT);

        case "jalali-latin":
            return formatJalali(date, pattern ?? JALALI_DATE_FORMAT, {
                persianDigits: false,
            });

        case "jalali-datetime":
            return formatJalali(date, pattern ?? JALALI_DATE_TIME_FORMAT);

        case "gregorian": {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            if (pattern === "yyyy/MM/dd HH:mm") {
                const hh = String(date.getHours()).padStart(2, "0");
                const mm = String(date.getMinutes()).padStart(2, "0");
                return `${y}/${m}/${d} ${hh}:${mm}`;
            }
            return `${y}/${m}/${d}`;
        }

        case "iso":
            return date.toISOString();

        case "iso-date": {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
        }

        case "timestamp":
            return date.getTime();

        case "date":
            return date;

        default:
            return fallback || null;
    }
}

// ---------- Getters ----------
export const getJalaliYear = (date: DateInput): number =>
    getYear(toDate(date));

/** Jalali month number (1–12). */
export const getJalaliMonth = (date: DateInput): number =>
    getMonth(toDate(date)) + 1;

export const getJalaliDay = (date: DateInput): number => getDate(toDate(date));

export const getJalaliMonthName = (date: DateInput): string =>
    formatJalali(date, "MMMM");

// ---------- Predicates ----------
export interface NowOptions {
    now?: Date;
}

export const isTodayJalali = (
    date: DateInput,
    options: NowOptions = {},
): boolean => {
    const d = toDate(date);
    if (!isValid(d)) return false;
    return isSameDay(d, options.now ?? new Date());
};

export const isValidJalaliDate = (value: unknown): boolean => {
    if (value instanceof Date) return isValid(value);
    if (typeof value === "number") return isValid(new Date(value));
    if (typeof value === "string") {
        if (!value.trim()) return false;
        if (isJalaliDateString(value)) return parseJalali(value) !== null;
        return isValid(new Date(value));
    }
    return false;
};

// ---------- Boundaries ----------
export const startOfJalaliDay = (date: DateInput): Date =>
    startOfDay(toDate(date));

export const endOfJalaliDay = (date: DateInput): Date =>
    endOfDay(toDate(date));

export const startOfJalaliMonth = (date: DateInput): Date =>
    startOfMonth(toDate(date));

export const endOfJalaliMonth = (date: DateInput): Date =>
    endOfMonth(toDate(date));

// ---------- Arithmetic ----------
export const addJalaliDays = (date: DateInput, amount: number): Date =>
    addDays(toDate(date), amount);

export const subJalaliDays = (date: DateInput, amount: number): Date =>
    subDays(toDate(date), amount);

// ---------- Diff ----------
export const diffJalaliDays = (a: DateInput, b: DateInput): number =>
    differenceInCalendarDays(toDate(a), toDate(b));

// ---------- Relative ----------
export const formatJalaliRelative = (date: DateInput): string => {
    const d = toDate(date);
    if (!isValid(d)) return "";

    try {
        if (typeof formatDistanceToNow === "function") {
            const result = formatDistanceToNow(d, {
                addSuffix: true,
                locale: faIR,
            });
            return toPersianDigits(result);
        }
    } catch {
        // fall through
    }

    return formatJalaliDate(d);
};