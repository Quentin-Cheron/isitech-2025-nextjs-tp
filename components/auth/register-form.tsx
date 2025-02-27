'use client'

import * as z from 'zod'
import { useSearchParams } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useState, useTransition } from 'react'

import { RegisterSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import { CardWrapper } from '@/components/auth/card-wrapper'

import { FormSuccess, FormError } from '@/components/form-messages'

import { register } from '@/actions/register'
import { Loader2 } from 'lucide-react'

export function RegisterForm() {
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')

    const [isPending, startTransition] = useTransition()

    const searchParams = useSearchParams()
    const teacherParam = searchParams.get('teacher')

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            role: 'STUDENT',
        },
    })

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setError('')
        setSuccess('')

        startTransition(async () => {
            try {
                const data = await register({
                    ...values,
                    role: teacherParam ? 'TEACHER' : 'STUDENT',
                })
                if (data.error) {
                    setError(data.error)
                } else {
                    setSuccess(data.success)
                }
            } catch (err) {
                setError('Something went wrong')
            }
        })
    }

    return (
        <CardWrapper
            headerLabel="Create an account"
            backButtonLabel="Already have an account ?"
            backButtonHref="/auth/login"
            teacher
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="John Doe"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="john.doe@example.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Passsword</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="******"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending && (
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        )}{' '}
                        Create an account
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
