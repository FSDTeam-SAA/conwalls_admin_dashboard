'use client'

import { useState } from 'react'
import { Trash2, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteTrainerModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    trainerId: string | null
    trainerName?: string
    accessToken?: string
}

const DeleteTrainerModal = ({
    open,
    onClose,
    onSuccess,
    trainerId,
    trainerName,
    accessToken,
}: DeleteTrainerModalProps) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!trainerId) return
        try {
            setIsDeleting(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${trainerId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err?.message || 'Failed to delete trainer')
            }

            onSuccess()
            onClose()
            toast.success('Trainer removed successfully!')
        } catch (error: any) {
            console.error('Delete trainer error:', error)
            toast.error(error.message || 'Failed to delete trainer')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[400px] rounded-[16px] p-8 text-center bg-white border-none">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#00253E] text-center">
                        Are you sure?
                    </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-500 mt-2 mb-6">
                    Are you sure you want to Remove{trainerName ? ` "${trainerName}"` : ' This Trainer'}?
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex items-center gap-2 h-[44px] px-6 rounded-full border-gray-300 font-semibold"
                    >
                        <X className="w-4 h-4 text-red-500" />
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 h-[44px] px-6 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                        {isDeleting ? 'Removing...' : 'Remove'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteTrainerModal
