"use client";

import { useRef, useState } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { useLeadNotes } from "@/app/providers/LeadNoteProvider";
import { useNotesHook } from "../hooks/useLeadsNotes";
import type { LeadNoteRequest } from "@/shared/types/LeadNotesType";
import { useToast } from "@/app/providers/ToastProvider";

interface LeadsNotesModalProps {
  leadId: string;
  hasNotes: boolean;
  
}

export default function LeadsNotesModal({ leadId, hasNotes }: LeadsNotesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newNote, setNewNote] = useState<LeadNoteRequest | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const { showToast } = useToast();
  const containerRef = useRef<HTMLTableCellElement>(null);

  const {
    resetNotes,
  } = useNotesHook(leadId);

  const { leadNotes, createNewLeadNote: createLeadNote, fetchLeadNotesByLead, noteLoading } = useLeadNotes();

  function resetModal() {
    setNewNote(null);
    resetNotes();
    setIsOpen(false);
  }

  async function handleToggle(id: string, page: number) {
    if (isOpen) {
      resetModal();
      return;
    }

    await fetchLeadNotesByLead(id, page);
    setIsOpen(true);
  }

  useOutsideClick(containerRef, resetModal);

  async function handleAddNote() {
    setSaving(true);
    try {
      if (newNote) {
        const notaDto: LeadNoteRequest = {
          leadId: newNote.leadId,
          note: newNote.note
        }
        await createLeadNote(notaDto);
        setNewNote(null);
        await fetchLeadNotesByLead(notaDto.leadId, 0);
        resetModal();
        showToast("Nota criada com sucesso");
      } else {
        showToast("Erro ao salvar lead", "warning");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <td ref={containerRef} className="relative">
      <button
        className={`${hasNotes ? "bg-green-700" : "bg-black"}  text-white font-semibold px-3 py-1 rounded-full`}
        onClick={() => handleToggle(leadId, 0)}
      >
        {hasNotes ? "Visualizar notas" : "adicionar nota"}
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-72 bg-white border shadow-lg rounded-lg p-3 z-50">

          <div className="mb-3">
            <textarea
              value={newNote?.note}
              onChange={(e) => setNewNote({ note: e.target.value, leadId: leadId })}
              placeholder="Digite uma anotação..."
              className="w-full border rounded-md p-2 text-sm resize-none"
              rows={3}
            />

            <button
              onClick={handleAddNote}
              disabled={saving}
              className="mt-2 w-full bg-green-500 text-white py-1 rounded-md text-sm"
            >
              {saving ? "Salvando..." : "Salvar anotação"}
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-2">
            {noteLoading ? (
              <p className="text-sm text-gray-400">Carregando...</p>
            ) : leadNotes.length ? (
              leadNotes.map((note) => {
                return (
                  <div key={note.id} className="text-sm border-b pb-1">
                    <p>{note.note}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                )
              })
            ) : (
              <div className="text-sm border-b pb-1">
                Nenhuma nota para esse lead ainda
              </div>
            )}
          </div>
        </div>
      )}
    </td>
  );
}