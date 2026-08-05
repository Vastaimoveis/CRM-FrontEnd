import { useNotification } from "@/app/providers/NotificationProvider";
import { NotificationType, type AppNotification } from "@/services/notification/NotificationTypes";
import NotificationReminder from "./components/NotificationReminder";
import NotificationPublicLead from "./components/NotificationPublicLead";

interface Props {
    notification: AppNotification;
}
export default function NotificationItem({ notification }: Props) {
    const { handleReadNotification, handleDeleteNotification } = useNotification();
    let content: React.ReactNode;

    switch (notification.type) {
        case NotificationType.REMINDER:
            content = <NotificationReminder notification={notification} />;
            break;

        case NotificationType.NEW_LEAD:
            content = <NotificationPublicLead notification={notification} />;
            break;

        default:
            content = null;
    }

    return (
        <button className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b">
            <div className="flex justify-between items-start">

                <div>
                    {content}
                </div>

                {!notification.read && (
                    <div className="flex flex-col justify-between place-items-end place-self-end">
                        <div className="w-3 h-3 rounded-full bg-red-500" />

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleReadNotification(notification.id, true);
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

                {notification.read && (
                    <div className="flex flex-col justify-between place-items-end place-self-end">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(notification.id);
                            }}
                            className="
                            mt-10
                            text-xs
                            text-white
                            font-semibold
                            hover:underline
                            bg-red-500
                            py-1
                            px-2
                            
                            rounded-lg
                        "
                        >
                            Deletar notificação
                        </button>
                    </div>
                )}

            </div>
        </button>
    );

}