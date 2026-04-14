import { NavLink } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import logo from "/logo.png"
import { UserRoles } from "@/types/UserTypes";
import Permission from "@/shared/permissions/Permission";

export default function Header() {
  const { user } = useAuth();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 text-sm font-medium transition ${isActive
      ? "border-b-2 border-black text-black"
      : "text-gray-500 hover:text-black"
    }`;

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* Linha 1 */}
      <div className="flex justify-between items-center px-8 h-16">
        <img className="max-h-15" src={logo} alt="Logo da Vasta Imoveis" />

        <button className="px-4 py-2 border border-black rounded-md text-sm font-medium hover:bg-black hover:text-white transition">
          {user?.name}
        </button>
      </div>

      {/* Linha 2 */}
      <div className="flex gap-6 px-8 border-t border-gray-100 h-12 items-center">
        <NavLink to="/funil" className={navItemClass}>
          Funil
        </NavLink>

        <NavLink to="/leads" className={navItemClass}>
          Leads
        </NavLink>

        <NavLink to="/oportunidades" className={navItemClass}>
          Oportunidades
        </NavLink>
        <NavLink to="/requisicoes" className={navItemClass}>
          Requisições
        </NavLink>
        <Permission allowed={[UserRoles.GERENTE]}>
          <NavLink className={navItemClass} to="/corretores">
            Corretores
          </NavLink>
        </Permission>
      </div>
    </header>
  );
}