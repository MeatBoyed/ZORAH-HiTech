"use client"
import ReportsTable from "@/components/reports/report-table"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import CallsTable from "@/components/calls/call-table";

export default function CallsListPage() {
    const calls = useQuery(api.entities.calls.listIds, {});

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-foreground">All Workflows</h1>
                <p className="text-muted-foreground mt-1 text-sm">Complete history of workflow executions</p>
            </div>

            {/* <ReportsTable reports={reports?.map(r => ({
                ...r,
                jobs_today: Number.parseInt(r.jobs_today.toString()),
                ncrs: Number.parseInt(r.ncrs.toString()),
                total_cost: Number.parseFloat(r.total_cost.toString()),
                total_duration: Number.parseFloat(r.total_duration.toString()),
                report_date: new Date(r.report_date).toLocaleDateString(),
            }))} /> */}

            {/* <CallsTable calls={calls?.map(c => ({
                report_id: c.report_id?.toString() ?? "",
                called_about: c.called_about ?? "",
                manager_name: c.manager_name ?? "",
                status: c.status ?? "",
                duration: Number.parseFloat(c.duration?.toString?.() ?? "0"),
                cost: Number.parseFloat(c.cost?.toString?.() ?? "0"),
                timestamp: new Date(c._creationTime).toLocaleString(),
                _id: c._id?.toString?.(),
            }))} /> */}
            <CallsTable callIds={calls} />
        </div>
    )
}
