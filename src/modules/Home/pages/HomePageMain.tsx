import HomeStats from "../Components/HomeStats/HomeStats";


export default function HomeMainPage() {

    return (

        <main
            className="
                min-h-screen w-full
                bg-slate-50
                p-4 text-slate-900
                sm:p-5 lg:p-8
            "
        >

            <div className="mx-auto flex max-w-[1600px] flex-col gap-5">

                {/* CABEÇALHO */}

                <HomeHeader />

                {/* ALERTAS */}

                <HomeAlert />

                {/* INDICADORES PRINCIPAIS */}

                <HomeStats />

                {/* ACOMPANHAMENTO */}

                <section
                    className="
                        grid grid-cols-1
                        items-start gap-5
                        xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
                    "
                >

                    <HomeFollowBoard />

                    <div className="flex min-w-0 flex-col gap-5">

                        <HomePerformance />

                        <HomeFunnel />

                    </div>

                </section>

                {/* INFORMAÇÕES COMPLEMENTARES */}

                <section
                    className="
                        grid grid-cols-1
                        items-start gap-5
                        md:grid-cols-2
                        2xl:grid-cols-3
                    "
                >

                    <HomeOpportunities />

                    <HomeActivities />

                    <HomeAgenda />

                </section>

            </div>

        </main>

    );
}