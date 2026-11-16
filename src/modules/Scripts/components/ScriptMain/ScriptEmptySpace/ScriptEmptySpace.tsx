import { MessageSquareText } from "lucide-react";

export default function ScriptEmptyState() {
    return (
        <section className="
            w-full flex flex-col items-center justify-center
            py-16 gap-3 rounded-xl border border-gray-200 bg-white
        ">
            <MessageSquareText size={35} className="text-gray-300" />

            <h3 className="text-base font-semibold text-gray-700">
                Nenhum script encontrado
            </h3>

            <p className="text-sm text-gray-500">
                Cadastre um novo script ou tente outra pesquisa.
            </p>
        </section>
    );
}