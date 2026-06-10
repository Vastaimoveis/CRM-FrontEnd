import type { ReactNode } from "react";

interface ModalProps {
    open: boolean;
    title?: string;
    onClose: () => void;
    children?: ReactNode;
    width?: string;
    height?: string;
}

export default function Modal({
    open,
    title,
    onClose,
    children,
    width = "w-[600px]",
    height = "h-[80vh]",
}: ModalProps) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">

            <div
                className={`
                    bg-white
                    rounded-xl
                    p-6
                    relative
                    flex
                    flex-col
                    ${width}
                    ${height}
                `}
            >
                <div className="flex items-center justify-between mb-4">
                    {title && (
                        <h2 className="text-xl font-semibold">
                            {title}
                        </h2>
                    )}

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}