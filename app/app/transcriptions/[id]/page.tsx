import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { fetchQuery } from "convex/nextjs"

export default async function TranscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // const params = useParams<{ id: string }>()
    const transcriptionId = (await params).id
    if (!transcriptionId) {
        notFound()
    }

    // Query Data
    const transcription = await fetchQuery(api.entities.transcriptions.show, { transcriptionId: transcriptionId as Id<"transcriptions"> });

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <Link href="/transcriptions">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Transcriptions
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Transcription Details</h1>
                    <p className="text-muted-foreground mt-1 text-sm">{new Date(transcription?.transcription?.timestamp || "").toLocaleString()}</p>
                </div>
            </div>

            {transcription?.call && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Call Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Manager</p>
                                <p className="text-foreground text-sm">{transcription?.call?.manager_name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                                <p className="text-foreground text-sm">{transcription?.call?.called_about}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                                <p className="text-foreground text-sm">{transcription?.call.duration} minutes</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Workflow</p>
                                <Link
                                    href={`/report/${transcription?.call.report_id}`}
                                    className="text-foreground hover:text-muted-foreground font-medium text-sm underline underline-offset-2"
                                >
                                    Report #{transcription?.call?.report_id}
                                </Link>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Date</p>
                                <p className="text-foreground text-sm">{new Date(transcription?.call.timestamp || "").toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Cost</p>
                                <p className="text-foreground text-sm">${transcription?.call?.cost.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Full Transcription</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose max-w-none">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
                            {transcription?.transcription?.full_text || "No transcription available."}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
