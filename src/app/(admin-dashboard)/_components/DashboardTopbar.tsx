'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { User } from 'lucide-react'

const DashboardTopbar = () => {
  const { data: session } = useSession()
  const user = session?.user as
    | { firstName?: string; lastName?: string; profileImage?: string }
    | undefined

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
        <Image
          src="/images/right_logo.png"
          alt="brand logo"
          width={160}
          height={79}
          className="w-[140px] h-[68px] object-contain"
        />
        {/* Right-side User Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-white overflow-hidden">
          {user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt="avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardTopbar
