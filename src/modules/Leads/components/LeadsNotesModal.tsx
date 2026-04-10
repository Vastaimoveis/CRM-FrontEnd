"use client";

import { useEffect, useRef, useState } from "react";
import type { LeadNotes } from "@/shared/types/LeadNotes";
import { useToast } from "@/app/providers/ToastProvider";

interface LeadsNotesModalProps {
  leadId: string;
}

export default function LeadsNotesModal({ leadId }: LeadsNotesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<LeadNotes[]>([]);
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);

  const containerRef = useRef<HTMLTableCellElement>(null);
  const { showToast } = useToast();

  // 🔹 Buscar anotações
  async function fetchNotes() {
    try {
      setLoading(true);

      const response = await fetch(`/api/leads/${leadId}/notes`);
      const data = await response.json();

      setNotes(data);
    } catch (error) {
      console.error("Erro ao buscar anotações:", error);
      setNotes([]);
      showToast("Erro ao carregar anotações", "error");
    } finally {
      setLoading(false);
    }
  }

  // 🔥 Criar anotação com atualização otimista
  async function handleAddNote() {
    if (!newNote.trim()) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticNote: LeadNotes = {
      id: tempId,
      LeadId: leadId,
      message: newNote,
      creationDate: new Date(),
    };

    // 🔹 Atualiza UI imediatamente
    setNotes((prev) => [optimisticNote, ...prev]);
    setNewNote("");
    setSaving(true);

    try {
      const response = await fetch(`/api/leads/${leadId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: optimisticNote.message,
        }),
      });

      const savedNote = await response.json();

      // 🔹 Substitui a nota temporária pela real
      setNotes((prev) =>
        prev.map((note) => (note.id === tempId ? savedNote : note))
      );

      showToast("Anotação adicionada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao salvar anotação:", error);

      // 🔥 Rollback
      setNotes((prev) => prev.filter((note) => note.id !== tempId));

      showToast("Erro ao salvar anotação", "error");
    } finally {
      setSaving(false);
    }
  }

  // 🔹 Abrir / fechar
  function handleToggle() {
    if (!isOpen) {
      fetchNotes();
    }
    setIsOpen(!isOpen);
  }

  // 🔹 Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🔹 Export
  function exportNotes(notes: LeadNotes[]) {
    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `lead-${leadId}-notes.json`;
    link.click();

    URL.revokeObjectURL(url);
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
          
          {/* 🔹 Input */}
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
              className="mt-2 w-full bg-green-500 text-white py-1 rounded-md text-sm disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar anotação"}
            </button>
          </div>

          {/* 🔹 Lista */}
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

          {/* 🔹 Export */}
          <button
            onClick={() => exportNotes(notes)}
            className="mt-3 w-full bg-blue-500 text-white py-1 rounded-md text-sm"
          >
            Exportar
          </button>
        </div>
      )}
    </td>
  );
}