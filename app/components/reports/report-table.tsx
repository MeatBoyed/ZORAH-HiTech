
import { PaginatedTable } from "../ui/custom-table";
import z from "zod";
import { ReportColumns, ReportFilters } from "./def";
import { ReportType } from "@/convex/types"

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

export default function ReportsTable({ reports }: { reports?: ReportType[] }) {
    if (!reports) {
        return (
            <div className="text-center text-muted-foreground">
                No reports available.
            </div>
        )
    }

    // get all unique categories of services
    const categories = Array.from(
        new Set(reports.map((report) => report.department_name))
    )

    return (
        <PaginatedTable
            data={reports}
            columns={ReportColumns}
            filters={ReportFilters}
            pageSizeOptions={[5, 10, 20, 50]}
            defaultPageSize={20}
            searchable={false}
        />
    )
}
