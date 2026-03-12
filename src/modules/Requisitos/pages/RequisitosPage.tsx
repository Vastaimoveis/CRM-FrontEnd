import { useState } from "react";
import type { Requisito } from "../types/RequisitoTypes";
import RequisitoRow from "../components/RequisitoRow";
import RequisitoModal from "../components/RequisitoModal";

const mockData: Requisito[] = [
  {
    id: "1",
    assunto: "Dúvida sobre documentação",
    mensagem:
      "Cliente enviou RG vencido, gostaria de saber se posso seguir com o processo.",
    dataEnvio: "07/03/2026",
    status: "pendente",
    corretor: "João Silva",
  },
  {
    id: "2",
    assunto: "Problema com holerite",
    mensagem:
      "O cliente trabalha como autônomo e não possui holerite, qual documento substitui?",
    dataEnvio: "06/03/2026",
    status: "lido",
    corretor: "Maria Souza",
  },
];

export default function RequisitosPage() {
  const [selected, setSelected] = useState<Requisito | null>(null);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">

      <h1 className="text-xl font-semibold mb-6">
        Caixa de Entrada de Requisitos
      </h1>

      <div className="border rounded-lg overflow-hidden">

        {mockData.map((req) => (
          <RequisitoRow
            key={req.id}
            requisito={req}
            onClick={() => setSelected(req)}
          />
        ))}

      </div>

      {selected && (
        <RequisitoModal
          requisito={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}