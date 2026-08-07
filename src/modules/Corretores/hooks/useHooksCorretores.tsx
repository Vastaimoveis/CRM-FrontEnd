import { useState } from "react";
import { formatPhone } from "@/shared/utils/formatPhone";
import type { CreateUserDTO } from "@/services/users/userService";
import { RegioesEnum } from "@/shared/types/UserTypes";
import { SYSTEM_ROLES } from "@/services/roles/roleTypes";
import { useRole } from "@/app/providers/RoleProvider";

export function useHooksCorretores() {
    const { roles } = useRole();

    const [form, setForm] = useState<CreateUserDTO>({
        nome: "",
        email: "",
        telefone: "",
        password: "",
        regiao: RegioesEnum.CURITIBA,
        role: roles.find((role) => role.name === SYSTEM_ROLES.CORRETOR)?.id,
    });

    const [loading, setLoading] = useState(false);

    const handleRoleChange = (role: string) => {
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
                role: value as SYSTEM_ROLES
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
            role: roles.find((role) => role.name === SYSTEM_ROLES.CORRETOR)?.id,
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