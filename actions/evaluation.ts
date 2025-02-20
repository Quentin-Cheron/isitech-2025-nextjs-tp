'use server'

import { db } from '@/lib/db'

export async function getEvaluationsByTeacherId(teacherId: string) {
    try {
        const evaluations = await db.progress.findMany({
            where: {
                course: {
                    teacherId: teacherId,
                },
            },
            include: {
                student: true,
                course: true,
            },
        })

        const mappedEvaluations = evaluations.map((evaluation) => ({
            id: evaluation.id,
            studentId: evaluation.studentId,
            studentName: evaluation.student.name,
            courseId: evaluation.courseId,
            courseTitle: evaluation.course.title,
            date: evaluation.date,
            evaluation: evaluation.evaluation,
            comments: evaluation.comments,
        }))

        return { evaluations: mappedEvaluations }
    } catch (error) {
        return { error }
    }
}

export async function addEvaluation(
    studentId: string,
    courseId: string,
    evaluation: string,
    comments: string
) {
    try {
        // Check if an evaluation already exists
        const existingEvaluation = await db.progress.findFirst({
            where: {
                studentId: studentId,
                courseId: courseId,
            },
        })

        if (existingEvaluation) {
            // Update the existing evaluation
            const updatedEvaluation = await db.progress.update({
                where: { id: existingEvaluation.id },
                data: { evaluation, comments, date: new Date() },
            })
            return { success: false, error: 'Evaluation already exists' }
        } else {
            // Create a new evaluation
            await db.progress.create({
                data: {
                    studentId,
                    courseId,
                    evaluation,
                    comments,
                    date: new Date(),
                },
            })
            return { success: true, message: 'Evaluation added' }
        }
    } catch (error) {
        return { error }
    }
}

export async function getEvaluationsByStudentAndCourse(
    studentId: string,
    courseId: string
) {
    try {
        const evaluation = await db.progress.findFirst({
            where: {
                studentId: studentId,
                courseId: courseId,
            },
        })

        return { evaluation }
    } catch (error) {
        return { error }
    }
}
