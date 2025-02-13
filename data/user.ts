import { db } from '@/lib/db'

export async function getUserByEmail(email: string) {
    const student = await db.student?.findUnique({
        where: { email },
    })

    if (student) {
        return {
            id: student.id,
            name: student.name,
            email: student.email,
            password: student.password,
            role: 'STUDENT',
        }
    }

    const teacher = await db.teacher?.findUnique({
        where: { email },
    })

    if (teacher) {
        return {
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            password: teacher.password,
            role: 'TEACHER',
        }
    }

    return null
}

export async function getUserById(id: string) {
    const student = await db.student.findUnique({
        where: { id },
    })

    if (student) {
        return {
            id: student.id,
            name: student.name,
            password: student.password,
            email: student.email,
            role: 'STUDENT',
        }
    }

    const teacher = await db.teacher.findUnique({
        where: { id },
    })

    if (teacher) {
        return {
            id: teacher.id,
            name: teacher.name,
            password: teacher.password,
            email: teacher.email,
            role: 'TEACHER',
        }
    }

    return null
}
