import { useCallback, useRef } from "react";

export default function useRequestLock() {
    const locked = useRef(false)

    const run = useCallback(async <T,>(fn: () => Promise<T>) => {
        if (locked.current) {
            throw new Error("Já existe uma requisição em andamento.");
        };

        locked.current = true;

        try {
            return await fn();
        } finally {
            locked.current = false;
        }
    }, []);

    return run;
}