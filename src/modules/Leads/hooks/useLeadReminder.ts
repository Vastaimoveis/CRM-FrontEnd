import { useReminder } from "@/app/providers/ReminderProvider";
import { useToast } from "@/app/providers/ToastProvider";
import { useEffect, useState } from "react";

export function useLeadReminder() {
    const [openReminder, setOpenReminder] = useState(false);
    const { createRemind, dateReminder, setDateReminder } = useReminder();
    const { showToast } = useToast();
    function reset() {
        setOpenReminder(false);
        setDateReminder(new Date());
    }

    function onSelect(date?: Date) {
        console.log("data que entra: ", date)
        if (!date) {
            setDateReminder(new Date());
        } else {
            setDateReminder(date);
        }
    }
    function onCancel() {
        reset();
    }
    async function onSave(leadId: string) {
        try {
            if (!dateReminder) return;
            await createRemind(leadId)
            showToast("Lembrete criado com sucesso", "success")
        } catch (e) {
            showToast("Erro ao criar lembrete", "error")
        } finally {
            reset();

        }
    }
    useEffect(() => {
    }, [dateReminder])
    return {
        openReminder,
        setOpenReminder,
        dateReminder,
        onSelect,
        onCancel,
        onSave,
    };
}