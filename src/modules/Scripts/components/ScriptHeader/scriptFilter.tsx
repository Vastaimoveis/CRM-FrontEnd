import {
    ScriptCategories,
    ScriptCategoryLabels,
} from "@/services/script/ScriptTypes";

interface Props {
    onFilter: (category: ScriptCategories | "") => Promise<void>;
}

export default function ScriptFilter({ onFilter }: Props) {
    return (
        <section>
            <select
                defaultValue=""
                onChange={(e) =>
                    onFilter(e.target.value as ScriptCategories | "")
                }
                className="rounded-2xl p-4 border border-gray-300 hover:bg-gray-100"
            >
                <option value="">
                    Todas as categorias
                </option>

                {Object.values(ScriptCategories).map((category) => (
                    <option key={category} value={category}>
                        {ScriptCategoryLabels[category]}
                    </option>
                ))}
            </select>
        </section>
    );
}