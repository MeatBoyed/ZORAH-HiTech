import { api } from "@/convex/_generated/api"
import CallsTable from "@/components/calls/call-table";
import { fetchQuery } from "convex/nextjs";

export const dynamic = "force-dynamic"
export default async function CallsListPage() {
    const calls = await fetchQuery(api.entities.calls.listIds, {});

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-foreground">All Calls</h1>
                <p className="text-muted-foreground mt-1 text-sm">Complete history of call logs</p>
            </div>

            <CallsTable callIds={calls} />
        </div>
    )
}
