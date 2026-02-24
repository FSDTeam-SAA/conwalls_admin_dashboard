import Link from 'next/link'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-primary" />
                    </div>
                </div>
                <h1 className="text-7xl font-black text-[#00253E] mb-2">404</h1>
                <h2 className="text-2xl font-bold text-[#00253E] mb-3">Page Not Found</h2>
                <p className="text-gray-500 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 bg-primary text-[#00253E] font-semibold px-6 py-3 rounded-[8px] hover:bg-primary/90 transition-colors"
                >
                    <Home className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    )
}
