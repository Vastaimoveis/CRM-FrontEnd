
import { Search, Plus } from "lucide-react";
import ScriptFilter from "./scriptFilter";
import type { ScriptCategories } from "@/services/script/ScriptTypes";

interface ScriptHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onFilter: (value: ScriptCategories | "") => Promise<void>;
    onCreate: () => void;
}

export default function ScriptHeader({
    search,
    onSearchChange,
    onCreate,
    onFilter
}: ScriptHeaderProps) {
    return (
        <section className="
            w-full
            flex flex-col sm:flex-row
            items-stretch sm:items-center
            justify-center
            gap-4
        ">
            {/* Pesquisa */}
            <div className="
                flex items-center
                w-full sm:max-w-md
                h-11
                px-3
                gap-3
                rounded-lg
                border border-gray-300
                bg-white
                focus-within:border-verde
                focus-within:ring-1
                focus-within:ring-verde
                transition
            ">
                <Search
                    size={19}
                    className="text-gray-400 shrink-0"
                />

                <input
                    type="search"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Pesquisar scripts..."
                    className="
                        w-full
                        h-full
                        outline-none
                        bg-transparent
                        text-sm
                        text-gray-700
                        placeholder:text-gray-400
                    "
                />
            </div>

            {/* Criar */}
            <button
                type="button"
                onClick={onCreate}
                className="
                    flex items-center justify-center
                    gap-2
                    h-11
                    px-5
                    rounded-lg
                    bg-black
                    hover:bg-gray-800
                    text-white
                    font-medium
                    text-sm
                    transition-colors
                    cursor-pointer
                    whitespace-nowrap
                "
            >
                <Plus size={19} />
                Criar um novo
            </button>
            <ScriptFilter onFilter={onFilter}/>
        </section>
    );
}
