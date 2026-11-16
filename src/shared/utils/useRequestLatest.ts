
import { useCallback, useRef } from "react";

export default function useRequestLatest() {
    const requestId = useRef(0);

    const run = useCallback(async <T,>(
        fn: () => Promise<T>
    ): Promise<T | null> => {
        const id = ++requestId.current;

        try {
            const result = await fn();

            if (id !== requestId.current) {
                return null;
            }

            return result;

        } catch (error) {
            if (id !== requestId.current) {
                return null;
            }

            throw error;
        }
    }, []);

    return run;
}
