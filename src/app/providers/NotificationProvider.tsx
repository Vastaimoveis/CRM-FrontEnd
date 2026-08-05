import { NotificationType, type AppNotification } from "@/services/notification/NotificationTypes";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useToast } from "./ToastProvider";
import { useAuth } from "./AuthProvider";
import { format } from "date-fns"
import { isSameDay } from "date-fns";
import { deleteNotification, getNotificationsByUserId, patchReadNotification, postNewNotification } from "@/services/notification/NotificationService";

interface NotificationContextType {
    notifications: AppNotification[];
    hasUnreadNotifications: boolean;
    dateReminder: Date;
    setDateReminder: React.Dispatch<React.SetStateAction<Date>>;
    showTodayModal: boolean;
    setShowTodayModal: React.Dispatch<React.SetStateAction<boolean>>;

    todayNotifications: AppNotification[];

    todayReminders: AppNotification[];

    todayLeads: AppNotification[];

    unreadNotifications: AppNotification[];
    readNotifications: AppNotification[];

    handleReadNotification: (id: string, read: boolean) => Promise<void>;
    handleCreateNotification: (leadId: string) => Promise<AppNotification | null>;
    handleLoadNotifications: (userId: string) => Promise<void>;
    handleDeleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [dateReminder, setDateReminder] = useState<Date>(new Date());
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const { showToast } = useToast();
    const hasUnreadNotifications = notifications.some(r => !r.read);
    const [showTodayModal, setShowTodayModal] = useState(false);
    const userId = user ? user.id : null
    const [initialLoaded, setInitialLoaded] = useState(false);
    const hasShownTodayModal = useRef(false);

    const todayReminders = useMemo(() => {
        return notifications.filter(
            n =>
                n.type === NotificationType.REMINDER &&
                n.alarmAt &&
                isSameDay(new Date(n.alarmAt), new Date())
        );
    }, [notifications]);

    const todayLeads = useMemo(() => {
        return notifications.filter(
            n =>
                n.type === NotificationType.NEW_LEAD &&
                isSameDay(new Date(n.createdAt), new Date())
        );
    }, [notifications]);

    const todayNotifications = useMemo(() => {
        return [...todayLeads, ...todayReminders]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
    }, [todayLeads, todayReminders]);

    const unreadNotifications = useMemo(
        () => notifications.filter(r => !r.read),
        [notifications]
    );

    const readNotifications = useMemo(
        () => notifications.filter(r => r.read),
        [notifications]
    );

    const handleCreateNotification = useCallback(
        async (leadId: string) => {

            if (!userId) return null;

            try {

                const notification = await postNewNotification({
                    leadId,
                    userId,
                    type: NotificationType.REMINDER,
                    alarmAt: format(dateReminder, "yyyy-MM-dd'T'HH:mm:ss")
                });

                setNotifications(prev => [...prev, notification]);

                showToast("Lembrete criado com sucesso", "success");

                return notification;

            } catch (e: any) {

                showToast(
                    e.message || "Erro ao criar notificação",
                    "error"
                );

                return null;
            }

        },
        [userId, dateReminder, showToast]
    );

    const handleLoadNotifications = useCallback(
        async (userId: string) => {

            try {

                const data = await getNotificationsByUserId(userId);

                setNotifications(data);

            } catch {

                setNotifications([]);

            } finally {

                setInitialLoaded(true);

            }

        },
        []
    );

    const handleReadNotification = useCallback(
        async (id: string, read: boolean) => {

            try {

                const updatedReminder = await patchReadNotification(id, { read });

                setNotifications(prev =>
                    prev.map(reminder =>
                        reminder.id === updatedReminder.id
                            ? updatedReminder
                            : reminder
                    )
                );

            } catch (e: any) {

                showToast(
                    e.message || "Erro ao atualizar notificação",
                    "error"
                );

            }

        },
        [showToast]
    );
    const handleDeleteNotification = useCallback(
        async (id: string) => {

            try {

                await deleteNotification(id);

                setNotifications(prev =>
                    prev.filter(n => n.id !== id)
                );

                showToast("Notificação removida", "success");

            } catch {

                showToast(
                    "Erro ao remover notificação",
                    "error"
                );

            }

        },
        [showToast]
    );

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }

        handleLoadNotifications(user.id);
    }, [user, handleLoadNotifications]);

    useEffect(() => {
        if (!user || !initialLoaded) return;
        if (hasShownTodayModal.current) return;

        if (todayNotifications.length > 0) {
            setShowTodayModal(true);
            hasShownTodayModal.current = true;
        }
    }, [user, initialLoaded, todayNotifications]);

    const value = useMemo(() => (
        {
            notifications,
            hasUnreadNotifications,
            readNotifications,

            unreadNotifications,
            todayNotifications,
            todayLeads,
            todayReminders,

            showTodayModal,
            setShowTodayModal,
            dateReminder,
            setDateReminder,

            handleReadNotification,
            handleCreateNotification,
            handleLoadNotifications,
            handleDeleteNotification
        }
    ), [
        notifications,
        hasUnreadNotifications,
        showTodayModal,
        setShowTodayModal,
        dateReminder,
        setDateReminder,

        readNotifications,
        unreadNotifications,
        todayNotifications,
        todayLeads,
        todayReminders,

        handleReadNotification,
        handleCreateNotification,
        handleLoadNotifications,
        handleDeleteNotification,
    ])

    return (
        <NotificationContext.Provider
            value={value}
        >
            {children}
        </NotificationContext.Provider>
    )
}


export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useAlert deve ser usado dentro de AlertProvider")
    }

    return context;
}


