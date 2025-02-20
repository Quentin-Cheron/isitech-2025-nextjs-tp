'use server'
import * as z from 'zod'

import { signIn } from '@/auth'
import { LoginSchema } from '@/schemas'
import { AuthError } from 'next-auth'
import { getUserByEmail } from '@/data/user'
export async function login(values: z.infer<typeof LoginSchema>) {
    const validateFields = LoginSchema.safeParse(values)

    if (!validateFields.success) {
        return { error: 'Invalid field!' }
    }

    const { email, password } = validateFields.data

    const existingUser = await getUserByEmail(email.toLowerCase())

    if (
        !existingUser ||
        !existingUser.email?.toLowerCase() ||
        !existingUser.password
    ) {
        return { error: 'User does not exist!' }
    }

    try {
        await signIn('credentials', {
            email: email.toLowerCase(),
            password,
            role: values.role,
            redirect: false,
        })

        return { success: 'Logged in successfully!' }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials!' }
                default:
                    return { error: 'Something went wrong!' }
            }
        }
        throw error
    }
}
