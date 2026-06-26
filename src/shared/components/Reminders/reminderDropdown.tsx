import { Bell, BellRing } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReminder } from "@/app/providers/ReminderProvider";
import ReminderItem from "./ReminderItem";
import TodayReminderModal from "./todayRemindersModal";

export default function ReminderDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const { reminders, hasUnreadReminders, readReminders, unreadReminders, todayReminders, showTodayModal, setShowTodayModal } = useReminder();
    const [tab, setTab] = useState<"unread" | "read" | "today">("today");


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="relative"
            >
                {hasUnreadReminders ? (
                    <BellRing className="text-red-500" />
                ) : (
                    <Bell />
                )}

                {hasUnreadReminders && (
                    <span
                        className="
                            absolute
                            -top-1
                            -right-1
                            bg-red-500
                            text-white
                            text-[10px]
                            rounded-full
                            h-4
                            w-4
                            flex
                            items-center
                            justify-center
                        "
                    >
                        {reminders.filter(r => !r.read).length}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="
                        absolute
                        right-0
                        mt-3
                        w-96
                        bg-white
                        rounded-xl
                        shadow-xl
                        border
                        z-50
                    "
                >
                    <div className="border-b px-4 py-3">
                        <h2 className="font-semibold">
                            Lembretes
                        </h2>
                    </div>

                    <div className="flex border-b">
                        <button
                            onClick={() => setTab("today")}
                            className={`flex-1 py-2 text-sm ${tab === "today"
                                ? "font-semibold border-b-2 border-blue-500"
                                : "text-gray-500"
                                }`}
                        >
                            Hoje ({todayReminders.length})
                        </button>
                        <button
                            onClick={() => setTab("unread")}
                            className={`flex-1 py-2 text-sm ${tab === "unread"
                                ? "font-semibold border-b-2 border-red-500"
                                : "text-gray-500"
                                }`}
                        >
                            Não lidos ({unreadReminders.length})
                        </button>

                        <button
                            onClick={() => setTab("read")}
                            className={`flex-1 py-2 text-sm ${tab === "read"
                                ? "font-semibold border-b-2 border-gray-400"
                                : "text-gray-500"
                                }`}
                        >
                            Lidos ({readReminders.length})
                        </button>


                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {tab === "unread" && (
                            unreadReminders.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    Nenhum lembrete não lido.
                                </div>
                            ) : (
                                unreadReminders.map(reminder => (
                                    <ReminderItem key={reminder.id} reminder={reminder} />
                                ))
                            )
                        )}

                        {tab === "read" && (
                            readReminders.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    Nenhum lembrete lido.
                                </div>
                            ) : (
                                readReminders.map(reminder => (
                                    <ReminderItem key={reminder.id} reminder={reminder} />
                                ))
                            )
                        )}

                        {tab === "today" && (
                            todayReminders.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    Nenhum lembrete para hoje.
                                </div>
                            ) : (
                                todayReminders.map(reminder => (
                                    <ReminderItem key={reminder.id} reminder={reminder} />
                                ))
                            )
                        )}
                    </div>
                </div>
            )}
            <TodayReminderModal
                open={showTodayModal}
                count={todayReminders.length}
                onOpenTasks={() => {
                    setShowTodayModal(false);
                    setOpen(true); // abre dropdown
                    setTab("today"); // já vai direto pra aba de hoje
                }}
            />
        </div>
    );
}