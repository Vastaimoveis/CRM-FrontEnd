import { useCallback } from "react";
import {
    deleteLeadRequest,
    editLead,
    getLeadById,
    patchCorretor,
    patchStatus,
    updateLeadRequest
} from "@/services/leads/leadsService";
import useRequestLatest from "@/shared/utils/useRequestLatest";
import useRequestLock from "@/shared/utils/useRequestLock";

import type {
    LeadCorretorDTO,
    LeadStatusDTO,
    UpdateLeadDto
} from "@/services/leads/types/leads";

import { LeadStatus } from "@/shared/types/LeadType";

export function useLeadMutations() {

    const runLatestUpdate = useRequestLatest();
    const runLatestPatch = useRequestLatest();

    const runLockDelete = useRequestLock();
    const runLockEdit = useRequestLock();
    const runLockCorretor = useRequestLock();


    const runUpdateLeadStatus = useCallback(async (
        id: string,
        status: LeadStatus
    ) => {

        return runLatestUpdate(async () => {

            const lead = await getLeadById(id);

            return updateLeadRequest(id, {
                nome: lead.nome,
                email: lead.email,
                telefone: lead.telefone,
                status,
                origem: lead.origem
            });

        });

    }, [
        runLatestUpdate
    ]);



    const runPatchLeadStatus = useCallback(async (
        id: string,
        status: LeadStatus
    ) => {

        return runLatestPatch(async () => {

            const dto: LeadStatusDTO = {
                statusLead: status
            };

            return patchStatus(id, dto);

        });

    }, [
        runLatestPatch
    ]);



    const runPatchLeadCorretor = useCallback(async (
        id: string,
        userId: string
    ) => {

        return runLockCorretor(async () => {

            const dto: LeadCorretorDTO = {
                userId
            };

            return patchCorretor(id, dto);

        });

    }, [
        runLockCorretor
    ]);



    const runDeleteLead = useCallback(async (
        id: string
    ) => {

        return runLockDelete(async () => {
            await deleteLeadRequest(id);
        });

    }, [
        runLockDelete
    ]);



    const runHandleEdit = useCallback(async (
        id: string,
        data: UpdateLeadDto
    ) => {

        return runLockEdit(async () => {
            return editLead(id, data);
        });

    }, [
        runLockEdit
    ]);


    return {
        runUpdateLeadStatus,
        runPatchLeadStatus,
        runPatchLeadCorretor,
        runDeleteLead,
        runHandleEdit
    };
}