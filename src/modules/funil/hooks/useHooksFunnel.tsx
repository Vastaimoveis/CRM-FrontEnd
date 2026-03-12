import { useState } from "react";
import { LeadStatus } from "@/shared/types/LeadType";
import { formatPhone } from "@/shared/utils/formatPhone";
import { capitalizeFirstLetter } from "@/shared/utils/capitalizeFirstLetter";
import type { CreateLeadDTO } from "@/types/LeadType";

export function useHooksFunnel() {
  const [form, setForm] = useState<CreateLeadDTO>({
    nome: "",
    email: "",
    telefone: "",
    status: LeadStatus.CADASTRADO,
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "telefone") {
      setForm(prev => ({
        ...prev,
        telefone: formatPhone(value),
      }));
      return;
    }

    if (name === "nome") {
      setForm(prev => ({
        ...prev,
        nome: capitalizeFirstLetter(value),
      }));
      return;
    }

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm({
      nome: "",
      email: "",
      telefone: "",
      status: LeadStatus.CADASTRADO,
    });
  }

  return {
    form,
    setForm,
    loading,
    setLoading,
    handleChange,
    resetForm,
  };
}