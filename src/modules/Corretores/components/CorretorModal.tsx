import type { User } from "@/shared/types/UserTypes";
import type { Dispatch, SetStateAction } from "react";

interface Props {
    selectedUser: User;
    setSelectedUser: Dispatch<SetStateAction<User | null>>;
    modalView: ModalView;
    setModalView: Dispatch<SetStateAction<ModalView>>;
}

export type ModalView = "menu" | "edit" | "details" | "delete";


export default function CorretorModal({
    selectedUser,
    setSelectedUser,
    modalView,
    setModalView
}: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30"
                onClick={() => {
                    setSelectedUser(null)
                    setModalView("menu")
                }}
            />

            <div className="relative bg-white rounded-lg shadow-lg w-100 min-h-40 p-4">

                <h2 className="text-lg font-semibold mb-2">
                    {selectedUser.name}
                </h2>
                {/* 🔁 CONTEÚDO DINÂMICO */}
                {modalView === "menu" && (
                    <>

                        <div className="flex flex-col h-full gap-2 p-2 ">
                            <button className="border py-2" onClick={() => setModalView("edit")}>
                                Visualizar Leads
                            </button>
                            <button className="border py-2" onClick={() => setModalView("details")}>
                                Ver detalhes
                            </button>
                            <button className="border py-2 bg-red-600 text-white" onClick={() => setModalView("delete")}>
                                Excluir
                            </button>
                        </div>
                    </>
                )}

                {modalView === "edit" && (
                    <div className="flex flex-col h-full gap-2 p-2 justify-between">
                        <h2>Editar </h2>
                        {/* form aqui */}
                        <button className="border p-2" onClick={() => setModalView("menu")}>Voltar</button>
                    </div>
                )}

                {modalView === "details" && (
                    <div className="flex flex-col h-full gap-2 p-2">
                        <h2>Detalhes: </h2>
                        <p>Email: {selectedUser.email}</p>
                        <p>Telefone: {selectedUser.telefone}</p>
                        <p>Região: {selectedUser.regiao}</p>
                        <div className="flex gap-2 justify-around">
                            <button className="border p-2 w-full" onClick={() => setModalView("menu")}>Voltar</button>
                            <button className="border p-2 w-full">Editar</button>
                        </div>
                    </div>
                )}

                {modalView === "delete" && (
                    <div className="flex flex-col gap-2 ">
                        <h2>Confirmar exclusão:</h2>
                        <button className="bg-red-600 text-white p-2">Confirmar</button>
                        <button className="border p-2" onClick={() => setModalView("menu")}>Cancelar</button>
                    </div>
                )}

                <button
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-2 right-2"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}