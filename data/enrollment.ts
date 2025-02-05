import { addEnrollment } from '@/actions/enrollment'
import { db } from '@/lib/db'

export async function addEnrollmentAction(courseId: string, studentId: string) {
    if (!courseId || !studentId) return 'CourseId and StudentId are required'
    const enrollment = await addEnrollment(courseId, studentId)

    if (!enrollment) return { success: false }

    return { success: true, message: 'Enrollment added successfully' }
}

export async function deleteEnrollmentAction(id: string) {
    const enrollment = await db.enrollment.delete({
        where: {
            id,
        },
    })
    return enrollment
}
