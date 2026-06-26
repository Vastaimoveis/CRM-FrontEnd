import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";

type Props = {
    leadId: string;
    open: boolean;
    date?: Date;
    onSelect: (date?: Date) => void;
    onCancel: () => void;
    onSave: (leadId: string) => void;
};

export function LeadsReminderPicker({
    leadId,
    open,
    date,
    onSelect,
    onCancel,
    onSave,
}: Props) {
    if (!open) return null;

    return (
        <div className="absolute z-50 bg-white border rounded-lg shadow-lg p-4 right-0 top-0">
            <DayPicker
                mode="single"
                selected={date}
                onSelect={onSelect}
                locale={ptBR}
            />

            <div className="flex justify-between mt-3">
                <button onClick={onCancel} className="px-3 py-1 border rounded">
                    Cancelar
                </button>

                <button onClick={() => onSave(leadId)} className="px-3 py-1 bg-green-600 text-white rounded">
                    Salvar
                </button>
            </div>
        </div>
    );
}