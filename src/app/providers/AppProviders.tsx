import { AuthProvider } from "./AuthProvider";
import { FunnelProvider } from "./FunnelProvider";
import { LeadNotesProvider } from "./LeadNoteProvider";
import { LeadProvider } from "./LeadProvider";
import { ToastProvider } from "./ToastProvider";
import { UserProvider } from "./UserProvider";

export default function AppProviders({
    children,
}: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ToastProvider>
                <FunnelProvider>
                    <UserProvider>
                        <LeadProvider>
                            <LeadNotesProvider>
                                {children}
                            </LeadNotesProvider>
                        </LeadProvider>
                    </UserProvider>
                </FunnelProvider>
            </ToastProvider>
        </AuthProvider>
    )
}