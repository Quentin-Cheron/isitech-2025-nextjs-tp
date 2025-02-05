'use server'

import {
    addCourse,
    getCoursesService,
    getCoursesServiceById,
    getCoursesServiceByTeacherId,
} from '@/data/course'
import { db } from '@/lib/db'
import { AddCourseSchema } from '@/schemas'
import { z } from 'zod'

export async function getCourses() {
    const courses = await getCoursesService()
    if (!courses) {
        return { error: 'Could not retrieve courses' }
    }
    return { success: 'Courses retrieved successfully!', courses }
}

export async function getCoursesById(id: string) {
    const courses = await getCoursesServiceById(id)
    if (!courses) {
        return { error: 'Could not retrieve courses' }
    }
    return { success: 'Courses retrieved successfully!', courses }
}

export async function getCoursesByTeacherId(teacherId: string) {
    console.log(teacherId)
    const courses = await getCoursesServiceByTeacherId(teacherId)
    if (!courses) {
        return { error: 'Could not retrieve courses' }
    }

    console.log(courses)
    return { success: 'Courses retrieved successfully!', courses }
}

export async function addCourseAction(values: z.infer<typeof AddCourseSchema>) {
    try {
        const course = await addCourse(values)

        if (!course || !values) {
            return { error: 'Could not add course' }
        }

        return { success: 'Course added successfully!' }
    } catch (err) {
        console.log(err)
        return { error: 'Could not add course' }
    }
}
