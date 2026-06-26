export default function TodayReminderModal({
    open,
    count,
    onOpenTasks,
}: {
    open: boolean;
    count: number;
    onOpenTasks: () => void;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-100 text-center">

                <h2 className="text-lg font-semibold">
                    Você tem tarefas hoje
                </h2>

                <p className="text-gray-600 mt-2">
                    Você possui <b>{count}</b> tarefa(s) para hoje.
                </p>

                <button
                    onClick={onOpenTasks}
                    className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Abrir tarefas
                </button>
            </div>
        </div>
    );
}