import Link from "next/link"
import { FilterDefinition, ColumnDefinition } from "../ui/custom-table"
import { Call } from "@/convex/types"
import { Badge } from "../ui/badge"
import { getStatusColor } from "@/lib/utils"


export const CallFilters: FilterDefinition[] = [
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

export const CallColumns: ColumnDefinition<Call>[] = [
    {
        id: "time",
        header: "Time",
        accessor: (call: Call) => call.timestamp,
    },
    {
        id: "manager",
        header: "Manager",
        // accessor: (call: CallType) => formatDate(call.call_date),
        accessor: (call: Call) => call.manager_name,
    },
    {
        id: "calledAbout",
        header: "Subject",
        accessor: (call: Call) => call.called_about,
    },
    {
        id: "status",
        header: "Status",
        accessor: (call: Call) => <Badge className={`${getStatusColor(call.status)} text-xs`}>{call.status}</Badge>
    },
    {
        id: "duration",
        header: "Duration",
        accessor: (call: Call) => call.duration,
    },
    {
        id: "cost",
        header: "Cost",
        accessor: (call: Call) => call.cost,
    },
    {
        id: "actions",
        header: "",
        accessor: (call: Call) => (
            <>
                <Link
                    href={
                        `/calls/${call._id}`
                    }
                >
                    View
                </Link>
            </>
        ),
    },
]