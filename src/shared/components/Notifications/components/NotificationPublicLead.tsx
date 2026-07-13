import type { AppNotification } from "@/services/notification/NotificationTypes";

interface props {
    notification: AppNotification;
}

export default function NotificationPublicLead({notification}:props) {
    return (
        <>
            <h3 className="font-medium text-green-700">
                🌐 Novo Lead
            </h3>

            <p className="text-sm font-medium">
                {notification.lead?.nome}
            </p>

            <p className="text-sm text-gray-500">
                {notification.lead?.telefone}
            </p>

            <p className="text-xs text-gray-400 mt-2">
                Recebido pelo site
            </p>

            <p className="text-sm">
                {new Date(notification.createdAt).toLocaleDateString("pt-BR")}
            </p>
        </>
    );
}