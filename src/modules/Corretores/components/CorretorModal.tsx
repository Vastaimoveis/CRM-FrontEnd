import { useAuth } from "@/app/providers/AuthProvider";
import type { User } from "@/shared/types/UserTypes";
import type { Dispatch, SetStateAction } from "react";

interface Props {
    selectedUser: User;
    setSelectedUser: Dispatch<SetStateAction<User | null>>;
    modalView: ModalView;
    setModalView: Dispatch<SetStateAction<ModalView>>;
}

export type ModalView = "menu" | "edit" | "details" | "delete" | "viewLeads";


export default function CorretorModal({
    selectedUser,
    setSelectedUser,
    modalView,
    setModalView
}: Props) {

    const { setVisualUser } = useAuth();
    
    function handleSelectUser(user: User) {
        setVisualUser(user)
        handleClose
    }

    function handleClose() {
        setSelectedUser(null);
        setModalView("menu")
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30"
                onClick={() => {
                    handleClose()
                }}
            />

            <div className="relative bg-white rounded-lg shadow-lg w-100 min-h-40 p-4">

                <h2 className="text-lg font-semibold mb-2">
                    {selectedUser.nome}
                </h2>
                {/* 🔁 CONTEÚDO DINÂMICO */}
                {modalView === "menu" && (
                    <>
                        <div className="flex flex-col h-full gap-2 p-2 ">
                            <button className="border py-2" onClick={() => setModalView("viewLeads")}>
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

                {modalView === "viewLeads" && (
                    <div className="flex flex-col h-full gap-2 p-2 justify-between">
                        <button className="border p-2" onClick={() => handleSelectUser(selectedUser)}>Visualizar leads</button>
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
                            <button className="border p-2 w-full" onClick={() => setModalView("edit")}>Editar</button>
                        </div>
                    </div>
                )}

                {modalView === "edit" && (
                    <form className="flex flex-col h-full gap-2 p-2">
                        <h2>Detalhes: </h2>
                        <label className="flex gap-2" htmlFor="email">
                            <p className="self-center w-1/3">Email:</p>
                            <input className="border p-2" type="text" placeholder={selectedUser.email} />
                        </label>
                        <label className="flex gap-2" htmlFor="email">
                            <p className="self-center w-1/3">Telefone:</p>
                            <input className="border p-2" type="text" placeholder={selectedUser.telefone} />
                        </label>
                        <label className="flex gap-2" htmlFor="email">
                            <p className="self-center w-1/3">Região:</p>
                            <input className="border p-2" type="text" placeholder={selectedUser.regiao} />
                        </label>
                        <label className="flex gap-2" htmlFor="email">
                            <p className="self-center w-1/3">Função:</p>
                            <input className="border p-2" type="text" placeholder={selectedUser.role} />
                        </label>
                        <div className="flex gap-2 justify-around">
                            <button className="border p-2 w-full" onClick={() => setModalView("menu")}>Voltar</button>
                            <button className="border p-2 w-full" onClick={() => setModalView("edit")}>Editar</button>
                        </div>
                    </form>
                )}

                {modalView === "delete" && (
                    <div className="flex flex-col gap-2 ">
                        <h2>Confirmar exclusão:</h2>
                        <button className="bg-red-600 text-white p-2">Confirmar</button>
                        <button className="border p-2" onClick={() => handleClose()}>Cancelar</button>
                    </div>
                )}

                <button
                    onClick={() => handleClose()}
                    className="absolute top-2 right-2"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}