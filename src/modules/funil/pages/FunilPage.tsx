import { useState } from "react";
import CustomChart from "../components/FunnelChart";
import ChartSwitcher from "../components/ChartSwitcher";
import { LeadStatus } from "@/shared/types/LeadType";
import { useNavigate } from "react-router-dom";
import LeadModal from "../components/LeadModal";
import { useFunnel } from "@/app/providers/FunnelProvider";
import { useLeads } from "@/app/providers/LeadProvider";

export default function FunilPage() {
  const [chartType, setChartType] = useState<"funnel" | "pie" | "bar">("funnel");
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const { createLead, countLeads } = useFunnel();
  const { fetchLeads, fetchByStatus } = useLeads();

  async function handleStatusClick(status: LeadStatus) {
    navigate(`/leads`);
    await fetchByStatus(status, 0);
    await fetchLeads();
  }

  return (
    <div className="flex gap-8">
      {/* Gráfico */}
      <div className="flex w-3/6  bg-white p-6 rounded-xl shadow-sm">
        <CustomChart
          data={countLeads!}
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
        createLead={createLead}
        fetchLeads={fetchLeads}
        onClose={() => setModalOpen(false)}
      />


    </div>
  );
}