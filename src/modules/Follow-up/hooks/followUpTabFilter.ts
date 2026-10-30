
import type {
    FollowUpFilters,
    FollowUpTab
} from "@/shared/types/filterTypes";

import {
    FollowUpStatus,
    type FollowUpStatusCount
} from "@/shared/types/followUpTypes";

import { getTodayRange } from "@/shared/utils/localeDateString";

// Define a prioridade da aba inicial.
export function getInitialFollowUpTab(
    statusCounts: FollowUpStatusCount[],
    todayCount: number
): FollowUpTab {

    const atrasados = statusCounts.find(
        item => item.status === FollowUpStatus.ATRASADO
    )?.quantidade ?? 0;

    if (atrasados > 0) {
        return FollowUpStatus.ATRASADO;
    }

    if (todayCount > 0) {
        return "HOJE";
    }

    return FollowUpStatus.PENDENTE;
}

// Constrói os filtros de cada aba.
export function buildFollowUpTabFilters(
    tab: FollowUpTab,
    currentFilters: FollowUpFilters = {}
): FollowUpFilters {

    const { today, tomorrow } = getTodayRange();

    if (tab === "HOJE") {
        return {
            ...currentFilters,
            tab,
            status: FollowUpStatus.PENDENTE,
            startDate: today,
            endDate: today
        };
    }

    if (tab === FollowUpStatus.PENDENTE) {
        return {
            ...currentFilters,
            tab,
            status: FollowUpStatus.PENDENTE,
            startDate: tomorrow,
            endDate: null
        };
    }

    return {
        ...currentFilters,
        tab,
        status: tab === "TODOS" ? null : tab,
        startDate: null,
        endDate: null
    };
}
