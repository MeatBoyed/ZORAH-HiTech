"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export type ColumnDefinition<T> = {
    id: string
    header: string
    accessor: (item: T) => React.ReactNode
    className?: string
    hidden?: boolean | 'sm' | 'md' | 'lg' | 'xl'
}

export type FilterDefinition = {
    id: string
    type: 'select' | 'text'
    options?: { value: string; label: string }[]
    placeholder?: string
}

type PaginatedTableProps<T> = {
    data: T[]
    columns: ColumnDefinition<T>[]
    filters?: FilterDefinition[]
    pageSizeOptions?: number[]
    defaultPageSize?: number
    searchable?: boolean
    className?: string
}

export function PaginatedTable<T>({
    data,
    columns,
    filters = [],
    pageSizeOptions = [5, 10, 20, 50],
    defaultPageSize = 20,
    searchable = true,
    className = ''
}: PaginatedTableProps<T>) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Get state from URL params
    const currentPage = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || defaultPageSize.toString())
    const searchQuery = searchParams.get('search') || ''

    // Get filter values from URL
    const filterValues = filters.reduce((acc, filter) => {
        acc[filter.id] = searchParams.get(filter.id) || 'all'
        return acc
    }, {} as Record<string, string>)

    // Update URL params
    const updateParams = (newParams: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(newParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        })

        router.push(`${pathname}?${params.toString()}`)
    }

    // Filter data based on search and filters
    const filteredData = data.filter((item) => {
        // Apply search
        if (searchQuery) {
            const matches = columns.some(column => {
                const value = column.accessor(item)
                return String(value).toLowerCase().includes(searchQuery.toLowerCase())
            })
            if (!matches) return false
        }

        // Apply filters
        for (const filter of filters) {
            const filterValue = filterValues[filter.id]
            if (filterValue && filterValue !== 'all') {
                // This is a simplified filter - you might need custom filtering logic per filter
                const value = String((item as Record<string, unknown>)[filter.id]).toLowerCase()
                if (value !== filterValue.toLowerCase()) {
                    return false
                }
            }
        }

        return true
    })

    // Pagination
    const totalPages = Math.ceil(filteredData.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)

    // Handle page changes
    const goToPage = (page: number) => {
        updateParams({ page: Math.max(1, Math.min(page, totalPages)).toString() })
    }

    return (
        <div className={`space-y-4 w-full ${className}`}>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {searchable && (
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => updateParams({
                                search: e.target.value,
                                page: '1' // Reset to first page on search
                            })}
                        />
                    </div>
                )}

                {filters.map((filter) => (
                    <Select
                        key={filter.id}
                        value={filterValues[filter.id]}
                        onValueChange={(value) => updateParams({
                            [filter.id]: value,
                            page: '1' // Reset to first page on filter change
                        })}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder={`Filter by ${filter.id}`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All {filter.id}</SelectItem>
                            {filter.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ))}
            </div>

            {/* Table */}
            <Card className="py-0">
                <div className="rounded-md border px-3">
                    <Table >
                        <TableHeader>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableHead
                                        key={column.id}
                                        className={column.className}
                                        style={{
                                            display: column.hidden === true ? 'none' :
                                                column.hidden === 'sm' ? 'none' :
                                                    column.hidden === 'md' ? 'none' :
                                                        column.hidden === 'lg' ? 'none' :
                                                            column.hidden === 'xl' ? 'none' : 'table-cell',
                                            ['@sm']: column.hidden === 'sm' ? 'table-cell' : undefined,
                                            ['@md']: column.hidden === 'md' ? 'table-cell' : undefined,
                                            ['@lg']: column.hidden === 'lg' ? 'table-cell' : undefined,
                                            ['@xl']: column.hidden === 'xl' ? 'table-cell' : undefined,
                                        } as React.CSSProperties}
                                    >
                                        {column.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                    <TableRow key={index} className="space-x-10 ">
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                className={column.className}
                                                style={{
                                                    display: column.hidden === true ? 'none' :
                                                        column.hidden === 'sm' ? 'none' :
                                                            column.hidden === 'md' ? 'none' :
                                                                column.hidden === 'lg' ? 'none' :
                                                                    column.hidden === 'xl' ? 'none' : 'table-cell',
                                                    ['@sm']: column.hidden === 'sm' ? 'table-cell' : undefined,
                                                    ['@md']: column.hidden === 'md' ? 'table-cell' : undefined,
                                                    ['@lg']: column.hidden === 'lg' ? 'table-cell' : undefined,
                                                    ['@xl']: column.hidden === 'xl' ? 'table-cell' : undefined,
                                                    // eslint-disable-next-line 
                                                    // @typescript-eslint/no-explicit-any
                                                } as React.CSSProperties}
                                            >
                                                {column.accessor(item)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Pagination */}
            {filteredData.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} of{" "}
                        {filteredData.length} items
                    </div>
                    <div className="flex items-center space-x-2">
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => updateParams({
                                pageSize: value,
                                page: '1' // Reset to first page when changing page size
                            })}
                        >
                            <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder={defaultPageSize.toString()} />
                            </SelectTrigger>
                            <SelectContent>
                                {pageSizeOptions.map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="icon" onClick={() => goToPage(1)} disabled={currentPage === 1}>
                                <ChevronsLeft className="h-4 w-4" />
                                <span className="sr-only">First page</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous page</span>
                            </Button>
                            <span className="text-sm">
                                Page {currentPage} of {totalPages || 1}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Next page</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => goToPage(totalPages)}
                                disabled={currentPage === totalPages || totalPages === 0}
                            >
                                <ChevronsRight className="h-4 w-4" />
                                <span className="sr-only">Last page</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}