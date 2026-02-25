interface Props {
  type: "funnel" | "pie" | "bar";
  setType: (type: "funnel" | "pie" | "bar") => void;
}

export default function ChartSwitcher({ type, setType }: Props) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setType("funnel")}
        className={`px-3 py-1 border rounded ${
          type === "funnel" ? "bg-black text-white" : ""
        }`}
      >
        Funil
      </button>

      <button
        onClick={() => setType("pie")}
        className={`px-3 py-1 border rounded ${
          type === "pie" ? "bg-black text-white" : ""
        }`}
      >
        Pizza
      </button>

      <button
        onClick={() => setType("bar")}
        className={`px-3 py-1 border rounded ${
          type === "bar" ? "bg-black text-white" : ""
        }`}
      >
        Torres
      </button>
    </div>
  );
}