import type { Requisito } from "../types/RequisitoTypes";

interface Props {
  requisito: Requisito;
  onClose: () => void;
}

export default function RequisitoModal({
  requisito,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl w-[600px] p-6">

        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {requisito.assunto}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Enviado por: {requisito.corretor}
        </p>

        <p className="text-gray-700 mb-6">
          {requisito.mensagem}
        </p>

        <div className="flex justify-end gap-3">

          <button className="px-4 py-2 bg-gray-200 rounded">
            Marcar como lido
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Responder
          </button>

        </div>

      </div>

    </div>
  );
}