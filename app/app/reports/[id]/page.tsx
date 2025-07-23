"use client"
import { notFound } from "next/navigation"
import {
    getWorkflowById,
    getCallsByWorkflowId,
    getSummaryByCallId,
    getTranscriptionByCallId,
    getWorkflowIndex,
} from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

function getStatusColor(status: string) {
    switch (status) {
        case "Success":
            return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
        case "Partial":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
        case "Failed":
            return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
        case "Completed":
            return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
    }
}

function CallRow({ call }: { call: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const summary = getSummaryByCallId(call.id)
    const transcription = getTranscriptionByCallId(call.id)

    return (
        <>
            <TableRow>
                <TableCell>
                    <div className="flex items-center space-x-2">
                        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                            <CollapsibleTrigger className="flex items-center space-x-2 hover:text-muted-foreground">
                                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                <span className="text-sm">{new Date(call.timestamp).toLocaleTimeString()}</span>
                            </CollapsibleTrigger>
                        </Collapsible>
                        {transcription && (
                            <Link
                                href={`/transcriptions/${transcription.id}`}
                                className="text-xs text-foreground hover:text-muted-foreground underline underline-offset-2"
                            >
                                View Transcript
                            </Link>
                        )}
                    </div>
                </TableCell>
                <TableCell className="text-sm">{call.managerName}</TableCell>
                <TableCell className="text-sm max-w-xs truncate">{call.calledAbout}</TableCell>
                <TableCell>
                    <Badge className={`${getStatusColor(call.status)} text-xs`}>{call.status}</Badge>
                </TableCell>
                <TableCell className="text-sm">{call.duration} min</TableCell>
                <TableCell className="text-sm">${call.cost.toFixed(2)}</TableCell>
            </TableRow>
            {isOpen && (
                <TableRow>
                    <TableCell colSpan={6} className="bg-muted/50">
                        <Collapsible open={isOpen}>
                            <CollapsibleContent>
                                <div className="space-y-3 p-3">
                                    {summary && (
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-2 text-sm">Summary</h4>
                                            <p className="text-muted-foreground text-sm">{summary.summaryText}</p>
                                        </div>
                                    )}
                                    {transcription && (
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-2 text-sm">Full Transcription</h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">{transcription.fullText}</p>
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
    const workflow = getWorkflowById(params.id)

    if (!workflow) {
        notFound()
    }

    const calls = getCallsByWorkflowId(workflow.id)
    const workflowIndex = getWorkflowIndex(workflow.id)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Workflow #{workflowIndex}</h1>
                    <div className="flex items-center space-x-4 mt-1">
                        <p className="text-muted-foreground text-sm">{new Date(workflow.date).toLocaleDateString()}</p>
                        <Badge className={`${getStatusColor(workflow.status)} text-xs`}>{workflow.status}</Badge>
                    </div>
                </div>
                <Card className="w-fit">
                    <CardContent className="p-3">
                        <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                        <p className="text-xl font-bold text-foreground">${workflow.totalCost.toFixed(2)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Workflow Summary */}
            <Card className="border-2 border-primary">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Workflow Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-sm">{workflow.summary}</p>
                </CardContent>
            </Card>

            {/* Calls Table */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Related Calls</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Time / Transcript</TableHead>
                                    <TableHead className="text-xs">Manager Called</TableHead>
                                    <TableHead className="text-xs">Subject</TableHead>
                                    <TableHead className="text-xs">Status</TableHead>
                                    <TableHead className="text-xs">Duration</TableHead>
                                    <TableHead className="text-xs">Cost</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {calls.map((call) => (
                                    <CallRow key={call.id} call={call} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
