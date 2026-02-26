'use client'

import { MoveLeft, X } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

interface LogoutModalProps {
    open: boolean
    onClose: () => void
}

const LogoutModal = ({ open, onClose }: LogoutModalProps) => {
    const handleLogout = async () => {
        await signOut({ redirect: false })
        window.location.href = '/login'
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[400px] rounded-[16px] p-8 text-center bg-white border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#00253E] text-center">
                        Are you sure?
                    </DialogTitle>
                </DialogHeader>
                <p className="text-sm font-medium text-[#00253E] mt-2 mb-8">
                    Are you sure you want to log out?
                </p>

                <div className="flex items-center justify-center gap-5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex items-center gap-2 h-[56px] px-8 rounded-[12px] border-[#00253E] text-[#00253E] font-bold hover:bg-gray-50 bg-white min-w-[160px]"
                    >
                        <div className="w-6 h-6 rounded-full bg-[#00253E] flex items-center justify-center">
                            <X className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                        </div>
                        <span className="text-xl">Cancel</span>
                    </Button>
                    <Button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 h-[56px] px-8 rounded-[12px] bg-[#C7E25D] hover:bg-[#C7E25D]/90 text-[#FF4B26] font-bold shadow-none min-w-[160px]"
                    >
                        <div className="w-6 h-6 rounded-full bg-[#FF4B26] flex items-center justify-center">
                            <MoveLeft className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                        </div>
                        <span className="text-xl">log out</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LogoutModal
