'use server'

import { db } from '@/lib/db'

export async function addEnrollment(courseId: string, studentId: string) {
    const enrollment = await db.enrollment.create({
        data: {
            courseId,
            studentId,
            enrollmentDate: new Date(),
            status: 'PENDING',
        },
    })
    return enrollment
}

export async function deleteEnrollmentAction(id: string) {
    const enrollment = await db.enrollment.delete({
        where: {
            id,
        },
    })
    return enrollment
}

export async function getEnrollmentByStudentId(studentId: string) {
    const enrollment = await db.enrollment.findMany({
        where: {
            studentId,
        },
    })

    const course = enrollment.forEach(async (e) => {
        await db.course.findUnique({
            where: {
                id: e.courseId,
            },
        })
    })

    console.log(course)
    return enrollment
}
