import { useReminder } from "@/app/providers/ReminderProvider";
import type { Reminder } from "@/services/reminder/reminderTypes";

interface Props {
    reminder: Reminder;
}
export default function ReminderItem({ reminder }: Props) {
    const { readReminder } = useReminder();

    return (
        <button className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium">{reminder.lead.nome}</h3>

                    <p className="text-sm text-gray-500">
                        {reminder.lead.email}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                        Lembrete para
                    </p>

                    <p className="text-sm">
                        {new Date(reminder.alarmAt).toLocaleDateString("pt-BR")}
                    </p>
                </div>

                {!reminder.read && (
                    <div className="flex flex-col justify-between place-items-end">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                readReminder(reminder.id, true);
                            }}
                            className="
                                mt-10
                                text-xs
                                text-black
                                font-semibold
                                hover:underline
                                bg-blue-400
                                py-1
                                px-2 
                                rounded-3xl
                            "
                        >
                            Marcar como lido
                        </button>
                    </div>
                )}
            </div>
        </button>
    );
}