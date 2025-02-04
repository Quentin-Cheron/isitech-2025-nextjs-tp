'use server'
import * as z from 'zod'

import { signIn } from '@/auth'
import { LoginSchema } from '@/schemas'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { getUserByEmail } from '@/data/user'

export async function login(
    values: z.infer<typeof LoginSchema>,
    callbackUrl?: string | null
) {
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
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        })
        return { success: 'Logged in successfully!' }
    } catch (error) {
        console.error(error)
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials!' }
                default:
                    return {
                        error: 'Something went wrong!',
                    }
            }
        }
        throw error
    }
}
