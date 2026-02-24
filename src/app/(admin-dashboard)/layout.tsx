import React from 'react'
import DashboardSidebar from './_components/DashboardSidebar'
import DashboardTopbar from './_components/DashboardTopbar'

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top Header */}
                <DashboardTopbar />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AdminDashboardLayout
