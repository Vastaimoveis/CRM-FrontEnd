import { useFollowUp } from "@/app/providers/FollowUpProvider";

export default function HomeFollowToday() {

    const { todayCount } = useFollowUp();

    return (
        <section className="
            flex items-center w-50 justify-between gap-4
            rounded-xl border border-slate-200
            bg-blue-200 
        ">

            <div className="flex items-center gap-4 p-5">

                

                <div className="min-w-0">

                    <strong className="block text-3xl font-bold text-slate-950">
                        {todayCount}
                    </strong>

                    <p className="font-bold text-black">
                        Follows-up de Hoje
                    </p>


                    <p className="mt-1 text-sm text-slate-950 font-semibold">
                        Atendimentos de hoje
                    </p>


                </div>


            </div>

           

        </section>
    );
}