'use client'

import { getCoursesByTeacherId } from '@/actions/course'
import TeacherTable from '@/components/dashboard/teacher-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentRole } from '@/hook/use-current-role'
import { useCurrentUser } from '@/hook/use-current-user'
import { Course } from '@prisma/client'
import { useEffect, useState, useTransition } from 'react'

export default function Page() {
    const [data, setData] = useState<Course[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const user = useCurrentUser()
    const role = useCurrentRole()

    useEffect(() => {
        if (role === 'TEACHER') {
            getData()
        }
    }, [role, user])

    const getData = async () => {
        startTransition(() => {
            getCoursesByTeacherId(user.id).then((res) => {
                if (res.error) {
                    setError(res.error)
                    return
                }
                setData(res.courses || [])
            })
        })
    }

    if (role !== 'TEACHER') {
        return <h1>You are not authorized to access this page</h1>
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
                <TeacherTable user={user} getData={getData} data={data} />
            )}
        </>
    )
}
