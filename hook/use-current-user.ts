import { useSession } from 'next-auth/react'

type User = {
    id: string
    name: string
    email: string
    role: 'TEACHER' | 'STUDENT'
}

export function useCurrentUser() {
    const session = useSession()
    return session.data?.user as User
}
