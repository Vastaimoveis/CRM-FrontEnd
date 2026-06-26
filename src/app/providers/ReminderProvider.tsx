import { getAlertsByUserId, patchReminder, postReminder } from "@/services/reminder/remiderService";
import { type Reminder } from "@/services/reminder/reminderTypes";
import type { ApiResponse } from "@/shared/types/api";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useToast } from "./ToastProvider";
import { useAuth } from "./AuthProvider";
import { format } from "date-fns"
import { isSameDay } from "date-fns";

interface ReminderContextType {
    reminders: Reminder[];
    hasUnreadReminders: boolean;
    dateReminder: Date;
    setDateReminder: React.Dispatch<React.SetStateAction<Date>>;
    showTodayModal: boolean;
    setShowTodayModal: React.Dispatch<React.SetStateAction<boolean>>;
    todayReminders: Reminder[];
    unreadReminders: Reminder[];
    readReminders: Reminder[];
    readReminder: (id: string, read: boolean) => Promise<void>;
    createRemind: (leadId: string) => Promise<Reminder | null>;
    loadReminders: (userId: string) => Promise<void>;
}

const ReminderContext = createContext<ReminderContextType | null>(null);

export function ReminderProvider({ children }: { children: ReactNode }) {
    const [dateReminder, setDateReminder] = useState<Date>(new Date);
    const { user } = useAuth();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const { showToast } = useToast();
    const hasUnreadReminders = reminders.some(r => !r.read);
    const [showTodayModal, setShowTodayModal] = useState(false);
    const userId = user ? user.id : null
    const [initialLoaded, setInitialLoaded] = useState(false);
    const hasShownTodayModal = useRef(false);

    const todayReminders = useMemo(() => {
        return reminders.filter(r =>
            isSameDay(new Date(r.alarmAt), new Date())
        );
    }, [reminders]);

    const unreadReminders = useMemo(
        () => reminders.filter(r => !r.read),
        [reminders]
    );


    const readReminders = reminders.filter(r => r.read);


    const createRemind = useCallback(
        async (leadId: string) => {
            if (!dateReminder) {
                return null;
            }
            if (!userId) return null;
            console.log("data enviada: " + format(dateReminder, "yyyy-MM-dd'T'HH:mm:ss"))
            const response: ApiResponse<Reminder> = await postReminder({ alarmAt: format(dateReminder, "yyyy-MM-dd'T'HH:mm:ss"), leadId: leadId, userId: userId });
            if (!response.success) {
                showToast("Erro ao criar notificação", "error")
                return null;
            }
            setReminders(prev => [...prev, response.data]);
            console.log(response);
            return response.data

        }, [postReminder, showToast, dateReminder]
    )

    const loadReminders = useCallback(async (userId: string) => {
        const response = await getAlertsByUserId(userId);

        if (!response.success) {
            setReminders([]);
            setInitialLoaded(true);
            return;
        }

        setReminders(response.data);
        setInitialLoaded(true);
    }, []);

    const readReminder = useCallback(async (id: string, read: boolean) => {
        try {
            const response: ApiResponse<Reminder> = await patchReminder(id, { read: read });
            const updatedReminder = response.data
            setReminders(prev =>
                prev.map(reminder =>
                    reminder.id === updatedReminder.id
                        ? updatedReminder
                        : reminder
                )
            );
        } catch (e) {
            console.log(e);
        }

    }, [patchReminder])


    useEffect(() => {
        if (!user) {
            setReminders([]);
            return;
        }

        loadReminders(user.id);
    }, [user, loadReminders]);

    useEffect(() => {
        if (!user || !initialLoaded) return;
        if (hasShownTodayModal.current) return;

        if (todayReminders.length > 0) {
            setShowTodayModal(true);
            hasShownTodayModal.current = true;
        }
    }, [user, initialLoaded, todayReminders]);

    const value = useMemo(() => (
        {
            reminders,
            hasUnreadReminders,
            readReminders,
            unreadReminders,
            todayReminders,
            setReminders,
            showTodayModal,
            setShowTodayModal,
            dateReminder,
            setDateReminder,
            readReminder,
            createRemind,
            loadReminders
        }
    ), [
        reminders,
        hasUnreadReminders,
        setReminders,
        showTodayModal,
        setShowTodayModal,
        dateReminder,
        setDateReminder,
        readReminders,
        unreadReminders,
        todayReminders,
        readReminder,
        createRemind,
        loadReminders,
    ])

    return (
        <ReminderContext.Provider
            value={value}
        >
            {children}
        </ReminderContext.Provider>
    )
}


export function useReminder() {
    const context = useContext(ReminderContext);
    if (!context) {
        throw new Error("useAlert deve ser usado dentro de AlertProvider")
    }

    return context;
}


