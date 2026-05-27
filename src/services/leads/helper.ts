import { LeadStatus } from "@/shared/types/LeadType";
import type { countStatusResponse } from "./leadsService";

export const EMPTY_STATUS = {
    [LeadStatus.CADASTRADO]: 0,
    [LeadStatus.ATENDIMENTO]: 0,
    [LeadStatus.AGUARDANDO]: 0,
    [LeadStatus.VISITA]: 0,
    [LeadStatus.NEGOCIACAO]: 0,
    [LeadStatus.VENDA]: 0,
    [LeadStatus.ENCERRADO]: 0,
};

export function normalizeLeadStatusResponse(
    data: countStatusResponse
): countStatusResponse {
    return {
        total: data.total ?? 0,

        porStatus: {
            ...EMPTY_STATUS,
            ...data.porStatus,
        },
    };
}