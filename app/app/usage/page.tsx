import { usage } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsagePage() {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Usage Analytics</h1>
                <p className="text-muted-foreground mt-1 text-sm">Monthly usage breakdown and cost analysis</p>
            </div>

            {/* Current Month Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-primary">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Total Minutes - {usage.billingMonth}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-foreground">{usage.totalUsage}</p>
                        <p className="text-muted-foreground mt-1 text-sm">minutes of AI calls</p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-primary">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Total Cost - {usage.billingMonth}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-foreground">${usage.totalCost.toFixed(2)}</p>
                        <p className="text-muted-foreground mt-1 text-sm">total billing amount</p>
                    </CardContent>
                </Card>
            </div>

            {/* Usage Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Call Duration</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-xl font-bold text-foreground">
                            {(usage.totalUsage / usage.workflowBreakdown.reduce((acc, w) => acc + w.callCount, 0)).toFixed(1)} min
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Cost per Minute</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-xl font-bold text-foreground">${(usage.totalCost / usage.totalUsage).toFixed(2)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Workflows</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-xl font-bold text-foreground">{usage.workflowBreakdown.length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Workflow Breakdown */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Workflow Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Date</TableHead>
                                    <TableHead className="text-xs">Manager</TableHead>
                                    <TableHead className="text-xs">Number of Calls</TableHead>
                                    <TableHead className="text-xs">Duration (min)</TableHead>
                                    <TableHead className="text-xs">Cost</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {usage.workflowBreakdown.map((workflow) => (
                                    <TableRow key={workflow.workflowId}>
                                        <TableCell className="font-medium text-sm">
                                            {new Date(workflow.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-sm">{workflow.manager}</TableCell>
                                        <TableCell className="text-sm">{workflow.callCount}</TableCell>
                                        <TableCell className="text-sm">{workflow.duration}</TableCell>
                                        <TableCell className="text-sm">${workflow.cost.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
