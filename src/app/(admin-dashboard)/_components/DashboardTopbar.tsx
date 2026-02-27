'use client'

import Image from 'next/image'
import LanguageSwitcher from '@/components/ui/language-switcher'


const DashboardTopbar = () => {
  return (
    <header className="relative h-[80px] bg-[#00253E] flex items-center justify-between px-6 py-4 md:px-8 w-full flex-shrink-0 z-20">
      {/* Left section: logo */}
      <div className="flex items-center">
        <Image
          src="/images/left_logo.png"
          alt="logo"
          width={70}
          height={80}
          className="w-[50px] h-[50px] object-contain"
        />
      </div>

      {/* Right section: brand logo + avatar */}
      <div className="flex items-center gap-6">
        <LanguageSwitcher />
        <Image
          src="/images/right_logo.png"
          alt="brand logo"
          width={160}
          height={79}
          className="w-[140px] h-[68px] object-contain"
        />
      </div>
    </header>
  )
}


export default DashboardTopbar
