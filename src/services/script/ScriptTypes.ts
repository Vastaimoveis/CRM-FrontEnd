export interface Script {
    id: string;
    title: string;
    message: string;
    userId: string;
    categories: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateScript {
    title: string;
    message: string;
    category: ScriptCategories;
}

export interface UpdateScript {
    id: string;
    title?: string;
    message?: string;
    categories?: string | null;
}

export interface ScriptFilterCategory{
    category: ScriptCategories | "";
}

export enum ScriptCategories {
    PRIMEIRO_CONTATO = "PRIMEIRO_CONTATO",
    NOVOS_EMPREENDIMENTOS = "NOVOS_EMPREENDIMENTOS",
    REATIVACAO_LEADS = "REATIVACAO_LEADS",
    AGENDAMENTO_VISITAS = "AGENDAMENTO_VISITAS",
    NEGOCIACAO = "NEGOCIACAO",
    ACOMPANHAMENTO = "ACOMPANHAMENTO",
    POS_VENDA = "POS_VENDA",
}

export const ScriptCategoryLabels: Record<ScriptCategories, string> = {
    [ScriptCategories.PRIMEIRO_CONTATO]: "Primeiro contato",
    [ScriptCategories.NOVOS_EMPREENDIMENTOS]: "Novos empreendimentos",
    [ScriptCategories.REATIVACAO_LEADS]: "Reativação de leads",
    [ScriptCategories.AGENDAMENTO_VISITAS]: "Agendamento de visitas",
    [ScriptCategories.NEGOCIACAO]: "Negociação",
    [ScriptCategories.ACOMPANHAMENTO]: "Acompanhamento",
    [ScriptCategories.POS_VENDA]: "Pós-venda",
};