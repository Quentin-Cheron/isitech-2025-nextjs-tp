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
