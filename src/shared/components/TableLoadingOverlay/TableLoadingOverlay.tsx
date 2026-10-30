
import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

interface TableLoadingOverlayProps {
    loading: boolean;
    children: ReactNode;
    message?: string;
    minHeight?: string;
}

export default function TableLoadingOverlay({
    loading,
    children,
    message = "Buscando registros...",
    minHeight = "min-h-[200px]"
}: TableLoadingOverlayProps) {

    return (
        <div
            className={`relative isolate w-full ${minHeight}`}
            aria-busy={loading}
        >
            {children}

            {loading && (
                <div
                    role="status"
                    aria-live="polite"
                    className="
                        absolute inset-0 z-20
                        flex items-center justify-center
                        bg-slate-900/45
                        backdrop-blur-[2px]
                        rounded-lg
                        cursor-wait
                    "
                >
                    <div
                        className="
                            flex flex-col items-center gap-3
                            rounded-xl
                            bg-white
                            px-8 py-6
                            shadow-xl
                        "
                    >
                        <LoaderCircle
                            size={34}
                            className="animate-spin text-blue-600"
                        />

                        <span className="text-sm font-medium text-slate-700">
                            {message}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
