import Link from "next/link"
import { summaries, getCallById, getWorkflowById, getWorkflowIndex } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SummariesPage() {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Summaries</h1>
                <p className="text-muted-foreground mt-1 text-sm">AI-generated summaries of all call interactions</p>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">All Summaries</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Call ID</TableHead>
                                    <TableHead className="text-xs">Workflow</TableHead>
                                    <TableHead className="text-xs">Date</TableHead>
                                    <TableHead className="text-xs">Summary Preview</TableHead>
                                    <TableHead className="text-xs">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summaries.map((summary) => {
                                    const call = getCallById(summary.callId)
                                    const workflow = call ? getWorkflowById(call.workflowId) : null
                                    const workflowIndex = workflow ? getWorkflowIndex(workflow.id) : null

                                    return (
                                        <TableRow key={summary.id}>
                                            <TableCell className="font-medium text-sm">{summary.callId}</TableCell>
                                            <TableCell>
                                                {workflow && workflowIndex && (
                                                    <Link
                                                        href={`/workflows/${workflow.id}`}
                                                        className="text-foreground hover:text-muted-foreground font-medium text-sm"
                                                    >
                                                        Workflow #{workflowIndex}
                                                    </Link>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {workflow && new Date(workflow.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <p className="text-muted-foreground text-sm">
                                                    {summary.summaryText.length > 80
                                                        ? `${summary.summaryText.substring(0, 80)}...`
                                                        : summary.summaryText}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/summaries/${summary.id}`}
                                                    className="text-foreground hover:text-muted-foreground font-medium text-sm"
                                                >
                                                    View Full
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
