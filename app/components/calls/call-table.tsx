"use server"

import { TableRow, TableBody, TableHead, TableHeader, Table } from "../ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { CallRow } from "./call-table-row";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { InputCall } from "@/convex/types";

export default async function CallsTable({ callIds }: { callIds?: string[] }) {
    const calls: InputCall[] = await Promise.all(
        (callIds ?? []).map((callId) => {
            return fetchQuery(api.entities.calls.show, { call_id: callId as Id<"calls"> })
        })
    )
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
                            {calls?.map((call, index) => (
                                <CallRow key={index} call={call} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
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
