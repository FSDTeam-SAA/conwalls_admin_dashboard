'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Settings, LogOut } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import LogoutModal from '@/components/shared/LogoutModal/LogoutModal'

const navItems = [
    {
        label: 'Trainer Management',
        href: '/dashboard/trainers',
        icon: Users,
    },
    {
        label: 'System Setting',
        href: '/dashboard/settings',
        icon: Settings,
    },
]

const DashboardSidebar = () => {
    const pathname = usePathname()
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    return (
        <aside className="w-[240px] min-h-screen bg-primary flex flex-col border-r border-black/5">
            {/* Top section matching header color/height */}
            <div className="h-[106px] flex items-center justify-center px-4 bg-[#00253E]">
                <Image
                    src="/images/left_logo.png"
                    alt="logo"
                    width={80}
                    height={80}
                    className="w-[70px] h-[70px] object-contain"
                />
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-2 px-3 pt-8 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-[8px] text-sm font-semibold transition-all duration-200',
                                isActive
                                    ? 'bg-[#00253E] text-white shadow-lg'
                                    : 'text-[#00253E] hover:bg-[#00253E]/10'
                            )}
                        >
                            <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-[#00253E]")} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Log Out */}
            <div className="px-3 pb-8">
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="flex items-center gap-3 px-4 py-3 rounded-[8px] text-sm font-semibold text-[#FF4D4D] hover:bg-black/5 transition-all duration-200 w-full"
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    Log out
                </button>
            </div>

            <LogoutModal
                open={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
            />
        </aside>
    )
}

export default DashboardSidebar
