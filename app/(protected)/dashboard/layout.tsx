'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    TransitionChild,
} from '@headlessui/react'
import {
    Bars3Icon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
    ArrowLeftEndOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { logout } from '@/actions/logout'
import { useCurrentRole } from '@/hook/use-current-role'
import Image from 'next/image'

const navigationTeacher = [
    {
        name: 'Gestion des cours',
        href: '/dashboard',
        icon: Bars3Icon,
    },
    {
        name: 'Suivi des élèves',
        href: '/dashboard/teacher/suivi-students',
        icon: UsersIcon,
    },
    {
        name: 'Gestion des évaluations',
        href: '/dashboard/teacher/evaluations',
        icon: UsersIcon,
    },
]

const navigationStudent = [
    {
        name: 'Cours disponibles',
        href: '/dashboard/student',
        icon: Bars3Icon,
    },
    {
        name: 'Cours prévus',
        href: '/dashboard/student/enrollment',
        icon: UsersIcon,
    },
]

export default function Layout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    const role = useCurrentRole()

    return (
        <>
            <div>
                <Dialog
                    open={sidebarOpen}
                    onClose={setSidebarOpen}
                    className="relative z-50 lg:hidden"
                >
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                    />

                    <div className="fixed inset-0 flex">
                        <DialogPanel
                            transition
                            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                        >
                            <TransitionChild>
                                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                    <button
                                        type="button"
                                        onClick={() => setSidebarOpen(false)}
                                        className="-m-2.5 p-2.5"
                                    >
                                        <span className="sr-only">
                                            Close sidebar
                                        </span>
                                        <XMarkIcon
                                            aria-hidden="true"
                                            className="size-6 text-white"
                                        />
                                    </button>
                                </div>
                            </TransitionChild>
                            {/* Sidebar component, swap this element with another sidebar if you like */}
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                <div className="flex h-16 shrink-0 items-center">
                                    <Image
                                        width={100}
                                        height={100}
                                        alt="Your Company"
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTezdfcU9njA1vtJ9KO_XAZuRbP6jNakpw7JA&s"
                                        className="h-8 w-auto"
                                    />
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <ul
                                        role="list"
                                        className="flex flex-1 flex-col gap-y-7"
                                    >
                                        <li>
                                            <ul
                                                role="list"
                                                className="-mx-2 space-y-1"
                                            >
                                                {(role === 'TEACHER'
                                                    ? navigationTeacher
                                                    : navigationStudent
                                                ).map((item) => (
                                                    <li key={item.name}>
                                                        <a
                                                            href={item.href}
                                                            className={cn(
                                                                item.href ===
                                                                    pathname
                                                                    ? 'bg-gray-50 text-secondary'
                                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-secondary',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                                                            )}
                                                        >
                                                            <item.icon
                                                                aria-hidden="true"
                                                                className={cn(
                                                                    item.href ===
                                                                        pathname
                                                                        ? 'text-secondary'
                                                                        : 'text-gray-400 group-hover:text-secondary',
                                                                    'size-6 shrink-0'
                                                                )}
                                                            />
                                                            {item.name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li className="mt-auto">
                                            <button
                                                onClick={() => logout()}
                                                className="w-full group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-secondary"
                                            >
                                                <ArrowLeftEndOnRectangleIcon
                                                    aria-hidden="true"
                                                    className="size-6 shrink-0"
                                                />
                                                Log out
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center">
                            <Image
                                width={100}
                                height={100}
                                alt="Your Company"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTezdfcU9njA1vtJ9KO_XAZuRbP6jNakpw7JA&s"
                                className="h-8 w-auto"
                            />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul
                                role="list"
                                className="flex flex-1 flex-col gap-y-7"
                            >
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {(role === 'TEACHER'
                                            ? navigationTeacher
                                            : navigationStudent
                                        ).map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className={cn(
                                                        item.href === pathname
                                                            ? 'bg-gray-50 text-secondary'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-secondary',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                                                    )}
                                                >
                                                    <item.icon
                                                        aria-hidden="true"
                                                        className={cn(
                                                            item.href ===
                                                                pathname
                                                                ? 'text-secondary'
                                                                : 'text-gray-400 group-hover:text-secondary',
                                                            'size-6 shrink-0'
                                                        )}
                                                    />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="mt-auto">
                                    <button
                                        onClick={() => logout()}
                                        className="w-full group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-secondary"
                                    >
                                        <ArrowLeftEndOnRectangleIcon
                                            aria-hidden="true"
                                            className="size-6 shrink-0"
                                        />
                                        Log out
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="lg:pl-72">
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon aria-hidden="true" className="size-6" />
                        </button>

                        {/* Separator */}
                    </div>

                    <main className="py-10">
                        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                    </main>
                </div>
            </div>
        </>
    )
}
