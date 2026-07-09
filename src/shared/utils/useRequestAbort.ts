import { useCallback, useEffect, useRef } from "react";

export default function useAbortableRequest() {
    const controllerRef = useRef<AbortController | null>(null);

    const run = useCallback(async <T,>(
        fn: (signal: AbortSignal) => Promise<T>
    ): Promise<T> => {
        controllerRef.current?.abort();

        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            return await fn(controller.signal);
        } finally {
            if (controllerRef.current === controller) {
                controllerRef.current = null;
            }
        }
    }, []);

    useEffect(() => {
        return () => controllerRef.current?.abort();
    }, []);

    return run;
}