import {
    ExclamationTriangleIcon,
    CheckCircledIcon,
} from '@radix-ui/react-icons'

interface FormErrorProps {
    message?: string
}

export function FormError({ message }: FormErrorProps) {
    if (!message) return null

    return (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
}

interface FormSuccessProps {
    message?: string
}

export function FormSuccess({ message }: FormSuccessProps) {
    if (!message) return null

    return (
        <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
            <CheckCircledIcon className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
}
