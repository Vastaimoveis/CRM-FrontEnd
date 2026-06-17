import { useEffect, useState } from "react";
import CustomChart from "../components/FunnelChart";
import ChartSwitcher from "../components/ChartSwitcher";
import LeadModal from "../components/LeadModal";
import { useFunnel } from "@/app/providers/FunnelProvider";
import { useAuth } from "@/app/providers/AuthProvider";

export default function FunilPage() {
  const [chartType, setChartType] = useState<"funnel" | "pie" | "bar">(() => {
    const saved = localStorage.getItem("chartType");

    if (
      saved === "funnel" ||
      saved === "pie" ||
      saved === "bar"
    ) {
      return saved;
    }

    return "funnel";
  }); 

  const [modalOpen, setModalOpen] = useState(false);
  const { createLead, countLeads, fetchCountLeads, totalLeads } = useFunnel();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchCountLeads();
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("chartType", chartType);
  }, [chartType]);

  return (
    <div className="flex gap-8">
      {/* Gráfico */}
      <div className="flex w-4/6  bg-white p-6 rounded-xl shadow-sm">
        <CustomChart
          data={countLeads!}
          type={chartType}
        />
      </div>

      {/* Lateral Direita */}
      <div className="w-64 flex flex-col gap-4">
        <h1 className="font-semibold text-xl">Tipos de Funil</h1>
        <ChartSwitcher type={chartType} setType={setChartType} />

        <button
          onClick={() => setModalOpen(true)}
          className="bg-black text-white py-2 rounded-lg hover:opacity-80 transition"
        >
          + Novo Lead
        </button>
        <div className="font-semibold text-xl">
          <p>Total de leads:</p>
          <p>{totalLeads}</p>
        </div>
      </div>
      <LeadModal
        open={modalOpen}
        createLead={createLead}
        onClose={() => setModalOpen(false)}
      />


    </div>
  );
}