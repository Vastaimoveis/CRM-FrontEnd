
import { memo } from "react";
import { ChevronDown } from "lucide-react";

import { LeadStatus } from "@/shared/types/LeadType";

interface CorretorOption {
    id: string;
    nome: string;
}

interface LeadsFilterProps {
    status: LeadStatus | "";
    search: string;
    userId: string | null;
    corretores: CorretorOption[];
    canFilterByCorretor: boolean;

    onStatusChange: (status: LeadStatus | null) => void;
    onSearchChange: (search: string) => void;
    onUserChange: (userId: string | null) => void;
}

function LeadsFilter({
    status,
    search,
    userId,
    corretores,
    canFilterByCorretor,
    onStatusChange,
    onSearchChange,
    onUserChange
}: LeadsFilterProps) {

    return (
        <div className="flex flex-wrap items-center gap-4">

            {/* STATUS */}
            <select
                value={status}
                onChange={e => {
                    const value = e.target.value;

                    onStatusChange(
                        value ? value as LeadStatus : null
                    );
                }}
                className="border rounded-md px-3 py-2"
            >
                <option value="">Todos os status</option>

                {Object.values(LeadStatus).map(status => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>

            {/* PESQUISA */}
            <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                className="border rounded-md px-3 py-2 w-64"
            />

            {/* CORRETOR */}
            {canFilterByCorretor && (
                <label className="relative flex min-w-0 items-center">

                    <span className="sr-only">
                        Filtrar corretor
                    </span>

                    <select
                        value={userId ?? ""}
                        onChange={e =>
                            onUserChange(e.target.value || null)
                        }
                        className="
                            w-full appearance-none
                            rounded-lg border border-slate-200
                            bg-white py-2 pl-3 pr-9
                            text-sm outline-none
                            focus:border-sky-500
                            sm:w-48
                        "
                    >
                        <option value="">
                            Todos os corretores
                        </option>

                        {corretores.map(corretor => (
                            <option
                                key={corretor.id}
                                value={corretor.id}
                            >
                                {corretor.nome}
                            </option>
                        ))}
                    </select>

                    <ChevronDown
                        size={16}
                        className="
                            pointer-events-none
                            absolute right-3
                            text-slate-500
                        "
                    />

                </label>
            )}

        </div>
    );
}

export default memo(LeadsFilter);
