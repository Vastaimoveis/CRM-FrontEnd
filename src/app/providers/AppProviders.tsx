import { AuthProvider } from "./AuthProvider";
import { LeadProvider } from "./LeadProvider";
import { ToastProvider } from "./ToastProvider";

export default function AppProviders({
    children,
}: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <LeadProvider>
                <ToastProvider>{children}</ToastProvider>
            </LeadProvider>
        </AuthProvider>
    )
}