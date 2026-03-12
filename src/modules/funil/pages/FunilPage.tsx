import { useState } from "react";
import CustomChart from "../components/FunnelChart";
import ChartSwitcher from "../components/ChartSwitcher";
import { LeadStatus, type Lead } from "@/shared/types/LeadType";
import { useNavigate } from "react-router-dom";
import LeadModal from "../components/LeadModal";
import { useLeads } from "@/app/providers/LeadProvider";
import type { CreateLeadDTO } from "@/types/LeadType";

export default function FunilPage() {
  const [chartType, setChartType] = useState<"funnel" | "pie" | "bar">("funnel");
  const navigate = useNavigate();
  const { leadsCountByStatus } = useLeads();

  function handleStatusClick(status: LeadStatus) {
    navigate(`/leads?status=${status}`);
  }

  const [modalOpen, setModalOpen] = useState(false);

  async function handleCreateLead(data: CreateLeadDTO) {
    // MOCK TEMPORÁRIO
    console.log("Lead criado:", { ...data });


    // Depois vira:
    // await api.post("/leads", data)

  }


  const chartData = [
    {
      status: LeadStatus.CADASTRADO,
      total: leadsCountByStatus[LeadStatus.CADASTRADO],
    },
    {
      status: LeadStatus.ATENDIMENTO,
      total: leadsCountByStatus[LeadStatus.ATENDIMENTO],
    },
    {
      status: LeadStatus.AGUARDANDO,
      total: leadsCountByStatus[LeadStatus.AGUARDANDO],
    },
    {
      status: LeadStatus.VISITA,
      total: leadsCountByStatus[LeadStatus.VISITA],
    },
    {
      status: LeadStatus.NEGOCIACAO,
      total: leadsCountByStatus[LeadStatus.NEGOCIACAO],
    },
    {
      status: LeadStatus.VENDA,
      total: leadsCountByStatus[LeadStatus.VENDA],
    },
  ];


  return (
    <div className="flex gap-8">
      {/* Gráfico */}
      <div className="flex w-3/6  bg-white p-6 rounded-xl shadow-sm">
        <CustomChart
          data={chartData}
          type={chartType}
          onStatusClick={handleStatusClick}
        />
      </div>

      {/* Lateral Direita */}
      <div className="w-64 flex flex-col gap-4">
        <ChartSwitcher type={chartType} setType={setChartType} />

        <button
          onClick={() => setModalOpen(true)}
          className="bg-black text-white py-2 rounded-lg hover:opacity-80 transition"
        >
          + Novo Lead
        </button>
      </div>
      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateLead}
      />


    </div>
  );
}