import type { User } from "../types/UserTypes";

interface props {
    openDropdown: boolean;
    user: User | null;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    logout: () => void;
}

export default function UserDropdown({ dropdownRef, user, openDropdown, setOpenDropdown, logout }: props) {
    return (<div className="relative" ref={dropdownRef}>
        <button
            onClick={() => setOpenDropdown((prev) => !prev)}
            className="px-4 py-2 border border-black rounded-md text-sm font-medium hover:bg-black hover:text-white transition"
        >
            {user?.nome}
        </button>
        {openDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">

                <button
                    onClick={() => {
                        logout();
                        setOpenDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                    Sair
                </button>

            </div>
        )}
    </div>)
}