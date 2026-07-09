import { useCallback, useRef } from "react";

export default function useRequestLatest() {
    const requestId = useRef(0);

    const run = useCallback(async <T,>(
        fn: () => Promise<T>
    ): Promise<T | null> => {
        const id = ++requestId.current;

        const result = await fn();

        if (id !== requestId.current) {
            return null
        }

        return result;
    }, []);

    return run;
}