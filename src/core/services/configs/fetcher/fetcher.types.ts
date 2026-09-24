import type { FetchOptions } from 'ofetch';

export interface TransformOptions {
  skipTransform?: boolean;
}

/**
 * نوع body از ofetch (بدون undefined).
 * از NonNullable استفاده می‌کنیم چون خودِ فیلد body در FetchOptions اختیاری است
 * و می‌خوایم فقط نوع غیر undefined رو استخراج کنیم.
 */
export type RequestBody = NonNullable<FetchOptions<'json'>['body']>;

/**
 * FetcherOptions روی TBody جنییریک است،
 * و TBody محدود به RequestBody است تا با ofetch سازگار باشد.
 */
export type FetcherOptions<TBody extends RequestBody = RequestBody> =
  Omit<FetchOptions<'json'>, 'body'> &
  TransformOptions & {
    body?: TBody;
  };

/** برای متدهای بدون body (GET) */
export type RequestOptions = Omit<FetcherOptions, 'method' | 'body'>;