import { workflows, Workflow } from "@/lib/data";
import { Table } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { getStatusColor } from "@/lib/utils";


export default function ListReports() {
    const reports = useQuery(api.entities.reports.list, {});
    console.log("Reports:", reports);


    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Department</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs">Date</TableHead>
                                <TableHead className="text-xs">Manager</TableHead>
                                <TableHead className="text-xs">Status</TableHead>
                                <TableHead className="text-xs">Call Count</TableHead>
                                <TableHead className="text-xs">Total Cost</TableHead>
                                <TableHead className="text-xs">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workflows.map((workflow: Workflow) => (
                                <TableRow key={workflow.id}>
                                    <TableCell className="font-medium text-sm">
                                        {new Date(workflow.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-sm">{workflow.manager}</TableCell>
                                    <TableCell>
                                        <Badge className={`${getStatusColor(workflow.status)} text-xs`}>{workflow.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{workflow.callIds.length}</TableCell>
                                    <TableCell className="text-sm">${workflow.totalCost.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/workflows/${workflow.id}`}
                                            className="text-foreground hover:text-muted-foreground font-medium text-sm"
                                        >
                                            View Details
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}