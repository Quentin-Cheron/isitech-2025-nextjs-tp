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

        console.log(students)

        // Map the students to include course, progress, and evaluation
        const mappedStudents = students.map((student) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            course: student.enrollments.map((e) => e.course.title).join(', '),
            progress: student.progresses.map((p) => p.evaluation).join(', '),
            evaluation: student.progresses.map((p) => p.comments).join(', '),
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
