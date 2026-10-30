import { LoaderCircle } from "lucide-react";

interface Props {
    message?: string;
}

export default function Loading({
    message = "Carregando..."
}: Props) {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex w-full flex-col items-center justify-center gap-3 py-12"
        >
            <LoaderCircle
                size={30}
                className="animate-spin text-sky-600"
            />

            <span className="text-sm font-medium text-slate-500">
                {message}
            </span>
        </div>
    );
}