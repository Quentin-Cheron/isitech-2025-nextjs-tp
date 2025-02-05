import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Email is required',
    }),
    password: z.string().min(1, {
        message: 'Password is required',
    }),
    role: z.enum(['STUDENT', 'TEACHER'], {
        message: 'Role must be STUDENT or TEACHER',
    }),
})

export const RegisterSchema = z.object({
    email: z.string().email({
        message: 'Email is required',
    }),
    password: z.string().min(6, {
        message: 'Minimum 6 characters required',
    }),
    name: z.string().min(1, {
        message: 'Name is required',
    }),
    role: z.enum(['STUDENT', 'TEACHER'], {
        message: 'Role must be STUDENT or TEACHER',
    }),
})

export const AddCourseSchema = z.object({
    title: z.string().min(1, {
        message: 'Title is required',
    }),
    description: z.string().min(1, {
        message: 'Description is required',
    }),
    instrument: z.string().min(1, {
        message: 'Instrument is required',
    }),
    level: z.string().min(1, {
        message: 'Level is required',
    }),
    capacity: z.number().min(1, {
        message: 'Capacity is required',
    }),
    schedule: z.string().min(1, {
        message: 'Schedule is required',
    }),
    teacherId: z.string().min(1, {
        message: 'TeacherId is required',
    }),
})
