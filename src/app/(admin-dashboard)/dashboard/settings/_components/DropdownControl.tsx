'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, ChevronRight, Loader2, Star, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { SystemSettings, TypeItem, MeasureType } from '@/types/settings'

interface DropdownControlProps {
    settings: SystemSettings | null
    onUpdate: () => void
}

type TabType = 'role' | 'category' | 'measure'

const DropdownControl = ({ settings, onUpdate }: DropdownControlProps) => {
    const { data: session } = useSession()
    const accessToken = session?.user?.accessToken
    const [activeTab, setActiveTab] = useState<TabType>('role')
    const [newValue, setNewValue] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Edit State
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [editValue, setEditValue] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Delete State
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const items = activeTab === 'role'
        ? settings?.roleTypes || []
        : activeTab === 'category'
            ? settings?.categoryTypes || []
            : settings?.measureTypes || []

    const handleAdd = async () => {
        if (!newValue.trim() || !settings?._id) return

        try {
            setIsSubmitting(true)
            const payload: any = {}

            if (activeTab === 'role') {
                payload.roleTypes = [...(settings.roleTypes || []), { name: newValue.trim() }]
            } else if (activeTab === 'category') {
                payload.categoryTypes = [...(settings.categoryTypes || []), { name: newValue.trim() }]
            } else {
                payload.measureTypes = [...(settings.measureTypes || []), { name: newValue.trim(), values: { de: '', en: '' } }]
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/system-setting/${settings._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error('Failed to add item')

            toast.success('Added successfully!')
            setNewValue('')
            onUpdate()
        } catch (err: any) {
            toast.error(err.message || 'Failed to add')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = async () => {
        if (!editValue.trim() || !settings?._id || editIndex === null) return

        try {
            setIsSubmitting(true)
            const payload: any = {}

            const newItems = [...items]
            newItems[editIndex] = { ...newItems[editIndex], name: editValue.trim() }

            if (activeTab === 'role') payload.roleTypes = newItems
            else if (activeTab === 'category') payload.categoryTypes = newItems
            else payload.measureTypes = newItems

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/system-setting/${settings._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error('Failed to update item')

            toast.success('Updated successfully!')
            setIsEditModalOpen(false)
            onUpdate()
        } catch (err: any) {
            toast.error(err.message || 'Failed to update')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteClick = (index: number) => {
        setDeleteIndex(index)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!settings?._id || deleteIndex === null) return

        try {
            setIsSubmitting(true)
            const payload: any = {}
            const index = deleteIndex

            if (activeTab === 'role') {
                payload.roleTypes = settings.roleTypes.filter((_, i) => i !== index)
            } else if (activeTab === 'category') {
                payload.categoryTypes = settings.categoryTypes.filter((_, i) => i !== index)
            } else {
                payload.measureTypes = settings.measureTypes.filter((_, i) => i !== index)
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/system-setting/${settings._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error('Failed to delete item')

            toast.success('Deleted successfully!')
            setIsDeleteModalOpen(false)
            onUpdate()
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete')
        } finally {
            setIsSubmitting(false)
            setDeleteIndex(null)
        }
    }

    const openEditModal = (index: number, name: string) => {
        setEditIndex(index)
        setEditValue(name)
        setIsEditModalOpen(true)
    }

    return (
        <div className="grid grid-cols-[280px_1fr] gap-10 min-h-[500px] p-2">
            {/* Sidebar Tabs */}
            <div className="space-y-4">
                <button
                    onClick={() => setActiveTab('role')}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-[4px] border transition-all ${activeTab === 'role' ? 'bg-[#00253E] text-white border-[#00253E]' : 'bg-white text-[#00253E] border-[#E7E7E7]'}`}
                >
                    <div className="flex items-center gap-3 text-[22px] font-medium leading-[120%]">
                        <Circle className={`w-3.5 h-3.5 ${activeTab === 'role' ? 'text-primary' : 'text-[#00253E]'}`} fill="currentColor" />
                        Role Type
                    </div>
                    {activeTab === 'role' ? <ChevronRight className="w-5 h-5 text-primary rotate-180" /> : <ChevronRight className="w-5 h-5 text-[#00253E]" />}
                </button>

                <button
                    onClick={() => setActiveTab('category')}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-[4px] border transition-all ${activeTab === 'category' ? 'bg-[#00253E] text-white border-[#00253E]' : 'bg-white text-[#00253E] border-[#E7E7E7]'}`}
                >
                    <div className="flex items-center gap-3 text-[22px] font-medium leading-[120%]">
                        <Circle className={`w-3.5 h-3.5 ${activeTab === 'category' ? 'text-primary' : 'text-[#00253E]'}`} fill="currentColor" />
                        Category Type
                    </div>
                    <ChevronRight className={`w-5 h-5 ${activeTab === 'category' ? 'text-primary' : 'text-[#00253E]'}`} />
                </button>

                <button
                    onClick={() => setActiveTab('measure')}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-[4px] border transition-all ${activeTab === 'measure' ? 'bg-[#00253E] text-white border-[#00253E]' : 'bg-white text-[#00253E] border-[#E7E7E7]'}`}
                >
                    <div className="flex items-center gap-3 text-[22px] font-medium leading-[120%]">
                        <Circle className={`w-3.5 h-3.5 ${activeTab === 'measure' ? 'text-primary' : 'text-[#00253E]'}`} fill="currentColor" />
                        Measure Type
                    </div>
                    <ChevronRight className={`w-5 h-5 ${activeTab === 'measure' ? 'text-primary' : 'text-[#00253E]'}`} />
                </button>
            </div>

            {/* Content Area */}
            <div className="space-y-8 bg-white border border-[#E7E7E7] rounded-[8px] p-8 shadow-sm">
                <h3 className="text-[28px] font-semibold text-[#00253E] leading-[110%] flex items-center gap-3">
                    <Circle className="w-4 h-4 text-[#00253E]" fill="currentColor" />
                    {activeTab === 'role' ? 'Role Type' : activeTab === 'category' ? 'Category Type' : 'Measure Type'}
                </h3>

                <div className="space-y-6">
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2 group">
                                <span className="text-[20px] font-normal leading-[110%] text-[#00253E] flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-[#00253E]"></div>
                                    {item.name}
                                </span>
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEditModal(index, item.name)}
                                        className="w-8 h-8 bg-[#F1FFC5] text-[#00253E] hover:bg-primary rounded-[4px] transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteClick(index)}
                                        className="w-8 h-8 bg-[#E7E7E7] text-[#00253E] hover:bg-red-100 rounded-[4px] transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {items.length === 0 && (
                            <div className="py-10 text-center text-gray-400 italic text-[20px]">
                                No items found. Add one below.
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Input
                            placeholder={`Type new ${activeTab} type`}
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            className="h-14 border-[#E7E7E7] rounded-[8px] text-[20px] font-normal leading-[110%] text-[#00253E] px-4 placeholder:text-gray-300"
                        />
                        <Button
                            onClick={handleAdd}
                            disabled={isSubmitting || !newValue.trim()}
                            className="bg-[#BADA55] hover:bg-[#A9C94D] text-[#00253E] font-bold px-10 h-14 rounded-[8px] text-[20px] leading-none"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                            Add
                        </Button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-[400px] border-none rounded-[16px] p-6 bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-[#00253E] text-center">
                            Edit {activeTab === 'role' ? 'Role' : activeTab === 'category' ? 'Category' : 'Measure'} Type
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-6">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block capitalize">
                            {activeTab} Name
                        </label>
                        <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-11 border-[#E7E7E7] rounded-[8px] text-[20px] font-normal text-[#00253E]"
                        />
                    </div>
                    <DialogFooter className="flex flex-row gap-3 sm:justify-center">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                            className="h-11 px-8 rounded-full border-gray-300 font-semibold flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEdit}
                            disabled={isSubmitting || !editValue.trim()}
                            className="h-11 px-8 rounded-full bg-primary hover:bg-primary/90 text-[#00253E] font-bold flex-1"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Save'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="max-w-[400px] border-none rounded-[16px] p-8 bg-white overflow-hidden">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                            <Trash2 className="w-10 h-10 text-red-500" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-[24px] font-bold text-[#00253E]">Are you sure?</h2>
                            <p className="text-gray-500 text-[16px]">
                                Do you really want to delete this {activeTab} type? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-4 w-full pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="h-12 rounded-full border-gray-200 font-semibold text-[#00253E] hover:bg-gray-50 flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                disabled={isSubmitting}
                                className="h-12 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex-1"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete Now'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DropdownControl
