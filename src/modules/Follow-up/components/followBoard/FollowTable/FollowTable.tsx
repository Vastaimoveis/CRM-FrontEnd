import { Info } from "lucide-react";
import FollowCell from "../FollowCell/FollowCell";
import type { FollowUp, FollowUpStatus } from "@/shared/types/followUpTypes";

interface Props{
        statusStyles: Record<FollowUpStatus, string>;
        followUps: FollowUp[];
}

export default function FollowTable({followUps,statusStyles}:Props){
    return (
        <div className="w-full ">
                <table className="w-full min-w-[1050px] border-collapse text-left text-sm">

                    <thead className="bg-white">
                        <tr className="border-b border-slate-200 text-slate-700">
                            <th className="px-3 py-5 font-medium">Cliente</th>
                            <th className="px-3 py-5 font-medium">Telefone</th>
                            <th className="px-3 py-5 font-medium">Status</th>

                            <th className="px-3 py-5 font-medium">
                                <div className="relative inline-flex items-center gap-1 group">
                                    <span className="cursor-help">
                                        Follow-up
                                    </span>

                                    <Info
                                        size={14}
                                        className="text-slate-400 cursor-help"
                                    />

                                    <div
                                        className="
                                            absolute
                                            left-1/2
                                            top-full
                                            z-[999]
                                            mt-2
                                            -translate-x-1/2
                                            whitespace-nowrap
                                            rounded-md
                                            bg-slate-900
                                            px-3
                                            py-2
                                            text-xs
                                            font-normal
                                            text-white
                                            shadow-lg
                                            opacity-0
                                            invisible
                                            pointer-events-none
                                            transition-opacity
                                            duration-200
                                            group-hover:visible
                                            group-hover:opacity-100
                                        "
                                    >
                                        Data do último contato realizado
                                    </div>
                                </div>
                            </th>

                            <th className="px-3 py-5 font-medium">
                                Último contato
                            </th>

                            <th className="px-3 py-5 font-medium">
                                Próximo contato
                            </th>

                            <th className="px-3 py-5 font-medium">
                                Dias em atraso
                            </th>

                            <th className="px-3 py-5 font-medium">Ação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {followUps.map((item) => (
                             <FollowCell followUp={item} statusStyles={statusStyles} />     
                                      ))}
                    </tbody>
                </table>
            </div>
    )
}