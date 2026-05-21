import type { Requisito } from "../types/RequisitoTypes";

interface Props {
  requisito: Requisito;
  onClick: () => void;
}

export default function RequisitoRow({ requisito, onClick }: Props) {

  const statusColor = {
    pendente: "bg-yellow-100 text-yellow-700",
    lido: "bg-blue-100 text-blue-700",
    respondido: "bg-green-100 text-green-700",
  };

  return (
    <div
      onClick={onClick}
      className="grid grid-cols-5 gap-4 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
    >
      <span className="font-medium">
        {requisito.assunto}
      </span>

      <span className="text-gray-600 truncate col-span-2">
        {requisito.mensagem}
      </span>

      <span className="text-sm text-gray-500">
        {requisito.dataEnvio}
      </span>

      <span
        className={`text-xs px-2 py-1 rounded w-fit h-fit ${statusColor[requisito.status]}`}
      >
        {requisito.status}
      </span>
    </div>
  );
}