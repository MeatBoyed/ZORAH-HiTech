import { notFound } from "next/navigation"
import Link from "next/link"
import { summaries, getCallById, getWorkflowById, getWorkflowIndex } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SummaryDetailPage({ params }: { params: { id: string } }) {
    const summary = summaries.find((s) => s.id === params.id)

    if (!summary) {
        notFound()
    }

    const call = getCallById(summary.callId)
    const workflow = call ? getWorkflowById(call.workflowId) : null
    const workflowIndex = workflow ? getWorkflowIndex(workflow.id) : null

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <Link href="/summaries">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Summaries
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Summary Details</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Call ID: {summary.callId}</p>
                </div>
            </div>

            {call && workflow && workflowIndex && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Call Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Manager</p>
                                <p className="text-foreground text-sm">{call.managerName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                                <p className="text-foreground text-sm">{call.calledAbout}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                                <p className="text-foreground text-sm">{call.duration} minutes</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Workflow</p>
                                <Link
                                    href={`/workflows/${workflow.id}`}
                                    className="text-foreground hover:text-muted-foreground font-medium text-sm underline underline-offset-2"
                                >
                                    Workflow #{workflowIndex}
                                </Link>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Date</p>
                                <p className="text-foreground text-sm">{new Date(workflow.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Cost</p>
                                <p className="text-foreground text-sm">${call.cost.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">AI-Generated Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-sm">{summary.summaryText}</p>
                </CardContent>
            </Card>
        </div>
    )
}
