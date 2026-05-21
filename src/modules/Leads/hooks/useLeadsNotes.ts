// /hooks/useLeadNotes.ts
"use client";

import { useState } from "react";
import type { LeadNoteRequest, LeadNotes } from "@/shared/types/LeadNotesType";
import { useToast } from "@/app/providers/ToastProvider";
import { api } from "@/services/api/api";

export function useLeadNotes(leadId: string) {
  const [notes, setNotes] = useState<LeadNotes[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  async function fetchNotes() {
    try {
      setLoading(true);

      const response = await fetch(`/leadsNotes/${leadId}`);
      const data = await response.json();

      setNotes(data);

    } catch (error) {
      console.error(error);
      setNotes([]);
      showToast("Erro ao carregar anotações", "error");

    } finally {
      setLoading(false);
    }
  }

  async function addNote(message: string) {
    if (!message.trim()) return;

    const data: LeadNoteRequest = {
      leadId: leadId,
      note: message,
    };

    setSaving(true);

    try {
      await api.post(`/leadsNotes/${leadId}`, data)
        .then(async () => fetchNotes());

      showToast("Anotação adicionada!", "success");
    } catch (error) {
      console.error(error);

      showToast("Erro ao salvar anotação", "error");
    } finally {
      setSaving(false);
    }
  }

  function resetNotes() {
    setNotes([]);
    setLoading(false);
    setSaving(false);
  }

  return {
    notes,
    loading,
    saving,
    fetchNotes,
    addNote,
    resetNotes,
  };
}