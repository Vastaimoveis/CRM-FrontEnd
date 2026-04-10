// /hooks/useLeadNotes.ts
"use client";

import { useState } from "react";
import type { LeadNotes } from "@/shared/types/LeadNotes";
import { useToast } from "@/app/providers/ToastProvider";

export function useLeadNotes(leadId: string) {
  const [notes, setNotes] = useState<LeadNotes[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  async function fetchNotes() {
    try {
      setLoading(true);

      const response = await fetch(`/api/leads/${leadId}/notes`);
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

    const tempId = `temp-${Date.now()}`;

    const optimisticNote: LeadNotes = {
      id: tempId,
      LeadId: leadId,
      message,
      creationDate: new Date(),
    };

    setNotes((prev) => [optimisticNote, ...prev]);
    setSaving(true);

    try {
      const response = await fetch(`/api/leads/${leadId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const savedNote = await response.json();

      setNotes((prev) =>
        prev.map((n) => (n.id === tempId ? savedNote : n))
      );

      showToast("Anotação adicionada!", "success");
    } catch (error) {
      console.error(error);

      // rollback
      setNotes((prev) => prev.filter((n) => n.id !== tempId));

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