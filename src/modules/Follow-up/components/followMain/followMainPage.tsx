
import { useState } from "react";
import FollowAlerta from "../followAlerta";
import FollowSummaryBoard from "../followSummary/followSummaryBoard";
import FollowTableBoard from "../followTable/followTableBoard";
import FollowNextBoard from "../followNexts/followNextsBoard";
import FollowRankingBoard from "../followRanking/followRankingBoard";
import FollowUps from "../../pages/followUpPage";
import { FollowUpTab, type followUpLead, type typeTabs, } from "../../hooks/types";
import { LeadStatus } from "@/shared/types/LeadType";

const followUps: followUpLead[] = [
    {
        id: "1",
        cliente: "Eduardo",
        telefone: "(41) 99836-9955",
        status: LeadStatus.AGUARDANDO,
        etapa: "3 / 6",
        ultimoContato: "18/09/2026 10:14",
        proximoContato: "20/09/2026",
        diasAtraso: 5,
    },
    {
        id: "2",
        cliente: "Raquel",
        telefone: "(54) 99623-2274",
        status: LeadStatus.ATENDIMENTO,
        etapa: "2 / 6",
        ultimoContato: "17/09/2026 14:32",
        proximoContato: "21/09/2026",
        diasAtraso: 3,
    },
    {
        id: "3",
        cliente: "Andreia",
        telefone: "(41) 99903-7318",
        status: LeadStatus.AGUARDANDO,
        etapa: "4 / 6",
        ultimoContato: "15/09/2026 16:21",
        proximoContato: "19/09/2026",
        diasAtraso: 5,
    },
    {
        id: "4",
        cliente: "Fatima",
        telefone: "(41) 98733-4653",
        status: LeadStatus.VISITA,
        etapa: "2 / 6",
        ultimoContato: "18/09/2026 09:15",
        proximoContato: "21/09/2026",
        diasAtraso: 3,
    },
    {
        id: "5",
        cliente: "Carlos Henrique",
        telefone: "(41) 99122-3344",
        status: LeadStatus.NEGOCIACAO,
        etapa: "3 / 6",
        ultimoContato: "19/09/2026 11:03",
        proximoContato: "22/09/2026",
        diasAtraso: 2,
    },
    {
        id: "6",
        cliente: "Juliana",
        telefone: "(41) 98877-1122",
        status: LeadStatus.ATENDIMENTO,
        etapa: "1 / 6",
        ultimoContato: "21/09/2026 13:47",
        proximoContato: "23/09/2026",
        diasAtraso: 1,
    },
    {
        id: "7",
        cliente: "Eduardo Novo Mundo",
        telefone: "(42) 99836-9955",
        status: LeadStatus.AGUARDANDO,
        etapa: "2 / 6",
        ultimoContato: "18/09/2026 08:55",
        proximoContato: "20/09/2026",
        diasAtraso: 5,
    },
    {
        id: "8",
        cliente: "Mariana",
        telefone: "(41) 99711-5566",
        status: LeadStatus.CADASTRADO,
        etapa: "1 / 6",
        ultimoContato: "22/09/2026 09:32",
        proximoContato: "24/09/2026",
        diasAtraso: 0,
    },
    {
        id: "9",
        cliente: "Rodrigo",
        telefone: "(41) 98644-7788",
        status: LeadStatus.ATENDIMENTO,
        etapa: "2 / 6",
        ultimoContato: "21/09/2026 15:10",
        proximoContato: "24/09/2026",
        diasAtraso: 0,
    },
    {
        id: "10",
        cliente: "Vanessa",
        telefone: "(41) 99988-7666",
        status: LeadStatus.AGUARDANDO,
        etapa: "3 / 6",
        ultimoContato: "22/09/2026 18:20",
        proximoContato: "24/09/2026",
        diasAtraso: 0,
    },
];

const tabs: typeTabs[] = [
    { id: FollowUpTab.ATRASADO, label: "Atrasados", count: 7 },
    { id: FollowUpTab.HOJE, label: "Hoje", count: 12 },
    { id: FollowUpTab.PROXIMOS, label: "Próximos", count: 18 },
    { id: FollowUpTab.CONCLUIDOS, label: "Concluídos", count: 45 },
];


export default function FollowMainPage() {
    const [activeTab, setActiveTab] =
        useState<FollowUpTab>(FollowUpTab.ATRASADO);

    function handleActiveTab(tab: FollowUpTab) {
        setActiveTab(tab);
    }
    const [selectedCorretor, setSelectedCorretor] =
        useState("todos");

    function handleSelectedCorretor(nome: string) {
        setSelectedCorretor(nome);
    }

    const [selectedRows, setSelectedRows] =
        useState<string[]>([]);

    const toggleRow = (id: string) => {
        setSelectedRows((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const toggleAllRows = () => {
        setSelectedRows((prev) =>
            prev.length === FollowUps.length
                ? []
                : followUps.map((item) => item.id)
        );
    };


    return (
        <main className="min-h-screen w-full bg-slate-50 p-4 text-slate-900 sm:p-5">

            <FollowAlerta handleActiveTab={handleActiveTab} Atrasados={7} />

            {/* Conteúdo principal */}
            <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_344px]">

                {/* Coluna esquerda */}

                {/* Tabela */}
                <FollowTableBoard
                    tabs={tabs}
                    selectedCorretor={selectedCorretor}
                    handleSelectedCorretor={handleSelectedCorretor}
                    handleActiveTab={handleActiveTab}
                    activeTab={activeTab}
                    followUps={followUps}
                    selectedRows={selectedRows}
                    toggleAllRows={toggleAllRows}
                    toggleRow={toggleRow}
                />

                {/* Coluna direita */}
                <aside className="flex min-w-0 flex-col gap-5">

                    {/* Resumo */}
                    <FollowSummaryBoard />

                    {/* Próximos follow-ups */}
                    <FollowNextBoard />

                    {/* Ranking */}
                    <FollowRankingBoard />
                </aside>
            </div>
        </main>
    )
}