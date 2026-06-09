import { useState } from "react";
import { formatPhone } from "@/shared/utils/formatPhone";
import type { CreateUserDTO } from "@/services/users/userService";
import { RegioesEnum, UserRoles } from "@/shared/types/UserTypes";

export function useHooksCorretores() {
    const [form, setForm] = useState<CreateUserDTO>({
        nome: "",
        email: "",
        telefone: "",
        password: "",
        regiao: RegioesEnum.CURITIBA,
        role: UserRoles.CORRETOR,
    });

    const [loading, setLoading] = useState(false);

    const handleRoleChange = (role: UserRoles) => {
        setForm((prev) => ({
            ...prev,
            role,
        }));
    };

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

        if (name === "senha") {
            setForm(prev => ({
                ...prev,
                password: value,
            }));
            return;
        }

        if (name === "role") {
            setForm(prev => ({
                ...prev,
                role: value as UserRoles
            }))
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
            password: "",
            regiao: RegioesEnum.CURITIBA,
            role: UserRoles.CORRETOR,
        });
    }

    return {
        form,
        setForm,
        loading,
        setLoading,
        handleChange,
        handleRoleChange,
        resetForm,
    };
}