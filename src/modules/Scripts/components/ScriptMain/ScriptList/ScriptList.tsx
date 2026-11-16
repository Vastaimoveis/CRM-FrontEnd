import type { Script } from "@/services/script/ScriptTypes";
import ScriptListItem from "./ScriptListItem";

interface ScriptListProps {
    scripts: Script[];
    onEdit: (script: Script) => void;
    onDelete: (script: Script) => void;
    onCopy: (script: Script) => void;
}

export default function ScriptList({
    scripts,
    onEdit,
    onDelete,
    onCopy
}: ScriptListProps) {
    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
            {scripts.map((script) => (
                <ScriptListItem
                    key={script.id}
                    script={script}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onCopy={onCopy}
                />
            ))}
        </div>
    );
}