// "use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ReportsTable from "@/components/reports/report-table"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

export const dynamic = "force-dynamic"

// List page for Reports (Shows all available reports)
export default async function Reports() {
    // const reports = useQuery(api.entities.reports.list, {});
    const reports = await fetchQuery(api.entities.reports.list, {});
    console.log("Fetched Reports: ", reports)

    if (!reports || reports.length === 0) {
        return (
            <div className="text-center text-muted-foreground">
                No reports available.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Department Reports</h1>
                <p className="text-muted-foreground mt-1 text-sm">Complete history of your reports</p>
            </div>

            {/* Date Filtering */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Filter by Date Range</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start-date" className="text-sm font-medium">
                                Start Date
                            </Label>
                            <Input
                                id="start-date"
                                type="date"
                                // value={startDate}
                                // onChange={(e) => setStartDate(e.target.value)}
                                className="text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-date" className="text-sm font-medium">
                                End Date
                            </Label>
                            <Input
                                id="end-date"
                                type="date"
                                // value={endDate}
                                // onChange={(e) => setEndDate(e.target.value)}
                                className="text-sm"
                            />
                        </div>
                    </div>
                    {/* {(startDate || endDate) && (
                        <div className="mt-3 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {filteredWorkflows.length} of {workflows.length} workflows
                            </p>
                            <button
                                onClick={() => {
                                    setStartDate("")
                                    setEndDate("")
                                }}
                                className="text-sm text-foreground hover:text-muted-foreground underline underline-offset-2"
                            >
                                Clear filters
                            </button>
                        </div>
                    )} */}
                </CardContent>
            </Card>

            <ReportsTable reports={reports?.map(r => ({
                ...r,
                jobs_today: Number.parseInt(r.jobs_today.toString()),
                ncrs: Number.parseInt(r.ncrs.toString()),
                total_cost: Number.parseFloat(r.total_cost.toString()),
                total_duration: Number.parseFloat(r.total_duration.toString()),
            }))} />
        </div>
    )
}
