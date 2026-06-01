import { AuthProvider } from "./AuthProvider";
import { FunnelProvider } from "./FunnelProvider";
import { LeadNotesProvider } from "./LeadNoteProvider";
import { LeadProvider} from "./LeadProvider";
import { ToastProvider } from "./ToastProvider";

export default function AppProviders({
    children,
}: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ToastProvider>
                <FunnelProvider>
                    <LeadProvider>
                        <LeadNotesProvider>
                        {children}
                        </LeadNotesProvider>
                    </LeadProvider>
                </FunnelProvider>
            </ToastProvider>
        </AuthProvider>
    )
}