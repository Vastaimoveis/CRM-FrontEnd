import { AuthProvider } from "./Auth/AuthProvider";
import { LeadNotesProvider } from "./LeadNote/LeadNoteProvider";
import { LeadProvider } from "./Lead/LeadProvider";
import { ToastProvider } from "./Toast/ToastProvider";
import { UserProvider } from "./User/UserProvider";
import { RoleProvider } from "./Role/RoleProvider";
import { ScriptProvider } from "./Script/ScriptProvider";
import { FunnelProvider } from "./Funnel/FunnelProvider";
import { FollowUpProvider } from "./FollowUp/FollowUpProvider";
import { NotificationProvider } from "./Notification/NotificationProvider";

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
                                    <FollowUpProvider>
                                        <ScriptProvider>
                                            <NotificationProvider>
                                                {children}
                                            </NotificationProvider>
                                        </ScriptProvider>
                                    </FollowUpProvider>
                                </LeadNotesProvider>
                            </LeadProvider>
                        </RoleProvider>
                    </UserProvider>
                </FunnelProvider>
            </ToastProvider>
        </AuthProvider>
    )
}