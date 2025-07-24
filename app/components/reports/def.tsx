import Link from "next/link"
import { FilterDefinition, ColumnDefinition } from "../ui/custom-table"
import { ReportType } from "@/convex/types"
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { getStatusColor } from "@/lib/utils";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const formatDate = (date: string | Date) => {
    try {
        return format(new Date(date), "MMM d, yyyy")
    } catch {
        return "Invalid date"
    }
}
export const ReportFilters: FilterDefinition[] = [
    // {
    //     id: "status",
    //     type: "select",
    //     options: [
    //         { value: "Online", label: "Online" },
    //         { value: "Offline", label: "Offline" }
    //     ],
    //     placeholder: "Filter by status"
    // }
    // {
    //   id: "category",
    //   type: "select",
    //   // options: categories.map((category) => ({
    //   //   value: category,
    //   //   label: category,
    //   // })),
    //   // options: categories?.map((category) => ({ value: category, label: category })),
    //   options: categories
    //     ?.filter((category): category is string => category !== undefined) // Ensure category is a string
    //     .map((category) => ({ value: category, label: category })),
    //   placeholder: "Filter by Category",
    // },
]

export const ReportColumns: ColumnDefinition<ReportType>[] = [
    {
        id: "department",
        header: "Department",
        accessor: (report: ReportType) => report.department_name,
    },
    {
        id: "date",
        header: "Date",
        accessor: (report: ReportType) => formatDate(report.report_date),
    },
    {
        id: "jobs",
        header: "Jobs",
        accessor: (report: ReportType) => report.jobs_today,
    },
    {
        id: "ncrs",
        header: "Ncrs",
        accessor: (report: ReportType) => report.ncrs,
    },
    {
        id: "stockIssues",
        header: "Stock Issues",
        accessor: (report: ReportType) => report.stock_issues,
    },
    {
        id: "delays",
        header: "Delays",
        accessor: (report: ReportType) => report.delays,
    },
    {
        id: "supervisorNotes",
        header: "Supervisor Notes",
        hidden: true,
        accessor: (report: ReportType) => report.supervisor_notes,
    },
    {
        id: "managerSummary",
        header: "Manager Summary",
        hidden: "md",
        accessor: (report: ReportType) => report.manager_summary,
    }, {
        id: "status",
        header: "Status",
        accessor: (report: ReportType) => <Badge className={`${getStatusColor(report.status)} text-xs`}>{report.status}</Badge>
    }, {
        id: "pdf",
        header: "Pdf",
        accessor: (report: ReportType) => <Link href={report.pdf_link} target="_blank" className="text-blue-600 hover:underline">View PDF</Link>,
    }, {
        id: "manager",
        header: "Manager",
        accessor: (report: ReportType) => report.manager,
    }, {
        id: "totalCost",
        header: "Total Cost",
        hidden: true,
        accessor: (report: ReportType) => report.total_cost,
    }, {
        id: "totalDuration",
        header: "Total Duration",
        hidden: true,
        accessor: (report: ReportType) => report.total_duration,
    },
    {
        id: "actions",
        header: "",
        accessor: (report: ReportType) => (
            <>
                <Link
                    href={
                        APP_URL + `/reports/${report._id}`
                    }
                >
                    View
                </Link>
            </>
        ),
    },
]