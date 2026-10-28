
import { useEffect, useState } from "react";

import { useFunnel } from "@/app/providers/FunnelProvider";
import { PermissionName } from "@/services/permission/permissionTypes";
import { Can } from "@/shared/components/Can";

import HomeFollowBoard from "../Components/HomeFollowBoard/HomeFollowBoard";
import HomeFunnel from "../Components/HomeFunnel/HomeFunnel";
import HomeHeader from "../Components/HomeHeader/HomeHeader";
import HomeStats from "../Components/HomeStats/HomeStats";
import LeadModal from "@/modules/funil/components/LeadModal";
import { useAuth } from "@/app/providers/AuthProvider";
import { useFollowUp } from "@/app/providers/FollowUpProvider";

// Utilize o caminho real do LeadModal no seu projeto

export default function HomeMainPage() {

    const {
        countLeads,
        createLead
    } = useFunnel();

    const { user } = useAuth();
    const { fetchStatusCounts } = useFollowUp();

    const [modalOpen, setModalOpen] = useState(false);
    useEffect(() => {

        if (!user) return;

        void fetchStatusCounts();

    }, [user, fetchStatusCounts]);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <section
            className="
                min-h-screen w-full
                bg-slate-150
                p-4 text-slate-900
                sm:p-5 lg:p-1
            "
        >
            <div className="mx-auto flex max-w-[1600px] flex-col gap-2">

                {/* CABEÇALHO */}

                <HomeHeader
                    onOpenLeadModal={handleOpenModal}
                />

                {/* INDICADORES PRINCIPAIS */}

                <HomeStats />

                {/* ACOMPANHAMENTO */}

                <section
                    className="
                        grid grid-cols-1
                        items-start gap-5
                        xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
                    "
                >
                    <HomeFollowBoard />

                    <div className="flex min-w-0 flex-col gap-5">
                        {countLeads && (
                            <HomeFunnel data={countLeads} />
                        )}
                    </div>
                </section>

                {/* MODAL DE CRIAÇÃO */}

                <Can permission={PermissionName.LEAD_CREATE}>
                    <LeadModal
                        open={modalOpen}
                        createLead={createLead}
                        onClose={handleCloseModal}
                    />
                </Can>

            </div>
        </section>
    );
}
