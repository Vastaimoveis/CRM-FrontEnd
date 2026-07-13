import type { AppNotification } from "@/services/notification/NotificationTypes";

interface props {
    notification: AppNotification
}

export default function NotificationReminder({ notification }: props) {
    return (
        <>
            <h3 className="font-medium text-red-600">
                🌐 Lembrete
            </h3>

            <h3 className="font-medium">
                {notification.lead?.nome}
            </h3>

            <p className="text-sm text-gray-500">
                {notification.lead?.email}
            </p>

            <p className="text-xs text-gray-400 mt-2">
                Lembrete para
            </p>

            <p className="text-sm">
                {notification.alarmAt &&
                    new Date(notification.alarmAt).toLocaleDateString("pt-BR")}
            </p>
        </>
    );
}