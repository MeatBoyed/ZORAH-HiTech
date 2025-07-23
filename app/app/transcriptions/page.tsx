import Link from "next/link"
import { transcriptions, getCallById, getWorkflowById, getWorkflowIndex } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TranscriptionsPage() {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Transcriptions</h1>
                <p className="text-muted-foreground mt-1 text-sm">All call transcriptions from AI workflow executions</p>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">All Transcriptions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Timestamp</TableHead>
                                    <TableHead className="text-xs">Call ID</TableHead>
                                    <TableHead className="text-xs">Workflow</TableHead>
                                    <TableHead className="text-xs">Date</TableHead>
                                    <TableHead className="text-xs">Preview</TableHead>
                                    <TableHead className="text-xs">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transcriptions.map((transcription) => {
                                    const call = getCallById(transcription.callId)
                                    const workflow = call ? getWorkflowById(call.workflowId) : null
                                    const workflowIndex = workflow ? getWorkflowIndex(workflow.id) : null

                                    return (
                                        <TableRow key={transcription.id}>
                                            <TableCell className="font-medium text-sm">
                                                {new Date(transcription.timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-sm">{transcription.callId}</TableCell>
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
                                                <p className="truncate text-muted-foreground text-sm">
                                                    {transcription.fullText.substring(0, 80)}...
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/transcriptions/${transcription.id}`}
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
