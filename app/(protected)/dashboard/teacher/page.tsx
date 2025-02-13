'use client'

import { getCoursesByTeacherId } from '@/actions/course'
import TeacherTable from '@/components/dashboard/teacher-table'
import { useCurrentRole } from '@/hook/use-current-role'
import { useCurrentUser } from '@/hook/use-current-user'
import { Course } from '@prisma/client'
import { useEffect, useState } from 'react'

export default function Page() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<Course[]>([])
    const [error, setError] = useState<string | null>(null)

    const user = useCurrentUser()
    const role = useCurrentRole()

    useEffect(() => {
        if (role === 'TEACHER') {
            getData()
        }
    }, [role, user])

    const getData = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getCoursesByTeacherId(user?.id || '')
            if (res.error) {
                throw new Error(res.error)
            }
            setData(res.courses)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (role !== 'TEACHER') {
        return <h1>You are not authorized to access this page</h1>
    }

    return (
        <>
            {error && <p>Error: {error}</p>}
            <TeacherTable
                loading={loading}
                user={user}
                getData={getData}
                data={data}
            />
        </>
    )
}
