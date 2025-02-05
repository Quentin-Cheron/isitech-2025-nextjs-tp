'use client'

import { getCourses } from '@/actions/course'
import StudentTable from '@/components/dashboard/student-table'
import { useCurrentRole } from '@/hook/use-current-role'
import { useCurrentUser } from '@/hook/use-current-user'
import { Course } from '@prisma/client'
import { useState } from 'react'

export default function Page() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<Course[]>([])

    const user = useCurrentUser()
    const role = useCurrentRole()

    if (role !== 'STUDENT') {
        return <h1>You are not authorized to access this page</h1>
    }

    const getData = async () => {
        setLoading(true)
        const res = await getCourses()
        if (res.error) {
            console.log(res.error)
            return
        }
        setData(res.courses)
        setLoading(false)
    }

    return (
        <StudentTable
            loading={loading}
            user={user}
            getData={getData}
            data={data}
        />
    )
}
