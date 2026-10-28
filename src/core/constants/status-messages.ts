export const INTERNAL_ERROR_CODES = ['NETWORK_ERROR', 'UNKNOWN_ERROR'] as const;
export const GENERIC_ERROR = 'خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.';
export const GENERIC_SUCCESS = 'عملیات با موفقیت انجام شد.';

export const ERROR_MESSAGES = {
    INVALID_REQUEST: 'درخواست نامعتبر است.',
    VALIDATION_ERROR: 'داده‌ واردشده نامعتبر است.',
    TOKEN_MISSING: 'برای ادامه باید وارد شوید.',
    TOKEN_EXPIRED: 'نشست شما منقضی شده است. دوباره وارد شوید.',
    TOKEN_INVALID: 'نشست شما نامعتبر است. دوباره وارد شوید.',
    PERMISSION_DENIED: 'شما به این بخش دسترسی ندارید.',
    NOT_FOUND: 'موردی یافت نشد.',
    EMAIL_ALREADY_EXISTS: 'این ایمیل قبلاً ثبت شده است.',
    NUMBER_ALREADY_EXIST: 'این شماره قبلاً ثبت شده است.',
    RATE_LIMIT_EXCEEDED: 'تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.',
    SERVER_ERROR: 'خطای سرور. لطفاً بعداً تلاش کنید.',
    NETWORK_ERROR: 'خطا در برقراری ارتباط. اینترنت خود را بررسی کنید.',
    UNKNOWN_ERROR: GENERIC_ERROR,
} as const;


export type InternalErrorCode = (typeof INTERNAL_ERROR_CODES)[number];
export type ErrorMessagesKeys = keyof typeof ERROR_MESSAGES;
export type BackendErrorCode = Exclude<ErrorMessagesKeys, InternalErrorCode>;
export type AppErrorCode = BackendErrorCode | InternalErrorCode;