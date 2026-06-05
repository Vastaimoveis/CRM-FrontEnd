import type { LeadStatus } from "@/shared/types/LeadType";

interface statusChange {
    id: string;
    status: LeadStatus;
}

interface props {
    pendingStatusChange: statusChange;
    patchLeadStatus: (id: string, status: LeadStatus) => Promise<void>
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setPendingStatusChange: React.Dispatch<React.SetStateAction<{
        id: string;
        status: LeadStatus;
    } | null>>;
};

export function leadConfirmModal({ patchLeadStatus, pendingStatusChange, setIsOpen, setPendingStatusChange }: props) {

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div className="bg-white rounded-xl p-6 w-100 max-h-[90vh] flex flex-col gap-10">
                <h1 className="text-2xl">tem certeza que quer <strong>Encerrar</strong> esse lead?</h1>
                <div className="flex gap-10 place-self-center">
                    <button
                        className="bg-green-500 rounded-2xl p-2 hover:bg-green-800"
                        onClick={async () => {
                            if (pendingStatusChange) {
                                await patchLeadStatus(
                                    pendingStatusChange.id,
                                    pendingStatusChange.status
                                );
                            }

                            setPendingStatusChange(null);
                            setIsOpen(false);
                        }}
                    >
                        Confirmar
                    </button>
                    <button
                        className="bg-red-600 rounded-2xl p-2 hover:bg-red-800"
                        onClick={() => {
                            setPendingStatusChange(null);
                            setIsOpen(false);
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}