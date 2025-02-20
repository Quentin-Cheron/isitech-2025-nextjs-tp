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
import { ArrowUpDown, Loader2, MoreHorizontal } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    addCourseAction,
    deleteCourseByIdAction,
    getCourses,
    getCoursesByTeacherId,
} from '@/actions/course'
import { Textarea } from '../ui/textarea'
import { useCurrentUser } from '@/hook/use-current-user'
import { AddCourseSchema } from '@/schemas'
import FormInput from '../custom/form-input'
import { z } from 'zod'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import { User } from '@prisma/client'
import { Skeleton } from '../ui/skeleton'

type Course = {
    id: string
    title: string
    description: string
    instrument: string
    level: string
    schedule: string
}

export default function TeacherTable({
    data,
    getData,
    user,
    loading,
}: {
    data: Course[]
    getData: () => void
    user: User
    loading: boolean
}) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    )
    const [rowSelection, setRowSelection] = useState({})
    const [isPending, startTransition] = useTransition()

    const {
        register: registerCourse,
        handleSubmit: handleSubmitCourse,
        reset: resetCourse,
        formState: { errors: courseErrors },
    } = useForm<z.infer<typeof AddCourseSchema>>()

    const AddCourse = async (values: z.infer<typeof AddCourseSchema>) => {
        startTransition(() => {
            addCourseAction({
                ...values,
                teacherId: user?.id || '',
            })
                .then((data) => {
                    if (data?.error) {
                        return
                    }
                    getData()
                })
                .catch((err) => console.log(err))
        })
    }

    const deleteCourse = async (id: string) => {
        const res = await deleteCourseByIdAction(id)
        if (res?.error) {
            console.log(res?.error)
            return
        }
        getData()
    }

    const columns: ColumnDef<Course>[] = [
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
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('title')}</div>
            ),
        },
        {
            accessorKey: 'description',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Description
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="lowercase">{row.getValue('description')}</div>
            ),
        },
        {
            accessorKey: 'instrument',
            header: () => <div className="text-right">Instrument</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-right font-medium">
                        {row.getValue('instrument')}
                    </div>
                )
            },
        },
        {
            accessorKey: 'level',
            header: 'Level',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('level')}</div>
            ),
        },
        {
            accessorKey: 'schedule',
            header: 'Schedule',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('schedule')}</div>
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const course = row.original

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
                            <DropdownMenuItem>
                                <Link
                                    href={`/dashboard/teacher/courses/update/${course?.id}`}
                                    className="w-full"
                                >
                                    Update
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => deleteCourse(course?.id)}
                            >
                                <span className="w-full cursor-pointer">
                                    Delete
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
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
            <Dialog
                onOpenChange={() => {
                    resetCourse()
                }}
            >
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-max ml-auto mb-2 block"
                    >
                        Add a course
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmitCourse(AddCourse)}>
                        <DialogHeader>
                            <DialogTitle>Add course</DialogTitle>
                            <DialogDescription>
                                Add a new course to your list
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormInput
                                label="Title"
                                name="title"
                                register={registerCourse}
                                validation={{ required: 'Title is required' }}
                                errors={courseErrors}
                            />
                            <FormInput
                                label="Description"
                                name="description"
                                textArea
                                register={registerCourse}
                                validation={{
                                    required: 'Description is required',
                                }}
                                errors={courseErrors}
                            />
                            <FormInput
                                label="Instrument"
                                name="instrument"
                                register={registerCourse}
                                validation={{
                                    required: 'Instrument is required',
                                }}
                                errors={courseErrors}
                            />
                            <FormInput
                                label="Level"
                                name="level"
                                register={registerCourse}
                                validation={{
                                    required: 'level is required',
                                }}
                                errors={courseErrors}
                            />
                            <FormInput
                                label="Capacity"
                                name="capacity"
                                type="number"
                                register={registerCourse}
                                validation={{
                                    required: 'capacity is required',
                                }}
                                errors={courseErrors}
                            />
                            <FormInput
                                label="Schedule"
                                name="schedule"
                                type="date"
                                register={registerCourse}
                                validation={{
                                    required: 'schedule is required',
                                }}
                                errors={courseErrors}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" />
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    <span>Save course</span>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

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
                                {loading ? (
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
