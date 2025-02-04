'use server'

import { getCoursesService } from '@/data/course'

export async function getCourses() {
    const courses = await getCoursesService()
    if (!courses) {
        return { error: 'Could not retrieve courses' }
    }
    return { success: 'Courses retrieved successfully!', courses }
}
