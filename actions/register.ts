'use server'
import * as z from 'zod'

import bcrypt from 'bcryptjs'

import { db } from '@/lib/db'
import { RegisterSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'

export async function register(values: z.infer<typeof RegisterSchema>) {
    const validateFields = RegisterSchema.safeParse(values)

    if (!validateFields.success) {
        return { error: 'Invalid field!' }
    }

    const { email, password, name } = validateFields.data

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email.toLowerCase())

    if (existingUser) {
        return { error: 'Email already in use!' }
    }

    await db.user.create({
        data: {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'USER',
        },
    })

    return { success: 'Compte crée avec success' }
}
