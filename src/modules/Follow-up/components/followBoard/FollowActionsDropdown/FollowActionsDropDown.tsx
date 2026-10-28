import { useEffect, useRef, useState } from "react";
import {
    EllipsisVertical,
    CalendarClock,
    Ban
} from "lucide-react";
import { createPortal } from "react-dom";

interface Props {
    onReschedule: () => void;
    onCancel: () => void;

}

export default function FollowActionsDropdown({
    onReschedule,
    onCancel,
}: Props) {

    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent) {

            const target = event.target as Node;

            if (
                !dropdownRef.current?.contains(target) &&
                !buttonRef.current?.contains(target)
            ) {
                setIsOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {

            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };

    }, [isOpen]);

    function handleReschedule() {
        setIsOpen(false);
        onReschedule();
    }

    function handleCancel() {
        setIsOpen(false);
        onCancel();
    }

    function handleToggle() {

        if (!isOpen && buttonRef.current) {

            const rect = buttonRef.current.getBoundingClientRect();

            setPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            });
        }

        setIsOpen(prev => !prev);
    }

    const buttonRef = useRef<HTMLButtonElement>(null);

    const [position, setPosition] = useState({
        top: 0,
        right: 0
    });

    return (
        <div ref={dropdownRef} className="relative inline-block">

            {/* BOTÃO */}

            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                aria-expanded={isOpen}
                className="rounded-lg p-2 hover:bg-slate-100"
            >
                <EllipsisVertical size={19} />
            </button>

            {/* DROPDOWN */}

            {isOpen && createPortal(

                <div
                    role="menu"
                    ref={dropdownRef}
                    style={{
                        position: "fixed",
                        top: position.top,
                        right: position.right
                    }}
                    className="
            z-9999
            w-52 rounded-xl
            border border-slate-200
            bg-white p-1.5 shadow-xl
        "
                >

                    <button
                        type="button"
                        onClick={handleReschedule}
                        className="
                flex w-full items-center gap-3
                rounded-lg px-3 py-2.5
                text-sm text-slate-700
                hover:bg-slate-100
            "
                    >
                        <CalendarClock size={17} />
                        Reagendar contato
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                        type="button"
                        onClick={handleCancel}
                        className="
                flex w-full items-center gap-3
                rounded-lg px-3 py-2.5
                text-sm text-red-600
                hover:bg-red-50
            "
                    >
                        <Ban size={17} />
                        Cancelar Follow-up
                    </button>

                </div>,

                document.body

            )}

        </div>
    );
}