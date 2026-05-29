import { LeadStatus } from "@/shared/types/LeadType";
import { useState } from "react";

interface LeadsFilterProps {
    status: LeadStatus | "",
    search: string,
    onStatusChange: (status: LeadStatus | null) => void;
    onSearchChange: (search: string) => void;
}

export default function LeadsFilter({
    status,
    search,
    onStatusChange,
    onSearchChange,
}: LeadsFilterProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="flex gap-4">
            <select
                value={status || ""}
                onChange={(e) => {
                    const selectedStatus = e.target.value as LeadStatus;
                    if (e.target.value === "") {
                        onStatusChange(null)
                    }
                    onStatusChange(selectedStatus);
                }}

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
            {
                isOpen &&
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => {
                        setIsOpen(false)
                    }}>
                    <div className="bg-white rounded-xl p-6 w-200 max-h-[90vh] flex flex-col">
                        <h1 className="text-2xl">tem certeza que quer <strong>Encerrar</strong> esse lead?</h1>
                        <div>
                            <button className="bg-green-800">Confirmar</button>
                            <button className="bg-red-800">Cancelar</button>
                        </div>
                    </div>
                </div>
            }
        </div >
    );
}