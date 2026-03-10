'use client'

import { useTranslations } from 'next-intl'
import { Users, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import LogoutModal from '@/components/shared/LogoutModal/LogoutModal'
import { Link, usePathname } from '@/i18n/routing'

const DashboardSidebar = () => {
  const t = useTranslations('common')
  const pathname = usePathname()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const navItems = [
    {
      label: t('trainerManagement'),
      href: '/dashboard/trainers',
      icon: Users,
    },
    {
      label: t('systemSettings'),
      href: '/dashboard/settings',
      icon: Settings,
    },
  ]

  return (
    <aside className="w-[312px] h-full bg-primary flex flex-col">
      {/* Nav Items */}
      <nav className="flex flex-col gap-3 px-3 pt-8 flex-1">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-[8px] text-[17px] font-semibold transition-all duration-200',
                isActive
                  ? 'bg-[#00253E] text-white shadow-lg text-[18px]'
                  : 'text-[#00253E] hover:bg-[#00253E]/10',
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6 flex-shrink-0',
                  isActive ? 'text-white' : 'text-[#00253E]',
                )}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Log Out */}
      <div className="px-3 pb-8">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-[8px] text-[17px] font-semibold text-[#FF4D4D] hover:bg-black/5 transition-all duration-200 w-full"
        >
          <LogOut className="w-6 h-6 flex-shrink-0" />
          {t('logout')}
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
