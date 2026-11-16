
import { useCallback, useRef } from "react";

export function useRequestPromise() {
    const promiseRef = useRef<Promise<unknown> | null>(null);

    const run = useCallback(
        <T,>(fn: () => Promise<T>): Promise<T> => {
            if (promiseRef.current) {
                return promiseRef.current as Promise<T>;
            }

            const promise = Promise.resolve()
                .then(fn)
                .finally(() => {
                    if (promiseRef.current === promise) {
                        promiseRef.current = null;
                    }
                });

            promiseRef.current = promise;

            return promise;
        },
        []
    );

    return run;
}
