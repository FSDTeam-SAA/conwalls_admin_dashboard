'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

const passwordSchema = z.object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

const ResetPassword = () => {
    const { data: session } = useSession()
    const accessToken = session?.user?.accessToken
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: PasswordFormValues) => {
        try {
            setIsSubmitting(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                }),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || 'Failed to change password')
            }

            toast.success('Password changed successfully!')
            form.reset()
        } catch (err: any) {
            toast.error(err.message || 'Failed to reset password')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full mt-4 bg-white rounded-[8px] shadow-sm p-8 border border-gray-100">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Current Password */}
                    <FormField
                        control={form.control}
                        name="oldPassword"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-[24px] font-semibold text-[#00253E] leading-[110%]">Current Password</FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <LockKeyhole className="w-5 h-5 opacity-50" />
                                        </div>
                                        <Input
                                            type={showOld ? 'text' : 'password'}
                                            placeholder="Enter the Password"
                                            className="h-14 border-[#E2E8F0] rounded-[4px] pl-10 pr-10 bg-white focus-visible:ring-1 focus-visible:ring-primary shadow-sm text-[24px] font-normal leading-[110%] text-[#00253E]"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOld(!showOld)}
                                            className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showOld ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* New Password */}
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-[24px] font-semibold text-[#00253E] leading-[110%]">New Password</FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <LockKeyhole className="w-5 h-5 opacity-50" />
                                        </div>
                                        <Input
                                            type={showNew ? 'text' : 'password'}
                                            placeholder="Enter the Password"
                                            className="h-14 border-[#E2E8F0] rounded-[4px] pl-10 pr-10 bg-white focus-visible:ring-1 focus-visible:ring-primary shadow-sm text-[24px] font-normal leading-[110%] text-[#00253E]"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showNew ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Confirm Password */}
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-[24px] font-semibold text-[#00253E] leading-[110%]">Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <LockKeyhole className="w-5 h-5 opacity-50" />
                                        </div>
                                        <Input
                                            type={showConfirm ? 'text' : 'password'}
                                            placeholder="Enter the Confirm a Password"
                                            className="h-14 border-[#E2E8F0] rounded-[4px] pl-10 pr-10 bg-white focus-visible:ring-1 focus-visible:ring-primary shadow-sm text-[24px] font-normal leading-[110%] text-[#00253E]"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary hover:bg-primary/90 text-[#00253E] font-bold px-12 h-12 rounded-[4px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ResetPassword
