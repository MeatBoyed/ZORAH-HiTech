"use client"
import Link from "next/link"
import { workflows, getWorkflowIndex } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useMemo } from "react"

function getStatusColor(status: string) {
    switch (status) {
        case "Success":
            return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
        case "Partial":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
        case "Failed":
            return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
    }
}

export default function WorkflowsPage() {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const filteredWorkflows = useMemo(() => {
        if (!startDate && !endDate) return workflows

        return workflows.filter((workflow) => {
            const workflowDate = new Date(workflow.date)
            const start = startDate ? new Date(startDate) : null
            const end = endDate ? new Date(endDate) : null

            if (start && end) {
                return workflowDate >= start && workflowDate <= end
            } else if (start) {
                return workflowDate >= start
            } else if (end) {
                return workflowDate <= end
            }
            return true
        })
    }, [startDate, endDate])

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-foreground">All Workflows</h1>
                <p className="text-muted-foreground mt-1 text-sm">Complete history of workflow executions</p>
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
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
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
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="text-sm"
                            />
                        </div>
                    </div>
                    {(startDate || endDate) && (
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
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Workflow History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Workflow</TableHead>
                                    <TableHead className="text-xs">Date</TableHead>
                                    <TableHead className="text-xs">Manager</TableHead>
                                    <TableHead className="text-xs">Status</TableHead>
                                    <TableHead className="text-xs">Call Count</TableHead>
                                    <TableHead className="text-xs">Total Cost</TableHead>
                                    <TableHead className="text-xs">Summary</TableHead>
                                    <TableHead className="text-xs">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredWorkflows.map((workflow) => {
                                    const workflowIndex = getWorkflowIndex(workflow.id)
                                    return (
                                        <TableRow key={workflow.id}>
                                            <TableCell className="font-medium text-sm">#{workflowIndex}</TableCell>
                                            <TableCell className="text-sm">{new Date(workflow.date).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-sm">{workflow.manager}</TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusColor(workflow.status)} text-xs`}>{workflow.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">{workflow.callIds.length}</TableCell>
                                            <TableCell className="text-sm">${workflow.totalCost.toFixed(2)}</TableCell>
                                            <TableCell className="max-w-xs truncate text-sm">{workflow.summary}</TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/workflows/${workflow.id}`}
                                                    className="text-foreground hover:text-muted-foreground font-medium text-sm"
                                                >
                                                    View Details
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
