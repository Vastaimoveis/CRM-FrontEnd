import type { CreateLeadDTO } from "@/types/LeadType";

export async function createLeadService(data: CreateLeadDTO) {
  // Futuro fetch para API

  /*
  return fetch("/api/leads", {
    method: "POST",
    body: JSON.stringify(data)
  })
  */

  return new Promise(resolve => {
    setTimeout(() => resolve(data), 500);
  });
}