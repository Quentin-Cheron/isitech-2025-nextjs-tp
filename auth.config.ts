import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'

import { LoginSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'

export default {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'email@example.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) return null

                // Validation des champs avec Zod
                const validatedField = LoginSchema.safeParse(credentials)
                if (!validatedField.success) return null

                const { email, password } = validatedField.data

                // Recherche de l'utilisateur
                const user = await getUserByEmail(email)
                if (!user || !user.password) return null

                // Vérification du mot de passe
                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password
                )
                if (!passwordsMatch) return null

                // Retourner l'utilisateur sans le mot de passe
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
        }),
    ],
}
