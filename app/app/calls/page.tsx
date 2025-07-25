"use client"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import CallsTable from "@/components/calls/call-table";

export default function CallsListPage() {
    const calls = useQuery(api.entities.calls.listIds, {});

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
