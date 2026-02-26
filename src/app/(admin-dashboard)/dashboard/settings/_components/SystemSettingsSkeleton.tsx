'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const SystemSettingsSkeleton = () => {
    return (
        <div className="w-full max-w-full mx-auto pb-12">
            {/* Breadcrumb & Title Skeleton */}
            <div className="mb-8">
                <Skeleton className="h-8 w-48 mb-3" />
                <div className="flex items-center gap-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </div>

            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gradient-to-b from-[#F1FFC5]/50 via-[#F6FFDA]/50 to-white/50 rounded-[8px] px-4 border-b border-[#8ADA55]/30">
                        <div className="flex items-center justify-between py-6">
                            <Skeleton className="h-7 w-64" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SystemSettingsSkeleton
