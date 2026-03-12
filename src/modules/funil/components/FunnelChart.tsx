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
import { type LeadStatus, STATUS_COLORS } from "@/shared/types/LeadType";

interface ChartData {
  status: LeadStatus;
  total: number;
}

interface Props {
  data: ChartData[];
  type: "funnel" | "pie" | "bar";
  onStatusClick?: (status: LeadStatus) => void;
}

export default function CustomChart({
  data,
  type,
  onStatusClick,
}: Props) {

  const handleClick = (entry: any) => {
    if (!entry?.payload?.status) return;
    onStatusClick?.(entry.payload.status);
  };

  // 🔵 PIE
  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
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
            {data.map((entry) => (
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
        <BarChart data={data}>
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" onClick={handleClick}>
            <LabelList
              dataKey="total"
              position="top"

            />
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status]}
                className="cursor-pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // 🔴 FUNNEL MELHORADO
  return (
    <div className="flex w-full h-100">
      {/* Gráfico */}
      <div className="flex-1">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <FunnelChart>
            <Tooltip />
            <Funnel
              dataKey="total"
              data={data}
              isAnimationActive
            >
              {data.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status]}
                >
                  <h1 className="text-black text-2xl absolute top-0">aaaaaa</h1>
                </Cell>
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda lateral */}
      <div className="w-64 pl-6 flex flex-col justify-center gap-3">
        {data.map((entry) => (
          <button
            key={entry.status}
            onClick={() => onStatusClick?.(entry.status)}
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
  );
}