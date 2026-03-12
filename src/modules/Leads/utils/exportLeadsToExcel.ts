import * as XLSX from "xlsx";
import { type Lead } from "@/shared/types/LeadType";

export function exportLeadsToExcel(leads: Lead[]) {
    const data = leads.map((lead) => ({
        Nome: lead.nome,
        Email: lead.email,
        Telefone: lead.telefone,
        Status: lead.status,
        creationDate: lead.creationDate,
        updateDate: lead.updateDate
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    XLSX.writeFile(workbook, "leads.xlsx");
}