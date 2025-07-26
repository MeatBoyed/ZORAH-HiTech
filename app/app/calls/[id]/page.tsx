import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { getStatusColor } from "@/lib/utils"
import { fetchQuery } from "convex/nextjs"

export const dynamic = "force-dynamic"
export default async function CallDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // const params = useParams<{ id: string }>()
    const reportId = (await params).id
    if (!reportId) {
        notFound()
    }
    console.log("Params Report ID:", reportId)

    const report = await fetchQuery(api.entities.reports.show, { reportId: reportId as Id<"reports"> });
    console.log("Fetched report: ", report)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Workflow #{report?.report?._id}</h1>
                    <div className="flex items-center space-x-4 mt-1">
                        <p className="text-muted-foreground text-sm">{new Date(report?.report?.report_date || "").toLocaleDateString()}</p>
                        <Badge className={`${getStatusColor(report?.report?.status || "")} text-xs`}>{report?.report?.status}</Badge>
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
        </div>
    )
}
