import { workflows, Workflow } from "@/lib/data";
import { Table } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

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