import { useState } from "react";
import { RequisitoStatus, type Requisito } from "../types/RequisitoTypes";
import RequisitoRow from "../components/RequisitoRow";
import RequisitoModal from "../components/RequisitoModal";
import { usePagination } from "../hooks/usePagination";
import RequisitosPagination from "../components/RequisitosPagination";
import RequisitoNovo from "../components/RequisitoNovo";
import type { User } from "@/shared/types/UserTypes";

const mockData: Requisito[] = [
  {
    id: "1",
    assunto: "Dúvida sobre documentação",
    mensagem:
      "Cliente enviou RG vencido, gostaria de saber se posso seguir com o processo.",
    dataEnvio: "07/03/2026",
    status: RequisitoStatus.PENDENTE,
    corretor: "João Silva",
  },
  {
    id: "2",
    assunto: "Problema com holerite",
    mensagem:
      "O cliente trabalha como autônomo e não possui holerite, qual documento substitui?",
    dataEnvio: "06/03/2026",
    status: RequisitoStatus.RESPONDIDO,
    corretor: "Maria Souza",
  },
];
async function handleMarkAsRead(id: string) {

  console.log("Marcar como lido:", id);

  // futuro:
  // await api.patch(`/requisitos/${id}/read`)
}

async function handleRespond(id: string, resposta: string) {
  console.log("Resposta enviada:", { id, resposta });

  // futuro:
  // await api.post(`/requisitos/${id}/resposta`, { resposta })
}


export default function RequisitosPage() {
  const [selected, setSelected] = useState<Requisito | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [requisitos, setRequisitos] = useState(mockData);
  const { paginatedData, totalPages } = usePagination({
    data: requisitos,
    currentPage,
    itemsPerPage: 5,
  });
  const [novaRequisicao, setNovaRequisicao] = useState<boolean>(false);


  async function handleSend(corretor: User, assunto: string, message: string) {
    const novoRequisito: Requisito = {
      id: crypto.randomUUID(), // ou Date.now().toString()
      assunto: assunto,
      mensagem: message,
      dataEnvio: new Date().toLocaleDateString("pt-BR"),
      status: RequisitoStatus.PENDENTE,
      corretor: corretor.name, // pode vir do dropdown depois
    };

    setRequisitos((prev) => [novoRequisito, ...prev]);
    console.log(requisitos)
  }
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between pb-3">
        <h1 className="text-xl font-semibold mb-6">
          Caixa de Entrada de Requisitos
        </h1>
        <button onClick={() => setNovaRequisicao(true)} className="p-2 border rounded-lg hover:invert bg-white duration-200 text-lg">
          Nova requisição
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">

        {requisitos.map((req) => (
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
          onMarkAsRead={handleMarkAsRead}
          onRespond={handleRespond}
        />
      )}
      <RequisitosPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((prev) => prev - 1)}
        onNext={() => setCurrentPage((prev) => prev + 1)}
      />
      {novaRequisicao &&
        <RequisitoNovo onClose={() => setNovaRequisicao(false)} onSend={handleSend} />
      }
    </div>
  );
}