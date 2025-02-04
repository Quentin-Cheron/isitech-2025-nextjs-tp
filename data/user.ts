import { db } from '@/lib/db'

export async function getUserByEmail(email: string) {
    try {
        return await db.user.findFirst({ where: { email } })
    } catch {
        return null
    }
}

export async function getUserById(id: string | undefined) {
    try {
        return await db.user.findFirst({ where: { id } })
    } catch {
        return null
    }
}
