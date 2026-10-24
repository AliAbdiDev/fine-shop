import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

//-----------------------------

type AnyFn<A extends unknown[]> = (...args: A) => void;

export interface DebouncedCallback<A extends unknown[]> {
    (...args: A): void;
    flush: () => void;
    cancel: () => void;
    isPending: () => boolean;
}


export function useDebouncedCallback<A extends unknown[]>(
    fn: AnyFn<A>,
    delay = 300,
): DebouncedCallback<A> {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pending = useRef<A | null>(null);

    const fnRef = useRef(fn);
    // eslint-disable-next-line react-hooks/refs
    fnRef.current = fn;

    const clear = useCallback(() => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
    }, []);

    const run = useCallback(() => {
        const args = pending.current;
        pending.current = null;
        clear();
        if (args) fnRef.current(...args);
    }, [clear]);

    const debounced = useCallback(
        (...args: A) => {
            pending.current = args;
            clear();
            timer.current = setTimeout(run, delay);
        },
        [clear, run, delay],
    );

    const flush = useCallback(() => {
        if (pending.current) run();
    }, [run]);

    const cancel = useCallback(() => {
        pending.current = null;
        clear();
    }, [clear]);

    const isPending = useCallback(() => pending.current !== null, []);

    // فلاش هنگام unmount تا آخرین ویرایش گم نشود
    useEffect(
        () => () => {
            const args = pending.current;
            pending.current = null;
            if (timer.current) clearTimeout(timer.current);
            if (args) fnRef.current(...args);
        },
        [],
    );

    return useMemo(
        // eslint-disable-next-line react-hooks/refs
        () => Object.assign(debounced, { flush, cancel, isPending }),
        [debounced, flush, cancel, isPending],
    );
}
