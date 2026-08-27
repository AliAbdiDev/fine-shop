import type { FetchOptions } from 'ofetch';

export interface TransformOptions {
  skipTransform?: boolean;
}

export type FetcherOptions = FetchOptions<'json'> & TransformOptions;

export type RequestOptions = Omit<FetcherOptions, 'method' | 'body'>;

export type RequestBody = FetchOptions['body'];