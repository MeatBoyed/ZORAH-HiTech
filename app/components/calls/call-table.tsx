
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getStatusColor } from "@/lib/utils";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronRight, } from "lucide-react";
import { useState } from "react";
import { TableRow, TableCell, TableBody, TableHead, TableHeader, Table } from "../ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export default function CallsTable({ callIds }: { callIds?: string[] }) {
    return (
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
                            {callIds?.map((call: string) => (
                                <CallRow key={call} call_id={call} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export function CallRow({ call_id }: { call_id: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const call = useQuery(api.entities.calls.show, { call_id: call_id as Id<"calls"> })

    // const { summary } = callTranscriptionSummary
    // const summary = getSummaryByCallId(call.id)
    // const transcription = getTranscriptionByCallId(call.id)

    return (
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
                                href={`/transcriptions/${call?.status}`}
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
                                            <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">{call?.transcription?.full_text}</p>
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

// export default function CallsTable({ calls }: { calls?: Call[] }) {
//     if (!calls) {
//         return (
//             <div className="text-center text-muted-foreground">
//                 No calls available.
//             </div>
//         )
//     }

//     // get all unique categories of services
//     // const categories = Array.from(
//     //     new Set(reports.map((report) => report.department_name))
//     // )

//     return (
//         <PaginatedTable
//             data={calls}
//             columns={CallColumns}
//             filters={CallFilters}
//             pageSizeOptions={[5, 10, 20, 50]}
//             defaultPageSize={20}
//             searchable={false}
//         />
//     )
// }
