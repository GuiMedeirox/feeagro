'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Skeleton } from '@/components/ui/skeleton'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen bg-brand-900">
        <div className="w-60 bg-brand-900 border-r border-brand-700 p-4 flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <div className="flex flex-col gap-2 mt-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <Skeleton className="h-14 w-full rounded-none" />
          <div className="flex-1 p-6 flex flex-col gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex">
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <MobileNav />
    </div>
  )
}
