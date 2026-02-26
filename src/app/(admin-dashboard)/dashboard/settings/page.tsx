/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { ChevronRight, Settings as SettingsIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

import HelpTextControl from './_components/HelpTextControl'
import AiPromptControl from './_components/AiPromptControl'
import DropdownControl from './_components/DropdownControl'
import ResetPassword from './_components/ResetPassword'

import SystemSettingsSkeleton from './_components/SystemSettingsSkeleton'

import { SystemSettingsResponse, SystemSettings } from '@/types/settings'

const SettingsPage = () => {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken
  const queryClient = useQueryClient()

  // Fetch all system settings
  const { data, isLoading, isError, error } = useQuery<SystemSettingsResponse>({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/system-setting`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      if (!res.ok) {
        throw new Error('Failed to fetch system settings')
      }
      return res.json()
    },
    enabled: !!accessToken,
    placeholderData: keepPreviousData,
  })

  const settings = data?.data?.items?.[0] || null

  // If no settings exist, we might need a way to initialize them.
  // The user mentioned: "first time jhokon kono data thakbe nah, thkon create call hbe"
  const [isInitializing, setIsInitializing] = useState(false)

  const handleInitialize = async () => {
    try {
      setIsInitializing(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/system-setting`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            roleTypes: [{ name: 'Opinion Leader' }, { name: 'Supporter' }],
            helpTexts: [{ name: 'Relevance', values: { de: '', en: '' } }],
            categoryTypes: [{ name: 'Communication' }],
            measureTypes: [
              { name: 'Presentation', values: { de: '', en: '' } },
            ],
          }),
        },
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to initialize settings')
      }

      toast.success('Settings initialized successfully!')
      queryClient.invalidateQueries({ queryKey: ['system-settings'] })
    } catch (err: any) {
      toast.error(err.message || 'Initialization failed')
    } finally {
      setIsInitializing(false)
    }
  }

  if (isLoading) {
    return <SystemSettingsSkeleton />
  }

  return (
    <div className="w-full max-w-full mx-auto pb-12">
      {/* Breadcrumb */}
      {/* Breadcrumb & Title */}
      <div className="mb-8">
        <h1
          style={{
            fontFamily: 'var(--font-nunito), sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '120%',
            color: '#00253E',
          }}
          className="mb-3"
        >
          System Settings
        </h1>
        <nav className="flex items-center gap-1 text-sm mb-6">
          <Link
            href="/dashboard"
            className="text-[#00253E] hover:text-primary transition-colors"
            style={{
              fontFamily: 'var(--font-nunito), sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '120%',
            }}
          >
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 text-[#00253E]" />
          <span
            className="text-[#00253E]"
            style={{
              fontFamily: 'var(--font-nunito), sans-serif',
              fontWeight: 500,
              fontSize: '18px',
              lineHeight: '120%',
            }}
          >
            System Settings
          </span>
        </nav>
      </div>

      {!settings && !isLoading ? (
        <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center min-h-[300px] gap-6 text-center">
          <SettingsIcon className="w-16 h-16 text-gray-200" />
          <div>
            <h2 className="text-xl font-semibold text-[#00253E]">
              No Settings Found
            </h2>
            <p className="text-gray-400 mt-1 max-w-sm">
              It seems you haven&apos;t initialized your system settings yet.
              Click the button below to get started.
            </p>
          </div>
          <Button
            onClick={handleInitialize}
            disabled={isInitializing}
            className="bg-primary hover:bg-primary/90 text-[#00253E] font-bold"
          >
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              'Initialize Settings'
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4 border-none"
          >
            {/* Help Text Control */}
            <AccordionItem
              value="help-text"
              className="border-none bg-gradient-to-b from-[#F1FFC5] via-[#F6FFDA] to-white rounded-[8px] px-4 border-b border-[#8ADA55]"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-[22px] font-medium leading-[120%] text-[#00253E]">
                  Help text control
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6">
                <HelpTextControl
                  settings={settings}
                  onUpdate={() =>
                    queryClient.invalidateQueries({
                      queryKey: ['system-settings'],
                    })
                  }
                />
              </AccordionContent>
            </AccordionItem>

            {/* AI Prompt Control */}
            <AccordionItem
              value="ai-prompt"
              className="border-none bg-gradient-to-b from-[#F1FFC5] via-[#F6FFDA] to-white rounded-[8px] px-4 border-b border-[#8ADA55]"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-[22px] font-medium leading-[120%] text-[#00253E]">
                  AI Prompt Control
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6">
                <AiPromptControl
                  settings={settings}
                  onUpdate={() =>
                    queryClient.invalidateQueries({
                      queryKey: ['system-settings'],
                    })
                  }
                />
              </AccordionContent>
            </AccordionItem>

            {/* Dropdown Control */}
            <AccordionItem
              value="dropdown-control"
              className="border-none bg-gradient-to-b from-[#F1FFC5] via-[#F6FFDA] to-white rounded-[8px] px-4 border-b border-[#8ADA55]"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-[22px] font-medium leading-[120%] text-[#00253E]">
                  Dropdown Control
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6">
                <DropdownControl
                  settings={settings}
                  onUpdate={() =>
                    queryClient.invalidateQueries({
                      queryKey: ['system-settings'],
                    })
                  }
                />
              </AccordionContent>
            </AccordionItem>

            {/* Reset Password */}
            <AccordionItem
              value="reset-password"
              className="border-none bg-gradient-to-b from-[#F1FFC5] via-[#F6FFDA] to-white rounded-[8px] px-4 border-b border-[#8ADA55]"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-[22px] font-medium leading-[120%] text-[#00253E]">
                  Reset Password
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6">
                <ResetPassword />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  )
}

export default SettingsPage
