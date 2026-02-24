'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const editTrainerSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    password: z.string().optional(),
})

type EditTrainerFormValues = z.infer<typeof editTrainerSchema>

interface Trainer {
    _id: string
    name: string
    email: string
    phone?: string
    role: string
    isVerified: boolean
}

interface EditTrainerModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    trainer: Trainer | null
    accessToken?: string
}

const EditTrainerModal = ({ open, onClose, onSuccess, trainer, accessToken }: EditTrainerModalProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<EditTrainerFormValues>({
        resolver: zodResolver(editTrainerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
        },
    })

    useEffect(() => {
        if (trainer) {
            form.reset({
                fullName: trainer.name || '',
                email: trainer.email,
                phone: trainer.phone || '',
                password: '',
            })
        }
    }, [trainer, form])

    const onSubmit = async (values: EditTrainerFormValues) => {
        if (!trainer) return
        try {
            setIsSubmitting(true)
            const payload: Record<string, string> = {
                name: values.fullName,
                email: values.email,
                phone: values.phone || '',
            }
            if (values.password) payload.password = values.password

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${trainer._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err?.message || 'Failed to update trainer')
            }

            onSuccess()
            onClose()
            toast.success('Trainer updated successfully!')
        } catch (error: any) {
            console.error('Edit trainer error:', error)
            toast.error(error.message || 'Failed to update trainer')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[480px] rounded-[16px] p-6 bg-white border-none">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#00253E]">
                        Edit Trainer
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">Update trainer information below.</p>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                                    <FormControl>
                                        <Input className="h-[48px] border border-gray-300 rounded-[8px]" {...field} />
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
                                    <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                                    <FormControl>
                                        <Input className="h-[48px] border border-gray-300 rounded-[8px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="h-[48px] border border-gray-300 rounded-[8px]" {...field} />
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
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        New Password <span className="text-gray-400 font-normal">(Optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Leave blank to keep current"
                                                className="h-[48px] border border-gray-300 rounded-[8px] pr-10"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-between gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex items-center gap-2 h-[48px] px-6 rounded-full border-gray-300"
                            >
                                <X className="w-4 h-4 text-red-500" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 h-[48px] px-8 rounded-full bg-primary text-[#00253E] font-bold hover:bg-primary/90"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Pencil className="w-4 h-4" />
                                )}
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditTrainerModal
