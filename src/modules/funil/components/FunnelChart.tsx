import {
  FunnelChart,
  Funnel,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { LeadStatus, STATUS_COLORS } from "@/shared/types/LeadType";
import type { countStatusResponse, LeadStatusChartData } from "@/services/leads/types/leads";

interface Props {
  data: countStatusResponse;
  type: "funnel" | "pie" | "bar";
}

export default function CustomChart({
  data,
  type,
}: Props) {

  const handleClick = (entry: any) => {
    if (!entry?.payload?.status) return;
  };

  const chartData: LeadStatusChartData[] = Object.entries(data.porStatus)
    .filter(([status]) => status !== LeadStatus.ENCERRADO)
    .map(([status, total]) => ({
      status: status as LeadStatus,
      total,
    }));
  // 🔵 PIE
  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="total"
            nameKey="status"
            labelLine={false}
            label={(props) => {
              if (!props.value) return null;
              return `${props.name} (${props.value})`;
            }
            }
            onClick={handleClick}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status]}
                className="cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer >
    );
  }

  // 🟢 BAR
  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" onClick={handleClick}>
            <LabelList
              dataKey="total"
              position="top"

            />
            {chartData.map((entry) => {
              console.log(chartData);
              return (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status]}
                  className="cursor-pointer"
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // 🔴 FUNNEL MELHORADO
  return (
    <div className="flex w-full h-100">
      {/* Gráfico */}
      <div className="flex-1 h-100">
        <ResponsiveContainer className={"h-100"}>
          <FunnelChart>
            <Tooltip />
            <Funnel
              dataKey="total"
              data={chartData}
              isAnimationActive
            >
              {chartData.map((entry) => {
                if (entry.status != LeadStatus.ENCERRADO) {
                  return (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status]}
                      className="cursor-pointer"
                    />
                  )
                } else {
                  return;
                }
              }
              )}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda lateral */}
      <div className="w-64 pl-6 flex flex-col justify-center gap-3">
        {chartData.map((entry) => (
          <button
            key={entry.status}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: STATUS_COLORS[entry.status] }}
              />
              <span className="text-sm font-medium">
                {entry.status}
              </span>
            </div>

            <span className="text-sm font-semibold">
              {entry.total}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}