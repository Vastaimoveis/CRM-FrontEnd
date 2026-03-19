import type { Lead } from "@/types/LeadType";
import * as XLSX from "xlsx";
import { excelDateToJSDate } from "./excelDateToJSDate";

export function parseExcel(file: File): Promise<Lead[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const leads: Lead[] = rows.map((row) => ({
        id: crypto.randomUUID(),

        nome: row["Nome"],
        email: row["Email"],
        telefone: row["Telefone"],
        status: row["Status"],

        creationDate: excelDateToJSDate(row["creationDate"]),
        updateDate: excelDateToJSDate(row["updateDate"]),
      }));

      resolve(leads);
    };

    reader.readAsArrayBuffer(file);
  });
}

