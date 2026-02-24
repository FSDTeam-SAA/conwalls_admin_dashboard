// "use client"
// import { useSession } from "next-auth/react";
import Image from 'next/image'
import React from 'react'

import Link from 'next/link'

const DashboardHeader = () => {
  // const session = useSession();
  // console.log(session)
  // const user = (session?.data?.user as {firstName:string})?.firstName
  // console.log(user)

  return (
    <div className="bg-[#00253E] h-[106px] w-full flex items-center sticky top-0  z-50">
      <div className="w-full flex items-center justify-between px-6 md:px-8 lg:px-12">
        <Link href="/">
          <Image
            src={'/images/left_logo.png'}
            alt="dashboard header"
            width={300}
            height={346}
            className="w-[80px] h-[80px] object-contain"
          />
        </Link>
        <Link href="/">
          <Image
            src={'/images/right_logo.png'}
            alt="dashboard header"
            width={300}
            height={346}
            className="w-[160px] h-[79px] object-contain"
          />
        </Link>
      </div>
    </div>
  )
}

export default DashboardHeader
