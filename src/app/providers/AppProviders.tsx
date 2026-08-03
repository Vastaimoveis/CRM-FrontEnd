import { NotificationProvider } from "./NotificationProvider";
import { AuthProvider } from "./AuthProvider";
import { FunnelProvider } from "./FunnelProvider";
import { LeadNotesProvider } from "./LeadNoteProvider";
import { LeadProvider } from "./LeadProvider";
import { ToastProvider } from "./ToastProvider";
import { UserProvider } from "./UserProvider";
import { RoleProvider } from "./RoleProvider";

export default function AppProviders({
    children,
}: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ToastProvider>
                <FunnelProvider>
                    <UserProvider>
                        <RoleProvider>
                            <LeadProvider>
                                <LeadNotesProvider>
                                    <NotificationProvider>
                                        {children}
                                    </NotificationProvider>
                                </LeadNotesProvider>
                            </LeadProvider>
                        </RoleProvider>
                    </UserProvider>
                </FunnelProvider>
            </ToastProvider>
        </AuthProvider>
    )
}