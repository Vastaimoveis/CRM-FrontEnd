
import { useAuth } from "@/app/providers/AuthProvider";
import { PermissionName } from "@/services/permission/permissionTypes";

import AlertaAtrasados from "@/shared/components/AlertAtrasados/AlertAtrasados";
import { Can } from "@/shared/components/Can";

import { useNavigate } from "react-router-dom";

interface HomeHeaderProps {
    onOpenLeadModal: () => void;
}

export default function HomeHeader({
    onOpenLeadModal
}: HomeHeaderProps) {

    const navigate = useNavigate();
    const { user } = useAuth();

    const primeiroNome = user?.nome?.split(" ")[0] ?? "";

    function handleViewOverdue() {
        navigate("/follow");
    }

    return (
        <section
            className="
                flex flex-wrap
                items-start justify-between
                gap-4
            "
        >
            <div className="flex flex-col gap-3">

                <h1 className="text-3xl font-bold">
                    Olá, {primeiroNome}!
                </h1>

                <Can permission={PermissionName.LEAD_CREATE}>
                    <button
                        type="button"
                        onClick={onOpenLeadModal}
                        className="
                            w-fit rounded-lg
                            bg-black px-5 py-2
                            text-white
                            transition hover:opacity-80
                        "
                    >
                        + Novo Lead
                    </button>
                </Can>

            </div>

            <AlertaAtrasados
                onViewOverdue={handleViewOverdue}
            />

        </section>
    );
}
