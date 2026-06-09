import { useState } from "react";
import { formatPhone } from "@/shared/utils/formatPhone";
import { LeadStatus, type CreateLeadDTO } from "@/types/LeadType";

export function useHooksFunnel() {
  const [form, setForm] = useState<CreateLeadDTO>({
    nome: "",
    email: "",
    telefone: "",
    status: LeadStatus.CADASTRADO,
  });

  const [loading, setLoading] = useState(false);

  const handleStatusChange = (status: LeadStatus) => {
    setForm((prev) => ({
      ...prev,
      status,
    }));
  }
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
        nome: value,
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
      status: LeadStatus.CADASTRADO
    });
  }

  return {
    form,
    setForm,
    handleStatusChange,
    loading,
    setLoading,
    handleChange,
    resetForm,
  };
}