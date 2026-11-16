
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import type {
    Script,
    CreateScript,
    UpdateScript,
    ScriptFilterCategory,
} from "@/services/script/ScriptTypes";

import type { PageResponse } from "@/shared/types/api";

import {
    createScript as createScriptRequest,
    findAllScript,
    searchScript,
    findScriptById as findScriptByIdRequest,
    updateScript as updateScriptRequest,
    deleteScript as deleteScriptRequest,
    filterScriptCategory,
} from "@/services/script/ScriptService";

interface ScriptContext {
    scripts: Script[];
    pagination: PageResponse<Script> | null;

    loading: boolean;
    saving: boolean;
    deletingId: string | null;
    error: string | null;

    fetchScripts: (page?: number, size?: number) => Promise<void>;
    searchScripts: (
        search: string,
        page?: number,
        size?: number
    ) => Promise<void>;

    createScript: (data: CreateScript) => Promise<Script>;
    filterScript: (
        data: ScriptFilterCategory,
        page?: number,
        size?: number
    ) => Promise<void>;
    updateScript: (data: UpdateScript) => Promise<Script>;
    deleteScript: (id: string) => Promise<void>;
    findScriptById: (id: string) => Promise<Script>;

    clearError: () => void;
}

const ScriptContext = createContext<ScriptContext | null>(null);

export function ScriptProvider({ children }: { children: ReactNode }) {
    const [scripts, setScripts] = useState<Script[]>([]);
    const [pagination, setPagination] = useState<PageResponse<Script> | null>(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    const getErrorMessage = (err: unknown): string => {
        if (err instanceof Error) {
            return err.message;
        }

        return "Ocorreu um erro ao realizar a operação.";
    };

    const fetchScripts = useCallback(async (
        page = 0,
        size = 10
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response = await findAllScript(page, size);

            setScripts(response.content);
            setPagination(response);
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const searchScripts = useCallback(async (
        search: string,
        page = 0,
        size = 10
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response = search.trim()
                ? await searchScript(search.trim(), page, size)
                : await findAllScript(page, size);

            setScripts(response.content);
            setPagination(response);
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const filterScript = useCallback(
        async (category: ScriptFilterCategory, page = 0, size = 10) => {
            setLoading(true);
            setError(null);
            try {
                const response = await filterScriptCategory(category, page, size)
                setScripts(response.content);
                setPagination(response)
            } catch (error) {
                setError(getErrorMessage(error));
                throw (error)
            } finally {
                setLoading(false);
            }
        }
        , [])

    const createScript = useCallback(async (data: CreateScript) => {
        setSaving(true);
        setError(null);

        try {
            const createdScript = await createScriptRequest(data);

            setScripts(prev => [createdScript, ...prev]);

            setPagination(prev => prev ? {
                ...prev,
                totalElements: prev.totalElements + 1,
                numberOfElements: prev.numberOfElements + 1,
                empty: false,
            } : prev);

            return createdScript;
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        } finally {
            setSaving(false);
        }
    }, []);

    const updateScript = useCallback(async (data: UpdateScript) => {
        setSaving(true);
        setError(null);

        try {
            const updatedScript = await updateScriptRequest(data);

            setScripts(prev =>
                prev.map(script =>
                    script.id === updatedScript.id
                        ? updatedScript
                        : script
                )
            );

            return updatedScript;
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        } finally {
            setSaving(false);
        }
    }, []);

    const deleteScript = useCallback(async (id: string) => {
        setDeletingId(id);
        setError(null);

        try {
            await deleteScriptRequest(id);

            setScripts(prev =>
                prev.filter(script => script.id !== id)
            );

            setPagination(prev => prev ? {
                ...prev,
                totalElements: Math.max(0, prev.totalElements - 1),
                numberOfElements: Math.max(0, prev.numberOfElements - 1),
                empty: prev.numberOfElements <= 1,
            } : prev);
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        } finally {
            setDeletingId(null);
        }
    }, []);

    const findScriptById = useCallback(async (id: string) => {
        setError(null);

        try {
            return await findScriptByIdRequest(id);
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = useMemo(() => ({
        scripts,
        pagination,
        loading,
        saving,
        deletingId,
        error,

        fetchScripts,
        searchScripts,
        filterScript,
        createScript,
        updateScript,
        deleteScript,
        findScriptById,

        clearError,
    }), [
        scripts,
        pagination,
        loading,
        saving,
        deletingId,
        error,
        fetchScripts,
        searchScripts,
        filterScript,
        createScript,
        updateScript,
        deleteScript,
        findScriptById,
        clearError,
    ]);

    return (
        <ScriptContext.Provider value={value}>
            {children}
        </ScriptContext.Provider>
    );
}

export function useScript() {
    const context = useContext(ScriptContext);

    if (!context) {
        throw new Error(
            "useScript deve ser usado dentro de ScriptProvider"
        );
    }

    return context;
}
