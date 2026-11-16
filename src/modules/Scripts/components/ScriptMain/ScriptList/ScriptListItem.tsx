import { useState } from "react";

import type { Script } from "@/services/script/ScriptTypes";
import {
    ScriptCategoryLabels,
    ScriptCategories,
} from "@/services/script/ScriptTypes";
import ScriptListAction from "./ScriptListAction";

interface ScriptListItemProps {
    script: Script;
    onEdit: (script: Script) => void;
    onDelete: (script: Script) => void;
    onCopy: (script: Script) => void;
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(date));
}

export default function ScriptListItem({
    script,
    onEdit,
    onDelete,
    onCopy
}: ScriptListItemProps) {
    const [expanded, setExpanded] = useState(false);
    const [hovered, setHovered] = useState(false);

    const isExpanded = expanded || hovered;

    const categoryLabel = script.categories
        ? ScriptCategoryLabels[
            script.categories as ScriptCategories
        ] ?? script.categories
        : "Sem categoria";

    return (
        <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`
                w-8/10 place-self-center rounded-xl border bg-white
                transition-all duration-300
                ${isExpanded
                    ? "border-green-300 shadow-md"
                    : "border-gray-200 shadow-sm hover:shadow-md"
                }
            `}
        >
            <div className="p-4 flex flex-col gap-3">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between gap-4">

                    <button
                        type="button"
                        onClick={() => setExpanded((prev) => !prev)}
                        aria-expanded={isExpanded}
                        className="flex-1 min-w-0 text-left"
                    >
                        <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-sm font-semibold text-gray-800 truncate">
                                {script.title}
                            </h3>

                            <span className="
                                inline-flex items-center
                                px-2.5 py-1 rounded-full
                                bg-green-50 text-green-700
                                text-xs font-medium whitespace-nowrap
                            ">
                                {categoryLabel}
                            </span>

                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                            Criado em {formatDate(script.createdAt)}
                        </p>
                    </button>

                    <div className="shrink-0">
                        <ScriptListAction 
                        script={script} 
                        onDelete={onDelete} 
                        onEdit={onEdit} 
                        onCopy={onCopy}/>
                    </div>

                </div>

                {/* Mensagem */}
                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    aria-expanded={isExpanded}
                    className="w-full text-left"
                >
                    <div
                        className={`
                            overflow-hidden transition-all duration-300
                            ${isExpanded
                                ? "max-h-250"
                                : "max-h-11"
                            }
                        `}
                    >
                        <p className={`
                            text-sm text-gray-600
                            whitespace-pre-wrap wrap-break-word
                            ${isExpanded ? "" : "line-clamp-2"}
                        `}>
                            {script.message}
                        </p>
                    </div>

                    {!isExpanded && (
                        <span className="
                            inline-block mt-2
                            text-xs font-medium text-green-600
                        ">
                            Ver mensagem completa
                        </span>
                    )}

                </button>

            </div>
        </article>
    );
}