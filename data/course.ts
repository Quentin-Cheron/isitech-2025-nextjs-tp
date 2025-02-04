import { db } from '@/lib/db'

export async function getCoursesService() {
    try {
        console.log('getCoursesService')
        return await db.course.findMany()
    } catch {
        return null
    }
}
