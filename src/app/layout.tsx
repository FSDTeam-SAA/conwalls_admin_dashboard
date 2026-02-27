import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import AuthProvider from '@/components/providers/AuthProvider'
import AppProvider from '@/components/providers/AppProvider'
import LangConfig from '@/components/shared/lang-config'

import { Nunito_Sans } from 'next/font/google'

const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-nunito',
})


export const metadata: Metadata = {
  title: 'Conwalls Admin Dashboard',
  description: 'Conwalls -Admin Dashboard. manage trainer and system settings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className={`font-nunito antialiased`}>
        <AuthProvider>
          <AppProvider>
            <LangConfig />
            {/* <DashboardHeader/> */}

            {children}

            <Toaster />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
