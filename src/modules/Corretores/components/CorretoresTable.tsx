import { useState } from "react";
import type { User } from "@/shared/types/UserTypes";
import CorretorModal, { type ModalView } from "./CorretorModal";
import capitalizeWords from "@/shared/utils/capitalizeWords";

interface Props {
  users: User[];
}

export function UserTable({ users }: Props) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalView, setModalView] = useState<ModalView>("menu");
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Telefone</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Região</th>
              <th className="px-4 py-2 text-left">Função</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{capitalizeWords(user.nome)}</td>
                <td className="px-4 py-2">{user.telefone ? user.telefone : "Não possui"}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.regiao}</td>
                <td className="px-4 py-2">{user.role}</td>

                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="px-2 py-1 rounded hover:bg-gray-200"
                  >
                    ⋮
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUP GLOBAL */}

      {selectedUser && (
        <CorretorModal
          viewUser={selectedUser}
          setViewUser={setSelectedUser}
          modalView={modalView}
          setModalView={setModalView}
        />
      )}


    </>
  );
}