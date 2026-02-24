import React from 'react'
import DashboardHeader from '../(participants)/_components/dashboard-header'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
        <DashboardHeader />
        {children}
    </div>
  )
}

export default AuthLayout