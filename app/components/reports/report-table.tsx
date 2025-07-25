
import { PaginatedTable } from "../ui/custom-table";
import { ReportColumns, ReportFilters } from "./def";
import { ReportType } from "@/convex/types"

export default function ReportsTable({ reports }: { reports?: ReportType[] }) {
    if (!reports) {
        return (
            <div className="text-center text-muted-foreground">
                No reports available.
            </div>
        )
    }

    // get all unique categories of services
    // const categories = Array.from(
    //     new Set(reports.map((report) => report.department_name))
    // )

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
