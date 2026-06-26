import { useState } from "react";
import { type DateRange, DayPicker } from "react-day-picker";
import {
    format,
    startOfMonth,
    endOfMonth,
    subDays
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
    startDate: string | null;
    endDate: string | null;
    onChange: (
        start: string | null,
        end: string | null
    ) => void;
}

export default function LeadDatePicker({
    startDate,
    endDate,
    onChange
}: Props) {
    const [open, setOpen] = useState(false);
    const [selectedRange, setSelectedRange] =
        useState<DateRange>();
    const today = new Date();

    const todayStr = format(today, "yyyy-MM-dd");

    const isToday =
        startDate === todayStr &&
        endDate === todayStr;

    const isLast7Days =
        startDate === format(subDays(today, 6), "yyyy-MM-dd") &&
        endDate === todayStr;

    const isCurrentMonth =
        startDate === format(startOfMonth(today), "yyyy-MM-dd") &&
        endDate === format(endOfMonth(today), "yyyy-MM-dd");

    const isCustom =
        startDate &&
        endDate &&
        !isToday &&
        !isLast7Days &&
        !isCurrentMonth;

    const isNoFilter = !startDate && !endDate;

    function setToday() {
        const today = new Date();

        const value = format(
            today,
            "yyyy-MM-dd"
        );

        onChange(value, value);
        setOpen(false);
    }

    function setLast7Days() {
        const today = new Date();

        onChange(
            format(subDays(today, 6), "yyyy-MM-dd"),
            format(today, "yyyy-MM-dd")
        );

        setOpen(false);
    }

    function setCurrentMonth() {
        onChange(
            format(startOfMonth(new Date()), "yyyy-MM-dd"),
            format(endOfMonth(new Date()), "yyyy-MM-dd")
        );


        setOpen(false);
    }

    function clearFilter() {
        onChange(null, null);
        setOpen(false);
    }

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="border rounded px-4 py-2 bg-white"
            >
                {startDate && endDate
                    ? `Intervalo: ${startDate} → ${endDate}`
                    : "Filtro por período de tempo"}
            </button>

            {open && (
                <div className="absolute z-50 bg-white border rounded-lg shadow-lg p-4 mt-2 w-fit">
                    <div className="flex gap-2 mb-4 flex-wrap">
                        <div className="flex w-full justify-between">

                            <button type="button"
                                onClick={setToday}
                                className={`
                            px-3 py-1.5 rounded-full border text-sm transition
                            ${isToday
                                        ? "bg-green-600 text-white border-green-600"
                                        : "hover:bg-gray-100"
                                    }
                                `}
                            >
                                Hoje
                            </button>

                            <button type="button"
                                onClick={setLast7Days}
                                className={`
                            px-3 py-1.5 rounded-full border text-sm transition
                            ${isLast7Days
                                        ? "bg-green-600 text-white border-green-600"
                                        : "hover:bg-gray-100"
                                    }
                                `}
                            >
                                Últimos 7 dias
                            </button>

                            <button type="button"
                                onClick={setCurrentMonth}
                                className={`
                             px-3 py-1.5 rounded-full border text-sm transition
                            ${isCurrentMonth
                                        ? "bg-green-600 text-white border-green-600"
                                        : "hover:bg-gray-100"
                                    }
                                `}
                            >
                                Mês atual
                            </button>
                        </div>
                        <div className="flex justify-between w-full">
                            <button type="button"
                                onClick={clearFilter}
                                className={`px-3 py-1 rounded  text-black 
                                    ${isNoFilter
                                        ?"text-white bg-white"
                                        : "bg-red-500 border-red-800 text-white"
                                    }`}
                            >
                                Limpar
                            </button>
                            <button type="button"
                                className={`
                             px-3 py-1.5 rounded-full border text-sm transition
                            ${isCustom
                                        ? "bg-green-600 text-white border-green-600"
                                        : "hover:bg-gray-100"
                                    }
                                `}
                                onClick={() => {
                                    if (!selectedRange?.from || !selectedRange?.to)
                                        return;

                                    onChange(
                                        format(selectedRange.from, "yyyy-MM-dd"),
                                        format(selectedRange.to, "yyyy-MM-dd")
                                    );
                                    setOpen(false);
                                }}
                            >
                                Aplicar busca
                            </button>
                        </div>
                    </div>

                    <DayPicker
                        mode="range"
                        selected={selectedRange}
                        onSelect={setSelectedRange}
                        locale={ptBR}
                        classNames={{
                            today: "bg-blue-100 text-blue-700 font-bold",
                            selected: "bg-green-600 text-white",
                            range_middle: "bg-green-100",
                            range_start: "bg-green-600 text-white",
                            range_end: "bg-green-600 text-white"
                        }}
                    />
                </div>
            )}
        </div>
    );
}