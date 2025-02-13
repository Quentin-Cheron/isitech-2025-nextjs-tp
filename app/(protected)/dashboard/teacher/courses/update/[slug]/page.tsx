'use client'

import { useForm } from 'react-hook-form'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { getCoursesById, updateCourseAction } from '@/actions/course'
import FormInput from '@/components/custom/form-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateCourseSchema } from '@/schemas'
import { z } from 'zod'
import { notifyError, notifySuccess } from '@/lib/notify'
import { Button } from '@/components/ui/button'

export default function Page() {
    const pathname = usePathname()
    const [data, setData] = useState<any>(null)
    const [isPending, startTransition] = useTransition()

    const courseId = pathname.split('/').pop()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof UpdateCourseSchema>>({
        resolver: zodResolver(UpdateCourseSchema),
        defaultValues: {
            title: data?.title,
            description: '',
            instrument: '',
            capacity: 0,
            schedule: '',
            level: '',
        },
    })

    const getData = async () => {
        const res = await getCoursesById(courseId as string)
        setData(res.courses)

        reset({
            title: res.courses?.title,
            description: res.courses?.description,
            instrument: res.courses?.instrument,
            capacity: res.courses?.capacity,
            schedule: res.courses?.schedule,
            level: res.courses?.level,
        })
    }

    useEffect(() => {
        getData()
    }, [courseId])

    const onSubmit = (data: any) => {
        startTransition(() => {
            updateCourseAction({ ...data, id: courseId }).then((res) => {
                if (res.success) {
                    notifySuccess(res.success)
                } else {
                    notifyError(res.error as string)
                }
            })
        })
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
            className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg"
        >
            <div className="space-y-8">
                <div className="border-b border-gray-200 pb-5">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Course Details
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        This information will be displayed publicly, so be
                        careful what you share.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <FormInput
                        label="Title"
                        name="title"
                        register={register}
                        validation={{ required: 'Title is required' }}
                        errors={errors}
                    />
                    <FormInput
                        label="Instrument"
                        name="instrument"
                        register={register}
                        validation={{ required: 'Instrument is required' }}
                        errors={errors}
                    />
                    <FormInput
                        label="Level"
                        name="level"
                        register={register}
                        validation={{ required: 'Level is required' }}
                        errors={errors}
                    />
                    <FormInput
                        label="Description"
                        name="description"
                        textArea
                        register={register}
                        validation={{ required: 'Description is required' }}
                        errors={errors}
                    />
                    <FormInput
                        label="Capacity"
                        name="capacity"
                        type="number"
                        register={register}
                        validation={{
                            required: 'Capacity is required',
                            valueAsNumber: true,
                        }}
                        errors={errors}
                    />
                    <FormInput
                        label="Schedule"
                        name="schedule"
                        type="date"
                        register={register}
                        validation={{ required: 'Schedule is required' }}
                        errors={errors}
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
