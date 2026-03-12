import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { Lead, CreateLeadDTO } from "@/shared/types/LeadType";
import { LeadStatus } from "@/shared/types/LeadType";

interface LeadContextType {
    leads: Lead[];
    createLead: (data: CreateLeadDTO) => void;
    updateLeadStatus: (id: string, status: LeadStatus) => void;
    leadsCountByStatus: Record<LeadStatus, number>;
}

const LeadContext = createContext<LeadContextType | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
    const [leads, setLeads] = useState<Lead[]>([
        {
            id: "1",
            nome: "alo",
            email: "Email@email.com",
            status: LeadStatus.CADASTRADO,
            telefone: "1234567",
            creationDate: new Date(),
            updateDate: new Date()
        },
        {
            id: "2",
            nome: "ola",
            email: "oi@email.com",
            status: LeadStatus.CADASTRADO,
            telefone: "852134",
            creationDate: new Date(),
            updateDate: new Date()
        },
        {
            id: "3",
            nome: "bbbb",
            email: "Email@email.com",
            status: LeadStatus.ATENDIMENTO,
            telefone: "2121548",
            creationDate: new Date(),
            updateDate: new Date()
        },]);

    function createLead(data: CreateLeadDTO) {
        const newLead: Lead = {
            id: crypto.randomUUID(),
            ...data,
            status: LeadStatus.CADASTRADO,
            creationDate: new Date(),
            updateDate: new Date()
        };

        setLeads((prev) => [...prev, newLead]);
    }

    function updateLeadStatus(id: string, status: LeadStatus) {
        setLeads((prev) =>
            prev.map((lead) =>
                lead.id === id ? { ...lead, status } : lead
            )
        );
    }

    const leadsCountByStatus = useMemo(() => {
        const counts: Record<LeadStatus, number> = {
            [LeadStatus.CADASTRADO]: 0,
            [LeadStatus.ATENDIMENTO]: 0,
            [LeadStatus.AGUARDANDO]: 0,
            [LeadStatus.VISITA]: 0,
            [LeadStatus.NEGOCIACAO]: 0,
            [LeadStatus.VENDA]: 0,
        };

        for (const lead of leads) {
            counts[lead.status]++;
        }

        return counts;
    }, [leads]);

    return (
        <LeadContext.Provider
            value={{
                leads,
                createLead,
                updateLeadStatus,
                leadsCountByStatus,
            }}
        >
            {children}
        </LeadContext.Provider>
    );
}

export function useLeads() {
    const context = useContext(LeadContext);
    if (!context) {
        throw new Error("useLeads must be used inside LeadProvider");
    }
    return context;
}