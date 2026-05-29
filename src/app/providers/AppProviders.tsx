import { AuthProvider } from "./AuthProvider";
import { FunnelProvider } from "./FunnelProvider";
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
                        {children}
                    </LeadProvider>
                </FunnelProvider>
            </ToastProvider>
        </AuthProvider>
    )
}