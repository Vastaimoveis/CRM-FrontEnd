import type { User } from "@/shared/types/UserTypes";
import { useSearchDropdown} from "../hooks/useSearchDropdown";

interface Props {
    items: User[];
    placeholder?: string;
    onSelect?: (item: User) => void;
}

export default function RequisitosSearchDropdown({ items, placeholder, onSelect }: Props) {
    const {
        query,
        setQuery,
        open,
        setOpen,
        filteredItems,
        selectItem
    } = useSearchDropdown(items);

    function handleSelect(item: User) {
        selectItem(item);
        onSelect?.(item);
    }

    return (
        <div className="relative w-full">
            <input
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder={placeholder || "Buscar..."}
                className="w-full border rounded p-2"
            />

            {open && (
                <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {item.name}
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-gray-500">
                            Nenhum resultado
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}