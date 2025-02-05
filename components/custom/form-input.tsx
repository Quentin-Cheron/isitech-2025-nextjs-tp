import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

export default function FormInput({
    label,
    name,
    register,
    required,
    validation,
    errors,
    textArea,
    type,
    ...props
}: {
    label: string
    name: string
    register: any
    required?: boolean
    validation?: any
    errors?: any
    textArea?: boolean
    type?: string
}) {
    return (
        <div className="mb-4">
            <Label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </Label>
            {textArea ? (
                <Textarea
                    id={name}
                    name={name}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required={required}
                    {...register(name, {
                        ...validation,
                    })}
                    {...props}
                />
            ) : (
                <Input
                    id={name}
                    type={type}
                    name={name}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required={required}
                    {...register(name, {
                        ...validation,
                    })}
                    {...props}
                />
            )}
            {errors && errors[name] && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                    {errors[name].message}
                </p>
            )}
        </div>
    )
}
