'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { DashboardSidebar, expertNavItems } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function ExpertDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600/75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center gap-2">
              <Logo />
              <Badge variant="secondary" className="text-xs">Expert</Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto p-4">
            <DashboardSidebar items={expertNavItems} />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex h-full flex-col border-r border-gray-200 bg-white">
          {/* Sidebar header */}
          <div className="flex h-16 items-center gap-2 px-6 border-b">
            <Logo />
            <Badge variant="secondary" className="text-xs">Expert</Badge>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto p-4">
            <DashboardSidebar items={expertNavItems} />
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <Link
              href="/"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Public Site
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
