import type { Script } from "@/services/script/ScriptTypes";
import { Copy, Pen, Trash } from "lucide-react";

interface Props {
    script: Script;
    onEdit: (script: Script) => void;
    onDelete: (script: Script) => void;
    onCopy: (script: Script) => void;
}

export default function ScriptListAction({script, onDelete, onEdit, onCopy}: Props) {
    
    return (
        <section>
            <div className="flex gap-2">
                <Copy size={20} onClick={() => onCopy(script)} />
                <Pen size={20} onClick={() => onEdit(script)}/>
                <Trash size={20} onClick={() => onDelete(script)}/>
            </div>
        </section>
    )
}