import type { Script } from "@/services/script/ScriptTypes";
import type { PageResponse } from "@/shared/types/api";

import ScriptList from "./ScriptList/ScriptList";
import ScriptPagination from "./ScriptPagination/ScriptPagination";
import ScriptEmptyState from "./ScriptEmptySpace/ScriptEmptySpace";

interface ScriptMainProps {
    scripts: Script[];
    loading: boolean;
    pagination: PageResponse<Script> | null;
    page: number;
    onPageChange: (page: number) => void;
    onEdit: (script: Script) => void;
    onDelete: (script: Script) => void;
    onCopy: (script: Script) => void;
}

export default function ScriptMain({
    scripts,
    loading,
    pagination,
    page,
    onPageChange,
    onEdit,
    onDelete,
    onCopy
}: ScriptMainProps) {
    if (loading) {
        return (
            <section className="w-full flex justify-center py-12">
                <span className="text-sm text-gray-500">
                    Carregando scripts...
                </span>
            </section>
        );
    }

    if (scripts.length === 0) {
        return <ScriptEmptyState />;
    }

    return (
        <section className="w-full flex flex-col gap-4">

            <ScriptList
                scripts={scripts}
                onEdit={onEdit}
                onDelete={onDelete}
                onCopy={onCopy}
            />

            {pagination && (
                <div className="w-full max-w-4xl mx-auto">
                    <ScriptPagination
                        pagination={pagination}
                        page={page}
                        onPageChange={onPageChange}
                    />
                </div>
            )}

        </section>
    );
}