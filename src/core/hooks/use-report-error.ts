'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { APP_MODE } from '../constants';
import { type AppError } from '../services/configs/fetcher/fetcher.type';

export function useReportError() {
    const router = useRouter();

    return useCallback(
        (error: AppError): AppError => {
            if (APP_MODE.isProd) console.debug('[AppError]', error);
            if (error.kind === 'auth') router.replace('/signin');
            return error;
        },
        [router],
    );
}
