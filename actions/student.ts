// actions/student.ts
'use server'

import { db } from '@/lib/db'

// Obtenir tous les étudiants
export async function getAllStudents() {
    try {
        const students = await db.student.findMany({
            include: {
                enrollments: {
                    include: {
                        course: true,
                    },
                },
                progresses: true,
            },
        })

        // Map the students to include course, progress, and evaluation
        const mappedStudents = students.map((student) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            course:
                student.enrollments.length > 0
                    ? student.enrollments.map((e) => e.course.title).join(', ')
                    : 'No courses',
            progress:
                student.progresses.length > 0
                    ? student.progresses.map((p) => p.evaluation).join(', ')
                    : 'No progress',
            evaluation:
                student.progresses.length > 0
                    ? student.progresses.map((p) => p.comments).join(', ')
                    : 'No evaluations',
        }))

        return { students: mappedStudents }
    } catch (error) {
        return { error }
    }
}

// Obtenir un étudiant par ID
export async function getStudentById(id: string) {
    try {
        const student = await db.student.findUnique({
            where: { id },
            include: {
                enrollments: {
                    include: {
                        course: true,
                    },
                },
                progresses: true,
            },
        })
        return { student }
    } catch (error) {
        return { error }
    }
}

// Créer un nouvel étudiant
export async function createStudent(data: any) {
    try {
        const student = await db.student.create({
            data: {
                ...data,
            },
        })
        return { student }
    } catch (error) {
        return { error }
    }
}

// Mettre à jour un étudiant
export async function updateStudent(id: string, data: any) {
    try {
        const student = await db.student.update({
            where: { id },
            data,
        })
        return { student }
    } catch (error) {
        return { error }
    }
}

// Supprimer un étudiant
export async function deleteStudentById(id: string) {
    try {
        const student = await db.student.delete({
            where: { id },
        })
        return { student }
    } catch (error) {
        return { error }
    }
}

export async function getStudentsByTeacherId(teacherId: string) {
    try {
        const students = await db.student.findMany({
            include: {
                enrollments: {
                    include: {
                        course: true,
                    },
                    where: {
                        course: {
                            teacherId: teacherId,
                        },
                    },
                },
            },
        })

        const mappedStudents = students.map((student) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            courses: student.enrollments.map((e) => ({
                id: e.course.id,
                title: e.course.title,
            })),
        }))

        return { students: mappedStudents }
    } catch (error) {
        return { error }
    }
}
