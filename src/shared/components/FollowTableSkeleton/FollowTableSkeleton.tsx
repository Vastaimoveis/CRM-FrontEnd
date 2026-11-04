export default function FollowTableSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                    <td className="px-4 py-5">
                        <div className="h-4 w-32 rounded bg-slate-200" />
                    </td>

                    <td className="px-4 py-5">
                        <div className="h-4 w-24 rounded bg-slate-200" />
                    </td>

                    <td className="px-4 py-5">
                        <div className="h-6 w-20 rounded-full bg-slate-200" />
                    </td>

                    <td className="px-4 py-5">
                        <div className="h-4 w-28 rounded bg-slate-200" />
                    </td>

                    <td className="px-4 py-5">
                        <div className="h-8 w-24 rounded bg-slate-200" />
                    </td>
                </tr>
            ))}
        </>
    );
}