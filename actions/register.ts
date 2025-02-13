'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { RegisterSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'

export async function register(values: z.infer<typeof RegisterSchema>) {
    const validateFields = RegisterSchema.safeParse(values)

    if (!validateFields.success) {
        // Retourne les erreurs de validation
        return {
            error: validateFields.error.errors.map((e) => e.message).join(', '),
        }
    }

    const { email, password, name, role } = validateFields.data

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email.toLowerCase())

    if (existingUser) {
        return { error: 'Email already in use!' }
    }
    try {
        if (role === 'STUDENT') {
            await db.student?.create({
                data: {
                    name,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                },
            })
        } else if (role === 'TEACHER') {
            await db.teacher?.create({
                data: {
                    name,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                },
            })
        } else {
            return { error: 'Invalid role' }
        }
    } catch (error) {
        console.error('Error creating user:', error)
        return {
            error: 'Une erreur est survenue lors de la création du compte',
        }
    }

    return { success: 'Compte créé avec succès' }
}
