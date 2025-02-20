'use client'

import { useForm } from 'react-hook-form'

import { usePathname } from 'next/navigation'
import { use, useEffect, useState, useTransition } from 'react'
import {
    getCoursesById,
    getCoursesByTeacherId,
    updateCourseAction,
} from '@/actions/course'
import FormInput from '@/components/custom/form-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateCourseSchema } from '@/schemas'
import { z } from 'zod'
import { notifyError, notifySuccess } from '@/lib/notify'

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
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">
                        Profile
                    </h2>
                    <p className="mt-1 text-sm/6 text-gray-600">
                        This information will be displayed publicly so be
                        careful what you share.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-4">
                        <div className="grid mdx:grid-cols-3 gap-4">
                            <FormInput
                                label="Title"
                                name="title"
                                register={register}
                                validation={{
                                    required: 'Title is required',
                                }}
                                errors={errors}
                            />
                            <FormInput
                                label="Instrument"
                                name="instrument"
                                register={register}
                                validation={{
                                    required: 'Instrument is required',
                                }}
                                errors={errors}
                            />
                            <FormInput
                                label="Level"
                                name="level"
                                register={register}
                                validation={{
                                    required: 'Level is required',
                                }}
                                errors={errors}
                            />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <FormInput
                                label="Description"
                                name="description"
                                textArea
                                register={register}
                                validation={{
                                    required: 'Description is required',
                                }}
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
                                validation={{
                                    required: 'Schedule is required',
                                }}
                                errors={errors}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="submit"
                    className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    Save
                </button>
            </div>
        </form>
    )
}
