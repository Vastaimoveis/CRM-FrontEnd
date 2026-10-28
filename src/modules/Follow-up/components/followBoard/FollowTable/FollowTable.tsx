
import { ArrowUpRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FollowCell from "../FollowCell/FollowCell";

import type {
    FollowUp,
    FollowUpStatus
} from "@/shared/types/followUpTypes";

interface Props {
    followUps: FollowUp[];

    showFilters: boolean;

    statusStyles: Record<FollowUpStatus, string>;

    onScheduleNext: (followUp: FollowUp) => void;
    onReschedule: (followUp: FollowUp) => void;
    onCancel: (followUp: FollowUp) => void;
}

export default function FollowTable({
    followUps,
    showFilters,
    onScheduleNext,
    onReschedule,
    onCancel
}: Props) {

    const navigate = useNavigate();

    return (
        <div className="w-full overflow-x-auto">

            <table className="
                w-full min-w-200
                table-auto border-collapse
                text-left text-sm
            ">

                <thead className="bg-white">

                    <tr className="border-b border-slate-200 text-slate-700">

                        <th className="px-3 py-5 font-medium">
                            Cliente
                        </th>

                        <th className="px-3 py-5 font-medium">
                            Telefone
                        </th>

                        <th className="px-3 py-5 font-medium">
                            Status
                        </th>

                        <th className="px-3 py-5 font-medium">
                            <span className="inline-flex items-center gap-1">
                                Follow-up
                                <Info size={14} className="text-slate-400" />
                            </span>
                        </th>

                        {showFilters && (
                            <>
                                <th className="px-3 py-5 font-medium">
                                    Último contato
                                </th>

                                <th className="px-3 py-5 font-medium">
                                    Próximo contato
                                </th>
                            </>
                        )}

                        <th className="px-3 py-5 font-medium">
                            Próxima ação
                        </th>

                        <th className="px-3 py-5 text-right font-medium">
                            {showFilters ? (
                                "Ação"
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => navigate("/follow")}
                                    className="
                                        inline-flex items-center gap-1
                                        whitespace-nowrap font-semibold
                                        text-sky-600 hover:text-sky-800
                                    "
                                >
                                    Ver todos
                                    <ArrowUpRight size={15} />
                                </button>
                            )}
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {followUps.map(item => (
                        <FollowCell
                            key={item.id}
                            followUp={item}
                            showFilters={showFilters}
                            onScheduleNext={onScheduleNext}
                            onReschedule={onReschedule}
                            onCancel={onCancel}
                        />
                    ))}

                    {!followUps.length && (
                        <tr>
                            <td
                                colSpan={showFilters ? 8 : 6}
                                className="px-4 py-10 text-center text-slate-500"
                            >
                                Nenhum Follow-up encontrado.
                            </td>
                        </tr>
                    )}

                </tbody>

            </table>

        </div>
    );
}
