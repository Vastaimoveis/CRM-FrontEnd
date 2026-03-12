import { useState } from "react";
import type { Lead } from "@/shared/types/LeadType";
import FileInput from "./FileInput";
import { useToast } from "@/app/providers/ToastProvider";

interface Props {
  lead: Lead;
  onClose: () => void;
}

export default function LeadDocumentsModal({ lead, onClose }: Props) {
  const [estadoCivil, setEstadoCivil] = useState<string>("");
  const {showToast} = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // impede refresh

    // Aqui futuramente você vai montar FormData e enviar pro backend
    console.log("Formulário enviado para:", lead.nome);
    console.log("Estado Civil:", estadoCivil);
    showToast("Lead enviado com sucesso", "success")
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-150 max-h-[90vh] rounded-lg shadow-lg flex flex-col">

        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-lg">{lead.nome}</h2>
            <p className="text-sm text-gray-500">{lead.email}</p>
          </div>

          <button onClick={onClose} className="text-white bg-red-500 py-2 px-4 rounded-lg">
            Fechar
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <form className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Documento Identificação */}
          <FileInput label="RG / CNH / CPF / RNM" />

          {/* Estado Civil */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Certidão de Estado Civil
            </label>

            <select
              className="w-full border rounded p-2"
              value={estadoCivil}
              onChange={(e) => setEstadoCivil(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="Nascimento">Nascimento</option>
              <option value="Casamento">Casamento</option>
              <option value="Divórcio">Divórcio</option>
              <option value="Viúvo">Viúvo</option>
              <option value="União Estável">União Estável</option>
            </select>
          </div>
          {estadoCivil && (
            <FileInput label={`Certidão de ${estadoCivil}`} />
          )}
          <FileInput label="Holerite" />
          <FileInput label="Carteira de Trabalho" />
          <FileInput label="FGTS" />
          <FileInput label="Imposto de Renda" />

          <div className="p-4 border-t shrink-0 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Enviar Documentos
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}