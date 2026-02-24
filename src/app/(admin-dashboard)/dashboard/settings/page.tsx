'use client'
import React from 'react'
import { Settings } from 'lucide-react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const SettingsPage = () => {
  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-1">
        <Link
          href="/dashboard"
          className="hover:text-primary transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#00253E] font-medium">System Setting</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#00253E] mb-6">System Setting</h1>

      <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center min-h-[300px] gap-4">
        <Settings className="w-16 h-16 text-gray-300" />
        <p className="text-gray-400 text-base font-medium">
          System settings coming soon
        </p>
      </div>
    </div>
  )
}

export default SettingsPage
