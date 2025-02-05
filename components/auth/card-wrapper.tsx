'use client'

import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Header } from '@/components/auth/header'
import { Social } from '@/components/auth/social'
import { BackButton } from '@/components/auth/back-button'
import { useSearchParams } from 'next/navigation'

interface CardWrapperProps {
    children: React.ReactNode
    headerLabel: string
    backButtonLabel: string
    backButtonHref: string
    showSocial?: boolean
    teacher?: boolean
    login?: boolean
}

export function CardWrapper({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial,
    teacher,
    login,
}: CardWrapperProps) {
    const searchParams = useSearchParams()
    const teacherParam = searchParams.get('teacher')

    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header
                    label={headerLabel}
                    title={
                        teacher && !teacherParam
                            ? 'User'
                            : login
                            ? 'User'
                            : 'Teacher'
                    }
                />
            </CardHeader>
            <CardContent>{children}</CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref} />
                {teacher && !teacherParam ? (
                    <BackButton
                        label="Do your are a teacher ?"
                        href="/auth/register?teacher=true"
                    />
                ) : teacher && teacherParam ? (
                    <BackButton
                        label="Do you are a student ?"
                        href="/auth/register"
                    />
                ) : null}
            </CardFooter>
        </Card>
    )
}
