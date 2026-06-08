import type { Lead } from "@/shared/types/LeadType";
import ExcelJS from "exceljs";

export async function exportLeadsToExcel(leads: Lead[]) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "CRM";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Leads");

  worksheet.columns = [
    { header: "Nome", key: "nome", width: 35 },
    { header: "Email", key: "email", width: 40 },
    { header: "Telefone", key: "telefone", width: 20 },
    { header: "Status", key: "status", width: 20 },
    { header: "Criado em", key: "createdAt", width: 25 },
  ];

  worksheet.getRow(1).font = {
    bold: true,
    color: { argb: "FFFFFFFF" },
  };

  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF000000" },
  };

  leads.forEach((lead) => {
    worksheet.addRow({
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      status: lead.status,
      createdAt: new Date(lead.createdAt).toLocaleString("pt-BR"),
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = `leads_${new Date().toISOString().split("T")[0]}.xlsx`;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
}