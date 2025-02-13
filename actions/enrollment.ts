'use server'

import { addEnrollment, deleteEnrollment } from '@/data/enrollment'
import { db } from '@/lib/db'

export async function addEnrollmentAction(courseId: string, studentId: string) {
    if (!courseId || !studentId)
        return { success: false, error: 'CourseId and StudentId are required' }

    // Check if the student is already enrolled in the course
    const existingEnrollment = await getEnrollmentByCourseAndStudent(
        courseId,
        studentId
    )

    if (existingEnrollment) {
        return {
            success: false,
            error: 'Student is already enrolled in this course',
        }
    }

    // Proceed with adding the enrollment
    const enrollment = await addEnrollment(courseId, studentId)

    if (!enrollment)
        return { success: false, error: 'Failed to add enrollment' }

    return { success: true, message: 'Enrollment added successfully' }
}

export async function deleteEnrollmentAction(id: string) {
    const enrollment = await deleteEnrollment(id)

    if (!enrollment)
        return { success: false, error: 'Failed to delete enrollment' }

    return { success: true, message: 'Enrollment deleted successfully' }
}

export async function getEnrollmentByStudentId(studentId: string) {
    const enrollments = await db.enrollment.findMany({
        where: {
            studentId,
        },
    })

    // Fetch course data for each enrollment
    const courses = await Promise.all(
        enrollments.map(async (e) => {
            return await db.course.findUnique({
                where: {
                    id: e.courseId,
                },
            })
        })
    )

    // Combine enrollments with their corresponding course data
    const enrollmentsWithCourses = enrollments.map((enrollment, index) => ({
        ...enrollment,
        course: courses[index],
    }))

    return enrollmentsWithCourses
}

export async function getEnrollmentByCourseAndStudent(
    courseId: string,
    studentId: string
) {
    return await db.enrollment.findFirst({
        where: {
            courseId,
            studentId,
        },
    })
}
