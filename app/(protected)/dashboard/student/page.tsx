'use client'

import { getCourses } from '@/actions/course'
import StudentTable from '@/components/dashboard/student-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentRole } from '@/hook/use-current-role'
import { useCurrentUser } from '@/hook/use-current-user'
import { Course } from '@prisma/client'
import { useEffect, useState, useTransition } from 'react'

export default function Page() {
    const [data, setData] = useState<Course[]>([])
    const [isPending, startTransition] = useTransition()

    const user = useCurrentUser()
    const role = useCurrentRole()

    if (role !== 'STUDENT') {
        return <h1>You are not authorized to access this page</h1>
    }

    const getData = async () => {
        startTransition(() => {
            getCourses().then((res) => {
                if (res.error) {
                    return
                }
                setData(res.courses || [])
            })
        })
    }

    useEffect(() => {
        if (user) {
            getData()
        }
    }, [])

    return (
        <>
            {isPending ? (
                <Skeleton className="h-[136px] w-full rounded-xl" />
            ) : (
                <StudentTable user={user} getData={getData} data={data} />
            )}
        </>
    )
}
