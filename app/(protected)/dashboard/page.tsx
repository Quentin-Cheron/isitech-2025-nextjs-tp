'use client'

import { useCurrentRole } from '@/hook/use-current-role'
import { redirect } from 'next/navigation'

export default function Page() {
    const role = useCurrentRole()

    if (role === 'TEACHER') {
        redirect('/dashboard/teacher')
    } else {
        redirect('/dashboard/student')
    }
}
