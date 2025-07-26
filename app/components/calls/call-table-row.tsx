"use client"

import { getStatusColor } from "@/lib/utils"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible"
import { LoaderCircleIcon, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { TableRow, TableCell } from "../ui/table"
import { InputCall } from "@/convex/types"
import { Badge } from "../ui/badge"

// export function CallRow({ call_id }: { call_id: string }) {
export function CallRow({ call }: { call?: InputCall }) {
    const [isOpen, setIsOpen] = useState(false)

    // const { summary } = callTranscriptionSummary
    // const summary = getSummaryByCallId(call.id)
    // const transcription = getTranscriptionByCallId(call.id)

    return (
        <>
            {!call ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                        <LoaderCircleIcon className="animate-spin" size={20} />
                    </TableCell>
                </TableRow>
            ) : (
                <>
                    <TableRow>
                        <TableCell>
                            <div className="flex items-center space-x-2">
                                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                                    <CollapsibleTrigger className="flex items-center space-x-2 hover:text-muted-foreground">
                                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        <span className="text-sm">{new Date(call?.timestamp || "").toLocaleTimeString()}</span>
                                    </CollapsibleTrigger>
                                </Collapsible>
                                {call?.transcription && (
                                    <Link
                                        href={`/transcriptions/${call?.transcription?._id}`}
                                        className="text-xs text-foreground hover:text-muted-foreground underline underline-offset-2"
                                    >
                                        View Transcript
                                    </Link>
                                )}
                            </div>
                        </TableCell>
                        <TableCell className="text-sm">{call?.manager_name}</TableCell>
                        <TableCell className="text-sm max-w-xs truncate">{call?.called_about}</TableCell>
                        <TableCell>
                            <Badge className={`${getStatusColor(call?.status || "")} text-xs`}>{call?.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{call?.duration} min</TableCell>
                        <TableCell className="text-sm">${call?.cost.toFixed(2)}</TableCell>
                    </TableRow>
                    {isOpen && (
                        <TableRow>
                            <TableCell colSpan={6} className="bg-muted/50">
                                <Collapsible open={isOpen}>
                                    <CollapsibleContent>
                                        <div className="space-y-3 p-3 whitespace-normal">
                                            {call?.summary && (
                                                <div>
                                                    <h4 className="font-semibold text-foreground mb-2 text-sm">Summary</h4>
                                                    <p className="text-muted-foreground text-sm">{call?.summary?.summary_text}</p>
                                                </div>
                                            )}
                                            {call?.transcription && (
                                                <div>
                                                    <h4 className="font-semibold text-foreground mb-2 text-sm">Full Transcription</h4>
                                                    {/* Limit to 150 characters */}
                                                    <p className="text-muted-foreground text-sm leading-relaxed">{call?.transcription?.full_text.slice(0, 700)}{call?.transcription?.full_text.length > 150 ? "..." : ""}</p>
                                                    <Link
                                                        href={`/transcriptions/${call?.transcription?._id}`}
                                                        className="mt-3 text-xs text-foreground hover:text-muted-foreground underline underline-offset-2"
                                                    >
                                                        View Full Transcript
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </TableCell>
                        </TableRow>
                    )}
                </>
            )}
        </>
    )
}