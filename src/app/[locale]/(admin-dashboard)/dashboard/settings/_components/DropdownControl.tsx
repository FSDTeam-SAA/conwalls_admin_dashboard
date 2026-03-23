'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import {
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  Loader2,
  Circle,
} from 'lucide-react'

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

import { useTranslations } from 'next-intl'

interface DropdownControlProps {
  settings: SystemSettings | null
  onUpdate: () => void
}

type TabType = 'role' | 'category'
type EditMode = 'role' | 'category' | 'measure'

const emptyLocalizedValues = { de: '', en: '' }

const DropdownControl = ({ settings, onUpdate }: DropdownControlProps) => {
  const t = useTranslations('common')
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken
  const [activeTab, setActiveTab] = useState<TabType>('role')
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0)
  const [newEnglishValue, setNewEnglishValue] = useState('')
  const [newGermanValue, setNewGermanValue] = useState('')
  const [newMeasureEnglishValue, setNewMeasureEnglishValue] = useState('')
  const [newMeasureGermanValue, setNewMeasureGermanValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editMode, setEditMode] = useState<EditMode>('role')

  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editParentIndex, setEditParentIndex] = useState<number | null>(null)
  const [editEnglishValue, setEditEnglishValue] = useState('')
  const [editGermanValue, setEditGermanValue] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [deleteParentIndex, setDeleteParentIndex] = useState<number | null>(
    null,
  )
  const [deleteMode, setDeleteMode] = useState<EditMode>('role')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const categoryTypes = settings?.categoryTypes || []
  const selectedCategory = categoryTypes[selectedCategoryIndex] || null

  useEffect(() => {
    if (selectedCategoryIndex >= categoryTypes.length) {
      setSelectedCategoryIndex(Math.max(categoryTypes.length - 1, 0))
    }
  }, [categoryTypes.length, selectedCategoryIndex])

  const buildNamePayload = (englishValue: string, germanValue: string) => ({
    name: englishValue.trim(),
    labels: {
      en: englishValue.trim(),
      de: germanValue.trim(),
    },
  })

  const roleItems = settings?.roleTypes || []
  const items = activeTab === 'role' ? roleItems : categoryTypes

  const activeHeading = useMemo(() => {
    if (activeTab === 'role') return t('roleType')
    return t('categoryMeasureManager')
  }, [activeTab, t])

  const updateSystemSettings = async (payload: Partial<SystemSettings>) => {
    if (!settings?._id) return

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/system-setting/${settings._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      },
    )

    if (!res.ok) {
      throw new Error('Failed to update settings')
    }
  }

  const handleAdd = async () => {
    if (!newEnglishValue.trim() || !newGermanValue.trim() || !settings?._id)
      return

    try {
      setIsSubmitting(true)

      if (activeTab === 'role') {
        await updateSystemSettings({
          roleTypes: [
            ...roleItems,
            buildNamePayload(newEnglishValue, newGermanValue),
          ],
        })
      } else {
        await updateSystemSettings({
          categoryTypes: [
            ...categoryTypes,
            {
              ...buildNamePayload(newEnglishValue, newGermanValue),
              measureTypes: [],
            },
          ],
        })
        setSelectedCategoryIndex(categoryTypes.length)
      }

      toast.success('Added successfully!')
      setNewEnglishValue('')
      setNewGermanValue('')
      onUpdate()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddMeasureType = async () => {
    if (
      !selectedCategory ||
      !newMeasureEnglishValue.trim() ||
      !newMeasureGermanValue.trim() ||
      !settings?._id
    ) {
      return
    }

    try {
      setIsSubmitting(true)
      const updatedCategories = categoryTypes.map((category, index) =>
        index === selectedCategoryIndex
          ? {
              ...category,
              measureTypes: [
                ...(category.measureTypes || []),
                {
                  ...buildNamePayload(
                    newMeasureEnglishValue,
                    newMeasureGermanValue,
                  ),
                  values: { ...emptyLocalizedValues },
                },
              ],
            }
          : category,
      )

      await updateSystemSettings({ categoryTypes: updatedCategories })

      toast.success('Added successfully!')
      setNewMeasureEnglishValue('')
      setNewMeasureGermanValue('')
      onUpdate()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (
      !settings?._id ||
      editIndex === null ||
      !editEnglishValue.trim() ||
      !editGermanValue.trim()
    ) {
      return
    }

    try {
      setIsSubmitting(true)

      if (editMode === 'role') {
        const updatedRoles = [...roleItems]
        updatedRoles[editIndex] = {
          ...updatedRoles[editIndex],
          ...buildNamePayload(editEnglishValue, editGermanValue),
        }
        await updateSystemSettings({ roleTypes: updatedRoles })
      } else if (editMode === 'category') {
        const updatedCategories = [...categoryTypes]
        updatedCategories[editIndex] = {
          ...updatedCategories[editIndex],
          ...buildNamePayload(editEnglishValue, editGermanValue),
        }
        await updateSystemSettings({ categoryTypes: updatedCategories })
      } else {
        if (editParentIndex === null) return
        const updatedCategories = categoryTypes.map(
          (category, categoryIndex) =>
            categoryIndex === editParentIndex
              ? {
                  ...category,
                  measureTypes: (category.measureTypes || []).map(
                    (measure, measureIndex) =>
                      measureIndex === editIndex
                        ? {
                            ...measure,
                            ...buildNamePayload(
                              editEnglishValue,
                              editGermanValue,
                            ),
                          }
                        : measure,
                  ),
                }
              : category,
        )

        await updateSystemSettings({ categoryTypes: updatedCategories })
      }

      toast.success('Updated successfully!')
      setIsEditModalOpen(false)
      onUpdate()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!settings?._id || deleteIndex === null) return

    try {
      setIsSubmitting(true)

      if (deleteMode === 'role') {
        await updateSystemSettings({
          roleTypes: roleItems.filter((_, index) => index !== deleteIndex),
        })
      } else if (deleteMode === 'category') {
        const updatedCategories = categoryTypes.filter(
          (_, index) => index !== deleteIndex,
        )
        await updateSystemSettings({ categoryTypes: updatedCategories })
        setSelectedCategoryIndex(Math.max(deleteIndex - 1, 0))
      } else {
        if (deleteParentIndex === null) return

        const updatedCategories = categoryTypes.map(
          (category, categoryIndex) =>
            categoryIndex === deleteParentIndex
              ? {
                  ...category,
                  measureTypes: (category.measureTypes || []).filter(
                    (_, measureIndex) => measureIndex !== deleteIndex,
                  ),
                }
              : category,
        )

        await updateSystemSettings({ categoryTypes: updatedCategories })
      }

      toast.success('Deleted successfully!')
      setIsDeleteModalOpen(false)
      onUpdate()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setIsSubmitting(false)
      setDeleteIndex(null)
      setDeleteParentIndex(null)
    }
  }

  const openEditModal = (
    mode: EditMode,
    index: number,
    item: TypeItem | MeasureType,
    parentIndex?: number,
  ) => {
    setEditMode(mode)
    setEditIndex(index)
    setEditParentIndex(parentIndex ?? null)
    setEditEnglishValue(item.labels?.en || item.name || '')
    setEditGermanValue(item.labels?.de || '')
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (
    mode: EditMode,
    index: number,
    parentIndex?: number,
  ) => {
    setDeleteMode(mode)
    setDeleteIndex(index)
    setDeleteParentIndex(parentIndex ?? null)
    setIsDeleteModalOpen(true)
  }

  const renderItemLabel = (item: TypeItem | MeasureType) => (
    <div className="text-[20px] font-normal leading-[110%] text-[#00253E] flex items-start gap-4">
      <div className="w-2 h-2 rounded-full bg-[#00253E] mt-2"></div>
      <div className="flex flex-col gap-1">
        <span>{item.labels?.en || item.name}</span>
        <span className="text-sm text-[#5B7184]">
          {item.labels?.de || t('noGermanLabel')}
        </span>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-[280px_1fr] gap-10 min-h-[500px] p-2">
      <div className="space-y-4">
        <button
          onClick={() => setActiveTab('role')}
          className={`w-full flex items-center justify-between px-4 py-4 rounded-[4px] border transition-all ${activeTab === 'role' ? 'bg-[#00253E] text-white border-[#00253E]' : 'bg-white text-[#00253E] border-[#E7E7E7]'}`}
        >
          <div className="flex items-center gap-3 text-[22px] font-medium leading-[120%]">
            <Circle
              className={`w-3.5 h-3.5 ${activeTab === 'role' ? 'text-primary' : 'text-[#00253E]'}`}
              fill="currentColor"
            />
            {t('roleType')}
          </div>
          <ChevronRight
            className={`w-5 h-5 ${activeTab === 'role' ? 'text-primary rotate-180' : 'text-[#00253E]'}`}
          />
        </button>

        <button
          onClick={() => setActiveTab('category')}
          className={`w-full flex items-center justify-between px-4 py-4 rounded-[4px] border transition-all ${activeTab === 'category' ? 'bg-[#00253E] text-white border-[#00253E]' : 'bg-white text-[#00253E] border-[#E7E7E7]'}`}
        >
          <div className="flex items-center gap-3 text-[22px] font-medium leading-[120%]">
            <Circle
              className={`w-3.5 h-3.5 ${activeTab === 'category' ? 'text-primary' : 'text-[#00253E]'}`}
              fill="currentColor"
            />
            {t('categoryType')}
          </div>
          <ChevronRight
            className={`w-5 h-5 ${activeTab === 'category' ? 'text-primary' : 'text-[#00253E]'}`}
          />
        </button>
      </div>

      <div className="space-y-8 bg-white border border-[#E7E7E7] rounded-[8px] p-8 shadow-sm">
        <h3 className="text-[28px] font-semibold text-[#00253E] leading-[110%] flex items-center gap-3">
          <Circle className="w-4 h-4 text-[#00253E]" fill="currentColor" />
          {activeHeading}
        </h3>

        {activeTab === 'role' ? (
          <div className="space-y-6">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 group"
                >
                  {renderItemLabel(item)}
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal('role', index, item)}
                      className="w-8 h-8 bg-[#F1FFC5] text-[#00253E] hover:bg-primary rounded-[4px] transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteModal('role', index)}
                      className="w-8 h-8 bg-[#E7E7E7] text-[#00253E] hover:bg-red-100 rounded-[4px] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {!items.length && (
                <div className="py-10 text-center text-gray-400 italic text-[20px]">
                  {t('noItemsFound')}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 pt-6">
              <Input
                placeholder={t('englishNamePlaceholder', {
                  type: t('role').toLowerCase(),
                })}
                value={newEnglishValue}
                onChange={e => setNewEnglishValue(e.target.value)}
                className="h-14 border-[#E7E7E7] rounded-[8px] text-[20px] text-[#00253E] px-4 placeholder:text-gray-300"
              />
              <Input
                placeholder={t('germanNamePlaceholder', {
                  type: t('role').toLowerCase(),
                })}
                value={newGermanValue}
                onChange={e => setNewGermanValue(e.target.value)}
                className="h-14 border-[#E7E7E7] rounded-[8px] text-[20px] text-[#00253E] px-4 placeholder:text-gray-300"
              />
              <Button
                onClick={handleAdd}
                disabled={
                  isSubmitting ||
                  !newEnglishValue.trim() ||
                  !newGermanValue.trim()
                }
                className="bg-[#BADA55] hover:bg-[#A9C94D] text-[#00253E] font-bold px-10 h-14 rounded-[8px] text-[20px]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Plus className="w-5 h-5 mr-2" />
                )}
                {t('add')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[22px] font-semibold text-[#00253E]">
                  {t('categoryType')}
                </h4>
              </div>

              <div className="space-y-4">
                {categoryTypes.map((category, index) => (
                  <div
                    key={category.name}
                    className={`flex items-center justify-between py-3 px-4 rounded-[8px] border ${selectedCategoryIndex === index ? 'border-[#00253E] bg-[#F7FAFC]' : 'border-[#E7E7E7]'}`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryIndex(index)}
                      className="text-left flex-1"
                    >
                      {renderItemLabel(category)}
                      <p className="text-sm text-[#5B7184] mt-2 pl-6">
                        {(category.measureTypes || []).length}{' '}
                        {t('measureType')}
                      </p>
                    </button>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          openEditModal('category', index, category)
                        }
                        className="w-8 h-8 bg-[#F1FFC5] text-[#00253E] hover:bg-primary rounded-[4px]"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteModal('category', index)}
                        className="w-8 h-8 bg-[#E7E7E7] text-[#00253E] hover:bg-red-100 rounded-[4px]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {!categoryTypes.length && (
                  <div className="py-10 text-center text-gray-400 italic text-[20px]">
                    {t('noItemsFound')}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 pt-2">
                <Input
                  placeholder={t('englishNamePlaceholder', {
                    type: t('category').toLowerCase(),
                  })}
                  value={newEnglishValue}
                  onChange={e => setNewEnglishValue(e.target.value)}
                  className="h-14 border-[#E7E7E7] rounded-[8px] text-[20px] text-[#00253E] px-4 placeholder:text-gray-300"
                />
                <Input
                  placeholder={t('germanNamePlaceholder', {
                    type: t('category').toLowerCase(),
                  })}
                  value={newGermanValue}
                  onChange={e => setNewGermanValue(e.target.value)}
                  className="h-14 border-[#E7E7E7] rounded-[8px] text-[20px] text-[#00253E] px-4 placeholder:text-gray-300"
                />
                <Button
                  onClick={handleAdd}
                  disabled={
                    isSubmitting ||
                    !newEnglishValue.trim() ||
                    !newGermanValue.trim()
                  }
                  className="bg-[#BADA55] hover:bg-[#A9C94D] text-[#00253E] font-bold px-10 h-14 rounded-[8px] text-[20px]"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-5 h-5 mr-2" />
                  )}
                  {t('add')}
                </Button>
              </div>
            </div>

            <div className="space-y-6 border-t border-[#E7E7E7] pt-8">
              <h4 className="text-[22px] font-semibold text-[#00253E]">
                {selectedCategory
                  ? `${t('measureType')} - ${selectedCategory.labels?.en || selectedCategory.name}`
                  : t('measureType')}
              </h4>

              {!selectedCategory ? (
                <div className="py-10 text-center text-gray-400 italic text-[20px]">
                  {t('selectCategoryFirst')}
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {(selectedCategory.measureTypes || []).map(
                      (measureType, index) => (
                        <div
                          key={`${selectedCategory.name}-${measureType.name}-${index}`}
                          className="flex items-center justify-between py-2 group"
                        >
                          {renderItemLabel(measureType)}
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                openEditModal(
                                  'measure',
                                  index,
                                  measureType,
                                  selectedCategoryIndex,
                                )
                              }
                              className="w-8 h-8 bg-[#F1FFC5] text-[#00253E] hover:bg-primary rounded-[4px]"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                openDeleteModal(
                                  'measure',
                                  index,
                                  selectedCategoryIndex,
                                )
                              }
                              className="w-8 h-8 bg-[#E7E7E7] text-[#00253E] hover:bg-red-100 rounded-[4px]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ),
                    )}
                    {!selectedCategory.measureTypes?.length && (
                      <div className="py-8 text-center text-gray-400 italic text-[20px]">
                        {t('noMeasureTypesInCategory')}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 pt-2">
                    <Input
                      placeholder={t('englishNamePlaceholder', {
                        type: t('measure').toLowerCase(),
                      })}
                      value={newMeasureEnglishValue}
                      onChange={e => setNewMeasureEnglishValue(e.target.value)}
                      className="h-14 border-[#E7E7E7] rounded-[8px] text-[20px] text-[#00253E] px-4 placeholder:text-gray-300"
                    />
                    <Input
                      placeholder={t('germanNamePlaceholder', {
                        type: t('measure').toLowerCase(),
                      })}
                      value={newMeasureGermanValue}
                      onChange={e => setNewMeasureGermanValue(e.target.value)}
                      className="h-14 border-[#E7E7E7] rounded-[8px] text-[20px] text-[#00253E] px-4 placeholder:text-gray-300"
                    />
                    <Button
                      onClick={handleAddMeasureType}
                      disabled={
                        isSubmitting ||
                        !newMeasureEnglishValue.trim() ||
                        !newMeasureGermanValue.trim()
                      }
                      className="bg-[#BADA55] hover:bg-[#A9C94D] text-[#00253E] font-bold px-10 h-14 rounded-[8px] text-[20px]"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <Plus className="w-5 h-5 mr-2" />
                      )}
                      {t('add')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[400px] border-none rounded-[16px] p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#00253E] text-center">
              {t('editItemTitle', {
                type:
                  editMode === 'role'
                    ? t('role')
                    : editMode === 'category'
                      ? t('category')
                      : t('measure'),
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              {t('englishNameLabel', {
                type:
                  editMode === 'role'
                    ? t('role')
                    : editMode === 'category'
                      ? t('category')
                      : t('measure'),
              })}
            </label>
            <Input
              value={editEnglishValue}
              onChange={e => setEditEnglishValue(e.target.value)}
              className="h-11 border-[#E7E7E7] rounded-[8px] text-[20px] text-[#00253E] mb-4"
            />
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              {t('germanNameLabel', {
                type:
                  editMode === 'role'
                    ? t('role')
                    : editMode === 'category'
                      ? t('category')
                      : t('measure'),
              })}
            </label>
            <Input
              value={editGermanValue}
              onChange={e => setEditGermanValue(e.target.value)}
              className="h-11 border-[#E7E7E7] rounded-[8px] text-[20px] text-[#00253E]"
            />
          </div>
          <DialogFooter className="flex flex-row gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="h-11 px-8 rounded-full border-gray-300 font-semibold flex-1"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleEdit}
              disabled={
                isSubmitting ||
                !editEnglishValue.trim() ||
                !editGermanValue.trim()
              }
              className="h-11 px-8 rounded-full bg-primary hover:bg-primary/90 text-[#00253E] font-bold flex-1"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                t('save')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-[400px] border-none rounded-[16px] p-8 bg-white overflow-hidden">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <Trash2 className="w-10 h-10 text-red-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-[24px] font-bold text-[#00253E]">
                {t('deleteItemTitle')}
              </h2>
              <p className="text-gray-500 text-[16px]">
                {t('deleteItemSub', {
                  type:
                    deleteMode === 'role'
                      ? t('role').toLowerCase()
                      : deleteMode === 'category'
                        ? t('category').toLowerCase()
                        : t('measure').toLowerCase(),
                })}
              </p>
            </div>

            <div className="flex gap-4 w-full pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="h-12 rounded-full border-gray-200 font-semibold text-[#00253E] hover:bg-gray-50 flex-1"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="h-12 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex-1"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t('deleteNow')
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DropdownControl
