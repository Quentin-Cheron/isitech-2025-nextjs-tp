import { db } from '@/lib/db'
import { AddCourseSchema, UpdateCourseSchema } from '@/schemas'
import { z } from 'zod'

export async function getCoursesService() {
    try {
        return await db.course.findMany()
    } catch {
        return null
    }
}

export async function getCoursesServiceByTeacherId(teacherId: string) {
    try {
        return await db.course.findMany({
            where: {
                teacherId: teacherId,
            },
        })
    } catch {
        return null
    }
}

export async function getCoursesServiceById(id: string) {
    try {
        return await db.course.findFirst({
            where: {
                id: id,
            },
        })
    } catch {
        return null
    }
}

export async function addCourse(values: z.infer<typeof AddCourseSchema>) {
    try {
        return await db.course.create({
            data: {
                ...values,
                capacity: parseInt(values.capacity),
            },
        })
    } catch {
        return null
    }
}

export const updateCourse = async (
    values: z.infer<typeof UpdateCourseSchema>
) => {
    try {
        return await db.course.update({
            where: {
                id: values.id,
            },
            data: {
                ...values,
                capacity: parseInt(values.capacity),
            },
        })
    } catch {
        return null
    }
}

export async function deleteCourseById(id: string) {
    console.log(id)
    try {
        return await db.course.delete({
            where: {
                id,
            },
        })
    } catch {
        return null
    }
}
