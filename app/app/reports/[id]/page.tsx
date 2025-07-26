// "use client"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
// import { useQuery } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"
import { getStatusColor } from "@/lib/utils"
import CallsTable from "@/components/calls/call-table"
import { fetchQuery } from "convex/nextjs"

// Show/Details page for a Report
// Shows Table of Calls & dropdown to view breif summaries
export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // const params = useParams<{ id: string }>()
    const reportId = (await params).id
    console.log("Params:", reportId)
    if (!reportId) {
        notFound()
    }
    console.log("Params Report ID:", reportId)

    // const report = useQuery(api.entities.reports.show, { reportId: reportId as Id<"reports"> });
    const report = await fetchQuery(api.entities.reports.show, { reportId: reportId as Id<"reports"> });
    console.log("Fetched report: ", report)
    // if (!report) {
    //     notFound()
    // }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Report #{report?.report?._id}</h1>
                    <div className="flex items-center space-x-4 mt-1">
                        <p className="text-muted-foreground text-sm">{new Date(report?.report?.report_date || "").toLocaleDateString()}</p>
                        <Badge className={`${getStatusColor(report?.report?.status || "")} text-xs`}>{report?.report?.status}</Badge>
                        <Badge className={`text-xs`}>{report?.report?.department_name}</Badge>
                    </div>
                </div>
                <Card className="w-fit py-2">
                    <CardContent className="p-3">
                        <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                        <p className="text-xl font-bold text-foreground">${report?.report?.total_cost.toFixed(2)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Workflow Summary */}
            <Card className="border-2 border-primary">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Manager Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-sm">{report?.report?.manager_summary}</p>
                </CardContent>
            </Card>

            {/* Calls Table */}
            <CallsTable callIds={report?.calls} />
        </div>
    )
}
