import { LeadStatus } from "@/shared/types/LeadType";

interface LeadsFilterProps {
    status: LeadStatus | null;
    search: string;
    onStatusChange: (status: string) => void;
    onSearchChange: (search: string) => void;
}

export default function LeadsFilter({
    status,
    search,
    onStatusChange,
    onSearchChange,
}: LeadsFilterProps) {
    return (
        <div className="flex gap-4">
            <select
                value={status || ""}
                onChange={(e) => onStatusChange(e.target.value)}
                className="border rounded-md px-3 py-2"
            >
                <option value="">Todos os status</option>

                {Object.values(LeadStatus).map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="border rounded-md px-3 py-2 w-64"
            />
        </div>
    );
}