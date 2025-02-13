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

export async function deleteEnrollment(id: string) {
    // Fetch the enrollment to check the course date
    const enrollment = await db.enrollment.findUnique({
        where: { id },
        include: { course: true }, // Include course data to access the course date
    })

    if (!enrollment || !enrollment.course) {
        return { success: false, error: 'Enrollment not found' }
    }

    const courseDate = new Date(enrollment.course.schedule)
    const currentDate = new Date()

    // Check if the current date is before the course date
    if (currentDate >= courseDate) {
        return {
            success: false,
            error: 'Unenrollment is not allowed after the course date',
        }
    }

    // Proceed with deleting the enrollment
    await db.enrollment.delete({
        where: { id },
    })

    return { success: true, message: 'Unenrollment successful' }
}
