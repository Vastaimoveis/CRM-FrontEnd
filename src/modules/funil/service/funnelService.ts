import { useLeads } from "@/app/providers/LeadProvider";
import type { CreateLeadDTO } from "@/types/LeadType";

export async function createLeadService(data: CreateLeadDTO) {
  const { createLead } = useLeads();

  return createLead(data);;
}