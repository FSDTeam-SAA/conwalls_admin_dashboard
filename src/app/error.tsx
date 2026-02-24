'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, Home, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                        <TriangleAlert className="w-10 h-10 text-red-500" />
                    </div>
                </div>
                <h1 className="text-3xl font-black text-[#00253E] mb-2">Something went wrong</h1>
                <p className="text-gray-500 mb-8">
                    {error?.message || 'An unexpected error occurred. Please try again.'}
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Button
                        onClick={reset}
                        variant="outline"
                        className="flex items-center gap-2 h-[44px] px-5 rounded-[8px] font-semibold border-gray-300"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                    <Link href="/dashboard">
                        <Button className="flex items-center gap-2 h-[44px] px-5 bg-primary text-[#00253E] font-semibold rounded-[8px] hover:bg-primary/90">
                            <Home className="w-4 h-4" />
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
