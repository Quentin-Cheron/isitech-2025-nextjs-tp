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
import { MoreHorizontal } from 'lucide-react'
import {
    addEvaluation,
    getEvaluationsByStudentAndCourse,
} from '@/actions/evaluation'
import { useCurrentUser } from '@/hook/use-current-user'
import { getStudentsByTeacherId } from '@/actions/student'
import { notifyError, notifySuccess } from '@/lib/notify'
import { Skeleton } from '@/components/ui/skeleton'

type Student = {
    id: string
    name: string
    email: string
    courses: { id: string; title: string }[]
}

type Evaluation = {
    evaluation: string
    comments: string
}

export default function StudentEvaluationTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    )
    const [rowSelection, setRowSelection] = useState({})
    const [students, setStudents] = useState<Student[]>([])
    const [isPending, startTransition] = useTransition()
    const [evaluations, setEvaluations] = useState<{
        [key: string]: Evaluation
    }>({})

    const user = useCurrentUser()

    const fetchStudents = async () => {
        startTransition(() => {
            getStudentsByTeacherId(user?.id as string).then((res) => {
                if (res.error) {
                    return
                }
                setStudents(res.students || [])
                fetchEvaluations(res.students || [])
            })
        })
    }

    const fetchEvaluations = async (students: Student[]) => {
        const evalMap: { [key: string]: Evaluation } = {}
        for (const student of students) {
            for (const course of student.courses) {
                const { evaluation, error } =
                    await getEvaluationsByStudentAndCourse(
                        student.id,
                        course.id
                    )
                if (error) {
                    console.error('Error fetching evaluation:', error)
                } else {
                    evalMap[`${student.id}-${course.id}`] = evaluation || {
                        evaluation: '',
                        comments: '',
                    }
                }
            }
        }
        setEvaluations(evalMap)
    }

    useEffect(() => {
        fetchStudents()
    }, [user?.id])

    const handleAddEvaluation = async (studentId: string, courseId: string) => {
        const evaluation = prompt('Enter evaluation:')
        const comments = prompt('Enter comments:')
        if (evaluation && comments) {
            const { error, success, message } = await addEvaluation(
                studentId,
                courseId,
                evaluation,
                comments
            )
            if (!success && error) {
                notifyError(error as string)
            } else {
                notifySuccess(message as string)
                fetchEvaluations(students)
            }
        }
    }

    const columns: ColumnDef<Student>[] = [
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
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <div>{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => <div>{row.getValue('email')}</div>,
        },
        {
            accessorKey: 'courses',
            header: 'Courses',
            cell: ({ row }) => (
                <div>
                    {row.original.courses.map((course) => (
                        <div key={course.id}>
                            {course.title}
                            {evaluations[`${row.original.id}-${course.id}`] ? (
                                <div>
                                    Evaluation:{' '}
                                    {
                                        evaluations[
                                            `${row.original.id}-${course.id}`
                                        ].evaluation
                                    }
                                    <br />
                                    Comments:{' '}
                                    {
                                        evaluations[
                                            `${row.original.id}-${course.id}`
                                        ].comments
                                    }
                                </div>
                            ) : (
                                <div>No evaluation available</div>
                            )}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const student = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {student.courses.map((course) => (
                                <div key={course.id}>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleAddEvaluation(
                                                student.id,
                                                course.id
                                            )
                                        }
                                    >
                                        Add Evaluation for {course.title}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </div>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: students,
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
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
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
                                {isPending ? (
                                    <TableCell colSpan={columns.length}>
                                        <Skeleton className="h-12 w-full rounded-xl" />
                                    </TableCell>
                                ) : (
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.'
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
