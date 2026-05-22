import { useState } from "react";
import { formatPhone } from "@/shared/utils/formatPhone";
import { capitalizeFirstLetter } from "@/shared/utils/capitalizeFirstLetter";
import type { CreateLeadDTO } from "@/types/LeadType";

export function useHooksFunnel() {
  const [form, setForm] = useState<CreateLeadDTO>({
    nome: "",
    email: "",
    telefone: "",
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