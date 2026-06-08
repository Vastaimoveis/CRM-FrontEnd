import type { User } from "@/shared/types/UserTypes";
import { useState, useMemo } from "react";


export function useSearchDropdown(items: User[]) {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<User | null>(null);
    const [open, setOpen] = useState(false);

    const filteredItems = useMemo(() => {
        return items.filter(item =>
            item.nome.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, items]);

    function selectItem(item: User) {
        setSelected(item);
        setQuery(item.nome);
        setOpen(false);
    }

    return {
        query,
        setQuery,
        selected,
        setSelected,
        open,
        setOpen,
        filteredItems,
        selectItem
    };
}