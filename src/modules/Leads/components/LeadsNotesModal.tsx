"use client";

import { useRef, useState } from "react";
import { useLeadNotes } from "../hooks/useLeadsNotes";
import { useOutsideClick } from "../hooks/useOutsideClick";

interface LeadsNotesModalProps {
  leadId: string;
}

export default function LeadsNotesModal({ leadId }: LeadsNotesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  const containerRef = useRef<HTMLTableCellElement>(null);

  const {
    notes,
    loading,
    saving,
    fetchNotes,
    addNote,
    resetNotes,
  } = useLeadNotes(leadId);

  function resetModal() {
    setIsOpen(false);
    setNewNote("");
    resetNotes();
  }

  function handleToggle() {
    if (isOpen) {
      resetModal();
      return;
    }

    setIsOpen(true);
    fetchNotes();
  }

  useOutsideClick(containerRef, resetModal);

  function handleAddNote() {
    addNote(newNote);
    setNewNote("");
  }

  return (
    <td ref={containerRef} className="relative">
      <button
        className="bg-black text-white font-semibold px-3 py-1 rounded-full"
        onClick={handleToggle}
      >
        Adicionar anotação
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-72 bg-white border shadow-lg rounded-lg p-3 z-50">
          
          <div className="mb-3">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
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
            {loading ? (
              <p className="text-sm text-gray-400">Carregando...</p>
            ) : notes.length ? (
              notes.map((note) => (
                <div key={note.id} className="text-sm border-b pb-1">
                  <p>{note.message}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(note.creationDate).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">Sem anotações</p>
            )}
          </div>
        </div>
      )}
    </td>
  );
}