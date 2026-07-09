import { useCallback, useRef } from "react";

export function useRequestPromise() {
    const promiseRef = useRef<Promise<unknown> | null>(null);

    const run = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
        if (promiseRef.current) {
            return promiseRef.current as Promise<T>;
        }

        promiseRef.current = (async () => {
            try {
                return await fn();
            } finally {
                promiseRef.current = null;
            }
        })();

        return promiseRef.current as Promise<T>;
    }, []);

    return run;
}