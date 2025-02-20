'use client'

import React, { useState, useEffect, useTransition } from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { addEnrollmentAction } from '@/data/enrollment'
import { notifyError, notifySuccess } from '@/lib/notify'
import { useCurrentUser } from '@/hook/use-current-user'
import { MoreHorizontal } from 'lucide-react'
import { getEnrollmentByStudentId } from '@/actions/enrollment'

type EnrollmentWithCourse = {
    id: string
    studentId: string
    courseId: string
    enrollmentDate: string
    status: string
    course: {
        id: string
        title: string
        description: string
        instrument: string
        level: string
        schedule: string
    }
}

export default function StudentTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    )
    const [rowSelection, setRowSelection] = useState({})
    const [isPending, startTransition] = useTransition()

    const user = useCurrentUser()

    const [data, setData] = useState<EnrollmentWithCourse[]>([])

    const getData = async () => {
        const enrollments = await getEnrollmentByStudentId(user.id)
        setData(enrollments)
    }

    useEffect(() => {
        getData()
    }, [user.id])

    const columns: ColumnDef<EnrollmentWithCourse>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'course.title',
            header: 'Course Title',
            cell: ({ row }) => <div>{row.original.course.title}</div>,
        },
        {
            accessorKey: 'course.description',
            header: 'Description',
            cell: ({ row }) => <div>{row.original.course.description}</div>,
        },
        {
            accessorKey: 'course.instrument',
            header: 'Instrument',
            cell: ({ row }) => <div>{row.original.course.instrument}</div>,
        },
        {
            accessorKey: 'course.level',
            header: 'Level',
            cell: ({ row }) => <div>{row.original.course.level}</div>,
        },
        {
            accessorKey: 'course.schedule',
            header: 'Schedule',
            cell: ({ row }) => <div>{row.original.course.schedule}</div>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('status')}</div>
            ),
        },
        {
            accessorKey: 'enrollmentDate',
            header: 'Enrollment Date',
            cell: ({ row }) => (
                <div className="capitalize">
                    {new Date(
                        row.getValue('enrollmentDate')
                    ).toLocaleDateString()}
                </div>
            ),
        },
    ]

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                {!isPending ? (
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                ) : (
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Loading...
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
