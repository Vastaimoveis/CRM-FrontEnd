
import { useEffect, useState } from "react";

import ScriptHeader from "../components/ScriptHeader/scriptheader";
import ScriptMain from "../components/ScriptMain/ScriptMain";
import { useScript } from "@/app/providers/Script/ScriptProvider";
import { ScriptCategories, type CreateScript, type Script, type UpdateScript } from "@/services/script/ScriptTypes";
import CreateScriptModal from "../components/ScriptModals/ScriptModal";
import ScriptEditModal from "../components/ScriptModals/ScriptEditModal";
import ScriptDeleteModal from "../components/ScriptModals/ScriptDeleteModal";
import { useToast } from "@/app/providers/Toast/ToastProvider";

export default function ScriptPageMain() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedScript, setSelectedScript] = useState<Script | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { showToast } = useToast();

    const {
        scripts,
        pagination,
        loading,
        saving,
        deletingId,
        searchScripts,
        filterScript,
        createScript,
        updateScript,
        deleteScript,
    } = useScript();

    async function handleCreateScript(data: CreateScript) {
        await createScript(data);

        // Atualiza a listagem respeitando a pesquisa e a página atual.
        await searchScripts(debouncedSearch, page, 10);

        setShowCreateModal(false);
    }

    async function handleFilterScript(data: ScriptCategories | "") {
        await filterScript({ category: data });
    }

    function handleEdit(script: Script) {
        setSelectedScript(script);
        setShowEditModal(true);
    }

    function handleDelete(script: Script) {
        setSelectedScript(script);
        setShowDeleteModal(true);
    }

    async function handleUpdateScript(data: UpdateScript) {
        await updateScript(data);

        await searchScripts(debouncedSearch, page, 10);

        setShowEditModal(false);
        setSelectedScript(null);
    }

    async function handleDeleteScript() {
        if (!selectedScript) return;

        await deleteScript(selectedScript.id);

        await searchScripts(debouncedSearch, page, 10);

        setShowDeleteModal(false);
        setSelectedScript(null);
    }

    async function handleCopy(script: Script) {
        await navigator.clipboard.writeText(script.message);
        showToast("Script copiado com sucesso!", "success");
    }

    // Debounce da pesquisa
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, search.trim() ? 400 : 0);

        return () => clearTimeout(timeout);
    }, [search]);

    // Volta para a primeira página ao alterar a pesquisa
    useEffect(() => {
        setPage(0);
    }, [debouncedSearch]);

    // Busca os scripts conforme pesquisa e paginação
    useEffect(() => {
        searchScripts(debouncedSearch, page, 10)
            .catch(() => {
                // O erro já é tratado pelo ScriptProvider.
            });
    }, [debouncedSearch, page, searchScripts]);

    return (
        <main className="w-full flex flex-col gap-6">
            <ScriptHeader
                search={search}
                onSearchChange={setSearch}
                onCreate={() => setShowCreateModal(true)}
                onFilter={handleFilterScript}
            />

            <ScriptMain
                scripts={scripts}
                loading={loading}
                pagination={pagination}
                page={page}
                onPageChange={setPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCopy={handleCopy}
            />

            {showCreateModal && (
                <CreateScriptModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateScript}
                    loading={saving}
                />
            )}

            {showEditModal && selectedScript && (
                <ScriptEditModal
                    script={selectedScript}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedScript(null);
                    }}
                    onSubmit={handleUpdateScript}
                    loading={saving}
                />
            )}

            {showDeleteModal && selectedScript && (
                <ScriptDeleteModal
                    script={selectedScript}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedScript(null);
                    }}
                    onConfirm={handleDeleteScript}
                    loading={deletingId === selectedScript.id}
                />
            )}
        </main>
    );
}
